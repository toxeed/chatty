import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material'
import { Email as EmailIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { supabase } from '../supabase'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      })

      if (resetError) {
        throw new Error(resetError.message)
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
          Chatty
        </Typography>
        <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
          Reset your password
        </Typography>

        <Paper elevation={3} sx={{ width: '100%', p: 4, borderRadius: 2 }}>
          {success ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Password reset email sent! Check your inbox for the reset link.
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                If you don't see the email, check your spam folder.
              </Typography>
              <Link
                to="/"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ArrowBackIcon fontSize="small" />
                Back to Login
              </Link>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleResetPassword} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {error}
                </Alert>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>

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

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || !email}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)'
                  }
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Link
                  to="/"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ArrowBackIcon fontSize="small" />
                  Back to Login
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  )
}

export default ForgotPasswordPage

