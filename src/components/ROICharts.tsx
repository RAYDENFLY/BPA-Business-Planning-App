'use client';

import React from 'react';
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
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ROIResults {
  monthlyGrossProfit: number;
  monthlyNetProfit: number;
  monthlyNetProfitAfterTax: number;
  yearlyGrossProfit: number;
  yearlyNetProfit: number;
  yearlyNetProfitAfterTax: number;
  annualROI: number;
  totalReturnAfterYears: number;
  breakEvenMonths: number;
  paybackPeriodRounded: number;
  totalInvestment: number;
  totalProfit: number;
  yearlyRevenue: number;
  inflationAdjustedProfit: number;
  averageROIWithInflation: number;
  yearlyBreakdown: Array<{
    year: number;
    yearlyProfit: number;
    cumulativeProfit: number;
    adjustedForInflation: number;
  }>;
}

interface ROIData {
  initialInvestment: number;
  projectDuration: number;
  inflationRate: number;
  ownershipPercentage: number;
}

interface ChartComponentsProps {
  results: ROIResults;
  data: ROIData;
}

export function ROILineChart({ results }: ChartComponentsProps) {
  const chartData = {
    labels: results.yearlyBreakdown.map(item => `Tahun ${item.year}`),
    datasets: [
      {
        label: 'Profit Nominal (Rp)',
        data: results.yearlyBreakdown.map(item => item.yearlyProfit),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Profit Riil (dengan Inflasi)',
        data: results.yearlyBreakdown.map(item => item.adjustedForInflation),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Kumulatif',
        data: results.yearlyBreakdown.map(item => item.cumulativeProfit),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Proyeksi Profit Multi-Tahun',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            return new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(Number(value));
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

export function ROIBarChart({ results, data }: ChartComponentsProps) {
  const chartData = {
    labels: ['Modal Awal', 'Revenue/Tahun', 'Profit/Tahun', 'Total Return'],
    datasets: [
      {
        label: 'Nilai (Rp)',
        data: [
          data.initialInvestment,
          results.yearlyRevenue,
          results.yearlyNetProfitAfterTax * (data.ownershipPercentage / 100),
          results.totalReturnAfterYears
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(147, 51, 234, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Analisis Finansial Utama',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: number | string) {
            return new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(Number(value));
          }
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}

export function ROIPieChart({ results, data }: ChartComponentsProps) {
  const totalCosts = data.initialInvestment;
  const totalReturns = results.totalReturnAfterYears;
  const netProfit = totalReturns - totalCosts;

  const chartData = {
    labels: ['Modal Awal', 'Net Profit', 'Sisa'],
    datasets: [
      {
        data: [totalCosts, netProfit, Math.max(0, totalCosts - netProfit)],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Distribusi Investasi vs Return',
      },
    },
  };

  return <Pie data={chartData} options={options} />;
}

export function BreakdownChart({ results }: { results: ROIResults }) {
  const chartData = {
    labels: results.yearlyBreakdown.map(item => `Tahun ${item.year}`),
    datasets: [
      {
        label: 'ROI Kumulatif (%)',
        data: results.yearlyBreakdown.map(item => 
          (item.cumulativeProfit / results.totalInvestment) * 100
        ),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'ROI Kumulatif per Tahun'
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Periode'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'ROI (%)'
        },
      }
    },
  };

  return <Line data={chartData} options={options} />;
}
