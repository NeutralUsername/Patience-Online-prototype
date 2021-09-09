var cors = require('cors')

const server = require ('http').Server(app);
var express = require ('express'),
    app = express (),
    port = process.env.PORT || 3000
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
/*
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  */
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

    socket.on ('actionMoveREQ' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.gameid)
        var actorcolor = socket.id ===game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var turncolor = game.state.turnplayer === game.props.red ? 'red' : 'black' 
        var movingCardData = db.cardIdDataPairs.find(card=> card.color === data.card.color && card.suit === data.card.suit && card.value === data.card.value)
        var stackTo =  game.state.stacks[data.to]
        var opponentcolor = socket.id === game.props.red ? "black" : socket.id ===game.props.black ? 'red': ''
        var stackFrom = game.state.stacks[data.card.stack]

        if(actorcolor != turncolor)
            return
        if(data.to === actorcolor + 'stock' )
            return 
        if(data.to === actorcolor + 'malus' )
            return 
        if(data.to === actorcolor + 'waste' )
            if(data.card.stack != actorcolor+'stock')
                return 
        if(data.to === opponentcolor + 'stock' )
             return 
        if(stackTo.cards.length){
            var stackUppermostCard =  db.cardIdDataPairs.find(card=> card.cardid === stackTo.cards[stackTo.cards.length-1].cardid)
            if(data.to === opponentcolor + 'malus' || data.to === opponentcolor + 'waste' ) 
                if (  stackUppermostCard.suit === movingCardData.suit ){
                    if ( parseInt(stackUppermostCard.value) != parseInt(movingCardData.value)+1 )
                        if ( parseInt(stackUppermostCard.value) != parseInt(movingCardData.value)-1 )
                            return
                }
                else
                    return
            if(data.to.includes('foundation') ) 
                if ( stackUppermostCard.suit != movingCardData.suit )
                    return
                else if ( stackUppermostCard.value != movingCardData.value-1 )
                    return
            if(data.to.includes('tableau')) {
                if( (stackUppermostCard.value -1 ) != movingCardData.value )
                    return
                if(movingCardData.suit === '♥' || movingCardData.suit === '♦') 
                    if(stackUppermostCard.suit  === '♥' || stackUppermostCard.suit  === '♦'  )
                        return
                if(movingCardData.suit === '♠' || movingCardData.suit === '♣')
                    if(stackUppermostCard.suit  === '♠' || stackUppermostCard.suit  === '♣' )
                        return
            }
        }
        else {
            if(data.to.includes('foundation') )
                if(movingCardData.value != 1)
                    return 
            if(data.to === opponentcolor+'waste')
                if(!stackTo.length)
                    return
        }
      
        var movingCard = stackFrom.cards.pop()
        stackTo.cards.push( movingCard )
        if(stackFrom.name === actorcolor+'stock') {
            if( stackTo.name === actorcolor+'waste')
                game.state.turnplayer = game.props[opponentcolor];
            if(!stackFrom.cards.length) 
                if(game.state.stacks[actorcolor+"stock"].cards.length === 0) {
                    var length = game.state.stacks[actorcolor+"waste"].cards.length
                    for(var i = 0 ; i< length; i++) {
                        var card = game.state.stacks[actorcolor+"waste"].cards.pop()
                        card.faceup = 0
                        game.state.stacks[actorcolor+"stock"].cards.push(card);
                    }
                }
        }
        if(stackFrom.cards.length) 
            if (stackFrom.name != actorcolor+'stock' )
                stackFrom.cards[stackFrom.cards.length-1].faceup = 1
                
        db.insertMove(game.props.id,movingCard.cardid, data.to, 1, actorcolor, -999, new Date())
        var clientStackFrom = prepareStackForClient(stackFrom)
        var clientStackTo = prepareStackForClient(stackTo)
        io.to(game.props.red).emit('actionMoveRES', {stacks : [clientStackFrom ,clientStackTo], turn : game.state.turnplayer})
        if(game.props.black != 'AI')
            io.to(game.props.black).emit('actionMoveRES', {stacks : [clientStackFrom ,clientStackTo], turn : game.state.turnplayer})
    }) 

    socket.on ('actionFlipREQ' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.gameid)
        var actorcolor = socket.id === game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var turncolor = game.state.turnplayer === game.props.red ? 'red' : 'black'
        if(!data.stack.includes(actorcolor))
            return
        if(!data.stack.includes('stock'))
            return
        if(actorcolor != turncolor)
            return 
        var stack = game.state.stacks[data.stack]
        stack.cards[stack.cards.length-1].faceup = 1;
        db.insertMove(game.props.id, stack.cards[stack.cards.length-1].cardid, data.stack, 1, actorcolor, -999, new Date())
        var clientStack = prepareStackForClient(game.state.stacks[data.stack])
        io.to(game.props.red).emit('actionFlipRES', clientStack)
        if(game.props.black != 'AI')
            io.to(game.props.black).emit('actionFlipRES', clientStack)
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
    io.to (red).emit ('startGameRES', { color : 'red', props : game.props, initialState : prepareStateForClient(game.state)});
    if(black != 'AI')
        io.to(black).emit ('starGameRES', {color : 'black', props : game.props, initialState : prepareStateForClient(game.state)}) ;
}

function prepareStackForClient (stack) {
    var clientStack =  JSON.parse(JSON.stringify(stack));
    if( clientStack.cards.length> 0) 
        for(card of  clientStack.cards) {
            var carddata = db.cardIdDataPairs.find(x=>x.cardid === card.cardid)
            delete card.cardid
            card.color = carddata.color
            if(card.faceup) {
                card.suit = carddata.suit
                card.value = carddata.value
            }
        }
    return clientStack
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

function roundtimer (game) {
  

    
    socket.emit ('UpdateFieldRES', {roomkey : data.roomkey});
    socket.emit ('UpdateTimerRES', {roomkey : data.roomkey});
    socket.emit ('UpdateTurnColorRES', {roomkey : data.roomkey});
}

function playertimeout () {
    return 
}

function opponenttimeout () {
    game.turncolor === 'red' ? "black won" : "red won"
}