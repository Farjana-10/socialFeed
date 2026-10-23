import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import useAuth from '../hooks/useAuth'
import useFeed from '../hooks/useFeed'
import FeedCard from '../components/FeedCard'
import FilterBar from '../components/FilterBar'
import GuestBanner from '../components/GuestBanner'
import { LoadingState, EmptyState } from '../components/StateViews'
import Button from '../components/ui/Button'

const TOPICS = ['All topics', 'Technology', 'Science', 'News', 'Gaming', 'Movies', 'Books', 'Sports', 'Food', 'Travel']

export default function Feed() {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [kind, setKind] = useState('all')
  const [topic, setTopic] = useState('All topics')
  const [source, setSource] = useState('All')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  const { posts, totalPages, counts, loading } = useFeed({ page, kind, token })

  const filtered = posts.filter((p) => {
    if (source !== 'All' && p.platformId !== source) return false
    return true
  })

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {!user && <GuestBanner />}

      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-bold text-gray-900">Your feed</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            {user ? 'Personalized for your interests' : 'Ranked from popular topics'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="md" onClick={() => { setPage(1); setKind('all') }}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
          </Button>
          <Link to="/"><Button size="md">Edit interests</Button></Link>
        </div>
      </div>

      <FilterBar
        topics={TOPICS}
        activeTopic={topic}
        onTopicChange={setTopic}
        activeSource={source}
        onSourceChange={setSource}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'video', label: `Videos (${counts.video})` },
          { key: 'post', label: `Posts (${counts.post})` },
          { key: 'news', label: `News (${counts.news})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setKind(tab.key); setPage(1) }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              kind === tab.key
                ? 'border-2 border-teal-500 bg-white text-teal-700'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <LoadingState />}
      {!loading && filtered.length === 0 && (
        <EmptyState title="Nothing matched those filters" body="Try changing your interests in the Home page." />
      )}

      <div className="space-y-4">
        {!loading &&
          filtered.map((post) => (
            <FeedCard key={post._id} post={post} user={user} onLoginRequired={() => navigate('/login')} />
          ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold ${
                p === page
                  ? 'bg-teal-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-teal-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}