import { Loader2 } from 'lucide-react'

export function LoadingState({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

export function EmptyState({ title, body }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-sm">
      <h3 className="font-serif text-lg font-bold text-gray-900">{title}</h3>
      {body && <p className="mt-1.5 text-sm text-gray-500">{body}</p>}
    </div>
  )
}