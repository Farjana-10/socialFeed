const mongoose = require('mongoose')

const interestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

interestSchema.index({ userId: 1, name: 1 }, { unique: true })

module.exports = mongoose.model('Interest', interestSchema)