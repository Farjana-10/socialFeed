const axios = require('axios')
const xml2js = require('xml2js')

const FEEDS = {
  bbc: {
    url: 'http://feeds.bbci.co.uk/news/rss.xml',
    platformId: 'news',
    authorName: 'BBC News',
    category: 'news',
    tags: ['World News']
  },
  techcrunch: {
    url: 'https://techcrunch.com/feed/',
    platformId: 'news',
    authorName: 'TechCrunch',
    category: 'news',
    tags: ['Technology']
  },
  theverge: {
    url: 'https://www.theverge.com/rss/index.xml',
    platformId: 'news',
    authorName: 'The Verge',
    category: 'news',
    tags: ['Technology']
  },
  medium: {
    url: 'https://medium.com/feed/@medium',
    platformId: 'medium',
    authorName: 'Medium',
    category: 'post',
    tags: ['Technology']
  }
}

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

const fetchRSS = async (key, limit = 10) => {
  const feed = FEEDS[key]
  if (!feed) return []

  try {
    const res = await axios.get(feed.url, {
      headers: { 'User-Agent': 'SocialFeed/1.0' },
      timeout: 15000
    })

    const parsed = await xml2js.parseStringPromise(res.data)
    const items = parsed.rss?.channel?.[0]?.item ||
                  parsed.feed?.entry ||
                  []

    return items.slice(0, limit).map(item => {
      const get = (field) => {
        const val = item[field]
        if (!val) return ''
        if (typeof val === 'string') return val
        if (Array.isArray(val)) {
          return val[0]._ || val[0] || ''
        }
        return val._ || val
      }

      const rawTitle = get('title')
      const rawContent = get('description') || get('summary') || get('content')

      const cleanTitle = decodeHtml(rawTitle)
      const cleanContent = decodeHtml(rawContent)
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 300)

      return {
        platformId: feed.platformId,
        externalId: String(get('guid') || get('id') || get('link') || cleanTitle),
        title: cleanTitle,
        content: cleanContent,
        mediaUrl: null,
        authorName: feed.authorName,
        category: feed.category,
        isPublic: true,
        tags: feed.tags
      }
    })
  } catch (error) {
    console.error(`RSS fetch error (${key}):`, error.message)
    return []
  }
}

const fetchAllRSS = async () => {
  const results = await Promise.all(
    Object.keys(FEEDS).map(key => fetchRSS(key))
  )
  return results.flat()
}

module.exports = { fetchRSS, fetchAllRSS, FEEDS }