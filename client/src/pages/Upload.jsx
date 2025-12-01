import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PaperPlaneRight, Image as ImageIcon, TextT, UploadSimple, WarningCircle } from '@phosphor-icons/react';

const Upload = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  
  // Tabs: 'text' or 'image'
  const [mode, setMode] = useState('text'); 
  const [error, setError] = useState(''); // New Error State

  const [formData, setFormData] = useState({
    text: '',
    language: 'english',
    category: '',
    imageResult: null 
  });

  // Image Editor State
  const [uploadedImage, setUploadedImage] = useState(null);
  const [style, setStyle] = useState({
    fontSize: 40,
    color: '#ffffff',
    yPos: 50, // Percentage from top
    shadow: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- IMAGE EDITOR LOGIC ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            setUploadedImage(img);
            setError(''); // Clear error when image is uploaded
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw on Canvas whenever inputs change
  useEffect(() => {
    if (mode === 'image' && uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // 1. Set Canvas Size
      const scale = Math.min(800 / uploadedImage.width, 1);
      canvas.width = uploadedImage.width * scale;
      canvas.height = uploadedImage.height * scale;

      // 2. Draw Image
      ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

      // 3. Draw Text
      if (formData.text) {
        ctx.font = `bold ${style.fontSize}px ${formData.language === 'urdu' ? 'Noto Nastaliq Urdu' : 'Inter'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = style.color;
        
        const maxWidth = canvas.width * 0.9;
        const x = canvas.width / 2;
        const y = (canvas.height * style.yPos) / 100;
        const lineHeight = style.fontSize * 1.2;
        
        const words = formData.text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        
        const startY = y - ((lines.length - 1) * lineHeight) / 2;
        
        lines.forEach((line, index) => {
          const lineY = startY + (index * lineHeight);
          if (style.shadow) {
            ctx.shadowColor = "black";
            ctx.shadowBlur = 8;
            ctx.lineWidth = 4;
            ctx.strokeText(line, x, lineY);
            ctx.shadowBlur = 0; 
          }
          ctx.fillText(line, x, lineY);
        });
      }
    }
  }, [uploadedImage, formData.text, style, mode]);

  // --- SUBMISSION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset errors

    // 1. VALIDATION CHECK
    if (mode === 'image' && !uploadedImage) {
        setError('Please upload an image to continue.');
        return; // Stop execution
    }

    if (!formData.text.trim()) {
        setError('Please write a caption first.');
        return;
    }

    setIsSubmitting(true);

    let finalPayload = { ...formData };
    
    // Prepare Image Payload
    if (mode === 'image' && canvasRef.current) {
        finalPayload.image = canvasRef.current.toDataURL('image/jpeg', 0.8);
    }

    try {
      const response = await fetch('http://localhost:5000/api/captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });

      if (response.ok) {
        navigate('/');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-7xl mx-auto w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <ArrowLeft size={20} /> Back to Feed
          </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        
        {/* LEFT COLUMN: Controls */}
        <div className="flex flex-col overflow-y-auto pr-2 custom-scrollbar">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">Create Vibe</h2>
                <p className="text-gray-400 text-sm">Choose your format</p>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-[#1A1D23] p-1 rounded-xl border border-gray-700 mb-6">
                <button 
                    onClick={() => { setMode('text'); setError(''); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${mode === 'text' ? 'bg-[#2A2E35] text-white shadow' : 'text-gray-400'}`}
                >
                    <TextT size={18} /> Caption Only
                </button>
                <button 
                    onClick={() => { setMode('image'); setError(''); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${mode === 'image' ? 'bg-[#2A2E35] text-white shadow' : 'text-gray-400'}`}
                >
                    <ImageIcon size={18} /> Image + Caption
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Language */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Language</label>
                    <div className="flex gap-2 mt-2">
                    {['english', 'urdu', 'roman'].map((lang) => (
                        <button
                        key={lang}
                        type="button"
                        onClick={() => setFormData({ ...formData, language: lang })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border capitalize ${formData.language === lang ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-[#1A1D23] border-gray-700 text-gray-400'}`}
                        >
                        {lang}
                        </button>
                    ))}
                    </div>
                </div>

                {/* Text Input */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Caption Text</label>
                    <textarea
                    required
                    rows={mode === 'text' ? 4 : 2}
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className={`mt-2 w-full bg-[#1A1D23] border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:border-purple-500 outline-none resize-none
                        ${formData.language === 'urdu' ? 'text-right font-urdu' : 'text-left font-sans'}`}
                    placeholder="Type your caption here..."
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tag</label>
                    <input 
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="mt-2 w-full bg-[#1A1D23] border border-gray-700 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                        placeholder="#Vibes"
                    />
                </div>

                {/* IMAGE CONTROLS */}
                {mode === 'image' && (
                    <div className={`bg-[#1A1D23] p-4 rounded-xl border ${error && !uploadedImage ? 'border-red-500/50 bg-red-500/5' : 'border-gray-700'} space-y-4 transition-all`}>
                         {!uploadedImage && (
                            <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-purple-500 transition-colors cursor-pointer relative">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <UploadSimple size={24} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-xs text-gray-400">Click to upload</p>
                            </div>
                         )}

                         {uploadedImage && (
                             <>
                                <div>
                                    <label className="text-xs text-gray-500">Size</label>
                                    <input type="range" min="20" max="100" value={style.fontSize} onChange={(e) => setStyle({...style, fontSize: parseInt(e.target.value)})} className="w-full accent-purple-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Position</label>
                                    <input type="range" min="10" max="90" value={style.yPos} onChange={(e) => setStyle({...style, yPos: parseInt(e.target.value)})} className="w-full accent-purple-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <label className="text-xs text-gray-500">Color</label>
                                    <input type="color" value={style.color} onChange={(e) => setStyle({...style, color: e.target.value})} className="bg-transparent border-none w-8 h-8 cursor-pointer" />
                                </div>
                                <button type="button" onClick={() => setUploadedImage(null)} className="text-xs text-red-400 underline">Change Image</button>
                             </>
                         )}
                    </div>
                )}

                {/* ERROR MESSAGE DISPLAY */}
                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-pulse">
                        <WarningCircle size={20} weight="fill" />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Processing...' : <><PaperPlaneRight size={20} weight="fill" /> {mode === 'image' ? 'Post Image Vibe' : 'Post Caption'}</>}
                </button>
            </form>
        </div>

        {/* RIGHT COLUMN: Preview */}
        <div className="h-full bg-[#0d0f12] rounded-2xl border border-gray-800 p-4 flex items-center justify-center overflow-hidden">
            {mode === 'text' ? (
                <div className="w-full max-w-sm aspect-square rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 flex items-center justify-center shadow-2xl animate-in zoom-in duration-300">
                    <p className={`text-2xl font-bold text-white text-center break-words overflow-wrap-anywhere px-4 ${formData.language === 'urdu' ? 'font-urdu' : 'font-sans'}`}>
                        "{formData.text || 'Your caption here...'}"
                    </p>
                </div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    {!uploadedImage && (
                        <div className="text-center">
                            <ImageIcon size={48} className={`mx-auto mb-2 ${error ? 'text-red-400' : 'text-gray-700'}`} />
                            <p className={`${error ? 'text-red-400' : 'text-gray-500'} text-sm`}>
                                {error ? 'Please upload an image!' : 'Upload an image to start editing'}
                            </p>
                        </div>
                    )}
                    <canvas 
                        ref={canvasRef} 
                        className={`max-w-full max-h-full object-contain shadow-2xl rounded-lg ${!uploadedImage ? 'hidden' : 'block'}`}
                    />
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Upload;