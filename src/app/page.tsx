'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, DollarSign, Target, Users, Briefcase, Plus, ArrowLeft, Package, Play, Download } from 'lucide-react'
import { useBusinessStore } from '@/store/businessStore';
import { usePageLogger } from '@/hooks/usePageLogger';
import ProductForm from '@/components/ProductForm';
import EmployeeForm from '@/components/EmployeeForm';
import CostForm from '@/components/CostForm';
import TargetForm from '@/components/TargetForm';
import AnalysisCharts from '@/components/AnalysisCharts';
import WhatIfScenario from '@/components/WhatIfScenario';
import ExportData from '@/components/ExportData';
import Footer from '@/components/Footer';

type TabType = 'products' | 'employees' | 'costs' | 'targets' | 'analysis' | 'scenarios' | 'export';

export default function Home() {
  usePageLogger(); // Log page visits
  const { currentPlan, createNewPlan } = useBusinessStore();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [showCreateForm, setShowCreateForm] = useState(!currentPlan);
  const [newPlanName, setNewPlanName] = useState('');
  const [showUpdateBanner, setShowUpdateBanner] = useState(true);

  const handleCreatePlan = () => {
    if (newPlanName.trim()) {
      createNewPlan(newPlanName.trim());
      setShowCreateForm(false);
      setNewPlanName('');
    }
  };

  const tabs = [
    { id: 'products' as TabType, label: 'Produk & Revenue', icon: Package, color: 'blue' },
    { id: 'employees' as TabType, label: 'Karyawan & Sales', icon: Users, color: 'green' },
    { id: 'costs' as TabType, label: 'Biaya', icon: DollarSign, color: 'red' },
    { id: 'targets' as TabType, label: 'Target & Growth', icon: Target, color: 'purple' },
    { id: 'analysis' as TabType, label: 'Analisis & Grafik', icon: BarChart3, color: 'indigo' },
    { id: 'scenarios' as TabType, label: 'What-If Scenario', icon: Play, color: 'orange' },
    { id: 'export' as TabType, label: 'Export Data', icon: Download, color: 'teal' },
  ];

  const getTabColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-50 text-blue-700 border-blue-500' : 'text-gray-600 hover:text-blue-600',
      green: isActive ? 'bg-green-50 text-green-700 border-green-500' : 'text-gray-600 hover:text-green-600',
      red: isActive ? 'bg-red-50 text-red-700 border-red-500' : 'text-gray-600 hover:text-red-600',
      purple: isActive ? 'bg-purple-50 text-purple-700 border-purple-500' : 'text-gray-600 hover:text-purple-600',
      indigo: isActive ? 'bg-indigo-50 text-indigo-700 border-indigo-500' : 'text-gray-600 hover:text-indigo-600',
      orange: isActive ? 'bg-orange-50 text-orange-700 border-orange-500' : 'text-gray-600 hover:text-orange-600',
      teal: isActive ? 'bg-teal-50 text-teal-700 border-teal-500' : 'text-gray-600 hover:text-teal-600',
    };
    return colors[color as keyof typeof colors];
  };

  if (showCreateForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Business Planning App</h1>
              <p className="text-gray-600">
                Alat bantu perencanaan bisnis untuk UKM. Analisis kelayakan, proyeksi keuangan, dan target realistis.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Business Plan
                </label>
                <input
                  type="text"
                  value={newPlanName}
                  onChange={(e) => setNewPlanName(e.target.value)}
                  placeholder="Contoh: Aplikasi Kasir Online"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreatePlan()}
                />
              </div>

              <button
                onClick={handleCreatePlan}
                disabled={!newPlanName.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Plus className="w-4 h-4" />
                Buat Business Plan Baru
              </button>

              {/* ROI Simulator Button */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">atau</span>
                </div>
              </div>

              <Link
                href="/roi-simulator"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                Simulasi ROI & Profitabilitas
              </Link>
            </div>

            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✨</span>
                <h3 className="font-bold text-blue-800 text-lg">Fitur Utama Business Planning App</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 text-sm">Smart Input System</h4>
                      <p className="text-blue-600 text-xs">Input produk, karyawan & biaya dengan format mata uang otomatis</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 text-sm">ROI & Profitability Simulator</h4>
                      <p className="text-blue-600 text-xs">Simulasi ROI real-time dengan proyeksi multi-tahun & inflasi</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 text-sm">Financial Projections</h4>
                      <p className="text-blue-600 text-xs">Proyeksi keuangan otomatis dengan break-even point analysis</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 text-sm">What-If Scenarios</h4>
                      <p className="text-blue-600 text-xs">Simulasi skenario bisnis (optimis, realistis, pesimis)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Download className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 text-sm">Professional Export</h4>
                      <p className="text-blue-600 text-xs">Export laporan lengkap ke PDF & Excel dengan grafik</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 text-sm">Multi-Outlet Support</h4>
                      <p className="text-blue-600 text-xs">Kelola multiple outlet dengan analisis terkonsolidasi</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white/60 rounded-lg border border-blue-300">
                <p className="text-blue-700 text-xs text-center">
                  <strong>💡 Perfect untuk UKM:</strong> Restoran, Kafe, Retail, Jasa, E-commerce, dan bisnis lainnya
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Business Planning App</h1>
                <p className="text-sm text-gray-500">{currentPlan?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <Plus className="w-4 h-4" />
                Plan Baru
              </button>
              
              <Link
                href="/roi-simulator"
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                ROI Simulator
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Update Banner */}
      {showUpdateBanner && (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 border-b border-gray-200 animate-in slide-in-from-top duration-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 relative">
              <button
                onClick={() => setShowUpdateBanner(false)}
                className="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-sm transition-colors"
                title="Tutup banner"
              >
                ×
              </button>
              <div className="flex items-start gap-4 pr-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                    <span className="text-2xl">🚀</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white">Update v0.1.2 - Currency Input Enhancement</h3>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full animate-pulse">NEW</span>
                  </div>
                  <p className="text-blue-100 text-sm mb-3">
                    Pengalaman input yang lebih baik dengan format mata uang yang mudah dibaca!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                        ✨ Fitur Baru & Perbaikan
                      </h4>
                      <ul className="text-blue-100 text-xs space-y-1">
                        <li>• <strong>Real-time Currency Formatting</strong> - Input otomatis dengan pemisah titik (20.000.000.000)</li>
                        <li>• <strong>Readable Display</strong> - Tampilan yang mudah dibaca (Rp 20 Miliar)</li>
                        <li>• <strong>Enhanced ROI Simulator</strong> - Interface yang lebih user-friendly</li>
                        <li>• <strong>Improved UX</strong> - Placeholder dan deskripsi yang lebih informatif</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                        🎯 Yang Diperbaiki
                      </h4>
                      <ul className="text-blue-100 text-xs space-y-1">
                        <li>• Format input mata uang sekarang menggunakan standar Indonesia</li>
                        <li>• Parsing input yang lebih akurat untuk angka besar</li>
                        <li>• Validasi input yang lebih baik</li>
                        <li>• TypeScript error fixes pada ROI Simulator</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <Link
                      href="/roi-simulator"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm border border-white/30"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Coba ROI Simulator
                    </Link>
                    <span className="text-blue-200 text-xs">
                      💡 Simulasi investasi dengan format mata uang yang baru!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md border-2 border-transparent transition-colors ${getTabColorClasses(tab.color, isActive)}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Back to Main Menu Button */}
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setActiveTab('products');
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                title="Kembali ke Menu Utama"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Menu Utama</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'products' && <ProductForm />}
          {activeTab === 'employees' && <EmployeeForm />}
          {activeTab === 'costs' && <CostForm />}
          {activeTab === 'targets' && <TargetForm />}
          {activeTab === 'analysis' && <AnalysisCharts />}
          {activeTab === 'scenarios' && <WhatIfScenario />}
          {activeTab === 'export' && <ExportData />}
        </div>

        {/* Progress Indicator */}
        {currentPlan && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">📋 Progress Pengisian Data</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className={`p-2 rounded ${currentPlan.products.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                <div className="font-medium">Produk</div>
                <div>{currentPlan.products.length} item</div>
              </div>
              <div className={`p-2 rounded ${currentPlan.employees.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                <div className="font-medium">Karyawan</div>
                <div>{currentPlan.employees.length} orang</div>
              </div>
              <div className={`p-2 rounded ${(currentPlan.fixedCosts.length > 0 || currentPlan.variableCosts.length > 0) ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                <div className="font-medium">Biaya</div>
                <div>{currentPlan.fixedCosts.length + currentPlan.variableCosts.length} item</div>
              </div>
              <div className={`p-2 rounded ${currentPlan.businessTarget ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                <div className="font-medium">Target</div>
                <div>{currentPlan.businessTarget ? 'Tersimpan' : 'Belum'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
