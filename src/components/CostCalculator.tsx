import React, { useState, useCallback, useMemo } from 'react';
import '../styles/CostCalculator.css';
import { 
  CostCalculationEngine} from '../utils/costCalculationEngine';
import CostVisualizationCharts from './CostVisualizationCharts';

interface CostCalculatorProps {
  monthlyCallVolume: number;
  onVolumeChange: (volume: number) => void;
  timelineMonths?: number;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  monthlyCallVolume,
  onVolumeChange,
  timelineMonths = 60
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate call volume input using the engine
  const validateCallVolume = useCallback((volume: number): boolean => {
    const validation = CostCalculationEngine.validateCallVolume(volume);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid call volume');
      return false;
    }
    setError(null);
    return true;
  }, []);

  // Handle slider input change
  const handleVolumeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value, 10);
    
    if (validateCallVolume(newVolume)) {
      setIsCalculating(true);
      // Simulate calculation delay for real-time feedback
      setTimeout(() => {
        onVolumeChange(newVolume);
        setIsCalculating(false);
      }, 100);
    }
  }, [onVolumeChange, validateCallVolume]);

  // Memoized cost breakdown for current call volume
  const currentCostBreakdown = useMemo(() => {
    return CostCalculationEngine.calculateMonthlyCosts(monthlyCallVolume);
  }, [monthlyCallVolume]);

  // Memoized 60-month projections
  const costProjections = useMemo(() => {
    return CostCalculationEngine.generateCostProjections(monthlyCallVolume, timelineMonths);
  }, [monthlyCallVolume, timelineMonths]);

  // Memoized cost summary
  const costSummary = useMemo(() => {
    return CostCalculationEngine.getCostSummary(costProjections);
  }, [costProjections]);

  // Memoized savings scenarios
  const savingsScenarios = useMemo(() => {
    return CostCalculationEngine.calculateSavingsScenarios(costProjections);
  }, [costProjections]);

  // Memoized cost trends for charts
  const costTrends = useMemo(() => {
    return CostCalculationEngine.analyzeCostTrends(costProjections);
  }, [costProjections]);

  return (
    <div className="cost-calculator">
      <div className="calculator-header">
        <h3>Interactive Cost Calculator</h3>
        <p>Adjust the slider to see real-time cost estimates for your call volume</p>
      </div>

      <div className="volume-input-section">
        <label htmlFor="call-volume-slider" className="slider-label">
          Monthly Call Volume: <span className="volume-value">{monthlyCallVolume.toLocaleString()}</span> calls
        </label>
        
        <div className="slider-container">
          <input
            id="call-volume-slider"
            type="range"
            min="100"
            max="10000"
            step="100"
            value={monthlyCallVolume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Monthly call volume"
          />
          <div className="slider-labels">
            <span>100</span>
            <span>5,000</span>
            <span>10,000</span>
          </div>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
      </div>

      <div className="cost-breakdown-section">
        <h4>Monthly Cost Breakdown</h4>
        
        {isCalculating ? (
          <div className="calculating-indicator loading-fade-in">
            <div className="loading-pulse">
              <span>Calculating...</span>
            </div>
          </div>
        ) : (
          <div className="cost-breakdown stagger-children">
            <div className="service-cost">
              <div className="service-header">
                <h5>Amazon Connect</h5>
                <span className="cost-amount">${currentCostBreakdown.amazonConnect.monthlyCost}</span>
              </div>
              <div className="service-details">
                <span>{currentCostBreakdown.amazonConnect.voiceMinutes.toLocaleString()} voice minutes</span>
                <span>{currentCostBreakdown.amazonConnect.chatMessages.toLocaleString()} chat messages</span>
              </div>
            </div>

            <div className="service-cost">
              <div className="service-header">
                <h5>Amazon Lex</h5>
                <span className="cost-amount">${currentCostBreakdown.amazonLex.monthlyCost}</span>
              </div>
              <div className="service-details">
                <span>{currentCostBreakdown.amazonLex.voiceRequests.toLocaleString()} voice requests</span>
                <span>{currentCostBreakdown.amazonLex.textRequests.toLocaleString()} text requests</span>
              </div>
            </div>

            <div className="service-cost">
              <div className="service-header">
                <h5>Amazon Bedrock</h5>
                <span className="cost-amount">${currentCostBreakdown.amazonBedrock.monthlyCost}</span>
              </div>
              <div className="service-details">
                <span>{currentCostBreakdown.amazonBedrock.knowledgeBaseQueries.toLocaleString()} KB queries</span>
                <span>{currentCostBreakdown.amazonBedrock.agentInvocations.toLocaleString()} agent invocations</span>
              </div>
            </div>

            <div className="total-cost">
              <div className="total-header">
                <h4>Total Monthly Cost</h4>
                <span className="total-amount">${currentCostBreakdown.totalMonthlyCost}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="projections-section">
        <h4>60-Month Cost Projections</h4>
        
        <div className="projection-summary">
          <div className="summary-card">
            <h5>First Year Total</h5>
            <span className="summary-value">${costSummary.firstYearTotal.toLocaleString()}</span>
          </div>
          
          <div className="summary-card">
            <h5>5-Year Total</h5>
            <span className="summary-value">${costSummary.fiveYearTotal.toLocaleString()}</span>
          </div>
          
          <div className="summary-card">
            <h5>Average Monthly (Year 1)</h5>
            <span className="summary-value">${costSummary.averageMonthlyFirst12.toLocaleString()}</span>
          </div>
          
          <div className="summary-card">
            <h5>Peak Monthly Cost</h5>
            <span className="summary-value">${costSummary.peakMonthlyCost.toLocaleString()}</span>
          </div>
        </div>

        <div className="savings-scenario">
          <h5>Optimization Potential</h5>
          <div className="savings-comparison">
            <div className="savings-item">
              <span className="savings-label">Standard Pricing:</span>
              <span className="savings-amount">${savingsScenarios.standard.toLocaleString()}</span>
            </div>
            <div className="savings-item optimized">
              <span className="savings-label">With Optimization:</span>
              <span className="savings-amount">${savingsScenarios.optimized.toLocaleString()}</span>
            </div>
            <div className="savings-item highlight">
              <span className="savings-label">Potential Savings:</span>
              <span className="savings-amount">${savingsScenarios.savings.toLocaleString()} ({savingsScenarios.savingsPercentage}%)</span>
            </div>
          </div>
          <p className="savings-note">
            *Optimization includes reserved capacity, volume discounts, and architectural improvements
          </p>
        </div>
      </div>

      <CostVisualizationCharts 
        projections={costProjections}
        trends={costTrends}
        timelineMonths={timelineMonths}
      />
    </div>
  );
};

export default CostCalculator;