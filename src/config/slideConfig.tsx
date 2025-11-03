import React, { ComponentType } from 'react';
import { OpeningSlide } from '../components/OpeningSlide.tsx';
import { BusinessProcessSlide } from '../components/BusinessProcessSlide.tsx';
import { TechnicalArchitectureSlide } from '../components/TechnicalArchitectureSlide.tsx';
import { ImplementationPlanSlide } from '../components/ImplementationPlanSlide.tsx';
import { ClosingSlide } from '../components/ClosingSlide.tsx';

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

// ClosingSlide is now imported from components

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
  {
    id: 6,
    title: 'Thank You',
    component: ClosingSlide,
    props: {
      highlights: [
        'AI-powered conversational interface reduces manual work order processing by 80%',
        'Seamless integration with existing CMMS systems and field service platforms',
        'Amazon Connect provides enterprise-grade voice and chat capabilities',
        'Amazon Lex enables natural language understanding for complex facility requests',
        'Amazon Bedrock delivers intelligent responses using your knowledge base',
        'Scalable architecture supports 100 to 10,000+ monthly calls',
        'Real-time cost optimization with transparent 60-month projections',
        'Enterprise-ready solution with built-in security and compliance'
      ],
    },
  },
];

// Complete presentation configuration
export const presentationConfig: PresentationConfig = {
  slides: slideConfigs,
  totalSlides: slideConfigs.length, // Now 6 slides total
};