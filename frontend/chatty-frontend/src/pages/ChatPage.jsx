import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Avatar,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import PersonIcon from '@mui/icons-material/Person'
import { API_BASE_URL } from '../config'
import { useWebSocket } from '../hooks/useWebSocket'

function ChatPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)
  const wsConnectedRef = useRef(false)

  const currentUser = location.state?.currentUser
  const otherUser = location.state?.otherUser

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = useCallback((newMessages) => {
    if (!Array.isArray(newMessages)) {
      newMessages = [newMessages]
    }

    setMessages(prev => {
      let updated = [...prev]

      for (const newMsg of newMessages) {
        // Check if this is a confirmation for a pending message
        const pendingIndex = updated.findIndex(m =>
          m.pending &&
          m.sender === newMsg.sender &&
          m.receiver === newMsg.receiver &&
          m.text === newMsg.text
        )

        if (pendingIndex !== -1) {
          // Replace pending message with confirmed message from server
          updated[pendingIndex] = { ...newMsg, pending: false }
        } else if (!updated.some(m => m.id === newMsg.id)) {
          // New message from other user, add it
          updated.push(newMsg)
        }
      }

      return updated.sort((a, b) => {
        // Sort by createdAt, pending messages (with tempId) go to the end
        const aTime = a.createdAt || Date.now()
        const bTime = b.createdAt || Date.now()
        return aTime - bTime
      })
    })
  }, [])

  // Initialize WebSocket connection
  const {
    connect: wsConnect,
    disconnect: wsDisconnect,
    sendMessage: wsSendMessage,
    isConnected,
    connectionError
  } = useWebSocket({
    userId: currentUser?.id,
    onMessage: handleWebSocketMessage,
    onConnect: () => {
      console.log('Chat WebSocket connected')
      wsConnectedRef.current = true
    },
    onDisconnect: () => {
      console.log('Chat WebSocket disconnected')
      wsConnectedRef.current = false
    },
    onError: (err) => {
      console.error('Chat WebSocket error:', err)
    }
  })

  useEffect(() => {
    if (currentUser && otherUser) {
      fetchMessages()
      // Connect to WebSocket after fetching initial messages
      wsConnect()
    }

    // Cleanup: disconnect WebSocket when component unmounts
    return () => {
      console.log('ChatPage unmounting, disconnecting WebSocket')
      wsDisconnect()
    }
  }, [currentUser?.id, otherUser?.id])

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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Send message via WebSocket with optimistic update
  const sendMessage = () => {
    if (!newMessage.trim()) return

    const messageText = newMessage.trim()
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`

    // Optimistically add the message immediately
    const pendingMessage = {
      id: tempId,
      sender: currentUser.id,
      receiver: otherUser.id,
      text: messageText,
      createdAt: Date.now(),
      pending: true,
      failed: false
    }

    setMessages(prev => [...prev, pendingMessage])
    setNewMessage('')

    if (!isConnected) {
      // Mark message as failed if not connected
      setMessages(prev => prev.map(m =>
        m.id === tempId ? { ...m, pending: false, failed: true } : m
      ))
      return
    }

    const success = wsSendMessage(currentUser.id, otherUser.id, messageText)

    if (!success) {
      // Mark message as failed if send failed
      setMessages(prev => prev.map(m =>
        m.id === tempId ? { ...m, pending: false, failed: true } : m
      ))
    }

    // If successful, the message will be confirmed when we receive the echo from WebSocket
    // The handleWebSocketMessage callback will replace the pending message with the confirmed one
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
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold' }}>
              {otherUser.displayName || otherUser.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              @{otherUser.username}
            </Typography>
          </Box>
          {/* Connection status indicator */}
          <Chip
            size="small"
            label={isConnected ? 'Live' : 'Connecting...'}
            sx={{
              bgcolor: isConnected ? 'rgba(76, 175, 80, 0.8)' : 'rgba(255, 152, 0, 0.8)',
              color: 'white',
              fontSize: '0.7rem',
              height: 24
            }}
          />
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
          ) : error || connectionError ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">{error || connectionError}</Typography>
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
                  const isPending = message.pending
                  const isFailed = message.failed

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
                          bgcolor: isFailed
                            ? '#ffebee'
                            : isSender
                              ? '#dcf8c6'
                              : 'white',
                          borderTopRightRadius: isSender ? 0 : 2,
                          borderTopLeftRadius: isSender ? 2 : 0,
                          opacity: isPending ? 0.7 : 1
                        }}
                      >
                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                          {message.text}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <Typography
                            variant="caption"
                            sx={{ color: isFailed ? 'error.main' : 'text.secondary' }}
                          >
                            {isFailed
                              ? 'Failed to send'
                              : isPending
                                ? 'Sending...'
                                : formatTime(message.createdAt)}
                          </Typography>
                        </Box>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'white'
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      sx={{ color: '#667eea' }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
        </Paper>
      </Box>
    </Container>
  )
}

export default ChatPage

