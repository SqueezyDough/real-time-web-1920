const socket = io('/room'),
      messageContainer = document.getElementById('message-container'),
      messageForm = document.getElementById('send-container'),
      messageInput = document.getElementById('message-input'),
      username = prompt('What is your username?') || assignRandomUserName()


const actor = 'server'
appendMessage(`You joined as ${username}`, actor)
socket.emit('new-user', username)

socket.on('user-joined', username => {
    const actor = 'server'
    appendMessage(`${username} has joined`, actor)
});

socket.on('user-left', username => {
    const actor = 'server'
    appendMessage(`${username} has left`, actor)
});

socket.on('chat-message', data => {
    const actor = 'member'
    appendMessage(`${data.username}: ${data.message}`, actor)
});

socket.on('command-message', data => {
    const actor = 'self'
    appendGiphy(data, actor)
});

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    const actor = 'self'

    if (message[0] === '/') {
        socket.emit('send-command-message', message)
    } else {
        appendMessage(`You: ${message}`, actor)
        socket.emit('send-chat-message', message)
    }

    // empty message input after being sent
    messageInput.value = ''
})

function appendMessage(message, actor) {
    const elMessage = document.createElement('div')
    elMessage.classList.add('message', `-${actor}`)
    elMessage.innerHTML = message
    messageContainer.append(elMessage)
    scrollToBottom()
}

function appendGiphy(data) {
    const giphyUrl = data.message.slice('http', -1)
    const username = data.username

    const elMessage = document.createElement('div')
    elMessage.classList.add('message', `-${data.actor}`)

    const elUsername = document.createElement('span')

    if (data.actor === 'self') {
        elUsername.innerHTML = 'You: '
    } else {
        elUsername.innerHTML = `${username}: `
    }

    const elVideo = document.createElement('video')
    elVideo.src = giphyUrl
    elVideo.autoplay = true
    elVideo.loop = true
    elVideo.classList.add('video-message')

    elMessage.append(elUsername)
    elMessage.append(elVideo)
    messageContainer.append(elMessage)
    scrollToBottom()
}

function assignRandomUserName() {
    const usernames = [
        'SuperSpreader',
        'CovKid-19',
        'RIPLungs',
        'C0VIDisahoax',
        'It\'s just like the flu m8',
        'thePurge',
        'Save/The/Old',
        '#StayTheFuckHome',
        'LockdownParty tonight!',
        'Coughing Granny',
    ]

    return usernames[Math.floor(Math.random() * usernames.length)];
}

function scrollToBottom() {
    window.scrollTo(0, messageContainer.scrollHeight);
}