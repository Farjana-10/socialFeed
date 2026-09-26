const AVAILABLE = [
  { name: 'Technology', desc: 'Gadgets, AI, innovation' },
  { name: 'Science', desc: 'Research, space, discoveries' },
  { name: 'News', desc: 'Current events, world news' },
  { name: 'Gaming', desc: 'Video games and esports' },
  { name: 'Movies', desc: 'Film and cinema' },
  { name: 'Music', desc: 'Artists, albums, concerts' },
  { name: 'Books', desc: 'Literature and reading' },
  { name: 'Health', desc: 'Wellness and fitness' },
  { name: 'Finance', desc: 'Money and investing' },
  { name: 'Sports', desc: 'Games and matches' },
  { name: 'Food', desc: 'Cooking and recipes' },
  { name: 'Travel', desc: 'Places and destinations' }
]

export default function InterestPicker({ selected, onChange, onSave }) {
  const [search, setSearch] = useState('')

  const toggle = (name) => {
    if (selected.includes(name)) {
      onChange(selected.filter(i => i !== name))
    } else {
      onChange([...selected, name])
    }
  }

  const selectAll = () => {
    onChange(AVAILABLE.map(i => i.name))
  }

  const clearAll = () => {
    onChange([])
  }

  const filtered = AVAILABLE.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-serif text-xl font-bold mb-5">
        Pick your interests
      </h3>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search interests"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none"
          />
        </div>
        <button
          onClick={selectAll}
          className="text-xs text-teal-700 font-semibold hover:underline"
        >
          Select all
        </button>
        <button
          onClick={clearAll}
          className="text-xs text-gray-500 font-semibold hover:underline"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto mb-5 pr-1">
        {filtered.map(item => {
          const isSelected = selected.includes(item.name)
          return (
            <button
              key={item.name}
              onClick={() => toggle(item.name)}
              className={`text-left p-3 rounded-lg border transition ${
                isSelected
                  ? 'bg-teal-50 border-teal-500'
                  : 'bg-white border-gray-200 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-4 h-4 rounded grid place-items-center text-xs ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : 'border border-gray-300'
                  }`}
                >
                  {isSelected && '✓'}
                </div>
                <span className="font-semibold text-sm">{item.name}</span>
              </div>
              <p className="text-xs text-gray-500 ml-6">{item.desc}</p>
            </button>
          )
        })}
      </div>

      <button
        onClick={onSave}
        disabled={selected.length === 0}
        className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold rounded-lg transition"
      >
        Save and open feed
      </button>
    </div>
  )
}