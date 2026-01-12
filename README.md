# 💬 Real-Time Chat Application

A production-ready, full-stack chat application with real-time messaging, audio/video calling, and modern UI/UX.

![Chat App](https://img.shields.io/badge/Status-Production%20Ready-success)
![Node](https://img.shields.io/badge/Node.js-v14+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Optional-orange)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication
- 💬 **Real-time Messaging** - Instant message delivery with Socket.IO
- 📞 **Audio & Video Calls** - WebRTC-powered calling
- 👥 **Online Status** - See who's online in real-time
- ⌨️ **Typing Indicators** - Know when someone is typing
- 🎨 **Modern Dark Theme** - Beautiful, responsive UI
- 🔒 **Production Security** - Helmet, rate limiting, CORS protection
- 💾 **Flexible Storage** - Works with or without MongoDB
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Without MongoDB (Fastest)

```bash
# Clone and navigate
cd chat-app

# Install dependencies
npm install
cd client && npm install && cd ..

# Start the app
npm run dev
```

Visit http://localhost:3000 and start chatting!

### With MongoDB (Production)

See [SETUP.md](./SETUP.md) for detailed MongoDB setup instructions.

## 📦 Tech Stack

### Backend
- **Node.js** & **Express** - Server framework
- **Socket.IO** - Real-time bidirectional communication
- **MongoDB** & **Mongoose** - Database (optional)
- **JWT** - Authentication
- **Helmet** - Security headers
- **Express Rate Limit** - DDoS protection
- **Compression** - Response compression

### Frontend
- **React 18** - UI library
- **Socket.IO Client** - Real-time client
- **WebRTC** - Peer-to-peer video/audio
- **Axios** - HTTP client
- **React Router** - Navigation

## 📁 Project Structure

```
chat-app/
├── server/
│   ├── config/          # Database configuration
│   ├── models/          # MongoDB models & in-memory store
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── socket/          # Socket.IO handlers
│   └── index.js         # Server entry point
├── client/
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # React components
│       ├── context/     # React context (Auth, Socket)
│       └── App.js       # Main app component
├── .env.example         # Environment variables template
└── package.json         # Dependencies
```

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatapp
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 📝 Available Scripts

```bash
npm run dev      # Start both frontend and backend
npm run server   # Start backend only
npm run client   # Start frontend only
npm start        # Start backend (production)
npm run build    # Build frontend for production
```

## 🔐 Security Features

- ✅ JWT authentication with secure token storage
- ✅ Password hashing with bcrypt
- ✅ Helmet.js for security headers
- ✅ Rate limiting to prevent abuse
- ✅ CORS protection
- ✅ Input validation
- ✅ XSS protection

## 🌐 Deployment

### Backend
Deploy to Heroku, Railway, Render, or any Node.js hosting:
1. Set environment variables
2. Push to Git repository
3. Platform will auto-deploy

### Frontend
Deploy to Vercel, Netlify, or any static hosting:
1. Build: `cd client && npm run build`
2. Deploy the `client/build` folder
3. Set API URL environment variable

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/profile` - Update profile

### Messages
- `GET /api/messages/:userId` - Get messages with user
- `PATCH /api/messages/read/:userId` - Mark messages as read

### Socket Events
- `user:join` - User connects
- `message:send` - Send message
- `message:receive` - Receive message
- `typing:start` / `typing:stop` - Typing indicators
- `call:initiate` / `call:answer` / `call:end` - Call events
- `webrtc:offer` / `webrtc:answer` / `webrtc:ice-candidate` - WebRTC signaling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Socket.IO for real-time communication
- WebRTC for peer-to-peer video/audio
- MongoDB for database
- React team for the amazing framework

---

**Made with ❤️ for real-time communication**
