'use client';

import { useState } from 'react';
import { Briefcase, Plus, BarChart3, Play, Download, Target, Users, Package, DollarSign } from 'lucide-react';
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
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">✨ Fitur Utama</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Input produk, karyawan, dan biaya</li>
                <li>• Proyeksi keuangan otomatis</li>
                <li>• Analisis break-even point & ROI</li>
                <li>• Simulasi skenario &quot;what-if&quot;</li>
                <li>• Export ke PDF & Excel</li>
              </ul>
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
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4" />
              Plan Baru
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-4 py-3 border-b border-gray-200">
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
