import React, { useState } from 'react';
import { Copy, HeartStraight, DownloadSimple, Share } from '@phosphor-icons/react';

const CaptionCard = ({ data, onCopy, user, isFavorited: initialIsFavorited, onFavoriteToggle }) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited || false);
  const [isToggling, setIsToggling] = useState(false);
  const handleDownload = (e) => {
    e.stopPropagation(); // Prevent clicking the card
    const link = document.createElement('a');
    link.href = data.image;
    link.download = `caption-vibes-${data._id}.jpg`;
    link.click();
  };

  const handleFavorite = async (e) => {
    e.stopPropagation(); // Prevent clicking the card
    
    if (!user) {
      alert('Please login to favorite captions');
      return;
    }

    setIsToggling(true);
    try {
      const response = await fetch('http://localhost:5000/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id || user.id,
          captionId: data._id
        })
      });

      const result = await response.json();
      if (response.ok) {
        setIsFavorited(result.favorited);
        if (onFavoriteToggle) {
          onFavoriteToggle(data._id, result.favorited);
        }
      }
    } catch (err) {
      console.error('Favorite toggle error:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation(); // Prevent clicking the card
    
    const shareData = {
      title: 'CaptionVibes',
      text: data.text,
      url: window.location.href
    };

    // Try Web Share API first (works on mobile and some desktop browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error occurred
        if (err.name !== 'AbortError') {
          console.error('Share error:', err);
        }
      }
    } else {
      // Fallback: Copy text to clipboard
      try {
        await navigator.clipboard.writeText(data.text);
        alert('Caption copied to clipboard!');
      } catch (err) {
        console.error('Copy error:', err);
        // Final fallback: show text in prompt
        prompt('Copy this caption:', data.text);
      }
    }
  };

  return (
    <div 
      onClick={() => onCopy(data.text)}
      className="break-inside-avoid mb-6 group relative overflow-hidden rounded-2xl bg-[#1A1D23] shadow-lg transition-all hover:scale-[1.02] cursor-pointer border border-gray-800"
    >
      {/* 1. CONTENT AREA */}
      {data.image ? (
        // --- IMAGE MODE CARD ---
        <div className="relative overflow-hidden bg-[#0d0f12] flex items-center justify-center min-h-[300px]">
             <img 
               src={data.image} 
               alt={data.text || "Caption"} 
               className="w-full h-auto object-contain max-h-[600px] mx-auto block"
               onError={(e) => {
                 console.error('Image failed to load:', data.image?.substring(0, 50));
                 e.target.style.display = 'none';
               }}
             />
             {/* Gradient overlay at bottom for text readability if needed, though we burnt text in */}
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
        </div>
      ) : (
        // --- TEXT ONLY MODE CARD (Gradient) ---
        <div className={`p-8 bg-gradient-to-br ${data.gradient || 'from-gray-700 to-gray-900'}`}>
             <p className={`text-xl md:text-2xl font-bold text-white text-center leading-tight py-4 drop-shadow-md break-words overflow-wrap-anywhere
                ${data.language === 'urdu' ? 'font-urdu' : 'font-sans'}`}>
                "{data.text}"
            </p>
        </div>
      )}

      {/* 2. OVERLAY ACTIONS (Top Right) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        {/* Download Button (Only for images) */}
        {data.image && (
            <button onClick={handleDownload} className="w-8 h-8 bg-black/30 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/50 text-white">
                <DownloadSimple size={16} />
            </button>
        )}
        {/* Copy Button */}
        <button className="w-8 h-8 bg-black/30 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/50 text-white">
          <Copy size={16} />
        </button>
      </div>

      {/* 3. FOOTER INFO */}
      <div className="flex items-center justify-between p-4 bg-[#1A1D23] border-t border-gray-800">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleFavorite}
            disabled={isToggling || !user}
            className="text-gray-300 hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title={user ? (isFavorited ? 'Remove from favorites' : 'Add to favorites') : 'Login to favorite'}
          >
            <HeartStraight 
              size={20} 
              weight={isFavorited ? 'fill' : 'regular'}
              className={isFavorited ? 'text-red-500' : ''}
            />
          </button>
          <button 
            onClick={handleShare}
            className="text-gray-300 hover:text-blue-400 transition"
            title="Share caption"
          >
            <Share size={20} />
          </button>
        </div>
        <div className="flex gap-2">
            <span className="text-[10px] text-gray-500 border border-gray-700 px-2 py-0.5 rounded capitalize">
            {data.language}
            </span>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded capitalize">
            {data.category || 'Vibe'}
            </span>
        </div>
      </div>
    </div>
  );
};

export default CaptionCard;