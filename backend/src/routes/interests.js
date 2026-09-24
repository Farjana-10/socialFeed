const express = require('express')
const router = express.Router()
const {
  getInterests,
  saveInterests
} = require('../controllers/interestController')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware, getInterests)
router.post('/', authMiddleware, saveInterests)

module.exports = router