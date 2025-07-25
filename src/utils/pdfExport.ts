'use client';

import jsPDF from 'jspdf';

interface Outlet {
  id: string;
  name: string;
  dailyRevenue: number;
  operatingDays: number;
}

interface ROIData {
  initialInvestment: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  monthlyOperatingCost: number;
  netProfitMargin: number;
  projectDuration: number;
  ownershipPercentage: number;
  useOutletMode: boolean;
  outlets: Outlet[];
  scenario: 'optimistic' | 'realistic' | 'pessimistic';
  taxRate: number;
  inflationRate: number;
}

interface ROIResults {
  monthlyGrossProfit: number;
  monthlyNetProfit: number;
  monthlyNetProfitAfterTax: number;
  yearlyGrossProfit: number;
  yearlyNetProfit: number;
  yearlyNetProfitAfterTax: number;
  annualROI: number;
  totalReturnAfterYears: number;
  breakEvenMonths: number;
  paybackPeriodRounded: number;
  totalInvestment: number;
  totalProfit: number;
  yearlyRevenue: number;
  inflationAdjustedProfit: number;
  averageROIWithInflation: number;
  yearlyBreakdown: Array<{
    year: number;
    yearlyProfit: number;
    cumulativeProfit: number;
    adjustedForInflation: number;
  }>;
}

export async function exportToPDF(
  data: ROIData, 
  results: ROIResults, 
  simulationName: string = 'Simulasi ROI'
) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function untuk format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper function untuk format percentage
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Laporan Simulasi ROI & Profitabilitas', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(simulationName, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;

  // Input Data Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('📊 Data Input', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const inputData = [
    ['Modal Awal Investasi', formatCurrency(data.initialInvestment)],
    ['Omzet Bulanan', formatCurrency(data.monthlyRevenue)],
    ['Biaya Operasional Bulanan', formatCurrency(data.monthlyOperatingCost)],
    ['Margin Laba Bersih', formatPercent(data.netProfitMargin)],
    ['Durasi Proyek', `${data.projectDuration} tahun`],
    ['Persentase Kepemilikan', formatPercent(data.ownershipPercentage)],
    ['Skenario', data.scenario],
    ['Pajak', formatPercent(data.taxRate)],
    ['Inflasi', formatPercent(data.inflationRate)]
  ];

  inputData.forEach(([label, value]) => {
    pdf.text(`${label}: ${value}`, 20, yPosition);
    yPosition += 5;
  });

  yPosition += 10;

  // Results Section
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('📈 Hasil Simulasi', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const resultData = [
    ['ROI Tahunan', formatPercent(results.annualROI)],
    ['Payback Period', `${results.paybackPeriodRounded} bulan`],
    ['Laba Bersih/Tahun (Anda)', formatCurrency(results.yearlyNetProfitAfterTax * (data.ownershipPercentage / 100))],
    ['Total Return ' + data.projectDuration + ' Tahun', formatCurrency(results.totalReturnAfterYears)],
    ['ROI vs Inflasi', formatPercent(results.averageROIWithInflation)],
    ['Total Adjusted Inflation', formatCurrency(results.inflationAdjustedProfit)]
  ];

  resultData.forEach(([label, value]) => {
    pdf.text(`${label}: ${value}`, 20, yPosition);
    yPosition += 5;
  });

  yPosition += 10;

  // Yearly Breakdown
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('📊 Proyeksi Multi-Tahun', 15, yPosition);
  yPosition += 10;

  // Table header
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  const tableHeaders = ['Tahun', 'Profit Nominal', 'Profit Riil', 'Kumulatif', 'ROI Kumulatif'];
  const colWidths = [25, 40, 40, 40, 35];
  let xPosition = 20;

  tableHeaders.forEach((header, index) => {
    pdf.text(header, xPosition, yPosition);
    xPosition += colWidths[index];
  });
  yPosition += 5;

  // Table content
  pdf.setFont('helvetica', 'normal');
  results.yearlyBreakdown.forEach((yearData) => {
    xPosition = 20;
    const rowData = [
      yearData.year.toString(),
      formatCurrency(yearData.yearlyProfit),
      formatCurrency(yearData.adjustedForInflation),
      formatCurrency(yearData.cumulativeProfit),
      formatPercent((yearData.cumulativeProfit / data.initialInvestment) * 100)
    ];

    rowData.forEach((data, index) => {
      pdf.text(data, xPosition, yPosition);
      xPosition += colWidths[index];
    });
    yPosition += 5;
  });

  yPosition += 10;

  // Recommendation
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('💡 Rekomendasi', 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  let recommendation = '';
  if (results.annualROI > 15) {
    recommendation = `ROI ${formatPercent(results.annualROI)} sangat menarik! Investasi ini berpotensi menguntungkan dengan break-even dalam ${results.breakEvenMonths.toFixed(1)} bulan. Pertimbangkan untuk melanjutkan dengan analisis risiko yang lebih detail.`;
  } else if (results.annualROI > 8) {
    recommendation = `ROI ${formatPercent(results.annualROI)} cukup layak untuk dipertimbangkan. Pastikan untuk menganalisis faktor risiko, kompetisi pasar, dan stabilitas model bisnis sebelum melakukan investasi.`;
  } else {
    recommendation = `ROI ${formatPercent(results.annualROI)} di bawah ekspektasi umum untuk investasi bisnis. Pertimbangkan untuk mengoptimalkan model bisnis, mengurangi biaya operasional, atau mencari peluang investasi lain yang lebih menjanjikan.`;
  }

  const splitRecommendation = pdf.splitTextToSize(recommendation, pageWidth - 40);
  pdf.text(splitRecommendation, 20, yPosition);

  // Footer
  const footerY = pageHeight - 20;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Generated by Business Planning App - ROI Simulator', pageWidth / 2, footerY, { align: 'center' });

  // Save PDF
  const fileName = `ROI_Simulation_${simulationName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}

export async function captureChartsAndExportPDF(
  data: ROIData,
  results: ROIResults,
  simulationName: string = 'Simulasi ROI'
) {
  try {
    // Capture chart elements
    const chartElements = document.querySelectorAll('.chart-container canvas');
    const chartImages: string[] = [];

    for (const canvas of chartElements) {
      const chartImage = (canvas as HTMLCanvasElement).toDataURL('image/png');
      chartImages.push(chartImage);
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();

    // First, export the basic report
    await exportToPDF(data, results, simulationName);

    // Then add charts if available
    if (chartImages.length > 0) {
      chartImages.forEach((chartImage, index) => {
        if (index > 0) pdf.addPage();
        
        // Add chart title
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Chart ${index + 1}`, pageWidth / 2, 20, { align: 'center' });
        
        // Add chart image
        const imgWidth = pageWidth - 40;
        const imgHeight = (imgWidth * 3) / 4; // 4:3 aspect ratio
        pdf.addImage(chartImage, 'PNG', 20, 30, imgWidth, imgHeight);
      });
    }
  } catch (error) {
    console.error('Error capturing charts:', error);
    // Fallback to basic PDF export
    await exportToPDF(data, results, simulationName);
  }
}
