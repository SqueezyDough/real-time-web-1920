const socket = io('/chat'),
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

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    const actor = 'self'

    appendMessage(`You: ${message}`, actor)
    socket.emit('send-chat-message', message)

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