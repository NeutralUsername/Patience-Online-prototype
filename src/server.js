const express = require('express');
const http = require('http');
const socketio= require("socket.io");
var path = require('path');

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);


app.get('/node_modules/socket.io/client-dist/socket.io.js', (req, res) => {
    res.sendFile(path.resolve('node_modules/socket.io/client-dist/socket.io.js'));
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/script.js');
});



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

server.listen(4200, () => {
    console.log("listening on port 4200");
});
