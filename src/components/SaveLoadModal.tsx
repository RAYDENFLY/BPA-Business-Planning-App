'use client';

import React, { useState } from 'react';
import { X, Save, Download, AlertCircle } from 'lucide-react'

interface SimulationData {
  initialInvestment: number;
  monthlyRevenue: number;
  netProfitMargin: number;
  projectDuration: number;
  ownershipPercentage: number;
  scenario: string;
}

interface SimulationResults {
  annualROI: number;
  paybackPeriodRounded: number;
}

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (name: string) => void;
  onLoad?: (data: SimulationData, results: SimulationResults, name: string) => void;
  currentData?: SimulationData;
  currentResults?: SimulationResults;
  mode: 'save' | 'load';
}

export default function SaveLoadModal({
  isOpen,
  onClose,
  onSave,
  onLoad,
  currentData,
  currentResults,
  mode
}: SaveLoadModalProps) {
  const [simulationName, setSimulationName] = useState('');
  const [loadCode, setLoadCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [savedCode, setSavedCode] = useState('');
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  const handleSave = async () => {
    if (!simulationName.trim()) {
      setMessage('Nama simulasi harus diisi');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: simulationName.trim(),
          data: currentData,
          results: currentResults
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setSavedCode(result.code);
        setShowCodeDialog(true);
        setMessage(`✅ Simulasi berhasil disimpan dengan kode: ${result.code}`);
        onSave?.(simulationName);
      } else {
        setMessage('❌ Gagal menyimpan simulasi');
      }
    } catch (error) {
      console.error('Error saving simulation:', error);
      setMessage('❌ Terjadi kesalahan saat menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleLoadByCode = async () => {
    if (!loadCode.trim()) {
      setMessage('Kode simulasi harus diisi');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/simulations/${loadCode.trim()}`);
      const result = await response.json();
      
      if (result.success) {
        onLoad?.(result.simulation.data, result.simulation.results, result.simulation.name);
        setMessage('✅ Simulasi berhasil dimuat');
        setTimeout(() => {
          setLoadCode('');
          setMessage('');
          onClose();
        }, 1000);
      } else {
        setMessage('❌ Simulasi dengan kode tersebut tidak ditemukan');
      }
    } catch (error) {
      console.error('Error loading simulation:', error);
      setMessage('❌ Terjadi kesalahan saat memuat simulasi');
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMessage('✅ Kode berhasil dicopy ke clipboard!');
    } catch {
      setMessage('❌ Gagal copy kode. Silakan copy manual.');
    }
  };

  const handleCloseCodeDialog = () => {
    setShowCodeDialog(false);
    setSimulationName('');
    setMessage('');
    setSavedCode('');
    onClose();
  };

  if (!isOpen) return null;

  // Code Success Dialog
  if (showCodeDialog) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-xl">
            <div className="flex items-center gap-3">
              <Save className="w-6 h-6" />
              <h2 className="text-xl font-bold">Simulasi Berhasil Disimpan! 🎉</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-gray-700 mb-4">Kode simulasi Anda adalah:</p>
              
              <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold text-green-600 tracking-wider mb-2">
                  {savedCode}
                </div>
                <div className="text-sm text-gray-600">
                  Simpan kode ini untuk akses di masa depan
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(savedCode)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  📋 Copy Kode
                </button>
                <button
                  onClick={handleCloseCodeDialog}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  ✅ Selesai
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-sm text-amber-800">
                <div className="font-semibold mb-1">💡 Tips:</div>
                <div>• Bagikan kode ini dengan rekan bisnis untuk kolaborasi</div>
                <div>• Gunakan kode untuk memuat simulasi di perangkat lain</div>
                <div>• Kode bersifat permanen dan tidak akan berubah</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`${mode === 'save' ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mode === 'save' ? <Save className="w-6 h-6" /> : <Download className="w-6 h-6" />}
              <h2 className="text-xl font-bold">
                {mode === 'save' ? 'Simpan Simulasi' : 'Muat Simulasi'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className={`${mode === 'save' ? 'text-green-100' : 'text-blue-100'} mt-2`}>
            {mode === 'save' 
              ? 'Simpan hasil simulasi untuk referensi dan perbandingan di masa depan'
              : 'Muat simulasi yang telah disimpan sebelumnya menggunakan kode'
            }
          </p>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg border ${
              message.includes('✅') 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : message.includes('❌')
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
            }`}>
              {message}
            </div>
          )}

          {mode === 'save' ? (
            /* Save Mode */
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Simulasi *
                </label>
                <input
                  type="text"
                  value={simulationName}
                  onChange={(e) => setSimulationName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Misal: Simulasi Cafe Downtown - Skenario Optimis"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Berikan nama yang deskriptif untuk memudahkan identifikasi
                </p>
              </div>

              {/* Preview Current Data */}
              {currentData && currentResults && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-3">📊 Preview Data yang akan Disimpan:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="space-y-2 text-gray-800">
                        <div>Modal Awal: <span className="font-semibold text-gray-900">{formatCurrency(currentData.initialInvestment)}</span></div>
                        <div>Omzet Bulanan: <span className="font-semibold text-gray-900">{formatCurrency(currentData.monthlyRevenue)}</span></div>
                        <div>Margin Laba: <span className="font-semibold text-gray-900">{formatPercent(currentData.netProfitMargin)}</span></div>
                        <div>Durasi: <span className="font-semibold text-gray-900">{currentData.projectDuration} tahun</span></div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2 text-gray-800">
                        <div>ROI Tahunan: <span className="font-semibold text-green-700">{formatPercent(currentResults.annualROI)}</span></div>
                        <div>Payback: <span className="font-semibold text-gray-900">{currentResults.paybackPeriodRounded} bulan</span></div>
                        <div>Kepemilikan: <span className="font-semibold text-gray-900">{formatPercent(currentData.ownershipPercentage)}</span></div>
                        <div>Skenario: <span className="font-semibold text-gray-900 capitalize">{currentData.scenario}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !simulationName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Simpan Simulasi
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            /* Load Mode */
            <div className="space-y-6">
              {/* Load by Code */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">🔢 Muat dengan Kode Simulasi</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={loadCode}
                    onChange={(e) => setLoadCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan kode simulasi (8 karakter)"
                    maxLength={8}
                  />
                  <button
                    onClick={handleLoadByCode}
                    disabled={loading || !loadCode.trim()}
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
                <p className="text-xs text-gray-500 mt-2">
                  Masukkan kode 8 karakter yang diperoleh saat menyimpan simulasi
                </p>
              </div>

              {/* Instructions */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  💡 Tips Penggunaan
                </h4>
                <div className="text-sm text-amber-700 space-y-1">
                  <div>• Simpan simulasi Anda untuk mendapatkan kode unik</div>
                  <div>• Bagikan kode dengan rekan bisnis untuk kolaborasi</div>
                  <div>• Kode bersifat permanen dan dapat digunakan kapan saja</div>
                  <div>• Gunakan fitur perbandingan untuk analisis multi-skenario</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
