import React, { useState } from 'react';
import { Baby, Activity, HeartPulse, CheckCircle2, User, Clock, ShieldCheck, Scale } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface NeonatalModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function NeonatalApgarModal({ isOpen, onClose, patient }: NeonatalModalProps) {
  // APGAR 1 Minute
  const [apgar1, setApgar1] = useState({
    appearance: 2, // Color: 0 blue/pale, 1 body pink limbs blue, 2 completely pink
    pulse: 2, // Heart rate: 0 absent, 1 <100, 2 >100
    grimace: 2, // Reflex irritability: 0 floppy, 1 minimal response, 2 prompt sneeze/cough/cry
    activity: 2, // Muscle tone: 0 absent, 1 flexed arms/legs, 2 active motion
    respiration: 2, // Respiratory effort: 0 absent, 1 slow/irregular, 2 vigorous cry
  });

  // APGAR 5 Minute
  const [apgar5, setApgar5] = useState({
    appearance: 2,
    pulse: 2,
    grimace: 2,
    activity: 2,
    respiration: 2,
  });

  // Birth Measurements
  const [bbLahir, setBbLahir] = useState(3200);
  const [pbLahir, setPbLahir] = useState(49);
  const [lkLahir, setLkLahir] = useState(34);
  const [ldLahir, setLdLahir] = useState(33);
  const [usiaGestasi, setUsiaGestasi] = useState('39 Minggu (Aterm)');
  const [jenisPersalinan, setJenisPersalinan] = useState('Spontan Pervaginam (Letak Belakang Kepala)');
  const [airKetuban, setAirKetuban] = useState('Jernih, volume cukup');

  // Prophylaxis & Immunization
  const [injeksiVitK, setInjeksiVitK] = useState(true);
  const [salepMata, setSalepMata] = useState(true);
  const [hb0Vaksin, setHb0Vaksin] = useState(true);
  const [skriningShk, setSkriningShk] = useState(true); // Skrining Hipotiroid Kongenital

  if (!isOpen) return null;

  const score1 = Object.values(apgar1).reduce((a, b) => a + b, 0);
  const score5 = Object.values(apgar5).reduce((a, b) => a + b, 0);

  const getApgarCategory = (score: number) => {
    if (score >= 7) return { label: 'Asfiksia Ringan / Normal (Bugar)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (score >= 4) return { label: 'Asfiksia Sedang (Moderate)', color: 'text-amber-700 bg-amber-50 border-amber-300' };
    return { label: 'Asfiksia Berat (Severe Depressed)', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  };

  const handleSave = () => {
    const key = `hospital_neonatal_apgar_${patient?.no_rm || patient?.id || 'default'}`;
    const neonatalData = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      apgar1: score1,
      apgar5: score5,
      apgar1Category: getApgarCategory(score1).label,
      apgar5Category: getApgarCategory(score5).label,
      antropometri: { bb: bbLahir, pb: pbLahir, lk: lkLahir, ld: ldLahir },
      usiaGestasi,
      jenisPersalinan,
      airKetuban,
      profilaksis: { vitK: injeksiVitK, salepMata, hb0: hb0Vaksin, shk: skriningShk },
      dokterSpA: 'dr. Anisa Rahmawati, Sp.A'
    };
    localStorage.setItem(key, JSON.stringify(neonatalData));
    toast.success(`Lembar Penilaian Skor APGAR (${score1}/${score5}) & Bayi Baru Lahir berhasil disimpan!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-cyan-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Lembar Penilaian Neonatal & Skor APGAR (Bayi Baru Lahir)</h2>
              <p className="text-xs text-cyan-100">
                Pasien / Bayi: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Standar IDAI / PONEK Kemenkes RI
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* APGAR SCORES OVERVIEW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-600 text-white flex flex-col items-center justify-center font-black shadow-md">
                <span className="text-2xl leading-none">{score1}</span>
                <span className="text-[9px] uppercase font-mono">/ 10</span>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase">Skor APGAR Menit ke-1:</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{getApgarCategory(score1).label}</p>
                <p className="text-[10px] text-slate-400">Evaluasi adaptasi awal kardiorespirasi</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-black shadow-md">
                <span className="text-2xl leading-none">{score5}</span>
                <span className="text-[9px] uppercase font-mono">/ 10</span>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase">Skor APGAR Menit ke-5:</p>
                <p className="text-sm font-black text-slate-900 dark:text-white">{getApgarCategory(score5).label}</p>
                <p className="text-[10px] text-slate-400">Indikator prognostik neurologis & stabilitas</p>
              </div>
            </div>
          </div>

          {/* APGAR 5 PARAMETERS INPUT */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              Kalkulator 5 Parameter Skor APGAR
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="font-bold block text-slate-800 dark:text-slate-200">A - Appearance (Warna Kulit Tubuh):</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 1:</span>
                    <select value={apgar1.appearance} onChange={(e) => setApgar1({ ...apgar1, appearance: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: Seluruh tubuh kemerahan</option>
                      <option value={1}>1: Tubuh kemerahan, ekstremitas biru (Akrosianosis)</option>
                      <option value={0}>0: Pucat / Sianosis total</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 5:</span>
                    <select value={apgar5.appearance} onChange={(e) => setApgar5({ ...apgar5, appearance: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: Seluruh tubuh kemerahan</option>
                      <option value={1}>1: Akrosianosis</option>
                      <option value={0}>0: Sianosis total</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="font-bold block text-slate-800 dark:text-slate-200">P - Pulse (Denyut Jantung Bayi):</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 1:</span>
                    <select value={apgar1.pulse} onChange={(e) => setApgar1({ ...apgar1, pulse: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: &gt; 100 denyut/menit</option>
                      <option value={1}>1: &lt; 100 denyut/menit</option>
                      <option value={0}>0: Tidak ada denyut (Asistol)</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 5:</span>
                    <select value={apgar5.pulse} onChange={(e) => setApgar5({ ...apgar5, pulse: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: &gt; 100 denyut/menit</option>
                      <option value={1}>1: &lt; 100 denyut/menit</option>
                      <option value={0}>0: Tidak ada denyut</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="font-bold block text-slate-800 dark:text-slate-200">G - Grimace (Refleks Stimulasi & Tangis):</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 1:</span>
                    <select value={apgar1.grimace} onChange={(e) => setApgar1({ ...apgar1, grimace: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: Menangis kuat / Batuk / Bersin</option>
                      <option value={1}>1: Gerakan mimik sedikit / Meringis</option>
                      <option value={0}>0: Tidak ada respon</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 5:</span>
                    <select value={apgar5.grimace} onChange={(e) => setApgar5({ ...apgar5, grimace: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: Menangis kuat</option>
                      <option value={1}>1: Meringis</option>
                      <option value={0}>0: Tidak ada respon</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="font-bold block text-slate-800 dark:text-slate-200">A - Activity (Tonus Otot):</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 1:</span>
                    <select value={apgar1.activity} onChange={(e) => setApgar1({ ...apgar1, activity: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: Gerakan aktif, fleksi kuat</option>
                      <option value={1}>1: Fleksi ringan pada ekstremitas</option>
                      <option value={0}>0: Lemas / Flaccid</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 5:</span>
                    <select value={apgar5.activity} onChange={(e) => setApgar5({ ...apgar5, activity: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: Gerakan aktif</option>
                      <option value={1}>1: Fleksi ringan</option>
                      <option value={0}>0: Flaccid</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 md:col-span-2">
                <label className="font-bold block text-slate-800 dark:text-slate-200">R - Respiration (Usaha Pernafasan):</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 1:</span>
                    <select value={apgar1.respiration} onChange={(e) => setApgar1({ ...apgar1, respiration: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: Menangis keras, nafas teratur</option>
                      <option value={1}>1: Nafas lambat / Tak teratur</option>
                      <option value={0}>0: Tidak bernafas (Apnea)</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Menit 5:</span>
                    <select value={apgar5.respiration} onChange={(e) => setApgar5({ ...apgar5, respiration: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                      <option value={2}>2: Menangis keras</option>
                      <option value={1}>1: Nafas lambat</option>
                      <option value={0}>0: Apnea</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BIRTH ANTHROPOMETRY & NEONATAL CARE */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              Antropometri Kelahiran & Profilaksis Bayi Baru Lahir
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Berat Lahir (gram):</label>
                <input type="number" value={bbLahir} onChange={(e) => setBbLahir(Number(e.target.value))} className="w-full p-2 border rounded font-bold text-cyan-600 bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Panjang Badan (cm):</label>
                <input type="number" value={pbLahir} onChange={(e) => setPbLahir(Number(e.target.value))} className="w-full p-2 border rounded font-bold bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Lingkar Kepala (cm):</label>
                <input type="number" value={lkLahir} onChange={(e) => setLkLahir(Number(e.target.value))} className="w-full p-2 border rounded font-bold bg-white dark:bg-slate-900" />
              </div>
              <div>
                <label className="block text-slate-500 font-bold mb-1">Lingkar Dada (cm):</label>
                <input type="number" value={ldLahir} onChange={(e) => setLdLahir(Number(e.target.value))} className="w-full p-2 border rounded font-bold bg-white dark:bg-slate-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 cursor-pointer">
                <input type="checkbox" checked={injeksiVitK} onChange={(e) => setInjeksiVitK(e.target.checked)} className="w-4 h-4 text-cyan-600 rounded" />
                <span className="font-medium text-slate-800 dark:text-slate-200">💉 Injeksi Vitamin K1 (Phytomenadione 1mg IM paha kiri)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 cursor-pointer">
                <input type="checkbox" checked={salepMata} onChange={(e) => setSalepMata(e.target.checked)} className="w-4 h-4 text-cyan-600 rounded" />
                <span className="font-medium text-slate-800 dark:text-slate-200">👁️ Salep Mata Antibiotik Profilaksis (Kloramfenikol 1%)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 cursor-pointer">
                <input type="checkbox" checked={hb0Vaksin} onChange={(e) => setHb0Vaksin(e.target.checked)} className="w-4 h-4 text-cyan-600 rounded" />
                <span className="font-medium text-slate-800 dark:text-slate-200">🛡️ Imunisasi Hepatitis B (Hb-0 IM paha kanan &lt;24 jam)</span>
              </label>
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 cursor-pointer">
                <input type="checkbox" checked={skriningShk} onChange={(e) => setSkriningShk(e.target.checked)} className="w-4 h-4 text-cyan-600 rounded" />
                <span className="font-medium text-slate-800 dark:text-slate-200">🩸 Skrining Hipotiroid Kongenital (SHK Kemenkes RI)</span>
              </label>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Skor_APGAR_${patient?.no_rm || 'Bayi'}`}
            label="Cetak Lembar APGAR"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="asesmen_neonatus_apgar"
            title="LEMBAR PENILAIAN NEONATAL & SKOR APGAR"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan Catatan Neonatal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
