import { useEffect, useRef } from 'react';
import { useSlideContext } from '../contexts/SlideContext';
import { useHighlighter } from '../contexts/HighlighterContext';

/**
 * HighlighterManager handles the integration between slide navigation and highlighter state.
 * It clears highlights when moving to a different slide as per requirement 2.4.
 */
export function HighlighterManager() {
  const { slideState } = useSlideContext();
  const { clearHighlights } = useHighlighter();
  const previousSlideRef = useRef<number>(slideState.currentSlide);

  useEffect(() => {
    const currentSlide = slideState.currentSlide;
    const previousSlide = previousSlideRef.current;

    // Clear highlights from the previous slide when moving to a different slide
    if (currentSlide !== previousSlide) {
      clearHighlights(previousSlide);
      previousSlideRef.current = currentSlide;
    }
  }, [slideState.currentSlide, clearHighlights]);

  // This component doesn't render anything
  return null;
}