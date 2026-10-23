import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import api from '../api/axios'

const getPasswordStrength = (password) => {
  let score = 0
  if (!password) return score
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    if (mode === 'signup' && e.target.name === 'password') {
      setStrength(getPasswordStrength(e.target.value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        const res = await api.post('/auth/login', {
          username: form.email,
          password: form.password
        })
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        navigate('/feed')
      } else {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.')
          setLoading(false)
          return
        }
        if (strength < 4) {
          setError('Please create a stronger password.')
          setLoading(false)
          return
        }
        await api.post('/auth/signup', {
          fullName: form.fullName,
          username: form.username,
          email: form.email,
          password: form.password
        })
        alert('Account created! Please check your email to verify.')
        setMode('login')
        setForm({ ...form, password: '', confirmPassword: '' })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const getStrengthText = () => {
    if (strength === 0) return ''
    if (strength <= 2) return 'Weak'
    if (strength === 3) return 'Fair'
    if (strength === 4) return 'Good'
    return 'Strong'
  }

  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500'
    if (strength === 3) return 'bg-yellow-500'
    if (strength === 4) return 'bg-teal-500'
    return 'bg-green-500'
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white">
            <span className="font-serif text-base font-bold">S</span>
          </span>
          <span className="font-serif text-xl font-bold text-gray-900">SocialFeed</span>
        </Link>

        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500">
            {mode === 'login'
              ? 'Your interests and remaining time load automatically.'
              : 'Set up a personalized feed and your daily usage limit.'}
          </p>

          <div className="mt-5 flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError('') }}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${mode === 'signup' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
            >
              Sign up
            </button>
          </div>

          {error && (
            <div className="mb-4 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            {mode === 'signup' && (
              <>
                <Field label="Name" name="fullName" value={form.fullName} onChange={handleChange} />
                <Field label="Username" name="username" value={form.username} onChange={handleChange} />
              </>
            )}

            <Field
              label={mode === 'login' ? 'Email or Username' : 'Email'}
              name="email"
              type={mode === 'login' ? 'text' : 'email'}
              value={form.email}
              onChange={handleChange}
            />

            <div>
              <div className="relative">
                <Field
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {mode === 'signup' && form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-gray-100 mb-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 transition-colors duration-300 ${strength >= level ? getStrengthColor() : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium mb-2 ${strength <= 2 ? 'text-red-500' : strength === 3 ? 'text-yellow-600' : 'text-teal-600'}`}>
                    Strength: {getStrengthText()}
                  </p>

                  {strength < 4 && (
                    <div className="rounded-lg bg-red-50 p-2.5 text-[11px] text-red-600 border border-red-100">
                      <strong>Password must contain:</strong> At least 8 characters, uppercase (A-Z), lowercase (a-z), number (0-9), and a special symbol (!@#$%^&*).
                    </div>
                  )}
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <Field
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link to="#" className="text-gray-500 hover:text-teal-700">Forgot password?</Link>
            <Link to="/" className="text-gray-500 hover:text-teal-700">Continue as guest</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      />
    </div>
  )
}