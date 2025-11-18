import React from 'react';
import { useApp } from '../context/AppContext';
import Navbar from './Navbar';
import CaptionCard from './CaptionCard';
import './Homepage.css';

const colorPalette = ['pink', 'blue', 'yellow', 'purple', 'orange', 'teal', 'grey', 'green'];

const Homepage = () => {
  const {
    getFilteredCaptions,
    setSelectedCategory,
    selectedCategory,
    categories,
    isLoadingCaptions,
    captionsError
  } = useApp();
  const captions = getFilteredCaptions();

  const getColorClass = (categoryName, index) => {
    if (categoryName === 'All') {
      return 'grey';
    }

    const predefined = {
      Love: 'pink',
      Sad: 'blue',
      Funny: 'yellow',
      Motivation: 'purple',
      Friendship: 'orange',
      Poetic: 'teal',
      Aesthetic: 'grey',
      GenZ: 'green',
      'Gen-Z': 'green',
      'Gen-Z Trendy': 'green'
    };

    return predefined[categoryName] || colorPalette[index % colorPalette.length];
  };

  const renderFeed = () => {
    if (isLoadingCaptions) {
      return <div className="no-captions">Loading captions…</div>;
    }

    if (captionsError) {
      return <div className="no-captions error">{captionsError}</div>;
    }

    if (!captions.length) {
      return <div className="no-captions">No captions found in this category.</div>;
    }

    return captions.map((caption) => <CaptionCard key={caption.id} caption={caption} />);
  };

  return (
    <div className="homepage">
      <Navbar />

      <div className="container">
        {/* Categories Sidebar */}
        <aside className="categories">
          <h3>Categories</h3>
          <div className="category-list">
            {categories.map((cat, index) => (
              <div
                key={cat}
                className={`cat-box ${getColorClass(cat, index)} ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'All' ? 'All Captions' : cat}
              </div>
            ))}
          </div>
        </aside>

        {/* Caption Feed */}
        <main className="feed">{renderFeed()}</main>
      </div>
    </div>
  );
};

export default Homepage;

