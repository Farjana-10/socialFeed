import { Link } from 'react-router-dom'

export default function GuestBanner() {
  return (
    <div className="bg-teal-50 border border-teal-100 rounded-xl px-5 py-4 flex items-center gap-4 mb-5">
      <p className="text-sm text-teal-800 flex-1">
        You're browsing as a guest — login to keep your feed and saved posts.
      </p>
      <Link
        to="/login"
        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg"
      >
        Create account
      </Link>
      <Link
        to="/login"
        className="px-4 py-2 border border-teal-200 text-teal-700 text-sm font-semibold rounded-lg"
      >
        Login
      </Link>
    </div>
  )
}