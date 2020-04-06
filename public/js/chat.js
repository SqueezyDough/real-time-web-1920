const socket = io('/chat'),
      messageContainer = document.getElementById('message-container'),
      messageForm = document.getElementById('send-container'),
      messageInput = document.getElementById('message-input'),
      username = prompt('What is your username?')


appendMessage('You joined')
socket.emit('new-user', username)

socket.on('user-joined', username => {
    appendMessage(`${username} joined`)
});

socket.on('user-left', username => {
    appendMessage(`${username} left`)
});

socket.on('chat-message', data => {
    appendMessage(`${data.username}: ${data.message}`)
});

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value

    appendMessage(`You: ${message}`)

    socket.emit('send-chat-message', message)

    // empty message input after being sent
    messageInput.value = ''
})

function appendMessage(message) {
    const elMessage = document.createElement('div')
    elMessage.innerHTML = message
    messageContainer.append(elMessage)
}