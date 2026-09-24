import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Feed from './pages/Feed'
import Verify from './pages/Verify'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify/:token" element={<Verify />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App