import React, { useState, useEffect, useRef } from 'react';

function ChatWindow({ selectedUser, messages, currentUser, socket, onStartCall }) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('typing:start', ({ userId }) => {
      if (userId === selectedUser._id) {
        setIsTyping(true);
      }
    });

    socket.on('typing:stop', ({ userId }) => {
      if (userId === selectedUser._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('typing:start');
      socket.off('typing:stop');
    };
  }, [socket, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket) return;

    socket.emit('typing:start', {
      senderId: currentUser.id,
      receiverId: selectedUser._id
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', {
        senderId: currentUser.id,
        receiverId: selectedUser._id
      });
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('message:send', {
      senderId: currentUser.id,
      receiverId: selectedUser._id,
      content: newMessage,
      type: 'text'
    });

    setNewMessage('');
    socket.emit('typing:stop', {
      senderId: currentUser.id,
      receiverId: selectedUser._id
    });
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="avatar">{selectedUser.username[0].toUpperCase()}</div>
          <div>
            <div className="chat-username">{selectedUser.username}</div>
          </div>
        </div>
        <div className="chat-actions">
          <button onClick={() => onStartCall('audio')} title="Audio Call">📞</button>
          <button onClick={() => onStartCall('video')} title="Video Call">📹</button>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`message ${message.sender._id === currentUser.id ? 'sent' : 'received'}`}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-time">
              {new Date(message.createdAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
}

export default ChatWindow;
