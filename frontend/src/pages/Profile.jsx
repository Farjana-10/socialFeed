import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Bookmark, Heart, User, Activity, Search } from 'lucide-react'
import api from '../api/axios'
import useAuth from '../hooks/useAuth'
import Card from '../components/ui/Card'
import Progress from '../components/ui/Progress'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

export default function Profile() {
  const { user } = useAuth({ redirect: true })
  const [interests, setInterests] = useState([])
  const [limit, setLimit] = useState(30)

  useEffect(() => {
    const saved = localStorage.getItem('preferences')
    if (saved) {
      try {
        const p = JSON.parse(saved)
        if (p.dailyLimit) setLimit(p.dailyLimit)
      } catch {}
    }

    const token = localStorage.getItem('token')
    if (!token) return

    const fetchInterests = async () => {
      try {
        const res = await api.get('/interests')
        setInterests(res.data.interests.filter((i) => i.selected).map((i) => i.name))
      } catch (err) {
        console.error(err.message)
      }
    }
    fetchInterests()
  }, [])

  if (!user) return null

  const used = 8
  const percent = Math.min((used / limit) * 100, 100)

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-6 py-10">
      <Card className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-teal-50 text-teal-600">
          <User className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            {user.fullName || user.username}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">@{user.username}</p>
        </div>
        <Link to="/">
          <Button variant="outline">Edit settings</Button>
        </Link>
      </Card>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Clock} label="Time today" value={`${used}m`} sub={`of ${limit} min`} />
        <StatCard icon={Activity} label="Items viewed" value="0" sub="all time" />
        <StatCard icon={Bookmark} label="Saved" value="0" sub="bookmarks" />
        <StatCard icon={Heart} label="Liked" value="0" sub="reactions" />
      </div>

      <Card className="p-6">
        <h2 className="font-serif text-lg font-bold text-gray-900">Today's usage</h2>
        <Progress value={percent} className="mt-4" />
        <p className="mt-3 text-sm text-gray-500">
          {used}m used · {limit - used}m remaining
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-serif text-lg font-bold text-gray-900">Interests</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {interests.length === 0 ? (
              <p className="text-sm text-gray-400">No interests selected</p>
            ) : (
              interests.map((i) => <Badge key={i}>{i}</Badge>)
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-serif text-lg font-bold text-gray-900">Preferences</h2>
          <div className="mt-3">
            <PrefRow label="Daily limit" value={`${limit} min`} />
            <PrefRow label="Theme" value="Light" />
            <PrefRow label="Notifications" value="On" />
            <PrefRow label="Activity events" value="On" last />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-gray-900">
            <Activity className="h-4 w-4" /> Recent activity
          </h2>
          <p className="mt-4 text-sm text-gray-400">Nothing yet.</p>
        </Card>
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-gray-900">
            <Search className="h-4 w-4" /> Recent searches
          </h2>
          <p className="mt-4 text-sm text-gray-400">No searches yet.</p>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {label}
        </span>
        <Icon className="h-4 w-4 text-teal-600" />
      </div>
      <p className="mt-2 font-serif text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </Card>
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