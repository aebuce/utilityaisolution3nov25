import React, { ComponentType } from 'react';
import { useSlideContext } from '../contexts/SlideContext.tsx';
import { VirtualHighlighter } from './VirtualHighlighter';

interface SlideConfig {
  id: number;
  title: string;
  component: ComponentType<any>;
  props?: Record<string, any>;
}
import '../styles/SlideManager.css';

interface SlideManagerProps {
  slides: SlideConfig[];
  className?: string;
}

export function SlideManager({ slides, className = '' }: SlideManagerProps) {
  const { slideState } = useSlideContext();
  
  // Find the current slide configuration
  const currentSlideConfig = slides.find(slide => slide.id === slideState.currentSlide);
  
  if (!currentSlideConfig) {
    return (
      <div className={`slide-manager error ${className}`}>
        <div className="slide-error">
          <h2>Slide Not Found</h2>
          <p>Slide {slideState.currentSlide} could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Render the current slide component
  const SlideComponent = currentSlideConfig.component;
  
  return (
    <div className={`slide-manager ${className}`}>
      <VirtualHighlighter className="slide-highlighter-overlay">
        <div 
          className={`slide-container ${slideState.isTransitioning ? 'transitioning' : ''}`}
          data-slide-id={slideState.currentSlide}
          data-slide-title={currentSlideConfig.title}
          data-direction={slideState.direction}
        >
          <SlideComponent {...(currentSlideConfig.props || {})} />
        </div>
      </VirtualHighlighter>
      
      {/* Slide indicator */}
      <div className="slide-indicator">
        <span className="current-slide">{slideState.currentSlide}</span>
        <span className="slide-separator"> / </span>
        <span className="total-slides">{slideState.totalSlides}</span>
      </div>
    </div>
  );
}