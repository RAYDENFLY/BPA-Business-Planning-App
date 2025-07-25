import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Users, X } from 'lucide-react';
import { useBusinessStore } from '@/store/businessStore';
import { Employee } from '@/types/business';
import { analytics } from '@/lib/analytics';

const employeeSchema = z.object({
  name: z.string().min(1, 'Nama karyawan wajib diisi'),
  role: z.string().min(1, 'Role wajib diisi'),
  paymentMode: z.enum(['fixed', 'commission']),
  salary: z.number().optional(),
  commission: z.object({
    productId: z.string().optional(),
    type: z.enum(['percentage', 'fixed']),
    value: z.number().min(0, 'Komisi tidak boleh negatif'),
  }).optional(),
  estimatedContribution: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function EmployeeForm() {
  const { currentPlan, addEmployee, updateEmployee, removeEmployee } = useBusinessStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [salaryDisplay, setSalaryDisplay] = useState<string>('');
  const [commissionDisplay, setCommissionDisplay] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      role: '',
      paymentMode: 'fixed',
      salary: 5000000,
      commission: {
        type: 'percentage',
        value: 10,
      },
      estimatedContribution: '',
    },
  });

  const employees = currentPlan?.employees || [];
  const products = currentPlan?.products || [];
  const paymentMode = watch('paymentMode');
  const commissionType = watch('commission.type');

  const onSubmit = (data: EmployeeFormData) => {
    const employeeData = {
      ...data,
      salary: data.paymentMode === 'fixed' ? data.salary : undefined,
      commission: data.paymentMode === 'commission' ? data.commission : undefined,
    };

    if (editingId) {
      updateEmployee(editingId, employeeData);
      analytics.employeeAdded(employeeData.paymentMode); // Track as employee modification
      setEditingId(null);
    } else {
      addEmployee(employeeData);
      analytics.employeeAdded(employeeData.paymentMode);
    }
    reset();
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    reset({
      ...employee,
      commission: employee.commission || { type: 'percentage', value: 10 },
    });
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

  const roleOptions = [
    'Developer',
    'Sales',
    'Admin',
    'Marketing',
    'Customer Service',
    'Project Manager',
    'Designer',
    'Quality Assurance',
    'Business Analyst',
    'Finance',
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">🧑‍💼 Input Karyawan & Sales Team</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Karyawan *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              placeholder="Contoh: Budi Santoso"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role/Jabatan *
            </label>
            <select
              {...register('role')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            >
              <option value="">Pilih Role</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode Pembayaran *
            </label>
            <select
              {...register('paymentMode')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            >
              <option value="fixed">Gaji Tetap</option>
              <option value="commission">Komisi</option>
            </select>
          </div>

          {paymentMode === 'fixed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gaji per Bulan (Rp) *
              </label>
              <input
                type="text"
                value={salaryDisplay}
                onChange={(e) => {
                  const value = e.target.value;
                  setSalaryDisplay(value);
                  const numericValue = handleFormattedInput(value);
                  setValue('salary', numericValue);
                }}
                onBlur={(e) => {
                  const numericValue = handleFormattedInput(e.target.value);
                  if (numericValue > 0) {
                    setSalaryDisplay(formatNumberWithSeparators(numericValue));
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                placeholder="5.000.000"
              />
              {watch('salary') && watch('salary')! > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrencyDisplay(watch('salary')!)}
                </p>
              )}
              {errors.salary && (
                <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>
              )}
            </div>
          )}

          {paymentMode === 'commission' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produk Target (Opsional)
                </label>
                <select
                  {...register('commission.productId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                >
                  <option value="">Semua Produk</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Komisi
                </label>
                <div className="flex gap-2">
                  <select
                    {...register('commission.type')}
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">Nominal</option>
                  </select>
                  <input
                    {...register('commission.value', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                    placeholder={commissionType === 'percentage' ? '10' : '100000'}
                  />
                </div>
                {errors.commission?.value && (
                  <p className="text-red-500 text-sm mt-1">{errors.commission.value.message}</p>
                )}
              </div>
            </>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimasi Kontribusi (Opsional)
            </label>
            <textarea
              {...register('estimatedContribution')}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              placeholder="Contoh: Mampu closing 5 klien per bulan, expertise di teknologi React"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <Plus className="w-4 h-4" />
            {editingId ? 'Update Karyawan' : 'Tambah Karyawan'}
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

      {/* Employee List */}
      {employees.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Daftar Karyawan</h3>
          <div className="space-y-4">
            {employees.map((employee) => (
              <div
                key={employee.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{employee.name}</h4>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Role:</span> {employee.role}
                      </div>
                      <div>
                        <span className="font-medium">Mode:</span>{' '}
                        {employee.paymentMode === 'fixed' ? 'Gaji Tetap' : 'Komisi'}
                      </div>
                      <div>
                        <span className="font-medium">
                          {employee.paymentMode === 'fixed' ? 'Gaji:' : 'Komisi:'}
                        </span>{' '}
                        {employee.paymentMode === 'fixed' && employee.salary
                          ? formatCurrency(employee.salary)
                          : employee.commission
                          ? employee.commission.type === 'percentage'
                            ? `${employee.commission.value}%`
                            : formatCurrency(employee.commission.value)
                          : '-'}
                      </div>
                    </div>
                    {employee.estimatedContribution && (
                      <div className="mt-2 text-sm text-gray-600">
                        <span className="font-medium">Kontribusi:</span> {employee.estimatedContribution}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="px-3 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeEmployee(employee.id)}
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
