const api = require('./api.controller')
const users = {}

exports.init = io => {  
    console.log('init')

    const chat = io.of('/room')

    chat.on('connection', (socket) => {
       // new user
        socket.on('new-user', username => {
            users[socket.id] = username
            socket.broadcast.emit('user-joined', username)
        })

        // disconnnect
        socket.on('disconnect', () => {
            socket.broadcast.emit('user-left', users[socket.id])
            delete users[socket.id]
        })

        // send chat msg
        socket.on('send-chat-message', async message => {
            socket.broadcast.emit('chat-message', {
                username: users[socket.id],
                message: message
            })
        })

        // send commands containing a '/'
        socket.on('send-command-message', async message => {
            if (message[0] === '/') {
            message = await executeCommand(message)

            console.log(message)

            // show command result to self
            socket.emit('command-message', {
                username: users[socket.id],
                message: message,
                actor: 'self'
            })

            // broadcast command result to others
            socket.broadcast.emit('command-message', {
                username: users[socket.id],
                message: message,
                actor: 'member'
            })
            }
        })
    })
}

function executeCommand(command) {
    const commands = {
        '/giphy': api.getRandomGiphy()
    }

    return commands[command]
}

//  ROOMS
//socket.join('me room');
// socket.emit('message', {
//     that: 'only'
//   , '/chat': 'will get'
// });
// chat.emit('message', {
//     everyone: 'in'
//   , '/chat': 'will get'
// });


// chat.to('me room').emit('message', { will: 'be received by everyone'});