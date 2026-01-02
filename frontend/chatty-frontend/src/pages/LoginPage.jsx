import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material'
import { supabase } from '../supabase'
import { API_BASE_URL } from '../config'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        throw new Error(authError.message)
      }

      // Get the user ID from Supabase auth
      const supabaseUserId = authData.user.id

      // Fetch user details from our backend using the Supabase user ID
      const response = await fetch(`${API_BASE_URL}/users/${supabaseUserId}`)
      
      if (!response.ok) {
        throw new Error('User not found in the system. Please contact support.')
      }

      const user = await response.json()

      // Navigate to contacts page with user data
      navigate(`/contacts/${user.id}`, { state: { user } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
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
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Sign in to continue
        </Typography>

        <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
              autoFocus
              disabled={loading}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="current-password"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link
                to="/forgot-password"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !email || !password}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
              sx={{
                mt: 1,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)'
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </Paper>

        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mt: 3, textAlign: 'center' }}>
          Welcome to Chatty - Your secure messaging platform
        </Typography>
      </Box>
    </Container>
  )
}

export default LoginPage

