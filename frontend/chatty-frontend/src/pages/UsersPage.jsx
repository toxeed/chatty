import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Chip
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

const API_BASE_URL = 'http://localhost:8080/api'

function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/users`)
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'online':
        return 'success'
      case 'away':
        return 'warning'
      case 'offline':
        return 'default'
      default:
        return 'primary'
    }
  }

  const handleUserClick = (user) => {
    navigate(`/contacts/${user.id}`, { state: { user } })
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
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
          Chatty
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }} gutterBottom>
          Available Users
        </Typography>

        <Paper elevation={3} sx={{ width: '100%', mt: 2, borderRadius: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Make sure the backend is running on port 8080
              </Typography>
            </Box>
          ) : users.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No users found</Typography>
            </Box>
          ) : (
            <List>
              {users.map((user, index) => (
                <ListItem
                  key={user.id}
                  divider={index < users.length - 1}
                  sx={{
                    py: 2,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(103, 126, 234, 0.08)' }
                  }}
                  onClick={() => handleUserClick(user)}
                >
                  <ListItemAvatar>
                    <Avatar src={user.photoUri} alt={user.displayName || user.username}>
                      {!user.photoUri && <PersonIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body1"
                          fontWeight="medium"
                          sx={{
                            color: '#667eea',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {user.displayName || user.username}
                        </Typography>
                        <Chip
                          label={user.status || 'unknown'}
                          size="small"
                          color={getStatusColor(user.status)}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          @{user.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mt: 3 }}>
          {users.length} user{users.length !== 1 ? 's' : ''} available • Click a name to view contacts
        </Typography>
      </Box>
    </Container>
  )
}

export default UsersPage

