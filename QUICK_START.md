# 🚀 Quick Start Guide

## Easiest Way to Start

### Option 1: Double-click the batch file
1. Navigate to the `chat-app` folder
2. Double-click `start-app.bat`
3. Two windows will open (backend and frontend)
4. Wait for both to start
5. Browser will open automatically at http://localhost:3000

### Option 2: Using npm (Recommended)
```bash
cd chat-app
npm run dev
```

### Option 3: Manual Start
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd chat-app
npm start
```

**Terminal 2 (Frontend):**
```bash
cd chat-app/client
npm start
```

## First Time Setup

```bash
# 1. Install backend dependencies
cd chat-app
npm install

# 2. Install frontend dependencies
cd client
npm install
cd ..

# 3. Start the app
npm run dev
```

## What You'll See

1. **Backend starts** on http://localhost:5000
   - You'll see: "✅ Server running on port 5000"
   - MongoDB connection status (or fallback to in-memory)

2. **Frontend starts** on http://localhost:3000
   - Browser opens automatically
   - You'll see the login/register page

## Testing the App

1. **Register two users:**
   - Open http://localhost:3000
   - Click "Sign up"
   - Create user 1 (e.g., alice@test.com)
   - Logout
   - Create user 2 (e.g., bob@test.com)

2. **Start chatting:**
   - Login as user 1
   - You'll see user 2 in the user list
   - Click on user 2
   - Start sending messages!

3. **Test real-time features:**
   - Open another browser (or incognito window)
   - Login as user 2
   - Send messages back and forth
   - See online status change
   - See typing indicators

4. **Test video call (optional):**
   - Click the video icon
   - Allow camera/microphone permissions
   - Test the call features

## Troubleshooting

### Port 3000 or 5000 already in use?

**Windows:**
```bash
# Find what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /F /PID <PID>
```

**Linux/Mac:**
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Server not starting?
1. Make sure Node.js is installed: `node --version`
2. Make sure dependencies are installed: `npm install`
3. Check if .env file exists (copy from .env.example)
4. Try running: `node server/index.js` to see errors

### Frontend not starting?
1. Navigate to client folder: `cd client`
2. Install dependencies: `npm install`
3. Try running: `npm start`

### MongoDB connection failed?
- **Don't worry!** The app works without MongoDB
- It will automatically use in-memory storage
- Your data will be lost when you restart the server
- For persistent storage, install MongoDB (see SETUP.md)

## Features to Test

✅ User registration and login
✅ Real-time messaging
✅ Online/offline status
✅ Typing indicators
✅ Message history
✅ Video/audio calls (requires camera/mic permissions)
✅ Responsive design (try on mobile)

## Default URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Next Steps

- Read [README.md](./README.md) for full documentation
- Read [SETUP.md](./SETUP.md) for MongoDB setup
- Customize the app for your needs
- Deploy to production (see README.md)

## Need Help?

1. Check the console output in both terminal windows
2. Check browser console (F12) for frontend errors
3. Make sure both servers are running
4. Try restarting both servers

---

**Happy Chatting! 💬**
