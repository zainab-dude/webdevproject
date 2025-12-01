import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Envelope, Lock, User, ArrowRight } from '@phosphor-icons/react';

const Auth = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // Check if response is actually JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Server error: Expected JSON but got ${contentType}. Make sure the backend server is running on port 5000.`);
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // SUCCESS:
      // 1. Update Global State
      setUser(data);
      // 2. Save to LocalStorage (so they stay logged in on refresh)
      localStorage.setItem('captionUser', JSON.stringify(data));
      // 3. Redirect to intended page or home
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
      
    } catch (err) {
      setError(err.message || 'Failed to connect to server. Make sure the backend is running on port 5000.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-[#1A1D23] border border-gray-800 p-8 rounded-3xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            CaptionVibes
          </h1>
          <p className="text-gray-400">
            {isLogin ? 'Welcome back, vibe creator.' : 'Join the vibe today.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name Field (Only for Sign Up) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="Ahmed Ali" 
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full bg-[#121418] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="you@example.com" 
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#121418] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#121418] border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLogin ? 'Log In' : 'Sign Up'} <ArrowRight weight="bold" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => {
                setIsLogin(!isLogin); 
                setError('');
                setFormData({name: '', email: '', password: ''});
              }}
              className="ml-2 text-white font-medium hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;