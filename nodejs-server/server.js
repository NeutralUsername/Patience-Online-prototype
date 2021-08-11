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

var mysql = require ('mysql2');
var dbCon = mysql.createConnection ({
    host: "localhost",
    user: "gregaire",
    password: "password",
    database: "gregaire"
});

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
        options : options
     });
    updatePendingRoomsCLIENT ();
}

async function startPendingRoom (red, black) {
    const gameid = initGame (red, black, returnPendingRoomIfExists (red).options);
    removePendingRoomIfExists (red);
    removePendingRoomIfExists (black);

    io.to (red).emit ('startOnlineGameRES', { gameid : gameid });
    io.to (black).emit ('startOnlineGameRES' , {  gameid : gameid });
    
    console.log (red," vs. ", black, " gameid: ", gameid);
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
    if (options1.sequenceSize == options2.sequenceSize)
      if (options1.throwOnWaste == options2.throwOnWaste)
        if (options1.throwOnMalus == options2.throwOnMalus)
          if (options1.variant == options2.variant)
            if (options1.turnsTimed == options2.turnsTimed)
              if (options1.roundsTimed == options2.roundsTimed)  
                if (options1.timePerTurn == options2.timePerTurn)
                  if (options1.timePerRound == options2.timePerRound)
                    if (options1.roomName == options2.roomName)
                      if (options1.roomPassword == options2.roomPassword)
                        return false;
  return true;
}

async function initGame (red, black, options) {
    dbCon.connect(function(err) { if (err) throw err;

        dbCon.query("INSERT INTO options "
        +"VALUES ("
        +"0 ,"
        + options.malusSize + ", "
        + options.sequenceSize +", "
        + options.throwOnWaste +", "
        + options.throwOnMalus +", "
        + "'"+options.variant+"'" +", "
        + options.turnsTimed +", "
        + options.timePerTurn +", "
        + options.roundsTimed +", "
        + options.timePerRound +", "
        + (options.roomName     != "" ? "'"+options.roomName+"'"     : "null" )+", "
        + (options.roomPassword != "" ? "'"+options.roomPassword+"'" : "null" )+");", 
        function (err, result) { if (err) throw err;
            console.log(result.insertId);
        });
    });
    return -1337;
}

class Card {
    constructor (set, suit, value) { 
        this.set = set;
        this.suit = suit;
        this.value = value;
    }
}

function freshDeck(set) {
    const Suits = ["♥", "♠", "♦", "♣"];
    const Values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    return Suits.flatMap(suit => {
        return Values.map(value => {
            return new Card (set, suit, value)
        });
    });
}  

function shuffle(deck) {
    var currentIndex = deck.length,  randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [deck[currentIndex], deck[randomIndex]] = [
            deck[randomIndex], deck[currentIndex]];
    } 
    return decks;
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