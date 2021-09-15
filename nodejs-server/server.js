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
db.tryCreateDB()
const pendingOnlineRooms = [];
const activeGames = [];

io.on ('connection', function (socket) {
    updateClientPendingRooms ();
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
        if(!game)
            return
        var actorcolor = socket.id ===game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var turncolor = game.state.turncolor
        var movingCardData = data.card
        var stackTo =  game.state.stacks[data.to]
        var opponentcolor = socket.id === game.props.red ? "black" : socket.id ===game.props.black ? 'red': ''
        var stackFrom = game.state.stacks[data.card.stack]

        if(actorcolor != turncolor)
            return
        if(data.to === turncolor + 'stock' )
            return 
        if(data.to === turncolor + 'malus' )
            return 
        if(data.to === turncolor + 'waste' )
            if(data.card.stack != turncolor+'stock')
                return 
        if(data.to === opponentcolor + 'stock' )
             return 
        if(stackTo.cards.length){
            var stackUppermostCard = stackTo.cards[stackTo.cards.length - 1 ]
            if(data.to === opponentcolor + 'malus' || data.to === opponentcolor + 'waste' ) 
                if ( stackUppermostCard.suit === movingCardData.suit ) {
                    if ( parseInt(stackUppermostCard.value) != parseInt(movingCardData.value) + 1 )
                        if ( parseInt(stackUppermostCard.value) != parseInt(movingCardData.value) - 1 )
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
        db.insertAction(game.props.id, movingCard.color, movingCard.suit, movingCard.value, data.to, "redtimer", "blacktimer", actorcolor, game.state.turn)
        stackTo.cards.push( movingCard )
        if(stackFrom.name === turncolor+'stock') {
            if( stackTo.name === turncolor+'waste') {
                game.state.turn++
                if(game.state.turncolor === 'red' ? game.state.blacktimer > 0 : game.state.redtimer > 0)
                    game.state.turncolor = game.state.turncolor === 'red' ? 'black' : 'red'
            }
            if(!stackFrom.cards.length) {
                var wasteSize = game.state.stacks[turncolor+"waste"].cards.length
                for(var i = 0 ; i< wasteSize; i++) {
                    var card = game.state.stacks[turncolor+"waste"].cards.pop()
                    card.faceup = 0
                    game.state.stacks[turncolor+"stock"].cards.push(card);
                }
            }
        }
        if(stackFrom.cards.length) 
            if (stackFrom.name != turncolor+'stock' )
                stackFrom.cards[stackFrom.cards.length-1].faceup = 1
        var clientStackFrom = prepareStackForClient(stackFrom)
        var clientStackTo = prepareStackForClient(stackTo)
        io.to(game.props.red).emit('actionMoveRES', {stacks : [clientStackFrom ,clientStackTo], turncolor : game.state.turncolor})
        if(game.props.black != 'AI')
            io.to(game.props.black).emit('actionMoveRES', {stacks : [clientStackFrom ,clientStackTo], turncolor : game.state.turncolor})

        if(stackFrom.name.includes('malus')) 
            if(!stackFrom.cards.length) {
                clearInterval(game.playertimer);
                io.to(game.props.red).emit('gameEndedRES', {result : ""})
                if(game.props.black != 'AI')
                    io.to(game.props.black).emit('gameEndedRES', {result : ""})
            }
    }) 

    socket.on ('actionFlipREQ' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.gameid)
        if(!game)
            return
        var actorcolor = socket.id === game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var turncolor = game.state.turncolor 
        if(actorcolor != turncolor)
            return 
        if(!data.stack.includes(turncolor))
            return
        if(!data.stack.includes('stock'))
            return
       
        var stack = game.state.stacks[data.stack]
        stack.cards[stack.cards.length-1].faceup = 1;
        db.insertAction(game.props.id, stack.cards[stack.cards.length-1].color, stack.cards[stack.cards.length-1].suit, stack.cards[stack.cards.length-1].value,  data.to, "redtimer", "blacktimer", actorcolor, game.state.turn)
        var clientStack = prepareStackForClient(game.state.stacks[data.stack])
        io.to(game.props.red).emit('actionFlipRES', clientStack)
        if(game.props.black != 'AI')
            io.to(game.props.black).emit('actionFlipRES', clientStack)
    })

    socket.on ('disconnect', function () {
        removePendingRoom (socket.id);
        var game = activeGames.find(game => game.props.red === socket.id || game.props.black === socket.id)
        if(game) {
            clearInterval(game.playertimer);
            var gameindex = activeGames.findIndex(game => game.props.red === socket.id || game.props.black === socket.id)
            activeGames.splice(gameindex,1)
            if(game.props.red === socket.id) {
                if(game.props.black != 'AI')
                    io.to(game.props.black).emit('gameAbortedRES')
            }
            else
                io.to(game.props.red).emit('gameAbortedRES')
        }
    });
});

async function startGame (red, black, options) {
    removePendingRoom (red);
    black != 'AI' ? removePendingRoom (black):'';
    updateClientPendingRooms (); 
    for(var i = 0; i< 1; i++) {
        activeGames.push( game = await db.initGame (red, black, options, new Date()  ));
    }
    io.to (red).emit ('startGameRES', { color : 'red', props : game.props, initialState : prepareStateForClient(game.state)});
    if(black != 'AI') 
        io.to(black).emit ('startGameRES', {color : 'black', props : game.props, initialState : prepareStateForClient(game.state)}) ;

    function timer (game) {
        return  () => {
            console.log("test")
            game.state[game.state.turncolor+'timer'] = (game.state[game.state.turncolor+'timer']*1000 - 1000)/1000
            io.to(game.props.red).emit ('updateTimerRES', { redtimer: game.state.redtimer, blacktimer : game.state.blacktimer });
            if(black != 'AI') 
                io.to(game.props.black).emit ('updateTimerRES', { redtimer: game.state.redtimer, blacktimer : game.state.blacktimer });
            
            if(!game.state[game.state.turncolor+"timer"]){
                var opponentcolor = game.state.turncolor === 'red' ? 'black' : 'red'
                if(game.state[opponentcolor+"timer"]) {
                    var card = game.state.stacks[game.state.turncolor+"stock"].cards.pop()
                    card.faceup = 1
                    game.state.stacks[game.state.turncolor+"waste"].cards.push(card)
                    io.to(game.props.red).emit('actionMoveRES', {stacks : [prepareStackForClient(game.state.stacks[game.state.turncolor+"stock"]) , prepareStackForClient(game.state.stacks[game.state.turncolor+"waste"])], turncolor : opponentcolor})
                    if(game.props.black != 'AI')
                        io.to(game.props.black).emit('actionMoveRES', {stacks : [prepareStackForClient(game.state.stacks[game.state.turncolor+"stock"]) , prepareStackForClient(game.state.stacks[game.state.turncolor+"waste"])], turncolor : opponentcolor})
                    game.state.turncolor = opponentcolor
                }
                else {
                    clearInterval(game.playertimer);
                    io.to(game.props.red).emit ('gameEndedRES', { result :"???"});
                    if(black != 'AI') 
                        io.to(game.props.black).emit ('gameEndedRES', { result :"???"}); 
                }       
            }

        }
    }
    game.playertimer = setInterval(timer(game),1000 );
}

function prepareStackForClient (stack) {
    var clientStack =  JSON.parse(JSON.stringify(stack));
    if( clientStack.cards.length> 0) 
        for(card of  clientStack.cards) {
            if(!card.faceup) {
                delete card.suit
                delete card.value
            }
        }
    return clientStack
}

function prepareStateForClient (state) {
    var clientState = JSON.parse(JSON.stringify(state));
    Object.keys( clientState.stacks).map(stack=> {
        if( clientState.stacks[stack].cards.length> 0) 
            for(card of  clientState.stacks[stack].cards) {
                if(!card.faceup) {
                    delete card.suit
                    delete card.value
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
