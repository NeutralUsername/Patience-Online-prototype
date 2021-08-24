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
                if (getPendingRoom (data.roomkey)) 
                    if (getPendingRoom (data.roomkey).options.roomPassword.length) 
                        socket.emit ('roomPasswordREQ', {roomkey : data.roomkey});
                    else 
                        startGame (data.roomkey, socket.id, getPendingRoom (data.roomkey).options );
        }    
        catch (rejRes) {
            console.log ("flood protection => join pending Room");
        }   
    });

    socket.on ('roomPasswordRES' , function ( data) {
        if(data.password != undefined)
            if (getPendingRoom (data.roomkey).options.roomPassword === data.password) 
                startGame (data.roomkey, socket.id, getPendingRoom (data.roomkey).options );
    })

    socket.on ('GameMounted' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.id );
        var color = socket.id === game.props.red ? 'red' : socket.id === game.props.black ? 'black' : '';
        socket.emit ('UpdateGameState', prepareStateForClient(game.state, color));
    })

    socket.on ('disconnect', function () {
        removePendingRoomIfExists (socket.id);
    });
});

async function startGame (red, black, options) {
    activeGames.push( game = await db.initGame (red, black, options, new Date()  ));

    removePendingRoomIfExists (red);
    removePendingRoomIfExists (black);
    updatePendingRoomsCLIENTS (); 

    io.to (red).to(black).emit ('startOnlineGameRES', { props : game.props});
}

function prepareStateForClient (state, color) {
    for(stack in state.stacks) 
        for(card in state.stacks[stack]) 
            if(state.stacks[stack][card].faceup === 0) {
                delete state.stacks[stack][card].suit;
                delete state.stacks[stack][card].value;
            }

        state.playertimer = color === 'red' ? state.redtimer : state.blacktimer;
        state.opponenttimer = color === 'red' ? state.blacktimer : state.redtimer;

        state.stacks.playermalus = color === 'red' ? state.stacks.redmalus : state.stacks.blackmalus;
        state.stacks.playerstock = color === 'red' ? state.stacks.redstock : state.stacks.blackstock;
        state.stacks.playerwaste = color === 'red' ? state.stacks.redwaste : state.stacks.blackwaste;

        state.stacks.opponentmalus = color === 'black' ? state.stacks.redmalus : state.stacks.blackmalus;
        state.stacks.opponentstock = color === 'black' ? state.stacks.redstock : state.stacks.blackstock;
        state.stacks.opponentwaste = color === 'black' ? state.stacks.redwaste : state.stacks.blackwaste;

        state.stacks.playertableau0 = color === 'red' ? state.stacks.tableau0r : state.stacks.tableau0b;
        state.stacks.playertableau1 = color === 'red' ? state.stacks.tableau1r : state.stacks.tableau1b;
        state.stacks.playertableau2 = color === 'red' ? state.stacks.tableau2r : state.stacks.tableau2b;
        state.stacks.playertableau3 = color === 'red' ? state.stacks.tableau3r : state.stacks.tableau3b;

        state.stacks.opponenttableau0 = color === 'black' ? state.stacks.tableau0r : state.stacks.tableau0b;
        state.stacks.opponenttableau1 = color === 'black' ? state.stacks.tableau1r : state.stacks.tableau1b;
        state.stacks.opponenttableau2 = color === 'black' ? state.stacks.tableau2r : state.stacks.tableau2b;
        state.stacks.opponenttableau3 = color === 'black' ? state.stacks.tableau3r : state.stacks.tableau3b;

        delete state.redtimer;
        delete state.blacktimer;
        delete state.stacks.redmalus;
        delete state.stacks.blackmalus;
        delete state.stacks.redstock;
        delete state.stacks.blackstock;
        delete state.stacks.redwaste;
        delete state.stacks.blackwaste;
        delete state.stacks.tableau0r;
        delete state.stacks.tableau1r;
        delete state.stacks.tableau2r;
        delete state.stacks.tableau3r;
        delete state.stacks.tableau0b;
        delete state.stacks.tableau1b;
        delete state.stacks.tableau2b;
        delete state.stacks.tableau3b;

    return state;
 }

function startTurn (game) {
    if(game.turncolor === 'red')
        setTimeout(playertimeout, game.redtimer*1000);
    else 
        setTimeout(playertimeout, game.blacktimer*1000);
    function playertimeout () {
        game.turncolor === 'red' ? "black won" : "red won"
    }
    //emit initialstate 
    socket.emit ('UpdateFieldRES', {roomkey : data.roomkey});
    socket.emit ('UpdateTimerRES', {roomkey : data.roomkey});
    socket.emit ('UpdateTurnColorRES', {roomkey : data.roomkey});
}

function removePendingRoomIfExists(roomkey)  {
    if(roomkey != 'AI')
        if (getPendingRoom (roomkey)) {
            pendingOnlineRooms.splice (pendingOnlineRooms.findIndex (e => e.roomkey == roomkey), 1);
            updatePendingRoomsCLIENTS ();
        }
}

function getPendingRoom (roomkey) {
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





