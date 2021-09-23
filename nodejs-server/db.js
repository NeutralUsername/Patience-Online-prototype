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
      createDBcon.connect(function(err) {
          if (err) throw err;
          createDBcon.query("CREATE DATABASE IF NOT EXISTS gregaire", 
            function (err, result) {
                console.log("created DB")
                createDBcon.end()
                insertTablesAndDataIntoDB() 
               
            }
          )
      })
    }
  },
  insertAction : async function (gameid, cardcolor, suit, value, stack, redtimer, blacktimer, player, turn) {      
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
      +"'"+player+"'"+" ,"
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
      var gameid = await insertGame( red , black , optionsid , sqlTimeStarted )
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

function insertGame(red, black, optionsid, timestarted) {
  return new Promise (async function (resolve) {
    dbCon.query ("INSERT INTO games VALUES ( "
    +      "0"          + " ,"
    +      optionsid + ", "
    + "'"+red+ "'" + ", "
    + "'"+ black + "'"    + ", "
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
    for(var player = 0; player < 2 ; player++) {
      var counter = 0;
      for(var malussize = 0 ; malussize < malusSize; malussize++) {
        var card = player === 0 ? redDeck[counter++] : blackDeck[counter++] ;
        if(malussize === malusSize-1)
          card.faceup = true
        stacks[((player === 0) ? ('redmalus') : ('blackmalus'))].cards.push(card)
        actions.push( [0, gameid, card.color, card.suit, card.value ,((player === 0) ? ('redmalus') : ('blackmalus')), ((player === 0) ? ('red') : ('black')),  0, timePerPlayer, timePerPlayer] )  
      }  
      
      for(var tableaunr = 0 ; tableaunr < 4 ; tableaunr ++) {
        for(var tableausize = 0 ; tableausize < tableauSize; tableausize++) {
          var card = player === 0 ? redDeck[counter++]  : blackDeck[counter++] ;
          if(tableausize === tableauSize-1)
            card.faceup = true
          stacks[((player === 0 ) ? 'redtableau'+tableaunr: 'blacktableau'+tableaunr)].cards.push(card)
          actions.push( [ 0,  gameid,  card.color,  card.suit, card.value , ((player === 0 ) ? 'redtableau'+tableaunr: 'blacktableau'+tableaunr),((player === 0) ? ('red') : ('black')),  0, timePerPlayer,  timePerPlayer] )
        } 
      }
      for(var stock = 0 ; stock <  52 -malusSize - 4*tableauSize ; stock ++ ) {
        var card = player === 0 ? redDeck[counter++]  : blackDeck[counter++] ;
        stacks[((player === 0) ? ('redstock') : ('blackstock'))].cards.push(card)
        actions.push( [0,  gameid, card.color,  card.suit, card.value ,((player === 0) ? ('redstock') : ('blackstock')), ((player === 0) ? ('red') : ('black')),  0, timePerPlayer,  timePerPlayer] )
      }
    } 
    dbCon.query ("INSERT INTO actions (id, gameid, cardcolor,suit,value, stack, player, turn, redtimer, blacktimer) VALUES ?", [actions],
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
    },
    state : {
      stacks : stacks,
      turn :  1,
      turntableaumove : false,
      abortrequest : false,
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
    var createDBcon = mysql.createConnection({
        host:     "localhost",
        user:     "gregaire",
        password: "password",
    });

    createDBcon.query("SHOW DATABASES LIKE '"+name+"';", 
      function (err, result) {
        createDBcon.end()
        resolve( result.length);
      }
    )
    
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
    +"redid                VARCHAR(20), "
    +"blackid              VARCHAR(20), "
    +"startedtime          DATETIME, "
    +"CONSTRAINT `option`  FOREIGN KEY (`optionid`)    REFERENCES `options`(`id`))", 
    function (err, result) {
      if (err) throw err;
    }
  );
  dbCon.query("CREATE TABLE IF NOT EXISTS actions ("
    +"id                   INT AUTO_INCREMENT PRIMARY KEY, "
    +"gameid               INT, "
    +"cardcolor            VARCHAR(5), "
    +"suit                 VARCHAR(1), "
    +"value                VARCHAR(2), "
    +"stack                VARCHAR(20), "
    +"player               VARCHAR(20), "
    +"turn                 INT, "
    +"redtimer             DECIMAL(6,2), "
    +"blacktimer           DECIMAL(6,2), "
    +"CONSTRAINT  `game`   FOREIGN KEY (`gameid`)    REFERENCES `games`(`id`)) ",
    function (err, result) {
      if (err) throw err;
        dbCon.end()
        console.log("Inserted Tables")
    }
  );
}
