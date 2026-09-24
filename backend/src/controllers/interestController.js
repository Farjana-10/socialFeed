const Interest = require('../models/Interest')

const AVAILABLE_INTERESTS = [
  'Technology',
  'Sports',
  'Music',
  'World News',
  'Science',
  'Gaming',
  'Business',
  'Health'
]

const getInterests = async (req, res) => {
  try {
    const userInterests = await Interest.find({ userId: req.userId })
    const selected = userInterests.map(i => i.name)

    const interests = AVAILABLE_INTERESTS.map(name => ({
      name,
      selected: selected.includes(name)
    }))

    res.json({ success: true, interests })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

const saveInterests = async (req, res) => {
  try {
    const { interests } = req.body

    if (!Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        message: 'Interests must be an array'
      })
    }

    await Interest.deleteMany({ userId: req.userId })

    const validInterests = interests.filter(i => AVAILABLE_INTERESTS.includes(i))

    if (validInterests.length > 0) {
      const docs = validInterests.map(name => ({
        userId: req.userId,
        name
      }))
      await Interest.insertMany(docs)
    }

    res.json({
      success: true,
      message: 'Interests saved',
      interests: validInterests
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

module.exports = {
  getInterests,
  saveInterests,
  AVAILABLE_INTERESTS
}