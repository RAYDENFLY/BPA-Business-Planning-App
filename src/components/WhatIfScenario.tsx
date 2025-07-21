import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Play, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import { useBusinessStore } from '@/store/businessStore';

interface ScenarioForm {
  priceIncrease: number;
  costReduction: number;
  newEmployeeSalary: number;
  commissionChange: number;
}

interface ScenarioAnalysis {
  monthlyProjections: Array<{
    month: number;
    revenue: number;
    totalCosts: number;
    netProfit: number;
    cumulativeProfit: number;
  }>;
  breakEvenMonth: number | null;
  totalProfit12Months: number;
  roi: number;
  averageMonthlyRevenue: number;
  averageMonthlyCosts: number;
}

export default function WhatIfScenario() {
  const { currentPlan, getBusinessAnalysis } = useBusinessStore();
  const [scenarioResults, setScenarioResults] = useState<ScenarioAnalysis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<ScenarioForm>({
    defaultValues: {
      priceIncrease: 0,
      costReduction: 0,
      newEmployeeSalary: 0,
      commissionChange: 0,
    },
  });

  const baselineAnalysis = useMemo(() => getBusinessAnalysis(), [getBusinessAnalysis]);

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

  const calculateScenario = (data: ScenarioForm) => {
    if (!currentPlan || !baselineAnalysis) return null;

    setIsCalculating(true);

    // Create a modified version of the business plan for scenario calculation
    const modifiedPlan = {
      ...currentPlan,
      products: currentPlan.products.map(product => ({
        ...product,
        price: product.price * (1 + data.priceIncrease / 100),
      })),
      employees: [
        ...currentPlan.employees,
        ...(data.newEmployeeSalary > 0 ? [{
          id: 'scenario-employee',
          name: 'Karyawan Baru (Skenario)',
          role: 'Tambahan',
          paymentMode: 'fixed' as const,
          salary: data.newEmployeeSalary,
        }] : []),
      ].map(employee => ({
        ...employee,
        commission: employee.commission ? {
          ...employee.commission,
          value: employee.commission.type === 'percentage' 
            ? employee.commission.value + data.commissionChange
            : employee.commission.value,
        } : employee.commission,
      })),
      fixedCosts: currentPlan.fixedCosts.map(cost => ({
        ...cost,
        amount: cost.amount * (1 - data.costReduction / 100),
      })),
      variableCosts: currentPlan.variableCosts.map(cost => ({
        ...cost,
        value: cost.value * (1 - data.costReduction / 100),
      })),
    };

    // Calculate projections for the modified plan
    const { products, employees, fixedCosts, variableCosts, businessTarget } = modifiedPlan;
    const projections = [];
    let cumulativeProfit = 0;
    
    for (let month = 1; month <= businessTarget.projectionPeriod; month++) {
      // Calculate monthly revenue with price increase
      let monthlyRevenue = 0;
      products.forEach(product => {
        const growthFactor = Math.pow(1 + businessTarget.revenueGrowthPercent / 100, month - 1);
        const salesThisMonth = product.estimatedSalesPerMonth * growthFactor;
        monthlyRevenue += salesThisMonth * product.price;
      });
      
      // Calculate fixed costs with reduction
      const costGrowthFactor = Math.pow(1 + businessTarget.costGrowthPercent / 100, month - 1);
      let monthlyFixedCosts = 0;
      
      employees.forEach(employee => {
        if (employee.paymentMode === 'fixed' && employee.salary) {
          monthlyFixedCosts += employee.salary * costGrowthFactor;
        }
      });
      
      fixedCosts.forEach(cost => {
        monthlyFixedCosts += cost.amount * costGrowthFactor;
      });
      
      // Calculate variable costs with reduction
      let monthlyVariableCosts = 0;
      variableCosts.forEach(cost => {
        if (cost.type === 'percentage') {
          monthlyVariableCosts += (monthlyRevenue * cost.value) / 100;
        } else if (cost.type === 'fixed') {
          monthlyVariableCosts += cost.value;
        }
      });
      
      // Calculate commissions with changes
      let monthlyCommissions = 0;
      employees.forEach(employee => {
        if (employee.paymentMode === 'commission' && employee.commission) {
          if (employee.commission.type === 'percentage') {
            monthlyCommissions += (monthlyRevenue * employee.commission.value) / 100;
          } else {
            monthlyCommissions += employee.commission.value;
          }
        }
      });
      
      const totalCosts = monthlyFixedCosts + monthlyVariableCosts + monthlyCommissions;
      const netProfit = monthlyRevenue - totalCosts;
      cumulativeProfit += netProfit;
      
      projections.push({
        month,
        revenue: monthlyRevenue,
        totalCosts,
        netProfit,
        cumulativeProfit,
      });
    }

    const breakEvenMonth = projections.findIndex(p => p.cumulativeProfit > 0) + 1;
    const totalProfit12Months = projections[projections.length - 1]?.cumulativeProfit || 0;
    const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
    const totalCosts = projections.reduce((sum, p) => sum + p.totalCosts, 0);
    const roi = totalCosts > 0 ? (totalProfit12Months / totalCosts) * 100 : 0;

    const scenarioAnalysis = {
      monthlyProjections: projections,
      breakEvenMonth: breakEvenMonth > 0 ? breakEvenMonth : null,
      totalProfit12Months,
      roi,
      averageMonthlyRevenue: totalRevenue / projections.length,
      averageMonthlyCosts: totalCosts / projections.length,
    };

    setScenarioResults(scenarioAnalysis);
    setIsCalculating(false);
  };

  const onSubmit = (data: ScenarioForm) => {
    calculateScenario(data);
  };

  const resetScenario = () => {
    reset();
    setScenarioResults(null);
  };

  const getDifference = (baseline: number, scenario: number) => {
    const diff = scenario - baseline;
    const percentage = baseline !== 0 ? (diff / baseline) * 100 : 0;
    return { diff, percentage };
  };

  if (!currentPlan || !baselineAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Play className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-semibold text-gray-800">🧪 Skenario &quot;What If&quot;</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Data Belum Lengkap</h3>
          <p className="text-gray-500">
            Lengkapi data produk, karyawan, biaya, dan target terlebih dahulu untuk menjalankan analisis skenario.
          </p>
        </div>
      </div>
    );
  }

  const currentFormData = watch();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Play className="w-6 h-6 text-orange-600" />
        <h2 className="text-xl font-semibold text-gray-800">🧪 Skenario &quot;What If&quot;</h2>
      </div>

      {/* Scenario Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-medium text-green-800 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Strategi Peningkatan Revenue
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Naikkan Harga Produk (%)
                </label>
                <input
                  {...register('priceIncrease', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="10"
                />
                <p className="text-xs text-green-600 mt-1">
                  Contoh: 10% berarti harga naik 10%
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Naikkan Komisi Sales (%)
                </label>
                <input
                  {...register('commissionChange', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="5"
                />
                <p className="text-xs text-green-600 mt-1">
                  Untuk meningkatkan motivasi sales
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="font-medium text-red-800 mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Strategi Efisiensi Biaya
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">
                  Potong Biaya Operasional (%)
                </label>
                <input
                  {...register('costReduction', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  max="50"
                  className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="15"
                />
                <p className="text-xs text-red-600 mt-1">
                  Contoh: Kurangi biaya iklan, negosiasi supplier
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-red-700 mb-1">
                  Tambah Karyawan (Gaji Rp/bulan)
                </label>
                <input
                  {...register('newEmployeeSalary', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="5000000"
                />
                <p className="text-xs text-red-600 mt-1">
                  Biaya tambahan untuk ekspansi tim
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            type="submit"
            disabled={isCalculating}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isCalculating ? 'Menghitung...' : 'Jalankan Simulasi'}
          </button>
          <button
            type="button"
            onClick={resetScenario}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </form>

      {/* Scenario Summary */}
      {(currentFormData.priceIncrease !== 0 || currentFormData.costReduction !== 0 || 
        currentFormData.newEmployeeSalary !== 0 || currentFormData.commissionChange !== 0) && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2">📋 Ringkasan Skenario</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            {currentFormData.priceIncrease !== 0 && (
              <li>• Harga produk naik {currentFormData.priceIncrease}%</li>
            )}
            {currentFormData.costReduction !== 0 && (
              <li>• Biaya operasional turun {currentFormData.costReduction}%</li>
            )}
            {currentFormData.newEmployeeSalary !== 0 && (
              <li>• Tambah karyawan dengan gaji {formatCurrency(currentFormData.newEmployeeSalary)}/bulan</li>
            )}
            {currentFormData.commissionChange !== 0 && (
              <li>• Komisi sales naik {currentFormData.commissionChange}%</li>
            )}
          </ul>
        </div>
      )}

      {/* Results Comparison */}
      {scenarioResults && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-800 mb-6">📊 Perbandingan Hasil</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Profit Comparison */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Total Profit ({currentPlan.businessTarget.projectionPeriod} bulan)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Baseline:</span>
                  <span className="font-medium">{formatCurrencyShort(baselineAnalysis.totalProfit12Months)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Skenario:</span>
                  <span className="font-medium text-blue-600">{formatCurrencyShort(scenarioResults.totalProfit12Months)}</span>
                </div>
                <div className="border-t pt-2">
                  {(() => {
                    const { diff, percentage } = getDifference(baselineAnalysis.totalProfit12Months, scenarioResults.totalProfit12Months);
                    return (
                      <div className={`flex justify-between ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="text-sm">Selisih:</span>
                        <span className="font-medium">
                          {diff >= 0 ? '+' : ''}{formatCurrencyShort(diff)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Break Even Comparison */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Break Even Point</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Baseline:</span>
                  <span className="font-medium">{baselineAnalysis.breakEvenMonth ? `Bulan ${baselineAnalysis.breakEvenMonth}` : 'Belum BEP'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Skenario:</span>
                  <span className="font-medium text-blue-600">{scenarioResults.breakEvenMonth ? `Bulan ${scenarioResults.breakEvenMonth}` : 'Belum BEP'}</span>
                </div>
                <div className="border-t pt-2">
                  {(() => {
                    if (!baselineAnalysis.breakEvenMonth && !scenarioResults.breakEvenMonth) {
                      return <span className="text-sm text-gray-500">Sama-sama belum BEP</span>;
                    } else if (!baselineAnalysis.breakEvenMonth && scenarioResults.breakEvenMonth) {
                      return <span className="text-sm text-green-600">✓ Mencapai BEP!</span>;
                    } else if (baselineAnalysis.breakEvenMonth && !scenarioResults.breakEvenMonth) {
                      return <span className="text-sm text-red-600">✗ Tidak lagi BEP</span>;
                    } else {
                      const diff = scenarioResults.breakEvenMonth! - baselineAnalysis.breakEvenMonth!;
                      return (
                        <div className={`text-sm ${diff <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {diff <= 0 ? 'Lebih cepat' : 'Lebih lambat'} {Math.abs(diff)} bulan
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>

            {/* ROI Comparison */}
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-3">Return on Investment</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Baseline:</span>
                  <span className="font-medium">{baselineAnalysis.roi.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Skenario:</span>
                  <span className="font-medium text-blue-600">{scenarioResults.roi.toFixed(1)}%</span>
                </div>
                <div className="border-t pt-2">
                  {(() => {
                    const diff = scenarioResults.roi - baselineAnalysis.roi;
                    return (
                      <div className={`flex justify-between ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="text-sm">Selisih:</span>
                        <span className="font-medium">
                          {diff >= 0 ? '+' : ''}{diff.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">💡 Insights</h4>
            <div className="text-sm text-blue-700 space-y-1">
              {(() => {
                const profitDiff = scenarioResults.totalProfit12Months - baselineAnalysis.totalProfit12Months;
                const insights = [];
                
                if (profitDiff > 0) {
                  insights.push(`Skenario ini dapat meningkatkan profit sebesar ${formatCurrencyShort(profitDiff)}`);
                } else if (profitDiff < 0) {
                  insights.push(`Skenario ini akan menurunkan profit sebesar ${formatCurrencyShort(Math.abs(profitDiff))}`);
                }
                
                if (scenarioResults.breakEvenMonth && baselineAnalysis.breakEvenMonth) {
                  const bepDiff = scenarioResults.breakEvenMonth - baselineAnalysis.breakEvenMonth;
                  if (bepDiff < 0) {
                    insights.push(`Break even point lebih cepat ${Math.abs(bepDiff)} bulan`);
                  } else if (bepDiff > 0) {
                    insights.push(`Break even point lebih lambat ${bepDiff} bulan`);
                  }
                }
                
                if (currentFormData.priceIncrease > 0) {
                  insights.push('Kenaikan harga dapat meningkatkan margin profit per unit');
                }
                
                if (currentFormData.costReduction > 0) {
                  insights.push('Efisiensi biaya membantu meningkatkan profitabilitas');
                }

                return insights.map((insight, index) => (
                  <div key={index}>• {insight}</div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
