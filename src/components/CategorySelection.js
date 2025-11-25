import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

import { useApp } from '../context/AppContext';
import './CategorySelection.css';

const languageOptions = [
  { label: 'Urdu', value: 'urdu' },
  { label: 'Roman', value: 'roman' },
  { label: 'English', value: 'english' }
];

const CategorySelection = () => {
  const {
    setSelectedCategory,
    setSelectedLanguage,
    categories,
    selectedLanguage,
    isLoadingCaptions,
    captionsError
  } = useApp();
  const [selectedLang, setSelectedLang] = useState(selectedLanguage || 'urdu');
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedLang(selectedLanguage || 'urdu');
  }, [selectedLanguage]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedLanguage(selectedLang);
    navigate('/home');
  };

  return (
    
    <div id="home">
      <div className="top-bar">CapShala</div>

      <div className="toggle">
        {languageOptions.map((option) => (
          <button
            key={option.value}
            className={selectedLang === option.value ? 'active' : ''}
            onClick={() => setSelectedLang(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid">
        {isLoadingCaptions && <div className="category loading">Loading categories…</div>}
        {captionsError && <div className="category error">{captionsError}</div>}
        {!isLoadingCaptions &&
          !captionsError &&
          categories.map((category) => (
            <div
              key={category}
              className="category"
              onClick={() => handleCategoryClick(category)}
            >
              {category === 'All' ? 'All Captions' : category}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategorySelection;

