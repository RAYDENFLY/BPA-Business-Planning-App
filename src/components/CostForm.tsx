import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { useBusinessStore } from '@/store/businessStore';
import { FixedCost, VariableCost } from '@/types/business';

// Fixed Cost Schema
const fixedCostSchema = z.object({
  name: z.string().min(1, 'Nama biaya wajib diisi'),
  amount: z.number().min(0, 'Jumlah harus lebih dari 0'),
  category: z.enum(['rent', 'utilities', 'software', 'salary', 'other']),
});

// Variable Cost Schema
const variableCostSchema = z.object({
  name: z.string().min(1, 'Nama biaya wajib diisi'),
  type: z.enum(['per-unit', 'percentage', 'fixed']),
  value: z.number().min(0, 'Nilai harus lebih dari 0'),
  productId: z.string().optional(),
  category: z.enum(['production', 'payment-gateway', 'support', 'advertising', 'commission', 'other']),
});

type FixedCostFormData = z.infer<typeof fixedCostSchema>;
type VariableCostFormData = z.infer<typeof variableCostSchema>;

export default function CostForm() {
  const { 
    currentPlan, 
    addFixedCost, 
    updateFixedCost, 
    removeFixedCost,
    addVariableCost,
    updateVariableCost,
    removeVariableCost 
  } = useBusinessStore();
  
  const [activeTab, setActiveTab] = useState<'fixed' | 'variable'>('fixed');
  const [editingFixedId, setEditingFixedId] = useState<string | null>(null);
  const [editingVariableId, setEditingVariableId] = useState<string | null>(null);
  
  // Fixed Cost Form
  const fixedCostForm = useForm<FixedCostFormData>({
    resolver: zodResolver(fixedCostSchema),
    defaultValues: {
      name: '',
      amount: 0,
      category: 'other',
    },
  });

  // Variable Cost Form
  const variableCostForm = useForm<VariableCostFormData>({
    resolver: zodResolver(variableCostSchema),
    defaultValues: {
      name: '',
      type: 'fixed',
      value: 0,
      category: 'other',
    },
  });

  const fixedCosts = currentPlan?.fixedCosts || [];
  const variableCosts = currentPlan?.variableCosts || [];
  const products = currentPlan?.products || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      rent: 'Sewa',
      utilities: 'Internet & Listrik',
      software: 'Tools/Software',
      salary: 'Gaji Admin',
      production: 'Biaya Produksi',
      'payment-gateway': 'Fee Payment Gateway',
      support: 'Support/Customer Service',
      advertising: 'Iklan',
      commission: 'Komisi Sales',
      other: 'Lainnya',
    };
    return categories[category as keyof typeof categories] || category;
  };

  // Fixed Cost Handlers
  const onSubmitFixedCost = (data: FixedCostFormData) => {
    if (editingFixedId) {
      updateFixedCost(editingFixedId, data);
      setEditingFixedId(null);
    } else {
      addFixedCost(data);
    }
    fixedCostForm.reset();
  };

  const handleEditFixedCost = (cost: FixedCost) => {
    setEditingFixedId(cost.id);
    fixedCostForm.reset(cost);
  };

  const handleCancelFixedCost = () => {
    setEditingFixedId(null);
    fixedCostForm.reset();
  };

  // Variable Cost Handlers
  const onSubmitVariableCost = (data: VariableCostFormData) => {
    if (editingVariableId) {
      updateVariableCost(editingVariableId, data);
      setEditingVariableId(null);
    } else {
      addVariableCost(data);
    }
    variableCostForm.reset();
  };

  const handleEditVariableCost = (cost: VariableCost) => {
    setEditingVariableId(cost.id);
    variableCostForm.reset(cost);
  };

  const handleCancelVariableCost = () => {
    setEditingVariableId(null);
    variableCostForm.reset();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-semibold text-gray-800">💸 Input Biaya Tetap & Variabel</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('fixed')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'fixed'
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Biaya Tetap
        </button>
        <button
          onClick={() => setActiveTab('variable')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'variable'
              ? 'border-b-2 border-red-500 text-red-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Biaya Variabel
        </button>
      </div>

      {/* Fixed Cost Tab */}
      {activeTab === 'fixed' && (
        <div>
          <form onSubmit={fixedCostForm.handleSubmit(onSubmitFixedCost)} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Biaya *
                </label>
                <input
                  {...fixedCostForm.register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="Contoh: Sewa Kantor"
                />
                {fixedCostForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{fixedCostForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori *
                </label>
                <select
                  {...fixedCostForm.register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  <option value="rent">Sewa</option>
                  <option value="utilities">Internet & Listrik</option>
                  <option value="software">Tools/Software</option>
                  <option value="salary">Gaji Admin</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah per Bulan (Rp) *
                </label>
                <input
                  {...fixedCostForm.register('amount', { valueAsNumber: true })}
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="2000000"
                />
                {fixedCostForm.formState.errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{fixedCostForm.formState.errors.amount.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Plus className="w-4 h-4" />
                {editingFixedId ? 'Update Biaya' : 'Tambah Biaya Tetap'}
              </button>
              {editingFixedId && (
                <button
                  type="button"
                  onClick={handleCancelFixedCost}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          {/* Fixed Costs List */}
          {fixedCosts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Daftar Biaya Tetap</h3>
              <div className="space-y-3">
                {fixedCosts.map((cost) => (
                  <div
                    key={cost.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{cost.name}</h4>
                      <p className="text-sm text-gray-600">
                        {getCategoryLabel(cost.category)} • {formatCurrency(cost.amount)}/bulan
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditFixedCost(cost)}
                        className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeFixedCost(cost.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Variable Cost Tab */}
      {activeTab === 'variable' && (
        <div>
          <form onSubmit={variableCostForm.handleSubmit(onSubmitVariableCost)} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Biaya *
                </label>
                <input
                  {...variableCostForm.register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="Contoh: Fee Payment Gateway"
                />
                {variableCostForm.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{variableCostForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori *
                </label>
                <select
                  {...variableCostForm.register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  <option value="production">Biaya Produksi</option>
                  <option value="payment-gateway">Fee Payment Gateway</option>
                  <option value="support">Support/Customer Service</option>
                  <option value="advertising">Iklan</option>
                  <option value="commission">Komisi Sales</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Biaya *
                </label>
                <select
                  {...variableCostForm.register('type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  <option value="per-unit">Per Unit</option>
                  <option value="percentage">Persentase dari Revenue</option>
                  <option value="fixed">Nominal Tetap</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nilai *
                </label>
                <input
                  {...variableCostForm.register('value', { valueAsNumber: true })}
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder={
                    variableCostForm.watch('type') === 'percentage' ? '2.5' : 
                    variableCostForm.watch('type') === 'per-unit' ? '5000' : '100000'
                  }
                />
                {variableCostForm.formState.errors.value && (
                  <p className="text-red-500 text-sm mt-1">{variableCostForm.formState.errors.value.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produk Terkait (Opsional)
                </label>
                <select
                  {...variableCostForm.register('productId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  <option value="">Semua Produk</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <Plus className="w-4 h-4" />
                {editingVariableId ? 'Update Biaya' : 'Tambah Biaya Variabel'}
              </button>
              {editingVariableId && (
                <button
                  type="button"
                  onClick={handleCancelVariableCost}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Batal
                </button>
              )}
            </div>
          </form>

          {/* Variable Costs List */}
          {variableCosts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Daftar Biaya Variabel</h3>
              <div className="space-y-3">
                {variableCosts.map((cost) => (
                  <div
                    key={cost.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{cost.name}</h4>
                      <p className="text-sm text-gray-600">
                        {getCategoryLabel(cost.category)} • {' '}
                        {cost.type === 'percentage' ? `${cost.value}% dari revenue` :
                         cost.type === 'per-unit' ? `${formatCurrency(cost.value)}/unit` :
                         `${formatCurrency(cost.value)} tetap`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditVariableCost(cost)}
                        className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeVariableCost(cost.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
