const Post = require('../models/Post')
const SocialAccount = require('../models/SocialAccount')
const Interest = require('../models/Interest')

const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 5
    const skip = (page - 1) * limit
    const kind = req.query.kind || 'all'

    let query = { isPublic: true }

    if (req.userId) {
      const interests = await Interest.find({ userId: req.userId })
      const selectedInterests = interests.map(i => i.name)
      
      if (selectedInterests.length > 0) {
        const tagsToSearch = selectedInterests.flatMap(i => {
          if (i === 'News') return ['News', 'World News']
          return [i]
        })
        query.tags = { $in: tagsToSearch }
      }
    }

    if (kind !== 'all' && ['video', 'post', 'news'].includes(kind)) {
      query.category = kind
    }

    let total = await Post.countDocuments(query)

    // FALLBACK LOGIC: Jodi interest er post na thake, shob public post dekhao
    if (total === 0 && query.tags) {
      delete query.tags
      query.isPublic = true
      total = await Post.countDocuments(query)
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const counts = {
      video: await Post.countDocuments({ ...query, category: 'video' }),
      post: await Post.countDocuments({ ...query, category: 'post' }),
      news: await Post.countDocuments({ ...query, category: 'news' })
    }

    res.json({
      success: true,
      posts,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      total,
      counts
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' })
    }
    res.json({ success: true, post })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message })
  }
}

module.exports = { getPosts, getPostById }