import React from 'react';
import {
  Smartphone, User, CreditCard, MapPin, Clock, Video,
  Activity, Phone, Bot, Bell, ChevronRight
} from 'lucide-react';

export function JKNMobileDashboard({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard JKN Mobile</h1>
          <p className="text-slate-500">Portal layanan BPJS Kesehatan untuk peserta</p>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-slate-500 font-medium">Status Kepesertaan</p>
            <User className="text-emerald-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-emerald-600">Aktif</p>
          <p className="text-xs text-slate-500 mt-1">PBPU Mandiri</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-slate-500 font-medium">Iuran Bulan Ini</p>
            <CreditCard className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-blue-600">Rp 35.000</p>
          <p className="text-xs text-slate-500 mt-1">Kelas 3 - Belum Dibayar</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-slate-500 font-medium">Faskes Tingkat 1</p>
            <MapPin className="text-purple-500" size={20} />
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-white truncate">Klinik Sehat</p>
          <p className="text-xs text-slate-500 mt-1">Jakarta Selatan</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-slate-500 font-medium">Antrean Hari Ini</p>
            <Clock className="text-orange-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-orange-600">A-015</p>
          <p className="text-xs text-slate-500 mt-1">Estimasi: 30 menit</p>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Layanan Cepat</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <button onClick={() => onNavigate?.('antrean')} className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
            <Clock className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-medium text-center">Antrean Online</span>
          </button>
          <button onClick={() => onNavigate?.('konsultasi')} className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors">
            <Video className="w-8 h-8 text-green-500" />
            <span className="text-xs font-medium text-center">Konsultasi Dokter</span>
          </button>
          <button onClick={() => onNavigate?.('kis-digital')} className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors">
            <CreditCard className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-medium text-center">KIS Digital</span>
          </button>
          <button onClick={() => onNavigate?.('info-iuran')} className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors">
            <CreditCard className="w-8 h-8 text-yellow-500" />
            <span className="text-xs font-medium text-center">Cek Iuran</span>
          </button>
          <button onClick={() => onNavigate?.('bugar')} className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
            <Activity className="w-8 h-8 text-red-500" />
            <span className="text-xs font-medium text-center">Fitur BUGAR</span>
          </button>
          <button onClick={() => onNavigate?.('sos')} className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
            <Phone className="w-8 h-8 text-red-500" />
            <span className="text-xs font-medium text-center">Call SOS 112</span>
          </button>
        </div>
      </div>
      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Info Terbaru Program JKN</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-medium text-blue-800 dark:text-blue-300 text-sm">Penyesuaian Iuran 2026</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Iuran Kelas 3 tetap Rp 35.000, Kelas 2 Rp 100.000, Kelas 1 Rp 150.000</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="font-medium text-green-800 dark:text-green-300 text-sm">Fitur Baru: AI Triage</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Konsultasi gejala awal dengan asisten AI sebelum ke dokter</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Pengingat</h3>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium text-yellow-800 dark:text-yellow-300 text-sm">Skrining Kesehatan Tahunan</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Jadwal: 15 Februari 2026</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="font-medium text-purple-800 dark:text-purple-300 text-sm">Prolanis - Senam Bersama</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Setiap Sabtu, 07:00 WIB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
