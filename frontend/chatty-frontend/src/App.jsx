import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import UpdatePasswordPage from './pages/UpdatePasswordPage'
import ContactsPage from './pages/ContactsPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-password" element={<UpdatePasswordPage />} />
        <Route path="/contacts/:userId" element={<ContactsPage />} />
        <Route path="/chat/:oderId" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App
