import React, { useState } from 'react';
import { Microscope, FileText, CheckCircle2, User, Eye, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface PAModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function PatologiAnatomiModal({ isOpen, onClose, patient }: PAModalProps) {
  const [noPA, setNoPA] = useState(`PA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [jaringanAsal, setJaringanAsal] = useState('Biopsi Jaringan Sinus Maksilaris & Polip Hidung Dextra');
  const [jenisSediaan, setJenisSediaan] = useState('Histopatologi Biopsi Jaringan (Paraffin Block & HE Staining)');
  const [makroskopis, setMakroskopis] = useState('Diterima 3 keping jaringan tidak beraturan berwarna putih keabuan kenyal, total volume 1.5 x 1.0 x 0.5 cm. Seluruh jaringan diproses dalam 1 kaset.');
  const [mikroskopis, setMikroskopis] = useState('Sediaan menunjukkan fragmen mukosa dilapisi epitel torak bertingkat bersilia. Submukosa tampak sembab dengan infiltrasi masif sel radang limfosit, sel plasma, dan eosinofil. Tidak tampak tanda-tanda atipia maupun keganasan (malignancy).');
  const [kesimpulanPA, setKesimpulanPA] = useState('Polip Sinonasal Inflamatorik Benigna dengan tanda Sinusitis Kronik Eosinofilik (Sesuai gambaran Polip Hidung Non-Neoplastik).');
  const [kodeIcdO, setKodeIcdO] = useState('ICD-O-3: Non-neoplastic inflammatory polyposis');

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_pa_report_${patient?.no_rm || patient?.id || 'default'}`;
    const data = {
      id: Date.now(),
      noPA,
      tanggal: new Date().toISOString(),
      jaringanAsal,
      jenisSediaan,
      makroskopis,
      mikroskopis,
      kesimpulanPA,
      kodeIcdO,
      spesialisPA: 'dr. Melissa Anggraini, Sp.PA, Subsp.G.E.(K)'
    };
    localStorage.setItem(key, JSON.stringify(data));
    toast.success('Hasil Ekspertise Patologi Anatomi (PA) berhasil divalidasi dan disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-purple-700 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Laporan Ekspertise Patologi Anatomi (PA & Histopatologi)</h2>
              <p className="text-xs text-purple-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Standar IAPI / ICD-O Morfologi Jaringan
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Nomor Registrasi PA:</label>
              <input type="text" value={noPA} onChange={(e) => setNoPA(e.target.value)} className="w-full p-2 border rounded font-mono font-bold text-purple-700 dark:text-purple-300 bg-white dark:bg-slate-900" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Asal Jaringan / Spesimen:</label>
              <input type="text" value={jaringanAsal} onChange={(e) => setJaringanAsal(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Jenis Sediaan / Pewarnaan:</label>
              <input type="text" value={jenisSediaan} onChange={(e) => setJenisSediaan(e.target.value)} className="w-full p-2 border rounded font-medium bg-white dark:bg-slate-900" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2 mb-2">
                1. Pemeriksaan Makroskopis
              </h3>
              <textarea
                value={makroskopis}
                onChange={(e) => setMakroskopis(e.target.value)}
                rows={2}
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2 mb-2">
                2. Pemeriksaan Mikroskopis (Histopatologi)
              </h3>
              <textarea
                value={mikroskopis}
                onChange={(e) => setMikroskopis(e.target.value)}
                rows={3}
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 font-medium"
              />
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl space-y-2">
              <h3 className="font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider text-xs">
                3. Kesimpulan / Diagnosis Patologi Anatomi
              </h3>
              <textarea
                value={kesimpulanPA}
                onChange={(e) => setKesimpulanPA(e.target.value)}
                rows={2}
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 font-bold text-purple-900 dark:text-purple-200 border-purple-300"
              />
              <div className="flex justify-between items-center text-xs text-purple-800 dark:text-purple-300 font-mono">
                <span>{kodeIcdO}</span>
                <span className="font-bold">Ekspertise: dr. Melissa Anggraini, Sp.PA</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Hasil_PA_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Hasil PA"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="laporan_patologi_anatomi"
            title="LAPORAN PATOLOGI ANATOMI & HISTOPATOLOGI"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan & Validasi PA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
