var mysql = require ('mysql2');
var dbCon ;

module.exports = {
  tryCreateDB : async function () {
    if(await dbExists("gregaire")) 
      return;
    else {
      var createDBcon = mysql.createConnection({
          host:     "localhost",
          user:     "gregaire",
          password: "password",
      });
      createDBcon.query("CREATE DATABASE IF NOT EXISTS gregaire", 
        function (err, result) {
            console.log("created DB")
            createDBcon.end()
            insertTablesIntoDB()     
        }
      )
    }
  },
  insertAction : async function (gameid, cardcolor, suit, value, stack, redtimer, blacktimer, turn) {      
    dbCon = mysql.createConnection({
      host:     "localhost",
      user:     "gregaire",
      password: "password",
      database: "gregaire",
    });
    dbCon.query ("INSERT INTO actions VALUES ("
      +"0, "
      +gameid+" ,"
      +"'"+cardcolor+"'"+" ,"
      +"'"+suit+"'"+" ,"
      +"'"+value+"'"+" ,"
      +"'"+stack+"'"+" ,"
      +turn+" ,"
      +redtimer+" ,"
      +blacktimer+" )" 
    )    
    dbCon.end()
  },
  initGame : async function (red, black, options, timeStarted) {
    return new Promise (async function (resolve) {
      dbCon = mysql.createConnection({
        host:     "localhost",
        user:     "gregaire",
        password: "password",
        database: "gregaire",
      });
      var sqlTimeStarted = sqlCompatibleDate(timeStarted);
      var reddeck = shuffle(freshDeck("red"))
      var blackdeck = shuffle(freshDeck("black"))
      var startcolor = shuffle([0,1])[0] ? 'red' : 'black'
      var optionsid = await insertOrFindOptions(options)  
      var gameid = await insertGame( red , black , optionsid , sqlTimeStarted, startcolor )
      var stacks = await insertActions(gameid, reddeck, blackdeck, options.malusSize, options.tableauSize, options.timePerPlayer)
      dbCon.end()
      resolve ( game(gameid, red, black, stacks, startcolor, options.timePerPlayer) )
    })
  }
}

function insertOrFindOptions(options) {
  return new Promise (async function (resolve) {
    dbCon.query ("SELECT id FROM options WHERE ( "
      +"malussize     =  " +     options.malusSize          + " AND "
      +"tableausize   =  " +     options.tableauSize        + " AND "
      +"throwonwaste  =  " +     options.throwOnWaste       + " AND "
      +"throwonmalus  =  " +     options.throwOnMalus       + " AND "
      +"variant       =  " +"'"+ options.variant +"'"       + " AND "
      +"timeperplayer =  " +     options.timePerPlayer      + " AND "
      +"roomname         " +    (options.roomName     != "" ? " = '"+ options.roomName.replace(/\s+/g,' ').trim() +"'"  : "is null" ) +" AND "
      +"roompassword     " +    (options.roomPassword != "" ? " = '"+options.roomPassword +"'"  : "is null" ) +" );",  
      function (err, option) { if (err) throw err;  
        if (option.length === 1) {
          resolve (option[0].id)
        }
        else {
          dbCon.query("INSERT INTO options VALUES ( "
          +     "0"                        +" ,"
          +     options.malusSize          +", "
          +     options.tableauSize        +", "
          +     options.throwOnWaste       +", "
          +     options.throwOnMalus       +", "
          + "'"+options.variant  +"'"      +", "
          +     options.timePerPlayer      +", "
          +    (options.roomName     != "" ? "'"+ options.roomName.replace(/\s+/g,' ').trim()+"'"     : "null" ) +", "
          +    (options.roomPassword != "" ? "'"+ options.roomPassword+"'" : "null" ) +");", 
            function (err, option) { if (err) throw err;
              resolve(option.insertId)
            }
          )
        }
      }  
    )  
  })
}

function insertGame(red, black, optionsid, timestarted, startcolor) {
  return new Promise (async function (resolve) {
    dbCon.query ("INSERT INTO games VALUES ( "
    +      "0"          + " ,"
    +      optionsid + ", "
    + "'"+red+ "'" + ", "
    + "'"+ black + "'"    + ", "
    + "'"+ startcolor + "'"    + ", "
    + "'"+ timestarted + "'"  + ");", 
      async function (err, game) { if (err) throw err;
        resolve(game.insertId)
      }
    )
  })
}

function insertActions(gameid, redDeck, blackDeck, malusSize, tableauSize, timePerPlayer) {
  return new Promise (async function (resolve) {
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
    var actions = [];
    var reshufflecounter = 0
    for(var player = 0; player < 2 ; player++) {
      for(var malussizeCounter = 0 ; malussizeCounter < malusSize; malussizeCounter++) {

        if (malussizeCounter < 10)
          while ( player === 0 ?  redDeck[redDeck.length-1].value < 6 : blackDeck[blackDeck.length-1].value < 7 ) {
            console.log(reshufflecounter++)
            player === 0 ? redDeck = shuffle(redDeck) : blackDeck = shuffle(blackDeck)
        } 
    
        if (malussizeCounter > 9)
          while ( player === 0 ?  redDeck[redDeck.length-1].value > 7 ||redDeck[redDeck.length-1].value === "1" : blackDeck[blackDeck.length-1].value > 7 || blackDeck[blackDeck.length-1].value ==="1" ) {
            console.log(reshufflecounter++)
            player === 0 ? redDeck = shuffle(redDeck) : blackDeck = shuffle(blackDeck)
          } 
      
        var card = player === 0 ? redDeck.pop(): blackDeck.pop() ;

        if(malussizeCounter === malusSize-1)
          card.faceup = true
        stacks[((player === 0) ? ('redmalus') : ('blackmalus'))].cards.push(card)
        actions.push( [0, gameid, card.color, card.suit, card.value ,((player === 0) ? ('redmalus') : ('blackmalus')),  0, timePerPlayer, timePerPlayer] )  
      }  
      
      for(var tableaunr = 0 ; tableaunr < 4 ; tableaunr ++) {
        for(var tableausize = 0 ; tableausize < tableauSize; tableausize++) {

          // while ( player === 0 ?  redDeck[redDeck.length-1].value === "1" : blackDeck[blackDeck.length-1].value === "1" ) {
          //   console.log(reshufflecounter++)
          //   player === 0 ? redDeck = shuffle(redDeck) : blackDeck = shuffle(blackDeck)
          // } 

          var card = player === 0 ? redDeck.pop(): blackDeck.pop() ;
          if(tableausize === tableauSize-1)
            card.faceup = true
          stacks[((player === 0 ) ? 'redtableau'+tableaunr: 'blacktableau'+tableaunr)].cards.push(card)
          actions.push( [ 0,  gameid,  card.color,  card.suit, card.value , ((player === 0 ) ? 'redtableau'+tableaunr: 'blacktableau'+tableaunr),  0, timePerPlayer,  timePerPlayer] )
        } 
      }
      for(var stock = 0 ; stock <  52 -malusSize - 4*tableauSize ; stock ++ ) {
        var card = player === 0 ? redDeck.pop(): blackDeck.pop() ;
        stacks[((player === 0) ? ('redstock') : ('blackstock'))].cards.push(card)
        actions.push( [0,  gameid, card.color,  card.suit, card.value ,((player === 0) ? ('redstock') : ('blackstock')),  0, timePerPlayer,  timePerPlayer] )
      }
    } 
    dbCon.query ("INSERT INTO actions (id, gameid, cardcolor,suit,value, stack, turn, redtimer, blacktimer) VALUES ?", [actions],
      function (err, result) { if (err) throw err;
        resolve (stacks);
      }
    )   
  })
}

function game(gameid, redid, blackid, stacks, startcolor, timePerPlayer) {
  return {
    props : { 
      id : gameid,
      red : redid,
      black : blackid,
      redip : "",
      blackip : "",
    },
    state : {
      stacks : stacks,
      turn :  1,
      turntableaumove : false,
      abortrequest : false,
      stockflipped : false,
      turncolor : startcolor,
      redtimer : timePerPlayer,
      blacktimer : timePerPlayer,
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
class Card {
  constructor (color, suit, value) { 
    this.color = color;
    this.suit = suit;
    this.value = value;
    this.faceup = false;
  }
}
function freshDeck (color) {
  const Suits = ["♥", "♦", "♠", "♣"];
  const Values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"];
  return Suits.flatMap(suit => {
    return Values.map(value => {
      return new Card (color, suit, value)
    });
  });
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
    var existsDBcon = mysql.createConnection({
        host:     "localhost",
        user:     "gregaire",
        password: "password",
    });

    existsDBcon.query("SHOW DATABASES LIKE '"+name+"';", 
      function (err, result) {
        existsDBcon.end()
        resolve( result.length);
      }
    )
    
  })
}
function insertTablesIntoDB() {
  var insertDBCon= mysql.createConnection({
    host:     "localhost",
    user:     "gregaire",
    password: "password",
    database: "gregaire"
  });
  insertDBCon.query("CREATE TABLE IF NOT EXISTS options ("
    +"id            INT AUTO_INCREMENT PRIMARY KEY, "
    +"malussize     INT, "
    +"tableausize   INT, "
    +"throwonwaste  BOOLEAN, "
    +"throwonmalus  BOOLEAN, "
    +"variant       VARCHAR(20), "
    +"timeperplayer INT, "
    +"roomname      VARCHAR(20), "
    +"roompassword  VARCHAR(20))",
    function (err) {
      if (err) throw err;
    }
  );
  insertDBCon.query("CREATE TABLE IF NOT EXISTS games ("
    +"id                   INT AUTO_INCREMENT PRIMARY KEY, "
    +"optionid             INT, "
    +"redid                VARCHAR(20), "
    +"blackid              VARCHAR(20), "
    +"startcolor           VARCHAR(5), "
    +"startedtime          DATETIME, "
    +"CONSTRAINT `option`  FOREIGN KEY (`optionid`)    REFERENCES `options`(`id`))", 
    function (err) {
      if (err) throw err;
    }
  );
  insertDBCon.query("CREATE TABLE IF NOT EXISTS actions ("
    +"id                   INT AUTO_INCREMENT PRIMARY KEY, "
    +"gameid               INT, "
    +"cardcolor            VARCHAR(5), "
    +"suit                 VARCHAR(1), "
    +"value                VARCHAR(2), "
    +"stack                VARCHAR(20), "
    +"turn                 INT, "
    +"redtimer             DECIMAL(6,2), "
    +"blacktimer           DECIMAL(6,2), "
    +"CONSTRAINT  `game`   FOREIGN KEY (`gameid`)    REFERENCES `games`(`id`)) ",
    function (err) {
      if (err) throw err;
        insertDBCon.end()
        console.log("Inserted Tables")
    }
  );
}
