import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Feed() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-indigo-600">SocialFeed</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Hi, {user.fullName || user.username}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-2">Welcome to SocialFeed</h2>
          <p className="text-gray-500 text-sm">
            Your personalized feed will appear here.
          </p>
        </div>
      </main>

    </div>
  )
}