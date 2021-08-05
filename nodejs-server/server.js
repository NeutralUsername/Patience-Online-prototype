require('dotenv').config({ path: '.env' });
var mysql = require('mysql2');
var express = require('express'),
  app = express(),
  port = process.env.NS_PORT || 3000,
  controller = require('./controller');
const server = require('http').Server(app);
const io = require('socket.io')(server);

var dbCon = mysql.createConnection({
  host: "localhost",
  user: "gregaire",
  password: "password",
  database: "gregaire"
});

app.route('/ping').get(controller.root);
server.listen(port, () => console.log(`Nodejs Server listening on port ${port}!`));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/testSocketConnection.html');
});

io.on('connection', function (socket) {
  socket.on('serverTimeReq', function (data) {
    setInterval(function () {
      socket.emit('serverTimeRes', { data: new Date() });
    }, 96);
  });
});

io.on('connection', function (socket) {
  socket.on('newAIgameReq', function (data) {
    var optionsValid = false;
    if(validateOptions(data))
      optionsValid = true;
    socket.emit('newAIgameRes', { res: optionsValid} );
  });
});

function validateOptions(data) {
  if(data.malusSize >= 5 && data.malusSize <= 20)
    if(data.sequenceSize >= 1 && data.sequenceSize <= 6)
      if(data.throwOnStock === true || data.throwOnStock === false)
        if(data.throwOnMalus === true || data.throwOnMalus === false)
          if(data.variant === 'Patience' || data.variant === 'Klondike')
            if(data.turnsTimed === true || data.turnsTimed === false)
              if(data.roundsTimed === true || data.roundsTimed === false)
                if(data.timePerTurn >= 15 && data.timePerTurn <= 300)
                  if(data.timePerRound >= 600 && data.timePerRound <= 3600)
                  //if(data.name = .....)
                    return true;
  
  return false;
}
