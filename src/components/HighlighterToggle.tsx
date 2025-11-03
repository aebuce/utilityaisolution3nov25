import React from 'react';
import { useHighlighter } from '../contexts/HighlighterContext';
import '../styles/HighlighterToggle.css';

interface HighlighterToggleProps {
  className?: string;
}

export function HighlighterToggle({ className = '' }: HighlighterToggleProps) {
  const { highlighterState, setActive, clearHighlights } = useHighlighter();

  const handleToggle = () => {
    setActive(!highlighterState.isActive);
  };

  const handleClearHighlights = () => {
    clearHighlights();
  };

  return (
    <div className={`highlighter-toggle ${className}`}>
      <button
        className={`highlighter-toggle__button ${
          highlighterState.isActive ? 'highlighter-toggle__button--active' : ''
        }`}
        onClick={handleToggle}
        title={highlighterState.isActive ? 'Disable Highlighter' : 'Enable Highlighter'}
        aria-label={highlighterState.isActive ? 'Disable virtual highlighter' : 'Enable virtual highlighter'}
      >
        <span className="highlighter-toggle__icon">🖍️</span>
        <span className="highlighter-toggle__text">
          {highlighterState.isActive ? 'Highlighting' : 'Highlight'}
        </span>
      </button>
      
      {highlighterState.highlights.length > 0 && (
        <button
          className="highlighter-toggle__clear"
          onClick={handleClearHighlights}
          title="Clear all highlights"
          aria-label="Clear all highlights"
        >
          <span className="highlighter-toggle__clear-icon">🗑️</span>
        </button>
      )}
    </div>
  );
}