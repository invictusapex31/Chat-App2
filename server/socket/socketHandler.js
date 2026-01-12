const Message = require('../models/Message');
const User = require('../models/User');
const store = require('../models/InMemoryStore');
const mongoose = require('mongoose');

const users = new Map(); // socketId -> userId mapping

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // User joins
    socket.on('user:join', async (userId) => {
      users.set(socket.id, userId);
      socket.userId = userId;

      if (mongoose.connection.readyState === 1) {
        await User.findByIdAndUpdate(userId, { status: 'online' });
      } else {
        await store.updateUser(userId, { status: 'online' });
      }
      
      io.emit('user:status', { userId, status: 'online' });
      console.log(`👤 User ${userId} joined`);
    });

    // Send message
    socket.on('message:send', async (data) => {
      try {
        let populatedMessage;

        if (mongoose.connection.readyState === 1) {
          const message = new Message({
            sender: data.senderId,
            receiver: data.receiverId,
            content: data.content,
            type: data.type || 'text'
          });
          await message.save();

          populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username avatar')
            .populate('receiver', 'username avatar');
        } else {
          const message = await store.createMessage({
            sender: data.senderId,
            receiver: data.receiverId,
            content: data.content,
            type: data.type || 'text'
          });
          populatedMessage = await store.populateMessage(message);
        }

        // Send to receiver
        const receiverSocketId = Array.from(users.entries())
          .find(([_, userId]) => userId === data.receiverId)?.[0];
        
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:receive', populatedMessage);
        }

        // Confirm to sender
        socket.emit('message:sent', populatedMessage);
      } catch (error) {
        console.error('Message send error:', error);
        socket.emit('message:error', { error: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing:start', (data) => {
      const receiverSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === data.receiverId)?.[0];
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:start', { userId: data.senderId });
      }
    });

    socket.on('typing:stop', (data) => {
      const receiverSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === data.receiverId)?.[0];
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:stop', { userId: data.senderId });
      }
    });

    // WebRTC signaling
    socket.on('call:initiate', (data) => {
      const receiverSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === data.receiverId)?.[0];
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('call:incoming', {
          callerId: data.callerId,
          callerName: data.callerName,
          callType: data.callType
        });
      }
    });

    socket.on('call:answer', (data) => {
      const callerSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === data.callerId)?.[0];
      
      if (callerSocketId) {
        io.to(callerSocketId).emit('call:answered', { userId: socket.userId });
      }
    });

    socket.on('call:reject', (data) => {
      const callerSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === data.callerId)?.[0];
      
      if (callerSocketId) {
        io.to(callerSocketId).emit('call:rejected', { userId: socket.userId });
      }
    });

    socket.on('call:end', (data) => {
      const otherUserSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === data.userId)?.[0];
      
      if (otherUserSocketId) {
        io.to(otherUserSocketId).emit('call:ended', { userId: socket.userId });
      }
    });

    socket.on('webrtc:offer', (data) => {
      const receiverSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === data.receiverId)?.[0];
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('webrtc:offer', {
          offer: data.offer,
          senderId: socket.userId
        });
      }
    });

    socket.on('webrtc:answer', (data) => {
      const callerSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === data.callerId)?.[0];
      
      if (callerSocketId) {
        io.to(callerSocketId).emit('webrtc:answer', {
          answer: data.answer,
          senderId: socket.userId
        });
      }
    });

    socket.on('webrtc:ice-candidate', (data) => {
      const otherUserSocketId = Array.from(users.entries())
        .find(([_, userId]) => userId === data.userId)?.[0];
      
      if (otherUserSocketId) {
        io.to(otherUserSocketId).emit('webrtc:ice-candidate', {
          candidate: data.candidate,
          senderId: socket.userId
        });
      }
    });

    // Disconnect
    socket.on('disconnect', async () => {
      const userId = users.get(socket.id);
      if (userId) {
        if (mongoose.connection.readyState === 1) {
          await User.findByIdAndUpdate(userId, {
            status: 'offline',
            lastSeen: new Date()
          });
        } else {
          await store.updateUser(userId, {
            status: 'offline',
            lastSeen: new Date()
          });
        }
        io.emit('user:status', { userId, status: 'offline' });
        users.delete(socket.id);
      }
      console.log('❌ User disconnected:', socket.id);
    });
  });
};
