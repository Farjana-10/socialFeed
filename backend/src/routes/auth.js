const express = require('express')
const router = express.Router()
const {
  signup,
  login,
  verifyEmail,
  getMe
} = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

router.post('/signup', signup)
router.post('/login', login)
router.get('/verify/:token', verifyEmail)
router.get('/me', authMiddleware, getMe)

module.exports = router