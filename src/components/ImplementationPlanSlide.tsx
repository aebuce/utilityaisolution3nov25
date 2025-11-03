import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import '../styles/ImplementationPlanSlide.css';

interface ImplementationPlanSlideProps {
  ganttChart?: string;
}

export function ImplementationPlanSlide({ ganttChart }: ImplementationPlanSlideProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramError, setDiagramError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Default Gantt chart showing realistic enterprise deployment timeline
  const defaultGanttChart = `gantt
    title Implementation Timeline - Facility Management AI Solution
    dateFormat YYYY-MM-DD
    axisFormat %b %Y
    tickInterval 1month
    
    section Phase 1 Foundation
    Project Kickoff                    :milestone, kickoff, 2024-01-01, 0d
    AWS Account Setup                  :active, setup, 2024-01-01, 2024-01-15
    Security & Compliance Review       :security, 2024-01-08, 2024-01-22
    Network & VPC Configuration        :network, after setup, 15d
    
    section Phase 2 Core Services
    Amazon Connect Setup               :connect, 2024-01-22, 2024-02-05
    Amazon Lex Bot Development         :lex, 2024-01-29, 2024-02-19
    Bedrock Knowledge Base Setup       :kb, 2024-02-05, 2024-02-26
    Bedrock Agents Development         :agents, 2024-02-12, 2024-03-11
    
    section Phase 3 Integration
    CMMS System Integration            :cmms, 2024-02-26, 2024-03-25
    Field Service API Integration      :field, 2024-03-04, 2024-03-25
    Partner System Connections        :partners, 2024-03-11, 2024-04-01
    Data Migration & Synchronization   :migration, 2024-03-18, 2024-04-08
    
    section Phase 4 Testing
    Unit & Integration Testing         :testing, 2024-03-25, 2024-04-15
    User Acceptance Testing            :uat, 2024-04-08, 2024-04-29
    Performance & Load Testing         :perf, 2024-04-15, 2024-05-06
    Security Penetration Testing      :pentest, 2024-04-22, 2024-05-06
    
    section Phase 5 Deployment
    Staging Environment Deployment     :staging, 2024-04-29, 2024-05-13
    Production Deployment              :prod, 2024-05-06, 2024-05-20
    Go-Live Support                    :golive, 2024-05-20, 2024-06-03
    Post-Launch Optimization           :optimize, 2024-05-27, 2024-06-17
    
    section Key Milestones
    Phase 1 Complete                   :milestone, p1done, 2024-01-22, 0d
    Phase 2 Complete                   :milestone, p2done, 2024-03-11, 0d
    Phase 3 Complete                   :milestone, p3done, 2024-04-08, 0d
    Phase 4 Complete                   :milestone, p4done, 2024-05-06, 0d
    Production Go-Live                 :milestone, golive-milestone, 2024-05-20, 0d
    Project Complete                   :milestone, complete, 2024-06-17, 0d`;

  const chartToRender = ganttChart || defaultGanttChart;

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
        console.log('Initializing Mermaid for Implementation Plan...');
        
        // Set up timeout after we start the process
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('Gantt chart rendering timed out');
            setDiagramError('Gantt chart rendering timed out');
            setIsLoading(false);
          }
        }, 10000); // 10 second timeout for complex Gantt chart
        
        // Initialize Mermaid with configuration optimized for Gantt charts
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          gantt: {
            useMaxWidth: false,
            leftPadding: 150,
            gridLineStartPadding: 35,
            fontSize: 14,
            sectionFontSize: 16,
            numberSectionStyles: 4,
            axisFormat: '%b %Y',
            tickInterval: '1month',
            weekday: 'monday'
          },
          themeVariables: {
            primaryColor: '#ff9900',
            primaryTextColor: '#000000',
            primaryBorderColor: '#ff9900',
            lineColor: '#cccccc',
            sectionBkgColor: '#f0f0f0',
            altSectionBkgColor: '#ffffff',
            gridColor: '#e0e0e0',
            section0: '#ff9900',
            section1: '#1976d2',
            section2: '#4caf50',
            section3: '#9c27b0',
            section4: '#f44336'
          }
        });

        console.log('Mermaid initialized, waiting for DOM...');
        
        // Wait a bit for DOM to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (mounted && diagramRef.current) {
          console.log('DOM ready, rendering Gantt chart...');
          
          try {
            // Try the modern render API first
            const diagramId = `implementation-plan-${Date.now()}`;
            const { svg } = await mermaid.render(diagramId, chartToRender);
            
            // Use React ref to set content
            if (diagramRef.current) {
              diagramRef.current.innerHTML = svg;
              console.log('Gantt chart rendered successfully with modern API');
              
              // Clear timeout on success
              if (timeoutId) clearTimeout(timeoutId);
              setIsLoading(false);
            }
          } catch (modernError) {
            console.log('Modern API failed, using fallback display');
            // If rendering fails, we'll show the fallback content
            setDiagramError('Diagram rendering failed - showing fallback timeline');
            setIsLoading(false);
          }
        } else {
          console.log('Component unmounted or ref not available');
          if (mounted) {
            setDiagramError('Unable to access diagram container');
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Mermaid Gantt chart rendering failed:', error);
        if (mounted) {
          // Clear timeout on error
          if (timeoutId) clearTimeout(timeoutId);
          setDiagramError(error instanceof Error ? error.message : 'Failed to render Gantt chart');
          setIsLoading(false);
        }
      }
    };

    initAndRender();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isMounted, chartToRender]);

  const handleRetryRender = () => {
    setIsLoading(true);
    setDiagramError(null);
    // The useEffect will handle the re-rendering
  };

  return (
    <div className="slide implementation-plan-slide">
      <div className="implementation-plan-content">
        <div className="slide-header">
          <h1 className="slide-title">Implementation Timeline</h1>
          <p className="slide-subtitle">
            Realistic Enterprise Deployment Schedule • Scroll to view full timeline
          </p>
        </div>

        <div className="diagram-container">
          {isLoading && (
            <div className="diagram-loading">
              <div className="loading-spinner"></div>
              <p>Loading implementation timeline...</p>
            </div>
          )}

          {diagramError && (
            <div className="diagram-error">
              <div className="error-icon">⚠️</div>
              <h3>Timeline Rendering Error</h3>
              <p className="error-message">{diagramError}</p>
              <button 
                className="retry-button" 
                onClick={handleRetryRender}
                type="button"
              >
                Retry Rendering
              </button>
              <div className="fallback-content">
                <h4>Implementation Phases:</h4>
                <div className="timeline-phases">
                  <div className="phase">
                    <h5>Phase 1: Foundation (3 weeks)</h5>
                    <ul>
                      <li>Project kickoff and planning</li>
                      <li>AWS account setup and security review</li>
                      <li>Network and VPC configuration</li>
                    </ul>
                  </div>
                  <div className="phase">
                    <h5>Phase 2: Core Services (7 weeks)</h5>
                    <ul>
                      <li>Amazon Connect contact center setup</li>
                      <li>Amazon Lex conversational AI development</li>
                      <li>Bedrock knowledge base and agents</li>
                    </ul>
                  </div>
                  <div className="phase">
                    <h5>Phase 3: Integration (6 weeks)</h5>
                    <ul>
                      <li>CMMS system integration</li>
                      <li>Field service API connections</li>
                      <li>Partner system integrations</li>
                      <li>Data migration and synchronization</li>
                    </ul>
                  </div>
                  <div className="phase">
                    <h5>Phase 4: Testing (6 weeks)</h5>
                    <ul>
                      <li>Unit and integration testing</li>
                      <li>User acceptance testing</li>
                      <li>Performance and security testing</li>
                    </ul>
                  </div>
                  <div className="phase">
                    <h5>Phase 5: Deployment (4 weeks)</h5>
                    <ul>
                      <li>Staging environment deployment</li>
                      <li>Production go-live</li>
                      <li>Post-launch optimization</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-summary">
                  <strong>Total Duration: ~26 weeks (6 months)</strong>
                </div>
              </div>
            </div>
          )}

          <div 
            ref={diagramRef} 
            className={`mermaid-diagram gantt-chart ${isLoading ? 'loading' : ''} ${diagramError ? 'error' : ''}`}
            role="img"
            aria-label="Implementation timeline Gantt chart showing project phases, milestones, and realistic deployment schedule for enterprise facility management solution"
            style={{ display: (!isLoading && !diagramError) ? 'block' : 'none' }}
          >
            {/* Mermaid Gantt chart content will be inserted here */}
          </div>
        </div>

        <div className="implementation-highlights">
          <div className="highlight-item">
            <div className="highlight-icon">📅</div>
            <div className="highlight-content">
              <h3>6-Month Timeline</h3>
              <p>Realistic enterprise deployment schedule with proper testing phases</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">🏗️</div>
            <div className="highlight-content">
              <h3>Phased Approach</h3>
              <p>Structured implementation with clear milestones and deliverables</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">🔄</div>
            <div className="highlight-content">
              <h3>Parallel Workstreams</h3>
              <p>Optimized timeline with overlapping phases to accelerate delivery</p>
            </div>
          </div>
          
          <div className="highlight-item">
            <div className="highlight-icon">✅</div>
            <div className="highlight-content">
              <h3>Quality Assurance</h3>
              <p>Comprehensive testing including UAT, performance, and security validation</p>
            </div>
          </div>
        </div>

        <div className="key-milestones">
          <h3>Key Milestones</h3>
          <div className="milestones-grid">
            <div className="milestone">
              <div className="milestone-date">Week 3</div>
              <div className="milestone-title">Foundation Complete</div>
            </div>
            <div className="milestone">
              <div className="milestone-date">Week 10</div>
              <div className="milestone-title">Core Services Ready</div>
            </div>
            <div className="milestone">
              <div className="milestone-date">Week 16</div>
              <div className="milestone-title">Integration Complete</div>
            </div>
            <div className="milestone">
              <div className="milestone-date">Week 22</div>
              <div className="milestone-title">Testing Validated</div>
            </div>
            <div className="milestone">
              <div className="milestone-date">Week 26</div>
              <div className="milestone-title">Production Go-Live</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}