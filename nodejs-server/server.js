'use strict';
require('dotenv').config({ path: '.env' });

var express = require('express'),
  app = express(),
  port = process.env.NS_PORT || 3000,
  controller = require('./controller');

const server = require('http').Server(app);
const io = require('socket.io')(server);

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




var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "gregaire",
  password: "password"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});