# Chat App Setup Guide

## Prerequisites

1. **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** (Optional - app works without it using in-memory storage)
   - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)

## Quick Start (Without MongoDB)

The app will work immediately without MongoDB using in-memory storage:

```bash
# 1. Navigate to project directory
cd chat-app

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client
npm install
cd ..

# 4. Start both servers
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Production Setup (With MongoDB)

### Option 1: Local MongoDB

1. **Install MongoDB**
   - Download from https://www.mongodb.com/try/download/community
   - Install and start MongoDB service

2. **Configure Environment**
   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   ```

3. **Update .env file**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=production
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the app**
   ```bash
   npm run dev
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose FREE tier
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access"
   - Add a new database user
   - Save username and password

4. **Setup Network Access**
   - Go to "Network Access"
   - Add IP Address
   - Click "Allow Access from Anywhere" (for development)

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Update .env file**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp?retryWrites=true&w=majority
   ```

7. **Start the app**
   ```bash
   npm run dev
   ```

## Available Scripts

```bash
# Start backend only
npm run server

# Start frontend only
npm run client

# Start both (development)
npm run dev

# Build frontend for production
npm run build

# Start backend (production)
npm start
```

## Features

✅ Real-time messaging with Socket.IO
✅ User authentication (JWT)
✅ Online/offline status
✅ Typing indicators
✅ Audio/Video calling (WebRTC)
✅ Modern dark theme UI
✅ Responsive design
✅ Production-ready security (Helmet, Rate limiting, CORS)
✅ Works with or without MongoDB

## Tech Stack

**Backend:**
- Node.js & Express
- Socket.IO (real-time communication)
- MongoDB/Mongoose (database)
- JWT (authentication)
- Helmet (security)
- Express Rate Limit (DDoS protection)
- Compression (performance)

**Frontend:**
- React 18
- Socket.IO Client
- WebRTC (video/audio calls)
- Axios (HTTP client)
- React Router (navigation)

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Failed
- The app will automatically fall back to in-memory storage
- Check MongoDB is running: `mongod --version`
- Verify connection string in .env file

### Cannot Access from Other Devices
- Update CLIENT_URL in .env to your local IP
- Example: `CLIENT_URL=http://192.168.1.100:3000`
- Make sure firewall allows connections

## Production Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy from Git repository
3. App will automatically use MongoDB if MONGODB_URI is set

### Frontend (Vercel/Netlify)
1. Build: `cd client && npm run build`
2. Deploy the `client/build` folder
3. Set REACT_APP_API_URL to your backend URL

## Security Notes

⚠️ **Before deploying to production:**
1. Change JWT_SECRET to a strong random string
2. Update CORS settings to allow only your frontend domain
3. Enable HTTPS
4. Set NODE_ENV=production
5. Review rate limiting settings
6. Setup proper MongoDB authentication

## Support

For issues or questions, check:
- MongoDB connection logs in terminal
- Browser console for frontend errors
- Network tab for API call failures
