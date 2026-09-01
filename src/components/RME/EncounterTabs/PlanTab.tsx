import React, { useState } from 'react';
import { Plus, Pill, AlertTriangle } from 'lucide-react';
import { ModalObat } from '../Modals/ModalObat';

export function PlanTab({ formData, updateForm }: { formData: any, updateForm: (data: any) => void }) {
  const [showObatModal, setShowObatModal] = useState(false);

  const handleAddObat = (obatData: any) => {
    updateForm({
      medications: [...formData.medications, obatData]
    });
    setShowObatModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Terapi Farmakologi (E-Resep)</h3>
          <button 
            onClick={() => setShowObatModal(true)}
            className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4"/> Tambah Obat
          </button>
        </div>
        
        {formData.medications.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 mb-4 flex gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-bold">AI Drug Interaction Alert</p>
              <p>Pastikan tidak ada interaksi moderat dengan riwayat alergi atau penyakit penyerta pasien.</p>
            </div>
          </div>
        )}

        {formData.medications.length > 0 ? (
          <div className="space-y-3">
            {formData.medications.map((obat: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white block">{obat.nama}</strong>
                    <span className="text-sm text-slate-600 dark:text-slate-400">{obat.dosis} • {obat.aturan} • {obat.jumlah}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newMeds = formData.medications.filter((_: any, i: number) => i !== idx);
                    updateForm({ medications: newMeds });
                  }}
                  className="text-rose-500 hover:text-rose-700 font-medium text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 bg-slate-50 dark:bg-slate-800/50">
            <Pill className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <p className="font-medium">Belum ada obat diresepkan.</p>
            <p className="text-sm mt-1 text-slate-400">Klik "Tambah Obat" untuk meresepkan</p>
          </div>
        )}
      </div>

      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Terapi Non-Farmakologi</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Diet</label>
            <select 
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
              value={formData.nonPharma.diet} 
              onChange={e => updateForm({ nonPharma: {...formData.nonPharma, diet: e.target.value}})}
            >
              <option value="">Pilih Diet...</option>
              <option value="Biasa">Biasa</option>
              <option value="Lunak">Lunak</option>
              <option value="Cair">Cair</option>
              <option value="Rendah Garam">Rendah Garam</option>
              <option value="Diabetes">Diabetes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Aktivitas</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" 
              placeholder="Tirah baring, bebas, dll" 
              value={formData.nonPharma.activity} 
              onChange={e => updateForm({ nonPharma: {...formData.nonPharma, activity: e.target.value}})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Posisi</label>
            <input 
              type="text" 
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" 
              placeholder="Semi-Fowler, dll" 
              value={formData.nonPharma.position} 
              onChange={e => updateForm({ nonPharma: {...formData.nonPharma, position: e.target.value}})} 
            />
          </div>
        </div>
      </div>

      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Rujukan / Follow-up</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kontrol Ulang (Hari)</label>
            <input type="number" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" placeholder="Misal: 7" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tujuan Poli/Unit</label>
            <input type="text" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" placeholder="Misal: Penyakit Dalam" />
          </div>
        </div>
      </div>

      {showObatModal && (
        <ModalObat
          onClose={() => setShowObatModal(false)}
          onSave={handleAddObat}
        />
      )}
    </div>
  );
}
