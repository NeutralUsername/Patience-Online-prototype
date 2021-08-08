var express = require('express'),
    app = express(),
    port = 3000,
    controller = require('./controller');
const server = require('http').Server(app);

const io = require('socket.io')(server);

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory(
  {
    points:1,
    duration: 1,
  });

var mysql = require('mysql2');
var dbCon = mysql.createConnection({
  host: "localhost",
  user: "gregaire",
  password: "password",
  database: "gregaire"
});

const pendingOnlineRooms = [];

io.on('connection', function (socket) {
  updatePendingRoomsCLIENT();

  socket.on('serverTimeREQ',  () => {
    setInterval(function () {
      socket.emit('serverTimeRES', { data: new Date() });
    },96);
  });

  socket.on('AIgameREQ', async function (data) {
    try {
      await rateLimiter.consume(socket.handshake.address);
      removePendingRoom(socket.id);
      socket.emit('AIgameRES' , { gameid : "gameid"});
    } 
    catch(rejRes) {
      console.log("flood protection");
    }
  });

  socket.on('newOnlineRoomREQ', async function (data){
    try {
      await rateLimiter.consume(socket.handshake.address);
      createPendingRoom(socket.id, data.options);
    } 
    catch(rejRes) {
      console.log("flood protection");
    }
  });

  socket.on('joinOnlineRoomREQ', async function (data) {
    try {
      await rateLimiter.consume(socket.handshake.address);
      joinPendingRoom(socket, data.roomkey);
    } 
    catch(rejRes) {
      console.log("flood protection");
    }
  });

  socket.on('disconnect', function () {
    removePendingRoom(socket.id);
  });
});

function createPendingRoom(socketid, options) {
  if( returnPendingRoomIfExists(socketid) ) {
    if(optionsAreDifferent( returnPendingRoomIfExists(socketid).options , options)) {
      removePendingRoom(socketid);
      pendingOnlineRooms.push ({
        socketid : socketid,
        options : options
      });
      updatePendingRoomsCLIENT();
    }
  }
  else {
    pendingOnlineRooms.push ({
      socketid : socketid,
      options : options
    });
    updatePendingRoomsCLIENT();
  }
}

function joinPendingRoom(socket, room) {
  if(room != socket.id)
    if(returnPendingRoomIfExists(room)) {
      socket.join(room);
      io.to(room).emit('joinOnlineGameRES', { options : returnPendingRoomIfExists(room).options });
      console.log(socket.id, room);
      removePendingRoom(room);
      removePendingRoom(socket.id);
      updatePendingRoomsCLIENT();
    }
}

function removePendingRoom(socketid) {
  if( returnPendingRoomIfExists(socketid)) {
    pendingOnlineRooms.splice(pendingOnlineRooms.findIndex(e => e.socketid == socketid), 1);
    updatePendingRoomsCLIENT();
  }
}

function updatePendingRoomsCLIENT() {
  io.sockets.emit('UpdatePendingRoomsRES' , { pendingRooms : pendingOnlineRooms});
}

function optionsAreDifferent(options1, options2) {
  if(options1.malusSize == options2.malusSize)
    if(options1.sequenceSize == options2.sequenceSize)
      if(options1.throwOnStock == options2.throwOnStock)
        if(options1.throwOnMalus == options2.throwOnMalus)
          if(options1.variant == options2.variant)
            if(options1.turnsTimed == options2.turnsTimed)
              if(options1.roundsTimed == options2.roundsTimed)  
                if(options1.timePerTurn == options2.timePerTurn)
                  if(options1.timePerRound == options2.timePerRound)
                      if(options1.roomName == options2.roomName)
                      if(options1.roomPassword == options2.roomPassword)
                        return false;
  return true;
}

function returnPendingRoomIfExists(socketid) {
  if( pendingOnlineRooms.find ( element => element.socketid === socketid) )
    return pendingOnlineRooms.find ( element => element.socketid === socketid);
  else
    return false;
}










// ===== keeping just in case i need the templates

function optionsValid(options) {
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

app.route('/ping').get(controller.root);
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/testSocketConnection.html');
});