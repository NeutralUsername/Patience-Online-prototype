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
    updateClientPendingRooms ();
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
            removePendingRoom(socket.id);
            pendingOnlineRooms.push ({
                roomkey : socket.id,
                options : data.options
            });
            updateClientPendingRooms ();
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
        removePendingRoom (socket.id);
    });
});

async function startGame (red, black, options) {
    activeGames.push( game = await db.initGame (red, black, options, new Date()  ));

    removePendingRoom (red);
    removePendingRoom (black);
    updateClientPendingRooms (); 
    
    console.log(game.props.id);
    io.to (red).to(black).emit ('startOnlineGameRES', { id : game.props.id});
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

function removePendingRoom(roomkey)  {
    if(roomkey != 'AI')
        if (getPendingRoom (roomkey)) {
            pendingOnlineRooms.splice (pendingOnlineRooms.findIndex (e => e.roomkey == roomkey), 1);
            updateClientPendingRooms ();
        }
}

function getPendingRoom (roomkey) {
    if (pendingOnlineRooms.find (e => e.roomkey === roomkey) )
        return pendingOnlineRooms.find (e => e.roomkey === roomkey);
    else
        return false;
}

function updateClientPendingRooms () {
    io.sockets.emit ('UpdatePendingRoomsRES' , { pendingRooms : pendingOnlineRooms});
}


app.route('/ping').get(controller.root);
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/testSocketConnection.html');
});

function prepareStateForClient (state, color) {
    var stacks = JSON.parse(JSON.stringify(state.stacks));
    for(stack in stacks) 
        for(card in stacks[stack]) {
            if(stacks[stack][card].faceup === 0) {
                delete stacks[stack][card].suit;
                delete stacks[stack][card].value;
            } 
        }    
    return {
        opponenttimer : color === 'red' ? state.blacktimer : state.redtimer,
        playertimer : color === 'red' ? state.redtimer : state.blacktimer, 
        turntimer : state.turntimer,
        turncolor : state.turncolor,     
        turn : state.turn,
        stacks : {
            playermalus : color === 'red' ? stacks.redmalus : stacks.blackmalus,
            playerstock : color === 'red' ? stacks.redstock : stacks.blackstock,
            playerwaste : color === 'red' ? stacks.redwaste : stacks.blackwaste,
            opponentmalus : color === 'black' ? stacks.redmalus : stacks.blackmalus,
            opponentstock : color === 'black' ? stacks.redstock : stacks.blackstock,
            opponentwaste : color === 'black' ? stacks.redwaste : stacks.blackwaste,
            playertableau0 : color === 'red' ? stacks.tableau0r : stacks.tableau0b,
            playertableau1 : color === 'red' ? stacks.tableau1r : stacks.tableau1b,
            playertableau2 : color === 'red' ? stacks.tableau2r : stacks.tableau2b,
            playertableau3 : color === 'red' ? stacks.tableau3r : stacks.tableau3b,
            opponenttableau0 : color === 'black' ? stacks.tableau0r : stacks.tableau0b,
            opponenttableau1 : color === 'black' ? stacks.tableau1r : stacks.tableau1b,
            opponenttableau2 : color === 'black' ? stacks.tableau2r : stacks.tableau2b,
            opponenttableau3 : color === 'black' ? stacks.tableau3r : stacks.tableau3b,
            playerfoundation0 : color === 'red' ? stacks.foundation0r : stacks.foundation0b,
            playerfoundation1 : color === 'red' ? stacks.foundation1r : stacks.foundation1b,
            playerfoundation2 : color === 'red' ? stacks.foundation2r : stacks.foundation2b,
            playerfoundation3 : color === 'red' ? stacks.foundation3r : stacks.foundation3b,
            opponentfoundation0 : color === 'black' ? stacks.foundation0r : stacks.foundation0b,
            opponentfoundation1 : color === 'black' ? stacks.foundation1r : stacks.foundation1b,
            opponentfoundation2 : color === 'black' ? stacks.foundation2r : stacks.foundation2b,
            opponentfoundation3 : color === 'black' ? stacks.foundation3r : stacks.foundation3b,
        }
    };
 }


