import React from 'react';
import { Download, FileText, File } from 'lucide-react';
import { useBusinessStore } from '@/store/businessStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoTable: (options: any) => jsPDF;
  }
}

export default function ExportData() {
  const { currentPlan, getBusinessAnalysis } = useBusinessStore();
  const analysis = getBusinessAnalysis();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format currency for readable display (Rp X Miliar/Juta format)
  const formatCurrencyDisplay = (value: number): string => {
    if (value === 0) return 'Rp 0'
    
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

  const exportToPDF = () => {
    if (!currentPlan || !analysis) {
      alert('Data belum lengkap untuk diekspor');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Title
      doc.setFontSize(20);
      doc.text('Laporan Analisis Bisnis', pageWidth / 2, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Nama Plan: ${currentPlan.name}`, 20, 35);
      doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 45);

      let yPosition = 60;

    // Executive Summary
    doc.setFontSize(14);
    doc.text('Ringkasan Eksekutif', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    const summaryData = [
      ['Metrik', 'Nilai'],
      ['Target Omzet', formatCurrency(currentPlan.businessTarget.targetRevenue)],
      ['Periode Proyeksi', `${currentPlan.businessTarget.projectionPeriod} bulan`],
      ['Total Profit Proyeksi', formatCurrency(analysis.totalProfit12Months)],
      ['Break Even Point', analysis.breakEvenMonth ? `Bulan ${analysis.breakEvenMonth}` : 'Belum BEP'],
      ['ROI', `${analysis.roi.toFixed(1)}%`],
      ['Rata-rata Revenue/Bulan', formatCurrency(analysis.averageMonthlyRevenue)],
      ['Rata-rata Biaya/Bulan', formatCurrency(analysis.averageMonthlyCosts)],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [63, 81, 181] },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    yPosition = (doc as any).lastAutoTable.finalY + 20;

    // Products Section
    if (currentPlan.products.length > 0) {
      doc.setFontSize(14);
      doc.text('Daftar Produk', 20, yPosition);
      yPosition += 10;

      const productData = [
        ['Nama Produk', 'Harga', 'Jenis', 'Penjualan/Bulan', 'Growth%'],
        ...currentPlan.products.map(product => [
          product.name,
          formatCurrency(product.price),
          product.type === 'subscription' ? 'Langganan' : 
          product.type === 'one-time' ? 'Sekali Beli' : 'Jasa',
          `${product.estimatedSalesPerMonth} unit`,
          `${product.targetGrowthPercent}%`,
        ]),
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [productData[0]],
        body: productData.slice(1),
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [34, 197, 94] },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    // Add new page if needed
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Financial Projections
    doc.setFontSize(14);
    doc.text('Proyeksi Keuangan (12 Bulan Pertama)', 20, yPosition);
    yPosition += 10;

    const projectionData = [
      ['Bulan', 'Revenue', 'Total Biaya', 'Profit Bersih', 'Akumulasi Profit'],
      ...analysis.monthlyProjections.slice(0, 12).map((projection, index) => [
        `${index + 1}`,
        formatCurrency(projection.revenue).replace('Rp ', ''),
        formatCurrency(projection.totalCosts).replace('Rp ', ''),
        formatCurrency(projection.netProfit).replace('Rp ', ''),
        formatCurrency(projection.cumulativeProfit).replace('Rp ', ''),
      ]),
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [projectionData[0]],
      body: projectionData.slice(1),
      theme: 'grid',
      styles: { fontSize: 7 },
      headStyles: { fillColor: [99, 102, 241] },
      columnStyles: {
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'right' },
        4: { halign: 'right' },
      },
    });

    // Footer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Halaman ${i} dari ${pageCount}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
      doc.text('Generated by Business Planning App', pageWidth / 2, doc.internal.pageSize.height - 5, { align: 'center' });
    }

    // Save the PDF
    const fileName = `business-plan-${currentPlan.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.');
    }
  };

  const exportToExcel = () => {
    if (!currentPlan || !analysis) {
      alert('Data belum lengkap untuk diekspor');
      return;
    }

    try {
      const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Laporan Analisis Bisnis'],
      [''],
      ['Nama Plan', currentPlan.name],
      ['Tanggal Export', new Date().toLocaleDateString('id-ID')],
      [''],
      ['RINGKASAN EKSEKUTIF'],
      ['Target Omzet', currentPlan.businessTarget.targetRevenue],
      ['Periode Proyeksi (bulan)', currentPlan.businessTarget.projectionPeriod],
      ['Total Profit Proyeksi', analysis.totalProfit12Months],
      ['Break Even Point', analysis.breakEvenMonth || 'Belum BEP'],
      ['ROI (%)', analysis.roi],
      ['Rata-rata Revenue/Bulan', analysis.averageMonthlyRevenue],
      ['Rata-rata Biaya/Bulan', analysis.averageMonthlyCosts],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

    // Products Sheet
    if (currentPlan.products.length > 0) {
      const productsData = [
        ['Nama Produk', 'Harga', 'Jenis', 'Penjualan per Bulan', 'Target Growth (%)', 'Komisi Type', 'Komisi Value'],
        ...currentPlan.products.map(product => [
          product.name,
          product.price,
          product.type,
          product.estimatedSalesPerMonth,
          product.targetGrowthPercent,
          product.salesCommission.type,
          product.salesCommission.value,
        ]),
      ];

      const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
      XLSX.utils.book_append_sheet(workbook, productsSheet, 'Produk');
    }

    // Employees Sheet
    if (currentPlan.employees.length > 0) {
      const employeesData = [
        ['Nama', 'Role', 'Mode Pembayaran', 'Gaji', 'Komisi Type', 'Komisi Value', 'Kontribusi'],
        ...currentPlan.employees.map(employee => [
          employee.name,
          employee.role,
          employee.paymentMode,
          employee.salary || '-',
          employee.commission?.type || '-',
          employee.commission?.value || '-',
          employee.estimatedContribution || '-',
        ]),
      ];

      const employeesSheet = XLSX.utils.aoa_to_sheet(employeesData);
      XLSX.utils.book_append_sheet(workbook, employeesSheet, 'Karyawan');
    }

    // Fixed Costs Sheet
    if (currentPlan.fixedCosts.length > 0) {
      const fixedCostsData = [
        ['Nama Biaya', 'Kategori', 'Jumlah per Bulan'],
        ...currentPlan.fixedCosts.map(cost => [
          cost.name,
          cost.category,
          cost.amount,
        ]),
      ];

      const fixedCostsSheet = XLSX.utils.aoa_to_sheet(fixedCostsData);
      XLSX.utils.book_append_sheet(workbook, fixedCostsSheet, 'Biaya Tetap');
    }

    // Variable Costs Sheet
    if (currentPlan.variableCosts.length > 0) {
      const variableCostsData = [
        ['Nama Biaya', 'Kategori', 'Type', 'Value'],
        ...currentPlan.variableCosts.map(cost => [
          cost.name,
          cost.category,
          cost.type,
          cost.value,
        ]),
      ];

      const variableCostsSheet = XLSX.utils.aoa_to_sheet(variableCostsData);
      XLSX.utils.book_append_sheet(workbook, variableCostsSheet, 'Biaya Variabel');
    }

    // Financial Projections Sheet
    const projectionsData = [
      ['Bulan', 'Revenue', 'Biaya Tetap', 'Biaya Variabel', 'Total Biaya', 'Gross Profit', 'Net Profit', 'Akumulasi Profit'],
      ...analysis.monthlyProjections.map((projection, index) => [
        index + 1,
        projection.revenue,
        projection.fixedCosts,
        projection.variableCosts,
        projection.totalCosts,
        projection.grossProfit,
        projection.netProfit,
        projection.cumulativeProfit,
      ]),
    ];

    const projectionsSheet = XLSX.utils.aoa_to_sheet(projectionsData);
    XLSX.utils.book_append_sheet(workbook, projectionsSheet, 'Proyeksi Keuangan');

    // Save the Excel file
    const fileName = `business-plan-${currentPlan.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Terjadi kesalahan saat membuat Excel. Silakan coba lagi.');
    }
  };

  if (!currentPlan) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-6">
          <Download className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-semibold text-gray-800">📄 Export Data</h2>
        </div>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Download className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">Belum Ada Data</h3>
          <p className="text-gray-500">
            Buat business plan terlebih dahulu untuk mengekspor data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Download className="w-6 h-6 text-teal-600" />
        <h2 className="text-xl font-semibold text-gray-800">📄 Export Data</h2>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Export */}
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-800">Export ke PDF</h3>
              <p className="text-sm text-red-600">Laporan lengkap siap presentasi</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-red-700 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span>Ringkasan eksekutif</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span>Daftar produk dan karyawan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span>Proyeksi keuangan 12 bulan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              <span>Format siap print & presentasi</span>
            </div>
          </div>

          <button
            onClick={exportToPDF}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          >
            <FileText className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        {/* Excel Export */}
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <File className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-green-800">Export ke Excel</h3>
              <p className="text-sm text-green-600">Data detail untuk analisis lanjutan</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-green-700 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Multiple worksheets terorganisir</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Data raw untuk kalkulasi custom</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Proyeksi lengkap semua periode</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span>Mudah diedit & disesuaikan</span>
            </div>
          </div>

          <button
            onClick={exportToExcel}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
          >
            <File className="w-4 h-4" />
            Download Excel
          </button>
        </div>
      </div>

      {/* Current Plan Summary */}
      {analysis && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">📋 Preview Data yang Akan Diekspor</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Nama Plan:</span>
              <br />
              <span className="text-gray-900">{currentPlan.name}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Jumlah Produk:</span>
              <br />
              <span className="text-gray-900">{currentPlan.products.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Jumlah Karyawan:</span>
              <br />
              <span className="text-gray-900">{currentPlan.employees.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Periode Proyeksi:</span>
              <br />
              <span className="text-gray-900">{currentPlan.businessTarget.projectionPeriod} bulan</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Total Profit:</span>
              <br />
              <span className="text-gray-900">{formatCurrencyDisplay(analysis.totalProfit12Months)}</span>
              <p className="text-xs text-gray-500">{formatCurrency(analysis.totalProfit12Months)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Break Even:</span>
              <br />
              <span className="text-gray-900">{analysis.breakEvenMonth ? `Bulan ${analysis.breakEvenMonth}` : 'Belum BEP'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">ROI:</span>
              <br />
              <span className="text-gray-900">{analysis.roi.toFixed(1)}%</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <br />
              <span className="text-gray-900">{new Date(currentPlan.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">💡 Tips Export</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div>• <strong>PDF:</strong> Cocok untuk presentasi kepada investor atau partner bisnis</div>
          <div>• <strong>Excel:</strong> Ideal untuk analisis lebih detail atau membuat skenario tambahan</div>
          <div>• File akan otomatis tersimpan di folder Downloads dengan nama yang mencakup tanggal export</div>
          <div>• Pastikan semua data sudah lengkap sebelum export untuk hasil yang optimal</div>
        </div>
      </div>
    </div>
  );
}
