import * as gameClient from './socket-modules/game-client.js'

const socket = io()

socket.on('connect', () => {
        gameClient.init()
})

