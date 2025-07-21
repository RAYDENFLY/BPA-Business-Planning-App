'use client';

import { ArrowLeft, Shield, Eye, Github } from 'lucide-react';
import Link from 'next/link';
import { usePageLogger } from '@/hooks/usePageLogger';

export default function PrivacyPolicy() {
  usePageLogger();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-green-600 hover:text-green-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Aplikasi
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kebijakan Privasi</h1>
          <p className="text-gray-600">Terakhir diperbarui: 21 Juli 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Privasi Anda adalah hal penting bagi kami. Oleh karena itu, kami ingin menjelaskan 
              dengan jelas data apa yang kami kumpulkan dan bagaimana kami menggunakannya.
            </p>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold text-lg">✅</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Apa yang Kami Kumpulkan</h2>
              </div>
              
              <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400 mb-6">
                <p className="text-gray-700 leading-relaxed font-medium">
                  <strong>Kami TIDAK mengumpulkan data-data yang Anda input di BPA (Business Planning App).</strong> 
                  Semua input seperti simulasi revenue, biaya operasional, atau data bisnis sepenuhnya 
                  tidak disimpan atau dikirim ke server kami.
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                Satu-satunya data yang kami kumpulkan adalah:
              </p>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Alamat IP Anda</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Waktu dan tanggal akses</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">Halaman yang diakses</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">User Agent (jenis browser)</span>
                </li>
              </ul>

              <p className="text-gray-700 leading-relaxed mt-4">
                Data ini hanya digunakan untuk kebutuhan analisis sederhana (misalnya seberapa banyak 
                orang yang mengakses) dan untuk menentukan apakah proyek ini layak dikembangkan lebih lanjut.
              </p>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Eye className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Transparansi Data</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Jika Anda ragu atau ingin memverifikasi sendiri, silakan lihat langsung source code kami di GitHub:
              </p>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Github className="w-5 h-5 text-gray-600 mr-2" />
                  <a 
                    href="https://github.com/RAYDENFLY/BPA-Business-Planning-App" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    https://github.com/RAYDENFLY/BPA-Business-Planning-App
                  </a>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Akses Log</h2>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                Log akses disimpan secara aman dan hanya bisa dilihat oleh admin. Tidak ada data pribadi 
                yang dikumpulkan atau dibagikan kepada pihak ketiga.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Keamanan Data</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Yang Kami Lakukan</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Enkripsi data transmisi</li>
                    <li>• Akses admin terbatas</li>
                    <li>• Data minimal yang dikumpulkan</li>
                    <li>• Source code terbuka</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">❌ Yang TIDAK Kami Lakukan</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Menyimpan data bisnis Anda</li>
                    <li>• Melacak aktivitas personal</li>
                    <li>• Menjual data ke pihak ketiga</li>
                    <li>• Menggunakan cookies tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hubungi Kami</h2>
              <p className="text-gray-700 leading-relaxed">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Email: 
                  <a 
                    href="mailto:support@raydenfly.com" 
                    className="text-blue-600 hover:text-blue-800 ml-1 underline"
                  >
                    support@raydenfly.com
                  </a>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  WhatsApp: 
                  <a 
                    href="https://wa.me/6285172028463" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 ml-1 underline"
                  >
                    +62 851-7202-8463
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <Link 
            href="/terms" 
            className="text-green-600 hover:text-green-800 underline mr-6"
          >
            Ketentuan Layanan
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
