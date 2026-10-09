import { useState } from 'react'
import './App.css'

function App() {
  const [fileName, setFileName] = useState('')

  function handleFileChange(event) {
    const file = event.target.files[0]
    if (file) setFileName(file.name)
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#">
          <span className="logo-icon">A</span>
          AccessLens
        </a>

        <nav>
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
        </nav>

        <a className="nav-button" href="#upload">Try it now ↗</a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              ACCESSIBILITY MADE SIMPLE
            </div>

            <h1>
              Every document.
              <br />
              <span>Everyone can</span>
              <br />
              understand.
            </h1>

            <p className="hero-description">
              Turn confusing documents into clear, simple steps.
              Upload a document, understand what matters, and listen
              to the information in a way that works for you.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#upload">
                Simplify a document <span>→</span>
              </a>
              <a className="secondary-button" href="#how-it-works">
                See how it works
              </a>
            </div>

            <div className="trust-note">
              <span>✓</span> Designed for accessibility and inclusion
            </div>
          </div>

          <div className="hero-visual" aria-label="Document simplification preview">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>

            <div className="document-card">
              <div className="document-top">
                <div className="document-icon">▤</div>
                <span className="file-label">DOCUMENT PREVIEW</span>
                <span className="more-icon">•••</span>
              </div>

              <div className="document-heading">Important Notice</div>
              <div className="skeleton skeleton-long"></div>
              <div className="skeleton skeleton-medium"></div>
              <div className="skeleton skeleton-short"></div>

              <div className="document-divider"></div>

              <div className="simplified-label">
                <span>✳</span> MADE SIMPLE
              </div>

              <div className="preview-step">
                <span className="step-number">1</span>
                <div>
                  <strong>What you need to do</strong>
                  <p>Read the notice and check the deadline.</p>
                </div>
              </div>

              <div className="preview-step">
                <span className="step-number">2</span>
                <div>
                  <strong>What happens next</strong>
                  <p>Follow the instructions provided.</p>
                </div>
              </div>

              <div className="audio-preview">
                <span className="play-icon">▶</span>
                <div className="audio-info">
                  <strong>Listen to your summary</strong>
                  <div className="audio-track">
                    <span></span>
                  </div>
                </div>
                <span className="audio-time">0:32</span>
              </div>
            </div>

            <div className="floating-badge badge-top">
              <span>✓</span> Easy to understand
            </div>
            <div className="floating-badge badge-bottom">
              <span>♫</span> Listen your way
            </div>
          </div>
        </section>

        <section className="upload-section" id="upload">
          <div className="section-heading">
            <span className="section-kicker">GET STARTED</span>
            <h2>Clarity starts here.</h2>
            <p>Choose a document to begin your journey to understanding.</p>
          </div>

          <label className="upload-box">
            <input
              type="file"
              accept="image/*,.pdf,.txt"
              onChange={handleFileChange}
            />
            <span className="upload-icon">↑</span>
            <strong>{fileName || 'Choose your document'}</strong>
            <span className="upload-help">
              {fileName
                ? 'File selected. Document processing is our next step.'
                : 'Select an image, PDF, or text file from your device.'}
            </span>
            <span className="upload-button">Browse files</span>
          </label>
          <p className="privacy-note">Your document stays on your device until you choose to process it.</p>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-kicker">BUILT FOR EVERYONE</span>
            <h2>Understanding should have no barriers.</h2>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon purple">▤</div>
              <h3>Scan documents</h3>
              <p>Start with document images and make their contents easier to access.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon green">✳</div>
              <h3>Simplify information</h3>
              <p>Turn complicated language into clear explanations and practical steps.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon orange">♫</div>
              <h3>Listen aloud</h3>
              <p>Access information through audio instead of relying only on reading.</p>
            </article>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <span className="section-kicker">THREE SIMPLE STEPS</span>
          <h2>From confusion to clarity.</h2>
          <div className="steps">
            <div><span>01</span><strong>Upload</strong><p>Choose a document.</p></div>
            <div><span>02</span><strong>Understand</strong><p>Get clear, simple steps.</p></div>
            <div><span>03</span><strong>Listen</strong><p>Hear your information aloud.</p></div>
          </div>
        </section>
      </main>

      <footer>
        <a className="logo" href="#"><span className="logo-icon">A</span> AccessLens</a>
        <p>Making information accessible to everyone.</p>
        <span>Built for Accessibility & Inclusion.</span>
      </footer>
    </div>
  )
}

export default App
