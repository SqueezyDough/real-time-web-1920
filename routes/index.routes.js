const socket = require('../controllers/socket.controller')

exports.init = (app, io) => {
    app.get('/', (req, res) => {
        socket.home(req, res)    
    })

    app.get('/rooms', (req, res) => {
        socket.rooms(req, res)    
    })

    app.get('/:room', (req, res) => {
        socket.room(req, res, io)
    }) 

    app.post('/room', (req, res) => {
        socket.addRoom(req, res, io)
    })

    socket.init(io)
}