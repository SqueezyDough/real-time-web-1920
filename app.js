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

io.on('connection', () => {
    console.log('user connected')
});