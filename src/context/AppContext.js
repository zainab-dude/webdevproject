import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOutWithNotification, getCurrentUser } from '../services/authService';

const CATEGORY_ORDER = ['All', 'Funny', 'Love', 'Motivation', 'Sad', 'GenZ', 'Aesthetic', 'Poetic', 'Friendship'];

const CATEGORY_CANONICAL_MAP = {
  funny: 'Funny',
  love: 'Love',
  motivation: 'Motivation',
  sad: 'Sad',
  genz: 'GenZ',
  aesthetic: 'Aesthetic',
  poetic: 'Poetic',
  friendship: 'Friendship'
};

const EXCLUDED_CATEGORIES = new Set(['', 'Uncategorized']);

const normalizeCategory = (raw) => {
  if (!raw) {
    return '';
  }
  const cleaned = raw.toString().trim();
  const key = cleaned.toLowerCase();
  return CATEGORY_CANONICAL_MAP[key] || cleaned;
};

const AppContext = createContext();//data container for the app

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('urdu');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [captions, setCaptions] = useState([]);
  const [categories, setCategories] = useState(['All']);
  console.log(categories);
  const [isLoadingCaptions, setIsLoadingCaptions] = useState(true);
  const [captionsError, setCaptionsError] = useState(null);

  useEffect(() => {
    const fetchCaptions = async () => {
      try {
        setIsLoadingCaptions(true);
        const response = await fetch(`${process.env.PUBLIC_URL || ''}/captions/caps.json`);

        if (!response.ok) {
          throw new Error('Failed to load captions');
        }

        const data = await response.json();
        const normalized = data
          .map((item) => {
            const normalizedCategory = normalizeCategory(item.category);

            if (EXCLUDED_CATEGORIES.has(normalizedCategory)) {
              return null;
            }

            return {
              id: item.id,
              category: normalizedCategory,
              urdu: item.urdu || '',
              roman: item.roman_urdu || '',
              english: item.english || ''
            };
          })
          .filter(Boolean);

        const datasetCategories = Array.from(new Set(normalized.map((caption) => caption.category)));

        const orderedCategories = CATEGORY_ORDER.reduce((acc, category) => {
          if (category === 'All') {
            acc.push(category);
          } else if (datasetCategories.includes(category)) {
            acc.push(category);
          }
          return acc;
        }, []);

        const leftoverCategories = datasetCategories.filter(
          (category) => category !== 'All' && !CATEGORY_ORDER.includes(category)
        );

        setCaptions(normalized);
        setCategories([...orderedCategories, ...leftoverCategories]);
        setCaptionsError(null);
      } catch (error) {
        setCaptionsError(error.message || 'Unable to load captions');
      } finally {
        setIsLoadingCaptions(false);
      }
    };

    fetchCaptions();
  }, []);

  // Load user-specific favorites when user changes
  useEffect(() => {
    if (user && user.uid) {
      // Load favorites for this specific user
      const userFavoritesKey = `capshala-favorites-${user.uid}`;
      const saved = localStorage.getItem(userFavoritesKey);
      setFavorites(saved ? JSON.parse(saved) : []);
    } else {
      // Clear favorites when user logs out
      setFavorites([]);
    }
  }, [user]);

  // Save user-specific favorites when they change
  useEffect(() => {
    if (user && user.uid && favorites.length >= 0) {
      const userFavoritesKey = `capshala-favorites-${user.uid}`;
      localStorage.setItem(userFavoritesKey, JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Auth state listener (using JSON/localStorage)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setFavorites([]); // Clear favorites on logout
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = () => {
    try {
      signOutWithNotification();
      setUser(null);
      setIsAuthenticated(false);
      setFavorites([]); // Clear favorites on logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleFavorite = (captionId) => {
    setFavorites((prev) =>
      prev.includes(captionId) ? prev.filter((id) => id !== captionId) : [...prev, captionId]
    );
  };

  const isFavorite = (captionId) => favorites.includes(captionId);

  const getFavoritesList = () => captions.filter((caption) => favorites.includes(caption.id));

  const getFilteredCaptions = () => {
    if (selectedCategory && selectedCategory !== 'All') {
      return captions.filter((caption) => caption.category === selectedCategory);
    }
    return captions;
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesList,
    selectedLanguage,
    setSelectedLanguage,
    selectedCategory,
    setSelectedCategory,
    captions,
    getFilteredCaptions,
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    logout,
    authLoading,
    categories,
    isLoadingCaptions,
    captionsError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

