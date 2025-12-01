import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Upload from './pages/Upload'; 
import Auth from './pages/Auth'; // Import Auth Page
import Toast from './components/Toast';
import { Heart } from '@phosphor-icons/react';

// Simplified Header
const Header = () => (
  <div className="h-20 flex-shrink-0 flex items-center justify-end px-8 sticky top-0 z-20 pointer-events-none"></div>
);

function App() {
  const [selectedLang, setSelectedLang] = useState('english');
  const [toastVisible, setToastVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Check for logged-in user on App Load
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
    localStorage.removeItem('captionUser'); // Clear storage
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  return (
    <Router>
      <Routes>
        {/* Route: Login/Signup Page (Standalone) */}
        <Route path="/login" element={<Auth setUser={setUser} />} />

        {/* Route: Main App Layout */}
        <Route path="*" element={
          <div className="flex h-screen overflow-hidden bg-[#121418]">
            {/* Background Glow */}
            <div className="fixed top-1/2 left-1/2 w-[60vw] h-[60vh] bg-[radial-gradient(circle,rgba(79,70,229,0.15)_0%,rgba(0,0,0,0)_70%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>

            {/* Sidebar Logic: Pass User & Logout Handler */}
            <Sidebar 
              selectedLang={selectedLang} 
              setLang={setSelectedLang} 
              user={user}
              onLogout={handleLogout}
            />

            <main className="flex-1 flex flex-col h-full relative z-10 overflow-hidden">
              <Header />

              <div className="flex-1 overflow-y-auto relative">
                {/* Upload Button */}
                <div className="absolute top-6 right-8 z-30 pointer-events-auto">
                    {user ? (
                      <Link to="/upload" className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg hover:-translate-y-0.5 transition-all">
                        Upload Caption
                      </Link>
                    ) : (
                      <Link to="/login" state={{ from: '/upload' }} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg hover:-translate-y-0.5 transition-all">
                        Upload Caption
                      </Link>
                    )}
                </div>

                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <Feed 
                        selectedLang={selectedLang} 
                        onCopy={handleCopy}
                        user={user}
                        mode="feed"
                      />
                    } 
                  />
                  
                  {/* Protected Route: Upload */}
                  <Route 
                    path="/upload" 
                    element={
                      isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-gray-400">Loading...</div>
                        </div>
                      ) : user ? (
                        <Upload />
                      ) : (
                        <Navigate to="/login" state={{ from: '/upload' }} replace />
                      )
                    } 
                  />
                  
                  <Route 
                    path="/favorites" 
                    element={
                      isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-gray-400">Loading...</div>
                        </div>
                      ) : user ? (
                        <Feed 
                          selectedLang={selectedLang} 
                          onCopy={handleCopy}
                          user={user}
                          mode="favorites"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-10">
                          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Heart size={32} className="text-red-500" weight="fill" />
                          </div>
                          <h2 className="text-2xl font-bold text-white">Your Favorites</h2>
                          <p className="text-gray-400 mt-2">
                            Please login to view your favorite captions.
                          </p>
                        </div>
                      )
                    } 
                  />
                </Routes>
              </div>
            </main>
            <Toast message="Copied to clipboard!" isVisible={toastVisible} />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;