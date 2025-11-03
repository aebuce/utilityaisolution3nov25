import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import '../styles/BusinessProcessSlide.css';

interface BusinessProcessSlideProps {
  mermaidDiagram?: string;
}

export function BusinessProcessSlide({ mermaidDiagram }: BusinessProcessSlideProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramError, setDiagramError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Default business process diagram as per design document
  const defaultDiagram = `flowchart TD
    A[Customer Calls Facility] --> B[Amazon Connect Receives Call]
    B --> C[Amazon Lex Bot Activated]
    C --> D{Intent Recognition}
    D -->|Work Order Request| E[Bedrock Agent Processes]
    D -->|General FAQ| F[Bedrock Knowledge Base]
    E --> G[CMMS System Integration]
    F --> H[FAQ Response Generated]
    G --> I[Work Order Created]
    I --> J[Field Service Dispatch]
    J --> K[Partner Notification]
    K --> L[Status Updates to Customer]
    L --> M[Work Order Completion]
    
    classDef customerClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef aiClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef backendClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef partnerClass fill:#fff3e0,stroke:#e65100,stroke-width:2px
    
    class A,B customerClass
    class C,D,E,F aiClass
    class G,H,I,J backendClass
    class K,L,M partnerClass`;

  const diagramToRender = mermaidDiagram || defaultDiagram;

  // Handle component mounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const initAndRender = async () => {
      try {
        console.log('Initializing Mermaid...');
        
        // Set up timeout after we start the process
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('Diagram rendering timed out');
            setDiagramError('Diagram rendering timed out');
            setIsLoading(false);
          }
        }, 8000); // 8 second timeout
        
        // Initialize Mermaid with basic configuration
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose'
        });

        console.log('Mermaid initialized, waiting for DOM...');
        
        // Wait a bit for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (mounted && diagramRef.current) {
          console.log('DOM ready, rendering diagram...');
          
          // Clear any existing content
          diagramRef.current.innerHTML = '';
          
          try {
            // Try the modern render API first
            const diagramId = `business-process-${Date.now()}`;
            const { svg } = await mermaid.render(diagramId, diagramToRender);
            diagramRef.current.innerHTML = svg;
            console.log('Diagram rendered successfully with modern API');
            
            // Clear timeout on success
            if (timeoutId) clearTimeout(timeoutId);
            setIsLoading(false);
          } catch (modernError) {
            console.log('Modern API failed, trying legacy approach:', modernError);
            
            // Fallback to legacy approach
            diagramRef.current.innerHTML = `<div class="mermaid">${diagramToRender}</div>`;
            
            const mermaidElement = diagramRef.current.querySelector('.mermaid');
            if (mermaidElement) {
              await mermaid.init(undefined, mermaidElement);
              console.log('Diagram rendered successfully with legacy API');
              
              // Clear timeout on success
              if (timeoutId) clearTimeout(timeoutId);
              setIsLoading(false);
            } else {
              throw new Error('Mermaid element not found');
            }
          }
        } else {
          console.log('Component unmounted or ref not available');
          if (mounted) {
            setDiagramError('Unable to access diagram container');
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Mermaid rendering failed:', error);
        if (mounted) {
          // Clear timeout on error
          if (timeoutId) clearTimeout(timeoutId);
          setDiagramError(error instanceof Error ? error.message : 'Failed to render diagram');
          setIsLoading(false);
        }
      }
    };

    initAndRender();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isMounted, diagramToRender]);

  const handleRetryRender = () => {
    setIsLoading(true);
    setDiagramError(null);
    // The useEffect will handle the re-rendering
  };

  return (
    <div className="slide business-process-slide">
      <div className="business-process-content">
        <div className="slide-header">
          <h1 className="slide-title">Business Process Overview</h1>
          <p className="slide-subtitle">
            AI-Powered Work Order Management Flow
          </p>
        </div>

        <div className="diagram-container">
          {isLoading && (
            <div className="diagram-loading">
              <div className="loading-spinner"></div>
              <p>Loading business process diagram...</p>
            </div>
          )}

          {diagramError && (
            <div className="diagram-error">
              <div className="error-icon">⚠️</div>
              <h3>Diagram Rendering Error</h3>
              <p className="error-message">{diagramError}</p>
              <button 
                className="retry-button" 
                onClick={handleRetryRender}
                type="button"
              >
                Retry Rendering
              </button>
              <div className="fallback-content">
                <h4>Process Overview:</h4>
                <ol className="process-steps">
                  <li>Customer calls facility management hotline</li>
                  <li>Amazon Connect routes call to AI system</li>
                  <li>Amazon Lex processes natural language request</li>
                  <li>Bedrock Agent or Knowledge Base handles intent</li>
                  <li>CMMS system creates and manages work order</li>
                  <li>Field service dispatch coordinates response</li>
                  <li>Partner notification and status updates</li>
                  <li>Work order completion and customer notification</li>
                </ol>
              </div>
            </div>
          )}

          <div 
            ref={diagramRef} 
            className={`mermaid-diagram ${isLoading ? 'loading' : ''} ${diagramError ? 'error' : ''}`}
            role="img"
            aria-label="Business process flow diagram showing the complete work order management lifecycle from customer call to completion"
            style={{ display: (!isLoading && !diagramError) ? 'block' : 'none' }}
          >
            {/* Mermaid content will be inserted here */}
          </div>
        </div>

        <div className="process-highlights">
          <div className="highlight-item">
            <div className="highlight-icon">🤖</div>
            <div className="highlight-content">
              <h3>AI-Powered Processing</h3>
              <p>Automated intent recognition and intelligent routing</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">🔄</div>
            <div className="highlight-content">
              <h3>Seamless Integration</h3>
              <p>Direct connection to existing CMMS and dispatch systems</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">⚡</div>
            <div className="highlight-content">
              <h3>Real-time Updates</h3>
              <p>Continuous status tracking and customer communication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}