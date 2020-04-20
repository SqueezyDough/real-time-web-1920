'use strict'
const express = require('express'),
      path = require('path'),
      cors = require('cors'),
      cookieParser = require('cookie-parser'),
      exphbs = require('express-handlebars'),
      router = require('./routes/index.router'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io')(server),
      socket = require('./controllers/socket.controller'),
      port = process.env.PORT || 3000
   
require('dotenv').config()
require("./views/helpers")

app
    .use("/", express.static(path.join(__dirname, "/public")))
    .use(cors())
    .use(cookieParser())
    .set('view engine', 'hbs')
    .engine('hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'main',
        partialsDir: path.join(__dirname, 'views/partials')
    }))
    .use('/', router)

server.listen(port, () => console.log(`Listening on port ${port}!`))
socket.init(io)
