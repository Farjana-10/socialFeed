const express = require('express')
const router = express.Router()
const { getPosts, getPostById } = require('../controllers/postController')
const optionalAuth = require('../middleware/optionalAuth')

router.get('/', optionalAuth, getPosts)
router.get('/:id', optionalAuth, getPostById)

module.exports = router