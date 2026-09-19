import React, { useState } from 'react';
import { FileText, CheckCircle2, User, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface SuratKematianModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function SuratKematianModal({ isOpen, onClose, patient }: SuratKematianModalProps) {
  const [noSurat, setNoSurat] = useState(`445/SKK/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`);
  const [tglMeninggal, setTglMeninggal] = useState(new Date().toISOString().split('T')[0]);
  const [jamMeninggal, setJamMeninggal] = useState('04:45 WIB');
  const [tempatMeninggal, setTempatMeninggal] = useState('Ruang Rawat Intensif (ICU Bed 02)');

  // WHO ICD-10 Cause of Death Format
  const [penyebabLangsungA, setPenyebabLangsungA] = useState('Syok Sepsis Refrakter (Refractory Septic Shock)');
  const [selangWaktuA, setSelangWaktuA] = useState('6 Jam');

  const [penyebabAntaraB, setPenyebabAntaraB] = useState('Pneumonia Berat Komunitas (Severe CAP) dengan ARDS');
  const [selangWaktuB, setSelangWaktuB] = useState('3 Hari');

  const [penyebabDasarC, setPenyebabDasarC] = useState('Diabetes Melitus Tipe 2 Tidak Terkontrol');
  const [selangWaktuC, setSelangWaktuC] = useState('8 Tahun');

  const [kondisiLainPart2, setKondisiLainPart2] = useState('Penyakit Jantung Koroner (CAD post-PCI) & Hipertensi Stage II');
  const [keteranganOtopsi, setKeteranganOtopsi] = useState('Tidak dilakukan otopsi forensik (Kematian wajar akibat penyakit)');

  if (!isOpen) return null;

  const handleSave = () => {
    const key = `hospital_surat_kematian_${patient?.no_rm || patient?.id || 'default'}`;
    const skkData = {
      id: Date.now(),
      noSurat,
      tanggal: new Date().toISOString(),
      tglMeninggal,
      jamMeninggal,
      tempatMeninggal,
      whoCauseOfDeath: {
        part1: {
          a: { penyakit: penyebabLangsungA, selangWaktu: selangWaktuA },
          b: { penyakit: penyebabAntaraB, selangWaktu: selangWaktuB },
          c: { penyakit: penyebabDasarC, selangWaktu: selangWaktuC },
        },
        part2: kondisiLainPart2,
      },
      keteranganOtopsi,
      dokterPemeriksa: 'dr. Hendra Gunawan, Sp.An-TI, Subsp.IC(K) / SIP: 446/123/SIP.D/2022'
    };
    localStorage.setItem(key, JSON.stringify(skkData));
    toast.success('Surat Keterangan Kematian (SKK) Resmi berhasil diterbitkan dan disimpan!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-300 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-slate-800 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Surat Keterangan Kematian (SKK) Format Standar WHO & Kemenkes RI</h2>
              <p className="text-xs text-slate-300">
                Jenazah Pasien: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Sertifikat Medis Penyebab Kematian (SMPK)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Nomor Surat Resmi:</label>
              <input type="text" value={noSurat} onChange={(e) => setNoSurat(e.target.value)} className="w-full p-2 border rounded font-mono font-bold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Tanggal Meninggal:</label>
              <input type="date" value={tglMeninggal} onChange={(e) => setTglMeninggal(e.target.value)} className="w-full p-2 border rounded font-bold bg-white dark:bg-slate-900" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Jam Meninggal:</label>
              <input type="text" value={jamMeninggal} onChange={(e) => setJamMeninggal(e.target.value)} className="w-full p-2 border rounded font-bold bg-white dark:bg-slate-900" />
            </div>
            <div>
              <label className="block text-slate-500 font-bold mb-1">Lokasi Kematian:</label>
              <input type="text" value={tempatMeninggal} onChange={(e) => setTempatMeninggal(e.target.value)} className="w-full p-2 border rounded font-bold bg-white dark:bg-slate-900" />
            </div>
          </div>

          {/* WHO CAUSE OF DEATH PART I */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              Sertifikat Medis Penyebab Kematian (Format ICD-10 WHO Bagian I)
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">a. Penyebab Langsung (Immediate Cause of Death):</span>
                  <span className="text-[11px] text-slate-500">Penyakit/kondisi yang langsung memicu kematian</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" value={penyebabLangsungA} onChange={(e) => setPenyebabLangsungA(e.target.value)} className="col-span-2 p-2 border rounded bg-white dark:bg-slate-900 font-bold" />
                  <input type="text" placeholder="Interval (misal: 6 Jam)" value={selangWaktuA} onChange={(e) => setSelangWaktuA(e.target.value)} className="p-2 border rounded bg-white dark:bg-slate-900" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">b. Penyebab Antara (Antecedent / Intermediate Cause):</span>
                  <span className="text-[11px] text-slate-500">Kondisi yang menimbulkan penyebab langsung (a)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" value={penyebabAntaraB} onChange={(e) => setPenyebabAntaraB(e.target.value)} className="col-span-2 p-2 border rounded bg-white dark:bg-slate-900 font-medium" />
                  <input type="text" placeholder="Interval (misal: 3 Hari)" value={selangWaktuB} onChange={(e) => setSelangWaktuB(e.target.value)} className="p-2 border rounded bg-white dark:bg-slate-900" />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">c. Penyebab Dasar (Underlying Cause of Death):</span>
                  <span className="text-[11px] text-slate-500">Penyakit/cedera awal yang memulai rangkaian proses kematian</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" value={penyebabDasarC} onChange={(e) => setPenyebabDasarC(e.target.value)} className="col-span-2 p-2 border rounded bg-white dark:bg-slate-900 font-medium" />
                  <input type="text" placeholder="Interval (misal: 8 Tahun)" value={selangWaktuC} onChange={(e) => setSelangWaktuC(e.target.value)} className="p-2 border rounded bg-white dark:bg-slate-900" />
                </div>
              </div>
            </div>
          </div>

          {/* WHO CAUSE OF DEATH PART II */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              Bagian II: Kondisi Signifikan Lain yang Berkontribusi (Komorbiditas)
            </h3>
            <textarea
              value={kondisiLainPart2}
              onChange={(e) => setKondisiLainPart2(e.target.value)}
              rows={2}
              className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 font-medium"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Surat_Kematian_${patient?.no_rm || 'Jenazah'}`}
            label="Cetak Surat Kematian"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="surat_kematian"
            title="SURAT KETERANGAN KEMATIAN (SKK)"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan & Terbitkan SKK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
