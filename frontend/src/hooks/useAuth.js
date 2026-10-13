import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useAuth({ redirect = false } = {}) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {}
    } else if (redirect) {
      navigate('/login')
    }
  }, [redirect, navigate])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
    navigate('/')
  }

  return { user, token, logout, isLoggedIn: !!token }
}