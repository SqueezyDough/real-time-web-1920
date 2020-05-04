const socket = require('../controllers/socket.controller')

exports.init = (app, io) => {
    app.get('/', (req, res) => {
        // check if token exists
        if (req.cookies.access_token) {
            // console.log(req.cookies.access_token)

            res.redirect('/rooms')
        } else {
            socket.home(req, res)    
        }
    })

    app.get('/rooms', (req, res) => {
        socket.rooms(req, res)    
    })

    app.get('/:room', (req, res) => {
        socket.room(req, res)
    }) 

    app.post('/room', (req, res) => {
        socket.addRoom(req, res, io)
    })

    socket.init(io)
}