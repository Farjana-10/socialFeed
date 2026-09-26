import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import axios from 'axios'

const TOPICS = [
  'All topics',
  'Technology',
  'Science',
  'News',
  'Gaming',
  'Movies',
  'Books',
  'Sports',
  'Food',
  'Travel'
]

const SOURCES = [
  { id: 'All', label: 'All' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'news', label: 'News' }
]

export default function Feed() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [kind, setKind] = useState('all')
  const [topic, setTopic] = useState('All topics')
  const [source, setSource] = useState('All')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [counts, setCounts] = useState({ video: 0, post: 0, news: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try { setUser(JSON.parse(userData)) } catch {}
    }
  }, [])

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const res = await axios.get(
          `http://localhost:5000/api/posts?page=${page}&kind=${kind}`,
          { headers }
        )
        setPosts(res.data.posts)
        setTotalPages(res.data.totalPages)
        setCounts(res.data.counts)
      } catch (err) {
        console.error('Fetch error:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [page, kind])

  const filteredPosts = posts.filter(p => {
    if (source !== 'All' && p.platformId !== source) return false
    if (topic !== 'All topics' && !(p.tags || []).includes(topic)) return false
    return true
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-10">

        {!user && (
          <div className="mb-7 flex flex-col gap-3 rounded-xl border border-dashed border-teal-300 bg-teal-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-teal-900">
              You're browsing as a guest — login to keep your feed and saved posts.
            </p>
            <div className="flex gap-2">
              <Link
                to="/login"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-teal-300 bg-white px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-serif text-4xl font-bold text-gray-900">
              Your feed
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              {user
                ? 'Personalized for your interests'
                : 'Ranked from popular topics'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setPage(1); setKind('all') }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <Link to="/" className="btn-primary px-3.5 py-2 text-sm">
              Edit interests
            </Link>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {TOPICS.map(t => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`chip ${
                topic === t
                  ? 'bg-teal-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Sources
          </span>
          {SOURCES.map(s => (
            <button
              key={s.id}
              onClick={() => setSource(s.id)}
              className={`chip ${
                source === s.id
                  ? 'bg-teal-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-teal-300'
              }`}
            >
              {s.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setSort('relevance')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                sort === 'relevance'
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-500'
              }`}
            >
              Relevance
            </button>
            <button
              onClick={() => setSort('newest')}
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

        <div className="mb-5 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'video', label: `Videos (${counts.video})` },
            { key: 'post', label: `Posts (${counts.post})` },
            { key: 'news', label: `News (${counts.news})` }
          ].map(tab => (
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

        {loading && (
          <div className="py-16 text-center text-sm text-gray-400">
            Loading your feed…
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="surface-card py-16 text-center">
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Nothing matched those filters
            </h3>
            <p className="mt-1.5 text-sm text-gray-500">
              Try different filters or refresh
            </p>
          </div>
        )}

        <div className="space-y-4">
          {!loading && filteredPosts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              user={user}
              onLoginRequired={() => navigate('/login')}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
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
    </div>
  )
}

function PostCard({ post, user, onLoginRequired }) {
  const badgeClass =
    post.category === 'video'
      ? 'bg-red-50 text-red-700 border-red-200'
      : post.category === 'post'
      ? 'bg-orange-50 text-orange-700 border-orange-200'
      : 'bg-blue-50 text-blue-700 border-blue-200'

  return (
    <article className="surface-card p-5 transition-shadow hover:shadow-md">

      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span
          className={`chip border ${badgeClass} uppercase tracking-wide`}
        >
          {post.platformId}
        </span>
        <span className="font-medium text-gray-700">{post.authorName}</span>
        <time className="ml-auto">
          {new Date(post.createdAt).toLocaleDateString()}
        </time>
      </div>

      <h3 className="mt-3 font-serif text-lg font-bold text-gray-900">
        {post.title}
      </h3>

      {post.content && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {post.content.slice(0, 220)}
          {post.content.length > 220 ? '…' : ''}
        </p>
      )}

      {post.mediaUrl && post.mediaUrl.includes('youtube') && (
        <div className="mt-4 overflow-hidden rounded-xl bg-black">
          <iframe
            src={post.mediaUrl}
            className="aspect-video w-full border-0"
            allowFullScreen
            title={post.title}
          />
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
        <button
          onClick={user ? () => {} : onLoginRequired}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-teal-50 hover:text-teal-700"
        >
          👍 <span>0</span>
        </button>
        <button
          onClick={user ? () => {} : onLoginRequired}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-teal-50 hover:text-teal-700"
        >
          👎 <span>0</span>
        </button>
        <button
          onClick={user ? () => {} : onLoginRequired}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-teal-50 hover:text-teal-700"
        >
          🔖 Save
        </button>
      </div>

    </article>
  )
}