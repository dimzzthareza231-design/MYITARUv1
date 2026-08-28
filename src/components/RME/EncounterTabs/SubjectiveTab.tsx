import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ModalAlergi } from '../Modals/ModalAlergi';

export function SubjectiveTab({ formData, updateForm }: { formData: any, updateForm: (data: any) => void }) {
  const [showAlergiModal, setShowAlergiModal] = useState(false);

  const handleAddAlergi = (alergiData: any) => {
    updateForm({
      alergi: [...formData.alergi, alergiData]
    });
    setShowAlergiModal(false);
    toast.success('Alergi berhasil ditambahkan');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <label className="block font-bold text-slate-900 dark:text-white mb-2">
          Keluhan Utama <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.keluhan_utama}
          onChange={(e) => updateForm({ keluhan_utama: e.target.value })}
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-y min-h-[100px]"
          placeholder="Contoh: Demam tinggi sejak 3 hari yang lalu disertai batuk berdahak..."
        />
      </div>
      
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">History of Present Illness (HPI - OLDARTS)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Onset (Kapan mulai)</label>
            <input
              type="text"
              value={formData.hpi.onset}
              onChange={(e) => updateForm({ hpi: { ...formData.hpi, onset: e.target.value }})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              placeholder="Misal: 3 hari lalu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location (Lokasi)</label>
            <input
              type="text"
              value={formData.hpi.location}
              onChange={(e) => updateForm({ hpi: { ...formData.hpi, location: e.target.value }})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              placeholder="Misal: Kepala bagian depan"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Durasi)</label>
            <input
              type="text"
              value={formData.hpi.duration}
              onChange={(e) => updateForm({ hpi: { ...formData.hpi, duration: e.target.value }})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              placeholder="Misal: Terus menerus"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Character (Karakteristik)</label>
            <input
              type="text"
              value={formData.hpi.character}
              onChange={(e) => updateForm({ hpi: { ...formData.hpi, character: e.target.value }})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              placeholder="Misal: Berdenyut"
            />
          </div>
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Riwayat Medis</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Riwayat Penyakit Dahulu</label>
          <textarea
            value={formData.riwayat_penyakit_dahulu}
            onChange={(e) => updateForm({ riwayat_penyakit_dahulu: e.target.value })}
            className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 min-h-[80px]"
            placeholder="Hipertensi sejak 2010, dll..."
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="font-bold text-slate-900 dark:text-white">Riwayat Alergi</label>
            <button
              onClick={() => setShowAlergiModal(true)}
              className="bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 font-bold px-4 py-2 rounded-lg text-sm transition-colors"
            >
              + Tambah Alergi
            </button>
          </div>
          
          {formData.alergi && formData.alergi.length > 0 ? (
            <div className="space-y-3">
              {formData.alergi.map((alergi: any, idx: number) => (
                <div key={idx} className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-rose-900 dark:text-rose-300">{alergi.allergen}</strong>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 dark:bg-rose-800 dark:text-rose-200">{alergi.severity}</span>
                    </div>
                    <p className="text-sm text-rose-700 dark:text-rose-400 mt-1">{alergi.reaction}</p>
                  </div>
                  <button
                    onClick={() => {
                      const newAlergi = formData.alergi.filter((_: any, i: number) => i !== idx);
                      updateForm({ alergi: newAlergi });
                    }}
                    className="text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300 p-2 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-800/50 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">Belum ada alergi tercatat</p>
            </div>
          )}
        </div>
      </div>

      {showAlergiModal && (
        <ModalAlergi
          onClose={() => setShowAlergiModal(false)}
          onSave={handleAddAlergi}
        />
      )}
    </div>
  );
}
