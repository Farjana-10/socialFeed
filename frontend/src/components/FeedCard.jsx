import { useNavigate } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import Badge from './ui/Badge'

export default function FeedCard({ post, user, onLoginRequired }) {
  const navigate = useNavigate()

  const badgeVariant =
    post.category === 'video'
      ? 'red'
      : post.category === 'post'
      ? 'orange'
      : 'blue'

  const handleInteract = (e) => {
    e.stopPropagation()
    if (!user) onLoginRequired()
  }

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <Badge variant={badgeVariant} className="uppercase tracking-wide">
          {post.platformId}
        </Badge>
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
          onClick={handleInteract}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-teal-50 hover:text-teal-700"
        >
          👍 <span>0</span>
        </button>
        <button
          onClick={handleInteract}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-teal-50 hover:text-teal-700"
        >
          👎 <span>0</span>
        </button>
        <button
          onClick={handleInteract}
          className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition hover:bg-teal-50 hover:text-teal-700"
        >
          <Bookmark className="h-4 w-4" />
          Save
        </button>
      </div>
    </article>
  )
}