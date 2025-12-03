import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, PaperPlaneRight, Image as ImageIcon, TextT, UploadSimple, WarningCircle, Keyboard as KeyboardIcon, Backspace } from '@phosphor-icons/react';


// Added prop: initialLang
const Upload = ({ initialLang = 'english' }) => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const textareaRef = useRef(null); 
    
    const [mode, setMode] = useState('text'); 
    const [error, setError] = useState('');
    
    // Auto-show keyboard if coming in with Urdu selected
    const [showKeyboard, setShowKeyboard] = useState(initialLang === 'urdu');
  
    const [formData, setFormData] = useState({
      text: '',
      language: initialLang, // Initialize with the passed prop
      category: '',
      imageResult: null 
    });
  
    const [uploadedImage, setUploadedImage] = useState(null);
    const [style, setStyle] = useState({
      fontSize: 40,
      color: '#ffffff',
      yPos: 50,
      shadow: true
    });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urduKeys = [
    'ا', 'ب', 'پ', 'ت', 'ٹ', 'ث', 'ج', 'چ', 'ح', 'خ',
    'د', 'ڈ', 'ذ', 'ر', 'ڑ', 'ز', 'ژ', 'س', 'ش', 'ص',
    'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل',
    'م', 'ن', 'و', 'ہ', 'ھ', 'ء', 'ی', 'ے', 'آ', 'ۃ',
    '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰',
     'Backspace','۔', '،', '؟', '!', '"', 'Space' 
  ];

  const handleKeyClick = (char) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = formData.text;

    if (char === 'Backspace') {
        if (start === end && start > 0) {
            const newText = currentText.substring(0, start - 1) + currentText.substring(end);
            setFormData({ ...formData, text: newText });
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start - 1;
                textarea.focus();
            }, 0);
        } else if (start !== end) {
            const newText = currentText.substring(0, start) + currentText.substring(end);
            setFormData({ ...formData, text: newText });
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = start;
                textarea.focus();
            }, 0);
        }
        return;
    }

    const charToInsert = char === 'Space' ? ' ' : char;
    const newText = currentText.substring(0, start) + charToInsert + currentText.substring(end);

    setFormData({ ...formData, text: newText });

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 1;
      textarea.focus();
    }, 0);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            setUploadedImage(img);
            setError('');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (mode === 'image' && uploadedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const scale = Math.min(800 / uploadedImage.width, 1);
      canvas.width = uploadedImage.width * scale;
      canvas.height = uploadedImage.height * scale;

      ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

      if (formData.text) {
        ctx.font = `bold ${style.fontSize}px ${formData.language === 'urdu' ? 'Noto Nastaliq Urdu' : 'Inter'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = style.color;
        
        const maxWidth = canvas.width * 0.9;
        const x = canvas.width / 2;
        const y = (canvas.height * style.yPos) / 100;
        const lineHeight = style.fontSize * 1.5; 
        
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
  }, [uploadedImage, formData.text, style, mode, formData.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'image' && !uploadedImage) {
        setError('Please upload an image to continue.');
        return;
    }

    if (!formData.text.trim()) {
        setError('Please write a caption first.');
        return;
    }

    setIsSubmitting(true);

    let finalPayload = { ...formData };
    
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
    // 1. Root: Fixed height on desktop to enable internal scrolling
    <div className="flex flex-col h-full w-full overflow-y-auto lg:overflow-hidden">
      
      {/* 2. Wrapper: Flex-1 ensures it fills available space */}
      <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full h-full">
        
        {/* Header */}
        <div className="flex-shrink-0 mb-4 lg:mb-6">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white transition">
              <ArrowLeft size={20} /> Back to Feed
            </button>
        </div>

        {/* 3. Grid: min-h-0 is crucial for scrolling children in flex containers */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-0">
          
          {/* LEFT COLUMN: Controls */}
          {/* overflow-y-auto enables the scrollbar here specifically */}
          <div className="flex flex-col order-2 lg:order-1 lg:overflow-y-auto lg:pr-2 custom-scrollbar pb-10">
              <div className="mb-4 lg:mb-6">
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-1 lg:mb-2 transition-colors">Create Vibe</h2>
                  <p className="text-slate-500 dark:text-gray-400 text-sm transition-colors">Choose your format</p>
              </div>

              {/* Mode Switcher */}
              <div className="flex bg-white dark:bg-[#1A1625] p-1 rounded-xl border border-purple-100 dark:border-[#2F2645] mb-6 transition-colors shadow-sm dark:shadow-none">
                  <button 
                      onClick={() => { setMode('text'); setError(''); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all 
                      ${mode === 'text' 
                          ? 'bg-purple-100 dark:bg-[#2F2645] text-purple-700 dark:text-white shadow-sm' 
                          : 'text-slate-500 dark:text-gray-400'}`}
                  >
                      <TextT size={18} /> Caption Only
                  </button>
                  <button 
                      onClick={() => { setMode('image'); setError(''); }}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all 
                      ${mode === 'image' 
                          ? 'bg-purple-100 dark:bg-[#2F2645] text-purple-700 dark:text-white shadow-sm' 
                          : 'text-slate-500 dark:text-gray-400'}`}
                  >
                      <ImageIcon size={18} /> Image + Caption
                  </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Language */}
                  <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">Language</label>
                      <div className="flex gap-2 mt-2">
                      {['english', 'urdu', 'roman'].map((lang) => (
                          <button
                          key={lang}
                          type="button"
                          onClick={() => {
                              setFormData({ ...formData, language: lang });
                              if (lang !== 'urdu') setShowKeyboard(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border capitalize transition-colors
                          ${formData.language === lang 
                              ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500' 
                              : 'bg-white dark:bg-[#1A1625] border-purple-100 dark:border-[#2F2645] text-slate-500 dark:text-gray-400'}`}
                          >
                          {lang}
                          </button>
                      ))}
                      </div>
                  </div>

                  {/* Text Input */}
                  <div>
                      <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">Caption Text</label>
                          
                          {formData.language === 'urdu' && (
                              <button 
                                  type="button"
                                  onClick={() => setShowKeyboard(!showKeyboard)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all 
                                  ${showKeyboard 
                                      ? 'bg-purple-600 text-white' 
                                      : 'bg-purple-100 dark:bg-[#2F2645] text-purple-600 dark:text-gray-400 hover:bg-purple-200 dark:hover:text-white'}`}
                              >
                                  <KeyboardIcon size={16} />
                                  {showKeyboard ? 'Hide Keypad' : 'Urdu Keypad'}
                              </button>
                          )}
                      </div>

                      <textarea
                          ref={textareaRef}
                          required
                          rows={mode === 'text' ? 4 : 2}
                          value={formData.text}
                          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                          dir={formData.language === 'urdu' ? 'rtl' : 'ltr'}
                          // FIX: Text Color -> text-purple-700 (Light) | text-white (Dark)
                          className={`w-full bg-white dark:bg-[#1A1625] border border-purple-100 dark:border-[#2F2645] rounded-xl p-4 text-purple-700 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:border-purple-500 dark:focus:border-purple-500 outline-none resize-none transition-colors shadow-sm dark:shadow-none
                              ${formData.language === 'urdu' ? 'font-urdu text-xl' : 'font-sans'}`}
                          placeholder={
                              formData.language === 'urdu' ? 'یہاں ٹائپ کریں...' :
                              formData.language === 'roman' ? 'Yahan likhein...' :
                              'Type your caption here...'
                          }
                      />

                      {/* ON-SCREEN KEYBOARD */}
                      {formData.language === 'urdu' && showKeyboard && (
                          <div className="mt-2 bg-white dark:bg-[#151221] p-2 rounded-xl border border-purple-100 dark:border-[#2F2645] animate-in fade-in zoom-in-95 duration-200 transition-colors shadow-sm dark:shadow-none">
                              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5" dir="rtl">
                                  {urduKeys.map((char, index) => (
                                      <button
                                          key={index}
                                          type="button"
                                          onClick={() => handleKeyClick(char)}
                                          className={`h-9 sm:h-8 rounded bg-purple-50/50 dark:bg-[#2F2645] border border-purple-100 dark:border-transparent hover:bg-purple-500 hover:text-white hover:border-purple-500 text-slate-700 dark:text-gray-300 font-urdu text-lg transition-colors flex items-center justify-center shadow-sm
                                              ${char === 'Space' ? 'col-span-2 sm:col-span-3 text-xs font-sans' : ''}
                                              ${char === 'Backspace' ? 'col-span-1 sm:col-span-2 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border-red-100 dark:border-transparent hover:bg-red-500 hover:text-white hover:border-red-500' : ''}
                                          `}
                                      >
                                          {char === 'Backspace' ? <Backspace size={20} /> : char}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Category */}
                  <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">Tag</label>
                      <input 
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="mt-2 w-full bg-white dark:bg-[#1A1625] border border-purple-100 dark:border-[#2F2645] rounded-xl p-3 text-slate-900 dark:text-white focus:border-purple-500 outline-none transition-colors shadow-sm dark:shadow-none"
                          placeholder="#Vibes"
                      />
                  </div>

                  {/* IMAGE CONTROLS */}
                  {mode === 'image' && (
                      <div className={`bg-white dark:bg-[#1A1625] p-4 rounded-xl border ${error && !uploadedImage ? 'border-red-400 bg-red-50 dark:border-red-500/50 dark:bg-red-500/5' : 'border-purple-100 dark:border-[#2F2645]'} space-y-4 transition-all shadow-sm dark:shadow-none`}>
                          {!uploadedImage && (
                              <div className="border-2 border-dashed border-purple-200 dark:border-[#2F2645] rounded-xl p-6 text-center hover:border-purple-500 dark:hover:border-purple-500 transition-colors cursor-pointer relative group">
                                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                  <UploadSimple size={24} className="mx-auto text-slate-400 group-hover:text-purple-500 mb-2 transition-colors" />
                                  <p className="text-xs text-slate-500 dark:text-gray-400 group-hover:text-purple-500">Click to upload</p>
                              </div>
                          )}

                          {uploadedImage && (
                              <>
                                  <div>
                                      <label className="text-xs text-slate-500 dark:text-gray-500">Size</label>
                                      <input type="range" min="20" max="100" value={style.fontSize} onChange={(e) => setStyle({...style, fontSize: parseInt(e.target.value)})} className="w-full accent-purple-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                  </div>
                                  <div>
                                      <label className="text-xs text-slate-500 dark:text-gray-500">Position</label>
                                      <input type="range" min="10" max="90" value={style.yPos} onChange={(e) => setStyle({...style, yPos: parseInt(e.target.value)})} className="w-full accent-purple-600 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                  </div>
                                  <div className="flex items-center justify-between">
                                      <label className="text-xs text-slate-500 dark:text-gray-500">Color</label>
                                      <div className="relative w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer shadow-sm">
                                          <div className="w-full h-full" style={{ backgroundColor: style.color }} />
                                          <input 
                                              type="color" 
                                              value={style.color} 
                                              onChange={(e) => setStyle({...style, color: e.target.value})} 
                                              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
                                          />
                                      </div>
                                  </div>
                                  <button type="button" onClick={() => setUploadedImage(null)} className="text-xs text-red-500 dark:text-red-400 underline">Change Image</button>
                              </>
                          )}
                      </div>
                  )}

                  {/* ERROR MESSAGE DISPLAY */}
                  {error && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20 animate-pulse transition-colors">
                          <WarningCircle size={20} weight="fill" />
                          {error}
                      </div>
                  )}

                  {/* FIX: Post Button UI */}
                  <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl font-bold text-slate-900 dark:text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                      {isSubmitting ? 'Processing...' : (
                          <>
                              <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-45 transition-transform duration-300">
                                  <PaperPlaneRight size={20} weight="fill" />
                              </div>
                              {mode === 'image' ? 'Post Image Vibe' : 'Post Caption'}
                          </>
                      )}
                  </button>
              </form>
          </div>

          {/* RIGHT COLUMN: Preview */}
          <div className="order-1 lg:order-2 w-full h-auto min-h-[300px] lg:h-full bg-white dark:bg-[#110E1B] rounded-2xl border border-purple-100 dark:border-[#2F2645] p-4 flex items-center justify-center overflow-hidden transition-colors duration-300 shadow-sm dark:shadow-none sticky top-0 lg:static">
              {mode === 'text' ? (
                  <div className="w-full max-w-sm aspect-square rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 flex items-center justify-center shadow-2xl animate-in zoom-in duration-300">
                      <p className={`text-2xl font-bold text-slate-900 dark:text-white text-center break-words overflow-wrap-anywhere px-4 ${formData.language === 'urdu' ? 'font-urdu' : 'font-sans'}`}>
                          "{formData.text || 'Your caption here...'}"
                      </p>
                  </div>
              ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                      {!uploadedImage && (
                          <div className="text-center">
                              <ImageIcon size={48} className={`mx-auto mb-2 transition-colors duration-300 ${error ? 'text-red-500 dark:text-red-400' : 'text-purple-200 dark:text-[#2F2645]'}`} />
                              <p className={`text-sm transition-colors duration-300 ${error ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-gray-500'}`}>
                                  {error ? 'Please upload an image!' : 'Upload an image to start editing'}
                              </p>
                          </div>
                      )}
                      <canvas 
                          ref={canvasRef} 
                          className={`max-w-full max-h-[400px] lg:max-h-full object-contain shadow-2xl rounded-lg ${!uploadedImage ? 'hidden' : 'block'}`}
                      />
                  </div>
              )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Upload;