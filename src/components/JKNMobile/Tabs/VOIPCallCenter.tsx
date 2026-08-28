import React, { useState } from 'react';
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';

export function VOIPCallCenter() {
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const startCall = () => {
    setInCall(true);
    setCallDuration(0);
    toast.success('Menghubungi Call Center BPJS 165...');
  };

  const endCall = () => {
    setInCall(false);
    toast.success('Panggilan diakhiri');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Phone className="w-6 h-6 text-teal-600" /> VOIP Call Center 165
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Hubungi call center BPJS Kesehatan langsung dari aplikasi</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center max-w-md mx-auto">
        {!inCall ? (
          <>
            <div className="w-24 h-24 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Call Center BPJS</h2>
            <p className="text-4xl font-bold text-teal-600 mb-6">165</p>
            <button
              onClick={startCall}
              className="px-8 py-4 bg-teal-600 text-white text-lg font-bold rounded-full hover:bg-teal-700 flex items-center gap-3 mx-auto"
            >
              <PhoneCall className="w-6 h-6" /> Mulai Panggilan
            </button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <PhoneCall className="w-12 h-12 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Terhubung dengan Call Center</h2>
            <p className="text-2xl font-mono text-slate-500 mb-6">
              {Math.floor(callDuration / 60).toString().padStart(2, '0')}:{(callDuration % 60).toString().padStart(2, '0')}
            </p>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={toggleMute}
                className={`p-4 rounded-full ${isMuted ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              <button className="p-4 rounded-full bg-slate-100 text-slate-600">
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            <button
              onClick={endCall}
              className="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-full hover:bg-red-700 flex items-center gap-3 mx-auto"
            >
              <PhoneOff className="w-6 h-6" /> Akhiri Panggilan
            </button>
          </>
        )}
      </div>

      <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6">
        <h3 className="font-bold text-teal-800 dark:text-teal-300 mb-2">Informasi Layanan</h3>
        <ul className="text-sm text-teal-600 dark:text-teal-400 space-y-1">
          <li>• Layanan tersedia 24 jam</li>
          <li>• Informasi kepesertaan dan tagihan</li>
          <li>• Pengaduan dan saran</li>
          <li>• Panduan penggunaan aplikasi</li>
        </ul>
      </div>
    </div>
  );
}
