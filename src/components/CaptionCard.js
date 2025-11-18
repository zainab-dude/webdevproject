import React from 'react';
import { useApp } from '../context/AppContext';
import './CaptionCard.css';

const CaptionCard = ({ caption }) => {
  const { toggleFavorite, isFavorite, selectedLanguage } = useApp();
  const isFav = isFavorite(caption.id);

  const languageMap = {
    urdu: { text: caption.urdu, className: 'urdu', label: 'Urdu' },
    roman: { text: caption.roman, className: 'roman', label: 'Roman Urdu' },
    english: { text: caption.english, className: 'english', label: 'English' }
  };

  const activeLanguage = languageMap[selectedLanguage] || languageMap.english;
  const captionText = activeLanguage.text?.trim() || 'Caption not available in this language.';

  const handleCopy = () => {
    navigator.clipboard.writeText(captionText);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'CapShala Caption',
        text: captionText
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="caption-box">
      <p className={`single-caption ${activeLanguage.className}`}>
        <span className="language-pill">{activeLanguage.label}</span>
        {captionText}
      </p>
      <div className="icons">
        <i className="far fa-copy" onClick={handleCopy} title="Copy"></i>
        <i className="fas fa-share" onClick={handleShare} title="Share"></i>
        <i
          className={`fas fa-heart ${isFav ? 'fav-active' : ''}`}
          onClick={() => toggleFavorite(caption.id)}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        ></i>
      </div>
    </div>
  );
};

export default CaptionCard;

