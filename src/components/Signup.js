import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpWithNotification } from '../services/authService';
import { useApp } from '../context/AppContext';
import './Signup.css';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAuthenticated, setUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create user account (stored in localStorage as JSON)
      const user = await signUpWithNotification(email, password, fullName);

      // Update context with user info
      setUser(user);
      setIsAuthenticated(true);

      // Navigate to categories after successful signup
      navigate('/categories');
    } catch (error) {
      setError(error.message || 'Failed to create account. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="card">
        <div className="logo">CapShala</div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-box">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

