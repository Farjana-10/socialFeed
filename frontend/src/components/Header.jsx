import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Timer, Moon } from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [timeLeft, setTimeLeft] = useState('27:33')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try { setUser(JSON.parse(userData)) } catch { setUser(null) }
    } else {
      setUser(null)
    }
  }, [location.pathname])

  useEffect(() => {
    let seconds = 27 * 60 + 33
    const interval = setInterval(() => {
      if (seconds <= 0) return
      seconds -= 1
      const m = String(Math.floor(seconds / 60)).padStart(2, '0')
      const s = String(seconds % 60).padStart(2, '0')
      setTimeLeft(`${m}:${s}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Feed', path: '/feed' },
    { label: 'Profile', path: '/profile' }
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-6">

        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
            <span className="font-serif text-sm font-bold">S</span>
          </span>
          <span className="font-serif text-lg font-bold text-gray-900">
            SocialFeed
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-0.5 lg:flex">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">

          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative hidden max-w-xs md:block"
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search topics, posts, videos"
              className="w-72 rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm placeholder-gray-400 focus:border-teal-500"
            />
          </form>

          <div className="flex items-center gap-1.5 rounded-full border border-teal-200 px-3 py-1.5 text-xs font-semibold text-teal-700">
            <Timer className="h-3.5 w-3.5" />
            <span className="font-mono">{timeLeft}</span>
          </div>

          <button
            className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Toggle theme"
          >
            <Moon className="h-4 w-4" />
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-gray-600 lg:inline">
                {user.fullName || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </header>
  )
}