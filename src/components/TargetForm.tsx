import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Target, TrendingUp } from 'lucide-react';
import { useBusinessStore } from '@/store/businessStore';

const targetSchema = z.object({
  targetRevenue: z.number().min(1, 'Target omzet harus lebih dari 0'),
  projectionPeriod: z.number().min(1, 'Periode proyeksi minimal 1 bulan').max(60, 'Periode proyeksi maksimal 60 bulan'),
  revenueGrowthPercent: z.number().min(0, 'Pertumbuhan revenue tidak boleh negatif'),
  costGrowthPercent: z.number().min(0, 'Pertumbuhan biaya tidak boleh negatif'),
  salesClosingRate: z.number().min(0, 'Closing rate tidak boleh negatif').max(100, 'Closing rate maksimal 100%'),
  costInflationRate: z.number().min(0, 'Inflasi biaya tidak boleh negatif'),
});

type TargetFormData = z.infer<typeof targetSchema>;

export default function TargetForm() {
  const { currentPlan, updateBusinessTarget } = useBusinessStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TargetFormData>({
    resolver: zodResolver(targetSchema),
    defaultValues: currentPlan?.businessTarget || {
      targetRevenue: 100000000,
      projectionPeriod: 12,
      revenueGrowthPercent: 10,
      costGrowthPercent: 5,
      salesClosingRate: 20,
      costInflationRate: 3,
    },
  });

  const onSubmit = (data: TargetFormData) => {
    updateBusinessTarget(data);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const currentTarget = currentPlan?.businessTarget;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-800">📈 Target & Pertumbuhan</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Omzet */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Omzet Akhir (Rp) *
            </label>
            <input
              {...register('targetRevenue', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="100000000"
            />
            {errors.targetRevenue && (
              <p className="text-red-500 text-sm mt-1">{errors.targetRevenue.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Contoh: Rp 100.000.000 untuk target 100 juta rupiah
            </p>
          </div>

          {/* Periode Proyeksi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lama Proyeksi (Bulan) *
            </label>
            <select
              {...register('projectionPeriod', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
            >
              <option value={6}>6 Bulan</option>
              <option value={12}>12 Bulan</option>
              <option value={18}>18 Bulan</option>
              <option value={24}>24 Bulan</option>
              <option value={36}>36 Bulan</option>
            </select>
            {errors.projectionPeriod && (
              <p className="text-red-500 text-sm mt-1">{errors.projectionPeriod.message}</p>
            )}
          </div>

          {/* Pertumbuhan Revenue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pertumbuhan Revenue (% per bulan) *
            </label>
            <input
              {...register('revenueGrowthPercent', { valueAsNumber: true })}
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="10"
            />
            {errors.revenueGrowthPercent && (
              <p className="text-red-500 text-sm mt-1">{errors.revenueGrowthPercent.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Persentase kenaikan penjualan setiap bulan
            </p>
          </div>

          {/* Pertumbuhan Biaya */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pertumbuhan Biaya Operasional (% per bulan) *
            </label>
            <input
              {...register('costGrowthPercent', { valueAsNumber: true })}
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="5"
            />
            {errors.costGrowthPercent && (
              <p className="text-red-500 text-sm mt-1">{errors.costGrowthPercent.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Inflasi biaya operasional per bulan
            </p>
          </div>

          {/* Sales Closing Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimasi Sales Closing Rate (%) *
            </label>
            <input
              {...register('salesClosingRate', { valueAsNumber: true })}
              type="number"
              step="0.1"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="20"
            />
            {errors.salesClosingRate && (
              <p className="text-red-500 text-sm mt-1">{errors.salesClosingRate.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Persentase prospek yang berhasil closing
            </p>
          </div>

          {/* Inflasi Biaya */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimasi Kenaikan Biaya/Server (% per bulan)
            </label>
            <input
              {...register('costInflationRate', { valueAsNumber: true })}
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="3"
            />
            {errors.costInflationRate && (
              <p className="text-red-500 text-sm mt-1">{errors.costInflationRate.message}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Untuk SaaS: scaling cost, untuk bisnis lain: inflasi umum
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          >
            <TrendingUp className="w-5 h-5" />
            Simpan Target & Proyeksi
          </button>
        </div>
      </form>

      {/* Current Target Summary */}
      {currentTarget && (
        <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="text-lg font-medium text-purple-800 mb-3">📋 Ringkasan Target Saat Ini</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-purple-700">Target Omzet:</span>
              <br />
              <span className="text-purple-900">{formatCurrency(currentTarget.targetRevenue)}</span>
            </div>
            <div>
              <span className="font-medium text-purple-700">Periode:</span>
              <br />
              <span className="text-purple-900">{currentTarget.projectionPeriod} bulan</span>
            </div>
            <div>
              <span className="font-medium text-purple-700">Growth Revenue:</span>
              <br />
              <span className="text-purple-900">{currentTarget.revenueGrowthPercent}%/bulan</span>
            </div>
            <div>
              <span className="font-medium text-purple-700">Growth Biaya:</span>
              <br />
              <span className="text-purple-900">{currentTarget.costGrowthPercent}%/bulan</span>
            </div>
            <div>
              <span className="font-medium text-purple-700">Closing Rate:</span>
              <br />
              <span className="text-purple-900">{currentTarget.salesClosingRate}%</span>
            </div>
            <div>
              <span className="font-medium text-purple-700">Inflasi Biaya:</span>
              <br />
              <span className="text-purple-900">{currentTarget.costInflationRate}%/bulan</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
