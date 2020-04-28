const url = require('url');
const querystring = require('querystring');
const spotifyApi = require('./spotify-api.controller')

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
                socket.to(room).broadcast.emit('user-left', rooms[room].users[socket.id])
                delete rooms[room].users[socket.id]
            })   
        })

        // send chat msg
        socket.on('send-chat-message', async (roomName, message) => {
            const room = rooms[roomName]
            const currentSong = room.playlist[room.gameState.songIndex]
            const correctArtist = isCorrectArtist(message, currentSong.artists)

            console.log(correctArtist)

            socket.to(roomName).broadcast.emit('chat-message', {
                username: rooms[roomName].users[socket.id],
                message: message
            })
        })
    })
}

exports.home = (req, res) => {
    res.render('home', { rooms: rooms })
}

exports.room = (req, res, io) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }

    const room = rooms[req.params.room]
    const currentSong = room.playlist[room.gameState.songIndex]

    res.render('room', { 
        roomName: req.params.room,
        users: room.users,
        currentSongUrl: currentSong.preview_url,
    })
}

exports.addRoom = async (req, res, io) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/')
    }

    const query = 'artist:Love'
    const playlist = await spotifyApi.getPlayList(req, query)

    rooms[req.body.room] = { 
        users: {},
        playlist: playlist,
        gameState: {
            state: 'pending',
            songIndex: 0
        }   
    }

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


// TODO: let this functio test all answers
function isCorrectArtist(answer, artists) {
    const correctAnswers = getArtistsNames(artists)
    console.log(correctAnswers)
    return correctAnswers.some(correctAnswer => correctAnswer === answer.toLowerCase())
}

function getArtistsNames(artists) {
    return artists.map(artist => artist.name.toLowerCase())
}
