import React from 'react';

function UserList({ users, selectedUser, onUserSelect, onlineUsers, currentUser, onLogout }) {
  return (
    <div className="user-list">
      <div className="user-list-header">
        <div className="current-user">
          <div className="avatar">{currentUser?.username?.[0]?.toUpperCase()}</div>
          <span>{currentUser?.username}</span>
        </div>
        <button onClick={onLogout} className="logout-btn">Logout</button>
      </div>

      <div className="users">
        {users.map(user => (
          <div
            key={user._id}
            className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
            onClick={() => onUserSelect(user)}
          >
            <div className="user-avatar">
              <div className="avatar">{user.username[0].toUpperCase()}</div>
              {onlineUsers.has(user._id) && <span className="online-indicator"></span>}
            </div>
            <div className="user-info">
              <div className="user-name">{user.username}</div>
              <div className="user-status">
                {onlineUsers.has(user._id) ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
