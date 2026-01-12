import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import VideoCall from './VideoCall';
import './Chat.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [inCall, setInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  
  const { user, logout } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('user:status', ({ userId, status }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (status === 'online') {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    socket.on('message:receive', (message) => {
      if (selectedUser && 
          (message.sender._id === selectedUser._id || message.receiver._id === selectedUser._id)) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('call:incoming', (data) => {
      setIncomingCall(data);
    });

    return () => {
      socket.off('user:status');
      socket.off('message:receive');
      socket.off('call:incoming');
    };
  }, [socket, selectedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/messages/${userId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    fetchMessages(selectedUser._id);
  };

  const handleStartCall = (callType) => {
    setInCall(true);
  };

  const handleEndCall = () => {
    setInCall(false);
  };

  return (
    <div className="chat-container">
      <UserList
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        onlineUsers={onlineUsers}
        currentUser={user}
        onLogout={logout}
      />
      
      {selectedUser ? (
        <>
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages}
            currentUser={user}
            socket={socket}
            onStartCall={handleStartCall}
          />
          
          {inCall && (
            <VideoCall
              selectedUser={selectedUser}
              currentUser={user}
              socket={socket}
              onEndCall={handleEndCall}
            />
          )}
        </>
      ) : (
        <div className="no-chat-selected">
          <h2>Select a user to start chatting</h2>
        </div>
      )}

      {incomingCall && !inCall && (
        <div className="incoming-call-modal">
          <div className="incoming-call-content">
            <h3>{incomingCall.callerName} is calling...</h3>
            <p>{incomingCall.callType === 'video' ? 'Video Call' : 'Audio Call'}</p>
            <div className="call-actions">
              <button onClick={() => {
                setInCall(true);
                socket.emit('call:answer', { callerId: incomingCall.callerId });
                setIncomingCall(null);
              }}>
                Accept
              </button>
              <button onClick={() => {
                socket.emit('call:reject', { callerId: incomingCall.callerId });
                setIncomingCall(null);
              }}>
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
