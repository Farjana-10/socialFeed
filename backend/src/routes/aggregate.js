const express = require('express')
const router = express.Router()
const { aggregateAll } = require('../services/aggregator')

router.post('/run', async (req, res) => {
  try {
    const result = await aggregateAll()
    res.json({
      success: true,
      message: 'Aggregation complete',
      ...result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

module.exports = router