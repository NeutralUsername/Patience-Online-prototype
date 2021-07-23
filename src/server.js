const express = require('express');
const http = require('http');
const socketio= require("socket.io");

const app = express();
const server = http.createServer(app).listen(4200, () => {console.log("listening on port 4200")});
const io = new socketio.Server(server);



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

