import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Envelope, Lock, User, ArrowRight, ArrowLeft, ChatTeardropText } from '@phosphor-icons/react';

const Auth = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error: Please ensure backend is running.');
      }

      const data = await res.json();

      // --- CRITICAL CHECK ---
      // If the backend found the email, it sends a 400 or 409 status
      if (!res.ok) {
        // data.error will contain "Email already exists" from the backend
        throw new Error(data.error || 'Authentication failed');
      }

      // Success
      setUser(data);
      localStorage.setItem('captionUser', JSON.stringify(data));
      const from = location.state?.from || '/';
      navigate(from, { replace: true });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-white transition-all hover:-translate-x-1 z-20 font-medium group"
      >
        <div className="p-2 bg-[#1A1D23] rounded-full border border-gray-800 group-hover:border-gray-600 transition-colors">
            <ArrowLeft size={16} />
        </div>
        <span className="text-sm">Back to Home</span>
      </Link>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#121418]">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-[#1A1D23]/80 backdrop-blur-xl border border-gray-800/50 p-8 rounded-3xl shadow-2xl relative z-10">
        
        {/* LOGO SECTION */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-2 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur opacity-40 rounded-full"></div>
                <ChatTeardropText size={48} weight="duotone" className="relative z-10 text-purple-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg">
              CAP<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">SHALA</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm font-medium tracking-wide">
            {isLogin ? 'Welcome back, vibe creator.' : 'Join the vibe today.'}
          </p>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center flex items-center justify-center gap-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Field */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="XYZ" 
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full bg-[#0d0f12] border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative group">
              <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="you@example.com" 
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#0d0f12] border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#0d0f12] border border-gray-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Checking...' : (isLogin ? 'Log In' : 'Create Account')} 
            {!isLoading && <ArrowRight weight="bold" className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => {
                setIsLogin(!isLogin); 
                setError('');
                setFormData({name: '', email: '', password: ''});
              }}
              className="ml-2 text-white font-bold hover:text-purple-400 transition-colors"
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