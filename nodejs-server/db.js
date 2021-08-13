var mysql = require ('mysql2');
module.exports = {

  createDBifNotExists : async function () {
    if(await DBexists("gregaire") === 1) 
      return;
    else {
      var createDBcon = mysql.createConnection({
          host: "localhost",
          user: "gregaire",
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

  initGame : async function (red, black, decks, options) {
    if(await DBexists("gregaire") === 1) 
      var dbCon = mysql.createConnection({
        host: "localhost",
        user: "gregaire",
        password: "password",
        database: "gregaire"
      });
      return new Promise ((resolve) => {
        dbCon.connect (
        
          function(err) { if (err) throw err;
            dbCon.query ("SELECT id FROM options WHERE ( "
              +"malussize =     " + options.malusSize +   " AND "
              +"sequencesize =  " + options.sequenceSize +" AND "
              +"throwonwaste =  " + options.throwOnWaste +" AND "
              +"throwonmalus =  " + options.throwOnMalus +" AND "
              +"variant = " +   "'"+options.variant+"'" + " AND "
              +"turnstimed =    " + options.turnsTimed +  " AND "
              +"turntime =      " + options.timePerTurn + " AND "
              +"roundstimed =   " + options.roundsTimed + " AND "
              +"roundtime =     " + options.timePerRound +" AND "
              +"roomname        " + (options.roomName     != "" ?"= '"+options.roomName+"'"     : "is null" )+" AND "
              +"roompassword    " + (options.roomPassword != "" ? "= '"+options.roomPassword+"'" : "is null" ) +");", 

              function (err, option) { if (err) throw err;  
                if (option.length === 1) {
                  dbCon.query ("INSERT INTO games VALUES ( "
                    +"0 ,"
                    + option[0].id + ", "
                    + "'"+red+"'" + ", "
                    + "'"+black+"'" +");", 

                    async function (err, game) { if (err) throw err;
                      for(var i = 0; i< 104 ; i++) {
                        dbCon.query ("SELECT * FROM cards WHERE ("
                          +"color = '"+decks[i].color+"' AND "
                          +"suit = '"+decks[i].suit+"' AND "
                          +"value = '"+decks[i].value+"')",

                           function (err, card) { if (err) throw err;  
                              dbCon.query ("INSERT INTO decks VALUES ( "
                                +"0 ,"
                                + game.insertId       + ", "       
                                + "'"+card[0].id+"'"   + ");"
                              )   
                            }
                          )
                        }
                        resolve ({ 
                          id : game.insertId,
                          options : {
                            malusSize : options.malusSize,
                            sequenceSize : options.sequenceSize,
                            throwOnWaste : options.throwOnWaste,
                            throwOnMalus : options.throwOnMalus,
                            variant : options.variant,
                            turnsTimed : options.turnsTimed,
                            timePerTurn : options.timePerTurn,
                            roundsTimed : options.roundsTimed,
                            timePerRound : options.timePerRound,
                          },
                          field : await dealCards(decks.splice(51), decks.splice(0), options.malusSize, options.sequenceSize, game.insertId)
                        })
                      }
                    )
                  }
                  else {
                    dbCon.query("INSERT INTO options VALUES ( "
                      +"0 ,"
                      + options.malusSize + ", "
                      + options.sequenceSize +", "
                      + options.throwOnWaste +", "
                      + options.throwOnMalus +", "
                      + "'"+options.variant+"'" +", "
                      + options.turnsTimed +", "
                      + options.timePerTurn +", "
                      + options.roundsTimed +", "
                      + options.timePerRound +", "
                      + (options.roomName     != "" ? "'"+options.roomName+"'"     : "null" )+", "
                      + (options.roomPassword != "" ? "'"+options.roomPassword+"'" : "null" )+");", 

                      function (err, option) { if (err) throw err;
                        dbCon.query ("INSERT INTO games VALUES ( "
                          +"0 ,"
                          + option.insertId + ", "
                          + "'"+red+"'" + ", "
                          + "'"+black+"'" +");", 

                          async function (err, game) { if (err) throw err;
                            for(var i = 0; i< 104 ; i++) {
                        
                              dbCon.query ("SELECT * FROM cards WHERE ("
                              +"color = '"+decks[i].color+"' AND "
                              +"suit = '"+decks[i].suit+"' AND "
                              +"value = '"+decks[i].value+"')",
  
                              function (err, card) { if (err) throw err;  
                                dbCon.query ("INSERT INTO decks VALUES ( "
                                  +"0 ,"
                                  + game.insertId       + ", "       
                                  + "'"+card[0].id+"'"   + ");"
                                )   
                              }        
                            )
                          } 
                          resolve ({ 
                            id : game.insertId, 
                            options : {
                              malusSize : options.malusSize,
                              sequenceSize : options.sequenceSize,
                              throwOnWaste : options.throwOnWaste,
                              throwOnMalus : options.throwOnMalus,
                              variant : options.variant,
                              turnsTimed : options.turnsTimed,
                              timePerTurn : options.timePerTurn,
                              roundsTimed : options.roundsTimed,
                              timePerRound : options.timePerRound,
                            },
                            field : await dealCards(decks.splice(51), decks.splice(0), options.malusSize, options.sequenceSize, game.insertId)
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

async function dealCards(blackdeck, reddeck, malussize, sequencesize, gameid) {
  var dbCon = mysql.createConnection({
    host: "localhost",
    user: "gregaire",
    password: "password",
    database: "gregaire"
  });

  return new Promise ((resolve) => {
    var field = { 
      center : { 
        foundations : [],
        tableaus : [],
      },
      red : {
        drawpile : 'stack',
        discardpile : "stack",
        malussequence : [],
      },
      black : {
        drawpile : 'stack',
        discardpile : 'stack',
        malussequence : []
      },
    }
    dbCon.connect (

      function(err) { if (err) throw err;
        for(var i = 0 ; i < malussize ; i ++) {
          var actioncard = reddeck.pop();
          dbCon.query ("SELECT * FROM cards WHERE ("
            +"color = '"+actioncard.color+"' AND "
            +"suit = '"+actioncard.suit+"' AND "
            +"value = '"+actioncard.value+"')",

            function (err, card) { if (err) throw err;  
              dbCon.query ("INSERT INTO actions VALUES ( "
                + "0 ,"
                + gameid                               +" , "
                + "'"+"newgame"+"'"                    +" , "
                + "'"+"redmalus"+"'"                   +" , "
                + card[0].id                           +" , "
                + (i === malussize-1 ? 1 : 0 )         +" , "
                + 0                                    +" , "
                + 0                                    +");", 

                function (err, action) { if (err) throw err;  

                }
              )
            }
          )
        } 
        for(var i = 0 ; i < malussize ; i ++) {
          var actioncard = blackdeck.pop();
          dbCon.query ("SELECT * FROM cards WHERE ("
            +"color = '"+actioncard.color+"' AND "
            +"suit = '"+actioncard.suit+"' AND "
            +"value = '"+actioncard.value+"')",

            function (err, card) { if (err) throw err;  
              dbCon.query ("INSERT INTO actions VALUES ( "
                +"0 ,"
                + gameid                               +" , "
                + "'"+"newgame"+"'"                    +" , "
                + "'"+"blackmalus"+"'"                 +" , "
                + card[0].id                     +" , "
                + (i === malussize-1 ? 1 : 0 ) +" , "
                + 0                                    +" , "
                + 0                                    +");", 

                function (err, action) { if (err) throw err;  

                } 
              )
            }
          ) 
        }
        for(let tableaunr = 0; tableaunr< 8 ; tableaunr++) {
          for(var i = 0; i< sequencesize ; i++) {
            var actioncard = tableaunr < 4 ? reddeck.pop() : blackdeck.pop();
            dbCon.query ("SELECT * FROM cards WHERE ("
              +"color = '"+actioncard.color+"' AND "
              +"suit = '"+actioncard.suit+"' AND "
              +"value = '"+actioncard.value+"')",
  
              function (err, card) { if (err) throw err;  
                dbCon.query ("INSERT INTO actions VALUES ( "
                  +"0 ,"
                  + gameid                                                 +" , "
                  + "'"+"newgame"+"'"                                      +" , "
                  + "'"+"tableau"+(tableaunr)+"'"                                  +" , "
                  + card[0].id                                             +" , "
                  + (i === sequencesize-1 ? 1 : 0 )                        +" , "
                  + 0                                                      +" , "
                  + 0                                                      +");", 

                  function (err, action) { if (err) throw err;  

                  }
                )     
              }
            )
          }
        }
      }
    )
    resolve (
        field
    )
  })
}

function DBexists(name) {
    return new Promise ((resolve) => {
        var createDBcon = mysql.createConnection({
            host: "localhost",
            user: "gregaire",
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
        host: "localhost",
        user: "gregaire",
        password: "password",
        database: "gregaire"
      });
      dbCon.connect(function(err) {
        if (err) throw err;
        dbCon.query("CREATE TABLE IF NOT EXISTS options ("
          +"id           INT AUTO_INCREMENT PRIMARY KEY, "
          +"malussize    INT, "
          +"sequencesize INT, "
          +"throwonwaste   BOOLEAN, "
          +"throwonmalus   BOOLEAN, "
          +"variant      VARCHAR(20), "
          +"turnstimed   BOOLEAN, "
          +"turntime     INT, "
          +"roundstimed  BOOLEAN, "
          +"roundtime    INT, "
          +"roomname      VARCHAR(20), "
          +"roompassword  VARCHAR(20))",
          function (err, result) {
            if (err) throw err;
        });
          dbCon.query("CREATE TABLE IF NOT EXISTS games ("
          +"id            INT AUTO_INCREMENT PRIMARY KEY, "
          +"optionid      INT, "
          +"redid         VARCHAR(20), "
          +"blackid       VARCHAR(20), "
          +"CONSTRAINT `option` FOREIGN KEY (`optionid`) REFERENCES `options`(`id`))", 
          function (err, result) {
            if (err) throw err;
        });
        dbCon.query("CREATE TABLE IF NOT EXISTS decks ("
          +"id           INT AUTO_INCREMENT PRIMARY KEY, "
          +"gameid       INT, "
          +"cardid       INT, "
          +"CONSTRAINT  `gameid` FOREIGN KEY (`gameid`) REFERENCES `games`(`id`))" , 
          function (err, result) {
            if (err) throw err;
        });
        dbCon.query("CREATE TABLE IF NOT EXISTS actions ("
          +"id           INT AUTO_INCREMENT PRIMARY KEY, "
          +"gameid       INT, "
          +"fromstack    VARCHAR(20), "
          +"tostack      VARCHAR(20), "
          +"cardid           INT, "
          +"faceup       BOOLEAN, "
          +"turntime     DECIMAL(8,2), "
          +"roundtimer   DECIMAL(8,2), "
          +"CONSTRAINT  `game`        FOREIGN KEY (`gameid`)        REFERENCES `games`(`id`)) ",
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
