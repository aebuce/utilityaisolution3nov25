import React, { useRef, useEffect, useCallback } from 'react';
import { useHighlighter } from '../contexts/HighlighterContext';
import { useSlideContext } from '../contexts/SlideContext';
import type { HighlightData } from '../types/highlighter';
import '../styles/VirtualHighlighter.css';

interface VirtualHighlighterProps {
  children: React.ReactNode;
  className?: string;
}

export function VirtualHighlighter({ children, className = '' }: VirtualHighlighterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const {
    highlighterState,
    addHighlight,
    startSelection,
    updateSelection,
    endSelection,
    cancelSelection,
  } = useHighlighter();
  const { slideState } = useSlideContext();

  // Handle mouse down event to start selection
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!highlighterState.isActive) return;
    
    event.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    startSelection(x, y);
  }, [highlighterState.isActive, startSelection]);

  // Handle touch start event for mobile devices
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (!highlighterState.isActive) return;
    
    event.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || event.touches.length === 0) return;

    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    startSelection(x, y);
  }, [highlighterState.isActive, startSelection]);

  // Handle mouse move event to update selection
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!highlighterState.isSelecting || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    updateSelection(x, y);
  }, [highlighterState.isSelecting, updateSelection]);

  // Handle touch move event for mobile devices
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!highlighterState.isSelecting || !containerRef.current) return;

    event.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    if (event.touches.length === 0) return;

    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    updateSelection(x, y);
  }, [highlighterState.isSelecting, updateSelection]);

  // Handle mouse up event to end selection
  const handleMouseUp = useCallback((event: MouseEvent) => {
    if (!highlighterState.isSelecting || !highlighterState.currentSelection) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || '';
    
    if (selectedText && highlighterState.currentSelection) {
      const { startX, startY, endX, endY } = highlighterState.currentSelection;
      
      // Calculate highlight coordinates
      const coordinates = {
        x: Math.min(startX, endX),
        y: Math.min(startY, endY),
        width: Math.abs(endX - startX),
        height: Math.abs(endY - startY),
      };

      // Only create highlight if selection has meaningful size
      if (coordinates.width > 5 && coordinates.height > 5) {
        addHighlight({
          slideId: slideState.currentSlide,
          coordinates,
          content: selectedText,
        });
      }
    }

    // Clear browser selection
    if (selection) {
      selection.removeAllRanges();
    }

    endSelection(selectedText);
  }, [
    highlighterState.isSelecting,
    highlighterState.currentSelection,
    slideState.currentSlide,
    addHighlight,
    endSelection,
  ]);

  // Handle touch end event for mobile devices
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!highlighterState.isSelecting || !highlighterState.currentSelection) return;

    event.preventDefault();
    
    // For touch devices, we'll use the selection area as the content
    const { startX, startY, endX, endY } = highlighterState.currentSelection;
    
    // Calculate highlight coordinates
    const coordinates = {
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };

    // Only create highlight if selection has meaningful size
    if (coordinates.width > 10 && coordinates.height > 10) {
      addHighlight({
        slideId: slideState.currentSlide,
        coordinates,
        content: `Highlighted area (${coordinates.width}x${coordinates.height})`,
      });
    }

    endSelection('Touch selection');
  }, [
    highlighterState.isSelecting,
    highlighterState.currentSelection,
    slideState.currentSlide,
    addHighlight,
    endSelection,
  ]);

  // Handle escape key to cancel selection
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && highlighterState.isSelecting) {
      cancelSelection();
    }
  }, [highlighterState.isSelecting, cancelSelection]);

  // Add global event listeners for mouse and touch events
  useEffect(() => {
    if (highlighterState.isSelecting) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [highlighterState.isSelecting, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd, handleKeyDown]);

  // Get current slide highlights
  const currentSlideHighlights = highlighterState.highlights.filter(
    h => h.slideId === slideState.currentSlide
  );

  // Render selection overlay
  const renderSelectionOverlay = () => {
    if (!highlighterState.isSelecting || !highlighterState.currentSelection) {
      return null;
    }

    const { startX, startY, endX, endY } = highlighterState.currentSelection;
    const style = {
      left: Math.min(startX, endX),
      top: Math.min(startY, endY),
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
    };

    return (
      <div
        ref={selectionRef}
        className="virtual-highlighter__selection"
        style={style}
      />
    );
  };

  // Render existing highlights
  const renderHighlights = () => {
    return currentSlideHighlights.map((highlight: HighlightData) => (
      <div
        key={highlight.id}
        className="virtual-highlighter__highlight"
        style={{
          left: highlight.coordinates.x,
          top: highlight.coordinates.y,
          width: highlight.coordinates.width,
          height: highlight.coordinates.height,
        }}
        title={highlight.content}
      />
    ));
  };

  return (
    <div
      ref={containerRef}
      className={`virtual-highlighter ${className} ${
        highlighterState.isActive ? 'virtual-highlighter--active' : ''
      }`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
      
      {/* Highlight overlays */}
      <div className="virtual-highlighter__overlay">
        {renderHighlights()}
        {renderSelectionOverlay()}
      </div>
    </div>
  );
}