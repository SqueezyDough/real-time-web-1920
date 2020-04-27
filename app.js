'use strict'
const express = require('express'),
      path = require('path'),
      cors = require('cors'),
      cookieParser = require('cookie-parser'),
      exphbs = require('express-handlebars'),
      bodyParser = require('body-parser'),
      router = require('./routes/index.routes'),
      spotifyRouter = require('./routes/spotify.routes'),
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
    .use(bodyParser.urlencoded({ extended: false }))
    .use('/', spotifyRouter)
    .set('view engine', 'hbs')
    .engine('hbs', exphbs({
        extname: '.hbs',
        defaultLayout: 'main',
        partialsDir: path.join(__dirname, 'views/partials')
    }))

server.listen(port, () => console.log(`Listening on port ${port}!`))
router.init(app, io)