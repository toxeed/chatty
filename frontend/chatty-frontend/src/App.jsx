import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UsersPage from './pages/UsersPage'
import ContactsPage from './pages/ContactsPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersPage />} />
        <Route path="/contacts/:userId" element={<ContactsPage />} />
        <Route path="/chat/:oderId" element={<ChatPage />} />
      </Routes>
    </Router>
  )
}

export default App
