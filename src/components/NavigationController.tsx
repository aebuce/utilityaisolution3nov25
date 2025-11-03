import React, { useEffect, useCallback } from 'react';
import { useSlideContext } from '../contexts/SlideContext';
import '../styles/NavigationController.css';

interface NavigationControllerProps {
  className?: string;
}

export function NavigationController({ className = '' }: NavigationControllerProps) {
  const { slideState, nextSlide, previousSlide, canGoNext, canGoPrevious } = useSlideContext();

  // Keyboard event handler for arrow key navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle arrow keys and prevent default behavior
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        if (canGoNext()) {
          nextSlide();
        }
        break;
      
      case 'ArrowLeft':
        event.preventDefault();
        if (canGoPrevious()) {
          previousSlide();
        }
        break;
      
      default:
        // Ignore other keys
        break;
    }
  }, [nextSlide, previousSlide, canGoNext, canGoPrevious]);

  // Set up keyboard event listeners
  useEffect(() => {
    // Add event listener to document for global keyboard handling
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle click navigation (optional visual controls)
  const handlePreviousClick = () => {
    if (canGoPrevious()) {
      previousSlide();
    }
  };

  const handleNextClick = () => {
    if (canGoNext()) {
      nextSlide();
    }
  };

  return (
    <div className={`navigation-controller ${className}`}>
      {/* Visual navigation controls (optional) */}
      <button
        className={`nav-button prev-button button-hover button-press ${!canGoPrevious() ? 'disabled' : ''}`}
        onClick={handlePreviousClick}
        disabled={!canGoPrevious()}
        aria-label="Previous slide"
        title="Previous slide (Left arrow key)"
      >
        ←
      </button>
      
      <div className="slide-progress nav-button-enter">
        <div className="progress-dots">
          {Array.from({ length: slideState.totalSlides }, (_, index) => (
            <div
              key={index + 1}
              className={`progress-dot ${index + 1 === slideState.currentSlide ? 'active' : ''} ${slideState.isTransitioning ? 'nav-indicator-update' : ''}`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <button
        className={`nav-button next-button button-hover button-press ${!canGoNext() ? 'disabled' : ''}`}
        onClick={handleNextClick}
        disabled={!canGoNext()}
        aria-label="Next slide"
        title="Next slide (Right arrow key)"
      >
        →
      </button>
    </div>
  );
}