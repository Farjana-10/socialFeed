import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Feed from './pages/Feed'
import Verify from './pages/Verify'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify/:token" element={<Verify />} />
      <Route path="/feed" element={<Feed />} />
    </Routes>
  )
}

export default App