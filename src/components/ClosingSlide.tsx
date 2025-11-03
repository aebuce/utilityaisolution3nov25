import React from 'react';
import '../styles/ClosingSlide.css';

interface ClosingSlideProps {
  highlights: string[];
}

export function ClosingSlide({ highlights }: ClosingSlideProps) {
  const backgroundTexts = [
    'AI-Powered',
    'Automated',
    'Intelligent',
    'Efficient',
    'Scalable',
    'Enterprise-Ready',
    'Cost-Effective',
    'Seamless Integration',
    'Real-Time Processing',
    'Voice & Chat Enabled'
  ];

  return (
    <div className="slide closing-slide">
      {/* Animated background text */}
      <div className="background-text-container">
        {backgroundTexts.map((text, index) => (
          <div
            key={index}
            className={`background-text background-text-${index + 1}`}
            style={{
              animationDelay: `${index * 0.5}s`,
            }}
          >
            {text}
          </div>
        ))}
      </div>

      <div className="closing-slide-content">
        <div className="closing-slide-header">
          <h1 className="closing-slide-title">Key Solution Highlights</h1>
          <div className="closing-slide-subtitle">
            Transform Your Facility Management with AI
          </div>
        </div>

        <div className="highlights-container">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="highlight-item"
              style={{
                animationDelay: `${1 + index * 0.3}s`,
              }}
            >
              <div className="highlight-icon">✓</div>
              <div className="highlight-text">{highlight}</div>
            </div>
          ))}
        </div>

        <div className="closing-slide-footer">
          <div className="company-branding">
            <div className="logo-placeholder">
              <div className="logo-icon">🏢</div>
              <span className="company-name">Enterprise Solutions</span>
            </div>
            <div className="contact-info">
              <div className="contact-text">Ready to get started?</div>
              <div className="contact-action">Contact us today</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}