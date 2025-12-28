import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Avatar,
  TextField,
  InputAdornment
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import PersonIcon from '@mui/icons-material/Person'
import { API_BASE_URL } from '../config'

function ChatPage() {
  const { oderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const pollingIdRef = useRef(0) // Unique ID for each polling session
  const abortControllerRef = useRef(null)

  const currentUser = location.state?.currentUser
  const otherUser = location.state?.otherUser

  useEffect(() => {
    if (currentUser && otherUser) {
      fetchMessages()
    }

    // Cleanup: stop polling when component unmounts or deps change
    return () => {
      // Increment polling ID to invalidate any running poll loops
      pollingIdRef.current += 1
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [currentUser, otherUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${API_BASE_URL}/messages/conversation?user1=${currentUser.id}&user2=${otherUser.id}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      const data = await response.json()
      // Sort by createdAt (epoch milliseconds - simple number comparison)
      const sorted = data.sort((a, b) => a.createdAt - b.createdAt)
      setMessages(sorted)
      setError(null)

      // Start long polling after initial fetch
      startPolling(sorted)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const startPolling = (initialMessages) => {
    // Increment polling ID to cancel any previous polling loops
    pollingIdRef.current += 1
    const currentPollingId = pollingIdRef.current

    // Get the epoch timestamp of the last message, or use current time if no messages
    const getLastMessageTime = (msgs) => {
      if (msgs && msgs.length > 0 && msgs[msgs.length - 1].createdAt) {
        return msgs[msgs.length - 1].createdAt  // Already epoch milliseconds
      }
      return Date.now()  // Current time as epoch
    }

    const poll = async (lastTime) => {
      // Stop if this polling session has been superseded
      if (currentPollingId !== pollingIdRef.current) {
        console.log('Polling session cancelled')
        return
      }

      // Safety check - ensure lastTime is valid
      const safeLastTime = lastTime || Date.now()

      try {
        // Create abort controller for this request
        abortControllerRef.current = new AbortController()

        const response = await fetch(
          `${API_BASE_URL}/messages/poll?user1=${currentUser.id}&user2=${otherUser.id}&since=${safeLastTime}`,
          { signal: abortControllerRef.current.signal }
        )

        if (!response.ok) {
          throw new Error('Polling failed')
        }

        const newMessages = await response.json()

        // Check again if we should continue (polling might have been cancelled during request)
        if (currentPollingId !== pollingIdRef.current) return

        if (newMessages.length > 0) {
          setMessages(prev => {
            // Avoid duplicates by checking IDs
            const existingIds = new Set(prev.map(m => m.id))
            const uniqueNew = newMessages.filter(m => !existingIds.has(m.id))
            return [...prev, ...uniqueNew]
          })
          // Continue polling from the latest message time
          poll(getLastMessageTime(newMessages))
        } else {
          // No new messages, continue polling from same time
          poll(lastTime)
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          // Request was aborted (component unmounting), don't restart
          return
        }
        // Check if polling was cancelled
        if (currentPollingId !== pollingIdRef.current) return

        console.error('Polling error:', err)
        // Wait a bit before retrying on error
        setTimeout(() => {
          if (currentPollingId === pollingIdRef.current) {
            poll(lastTime)
          }
        }, 3000)
      }
    }

    // Start the polling loop
    poll(getLastMessageTime(initialMessages))
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      const response = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: currentUser.id,
          receiver: otherUser.id,
          text: newMessage.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const sentMessage = await response.json()
      setMessages(prev => [...prev, sentMessage])
      setNewMessage('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Format epoch timestamp to user's local time
  const formatTime = (epochMs) => {
    if (!epochMs) return ''
    const date = new Date(epochMs)  // Works with epoch milliseconds
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  // Format epoch timestamp to user's local date
  const formatDate = (epochMs) => {
    if (!epochMs) return ''
    const date = new Date(epochMs)  // Works with epoch milliseconds
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {}
    messages.forEach(msg => {
      const date = formatDate(msg.createdAt)
      if (!groups[date]) groups[date] = []
      groups[date].push(msg)
    })
    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  if (!currentUser || !otherUser) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="white">Missing user information. Please go back and try again.</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ p: 0 }}>
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <IconButton onClick={() => navigate(-1)} sx={{ color: 'white' }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar src={otherUser.photoUri} sx={{ width: 40, height: 40 }}>
            {!otherUser.photoUri && <PersonIcon />}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
              {otherUser.displayName || otherUser.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              @{otherUser.username}
            </Typography>
          </Box>
        </Paper>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            p: 2,
            background: '#e5ddd5',
            backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAElBMVEXd3d3c3Nzb29va2trZ2dnY2NhMicR7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAQklEQVQ4y2NgGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCkYBdQAAOjkHxRpNtlwAAAAASUVORK5CYII=")'
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress sx={{ color: '#667eea' }} />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
            </Box>
          ) : messages.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          ) : (
            Object.entries(messageGroups).map(([date, msgs]) => (
              <Box key={date}>
                {/* Date separator */}
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: 'rgba(0,0,0,0.1)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      color: 'text.secondary'
                    }}
                  >
                    {date}
                  </Typography>
                </Box>

                {/* Messages for this date */}
                {msgs.map((message) => {
                  const isSender = message.sender === currentUser.id
                  return (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: isSender ? 'flex-end' : 'flex-start',
                        mb: 1
                      }}
                    >
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          maxWidth: '75%',
                          borderRadius: 2,
                          bgcolor: isSender ? '#dcf8c6' : 'white',
                          borderTopRightRadius: isSender ? 0 : 2,
                          borderTopLeftRadius: isSender ? 2 : 0
                        }}
                      >
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                          {message.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ display: 'block', textAlign: 'right', color: 'text.secondary', mt: 0.5 }}
                        >
                          {formatTime(message.createdAt)}
                        </Typography>
                      </Paper>
                    </Box>
                  )
                })}
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 0,
            bgcolor: '#f0f0f0',
            display: 'flex',
            gap: 1,
            alignItems: 'center'
          }}
        >
          <TextField
            fullWidth
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'white'
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    sx={{ color: '#667eea' }}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Paper>
      </Box>
    </Container>
  )
}

export default ChatPage

