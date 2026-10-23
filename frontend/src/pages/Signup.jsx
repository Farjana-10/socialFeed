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

export default function Signup() {
  const navigate = useNavigate()
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
    if (e.target.name === 'password') {
      setStrength(getPasswordStrength(e.target.value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

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

    try {
      await api.post('/auth/signup', {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password
      })
      alert('Account created! Please check your email to verify.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-bold text-center text-teal-600 mb-6">
          Create Account
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose username"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div>
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create strong password"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {form.password && (
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

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm shadow-sm transition-colors focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition mt-2"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}