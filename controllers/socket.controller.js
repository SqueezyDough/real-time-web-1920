const spotifyApi = require('./spotify-api.controller')
const rooms = {}

exports.init = io => {  
    io.on('connection', (socket) => {
        // new user
        socket.on('new-user', (room, username) => {
            socket.join(room)

            if (rooms[room]) {
                rooms[room].users[socket.id] = {
                    username: username
                }
            }

            // send joined message to all users except sender
            socket.to(room).broadcast.emit('user-joined', username)   
            
            // update users list UI
            io.in(room).emit('update-users-list', socket.id, username)

            // watch if player is done for this socket
            socket.emit('watch-player-ended', socket.id)
        })

        // disconnnect
        socket.on('disconnect', () => {   
            getUserRooms(socket).forEach(room => {
                io.in(room).emit('user-left', socket.id, rooms[room].users[socket.id])
                delete rooms[room].users[socket.id]
            })   
        })

        // send chat msg
        socket.on('send-chat-message', async (roomName, message) => {
            const room = rooms[roomName]
            const currentSong = room.playlist[room.gameState.songIndex]
            const correctArtist = isCorrectArtist(message, currentSong.artists)
            const currentUserId = socket.id

            if (correctArtist) {
                if (!isInGuessedSongList(roomName, currentUserId, currentSong.name)) {
                    const updatedUserScore = updateScore(roomName, currentUserId, 100)
                    const updatedUser = updateUserSongList(updatedUserScore, currentSong.name)
                    
                    // update score UI to all sockets
                    io.in(roomName).emit('update-score', currentUserId, updatedUser.score)

                    // send correct answer message to this socket
                    socket.emit('correct-answer', message, currentSong.name)
                }        
            } else {
                socket.to(roomName).broadcast.emit('chat-message', {
                    username: rooms[roomName].users[socket.id],
                    message: message
                })
            }         
        })

        socket.on('client-done', (roomName, userId) => {
            const room = rooms[roomName]

            if (!room.gameState.userQueue) {
                room.gameState.userQueue = []
            }
            
            room.gameState.userQueue.push(userId)

            // set timeout after first user enters queue
            if (room.gameState.userQueue.length === 1) {
                room.gameState.timeOut = false
            }

            if (Object.keys(room.users).length === room.gameState.userQueue.length) {
                room.gameState.userQueue = []

                room.gameState.songIndex = room.gameState.songIndex + 1

                let newSongUrl = room.playlist[room.gameState.songIndex].preview_url

                console.log(newSongUrl)

                // if no preview is found move on to the next one
                if (!newSongUrl) {
                    room.gameState.songIndex = room.gameState.songIndex + 1
                    newSongUrl = room.playlist[room.gameState.songIndex].preview_url
                }   

                // send new song to clients
                io.in(roomName).emit('send-new-song', newSongUrl)
            }
        })
    })
}

exports.home = (req, res) => {
    res.render('home')
}

exports.rooms = (req, res) => {
    res.render('rooms', { rooms: rooms })
}

exports.room = async (req, res) => {
    if (req.params.room != 'null') {
        if (rooms[req.body.room] != null) {
            return res.redirect('/rooms')
        }
    
        const room = rooms[req.params.room]
        let currentSong = ''
    
        // find new playlist is nothing is found
        if (room.playlist) {
            currentSong = room.playlist[room.gameState.songIndex]
        } else {    
            const query = 'artist:Love'
    
            console.log('no playlist found, fetching new playlist...')
    
            room.playlist = await spotifyApi.getPlayList(req, query)
            currentSong = room.playlist[room.gameState.songIndex]
        }
    
        res.render('room', { 
            roomName: req.params.room,
            users: room.users,
            currentSongUrl: currentSong.preview_url,
        })
    } else {
        console.log('no room in param')
    }
}

exports.addRoom = async (req, res, io) => {
    if (rooms[req.body.room] != null) {
        return res.redirect('/rooms')
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

function updateScore(roomName, userId, score) {
    const user = rooms[roomName].users[userId]

    if (!user.score) {
        user.score = 0       
    }

    user.score += score

    return user
}
 
function updateUserSongList(user, songName) {
    if (user.guessedSongs) {
        user.guessedSongs.push(songName)
    } else {
        user.guessedSongs = [songName]
    }

    console.log('user', user)

    return user
}

function isInGuessedSongList(roomName, userId, songName) {
    const user = rooms[roomName].users[userId]

    console.log(user.guessedSongs)

    if (user.guessedSongs) {       
        return user.guessedSongs.includes(songName)
    }

    return false
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
