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
import { BarChart3, TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';
import { useBusinessStore } from '@/store/businessStore';

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

export default function AnalysisCharts() {
  const { getBusinessAnalysis } = useBusinessStore();
  
  const analysis = useMemo(() => getBusinessAnalysis(), [getBusinessAnalysis]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}jt`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)}rb`;
    }
    return formatCurrency(amount);
  };

  if (!analysis || analysis.monthlyProjections.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">📊 Analisis & Simulasi</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Belum Ada Data untuk Dianalisis</h3>
          <p className="text-gray-500">
            Silakan lengkapi data produk, karyawan, biaya, dan target terlebih dahulu
            untuk melihat analisis dan proyeksi bisnis.
          </p>
        </div>
      </div>
    );
  }

  const { monthlyProjections, breakEvenMonth, totalProfit12Months, roi } = analysis;

  // Prepare chart data
  const months = monthlyProjections.map((_, index) => `Bulan ${index + 1}`);
  const revenueData = monthlyProjections.map(p => p.revenue);
  const costsData = monthlyProjections.map(p => p.totalCosts);
  const profitData = monthlyProjections.map(p => p.netProfit);
  const cumulativeProfitData = monthlyProjections.map(p => p.cumulativeProfit);

  // Line Chart Configuration
  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: 'Revenue',
        data: revenueData,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Total Biaya',
        data: costsData,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Profit Bersih',
        data: profitData,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Bar Chart Configuration  
  const barChartData = {
    labels: months.slice(0, 12), // Show only first 12 months
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.slice(0, 12),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
      {
        label: 'Total Biaya',
        data: costsData.slice(0, 12),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: 'Profit Bersih',
        data: profitData.slice(0, 12),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  // Cumulative Profit Chart
  const cumulativeChartData = {
    labels: months,
    datasets: [
      {
        label: 'Akumulasi Profit',
        data: cumulativeProfitData,
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function(context: any) {
            return `${context.dataset.label}: ${formatCurrencyShort(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function(value: any) {
            return formatCurrencyShort(value);
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">📊 Analisis & Simulasi</h2>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Total Profit</span>
          </div>
          <div className="text-2xl font-bold text-green-800">
            {formatCurrencyShort(totalProfit12Months)}
          </div>
          <div className="text-xs text-green-600 mt-1">
            Akumulasi {monthlyProjections.length} bulan
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Break Even</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {breakEvenMonth ? `Bulan ${breakEvenMonth}` : 'Belum BEP'}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            {breakEvenMonth ? 'Balik modal' : 'Perlu optimasi'}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">ROI</span>
          </div>
          <div className="text-2xl font-bold text-purple-800">
            {roi.toFixed(1)}%
          </div>
          <div className="text-xs text-purple-600 mt-1">
            Return on Investment
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Rata-rata Revenue</span>
          </div>
          <div className="text-2xl font-bold text-orange-800">
            {formatCurrencyShort(analysis.averageMonthlyRevenue)}
          </div>
          <div className="text-xs text-orange-600 mt-1">
            Per bulan
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Revenue vs Cost vs Profit Line Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">📈 Proyeksi Revenue vs Biaya vs Profit</h3>
          <div className="h-80">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Monthly Comparison Bar Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">📊 Perbandingan Bulanan (12 Bulan Pertama)</h3>
          <div className="h-80">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Cumulative Profit Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">💰 Akumulasi Profit</h3>
          <div className="h-80">
            <Line data={cumulativeChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">📋 Tabel Detail Proyeksi</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bulan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Biaya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profit Bersih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akumulasi Profit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyProjections.slice(0, 12).map((projection, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrencyShort(projection.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrencyShort(projection.totalCosts)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    projection.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrencyShort(projection.netProfit)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    projection.cumulativeProfit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrencyShort(projection.cumulativeProfit)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
