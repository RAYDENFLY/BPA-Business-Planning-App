'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePageLogger } from '@/hooks/usePageLogger';

export default function TermsOfService() {
  usePageLogger();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Aplikasi
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ketentuan Layanan</h1>
          <p className="text-gray-600">Terakhir diperbarui: 21 Juli 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Dengan mengakses dan menggunakan aplikasi ini, Anda menyetujui Ketentuan Layanan berikut:
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Penggunaan Aplikasi</h2>
              <p className="text-gray-700 leading-relaxed">
                Aplikasi ini disediakan untuk tujuan simulasi dan evaluasi proyeksi bisnis dan keuangan. 
                Penggunaan aplikasi bersifat terbuka dan tanpa jaminan.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hak Cipta dan Lisensi</h2>
              <p className="text-gray-700 leading-relaxed">
                Aplikasi ini bersifat open-source dengan lisensi MIT. Anda bebas mengakses, menggunakan, 
                dan menyebarkan ulang sesuai dengan ketentuan lisensi MIT yang berlaku.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Source code tersedia di: 
                  <a 
                    href="https://github.com/RAYDENFLY/BPA-Business-Planning-App" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 ml-1 underline"
                  >
                    GitHub Repository
                  </a>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tanggung Jawab Pengguna</h2>
              <p className="text-gray-700 leading-relaxed">
                Anda bertanggung jawab atas input dan data yang Anda masukkan. Pengelola aplikasi 
                tidak bertanggung jawab atas hasil atau keputusan bisnis yang dibuat berdasarkan 
                simulasi aplikasi ini.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Perubahan Layanan</h2>
              <p className="text-gray-700 leading-relaxed">
                Kami berhak mengubah, menghentikan, atau memperbarui layanan sewaktu-waktu tanpa 
                pemberitahuan terlebih dahulu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                <p className="text-gray-700 leading-relaxed">
                  <strong>Penting:</strong> Aplikasi ini disediakan &ldquo;sebagaimana adanya&rdquo; tanpa jaminan 
                  apapun, baik tersurat maupun tersirat. Hasil simulasi dan proyeksi yang dihasilkan 
                  hanya bersifat informatif dan tidak boleh dijadikan sebagai satu-satunya dasar 
                  pengambilan keputusan bisnis.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link 
            href="/privacy" 
            className="text-blue-600 hover:text-blue-800 underline mr-6"
          >
            Kebijakan Privasi
          </Link>
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-800"
          >
            Kembali ke Aplikasi
          </Link>
        </div>
      </div>
    </div>
  );
}
