require('dotenv').config({ path: '.env' });
var db = require('./db.js');

var express = require('express'),
  app = express(),
  port = process.env.NS_PORT || 3000,
  controller = require('./controller');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.route('/ping').get(controller.root);
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/testSocketConnection.html');
});

io.on('connection', function (socket) {
  socket.on('serverTimeReq', function (data) {
    setInterval(function () {
      socket.emit('serverTimeRes', { data: new Date() });
    }, 96);
  });
});

io.on('connection', function (socket) {
  socket.on('newAIgameReq', function (data) {
    //if(data....)
    socket.emit('newAIgameRes', { res: true} );
  });
});
