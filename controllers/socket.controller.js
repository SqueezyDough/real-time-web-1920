// const spotifyAPi = require('./spotify-api.controller')

const users = {}
const rooms = {
    name: {}
}

exports.init = (req, res, io) => {
    res.render('home', { rooms: rooms })
}

exports.room = (req, res, io) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }

    res.render('room', { roomName: req.params.room })
}

exports.addRoom = (req, res, io) => {
    console.log(rooms)

    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }

    rooms[req.body.room] = { users: {} }
    res.redirect(req.body.room)

    // socket
}



// exports.init = io => {  
//     const namespaces = {
//         public: io.of('/')
//     }

//     io.on('connection', (socket) => {
//         // new user
//         socket.on('new-user', username => {
//             users[socket.id] = username
//             console.log(socket.id)

//             socket.broadcast.emit('user-joined', username)    
//         })

//         // disconnnect
//         socket.on('disconnect', () => {
//             socket.broadcast.emit('user-left', users[socket.id])
//             delete users[socket.id]
//         })
//     })
// }

// exports.chat = io => {  
//     io.on('connection', (socket) => {
//         // new user
//         socket.on('new-user', username => {
//             users[socket.id] = username
//             console.log(socket.id)

//             socket.broadcast.emit('user-joined', username)    
//         })

//         // disconnnect
//         socket.on('disconnect', () => {
//             socket.broadcast.emit('user-left', users[socket.id])
//             delete users[socket.id]
//         })

//         // send chat msg
//         socket.on('send-chat-message', async message => {
//             console.log(message)
//             socket.broadcast.emit('chat-message', {
//                 username: users[socket.id],
//                 message: message
//             })
//         })
//     })
//}

