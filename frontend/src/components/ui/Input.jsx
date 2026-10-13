export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm placeholder-gray-400 focus:border-teal-500 ${className}`}
      {...props}
    />
  )
}