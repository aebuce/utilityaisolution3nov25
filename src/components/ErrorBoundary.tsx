import React, { Component, ErrorInfo, ReactNode } from 'react';
import '../styles/ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Enhanced logging for production deployment
    const errorDetails = {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      componentName: this.props.componentName
    };
    
    // Log to console for debugging
    console.error('Production Error Details:', errorDetails);
    
    // Store error in sessionStorage for potential debugging
    try {
      const existingErrors = JSON.parse(sessionStorage.getItem('app-errors') || '[]');
      existingErrors.push(errorDetails);
      sessionStorage.setItem('app-errors', JSON.stringify(existingErrors.slice(-10))); // Keep last 10 errors
    } catch (storageError) {
      console.warn('Could not store error in sessionStorage:', storageError);
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <div className="error-boundary__icon">⚠️</div>
            <h3 className="error-boundary__title">
              {this.props.componentName ? `${this.props.componentName} Error` : 'Something went wrong'}
            </h3>
            <p className="error-boundary__message">
              We're sorry, but this component failed to load properly. 
              Please try refreshing the page or contact support if the problem persists.
            </p>
            <details className="error-boundary__details">
              <summary>Technical Details</summary>
              <pre className="error-boundary__error-text">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button 
              className="error-boundary__retry-button"
              onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;