import React, { ComponentType } from 'react';
import { OpeningSlide } from '../components/OpeningSlide.tsx';
import { BusinessProcessSlide } from '../components/BusinessProcessSlide.tsx';
import { TechnicalArchitectureSlide } from '../components/TechnicalArchitectureSlide.tsx';
import { ImplementationPlanSlide } from '../components/ImplementationPlanSlide.tsx';

interface SlideConfig {
  id: number;
  title: string;
  component: ComponentType<any>;
  props?: Record<string, any>;
}

interface PresentationConfig {
  slides: SlideConfig[];
  totalSlides: number;
}

// Placeholder slide components (will be implemented in later tasks)

// BusinessProcessSlide is now imported from components

// TechnicalArchitectureSlide is now imported from components

// ImplementationPlanSlide is now imported from components

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