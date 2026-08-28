import React, { useState } from 'react';
import { HeartHandshake, CheckCircle, AlertTriangle, Calculator, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProgramREHAB() {
  const [step, setStep] = useState(() => {
    const isRegistered = localStorage.getItem('simrs_jkn_rehab_registered') === 'true';
    return isRegistered ? 2 : 0;
  });

  const handleDaftar = () => {
    localStorage.setItem('simrs_jkn_rehab_registered', 'true');
    toast.success('Pendaftaran program REHAB berhasil diajukan');
    setStep(2);
  };

  const handleReset = () => {
    localStorage.removeItem('simrs_jkn_rehab_registered');
    setStep(0);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Program REHAB</h1>
          <p className="text-slate-500">Rencana Pembayaran Bertahap untuk Iuran Tertunggak</p>
        </div>
      </div>

      {step === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="bg-teal-600 p-8 text-white text-center">
            <HeartHandshake className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">Program REHAB</h2>
            <p className="text-teal-100 max-w-lg mx-auto">
              Solusi bagi Peserta Mandiri (PBPU) yang memiliki tunggakan iuran lebih dari 3 bulan untuk membayar secara bertahap (mencicil).
            </p>
          </div>
          
          <div className="p-6">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Syarat & Ketentuan:</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">Peserta memiliki tunggakan lebih dari 3 bulan (4-24 bulan).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">Mendaftar melalui aplikasi Mobile JKN atau Care Center 165.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">Pembayaran maksimal dilakukan dalam 12 kali tahapan.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">Kartu peserta baru akan aktif setelah seluruh tunggakan lunas.</span>
              </li>
            </ul>
            
            <button 
              onClick={() => setStep(1)}
              className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 font-bold transition-colors shadow-sm"
            >
              Cek Status & Daftar REHAB
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Simulasi Tunggakan</h3>
            
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-800 dark:text-red-300 font-medium">Total Tunggakan Keluarga (5 Bulan)</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">Rp 700.000</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Pilih Jangka Waktu Cicilan</label>
                <select className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none">
                  <option>2 Bulan (Rp 350.000 / bln)</option>
                  <option>3 Bulan (Rp 233.333 / bln)</option>
                  <option>4 Bulan (Rp 175.000 / bln)</option>
                  <option>5 Bulan (Rp 140.000 / bln)</option>
                </select>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                <Calculator className="w-5 h-5 shrink-0" />
                <p>Cicilan belum termasuk tagihan iuran bulan berjalan yang harus tetap dibayar tepat waktu setiap bulannya.</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setStep(0)}
              className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleDaftar}
              className="flex-1 bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 font-bold transition-colors shadow-sm"
            >
              Setujui & Daftar
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 text-center shadow-sm">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
            Pendaftaran program REHAB Anda telah disetujui. Silakan lakukan pembayaran cicilan tahap pertama melalui metode pembayaran yang tersedia.
          </p>
          <button 
            onClick={() => setStep(0)}
            className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 font-bold transition-colors shadow-sm flex items-center gap-2 mx-auto"
          >
            <FileText className="w-5 h-5" /> Lihat Jadwal Cicilan
          </button>
          <button 
            onClick={handleReset}
            className="mt-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-6 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 font-bold transition-colors shadow-sm mx-auto block"
          >
            Mulai Ulang Pendaftaran
          </button>
        </div>
      )}
    </div>
  );
}
