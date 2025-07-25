'use client'

import { useState } from 'react'
import { Calculator, TrendingUp, DollarSign, Settings, BarChart3, Save, FolderOpen, PieChart, Building2, Zap, Target, AlertCircle, Download } from 'lucide-react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import SaveLoadModal from '@/components/SaveLoadModal'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement)

interface SimulationData {
  // Input Keuangan Dasar
  initialInvestment: number
  monthlyRevenue: number
  monthlyOperationalCosts: number
  netProfitMargin: number
  projectDuration: number
  ownershipPercentage: number
  
  // Advanced Settings
  taxRate: number
  inflationRate: number
  priceIncreaseRate: number
  scenario: 'optimis' | 'realistis' | 'pesimis'
  
  // Mode Multi Outlet
  useOutletMode: boolean
  outlets: OutletData[]
}

interface OutletData {
  id: string
  name: string
  dailyRevenue: number
  operatingDaysPerMonth: number
  monthlyOperationalCosts: number
}

const defaultData: SimulationData = {
  // Input Keuangan Dasar
  initialInvestment: 20000000000, // 20 Miliar
  monthlyRevenue: 500000000, // 500 Juta per bulan
  monthlyOperationalCosts: 300000000, // 300 Juta per bulan
  netProfitMargin: 0, // Auto-calculated
  projectDuration: 5,
  ownershipPercentage: 100,
  
  // Advanced Settings
  taxRate: 11, // PPN 11%
  inflationRate: 5,
  priceIncreaseRate: 3,
  scenario: 'realistis',
  
  // Mode Multi Outlet
  useOutletMode: false,
  outlets: []
}

export default function ROISimulatorPage() {
  const [data, setData] = useState<SimulationData>(defaultData)
  const [activeTab, setActiveTab] = useState('input')
  const [showSaveLoad, setShowSaveLoad] = useState(false)
  const [simulationCode, setSimulationCode] = useState('')
  const [loadCode, setLoadCode] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null)
  const [projectionView, setProjectionView] = useState<'monthly' | 'yearly'>('yearly')
  
  // Comparison states
  const [compareCode, setCompareCode] = useState('')
  const [compareData, setCompareData] = useState<SimulationData | null>(null)
  const [compareResults, setCompareResults] = useState<{
    monthlyProfit: number;
    yearlyROI: number;
    monthlyRevenue: number;
    operationalCosts: number;
  } | null>(null)

  // Function to show alerts
  const showAlert = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000) // Auto dismiss after 5 seconds
  }

  // Add new outlet
  const addOutlet = () => {
    const newOutlet: OutletData = {
      id: Date.now().toString(),
      name: `Outlet ${data.outlets.length + 1}`,
      dailyRevenue: 5000000, // 5 juta per hari
      operatingDaysPerMonth: 30,
      monthlyOperationalCosts: 10000000 // 10 juta per bulan
    }
    setData(prev => ({
      ...prev,
      outlets: [...prev.outlets, newOutlet]
    }))
  }

  // Remove outlet
  const removeOutlet = (id: string) => {
    setData(prev => ({
      ...prev,
      outlets: prev.outlets.filter(outlet => outlet.id !== id)
    }))
  }

  // Update outlet
  const updateOutlet = (id: string, updates: Partial<OutletData>) => {
    setData(prev => ({
      ...prev,
      outlets: prev.outlets.map(outlet => 
        outlet.id === id ? { ...outlet, ...updates } : outlet
      )
    }))
  }

  // Calculate total revenue from outlets
  const calculateOutletRevenue = () => {
    return data.outlets.reduce((total, outlet) => {
      return total + (outlet.dailyRevenue * outlet.operatingDaysPerMonth)
    }, 0)
  }

  // Calculate total operational costs from outlets
  const calculateOutletCosts = () => {
    return data.outlets.reduce((total, outlet) => {
      return total + outlet.monthlyOperationalCosts
    }, 0)
  }

  // Generate unique simulation code
  const generateSimulationCode = () => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `SIM-${timestamp}-${random}`.toUpperCase()
  }

  // Save simulation to localStorage and generate code
  const saveSimulation = () => {
    const code = generateSimulationCode()
    const simulationData = {
      code,
      data,
      timestamp: new Date().toISOString(),
      name: `Simulasi ${new Date().toLocaleDateString('id-ID')}`
    }
    
    localStorage.setItem(`simulation_${code}`, JSON.stringify(simulationData))
    
    // Also save to list
    const savedList = JSON.parse(localStorage.getItem('saved_simulations') || '[]')
    savedList.push({
      code,
      name: simulationData.name,
      timestamp: simulationData.timestamp
    })
    localStorage.setItem('saved_simulations', JSON.stringify(savedList))
    
    setSimulationCode(code)
    showAlert('success', `✅ Simulasi berhasil disimpan dengan kode: ${code}`)
  }

  // Load simulation by code
  const loadSimulation = () => {
    if (!loadCode.trim()) {
      showAlert('warning', 'Masukkan kode simulasi!')
      return
    }
    
    const savedData = localStorage.getItem(`simulation_${loadCode.trim()}`)
    if (savedData) {
      const simulation = JSON.parse(savedData)
      setData(simulation.data)
      showAlert('success', `✅ Simulasi "${simulation.name}" berhasil dimuat!`)
      setLoadCode('')
    } else {
      showAlert('error', '❌ Kode simulasi tidak ditemukan!')
    }
  }

  // Load comparison simulation
  const handleLoadComparison = () => {
    if (!compareCode.trim()) {
      showAlert('warning', 'Masukkan kode simulasi untuk dibandingkan')
      return
    }
    
    const savedData = localStorage.getItem(`simulation_${compareCode.trim()}`)
    if (savedData) {
      const simulation = JSON.parse(savedData)
      setCompareData(simulation.data)
      
      // Calculate results for comparison data
      const compareRevenue = simulation.data.useOutletMode 
        ? simulation.data.outlets.reduce((total: number, outlet: OutletData) => total + (outlet.dailyRevenue * outlet.operatingDaysPerMonth), 0)
        : simulation.data.monthlyRevenue
      
      const compareCosts = simulation.data.useOutletMode
        ? simulation.data.outlets.reduce((total: number, outlet: OutletData) => total + outlet.monthlyOperationalCosts, 0)
        : simulation.data.monthlyOperationalCosts
      
      const compareNetProfit = compareRevenue - compareCosts
      const compareOwnerProfit = (compareNetProfit * simulation.data.ownershipPercentage) / 100
      const compareAfterTaxProfit = compareOwnerProfit * (1 - simulation.data.taxRate / 100)
      const compareMonthlyROI = simulation.data.initialInvestment > 0 ? (compareAfterTaxProfit / simulation.data.initialInvestment) * 100 : 0
      const compareYearlyROI = compareMonthlyROI * 12
      
      setCompareResults({
        monthlyProfit: compareAfterTaxProfit,
        yearlyROI: compareYearlyROI,
        monthlyRevenue: compareRevenue,
        operationalCosts: compareCosts
      })
      
      showAlert('success', `✅ Simulasi "${simulation.name}" berhasil dimuat untuk perbandingan!`)
    } else {
      showAlert('error', '❌ Kode simulasi tidak ditemukan!')
      setCompareData(null)
      setCompareResults(null)
    }
  }

  // Export to PDF function
  const exportToPDF = async () => {
    try {
      // Dynamic import untuk mengurangi bundle size
      const jsPDF = (await import('jspdf')).default
      
      const doc = new jsPDF()
      const margin = 20
      let yPosition = margin

      // Helper function untuk add text dengan wrap
      const addText = (text: string, fontSize = 12, isBold = false) => {
        doc.setFontSize(fontSize)
        if (isBold) doc.setFont('helvetica', 'bold')
        else doc.setFont('helvetica', 'normal')
        
        if (yPosition > 270) {
          doc.addPage()
          yPosition = margin
        }
        
        doc.text(text, margin, yPosition)
        yPosition += fontSize * 0.6
      }

      // Title
      addText('LAPORAN SIMULASI ROI BISNIS', 16, true)
      yPosition += 10
      
      // Basic Info
      addText(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 10)
      addText(`Kode Simulasi: ${simulationCode || 'Belum disimpan'}`, 10)
      yPosition += 10

      // Input Data
      addText('DATA INPUT:', 14, true)
      addText(`• Modal Awal: ${formatCurrency(data.initialInvestment)}`)
      addText(`• Omzet Bulanan: ${formatCurrency(data.monthlyRevenue)}`)
      addText(`• Biaya Operasional: ${formatCurrency(data.monthlyOperationalCosts)}`)
      addText(`• Margin Laba Bersih: ${data.netProfitMargin}%`)
      addText(`• Kepemilikan: ${data.ownershipPercentage}%`)
      addText(`• Pajak: ${data.taxRate}%`)
      addText(`• Inflasi: ${data.inflationRate}%`)
      addText(`• Skenario: ${data.scenario}`)
      addText(`• Durasi Proyek: ${data.projectDuration} tahun`)
      if (data.useOutletMode && data.outlets.length > 0) {
        addText(`• Mode Multi Outlet: ${data.outlets.length} outlet`)
        data.outlets.forEach((outlet) => {
          addText(`  - ${outlet.name}: Revenue ${formatCurrency(outlet.dailyRevenue * outlet.operatingDaysPerMonth)}/bulan`)
        })
      }
      yPosition += 10

      // Key Results
      addText('HASIL ANALISIS:', 14, true)
      addText(`• Revenue Bulanan: ${formatCurrency(totalMonthlyRevenue)}`)
      addText(`• Biaya Operasional: ${formatCurrency(totalOperationalCosts)}`)
      addText(`• Laba Bersih Pemilik: ${formatCurrency(monthlyOwnerProfit)}`)
      addText(`• ROI Bulanan: ${monthlyROI.toFixed(2)}%`)
      addText(`• ROI Tahunan: ${yearlyROI.toFixed(2)}%`)
      addText(`• Break Even: ${breakEvenMonths ? `${breakEvenMonths} bulan` : 'Tidak profitable'}`)
      yPosition += 10

      // Projections
      addText('PROYEKSI TAHUNAN:', 14, true)
      yearlyProjections.forEach((proj) => {
        addText(`Tahun ${proj.year}:`)
        addText(`  - Revenue: ${formatCurrency(proj.monthlyRevenue * 12)}`)
        addText(`  - Profit Tahunan: ${formatCurrency(proj.yearlyProfit)}`)
        addText(`  - ROI: ${proj.roi.toFixed(2)}%`)
        addText(`  - Kumulatif: ${formatCurrency(proj.cumulativeProfit)}`)
      })

      // Recommendations
      if (yPosition > 200) {
        doc.addPage()
        yPosition = margin
      }
      
      addText('REKOMENDASI:', 14, true)
      if (monthlyOwnerProfit > 0) {
        addText('✅ Bisnis menguntungkan dan layak dijalankan')
        addText(`✅ ROI ${yearlyROI.toFixed(1)}% per tahun ${yearlyROI > data.inflationRate + 5 ? '(bagus)' : '(perlu optimasi)'}`)
      } else {
        addText('❌ Bisnis tidak menguntungkan dalam kondisi saat ini')
        addText('💡 Pertimbangkan: kurangi biaya, naikkan harga, atau tingkatkan volume')
      }
      
      if (breakEvenMonths && breakEvenMonths > 24) {
        addText('⚠️ Break even terlalu lama, pertimbangkan optimasi model bisnis')
      }

      // Save PDF
      doc.save(`ROI-Simulation-${simulationCode || Date.now()}.pdf`)
      showAlert('success', '✅ Laporan PDF berhasil diunduh!')
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      showAlert('error', '❌ Gagal membuat PDF. Pastikan data sudah lengkap.')
    }
  }

  // Calculations - New Formula for Lounge/Bar/F&B Business
  const totalMonthlyRevenue = data.useOutletMode ? calculateOutletRevenue() : data.monthlyRevenue
  const totalOperationalCosts = data.useOutletMode ? calculateOutletCosts() : data.monthlyOperationalCosts
  
  // Gross Profit
  const monthlyGrossProfit = totalMonthlyRevenue - totalOperationalCosts
  
  // Net Profit (auto-calculate if margin is 0, or use manual margin)
  const monthlyNetProfit = data.netProfitMargin > 0 
    ? totalMonthlyRevenue * (data.netProfitMargin / 100)
    : monthlyGrossProfit
  
  // After Tax
  const monthlyAfterTaxProfit = monthlyNetProfit * (1 - data.taxRate / 100)
  
  // Owner's Share
  const monthlyOwnerProfit = monthlyAfterTaxProfit * (data.ownershipPercentage / 100)
  
  // ROI Calculation
  const monthlyROI = data.initialInvestment > 0 ? (monthlyOwnerProfit / data.initialInvestment) * 100 : 0
  const yearlyROI = monthlyROI * 12
  
  // Break Even (considering owner's actual take)
  const breakEvenMonths = monthlyOwnerProfit > 0 ? Math.ceil(data.initialInvestment / monthlyOwnerProfit) : null
  
  // Scenario multipliers
  const scenarioMultiplier = {
    optimis: { revenue: 1.2, costs: 0.9 },
    realistis: { revenue: 1.0, costs: 1.0 },
    pesimis: { revenue: 0.8, costs: 1.1 }
  }
  
  const currentScenario = scenarioMultiplier[data.scenario]
  
  // Multi-year projections with inflation and price increases
  const yearlyProjections = Array.from({ length: data.projectDuration }, (_, yearIndex) => {
    const year = yearIndex + 1
    const inflationMultiplier = Math.pow(1 + data.inflationRate / 100, yearIndex)
    const priceIncreaseMultiplier = Math.pow(1 + data.priceIncreaseRate / 100, yearIndex)
    
    // Apply scenario and growth factors
    const adjustedRevenue = totalMonthlyRevenue * priceIncreaseMultiplier * currentScenario.revenue
    const adjustedCosts = totalOperationalCosts * inflationMultiplier * currentScenario.costs
    
    const adjustedGrossProfit = adjustedRevenue - adjustedCosts
    const adjustedNetProfit = data.netProfitMargin > 0 
      ? adjustedRevenue * (data.netProfitMargin / 100)
      : adjustedGrossProfit
    
    const adjustedAfterTaxProfit = adjustedNetProfit * (1 - data.taxRate / 100)
    const adjustedOwnerProfit = adjustedAfterTaxProfit * (data.ownershipPercentage / 100)
    
    return {
      year,
      monthlyRevenue: adjustedRevenue,
      monthlyProfit: adjustedOwnerProfit,
      yearlyProfit: adjustedOwnerProfit * 12,
      roi: data.initialInvestment > 0 ? (adjustedOwnerProfit / data.initialInvestment) * 100 : 0,
      cumulativeProfit: 0 // Will be calculated below
    }
  })
  
  // Calculate cumulative profit
  yearlyProjections.forEach((projection, index) => {
    if (index === 0) {
      projection.cumulativeProfit = projection.yearlyProfit
    } else {
      projection.cumulativeProfit = yearlyProjections[index - 1].cumulativeProfit + projection.yearlyProfit
    }
  })

  // Monthly projections for detailed view (12 months)
  const projections = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const adjustedRevenue = totalMonthlyRevenue * currentScenario.revenue
    const adjustedCosts = totalOperationalCosts * currentScenario.costs
    const adjustedGrossProfit = adjustedRevenue - adjustedCosts
    const adjustedNetProfit = data.netProfitMargin > 0 
      ? adjustedRevenue * (data.netProfitMargin / 100)
      : adjustedGrossProfit
    const adjustedAfterTaxProfit = adjustedNetProfit * (1 - data.taxRate / 100)
    const adjustedOwnerProfit = adjustedAfterTaxProfit * (data.ownershipPercentage / 100)
    
    return {
      month,
      revenue: adjustedRevenue,
      profit: adjustedOwnerProfit,
      grossProfit: adjustedGrossProfit,
      netProfit: adjustedNetProfit,
      roi: data.initialInvestment > 0 ? (adjustedOwnerProfit / data.initialInvestment) * 100 : 0,
      cumulativeProfit: adjustedOwnerProfit * month
    }
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format numbers with dot separators for input display
  const formatNumberWithSeparators = (value: number): string => {
    if (value === 0) return ''
    return new Intl.NumberFormat('id-ID').format(value)
  }

  // Parse formatted input back to number
  const handleFormattedInput = (value: string): number => {
    const numericValue = value.replace(/[^\d]/g, '')
    return numericValue === '' ? 0 : Number(numericValue)
  }

  // Format currency for readable display (Rp X Miliar/Juta format)
  const formatCurrencyDisplay = (value: number): string => {
    if (value === 0) return ''
    
    if (value >= 1000000000) {
      const billions = value / 1000000000
      return `Rp ${billions.toFixed(billions >= 10 ? 0 : 1)} Miliar`
    } else if (value >= 1000000) {
      const millions = value / 1000000
      return `Rp ${millions.toFixed(millions >= 10 ? 0 : 1)} Juta`
    } else if (value >= 1000) {
      const thousands = value / 1000
      return `Rp ${thousands.toFixed(thousands >= 10 ? 0 : 1)} Ribu`
    } else {
      return `Rp ${value.toLocaleString('id-ID')}`
    }
  }

  const costBreakdownData = {
    labels: ['Biaya Operasional', 'Pajak', 'Biaya Outlet (jika ada)'],
    datasets: [
      {
        data: [
          totalOperationalCosts,
          monthlyAfterTaxProfit > 0 ? (monthlyNetProfit - monthlyAfterTaxProfit) : 0,
          data.useOutletMode ? calculateOutletCosts() : 0
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(6, 182, 212, 0.8)'
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(6, 182, 212)'
        ],
        borderWidth: 2,
      }
    ]
  }

  const tabs = [
    { id: 'input', label: 'Input Data', icon: Calculator },
    { id: 'analysis', label: 'Analisis', icon: BarChart3 },
    { id: 'projections', label: 'Proyeksi', icon: TrendingUp },
    { id: 'comparison', label: 'Perbandingan', icon: PieChart }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ROI Simulator</h1>
                <p className="text-sm text-gray-600 hidden sm:block">Simulasi Kelayakan Bisnis & Proyeksi Keuntungan</p>
              </div>
            </div>
            
            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={saveSimulation}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Simpan</span>
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                <FolderOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Bandingkan</span>
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Alert Component */}
      {alert && (
        <div className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <div className={`
              flex items-center gap-3 p-4 rounded-lg border-l-4 
              ${alert.type === 'success' ? 'bg-green-50 border-green-400 text-green-800' : 
                alert.type === 'error' ? 'bg-red-50 border-red-400 text-red-800' :
                alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400 text-yellow-800' :
                'bg-blue-50 border-blue-400 text-blue-800'}
            `}>
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold
                ${alert.type === 'success' ? 'bg-green-500' : 
                  alert.type === 'error' ? 'bg-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'}
              `}>
                {alert.type === 'success' ? '✓' : 
                 alert.type === 'error' ? '✕' :
                 alert.type === 'warning' ? '⚠' : 'ℹ'}
              </div>
              <p className="flex-1 text-sm font-medium">{alert.message}</p>
              <button
                onClick={() => setAlert(null)}
                className={`
                  w-6 h-6 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors text-sm
                  ${alert.type === 'success' ? 'hover:bg-green-600' : 
                    alert.type === 'error' ? 'hover:bg-red-600' :
                    alert.type === 'warning' ? 'hover:bg-yellow-600' :
                    'hover:bg-blue-600'}
                `}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Results Banner - Mobile Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center sm:text-left">
              <p className="text-blue-200 text-sm">Laba Bersih Pemilik</p>
              <p className="text-xl sm:text-2xl font-bold">{formatCurrency(monthlyOwnerProfit)}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-blue-200 text-sm">ROI Tahunan</p>
              <p className="text-xl sm:text-2xl font-bold">{yearlyROI.toFixed(1)}%</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-blue-200 text-sm">Omzet Bulanan</p>
              <p className="text-xl sm:text-2xl font-bold">{formatCurrency(totalMonthlyRevenue)}</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-blue-200 text-sm">Break Even</p>
              <p className="text-xl sm:text-2xl font-bold">
                {breakEvenMonths ? `${breakEvenMonths} bulan` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs - Mobile Scrollable */}
      <div className="bg-white border-b sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'input' && (
          <div className="space-y-6">
            {/* Save/Load Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-4 sm:p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Save className="w-5 h-5 text-indigo-600" />
                💾 Simpan & Muat Simulasi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kode Simulasi Saat Ini
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={simulationCode}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                      placeholder="Belum disimpan"
                    />
                    <button
                      onClick={saveSimulation}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Simpan
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Klik Simpan untuk generate kode baru</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Muat Simulasi dengan Kode
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={loadCode}
                      onChange={(e) => setLoadCode(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="SIM-XXXXX-XXXXX"
                    />
                    <button
                      onClick={loadSimulation}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Muat
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Masukkan kode simulasi yang sudah disimpan</p>
                </div>
              </div>
            </div>

            {/* Input Keuangan Dasar */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">💰 Input Keuangan Dasar</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modal Awal Investasi (IDR)
                  </label>
                  <input
                    type="text"
                    value={data.initialInvestment ? formatNumberWithSeparators(data.initialInvestment) : ''}
                    onChange={(e) => setData(prev => ({ ...prev, initialInvestment: handleFormattedInput(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="20.000.000.000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Total modal CAPEX awal {data.initialInvestment > 0 ? `(${formatCurrencyDisplay(data.initialInvestment)})` : ''}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Omzet Bulanan (IDR)
                  </label>
                  <input
                    type="text"
                    value={data.monthlyRevenue ? formatNumberWithSeparators(data.monthlyRevenue) : ''}
                    onChange={(e) => setData(prev => ({ ...prev, monthlyRevenue: handleFormattedInput(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="500.000.000"
                    disabled={data.useOutletMode}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {data.useOutletMode ? 'Dihitung otomatis dari outlet' : `Total omzet per bulan ${data.monthlyRevenue > 0 ? `(${formatCurrencyDisplay(data.monthlyRevenue)})` : ''}`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biaya Operasional Bulanan(IDR)
                  </label>
                  <input
                    type="text"
                    value={data.monthlyOperationalCosts ? formatNumberWithSeparators(data.monthlyOperationalCosts) : ''}
                    onChange={(e) => setData(prev => ({ ...prev, monthlyOperationalCosts: handleFormattedInput(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="300.000.000"
                    disabled={data.useOutletMode}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {data.useOutletMode ? 'Dihitung otomatis dari outlet' : `Gaji, bahan, listrik, entertainment, dll ${data.monthlyOperationalCosts > 0 ? `(${formatCurrencyDisplay(data.monthlyOperationalCosts)})` : ''}`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Margin Laba Bersih (%)
                  </label>
                  <input
                    type="number"
                    value={data.netProfitMargin}
                    onChange={(e) => setData(prev => ({ ...prev, netProfitMargin: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                    min="0"
                    max="100"
                    step="0.1"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="5"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="100"
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">100% (owner) atau 51% (investor mayoritas)</p>
                </div>
              </div>
            </div>

            {/* Pengaturan Lanjutan */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  ⚙️ Pengaturan Lanjutan
                </h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showAdvanced ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              
              {showAdvanced && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pajak (%)
                      </label>
                      <input
                        type="number"
                        value={data.taxRate}
                        onChange={(e) => setData(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="11"
                        min="0"
                        max="60"
                        step="0.1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Default 11% (PPN), bisa 30-52% total jika gabung pajak hiburan</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Inflasi per Tahun (%)
                      </label>
                      <input
                        type="number"
                        value={data.inflationRate}
                        onChange={(e) => setData(prev => ({ ...prev, inflationRate: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="5"
                        min="0"
                        max="20"
                        step="0.1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Kenaikan biaya operasional per tahun</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kenaikan Harga/Omzet (%)
                      </label>
                      <input
                        type="number"
                        value={data.priceIncreaseRate}
                        onChange={(e) => setData(prev => ({ ...prev, priceIncreaseRate: Number(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="3"
                        min="0"
                        max="20"
                        step="0.1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Simulasi kenaikan harga atau omzet tiap tahun</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skenario
                      </label>
                      <select
                        value={data.scenario}
                        onChange={(e) => setData(prev => ({ ...prev, scenario: e.target.value as 'optimis' | 'realistis' | 'pesimis' }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="optimis">Optimis (+20% revenue, -10% costs)</option>
                        <option value="realistis">Realistis (normal)</option>
                        <option value="pesimis">Pesimis (-20% revenue, +10% costs)</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Pengaruh skenario terhadap omzet dan biaya</p>
                    </div>
                  </div>
                  
                  {/* Scenario Impact Visualization */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(scenarioMultiplier).map(([scenario, multiplier]) => (
                      <div key={scenario} className={`p-4 rounded-lg border-2 ${
                        data.scenario === scenario 
                          ? scenario === 'optimis' ? 'border-green-500 bg-green-50' 
                            : scenario === 'pesimis' ? 'border-red-500 bg-red-50'
                            : 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}>
                        <h4 className={`font-medium capitalize ${
                          scenario === 'optimis' ? 'text-green-700' 
                            : scenario === 'pesimis' ? 'text-red-700'
                            : 'text-blue-700'
                        }`}>
                          {scenario}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Revenue: {multiplier.revenue > 1 ? '+' : ''}{((multiplier.revenue - 1) * 100).toFixed(0)}%
                        </p>
                        <p className="text-sm text-gray-600">
                          Costs: {multiplier.costs > 1 ? '+' : ''}{((multiplier.costs - 1) * 100).toFixed(0)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Employee & Sales Team Section - REMOVED per user request */}

            {/* Mode Multi Outlet */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  🏢 Mode Multi Outlet
                </h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.useOutletMode}
                    onChange={(e) => setData(prev => ({ ...prev, useOutletMode: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Gunakan Mode Outlet</span>
                </label>
              </div>
              
              {data.useOutletMode && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Kelola multiple outlet dengan pendapatan dan biaya terpisah
                    </p>
                    <button
                      onClick={addOutlet}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      + Tambah Outlet
                    </button>
                  </div>
                  
                  {data.outlets.map((outlet, index) => (
                    <div key={outlet.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-800">Outlet {index + 1}</h4>
                        <button
                          onClick={() => removeOutlet(outlet.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Hapus
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nama Outlet
                          </label>
                          <input
                            type="text"
                            value={outlet.name}
                            onChange={(e) => updateOutlet(outlet.id, { name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Outlet Blok M"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pendapatan Harian (IDR)
                          </label>
                          <input
                            type="text"
                            value={outlet.dailyRevenue ? formatNumberWithSeparators(outlet.dailyRevenue) : ''}
                            onChange={(e) => updateOutlet(outlet.id, { dailyRevenue: handleFormattedInput(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="5.000.000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hari Operasi/Bulan
                          </label>
                          <input
                            type="number"
                            value={outlet.operatingDaysPerMonth}
                            onChange={(e) => updateOutlet(outlet.id, { operatingDaysPerMonth: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="30"
                            min="1"
                            max="31"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Biaya Operasional/Bulan (IDR)
                          </label>
                          <input
                            type="text"
                            value={outlet.monthlyOperationalCosts ? formatNumberWithSeparators(outlet.monthlyOperationalCosts) : ''}
                            onChange={(e) => updateOutlet(outlet.id, { monthlyOperationalCosts: handleFormattedInput(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="10.000.000"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Revenue Bulanan:</span>
                            <span className="font-semibold ml-2">{formatCurrency(outlet.dailyRevenue * outlet.operatingDaysPerMonth)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Biaya Bulanan:</span>
                            <span className="font-semibold ml-2">{formatCurrency(outlet.monthlyOperationalCosts)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Laba Kotor:</span>
                            <span className={`font-semibold ml-2 ${(outlet.dailyRevenue * outlet.operatingDaysPerMonth - outlet.monthlyOperationalCosts) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(outlet.dailyRevenue * outlet.operatingDaysPerMonth - outlet.monthlyOperationalCosts)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {data.outlets.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Total Semua Outlet</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Revenue:</span>
                          <span className="font-semibold ml-2 text-green-600">{formatCurrency(calculateOutletRevenue())}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Biaya:</span>
                          <span className="font-semibold ml-2 text-red-600">{formatCurrency(calculateOutletCosts())}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Laba Kotor:</span>
                          <span className={`font-semibold ml-2 ${(calculateOutletRevenue() - calculateOutletCosts()) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(calculateOutletRevenue() - calculateOutletCosts())}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(totalMonthlyRevenue)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Laba Bersih Pemilik</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrency(monthlyOwnerProfit)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">ROI Tahunan</p>
                    <p className="text-xl sm:text-2xl font-bold text-purple-600">{yearlyROI.toFixed(1)}%</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Break Even Point</p>
                    <p className="text-xl sm:text-2xl font-bold text-orange-600">
                      {breakEvenMonths ? `${breakEvenMonths} bulan` : 'N/A'}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Cost Breakdown Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Breakdown Biaya</h3>
              <div className="h-64 sm:h-80">
                <Doughnut 
                  data={costBreakdownData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          usePointStyle: true,
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Analisis Profitabilitas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Gross Revenue:</span>
                    <span className="font-semibold">{formatCurrency(totalMonthlyRevenue)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Biaya Operasional:</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(totalOperationalCosts)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Laba Kotor:</span>
                    <span className="font-semibold text-blue-600">{formatCurrency(monthlyGrossProfit)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Pajak ({data.taxRate}%):</span>
                    <span className="font-semibold text-red-600">-{formatCurrency(monthlyNetProfit - monthlyAfterTaxProfit)}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-green-50 px-3 rounded-lg">
                    <span className="font-semibold text-gray-800">Laba Bersih Pemilik ({data.ownershipPercentage}%):</span>
                    <span className="font-bold text-green-600">{formatCurrency(monthlyOwnerProfit)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Performance Indicators</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Profit Margin</span>
                      <span className="font-semibold">{((monthlyOwnerProfit / totalMonthlyRevenue) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(((monthlyOwnerProfit / totalMonthlyRevenue) * 100), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">ROI Performance (Tahunan)</span>
                      <span className="font-semibold">{yearlyROI.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(Math.abs(yearlyROI), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Cost Efficiency</span>
                      <span className="font-semibold">{((monthlyGrossProfit / totalMonthlyRevenue) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((monthlyGrossProfit / totalMonthlyRevenue) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projections' && (
          <div className="space-y-6">
            {/* Toggle between Monthly and Yearly */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Proyeksi Pertumbuhan</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setProjectionView('monthly')}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      projectionView === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Bulanan
                  </button>
                  <button
                    onClick={() => setProjectionView('yearly')}
                    className={`px-4 py-2 rounded-md text-sm transition-colors ${
                      projectionView === 'yearly' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    Tahunan
                  </button>
                </div>
              </div>

              {/* Monthly vs Yearly Projections */}
              {projectionView === 'monthly' ? (
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">Proyeksi 12 Bulan Pertama</h4>
                  <div className="h-64 sm:h-80">
                    <Line 
                      data={{
                        labels: projections.map(p => `Bulan ${p.month}`),
                        datasets: [
                          {
                            label: 'Laba Bulanan',
                            data: projections.map(p => p.profit),
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                          },
                          {
                            label: 'Kumulatif',
                            data: projections.map(p => p.cumulativeProfit),
                            borderColor: 'rgb(16, 185, 129)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                          }
                        ]
                      }} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }).format(value as number)
                              }
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">Proyeksi Multi-Tahun dengan Inflasi</h4>
                  <div className="h-64 sm:h-80">
                    <Line 
                      data={{
                        labels: yearlyProjections.map(p => `Tahun ${p.year}`),
                        datasets: [
                          {
                            label: 'Laba Tahunan',
                            data: yearlyProjections.map(p => p.yearlyProfit),
                            borderColor: 'rgb(59, 130, 246)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                          },
                          {
                            label: 'Kumulatif',
                            data: yearlyProjections.map(p => p.cumulativeProfit),
                            borderColor: 'rgb(16, 185, 129)',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                          }
                        ]
                      }} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return new Intl.NumberFormat('id-ID', {
                                  style: 'currency',
                                  currency: 'IDR',
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                }).format(value as number)
                              }
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
                              }
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ROI Trend Chart */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Trend ROI {projectionView === 'monthly' ? 'Bulanan' : 'Multi-Tahun'}
              </h3>
              <div className="h-64 sm:h-80">
                <Bar 
                  data={{
                    labels: projectionView === 'monthly' 
                      ? projections.map(p => `Bulan ${p.month}`)
                      : yearlyProjections.map(p => `Tahun ${p.year}`),
                    datasets: [
                      {
                        label: projectionView === 'monthly' ? 'ROI Bulanan (%)' : 'ROI Tahunan (%)',
                        data: projectionView === 'monthly' 
                          ? projections.map(p => p.roi)
                          : yearlyProjections.map(p => p.roi * 12), // Annualized
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1,
                      }
                    ]
                  }} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return `${value}%`
                          }
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `ROI: ${(context.parsed.y).toFixed(1)}%`
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Yearly Projections Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Detail Proyeksi Tahunan</h3>
                <p className="text-sm text-gray-600 mt-1">Mencakup dampak inflasi {data.inflationRate}% per tahun</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue Tahunan</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Tahunan</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kumulatif</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {yearlyProjections.map((projection, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Tahun {projection.year}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(projection.monthlyRevenue * 12)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={projection.yearlyProfit > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {formatCurrency(projection.yearlyProfit)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={projection.roi > 0 ? 'text-blue-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {(projection.roi * 12).toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={projection.cumulativeProfit > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {formatCurrency(projection.cumulativeProfit)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Ringkasan Proyeksi ({data.projectDuration} Tahun)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Revenue:</span>
                    <span className="font-semibold">{formatCurrency(yearlyProjections.reduce((sum, p) => sum + (p.monthlyRevenue * 12), 0))}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Total Profit:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(yearlyProjections.reduce((sum, p) => sum + p.yearlyProfit, 0))}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Rata-rata ROI Tahunan:</span>
                    <span className="font-semibold text-blue-600">{(yearlyProjections.reduce((sum, p) => sum + (p.roi * 12), 0) / yearlyProjections.length).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Payback Period:</span>
                    <span className="font-semibold text-purple-600">{breakEvenMonths ? `${breakEvenMonths} bulan` : 'Tidak profitable'}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-blue-50 px-3 rounded-lg">
                    <span className="font-semibold text-gray-800">Final Total Profit:</span>
                    <span className="font-bold text-blue-600">{formatCurrency(yearlyProjections[yearlyProjections.length - 1]?.cumulativeProfit || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Analisis & Rekomendasi</h3>
                <div className="space-y-3">
                  {monthlyOwnerProfit > 0 ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">✅ Bisnis Menguntungkan!</p>
                          <p className="text-xs text-green-700 mt-1">
                            ROI tahunan {yearlyROI.toFixed(1)}% 
                            {yearlyROI > data.inflationRate + 5 ? ' (sangat baik)' : ' (perlu optimasi)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-red-800">❌ Perlu Optimasi</p>
                          <p className="text-xs text-red-700 mt-1">Model bisnis saat ini belum menguntungkan. Pertimbangkan untuk mengurangi biaya atau meningkatkan harga.</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">📊 Break Even Analysis</p>
                        <p className="text-xs text-blue-700 mt-1">
                          {breakEvenMonths 
                            ? `Modal kembali dalam ${breakEvenMonths} bulan. ${breakEvenMonths <= 24 ? 'Cukup baik!' : 'Agak lama, pertimbangkan optimasi.'}`
                            : 'Fokus pada pengurangan biaya dan peningkatan revenue untuk mencapai break even.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-800">🚀 Strategi Inflasi</p>
                        <p className="text-xs text-purple-700 mt-1">
                          Dengan inflasi {data.inflationRate}%/tahun, pastikan pertumbuhan revenue minimal {(data.inflationRate + 5)}% untuk mempertahankan profitabilitas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {yearlyROI > 0 && yearlyROI < data.inflationRate && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800">⚠️ ROI di Bawah Inflasi</p>
                          <p className="text-xs text-yellow-700 mt-1">
                            ROI {yearlyROI.toFixed(1)}% lebih rendah dari inflasi {data.inflationRate}%. Pertimbangkan investasi lain atau optimasi model bisnis.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Perbandingan Skenario</h3>
            <p className="text-gray-600 mb-6">Bandingkan simulasi saat ini dengan simulasi yang telah disimpan sebelumnya.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Simulasi untuk Dibandingkan
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={compareCode}
                    onChange={(e) => setCompareCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Masukkan kode simulasi..."
                  />
                  <button
                    onClick={handleLoadComparison}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Muat
                  </button>
                </div>
              </div>

              {compareData && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">Simulasi Saat Ini</h4>
                    <div className="space-y-2 text-sm">
                      <div>Laba Bulanan: <span className="font-semibold">{formatCurrency(monthlyOwnerProfit)}</span></div>
                      <div>ROI Tahunan: <span className="font-semibold">{yearlyROI.toFixed(1)}%</span></div>
                      <div>Revenue Bulanan: <span className="font-semibold">{formatCurrency(totalMonthlyRevenue)}</span></div>
                      <div>Biaya Operasional: <span className="font-semibold">{formatCurrency(totalOperationalCosts)}</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">Simulasi Pembanding</h4>
                    <div className="space-y-2 text-sm">
                      <div>Laba Bulanan: <span className="font-semibold">{formatCurrency(compareResults?.monthlyProfit || 0)}</span></div>
                      <div>ROI Tahunan: <span className="font-semibold">{(compareResults?.yearlyROI || 0).toFixed(1)}%</span></div>
                      <div>Revenue Bulanan: <span className="font-semibold">{formatCurrency(compareResults?.monthlyRevenue || 0)}</span></div>
                      <div>Biaya Operasional: <span className="font-semibold">{formatCurrency(compareResults?.operationalCosts || 0)}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showSaveLoad && (
        <SaveLoadModal
          isOpen={showSaveLoad}
          onClose={() => setShowSaveLoad(false)}
          mode="save"
          currentData={data}
          onSave={(name: string) => {
            // Handle save functionality here
            console.log('Saving simulation:', name)
            setShowSaveLoad(false)
          }}
          onLoad={(loadedData, _results, _name) => {
            // Map the loaded data to the full SimulationData interface
            const validScenario = (loadedData.scenario === 'optimis' || 
                                 loadedData.scenario === 'realistis' || 
                                 loadedData.scenario === 'pesimis') 
              ? loadedData.scenario as 'optimis' | 'realistis' | 'pesimis'
              : 'realistis' as const;
              
            setData(prev => ({
              ...prev,
              initialInvestment: loadedData.initialInvestment || prev.initialInvestment,
              monthlyRevenue: loadedData.monthlyRevenue || prev.monthlyRevenue,
              netProfitMargin: loadedData.netProfitMargin || prev.netProfitMargin,
              projectDuration: loadedData.projectDuration || prev.projectDuration,
              ownershipPercentage: loadedData.ownershipPercentage || prev.ownershipPercentage,
              scenario: validScenario,
              // Keep existing properties that might not be in loadedData
              monthlyOperationalCosts: prev.monthlyOperationalCosts,
              taxRate: prev.taxRate,
              inflationRate: prev.inflationRate,
              priceIncreaseRate: prev.priceIncreaseRate,
              useOutletMode: prev.useOutletMode,
              outlets: prev.outlets
            }))
            setShowSaveLoad(false)
          }}
        />
      )}
    </div>
  )
}
