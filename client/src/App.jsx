import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        <h3 style={{fontWeight: 700}}>Crafting your visuals...</h3>
        <p style={{color: 'var(--text-secondary)'}}>Generating copy and rendering AI images from your idea.</p>
      </div>
    </div>
  );
}

/* ===== SLIDE CARD ===== */
function SlideCard({ slide, index, onUpdate, format, onRegenerate, isRegenerating }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(slide.title);
  const [editContent, setEditContent] = useState(slide.content);

  // Use pollinations.ai for zero-setup AI image generation based on imagePrompt returned by Gemini
  const imageUrl = slide.imagePrompt ? `https://image.pollinations.ai/prompt/${encodeURIComponent(slide.imagePrompt)}?width=1000&height=1000&nologo=true` : '';

  const labels = ['HOOK', 'PROBLEM', 'INSIGHT', 'SOLUTION', 'CTA'];
  let slideLabel = `SLIDE ${index + 1}`;
  if (format === 'carousel') slideLabel = labels[index] || slideLabel;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${slide.title}\n\n${slide.content}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    onUpdate(index, { ...slide, title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(slide.title);
    setEditContent(slide.content);
    setIsEditing(false);
  };

  if (isRegenerating) {
    return (
      <div className={`slide-card format-${format}`} style={{justifyContent: 'center', alignItems: 'center'}}>
        <div className="spinner-rings" style={{width: 40, height: 40}}>
           <div className="spinner-ring spinner-ring-1"></div>
        </div>
        <p style={{marginTop: 16, fontWeight: 600, color: 'var(--brand-color)'}}>Rewriting...</p>
      </div>
    );
  }

  return (
    <div className={`slide-card format-${format}`}>
      {imageUrl && <img src={imageUrl} alt="AI Generated Graphic" className="slide-bg-image" crossOrigin="anonymous" />}
      <div className="slide-overlay"></div>
      
      <div className="slide-content-wrapper">
        <div className="slide-card-header">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
             <span style={{fontSize: 10, fontWeight: 800, color: 'var(--brand-color)', letterSpacing: 1}}>{slideLabel}</span>
             <span style={{opacity: 0.5, fontWeight: 700, fontSize: 12}}>{index + 1} / {format === 'carousel' ? 5 : format === 'story' ? 3 : 1}</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              className="slide-title-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          ) : (
            <h3>{slide.title}</h3>
          )}
        </div>

        <div className="slide-card-body">
          {isEditing ? (
            <textarea
              className="slide-content-textarea"
              rows={5}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          ) : (
            <p className="slide-content">{slide.content}</p>
          )}

          <div className="slide-actions">
            {isEditing ? (
              <>
                <button className="btn-slide" style={{background: 'var(--brand-color)', border: 'none'}} onClick={handleSave}>✓ Save</button>
                <button className="btn-slide" onClick={handleCancel}>✕</button>
              </>
            ) : (
              <>
                <button className="btn-slide" onClick={() => setIsEditing(true)}>✎ Edit</button>
                <button className="btn-slide" onClick={() => onRegenerate(index)}>↻ Redo</button>
                <button className="btn-slide" onClick={handleCopy} style={isCopied ? {background: '#22c55e', borderColor: '#22c55e'} : {}}>
                  {isCopied ? '✓ Copied' : '⊍ Copy'}
                </button>
              </>
            )}
          </div>
        </div>
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
  
  // Track specific slide regeneration state
  const [regeneratingIndexes, setRegeneratingIndexes] = useState([]);

  // Apply root CSS variables for dynamic branding
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
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.response?.data?.details || err.message || 'Something went wrong. Check backend connection.');
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
      alert("Failed to regenerate slide. Try again.");
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
        <a href="/" className="navbar-logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">Studio<span>AI</span></div>
        </a>
        <div className="navbar-actions">
          <span style={{color: 'var(--text-muted)', fontSize: 12, fontWeight: 700}}>Premium Studio Environment</span>
        </div>
      </nav>

      <header className="hero">
        <h1 className="hero-title">
          Create Visual<br />
          <span className="gradient">Masterpieces.</span>
        </h1>
        <p className="hero-subtitle" style={{color: 'var(--text-secondary)', marginTop: 12}}>
          Transform messy ideas into pixel-perfect Posts, Stories, or Carousels with built-in AI imagery.
        </p>
      </header>

      <div className="input-section">
        {/* Settings Panel */}
        <div className="settings-panel">
          <div className="setting-group">
            <span className="setting-label">Format:</span>
            <select className="setting-select" value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="carousel">Carousel (1:1 Multi-slide)</option>
              <option value="post">Instagram Post (1:1)</option>
              <option value="story">Instagram Story (9:16)</option>
            </select>
          </div>
          
          <div className="setting-group">
            <span className="setting-label">Tone:</span>
            <select className="setting-select" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="Educational">Educational & Clear</option>
              <option value="Inspirational">Inspirational</option>
              <option value="Bold">Bold & Direct</option>
              <option value="Humorous">Humorous</option>
            </select>
          </div>

          <div className="setting-group">
            <span className="setting-label">Color:</span>
            <input 
              type="color" 
              className="color-picker" 
              value={brandColor} 
              onChange={(e) => setBrandColor(e.target.value)} 
            />
          </div>
        </div>

        <form className="input-wrapper" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="Type your messy idea here... e.g. Why kids forget math and how spaced repetition fixes it"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className="btn-generate" disabled={isLoading || !topic.trim()}>
            {isLoading ? '⏳' : '✦'} Generate
          </button>
        </form>
      </div>

      <main>
        {isLoading && <LoadingSpinner />}
        {error && <div className="error-box" style={{textAlign: 'center', color: '#f87171', background: 'rgba(248, 113, 113, 0.1)', padding: 16, borderRadius: 12, margin: '20px auto', maxWidth: 600}}>⚠️ {error}</div>}

        {!isLoading && slides.length > 0 && (
          <section className="carousel-section">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 30}}>
              <div>
                <h2>Your <span className="gradient">Creative</span></h2>
                <p style={{color: 'var(--text-secondary)'}}>We generated AI visuals and structured your message.</p>
              </div>
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
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer" style={{textAlign: 'center', marginTop: 100, padding: 40, opacity: 0.5}}>
        <p>© 2026 StudioAI • Built for Content Dominance</p>
      </footer>
    </div>
  );
}

export default App;
