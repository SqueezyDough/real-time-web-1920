const express = require('express')
const router = express.Router()
const home = require('../controllers/home.controller')

router.get('/', home.init)
router.get('/chat', home.chat)
router.get('/news', home.news)

module.exports = router