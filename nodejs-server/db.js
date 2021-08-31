var mysql = require ('mysql2');
var dbCon ;
Promise.resolve(dbExists("gregaire")).then(async data => {
  if(data)
  dbCon = mysql.createConnection({
    host:     "localhost",
    user:     "gregaire",
    password: "password",
    database: "gregaire",
  });
})
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
var redIdDataPair = freshDeck('red');
var blackIdDataPair = freshDeck ('black');
module.exports = {
  createDBifNotExists : async function () {
    if(await dbExists("gregaire")) 
      return;
    else {
      var createDBcon = mysql.createConnection({
          host:     "localhost",
          user:     "gregaire",
          password: "password",
      });
      createDBcon.connect(function(err) {
          if (err) throw err;
          createDBcon.query("CREATE DATABASE IF NOT EXISTS gregaire", 
          function (err, result) {
              console.log("created DB")
              insertTablesAndDataIntoDB() 
            
          });
      }); 
    }
  },
  cardIdDataPairs : redIdDataPair.concat(blackIdDataPair),
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
                  resolve (newGame(game.insertId, options.throwOnWaste, options.throwOnMalus, options.variant, red, black, await stacks ( game.insertId , options, sqlstarted), options.timePerPlayer, options.timePerPlayer, options.timePerTurn, await startcolor() ==='red' ? red: black)) 
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
                      resolve (newGame(game.insertId, options.throwOnWaste, options.throwOnMalus, options.variant, red, black, await stacks ( game.insertId , options, sqlstarted), options.timePerPlayer, options.timePerPlayer, options.timePerTurn, await startcolor() ==='red' ? red: black))   
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
async function stacks( gameid, options, created) {
  return new Promise ((resolve) => {
    var reddeck = shuffle(redIdDataPair) ;
    var blackdeck = shuffle(blackIdDataPair);
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
          var counter = 0;    
          for (action of actions) {
            
            if(actions.filter(x=> x[3] === action[3]).length) {
              stacks[action[3]].cards =  actions.filter(x=> x[3] === action[3]).map(x=> {
                return {faceup : x[4], cardid : x[2], number : counter++}
              })
              actions = actions.filter(x=> x[3] != action[3]);
            }
          }
          resolve (stacks);
        }
      )      
    }
  )
}
async function startcolor() {

  return 'red' //shuffle([0,1])[0] ? 'red' : 'black'
}
function newGame(id, throwOnWaste, throwOnMalus, variant, red, black, stacks, redtimer, blacktimer, turntimer, turnPlayer) {
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
      turnplayer : turnPlayer
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
function shuffle (array) {
  var currentIndex = array.length,  randomIndex;
  while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
  } 
  return array;
}
function dbExists(name) {
  return new Promise ((resolve) => {
    var createDBcon = mysql.createConnection({
        host:     "localhost",
        user:     "gregaire",
        password: "password",
    });
    createDBcon.connect(function(err) {
      if (err) throw err;
        createDBcon.query("SHOW DATABASES LIKE '"+name+"';", 
          function (err, result) {
            resolve( result.length);
          }
        );
    }); 
  })
}
function insertTablesAndDataIntoDB() {
  var dbCon = mysql.createConnection({
    host:     "localhost",
    user:     "gregaire",
    password: "password",
    database: "gregaire"
  });
  dbCon.query("CREATE TABLE IF NOT EXISTS options ("
    +"id            INT AUTO_INCREMENT PRIMARY KEY, "
    +"malussize     INT, "
    +"tableausize   INT, "
    +"throwonwaste  BOOLEAN, "
    +"throwonmalus  BOOLEAN, "
    +"variant       VARCHAR(20), "
    +"turntime      INT, "
    +"timeperplayer INT, "
    +"roomname      VARCHAR(20), "
    +"roompassword  VARCHAR(20))",
    function (err, result) {
      if (err) throw err;
    }
  );
  dbCon.query("CREATE TABLE IF NOT EXISTS games ("
    +"id                   INT AUTO_INCREMENT PRIMARY KEY, "
    +"optionid             INT, "
    +"started              DATETIME, "
    +"redid                VARCHAR(20), "
    +"blackid              VARCHAR(20), "
    +"CONSTRAINT `option`  FOREIGN KEY (`optionid`)    REFERENCES `options`(`id`))", 
    function (err, result) {
      if (err) throw err;
    }
  );
  dbCon.query("CREATE TABLE IF NOT EXISTS cards ("
    +"id           INT AUTO_INCREMENT PRIMARY KEY, "
    +"color        VARCHAR(5), "
    +"suit         VARCHAR(1), "
    +"value        VARCHAR(2)) ",
    function (err, result) {
      if (err) throw err;
    }
  );
  dbCon.query("CREATE TABLE IF NOT EXISTS actions ("
    +"id                   INT AUTO_INCREMENT PRIMARY KEY, "
    +"gameid               INT, "
    +"cardid               INT, "
    +"stack                VARCHAR(20), "
    +"faceup               BOOLEAN, "
    +"player               VARCHAR(20), "
    +"turn                 INT, "
    +"moved                DATETIME, "
    +"CONSTRAINT  `card`   FOREIGN KEY (`cardid`)    REFERENCES `cards`(`id`), "
    +"CONSTRAINT  `game`   FOREIGN KEY (`gameid`)    REFERENCES `games`(`id`)) ",
    function (err, result) {
      if (err) throw err;
        console.log("Inserted Tables")
    }
  );
  var sql = "INSERT INTO cards (color, suit, value) VALUES ?";
  var values = [
  ['red', '♥', '1'],
  ['red', '♥', '2'],
  ['red', '♥', '3'],
  ['red', '♥', '4'],
  ['red', '♥', '5'],
  ['red', '♥', '6'],
  ['red', '♥', '7'],
  ['red', '♥', '8'],
  ['red', '♥', '9'],
  ['red', '♥', '10'],
  ['red', '♥', '11'],
  ['red', '♥', '12'],
  ['red', '♥', '13'],
  ['red', '♦', '1'],
  ['red', '♦', '2'],
  ['red', '♦', '3'],
  ['red', '♦', '4'],
  ['red', '♦', '5'],
  ['red', '♦', '6'],
  ['red', '♦', '7'],
  ['red', '♦', '8'],
  ['red', '♦', '9'],
  ['red', '♦', '10'],
  ['red', '♦', '11'],
  ['red', '♦', '12'],
  ['red', '♦', '13'],
  ['red', '♠', '1'],
  ['red', '♠', '2'],
  ['red', '♠', '3'],
  ['red', '♠', '4'],
  ['red', '♠', '5'],
  ['red', '♠', '6'],
  ['red', '♠', '7'],
  ['red', '♠', '8'],
  ['red', '♠', '9'],
  ['red', '♠', '10'],
  ['red', '♠', '11'],
  ['red', '♠', '12'],
  ['red', '♠', '13'],
  ['red', '♣', '1'],
  ['red', '♣', '2'],
  ['red', '♣', '3'],
  ['red', '♣', '4'],
  ['red', '♣', '5'],
  ['red', '♣', '6'],
  ['red', '♣', '7'],
  ['red', '♣', '8'],
  ['red', '♣', '9'],
  ['red', '♣', '10'],
  ['red', '♣', '11'],
  ['red', '♣', '12'],
  ['red', '♣', '13'],
  ['black', '♥', '1'],
  ['black', '♥', '2'],
  ['black', '♥', '3'],
  ['black', '♥', '4'],
  ['black', '♥', '5'],
  ['black', '♥', '6'],
  ['black', '♥', '7'],
  ['black', '♥', '8'],
  ['black', '♥', '9'],
  ['black', '♥', '10'],
  ['black', '♥', '11'],
  ['black', '♥', '12'],
  ['black', '♥', '13'],
  ['black', '♦', '1'],
  ['black', '♦', '2'],
  ['black', '♦', '3'],
  ['black', '♦', '4'],
  ['black', '♦', '5'],
  ['black', '♦', '6'],
  ['black', '♦', '7'],
  ['black', '♦', '8'],
  ['black', '♦', '9'],
  ['black', '♦', '10'],
  ['black', '♦', '11'],
  ['black', '♦', '12'],
  ['black', '♦', '13'],
  ['black', '♠', '1'],
  ['black', '♠', '2'],
  ['black', '♠', '3'],
  ['black', '♠', '4'],
  ['black', '♠', '5'],
  ['black', '♠', '6'],
  ['black', '♠', '7'],
  ['black', '♠', '8'],
  ['black', '♠', '9'],
  ['black', '♠', '10'],
  ['black', '♠', '11'],
  ['black', '♠', '12'],
  ['black', '♠', '13'],
  ['black', '♣', '1'],
  ['black', '♣', '2'],
  ['black', '♣', '3'],
  ['black', '♣', '4'],
  ['black', '♣', '5'],
  ['black', '♣', '6'],
  ['black', '♣', '7'],
  ['black', '♣', '8'],
  ['black', '♣', '9'],
  ['black', '♣', '10'],
  ['black', '♣', '11'],
  ['black', '♣', '12'],
  ['black', '♣', '13'],
  ];
  dbCon.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
    console.log("initialized db")
    console.log("**Restart Server**")
  });
}