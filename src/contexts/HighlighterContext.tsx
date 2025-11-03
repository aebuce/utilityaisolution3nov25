import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { HighlightData, SelectionData, HighlighterState } from '../types/highlighter';

interface HighlighterContextType {
  highlighterState: HighlighterState;
  addHighlight: (highlight: Omit<HighlightData, 'id' | 'timestamp'>) => void;
  removeHighlight: (id: string) => void;
  clearHighlights: (slideId?: number) => void;
  setActive: (active: boolean) => void;
  startSelection: (x: number, y: number) => void;
  updateSelection: (x: number, y: number) => void;
  endSelection: (content: string) => void;
  cancelSelection: () => void;
}

// Utility functions for localStorage persistence
const HIGHLIGHTER_STORAGE_KEY = 'facility-presentation-highlighter-state';
const HIGHLIGHTS_STORAGE_KEY = 'facility-presentation-highlights';

const saveHighlighterState = (isActive: boolean): void => {
  try {
    localStorage.setItem(HIGHLIGHTER_STORAGE_KEY, JSON.stringify(isActive));
  } catch (error) {
    console.warn('Failed to save highlighter state to localStorage:', error);
  }
};

const loadHighlighterState = (): boolean => {
  try {
    const saved = localStorage.getItem(HIGHLIGHTER_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load highlighter state from localStorage:', error);
  }
  return true; // Default to active
};

const saveHighlights = (highlights: HighlightData[]): void => {
  try {
    localStorage.setItem(HIGHLIGHTS_STORAGE_KEY, JSON.stringify(highlights));
  } catch (error) {
    console.warn('Failed to save highlights to localStorage:', error);
  }
};

const loadHighlights = (): HighlightData[] => {
  try {
    const saved = localStorage.getItem(HIGHLIGHTS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn('Failed to load highlights from localStorage:', error);
  }
  return [];
};

type HighlighterAction =
  | { type: 'SET_ACTIVE'; payload: boolean }
  | { type: 'START_SELECTION'; payload: { x: number; y: number } }
  | { type: 'UPDATE_SELECTION'; payload: { x: number; y: number } }
  | { type: 'END_SELECTION'; payload: string }
  | { type: 'CANCEL_SELECTION' }
  | { type: 'ADD_HIGHLIGHT'; payload: HighlightData }
  | { type: 'REMOVE_HIGHLIGHT'; payload: string }
  | { type: 'CLEAR_HIGHLIGHTS'; payload?: number };

const getInitialState = (): HighlighterState => ({
  isActive: loadHighlighterState(),
  isSelecting: false,
  currentSelection: null,
  highlights: loadHighlights(),
});

function highlighterReducer(state: HighlighterState, action: HighlighterAction): HighlighterState {
  switch (action.type) {
    case 'SET_ACTIVE':
      // Save to localStorage
      saveHighlighterState(action.payload);
      return {
        ...state,
        isActive: action.payload,
        isSelecting: false,
        currentSelection: null,
      };

    case 'START_SELECTION':
      if (!state.isActive) return state;
      return {
        ...state,
        isSelecting: true,
        currentSelection: {
          startX: action.payload.x,
          startY: action.payload.y,
          endX: action.payload.x,
          endY: action.payload.y,
          content: '',
        },
      };

    case 'UPDATE_SELECTION':
      if (!state.isSelecting || !state.currentSelection) return state;
      return {
        ...state,
        currentSelection: {
          ...state.currentSelection,
          endX: action.payload.x,
          endY: action.payload.y,
        },
      };

    case 'END_SELECTION':
      if (!state.isSelecting || !state.currentSelection) return state;
      return {
        ...state,
        isSelecting: false,
        currentSelection: {
          ...state.currentSelection,
          content: action.payload,
        },
      };

    case 'CANCEL_SELECTION':
      return {
        ...state,
        isSelecting: false,
        currentSelection: null,
      };

    case 'ADD_HIGHLIGHT':
      const newHighlights = [...state.highlights, action.payload];
      // Save to localStorage
      saveHighlights(newHighlights);
      return {
        ...state,
        highlights: newHighlights,
        currentSelection: null,
      };

    case 'REMOVE_HIGHLIGHT':
      const filteredHighlights = state.highlights.filter(h => h.id !== action.payload);
      // Save to localStorage
      saveHighlights(filteredHighlights);
      return {
        ...state,
        highlights: filteredHighlights,
      };

    case 'CLEAR_HIGHLIGHTS':
      const clearedHighlights = action.payload !== undefined 
        ? state.highlights.filter(h => h.slideId !== action.payload)
        : [];
      // Save to localStorage
      saveHighlights(clearedHighlights);
      return {
        ...state,
        highlights: clearedHighlights,
      };

    default:
      return state;
  }
}

const HighlighterContext = createContext<HighlighterContextType | undefined>(undefined);

interface HighlighterProviderProps {
  children: ReactNode;
}

export function HighlighterProvider({ children }: HighlighterProviderProps) {
  const [highlighterState, dispatch] = useReducer(highlighterReducer, getInitialState());

  const addHighlight = useCallback((highlight: Omit<HighlightData, 'id' | 'timestamp'>) => {
    const newHighlight: HighlightData = {
      ...highlight,
      id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    dispatch({ type: 'ADD_HIGHLIGHT', payload: newHighlight });
  }, []);

  const removeHighlight = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_HIGHLIGHT', payload: id });
  }, []);

  const clearHighlights = useCallback((slideId?: number) => {
    dispatch({ type: 'CLEAR_HIGHLIGHTS', payload: slideId });
  }, []);

  const setActive = useCallback((active: boolean) => {
    dispatch({ type: 'SET_ACTIVE', payload: active });
  }, []);

  const startSelection = useCallback((x: number, y: number) => {
    dispatch({ type: 'START_SELECTION', payload: { x, y } });
  }, []);

  const updateSelection = useCallback((x: number, y: number) => {
    dispatch({ type: 'UPDATE_SELECTION', payload: { x, y } });
  }, []);

  const endSelection = useCallback((content: string) => {
    dispatch({ type: 'END_SELECTION', payload: content });
  }, []);

  const cancelSelection = useCallback(() => {
    dispatch({ type: 'CANCEL_SELECTION' });
  }, []);

  const contextValue: HighlighterContextType = {
    highlighterState,
    addHighlight,
    removeHighlight,
    clearHighlights,
    setActive,
    startSelection,
    updateSelection,
    endSelection,
    cancelSelection,
  };

  return (
    <HighlighterContext.Provider value={contextValue}>
      {children}
    </HighlighterContext.Provider>
  );
}

export function useHighlighter(): HighlighterContextType {
  const context = useContext(HighlighterContext);
  if (context === undefined) {
    throw new Error('useHighlighter must be used within a HighlighterProvider');
  }
  return context;
}