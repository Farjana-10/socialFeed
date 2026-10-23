import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Verify() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`)
        setStatus('success')
        setMessage(res.data.message)

        if (res.data.token && res.data.user) {
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', JSON.stringify(res.data.user))
          
          setTimeout(() => {
            navigate('/feed')
          }, 2000)
        }
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed')
      }
    }

    verify()
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">

        {status === 'loading' && (
          <>
            <h2 className="font-serif text-xl font-bold mb-2">Verifying...</h2>
            <p className="text-gray-500">Please wait</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h2 className="font-serif text-2xl font-bold mb-2 text-green-600">
              Verified!
            </h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <p className="text-sm text-teal-600 font-semibold animate-pulse">
              Redirecting to your feed...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h2 className="font-serif text-2xl font-bold mb-2 text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2.5 rounded-lg transition"
            >
              Go to Login
            </Link>
          </>
        )}

      </div>
    </div>
  )
}