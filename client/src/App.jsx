import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Download, RotateCcw, Pencil, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import './index.css';

const API_BASE_URL = 'http://localhost:5000';

/* ===== LOADING SPINNER ===== */
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner-rings">
        <div className="spinner-ring spinner-ring-1"></div>
        <div className="spinner-ring spinner-ring-2"></div>
      </div>
      <div className="loading-text">
        <h3 style={{fontWeight: 900, fontSize: 24, marginBottom: 8}}>Crafting Masterpiece...</h3>
        <p style={{color: 'var(--text-secondary)'}}>Generating viral copy and loading AI visuals.</p>
      </div>
    </div>
  );
}

/* ===== SLIDE CARD (INSTAGRAM MOCK) ===== */
function SlideCard({ slide, index, onUpdate, format, onRegenerate, isRegenerating, totalSlides }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(slide.title);
  const [editContent, setEditContent] = useState(slide.content);
  
  // Image handling
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);

  const imageUrl = slide.imagePrompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(slide.imagePrompt)}?width=1000&height=1000&nologo=true` : '';

  const labels = ['Hook', 'Problem', 'Insight', 'Solution', 'Action'];
  let slideLabel = labels[index] || `Slide ${index + 1}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      // Temporarily expand to exact square to capture clean layout without cutoffs on mobile
      const canvas = await html2canvas(cardRef.current, { 
        backgroundColor: '#0a0a0f', 
        useCORS: true, 
        scale: 2 
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `studio-slide-${index + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed", err);
      alert("Cross-Origin export issue or image still loading. Wait 1 sec and try again.");
    }
  }

  const handleSave = () => {
    onUpdate(index, { ...slide, title: editTitle, content: editContent });
    setIsEditing(false);
  };

  if (isRegenerating) {
    return (
      <div className={`slide-card-container format-${format}`}>
        <div className="slide-canvas-area" style={{justifyContent: 'center', alignItems: 'center'}}>
          <div className="spinner-rings" style={{width: 40, height: 40}}>
             <div className="spinner-ring spinner-ring-1"></div>
          </div>
          <p style={{marginTop: 16, fontWeight: 700, color: 'var(--brand-color)'}}>Rewriting Slide...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`slide-card-container format-${format}`}>
      {/* THE ACTUAL MOCK CANVAS (Exported via html2canvas) */}
      <div className="slide-canvas-area" ref={cardRef}>
        {/* Background Image & Skeleton Loader */}
        {!imageLoaded && imageUrl && <div className="skeleton-bg"></div>}
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt="AI Generated Background" 
            className="slide-bg-image" 
            style={{ opacity: imageLoaded ? 0.45 : 0 }}
            crossOrigin="anonymous" 
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)} // gracefully fail
          />
        )}
        <div className="slide-overlay"></div>
        
        {/* IG Header Layer */}
        <div className="slide-content-wrapper">
          <div className="ig-mock-header">
            <div className="ig-user-profile">
              <div className="ig-avatar">⚡</div>
              <span className="ig-username">
                studio.ai
                <svg className="ig-verified" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-8.1 8z"/>
                </svg>
              </span>
            </div>
            <MoreHorizontal size={20} color="white" />
          </div>

          {/* IG Content Layer */}
          <div className="slide-card-body">
            {isEditing ? (
              <div style={{marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
                <input
                  type="text"
                  className="slide-title-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="slide-content-textarea"
                  rows={4}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div style={{display: 'inline-block', padding: '4px 10px', background: 'var(--brand-color)', color: 'white', fontSize: 10, fontWeight: 800, borderRadius: 100, marginBottom: 12, width: 'fit-content', textTransform: 'uppercase'}}>
                  {slideLabel}
                </div>
                <h3>{slide.title}</h3>
                <p className="slide-content">{slide.content}</p>
              </>
            )}
          </div>

          {/* IG Footer Layer */}
          <div className="ig-mock-footer">
            <div className="ig-action-bar">
              <div className="ig-action-left">
                <Heart size={22} className="ig-icon" fill="transparent" />
                <MessageCircle size={22} className="ig-icon" />
                <Send size={22} className="ig-icon" />
              </div>
              <Bookmark size={22} className="ig-icon" />
            </div>
            
            <div className="ig-likes">8,419 likes</div>
            
            {/* Pagination Dots */}
            {(format === 'carousel' || totalSlides > 1) && (
              <div className="ig-pagination">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <div key={i} className={`ig-dot ${i === index ? 'active' : ''}`}></div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EXTERNAL EDITOR CONTROLS (Not Exported) */}
      <div className="slide-external-actions">
        {isEditing ? (
          <>
            <button className="btn-action" style={{background: '#22c55e', borderColor: '#22c55e'}} onClick={handleSave}>
              <Check size={16}/> Save Edits
            </button>
            <button className="btn-action" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn-action" onClick={() => setIsEditing(true)}>
              <Pencil size={16}/> Edit
            </button>
            <button className="btn-action" onClick={() => onRegenerate(index)}>
              <RotateCcw size={16}/> Redo
            </button>
            <button className="btn-action btn-download" onClick={handleDownload}>
              <Download size={16}/> Save
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ===== MAIN APP ===== */
function App() {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('carousel');
  const [tone, setTone] = useState('Educational');
  const [brandColor, setBrandColor] = useState('#4f6ef7');

  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regeneratingIndexes, setRegeneratingIndexes] = useState([]);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-color', brandColor);
  }, [brandColor]);

  const generateCarousel = async (inputTopic) => {
    const topicToUse = inputTopic || topic;
    if (!topicToUse.trim()) return;

    setTopic(topicToUse);
    setIsLoading(true);
    setError(null);
    setSlides([]);

    try {
      const response = await axios.post(`${API_BASE_URL}/generate-carousel`, {
        topic: topicToUse,
        format,
        tone,
        brandColor
      });
      if (response.data && response.data.slides) {
        setSlides(response.data.slides);
      } else {
        throw new Error('Invalid response data');
      }
    } catch (err) {
      setError(err.response?.data?.details || err.message || 'Server error. Check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateSlide = async (index) => {
    setRegeneratingIndexes(prev => [...prev, index]);
    const slideToRewrite = slides[index];

    try {
      const response = await axios.post(`${API_BASE_URL}/regenerate-slide`, {
        topic,
        format,
        tone,
        slideIndex: index,
        originalTitle: slideToRewrite.title,
        originalContent: slideToRewrite.content,
      });
      
      if (response.data && response.data.title) {
        const newSlides = [...slides];
        newSlides[index] = response.data;
        setSlides(newSlides);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to rewrite slide.");
    } finally {
      setRegeneratingIndexes(prev => prev.filter(i => i !== index));
    }
  };

  const handleUpdateSlide = (index, updatedSlide) => {
    const newSlides = [...slides];
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generateCarousel();
  };

  return (
    <div>
      <div className="bg-decoration">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      <nav className="navbar">
        <div className="navbar-logo">
          <div className="logo-icon border border-white/20">⚡</div>
          <div className="logo-text">Studio<span style={{opacity: 0.7}}>AI</span></div>
        </div>
        <div className="navbar-actions">
          <span style={{color: 'var(--brand-color)', fontSize: 13, fontWeight: 800, padding: '6px 12px', background: 'rgba(79, 110, 247, 0.1)', borderRadius: 100}}>PRODUCTION READY</span>
        </div>
      </nav>

      <header className="hero">
        <h1 className="hero-title">
          From Idea to <br />
          <span className="gradient">Viral Creative.</span>
        </h1>
        <p style={{color: 'var(--text-secondary)', fontSize: 18, marginTop: 12, fontWeight: 500}}>
          Type an idea and directly download perfectly structured, AI-illustrated graphics for your brand.
        </p>
      </header>

      <div className="input-section">
        <div className="settings-panel">
          <div className="setting-group">
            <span className="setting-label">Format</span>
            <select className="setting-select" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="carousel">Carousel (5 Slides)</option>
              <option value="post">IG Post (Single)</option>
              <option value="story">IG Story (Vertical)</option>
            </select>
          </div>
          
          <div className="setting-group">
            <span className="setting-label">Tone</span>
            <select className="setting-select" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="Educational">Educational</option>
              <option value="Inspirational">Inspirational</option>
              <option value="Bold">Bold</option>
              <option value="Humorous">Humorous</option>
            </select>
          </div>

          <div className="setting-group" style={{gap: 12}}>
            <span className="setting-label">Brand</span>
            <input type="color" className="color-picker" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} />
          </div>
        </div>

        <form className="input-wrapper" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="E.g. Parent tips on how to fix the forgetting curve..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="btn-generate" disabled={isLoading || !topic.trim()}>
            {isLoading ? '⏳' : '✨'} Generate
          </button>
        </form>
      </div>

      <main>
        {isLoading && <LoadingSpinner />}
        {error && <div style={{textAlign: 'center', color: '#ff6b6b', padding: 20}}>⚠️ {error}</div>}

        {!isLoading && slides.length > 0 && (
          <section className="carousel-section">
             <div style={{display: 'flex', justifyContent: 'center', marginBottom: 30, textAlign: 'center'}}>
                <h2 style={{fontSize: 28, fontWeight: 900}}>Review & <span style={{color: 'var(--brand-color)'}}>Download</span></h2>
             </div>

            <div className="slides-container">
              {slides.map((slide, index) => (
                <SlideCard
                  key={index}
                  slide={slide}
                  index={index}
                  format={format}
                  onUpdate={handleUpdateSlide}
                  onRegenerate={handleRegenerateSlide}
                  isRegenerating={regeneratingIndexes.includes(index)}
                  totalSlides={slides.length}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer style={{textAlign: 'center', marginTop: 100, padding: 40, opacity: 0.5}}>
        <p>© 2026 StudioAI • End-to-End Visual Creator</p>
      </footer>
    </div>
  );
}

export default App;
