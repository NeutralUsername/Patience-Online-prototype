var express = require('express'),
  app = express(),
  port = 3000,
  controller = require('./controller');
const server = require('http').Server(app);
const io = require('socket.io')(server);

var mysql = require('mysql2');
var dbCon = mysql.createConnection({
  host: "localhost",
  user: "gregaire",
  password: "password",
  database: "gregaire"
});

app.route('/ping').get(controller.root);
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/testSocketConnection.html');
});

io.on('connection', function (socket) {
  console.log(Object.keys(io.sockets.sockets));
  socket.on('serverTimeREQ', function (data) {
    setInterval(function () {
      socket.emit('serverTimeRES', { data: new Date() });
    },96);
  });

  socket.on('AIgameREQ', function (data) {
    if(OptionsValid(data.options)) {
      socket.emit('AIgameRES' , { gameid : "gameid"});
  }});

  socket.on('newONLINEgameREQ', function (data) {
    if(OptionsValid(data.options)) {
      socket.emit('newONLINEgameRES' , { socketid : socket.id });
    }
  });

  socket.on('joinONLINEgameREQ', function (data) {
    if(data.options.roomkey != socket.id) {
      io.to(data.options.roomkey).emit('availableREQ', { socketid : socket.id });
    }
  });

  socket.on('availableRES', function (data) {
    io.to(data.socketid).emit('startONLINEgame', { socketid : socket.id });
    io.to(socket.id).emit('startONLINEgame', { socketid : socket.id });
  });
});

function OptionsValid(options) {
  if(options.malusSize >= 5 && options.malusSize <= 20)
    if(options.sequenceSize >= 1 && options.sequenceSize <= 6)
      if(options.throwOnStock === true || options.throwOnStock === false)
        if(options.throwOnMalus === true || options.throwOnMalus === false)
          if(options.variant === 'Patience' || options.variant === 'Klondike')
            if(options.turnsTimed === true || options.turnsTimed === false)
              if(options.roundsTimed === true || options.roundsTimed === false)
                if(options.timePerTurn >= 15 && options.timePerTurn <= 300)
                  if(options.timePerRound >= 600 && options.timePerRound <= 3600)
                      return true;
  
  return false;
}

function initializeAIgame(options){
  
}