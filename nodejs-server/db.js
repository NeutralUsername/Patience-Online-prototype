var mysql = require ('mysql2');

var dbCon = mysql.createConnection({
  host:     "localhost",
  user:     "gregaire",
  password: "password",
  database: "gregaire",
});

class Card {
  constructor (color, suit, value, cardid) { 
      this.cardid = cardid;
      this.color = color;
      this.suit = suit;
      this.value = value;
      this.faceup = false;
  }
}

function freshDeck (color) {
  const Suits = ["♥", "♦", "♠", "♣"];
  const Values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
  var counter = color ==='red' ?1 : 53;
  return Suits.flatMap(suit => {
      return Values.map(value => {
          return new Card (color, suit, value, counter++)
      });
  });
}  

var red = freshDeck('red');
var black = freshDeck ('black');

module.exports = {

  idvaluepairs : {red : red, black : black},

  initGame : async function (red, black, options, started) {
      var sqlstarted = sqlCompatibleDate(started);
      options.timePerTurn = options.turnsTimed ? options.timePerTurn : 0;
      
      return new Promise (async function (resolve) {
       
        dbCon.query ("SELECT id FROM options WHERE ( "
          +"malussize     =  " +     options.malusSize          + " AND "
          +"tableausize   =  " +     options.tableauSize        + " AND "
          +"throwonwaste  =  " +     options.throwOnWaste       + " AND "
          +"throwonmalus  =  " +     options.throwOnMalus       + " AND "
          +"variant       =  " +"'"+ options.variant +"'"       + " AND "
          +"turntime      =  " +     options.timePerTurn        + " AND "
          +"timeperplayer =  " +     options.timePerPlayer      + " AND "
          +"roomname         " +    (options.roomName     != "" ? " = '"+ options.roomName.replace(/\s+/g,' ').trim() +"'"  : "is null" ) +" AND "
          +"roompassword     " +    (options.roomPassword != "" ? " = '"+options.roomPassword +"'"  : "is null" ) +" );",  
          function (err, option) { if (err) throw err;  

            if (option.length === 1) {
           
              dbCon.query ("INSERT INTO games VALUES ( "
                +      "0"          + " ,"
                +      option[0].id + ", "
                + "'"+sqlstarted+ "'" + ", "
                + "'"+ red + "'"    + ", "
                + "'"+ black + "'"  + ");", 

                async function (err, game) { if (err) throw err;
                 
                  var stacks =  await dealCards ( game.insertId , options, sqlstarted);
                  var startcolor = await determineStartingPlayer(stacks.redmalus, stacks.blackmalus);
                  resolve (newGame(game.insertId, options.throwOnWaste, options.throwOnMalus, options.variant, red, black, stacks, options.timePerPlayer, options.timePerPlayer, options.timePerTurn, startcolor ))   
                }
              )
            }
            else {
              dbCon.query("INSERT INTO options VALUES ( "
                +     "0"                        +" ,"
                +     options.malusSize          +", "
                +     options.tableauSize        +", "
                +     options.throwOnWaste       +", "
                +     options.throwOnMalus       +", "
                + "'"+options.variant  +"'"      +", "
                +     options.timePerTurn        +", "
                +     options.timePerPlayer      +", "
                +    (options.roomName     != "" ? "'"+ options.roomName.replace(/\s+/g,' ').trim()+"'"     : "null" ) +", "
                +    (options.roomPassword != "" ? "'"+ options.roomPassword+"'" : "null" ) +");", 

                function (err, option) { if (err) throw err;
                 
                  dbCon.query ("INSERT INTO games VALUES ( "
                    +      "0"             +" ,"
                    +      option.insertId + ", "
                    + "'"+sqlstarted+ "'" + ", "
                    + "'"+ red+"'"         + ", "
                    + "'"+ black+"'"       + ");", 

                    async function (err, game) { if (err) throw err;

                      var stacks =   await dealCards ( game.insertId , options, sqlstarted);
                      var startcolor = await determineStartingPlayer(stacks.redmalus, stacks.blackmalus);
                     
                      resolve (newGame(game.insertId, options.throwOnWaste, options.throwOnMalus, options.variant, red, black, stacks, options.timePerPlayer, options.timePerPlayer, options.timePerTurn, startcolor ))   
                    }
                  )
                } 
              )
            }   
          }  
        )  
      }
    )
  }
}

async function dealCards( gameid, options, created) {
  return new Promise ((resolve) => {
    var reddeck = shuffle(red) ;
    var blackdeck = shuffle(black);
    var actions = [];

    for(var player = 0; player < 2 ; player++) {
      var counter = 0;
      for(var malussize = 0 ; malussize < options.malusSize; malussize++) {
        if (malussize < 6)
          while(player === 0 ? reddeck[reddeck.length-1].value < 6 : blackdeck[blackdeck.length-1].value < 6) {
            player === 0 ? reddeck = shuffle(reddeck) : blackdeck = shuffle(blackdeck)
          } 
          var card = player === 0 ? reddeck[counter++] : blackdeck[counter++] ;
          actions.push( [0, gameid, card.cardid, ((player === 0) ? ('redmalus') : ('blackmalus')),(malussize === options.malusSize-1 ? 1 : 0 ) , ((player === 0) ? ('red') : ('black')), 0, created] )
        }  
        for(var tableaunr = 0 ; tableaunr < 4 ; tableaunr ++) {
          for(var tableausize = 0 ; tableausize < options.tableauSize; tableausize++) {
            if(tableausize < options.tableauSize - 1)
              while(player === 0 ? reddeck[reddeck.length-1].value < 4 : blackdeck[blackdeck.length-1].value <4) {
                player === 0 ? reddeck = shuffle(reddeck) : blackdeck = shuffle(blackdeck)
              } 
            var card = player === 0 ? reddeck[counter++]  : blackdeck[counter++] ;
            actions.push([ 0, gameid, card.cardid, ((player === 0 ) ? 'redtableau'+tableaunr: 'blacktableau'+tableaunr), (tableausize === options.tableauSize-1 ? 1 : 0 ) , ((player === 0) ? ('red') : ('black')),0, created])
          } 
        }
        for(var stock = 0 ; stock <  52 -options.malusSize - 4*options.tableauSize ; stock ++ ) {
          var card = player === 0 ? reddeck[counter++]  : blackdeck[counter++] ;
          actions.push ( [0, gameid, card.cardid, ((player === 0) ? ('redstock') : ('blackstock')), 0, ((player === 0) ? ('red') : ('black')),  0,  created]);
        }
      }
      dbCon.query ("INSERT INTO actions (id, gameid, cardid, stack, faceup, player, turn, moved) VALUES ?", [actions],
        function (err, result) { if (err) throw err;
          resolve(getStacks(actions));
        }
      )      
    }
  )
}

async function getStacks (actions) {
  return new Promise ((resolve) => {
    var stacks = {
      redmalus : {cards : [], type : 'sequence', name : 'redmalus'},
      redstock : {cards : [], type : 'pile', name : 'redstock'},
      redwaste : {cards : [], type : 'pile', name : 'redwaste'},
      redtableau0 : {cards : [], type : 'sequence', name : 'redtableau0'},
      redtableau1 : {cards : [], type : 'sequence', name : 'redtableau1'},
      redtableau2 : {cards : [], type : 'sequence', name : 'redtableau2'},
      redtableau3 : {cards : [], type : 'sequence', name : 'redtableau3'},   
      redfoundation0 : {cards : [], type : 'pile', name : 'redfoundation0'},
      redfoundation1 : {cards : [], type : 'pile', name : 'redfoundation1'},
      redfoundation2 : {cards : [], type : 'pile', name : 'redfoundation2'},
      redfoundation3 : {cards : [], type : 'pile', name : 'redfoundation3'},
      blackmalus : {cards : [], type : 'sequence', name : 'blackmalus'},
      blackstock : {cards : [], type : 'pile', name : 'blackstock'},
      blackwaste : {cards : [], type : 'pile', name : 'blackwaste'},
      blacktableau0 : {cards : [], type : 'sequence', name : 'blacktableau0'},
      blacktableau1 : {cards : [], type : 'sequence', name : 'blacktableau1'},
      blacktableau2 : {cards : [], type : 'sequence', name : 'blacktableau2'},
      blacktableau3 : {cards : [], type : 'sequence', name : 'blacktableau3'},
      blackfoundation0 : {cards : [], type : 'pile', name : 'blackfoundation0'},
      blackfoundation1 : {cards : [], type : 'pile', name : 'blackfoundation1'},
      blackfoundation2 : {cards : [], type : 'pile', name : 'blackfoundation2'},
      blackfoundation3 : {cards : [], type : 'pile', name : 'blackfoundation3'},
    };
    
    for (action of actions) {
      if(actions.filter(x=> x[3] === action[3]).length) {
        stacks[action[3]].cards =  actions.filter(x=> x[3] === action[3]).map(x=> {
          return {faceup : x[4], cardid : x[2]}
        })
        actions = actions.filter(x=> x[3] != action[3]);
      }
    }
    resolve (stacks);
  })
}

async function determineStartingPlayer(redmalus, blackmalus) {
  var red = 0;
  var black = 0;
  for(card in redmalus) {
    red += parseInt(redmalus[card].value);
  }
  for(card in blackmalus) {
    black += parseInt(blackmalus[card].value);
  }
  return red >= black ? 'red' : 'black';
}

function newGame(id, throwOnWaste, throwOnMalus, variant, red, black, stacks, redtimer, blacktimer, turntimer, turncolor) {
  return {
    red : red,
    black : black,
    props : { 
      id : id,
      throwOnWaste : throwOnWaste,
      throwOnMalus : throwOnMalus,
      variant : variant,
    },
    state : {
      stacks : stacks,
      redtimer : redtimer,
      blacktimer : blacktimer,
      turn :  0,
      turntimer : turntimer,
      turncolor : turncolor
    }
  }
}

function sqlCompatibleDate(date) {
  var sqlcompatibledate = date;
  return sqlcompatibledate = sqlcompatibledate.getUTCFullYear() + '-' +
  ('00' +(sqlcompatibledate.getUTCMonth()+1)).slice(-2) + '-' +
  ('00' + sqlcompatibledate.getUTCDate()).slice(-2) + ' ' + 
  ('00' + sqlcompatibledate.getUTCHours()).slice(-2) + ':' + 
  ('00' + sqlcompatibledate.getUTCMinutes()).slice(-2) + ':' + 
  ('00' + sqlcompatibledate.getUTCSeconds()).slice(-2);
}

function shuffle (deck) {
  var currentIndex = deck.length,  randomIndex;
  while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [deck[currentIndex], deck[randomIndex]] = [
          deck[randomIndex], deck[currentIndex]];
  } 
  return deck;
}

