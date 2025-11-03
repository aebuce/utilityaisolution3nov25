// Cost Calculation Engine for Facility Management Solution
// Implements detailed AWS service pricing models and 60-month projections

export interface CostBreakdown {
  amazonConnect: {
    voiceMinutes: number;
    chatMessages: number;
    monthlyCost: number;
  };
  amazonLex: {
    textRequests: number;
    voiceRequests: number;
    monthlyCost: number;
  };
  amazonBedrock: {
    knowledgeBaseQueries: number;
    agentInvocations: number;
    monthlyCost: number;
  };
  totalMonthlyCost: number;
}

export interface CostProjection {
  month: number;
  callVolume: number;
  costs: CostBreakdown;
  cumulativeCost: number;
}

export interface CostTrend {
  service: string;
  monthlyData: Array<{
    month: number;
    cost: number;
    volume: number;
  }>;
  totalCost: number;
  averageMonthlyCost: number;
}

// AWS Service Pricing Constants (based on US East region)
const AWS_PRICING = {
  amazonConnect: {
    voicePerMinute: 0.018, // $0.018 per minute for voice
    chatPerMessage: 0.004, // $0.004 per chat message
    setupFee: 0, // No setup fee for Amazon Connect
  },
  amazonLex: {
    voiceRequestPrice: 0.004, // $0.004 per voice request
    textRequestPrice: 0.00075, // $0.00075 per text request
    freeTextRequests: 10000, // 10,000 free text requests per month
    freeVoiceRequests: 1000, // 1,000 free voice requests per month
  },
  amazonBedrock: {
    knowledgeBaseQueryPrice: 0.0004, // $0.0004 per knowledge base query
    agentInvocationPrice: 0.002, // $0.002 per agent invocation
    foundationModelInputTokens: 0.0008, // $0.0008 per 1K input tokens (Claude 3.5 Haiku)
    foundationModelOutputTokens: 0.0016, // $0.0016 per 1K output tokens (Claude 3.5 Haiku)
  }
};

// Business Logic Constants
const BUSINESS_ASSUMPTIONS = {
  avgCallDurationMinutes: 3.5, // Average call duration
  chatToVoiceRatio: 0.3, // 30% chat, 70% voice
  avgMessagesPerChat: 5, // Average messages per chat session
  avgTextInteractionsPerChat: 3, // Average text interactions per chat
  knowledgeBaseQueryRate: 0.6, // 60% of calls query knowledge base
  agentInvocationRate: 0.8, // 80% of calls use Bedrock agents
  avgTokensPerQuery: 500, // Average tokens per knowledge base query
  avgTokensPerResponse: 300, // Average tokens per agent response
  monthlyGrowthRate: 0.02, // 2% monthly growth in call volume
  seasonalityFactor: {
    // Seasonal multipliers by month (1-12)
    1: 1.1, 2: 0.9, 3: 1.0, 4: 1.0, 5: 1.1, 6: 1.2,
    7: 1.3, 8: 1.2, 9: 1.0, 10: 1.0, 11: 1.1, 12: 1.2
  }
};

export class CostCalculationEngine {
  /**
   * Calculate detailed cost breakdown for a given monthly call volume
   */
  static calculateMonthlyCosts(callVolume: number): CostBreakdown {
    // Amazon Connect costs
    const voiceMinutes = callVolume * (1 - BUSINESS_ASSUMPTIONS.chatToVoiceRatio) * BUSINESS_ASSUMPTIONS.avgCallDurationMinutes;
    const chatMessages = callVolume * BUSINESS_ASSUMPTIONS.chatToVoiceRatio * BUSINESS_ASSUMPTIONS.avgMessagesPerChat;
    
    const connectCost = (voiceMinutes * AWS_PRICING.amazonConnect.voicePerMinute) + 
                       (chatMessages * AWS_PRICING.amazonConnect.chatPerMessage);

    // Amazon Lex costs (with free tier consideration)
    const voiceRequests = callVolume * (1 - BUSINESS_ASSUMPTIONS.chatToVoiceRatio);
    const textRequests = callVolume * BUSINESS_ASSUMPTIONS.chatToVoiceRatio * BUSINESS_ASSUMPTIONS.avgTextInteractionsPerChat;
    
    const billableVoiceRequests = Math.max(0, voiceRequests - AWS_PRICING.amazonLex.freeVoiceRequests);
    const billableTextRequests = Math.max(0, textRequests - AWS_PRICING.amazonLex.freeTextRequests);
    
    const lexCost = (billableVoiceRequests * AWS_PRICING.amazonLex.voiceRequestPrice) + 
                    (billableTextRequests * AWS_PRICING.amazonLex.textRequestPrice);

    // Amazon Bedrock costs
    const knowledgeBaseQueries = callVolume * BUSINESS_ASSUMPTIONS.knowledgeBaseQueryRate;
    const agentInvocations = callVolume * BUSINESS_ASSUMPTIONS.agentInvocationRate;
    
    // Token-based pricing for foundation models
    const inputTokens = (knowledgeBaseQueries + agentInvocations) * BUSINESS_ASSUMPTIONS.avgTokensPerQuery;
    const outputTokens = (knowledgeBaseQueries + agentInvocations) * BUSINESS_ASSUMPTIONS.avgTokensPerResponse;
    
    const foundationModelCost = (inputTokens / 1000 * AWS_PRICING.amazonBedrock.foundationModelInputTokens) +
                               (outputTokens / 1000 * AWS_PRICING.amazonBedrock.foundationModelOutputTokens);
    
    const bedrockServiceCost = (knowledgeBaseQueries * AWS_PRICING.amazonBedrock.knowledgeBaseQueryPrice) +
                              (agentInvocations * AWS_PRICING.amazonBedrock.agentInvocationPrice);
    
    const totalBedrockCost = foundationModelCost + bedrockServiceCost;

    return {
      amazonConnect: {
        voiceMinutes: Math.round(voiceMinutes),
        chatMessages: Math.round(chatMessages),
        monthlyCost: Math.round(connectCost * 100) / 100
      },
      amazonLex: {
        textRequests: Math.round(textRequests),
        voiceRequests: Math.round(voiceRequests),
        monthlyCost: Math.round(lexCost * 100) / 100
      },
      amazonBedrock: {
        knowledgeBaseQueries: Math.round(knowledgeBaseQueries),
        agentInvocations: Math.round(agentInvocations),
        monthlyCost: Math.round(totalBedrockCost * 100) / 100
      },
      totalMonthlyCost: Math.round((connectCost + lexCost + totalBedrockCost) * 100) / 100
    };
  }

  /**
   * Generate 60-month cost projections with growth and seasonality
   */
  static generateCostProjections(initialCallVolume: number, timelineMonths: number = 60): CostProjection[] {
    const projections: CostProjection[] = [];
    let cumulativeCost = 0;

    for (let month = 1; month <= timelineMonths; month++) {
      // Apply growth rate
      const growthMultiplier = Math.pow(1 + BUSINESS_ASSUMPTIONS.monthlyGrowthRate, month - 1);
      
      // Apply seasonal factor
      const seasonalMonth = ((month - 1) % 12) + 1;
      const seasonalMultiplier = BUSINESS_ASSUMPTIONS.seasonalityFactor[seasonalMonth as keyof typeof BUSINESS_ASSUMPTIONS.seasonalityFactor];
      
      const adjustedCallVolume = Math.round(initialCallVolume * growthMultiplier * seasonalMultiplier);
      const costs = this.calculateMonthlyCosts(adjustedCallVolume);
      
      cumulativeCost += costs.totalMonthlyCost;

      projections.push({
        month,
        callVolume: adjustedCallVolume,
        costs,
        cumulativeCost: Math.round(cumulativeCost * 100) / 100
      });
    }

    return projections;
  }

  /**
   * Analyze cost trends by service over the projection period
   */
  static analyzeCostTrends(projections: CostProjection[]): CostTrend[] {
    const services = ['amazonConnect', 'amazonLex', 'amazonBedrock'] as const;
    
    return services.map(service => {
      const monthlyData = projections.map(projection => ({
        month: projection.month,
        cost: projection.costs[service].monthlyCost,
        volume: service === 'amazonConnect' 
          ? projection.costs[service].voiceMinutes + projection.costs[service].chatMessages
          : service === 'amazonLex'
          ? projection.costs[service].textRequests + projection.costs[service].voiceRequests
          : projection.costs[service].knowledgeBaseQueries + projection.costs[service].agentInvocations
      }));

      const totalCost = monthlyData.reduce((sum, data) => sum + data.cost, 0);
      const averageMonthlyCost = totalCost / monthlyData.length;

      return {
        service: service === 'amazonConnect' ? 'Amazon Connect' 
               : service === 'amazonLex' ? 'Amazon Lex' 
               : 'Amazon Bedrock',
        monthlyData,
        totalCost: Math.round(totalCost * 100) / 100,
        averageMonthlyCost: Math.round(averageMonthlyCost * 100) / 100
      };
    });
  }

  /**
   * Calculate cost savings scenarios (e.g., reserved instances, volume discounts)
   */
  static calculateSavingsScenarios(projections: CostProjection[]): {
    standard: number;
    optimized: number;
    savings: number;
    savingsPercentage: number;
  } {
    const standardTotal = projections.reduce((sum, p) => sum + p.costs.totalMonthlyCost, 0);
    
    // Simulate 15% savings with reserved capacity and volume discounts
    const optimizedTotal = standardTotal * 0.85;
    const savings = standardTotal - optimizedTotal;
    const savingsPercentage = (savings / standardTotal) * 100;

    return {
      standard: Math.round(standardTotal * 100) / 100,
      optimized: Math.round(optimizedTotal * 100) / 100,
      savings: Math.round(savings * 100) / 100,
      savingsPercentage: Math.round(savingsPercentage * 100) / 100
    };
  }

  /**
   * Validate call volume input
   */
  static validateCallVolume(volume: number): { isValid: boolean; error?: string } {
    if (typeof volume !== 'number' || isNaN(volume)) {
      return { isValid: false, error: 'Call volume must be a valid number' };
    }
    
    if (volume < 100) {
      return { isValid: false, error: 'Minimum call volume is 100 calls per month' };
    }
    
    if (volume > 10000) {
      return { isValid: false, error: 'Maximum call volume is 10,000 calls per month' };
    }
    
    return { isValid: true };
  }

  /**
   * Get cost breakdown summary for display
   */
  static getCostSummary(projections: CostProjection[]): {
    firstYearTotal: number;
    fiveYearTotal: number;
    averageMonthlyFirst12: number;
    averageMonthlyTotal: number;
    peakMonthlyCost: number;
    lowestMonthlyCost: number;
  } {
    const firstYearProjections = projections.slice(0, 12);
    const firstYearTotal = firstYearProjections.reduce((sum, p) => sum + p.costs.totalMonthlyCost, 0);
    const fiveYearTotal = projections.reduce((sum, p) => sum + p.costs.totalMonthlyCost, 0);
    
    const monthlyCosts = projections.map(p => p.costs.totalMonthlyCost);
    const peakMonthlyCost = Math.max(...monthlyCosts);
    const lowestMonthlyCost = Math.min(...monthlyCosts);
    
    return {
      firstYearTotal: Math.round(firstYearTotal * 100) / 100,
      fiveYearTotal: Math.round(fiveYearTotal * 100) / 100,
      averageMonthlyFirst12: Math.round((firstYearTotal / 12) * 100) / 100,
      averageMonthlyTotal: Math.round((fiveYearTotal / projections.length) * 100) / 100,
      peakMonthlyCost: Math.round(peakMonthlyCost * 100) / 100,
      lowestMonthlyCost: Math.round(lowestMonthlyCost * 100) / 100
    };
  }
}