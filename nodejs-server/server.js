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

const pendingOnlineRooms = [];

io.on('connection', function (socket) {
  updateAvailableRoomsCLIENT();

  socket.on('serverTimeREQ', function (data) {
    setInterval(function () {
      socket.emit('serverTimeRES', { data: new Date() });
    },96);
  });

  socket.on('AIgameREQ', function (data) {
    if(OptionsValid(data.options)) {
      socket.emit('AIgameRES' , { gameid : "gameid"});
  }});

  socket.on('newOnlineRoomREQ', function (data) {
      createPendingRoom(socket.id, data.options);
  });

  socket.on('joinOnlineRoomREQ', function (data) {
    joinPendingRoom(socket.id, data.options.roomkey);
  });

  socket.on('disconnect', function () {
      removePendingRoom(socket.id);
      updateAvailableRoomsCLIENT();
  });
});

function createPendingRoom(socketid, options) {
  if(!pendingOnlineRooms.find(element=> element.socketid === socketid))
    if(OptionsValid(options)) {
      pendingOnlineRooms.push ({
        socketid : socketid,
        options : options
      });
      updateAvailableRoomsCLIENT();
    }
}

function joinPendingRoom(joiner, room) {
  if(room != joiner) 
    if(pendingOnlineRooms.find( element => element.socketid === room)) {
      io.to(room).emit('joinOnlineRoomRES', { testdata : "testdata" });
      removePendingRoom(room);
      io.to(joiner).emit('joinOnlineRoomRES', { testdata : "testdata" });
      removePendingRoom(joiner);
      updateAvailableRoomsCLIENT();
    }
}


function removePendingRoom(room) {
  if(pendingOnlineRooms.find(e => e.socketid == room))
    pendingOnlineRooms.splice(pendingOnlineRooms.findIndex(e => e.socketid == room), 1);
}

function updateAvailableRoomsCLIENT() {
 io.sockets.emit('UpdateAvailableRoomsRES' , { rooms : pendingOnlineRooms});
}

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