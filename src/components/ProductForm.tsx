import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Package, X } from 'lucide-react';
import { useBusinessStore } from '@/store/businessStore';
import { Product } from '@/types/business';
import { analytics } from '@/lib/analytics';

const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  price: z.number().min(0, 'Harga harus lebih dari 0'),
  type: z.enum(['subscription', 'one-time', 'service']),
  estimatedSalesPerMonth: z.number().min(0, 'Estimasi penjualan harus lebih dari 0'),
  targetGrowthPercent: z.number().min(0, 'Target growth tidak boleh negatif'),
  salesCommission: z.object({
    type: z.enum(['percentage', 'fixed']),
    value: z.number().min(0, 'Komisi tidak boleh negatif'),
  }),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { currentPlan, addProduct, updateProduct, removeProduct } = useBusinessStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [priceDisplay, setPriceDisplay] = useState<string>('');
  const [commissionDisplay, setCommissionDisplay] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      price: 0,
      type: 'one-time',
      estimatedSalesPerMonth: 0,
      targetGrowthPercent: 10,
      salesCommission: {
        type: 'percentage',
        value: 5,
      },
    },
  });

  const products = currentPlan?.products || [];
  const commissionType = watch('salesCommission.type');

  // Reset commission display when type changes
  useEffect(() => {
    if (commissionType === 'percentage') {
      setCommissionDisplay('');
    } else {
      setCommissionDisplay('');
    }
  }, [commissionType]);

  const onSubmit = (data: ProductFormData) => {
    if (editingId) {
      updateProduct(editingId, data);
      analytics.productUpdated(data.type);
      setEditingId(null);
    } else {
      addProduct(data);
      analytics.productAdded(data.type);
    }
    reset();
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    reset(product);
  };

  const handleCancel = () => {
    setEditingId(null);
    reset();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">📦 Input Produk & Revenue</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Produk *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Contoh: Aplikasi Kasir"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga per Unit (Rp) *
            </label>
            <input
              type="text"
              value={priceDisplay}
              onChange={(e) => {
                const value = e.target.value;
                setPriceDisplay(value);
                const numericValue = handleFormattedInput(value);
                setValue('price', numericValue);
              }}
              onBlur={(e) => {
                const numericValue = handleFormattedInput(e.target.value);
                if (numericValue > 0) {
                  setPriceDisplay(formatNumberWithSeparators(numericValue));
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="500.000"
            />
            {watch('price') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrencyDisplay(watch('price'))}
              </p>
            )}
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Produk *
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="subscription">Langganan (Subscription)</option>
              <option value="one-time">Sekali Beli</option>
              <option value="service">Jasa/Proyek</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimasi Penjualan/Bulan *
            </label>
            <input
              {...register('estimatedSalesPerMonth', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="10"
            />
            {errors.estimatedSalesPerMonth && (
              <p className="text-red-500 text-sm mt-1">{errors.estimatedSalesPerMonth.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Growth (% per bulan)
            </label>
            <input
              {...register('targetGrowthPercent', { valueAsNumber: true })}
              type="number"
              step="0.1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="10"
            />
            {errors.targetGrowthPercent && (
              <p className="text-red-500 text-sm mt-1">{errors.targetGrowthPercent.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sales Commission
            </label>
            <div className="flex gap-2">
              <select
                {...register('salesCommission.type')}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="percentage">%</option>
                <option value="fixed">Nominal</option>
              </select>
              <input
                type="text"
                value={commissionDisplay}
                onChange={(e) => {
                  const value = e.target.value;
                  setCommissionDisplay(value);
                  if (commissionType === 'fixed') {
                    const numericValue = handleFormattedInput(value);
                    setValue('salesCommission.value', numericValue);
                  } else {
                    // For percentage, just parse as number
                    const numericValue = parseFloat(value.replace(/[^\d.]/g, '')) || 0;
                    setValue('salesCommission.value', numericValue);
                  }
                }}
                onBlur={(e) => {
                  if (commissionType === 'fixed') {
                    const numericValue = handleFormattedInput(e.target.value);
                    if (numericValue > 0) {
                      setCommissionDisplay(formatNumberWithSeparators(numericValue));
                    }
                  }
                }}
                step="0.1"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder={commissionType === 'percentage' ? '5' : '50.000'}
              />
            </div>
            {commissionType === 'fixed' && watch('salesCommission.value') > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrencyDisplay(watch('salesCommission.value'))}
              </p>
            )}
            {errors.salesCommission?.value && (
              <p className="text-red-500 text-sm mt-1">{errors.salesCommission.value.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4" />
            {editingId ? 'Update Produk' : 'Tambah Produk'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      {products.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Daftar Produk</h3>
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{product.name}</h4>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Harga:</span> {formatCurrency(product.price)}
                      </div>
                      <div>
                        <span className="font-medium">Jenis:</span>{' '}
                        {product.type === 'subscription' ? 'Langganan' : 
                         product.type === 'one-time' ? 'Sekali Beli' : 'Jasa/Proyek'}
                      </div>
                      <div>
                        <span className="font-medium">Penjualan/Bulan:</span> {product.estimatedSalesPerMonth} unit
                      </div>
                      <div>
                        <span className="font-medium">Growth:</span> {product.targetGrowthPercent}%/bulan
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      <span className="font-medium">Komisi:</span>{' '}
                      {product.salesCommission.type === 'percentage'
                        ? `${product.salesCommission.value}%`
                        : formatCurrency(product.salesCommission.value)}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
