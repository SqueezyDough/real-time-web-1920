const socket = io.connect();
socket.on('connect', () => {
    console.log('user connected')
});