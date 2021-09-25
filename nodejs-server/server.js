const server = require ('http').Server(app);
var express = require ('express'),
    app = express (),
    port = process.env.PORT || 3000
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));

const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000/",
      methods: ["GET", "POST"]
    }
  });
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
    var clientActiveGames = activeGames.filter(xyz => xyz.props.redip === socket.handshake.address|| xyz.props.blackip === socket.handshake.address)
    if(clientActiveGames.length) 
        for(game of clientActiveGames) 
            for( color of ["red", "black"]) 
                if( ! game.props[color]) 
                    if(game.props[color+"ip"] === socket.handshake.address ) {
                        game.props[color] = socket.id
                        var clientState = JSON.parse(JSON.stringify(game.state));
                        prepareStacksForClient(clientState.stacks)
                        io.to (socket.id).emit ('startGameRES', { color : color, id : game.props.id, initialState : clientState});
                        break
                    }
    updateClientPendingRooms ()
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
        //check if move is valid
        var game = activeGames.find(game => game.props.id === data.gameid)
        if(!game) return
        var actorcolor = socket.id ===game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var turncolor = game.state.turncolor
        if(actorcolor != turncolor) return
        var stackFrom = game.state.stacks[data.stackfrom]
        var movingCardData = stackFrom.cards[stackFrom.cards.length - 1 ]
        var stackTo =  game.state.stacks[data.stackto]
        var stackToLength = stackTo.cards.length
        var opponentcolor = socket.id === game.props.red ? "black" : socket.id ===game.props.black ? 'red': ''
        
        if( ! (data.stackfrom.includes("tableau") || data.stackfrom.includes("foundation") || data.stackfrom === actorcolor+"stock" || data.stackfrom === actorcolor+"malus") ) return
        if(game.state.stockflipped && data.stackfrom != actorcolor+"stock" && data.stackto != actorcolor+"waste") return  
        if(data.stackfrom.includes('foundation') && (data.stackto === opponentcolor+"malus" || data.stackto === opponentcolor+"waste")) return
        if(data.stackto === turncolor + 'stock' ) return 
        if(data.stackto === turncolor + 'malus' ) return 
        if(data.stackto === turncolor + 'waste' )
            if(data.stackfrom != turncolor+'stock') return 
        if(data.stackto === opponentcolor + 'stock' ) return 
        if(stackToLength){
            var stackToUppermostCard = stackTo.cards[stackToLength - 1 ]
            if(data.stackto === opponentcolor + 'malus' || data.stackto === opponentcolor + 'waste' )  
                if ( stackToUppermostCard.suit === movingCardData.suit ) {
                    if ( parseInt(stackToUppermostCard.value) != parseInt(movingCardData.value) + 1 )
                        if ( parseInt(stackToUppermostCard.value) != parseInt(movingCardData.value) - 1 ) return
                }
                else return
            if(data.stackto === opponentcolor + "malus")
                if(stackToLength > 28) return
            if(data.stackto.includes('foundation') ) 
                if ( stackToUppermostCard.suit != movingCardData.suit ) return
                else if ( stackToUppermostCard.value != movingCardData.value-1 ) return
            if(data.stackto.includes('tableau')) {
                if( (stackToUppermostCard.value -1 ) != movingCardData.value ) return
                if(movingCardData.suit === '♥' || movingCardData.suit === '♦') 
                    if(stackToUppermostCard.suit  === '♥' || stackToUppermostCard.suit  === '♦'  ) return
                if(movingCardData.suit === '♠' || movingCardData.suit === '♣')
                    if(stackToUppermostCard.suit  === '♠' || stackToUppermostCard.suit  === '♣' ) return
            }
        }
        else {
            if(data.stackto.includes('foundation') )
                if(movingCardData.value != 1) return 
            if(data.stackto === opponentcolor+'waste') return
        }
        // if(stackFrom.name.includes('foundation')) 
        //     if(game.state.turntableaumove) return
            
        //     else
        //         game.state.turntableaumove = true
        stackTo.cards.push( stackFrom.cards.pop() ) 
        game.state.stockflipped = false
        game.state.abortrequest = false
        if(data.stackfrom === actorcolor+"stock" && data.stackto === actorcolor+"waste") {
            game.state.turn++
            if(game.state[opponentcolor+"timer"] > 0)
                game.state.turncolor = opponentcolor 
        }
        if(stackFrom.cards.length) 
            if (stackFrom.name != turncolor+'stock' )
                stackFrom.cards[stackFrom.cards.length-1].faceup = 1
        if(stackFrom.name === actorcolor+"malus") // if malus card moved determine if game ended
            if(!stackFrom.cards.length) 
                endGame(game, actorcolor)       
        actionToClients(game, data.stackfrom, data.stackto)

        if(data.stackfrom === actorcolor+"stock")  //iif move from stock
            if(data.stackto === actorcolor+"waste") { //if turn changed
                if(game.state[opponentcolor+"timer"] > 0) {
                    if(!game.state.stacks[opponentcolor+"stock"].cards.length)   //if opponent stock turned empty from last stock -> waste move
                        flipWasteStack(game, opponentcolor)
                }
                else
                    if(!game.state.stacks[actorcolor+"stock"].cards.length)   //if opponent stock turned empty from last stock -> waste move
                        flipWasteStack(game, actorcolor)
            }
            else 
                if(!stackFrom.cards.length) 
                    flipWasteStack(game, actorcolor)     
    }) 

    socket.on ('actionFlipREQ' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.gameid)
        if(!game) return
        var actorcolor = socket.id === game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var turncolor = game.state.turncolor 
        if(actorcolor != turncolor) return 
        if(!data.stack.includes(turncolor)) return
        if(!data.stack.includes('stock')) return

        game.state.abortrequest = false
        game.state.stockflipped = true
        var stack = game.state.stacks[data.stack]
        stack.cards[stack.cards.length-1].faceup = 1;
        actionToClients(game, data.stack, data.stack )
    })
    socket.on ('abortREQ' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.gameid)
        if(!game) return
        var actorcolor = socket.id ===game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var opponentcolor = actorcolor === 'red' ? 'black' : 'red'
        if(!game.state.abortrequest) {
            if(game.state.turncolor === actorcolor) {
                if(!game.state[opponentcolor+"timer"]) {
                    var winner = game.state.stacks.redmalus.cards.length >  game.state.stacks.blackmalus.cards.length ?"black" : game.state.stacks.blackmalus.cards.length > game.state.stacks.redmalus.cards.length ? "red" : "draw"
                    endGame(game, winner)
                }
                else {
                    game.state.abortrequest = actorcolor
                    io.to(game.props.red).emit('updateAbortRES')
                    if(game.props.black != 'AI')
                        io.to(game.props.black).emit('updateAbortRES')
                }
            } 
        }
        else {
            if(game.state.abortrequest != actorcolor) {
                var winner = game.state.stacks.redmalus.cards.length >  game.state.stacks.blackmalus.cards.length ?"black" : game.state.stacks.blackmalus.cards.length > game.state.stacks.redmalus.cards.length ? "red" : "draw"
                endGame(game, winner)
            }
        }
    })
    socket.on ('surrenderREQ' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.gameid)
        if(!game) return
        var actorcolor = socket.id ===game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var opponentcolor = actorcolor === 'red' ? 'black' : 'red'
        endGame(game, opponentcolor)
    })
    socket.on ('disconnect', function () {
        removePendingRoom (socket.id);
        var game = activeGames.find(game => game.props.red === socket.id || game.props.black === socket.id)
        if(game) {
            var color = socket.id === game.props.red ? 'red' :  'black' 
            game.props[color] = ""
        }
    });
});

async function startGame (red, black, options) {
    removePendingRoom (red);
    black != 'AI' ? removePendingRoom (black) : '';
    updateClientPendingRooms (); 
    for(var i = 0; i< 1; i++) {
        activeGames.push( game = await db.initGame (red, black, options, new Date() ));
        console.log(game.props.id)
    }
    game.props.redip = io.sockets.sockets.get(red).handshake.address
    game.props.blackip = io.sockets.sockets.get(black).handshake.address
    var clientState = JSON.parse(JSON.stringify(game.state));
    prepareStacksForClient(clientState.stacks)
    io.to (red).emit ('startGameRES', { color : 'red', id : game.props.id, initialState : clientState});
    if(black != 'AI') 
        io.to(black).emit ('startGameRES', {color : 'black', id : game.props.id, initialState : clientState}) ;
    game.playertimer = setInterval(timer(game),1000 );
}

function endGame (game, winner) {
    if(game.playertimer)
        clearInterval(game.playertimer);
    activeGames.splice( activeGames.findIndex(x => x.props.id === game.props.id ) , 1 )
    io.to(game.props.red).emit('gameEndedRES', {result : winner})
    if(game.props.black != 'AI')
        io.to(game.props.black).emit('gameEndedRES', {result : winner})
 }
function prepareStacksForClient (stacks) {
    Object.keys( stacks).map(stack=> {
        if( stacks[stack].cards.length> 0) {
            if(stacks[stack].type === "pile")
            stacks[stack].cards = [stacks[stack].cards.pop()]
            for(card of  stacks[stack].cards) 
                if(!card.faceup) {
                    delete card.suit
                    delete card.value
                }
                else
                    delete card.color
        }
    })
    return stacks
 }
function timer (game) {
    return  () => {
        game.state[game.state.turncolor+'timer'] = (game.state[game.state.turncolor+'timer']*1000 - 1000)/1000
        io.to(game.props.red).emit ('updateTimerRES', { redtimer: game.state.redtimer, blacktimer : game.state.blacktimer });
        if(game.props.black != 'AI') 
            io.to(game.props.black).emit ('updateTimerRES', { redtimer: game.state.redtimer, blacktimer : game.state.blacktimer });
        if(!game.state[game.state.turncolor+"timer"]){
            var opponentcolor = game.state.turncolor === 'red' ? 'black' : 'red'
            var playercolor = game.state.turncolor === 'red' ? "red" : 'black'
            if(game.state[opponentcolor+"timer"]) {
                var stock = game.state.stacks[game.state.turncolor+"stock"]
                var card = stock.cards[stock.cards.length-1]
                card.faceup = 1
                actionToClients(game, game.state.turncolor+"stock", game.state.turncolor+"stock")
                stock.cards.pop()
                game.state.stacks[game.state.turncolor+"waste"].cards.push(card)
                game.state.abortrequest = false
                game.state.stockflipped = false
                game.state.turncolor = opponentcolor
                game.state.turn++
                actionToClients(game, playercolor+"stock", playercolor+"waste") 
                // game.state.turntableaumove = false
            }
            else {
                var winner = game.state.stacks.redmalus.cards.length >  game.state.stacks.blackmalus.cards.length ?"black" : game.state.stacks.blackmalus.cards.length > game.state.stacks.redmalus.cards.length ? "red" : "draw"
                endGame(game, winner)
            }       
        }
    }
}

function actionToClients(game, nameStack1, nameStack2, modifier){
    var clientStacks = [JSON.parse(JSON.stringify(game.state.stacks[nameStack1])), JSON.parse(JSON.stringify(game.state.stacks[nameStack2]))]
    var movedCard = game.state.stacks[nameStack2].cards[game.state.stacks[nameStack2].cards.length-1]
    prepareStacksForClient(clientStacks)
    io.to(game.props.red).emit('actionMoveRES', {stacks : clientStacks, turncolor : game.state.turncolor, stockflipped : game.state.stockflipped})
    if(game.props.black != 'AI')
      io.to(game.props.black).emit('actionMoveRES', {stacks : clientStacks, turncolor : game.state.turncolor, stockflipped : game.state.stockflipped})
    if(modifier != "nodb")
        db.insertAction(game.props.id, movedCard.color, movedCard.suit, movedCard.value, nameStack2, game.state.redtimer, game.state.blacktimer,  nameStack1.includes("stock") && nameStack2.includes("waste") ? game.state.turn-1 : game.state.turn)
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

function flipWasteStack(game,color){
    var wasteSize = game.state.stacks[color+"waste"].cards.length
    for(var i = 0 ; i< wasteSize; i++) {
        var card = game.state.stacks[color+"waste"].cards.pop()
        card.faceup = 0
        game.state.stacks[color+"stock"].cards.push(card);
    }
    actionToClients(game, color+"stock", color+"waste", "nodb")
}

// function AInextMove(game) {
//     var turncolor = game.state.turncolor
//     var playermalus = games.state.stacks[turncolor+"malus"]
//     var malusUppermostCard = playermalus.cards[playermalus.cards.length-1]
//     '♥' ,'♦', '♠', '♣'
// }

