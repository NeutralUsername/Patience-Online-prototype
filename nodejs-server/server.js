'use strict';
require('dotenv').config({ path: '.env' });

var controller = require('./controller');
var express = require('express');
const server = require('http').Server(app);
const io = require('socket.io')(server);

var app = express();
var port = process.env.NS_PORT;

server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/testSocketConnection.html');
});

io.on('connection', function (socket) {
  socket.on('customevent', function (data) {
    setInterval(function () {
      socket.emit('FromAPI', { data: new Date() });
    }, 96);
  });
});

app.route('/ping').get(controller.root);

