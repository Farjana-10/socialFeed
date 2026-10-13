const SOURCES = [
  { id: 'All', label: 'All' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'news', label: 'News' },
]

export default function FilterBar({
  topics,
  activeTopic,
  onTopicChange,
  activeSource,
  onSourceChange,
  sort,
  onSortChange,
}) {
  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicChange(topic)}
            className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              activeTopic === topic
                ? 'bg-teal-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-300'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Sources
        </span>

        {SOURCES.map((source) => (
          <button
            key={source.id}
            onClick={() => onSourceChange(source.id)}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              activeSource === source.id
                ? 'bg-teal-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-300'
            }`}
          >
            {source.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => onSortChange('relevance')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              sort === 'relevance'
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-500'
            }`}
          >
            Relevance
          </button>
          <button
            onClick={() => onSortChange('newest')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              sort === 'newest'
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-500'
            }`}
          >
            Newest
          </button>
        </div>
      </div>
    </>
  )
}