'use client';

import Link from 'next/link';
import { Shield, CheckCircle, Search, Lock, Github, Calendar, ExternalLink, Server } from 'lucide-react';
import { usePageLogger } from '@/hooks/usePageLogger';

export default function PrivacyPolicy() {
  usePageLogger(); // Log page visits
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kebijakan Privasi</h1>
          <p className="text-gray-600">Privacy Policy</p>
          <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            Terakhir diperbarui: 21 Juli 2025
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          {/* Introduction */}
          <div className="border-l-4 border-green-500 pl-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              Privasi Anda adalah hal penting bagi kami. Oleh karena itu, kami ingin menjelaskan dengan jelas 
              data apa yang kami kumpulkan dan bagaimana kami menggunakannya.
            </p>
          </div>

          {/* What We Collect */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              ✅ Apa yang Kami Kumpulkan
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>Kami tidak mengumpulkan data-data yang Anda input di BPA (Business Planning App).</strong> 
                Semua input seperti simulasi revenue, biaya operasional, atau data bisnis sepenuhnya tidak 
                disimpan atau dikirim ke server kami.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                Satu-satunya data yang kami kumpulkan adalah:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <Server className="w-4 h-4 mr-2 text-blue-500" />
                    Alamat IP Anda
                  </li>
                  <li className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    Waktu dan tanggal akses
                  </li>
                </ul>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                Data ini hanya digunakan untuk kebutuhan analisis sederhana (misalnya seberapa banyak orang 
                yang mengakses) dan untuk menentukan apakah proyek ini layak dikembangkan lebih lanjut.
              </p>
            </div>
          </div>

          {/* Transparency */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Search className="w-5 h-5 mr-2 text-green-600" />
              🔍 Transparansi Data
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Jika Anda ragu atau ingin memverifikasi sendiri, silakan lihat langsung source code kami di GitHub:
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <a 
                  href="https://github.com/RAYDENFLY/BPA-Business-Planning-App"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Github className="w-5 h-5 mr-2" />
                  👉 https://github.com/RAYDENFLY/BPA-Business-Planning-App
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>

          {/* Data Access */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2 text-green-600" />
              🔐 Akses Log
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Log akses disimpan secara aman dan hanya bisa dilihat oleh admin. Tidak ada data pribadi 
              yang dikumpulkan atau dibagikan kepada pihak ketiga.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t pt-6 mt-8">
            <div className="flex justify-between items-center">
              <Link 
                href="/terms-of-service"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                ← Ketentuan Layanan
              </Link>
              <Link 
                href="/"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Kembali ke Aplikasi →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
