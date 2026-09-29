import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, User, FileText, CheckSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface GeneralConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function GeneralConsentModal({ isOpen, onClose, patient }: GeneralConsentModalProps) {
  const storageKey = `hospital_general_consent_${patient?.no_rm || patient?.id || 'default'}`;
  
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      namaPemberiPersetujuan: patient?.nama || '',
      hubunganDenganPasien: 'Pasien Sendiri',
      persetujuanPerawatanUmum: true,
      persetujuanPelepasanInformasi: true,
      persetujuanTataTertibHakKewajiban: true,
      penjaminBiaya: patient?.penjamin || 'BPJS Kesehatan',
      anggotaKeluargaDiizinkanBesuk: 'Keluarga Inti (Suami/Istri, Orang Tua, Anak Kandung)',
      saksiPetugasAdmisi: 'Anisa Fitriani (Petugas Pendaftaran RME)'
    };
  });

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify({ ...formData, tanggal: new Date().toISOString() }));
    toast.success('Persetujuan Umum (General Consent) berhasil divalidasi & disimpan!');
    onClose();
  };

  const fullDocData = {
    ...patient,
    ...formData,
    type: 'general_consent',
    docType: 'general_consent'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-blue-700 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-200" />
            <div>
              <h2 className="font-bold text-base">Persetujuan Umum Rawat Inap (General Consent - RM.01)</h2>
              <p className="text-xs text-blue-100">Pasien: {patient?.nama} ({patient?.no_rm})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center font-bold">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          <div className="space-y-3">
            <label className="block">
              <span className="font-bold text-slate-700 dark:text-slate-300">Nama Pemberi Persetujuan</span>
              <input
                type="text"
                value={formData.namaPemberiPersetujuan}
                onChange={(e) => setFormData({ ...formData, namaPemberiPersetujuan: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="font-bold text-slate-700 dark:text-slate-300">Hubungan dengan Pasien</span>
                <select
                  value={formData.hubunganDenganPasien}
                  onChange={(e) => setFormData({ ...formData, hubunganDenganPasien: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Pasien Sendiri">Pasien Sendiri</option>
                  <option value="Suami / Istri">Suami / Istri</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Anak Kandung">Anak Kandung</option>
                  <option value="Wali Sah">Wali Sah</option>
                </select>
              </label>
              <label className="block">
                <span className="font-bold text-slate-700 dark:text-slate-300">Penjamin Pembiayaan</span>
                <input
                  type="text"
                  value={formData.penjaminBiaya}
                  onChange={(e) => setFormData({ ...formData, penjaminBiaya: e.target.value })}
                  className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </label>
            </div>
            <label className="block">
              <span className="font-bold text-slate-700 dark:text-slate-300">Keluarga yang Diizinkan Menerima Informasi Medis & Besuk</span>
              <input
                type="text"
                value={formData.anggotaKeluargaDiizinkanBesuk}
                onChange={(e) => setFormData({ ...formData, anggotaKeluargaDiizinkanBesuk: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </label>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white uppercase text-xs">Pernyataan Persetujuan:</span>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.persetujuanPerawatanUmum}
                onChange={(e) => setFormData({ ...formData, persetujuanPerawatanUmum: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              Menyetujui pemeriksaan fisik, asuhan keperawatan, dan pengobatan terstandar.
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.persetujuanPelepasanInformasi}
                onChange={(e) => setFormData({ ...formData, persetujuanPelepasanInformasi: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              Menyetujui pelepasan informasi medis untuk penjamin klaim dan pelaporan SatuSehat Kemenkes.
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.persetujuanTataTertibHakKewajiban}
                onChange={(e) => setFormData({ ...formData, persetujuanTataTertibHakKewajiban: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              Telah membaca dan memahami hak serta kewajiban pasien selama masa perawatan.
            </label>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`General_Consent_${patient?.no_rm || 'Pasien'}`}
            label="Cetak General Consent"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={fullDocData}
            docType="general_consent"
            title="PERSETUJUAN UMUM RAWAT INAP (GENERAL CONSENT)"
          />
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">Batal</button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4" /> Simpan & Otorisasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
