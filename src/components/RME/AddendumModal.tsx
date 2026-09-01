import React, { useState } from 'react';
import { FileEdit, ShieldAlert, Check, X, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AddendumModalProps {
  isOpen: boolean;
  onClose: () => void;
  encounterId: string;
  onSaveAddendum: (addendum: { text: string; reason: string; doctor: string; timestamp: string }) => void;
}

export function AddendumModal({ isOpen, onClose, encounterId, onSaveAddendum }: AddendumModalProps) {
  const [reason, setReason] = useState('Koreksi hasil pemeriksaan penunjang lanjutan');
  const [addendumText, setAddendumText] = useState('');
  const [doctorName, setDoctorName] = useState('dr. Budi Santoso, Sp.PD');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!addendumText.trim()) {
      toast.error('Teks amandemen / addendum tidak boleh kosong!');
      return;
    }

    onSaveAddendum({
      text: addendumText,
      reason: reason,
      doctor: doctorName,
      timestamp: new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    });

    onClose();
    toast.success('Amandemen / Addendum Rekam Medis berhasil disimpan dan dicatat dalam audit trail!');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Buat Catatan Tambahan (Addendum / Amandemen)</h3>
              <p className="text-xs text-indigo-100">Encounter ID: {encounterId} (PMK 24/2022 Legal Compliant)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/80 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <p>
              Sesuai PMK 24/2022, rekam medis yang telah diverifikasi tidak dapat dihapus/ditimpa. Perubahan hanya dapat dilakukan melalui <strong>Addendum</strong> yang merekam revisi dan pencetusnya.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Alasan Amandemen
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none font-medium"
            >
              <option value="Koreksi hasil pemeriksaan penunjang lanjutan">Koreksi hasil pemeriksaan penunjang lanjutan</option>
              <option value="Penambahan instruksi pengobatan / resep">Penambahan instruksi pengobatan / resep</option>
              <option value="Klarifikasi riwayat alergi / komorbid">Klarifikasi riwayat alergi / komorbid</option>
              <option value="Koreksi administratif / kesalahan ketik">Koreksi administratif / kesalahan ketik</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Isi Catatan Addendum *
            </label>
            <textarea
              rows={4}
              value={addendumText}
              onChange={e => setAddendumText(e.target.value)}
              placeholder="Tuliskan catatan revisi/tambahan klinis secara detail..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Dokter yang Mengesahkan
            </label>
            <input
              type="text"
              value={doctorName}
              onChange={e => setDoctorName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none font-bold text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Simpan Addendum
          </button>
        </div>
      </div>
    </div>
  );
}
