const express = require('express');
const http = require('http');
const socketio= require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server);


app.get('/', (req, res) => {
    res.sendFile('/Users/A/IdeaProjects/solitaire/src/index.html');
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