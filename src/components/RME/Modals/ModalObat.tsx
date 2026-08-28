import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

export function ModalObat({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) {
  const [nama, setNama] = useState('');
  const [dosis, setDosis] = useState('');
  const [aturan, setAturan] = useState('');
  const [jumlah, setJumlah] = useState('');
  
  const handleSave = () => {
    if (!nama || !dosis || !aturan || !jumlah) {
      toast.error('Semua field wajib diisi');
      return;
    }
    
    onSave({ nama, dosis, aturan, jumlah });
    toast.success('Obat berhasil ditambahkan');
  };
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tambah Obat (E-Resep)</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Obat <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Contoh: Paracetamol"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Dosis <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={dosis}
              onChange={(e) => setDosis(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Contoh: 500mg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Aturan Pakai <span className="text-rose-500">*</span></label>
            <select
              value={aturan}
              onChange={(e) => setAturan(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="">Pilih aturan...</option>
              <option value="3 x 1 Tablet sesudah makan">3 x 1 Tablet sesudah makan</option>
              <option value="2 x 1 Tablet sesudah makan">2 x 1 Tablet sesudah makan</option>
              <option value="1 x 1 Tablet sesudah makan">1 x 1 Tablet sesudah makan</option>
              <option value="Bila perlu">Bila perlu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah (Qty) <span className="text-rose-500">*</span></label>
            <input
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Contoh: 10"
            />
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
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-bold shadow-sm transition-colors"
          >
            Simpan Obat
          </button>
        </div>
      </div>
    </div>
  );
}
