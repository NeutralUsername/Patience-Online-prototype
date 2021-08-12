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
  }
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
        dbCon.query("CREATE TABLE IF NOT EXISTS cards ("
          +"id      INT AUTO_INCREMENT PRIMARY KEY, "
          +"color   VARCHAR(10), "
          +"suit    VARCHAR(10), "
          +"value   VARCHAR(10))", 
          function (err, result) {
            if (err) throw err;
        });
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
          +"cardid       INT, "
          +"position     INT, "
          +"PRIMARY KEY (cardid, position, gameid), "
          +"CONSTRAINT  `cardid` FOREIGN KEY (`cardid`) REFERENCES `cards`(`id`))" , 
          +"CONSTRAINT  `gameid` FOREIGN KEY (`gameid`) REFERENCES `games`(`id`))" , 
          function (err, result) {
            if (err) throw err;
        });
        dbCon.query("CREATE TABLE IF NOT EXISTS stacks ("
          +"id     INT AUTO_INCREMENT PRIMARY KEY, "
          +"name   VARCHAR(20))", 
          function (err, result) {
            if (err) throw err;
        });
        dbCon.query("CREATE TABLE IF NOT EXISTS actions ("
          +"id           INT, "
          +"gameid       INT, "
          +"fromstackid  VARCHAR(20), "
          +"tostackid    VARCHAR(20), "
          +"turntime     DECIMAL(8,2), "
          +"roundtimer   DECIMAL(8,2), "
          +"faceup       BOOLEAN, "
          +"CONSTRAINT  `game`        FOREIGN KEY (`gameid`)        REFERENCES `games`(`id`)) ",
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
      dbCon.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
          var sql = "INSERT INTO stacks (name) VALUES ?";
          var values = [
            ['Red_Stock'],
            ['Black_Stock'],
            ['Red_Waste'],
            ['Black_waste'],
            ['Red_Malus'],
            ['Black_Malus'],
            ['Foundation_1'],
            ['Foundation_2'],
            ['Foundation_3'],
            ['Foundation_4'],
            ['Foundation_5'],
            ['Foundation_6'],
            ['Foundation_7'],
            ['Foundation_8'],
            ['tableau_1'],
            ['tableau_2'],
            ['tableau_3'],
            ['tableau_4'],
            ['tableau_5'],
            ['tableau_6'],
            ['tableau_7'],
            ['tableau_8'],
          ];
          dbCon.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
          });
        });
}