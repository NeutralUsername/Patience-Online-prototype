var mysql = require ('mysql2');
module.exports = {

  createDBifNotExists : async function () {
    if(await DBexists("gregaire")) 
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
              insertTablesAndDataIntoDB() 
          });
      }); 
    }
  },

  initGame : async function (red, black, options) {
    if(await DBexists("gregaire")) 
      var dbCon = mysql.createConnection({
        host:     "localhost",
        user:     "gregaire",
        password: "password",
        database: "gregaire"
      });
      return new Promise ((resolve) => {
        dbCon.connect (
        
          function(err) { if (err) throw err;
            dbCon.query ("SELECT id FROM options WHERE ( "
              +"malussize     =  " +     options.malusSize          + " AND "
              +"tableausize   =  " +     options.tableauSize        + " AND "
              +"throwonwaste  =  " +     options.throwOnWaste       + " AND "
              +"throwonmalus  =  " +     options.throwOnMalus       + " AND "
              +"variant       =  " +"'"+ options.variant +"'"       + " AND "
              +"turnstimed    =  " +     options.turnsTimed         + " AND "
              +"turntime      =  " +     options.timePerTurn        + " AND "
              +"playerstimed  =  " +     options.playersTimed       + " AND "
              +"timeperplayer =  " +     options.timePerPlayer      + " AND "
              +"roomname         " +    (options.roomName     != "" ? " = '"+options.roomName     +"'"  : "is null" ) +" AND "
              +"roompassword     " +    (options.roomPassword != "" ? " = '"+options.roomPassword +"'"  : "is null" ) +" );", 

              function (err, option) { if (err) throw err;  
                if (option.length === 1) {
                  dbCon.query ("INSERT INTO games VALUES ( "
                    +      "0"          + " ,"
                    +      option[0].id + ", "
                    + "'"+ red + "'"    + ", "
                    + "'"+ black + "'"  + ");", 

                    async function (err, game) { if (err) throw err; 
                      resolve ({ 
                        id : game.insertId,
                        field : await newfield(game.insertId, options, dbCon),
                        timerr : options.timePerPlayer,
                        timerb : options.timePerPlayer,
                        turntimer : options.timePerTurn,
                        throwOnWaste : options.throwOnWaste,
                        throwOnMalus : options.throwOnMalus,
                        variant : options.variant,
                      })   
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
                    +     options.turnsTimed         +", "
                    +     options.timePerTurn        +", "
                    +     options.playersTimed       +", "
                    +     options.timePerPlayer      +", "
                    +    (options.roomName     != "" ? "'"+ options.roomName+"'"     : "null" ) +", "
                    +    (options.roomPassword != "" ? "'"+ options.roomPassword+"'" : "null" ) +");", 

                    function (err, option) { if (err) throw err;
                      dbCon.query ("INSERT INTO games VALUES ( "
                        +      "0"             +" ,"
                        +      option.insertId + ", "
                        + "'"+ red+"'"         + ", "
                        + "'"+ black+"'"       + ");", 

                        async function (err, game) { if (err) throw err;
                          resolve ({ 
                            id : game.insertId,
                            field : await newfield(game.insertId, options, dbCon),
                            timerr : options.timePerPlayer,
                            timerb : options.timePerPlayer,
                            turntimer : options.timePerTurn,
                            throwOnWaste : options.throwOnWaste,
                            throwOnMalus : options.throwOnMalus,
                            variant : options.variant,
                          })   
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
    )
  }
}

async function newfield (gameid, options, dbCon) {
  await dealcards ( gameid , options, dbCon); 
  return new Promise ((resolve) => {
    dbCon.connect (
      function(err) { if (err) throw err;
        dbCon.query (" SELECT c.color, c.suit, c.value, a.faceup, a.stack FROM actions a LEFT JOIN cards c ON a.cardid = c.id WHERE (a.gameid =" + gameid+" AND a.turn = 0 )",
          function (err, actions) { if (err) throw err;
            resolve ({
              center : {
                tableau0r : actions.filter(x=>x.stack === 'tableau0r'),
                tableau1r : actions.filter(x=>x.stack === 'tableau1r'),
                tableau2r : actions.filter(x=>x.stack === 'tableau2r'),
                tableau3r : actions.filter(x=>x.stack === 'tableau3r'),
                tableau0b : actions.filter(x=>x.stack === 'tableau0b'),
                tableau1b : actions.filter(x=>x.stack === 'tableau1b'),
                tableau2b : actions.filter(x=>x.stack === 'tableau2b'),
                tableau3b : actions.filter(x=>x.stack === 'tableau3b'),

                foundation0r : actions.filter(x=>x.stack === 'foundation0r'),
                foundation1r : actions.filter(x=>x.stack === 'foundation1r'),
                foundation2r : actions.filter(x=>x.stack === 'foundation2r'),
                foundation3r : actions.filter(x=>x.stack === 'foundation3r'),
                foundation0b : actions.filter(x=>x.stack === 'foundation0b'),
                foundation1b : actions.filter(x=>x.stack === 'foundation1b'),
                foundation2b : actions.filter(x=>x.stack === 'foundation2b'),
                foundation3b : actions.filter(x=>x.stack === 'foundation3b'),
              },
              red : {
                stock : actions.filter(x=>x.stack === 'redstock'),
                waste : actions.filter(x=>x.stack === 'redwaste'),
                malus : actions.filter(x=>x.stack === 'redmalus'),
              },
              black : {
                stock : actions.filter(x=>x.stack === 'blackstock'),
                waste : actions.filter(x=>x.stack === 'blackwaste'),
                malus : actions.filter(x=>x.stack === 'blackmalus'),
              },
            })
          }
        )
      }
    )
  })
}

async function dealcards( gameid, options, dbCon) {
  return new Promise ((resolve) => {
    var reddeck = shuffle(freshdeck("red"));
    var blackdeck = shuffle(freshdeck("black"));
    var values = [];
    dbCon.connect (
       function(err) { if (err) throw err;
        dbCon.query ("SELECT * FROM cards ",
           async function (err, cards) { if (err) throw err;  

            for(var player = 0; player < 2 ; player++) {
              for(var malussize = 0 ; malussize < options.malusSize; malussize++) {
                if(malussize < 6)
                  while(player === 0 ? reddeck[reddeck.length-1].value < 6 : blackdeck[blackdeck.length-1].value < 6) {
                    player === 0 ? reddeck = shuffle(reddeck) : blackdeck = shuffle(blackdeck)
                  } 
                var card = player === 0 ? reddeck.pop() : blackdeck.pop();
                values.push([
                  0,
                  gameid,
                  cards.find( x=> x.color === card.color && 
                    x.suit == card.suit && x.value == card.value).id,
                  ((player === 0) ? ('redmalus') : ('blackmalus')),
                  (malussize === options.malusSize-1 ? 1 : 0 ) ,
                  ((player === 0) ? ('red') : ('black')),
                  0,
                  options.timePerTurn,
                  options.timePerPlayer
                ]);
              } 
              for(var tableaunr = 0 ; tableaunr < 4 ; tableaunr ++) {
                for(var tableausize = 0 ; tableausize < options.tableauSize; tableausize++) {
                  if(tableausize < options.tableauSize - 1)
                    while(player === 0 ? reddeck[reddeck.length-1].value < 4 : blackdeck[blackdeck.length-1].value <4) {
                      player === 0 ? reddeck = shuffle(reddeck) : blackdeck = shuffle(blackdeck)
                    } 
                  var card = player === 0 ? reddeck.pop() : blackdeck.pop();
                  values.push([
                    0,
                    gameid,
                    cards.find( x=> x.color === card.color && 
                      x.suit == card.suit && x.value == card.value).id,
                    'tableau'+((player === 0 ) ? 
                      (tableaunr+'r') : (tableaunr+'b')),
                    (tableausize === options.tableauSize-1 ? 1 : 0 ) ,
                    ((player === 0) ? ('red') : ('black')),
                    0,
                    options.timePerTurn,
                    options.timePerPlayer
                  ]);
                } 
              }
              for(var stock = 0 ; stock < (52 - (options.malusSize + (options.tableauSize*4))); stock ++ ) {
                var card = player === 0 ? reddeck.pop() : blackdeck.pop();
                values.push([
                  0,
                  gameid,
                  cards.find( x=> x.color === card.color && 
                    x.suit == card.suit && x.value == card.value).id,
                  ((player === 0) ? ('redstock') : ('blackstock')),
                  0,
                  ((player === 0) ? ('red') : ('black')),
                  0,
                  options.timePerTurn,
                  options.timePerPlayer
                ]);
              }
            }

            dbCon.query ("INSERT INTO actions (id, gameid,cardid, stack, faceup, player, turn, remainingtimeturn, remainingtimeplayer) VALUES ?", [values],
              function (err, result) { if (err) throw err;
                resolve();
              }
            )      
          }
        )
      }
    )
  })
}

class Card {
  constructor (color, suit, value) { 
      this.color = color;
      this.suit = suit;
      this.value = value;
      this.faceup = false;
  }
}

function freshdeck (color) {
  const Suits = ["♥", "♠", "♦", "♣"];
  const Values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return Suits.flatMap(suit => {
      return Values.map(value => {
          return new Card (color, suit, value)
      });
  });
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

function DBexists(name) {
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
            });
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
      dbCon.connect(function(err) {
        if (err) throw err;
        dbCon.query("CREATE TABLE IF NOT EXISTS options ("
          +"id            INT AUTO_INCREMENT PRIMARY KEY, "
          +"malussize     INT, "
          +"tableausize   INT, "
          +"throwonwaste  BOOLEAN, "
          +"throwonmalus  BOOLEAN, "
          +"variant       VARCHAR(20), "
          +"turnstimed    BOOLEAN, "
          +"turntime      INT, "
          +"playerstimed  BOOLEAN, "
          +"timeperplayer INT, "
          +"roomname      VARCHAR(20), "
          +"roompassword  VARCHAR(20))",
          function (err, result) {
            if (err) throw err;
        });
          dbCon.query("CREATE TABLE IF NOT EXISTS games ("
          +"id                   INT AUTO_INCREMENT PRIMARY KEY, "
          +"optionid             INT, "
          +"redid                VARCHAR(20), "
          +"blackid              VARCHAR(20), "
          +"CONSTRAINT `option`   FOREIGN KEY (`optionid`)    REFERENCES `options`(`id`))", 
          function (err, result) {
            if (err) throw err;
        });
        dbCon.query("CREATE TABLE IF NOT EXISTS cards ("
        +"id           INT AUTO_INCREMENT PRIMARY KEY, "
        +"color        VARCHAR(5), "
        +"suit         VARCHAR(1), "
        +"value        VARCHAR(2)) ",
        function (err, result) {
          if (err) throw err;
        });
        dbCon.query("CREATE TABLE IF NOT EXISTS actions ("
          +"id                   INT AUTO_INCREMENT PRIMARY KEY, "
          +"gameid               INT, "
          +"cardid               INT, "
          +"stack                VARCHAR(20), "
          +"faceup               BOOLEAN, "
          +"player               VARCHAR(20), "
          +"turn                 INT, "
          +"remainingtimeturn    DECIMAL(8,2), "
          +"remainingtimeplayer  DECIMAL(8,2), "
          +"CONSTRAINT  `card`    FOREIGN KEY (`cardid`)    REFERENCES `cards`(`id`), "
          +"CONSTRAINT  `game`    FOREIGN KEY (`gameid`)    REFERENCES `games`(`id`)) ",
          function (err, result) {
            if (err) throw err;
        });
    }); 
    dbCon.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
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
        ['red', '♥', 'J'],
        ['red', '♥', 'Q'],
        ['red', '♥', 'K'],
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
        ['red', '♦', 'J'],
        ['red', '♦', 'Q'],
        ['red', '♦', 'K'],
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
        ['red', '♠', 'J'],
        ['red', '♠', 'Q'],
        ['red', '♠', 'K'],
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
        ['red', '♣', 'J'],
        ['red', '♣', 'Q'],
        ['red', '♣', 'K'],
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
        ['black', '♥', 'J'],
        ['black', '♥', 'Q'],
        ['black', '♥', 'K'],
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
        ['black', '♦', 'J'],
        ['black', '♦', 'Q'],
        ['black', '♦', 'K'],
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
        ['black', '♠', 'J'],
        ['black', '♠', 'Q'],
        ['black', '♠', 'K'],
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
        ['black', '♣', 'J'],
        ['black', '♣', 'Q'],
        ['black', '♣', 'K'],
      ];
      dbCon.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      });
    });
  }
