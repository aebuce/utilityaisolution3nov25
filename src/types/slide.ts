export interface SlideConfig {
  id: number;
  title: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
}

export interface PresentationConfig {
  slides: SlideConfig[];
  totalSlides: number;
}

export interface SlideState {
  currentSlide: number;
  totalSlides: number;
  isTransitioning: boolean;
}

export interface SlideContextType {
  slideState: SlideState;
  goToSlide: (slideNumber: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
}