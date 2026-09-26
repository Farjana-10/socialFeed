import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Clock, Bookmark, Heart, User, Activity, Search } from 'lucide-react'
import axios from 'axios'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [interests, setInterests] = useState([])
  const [limit, setLimit] = useState(30)
  const [stats, setStats] = useState({
    timeToday: 8,
    itemsViewed: 0,
    saved: 0,
    liked: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      navigate('/login')
      return
    }

    if (userData) {
      try { setUser(JSON.parse(userData)) } catch {}
    }

    const saved = localStorage.getItem('preferences')
    if (saved) {
      try {
        const p = JSON.parse(saved)
        if (p.dailyLimit) setLimit(p.dailyLimit)
      } catch {}
    }

    const fetchInterests = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/interests',
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setInterests(res.data.interests.filter(i => i.selected).map(i => i.name))
      } catch (err) {
        console.error(err.message)
      }
    }

    fetchInterests()
  }, [navigate])

  if (!user) return null

  const usedMin = stats.timeToday
  const percent = Math.min((usedMin / limit) * 100, 100)

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl space-y-5 px-6 py-10">

        {!user ? (
          <div className="flex flex-col gap-3 rounded-xl border border-dashed border-teal-300 bg-teal-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-teal-900">
              Login to keep your stats across devices.
            </p>
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-teal-300 bg-white px-4 py-2 text-sm font-semibold text-teal-700"
              >
                Login
              </Link>
            </div>
          </div>
        ) : null}

        <div className="surface-card flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-50 text-teal-600">
            <User className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              {user.fullName || user.username}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              @{user.username || user.fullName || 'guest'}
            </p>
          </div>
          <Link
            to="/"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Edit settings
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Clock}
            label="Time today"
            value={`${usedMin}m`}
            sub={`of ${limit} min`}
          />
          <StatCard
            icon={Activity}
            label="Items viewed"
            value={String(stats.itemsViewed)}
            sub="all time"
          />
          <StatCard
            icon={Bookmark}
            label="Saved"
            value={String(stats.saved)}
            sub="bookmarks"
          />
          <StatCard
            icon={Heart}
            label="Liked"
            value={String(stats.liked)}
            sub="reactions"
          />
        </div>

        <div className="surface-card p-6">
          <h2 className="font-serif text-lg font-bold text-gray-900">
            Today's usage
          </h2>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-teal-600 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-gray-500">
            {usedMin}m used · {limit - usedMin}m remaining
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="font-serif text-lg font-bold text-gray-900">
              Interests
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {interests.length === 0 && (
                <p className="text-sm text-gray-400">No interests selected</p>
              )}
              {interests.map(i => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-full bg-teal-50 px-3.5 py-1.5 text-xs font-semibold text-teal-700 whitespace-nowrap"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="font-serif text-lg font-bold text-gray-900">
              Preferences
            </h2>
            <div className="mt-3">
              <PrefRow label="Daily limit" value={`${limit} min`} />
              <PrefRow label="Theme" value="Light" />
              <PrefRow label="Notifications" value="On" />
              <PrefRow label="Activity events" value="On" last />
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-gray-900">
              <Activity className="h-4 w-4" /> Recent activity
            </h2>
            <p className="mt-4 text-sm text-gray-400">Nothing yet.</p>
          </div>

          <div className="surface-card p-6">
            <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-gray-900">
              <Search className="h-4 w-4" /> Recent searches
            </h2>
            <p className="mt-4 text-sm text-gray-400">No searches yet.</p>
          </div>
        </div>

      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <Icon className="h-4 w-4 text-teal-600" />
      </div>
      <p className="mt-2 font-serif text-2xl font-bold text-gray-900">
        {value}
      </p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

function PrefRow({ label, value, last }) {
  return (
    <div
      className={`flex items-center justify-between py-3.5 ${
        last ? '' : 'border-b border-gray-100'
      }`}
    >
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}