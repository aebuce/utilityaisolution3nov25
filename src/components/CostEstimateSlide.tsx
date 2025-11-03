import React, { useState } from 'react';
import CostCalculator from './CostCalculator';
import { ErrorBoundary } from './ErrorBoundary';
import '../styles/CostEstimateSlide.css';

interface CostEstimateSlideProps {
  initialCallVolume?: number;
  showClosingHighlights?: boolean;
  highlights?: string[];
}

export const CostEstimateSlide: React.FC<CostEstimateSlideProps> = ({
  initialCallVolume = 1000,
  showClosingHighlights = false,
  highlights = []
}) => {
  const [callVolume, setCallVolume] = useState(initialCallVolume);

  const handleVolumeChange = (newVolume: number) => {
    setCallVolume(newVolume);
  };

  return (
    <div className="slide cost-estimate-slide">
      <div className="slide-header content-animate-in">
        <h2>Cost Calculator & ROI Analysis</h2>
        <p className="slide-subtitle">
          Interactive cost modeling for your facility management solution
        </p>
      </div>

      <div className="slide-content content-animate-in-delayed">
        <ErrorBoundary componentName="Cost Calculator">
          <CostCalculator
            monthlyCallVolume={callVolume}
            onVolumeChange={handleVolumeChange}
            timelineMonths={60}
          />
        </ErrorBoundary>
      </div>

      <div className="slide-footer content-animate-in-delayed-2">
        {showClosingHighlights && highlights.length > 0 ? (
          <div className="closing-highlights">
            <h3>Key Solution Highlights</h3>
            <div className="highlights-grid stagger-children">
              {highlights.map((highlight, index) => (
                <div key={index} className="highlight-item">
                  <span className="highlight-bullet">•</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="footer-highlights stagger-children">
            <div className="highlight-item">
              <span className="highlight-icon">💰</span>
              <span>Transparent pricing with no hidden costs</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-icon">📈</span>
              <span>Scalable architecture grows with your business</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-icon">🎯</span>
              <span>ROI typically achieved within 6-12 months</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostEstimateSlide;