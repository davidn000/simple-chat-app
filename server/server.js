const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// const path = require('path');

app.use(cors());

const server = http.createServer(app);
const PORT = 4000 || process.env.PORT;
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST"]
    }
});

let users = [];
io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);
    socket.on('join', (payload) => {
        socket.join(payload);
        console.log(`User ${socket.id} joined ${payload}`);
    });

    socket.on('firstConnect', (payload) => {
        users.push(payload);
        console.log(users);
    });

    socket.on('sent', (payload) => {
        payload.sender = 'server';
        socket.broadcast.to(payload.communityId).emit('serverMessageToClient', payload);
    });

    socket.on('disconnect', () => {
        io.emit('message', '| User disconnected from socket.');
    });

})

// app.use(express.static(path.join(__dirname, '../client/build')));   

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});