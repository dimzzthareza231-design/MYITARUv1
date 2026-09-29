import React, { useState } from 'react';
import { FileText, User, HeartPulse, Stethoscope, CheckCircle2, ShieldCheck, Printer, Save, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface AsesmenAwalRanapModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function AsesmenAwalRanapModal({ isOpen, onClose, patient }: AsesmenAwalRanapModalProps) {
  const [formData, setFormData] = useState(() => {
    const key = `hospital_asesmen_ranap_${patient?.no_rm || patient?.id || 'default'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      keluhanUtama: patient?.keluhan || 'Demam tinggi naik turun sejak 4 hari SMRS disertai nyeri sendi dan mual',
      riwayatPenyakitSekarang: 'Pasien mengeluhkan demam mendadak tinggi, sakit kepala retro-orbital, nyeri sendi pegal linu, mual dan nafsu makan menurun. Tidak ada batuk pilek.',
      riwayatPenyakitDahulu: 'Riwayat Gastritis erosif (2023), Hipertensi Terkontrol (-), DM (-)',
      riwayatAlergi: patient?.alergi || 'Alergi Golongan Penisilin (Urtikaria & Gatal)',
      keadaanUmum: 'Tampak sakit sedang, compos mentis',
      gcs: 'E4M6V5 (15)',
      tandaVital: {
        td: '110/70 mmHg',
        nadi: '88 x/menit',
        suhu: '38.4 °C',
        rr: '20 x/menit',
        spo2: '98% Room Air',
      },
      pemeriksaanFisikLengkap: 'Mata: Konjungtiva anemis (-/-), Sklera ikterik (-/-). Thorax: Cor S1-S2 murni reguler, Pulmo vesikuler +/+, rhonki -/-, wheezing -/-. Abdomen: Supel, bising usus normoaktif, nyeri tekan epigastrium (+), hepar/lien tidak teraba membesar. Ekstremitas: Akral hangat, CRT < 2 detik, petekie halus di lengan volar (+).',
      diagnosisMasuk: 'DHF (Dengue Hemorrhagic Fever) Grade II + Dyspepsia Syndrome',
      diagnosisBanding: 'Demam Tifoid, Viral Infection NOS',
      rencanaPemeriksaanPenunjang: 'Pemeriksaan Darah Lengkap serial per 12 jam, NS1 Antigen Rapid, Serologi IgG/IgM Anti-Dengue, SGOT/SGPT, Elektrolit Serum.',
      terapiAwal: '1. IVFD Ringer Lactat 2000 ml / 24 jam\n2. Inj. Paracetamol 1000 mg IV k/p suhu >= 38.5C\n3. Inj. Omeprazole 40 mg / 24 jam IV\n4. Inj. Ondansetron 4 mg / 8 jam IV (k/p mual)\n5. Oral: Curcuma 3x1 tab, Diet Lunak TKTP Tinggi Cairan',
      dpjpUtama: 'dr. Hendra Pratama, Sp.PD',
      perawatPenerima: 'Ns. Ratna Sari, S.Kep',
    };
  });

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_asesmen_ranap_${patient?.no_rm || patient?.id || 'default'}`;
    localStorage.setItem(key, JSON.stringify(formData));
    toast.success('Asesmen Awal Medis & Keperawatan Rawat Inap berhasil disimpan!');
    onClose();
  };

  const documentDataForPrint = {
    ...patient,
    asesmenRanapData: formData,
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-blue-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Asesmen Awal Medis & Keperawatan Rawat Inap (RM.04)</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/80 font-mono">Permenkes 24/2022</span>
              </div>
              <p className="text-xs text-blue-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> (No. RM: {patient?.no_rm || '-'}) • Evaluasi Komprehensif 24 Jam Pertama Admisi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white text-2xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-100 text-sm">
          
          {/* Tanda Vital Strip */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" /> Tanda-Tanda Vital & Kondisi Fisik Saat Masuk
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Tekanan Darah</label>
                <input
                  type="text"
                  value={formData.tandaVital.td}
                  onChange={(e) => setFormData({ ...formData, tandaVital: { ...formData.tandaVital, td: e.target.value } })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Nadi (x/mnt)</label>
                <input
                  type="text"
                  value={formData.tandaVital.nadi}
                  onChange={(e) => setFormData({ ...formData, tandaVital: { ...formData.tandaVital, nadi: e.target.value } })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Suhu Tubuh (°C)</label>
                <input
                  type="text"
                  value={formData.tandaVital.suhu}
                  onChange={(e) => setFormData({ ...formData, tandaVital: { ...formData.tandaVital, suhu: e.target.value } })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono font-bold text-rose-600 dark:text-rose-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">Respirasi (x/mnt)</label>
                <input
                  type="text"
                  value={formData.tandaVital.rr}
                  onChange={(e) => setFormData({ ...formData, tandaVital: { ...formData.tandaVital, rr: e.target.value } })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">SpO2 (%)</label>
                <input
                  type="text"
                  value={formData.tandaVital.spo2}
                  onChange={(e) => setFormData({ ...formData, tandaVital: { ...formData.tandaVital, spo2: e.target.value } })}
                  className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono font-bold text-emerald-600 dark:text-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Anamnesis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Keluhan Utama</label>
              <textarea
                rows={2}
                value={formData.keluhanUtama}
                onChange={(e) => setFormData({ ...formData, keluhanUtama: e.target.value })}
                className="w-full p-2.5 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Riwayat Alergi Obat & Makanan</label>
              <textarea
                rows={2}
                value={formData.riwayatAlergi}
                onChange={(e) => setFormData({ ...formData, riwayatAlergi: e.target.value })}
                className="w-full p-2.5 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 text-rose-600 dark:text-rose-400 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Riwayat Penyakit Sekarang (RPS)</label>
            <textarea
              rows={2}
              value={formData.riwayatPenyakitSekarang}
              onChange={(e) => setFormData({ ...formData, riwayatPenyakitSekarang: e.target.value })}
              className="w-full p-2.5 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Pemeriksaan Fisik Lengkap (Head-to-Toe)</label>
            <textarea
              rows={3}
              value={formData.pemeriksaanFisikLengkap}
              onChange={(e) => setFormData({ ...formData, pemeriksaanFisikLengkap: e.target.value })}
              className="w-full p-2.5 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Diagnosis & Terapi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900">
              <label className="text-xs font-bold text-blue-900 dark:text-blue-300 block mb-1">Diagnosis Masuk / Kerja (ICD-10)</label>
              <input
                type="text"
                value={formData.diagnosisMasuk}
                onChange={(e) => setFormData({ ...formData, diagnosisMasuk: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-800 font-bold"
              />
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mt-2 mb-1">Diagnosis Banding (Differential Diagnosis)</label>
              <input
                type="text"
                value={formData.diagnosisBanding}
                onChange={(e) => setFormData({ ...formData, diagnosisBanding: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Rencana Terapi Awal & Instruksi Medis</label>
              <textarea
                rows={4}
                value={formData.terapiAwal}
                onChange={(e) => setFormData({ ...formData, terapiAwal: e.target.value })}
                className="w-full p-2.5 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tenaga Medis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Dokter DPJP Utama</label>
              <input
                type="text"
                value={formData.dpjpUtama}
                onChange={(e) => setFormData({ ...formData, dpjpUtama: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Perawat Penerima Admisi</label>
              <input
                type="text"
                value={formData.perawatPenerima}
                onChange={(e) => setFormData({ ...formData, perawatPenerima: e.target.value })}
                className="w-full p-2 text-xs border rounded-lg bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Asesmen_Awal_Ranap_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar RM.04"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl"
            documentData={documentDataForPrint}
            docType="asesmen_medis_ranap"
            title="ASESMEN AWAL RAWAT INAP (RM.04)"
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-4 h-4" /> Simpan Asesmen Ranap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
