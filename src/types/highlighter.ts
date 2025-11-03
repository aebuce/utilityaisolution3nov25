// Type definitions for the virtual highlighter functionality

export interface HighlightData {
  id: string;
  slideId: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  content: string;
  timestamp: number;
}

export interface SelectionData {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  content: string;
}

export interface HighlighterState {
  isActive: boolean;
  isSelecting: boolean;
  currentSelection: SelectionData | null;
  highlights: HighlightData[];
}