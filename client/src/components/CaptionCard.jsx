import React, { useState } from 'react';
import { Copy, HeartStraight, DownloadSimple, Share } from '@phosphor-icons/react';

const CaptionCard = ({ data, onCopy, user, isFavorited: initialIsFavorited, onFavoriteToggle }) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited || false);
  const [isToggling, setIsToggling] = useState(false);

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = data.image;
    link.download = `caption-vibes-${data._id}.jpg`;
    link.click();
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    
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
    e.stopPropagation();
    
    const shareData = {
      title: 'CaptionVibes',
      text: data.text,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Share error:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(data.text);
        alert('Caption copied to clipboard!');
      } catch (err) {
        prompt('Copy this caption:', data.text);
      }
    }
  };

  return (
    <div 
      onClick={() => onCopy(data.text)}
      className="break-inside-avoid mb-6 group relative overflow-hidden rounded-2xl bg-white dark:bg-[#1A1625] shadow-sm hover:shadow-md dark:shadow-none transition-all hover:scale-[1.02] cursor-pointer border border-purple-100 dark:border-[#2F2645]"
    >
      {/* 1. CONTENT AREA */}
      {data.image ? (
        // --- IMAGE MODE CARD ---
        <div className="relative overflow-hidden bg-gray-50 dark:bg-[#110E1B] flex items-center justify-center min-h-[300px] transition-colors">
             <img 
               src={data.image} 
               alt={data.text || "Caption"} 
               className="w-full h-auto object-contain max-h-[600px] mx-auto block"
               onError={(e) => {
                 e.target.style.display = 'none';
               }}
             />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
        </div>
      ) : (
        // --- TEXT ONLY MODE CARD ---
        <div className={`p-8 bg-gradient-to-br ${data.gradient || 'from-gray-700 to-gray-900'}`}>
             
             {/* Text remains white because it is on a colored gradient background */}
             <p 
                dir={data.language === 'urdu' ? 'rtl' : 'ltr'} 
                className={`font-bold text-slate-900 dark:text-white text-center leading-tight py-4 drop-shadow-md break-words overflow-wrap-anywhere
                ${data.language === 'urdu' 
                    ? 'font-urdu text-2xl md:text-2xl leading-loose' 
                    : 'font-sans text-xl md:text-2xl'
                }`}
             >
                "{data.text}"
            </p>

        </div>
      )}

      {/* 2. OVERLAY ACTIONS */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        {data.image && (
            <button onClick={handleDownload} className="w-8 h-8 bg-black/30 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/50 text-white transition-colors">
                <DownloadSimple size={16} />
            </button>
        )}
        <button className="w-8 h-8 bg-black/30 backdrop-blur rounded-full flex items-center justify-center hover:bg-black/50 text-white transition-colors">
          <Copy size={16} />
        </button>
      </div>

      {/* 3. FOOTER INFO */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1A1625] border-t border-purple-100 dark:border-[#2F2645] transition-colors">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleFavorite}
            disabled={isToggling || !user}
            className="text-slate-400 dark:text-gray-400 hover:text-purple-600 dark:hover:text-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
            title={user ? (isFavorited ? 'Remove from favorites' : 'Add to favorites') : 'Login to favorite'}
          >
            <HeartStraight 
              size={20} 
              weight={isFavorited ? 'fill' : 'regular'}
              className={isFavorited ? 'text-purple-600 dark:text-red-500' : ''}
            />
          </button>
          <button 
            onClick={handleShare}
            className="text-slate-400 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
          >
            <Share size={20} />
          </button>
        </div>
        
        {/* Tags */}
        <div className="flex gap-2">
            <span className="text-[10px] text-slate-500 dark:text-gray-400 border border-purple-200 dark:border-gray-600 px-2 py-0.5 rounded capitalize transition-colors">
              {data.language}
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-2 py-0.5 rounded capitalize transition-colors">
              {data.category || 'Vibe'}
            </span>
        </div>
      </div>
    </div>
  );
};

export default CaptionCard;