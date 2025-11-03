import React from 'react'
import './styles/App.css'
import { SlideProvider } from './contexts/SlideContext'
import { HighlighterProvider } from './contexts/HighlighterContext'
import { SlideManager } from './components/SlideManager'
import { NavigationController } from './components/NavigationController'
import { HighlighterToggle } from './components/HighlighterToggle'
import { HighlighterManager } from './components/HighlighterManager'
import { slideConfigs, presentationConfig } from './config/slideConfig'

function App() {
  return (
    <SlideProvider totalSlides={presentationConfig.totalSlides}>
      <HighlighterProvider>
        <div className="app">
          <SlideManager slides={slideConfigs} className="main-presentation" />
          <NavigationController />
          <HighlighterToggle />
          <HighlighterManager />
        </div>
      </HighlighterProvider>
    </SlideProvider>
  )
}

export default App