const axios = require('axios')
const xml2js = require('xml2js')

const youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3'
})

const decodeHtml = (str) => {
  if (!str) return ''
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '…')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
}

const mapSubredditToTags = (subreddit) => {
  const map = {
    technology: ['Technology'],
    programming: ['Technology'],
    artificial: ['Technology', 'Science'],
    webdev: ['Technology'],
    science: ['Science'],
    worldnews: ['World News'],
    gaming: ['Gaming'],
    music: ['Music']
  }
  return map[subreddit] || ['Technology']
}

const fetchYouTube = async (channelId, limit = 5) => {
  try {
    const res = await youtube.get('/search', {
      params: {
        part: 'snippet',
        channelId,
        maxResults: limit,
        type: 'video',
        order: 'date',
        key: process.env.YOUTUBE_API_KEY
      }
    })

    return res.data.items.map(item => ({
      platformId: 'youtube',
      externalId: item.id.videoId,
      title: decodeHtml(item.snippet.title),
      content: decodeHtml(item.snippet.description || '').slice(0, 300),
      mediaUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
      authorName: item.snippet.channelTitle,
      category: 'video',
      isPublic: true,
      tags: ['Technology']
    }))
  } catch (error) {
    console.error('YouTube fetch error:', error.message)
    return []
  }
}

const fetchReddit = async (subreddit, limit = 10) => {
  try {
    const res = await axios.get(
      `https://www.reddit.com/r/${subreddit}/hot.rss`,
      {
        headers: { 'User-Agent': 'SocialFeed/1.0' },
        timeout: 15000
      }
    )

    const parsed = await xml2js.parseStringPromise(res.data)
    const items = parsed.feed?.entry || []

    return items.slice(0, limit).map(item => {
      const getText = (field) => {
        if (!item[field]) return ''
        const val = item[field][0]
        if (typeof val === 'string') return val
        return val._ || ''
      }

      const rawContent = getText('content')
      const cleanContent = decodeHtml(rawContent)
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 300)

      const link = item.link?.[0]?.$.href || ''
      const externalId = link.split('/comments/')[1]?.split('/')[0] ||
                         item.id?.[0]?.split('/').pop() ||
                         Math.random().toString(36).slice(2)

      return {
        platformId: 'reddit',
        externalId: String(externalId),
        title: decodeHtml(getText('title')),
        content: cleanContent,
        mediaUrl: null,
        authorName: `r/${subreddit}`,
        category: 'post',
        isPublic: true,
        tags: mapSubredditToTags(subreddit)
      }
    })
  } catch (error) {
    console.error(`Reddit RSS error (${subreddit}):`, error.message)
    return []
  }
}

const fetchDevTo = async (tag, limit = 5) => {
  try {
    const res = await axios.get('https://dev.to/api/articles', {
      params: { tag, per_page: limit }
    })

    return res.data.map(item => ({
      platformId: 'devto',
      externalId: String(item.id),
      title: decodeHtml(item.title),
      content: decodeHtml(item.description || '').slice(0, 300),
      mediaUrl: item.cover_image || null,
      authorName: item.user.name,
      category: 'post',
      isPublic: true,
      tags: ['Technology']
    }))
  } catch (error) {
    console.error('Dev.to fetch error:', error.message)
    return []
  }
}

const fetchHackerNews = async (limit = 10) => {
  try {
    const topRes = await axios.get(
      'https://hacker-news.firebaseio.com/v0/topstories.json'
    )
    const ids = topRes.data.slice(0, limit)

    const items = await Promise.all(
      ids.map(id =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      )
    )

    return items
      .filter(r => r.data && r.data.type === 'story')
      .map(r => ({
        platformId: 'hackernews',
        externalId: String(r.data.id),
        title: decodeHtml(r.data.title),
        content: r.data.text
          ? decodeHtml(r.data.text).replace(/<[^>]*>/g, '').slice(0, 300)
          : `Shared by ${r.data.by} · ${r.data.score || 0} points · ${r.data.descendants || 0} comments`,
        mediaUrl: r.data.url || null,
        authorName: r.data.by || 'Hacker News',
        category: 'post',
        isPublic: true,
        tags: ['Technology']
      }))
  } catch (error) {
    console.error('Hacker News fetch error:', error.message)
    return []
  }
}

module.exports = {
  fetchYouTube,
  fetchReddit,
  fetchDevTo,
  fetchHackerNews
}