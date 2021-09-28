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
    io.sockets.emit ('UpdatePendingRoomsRES' , { pendingRooms : pendingOnlineRooms}) 
    
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
            io.sockets.emit ('UpdatePendingRoomsRES' , { pendingRooms : pendingOnlineRooms}) 
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
        if(!game) return
        var actorcolor = socket.id === game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var turncolor = game.state.turncolor
        if(actorcolor != turncolor) return
        var stackFrom = game.state.stacks[data.stackfrom]
        var movingCardData = stackFrom.cards[stackFrom.cards.length - 1 ]
        var stackTo =  game.state.stacks[data.stackto]
        var stackToLength = stackTo.cards.length
        var opponentcolor = socket.id === game.props.red ? "black" : socket.id ===game.props.black ? 'red': ''
        var stackToUppermostCard = stackTo.cards.length ? stackTo.cards[stackToLength - 1 ] : ""
        if( ! (data.stackfrom.includes("tableau") || data.stackfrom.includes("foundation") || data.stackfrom === actorcolor+"stock" || data.stackfrom === actorcolor+"malus") ) return
        if(game.state.stockflipped && data.stackfrom != actorcolor+"stock" && data.stackto != actorcolor+"waste") return  
        if(data.stackto === turncolor + 'stock' ) return 
        if(data.stackto === turncolor + 'malus' ) return 
        if(data.stackto === turncolor + 'waste' && data.stackfrom != turncolor+'stock') return
        if(data.stackto === opponentcolor + "malus" && stackToLength > 24) return
        if(data.stackto === opponentcolor + 'stock' ) return 
        if(data.stackto === opponentcolor + 'malus' || data.stackto === opponentcolor + 'waste' )  if( ! validActionToOpponent(movingCardData, stackToUppermostCard)) return
        if(data.stackto.includes('foundation') )  if( ! validActionToFoundation(movingCardData, stackToUppermostCard)) return
        if(data.stackto.includes('tableau'))  if( ! validActionToTableau(movingCardData, stackToUppermostCard)) return 
        if(stackFrom.name.includes('foundation') )if(game.state.turnfoundationmove ) return
        applyActionToGame(game, data.stackfrom, data.stackto)
    }) 

    socket.on ('actionFlipREQ' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.gameid)
        if(!game) return
        var actorcolor = socket.id === game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var turncolor = game.state.turncolor 
        if(actorcolor != turncolor) return 
        if(!data.stack.includes(turncolor)) return
        if(!data.stack.includes('stock')) return
        applyActionToGame(game, data.stack, data.stack)
    })

    socket.on ('abortREQ' , function ( data) {
        var game = activeGames.find(game => game.props.id === data.gameid)
        if(!game) return
        var actorcolor = socket.id ===game.props.red ? "red" : socket.id ===game.props.black ? 'black': ''
        var opponentcolor = actorcolor === 'red' ? 'black' : 'red'
        if(!game.state.abortrequest) {
            if(game.state.turncolor === actorcolor) 
                if(!game.state[opponentcolor+"timer"]) 
                    endGame(game, game.state.stacks.redmalus.cards.length >  game.state.stacks.blackmalus.cards.length ?"black" : game.state.stacks.blackmalus.cards.length > game.state.stacks.redmalus.cards.length ? "red" : "draw")
                else {
                    game.state.abortrequest = actorcolor
                    io.to(game.props.red).emit('updateAbortRES')
                    if(game.props.black != 'AI')
                        io.to(game.props.black).emit('updateAbortRES')
                }
        }
        else 
            if(game.state.abortrequest != actorcolor) 
                endGame(game, game.state.stacks.redmalus.cards.length >  game.state.stacks.blackmalus.cards.length ?"black" : game.state.stacks.blackmalus.cards.length > game.state.stacks.redmalus.cards.length ? "red" : "draw")
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
    io.sockets.emit ('UpdatePendingRoomsRES' , { pendingRooms : pendingOnlineRooms}) 
    for(var i = 0; i< 1; i++) {
        activeGames.push( game = await db.initGame (red, black, options, new Date() ));
        console.log("gameid: "+game.props.id)
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

function timer (game) {
    return  () => {
        game.state[game.state.turncolor+'timer'] = (game.state[game.state.turncolor+'timer']*1000 - 1000)/1000
        io.to(game.props.red).emit ('updateTimerRES', { redtimer: game.state.redtimer, blacktimer : game.state.blacktimer });
        if(game.props.black != 'AI') 
            io.to(game.props.black).emit ('updateTimerRES', { redtimer: game.state.redtimer, blacktimer : game.state.blacktimer });
        if(!game.state[game.state.turncolor+"timer"]){
            var opponentcolor = game.state.turncolor === 'red' ? 'black' : 'red'
            if(game.state[opponentcolor+"timer"]) {
                applyActionToGame(game, game.state.turncolor+"stock", game.state.turncolor+"stock")
                applyActionToGame(game, game.state.turncolor+"stock", game.state.turncolor+"waste")
            }
            else endGame(game, game.state.stacks.redmalus.cards.length >  game.state.stacks.blackmalus.cards.length ?"black" : game.state.stacks.blackmalus.cards.length > game.state.stacks.redmalus.cards.length ? "red" : "draw")    
        }
    }
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
                else delete card.color
        }
    })
    return stacks
 }

function removePendingRoom(roomkey)  {
    if (getPendingRoom (roomkey)) {
        pendingOnlineRooms.splice (pendingOnlineRooms.findIndex (e => e.roomkey == roomkey), 1);
        io.sockets.emit ('UpdatePendingRoomsRES' , { pendingRooms : pendingOnlineRooms}) 
    }
}

function getPendingRoom (roomkey) {
    if (pendingOnlineRooms.find (e => e.roomkey === roomkey) )
        return pendingOnlineRooms.find (e => e.roomkey === roomkey);
    else return false;
}

function suitColor(suit) {
    if( suit === '♥' || suit === '♦') return "red"
    else if( suit === '♠' || suit === '♣') return "black"       
}
function validActionToOpponent (actionCard, uppermostCard) {
    if(uppermostCard.value) 
        if(actionCard.suit === uppermostCard.suit) 
            if( (actionCard.value === uppermostCard.value+1) || (actionCard.value === uppermostCard.value-1) ) 
                return true
}
function validActionToTableau (actionCard, uppermostCard) {
    if(uppermostCard.value) {
        if(suitColor(actionCard.suit) != suitColor(uppermostCard.suit)) 
            if(actionCard.value === uppermostCard.value - 1)
                return true
    }
    else return true
}
function validActionToFoundation (actionCard, uppermostCard) {
    if(uppermostCard.value) {
        if(actionCard.suit === uppermostCard.suit) 
            if( (actionCard.value === uppermostCard.value + 1) ) 
                return true
    }
    else if(actionCard.value === 1) return true
}

function applyActionToGame(game, stackfromName, stacktoName) {
    var opponentcolor = game.state.turncolor === 'red' ? 'black' : 'red'
    game.state.stacks[stacktoName].cards.push(game.state.stacks[stackfromName].cards.pop())
    if( ! stackfromName.includes('stock'))
        if(game.state.stacks[stackfromName].cards.length)
            game.state.stacks[stackfromName].cards[game.state.stacks[stackfromName].cards.length-1].faceup = 1 
    game.state.abortrequest = false
    if(stackfromName === stacktoName && stackfromName.includes('stock')) {
        game.state.stacks[stackfromName].cards[game.state.stacks[stackfromName].cards.length-1].faceup = 1 
        game.state.stockflipped = true
    }     
    else game.state.stockflipped = false
    if(stackfromName.includes('foundation'))
        game.state.turnfoundationmove = true
    if(stackfromName.includes('stock') && stacktoName.includes('waste')){
        game.state.turnfoundationmove = false
        if(game.state[opponentcolor+"timer"] > 0)
            game.state.turncolor = opponentcolor
    }
    actionToClients(game, stackfromName, stacktoName)
    if( ! game.state.stacks[game.state.turncolor+"malus"].cards.length)
        endGame(game,game.state.turncolor)
    if(stackfromName.includes('stock'))
        if(stacktoName === opponentcolor+"waste") {1
            game.state.turn++
            if(game.state[opponentcolor+"timer"] > 0) {
                if( ! game.state.stacks[opponentcolor+"stock"].cards.length)
                    flipWasteStack(game,opponentcolor)
            }
            else if ( ! game.state.stacks[game.state.turncolor+"stock"].cards.length)
                flipWasteStack(game,game.state.turncolor)
        }
        else if ( ! game.state.stacks[stackfromName].cards.length)
            flipWasteStack(game, game.state.turncolor)
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

function actionToClients(game, nameStack1, nameStack2, modifier){
    var clientStacks = [JSON.parse(JSON.stringify(game.state.stacks[nameStack1])), JSON.parse(JSON.stringify(game.state.stacks[nameStack2]))]
    var movedCard = game.state.stacks[nameStack2].cards[game.state.stacks[nameStack2].cards.length-1]
    prepareStacksForClient(clientStacks)
    io.to(game.props.red).emit('actionMoveRES', {stacks : clientStacks, turncolor : game.state.turncolor, stockflipped : game.state.stockflipped})
    if(game.props.black != 'AI')
        io.to(game.props.black).emit('actionMoveRES', {stacks : clientStacks, turncolor : game.state.turncolor, stockflipped : game.state.stockflipped})
    if(modifier != "nodb")
        db.insertAction(game.props.id, movedCard.color, movedCard.suit, movedCard.value, nameStack2, game.state.redtimer, game.state.blacktimer,  game.state.turn)
}

function AInextAction(game ) {
    var turnfoundationmove = game.state.turnfoundationmove
    var abortrequest = game.state.abortrequest
    var stockflipped = game.state.stockflipped

    var playercolor = game.state.turncolor
    var playermalus = games.state.stacks[playercolor+"malus"]
    var playermalusUppermostCard = playermalus.cards.length ? playermalus.cards[playermalus.cards.length-1] : ""

    var opponentcolor = game.state.turncolor === 'red' ? 'black' : 'red'
    var opponentmalus = game.state.stacks[opponentcolor+"malus"]
    var opponentwaste = game.state.stacks[opponentcolor+"waste"]
    var opponentmalusUppermostCard = opponentmalus.cards.length ? opponentmalus.cards[opponentmalus.cards.length-1] : ""
    var opponentwasteUppermostCard = opponentwaste.cards.length ? opponentwaste.cards[opponentwaste.cards.length-1] : ""

    var redtableau0 = game.state.stacks.redtableau0
    var redtableau1 = game.state.stacks.redtableau1
    var redtableau2 = game.state.stacks.redtableau2
    var redtableau3 = game.state.stacks.redtableau3
    var blacktableau0 = game.state.stacks.blacktableau0
    var blacktableau1 = game.state.stacks.blacktableau1
    var blacktableau2 = game.state.stacks.blacktableau2
    var blacktableau3 = game.state.stacks.blacktableau3
    var redtableau0UppermostCard = redtableau0.cards.length ? redtableau0.cards[game.state.stacks.redtableau0.cards.length-1] : ""
    var redtableau1UppermostCard = redtableau1.cards.length ? redtableau1.cards[game.state.stacks.redtableau1.cards.length-1] : ""
    var redtableau2UppermostCard = redtableau2.cards.length ? redtableau2.cards[game.state.stacks.redtableau2.cards.length-1] : ""
    var redtableau3UppermostCard = redtableau3.cards.length ? redtableau3.cards[game.state.stacks.redtableau3.cards.length-1] : ""
    var blacktableau0UppermostCard = blacktableau0.cards.length ? blacktableau0.cards[game.state.stacks.blacktableau0.cards.length-1] : ""
    var blacktableau1UppermostCard = blacktableau1.cards.length ? blacktableau1.cards[game.state.stacks.blacktableau1.cards.length-1] : ""
    var blacktableau2UppermostCard = blacktableau2.cards.length ? blacktableau2.cards[game.state.stacks.blacktableau2.cards.length-1] : ""
    var blacktableau3UppermostCard = blacktableau3.cards.length ? blacktableau3.cards[game.state.stacks.blacktableau3.cards.length-1] : ""

    var redfoundation0 = game.state.stacks.redfoundation0
    var redfoundation1 = game.state.stacks.redfoundation1
    var redfoundation2 = game.state.stacks.redfoundation2
    var redfoundation3 = game.state.stacks.redfoundation3
    var blackfoundation0 = game.state.stacks.blackfoundation0
    var blackfoundation1 = game.state.stacks.blackfoundation1
    var blackfoundation2 = game.state.stacks.blackfoundation2
    var blackfoundation3 = game.state.stacks.blackfoundation3
    var redfoundation0UppermostCard = redfoundation0.cards.length ? redfoundation0.cards[game.state.stacks.redfoundation0.cards.length-1] : ""
    var redfoundation1UppermostCard = redfoundation1.cards.length ? redfoundation1.cards[game.state.stacks.redfoundation1.cards.length-1] : ""
    var redfoundation2UppermostCard = redfoundation2.cards.length ? redfoundation2.cards[game.state.stacks.redfoundation2.cards.length-1] : ""
    var redfoundation3UppermostCard = redfoundation3.cards.length ? redfoundation3.cards[game.state.stacks.redfoundation3.cards.length-1] : ""
    var blacktableau0UppermostCard = blackfoundation0.cards.length ? blackfoundation0.cards[game.state.stacks.blackfoundation0.cards.length-1] : ""
    var blacktableau1UppermostCard = blackfoundation1.cards.length ? blackfoundation1.cards[game.state.stacks.blackfoundation1.cards.length-1] : ""
    var blacktableau2UppermostCard = blackfoundation2.cards.length ? blackfoundation2.cards[game.state.stacks.blackfoundation2.cards.length-1] : ""
    var blacktableau3UppermostCard = blackfoundation3.cards.length ? blackfoundation3.cards[game.state.stacks.blackfoundation3.cards.length-1] : ""

     
}