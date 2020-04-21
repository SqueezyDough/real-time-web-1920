const spotifyAPi = require('./spotify-api.controller')
const users = {}

exports.init = io => {  
    io.on('connection', (socket) => {
        // new user
        socket.on('new-user', username => {
            users[socket.id] = username
            console.log(socket.id)

            socket.broadcast.emit('user-joined', username)    
        })

        // disconnnect
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-left', users[socket.id])
            delete users[socket.id]
        })
    })
}

exports.room = io => {  
    io.on('connection', (socket) => {
        const room = io.of('/room/1')

        room.join('/room/1')

        room.emit('message', {
            that: 'only'
        ,   '/room1': 'will get'
        })

        room.emit('message', {
            everyone: 'in'
    ,       '/room1': 'will get'
        })

        socket.to('me room').emit('message', { will: 'be received by everyone'});
    })
}

exports.chat = io => {  
    io.on('connection', (socket) => {
        

        // new user
        socket.on('new-user', username => {
            users[socket.id] = username
            console.log(socket.id)

            socket.broadcast.emit('user-joined', username)    
        })

        // disconnnect
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-left', users[socket.id])
            delete users[socket.id]
        })

        // send chat msg
        socket.on('send-chat-message', async message => {
            console.log(message)
            socket.broadcast.emit('chat-message', {
                username: users[socket.id],
                message: message
            })
        })
    })
}

