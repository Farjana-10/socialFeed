const mongoose = require('mongoose')

const socialAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  platformId: {
    type: String,
    required: true
  },
  platformUsername: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
})

socialAccountSchema.index({ userId: 1, platformId: 1 }, { unique: true })

module.exports = mongoose.model('SocialAccount', socialAccountSchema)