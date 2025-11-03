import React from 'react';
import { SlideConfig, PresentationConfig } from '../types/slide';

// Placeholder slide components (will be implemented in later tasks)
const OpeningSlide = ({ title, presenter, date }: { title: string; presenter: string; date: string }) => (
  <div className="slide opening-slide">
    <h1>{title}</h1>
    <p>Presenter: {presenter}</p>
    <p>Date: {date}</p>
  </div>
);

const BusinessProcessSlide = () => (
  <div className="slide business-process-slide">
    <h2>Business Process Overview</h2>
    <p>Mermaid swimlane diagram will be implemented here</p>
  </div>
);

const TechnicalArchitectureSlide = () => (
  <div className="slide technical-architecture-slide">
    <h2>AWS Technical Architecture</h2>
    <p>AWS architecture diagram will be implemented here</p>
  </div>
);

const ImplementationPlanSlide = () => (
  <div className="slide implementation-plan-slide">
    <h2>Implementation Timeline</h2>
    <p>Mermaid Gantt chart will be implemented here</p>
  </div>
);

const CostEstimateSlide = () => (
  <div className="slide cost-estimate-slide">
    <h2>Cost Calculator</h2>
    <p>Interactive cost calculator will be implemented here</p>
  </div>
);

const ClosingSlide = ({ highlights }: { highlights: string[] }) => (
  <div className="slide closing-slide">
    <h2>Key Highlights</h2>
    <ul>
      {highlights.map((highlight, index) => (
        <li key={index}>{highlight}</li>
      ))}
    </ul>
  </div>
);

// Slide configuration as per requirements (exactly 5 slides)
export const slideConfigs: SlideConfig[] = [
  {
    id: 1,
    title: 'Opening Slide',
    component: OpeningSlide,
    props: {
      title: 'Facility Management Work Order Solution',
      presenter: 'Pre-Sales Team',
      date: new Date().toLocaleDateString(),
    },
  },
  {
    id: 2,
    title: 'Business Process Overview',
    component: BusinessProcessSlide,
  },
  {
    id: 3,
    title: 'Technical Architecture',
    component: TechnicalArchitectureSlide,
  },
  {
    id: 4,
    title: 'Implementation Plan',
    component: ImplementationPlanSlide,
  },
  {
    id: 5,
    title: 'Cost Estimate',
    component: CostEstimateSlide,
  },
];

// Complete presentation configuration
export const presentationConfig: PresentationConfig = {
  slides: slideConfigs,
  totalSlides: slideConfigs.length,
};