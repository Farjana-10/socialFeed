require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/posts')
const accountRoutes = require('./routes/accounts')
const interestRoutes = require('./routes/interests')
const aggregateRoutes = require('./routes/aggregate')
const { startScheduler } = require('./scheduler/cron')

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/accounts', accountRoutes)
app.use('/api/interests', interestRoutes)
app.use('/api/aggregate', aggregateRoutes)

app.get('/api/test', (req, res) => {
  const dbStatus = require('mongoose').connection.readyState === 1
    ? 'connected'
    : 'disconnected'

  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
  startScheduler()
})