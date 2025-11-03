import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import '../styles/TechnicalArchitectureSlide.css';

interface TechnicalArchitectureSlideProps {
  architectureDiagram?: string;
}

export function TechnicalArchitectureSlide({ architectureDiagram }: TechnicalArchitectureSlideProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramError, setDiagramError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // AWS architecture diagram as per design document
  const defaultDiagram = `graph TB
    subgraph "Customer Channels"
        A[Phone/PSTN]
        B[Web Chat]
        C[Web Voice]
    end
    
    subgraph "AWS Contact Center"
        D[Amazon Connect<br/>Contact Center]
        E[Amazon Lex<br/>Conversational AI]
    end
    
    subgraph "AWS AI Services"
        F[Bedrock Knowledge Base<br/>FAQ & Documentation]
        G[Bedrock Agents<br/>Work Order Processing]
    end
    
    subgraph "Backend Integration"
        H[CMMS System 1<br/>ServiceNow]
        I[CMMS System 2<br/>Maximo]
        J[Field Service Dispatch<br/>FieldAware]
        K[Partner APIs<br/>Contractor Network]
    end
    
    subgraph "Data Flow"
        L[Call Routing & Recording]
        M[Intent Classification]
        N[Knowledge Retrieval]
        O[Work Order Creation]
        P[Status Updates]
    end
    
    %% Customer to AWS Connect
    A --> D
    B --> D
    C --> D
    
    %% Connect to Lex
    D --> E
    D --> L
    
    %% Lex to Bedrock Services
    E --> F
    E --> G
    E --> M
    
    %% Bedrock to Backend Systems
    F --> N
    G --> H
    G --> I
    G --> O
    
    %% Backend to Field Services
    H --> J
    I --> J
    J --> K
    
    %% Status Updates Flow
    J --> P
    K --> P
    P --> D
    
    %% Styling
    classDef customerClass fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef awsClass fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef aiClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef backendClass fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef dataClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class A,B,C customerClass
    class D,E awsClass
    class F,G aiClass
    class H,I,J,K backendClass
    class L,M,N,O,P dataClass`;

  const diagramToRender = architectureDiagram || defaultDiagram;

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
        console.log('Initializing Mermaid for Technical Architecture...');
        
        // Set up timeout after we start the process
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('Architecture diagram rendering timed out');
            setDiagramError('Architecture diagram rendering timed out');
            setIsLoading(false);
          }
        }, 10000); // 10 second timeout for complex diagram
        
        // Initialize Mermaid with configuration optimized for architecture diagrams
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis'
          }
        });

        console.log('Mermaid initialized, waiting for DOM...');
        
        // Wait a bit for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (mounted && diagramRef.current) {
          console.log('DOM ready, rendering architecture diagram...');
          
          // Clear any existing content
          diagramRef.current.innerHTML = '';
          
          try {
            // Try the modern render API first
            const diagramId = `technical-architecture-${Date.now()}`;
            const { svg } = await mermaid.render(diagramId, diagramToRender);
            diagramRef.current.innerHTML = svg;
            console.log('Architecture diagram rendered successfully with modern API');
            
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
              console.log('Architecture diagram rendered successfully with legacy API');
              
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
        console.error('Mermaid architecture diagram rendering failed:', error);
        if (mounted) {
          // Clear timeout on error
          if (timeoutId) clearTimeout(timeoutId);
          setDiagramError(error instanceof Error ? error.message : 'Failed to render architecture diagram');
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
    <div className="slide technical-architecture-slide">
      <div className="technical-architecture-content">
        <div className="slide-header">
          <h1 className="slide-title">AWS Technical Architecture</h1>
          <p className="slide-subtitle">
            Scalable AI-Powered Contact Center Solution
          </p>
        </div>

        <div className="diagram-container">
          {isLoading && (
            <div className="diagram-loading">
              <div className="loading-spinner"></div>
              <p>Loading AWS architecture diagram...</p>
            </div>
          )}

          {diagramError && (
            <div className="diagram-error">
              <div className="error-icon">⚠️</div>
              <h3>Architecture Diagram Error</h3>
              <p className="error-message">{diagramError}</p>
              <button 
                className="retry-button" 
                onClick={handleRetryRender}
                type="button"
              >
                Retry Rendering
              </button>
              <div className="fallback-content">
                <h4>Architecture Components:</h4>
                <div className="architecture-layers">
                  <div className="layer">
                    <h5>Customer Channels</h5>
                    <ul>
                      <li>Phone/PSTN calls</li>
                      <li>Web-based chat</li>
                      <li>Web-based voice</li>
                    </ul>
                  </div>
                  <div className="layer">
                    <h5>AWS Contact Center</h5>
                    <ul>
                      <li>Amazon Connect for call routing</li>
                      <li>Amazon Lex for conversational AI</li>
                    </ul>
                  </div>
                  <div className="layer">
                    <h5>AWS AI Services</h5>
                    <ul>
                      <li>Bedrock Knowledge Base for FAQs</li>
                      <li>Bedrock Agents for work order processing</li>
                    </ul>
                  </div>
                  <div className="layer">
                    <h5>Backend Integration</h5>
                    <ul>
                      <li>Multiple CMMS systems (ServiceNow, Maximo)</li>
                      <li>Field service dispatch systems</li>
                      <li>Partner and contractor APIs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div 
            ref={diagramRef} 
            className={`mermaid-diagram ${isLoading ? 'loading' : ''} ${diagramError ? 'error' : ''}`}
            role="img"
            aria-label="AWS technical architecture diagram showing the complete system flow from customer channels through AWS services to backend systems"
            style={{ display: (!isLoading && !diagramError) ? 'block' : 'none' }}
          >
            {/* Mermaid content will be inserted here */}
          </div>
        </div>

        <div className="architecture-highlights">
          <div className="highlight-item">
            <div className="highlight-icon">☁️</div>
            <div className="highlight-content">
              <h3>Cloud-Native Architecture</h3>
              <p>Built on AWS managed services for scalability and reliability</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">🧠</div>
            <div className="highlight-content">
              <h3>AI-Powered Intelligence</h3>
              <p>Bedrock agents and knowledge bases for intelligent processing</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">🔗</div>
            <div className="highlight-content">
              <h3>Multi-System Integration</h3>
              <p>Seamless connection to existing CMMS and field service platforms</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">📞</div>
            <div className="highlight-content">
              <h3>Omnichannel Support</h3>
              <p>Voice, chat, and web channels through Amazon Connect</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}