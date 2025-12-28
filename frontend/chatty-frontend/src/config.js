// API Configuration
// In development: uses localhost
// In production: uses VITE_API_BASE_URL environment variable

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

