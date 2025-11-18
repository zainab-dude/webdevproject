import React from 'react';
import { useApp } from '../context/AppContext';
import Navbar from './Navbar';
import CaptionCard from './CaptionCard';
import './Favorites.css';

const Favorites = () => {
  const { getFavoritesList, isLoadingCaptions, captionsError } = useApp();
  const favorites = getFavoritesList();

  const renderFavorites = () => {
    if (isLoadingCaptions) {
      return (
        <div className="no-favorites">
          <p>Loading your favorite captions…</p>
        </div>
      );
    }

    if (captionsError) {
      return (
        <div className="no-favorites">
          <p>{captionsError}</p>
        </div>
      );
    }

    if (!favorites.length) {
      return (
        <div className="no-favorites">
          <p>You haven't added any favorites yet.</p>
          <p>Start exploring captions and add them to your favorites!</p>
        </div>
      );
    }

    return favorites.map((caption) => <CaptionCard key={caption.id} caption={caption} />);
  };

  return (
    <div className="favorites-page">
      <Navbar />
      
      <div className="container">
        <h2 className="fav-title">❤ Your Favorites</h2>

        <div className="feed">{renderFavorites()}</div>
      </div>
    </div>
  );
};

export default Favorites;

