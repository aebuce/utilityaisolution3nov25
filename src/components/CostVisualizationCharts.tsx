import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import type { CostProjection, CostTrend } from '../utils/costCalculationEngine';
import '../styles/CostVisualizationCharts.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CostVisualizationChartsProps {
  projections: CostProjection[];
  trends: CostTrend[];
  timelineMonths?: number;
}

export const CostVisualizationCharts: React.FC<CostVisualizationChartsProps> = ({
  projections,
  trends,
  timelineMonths = 60
}) => {
  // Prepare data for monthly cost trend line chart
  const monthlyCostData = useMemo(() => {
    const labels = projections.map(p => `Month ${p.month}`);
    const totalCosts = projections.map(p => p.costs.totalMonthlyCost);
    const connectCosts = projections.map(p => p.costs.amazonConnect.monthlyCost);
    const lexCosts = projections.map(p => p.costs.amazonLex.monthlyCost);
    const bedrockCosts = projections.map(p => p.costs.amazonBedrock.monthlyCost);

    return {
      labels,
      datasets: [
        {
          label: 'Total Monthly Cost',
          data: totalCosts,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 6,
        },
        {
          label: 'Amazon Connect',
          data: connectCosts,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 1,
          pointHoverRadius: 4,
        },
        {
          label: 'Amazon Lex',
          data: lexCosts,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 1,
          pointHoverRadius: 4,
        },
        {
          label: 'Amazon Bedrock',
          data: bedrockCosts,
          borderColor: 'rgb(255, 206, 86)',
          backgroundColor: 'rgba(255, 206, 86, 0.1)',
          fill: false,
          tension: 0.4,
          pointRadius: 1,
          pointHoverRadius: 4,
        },
      ],
    };
  }, [projections]);

  // Prepare data for cumulative cost chart
  const cumulativeCostData = useMemo(() => {
    const labels = projections.map(p => `Month ${p.month}`);
    const cumulativeCosts = projections.map(p => p.cumulativeCost);

    return {
      labels,
      datasets: [
        {
          label: 'Cumulative Cost',
          data: cumulativeCosts,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [projections]);

  // Prepare data for service breakdown bar chart (yearly totals)
  const yearlyBreakdownData = useMemo(() => {
    const years = Math.ceil(timelineMonths / 12);
    const yearLabels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);
    
    const connectYearlyTotals = [];
    const lexYearlyTotals = [];
    const bedrockYearlyTotals = [];

    for (let year = 0; year < years; year++) {
      const startMonth = year * 12;
      const endMonth = Math.min((year + 1) * 12, projections.length);
      const yearProjections = projections.slice(startMonth, endMonth);

      connectYearlyTotals.push(
        yearProjections.reduce((sum, p) => sum + p.costs.amazonConnect.monthlyCost, 0)
      );
      lexYearlyTotals.push(
        yearProjections.reduce((sum, p) => sum + p.costs.amazonLex.monthlyCost, 0)
      );
      bedrockYearlyTotals.push(
        yearProjections.reduce((sum, p) => sum + p.costs.amazonBedrock.monthlyCost, 0)
      );
    }

    return {
      labels: yearLabels,
      datasets: [
        {
          label: 'Amazon Connect',
          data: connectYearlyTotals,
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
        },
        {
          label: 'Amazon Lex',
          data: lexYearlyTotals,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        },
        {
          label: 'Amazon Bedrock',
          data: bedrockYearlyTotals,
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          borderColor: 'rgb(255, 206, 86)',
          borderWidth: 1,
        },
      ],
    };
  }, [projections, timelineMonths]);

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Cost Trends Over Time',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    hover: {
      mode: 'nearest' as const,
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Timeline',
        },
        ticks: {
          maxTicksLimit: 12, // Show max 12 labels to avoid crowding
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Cost ($)',
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
  };

  const cumulativeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cumulative Cost Growth',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Total Cost: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Timeline',
        },
        ticks: {
          maxTicksLimit: 12,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Cumulative Cost ($)',
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Annual Cost Breakdown by Service',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Annual Cost ($)',
        },
        stacked: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          }
        }
      },
    },
  };

  return (
    <div className="cost-visualization-charts">
      <div className="charts-header">
        <h4>Cost Analysis & Projections</h4>
        <p>Interactive charts showing cost trends and breakdowns over {timelineMonths} months</p>
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-wrapper">
            <Line data={monthlyCostData} options={lineChartOptions} />
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-wrapper">
            <Line data={cumulativeCostData} options={cumulativeChartOptions} />
          </div>
        </div>

        <div className="chart-container full-width">
          <div className="chart-wrapper">
            <Bar data={yearlyBreakdownData} options={barChartOptions} />
          </div>
        </div>
      </div>

      <div className="chart-insights">
        <h5>Key Insights</h5>
        <div className="insights-grid">
          <div className="insight-card">
            <h6>Growth Pattern</h6>
            <p>Monthly costs increase by ~2% due to call volume growth and seasonal variations</p>
          </div>
          <div className="insight-card">
            <h6>Service Distribution</h6>
            <p>Amazon Connect typically represents 60-70% of total costs due to voice/chat usage</p>
          </div>
          <div className="insight-card">
            <h6>Optimization Opportunity</h6>
            <p>Reserved capacity and volume discounts can reduce costs by up to 15%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostVisualizationCharts;