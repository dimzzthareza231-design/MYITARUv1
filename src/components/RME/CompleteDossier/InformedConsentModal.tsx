import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, User, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface InformedConsentProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function InformedConsentModal({ isOpen, onClose, patient }: InformedConsentProps) {
  const storageKey = `hospital_informed_consent_${patient?.no_rm || patient?.id || 'default'}`;

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      namaTindakanMedis: 'Tindakan Operasi Eksisi Bedah / Invasif',
      dokterPelaksana: patient?.dokter_dpjp || 'dr. Hendra Gunawan, Sp.B',
      pemberiInformasi: patient?.dokter_dpjp || 'dr. Hendra Gunawan, Sp.B',
      penerimaInformasi: patient?.nama || '',
      indikasiTindakan: 'Kondisi klinis yang memerlukan intervensi operatif segera untuk pencegahan komplikasi.',
      tataCaraTindakan: 'Tindakan pembedahan steril di bawah anestesi dengan monitoring tanda vital intraoperatif.',
      tujuanTindakan: 'Mengatasi sumber patologis dan memulihkan fungsi organ.',
      risikoDanKomplikasi: 'Kemungkinan perdarahan ringan-sedang, risiko infeksi pasca operasi, reaksi hipersensitivitas obat.',
      prognosisTindakan: 'Dubia ad Bonam dengan penanganan optimal.',
      alternatifTindakan: 'Terapi medikamentosa konservatif (tingkat keberhasilan lebih rendah)',
      statusPernyataan: 'SETUJU',
      namaYangMenyatakan: patient?.nama || '',
      hubunganDenganPasien: 'Pasien Sendiri',
      saksiKeluarga: 'Keluarga Pasien',
      saksiPerawat: 'Ns. Ratna Sari, S.Kep'
    };
  });

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify({ ...formData, tanggal: new Date().toISOString() }));
    toast.success(`Informed Consent (${formData.statusPernyataan}) berhasil divalidasi dan disimpan!`);
    onClose();
  };

  const fullDocData = {
    ...patient,
    ...formData,
    type: 'informed_consent',
    docType: 'informed_consent'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="bg-emerald-700 text-white p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-200" />
            <div>
              <h2 className="font-bold text-base">Persetujuan Tindakan Kedokteran (Informed Consent - RM.02)</h2>
              <p className="text-xs text-emerald-100">Pasien: {patient?.nama} ({patient?.no_rm})</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center font-bold">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block sm:col-span-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Rencana Tindakan Medis</span>
              <input
                type="text"
                value={formData.namaTindakanMedis}
                onChange={(e) => setFormData({ ...formData, namaTindakanMedis: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </label>
            <label className="block">
              <span className="font-bold text-slate-700 dark:text-slate-300">Dokter Pelaksana Tindakan</span>
              <input
                type="text"
                value={formData.dokterPelaksana}
                onChange={(e) => setFormData({ ...formData, dokterPelaksana: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </label>
            <label className="block">
              <span className="font-bold text-slate-700 dark:text-slate-300">Penerima Informasi / Edukasi</span>
              <input
                type="text"
                value={formData.penerimaInformasi}
                onChange={(e) => setFormData({ ...formData, penerimaInformasi: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Indikasi & Tata Cara Tindakan</span>
              <textarea
                rows={2}
                value={formData.tataCaraTindakan}
                onChange={(e) => setFormData({ ...formData, tataCaraTindakan: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Risiko & Potensi Komplikasi</span>
              <textarea
                rows={2}
                value={formData.risikoDanKomplikasi}
                onChange={(e) => setFormData({ ...formData, risikoDanKomplikasi: e.target.value })}
                className="w-full mt-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </label>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="font-bold text-slate-900 dark:text-white uppercase text-xs">Pernyataan Pasien / Wali:</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="statusPernyataan"
                  value="SETUJU"
                  checked={formData.statusPernyataan === 'SETUJU'}
                  onChange={(e) => setFormData({ ...formData, statusPernyataan: e.target.value })}
                  className="w-4 h-4 text-emerald-600"
                />
                <span className="font-bold text-emerald-700 dark:text-emerald-300">MENYETUJUI TINDAKAN (Consent)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="statusPernyataan"
                  value="MENOLAK"
                  checked={formData.statusPernyataan === 'MENOLAK'}
                  onChange={(e) => setFormData({ ...formData, statusPernyataan: e.target.value })}
                  className="w-4 h-4 text-rose-600"
                />
                <span className="font-bold text-rose-700 dark:text-rose-300">MENOLAK TINDAKAN (Refusal)</span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <input
                type="text"
                placeholder="Nama yang menyatakan..."
                value={formData.namaYangMenyatakan}
                onChange={(e) => setFormData({ ...formData, namaYangMenyatakan: e.target.value })}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Hubungan dengan pasien..."
                value={formData.hubunganDenganPasien}
                onChange={(e) => setFormData({ ...formData, hubunganDenganPasien: e.target.value })}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Informed_Consent_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Informed Consent"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={fullDocData}
            docType="informed_consent"
            title="SURAT PERSETUJUAN TINDAKAN KEDOKTERAN (INFORMED CONSENT)"
          />
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">Batal</button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4" /> Simpan Informed Consent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
