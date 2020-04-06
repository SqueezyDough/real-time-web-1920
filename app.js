'use strict';
const express = require('express'),
      path = require('path'),
      exphbs = require('express-handlebars'),
      router = require('./routes/index.router'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io')(server),
      port = process.env.PORT || 3000;

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
  socket.on('new-user', username => {
    users[socket.id] = username
    socket.broadcast.emit('user-joined', username)
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', users[socket.id])
    delete users[socket.id]
  })

  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', {
      username: users[socket.id],
      message: message
    })
  })
})

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