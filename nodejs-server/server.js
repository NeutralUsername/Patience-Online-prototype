const server = require ('http').Server(app);
var express = require ('express'),
    app = express (),
    port = 3000;
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
const io = require ('socket.io') (server);
const { RateLimiterMemory } = require ('rate-limiter-flexible');
const rateLimiter = new RateLimiterMemory ({
    points: 1,
    duration: .1,
});
var db = require('./db.js');
db.createDBifNotExists()
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

    socket.on ('startREQ' , function ( data) {
        
    })

    socket.on ('actionREQ' , function ( data) {
        
        var game = activeGames.find(game => game.props.id === data.gameid)
        var cardid = db.cardIdDataPairs.find(card=> card.color === data.card.color && card.suit === data.card.suit && card.value === data.card.value).cardid
        var stackFrom = game.state.stacks[data.card.stack]
        
        game.state.stacks[data.to].cards.push({cardid : cardid, faceup : 1 , number : data.card.number})

        stackFrom.cards.pop()
        if(stackFrom.cards[stackFrom.cards.length-1])
            if( ! stackFrom.name.includes('pile'))
                stackFrom.cards[stackFrom.cards.length-1].faceup = 1

        io.to(game.red).emit('actionRES',prepareStateForClient(game.state))
        if(game.black != 'AI')
            io.to(game.black).emit('actionRES', prepareStateForClient(game.state))
    }) 

    socket.on ('disconnect', function () {
        removePendingRoom (socket.id);
    });
});

async function startGame (red, black, options) {
    removePendingRoom (red);
    black != 'AI' ? removePendingRoom (black):'';
    updateClientPendingRooms (); 
    for(var i = 0; i< 1; i++) {
        activeGames.push( game = await db.initGame (red, black, options, new Date()  ));
        console.log(game.props.id);
    }
    io.to (red).emit ('startOnlineGameRES', { color : 'red', props : game.props, initialState : prepareStateForClient(game.state)});
    if(black != 'AI')
        io.to(black).emit ('startOnlineGameRES', {color : 'black', props : game.props, initialState : prepareStateForClient(game.state)}) ;
}

function prepareStateForClient (state) {
    var clientState = JSON.parse(JSON.stringify(state));
    Object.keys( clientState.stacks).map(stack=> {
        if( clientState.stacks[stack].cards.length> 0) 
            for(card of  clientState.stacks[stack].cards) {
                var carddata = db.cardIdDataPairs.find(x=>x.cardid === card.cardid)
                delete card.cardid
                card.color = carddata.color
                if(card.faceup) {
                    card.suit = carddata.suit
                    card.value = carddata.value
                }
            }
     })
    return clientState
 }

function removePendingRoom(roomkey)  {
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
