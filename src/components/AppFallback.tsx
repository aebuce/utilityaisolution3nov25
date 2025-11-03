import React from 'react';
import '../styles/AppFallback.css';

interface AppFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export const AppFallback: React.FC<AppFallbackProps> = ({ error, resetError }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReset = () => {
    if (resetError) {
      resetError();
    } else {
      handleRefresh();
    }
  };

  return (
    <div className="app-fallback">
      <div className="app-fallback__container">
        <div className="app-fallback__icon">🏢</div>
        <h1 className="app-fallback__title">Facility Management Presentation</h1>
        <div className="app-fallback__error">
          <h2>Application Error</h2>
          <p>
            We're sorry, but the presentation application encountered an unexpected error. 
            This might be due to a temporary issue or a problem with loading the presentation content.
          </p>
        </div>
        
        <div className="app-fallback__actions">
          <button 
            className="app-fallback__button app-fallback__button--primary"
            onClick={handleReset}
          >
            Try Again
          </button>
          <button 
            className="app-fallback__button app-fallback__button--secondary"
            onClick={handleRefresh}
          >
            Refresh Page
          </button>
        </div>

        <div className="app-fallback__help">
          <h3>What you can do:</h3>
          <ul>
            <li>Try refreshing the page</li>
            <li>Check your internet connection</li>
            <li>Clear your browser cache and cookies</li>
            <li>Try accessing the presentation in a different browser</li>
          </ul>
        </div>

        {error && (
          <details className="app-fallback__technical">
            <summary>Technical Information</summary>
            <pre className="app-fallback__error-details">
              {error.toString()}
              {error.stack && `\n\nStack trace:\n${error.stack}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default AppFallback;