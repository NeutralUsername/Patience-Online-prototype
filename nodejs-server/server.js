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
    updatePendingRoomsCLIENTS ();
    socket.on('serverTimeREQ',  () => {
        setInterval(function () {
            socket.emit ('serverTimeRES', { data: new Date () });
        },96);
    });

    socket.on ('startAIgameREQ', async function (data) {
        try {
            await rateLimiter.consume (socket.handshake.address);
            startGame(socket.id, 'AI', data.options);
        }
        catch (rejRes) {
            console.log ("flood protection => startAIgameREQ");
        }
    });

    socket.on ('createOnlineRoomREQ', async function (data){
        try {
            await rateLimiter.consume (socket.handshake.address);
            removePendingRoomIfExists(socket.id);
            pendingOnlineRooms.push ({
                roomkey : socket.id,
                options : data.options
            });
            updatePendingRoomsCLIENTS ();
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
                        startGame (data.roomkey, socket.id, returnPendingRoomIfExists (data.roomkey).options );
        }    
        catch (rejRes) {
            console.log ("flood protection => join pending Room");
        }   
    });

    socket.on ('roomPasswordRES' , async function ( data) {
        if(data.password != undefined)
            if (returnPendingRoomIfExists (data.roomkey).options.roomPassword == data.password) 
                startGame (data.roomkey, socket.id, returnPendingRoomIfExists (data.roomkey).options );
    })

    socket.on ('disconnect', function () {
        removePendingRoomIfExists (socket.id);
    });
});

async function startGame (red, black, options) {
    options.timePerTurn = options.turnsTimed ? options.timePerTurn : 0,

    activeGames.push( game = await db.initGame (red, black, options, new Date()  ));
    removePendingRoomIfExists (red); removePendingRoomIfExists (black);

    //startTurn(game.id);

    var clientinitialstate = game.state;
    clientinitialstate.stacks = prepareStacksForClient(clientinitialstate.stacks)
    io.to (red).to(black).emit ('startOnlineGameRES', { props : game.props, initialstate : clientinitialstate});
    
    updatePendingRoomsCLIENTS (); 
}

function prepareStacksForClient (stacks) {
    for(var stack in stacks) 
        for(var card of stacks[stack].cards) {
            if(card.faceup === 0) {
                delete card.value;
                delete card.suit;
            }
            delete card.faceup
        }
    return stacks;
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





