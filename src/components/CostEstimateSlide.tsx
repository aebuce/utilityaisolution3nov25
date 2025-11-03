import React, { useState } from 'react';
import CostCalculator from './CostCalculator';
import '../styles/CostEstimateSlide.css';

interface CostEstimateSlideProps {
  initialCallVolume?: number;
}

export const CostEstimateSlide: React.FC<CostEstimateSlideProps> = ({
  initialCallVolume = 1000
}) => {
  const [callVolume, setCallVolume] = useState(initialCallVolume);

  const handleVolumeChange = (newVolume: number) => {
    setCallVolume(newVolume);
  };

  return (
    <div className="slide cost-estimate-slide">
      <div className="slide-header">
        <h2>Cost Calculator & ROI Analysis</h2>
        <p className="slide-subtitle">
          Interactive cost modeling for your facility management solution
        </p>
      </div>

      <div className="slide-content">
        <CostCalculator
          monthlyCallVolume={callVolume}
          onVolumeChange={handleVolumeChange}
          timelineMonths={60}
        />
      </div>

      <div className="slide-footer">
        <div className="footer-highlights">
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
      </div>
    </div>
  );
};

export default CostEstimateSlide;