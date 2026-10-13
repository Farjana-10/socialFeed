import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useFeed({ page, kind, token }) {
  const [posts, setPosts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [counts, setCounts] = useState({ video: 0, post: 0, news: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const res = await axios.get(
          `http://localhost:5000/api/posts?page=${page}&kind=${kind}`,
          { headers }
        )
        setPosts(res.data.posts)
        setTotalPages(res.data.totalPages)
        setCounts(res.data.counts)
      } catch (err) {
        console.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [page, kind, token])

  return { posts, totalPages, counts, loading }
}