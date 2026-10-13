import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Layers, Clock, ShieldCheck, ArrowRight } from 'lucide-react'
import axios from 'axios'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import InterestSelector from '../components/InterestSelector'

const PRESETS = [5, 10, 15, 20, 30, 45, 60]

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [panel, setPanel] = useState('setup')
  const [dailyLimit, setDailyLimit] = useState(30)
  const [custom, setCustom] = useState('')
  const [interests, setInterests] = useState([])

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
        console.error(err.message)
      }
    }

    navigate('/feed')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        <div className="grid items-start gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Aggregation · Personalization · Screen time
            </p>

            <h1 className="mt-5 font-serif text-5xl font-bold leading-[1.05] text-gray-900 lg:text-[4rem]">
              {user ? <>Welcome back, {user.username}</> : <>Welcome to SocialFeed</>}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              Build your personalized feed from Reddit, YouTube and news — and
              control exactly how much time you spend reading it each day.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {!user ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => setPanel('time')}
                    className="whitespace-nowrap"
                  >
                    Get started <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <Link to="/login">
                    <Button variant="outline" size="lg">Login</Button>
                  </Link>
                  <button
                    onClick={() => navigate('/feed')}
                    className="px-3 py-3 text-sm font-medium text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-teal-700"
                  >
                    Continue as guest
                  </button>
                </>
              ) : (
                <>
                  <Link to="/feed">
                    <Button size="lg">Open your feed</Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" size="lg">Profile</Button>
                  </Link>
                </>
              )}
            </div>

            <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Feature icon={<Layers className="h-5 w-5" />} title="Multi-source" body="Reddit, YouTube and news in one place" />
              <Feature icon={<Clock className="h-5 w-5" />} title="Daily timer" body={`${dailyLimit} min limit`} />
              <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Yours only" body="Preferences stay private to you" />
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <Card className="p-6">
              {panel === 'setup' && (
                <>
                  <h2 className="font-serif text-xl font-bold text-gray-900">
                    Your setup right now
                  </h2>
                  <div className="mt-5 space-y-4 text-sm">
                    <Row label="Daily usage limit" value={`${dailyLimit} min`} />
                    <Row
                      label="Interests"
                      value={interests.length ? `${interests.length} topics` : 'None yet'}
                    />
                  </div>
                  {interests.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {interests.slice(0, 6).map((i) => (
                        <span
                          key={i}
                          className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700"
                        >
                          {i}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="soft"
                    size="lg"
                    onClick={() => setPanel('time')}
                    className="mt-6 w-full"
                  >
                    {interests.length ? 'Adjust preferences' : 'Personalize now'}
                  </Button>
                </>
              )}

              {panel === 'time' && (
                <>
                  <h2 className="font-serif text-xl font-bold text-gray-900">
                    How much time per day?
                  </h2>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {PRESETS.map((m) => (
                      <button
                        key={m}
                        onClick={() => { setDailyLimit(m); setCustom('') }}
                        className={`rounded-xl border p-3.5 text-sm font-semibold transition ${
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
                  <Button size="lg" onClick={() => setPanel('interests')} className="mt-5 w-full">
                    Continue
                  </Button>
                </>
              )}

              {panel === 'interests' && (
                <>
                  <h2 className="font-serif text-xl font-bold text-gray-900">
                    Pick your interests
                  </h2>
                  <InterestSelector selected={interests} onChange={setInterests} />
                  <Button
                    size="lg"
                    onClick={handleSave}
                    disabled={interests.length === 0}
                    className="mt-5 w-full"
                  >
                    Save and open feed
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, title, body }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-50 text-teal-600">
        {icon}
      </span>
      <h3 className="mt-3 font-serif text-base font-bold text-gray-900">{title}</h3>
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