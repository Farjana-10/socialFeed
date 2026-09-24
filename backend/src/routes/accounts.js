const express = require('express')
const router = express.Router()
const {
  getAccounts,
  connectAccount,
  disconnectAccount
} = require('../controllers/accountController')
const authMiddleware = require('../middleware/auth')

router.get('/', authMiddleware, getAccounts)
router.post('/connect', authMiddleware, connectAccount)
router.delete('/:platformId', authMiddleware, disconnectAccount)

module.exports = router