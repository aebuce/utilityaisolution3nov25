import React from 'react'
import './styles/App.css'
import { SlideProvider } from './contexts/SlideContext'
import { SlideManager } from './components/SlideManager'
import { slideConfigs, presentationConfig } from './config/slideConfig'

function App() {
  return (
    <SlideProvider totalSlides={presentationConfig.totalSlides}>
      <div className="app">
        <SlideManager slides={slideConfigs} className="main-presentation" />
      </div>
    </SlideProvider>
  )
}

export default App