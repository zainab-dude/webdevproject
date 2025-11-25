import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from './Navbar';
import './Profile.css';

const Profile = () => {
  const { user, logout, getFavoritesList } = useApp();
  const navigate = useNavigate();
  const favoritesCount = getFavoritesList().length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  // Get user's first initial for avatar
  const getInitial = () => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="profile-page">
      <Navbar />
      
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {getInitial()}
            </div>
            <h2 className="profile-name">{user.displayName || 'User'}</h2>
            <p className="profile-email">{user.email}</p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{favoritesCount}</div>
              <div className="stat-label">Favorites</div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="logout-btn" 
              onClick={handleLogout}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Log Out
            </button>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">Account Created:</span>
              <span className="info-value">
                {user.createdAt 
                  ? new Date(user.createdAt).toLocaleDateString()
                  : 'Recently'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

