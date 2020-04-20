const socket = io(),
      username = prompt('What is your username?') || 'Anonymous'

socket.on('connect', () => {
        console.log('connect')

        // Add rooms manually  
})

