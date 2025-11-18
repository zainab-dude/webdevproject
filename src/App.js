import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Signup from './components/Signup';
import CategorySelection from './components/CategorySelection';
import Homepage from './components/Homepage';
import Favorites from './components/Favorites';
import InstallPrompt from './components/InstallPrompt';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <InstallPrompt />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/categories" element={<CategorySelection />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;

