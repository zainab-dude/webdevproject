import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  House, 
  Heart, 
  MagnifyingGlass, 
  SignOut, 
  SignIn,
  Sun,
  Moon,
  ChatTeardropText,
  X // Added X icon for closing on mobile
} from '@phosphor-icons/react';

const Sidebar = ({ 
  selectedLang, 
  setLang, 
  user, 
  onLogin, 
  onLogout, 
  theme, 
  toggleTheme,
  searchQuery,
  setSearchQuery,
  isOpen,       // New Prop
  closeSidebar  // New Prop
}) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const languages = [
    { id: 'english', label: 'English' },
    { id: 'urdu', label: 'Urdu (اردو)' },
    { id: 'roman', label: 'Roman' }
  ];

  return (
    // RESPONSIVE SIDEBAR CONTAINER
    <aside className={`
      w-72 bg-white dark:bg-[#1A1625] 
      flex flex-col border-r border-purple-100 dark:border-[#2F2645] 
      h-screen 
      transition-all duration-300 ease-in-out shadow-xl md:shadow-sm dark:shadow-none
      
      /* Mobile Styles (Fixed & Hidden by default) */
      fixed inset-y-0 left-0 z-40
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      
      /* Desktop Styles (Static & Always Visible) */
      md:relative md:translate-x-0 md:z-30
    `}>
      
      {/* 1. Logo & Mobile Close */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-sm opacity-30 rounded-full group-hover:opacity-50 transition-opacity"></div>
                <ChatTeardropText size={32} weight="duotone" className="relative z-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              CAP<span className="text-slate-900 dark:text-white bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">SHALA</span>
            </h1>
        </Link>

        {/* Close Button (Mobile Only) */}
        <button 
          onClick={closeSidebar}
          className="md:hidden p-1 text-slate-500 dark:text-gray-400 hover:text-red-500"
        >
          <X size={24} />
        </button>
      </div>

      {/* 2. Search Bar */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2 bg-purple-50/50 dark:bg-[#231E31] border border-purple-100 dark:border-[#2F2645] rounded-xl px-3 py-2.5 focus-within:border-purple-400 dark:focus-within:border-purple-500 transition-colors">
          <MagnifyingGlass size={18} className="text-purple-400 dark:text-purple-300" />
          <input 
            type="text" 
            placeholder="Search vibes..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="bg-transparent border-none outline-none text-slate-800 dark:text-purple-50 text-sm w-full placeholder-purple-300 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* 3. Main Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <Link 
          to="/" 
          onClick={closeSidebar} // Close on click (mobile UX)
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
          ${isActive('/') 
            ? 'bg-purple-100 text-purple-700 dark:bg-[#2F2645] dark:text-white shadow-sm' 
            : 'text-slate-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-[#231E31] hover:text-purple-900 dark:hover:text-purple-100'}`}
        >
          <House size={20} weight={isActive('/') ? 'fill' : 'regular'} />
          Home
        </Link>

        <Link 
          to="/favorites" 
          onClick={closeSidebar} // Close on click (mobile UX)
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
          ${isActive('/favorites') 
            ? 'bg-purple-100 text-purple-700 dark:bg-[#2F2645] dark:text-white shadow-sm' 
            : 'text-slate-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-[#231E31] hover:text-purple-900 dark:hover:text-purple-100'}`}
        >
          <Heart size={20} weight={isActive('/favorites') ? 'fill' : 'regular'} />
          Favorites
        </Link>
      </nav>

      {/* 4. Bottom Section */}
      <div className="p-6 border-t border-purple-100 dark:border-[#2F2645] bg-purple-50/30 dark:bg-[#151221] transition-colors duration-300">
        
        {/* Header Row: Label + Theme Toggle */}
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold text-purple-400 dark:text-gray-500 uppercase tracking-widest">
                Preference
            </h3>
            
            <button 
                onClick={toggleTheme}
                className="p-1.5 rounded-lg bg-white border border-purple-100 dark:border-transparent dark:bg-[#2F2645] text-purple-600 dark:text-purple-200 hover:bg-purple-50 dark:hover:bg-[#3B3056] transition-colors shadow-sm dark:shadow-none"
            >
                {theme === 'dark' ? <Sun size={16} weight="fill" /> : <Moon size={16} weight="fill" />}
            </button>
        </div>

        {/* Language Selector */}
        <div className="flex flex-col gap-1 mb-6">
            {languages.map((lang) => (
                <button
                key={lang.id}
                onClick={() => setLang(lang.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
                    ${selectedLang === lang.id 
                    ? 'bg-white border border-purple-200 text-purple-600 shadow-sm dark:bg-[#2F2645] dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-none' 
                    : 'text-slate-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-[#231E31] hover:text-slate-900 dark:hover:text-white'}`
                }
                >
                <span>{lang.label}</span>
                {selectedLang === lang.id && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-emerald-400"></div>}
                </button>
            ))}
        </div>

        {/* Auth Section */}
        <div className="pt-2 border-t border-purple-100 dark:border-gray-700/30">
          {user ? (
            <div className="flex items-center justify-between bg-white dark:bg-[#231E31] p-3 rounded-xl border border-purple-100 dark:border-[#2F2645] shadow-sm mt-3">
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar || "https://ui-avatars.com/api/?background=random"} 
                  alt="User" 
                  className="w-9 h-9 rounded-full border border-purple-100 dark:border-gray-600" 
                />
                <div className="leading-tight text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[100px]">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">@{user.name.replace(/\s+/g, '').toLowerCase()}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 transition-colors"
                title="Logout"
              >
                <SignOut size={20} />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              onClick={closeSidebar}
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-slate-900 dark:text-white font-bold text-sm shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all"
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