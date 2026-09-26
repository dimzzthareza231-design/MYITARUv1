import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, User, Clock, Printer } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface FallRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function FallRiskAssessmentModal({ isOpen, onClose, patient }: FallRiskModalProps) {
  const isPediatric = (patient?.umur || 30) < 18;
  const [scaleType, setScaleType] = useState<'morse' | 'humpty'>(isPediatric ? 'humpty' : 'morse');

  // Morse State
  const [morseValues, setMorseValues] = useState({
    riwayatJatuh: 0, // 0 or 25
    diagnosisSekunder: 15, // 0 or 15
    alatBantu: 15, // 0, 15, 30
    terpasangInfus: 20, // 0 or 20
    gayaBerjalan: 10, // 0, 10, 20
    statusMental: 0, // 0 or 15
  });

  // Humpty Dumpty State
  const [humptyValues, setHumptyValues] = useState({
    usia: 2, // 1-4
    jenisKelamin: 2, // 1-2
    diagnosis: 3, // 1-4
    gangguanKognitif: 2, // 1-3
    faktorLingkungan: 2, // 1-4
    responSedasi: 2, // 1-3
    penggunaanObat: 2, // 1-3
  });

  const [shift, setShift] = useState<'Pagi' | 'Sore' | 'Malam'>('Pagi');
  const [interventions, setInterventions] = useState({
    gelangKuning: true,
    segitigaJatuh: true,
    bedRailTerkunci: true,
    belJangkauan: true,
    lantaiKering: true,
    edukasiKeluarga: true,
    pendampinganMobilisasi: true,
  });

  if (!isOpen) return null;

  const morseScore = Object.values(morseValues).reduce((a, b) => a + b, 0);
  const getMorseRisk = (score: number) => {
    if (score >= 45) return { label: 'Risiko Tinggi (High Risk)', color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900', badge: 'bg-rose-600' };
    if (score >= 25) return { label: 'Risiko Sedang (Moderate Risk)', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900', badge: 'bg-amber-600' };
    return { label: 'Risiko Rendah (Low Risk)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900', badge: 'bg-emerald-600' };
  };

  const humptyScore = Object.values(humptyValues).reduce((a, b) => a + b, 0);
  const getHumptyRisk = (score: number) => {
    if (score >= 12) return { label: 'Risiko Tinggi Anak (High Risk)', color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900', badge: 'bg-rose-600' };
    return { label: 'Risiko Rendah Anak (Low Risk)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900', badge: 'bg-emerald-600' };
  };

  const currentRisk = scaleType === 'morse' ? getMorseRisk(morseScore) : getHumptyRisk(humptyScore);
  const currentTotal = scaleType === 'morse' ? morseScore : humptyScore;

  const handleSave = () => {
    const key = `hospital_fall_risk_${patient?.no_rm || patient?.id || 'default'}`;
    const logItem = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      shift,
      scaleType,
      skor: currentTotal,
      kategori: currentRisk.label,
      petugas: 'Ns. Ratna Sari, S.Kep',
      intervensi: interventions
    };
    let saved: any[] = [];
    try {
      const raw = localStorage.getItem(key);
      saved = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(saved)) saved = [];
    } catch (e) {
      saved = [];
    }
    localStorage.setItem(key, JSON.stringify([logItem, ...saved]));
    toast.success(`Asesmen Risiko Jatuh (${scaleType.toUpperCase()}) berhasil disimpan untuk Shift ${shift}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-amber-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Lembar Asesmen Risiko Jatuh Berkala Tiap Shift</h2>
              <p className="text-xs text-amber-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Standar KARS SKP.6 / Permenkes No. 24/2022
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* SCALE TYPE & SHIFT SELECTOR */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Pilih Skala:</span>
              <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                <button
                  type="button"
                  onClick={() => setScaleType('morse')}
                  className={`px-3 py-1.5 font-bold text-xs transition-colors ${scaleType === 'morse' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  Morse Fall Scale (Dewasa)
                </button>
                <button
                  type="button"
                  onClick={() => setScaleType('humpty')}
                  className={`px-3 py-1.5 font-bold text-xs transition-colors ${scaleType === 'humpty' ? 'bg-amber-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  Humpty Dumpty (Pediatri/Anak)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-slate-700 dark:text-slate-300">Shift Asesmen:</span>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              >
                <option value="Pagi">Shift Pagi (07:00 - 14:00)</option>
                <option value="Sore">Shift Sore (14:00 - 21:00)</option>
                <option value="Malam">Shift Malam (21:00 - 07:00)</option>
              </select>
            </div>
          </div>

          {/* MORSE FALL SCALE FORM */}
          {scaleType === 'morse' ? (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
                1. Parameter Pengkajian Morse Fall Scale (Dewasa)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">1. Riwayat Jatuh (3 bulan terakhir):</label>
                  <select
                    value={morseValues.riwayatJatuh}
                    onChange={(e) => setMorseValues({ ...morseValues, riwayatJatuh: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={0}>Tidak ada (Skor 0)</option>
                    <option value={25}>Ya, ada riwayat jatuh (Skor 25)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">2. Diagnosis Medis Sekunder (&gt;1 diagnosis):</label>
                  <select
                    value={morseValues.diagnosisSekunder}
                    onChange={(e) => setMorseValues({ ...morseValues, diagnosisSekunder: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={0}>Tidak (Skor 0)</option>
                    <option value={15}>Ya (Skor 15)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">3. Alat Bantu Berjalan:</label>
                  <select
                    value={morseValues.alatBantu}
                    onChange={(e) => setMorseValues({ ...morseValues, alatBantu: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={0}>Tidak ada / Bed rest / Dibantu perawat (Skor 0)</option>
                    <option value={15}>Kruk / Tongkat / Walker (Skor 15)</option>
                    <option value={30}>Berpegangan pada perabot / furniture (Skor 30)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">4. Terpasang Infus Intravena / Heparin Lock:</label>
                  <select
                    value={morseValues.terpasangInfus}
                    onChange={(e) => setMorseValues({ ...morseValues, terpasangInfus: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={0}>Tidak (Skor 0)</option>
                    <option value={20}>Ya (Skor 20)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">5. Gaya Berjalan / Berpindah:</label>
                  <select
                    value={morseValues.gayaBerjalan}
                    onChange={(e) => setMorseValues({ ...morseValues, gayaBerjalan: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={0}>Normal / Bed rest / Immobile (Skor 0)</option>
                    <option value={10}>Lemah / Langkah pendek tapi teratur (Skor 10)</option>
                    <option value={20}>Terganggu / Goyah / Hilang keseimbangan (Skor 20)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">6. Status Mental:</label>
                  <select
                    value={morseValues.statusMental}
                    onChange={(e) => setMorseValues({ ...morseValues, statusMental: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={0}>Menyadari keterbatasan diri sendiri (Skor 0)</option>
                    <option value={15}>Overestimasi kemampuan / Lupa keterbatasan (Skor 15)</option>
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
                1. Parameter Pengkajian Humpty Dumpty Scale (Anak-Anak)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">1. Usia Pasien:</label>
                  <select
                    value={humptyValues.usia}
                    onChange={(e) => setHumptyValues({ ...humptyValues, usia: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={4}>Dibawah 3 tahun (Skor 4)</option>
                    <option value={3}>3 - 7 tahun (Skor 3)</option>
                    <option value={2}>7 - 13 tahun (Skor 2)</option>
                    <option value={1}>&gt; 13 tahun (Skor 1)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">2. Diagnosis:</label>
                  <select
                    value={humptyValues.diagnosis}
                    onChange={(e) => setHumptyValues({ ...humptyValues, diagnosis: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={4}>Kelainan neurologi (Skor 4)</option>
                    <option value={3}>Perubahan oksigenasi (respiratorik, anemia, dehidrasi) (Skor 3)</option>
                    <option value={2}>Gangguan psikologis / perilaku (Skor 2)</option>
                    <option value={1}>Diagnosis lain (Skor 1)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">3. Gangguan Kognitif:</label>
                  <select
                    value={humptyValues.gangguanKognitif}
                    onChange={(e) => setHumptyValues({ ...humptyValues, gangguanKognitif: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={3}>Tidak sadar terhadap keterbatasan (Skor 3)</option>
                    <option value={2}>Lupa terhadap keterbatasan (Skor 2)</option>
                    <option value={1}>Mengetahui kemampuan diri (Skor 1)</option>
                  </select>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">4. Faktor Lingkungan:</label>
                  <select
                    value={humptyValues.faktorLingkungan}
                    onChange={(e) => setHumptyValues({ ...humptyValues, faktorLingkungan: Number(e.target.value) })}
                    className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value={4}>Riwayat jatuh saat di ranjang / bayi (Skor 4)</option>
                    <option value={3}>Pasien menggunakan alat bantu / boks (Skor 3)</option>
                    <option value={2}>Pasien di tempat tidur standar (Skor 2)</option>
                    <option value={1}>Rawat jalan / poliklinik (Skor 1)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* HASIL SCORING & INTERVENSI */}
          <div className="p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-md ${currentRisk.badge}`}>
                <span className="text-xl leading-none">{currentTotal}</span>
                <span className="text-[9px] uppercase font-mono">SKOR</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Klasifikasi Risiko Jatuh:</p>
                <p className="text-base font-black text-slate-900 dark:text-white">{currentRisk.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Wajib diperbarui setiap pergantian shift perawat & saat ada perubahan terapi</p>
              </div>
            </div>

            <div className="text-right">
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border ${currentRisk.color}`}>
                <ShieldAlert className="w-4 h-4" /> Intervensi Wajib Terpasang
              </span>
            </div>
          </div>

          {/* CHECKLIST INTERVENSI PENCEGAHAN JATUH */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              2. Checklist Tindakan Pencegahan Jatuh (KARS SKP.6):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {Object.entries(interventions).map(([key, val]) => (
                <label key={key} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 cursor-pointer hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) => setInterventions({ ...interventions, [key]: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {key === 'gelangKuning' && '🟡 Pasang Gelang Identifikasi Kuning (Risiko Jatuh)'}
                    {key === 'segitigaJatuh' && '⚠️ Pasang Penanda Segitiga Kuning di Atas Bed'}
                    {key === 'bedRailTerkunci' && '🔒 Pengaman Tempat Tidur (Bed Rails) Terkunci'}
                    {key === 'belJangkauan' && '🔔 Tombol Bel Perawat dalam Jangkauan Pasien'}
                    {key === 'lantaiKering' && '🧹 Pastikan Lantai Kering & Pencahayaan Cukup'}
                    {key === 'edukasiKeluarga' && '👨‍👩‍👦 Edukasi Pencegahan Jatuh kepada Keluarga Pasien'}
                    {key === 'pendampinganMobilisasi' && '🚶 Pendampingan saat Pasien Mobilisasi / Ke Toilet'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Asesmen_Risiko_Jatuh_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar Asesmen"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="asesmen_risiko_jatuh"
            title="LEMBAR ASESMEN RISIKO JATUH"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan & Validasi Shift
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
