import React from 'react';
import '../styles/OpeningSlide.css';

interface OpeningSlideProps {
  title: string;
  presenter: string;
  date: string;
}

export function OpeningSlide({ title, presenter, date }: OpeningSlideProps) {
  return (
    <div className="slide opening-slide">
      <div className="opening-slide-content">
        <div className="opening-slide-header">
          <h1 className="opening-slide-title">{title}</h1>
          <div className="opening-slide-subtitle">
            AI-Powered Facility Management Solution
          </div>
        </div>
        
        <div className="opening-slide-details">
          <div className="presenter-info">
            <span className="label">Presented by:</span>
            <span className="value">{presenter}</span>
          </div>
          
          <div className="date-info">
            <span className="label">Date:</span>
            <span className="value">{date}</span>
          </div>
        </div>
        
        <div className="opening-slide-footer">
          <div className="company-branding">
            <div className="logo-placeholder">
              <div className="logo-icon">🏢</div>
              <span className="company-name">Enterprise Solutions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}