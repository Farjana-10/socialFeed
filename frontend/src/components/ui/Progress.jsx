export default function Progress({ value = 0, className = '' }) {
  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}
    >
      <div
        className="h-full rounded-full bg-teal-600 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}