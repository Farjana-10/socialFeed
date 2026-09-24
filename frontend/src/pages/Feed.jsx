import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

export default function Feed() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [kind, setKind] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [counts, setCounts] = useState({ video: 0, post: 0, news: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        setUser(null)
      }
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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const requireLogin = () => {
    alert('Please login to interact with posts')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-indigo-600">SocialFeed</h1>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                Dashboard
              </Link>
              <span className="text-sm text-gray-600">
                Hi, {user.fullName || user.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-xl hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="max-w-3xl mx-auto p-6">

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">

          <nav className="flex border-b border-gray-200 px-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'video', label: `Videos (${counts.video})` },
              { key: 'post', label: `Posts (${counts.post})` },
              { key: 'news', label: `News (${counts.news})` }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => { setKind(tab.key); setPage(1) }}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
                  kind === tab.key
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-gray-500 border-transparent hover:text-indigo-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 space-y-3">

            {loading && (
              <div className="text-center py-10 text-gray-400">
                Loading...
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                <h3 className="font-semibold text-gray-900 mb-1">No posts yet</h3>
                <p className="text-sm">Connect accounts to populate your feed.</p>
              </div>
            )}

            {!loading && posts.map(post => (
              <article
                key={post._id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
              >
                <header className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    post.category === 'video'
                      ? 'bg-red-100 text-red-700'
                      : post.category === 'post'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {post.platformId}
                  </span>
                  <span className="font-medium">{post.authorName}</span>
                  <time className="ml-auto">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </time>
                </header>

                <h3 className="text-lg font-bold mb-1 text-gray-900">
                  {post.title}
                </h3>

                {post.content && (
                  <p className="text-sm text-gray-700 mb-3">{post.content}</p>
                )}

                {post.mediaUrl && post.mediaUrl.includes('youtube') && (
                  <div className="rounded-xl overflow-hidden bg-black mb-3">
                    <iframe
                      src={post.mediaUrl}
                      className="w-full aspect-video border-0"
                      allowFullScreen
                      title={post.title}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={user ? () => {} : requireLogin}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                  >
                    👍 <span>0</span>
                  </button>
                  <button
                    onClick={user ? () => {} : requireLogin}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                  >
                    👎 <span>0</span>
                  </button>
                  <button
                    onClick={user ? () => {} : requireLogin}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 hover:text-indigo-600 ml-auto"
                  >
                    💬 <span>0</span>
                  </button>
                </div>
              </article>
            ))}

          </div>

          {totalPages > 1 && (
            <nav className="flex justify-center gap-1.5 pb-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold text-sm transition ${
                    p === page
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </nav>
          )}

        </div>

      </main>

    </div>
  )
}