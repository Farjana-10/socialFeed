const SocialAccount = require('../models/SocialAccount')

const PLATFORMS = ['youtube', 'reddit', 'news']

const getAccounts = async (req, res) => {
  try {
    const accounts = await SocialAccount.find({ userId: req.userId })

    const connected = PLATFORMS.map(p => {
      const acc = accounts.find(a => a.platformId === p)
      return {
        platformId: p,
        connected: !!acc,
        platformUsername: acc ? acc.platformUsername : null,
        connectedAt: acc ? acc.createdAt : null
      }
    })

    res.json({ success: true, accounts: connected })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

const connectAccount = async (req, res) => {
  try {
    const { platformId, platformUsername } = req.body

    if (!platformId || !platformUsername) {
      return res.status(400).json({
        success: false,
        message: 'Platform and username are required'
      })
    }

    if (!PLATFORMS.includes(platformId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid platform'
      })
    }

    const account = await SocialAccount.findOneAndUpdate(
      { userId: req.userId, platformId },
      {
        userId: req.userId,
        platformId,
        platformUsername,
        accessToken: 'mock_token_' + Date.now()
      },
      { upsert: true, new: true }
    )

    res.json({
      success: true,
      message: `${platformId} connected successfully`,
      account
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}

const disconnectAccount = async (req, res) => {
  try {
    const { platformId } = req.params

    await SocialAccount.deleteOne({
      userId: req.userId,
      platformId
    })

    res.json({
      success: true,
      message: `${platformId} disconnected`
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
  getAccounts,
  connectAccount,
  disconnectAccount
}