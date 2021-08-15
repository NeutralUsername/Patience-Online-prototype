var express = require ('express'),
    app = express (),
    port = 3000,
    controller = require ('./controller');
const server = require ('http').Server(app);
const io = require ('socket.io') (server);
const { RateLimiterMemory } = require ('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory ({
    points: 1,
    duration: 1,
});

var db = require('./db.js');
db.createDBifNotExists();

const pendingOnlineRooms = [];
const activeGames = [];
io.on ('connection', function (socket) {
    updatePendingRoomsCLIENT ();

    socket.on('serverTimeREQ',  () => {
        setInterval(function () {
            socket.emit ('serverTimeRES', { data: new Date () });
        },96);
    });

    socket.on ('startAIgameREQ', async function (data) {
        try {
            await rateLimiter.consume (socket.handshake.address);
            removePendingRoomIfExists (socket.id);
            socket.emit('startAIgameRES' , { gameid : "gameid"});
        }    
        catch (rejRes) {
            console.log("flood protection => AI Game");
        }
        });

    socket.on ('createOnlineRoomREQ', async function (data){
        try {
            await rateLimiter.consume (socket.handshake.address);
            if( returnPendingRoomIfExists (socket.id) ) {
                if(optionsAreDifferent( returnPendingRoomIfExists (socket.id).options , data.options)) {
                    removePendingRoomIfExists (socket.id);
                    addPendingRoom (socket.id, data.options) ;
                }
            }
            else 
                addPendingRoom (socket.id, data.options) ;
        }        
        catch (rejRes) {
            console.log ("flood protection => new pending Room");
        }
    });

    socket.on ('joinOnlineRoomREQ', async function (data) {
        try {
            await rateLimiter.consume (socket.handshake.address);
            if (data.roomkey != socket.id)
                if (returnPendingRoomIfExists (data.roomkey)) {
                    if (returnPendingRoomIfExists (data.roomkey).options.roomPassword.length  == 0) 
                        startPendingRoom (data.roomkey, socket.id);
                    else 
                        socket.emit ('roomPasswordREQ', {roomkey : data.roomkey});
                }
        }    
        catch (rejRes) {
            console.log ("flood protection => join pending Room");
        }   
    });

    socket.on ('roomPasswordRES' , async function ( data) {
        if(data.password != undefined)
            if (returnPendingRoomIfExists (data.roomkey).options.roomPassword == data.password) 
                startPendingRoom (data.roomkey, socket.id);
    })

    socket.on ('disconnect', function () {
        removePendingRoomIfExists (socket.id);
    });
});

function addPendingRoom (roomkey, options) {
     pendingOnlineRooms.push ({
        roomkey : roomkey,
        options : {
            malusSize : options.malusSize,
            tableauSize : options.tableauSize,
            throwOnWaste : options.throwOnWaste,
            throwOnMalus : options.throwOnMalus,
            variant : options.variant,
            turnsTimed : options.turnsTimed,
            timePerTurn : options.timePerTurn,
            playersTimed : options.playersTimed,
            timePerPlayer : options.timePerPlayer,
            roomName : options.roomName,
            roomPassword : options.roomPassword,
        }
     });
    updatePendingRoomsCLIENT ();
}

async function startPendingRoom (red, black) {
    activeGames.push( game = await db.initGame (red, black, shuffle(freshDeck("red")), shuffle(freshDeck("black")) , returnPendingRoomIfExists(red).options ) );
    removePendingRoomIfExists (red);
    removePendingRoomIfExists (black);

    io.to (red).emit ('startOnlineGameRES', { gameid : game.id });
    io.to (black).emit ('startOnlineGameRES' , {  gameid : game.id });
    
    console.log (red," vs. ", black, " gameid: ", game.id);
    updatePendingRoomsCLIENT ();
}

function removePendingRoomIfExists (roomkey) {
    if (returnPendingRoomIfExists (roomkey)) {
        pendingOnlineRooms.splice (pendingOnlineRooms.findIndex (e => e.roomkey == roomkey), 1);
        updatePendingRoomsCLIENT ();
    }
}

function returnPendingRoomIfExists (roomkey) {
    if (pendingOnlineRooms.find (e => e.roomkey === roomkey) )
        return pendingOnlineRooms.find (e => e.roomkey === roomkey);
    else
        return false;
}

function updatePendingRoomsCLIENT () {
    io.sockets.emit ('UpdatePendingRoomsRES' , { pendingRooms : pendingOnlineRooms});
}

function optionsAreDifferent (options1, options2) {
  if (options1.malusSize == options2.malusSize)
    if (options1.tableauSize == options2.tableauSize)
      if (options1.throwOnWaste == options2.throwOnWaste)
        if (options1.throwOnMalus == options2.throwOnMalus)
          if (options1.variant == options2.variant)
            if (options1.turnsTimed == options2.turnsTimed)
              if (options1.playersTimed == options2.playersTimed)  
                if (options1.timePerTurn == options2.timePerTurn)
                  if (options1.timePerPlayer == options2.timePerPlayer)
                    if (options1.roomName == options2.roomName)
                      if (options1.roomPassword == options2.roomPassword)
                        return false;
  return true;
}

class Card {
    constructor (color, suit, value) { 
        this.color = color;
        this.suit = suit;
        this.value = value;
        this.faceup = false;
    }
}

function freshDeck (color) {
    const Suits = ["♥", "♠", "♦", "♣"];
    const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    return Suits.flatMap(suit => {
        return Values.map(value => {
            return new Card (color, suit, value)
        });
    });
}  

function shuffle (deck) {
    var currentIndex = deck.length,  randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [deck[currentIndex], deck[randomIndex]] = [
            deck[randomIndex], deck[currentIndex]];
    } 
    return deck;
}







// ===== keeping just in case i need the templates

app.route('/ping').get(controller.root);
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/testSocketConnection.html');
});

function optionsValid(options) {
  if(options.malusSize >= 5 && options.malusSize <= 20)
    if(options.tableauSize >= 1 && options.tableauSize <= 6)
      if(options.throwOnWaste === true || options.throwOnWaste === false)
        if(options.throwOnMalus === true || options.throwOnMalus === false)
          if(options.variant === 'Patience' || options.variant === 'Klondike')
            if(options.turnsTimed === true || options.turnsTimed === false)
              if(options.playersTimed === true || options.playersTimed === false)
                if(options.timePerTurn >= 15 && options.timePerTurn <= 300)
                  if(options.timePerPlayer >= 600 && options.timePerPlayer <= 3600)
                    return true;
  return false;
}

