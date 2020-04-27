const express = require('express')
const router = express.Router()
const spotifyApi = require('../controllers/spotify-api.controller')

router.get('/login', spotifyApi.login)
router.get('/callback', spotifyApi.callback)
router.get('/refresh-token', spotifyApi.refreshToken)

module.exports = router