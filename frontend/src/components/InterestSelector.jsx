import { useState } from 'react'

const AVAILABLE = [
  { name: 'Technology', desc: 'Gadgets, AI, and innovation' },
  { name: 'Science', desc: 'Research, space, and discoveries' },
  { name: 'News', desc: 'Current events and world news' },
  { name: 'Gaming', desc: 'Video games and esports' },
  { name: 'Movies', desc: 'Film and cinema' },
  { name: 'Sports', desc: 'Games and matches' },
  { name: 'Food', desc: 'Cooking and recipes' },
  { name: 'Travel', desc: 'Places and destinations' },
]

export default function InterestSelector({ selected, onChange }) {
  const [search, setSearch] = useState('')

  const toggle = (name) => {
    if (selected.includes(name)) onChange(selected.filter((i) => i !== name))
    else onChange([...selected, name])
  }

  const filtered = AVAILABLE.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="mt-5 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search interests"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-teal-500"
        />
        <button
          onClick={() => onChange(AVAILABLE.map((i) => i.name))}
          className="whitespace-nowrap text-xs font-semibold text-teal-700 hover:underline"
        >
          Select all
        </button>
        <button
          onClick={() => onChange([])}
          className="whitespace-nowrap text-xs font-semibold text-gray-500 hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="mt-4 grid max-h-[22rem] grid-cols-2 gap-2.5 overflow-y-auto pr-1">
        {filtered.map((item) => {
          const active = selected.includes(item.name)
          return (
            <button
              key={item.name}
              onClick={() => toggle(item.name)}
              className={`rounded-xl border p-3 text-left transition ${
                active
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 bg-white hover:border-teal-300'
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  className={`grid h-4 w-4 place-items-center rounded text-[10px] ${
                    active
                      ? 'bg-teal-600 text-white'
                      : 'border border-gray-300 bg-white'
                  }`}
                >
                  {active && '✓'}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {item.name}
                </span>
              </div>
              <p className="ml-6 text-xs leading-snug text-gray-500">
                {item.desc}
              </p>
            </button>
          )
        })}
      </div>
    </>
  )
}