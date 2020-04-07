'use strict';
const express = require('express'),
      path = require('path'),
      exphbs = require('express-handlebars'),
      router = require('./routes/index.router'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io')(server),
      port = process.env.PORT || 3000,
      fetch = require('node-fetch')

require("dotenv").config();
require("./views/helpers");

app
    .use("/", express.static(path.join(__dirname, "/public")))
    .set('view engine', 'hbs')
    .engine('hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'main',
        partialsDir: path.join(__dirname, 'views/partials')
    }))
    .use('/', router)

server.listen(port, () => console.log(`Listening on port ${port}!`))


const users = {}

const chat = io.of('/chat')
chat.on('connection', (socket) => {

  // new user
  socket.on('new-user', username => {
    users[socket.id] = username
    socket.broadcast.emit('user-joined', username)
  })

  // disconnnect
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', users[socket.id])
    delete users[socket.id]
  })

  // send chat msg
  socket.on('send-chat-message', async message => {
    socket.broadcast.emit('chat-message', {
      username: users[socket.id],
      message: message
    })
  })

  // send commands containing a '/'
  socket.on('send-command-message', async message => {
    if (message[0] === '/') {
      message = await executeCommand(message)

      console.log(message)

      // show command result to self
      socket.emit('command-message', {
        username: users[socket.id],
        message: message,
        actor: 'self'
      })

      // broadcast command result to others
      socket.broadcast.emit('command-message', {
        username: users[socket.id],
        message: message,
        actor: 'member'
      })
    }
  })
})

function executeCommand(command) {
  const commands = {
    '/giphy': getRandomGiphy(),
    '/news': fetchNews()
  }

  return commands[command]
}

async function getRandomGiphy() {
  const query = 'covid'
  const limit = 50
  const url = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.apiKey}&q=${query}&limit=${limit}&offset=0&rating=G&lang=en`
  const giphies = await fetchData(url)

  return giphies.data[Math.floor(Math.random() * giphies.data.length)].images.looping.mp4;
}

function fetchData(url) {
  return fetch(url)
    .then(data => data.text())
    .then(data => JSON.parse(data.trim()))
}

function fetchNews() {
  // TODO: fetch some news
}






const news = io.of('/news')
news.on('connection', (socket) => {
  console.log('news');
})
news.emit('here\'s', 'news!');



//  ROOMS
//socket.join('me room');
// socket.emit('message', {
//     that: 'only'
//   , '/chat': 'will get'
// });
// chat.emit('message', {
//     everyone: 'in'
//   , '/chat': 'will get'
// });


// chat.to('me room').emit('message', { will: 'be received by everyone'});