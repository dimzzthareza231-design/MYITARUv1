import React, { useState } from 'react';
import { Activity, User, CheckCircle2, Award, ClipboardList } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

interface BarthelModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export function BarthelIndexModal({ isOpen, onClose, patient }: BarthelModalProps) {
  const [items, setItems] = useState({
    makan: 10, // 0, 5, 10
    mandi: 5, // 0, 5
    perawatanDiri: 5, // 0, 5
    berpakaian: 10, // 0, 5, 10
    buangAirBesar: 10, // 0, 5, 10
    buangAirKecil: 10, // 0, 5, 10
    penggunaanToilet: 10, // 0, 5, 10
    transferTempatTidur: 15, // 0, 5, 10, 15
    mobilitasBerjalan: 15, // 0, 5, 10, 15
    naikTurunTangga: 10, // 0, 5, 10
  });

  const [keterangan, setKeterangan] = useState('Pasien mampu melakukan sebagian besar aktivitas mandiri, memerlukan bantuan minimal pada saat mobilisasi jauh.');

  if (!isOpen) return null;

  const totalScore = Object.values(items).reduce((a, b) => a + b, 0);

  const getDependencyLevel = (score: number) => {
    if (score === 100) return { label: 'Mandiri Penuh (Independent)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
    if (score >= 91) return { label: 'Ketergantungan Ringan (Slight Dependency)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score >= 62) return { label: 'Ketergantungan Sedang (Moderate Dependency)', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (score >= 21) return { label: 'Ketergantungan Berat (Severe Dependency)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    return { label: 'Ketergantungan Total (Total Dependency)', color: 'text-rose-700 bg-rose-100 border-rose-300' };
  };

  const currentDep = getDependencyLevel(totalScore);

  const handleSave = () => {
    const key = `hospital_barthel_index_${patient?.no_rm || patient?.id || 'default'}`;
    const assessmentData = {
      id: Date.now(),
      tanggal: new Date().toISOString(),
      items,
      skorTotal: totalScore,
      kategori: currentDep.label,
      keterangan,
      fisioterapis: 'Ns. Siti Rahmawati, S.Kep / dr. Sp.KFR'
    };
    localStorage.setItem(key, JSON.stringify(assessmentData));
    toast.success(`Asesmen Fungsional Indeks Barthel (Skor ${totalScore}) berhasil disimpan!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[120] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="bg-indigo-600 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Asesmen Status Fungsional (Indeks Barthel ADL)</h2>
              <p className="text-xs text-indigo-100">
                Pasien: <span className="font-bold">{patient?.nama}</span> ({patient?.no_rm}) • Evaluasi Kemandirian Aktivitas Sehari-Hari
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* RESULT BADGE */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center font-black shadow-md">
                <span className="text-2xl leading-none">{totalScore}</span>
                <span className="text-[9px] uppercase tracking-wider font-mono">/ 100</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Klasifikasi Tingkat Kemandirian:</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{currentDep.label}</p>
                <p className="text-[11px] text-slate-500">Kriteria Barthel Index ADL (Activities of Daily Living)</p>
              </div>
            </div>

            <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${currentDep.color}`}>
              {currentDep.label}
            </span>
          </div>

          {/* 10 ADL ITEMS */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs border-b pb-2">
              10 Parameter Pengkajian Aktivitas Keseharian (ADL)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">1. Makan (Feeding):</label>
                <select value={items.makan} onChange={(e) => setItems({ ...items, makan: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={10}>10: Mandiri (mampu mengambil, memotong makanan sendiri)</option>
                  <option value={5}>5: Perlu bantuan (misal memotong lauk/mengoles mentega)</option>
                  <option value={0}>0: Tidak mampu / Ketergantungan total (disuapi/NGT)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">2. Mandi (Bathing):</label>
                <select value={items.mandi} onChange={(e) => setItems({ ...items, mandi: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={5}>5: Mandiri tanpa bantuan</option>
                  <option value={0}>0: Perlu bantuan / Dimandikan di tempat tidur</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">3. Perawatan Diri / Grooming (Cuci muka, sisir, sikat gigi):</label>
                <select value={items.perawatanDiri} onChange={(e) => setItems({ ...items, perawatanDiri: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={5}>5: Mandiri</option>
                  <option value={0}>0: Perlu bantuan</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">4. Berpakaian (Dressing):</label>
                <select value={items.berpakaian} onChange={(e) => setItems({ ...items, berpakaian: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={10}>10: Mandiri (termasuk mengancingkan & mengikat tali sepatu)</option>
                  <option value={5}>5: Perlu bantuan minimal</option>
                  <option value={0}>0: Ketergantungan penuh</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">5. Kontinensia BAB (Bowel):</label>
                <select value={items.buangAirBesar} onChange={(e) => setItems({ ...items, buangAirBesar: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={10}>10: Kontinen penuh (tidak pernah mengompol BAB)</option>
                  <option value={5}>5: Kadang tak terkontrol (1x seminggu)</option>
                  <option value={0}>0: Inkontinensia / Menggunakan pampers rutin</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">6. Kontinensia BAK (Bladder):</label>
                <select value={items.buangAirKecil} onChange={(e) => setItems({ ...items, buangAirKecil: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={10}>10: Kontinen penuh / Mampu mengontrol kencing</option>
                  <option value={5}>5: Kadang mengompol (1x dalam 24 jam)</option>
                  <option value={0}>0: Inkontinensia / Terpasang kateter urine</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">7. Penggunaan Toilet (Toileting):</label>
                <select value={items.penggunaanToilet} onChange={(e) => setItems({ ...items, penggunaanToilet: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={10}>10: Mandiri (masuk, keluar, membersihkan diri)</option>
                  <option value={5}>5: Perlu bantuan menopang diri / membersihkan</option>
                  <option value={0}>0: Menggunakan pispot / Dibantu total</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">8. Transfer (Dari Tempat Tidur ke Kursi):</label>
                <select value={items.transferTempatTidur} onChange={(e) => setItems({ ...items, transferTempatTidur: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={15}>15: Mandiri penuh</option>
                  <option value={10}>10: Bantuan minimal 1 orang</option>
                  <option value={5}>5: Mampu duduk tapi butuh bantuan kuat untuk bangkit</option>
                  <option value={0}>0: Ketergantungan total / Tirah baring</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">9. Mobilitas Berjalan di Permukaan Datar:</label>
                <select value={items.mobilitasBerjalan} onChange={(e) => setItems({ ...items, mobilitasBerjalan: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={15}>15: Mandiri &gt;50 meter tanpa bantuan</option>
                  <option value={10}>10: Berjalan dengan bantuan kruk/tongkat &gt;50 meter</option>
                  <option value={5}>5: Menggunakan kursi roda secara mandiri</option>
                  <option value={0}>0: Immobile / Bed rest</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <label className="font-bold block mb-1">10. Naik Turun Tangga (Stairs):</label>
                <select value={items.naikTurunTangga} onChange={(e) => setItems({ ...items, naikTurunTangga: Number(e.target.value) })} className="w-full p-2 border rounded bg-white dark:bg-slate-900">
                  <option value={10}>10: Mandiri naik turun tangga</option>
                  <option value={5}>5: Perlu bantuan alat bantu / pegangan</option>
                  <option value={0}>0: Tidak mampu naik tangga</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Catatan Asesmen & Rencana Rehabilitasi Medik:</label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                rows={2}
                className="w-full p-2.5 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <PrintPDFButton
            filename={`Indeks_Barthel_${patient?.no_rm || 'Pasien'}`}
            label="Cetak Indeks Barthel"
            className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold px-4 py-2 rounded-xl"
            documentData={patient}
            docType="asesmen_barthel"
            title="LEMBAR ASESMEN FUNGSIONAL (INDEKS BARTHEL)"
          />

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl">
              Batal
            </button>
            <button onClick={handleSave} className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Simpan Indeks Barthel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
