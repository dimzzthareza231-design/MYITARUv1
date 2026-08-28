import React from 'react';
import { PhoneCall, AlertTriangle, ShieldAlert, Ambulance } from 'lucide-react';
import toast from 'react-hot-toast';

export function CallSOS() {
  const handleCall = (number: string) => {
    toast.success(`Menghubungi ${number}...`);
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Layanan Darurat SOS</h1>
        <p className="text-slate-500">Gunakan fitur ini HANYA dalam kondisi gawat darurat yang mengancam nyawa.</p>
      </div>

      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 shadow-sm">
        <div className="flex gap-4">
          <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
          <div>
            <h3 className="font-bold text-red-800 dark:text-red-400 text-lg mb-2">Kapan Harus Menghubungi 112?</h3>
            <ul className="text-red-700 dark:text-red-300 text-sm space-y-1 list-disc list-inside">
              <li>Kecelakaan lalu lintas berat</li>
              <li>Serangan jantung atau henti napas</li>
              <li>Pendarahan hebat yang tidak kunjung berhenti</li>
              <li>Penurunan kesadaran (pingsan / koma)</li>
              <li>Kejang-kejang terus menerus</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => handleCall('112')}
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-2xl p-6 flex items-center justify-between transition-transform transform active:scale-95 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <PhoneCall className="w-7 h-7" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xl">Layanan Darurat 112</p>
              <p className="text-red-100 text-sm">Ambulans, Pemadam, Polisi (Bebas Pulsa)</p>
            </div>
          </div>
          <span className="text-3xl font-black opacity-50">112</span>
        </button>

        <button 
          onClick={() => handleCall('119')}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-6 flex items-center justify-between transition-transform transform active:scale-95 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Ambulance className="w-7 h-7" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xl">Ambulans 119</p>
              <p className="text-orange-100 text-sm">Pusat Komando Medis Darurat Nasional</p>
            </div>
          </div>
          <span className="text-3xl font-black opacity-50">119</span>
        </button>
        
        <button 
          onClick={() => handleCall('165')}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl p-6 flex items-center justify-between transition-transform transform active:scale-95 shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="text-left">
              <p className="font-bold text-xl">Care Center BPJS</p>
              <p className="text-teal-100 text-sm">Informasi, Pengaduan, dan Bantuan JKN</p>
            </div>
          </div>
          <span className="text-3xl font-black opacity-50">165</span>
        </button>
      </div>
    </div>
  );
}
