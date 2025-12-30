// API Configuration
// In development: uses localhost
// In production: uses VITE_API_BASE_URL environment variable

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// WebSocket Configuration
// Derive the WebSocket URL from the API base URL
const getWebSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  // Remove /api suffix if present
  const baseUrl = apiUrl.replace(/\/api$/, '')
  // Convert http(s) to ws(s)
  const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws'
  const wsUrl = baseUrl.replace(/^https?/, wsProtocol)
  return `${wsUrl}/ws`
}

export const WS_BASE_URL = getWebSocketUrl()

// SockJS URL (uses HTTP for WebSocket with SockJS fallback)
export const WS_SOCKJS_URL = (() => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  return apiUrl.replace(/\/api$/, '') + '/ws'
})()

