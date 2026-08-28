import React, { useState } from 'react';
import { PrescriptionOrder, PrescriptionItem } from './types';
import { Printer, X, CheckCircle, QrCode, Sparkles, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';

interface EtiketPrintModalProps {
  order: PrescriptionOrder;
  onClose: () => void;
}

export function EtiketPrintModal({ order, onClose }: EtiketPrintModalProps) {
  const toast = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [activeEtiketTab, setActiveEtiketTab] = useState<'etiket_oral' | 'etiket_luar' | 'label_infus' | 'copy_resep'>('etiket_oral');
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const currentItem: PrescriptionItem | undefined = order.items[selectedItemIndex] || order.items[0];

  const handlePrint = () => {
    window.print();
    toast.success('Etiket / Dokumen Farmasi dikirim ke antrean cetak!');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[92vh]">
        {/* HEADER */}
        <div className="p-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base">Cetak Etiket Pintar & Salinan Resep Farmasi</h3>
              <p className="text-xs text-purple-200 font-mono">
                No. Resep: {order.no_resep} • {order.nama_pasien} ({order.no_rm})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUBMENU TAB PILIHAN ETIKET */}
        <div className="p-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-2 shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={() => setActiveEtiketTab('etiket_oral')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeEtiketTab === 'etiket_oral'
                  ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm border border-purple-200 dark:border-purple-800'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              🏷️ Etiket Putih (Oral)
            </button>
            <button
              onClick={() => setActiveEtiketTab('etiket_luar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeEtiketTab === 'etiket_luar'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              🏷️ Etiket Biru (Obat Luar)
            </button>
            <button
              onClick={() => setActiveEtiketTab('label_infus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeEtiketTab === 'label_infus'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              💧 Label Infus & Injeksi
            </button>
            <button
              onClick={() => setActiveEtiketTab('copy_resep')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeEtiketTab === 'copy_resep'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              📄 Salinan Resep (Apograph)
            </button>
          </div>

          {activeEtiketTab !== 'copy_resep' && order.items.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Pilih Obat:</span>
              <select
                value={selectedItemIndex}
                onChange={e => setSelectedItemIndex(Number(e.target.value))}
                className="text-xs p-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 font-bold"
              >
                {order.items.map((item, idx) => (
                  <option key={item.id} value={idx}>
                    {idx + 1}. {item.nama_obat} ({item.jumlah} {item.satuan})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* PREVIEW CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 flex justify-center items-center bg-slate-200 dark:bg-slate-950/70">
          
          {/* 1. ETIKET PUTIH (ORAL) */}
          {activeEtiketTab === 'etiket_oral' && currentItem && (
            <div className="w-96 bg-white text-slate-900 border-2 border-slate-800 rounded-xl p-5 shadow-xl font-sans relative">
              <div className="text-center border-b-2 border-slate-800 pb-2 mb-3">
                <h4 className="font-extrabold text-sm tracking-wide">INSTALASI FARMASI RS ITARU</h4>
                <p className="text-[10px] text-slate-600">Jl. Kesehatan No. 10 Jakarta • Telp (021) 789-0123</p>
                <p className="text-[9px] text-slate-500 font-mono">SIPA: 19940826/SIPA-RS/2023 • APA: Apt. Dimas Alifia, S.Farm</p>
              </div>

              <div className="flex justify-between text-xs mb-2 pb-2 border-b border-dashed border-slate-400">
                <div>
                  <span className="text-[10px] text-slate-500 block">No. Resep:</span>
                  <span className="font-mono font-bold text-xs">{order.no_resep}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Tanggal:</span>
                  <span className="font-bold text-xs">{order.tanggal_resep}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-black text-sm text-slate-900">{order.nama_pasien}</span>
                  <span className="font-mono text-xs font-bold text-slate-600">{order.no_rm}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {order.umur} • {order.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {order.poli_ruangan}
                </div>
              </div>

              {/* OBAT & ATURAN MINUM (SIGNA) */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 my-3 text-center">
                <div className="font-black text-sm text-purple-950 mb-1">
                  {currentItem.nama_obat}
                </div>
                <div className="text-xs font-bold text-purple-800 mb-1 font-mono">
                  {currentItem.signa}
                </div>
                <div className="text-xs font-extrabold text-slate-900 bg-white py-1.5 px-2 rounded border border-purple-300 inline-block shadow-sm">
                  {currentItem.aturan_pakai}
                </div>
                {currentItem.waktu_minum && (
                  <p className="text-[11px] text-purple-700 font-semibold mt-1">
                    Waktu: {currentItem.waktu_minum}
                  </p>
                )}
              </div>

              {/* WAKTU MINUM CHECKLIST */}
              <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold border border-slate-300 rounded p-1.5 mb-3 bg-slate-50">
                <div className="p-1 rounded bg-white border border-slate-200">Pagi 🌅</div>
                <div className="p-1 rounded bg-white border border-slate-200">Siang ☀️</div>
                <div className="p-1 rounded bg-white border border-slate-200">Sore 🌇</div>
                <div className="p-1 rounded bg-white border border-slate-200">Malam 🌙</div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-300">
                <div>
                  <span className="block font-bold text-slate-700">Jumlah: {currentItem.jumlah} {currentItem.satuan}</span>
                  <span className="block text-[9px]">Exp Date: Des 2027</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px] bg-slate-100 px-2 py-1 rounded">
                  <QrCode className="w-4 h-4 text-slate-700" />
                  <span>Scan Info PIO</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. ETIKET BIRU (OBAT LUAR) */}
          {activeEtiketTab === 'etiket_luar' && currentItem && (
            <div className="w-96 bg-blue-600 text-white rounded-xl p-5 shadow-xl font-sans border-2 border-blue-900 relative">
              <div className="text-center border-b-2 border-blue-400 pb-2 mb-3">
                <h4 className="font-extrabold text-sm tracking-wide">INSTALASI FARMASI RS ITARU</h4>
                <p className="text-[10px] text-blue-200">Jl. Kesehatan No. 10 Jakarta • Telp (021) 789-0123</p>
                <div className="bg-red-600 text-white text-[11px] font-black uppercase py-0.5 px-2 rounded mt-1 shadow tracking-wider">
                  OBAT LUAR - TIDAK UNTUK DITELAN
                </div>
              </div>

              <div className="flex justify-between text-xs mb-2 pb-2 border-b border-dashed border-blue-400">
                <div>
                  <span className="text-[10px] text-blue-200 block">No. Resep:</span>
                  <span className="font-mono font-bold text-xs">{order.no_resep}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-blue-200 block">Tanggal:</span>
                  <span className="font-bold text-xs">{order.tanggal_resep}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-black text-sm">{order.nama_pasien}</span>
                  <span className="font-mono text-xs font-bold text-blue-200">{order.no_rm}</span>
                </div>
                <div className="text-[11px] text-blue-200">
                  {order.umur} • {order.poli_ruangan}
                </div>
              </div>

              <div className="bg-white text-slate-900 rounded-lg p-3 my-3 text-center shadow">
                <div className="font-black text-sm text-blue-950 mb-1">
                  {currentItem.nama_obat}
                </div>
                <div className="text-xs font-bold text-blue-700 mb-1 font-mono">
                  {currentItem.signa}
                </div>
                <div className="text-xs font-extrabold text-blue-900 bg-blue-50 py-1.5 px-2 rounded border border-blue-200 inline-block">
                  {currentItem.aturan_pakai}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-blue-100 pt-2 border-t border-blue-400">
                <span>Jumlah: {currentItem.jumlah} {currentItem.satuan}</span>
                <span className="font-mono text-[9px] bg-blue-700 px-2 py-0.5 rounded">Simpan Suhu Ruang</span>
              </div>
            </div>
          )}

          {/* 3. LABEL INFUS / INJEKSI */}
          {activeEtiketTab === 'label_infus' && currentItem && (
            <div className="w-96 bg-white text-slate-900 border-2 border-emerald-700 rounded-xl p-5 shadow-xl font-sans relative">
              <div className="text-center border-b-2 border-emerald-700 pb-2 mb-3">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[10px] uppercase">
                  LABEL OBAT INFUS & SUNTIKAN
                </span>
                <h4 className="font-extrabold text-sm tracking-wide mt-1 text-emerald-950">RS ITARU MEDIKA</h4>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Pasien:</span>
                  <span className="font-bold text-slate-900">{order.nama_pasien}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. RM / Ruangan:</span>
                  <span className="font-mono font-bold text-slate-900">{order.no_rm} ({order.poli_ruangan})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Obat / Cairan:</span>
                  <span className="font-black text-emerald-700">{currentItem.nama_obat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dosis / Kekuatan:</span>
                  <span className="font-bold text-slate-900">{currentItem.dosis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rute Pemberian:</span>
                  <span className="font-bold text-slate-900">{currentItem.rute_pemberian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kecepatan Drip:</span>
                  <span className="font-bold text-slate-900">20 Tetes / Menit (TPM)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Jam Mulai:</span>
                    <span className="font-mono font-bold">08:00 WIB</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Jam Selesai:</span>
                    <span className="font-mono font-bold">16:00 WIB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SALINAN RESEP (APOGRAPH / COPY RESEP) */}
          {activeEtiketTab === 'copy_resep' && (
            <div className="w-[480px] bg-white text-slate-900 border-2 border-slate-800 p-6 rounded-xl shadow-2xl font-serif">
              <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                <h3 className="font-bold text-base tracking-widest uppercase">APOTEK RUMAH SAKIT ITARU</h3>
                <p className="text-xs font-sans text-slate-600">Jl. Kesehatan No. 10 Jakarta Pusat • Telp: (021) 789-0123</p>
                <p className="text-[11px] font-sans text-slate-500">Apoteker Pengelola Apotek (APA): Apt. Dimas Alifia, S.Farm., M.Clin.Pharm</p>
                <h4 className="font-bold text-sm tracking-wider underline mt-2">SALINAN RESEP (APOGRAPH)</h4>
              </div>

              <div className="grid grid-cols-2 text-xs font-sans gap-y-1 mb-4 pb-3 border-b border-slate-300">
                <div><span className="text-slate-500">Resep untuk:</span> <strong>{order.nama_pasien}</strong></div>
                <div><span className="text-slate-500">No. RM:</span> <strong className="font-mono">{order.no_rm}</strong></div>
                <div><span className="text-slate-500">Dokter Penulis:</span> <strong>{order.dokter_penulis}</strong></div>
                <div><span className="text-slate-500">Tanggal Resep:</span> <strong>{order.tanggal_resep}</strong></div>
                <div><span className="text-slate-500">No. Resep:</span> <strong className="font-mono">{order.no_resep}</strong></div>
                <div><span className="text-slate-500">Iterasi:</span> <strong>{order.iterasi || 'Ne Iter'}</strong></div>
              </div>

              {/* R/ ITEMS */}
              <div className="space-y-4 mb-6 font-serif text-sm">
                {order.items.map((item, idx) => (
                  <div key={item.id} className="border-b border-dashed border-slate-300 pb-2">
                    <div className="flex justify-between items-baseline font-bold text-base">
                      <span>R/ {item.nama_obat}</span>
                      <span>No. {item.jumlah}</span>
                    </div>
                    <div className="text-xs italic pl-4 font-sans text-slate-700">
                      {item.signa} ({item.aturan_pakai})
                    </div>
                    <div className="text-right text-xs font-bold font-sans text-emerald-800 mt-1">
                      [ - detur - ]
                    </div>
                  </div>
                ))}
              </div>

              {/* TANDA TANGAN APA */}
              <div className="flex justify-between items-end text-xs font-sans pt-4 border-t border-slate-900">
                <div className="text-[10px] text-slate-500">
                  <p>Cap Apotek Resmi:</p>
                  <div className="w-16 h-16 border border-slate-300 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400 rotate-12 mt-1">
                    RS ITARU APOTEK
                  </div>
                </div>
                <div className="text-center">
                  <p>Jakarta, {order.tanggal_resep}</p>
                  <p className="font-semibold text-slate-700">P.C.C (Pro Copie Conforme)</p>
                  <div className="h-12 flex items-center justify-center font-serif italic text-slate-400">
                    (Tanda Tangan Apoteker)
                  </div>
                  <p className="font-bold underline text-slate-900">{order.telaah_resep.apoteker_penelaah || 'Apt. Sarah Larasati, S.Farm'}</p>
                  <p className="text-[10px] text-slate-500 font-mono">SIPA.19940826/SIPA-RS/2023</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Format etiket sesuai standar akreditasi KARS & Pelayanan Kefarmasian PMK 72/73.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print)</span>
            </button>
          </div>
        </div>
      </div>
    
      {showPreview && (
        <DocumentPreviewModal 
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            customContent={(
                <div className="flex items-center justify-center w-full p-8 bg-white text-slate-900 border border-slate-200 shadow-sm mx-auto min-h-[500px]">
                    
          
          {/* 1. ETIKET PUTIH (ORAL) */}
          {activeEtiketTab === 'etiket_oral' && currentItem && (
            <div className="w-96 bg-white text-slate-900 border-2 border-slate-800 rounded-xl p-5 shadow-xl font-sans relative">
              <div className="text-center border-b-2 border-slate-800 pb-2 mb-3">
                <h4 className="font-extrabold text-sm tracking-wide">INSTALASI FARMASI RS ITARU</h4>
                <p className="text-[10px] text-slate-600">Jl. Kesehatan No. 10 Jakarta • Telp (021) 789-0123</p>
                <p className="text-[9px] text-slate-500 font-mono">SIPA: 19940826/SIPA-RS/2023 • APA: Apt. Dimas Alifia, S.Farm</p>
              </div>

              <div className="flex justify-between text-xs mb-2 pb-2 border-b border-dashed border-slate-400">
                <div>
                  <span className="text-[10px] text-slate-500 block">No. Resep:</span>
                  <span className="font-mono font-bold text-xs">{order.no_resep}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Tanggal:</span>
                  <span className="font-bold text-xs">{order.tanggal_resep}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-black text-sm text-slate-900">{order.nama_pasien}</span>
                  <span className="font-mono text-xs font-bold text-slate-600">{order.no_rm}</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  {order.umur} • {order.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {order.poli_ruangan}
                </div>
              </div>

              {/* OBAT & ATURAN MINUM (SIGNA) */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 my-3 text-center">
                <div className="font-black text-sm text-purple-950 mb-1">
                  {currentItem.nama_obat}
                </div>
                <div className="text-xs font-bold text-purple-800 mb-1 font-mono">
                  {currentItem.signa}
                </div>
                <div className="text-xs font-extrabold text-slate-900 bg-white py-1.5 px-2 rounded border border-purple-300 inline-block shadow-sm">
                  {currentItem.aturan_pakai}
                </div>
                {currentItem.waktu_minum && (
                  <p className="text-[11px] text-purple-700 font-semibold mt-1">
                    Waktu: {currentItem.waktu_minum}
                  </p>
                )}
              </div>

              {/* WAKTU MINUM CHECKLIST */}
              <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold border border-slate-300 rounded p-1.5 mb-3 bg-slate-50">
                <div className="p-1 rounded bg-white border border-slate-200">Pagi 🌅</div>
                <div className="p-1 rounded bg-white border border-slate-200">Siang ☀️</div>
                <div className="p-1 rounded bg-white border border-slate-200">Sore 🌇</div>
                <div className="p-1 rounded bg-white border border-slate-200">Malam 🌙</div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-slate-300">
                <div>
                  <span className="block font-bold text-slate-700">Jumlah: {currentItem.jumlah} {currentItem.satuan}</span>
                  <span className="block text-[9px]">Exp Date: Des 2027</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px] bg-slate-100 px-2 py-1 rounded">
                  <QrCode className="w-4 h-4 text-slate-700" />
                  <span>Scan Info PIO</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. ETIKET BIRU (OBAT LUAR) */}
          {activeEtiketTab === 'etiket_luar' && currentItem && (
            <div className="w-96 bg-blue-600 text-white rounded-xl p-5 shadow-xl font-sans border-2 border-blue-900 relative">
              <div className="text-center border-b-2 border-blue-400 pb-2 mb-3">
                <h4 className="font-extrabold text-sm tracking-wide">INSTALASI FARMASI RS ITARU</h4>
                <p className="text-[10px] text-blue-200">Jl. Kesehatan No. 10 Jakarta • Telp (021) 789-0123</p>
                <div className="bg-red-600 text-white text-[11px] font-black uppercase py-0.5 px-2 rounded mt-1 shadow tracking-wider">
                  OBAT LUAR - TIDAK UNTUK DITELAN
                </div>
              </div>

              <div className="flex justify-between text-xs mb-2 pb-2 border-b border-dashed border-blue-400">
                <div>
                  <span className="text-[10px] text-blue-200 block">No. Resep:</span>
                  <span className="font-mono font-bold text-xs">{order.no_resep}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-blue-200 block">Tanggal:</span>
                  <span className="font-bold text-xs">{order.tanggal_resep}</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-black text-sm">{order.nama_pasien}</span>
                  <span className="font-mono text-xs font-bold text-blue-200">{order.no_rm}</span>
                </div>
                <div className="text-[11px] text-blue-200">
                  {order.umur} • {order.poli_ruangan}
                </div>
              </div>

              <div className="bg-white text-slate-900 rounded-lg p-3 my-3 text-center shadow">
                <div className="font-black text-sm text-blue-950 mb-1">
                  {currentItem.nama_obat}
                </div>
                <div className="text-xs font-bold text-blue-700 mb-1 font-mono">
                  {currentItem.signa}
                </div>
                <div className="text-xs font-extrabold text-blue-900 bg-blue-50 py-1.5 px-2 rounded border border-blue-200 inline-block">
                  {currentItem.aturan_pakai}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-blue-100 pt-2 border-t border-blue-400">
                <span>Jumlah: {currentItem.jumlah} {currentItem.satuan}</span>
                <span className="font-mono text-[9px] bg-blue-700 px-2 py-0.5 rounded">Simpan Suhu Ruang</span>
              </div>
            </div>
          )}

          {/* 3. LABEL INFUS / INJEKSI */}
          {activeEtiketTab === 'label_infus' && currentItem && (
            <div className="w-96 bg-white text-slate-900 border-2 border-emerald-700 rounded-xl p-5 shadow-xl font-sans relative">
              <div className="text-center border-b-2 border-emerald-700 pb-2 mb-3">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-[10px] uppercase">
                  LABEL OBAT INFUS & SUNTIKAN
                </span>
                <h4 className="font-extrabold text-sm tracking-wide mt-1 text-emerald-950">RS ITARU MEDIKA</h4>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Pasien:</span>
                  <span className="font-bold text-slate-900">{order.nama_pasien}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. RM / Ruangan:</span>
                  <span className="font-mono font-bold text-slate-900">{order.no_rm} ({order.poli_ruangan})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Obat / Cairan:</span>
                  <span className="font-black text-emerald-700">{currentItem.nama_obat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dosis / Kekuatan:</span>
                  <span className="font-bold text-slate-900">{currentItem.dosis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Rute Pemberian:</span>
                  <span className="font-bold text-slate-900">{currentItem.rute_pemberian}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kecepatan Drip:</span>
                  <span className="font-bold text-slate-900">20 Tetes / Menit (TPM)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Jam Mulai:</span>
                    <span className="font-mono font-bold">08:00 WIB</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Jam Selesai:</span>
                    <span className="font-mono font-bold">16:00 WIB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. SALINAN RESEP (APOGRAPH / COPY RESEP) */}
          {activeEtiketTab === 'copy_resep' && (
            <div className="w-[480px] bg-white text-slate-900 border-2 border-slate-800 p-6 rounded-xl shadow-2xl font-serif">
              <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
                <h3 className="font-bold text-base tracking-widest uppercase">APOTEK RUMAH SAKIT ITARU</h3>
                <p className="text-xs font-sans text-slate-600">Jl. Kesehatan No. 10 Jakarta Pusat • Telp: (021) 789-0123</p>
                <p className="text-[11px] font-sans text-slate-500">Apoteker Pengelola Apotek (APA): Apt. Dimas Alifia, S.Farm., M.Clin.Pharm</p>
                <h4 className="font-bold text-sm tracking-wider underline mt-2">SALINAN RESEP (APOGRAPH)</h4>
              </div>

              <div className="grid grid-cols-2 text-xs font-sans gap-y-1 mb-4 pb-3 border-b border-slate-300">
                <div><span className="text-slate-500">Resep untuk:</span> <strong>{order.nama_pasien}</strong></div>
                <div><span className="text-slate-500">No. RM:</span> <strong className="font-mono">{order.no_rm}</strong></div>
                <div><span className="text-slate-500">Dokter Penulis:</span> <strong>{order.dokter_penulis}</strong></div>
                <div><span className="text-slate-500">Tanggal Resep:</span> <strong>{order.tanggal_resep}</strong></div>
                <div><span className="text-slate-500">No. Resep:</span> <strong className="font-mono">{order.no_resep}</strong></div>
                <div><span className="text-slate-500">Iterasi:</span> <strong>{order.iterasi || 'Ne Iter'}</strong></div>
              </div>

              {/* R/ ITEMS */}
              <div className="space-y-4 mb-6 font-serif text-sm">
                {order.items.map((item, idx) => (
                  <div key={item.id} className="border-b border-dashed border-slate-300 pb-2">
                    <div className="flex justify-between items-baseline font-bold text-base">
                      <span>R/ {item.nama_obat}</span>
                      <span>No. {item.jumlah}</span>
                    </div>
                    <div className="text-xs italic pl-4 font-sans text-slate-700">
                      {item.signa} ({item.aturan_pakai})
                    </div>
                    <div className="text-right text-xs font-bold font-sans text-emerald-800 mt-1">
                      [ - detur - ]
                    </div>
                  </div>
                ))}
              </div>

              {/* TANDA TANGAN APA */}
              <div className="flex justify-between items-end text-xs font-sans pt-4 border-t border-slate-900">
                <div className="text-[10px] text-slate-500">
                  <p>Cap Apotek Resmi:</p>
                  <div className="w-16 h-16 border border-slate-300 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400 rotate-12 mt-1">
                    RS ITARU APOTEK
                  </div>
                </div>
                <div className="text-center">
                  <p>Jakarta, {order.tanggal_resep}</p>
                  <p className="font-semibold text-slate-700">P.C.C (Pro Copie Conforme)</p>
                  <div className="h-12 flex items-center justify-center font-serif italic text-slate-400">
                    (Tanda Tangan Apoteker)
                  </div>
                  <p className="font-bold underline text-slate-900">{order.telaah_resep.apoteker_penelaah || 'Apt. Sarah Larasati, S.Farm'}</p>
                  <p className="text-[10px] text-slate-500 font-mono">SIPA.19940826/SIPA-RS/2023</p>
                </div>
              </div>
            </div>
          )}

        
                </div>
            )}
            title={`Etiket_${order.no_resep}`}
        />
      )}
    </div>
  );
}