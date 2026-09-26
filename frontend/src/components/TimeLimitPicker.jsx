import { useState } from 'react'

const PRESETS = [5, 10, 15, 20, 30, 45, 60]

export default function TimeLimitPicker({ value, onSelect, onContinue }) {
  const [custom, setCustom] = useState('')

  const handleCustom = () => {
    const n = parseInt(custom)
    if (n > 0 && n <= 480) {
      onSelect(n)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-serif text-xl font-bold mb-5">
        How much time per day?
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {PRESETS.map(m => (
          <button
            key={m}
            onClick={() => onSelect(m)}
            className={`py-3 rounded-lg font-semibold text-sm transition border ${
              value === m
                ? 'bg-teal-50 border-teal-500 text-teal-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-teal-300'
            }`}
          >
            {m} min
          </button>
        ))}
      </div>

      <div className="mb-5">
        <input
          type="number"
          placeholder="Custom (min)"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onBlur={handleCustom}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
        />
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition"
      >
        Continue
      </button>
    </div>
  )
}