// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import Chat from './models/Chat.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
mongoose.connect('mongodb+srv://unkarrai:kislay8409@cluster0.g7rmjy1.mongodb.net/trezla', { useNewUrlParser: true, useUnifiedTopology: true });

// Socket.io implementation
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Listening for chat messages
    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        // Save chat message in the database
        const newMessage = new Chat({ sender: senderId, receiver: receiverId, message });
        await newMessage.save();

        // Emit message to the receiver
        io.to(receiverId).emit('receiveMessage', newMessage);
    });

    // Join specific room for the user
    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`${userId} joined the room.`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
