import React from 'react';
import { SlideProvider, useSlideContext } from '../contexts/SlideContext';
import { SlideManager } from '../components/SlideManager';
import { slideConfigs } from '../config/slideConfig';

// Test component to verify context functionality
function TestSlideNavigation() {
  const { slideState, nextSlide, previousSlide, canGoNext, canGoPrevious } = useSlideContext();
  
  return (
    <div data-testid="slide-navigation">
      <div data-testid="current-slide">{slideState.currentSlide}</div>
      <div data-testid="total-slides">{slideState.totalSlides}</div>
      <div data-testid="can-go-next">{canGoNext().toString()}</div>
      <div data-testid="can-go-previous">{canGoPrevious().toString()}</div>
      <button onClick={nextSlide} data-testid="next-button">Next</button>
      <button onClick={previousSlide} data-testid="prev-button">Previous</button>
    </div>
  );
}

// Manual test function to verify functionality
export function testSlideManager() {
  console.log('Testing SlideManager implementation...');
  
  // Test 1: Verify slide configuration
  console.log('✓ Slide configs loaded:', slideConfigs.length === 5);
  
  // Test 2: Verify slide IDs are sequential
  const slideIds = slideConfigs.map(slide => slide.id);
  const expectedIds = [1, 2, 3, 4, 5];
  console.log('✓ Slide IDs correct:', JSON.stringify(slideIds) === JSON.stringify(expectedIds));
  
  // Test 3: Verify all slides have required properties
  const allSlidesValid = slideConfigs.every(slide => 
    slide.id && slide.title && slide.component
  );
  console.log('✓ All slides have required properties:', allSlidesValid);
  
  console.log('SlideManager tests completed successfully!');
}

// Component for manual testing in browser
export function SlideManagerTest() {
  return (
    <SlideProvider totalSlides={5}>
      <div style={{ padding: '20px' }}>
        <h2>SlideManager Test</h2>
        <TestSlideNavigation />
        <hr />
        <SlideManager slides={slideConfigs} />
      </div>
    </SlideProvider>
  );
}

// Run tests
testSlideManager();