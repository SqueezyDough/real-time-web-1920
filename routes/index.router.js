// const express = require('express')
// const router = express.Router()
const socket = require('../controllers/socket.controller')
// const spotifyApi = require('../controllers/spotify-api.controller')

exports.init = (app, io) => {
    app.get('/', (req, res) => {
        socket.init(req, res, io)
    })

    app.post('/room', (req, res) => {
        socket.addRoom(req, res, io)
    })

    app.get('/:room', (req, res) => {
        socket.room(req, res, io)
    }) 
}

// router.get('/', home.init)
// router.post('/room', home.addRoom)
// router.get('/:room', home.room)

// router.get('/login', spotifyApi.login)
// router.get('/callback', spotifyApi.callback)
// router.get('/refresh-token', spotifyApi.refreshToken)

// module.exports = router