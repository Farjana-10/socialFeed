const cron = require('node-cron')
const { aggregateAll } = require('../services/aggregator')

const startScheduler = () => {
  cron.schedule('*/10 * * * *', async () => {
    console.log('Running scheduled aggregation')
    try {
      await aggregateAll()
    } catch (error) {
      console.error('Scheduled aggregation error:', error.message)
    }
  })

  console.log('Scheduler started (every 10 minutes)')
}

module.exports = { startScheduler }