import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const PLATFORM_ICONS = {
  youtube: '▶',
  reddit: '👽',
  news: '📰'
}

const PLATFORM_LABELS = {
  youtube: 'YouTube',
  reddit: 'Reddit',
  news: 'News'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [interests, setInterests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        navigate('/login')
      }
    }
  }, [navigate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const headers = { Authorization: `Bearer ${token}` }

        const [accRes, intRes] = await Promise.all([
          axios.get('http://localhost:5000/api/accounts', { headers }),
          axios.get('http://localhost:5000/api/interests', { headers })
        ])

        setAccounts(accRes.data.accounts)
        setInterests(intRes.data.interests)
      } catch (err) {
        console.error('Fetch error:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleConnect = async (platformId) => {
    const platformUsername = prompt(`Enter your ${PLATFORM_LABELS[platformId]} username`)
    if (!platformUsername) return

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:5000/api/accounts/connect',
        { platformId, platformUsername },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      window.location.reload()
    } catch (err) {
      alert(err.response?.data?.message || 'Connect failed')
    }
  }

  const handleDisconnect = async (platformId) => {
    if (!confirm(`Disconnect ${PLATFORM_LABELS[platformId]}?`)) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `http://localhost:5000/api/accounts/${platformId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      window.location.reload()
    } catch (err) {
      alert(err.response?.data?.message || 'Disconnect failed')
    }
  }

  const toggleInterest = (name) => {
    setInterests(prev =>
      prev.map(i => i.name === name ? { ...i, selected: !i.selected } : i)
    )
  }

  const saveInterests = async () => {
    try {
      const token = localStorage.getItem('token')
      const selected = interests.filter(i => i.selected).map(i => i.name)

      await axios.post(
        'http://localhost:5000/api/interests',
        { interests: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Interests saved')
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <Link to="/feed" className="text-xl font-bold text-indigo-600">
          SocialFeed
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link to="/feed" className="text-gray-600 hover:text-indigo-600">
            Feed
          </Link>
          <span className="text-indigo-600 font-semibold">Dashboard</span>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-5">

        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold mb-3">Connected Accounts</h2>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            <ul className="space-y-2">
              {accounts.map(acc => (
                <li
                  key={acc.platformId}
                  className="flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full grid place-items-center text-white font-bold bg-indigo-600">
                      {PLATFORM_ICONS[acc.platformId]}
                    </span>
                    <div>
                      <p className="font-semibold">{PLATFORM_LABELS[acc.platformId]}</p>
                      {acc.connected && (
                        <p className="text-xs text-gray-500">
                          @{acc.platformUsername}
                        </p>
                      )}
                    </div>
                  </div>

                  {acc.connected ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-green-600 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-600"></span>
                        Connected
                      </span>
                      <button
                        onClick={() => handleDisconnect(acc.platformId)}
                        className="text-sm px-4 py-1.5 border border-red-600 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition"
                      >
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleConnect(acc.platformId)}
                      className="text-sm px-4 py-1.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                    >
                      Connect
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-base font-semibold mb-3">Your Interests</h2>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {interests.map(i => (
                  <button
                    key={i.name}
                    onClick={() => toggleInterest(i.name)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                      i.selected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                    }`}
                  >
                    {i.name}
                  </button>
                ))}
              </div>

              <button
                onClick={saveInterests}
                className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
              >
                Save Interests
              </button>
            </>
          )}
        </section>

        <div className="text-center">
          <Link
            to="/feed"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Continue to Feed →
          </Link>
        </div>

      </main>

    </div>
  )
}