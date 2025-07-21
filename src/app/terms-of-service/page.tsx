'use client';

import Link from 'next/link';
import { FileText, Shield, Github, Calendar, Users, Eye } from 'lucide-react';
import { usePageLogger } from '@/hooks/usePageLogger';

export default function TermsOfService() {
  usePageLogger(); // Log page visits
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ketentuan Layanan</h1>
          <p className="text-gray-600">Terms of Service</p>
          <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Terakhir diperbarui: 21 Juli 2025
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <div className="border-l-4 border-blue-500 pl-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Dengan mengakses dan menggunakan aplikasi ini, Anda menyetujui Ketentuan Layanan berikut:
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Penggunaan Aplikasi
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Aplikasi ini disediakan untuk tujuan simulasi dan evaluasi proyeksi bisnis dan keuangan. 
              Penggunaan aplikasi bersifat terbuka dan tanpa jaminan.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Github className="w-5 h-5 mr-2 text-blue-600" />
              Hak Cipta dan Lisensi
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Aplikasi ini bersifat open-source. Anda bebas mengakses, menggunakan, dan menyebarkan ulang 
              sesuai lisensi yang berlaku (contoh: MIT, GPL, dsb).
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Tanggung Jawab Pengguna
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Anda bertanggung jawab atas input dan data yang Anda masukkan. Pengelola aplikasi tidak 
              bertanggung jawab atas hasil atau keputusan bisnis yang dibuat berdasarkan simulasi aplikasi ini.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Perubahan Layanan
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Kami berhak mengubah, menghentikan, atau memperbarui layanan sewaktu-waktu tanpa 
              pemberitahuan terlebih dahulu.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <div className="flex justify-between items-center">
              <Link 
                href="/"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Kembali ke Aplikasi
              </Link>
              <a 
                href="/privacy-policy"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Kebijakan Privasi →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
