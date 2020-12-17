const express = require('express');
const socketio = require('socket.io');
const morgan = require('morgan');
const http = require('http');
const { joinUsers, disconnectUsers, getCurrentUser, getRoomUsers } = require('./utilities/users');
const { formatMessage } = require('./utilities/messages');

// Socket initialize 
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'));
app.use(morgan('dev'));


const PORT = 3000 || process.env.PORT;

server.listen(PORT, console.log(`Server is running on ${PORT}`));

// Socket connection
io.on("connection", (socket) => {

    let chatBot = 'TrevorBot';


    // When user join in chat room
    socket.on('joinRoom', ({ username, room }) => {
        // Create users & room
        joinUsers(socket.id, username, room);
        socket.join(room);

        // Welcome message to the user
        socket.emit("message", formatMessage(chatBot, `Hello ${username}`));

        // Message about current connection users to others
        socket.broadcast.to(room).emit('message', formatMessage(chatBot, `${username} just connected on the ${room}`));

        // Disconnection message
        socket.broadcast.to(room).on("disconnect", () => {
            io.to(room).emit("message", formatMessage(chatBot, `${username} has disconnected from the channel ${room}`));
            disconnectUsers(socket.id);

            // Quantity of users in room
            io.to(room).emit('userCounter', getRoomUsers(room));
        });

        // Quantity of users in room
        io.to(room).emit('userCounter', getRoomUsers(room));
    });

    // Chat messages listener
    socket.on("chatMessage", message => {
        const user = getCurrentUser(socket.id);
        if (user) {
            // Send messages to the client-side(users);
            io.to(user.room).emit("message", formatMessage(user.username, message));
        }
    });


});

