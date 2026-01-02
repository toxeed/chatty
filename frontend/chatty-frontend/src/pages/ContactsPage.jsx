import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  CircularProgress,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import ContactsIcon from '@mui/icons-material/Contacts'
import PersonIcon from '@mui/icons-material/Person'
import { API_BASE_URL } from '../config'
import { supabase } from '../supabase'

function ContactsPage() {
  const { userId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const user = location.state?.user

  useEffect(() => {
    fetchContacts()
  }, [userId])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/contacts/user/${userId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }
      const data = await response.json()
      setContacts(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get the other person's details (not the current user)
  const getContactPerson = (contact) => {
      return {
        id: contact.target,
        name: contact.targetDisplayName || contact.targetUsername || 'Unknown User',
        username: contact.targetUsername,
        displayName: contact.targetDisplayName,
        photo: contact.targetPhotoUri,
        photoUri: contact.targetPhotoUri,
        email: contact.targetEmail,
        status: contact.status
      }
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  const handleContactClick = (person) => {
    // Check if the contact is pending
    if (person.status === 'Pending') {
      setSnackbarMessage('This person has not yet accepted your invite.')
      setSnackbarOpen(true)
      return
    }

    // Navigate to chat with the other person
    navigate(`/chat/${person.id}`, {
      state: {
        currentUser: user,
        otherUser: {
          id: person.id,
          username: person.username,
          displayName: person.displayName,
          photoUri: person.photoUri,
          email: person.email
        }
      }
    })
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/')
    } catch (err) {
      console.error('Logout error:', err)
      // Navigate anyway even if signOut fails
      navigate('/')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'white' }}>
            Contacts
          </Typography>
          <Tooltip title="Logout">
            <IconButton
              onClick={handleLogout}
              sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar src={user.photoUri} sx={{ width: 32, height: 32 }}>
              {!user.photoUri && <PersonIcon fontSize="small" />}
            </Avatar>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {user.displayName || user.username}'s Contacts
            </Typography>
          </Box>
        )}

        <Paper
          elevation={3}
          sx={{
            width: '100%',
            mt: 2,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
            border: '2px solid #667eea'
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
          ) : contacts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <ContactsIcon sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
              <Typography color="text.secondary">No contacts found</Typography>
            </Box>
          ) : (
            <List>
              {contacts.map((contact, index) => {
                const person = getContactPerson(contact)
                return (
                  <ListItem
                    key={`${contact.initiator}-${contact.target}`}
                    divider={index < contacts.length - 1}
                    onClick={() => handleContactClick(person)}
                    sx={{
                      py: 2,
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: 'rgba(103, 126, 234, 0.08)' }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={person.photo} sx={{ bgcolor: '#764ba2' }}>
                        {!person.photo && <PersonIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontWeight="medium" color="#764ba2">
                            {person.name}
                          </Typography>
                          {person.status === 'Pending' && (
                            <Chip
                              label="Pending"
                              size="small"
                              color="warning"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          {person.username && (
                            <Typography variant="body2" color="text.secondary">
                              @{person.username}
                            </Typography>
                          )}
                          {person.email && (
                            <Typography variant="body2" color="text.secondary">
                              {person.email}
                            </Typography>
                          )}
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Added: {formatDate(contact.createdAt)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                )
              })}
            </List>
          )}
        </Paper>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 3 }}>
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''} • Click to chat
        </Typography>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ContactsPage

