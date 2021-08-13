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
                    for(var i = 1; i< 105 ; i++) {
                      dbCon.query ("INSERT INTO decks VALUES ( "
                          + game.insertId       + ", "
                          + (i)               + ", "
                          + "'"+decks[i-1].color+"'"   + ", "
                          + "'"+decks[i-1].suit+"'"   + ", "
                          + "'"+decks[i-1].value+"'"   + ");"
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
                      field : {
                        center : {

                        },
                        red : {

                        },
                        black : {
                          
                        }
                      }
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
                        for(var i = 1; i< 105 ; i++) {
                          dbCon.query ("INSERT INTO decks VALUES ( "
                              + game.insertId       + ", "
                              + (i)               + ", "
                              + "'"+decks[i-1].color+"'"   + ", "
                              + "'"+decks[i-1].suit+"'"   + ", "
                              + "'"+decks[i-1].value+"'"   + ");"
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
                          field : await dealCards(decks)
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
    })
  }
}

async function dealCards(decks) {
  return new Promise ((resolve) => {
    

    resolve ({ 
      center : { 
        foundation1 : 'stack',
        foundation2 : 'stack',
        foundation3 : 'stack',
        foundation4 : 'stack',
        foundation5 : 'stack',
        foundation6 : 'stack',
        foundation7 : 'stack',
        foundation8 : 'stack',
        tableau1 : 'sequence',
        tableau2 : 'sequence',
        tableau3 : 'sequence',
        tableau4 : 'sequence',
        tableau5 : 'sequence',
        tableau6 : 'sequence',
        tableau7 : 'sequence',
        tableau8 : 'sequence',
      },
      red : {
        drawpile : 'stack',
        discardpile : 'stack',
        malussequence : 'sequence',
      },
      black : {
        drawpile : 'stack',
        discardpile : 'stack',
        malussequence : 'sequence',
      },     
    })
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
          +"gameid       INT, "
          +"position     INT, "
          +"color        VARCHAR(5), "
          +"suit         VARCHAR(1), "
          +"value        VARCHAR(2), "
          +"PRIMARY KEY (gameid, position), "
          +"CONSTRAINT  `gameid` FOREIGN KEY (`gameid`) REFERENCES `games`(`id`))" , 
          function (err, result) {
            if (err) throw err;
        });
        dbCon.query("CREATE TABLE IF NOT EXISTS actions ("
          +"gameid       INT, "
          +"actionnr       INT, "
          +"fromstack    VARCHAR(20), "
          +"tostack      VARCHAR(20), "
          +"turntime     DECIMAL(8,2), "
          +"roundtimer   DECIMAL(8,2), "
          +"faceup       BOOLEAN, "
          +"PRIMARY KEY (gameid, actionnr), "
          +"CONSTRAINT  `game`        FOREIGN KEY (`gameid`)        REFERENCES `games`(`id`)) ",
          function (err, result) {
            if (err) throw err;
        });
      }); 
}