import React, { useState } from 'react';
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
        <div className="spinner-ring spinner-ring-3"></div>
        <div className="spinner-glow"></div>
      </div>
      <div className="loading-text">
        <h3>Crafting your carousel...</h3>
        <p>Our AI is analyzing your topic and building the perfect storytelling structure.</p>
      </div>
    </div>
  );
}

/* ===== SLIDE CARD ===== */
function SlideCard({ slide, index, onUpdate }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(slide.title);
  const [editContent, setEditContent] = useState(slide.content);

  const labels = ['HOOK', 'PROBLEM', 'INSIGHT', 'SOLUTION', 'CTA'];

  const handleCopy = () => {
    navigator.clipboard.writeText(`${slide.title}\n\n${slide.content}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = () => {
    onUpdate(index, { title: editTitle, content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(slide.title);
    setEditContent(slide.content);
    setIsEditing(false);
  };

  return (
    <div className="slide-card">
      <div className="slide-card-header">
        <span className="slide-label">{labels[index] || `SLIDE ${index + 1}`}</span>
        <div className="slide-number">{index + 1}</div>
        {isEditing ? (
          <input
            type="text"
            className="slide-title-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        ) : (
          <h3 className="slide-title">{slide.title}</h3>
        )}
      </div>

      <div className="slide-card-body">
        {isEditing ? (
          <textarea
            className="slide-content-textarea"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        ) : (
          <p className="slide-content">{slide.content}</p>
        )}

        <div className="slide-actions">
          {isEditing ? (
            <>
              <button className="btn-slide btn-slide-save" onClick={handleSave}>
                ✓ Save
              </button>
              <button className="btn-slide btn-slide-cancel" onClick={handleCancel}>
                ✕
              </button>
            </>
          ) : (
            <>
              <button className="btn-slide" onClick={() => setIsEditing(true)}>
                ✎ Edit
              </button>
              <button
                className={`btn-slide ${isCopied ? 'active' : ''}`}
                onClick={handleCopy}
              >
                {isCopied ? '✓ Copied!' : '⊍ Copy'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== MAIN APP ===== */
function App() {
  const [topic, setTopic] = useState('');
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      });
      if (response.data && response.data.slides) {
        setSlides(response.data.slides);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.response?.data?.details || err.message || 'Something went wrong. Check your API key.');
    } finally {
      setIsLoading(false);
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

  const suggestions = [
    { text: 'Mastering Productivity', emoji: '⚡' },
    { text: 'AI for Beginners', emoji: '🤖' },
    { text: 'Healthy Eating Habits', emoji: '🥗' },
    { text: 'Financial Freedom', emoji: '💰' },
  ];

  return (
    <div>
      {/* Background Orbs */}
      <div className="bg-decoration">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">
          <div className="logo-icon">⚡</div>
          <div className="logo-text">Studio<span>AI</span></div>
        </a>
        <div className="navbar-actions">
          <button className="btn-nav">Join Beta</button>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero">
        <div className="hero-badge">✦ AI-Powered Social Studio</div>
        <h1 className="hero-title">
          Create Viral<br />
          <span className="gradient">Carousels.</span>
        </h1>
        <p className="hero-subtitle">
          Turn any topic into a <strong>professional 5-slide</strong> storytelling carousel in seconds.
          Built for creators who want <strong>extraordinary</strong> results.
        </p>
      </header>

      {/* Input */}
      <div className="input-section">
        <form className="input-wrapper" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-field"
            placeholder="What should your carousel be about?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="btn-generate"
            disabled={isLoading || !topic.trim()}
          >
            {isLoading ? '⏳ Generating...' : '✦ Generate'}
          </button>
        </form>
      </div>

      {/* Suggestions */}
      <div className="suggestions">
        <span className="suggestion-label">Try:</span>
        {suggestions.map((s) => (
          <button
            key={s.text}
            className="suggestion-btn"
            onClick={() => { setTopic(s.text); generateCarousel(s.text); }}
          >
            {s.emoji} {s.text}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <main>
        {isLoading && <LoadingSpinner />}

        {error && <div className="error-box">⚠️ {error}</div>}

        {!isLoading && slides.length > 0 && (
          <section className="carousel-section">
            <div className="carousel-header">
              <div className="carousel-header-left">
                <h2>Your <span className="gradient">Carousel</span></h2>
                <p>Edit, copy, and customize each slide below.</p>
              </div>
              <button className="btn-regenerate" onClick={() => generateCarousel()}>
                <span className="icon">↻</span> Regenerate
              </button>
            </div>

            <div className="slides-grid">
              {slides.map((slide, index) => (
                <SlideCard
                  key={index}
                  slide={slide}
                  index={index}
                  onUpdate={handleUpdateSlide}
                />
              ))}
            </div>
          </section>
        )}

        {!isLoading && slides.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-state-icon">✦</div>
            <p>Waiting for your creativity</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="navbar-logo">
          <div className="logo-icon" style={{ width: 32, height: 32, fontSize: 16 }}>⚡</div>
          <div className="logo-text" style={{ fontSize: 16 }}>Studio<span>AI</span></div>
        </div>
        <p>© 2026 StudioAI • Built for Social Dominance</p>
      </footer>
    </div>
  );
}

export default App;
