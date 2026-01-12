require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

console.log('🚀 Starting Chat Server...');

const app = express();
const server = http.createServer(app);

// Socket.IO configuration
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('✅ Middleware configured');

// Import routes
try {
  const authRoutes = require('./routes/auth');
  const userRoutes = require('./routes/users');
  const messageRoutes = require('./routes/messages');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/messages', messageRoutes);
  
  console.log('✅ Routes loaded');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
  process.exit(1);
}

// Socket.IO handler
try {
  const socketHandler = require('./socket/socketHandler');
  socketHandler(io);
  console.log('✅ Socket.IO configured');
} catch (error) {
  console.error('❌ Error loading socket handler:', error.message);
  process.exit(1);
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('  ✅ CHAT SERVER IS RUNNING!');
  console.log('═══════════════════════════════════════');
  console.log(`  🌐 Server: http://localhost:${PORT}`);
  console.log(`  📡 Socket.IO: Ready`);
  console.log(`  💾 Storage: In-Memory`);
  console.log('═══════════════════════════════════════');
  console.log('');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.error('💡 Run: netstat -ano | findstr :5000');
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
