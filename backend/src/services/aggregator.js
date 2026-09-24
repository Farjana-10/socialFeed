const Post = require('../models/Post')
const api = require('./apiFetcher')
const rss = require('./rssFetcher')

const SOURCES = {
  youtube: ['UCsBjURrPoezykLs9EqgamOA', 'UC8butISFwT-Wl7EV0hUK0BQ'],
  reddit: ['technology', 'programming', 'artificial', 'webdev'],
  devto: ['javascript', 'react', 'node'],
  hackernews: true,
  rss: ['bbc', 'techcrunch', 'theverge', 'medium']
}

const dedupeInsert = async (posts) => {
  let inserted = 0
  let skipped = 0

  for (const post of posts) {
    if (!post.title || !post.externalId) continue

    try {
      const existing = await Post.findOne({
        platformId: post.platformId,
        externalId: String(post.externalId)
      })

      if (existing) {
        skipped++
        continue
      }

      await Post.create({
        ...post,
        externalId: String(post.externalId)
      })
      inserted++
    } catch (error) {
      if (error.code === 11000) skipped++
      else console.error('Insert error:', error.message)
    }
  }

  return { inserted, skipped }
}

const aggregateAll = async () => {
  const startTime = Date.now()
  const allPosts = []

  console.log('Aggregation started')

  for (const channelId of SOURCES.youtube) {
    const posts = await api.fetchYouTube(channelId, 5)
    allPosts.push(...posts)
  }

  for (const subreddit of SOURCES.reddit) {
    const posts = await api.fetchReddit(subreddit, 10)
    allPosts.push(...posts)
  }

  for (const tag of SOURCES.devto) {
    const posts = await api.fetchDevTo(tag, 5)
    allPosts.push(...posts)
  }

  const hnPosts = await api.fetchHackerNews(10)
  allPosts.push(...hnPosts)

  for (const key of SOURCES.rss) {
    const posts = await rss.fetchRSS(key, 10)
    allPosts.push(...posts)
  }

  const result = await dedupeInsert(allPosts)
  const duration = ((Date.now() - startTime) / 1000).toFixed(2)

  console.log(
    `Aggregation done: ${result.inserted} inserted, ` +
    `${result.skipped} skipped, ${duration}s`
  )

  return result
}

module.exports = { aggregateAll }