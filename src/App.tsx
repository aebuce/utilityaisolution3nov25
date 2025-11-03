import React from 'react'
import './styles/App.css'
import { SlideProvider } from './contexts/SlideContext'
import { HighlighterProvider } from './contexts/HighlighterContext'
import { SlideManager } from './components/SlideManager'
import { NavigationController } from './components/NavigationController'
import { HighlighterToggle } from './components/HighlighterToggle'
import { HighlighterManager } from './components/HighlighterManager'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AppFallback } from './components/AppFallback'
import { slideConfigs, presentationConfig } from './config/slideConfig'

function App() {
  return (
    <ErrorBoundary 
      componentName="Presentation Application"
      fallback={<AppFallback />}
    >
      <SlideProvider totalSlides={presentationConfig.totalSlides}>
        <HighlighterProvider>
          <div className="app presentation-app">
            <ErrorBoundary componentName="Slide Manager">
              <SlideManager slides={slideConfigs} className="main-presentation" />
            </ErrorBoundary>
            <ErrorBoundary componentName="Navigation Controller">
              <NavigationController />
            </ErrorBoundary>
            <ErrorBoundary componentName="Highlighter Controls">
              <HighlighterToggle />
              <HighlighterManager />
            </ErrorBoundary>
          </div>
        </HighlighterProvider>
      </SlideProvider>
    </ErrorBoundary>
  )
}

export default App