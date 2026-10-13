export default function Badge({
  children,
  variant = 'soft',
  className = '',
}) {
  const variants = {
    soft: 'bg-teal-50 text-teal-700',
    outline: 'border border-gray-200 text-gray-600',
    red: 'bg-red-50 text-red-700 border border-red-200',
    orange: 'bg-orange-50 text-orange-700 border border-orange-200',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}