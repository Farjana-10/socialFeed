const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  platformId: {
    type: String,
    required: true,
    index: true
  },
  externalId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  mediaUrl: {
    type: String,
    default: null
  },
  authorName: {
    type: String,
    default: 'Unknown'
  },
  category: {
    type: String,
    enum: ['video', 'post', 'news'],
    required: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
})

postSchema.index({ platformId: 1, externalId: 1 }, { unique: true })

module.exports = mongoose.model('Post', postSchema)