import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Upload from './pages/Upload'; 
import Auth from './pages/Auth'; 
import Toast from './components/Toast';
import { Heart, Plus, List } from '@phosphor-icons/react'; // Added List icon

// --- UPDATED HEADER WITH HAMBURGER ---
const Header = ({ onToggleSidebar }) => (
  <div className="h-16 md:h-20 flex-shrink-0 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20 pointer-events-none">
    {/* Hamburger Button (Visible only on Mobile) */}
    <button 
      onClick={onToggleSidebar}
      className="pointer-events-auto p-2 rounded-lg bg-white dark:bg-[#1A1625] text-slate-600 dark:text-white shadow-sm border border-purple-100 dark:border-[#2F2645] md:hidden hover:bg-purple-50 dark:hover:bg-[#231E31] transition-colors"
    >
      <List size={24} />
    </button>

    {/* Spacer to push other content to right if needed */}
    <div className="flex-1"></div>
  </div>
);

// --- UPDATED LAYOUT ---
const Layout = ({ 
  children, 
  user, 
  selectedLang, 
  setSelectedLang, 
  handleLogout, 
  theme, 
  toggleTheme, 
  handleCopy, 
  toastVisible, 
  isLoading,
  searchQuery,
  setSearchQuery
}) => {
  const location = useLocation();
  const showUploadButton = ['/', '/favorites'].includes(location.pathname);
  
  // Mobile Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when route changes (on mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen overflow-hidden bg-purple-50 text-slate-900 dark:bg-[#110E1B] dark:text-purple-50 transition-colors duration-300">
      
      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 w-[60vw] h-[60vh] bg-[radial-gradient(circle,rgba(168,85,247,0.15)_0%,rgba(0,0,0,0)_70%)] dark:bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,rgba(0,0,0,0)_70%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 opacity-60 dark:opacity-40"></div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
        />
      )}

      <Sidebar 
        selectedLang={selectedLang} 
        setLang={setSelectedLang} 
        user={user}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        // Pass Mobile State
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
        {/* Pass Toggle Function to Header */}
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto relative p-4 md:p-0">
          
          {/* Upload Button */}
          {showUploadButton && (
            <div className="absolute top-0 right-4 md:top-6 md:right-8 z-30 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-500">
                <Link 
                  to={user ? "/upload" : "/login"} 
                  state={{ from: '/upload' }}
                  className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-slate-900 dark:text-white pl-3 pr-4 py-2 md:pl-4 md:pr-5 md:py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.03] active:scale-[0.98] transition-all"
                >
                  <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform duration-300">
                      <Plus size={14} weight="bold" className="md:w-4 md:h-4" />
                  </div>
                  <span className="hidden sm:inline">Upload Caption</span>
                  <span className="sm:hidden">Upload</span>
                </Link>
            </div>
          )}

          {children}
        </div>
      </main>
      <Toast message="Copied to clipboard!" isVisible={toastVisible} />
    </div>
  );
};

function App() {
  const [selectedLang, setSelectedLang] = useState('english');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Theme State
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('theme') || 'dark';
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // User State
  useEffect(() => {
    const storedUser = localStorage.getItem('captionUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('captionUser');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('captionUser');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth setUser={setUser} />} />

        <Route path="*" element={
          <Layout 
            user={user} 
            selectedLang={selectedLang} 
            setSelectedLang={setSelectedLang}
            handleLogout={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
            handleCopy={handleCopy}
            toastVisible={toastVisible}
            isLoading={isLoading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          >
            <Routes>
              <Route path="/" element={<Feed selectedLang={selectedLang} searchQuery={searchQuery} onCopy={handleCopy} user={user} mode="feed" />} />
              <Route path="/upload" element={isLoading ? <div className="p-10 text-center">Loading...</div> : user ? <Upload /> : <Navigate to="/login" state={{ from: '/upload' }} replace />} />
              <Route path="/favorites" element={isLoading ? <div className="p-10 text-center">Loading...</div> : user ? <Feed selectedLang={selectedLang} searchQuery={searchQuery} onCopy={handleCopy} user={user} mode="favorites" /> : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-10">
                    <div className="w-20 h-20 bg-purple-100 dark:bg-[#1A1625] rounded-full flex items-center justify-center mb-6 transition-colors shadow-inner">
                      <Heart size={40} className="text-purple-500 dark:text-red-400" weight="fill" />
                    </div>
                    <h2 className="text-3xl font-bold dark:text-white text-slate-800">Your Favorites</h2>
                    <p className="text-slate-500 dark:text-gray-400 mt-2 max-w-sm">Login to access your curated collection of vibes.</p>
                  </div>
                )} 
              />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;