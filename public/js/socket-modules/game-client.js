const socket = io(),
      messageContainer = document.getElementById('message-container'),
      roomContainer = document.getElementById('room-container'),
      messageForm = document.getElementById('send-container'),
      messageInput = document.getElementById('message-input'),
      player = document.getElementById('player')

export function init() {
    if (messageForm) {
        const username = prompt('What is your username?') || 'Anonymous'
        appendMessage(`You joined as ${username}`, 'server')
        socket.emit('new-user', roomName, username)

        messageForm.addEventListener('submit', e => {
            e.preventDefault()
            const message = messageInput.value
            const actor = 'self'
    
            appendMessage(`You: ${message}`, actor)
            socket.emit('send-chat-message', roomName, message)
    
            // empty message input after being sent
            messageInput.value = ''
        })  
    } 

    socket.on('user-joined', username => {
        const actor = 'server'
        appendMessage(`${username} has joined`, actor)
    });

    socket.on('user-left', (userId, user) => {
        const actor = 'server'
        const userListElement = document.querySelector(`.user-list__item[data-id=${userId}]`)

        userListElement.remove()

        appendMessage(`${user.username} has left`, actor)
    });

    socket.on('room-created', room => {
        const roomElement = document.createElement('div')
        roomElement.innerHTML = room

        const roomLink = document.createElement('a')
        roomLink.href = `/${room}`
        roomLink.innerText = 'Join'

        roomContainer.append(roomElement)
        roomContainer.append(roomLink)
    })

    socket.on('chat-message', data => {
        console.log(data)
        const actor = 'member'
        appendMessage(`${data.username.username}: ${data.message}`, actor)
    })

    socket.on('hint-message', data => {
        console.log(data)
        const actor = 'server'

        data.forEach(hint => {
            appendMessage(`Hint: ${hint}`, actor)
        })  
    })
}

socket.on('correct-answer', (artist, song) => {
    const messageContainer = document.getElementById('game-message')

    messageContainer.innerHTML = `
        Correct!, this is <em>${song}</em> from <em>${artist}</em>
    `
})

socket.on('update-users-list', (userId, username) => {
    const listContainer = document.getElementById('users-list')
    const usernameListElement = document.createElement('li')
    const usernameElement = document.createElement('span')
    const scoreElement = document.createElement('span')

    usernameElement.textContent = `${username} `
    scoreElement.classList.add('game__score')
    usernameListElement.setAttribute('data-id', userId)
    scoreElement.setAttribute('data-id', userId)
    scoreElement.textContent = '0'

    usernameListElement.append(usernameElement)
    usernameListElement.append(scoreElement)
    listContainer.append(usernameListElement)
})

socket.on('update-score', (userId, score) => {
    const scoreElement = document.querySelector(`.game__score[data-id=${userId}]`)
    scoreElement.textContent = score
})

socket.on('watch-player-ended', userId => {
    console.log('start')   
    player.onended = () => {
        console.log('ended')   

        socket.emit('client-done', roomName, userId)
    }
})

socket.on('send-new-song', url => {
    console.log('new song', url)
    const source = document.getElementById('player')

    source.setAttribute('src', url)
    source.load()
    source.play()
})

function appendMessage(message, actor) {
    const elMessage = document.createElement('div')

    elMessage.classList.add('message', `-${actor}`)
    elMessage.innerHTML = message
    messageContainer.append(elMessage)

    scrollToBottom()
}


function scrollToBottom() {
    window.scrollTo(0, messageContainer.scrollHeight);
}

player.addEventListener('ready', e => {
    e.target.play();
}) 