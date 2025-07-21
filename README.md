# Business Planning App

Aplikasi perencanaan bisnis untuk UKM (Usaha Kecil dan Menengah) yang membantu pemilik usaha dalam merencanakan bisnis, mengevaluasi kelayakan, dan menyusun target realistis.

## 🎯 Tujuan Aplikasi

Alat bantu pemilik usaha kecil/menengah untuk:
- Merencanakan bisnis secara sistematis
- Mengevaluasi kelayakan usaha 
- Menyusun target yang realistis
- Melakukan proyeksi keuangan
- Analisis skenario "what-if"

## ✨ Fitur Utama

### 📦 1. Input Produk & Revenue
- Form input produk dengan nama, harga, dan jenis (subscription/sekali beli/jasa)
- Estimasi penjualan per bulan dan target growth
- Pengaturan komisi sales per produk
- Support multiple produk

### 🧑‍💼 2. Input Karyawan & Sales Team  
- Management tim dengan role yang beragam (Developer, Sales, Admin, Marketing, dll.)
- Fleksibilitas pembayaran: gaji tetap atau komisi
- Tracking kontribusi dan komisi per karyawan
- Support multiple anggota tim

### 💸 3. Input Biaya Tetap & Variabel
**Biaya Tetap:**
- Sewa, Internet & listrik, Server/Hosting
- Gaji admin, Tools/Software, dan lainnya

**Biaya Variabel:**
- Biaya produksi per unit
- Fee payment gateway (%)
- Biaya support/customer service
- Komisi sales berdasarkan revenue
- Biaya iklan

### 📈 4. Target & Pertumbuhan
- Pengaturan target omzet akhir
- Periode proyeksi (6-36 bulan)
- Pertumbuhan revenue dan biaya operasional per bulan
- Sales closing rate estimation
- Inflasi biaya/server untuk SaaS

### 📊 5. Output / Hasil Simulasi
**Grafik & Data:**
- Revenue vs Biaya vs Profit (line chart)
- Perbandingan bulanan (bar chart)
- Break-even point analysis
- Akumulasi profit
- ROI calculation
- Laporan detail proyeksi

**Perhitungan Otomatis:**
- Total gaji (tetap + komisi)
- Biaya operasional
- Pendapatan bersih
- Laba bersih
- Return on Investment

### 🧪 6. Skenario "What If"
- Simulasi kenaikan harga produk
- Pengurangan biaya operasional  
- Penambahan karyawan baru
- Perubahan komisi sales
- Perbandingan hasil dengan baseline

### 📄 7. Export Data
- **PDF:** Laporan lengkap siap presentasi
- **Excel:** Data detail untuk analisis lanjutan
- Multiple worksheets terorganisir
- Format professional

## 🛠️ Teknologi

- **Framework:** Next.js 15 dengan App Router
- **Language:** TypeScript untuk type safety
- **Styling:** Tailwind CSS
- **Charts:** Chart.js dengan React-Chartjs-2
- **Forms:** React Hook Form dengan Zod validation
- **State Management:** Zustand dengan persistence
- **Export:** jsPDF untuk PDF, SheetJS untuk Excel
- **Icons:** Lucide React

## 🚀 Cara Menjalankan

1. **Clone dan Install Dependencies**
```bash
npm install
```

2. **Run Development Server**
```bash
npm run dev
```

3. **Buka di Browser**
```
http://localhost:3000
```

## 📋 Cara Penggunaan

1. **Buat Business Plan Baru**
   - Masukkan nama business plan
   - Klik "Buat Business Plan Baru"

2. **Input Data Secara Berurutan**
   - **Produk & Revenue:** Tambahkan produk/jasa yang akan dijual
   - **Karyawan & Sales:** Input tim dan struktur pembayaran
   - **Biaya:** Masukkan biaya tetap dan variabel
   - **Target & Growth:** Set target omzet dan proyeksi pertumbuhan

3. **Analisis Hasil**
   - Lihat grafik proyeksi di tab "Analisis & Grafik"
   - Jalankan simulasi skenario di tab "What-If Scenario"
   - Export laporan di tab "Export Data"

## 🎨 Screenshots

### Dashboard Utama
- Tabs navigasi dengan progress indicator
- Form input yang user-friendly
- Real-time calculation

### Analisis & Grafik
- Interactive charts dengan Chart.js
- Key metrics display
- Break-even analysis
- Detail table proyeksi

### What-If Scenarios
- Side-by-side comparison
- Insights dan recommendations
- Multiple scenario testing

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
├── components/         # React Components
│   ├── ProductForm.tsx
│   ├── EmployeeForm.tsx
│   ├── CostForm.tsx
│   ├── TargetForm.tsx
│   ├── AnalysisCharts.tsx
│   ├── WhatIfScenario.tsx
│   └── ExportData.tsx
├── store/              # Zustand Store
│   └── businessStore.ts
└── types/              # TypeScript Types
    └── business.ts
```

### Key Features Implementation
- **Responsive Design:** Mobile-first approach
- **Form Validation:** Comprehensive validation dengan Zod
- **Data Persistence:** Local storage dengan Zustand persist
- **Type Safety:** Full TypeScript coverage
- **Performance:** Optimized calculations dan memoization

## 🚢 Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 License

MIT License - Silakan gunakan untuk keperluan komersial maupun non-komersial.

## 🤝 Contributing

Kontribusi sangat diterima! Silakan buat issue atau pull request untuk perbaikan dan fitur baru.

## 📞 Support

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.

---

**Business Planning App** - Membantu UKM merencanakan masa depan bisnis yang lebih baik! 🚀
