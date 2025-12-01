import React, { useState, useEffect } from 'react';
import CaptionCard from './CaptionCard';

const Feed = ({ selectedLang, onCopy, user, mode = 'feed' }) => {
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritedMap, setFavoritedMap] = useState({});

  // Fetch favorites status for all captions
  useEffect(() => {
    if (user && captions.length > 0) {
      const captionIds = captions.map(c => c._id).join(',');
      fetch(`http://localhost:5000/api/favorites/check/${user._id || user.id}?captionIds=${captionIds}`)
        .then(res => res.json())
        .then(data => setFavoritedMap(data))
        .catch(err => console.error('Error fetching favorites:', err));
    }
  }, [user, captions]);

  // Re-fetch whenever selectedLang or mode changes
  useEffect(() => {
    setLoading(true);
    
    if (mode === 'favorites' && user) {
      // Fetch user's favorites
      fetch(`http://localhost:5000/api/favorites/${user._id || user.id}`)
        .then(res => res.json())
        .then(data => {
          // Filter by selected language
          const filtered = data.filter(caption => caption.language === selectedLang);
          setCaptions(filtered);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      // Fetch regular feed
      fetch(`http://localhost:5000/api/captions?lang=${selectedLang}`)
        .then(res => res.json())
        .then(data => {
          setCaptions(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [selectedLang, mode, user]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white capitalize">
          {mode === 'favorites' ? 'Your Favorites' : `${selectedLang} Feed`}
        </h2>
        <p className="text-gray-400 mt-1">
          {mode === 'favorites' 
            ? 'Captions you\'ve hearted' 
            : (selectedLang === 'urdu' ? 'تازہ ترین کیپشنز' : 'Fresh captions for your next post.')
          }
        </p>
      </div>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading...</div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {captions.length > 0 ? (
            captions.map((caption) => (
              <CaptionCard 
                key={caption._id} 
                data={caption} 
                onCopy={onCopy}
                user={user}
                isFavorited={favoritedMap[caption._id] || false}
                onFavoriteToggle={(captionId, favorited) => {
                  setFavoritedMap(prev => ({
                    ...prev,
                    [captionId]: favorited
                  }));
                  // If in favorites mode and unfavorited, remove from list
                  if (mode === 'favorites' && !favorited) {
                    setCaptions(prev => prev.filter(c => c._id !== captionId));
                  }
                }}
              />
            ))
          ) : (
            <div className="text-gray-500 col-span-full py-10 text-center border border-dashed border-gray-800 rounded-xl">
              {mode === 'favorites' 
                ? (user ? "You haven't favorited any captions yet." : "Please login to view your favorite captions.")
                : `No captions found in ${selectedLang} yet. Be the first to upload!`
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;