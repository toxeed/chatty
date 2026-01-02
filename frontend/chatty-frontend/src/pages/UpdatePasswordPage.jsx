import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  LockReset as LockResetIcon
} from '@mui/icons-material'
import { supabase } from '../supabase'

function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user has a valid session (came from reset link)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsValidSession(true)
      }
      setCheckingSession(false)
    }
    checkSession()
  }, [])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        throw new Error(updateError.message)
      }

      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: 'white' }} />
        </Box>
      </Container>
    )
  }

  if (!isValidSession) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              Invalid or expired reset link. Please request a new password reset.
            </Alert>
            <Button variant="contained" fullWidth onClick={() => navigate('/forgot-password')}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              Request New Reset Link
            </Button>
          </Paper>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
          Chatty
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Set your new password
        </Typography>

        <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
          {success ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Password updated successfully! Redirecting to login...
              </Alert>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleUpdatePassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

              <TextField label="New Password" type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)} required fullWidth disabled={loading}
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" disabled={loading}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )}}
              />

              <TextField label="Confirm New Password" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} required fullWidth disabled={loading}
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" disabled={loading}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )}}
              />

              <Button type="submit" variant="contained" size="large" disabled={loading || !password || !confirmPassword}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockResetIcon />}
                sx={{ mt: 2, py: 1.5, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': { background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)' }}}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  )
}

export default UpdatePasswordPage

