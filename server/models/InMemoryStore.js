// In-memory storage for development without MongoDB
const bcrypt = require('bcryptjs');

class InMemoryStore {
  constructor() {
    this.users = new Map();
    this.messages = [];
    this.userIdCounter = 1;
    this.messageIdCounter = 1;
  }

  // User methods
  async createUser(userData) {
    const id = String(this.userIdCounter++);
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = {
      _id: id,
      id: id,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      avatar: userData.avatar || '',
      status: 'offline',
      lastSeen: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserByUsername(username) {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async findUserById(id) {
    return this.users.get(id) || null;
  }

  async getAllUsers(excludeId) {
    const users = Array.from(this.users.values())
      .filter(user => user._id !== excludeId)
      .map(({ password, ...user }) => user);
    return users;
  }

  async updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return null;
    
    Object.assign(user, updates, { updatedAt: new Date() });
    return user;
  }

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Message methods
  async createMessage(messageData) {
    const id = String(this.messageIdCounter++);
    const message = {
      _id: id,
      sender: messageData.sender,
      receiver: messageData.receiver,
      content: messageData.content,
      type: messageData.type || 'text',
      read: false,
      readAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.messages.push(message);
    return message;
  }

  async getMessagesBetweenUsers(userId1, userId2) {
    return this.messages.filter(msg => 
      (msg.sender === userId1 && msg.receiver === userId2) ||
      (msg.sender === userId2 && msg.receiver === userId1)
    ).sort((a, b) => a.createdAt - b.createdAt);
  }

  async markMessagesAsRead(senderId, receiverId) {
    this.messages.forEach(msg => {
      if (msg.sender === senderId && msg.receiver === receiverId && !msg.read) {
        msg.read = true;
        msg.readAt = new Date();
      }
    });
  }

  async populateMessage(message) {
    const sender = this.users.get(message.sender);
    const receiver = this.users.get(message.receiver);
    
    return {
      ...message,
      sender: sender ? { _id: sender._id, username: sender.username, avatar: sender.avatar } : null,
      receiver: receiver ? { _id: receiver._id, username: receiver.username, avatar: receiver.avatar } : null
    };
  }
}

module.exports = new InMemoryStore();
