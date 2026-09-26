import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layers, Clock, ShieldCheck, ArrowRight } from 'lucide-react'
import axios from 'axios'

const PRESETS = [5, 10, 15, 20, 30, 45, 60]

const AVAILABLE_INTERESTS = [
  { name: 'Technology', desc: 'Gadgets, AI, and innovation' },
  { name: 'Science', desc: 'Research, space, and discoveries' },
  { name: 'News', desc: 'Current events and world news' },
  { name: 'Gaming', desc: 'Video games and esports' },
  { name: 'Movies', desc: 'Film and cinema' },
  { name: 'Music', desc: 'Artists, albums and concerts' },
  { name: 'Books', desc: 'Literature and reading' },
  { name: 'Health', desc: 'Wellness and fitness' },
  { name: 'Finance', desc: 'Money and investing' },
  { name: 'Sports', desc: 'Games and matches' }
]

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [panel, setPanel] = useState('setup')
  const [dailyLimit, setDailyLimit] = useState(30)
  const [custom, setCustom] = useState('')
  const [interests, setInterests] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try { setUser(JSON.parse(userData)) } catch {}
    }

    const saved = localStorage.getItem('preferences')
    if (saved) {
      try {
        const p = JSON.parse(saved)
        if (p.dailyLimit) setDailyLimit(p.dailyLimit)
        if (Array.isArray(p.interests)) setInterests(p.interests)
      } catch {}
    }
  }, [])

  const toggleInterest = (name) => {
    if (interests.includes(name)) {
      setInterests(interests.filter(i => i !== name))
    } else {
      setInterests([...interests, name])
    }
  }

  const handleSave = async () => {
    const finalLimit = custom
      ? Math.min(600, Math.max(5, Number(custom)))
      : dailyLimit

    localStorage.setItem(
      'preferences',
      JSON.stringify({ dailyLimit: finalLimit, interests })
    )

    const token = localStorage.getItem('token')
    if (token && interests.length > 0) {
      try {
        await axios.post(
          'http://localhost:5000/api/interests',
          { interests },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (err) {
        console.error('Interest save error:', err.message)
      }
    }

    navigate('/feed')
  }

  const filteredInterests = AVAILABLE_INTERESTS.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid items-start gap-16 lg:grid-cols-2">

          <div>
            <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-teal-700">
              Aggregation · Personalization · Screen time
            </span>

            <h1 className="mt-5 font-serif text-5xl leading-tight font-bold text-gray-900 sm:text-6xl">
              {user ? (
                <>Welcome back, <span className="text-teal-600">{user.username}</span></>
              ) : (
                <>Welcome to <span className="text-teal-600">SocialFeed</span></>
              )}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg">
              Build your personalized feed from Reddit, YouTube and news — and
              control exactly how much time you spend reading it each day.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {!user ? (
                <>
                  <button
                    onClick={() => setPanel('time')}
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 whitespace-nowrap"
                  >
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link to="/login" className="btn-outline px-6 py-3 text-base">
                    Login
                  </Link>
                  <button
                    onClick={() => navigate('/feed')}
                    className="btn-ghost px-4 py-3 text-sm"
                  >
                    Continue as guest
                  </button>
                </>
              ) : (
                <>
                  <Link to="/feed" className="btn-primary px-6 py-3 text-base">
                    Open your feed
                  </Link>
                  <Link to="/profile" className="btn-outline px-6 py-3 text-base">
                    Profile
                  </Link>
                </>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Feature
                icon={Layers}
                title="Multi-source"
                body="Reddit, YouTube and news in one place"
              />
              <Feature
                icon={Clock}
                title="Daily timer"
                body={`${dailyLimit} min limit`}
              />
              <Feature
                icon={ShieldCheck}
                title="Yours only"
                body="Preferences stay private to you"
              />
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <div className="surface-card p-6">

              {panel === 'setup' && (
                <>
                  <h2 className="font-serif text-xl font-bold text-gray-900">
                    Your setup right now
                  </h2>

                  <div className="mt-5 space-y-4 text-sm">
                    <Row label="Daily usage limit" value={`${dailyLimit} min`} />
                    <Row
                      label="Interests"
                      value={
                        interests.length
                          ? `${interests.length} topics`
                          : 'None yet'
                      }
                    />
                  </div>

                  {interests.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {interests.slice(0, 6).map(i => (
                        <span
                          key={i}
                          className="chip bg-teal-50 text-teal-700"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setPanel('time')}
                    className="mt-6 w-full rounded-lg bg-teal-50 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
                  >
                    {interests.length ? 'Adjust preferences' : 'Personalize now'}
                  </button>
                </>
              )}

              {panel === 'time' && (
                <>
                  <h2 className="font-serif text-xl font-bold text-gray-900">
                    How much time per day?
                  </h2>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {PRESETS.map(m => (
                      <button
                        key={m}
                        onClick={() => { setDailyLimit(m); setCustom('') }}
                        className={`rounded-xl border p-3.5 text-sm font-semibold transition-colors ${
                          dailyLimit === m && !custom
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-teal-300'
                        }`}
                      >
                        {m} min
                      </button>
                    ))}
                    <input
                      type="number"
                      placeholder="Custom (min)"
                      value={custom}
                      onChange={(e) => setCustom(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className="col-span-2 rounded-xl border border-gray-200 bg-white p-3.5 text-sm focus:border-teal-500"
                    />
                  </div>

                  <button
                    onClick={() => setPanel('interests')}
                    className="btn-primary mt-5 w-full py-3"
                  >
                    Continue
                  </button>
                </>
              )}

              {panel === 'interests' && (
                <>
                  <h2 className="font-serif text-xl font-bold text-gray-900">
                    Pick your interests
                  </h2>

                  <div className="mt-5 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search interests"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-teal-500"
                    />
                    <button
                      onClick={() => setInterests(AVAILABLE_INTERESTS.map(i => i.name))}
                      className="whitespace-nowrap text-xs font-semibold text-teal-700 hover:underline"
                    >
                      Select all
                    </button>
                    <button
                      onClick={() => setInterests([])}
                      className="whitespace-nowrap text-xs font-semibold text-gray-500 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-3">
                      {filteredInterests.map(item => {
                        const active = interests.includes(item.name)
                        return (
                          <button
                            key={item.name}
                            onClick={() => toggleInterest(item.name)}
                            className={`rounded-xl border p-3 text-left transition ${
                              active
                                ? 'border-teal-500 bg-teal-50'
                                : 'border-gray-200 bg-white hover:border-teal-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`grid h-4 w-4 place-items-center rounded text-[10px] ${
                                  active
                                    ? 'bg-teal-600 text-white'
                                    : 'border border-gray-300 bg-white'
                                }`}
                              >
                                {active && '✓'}
                              </span>
                              <span className="text-sm font-semibold text-gray-900">
                                {item.name}
                              </span>
                            </div>
                            <p className="ml-6 text-xs leading-snug text-gray-500">
                              {item.desc}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={interests.length === 0}
                    className="btn-primary mt-5 w-full py-3 disabled:opacity-40"
                  >
                    Save and open feed
                  </button>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function Feature({ icon: Icon, title, body }) {
  return (
    <div className="surface-card p-5">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-600">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-3 font-serif text-base font-bold text-gray-900">
        {title}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-gray-500">{body}</p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  )
}