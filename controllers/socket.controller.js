// const spotifyAPi = require('./spotify-api.controller')
const rooms = {}

exports.init = io => {  
    io.on('connection', (socket) => {
        // new user
        socket.on('new-user', (room, username) => {
            socket.join(room)

            if (rooms[room]) {
                rooms[room].users[socket.id] = username
            }

            socket.to(room).broadcast.emit('user-joined', username)    
        })

        // disconnnect
        socket.on('disconnect', () => {   
            getUserRooms(socket).forEach(room => {
                console.log(room)
                socket.to(room).broadcast.emit('user-left', rooms[room].users[socket.id])
                delete rooms[room].users[socket.id]
            })   
        })

        // send chat msg
        socket.on('send-chat-message', async (room, message) => {
            socket.to(room).broadcast.emit('chat-message', {
                username: rooms[room].users[socket.id],
                message: message
            })
        })
    })
}

exports.home = (req, res, io) => {
    res.render('home', { rooms: rooms })
}

exports.room = (req, res, io) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }

    res.render('room', { roomName: req.params.room })
}

exports.addRoom = (req, res, io) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }

    rooms[req.body.room] = { users: {} }
    res.redirect(req.body.room)

    io.emit('room-created', req.body.room)
}

// return all rooms names that a user has joined
function getUserRooms(socket) {
    return Object.entries(rooms).reduce((names, [name, room]) => {
        if (room.users[socket.id] != null) names.push(name)
        return names
    }, [])
}
