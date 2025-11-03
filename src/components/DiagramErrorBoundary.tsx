import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import '../styles/DiagramErrorBoundary.css';

interface DiagramErrorBoundaryProps {
  children: React.ReactNode;
  diagramType: string;
  fallbackImage?: string;
}

const DiagramFallback: React.FC<{ diagramType: string; fallbackImage?: string }> = ({ 
  diagramType, 
  fallbackImage 
}) => (
  <div className="diagram-fallback">
    <div className="diagram-fallback__content">
      {fallbackImage ? (
        <img 
          src={fallbackImage} 
          alt={`${diagramType} diagram`}
          className="diagram-fallback__image"
          onError={(e) => {
            // If fallback image also fails, show text fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const textFallback = target.nextElementSibling as HTMLElement;
            if (textFallback) {
              textFallback.style.display = 'block';
            }
          }}
        />
      ) : null}
      <div className="diagram-fallback__text" style={{ display: fallbackImage ? 'none' : 'block' }}>
        <div className="diagram-fallback__icon">📊</div>
        <h4 className="diagram-fallback__title">{diagramType} Diagram</h4>
        <p className="diagram-fallback__message">
          The interactive diagram is temporarily unavailable. 
          The content shows the system architecture and workflow as designed.
        </p>
        <div className="diagram-fallback__placeholder">
          <div className="placeholder-box">
            <span>Diagram Content</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const DiagramErrorBoundary: React.FC<DiagramErrorBoundaryProps> = ({ 
  children, 
  diagramType,
  fallbackImage 
}) => {
  return (
    <ErrorBoundary
      componentName={`${diagramType} Diagram`}
      fallback={<DiagramFallback diagramType={diagramType} fallbackImage={fallbackImage} />}
    >
      {children}
    </ErrorBoundary>
  );
};

export default DiagramErrorBoundary;