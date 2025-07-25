'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  X, Calculator, TrendingUp, DollarSign, 
  Building2, Plus, Minus, BarChart3, 
  Download, Save, Target, AlertCircle, Info
} from 'lucide-react';

interface Outlet {
  id: string;
  name: string;
  dailyRevenue: number;
  operatingDays: number;
}

interface ROIData {
  initialInvestment: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  monthlyOperatingCost: number;
  netProfitMargin: number;
  projectDuration: number;
  ownershipPercentage: number;
  useOutletMode: boolean;
  outlets: Outlet[];
  scenario: 'optimistic' | 'realistic' | 'pessimistic';
  taxRate: number;
  inflationRate: number;
}

interface ROIResults {
  monthlyGrossProfit: number;
  monthlyNetProfit: number;
  yearlyGrossProfit: number;
  yearlyNetProfit: number;
  annualROI: number;
  totalReturnAfterYears: number;
  breakEvenMonths: number;
  totalInvestment: number;
  totalProfit: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ROISimulator({ isOpen, onClose }: Props) {
  const [data, setData] = useState<ROIData>({
    initialInvestment: 18000000000, // 18 miliar
    monthlyRevenue: 500000000, // 500 juta
    yearlyRevenue: 6000000000, // 6 miliar
    monthlyOperatingCost: 300000000, // 300 juta
    netProfitMargin: 0,
    projectDuration: 5,
    ownershipPercentage: 100,
    useOutletMode: false,
    outlets: [],
    scenario: 'realistic',
    taxRate: 10,
    inflationRate: 3
  });

  const [results, setResults] = useState<ROIResults | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'charts'>('input');

  const calculateROI = useCallback(() => {
    let monthlyRevenue = data.monthlyRevenue;
    
    // Calculate from outlets if outlet mode is enabled
    if (data.useOutletMode && data.outlets.length > 0) {
      monthlyRevenue = data.outlets.reduce((total, outlet) => {
        return total + (outlet.dailyRevenue * outlet.operatingDays);
      }, 0);
    }

    // Remove unused variable
    const monthlyGrossProfit = monthlyRevenue - data.monthlyOperatingCost;
    const monthlyNetProfit = monthlyGrossProfit * (data.netProfitMargin / 100);
    const yearlyGrossProfit = monthlyGrossProfit * 12;
    const yearlyNetProfit = monthlyNetProfit * 12;

    // Apply tax
    const yearlyNetProfitAfterTax = yearlyNetProfit * (1 - data.taxRate / 100);
    
    // Apply ownership percentage
    const ownerYearlyProfit = yearlyNetProfitAfterTax * (data.ownershipPercentage / 100);
    
    // Calculate ROI
    const annualROI = (ownerYearlyProfit / data.initialInvestment) * 100;
    
    // Calculate total return after project duration
    const totalReturnAfterYears = ownerYearlyProfit * data.projectDuration;
    
    // Calculate break-even point
    const breakEvenMonths = data.initialInvestment / (monthlyNetProfit * (data.ownershipPercentage / 100));

    const calculatedResults: ROIResults = {
      monthlyGrossProfit,
      monthlyNetProfit: monthlyNetProfit * (data.ownershipPercentage / 100),
      yearlyGrossProfit,
      yearlyNetProfit: ownerYearlyProfit,
      annualROI,
      totalReturnAfterYears,
      breakEvenMonths,
      totalInvestment: data.initialInvestment,
      totalProfit: totalReturnAfterYears
    };

    setResults(calculatedResults);
  }, [data]);

  useEffect(() => {
    calculateROI();
  }, [data, calculateROI]);

  const addOutlet = () => {
    const newOutlet: Outlet = {
      id: Date.now().toString(),
      name: `Outlet ${data.outlets.length + 1}`,
      dailyRevenue: 1000000,
      operatingDays: 30
    };
    setData(prev => ({
      ...prev,
      outlets: [...prev.outlets, newOutlet]
    }));
  };

  const removeOutlet = (id: string) => {
    setData(prev => ({
      ...prev,
      outlets: prev.outlets.filter(outlet => outlet.id !== id)
    }));
  };

  const updateOutlet = (id: string, field: keyof Outlet, value: string | number) => {
    setData(prev => ({
      ...prev,
      outlets: prev.outlets.map(outlet =>
        outlet.id === id ? { ...outlet, [field]: value } : outlet
      )
    }));
  };

  const formatCurrency = (amount: number) => {
    // Format with Indonesian locale for proper thousand separators
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function for displaying large numbers in a more readable format
  const formatCurrencyDisplay = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)} Miliar`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(0)} Juta`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)} Ribu`;
    } else {
      return formatCurrency(amount);
    }
  };

  // Helper function to format number with thousand separators for input display
  const formatNumberWithSeparators = (value: number) => {
    if (!value || value === 0) return '';
    return value.toLocaleString('id-ID').replace(/,/g, '.');
  };

  // Helper function to parse formatted input back to number
  const parseFormattedNumber = (value: string) => {
    // Allow only numbers and dots
    const cleanValue = value.replace(/[^\d.]/g, '');
    // Remove all dots and convert to number
    const numericValue = cleanValue.replace(/\./g, '');
    return parseInt(numericValue) || 0;
  };

  // Helper function to handle input formatting on change
  const handleFormattedInput = (value: string) => {
    // Remove all non-numeric characters except dots
    const cleanValue = value.replace(/[^\d]/g, '');
    const numericValue = parseInt(cleanValue) || 0;
    return numericValue;
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">ROI & Profitabilitas Bisnis</h2>
                <p className="text-green-100">Simulasi cepat dan interaktif untuk analisis kelayakan investasi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-6">
            {[
              { id: 'input', label: 'Input Data', icon: DollarSign },
              { id: 'results', label: 'Hasil Simulasi', icon: TrendingUp },
              { id: 'charts', label: 'Visualisasi', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'input' | 'results' | 'charts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-white text-green-600 font-medium' 
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Input Tab */}
          {activeTab === 'input' && (
            <div className="space-y-8">
              {/* Mode Selection */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  🎯 Tujuan Simulasi
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  Analisis ROI untuk Owner, Investor, atau Co-owner dari sudut pandang kepemilikan saham/bagi hasil
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 100, label: 'Owner (100%)', desc: 'Pemilik bisnis penuh', color: 'green' },
                    { value: 51, label: 'Investor (51%)', desc: 'Pemilik mayoritas', color: 'blue' },
                    { value: 30, label: 'Co-owner (30%)', desc: 'Bagi hasil/saham', color: 'purple' }
                  ].map(mode => (
                    <button
                      key={mode.value}
                      onClick={() => setData(prev => ({ ...prev, ownershipPercentage: mode.value }))}
                      className={`p-3 rounded-lg border-2 transition-colors text-left ${
                        data.ownershipPercentage === mode.value
                          ? `border-${mode.color}-500 bg-${mode.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-800">{mode.label}</div>
                      <div className="text-sm text-gray-600">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Financial Input */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  🧮 Input Keuangan Dasar
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modal Awal Investasi (IDR)
                    </label>
                    <input
                      type="text"
                      value={data.initialInvestment ? formatNumberWithSeparators(data.initialInvestment) : ''}
                      onChange={(e) => {
                        const value = handleFormattedInput(e.target.value);
                        setData(prev => ({ ...prev, initialInvestment: value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      placeholder="18.000.000.000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Total modal CAPEX awal (Rp.{formatNumberWithSeparators(data.initialInvestment)})</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Omzet Bulanan (IDR)
                    </label>
                    <input
                      type="text"
                      value={data.monthlyRevenue ? formatNumberWithSeparators(data.monthlyRevenue) : ''}
                      onChange={(e) => {
                        const value = handleFormattedInput(e.target.value);
                        setData(prev => ({ ...prev, monthlyRevenue: value }));
                      }}
                      disabled={data.useOutletMode}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 ${
                        data.useOutletMode ? 'bg-gray-100' : ''
                      }`}
                      placeholder="500.000.000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {data.useOutletMode 
                        ? `Auto: Rp.${formatNumberWithSeparators(data.outlets.reduce((total, outlet) => total + (outlet.dailyRevenue * outlet.operatingDays), 0))}`
                        : `Total omzet per bulan (Rp.${formatNumberWithSeparators(data.monthlyRevenue)})`
                      }
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biaya Operasional Bulanan (IDR)
                    </label>
                    <input
                      type="text"
                      value={data.monthlyOperatingCost ? formatNumberWithSeparators(data.monthlyOperatingCost) : ''}
                      onChange={(e) => {
                        const value = handleFormattedInput(e.target.value);
                        setData(prev => ({ ...prev, monthlyOperatingCost: value }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      placeholder="300.000.000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Gaji, bahan, listrik, entertainment, dll (Rp.{formatNumberWithSeparators(data.monthlyOperatingCost)})</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margin Laba Bersih (%)
                    </label>
                    <input
                      type="number"
                      value={data.netProfitMargin}
                      onChange={(e) => setData(prev => ({ ...prev, netProfitMargin: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      placeholder="20"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Kosongkan (0) untuk auto-calc dari omzet & biaya</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durasi Proyek (Tahun)
                    </label>
                    <input
                      type="number"
                      value={data.projectDuration}
                      onChange={(e) => setData(prev => ({ ...prev, projectDuration: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      placeholder="3"
                      min="1"
                      max="20"
                    />
                    <p className="text-xs text-gray-500 mt-1">Jangka waktu proyeksi bisnis</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Persentase Kepemilikan (%)
                    </label>
                    <input
                      type="number"
                      value={data.ownershipPercentage}
                      onChange={(e) => setData(prev => ({ ...prev, ownershipPercentage: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      placeholder="100"
                      min="1"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">100% (owner) atau 51% (investor mayoritas)</p>
                  </div>
                </div>
              </div>

              {/* Outlet Mode */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    🏢 Mode Outlet (Opsional)
                  </h3>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={data.useOutletMode}
                      onChange={(e) => setData(prev => ({ ...prev, useOutletMode: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Gunakan pendapatan per outlet</span>
                  </label>
                </div>

                {data.useOutletMode && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Total Omzet: Rp.{formatNumberWithSeparators(data.outlets.reduce((total, outlet) => total + (outlet.dailyRevenue * outlet.operatingDays), 0))}
                      </p>
                      <button
                        onClick={addOutlet}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Tambah Outlet
                      </button>
                    </div>

                    <div className="space-y-3">
                      {data.outlets.map((outlet) => (
                        <div key={outlet.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                          <input
                            type="text"
                            value={outlet.name}
                            onChange={(e) => updateOutlet(outlet.id, 'name', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                            placeholder="Nama outlet"
                          />
                          <input
                            type="text"
                            value={outlet.dailyRevenue ? formatNumberWithSeparators(outlet.dailyRevenue) : ''}
                            onChange={(e) => {
                              const value = handleFormattedInput(e.target.value);
                              updateOutlet(outlet.id, 'dailyRevenue', value);
                            }}
                            className="w-32 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                            placeholder="1.000.000"
                          />
                          <input
                            type="number"
                            value={outlet.operatingDays}
                            onChange={(e) => updateOutlet(outlet.id, 'operatingDays', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                            placeholder="Hari"
                            min="1"
                            max="31"
                          />
                          <span className="text-xs text-gray-500 w-24">
                            Rp.{formatNumberWithSeparators(outlet.dailyRevenue * outlet.operatingDays)}
                          </span>
                          <button
                            onClick={() => removeOutlet(outlet.id)}
                            className="w-6 h-6 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced Settings */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  ⚙️ Pengaturan Lanjutan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skenario Simulasi
                    </label>
                    <select
                      value={data.scenario}
                      onChange={(e) => setData(prev => ({ ...prev, scenario: e.target.value as 'optimistic' | 'realistic' | 'pessimistic' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                    >
                      <option value="pessimistic">Pesimis (80%)</option>
                      <option value="realistic">Realistis (100%)</option>
                      <option value="optimistic">Optimis (120%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pajak (%)
                    </label>
                    <input
                      type="number"
                      value={data.taxRate}
                      onChange={(e) => setData(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      placeholder="10"
                      min="0"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inflasi (%)
                    </label>
                    <input
                      type="number"
                      value={data.inflationRate}
                      onChange={(e) => setData(prev => ({ ...prev, inflationRate: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      placeholder="3"
                      min="0"
                      max="20"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && results && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">{formatPercent(results.annualROI)}</div>
                  <div className="text-blue-100 text-sm">ROI Tahunan</div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="text-2xl font-bold">{results.breakEvenMonths.toFixed(1)}</div>
                  <div className="text-green-100 text-sm">Break-even (Bulan)</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="text-lg font-bold">{formatCurrency(results.yearlyNetProfit)}</div>
                  <div className="text-purple-100 text-sm">Laba Bersih/Tahun</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                  <div className="text-lg font-bold">{formatCurrency(results.totalReturnAfterYears)}</div>
                  <div className="text-orange-100 text-sm">Total Return {data.projectDuration} Tahun</div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">📈 Hasil Simulasi Detail</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Profitabilitas Bulanan</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Laba Kotor:</span>
                        <span className="font-medium">{formatCurrency(results.monthlyGrossProfit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Laba Bersih (Anda):</span>
                        <span className="font-medium text-green-600">{formatCurrency(results.monthlyNetProfit)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Kepemilikan:</span>
                        <span>{data.ownershipPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Profitabilitas Tahunan</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Laba Kotor:</span>
                        <span className="font-medium">{formatCurrency(results.yearlyGrossProfit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Laba Bersih (Anda):</span>
                        <span className="font-medium text-green-600">{formatCurrency(results.yearlyNetProfit)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Setelah Pajak:</span>
                        <span>{100 - data.taxRate}% dari laba</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-3">Analisis Investasi</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{formatCurrency(data.initialInvestment)}</div>
                      <div className="text-sm text-blue-700">Modal Awal</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{formatCurrency(results.totalReturnAfterYears)}</div>
                      <div className="text-sm text-green-700">Return {data.projectDuration} Tahun</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{formatCurrency(results.totalReturnAfterYears - data.initialInvestment)}</div>
                      <div className="text-sm text-purple-700">Net Profit</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className={`border rounded-lg p-4 ${
                results.annualROI > 15 
                  ? 'border-green-200 bg-green-50' 
                  : results.annualROI > 8 
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${
                    results.annualROI > 15 
                      ? 'text-green-600' 
                      : results.annualROI > 8 
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`} />
                  <div>
                    <h4 className={`font-medium ${
                      results.annualROI > 15 
                        ? 'text-green-800' 
                        : results.annualROI > 8 
                          ? 'text-yellow-800'
                          : 'text-red-800'
                    }`}>
                      Rekomendasi Investasi
                    </h4>
                    <p className={`text-sm mt-1 ${
                      results.annualROI > 15 
                        ? 'text-green-700' 
                        : results.annualROI > 8 
                          ? 'text-yellow-700'
                          : 'text-red-700'
                    }`}>
                      {results.annualROI > 15 
                        ? `ROI ${formatPercent(results.annualROI)} sangat menarik! Investasi ini berpotensi menguntungkan dengan break-even dalam ${results.breakEvenMonths.toFixed(1)} bulan.`
                        : results.annualROI > 8 
                          ? `ROI ${formatPercent(results.annualROI)} cukup layak. Pertimbangkan faktor risiko dan analisis lebih detail sebelum investasi.`
                          : `ROI ${formatPercent(results.annualROI)} di bawah ekspektasi. Pertimbangkan untuk mengoptimalkan model bisnis atau mencari peluang investasi lain.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts Tab */}
          {activeTab === 'charts' && results && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Visualisasi Data</h3>
                <p className="text-gray-600">Grafik dan analisis visual akan ditampilkan di sini</p>
                <div className="mt-8 p-12 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Grafik cash flow, trend ROI, dan analisis perbandingan</p>
                  <p className="text-sm text-gray-400 mt-2">Fitur ini akan segera tersedia</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t bg-gray-50 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {results && (
              <span>
                ROI: <strong className="text-green-600">{formatPercent(results.annualROI)}</strong> | 
                Break-even: <strong>{results.breakEvenMonths.toFixed(1)} bulan</strong>
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Save className="w-4 h-4" />
              Simpan Simulasi
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
