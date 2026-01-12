const express = require('express');
const Message = require('../models/Message');
const store = require('../models/InMemoryStore');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Get messages between two users
router.get('/:userId', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const messages = await Message.find({
        $or: [
          { sender: req.user._id, receiver: req.params.userId },
          { sender: req.params.userId, receiver: req.user._id }
        ]
      })
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar')
      .sort({ createdAt: 1 })
      .limit(100);

      res.json({ messages });
    } else {
      const messages = await store.getMessagesBetweenUsers(req.user._id, req.params.userId);
      const populatedMessages = await Promise.all(
        messages.map(msg => store.populateMessage(msg))
      );
      res.json({ messages: populatedMessages });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.patch('/read/:userId', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Message.updateMany(
        { sender: req.params.userId, receiver: req.user._id, read: false },
        { read: true, readAt: new Date() }
      );
      res.json({ success: true });
    } else {
      await store.markMessagesAsRead(req.params.userId, req.user._id);
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
