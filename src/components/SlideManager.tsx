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

  // Determine animation classes based on transition state and direction
  const getAnimationClasses = () => {
    if (!slideState.isTransitioning) return '';
    
    const direction = slideState.direction;
    if (direction === 'next') {
      return 'slide-enter will-animate gpu-accelerated';
    } else if (direction === 'prev') {
      return 'slide-enter-reverse will-animate gpu-accelerated';
    }
    return '';
  };

  // Render the current slide component
  const SlideComponent = currentSlideConfig.component;
  
  return (
    <div className={`slide-manager ${className}`}>
      <VirtualHighlighter className="slide-highlighter-overlay">
        <div 
          className={`slide-container slide-transition-container ${getAnimationClasses()}`}
          data-slide-id={slideState.currentSlide}
          data-slide-title={currentSlideConfig.title}
          data-direction={slideState.direction}
        >
          <div className="content-animate-in">
            <SlideComponent {...(currentSlideConfig.props || {})} />
          </div>
        </div>
      </VirtualHighlighter>
      
      {/* Slide indicator with animation */}
      <div className={`slide-indicator ${slideState.isTransitioning ? 'nav-indicator-update' : ''}`}>
        <span className="current-slide">{slideState.currentSlide}</span>
        <span className="slide-separator"> / </span>
        <span className="total-slides">{slideState.totalSlides}</span>
      </div>
    </div>
  );
}