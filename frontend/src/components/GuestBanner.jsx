import { Link } from 'react-router-dom'
import Button from './ui/Button'

export default function GuestBanner({
  message = "You're browsing as a guest — login to keep your feed and saved posts.",
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 rounded-xl border border-dashed border-teal-300 bg-teal-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-teal-900">{message}</p>
      <div className="flex gap-2">
        <Link to="/login">
          <Button size="md">Create account</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" size="md">
            Login
          </Button>
        </Link>
      </div>
    </div>
  )
}