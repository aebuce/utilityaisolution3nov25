import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SlideState, SlideContextType } from '../types/slide';

// Action types for slide state management
type SlideAction =
  | { type: 'GO_TO_SLIDE'; payload: number }
  | { type: 'NEXT_SLIDE' }
  | { type: 'PREVIOUS_SLIDE' }
  | { type: 'SET_TRANSITIONING'; payload: boolean }
  | { type: 'INITIALIZE'; payload: { totalSlides: number } };

// Initial state
const initialState: SlideState = {
  currentSlide: 1,
  totalSlides: 5, // As per requirements: exactly 5 slides
  isTransitioning: false,
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
      };
    
    case 'PREVIOUS_SLIDE':
      // Boundary enforcement: prevent going before first slide
      if (state.currentSlide <= 1) {
        return state;
      }
      return {
        ...state,
        currentSlide: state.currentSlide - 1,
      };
    
    case 'SET_TRANSITIONING':
      return {
        ...state,
        isTransitioning: action.payload,
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
      dispatch({ type: 'NEXT_SLIDE' });
    },
    
    previousSlide: () => {
      dispatch({ type: 'PREVIOUS_SLIDE' });
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