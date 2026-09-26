import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'login') {
        const res = await axios.post(
          'http://localhost:5000/api/auth/login',
          { username: form.email, password: form.password }
        )
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        navigate('/feed')
      } else {
        await axios.post(
          'http://localhost:5000/api/auth/signup',
          {
            fullName: form.fullName,
            username: form.username,
            email: form.email,
            password: form.password
          }
        )
        alert('Account created! Please check your email to verify.')
        setMode('login')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">

        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white">
            <span className="font-serif text-base font-bold">S</span>
          </span>
          <span className="font-serif text-xl font-bold text-gray-900">
            SocialFeed
          </span>
        </Link>

        <div className="surface-card p-7">

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
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
                mode === 'login'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError('') }}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
                mode === 'signup'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              Sign up
            </button>
          </div>

          <button
            type="button"
            className="mt-4 w-full rounded-lg border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">or use email</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">

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

            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Create account'}
            </button>

          </form>

          <div className="mt-5 flex items-center justify-between text-sm">
            <Link to="#" className="text-gray-500 hover:text-teal-700">
              Forgot password?
            </Link>
            <Link to="/" className="text-gray-500 hover:text-teal-700">
              Continue as guest
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm focus:border-teal-500"
      />
    </div>
  )
}