import React, { useState, useEffect } from 'react';
import CaptionCard from './CaptionCard';

const Feed = ({ selectedLang, searchQuery, onCopy, user, mode = 'feed' }) => {
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritedMap, setFavoritedMap] = useState({});

  // 1. Fetch favorites status mapping
  useEffect(() => {
    if (user && captions.length > 0) {
      const captionIds = captions.map(c => c._id).join(',');
      fetch(`http://localhost:5000/api/favorites/check/${user._id || user.id}?captionIds=${captionIds}`)
        .then(res => res.json())
        .then(data => setFavoritedMap(data))
        .catch(err => console.error('Error fetching favorites:', err));
    }
  }, [user, captions]);

  // 2. Fetch Data (Debounced Search)
  useEffect(() => {
    setLoading(true);

    // Debounce: Wait 500ms after typing stops
    const delayDebounceFn = setTimeout(() => {
      
      if (mode === 'favorites' && user) {
        // --- FETCH FAVORITES ---
        fetch(`http://localhost:5000/api/favorites/${user._id || user.id}`)
          .then(res => res.json())
          .then(data => {
            // Filter by Language
            let filtered = data.filter(caption => caption.language === selectedLang);
            
            // Filter by Search Query (Client-side for favorites)
            if (searchQuery) {
              const query = searchQuery.toLowerCase();
              filtered = filtered.filter(c => 
                c.text.toLowerCase().includes(query) || 
                (c.category && c.category.toLowerCase().includes(query))
              );
            }
            
            setCaptions(filtered);
            setLoading(false);
          })
          .catch(err => {
            console.error(err);
            setLoading(false);
          });

      } else {
        // --- FETCH MAIN FEED ---
        const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
        
        fetch(`http://localhost:5000/api/captions?lang=${selectedLang}${searchParam}`)
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

    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
    
  }, [selectedLang, mode, user, searchQuery]); // Re-run when these change

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        
        {/* --- HEADER --- */}
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          {mode === 'favorites' ? (
            <span className="text-purple-700 dark:text-white">Your Favorites</span>
          ) : (
            <>
              <span className="capitalize text-purple-700 dark:text-white">{selectedLang} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Feed</span>
            </>
          )}
        </h2>
        
        <p className="text-purple-700/70 dark:text-gray-400 font-medium text-sm transition-colors">
          {mode === 'favorites' 
            ? 'Captions you\'ve collected and hearted.' 
            : (selectedLang === 'urdu' ? 'تازہ ترین کیپشنز آپ کی اگلی پوسٹ کے لیے' : 'Fresh vibes & captions for your next post.')
          }
        </p>
        {/* ---------------- */}

      </div>

      {loading ? (
        <div className="text-slate-400 dark:text-gray-500 animate-pulse">Loading vibes...</div>
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
            // --- EMPTY STATE ---
            <div className="text-slate-400 dark:text-gray-500 col-span-full py-12 text-center border border-dashed border-purple-200 dark:border-[#2F2645] rounded-2xl bg-white/50 dark:bg-[#1A1625]/50 transition-colors">
              {searchQuery ? (
                 <span>No captions found matching "{searchQuery}"</span>
              ) : (
                 mode === 'favorites' 
                  ? (user ? "You haven't favorited any captions yet." : "Please login to view your favorite captions.")
                  : `No captions found in ${selectedLang} yet. Be the first to upload!`
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;