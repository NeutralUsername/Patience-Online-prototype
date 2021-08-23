var express = require ('express'),
    app = express (),
    port = 3000,
    controller = require ('./controller');
const server = require ('http').Server(app);
const io = require ('socket.io') (server);
const { RateLimiterMemory } = require ('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory ({
    points: 1,
    duration: 2,
});
var db = require('./db.js');
db.createDBifNotExists();
const pendingOnlineRooms = [];
const activeGames = [];

io.on ('connection', function (socket) {
    updatePendingRoomsCLIENTS ();
    socket.on('serverTimeREQ',  () => {
        setInterval(function () {
            socket.emit ('serverTimeRES', { data: new Date () });
        },96);
    });

    socket.on ('startAIgameREQ', async function (data) {
        try {
            await rateLimiter.consume (socket.handshake.address);
            addActiveRoom(socket.id, 'AI', data.options);
        }
        catch (rejRes) {
            console.log ("flood protection => startAIgameREQ");
        }
    });

    socket.on ('createOnlineRoomREQ', async function (data){
        try {
            await rateLimiter.consume (socket.handshake.address);
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
                if (returnPendingRoomIfExists (data.roomkey)) 
                    if (returnPendingRoomIfExists (data.roomkey).options.roomPassword.length) 
                        socket.emit ('roomPasswordREQ', {roomkey : data.roomkey});
                    else 
                        addActiveRoom (data.roomkey, socket.id, returnPendingRoomIfExists (data.roomkey).options );
        }    
        catch (rejRes) {
            console.log ("flood protection => join pending Room");
        }   
    });

    socket.on ('roomPasswordRES' , async function ( data) {
        if(data.password != undefined)
            if (returnPendingRoomIfExists (data.roomkey).options.roomPassword == data.password) 
                addActiveRoom (data.roomkey, socket.id, returnPendingRoomIfExists (data.roomkey).options );
    })

    socket.on ('disconnect', function () {
        removePendingRoomIfExists (socket.id);
    });
});

async function addActiveRoom (red, black, options) {

    activeGames.push( game = await db.initGame (red, black, options, new Date()  ));
    removePendingRoomIfExists (red); 
    removePendingRoomIfExists (black);
    //startTurn(game.id);
    io.to (red).emit ('startOnlineGameRES', { 
        id : game.id, 
        color : 'red', 
        throwOnWaste : game.throwOnWaste, 
        throwOnMalus : game.throwOnMalus, 
        variant : game.variant,
        initialState : {
            field :         hideFaceDownCardsFromClient(game.field),
            redtimer :      game.redtimer,
            blacktimer :    game.blacktimer,
            turntimer :     game.turntimer,
            turncolor :     game.turncolor,  
         } 
    });
    if (black != 'AI')
        io.to (black).emit ('startOnlineGameRES', { 
            id : game.id, 
            color : 'black', 
            throwOnWaste : game.throwOnWaste, 
            throwOnMalus : game.throwOnMalus, 
            variant : game.variant,
            initialState : {
                field :         hideFaceDownCardsFromClient(game.field),
                redtimer :      game.redtimer,
                blacktimer :    game.blacktimer,
                turntimer :     game.turntimer,
                turncolor :     game.turncolor,  
            } 
        });
    updatePendingRoomsCLIENTS (); 
    console.log (activeGames.length);
}

function hideFaceDownCardsFromClient (field) {
    for(var stack in field) 
        for(var card of field[stack]) 
            if(card.faceup === 0) {
                delete card.id;
                delete card.value;
                delete card.suit;
            }
    return field;
 }

function startTurn (game) {
    if(game.turncolor === 'red')
        setTimeout(playertimeout, game.redtimer*1000);
    else 
        setTimeout(playertimeout, game.blacktimer*1000);
    function playertimeout () {
        game.turncolor === 'red' ? "black won" : "red won"
    }
    socket.emit ('UpdateFieldRES', {roomkey : data.roomkey});
    socket.emit ('UpdateTimerRES', {roomkey : data.roomkey});
    socket.emit ('UpdateTurnColorRES', {roomkey : data.roomkey});
}

function addPendingRoom (roomkey, options) {
    removePendingRoomIfExists(roomkey);
    pendingOnlineRooms.push ({
        roomkey : roomkey,
        options : {
            malusSize : options.malusSize,
            tableauSize : options.tableauSize,
            throwOnWaste : options.throwOnWaste,
            throwOnMalus : options.throwOnMalus,
            variant : options.variant,
            timePerTurn : options.turnsTimed ? options.timePerTurn : -1337,
            timePerPlayer :  options.timePerPlayer,
            roomName : options.roomName,
            roomPassword : options.roomPassword,
        }
    });
    updatePendingRoomsCLIENTS ();
}

function removePendingRoomIfExists(roomkey)  {
    if(roomkey != 'AI')
        if (returnPendingRoomIfExists (roomkey)) {
            pendingOnlineRooms.splice (pendingOnlineRooms.findIndex (e => e.roomkey == roomkey), 1);
            updatePendingRoomsCLIENTS ();
        }
}

function returnPendingRoomIfExists (roomkey) {
    if (pendingOnlineRooms.find (e => e.roomkey === roomkey) )
        return pendingOnlineRooms.find (e => e.roomkey === roomkey);
    else
        return false;
}

function updatePendingRoomsCLIENTS () {
    io.sockets.emit ('UpdatePendingRoomsRES' , { pendingRooms : pendingOnlineRooms});
}


app.route('/ping').get(controller.root);
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/testSocketConnection.html');
});





