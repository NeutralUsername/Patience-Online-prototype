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

    socket.on ('actionMoveREQ' , function ( data) {

        var game = activeGames.find(game => game.props.id === data.gameid)
        var actorcolor = socket.id ===game.red ? "red" : socket.id ===game.black ? 'black': ''
        var opponentcolor = socket.id === game.red ? "black" : socket.id ===game.black ? 'red': ''
        var turncolor = game.state.turnplayer === game.red ? 'red' : 'black'
        if(actorcolor != turncolor)
            return
        var movingCard = db.cardIdDataPairs.find(card=> card.color === data.card.color && card.suit === data.card.suit && card.value === data.card.value)
        var stackFrom = game.state.stacks[data.card.stack]
        var stackTo =  game.state.stacks[data.to]
       
        if(data.to === opponentcolor + 'stock' )
            return 
        if(data.to === actorcolor + 'stock' )
            return 
        if(data.to === actorcolor + 'malus' )
            return 
        if(data.to === actorcolor + 'waste' )
            if(data.card.stack != actorcolor+'stock')
                return 
        if(stackTo.cards.length<1) 
            if(data.to.includes('foundation') )
                if(movingCard.value != 1)
                    return 
        if(stackTo.cards.length){
            var stackUppermostCard =  db.cardIdDataPairs.find(card=> card.cardid === stackTo.cards[stackTo.cards.length-1].cardid)

            if(data.to === opponentcolor + 'malus' ) 
                if ( stackUppermostCard.suit != movingCard.suit )
                    return 
                else 
                    if(stackUppermostCard.value != movingCard.value+1)
                        if(stackUppermostCard.value != movingCard.value-1)
                            return    
            if(data.to === opponentcolor + 'waste' ) 
                if ( stackUppermostCard.suit != movingCard.suit )
                    return 
                 else 
                    if(stackUppermostCard.value != movingCard.value+1)
                        if(stackUppermostCard.value != movingCard.value-1)
                            return     
            if(data.to.includes('foundation') ) 
                if ( stackUppermostCard.suit != movingCard.suit )
                    return
                else if ( stackUppermostCard.value != movingCard.value-1 )
                    return
            if(data.to.includes('tableau')) {
                if(  (stackUppermostCard.value -1 ) != movingCard.value )
                    return
                if(movingCard.suit === '♥' || movingCard.suit === '♦') {
                    if(stackUppermostCard.suit  === '♥' )
                        return
                    if(stackUppermostCard.suit  === '♦' )
                        return
                }
                if(movingCard.suit === '♠' || movingCard.suit === '♣'){
                    if(stackUppermostCard.suit  === '♠' )
                        return
                    if(stackUppermostCard.suit  === '♣' )
                        return
                }
            }
        }
        if(stackFrom.name === actorcolor+'stock' && stackTo.name === actorcolor+'waste') 
            game.state.turnplayer = game[opponentcolor];
        stackFrom.cards.pop()
        if(stackFrom.cards.length) 
            if( ! stackFrom.name.includes('stock'))
                stackFrom.cards[stackFrom.cards.length-1].faceup = 1
        stackTo.cards.push({cardid : movingCard.cardid, faceup : 1 , number : data.card.number})

        var clientState = prepareStateForClient(game.state)
        io.to(game.red).emit('actionMoveRES', {stacks : [clientState.stacks[data.card.stack] ,clientState.stacks[data.to]], turn : game.state.turnplayer})
        if(game.black != 'AI')
            io.to(game.black).emit('actionMoveRES', {stacks : [clientState.stacks[data.card.stack] ,clientState.stacks[data.to]], turn : game.state.turnplayer})
    }) 

    socket.on ('actionFlipREQ' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.gameid)
        var actorcolor = socket.id === game.red ? "red" : socket.id ===game.black ? 'black': ''
        var turncolor = game.state.turnplayer === game.red ? 'red' : 'black'
        if(!data.stack.includes(actorcolor))
            return
        if(actorcolor != turncolor)
            return
         var stack = game.state.stacks[data.stack]
        stack.cards[stack.cards.length-1].faceup = 1;
        var clientState = prepareStateForClient(game.state)
        io.to(game.red).emit('actionFlipRES', clientState.stacks[data.stack])
        if(game.black != 'AI')
            io.to(game.black).emit('actionFlipRES', clientState.stacks[data.stack])
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
