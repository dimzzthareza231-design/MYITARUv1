import React, { useState } from 'react';
import { Activity, HeartPulse, CheckCircle2, User, Eye, FileSpreadsheet, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface EkgModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function ElectrophysiologyExhibitModal({ isOpen, onClose, patient }: EkgModalProps) {
  const [jenisPemeriksaan, setJenisPemeriksaan] = useState<'EKG 12-Lead' | 'EEG Brain Mapping' | 'EMG / NCV'>('EKG 12-Lead');
  const [irama, setIrama] = useState('Sinus Rhythm (Irama Sinus Reguler)');
  const [heartRate, setHeartRate] = useState(78);
  const [axisJantung, setAxisJantung] = useState('Normoaxis (+60 derajat)');
  const [gelombangP, setGelombangP] = useState('Normal (0.08 detik, tinggi <0.25 mV)');
  const [intervalPR, setIntervalPR] = useState('0.16 detik (Normal 0.12 - 0.20s)');
  const [kompleksQRS, setKompleksQRS] = useState('0.08 detik (Sempit / Normal)');
  const [segmenST, setSegmenST] = useState('Isoelektrik, tidak ada ST Elevasi / Depresi bermakna');
  const [gelombangT, setGelombangT] = useState('Upright konveks di sadapan I, II, aVF, V3-V6; Inverted di aVR');
  const [kesimpulan, setKesimpulan] = useState('EKG 12-Lead dalam batas normal (Normal Sinus Rhythm 78 bpm, Normoaxis, no signs of acute ischemia or arrhythmia).');

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_ekg_exhibit_${patient?.no_rm || patient?.id || 'default'}`;
    const data = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      jenisPemeriksaan,
      irama,
      heartRate,
      axisJantung,
      gelombangP,
      intervalPR,
      kompleksQRS,
      segmenST,
      gelombangT,
      kesimpulan,
      spesialisJantung: 'dr. Farhan Malik, Sp.JP(K), FIHA'
    };
    localStorage.setItem(key, JSON.stringify(data));
    toast.success(`Hasil Pembacaan ${jenisPemeriksaan} berhasil disimpan ke Rekam Medis!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-red-700 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Hasil Pemeriksaan Elektrofisiologi Asli (EKG 12-Lead / EEG / EMG)</h2>
              <p className="text-xs text-red-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Standar PERKI / Dokumen Penunjang Diagnostik
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* EXAM SELECTOR */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Modalitas Pemeriksaan:</span>
              <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                {(['EKG 12-Lead', 'EEG Brain Mapping', 'EMG / NCV'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setJenisPemeriksaan(type)}
                    className={`px-3 py-1.5 font-bold text-xs ${jenisPemeriksaan === type ? 'bg-red-700 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono font-bold text-red-600">
              ⚡ Paper Speed: 25 mm/s • Voltage: 10 mm/mV
            </div>
          </div>

          {/* SIMULATED HIGH FIDELITY EKG WAVEFORM VISUALIZER */}
          <div className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono border border-slate-700 space-y-2 shadow-inner">
            <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-800 pb-1">
              <span>LEAD II (Long Rhythm Strip)</span>
              <span className="text-emerald-400 font-bold">{heartRate} BPM • Regular Sinus Rhythm</span>
            </div>
            
            {/* SVG Waveform Strip */}
            <div className="w-full h-24 overflow-hidden flex items-center bg-slate-950/80 rounded border border-emerald-950/80 relative">
              <div className="absolute inset-0 opacity-15 grid grid-cols-12 grid-rows-6 gap-1 pointer-events-none">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-pink-500/40" />
                ))}
              </div>
              <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                <path
                  d="M0,50 L40,50 Q45,45 50,40 Q55,45 60,50 L80,50 L85,55 L90,10 L95,85 L100,50 L120,50 Q135,30 150,50 L200,50
                     L240,50 Q245,45 250,40 Q255,45 260,50 L280,50 L285,55 L290,10 L295,85 L300,50 L320,50 Q335,30 350,50 L400,50
                     L440,50 Q445,45 450,40 Q455,45 460,50 L480,50 L485,55 L490,10 L495,85 L500,50 L520,50 Q535,30 550,50 L600,50
                     L640,50 Q645,45 650,40 Q655,45 660,50 L680,50 L685,55 L690,10 L695,85 L700,50 L720,50 Q735,30 750,50 L800,50
                     L840,50 Q845,45 850,40 Q855,45 860,50 L880,50 L885,55 L890,10 L895,85 L900,50 L920,50 Q935,30 950,50 L1000,50"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="text-[10px] text-slate-400 text-right">Kalibrasi: 1 mV = 10 mm • Standard 12-Lead EKG Machine SN: EKG-MED-9921</div>
          </div>

          {/* PARAMETERS FORM */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              Parameter Analisis Morfologi Gelombang & Interval
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Irama Dasar:</label>
                <input type="text" value={irama} onChange={(e) => setIrama(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Heart Rate (bpm):</label>
                <input type="number" value={heartRate} onChange={(e) => setHeartRate(Number(e.target.value))} className="w-full p-2 border rounded font-bold text-red-600 bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Axis Jantung:</label>
                <input type="text" value={axisJantung} onChange={(e) => setAxisJantung(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Gelombang P:</label>
                <input type="text" value={gelombangP} onChange={(e) => setGelombangP(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Interval PR:</label>
                <input type="text" value={intervalPR} onChange={(e) => setIntervalPR(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Kompleks QRS:</label>
                <input type="text" value={kompleksQRS} onChange={(e) => setKompleksQRS(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Segmen ST:</label>
                <input type="text" value={segmenST} onChange={(e) => setSegmenST(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-slate-500 font-bold mb-1">Gelombang T & Gelombang Lain:</label>
                <input type="text" value={gelombangT} onChange={(e) => setGelombangT(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Kesimpulan & Interpretasi Klinis Spesialis Jantung:</label>
              <textarea
                value={kesimpulan}
                onChange={(e) => setKesimpulan(e.target.value)}
                rows={2}
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Hasil_${jenisPemeriksaan.replace(/ /g, '_')}_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar EKG"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="grafik_ekg_eeg"
            title="LEMBAR HASIL PEMERIKSAAN ELEKTROFISIOLOGI (EKG/EEG)"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-red-700 hover:bg-red-800 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan Hasil Pemeriksaan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
