import * as gameClient from './socket-modules/game-client.js'

const socket = io()

socket.on('connect', () => {
        console.log('connect index')

        gameClient.init()

        // Add rooms manually  
        // https://github.com/socketio/socket.io/issues/2388
})

