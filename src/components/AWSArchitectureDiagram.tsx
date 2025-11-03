import React from 'react';

export function AWSArchitectureDiagram() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          {`
            .title-text { font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #232F3E; }
            .service-text { font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: white; }
            .desc-text { font-family: Arial, sans-serif; font-size: 11px; fill: white; }
            .customer-box { fill: #E8F4FD; stroke: #1976D2; stroke-width: 2; }
            .aws-box { fill: #FF9900; stroke: #FF9900; stroke-width: 2; }
            .ai-box { fill: #9C27B0; stroke: #9C27B0; stroke-width: 2; }
            .backend-box { fill: #4CAF50; stroke: #4CAF50; stroke-width: 2; }
            .arrow { stroke: #666; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
            .cluster-box { fill: none; stroke: #ddd; stroke-width: 2; stroke-dasharray: 5,5; }
            .cluster-title { font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #666; }
          `}
        </style>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
        </marker>
      </defs>
      
      {/* Background */}
      <rect width="1200" height="800" fill="#f8f9fa"/>
      
      {/* Title */}
      <text x="600" y="30" textAnchor="middle" className="title-text">AWS Facility Management Architecture</text>
      
      {/* Customer Channels Cluster */}
      <rect x="50" y="80" width="280" height="150" className="cluster-box"/>
      <text x="60" y="100" className="cluster-title">Customer Channels</text>
      
      {/* Phone/PSTN */}
      <rect x="70" y="120" width="80" height="60" className="customer-box" rx="5"/>
      <text x="110" y="140" textAnchor="middle" className="service-text" fill="#1976D2">📞 Phone</text>
      <text x="110" y="155" textAnchor="middle" className="desc-text" fill="#1976D2">PSTN</text>
      
      {/* Web Chat */}
      <rect x="160" y="120" width="80" height="60" className="customer-box" rx="5"/>
      <text x="200" y="140" textAnchor="middle" className="service-text" fill="#1976D2">💬 Chat</text>
      <text x="200" y="155" textAnchor="middle" className="desc-text" fill="#1976D2">Web</text>
      
      {/* Web Voice */}
      <rect x="250" y="120" width="80" height="60" className="customer-box" rx="5"/>
      <text x="290" y="140" textAnchor="middle" className="service-text" fill="#1976D2">🎤 Voice</text>
      <text x="290" y="155" textAnchor="middle" className="desc-text" fill="#1976D2">WebRTC</text>
      
      {/* AWS Contact Center Cluster */}
      <rect x="400" y="80" width="350" height="150" className="cluster-box"/>
      <text x="410" y="100" className="cluster-title">AWS Contact Center Services</text>
      
      {/* Amazon Connect */}
      <rect x="420" y="120" width="140" height="60" className="aws-box" rx="5"/>
      <text x="490" y="140" textAnchor="middle" className="service-text">Amazon Connect</text>
      <text x="490" y="155" textAnchor="middle" className="desc-text">Contact Center</text>
      
      {/* Amazon Lex */}
      <rect x="580" y="120" width="140" height="60" className="aws-box" rx="5"/>
      <text x="650" y="140" textAnchor="middle" className="service-text">Amazon Lex</text>
      <text x="650" y="155" textAnchor="middle" className="desc-text">Conversational AI</text>
      
      {/* AWS AI Services Cluster */}
      <rect x="400" y="280" width="350" height="150" className="cluster-box"/>
      <text x="410" y="300" className="cluster-title">AWS AI & ML Services</text>
      
      {/* Bedrock Knowledge Base */}
      <rect x="420" y="320" width="140" height="60" className="ai-box" rx="5"/>
      <text x="490" y="340" textAnchor="middle" className="service-text">Bedrock KB</text>
      <text x="490" y="355" textAnchor="middle" className="desc-text">Knowledge Base</text>
      
      {/* Bedrock Agents */}
      <rect x="580" y="320" width="140" height="60" className="ai-box" rx="5"/>
      <text x="650" y="340" textAnchor="middle" className="service-text">Bedrock Agents</text>
      <text x="650" y="355" textAnchor="middle" className="desc-text">Work Order AI</text>
      
      {/* Backend Integration Cluster */}
      <rect x="850" y="80" width="300" height="350" className="cluster-box"/>
      <text x="860" y="100" className="cluster-title">Backend Integration Layer</text>
      
      {/* ServiceNow */}
      <rect x="870" y="120" width="120" height="60" className="backend-box" rx="5"/>
      <text x="930" y="140" textAnchor="middle" className="service-text">ServiceNow</text>
      <text x="930" y="155" textAnchor="middle" className="desc-text">CMMS</text>
      
      {/* Maximo */}
      <rect x="1010" y="120" width="120" height="60" className="backend-box" rx="5"/>
      <text x="1070" y="140" textAnchor="middle" className="service-text">IBM Maximo</text>
      <text x="1070" y="155" textAnchor="middle" className="desc-text">Asset Mgmt</text>
      
      {/* FieldAware */}
      <rect x="870" y="220" width="120" height="60" className="backend-box" rx="5"/>
      <text x="930" y="240" textAnchor="middle" className="service-text">FieldAware</text>
      <text x="930" y="255" textAnchor="middle" className="desc-text">Dispatch</text>
      
      {/* Partner APIs */}
      <rect x="1010" y="220" width="120" height="60" className="backend-box" rx="5"/>
      <text x="1070" y="240" textAnchor="middle" className="service-text">Partner APIs</text>
      <text x="1070" y="255" textAnchor="middle" className="desc-text">Contractors</text>
      
      {/* Arrows */}
      {/* Customer to Connect */}
      <line x1="150" y1="150" x2="420" y2="150" className="arrow"/>
      <line x1="240" y1="150" x2="420" y2="150" className="arrow"/>
      <line x1="330" y1="150" x2="420" y2="150" className="arrow"/>
      
      {/* Connect to Lex */}
      <line x1="560" y1="150" x2="580" y2="150" className="arrow"/>
      
      {/* Lex to Bedrock Services */}
      <line x1="620" y1="180" x2="490" y2="320" className="arrow"/>
      <line x1="680" y1="180" x2="650" y2="320" className="arrow"/>
      
      {/* Bedrock to Backend */}
      <line x1="720" y1="340" x2="870" y2="150" className="arrow"/>
      <line x1="720" y1="360" x2="1010" y2="150" className="arrow"/>
      
      {/* Backend to Field Services */}
      <line x1="930" y1="180" x2="930" y2="220" className="arrow"/>
      <line x1="1070" y1="180" x2="930" y2="220" className="arrow"/>
      
      {/* Field to Partners */}
      <line x1="990" y1="250" x2="1010" y2="250" className="arrow"/>
      
      {/* Status Updates (return flow) */}
      <line x1="1010" y1="270" x2="870" y2="270" className="arrow"/>
      <line x1="870" y1="280" x2="490" y2="380" className="arrow"/>
      
      {/* Flow Labels */}
      <text x="285" y="140" className="desc-text" fill="#666">Voice/Chat</text>
      <text x="570" y="140" className="desc-text" fill="#666">Route</text>
      <text x="550" y="250" className="desc-text" fill="#666">Process</text>
      <text x="780" y="200" className="desc-text" fill="#666">Create Orders</text>
      <text x="950" y="200" className="desc-text" fill="#666">Dispatch</text>
      <text x="1000" y="240" className="desc-text" fill="#666">Assign</text>
      <text x="940" y="290" className="desc-text" fill="#666">Status Updates</text>
    </svg>
  );
}