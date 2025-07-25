'use client';

import React, { useState } from 'react';
import { X, GitCompare, AlertCircle, TrendingUp, Download } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData?: Record<string, unknown>;
  currentResults?: Record<string, unknown>;
  currentName: string;
}

export default function ComparisonModal({
  isOpen,
  onClose,
  currentData,
  currentResults,
  currentName
}: ComparisonModalProps) {
  const [compareCode, setCompareCode] = useState('');
  const [compareData, setCompareData] = useState<Record<string, unknown> | null>(null);
  const [compareResults, setCompareResults] = useState<Record<string, unknown> | null>(null);
  const [compareName, setCompareName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoadComparison = async () => {
    if (!compareCode.trim()) {
      setMessage('Masukkan kode simulasi untuk dibandingkan');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/simulations/${compareCode.trim()}`);
      const result = await response.json();
      
      if (result.success) {
        setCompareData(result.simulation.data);
        setCompareResults(result.simulation.results);
        setCompareName(result.simulation.name);
        setMessage('✅ Simulasi berhasil dimuat untuk perbandingan');
      } else {
        setMessage('❌ Simulasi dengan kode tersebut tidak ditemukan');
        setCompareData(null);
        setCompareResults(null);
        setCompareName('');
      }
    } catch (error) {
      console.error('Error loading comparison:', error);
      setMessage('❌ Terjadi kesalahan saat memuat simulasi');
      setCompareData(null);
      setCompareResults(null);
      setCompareName('');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getBestValue = (current: number, compare: number, higherIsBetter = true) => {
    if (higherIsBetter) {
      return current > compare ? 'current' : current < compare ? 'compare' : 'tie';
    } else {
      return current < compare ? 'current' : current > compare ? 'compare' : 'tie';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GitCompare className="w-6 h-6" />
              <h2 className="text-xl font-bold">Perbandingan Simulasi</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-purple-100 mt-2">
            Bandingkan simulasi saat ini dengan simulasi lain menggunakan kode
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Load Comparison */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">🔢 Muat Simulasi untuk Perbandingan</h4>
            
            {/* Message */}
            {message && (
              <div className={`mb-3 p-3 rounded-lg border ${
                message.includes('✅') 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={compareCode}
                onChange={(e) => setCompareCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan kode simulasi (8 karakter)"
                maxLength={8}
              />
              <button
                onClick={handleLoadComparison}
                disabled={loading || !compareCode.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Muat
              </button>
            </div>
          </div>

          {/* Comparison Table */}
          {currentResults && compareResults && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                  📊 Hasil Perbandingan
                </h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-300 rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Metrik</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">
                          {currentName}
                          <div className="text-xs text-gray-700 font-normal mt-1">(Simulasi Saat Ini)</div>
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">
                          {compareName}
                          <div className="text-xs text-gray-700 font-normal mt-1">(Kode: {compareCode})</div>
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Selisih</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {/* ROI Comparison */}
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">ROI Tahunan</td>
                        <td className={`py-3 px-4 text-center font-bold border-r border-gray-200 ${
                          getBestValue(currentResults.annualROI as number, compareResults.annualROI as number) === 'current' 
                            ? 'text-green-700 bg-green-100' 
                            : getBestValue(currentResults.annualROI as number, compareResults.annualROI as number) === 'compare'
                              ? 'text-gray-800'
                              : 'text-blue-700'
                        }`}>
                          {formatPercent(currentResults.annualROI as number)}
                          {getBestValue(currentResults.annualROI as number, compareResults.annualROI as number) === 'current' && ' 🏆'}
                        </td>
                        <td className={`py-3 px-4 text-center font-bold border-r border-gray-200 ${
                          getBestValue(currentResults.annualROI as number, compareResults.annualROI as number) === 'compare' 
                            ? 'text-green-700 bg-green-100' 
                            : getBestValue(currentResults.annualROI as number, compareResults.annualROI as number) === 'current'
                              ? 'text-gray-800'
                              : 'text-blue-700'
                        }`}>
                          {formatPercent(compareResults.annualROI as number)}
                          {getBestValue(currentResults.annualROI as number, compareResults.annualROI as number) === 'compare' && ' 🏆'}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-900">
                          {(currentResults.annualROI as number) > (compareResults.annualROI as number) ? '+' : ''}
                          {formatPercent((currentResults.annualROI as number) - (compareResults.annualROI as number))}
                        </td>
                      </tr>

                      {/* Payback Period */}
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Payback Period (Bulan)</td>
                        <td className={`py-3 px-4 text-center font-bold border-r border-gray-200 ${
                          getBestValue(currentResults.paybackPeriodRounded as number, compareResults.paybackPeriodRounded as number, false) === 'current' 
                            ? 'text-green-700 bg-green-100' 
                            : getBestValue(currentResults.paybackPeriodRounded as number, compareResults.paybackPeriodRounded as number, false) === 'compare'
                              ? 'text-gray-800'
                              : 'text-blue-700'
                        }`}>
                          {currentResults.paybackPeriodRounded as number}
                          {getBestValue(currentResults.paybackPeriodRounded as number, compareResults.paybackPeriodRounded as number, false) === 'current' && ' 🏆'}
                        </td>
                        <td className={`py-3 px-4 text-center font-bold border-r border-gray-200 ${
                          getBestValue(currentResults.paybackPeriodRounded as number, compareResults.paybackPeriodRounded as number, false) === 'compare' 
                            ? 'text-green-700 bg-green-100' 
                            : getBestValue(currentResults.paybackPeriodRounded as number, compareResults.paybackPeriodRounded as number, false) === 'current'
                              ? 'text-gray-800'
                              : 'text-blue-700'
                        }`}>
                          {compareResults.paybackPeriodRounded as number}
                          {getBestValue(currentResults.paybackPeriodRounded as number, compareResults.paybackPeriodRounded as number, false) === 'compare' && ' 🏆'}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-900">
                          {(currentResults.paybackPeriodRounded as number) < (compareResults.paybackPeriodRounded as number) ? '-' : '+'}
                          {Math.abs((currentResults.paybackPeriodRounded as number) - (compareResults.paybackPeriodRounded as number))} bulan
                        </td>
                      </tr>

                      {/* Modal Awal */}
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Modal Awal</td>
                        <td className="py-3 px-4 text-center font-bold text-gray-800 border-r border-gray-200">{formatCurrency(currentData?.initialInvestment as number || 0)}</td>
                        <td className="py-3 px-4 text-center font-bold text-gray-800 border-r border-gray-200">{formatCurrency(compareData?.initialInvestment as number || 0)}</td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-900">
                          {formatCurrency((currentData?.initialInvestment as number || 0) - (compareData?.initialInvestment as number || 0))}
                        </td>
                      </tr>

                      {/* Laba Tahunan */}
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">Laba Bersih/Tahun</td>
                        <td className={`py-3 px-4 text-center font-bold border-r border-gray-200 ${
                          getBestValue((currentResults.yearlyNetProfitAfterTax as number) * ((currentData?.ownershipPercentage as number || 100) / 100), 
                                     (compareResults.yearlyNetProfitAfterTax as number) * ((compareData?.ownershipPercentage as number || 100) / 100)) === 'current' 
                            ? 'text-green-700 bg-green-100' 
                            : getBestValue((currentResults.yearlyNetProfitAfterTax as number) * ((currentData?.ownershipPercentage as number || 100) / 100), 
                                         (compareResults.yearlyNetProfitAfterTax as number) * ((compareData?.ownershipPercentage as number || 100) / 100)) === 'compare'
                              ? 'text-gray-800'
                              : 'text-blue-700'
                        }`}>
                          {formatCurrency((currentResults.yearlyNetProfitAfterTax as number) * ((currentData?.ownershipPercentage as number || 100) / 100))}
                          {getBestValue((currentResults.yearlyNetProfitAfterTax as number) * ((currentData?.ownershipPercentage as number || 100) / 100), 
                                       (compareResults.yearlyNetProfitAfterTax as number) * ((compareData?.ownershipPercentage as number || 100) / 100)) === 'current' && ' 🏆'}
                        </td>
                        <td className={`py-3 px-4 text-center font-bold border-r border-gray-200 ${
                          getBestValue((currentResults.yearlyNetProfitAfterTax as number) * ((currentData?.ownershipPercentage as number || 100) / 100), 
                                     (compareResults.yearlyNetProfitAfterTax as number) * ((compareData?.ownershipPercentage as number || 100) / 100)) === 'compare' 
                            ? 'text-green-700 bg-green-100' 
                            : getBestValue((currentResults.yearlyNetProfitAfterTax as number) * ((currentData?.ownershipPercentage as number || 100) / 100), 
                                         (compareResults.yearlyNetProfitAfterTax as number) * ((compareData?.ownershipPercentage as number || 100) / 100)) === 'current'
                              ? 'text-gray-800'
                              : 'text-blue-700'
                        }`}>
                          {formatCurrency((compareResults.yearlyNetProfitAfterTax as number) * ((compareData?.ownershipPercentage as number || 100) / 100))}
                          {getBestValue((currentResults.yearlyNetProfitAfterTax as number) * ((currentData?.ownershipPercentage as number || 100) / 100), 
                                       (compareResults.yearlyNetProfitAfterTax as number) * ((compareData?.ownershipPercentage as number || 100) / 100)) === 'compare' && ' 🏆'}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-900">
                          {formatCurrency(((currentResults.yearlyNetProfitAfterTax as number) * ((currentData?.ownershipPercentage as number || 100) / 100)) - 
                                        ((compareResults.yearlyNetProfitAfterTax as number) * ((compareData?.ownershipPercentage as number || 100) / 100)))}
                        </td>
                      </tr>

                      {/* ROI vs Inflasi */}
                      <tr className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-900 border-r border-gray-200">ROI vs Inflasi</td>
                        <td className={`py-3 px-4 text-center font-bold border-r border-gray-200 ${
                          getBestValue(currentResults.averageROIWithInflation as number, compareResults.averageROIWithInflation as number) === 'current' 
                            ? 'text-green-700 bg-green-100' 
                            : getBestValue(currentResults.averageROIWithInflation as number, compareResults.averageROIWithInflation as number) === 'compare'
                              ? 'text-gray-800'
                              : 'text-blue-700'
                        }`}>
                          {formatPercent(currentResults.averageROIWithInflation as number)}
                          {getBestValue(currentResults.averageROIWithInflation as number, compareResults.averageROIWithInflation as number) === 'current' && ' 🏆'}
                        </td>
                        <td className={`py-3 px-4 text-center font-bold border-r border-gray-200 ${
                          getBestValue(currentResults.averageROIWithInflation as number, compareResults.averageROIWithInflation as number) === 'compare' 
                            ? 'text-green-700 bg-green-100' 
                            : getBestValue(currentResults.averageROIWithInflation as number, compareResults.averageROIWithInflation as number) === 'current'
                              ? 'text-gray-800'
                              : 'text-blue-700'
                        }`}>
                          {formatPercent(compareResults.averageROIWithInflation as number)}
                          {getBestValue(currentResults.averageROIWithInflation as number, compareResults.averageROIWithInflation as number) === 'compare' && ' 🏆'}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-900">
                          {(currentResults.averageROIWithInflation as number) > (compareResults.averageROIWithInflation as number) ? '+' : ''}
                          {formatPercent((currentResults.averageROIWithInflation as number) - (compareResults.averageROIWithInflation as number))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Insights */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  💡 Insight Perbandingan
                </h4>
                <div className="text-sm text-amber-700 space-y-2">
                  {(currentResults.annualROI as number) > (compareResults.annualROI as number) ? (
                    <div>• <strong>{currentName}</strong> memiliki ROI yang lebih tinggi ({formatPercent((currentResults.annualROI as number) - (compareResults.annualROI as number))} lebih baik)</div>
                  ) : (currentResults.annualROI as number) < (compareResults.annualROI as number) ? (
                    <div>• <strong>{compareName}</strong> memiliki ROI yang lebih tinggi ({formatPercent((compareResults.annualROI as number) - (currentResults.annualROI as number))} lebih baik)</div>
                  ) : (
                    <div>• Kedua simulasi memiliki ROI yang sama</div>
                  )}
                  
                  {(currentResults.paybackPeriodRounded as number) < (compareResults.paybackPeriodRounded as number) ? (
                    <div>• <strong>{currentName}</strong> memiliki payback period yang lebih cepat ({(compareResults.paybackPeriodRounded as number) - (currentResults.paybackPeriodRounded as number)} bulan lebih cepat)</div>
                  ) : (currentResults.paybackPeriodRounded as number) > (compareResults.paybackPeriodRounded as number) ? (
                    <div>• <strong>{compareName}</strong> memiliki payback period yang lebih cepat ({(currentResults.paybackPeriodRounded as number) - (compareResults.paybackPeriodRounded as number)} bulan lebih cepat)</div>
                  ) : (
                    <div>• Kedua simulasi memiliki payback period yang sama</div>
                  )}

                  <div>• Modal awal <strong>{currentName}</strong> {(currentData?.initialInvestment as number || 0) > (compareData?.initialInvestment as number || 0) ? 'lebih besar' : (currentData?.initialInvestment as number || 0) < (compareData?.initialInvestment as number || 0) ? 'lebih kecil' : 'sama'} {(currentData?.initialInvestment as number || 0) !== (compareData?.initialInvestment as number || 0) && `(${formatCurrency(Math.abs((currentData?.initialInvestment as number || 0) - (compareData?.initialInvestment as number || 0)))})`}</div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions when no comparison loaded */}
          {!compareResults && (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Siap untuk Perbandingan</p>
              <p className="text-sm">Masukkan kode simulasi di atas untuk mulai membandingkan hasil</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
