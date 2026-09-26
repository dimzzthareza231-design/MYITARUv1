import React, { useState } from 'react';
import { HeartPulse, Activity, CheckCircle2, ShieldAlert, Clock, User, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface PainModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function PainManagementModal({ isOpen, onClose, patient }: PainModalProps) {
  const [scaleType, setScaleType] = useState<'nrs' | 'flacc'>('nrs');
  const [nrsScore, setNrsScore] = useState<number>(4);

  // FLACC states
  const [flaccFace, setFlaccFace] = useState(1);
  const [flaccLegs, setFlaccLegs] = useState(1);
  const [flaccActivity, setFlaccActivity] = useState(1);
  const [flaccCry, setFlaccCry] = useState(0);
  const [flaccConsolability, setFlaccConsolability] = useState(1);

  // OPQRST Pain details
  const [lokasiNyeri, setLokasiNyeri] = useState('Abdomen kuadran kanan bawah & Epigastrium');
  const [karakteristik, setKarakteristik] = useState('Nyeri tumpul berdenyut (cramping/throbbing)');
  const [durasiNyeri, setDurasiNyeri] = useState('Hilang timbul (intermiten), durasi 15-30 menit');
  const [faktorPemberat, setFaktorPemberat] = useState('Aktivitas bergerak & batuk');
  const [faktorPeringan, setFaktorPeringan] = useState('Posisi semifowler & istirahat tirah baring');

  // Interventions
  const [farmakologi, setFarmakologi] = useState('Ketorolac 30mg IV bolus / 8 jam + Paracetamol 1000mg infus');
  const [nonFarmakologi, setNonFarmakologi] = useState('Teknik relaksasi nafas dalam, kompres hangat lokal, distraksi audio');
  const [evaluasiNyeri, setEvaluasiNyeri] = useState('Nyeri berkurang dari skala 6 menjadi skala 2 setelah 30 menit pemberian analgetik');

  if (!isOpen) return null;

  const flaccTotal = flaccFace + flaccLegs + flaccActivity + flaccCry + flaccConsolability;
  const currentScore = scaleType === 'nrs' ? nrsScore : flaccTotal;

  const getSeverity = (score: number) => {
    if (score === 0) return { label: 'Tidak Nyeri (0)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score <= 3) return { label: 'Nyeri Ringan (Mild 1-3)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score <= 6) return { label: 'Nyeri Sedang (Moderate 4-6)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Nyeri Berat (Severe 7-10)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const handleSave = () => {
    const key = `hospital_pain_assessment_${patient?.no_rm || patient?.id || 'default'}`;
    const logItem = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      scaleType,
      skor: currentScore,
      severity: getSeverity(currentScore).label,
      lokasi: lokasiNyeri,
      karakteristik,
      durasi: durasiNyeri,
      farmakologi,
      nonFarmakologi,
      evaluasi: evaluasiNyeri,
      petugas: 'Ns. Hendri Saputra, S.Kep'
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
    toast.success('Asesmen & Evaluasi Manajemen Nyeri berhasil disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-rose-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Asesmen & Manajemen Nyeri Berkala (VAS / NRS / FLACC)</h2>
              <p className="text-xs text-rose-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Standar KARS PAP.6 Manajemen Nyeri Komprehensif
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* SCALE SELECTION & VISUAL SLIDER */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
                <button
                  type="button"
                  onClick={() => setScaleType('nrs')}
                  className={`px-3 py-1.5 font-bold text-xs ${scaleType === 'nrs' ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-800'}`}
                >
                  Numeric Rating Scale (NRS / VAS 0-10)
                </button>
                <button
                  type="button"
                  onClick={() => setScaleType('flacc')}
                  className={`px-3 py-1.5 font-bold text-xs ${scaleType === 'flacc' ? 'bg-rose-600 text-white' : 'bg-white dark:bg-slate-800'}`}
                >
                  FLACC Scale (Pediatri / Kritis)
                </button>
              </div>

              <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverity(currentScore).color}`}>
                Intensitas: {getSeverity(currentScore).label}
              </div>
            </div>

            {scaleType === 'nrs' ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Skor Nyeri Pasien Saat Ini:</span>
                  <span className="text-2xl font-black text-rose-600">{nrsScore} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={nrsScore}
                  onChange={(e) => setNrsScore(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                  <span>😀 0: Tidak Nyeri</span>
                  <span>😐 1-3: Nyeri Ringan</span>
                  <span>😣 4-6: Nyeri Sedang</span>
                  <span>😭 7-10: Nyeri Berat</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold block mb-1">F - Face (Wajah):</label>
                  <select value={flaccFace} onChange={(e) => setFlaccFace(Number(e.target.value))} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                    <option value={0}>0: Senyum / Tidak ada ekspresi khusus</option>
                    <option value={1}>1: Menyeringai sesekali / Mengerutkan kening</option>
                    <option value={2}>2: Dagu gemetar / Mengatupkan gigi rapat</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">L - Legs (Kaki):</label>
                  <select value={flaccLegs} onChange={(e) => setFlaccLegs(Number(e.target.value))} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                    <option value={0}>0: Posisi normal / Santai</option>
                    <option value={1}>1: Gelisah / Kaku / Tegang</option>
                    <option value={2}>2: Menendang-nendang / Kaki ditekuk</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">A - Activity (Aktivitas):</label>
                  <select value={flaccActivity} onChange={(e) => setFlaccActivity(Number(e.target.value))} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                    <option value={0}>0: Berbaring tenang / Bergerak mudah</option>
                    <option value={1}>1: Menggeliat / Bergerak bolak-balik</option>
                    <option value={2}>2: Melengkung / Kaku / Menghentak</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">C - Cry (Menangis):</label>
                  <select value={flaccCry} onChange={(e) => setFlaccCry(Number(e.target.value))} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                    <option value={0}>0: Tidak menangis</option>
                    <option value={1}>1: Merintih / Merengek sesekali</option>
                    <option value={2}>2: Menangis terus / Menjerit</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold block mb-1">C - Consolability (Dapat Ditenangkan):</label>
                  <select value={flaccConsolability} onChange={(e) => setFlaccConsolability(Number(e.target.value))} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                    <option value={0}>0: Tenang / Puas / Rileks</option>
                    <option value={1}>1: Dapat ditenangkan dengan sentuhan / suara</option>
                    <option value={2}>2: Sulit ditenangkan / Tidak nyaman</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* OPQRST DETAILS */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              Deskripsi Karakteristik Nyeri (Metode OPQRST)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Lokasi & Penjalaran Nyeri:</label>
                <input
                  type="text"
                  value={lokasiNyeri}
                  onChange={(e) => setLokasiNyeri(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Karakteristik & Kualitas Nyeri:</label>
                <input
                  type="text"
                  value={karakteristik}
                  onChange={(e) => setKarakteristik(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Durasi & Frekuensi (Time):</label>
                <input
                  type="text"
                  value={durasiNyeri}
                  onChange={(e) => setDurasiNyeri(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Faktor Pemberat & Peringan:</label>
                <input
                  type="text"
                  value={`${faktorPemberat} / ${faktorPeringan}`}
                  onChange={(e) => { setFaktorPemberat(e.target.value); }}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-medium"
                />
              </div>
            </div>
          </div>

          {/* INTERVENTIONS & RE-EVALUATION */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              Intervensi Tatalaksana Nyeri & Evaluasi Ulang
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Intervensi Farmakologi (Analgetik):</label>
                <textarea
                  value={farmakologi}
                  onChange={(e) => setFarmakologi(e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Intervensi Non-Farmakologi:</label>
                <textarea
                  value={nonFarmakologi}
                  onChange={(e) => setNonFarmakologi(e.target.value)}
                  rows={2}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hasil Evaluasi Respon Nyeri (30-60 menit paska intervensi):</label>
              <textarea
                value={evaluasiNyeri}
                onChange={(e) => setEvaluasiNyeri(e.target.value)}
                rows={2}
                className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-medium text-emerald-700 dark:text-emerald-400"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Manajemen_Nyeri_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Lembar Nyeri"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="asesmen_nyeri"
            title="LEMBAR ASESMEN & EVALUASI MANAJEMEN NYERI"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan Evaluasi Nyeri
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
