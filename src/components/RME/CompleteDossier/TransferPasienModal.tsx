import React, { useState } from 'react';
import { ArrowRightLeft, User, HeartPulse, ShieldCheck, Printer, Save, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface TransferPasienModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function TransferPasienModal({ isOpen, onClose, patient }: TransferPasienModalProps) {
  const [formData, setFormData] = useState(() => {
    const key = `hospital_transfer_${patient?.no_rm || patient?.id || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      jenisTransfer: 'Internal Antar Unit / ICU',
      unitAsal: 'IGD (Instalasi Gawat Darurat)',
      unitTujuan: 'Ruang Rawat Inap Teratai (Kamar 302)',
      waktuTransfer: `${new Date().toISOString().split('T')[0]} 14:00 WIB`,
      sbar: {
        situation: 'Pasien pindah dari IGD ke Rawat Inap Teratai dengan DHF Grade II dan dyspepsia sekunder.',
        background: 'Demam 4 hari, trombosit 88.000 /uL, hematokrit 42%, telah mendapatkan resusitasi RL 1000 ml di IGD dan injeksi antipiretik.',
        assessment: 'Kondisi umum sedang, compos mentis, hemodinamik stabil. Tidak ada tanda syok atau perdarahan masif spontan.',
        recommendation: 'Lanjutkan rehidrasi RL 2000 ml/24 jam, periksa Darah Lengkap per 12 jam, pantau balans cairan per shift.',
      },
      tandaVitalSaatPindah: {
        kesadaran: 'Compos Mentis (GCS 15)',
        td: '110/70 mmHg',
        nadi: '84 x/menit',
        rr: '18 x/menit',
        suhu: '37.8 °C',
        spo2: '99% Room Air',
      },
      alatMedisTerpasang: ['Infus Intravena Abocath 20G Tangan Kiri', 'Gelang Identitas Pasien', 'Gelang Kuning Risiko Jatuh'],
      petugasPengantar: 'Ns. Ratna Sari, S.Kep (IGD)',
      petugasPenerima: 'Ns. Siti Fatimah, S.Kep (Teratai)',
    };
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_transfer_${patient?.no_rm || patient?.id || 'default'}`;
    localStorage.setItem(key, JSON.stringify(formData));
    toast.success('Formulir Transfer Pasien (SBAR) berhasil disimpan!');
    onClose();
  };

  const documentDataForPrint = {
    ...patient,
    transferPasienData: formData,
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-cyan-700 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <ArrowRightLeft className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Formulir Transfer Pasien Internal / Eksternal (SBAR - RM.09)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-600/80 font-mono">Standar SKP.2 KARS</span>
              </div>
              <p className="text-xs text-cyan-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> (No. RM: {patient?.no_rm || '-'}) • Serah Terima Pasien Antar Ruangan / ICU
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-cyan-200 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-100 text-sm">
          
          {/* Transfer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Unit / Ruangan Asal</label>
              <input
                type="text"
                value={formData.unitAsal}
                onChange={(e) => setFormData({ ...formData, unitAsal: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-semibold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Unit / Ruangan Tujuan</label>
              <input
                type="text"
                value={formData.unitTujuan}
                onChange={(e) => setFormData({ ...formData, unitTujuan: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-bold text-cyan-700 dark:text-cyan-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">Waktu Pelaksanaan Transfer</label>
              <input
                type="text"
                value={formData.waktuTransfer}
                onChange={(e) => setFormData({ ...formData, waktuTransfer: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          {/* SBAR Frame */}
          <div className="p-4 rounded-xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/40 dark:bg-cyan-950/20 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-950 dark:text-cyan-300 border-b border-cyan-200 dark:border-cyan-800 pb-1">
              Metode Serah Terima Klinis Terstruktur (SBAR)
            </h4>
            
            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">S (Situation) - Situasi Terkini:</label>
                <input
                  type="text"
                  value={formData.sbar.situation}
                  onChange={(e) => setFormData({ ...formData, sbar: { ...formData.sbar, situation: e.target.value } })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">B (Background) - Latar Belakang Klinis:</label>
                <input
                  type="text"
                  value={formData.sbar.background}
                  onChange={(e) => setFormData({ ...formData, sbar: { ...formData.sbar, background: e.target.value } })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">A (Assessment) - Hasil Asesmen & Kondisi:</label>
                <input
                  type="text"
                  value={formData.sbar.assessment}
                  onChange={(e) => setFormData({ ...formData, sbar: { ...formData.sbar, assessment: e.target.value } })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-0.5">R (Recommendation) - Rekomendasi Lanjutan:</label>
                <input
                  type="text"
                  value={formData.sbar.recommendation}
                  onChange={(e) => setFormData({ ...formData, sbar: { ...formData.sbar, recommendation: e.target.value } })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Tanda Vital Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-center">
            <div>
              <span className="text-[10px] text-slate-500 block">Kesadaran</span>
              <span className="font-bold">{formData.tandaVitalSaatPindah.kesadaran}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Tekanan Darah</span>
              <span className="font-bold">{formData.tandaVitalSaatPindah.td}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Nadi</span>
              <span className="font-bold">{formData.tandaVitalSaatPindah.nadi}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Suhu</span>
              <span className="font-bold">{formData.tandaVitalSaatPindah.suhu}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">SpO2</span>
              <span className="font-bold text-emerald-600">{formData.tandaVitalSaatPindah.spo2}</span>
            </div>
          </div>

          {/* Petugas Pengantar & Penerima */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Petugas Pengantar (Unit Asal)</label>
              <input
                type="text"
                value={formData.petugasPengantar}
                onChange={(e) => setFormData({ ...formData, petugasPengantar: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Petugas Penerima (Unit Tujuan)</label>
              <input
                type="text"
                value={formData.petugasPenerima}
                onChange={(e) => setFormData({ ...formData, petugasPenerima: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Transfer_Pasien_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Formulir Transfer"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
            documentData={documentDataForPrint}
            docType="transfer_pasien"
            title="FORMULIR TRANSFER PASIEN (SBAR)"
          />

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-300"
            >
              Tutup
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" /> Simpan Transfer SBAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
