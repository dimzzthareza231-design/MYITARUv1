import React, { useState } from 'react';
import { AlertTriangle, FileWarning, CheckCircle2, User, ShieldAlert, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface PulangPaksaModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function PulangPaksaModal({ isOpen, onClose, patient }: PulangPaksaModalProps) {
  const [namaPemohon, setNamaPemohon] = useState(patient?.nama || '');
  const [hubungan, setHubungan] = useState('Pasien Sendiri');
  const [nik, setNik] = useState(patient?.nik || '3271041985010001');
  const [alasanPulang, setAlasanPulang] = useState('Alasan keluarga & ingin melanjutkan perawatan alternatif di rumah');
  const [konfirmasiRisiko, setKonfirmasiRisiko] = useState(false);
  const [edukasiDokter, setEdukasiDokter] = useState('Dokter telah menjelaskan risiko komplikasi berat, perburukan kondisi klinis, syok, hingga kematian jika perawatan medis dihentikan saat ini.');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!konfirmasiRisiko) {
      toast.error('Wajib mencentang persetujuan pemahaman risiko klinis!');
      return;
    }
    const key = `hospital_pulang_paksa_${patient?.no_rm || patient?.id || 'default'}`;
    const data = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      pemohon: { nama: namaPemohon, hubungan, nik },
      alasanPulang,
      edukasiDokter,
      dokterJaga: 'dr. Satria Wibowo, Sp.PD',
      saksiRS: 'Ns. Ratna Sari, S.Kep'
    };
    localStorage.setItem(key, JSON.stringify(data));
    toast.success('Surat Pernyataan Pulang Atas Permintaan Sendiri (APS) berhasil disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-amber-300 dark:border-amber-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-amber-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <FileWarning className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Surat Pernyataan Pulang Atas Permintaan Sendiri (APS / Pulang Paksa)</h2>
              <p className="text-xs text-amber-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Dokumen Pelepasan Tanggung Jawab Hukum
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-200">
              <p className="font-bold">PELEPASAN TANGGUNG JAWAB MEDIS & HUKUM (DAMA):</p>
              <p className="mt-1">
                Dengan menandatangani dokumen ini, pasien/keluarga menyatakan menghentikan pengobatan rawat inap atas kehendak sendiri tanpa persetujuan dokter dan membebaskan pihak Rumah Sakit serta seluruh staf medis dari segala tuntutan hukum atas risiko perburukan kondisi kesehatan di masa depan.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              1. Identitas Pembuat Pernyataan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Nama Pemohon:</label>
                <input type="text" value={namaPemohon} onChange={(e) => setNamaPemohon(e.target.value)} className="w-full p-2 border rounded font-bold bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Hubungan dengan Pasien:</label>
                <select value={hubungan} onChange={(e) => setHubungan(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900">
                  <option value="Pasien Sendiri">Pasien Sendiri</option>
                  <option value="Suami / Istri">Suami / Istri</option>
                  <option value="Orang Tua Kandung">Orang Tua Kandung</option>
                  <option value="Anak Kandung">Anak Kandung</option>
                  <option value="Saudara Kandung">Saudara Kandung</option>
                  <option value="Wali Sah">Wali Sah</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">NIK KTP:</label>
                <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} className="w-full p-2 border rounded font-mono bg-white dark:bg-slate-900" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              2. Alasan Menghentikan Perawatan
            </h3>
            <textarea
              value={alasanPulang}
              onChange={(e) => setAlasanPulang(e.target.value)}
              rows={2}
              className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 font-medium"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              3. Edukasi Risiko yang Telah Diberikan Dokter DPJP
            </h3>
            <textarea
              value={edukasiDokter}
              onChange={(e) => setEdukasiDokter(e.target.value)}
              rows={2}
              className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 font-medium text-rose-700 dark:text-rose-400"
            />
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20 cursor-pointer">
            <input
              type="checkbox"
              checked={konfirmasiRisiko}
              onChange={(e) => setKonfirmasiRisiko(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded mt-0.5"
            />
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              Saya telah membaca, memahami penjelasan dokter, dan menyadari sepenuhnya segala konsekuensi medis yang mungkin timbul akibat keputusan pulang paksa ini tanpa paksaan dari pihak manapun.
            </span>
          </label>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Surat_APS_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Surat APS"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="pulang_paksa"
            title="SURAT PERNYATAAN PULANG ATAS PERMINTAAN SENDIRI (APS)"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan & Terbitkan APS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
