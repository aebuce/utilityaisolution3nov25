import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

interface SlideState {
  currentSlide: number;
  totalSlides: number;
  isTransitioning: boolean;
  direction: 'next' | 'prev' | null;
}

interface SlideContextType {
  slideState: SlideState;
  goToSlide: (slideNumber: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
}

// Action types for slide state management
type SlideAction =
  | { type: 'GO_TO_SLIDE'; payload: number }
  | { type: 'NEXT_SLIDE' }
  | { type: 'PREVIOUS_SLIDE' }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'SET_DIRECTION'; payload: 'next' | 'prev' | null }
  | { type: 'INITIALIZE'; payload: { totalSlides: number } };

// Initial state
const initialState: SlideState = {
  currentSlide: 1,
  totalSlides: 5, // As per requirements: exactly 5 slides
  isTransitioning: false,
  direction: null,
};

// Reducer function for slide state management
function slideReducer(state: SlideState, action: SlideAction): SlideState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        totalSlides: action.payload.totalSlides,
      };
    
    case 'GO_TO_SLIDE':
      const targetSlide = action.payload;
      // Boundary enforcement: prevent navigation beyond first and last slides
      if (targetSlide < 1 || targetSlide > state.totalSlides) {
        return state;
      }
      return {
        ...state,
        currentSlide: targetSlide,
      };
    
    case 'NEXT_SLIDE':
      // Boundary enforcement: prevent going beyond last slide
      if (state.currentSlide >= state.totalSlides) {
        return state;
      }
      return {
        ...state,
        currentSlide: state.currentSlide + 1,
        direction: 'next',
        isTransitioning: true,
      };
    
    case 'PREVIOUS_SLIDE':
      // Boundary enforcement: prevent going before first slide
      if (state.currentSlide <= 1) {
        return state;
      }
      return {
        ...state,
        currentSlide: state.currentSlide - 1,
        direction: 'prev',
        isTransitioning: true,
      };
    
    case 'SET_TRANSITIONING':
      return {
        ...state,
        isTransitioning: action.payload,
      };
    
    case 'SET_DIRECTION':
      return {
        ...state,
        direction: action.payload,
      };
    
    default:
      return state;
  }
}

// Create the context
const SlideContext = createContext<SlideContextType | undefined>(undefined);

// Provider component
interface SlideProviderProps {
  children: ReactNode;
  totalSlides?: number;
}

export function SlideProvider({ children, totalSlides = 5 }: SlideProviderProps) {
  const [slideState, dispatch] = useReducer(slideReducer, {
    ...initialState,
    totalSlides,
  });

  // Context value with all required functions
  const contextValue: SlideContextType = {
    slideState,
    
    goToSlide: (slideNumber: number) => {
      dispatch({ type: 'GO_TO_SLIDE', payload: slideNumber });
    },
    
    nextSlide: () => {
      if (slideState.currentSlide < slideState.totalSlides) {
        dispatch({ type: 'NEXT_SLIDE' });
        // Clear transition state after animation
        setTimeout(() => {
          dispatch({ type: 'SET_TRANSITIONING', payload: false });
          dispatch({ type: 'SET_DIRECTION', payload: null });
        }, 400); // Match CSS animation duration
      }
    },
    
    previousSlide: () => {
      if (slideState.currentSlide > 1) {
        dispatch({ type: 'PREVIOUS_SLIDE' });
        // Clear transition state after animation
        setTimeout(() => {
          dispatch({ type: 'SET_TRANSITIONING', payload: false });
          dispatch({ type: 'SET_DIRECTION', payload: null });
        }, 400); // Match CSS animation duration
      }
    },
    
    canGoNext: () => {
      return slideState.currentSlide < slideState.totalSlides;
    },
    
    canGoPrevious: () => {
      return slideState.currentSlide > 1;
    },
  };

  return (
    <SlideContext.Provider value={contextValue}>
      {children}
    </SlideContext.Provider>
  );
}

// Custom hook to use the slide context
export function useSlideContext(): SlideContextType {
  const context = useContext(SlideContext);
  if (context === undefined) {
    throw new Error('useSlideContext must be used within a SlideProvider');
  }
  return context;
}