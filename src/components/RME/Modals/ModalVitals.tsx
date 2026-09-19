import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { X, Activity } from 'lucide-react';

interface ModalVitalsProps {
  onClose: () => void;
  onSave: (data: {
    id: number;
    date: string;
    bp: string;
    hr: string;
    temp: string;
    rr: string;
    spo2: string;
    tb?: string;
    bb?: string;
  }) => void;
}

export function ModalVitals({ onClose, onSave }: ModalVitalsProps) {
  const [systolic, setSystolic] = useState('120');
  const [diastolic, setDiastolic] = useState('80');
  const [hr, setHr] = useState('80');
  const [temp, setTemp] = useState('36.5');
  const [rr, setRr] = useState('18');
  const [spo2, setSpo2] = useState('98');
  const [tb, setTb] = useState('165');
  const [bb, setBb] = useState('65');

  const handleSave = () => {
    if (!systolic || !diastolic || !hr || !temp || !rr || !spo2) {
      toast.error('Semua tanda vital wajib diisi');
      return;
    }

    const nowStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    onSave({
      id: Date.now(),
      date: nowStr,
      bp: `${systolic}/${diastolic}`,
      hr,
      temp,
      rr,
      spo2,
      tb,
      bb
    });

    toast.success('Tanda vital berhasil ditambahkan');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            Catat Tanda Vital Baru
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tekanan Darah Sistolik (mmHg) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tekanan Darah Diastolik (mmHg) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="80"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Frekuensi Nadi / HR (bpm) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                value={hr}
                onChange={(e) => setHr(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Suhu Tubuh (°C) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="36.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Laju Pernapasan / RR (x/m) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                value={rr}
                onChange={(e) => setRr(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="18"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Saturasi Oksigen / SpO2 (%) <span className="text-rose-500">*</span></label>
              <input
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="98"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tinggi Badan (cm)</label>
              <input
                type="number"
                value={tb}
                onChange={(e) => setTb(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                placeholder="165"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Berat Badan (kg)</label>
              <input
                type="number"
                value={bb}
                onChange={(e) => setBb(e.target.value)}
                className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-slate-500 outline-none"
                placeholder="65"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 font-bold transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-rose-600 text-white py-2.5 rounded-lg hover:bg-rose-700 font-bold shadow-sm transition-colors"
          >
            Simpan Tanda Vital
          </button>
        </div>
      </div>
    </div>
  );
}
