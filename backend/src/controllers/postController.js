const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 5
    const skip = (page - 1) * limit
    const kind = req.query.kind || 'all'

    let query = {}

    if (req.userId) {
      const accounts = await SocialAccount.find({ userId: req.userId })
      const connectedPlatforms = accounts.map(a => a.platformId)

      if (connectedPlatforms.length > 0) {
        query.platformId = { $in: connectedPlatforms }
      } else {
        query.isPublic = true
      }
    } else {
      query.isPublic = true
    }

    if (kind !== 'all' && ['video', 'post', 'news'].includes(kind)) {
      query.category = kind
    }

    const total = await Post.countDocuments(query)
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