const socket = io('/chat');

socket.on('message', function (data) {
    console.log(data);
});