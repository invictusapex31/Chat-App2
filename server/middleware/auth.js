const jwt = require('jsonwebtoken');
const User = require('../models/User');
const store = require('../models/InMemoryStore');
const mongoose = require('mongoose');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Use MongoDB if connected, otherwise use in-memory store
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      req.token = token;
      next();
    } else {
      // Fallback to in-memory store
      const user = await store.findUserById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const { password, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
      req.token = token;
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
