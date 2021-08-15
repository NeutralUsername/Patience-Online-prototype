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

  initGame : async function (red, black, reddeck, blackdeck, options) {
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
              +"roompassword     " +    (options.roomPassword != "" ? " = '"+options.roomPassword +"'"  : "is null" ) +");", 

              function (err, option) { if (err) throw err;  
                if (option.length === 1) {
                  dbCon.query ("INSERT INTO games VALUES ( "
                    +      "0"          + " ,"
                    +      option[0].id + ", "
                    + "'"+ red + "'"    + ", "
                    + "'"+ black + "'"  + ");", 

                    function (err, game) { if (err) throw err;
                      dealcards (reddeck, blackdeck, options, game.insertId, dbCon);    
                      resolve ({ 
                        id : game.insertId,
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

                        function (err, game) { if (err) throw err;
                          dealcards (reddeck, blackdeck, options, game.insertId, dbCon);    
                          resolve ({ 
                            id : game.insertId,
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

async function dealcards(reddeck, blackdeck, options, gameid, dbCon) {

  dbCon.connect (
    function(err) { if (err) throw err;

      dbCon.query ("SELECT * FROM cards ",
        function (err, cards) { if (err) throw err;  
          for(var player = 0; player < 2 ; player++) {
            for(var malussize = 0 ; malussize < options.malusSize; malussize++) {
              var card = player === 0 ? reddeck.pop() : blackdeck.pop();
              dbCon.query ("INSERT INTO actions VALUES ( "
                + "0 ,"
                + gameid                                                   +" , "
                + cards.find( x=> x.color === card.color && 
                  x.suit == card.suit && x.value == card.value).id         +" , "
                + ((player === 0) ? ("'rmalus'") : ("'bmalus'"))     +" , "
                + (malussize === options.malusSize-1 ? 1 : 0 )             +" , "
                + ((player === 0) ? ("'r'") : ("'b'"))               +" , "
                + 0                                                        +" , "
                + options.timePerTurn                                      +" , "
                + options.timePerPlayer                                    +");" 
              )
            }     
            for(var tableaunr = 0 ; tableaunr < 4 ; tableaunr ++) {
              for(var tableausize = 0 ; tableausize < options.tableauSize; tableausize++) {
                var card = player === 0 ? reddeck.pop() : blackdeck.pop();
                dbCon.query ("INSERT INTO actions VALUES ( "
                  + "0 ,"
                  + gameid                                                +" , "
                  +  cards.find( x=> x.color === card.color && 
                    x.suit == card.suit && x.value == card.value).id      +" , "
                  + "'"+"tab"+((player === 0 ) ? 
                    (tableaunr+"r") : (tableaunr+"b")) +"'"+" , "
                    + (tableausize === options.tableauSize-1 ? 1 : 0 )    +" , "
                  + ((player === 0) ? ("'r'") : ("'b'"))            +" , "
                  + 0                                                     +" , "
                  + options.timePerTurn                                   +" , "
                  + options.timePerPlayer                                 +");" 
                )
              } 
            }
            for(var stock = 0 ; stock < (52 - (options.malusSize + (options.tableauSize*4))); stock ++ ) {
              var card = player === 0 ? reddeck.pop() : blackdeck.pop();
              dbCon.query ("INSERT INTO actions VALUES ( "
                + "0 ,"
                + gameid                                                     +" , "
                + cards.find( x=> x.color === card.color && 
                  x.suit == card.suit && x.value == card.value).id           +" , "
                + "'"+((player === 0) ? ("rstock") : ("bstock")) +"'"  +" , "
                + 0                                                          +" , "
                + ((player === 0) ? ("'r'") : ("'b'"))                 +" , "
                + 0                                                          +" , "
                + options.timePerTurn                                        +" , "
                + options.timePerPlayer                                      +");" 
              )
            } 
          }
        }
      )
    }
  )
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
          +"variant       VARCHAR(8), "
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
          +"stack                VARCHAR(6), "
          +"faceup               BOOLEAN, "
          +"player               VARCHAR(1), "
          +"turn                 INT, "
          +"remainingtimeturn    DECIMAL(6,2), "
          +"remainingtimeplayer  DECIMAL(6,2), "
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
        ['red', '♥', 'A'],
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
        ['red', '♦', 'A'],
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
        ['red', '♠', 'A'],
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
        ['red', '♣', 'A'],
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
        ['black', '♥', 'A'],
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
        ['black', '♦', 'A'],
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
        ['black', '♠', 'A'],
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
        ['black', '♣', 'A'],
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
