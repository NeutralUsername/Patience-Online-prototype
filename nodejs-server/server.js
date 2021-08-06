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

const waitingClients = [];

io.on('connection', function (socket) {

  socket.on('serverTimeREQ', function (data) {
    setInterval(function () {
      socket.emit('serverTimeRES', { data: new Date() });
    },96);
  });

  socket.on('UpdateAvailableRoomsREQ', function (data) {
      io.sockets.emit('UpdateAvailableRoomsRES' , { rooms : waitingClients});
  });

  socket.on('AIgameREQ', function (data) {
    if(OptionsValid(data.options)) {
      socket.emit('AIgameRES' , { gameid : "gameid"});
  }});

  socket.on('lookingForPlayerREQ', function (data) {
    if(OptionsValid(data.options)) {
      if(!waitingClients.find(element=> element.socketid === socket.id)) {
        waitingClients.push ({
          socketid : socket.id, 
          options : data.options
        });
        socket.emit('lookingForPlayerRES' );
      }
    }
  });

  socket.on('joinONLINEgameREQ', function (data) {
    if(data.options.roomkey != socket.id) 
      if(waitingClients.find( element => element.socketid === data.options.roomkey)) {
        io.to(data.options.roomkey).emit('joinONLINEgameRES', { socketid : socket.id });
        io.to(socket.id).emit('joinONLINEgameRES', { socketid : socket.id });
        waitingClients.splice(waitingClients.findIndex(element => element.socketid === data.options.roomkey), 1,)
        io.sockets.emit('UpdateAvailableRoomsRES' , { rooms : waitingClients});
      }
  });

  socket.on('disconnect', function () {
    waitingClients.forEach(e=> console.log(e.socketid));
    if(waitingClients.find(element => element.socketid === socket.id))
      waitingClients.splice(waitingClients.findIndex(element => element.socketid === socket.id), 1)
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