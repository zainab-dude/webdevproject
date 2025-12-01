import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  House, 
  Heart, 
  MagnifyingGlass, 
  UserCircle, 
  SignOut, 
  SignIn,
  CaretRight 
} from '@phosphor-icons/react';

const Sidebar = ({ selectedLang, setLang, user, onLogin, onLogout }) => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (path) => location.pathname === path;

  const languages = [
    { id: 'english', label: 'English' },
    { id: 'urdu', label: 'Urdu (اردو)' },
    { id: 'roman', label: 'Roman' }
  ];

  return (
    <aside className="w-72 bg-[#1A1D23] hidden md:flex flex-col border-r border-gray-800 h-screen sticky top-0 flex-shrink-0 z-30">
      
      {/* 1. Logo */}
      <div className="p-6 pb-4">
        <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 block">
          CaptionVibes
        </Link>
      </div>

      {/* 2. Search Bar (Inside Sidebar) */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 bg-[#121418] border border-gray-700 rounded-xl px-3 py-2.5 focus-within:border-purple-500 transition-colors">
          <MagnifyingGlass size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search vibes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder-gray-500"
          />
        </div>
      </div>

      {/* 3. Main Navigation (Home & Favorites) */}
      <nav className="flex-1 px-4 space-y-2">
        <Link 
          to="/" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
          ${isActive('/') ? 'bg-[#2A2E35] text-white shadow-md' : 'text-gray-400 hover:bg-[#2A2E35] hover:text-white'}`}
        >
          <House size={20} weight={isActive('/') ? 'fill' : 'regular'} />
          Home
        </Link>

        <Link 
          to="/favorites" 
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
          ${isActive('/favorites') ? 'bg-[#2A2E35] text-white shadow-md' : 'text-gray-400 hover:bg-[#2A2E35] hover:text-white'}`}
        >
          <Heart size={20} weight={isActive('/favorites') ? 'fill' : 'regular'} />
          Favorites
        </Link>
      </nav>

      {/* 4. Bottom Section: Language & Auth */}
      <div className="p-6 border-t border-gray-800 bg-[#15171c]">
        {/* Language Selector */}
        <div className="mb-6">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
            Select Language
          </h3>
          <div className="flex flex-col gap-1">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLang(lang.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedLang === lang.id
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-gray-400 hover:bg-[#2A2E35]'
                }`}
              >
                <span>{lang.label}</span>
                {selectedLang === lang.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Auth Section */}
        <div className="pt-2">
          {user ? (
            // LOGGED IN
            <div className="flex items-center justify-between bg-[#2A2E35] p-3 rounded-xl border border-gray-700">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar || 'https://ui-avatars.com/api/?background=random'}
                  alt="User"
                  className="w-9 h-9 rounded-full border border-gray-500"
                />
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-white truncate max-w-[100px]">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    @{user.name.replace(/\s+/g, '').toLowerCase()}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="text-gray-400 hover:text-red-400 p-1"
                title="Logout"
              >
                <SignOut size={20} />
              </button>
            </div>
          ) : (
            // GUEST (Link to /login)
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:scale-[1.02] transition-all"
            >
              <SignIn size={18} weight="bold" />
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;