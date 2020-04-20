const express = require('express')
const router = express.Router()
const home = require('../controllers/home.controller')
const spotifyApi = require('../controllers/spotify-api.controller')

router.get('/', home.init)
router.get('/room/:id', home.room)

router.get('/login', spotifyApi.login)
router.get('/callback', spotifyApi.callback)
router.get('/refresh-token', spotifyApi.refreshToken)

module.exports = router