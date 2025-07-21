import React from 'react';
import { MessageCircle, Mail, Coffee } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center space-y-3">
          <h3 className="font-semibold text-gray-800 flex items-center justify-center gap-2">
            <Coffee className="w-5 h-5 text-orange-500" />
            Butuh Bantuan atau Ada Saran?
          </h3>
          
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Jika Anda mengalami kendala teknis, memiliki saran pengembangan fitur, 
            atau tertarik untuk kerjasama dalam project serupa, jangan ragu untuk menghubungi saya!
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a 
              href="https://wa.me/6285719410252" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp: 085719410252
            </a>
            
            <a 
              href="mailto:raydnelfy84@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-4 h-4" />
              raydnelfy84@gmail.com
            </a>
          </div>
          
          <div className="pt-4 border-t border-gray-200 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
              <a 
                href="/terms" 
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                Ketentuan Layanan
              </a>
              <span className="hidden sm:inline text-xs text-gray-400">|</span>
              <a 
                href="/privacy" 
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                Kebijakan Privasi
              </a>
              <span className="hidden sm:inline text-xs text-gray-400">|</span>
              <a 
                href="https://github.com/RAYDENFLY/BPA-Business-Planning-App" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                Open Source (MIT)
              </a>
            </div>
            <p className="text-xs text-gray-500">
              © 2025 Aplikasi Perencanaan Bisnis UKM - RAYDENFLY. 
              <span className="font-medium"> Open for collaboration & custom development.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
