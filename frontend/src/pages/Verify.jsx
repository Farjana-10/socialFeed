import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

export default function Verify() {
  const { token } = useParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify/${token}`
        )
        setStatus('success')
        setMessage(res.data.message)
      } catch (err) {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Verification failed')
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">

        {status === 'loading' && (
          <>
            <h2 className="text-xl font-bold mb-2">Verifying...</h2>
            <p className="text-gray-500">Please wait</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-xl font-bold mb-2 text-green-600">
              Verified!
            </h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-5xl mb-3">❌</div>
            <h2 className="text-xl font-bold mb-2 text-red-600">
              Verification Failed
            </h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              to="/signup"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition"
            >
              Back to Signup
            </Link>
          </>
        )}

      </div>
    </div>
  )
}