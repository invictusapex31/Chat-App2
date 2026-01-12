const express = require('express');
const User = require('../models/User');
const store = require('../models/InMemoryStore');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Get all users
router.get('/', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find({ _id: { $ne: req.user._id } })
        .select('-password')
        .sort({ username: 1 });
      res.json({ users });
    } else {
      const users = await store.getAllUsers(req.user._id);
      res.json({ users });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
    } else {
      const user = await store.findUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const updates = {};
    if (req.body.username) updates.username = req.body.username;
    if (req.body.avatar) updates.avatar = req.body.avatar;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
      ).select('-password');

      res.json({ user });
    } else {
      const user = await store.updateUser(req.user._id, updates);
      const { password, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
