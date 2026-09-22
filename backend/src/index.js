require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})