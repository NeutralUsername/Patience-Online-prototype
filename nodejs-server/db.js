var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "gregaire",
  password: "password",
  database: "gregaire"
});
con.connect(function() {
  con.query(
    "CREATE DATABASE gregaire");
  con.query(
    "CREATE TABLE cards ("
      +"id INT AUTO_INCREMENT PRIMARY KEY, "
      +"suit VARCHAR(10), "
      +"value VARCHAR(10))");
  con.query(
    "CREATE TABLE users ("
      +"id INT AUTO_INCREMENT PRIMARY KEY, "
      +"name VARCHAR(20))");
  con.query(
    "CREATE TABLE options ("
      +"id INT AUTO_INCREMENT PRIMARY KEY, "
      +"malussize INT, "
      +"sequencesize INT, "
      +"throwStock BOOLEAN, "
      +"throwMalus BOOLEAN, "
      +"variant VARCHAR(20), "
      +"turnstimed BOOLEAN, "
      +"turntime INT, "
      +"roundstimed BOOLEAN, "
      +"roundtime INT)");
  con.query(
    "CREATE TABLE stacks ("
      +"id INT AUTO_INCREMENT PRIMARY KEY, "
      +"name VARCHAR(20))");
  con.query(
    "CREATE TABLE decks ("
      +"id INT AUTO_INCREMENT PRIMARY KEY)");
  con.query(
    "CREATE TABLE shuffles ("
      +"deckid INT, "
      +"cardid INT, "
      +"position INT, "
      +"PRIMARY KEY (deckid, cardid, position), "
      +"CONSTRAINT `deck` FOREIGN KEY (`deckid`) REFERENCES `decks`(`id`), "
      +"CONSTRAINT `card` FOREIGN KEY (`cardid`) REFERENCES `cards`(`id`))");
  con.query(
    "CREATE TABLE games ("
      +"id INT AUTO_INCREMENT PRIMARY KEY, "
      +"deckid1 INT, deckid2 INT, "
      +"optionid INT, "
      +"userid1 INT, "
      +"userid2 INT, "
      +"CONSTRAINT `deck1`  FOREIGN KEY (`deckid1`)  REFERENCES `decks`(`id`), "
      +"CONSTRAINT `deck2`  FOREIGN KEY (`deckid2`)  REFERENCES `decks`(`id`), "
      +"CONSTRAINT `user1`  FOREIGN KEY (`userid1`)  REFERENCES `users`(`id`), "
      +"CONSTRAINT `user2`  FOREIGN KEY (`userid2`)  REFERENCES `users`(`id`), "
      +"CONSTRAINT `option` FOREIGN KEY (`optionid`) REFERENCES `options`(`id`))");
  con.query(
    "CREATE TABLE actions ("
      +"gameid INT, "
      +"actionnr INT, "
      +"fromstackid INT, "
      +"tostackid INT, "
      +"PRIMARY KEY (gameid, actionnr), "
      +"CONSTRAINT `game`      FOREIGN KEY (`gameid`)      REFERENCES `games`(`id`), "
      +"CONSTRAINT `stackfrom` FOREIGN KEY (`fromstackid`) REFERENCES `stacks`(`id`), "
      +"CONSTRAINT `stackto`   FOREIGN KEY (`tostackid`)   REFERENCES `stacks`(`id`))");
});
module.exports = con;
