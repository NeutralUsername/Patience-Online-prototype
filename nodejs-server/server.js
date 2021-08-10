var express = require('express'),
    app = express(),
    port = 3000,
    controller = require('./controller');
const server = require('http').Server(app);

const io = require('socket.io')(server);

const { RateLimiterMemory } = require('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory(
  {
    points: 3,
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

  socket.on('startAIgameREQ', async function (data) {
    try {
      await rateLimiter.consume(socket.handshake.address);
      removePendingRoomIfExists(socket.id);
      socket.emit('startAIgameRES' , { gameid : "gameid"});
    } 
    catch(rejRes) {
      console.log("flood protection => AI Game");
    }
  });

  socket.on('createOnlineRoomREQ', async function (data){
    try {
      await rateLimiter.consume(socket.handshake.address);
      if( returnPendingRoomIfExists(socket.id) ) {
        if(optionsAreDifferent( returnPendingRoomIfExists(socket.id).options , data.options)) {
          removePendingRoomIfExists(socket.id);
          addPendingRoom(socket, data.options) ;
        }
      }
      else 
        addPendingRoom(socket, data.options) ;
    } 
    catch(rejRes) {
      console.log("flood protection => new pending Room");
    }
  });

  socket.on('joinOnlineRoomREQ', async function (data) {
    try {
      await rateLimiter.consume(socket.handshake.address);
      if(data.roomkey != socket.id)
        if(returnPendingRoomIfExists(data.roomkey)) {
          if(returnPendingRoomIfExists(data.roomkey).options.roomPassword.length  == 0) 
            startPendingRoom(socket, data.roomkey);
          else 
            socket.emit('roomPasswordREQ', {roomkey : data.roomkey});
        }
    } 
    catch(rejRes) {
      console.log("flood protection => join pending Room");
    }
  });

  socket.on('roomPasswordRES' , async function ( data) {
      if(returnPendingRoomIfExists(data.roomkey).options.roomPassword == data.password) 
        startPendingRoom(socket, data.roomkey);
  })

  socket.on('disconnect', function () {
    removePendingRoomIfExists(socket.id);
  });
});

function addPendingRoom(socket, options) {
  pendingOnlineRooms.push ({
    roomkey : socket.id,
    options : options
  });
  updatePendingRoomsCLIENT();
}

async function startPendingRoom (socket, room) {
  removePendingRoomIfExists(room);
  removePendingRoomIfExists(socket.id);
  io.to(room).emit('startOnlineGameRES', { gameid : "gameid" });
  io.to(socket.id).emit('startOnlineGameRES' , {  gameid : "gameid" });
  
  console.log(socket.id, room);
  
  updatePendingRoomsCLIENT();
}

class Game {
  constructor(gameid) {
    this.gameid = "gameid";
    this.options = {
      malusSize : "malusSize",
      sequenceSize : "sequenceSize",
      throwOnWaste : "throwOnWaste",
      throwOnMalus : "throwOnMalus",
      variant : "variant",
      turnsTimed : "turnsTimed",
      timePerTurn : "timePerTurn",
      roundsTimed : "roundsTimed",
      timePerRound : "timePerRound",
      roomName : "roomName",
      roomPassword : "roomPassword",
    }
    this.decks = {
      redDeck : [],
      blackDeck : [],
    }
    this.stacks = {
      red : {
        drawpile : 'stack',
        discardpile : 'stack',
        malussequence : 'sequence',
      },
      black : {
        drawpile : 'stack',
        discardpile : 'stack',
        malussequence : 'sequence',
      },
      field :  {
      foundation1 : 'stack',
      foundation2 : 'stack',
      foundation3 : 'stack',
      foundation4 : 'stack',
      foundation5 : 'stack',
      foundation6 : 'stack',
      foundation7 : 'stack',
      foundation8 : 'stack',
      tableau1 : 'sequence',
      tableau2 : 'sequence',
      tableau3 : 'sequence',
      tableau4 : 'sequence',
      tableau5 : 'sequence',
      tableau6 : 'sequence',
      tableau7 : 'sequence',
      tableau8 : 'sequence'
      }
    }
    
    this.actions = [];
  }
}

function removePendingRoomIfExists(roomkey) {
  if( returnPendingRoomIfExists(roomkey)) {
    pendingOnlineRooms.splice(pendingOnlineRooms.findIndex(e => e.roomkey == roomkey), 1);
    updatePendingRoomsCLIENT();
  }
}

function returnPendingRoomIfExists(roomkey) {
  if( pendingOnlineRooms.find ( e => e.roomkey === roomkey) )
    return pendingOnlineRooms.find ( e => e.roomkey === roomkey);
  else
    return false;
}

function updatePendingRoomsCLIENT() {
  io.sockets.emit('UpdatePendingRoomsRES' , { pendingRooms : pendingOnlineRooms});
}

function optionsAreDifferent(options1, options2) {
  if(options1.malusSize == options2.malusSize)
    if(options1.sequenceSize == options2.sequenceSize)
      if(options1.throwOnWaste == options2.throwOnWaste)
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

function Stack (props) {

}

function Sequence (props) {
  //return React.createElement("div", {id: 'someId', className: "someClass"}, "")
  
}

function Card (props) {
 
}

function shuffle(decks) {
  for(var i = 0; i< decks.length; i++) {
      var currentIndex = decks[i].length,  randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [decks[i][currentIndex], decks[i][randomIndex]] = [
          decks[i][randomIndex], decks[i][currentIndex]];
      }
  }
  return decks;
}

function freshDeck(set) {
  const Suits = ["♠", "♥", "♦", "♣"];
  const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  function handleDrag() {

  }
  function handleDrop() {

  }
  return Suits.flatMap(suit => {
      return Values.map(value => {
         
      });
  });
}  








// ===== keeping just in case i need the templates

function optionsValid(options) {
  if(options.malusSize >= 5 && options.malusSize <= 20)
    if(options.sequenceSize >= 1 && options.sequenceSize <= 6)
      if(options.throwOnWaste === true || options.throwOnWaste === false)
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