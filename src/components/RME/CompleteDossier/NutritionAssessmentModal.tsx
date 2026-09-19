import React, { useState } from 'react';
import { Apple, Scale, Calculator, CheckCircle2, User, HeartPulse, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface NutritionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function NutritionAssessmentModal({ isOpen, onClose, patient }: NutritionModalProps) {
  const [bb, setBb] = useState<number>(patient?.bb || 65);
  const [tb, setTb] = useState<number>(patient?.tb || 168);
  const [mstLoss, setMstLoss] = useState<number>(1); // 0, 1, 2, 3
  const [mstIntake, setMstIntake] = useState<number>(1); // 0 or 1
  const [mstDisease, setMstDisease] = useState<number>(1); // 0 or 2

  const [dietType, setDietType] = useState('Diet Diabetes Melitus (DM 1900 kkal)');
  const [bentukMakanan, setBentukMakanan] = useState('Makanan Lunak / Bubur');
  const [rutePemberian, setRutePemberian] = useState('Oral');
  const [alergiMakanan, setAlergiMakanan] = useState('Tidak ada alergi makanan spesifik');
  const [diagnosisGizi, setDiagnosisGizi] = useState('NI-5.1 Peningkatan kebutuhan zat gizi energi dan protein berkaitan dengan proses katabolisme penyakit');
  const [intervensiGizi, setIntervensiGizi] = useState('Pemberian diet DM 1900 kkal, protein 1.2 g/kgBB/hari, rendah garam II, frekuensi 3x makan utama + 2x selingan.');
  const [targetKalori, setTargetKalori] = useState('1900');
  const [targetProtein, setTargetProtein] = useState('78');

  if (!isOpen) return null;

  // IMT calculation
  const tbM = tb / 100;
  const imt = tbM > 0 ? (bb / (tbM * tbM)).toFixed(1) : '0';
  const getImtStatus = (val: number) => {
    if (val < 18.5) return { label: 'Underweight (Gizi Kurang)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (val <= 22.9) return { label: 'Normal (Gizi Baik)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (val <= 24.9) return { label: 'Overweight (Kelebihan BB)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Obesitas (Tingkat I / II)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const mstScore = mstLoss + mstIntake + mstDisease;
  const isMalnourished = mstScore >= 2;

  const handleSave = () => {
    const key = `hospital_nutrition_assessment_${patient?.no_rm || patient?.id || 'default'}`;
    const assessmentData = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      bb,
      tb,
      imt,
      imtKategori: getImtStatus(Number(imt)).label,
      mstScore,
      isMalnourished,
      dietType,
      bentukMakanan,
      rutePemberian,
      diagnosisGizi,
      intervensiGizi,
      targetKalori,
      targetProtein,
      dietisien: 'Fauziah Rahmi, S.Gz, RD'
    };
    localStorage.setItem(key, JSON.stringify(assessmentData));
    toast.success('Formulir Asesmen & Preskripsi Gizi Lanjut berhasil disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-emerald-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Lembar Skrining & Asesmen Gizi Lanjut (Dietisien)</h2>
              <p className="text-xs text-emerald-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Standar Asuhan Gizi Terstandar (PAGT / NCP)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* ANTHROPOMETRY SECTION */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" /> 1. Pengkajian Antropometri & IMT
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Berat Badan (kg):</label>
                <input
                  type="number"
                  value={bb}
                  onChange={(e) => setBb(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-bold text-emerald-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Tinggi Badan (cm):</label>
                <input
                  type="number"
                  value={tb}
                  onChange={(e) => setTb(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Indeks Massa Tubuh (IMT):</label>
                <div className="p-2 border rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
                  <span className="font-black text-emerald-700 dark:text-emerald-300">{imt} kg/m²</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    {getImtStatus(Number(imt)).label.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MALNUTRITION SCREENING TOOL (MST) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" /> 2. Skrining Gizi Malnutrition Screening Tool (MST)
              </h3>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isMalnourished ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'}`}>
                Skor MST: {mstScore} ({isMalnourished ? '⚠️ Berisiko Malnutrisi (Konsul Dietisien)' : '✓ Status Gizi Baik'})
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">Penurunan BB Tak Disengaja (3 bln):</label>
                <select
                  value={mstLoss}
                  onChange={(e) => setMstLoss(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                >
                  <option value={0}>Tidak ada (Skor 0)</option>
                  <option value={1}>1 - 5 kg (Skor 1)</option>
                  <option value={2}>6 - 10 kg (Skor 2)</option>
                  <option value={3}>&gt; 10 kg / Tidak tahu (Skor 3)</option>
                </select>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">Asupan Makan Menurun (Nafsu makan):</label>
                <select
                  value={mstIntake}
                  onChange={(e) => setMstIntake(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                >
                  <option value={0}>Tidak, asupan makan biasa (Skor 0)</option>
                  <option value={1}>Ya, asupan menurun &lt;50% (Skor 1)</option>
                </select>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">Kondisi Khusus / Penyakit Berat:</label>
                <select
                  value={mstDisease}
                  onChange={(e) => setMstDisease(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700"
                >
                  <option value={0}>Tidak ada penyakit berat (Skor 0)</option>
                  <option value={2}>Ada (DM/Gagal Ginjal/Kanker/Stroke/Kritis) (Skor 2)</option>
                </select>
              </div>
            </div>
          </div>

          {/* NUTRITION DIAGNOSIS & PRESCRIPTION */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              3. Preskripsi & Tata Laksana Asuhan Gizi Klinis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Jenis Diet Spesifik:</label>
                <select
                  value={dietType}
                  onChange={(e) => setDietType(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-bold text-emerald-700 dark:text-emerald-400"
                >
                  <option value="Diet Diabetes Melitus (DM 1900 kkal)">Diet Diabetes Melitus (DM 1900 kkal)</option>
                  <option value="Diet Penyakit Ginjal Kronik (RP 0.6g/kg)">Diet Ginjal Kronik (Rendah Protein 0.6g/kg)</option>
                  <option value="Diet Rendah Garam II (Hipertensi/Jantung)">Diet Rendah Garam II (Hipertensi/Jantung)</option>
                  <option value="Diet Lambung / Rendah Serat (Gastritis/Tifoid)">Diet Lambung / Rendah Serat (Gastritis/Tifoid)</option>
                  <option value="Diet Tinggi Kalori Tinggi Protein (TKTP)">Diet Tinggi Kalori Tinggi Protein (TKTP)</option>
                  <option value="Diet Makanan Biasa (MB Seimbang)">Diet Makanan Biasa (MB Seimbang)</option>
                  <option value="Diet Cair / Formula Enteral Khusus">Diet Cair / Formula Enteral Khusus</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Bentuk Makanan & Rute:</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={bentukMakanan}
                    onChange={(e) => setBentukMakanan(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value="Makanan Biasa (Nasi)">Makanan Biasa (Nasi)</option>
                    <option value="Makanan Lunak / Bubur">Makanan Lunak / Bubur</option>
                    <option value="Makanan Saring / Puree">Makanan Saring / Puree</option>
                    <option value="Makanan Cair">Makanan Cair</option>
                  </select>
                  <select
                    value={rutePemberian}
                    onChange={(e) => setRutePemberian(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
                  >
                    <option value="Oral">Oral</option>
                    <option value="Enteral (NGT/OGT)">Enteral (NGT/OGT)</option>
                    <option value="Parenteral Total (TPN)">Parenteral Total (TPN)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Target Kebutuhan Kalori (kkal/hari):</label>
                <input
                  type="text"
                  value={targetKalori}
                  onChange={(e) => setTargetKalori(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Target Kebutuhan Protein (gram/hari):</label>
                <input
                  type="text"
                  value={targetProtein}
                  onChange={(e) => setTargetProtein(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Diagnosis Gizi (Format PES):</label>
              <textarea
                value={diagnosisGizi}
                onChange={(e) => setDiagnosisGizi(e.target.value)}
                rows={2}
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Rencana Intervensi, Konseling & Monitoring Gizi:</label>
              <textarea
                value={intervensiGizi}
                onChange={(e) => setIntervensiGizi(e.target.value)}
                rows={2}
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Asesmen_Gizi_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Asesmen Gizi"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="skrining_gizi_lanjut"
            title="LEMBAR ASESMEN GIZI LANJUT (DIETISIEN)"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan Preskripsi Gizi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
