import React, { useState } from 'react';
import { 
  PrescriptionOrder, 
  UDDSchedule, 
  DrugReconciliation, 
  DrugReturn, 
  MedicationStock,
  UDDScheduleItem 
} from './types';
import { 
  Bed, 
  Clock, 
  CheckCircle, 
  ArrowLeftRight, 
  RotateCcw, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Truck, 
  UserCheck, 
  Printer, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { EtiketPrintModal } from './EtiketPrintModal';

interface ApotekRanapTabProps {
  prescriptions: PrescriptionOrder[];
  uddSchedules: UDDSchedule[];
  reconciliations: DrugReconciliation[];
  returns: DrugReturn[];
  stocks: MedicationStock[];
  onUpdateUDD: (schedule: UDDSchedule) => void;
  onAddUDD: (schedule: UDDSchedule) => void;
  onAddReconciliation: (rec: DrugReconciliation) => void;
  onAddReturn: (ret: DrugReturn) => void;
  onRestoreStockFromReturn: (ret: DrugReturn) => void;
}

export function ApotekRanapTab({
  prescriptions,
  uddSchedules,
  reconciliations,
  returns,
  stocks,
  onUpdateUDD,
  onAddUDD,
  onAddReconciliation,
  onAddReturn,
  onRestoreStockFromReturn
}: ApotekRanapTabProps) {
  const toast = useToast();
  const [subTab, setSubTab] = useState<'udd' | 'rekonsiliasi' | 'retur'>('udd');
  const [selectedWard, setSelectedWard] = useState('Semua Bangsal');
  const [selectedUDD, setSelectedUDD] = useState<UDDSchedule | null>(uddSchedules[0] || null);
  const [showNewUDDModal, setShowNewUDDModal] = useState(false);
  const [showNewRecModal, setShowNewRecModal] = useState(false);
  const [showNewReturnModal, setShowNewReturnModal] = useState(false);

  // RETURN FORM STATE
  const [returnPatientName, setReturnPatientName] = useState('');
  const [returnNoRm, setReturnNoRm] = useState('');
  const [returnRuangan, setReturnRuangan] = useState('Bangsal Teratai (Bed 302)');
  const [returnReason, setReturnReason] = useState<'Pasien Pulang / Selesai Rawat' | 'Ganti Terapi Dokter' | 'Pasien Meninggal' | 'Dosis Dibatalkan'>('Pasien Pulang / Selesai Rawat');
  const [selectedReturnDrugId, setSelectedReturnDrugId] = useState('');
  const [returnQty, setReturnQty] = useState(2);

  // RECONCILIATION FORM STATE
  const [recPatientName, setRecPatientName] = useState('');
  const [recNoRm, setRecNoRm] = useState('');
  const [recWard, setRecWard] = useState('Bangsal Teratai');
  const [recDpjp, setRecDpjp] = useState('dr. Bambang Irawan, Sp.PD-KGEH');
  const [recHomeDrugs, setRecHomeDrugs] = useState([
    { nama_obat: 'Amlodipine 5 mg', dosis_frekuensi: '1x1 malam', aturan_minum: 'sebelum tidur', sumber_obat: 'Dari Rumah' as const, status_kelanjutan: 'Lanjut Sesuai Dosis' as const, alasan_perubahan: 'Terapi antihipertensi dilanjutkan' }
  ]);

  const wards = ['Semua Bangsal', 'Bangsal Teratai', 'Bangsal Melati', 'Bangsal Bougenville', 'ICU / ICCU'];

  const filteredUDDs = uddSchedules.filter(u => {
    return selectedWard === 'Semua Bangsal' || u.bangsal === selectedWard;
  });

  // VERIFY & SEND UDD CART
  const handleVerifyCart = (udd: UDDSchedule) => {
    const updated: UDDSchedule = {
      ...udd,
      status_troli: 'Troli Terisi & Diverifikasi'
    };
    onUpdateUDD(updated);
    setSelectedUDD(updated);
    toast.success(`Troli UDD pasien ${udd.nama_pasien} berhasil diverifikasi & siap dikirim ke ${udd.bangsal}!`);
  };

  const handleSendCartToWard = (udd: UDDSchedule) => {
    const updated: UDDSchedule = {
      ...udd,
      status_troli: 'Terkirim ke Bangsal',
      perawat_penerima_bangsal: 'Ns. Ratna, S.Kep'
    };
    onUpdateUDD(updated);
    setSelectedUDD(updated);
    toast.success(`Troli UDD telah diserahterimakan ke perawat ${udd.bangsal}.`);
  };

  // HANDLE SUBMIT RETURN
  const handleSubmitReturn = () => {
    if (!returnPatientName || !selectedReturnDrugId) {
      toast.error('Lengkapi data pasien dan obat retur!');
      return;
    }
    const drug = stocks.find(s => s.id === selectedReturnDrugId);
    if (!drug) return;

    const refundAmount = drug.harga_jual_bpjs * returnQty;
    const newReturn: DrugReturn = {
      id: `RET-${Date.now()}`,
      no_retur: `RET-RANAP-${Math.floor(1000 + Math.random() * 9000)}`,
      tanggal: new Date().toISOString().split('T')[0],
      no_rm: returnNoRm || 'RM-260800-0099',
      nama_pasien: returnPatientName,
      ruangan: returnRuangan,
      alasan_retur: returnReason,
      items: [
        {
          kode_obat: drug.id,
          nama_obat: drug.nama_obat,
          no_batch: drug.batches[0]?.no_batch || 'BATCH-RET',
          jumlah_retur: returnQty,
          satuan: drug.satuan_terkecil,
          harga_satuan: drug.harga_jual_bpjs,
          total_refund: refundAmount,
          kondisi_fisik: 'Baik (Dapat Dipakai Kembali)'
        }
      ],
      total_pengembalian: refundAmount,
      status: 'Disetujui & Stok Dikembalikan',
      petugas_farmasi: 'Apt. Sarah Larasati, S.Farm',
      perawat_pengantar: 'Ns. Dewi Lestari, S.Kep'
    };

    onAddReturn(newReturn);
    onRestoreStockFromReturn(newReturn);
    setShowNewReturnModal(false);
    toast.success(`Retur obat ${drug.nama_obat} disetujui! Rp ${refundAmount.toLocaleString('id-ID')} dikembalikan ke billing dan stok ditambahkan.`);
  };

  // HANDLE SUBMIT RECONCILIATION
  const handleSubmitRec = () => {
    if (!recPatientName) {
      toast.error('Masukkan nama pasien rekonsiliasi!');
      return;
    }
    const newRec: DrugReconciliation = {
      id: `REK-${Date.now()}`,
      no_rm: recNoRm || 'RM-260800-0088',
      nama_pasien: recPatientName,
      tanggal_masuk: new Date().toISOString().split('T')[0],
      ruangan_ranap: recWard,
      dpjp: recDpjp,
      riwayat_alergi: ['Tidak ada alergi terlaporkan'],
      obat_dari_rumah: recHomeDrugs,
      catatan_rekonsiliasi: 'Pasien telah menyerahkan obat rumah ke farmasi/perawat ruangan.',
      apoteker_verifikator: 'Apt. Sarah Larasati, S.Farm',
      waktu_rekonsiliasi: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' WIB'
    };
    onAddReconciliation(newRec);
    setShowNewRecModal(false);
    toast.success(`Formulir Rekonsiliasi Obat pasien ${recPatientName} tersimpan.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. NAVIGATION SUB-TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab('udd')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all ${
              subTab === 'udd'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Unit Dose Dispensing (UDD)</span>
          </button>

          <button
            onClick={() => setSubTab('rekonsiliasi')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all ${
              subTab === 'rekonsiliasi'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Rekonsiliasi Obat Pasien</span>
          </button>

          <button
            onClick={() => setSubTab('retur')}
            className={`px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all ${
              subTab === 'retur'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retur Obat Rawat Inap</span>
          </button>
        </div>

        {subTab === 'udd' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-bold">Bangsal:</span>
            <select
              value={selectedWard}
              onChange={e => setSelectedWard(e.target.value)}
              className="text-xs p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent font-bold text-slate-800 dark:text-slate-200 outline-none"
            >
              {wards.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-TAB 1: UNIT DOSE DISPENSING (UDD)                                  */}
      {/* ========================================================================= */}
      {subTab === 'udd' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* UDD PATIENT LIST (5 COLS) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-black uppercase text-slate-500">
                Daftar Troli UDD Bangsal ({filteredUDDs.length})
              </span>
              <span className="text-[11px] font-bold text-blue-600">Depo Rawat Inap</span>
            </div>

            {filteredUDDs.map(udd => {
              const isSelected = selectedUDD?.id === udd.id;
              return (
                <div
                  key={udd.id}
                  onClick={() => setSelectedUDD(udd)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                        {udd.bangsal} • {udd.kamar_bed}
                      </span>
                      <h4 className="font-black text-sm text-slate-900 dark:text-white mt-1">
                        {udd.nama_pasien}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {udd.no_rm} • DPJP: {udd.dpjp}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      udd.status_troli === 'Terkirim ke Bangsal'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : udd.status_troli === 'Troli Terisi & Diverifikasi'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {udd.status_troli}
                    </span>
                  </div>

                  {/* MINI TIME MATRIX */}
                  <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/50 text-center text-[10px] font-bold">
                    <div className="p-1 rounded bg-slate-100 dark:bg-slate-700/50">
                      🌅 07:00 ({udd.pagi_07.length})
                    </div>
                    <div className="p-1 rounded bg-slate-100 dark:bg-slate-700/50">
                      ☀️ 12:00 ({udd.siang_12.length})
                    </div>
                    <div className="p-1 rounded bg-slate-100 dark:bg-slate-700/50">
                      🌇 18:00 ({udd.sore_18.length})
                    </div>
                    <div className="p-1 rounded bg-slate-100 dark:bg-slate-700/50">
                      🌙 22:00 ({udd.malam_22.length})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* UDD DETAIL & 4-TIME SLOT TIMELINE (7 COLS) */}
          <div className="lg:col-span-7">
            {selectedUDD ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden space-y-4 p-5">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">JADWAL UNIT DOSE 24 JAM</span>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">
                      {selectedUDD.nama_pasien} ({selectedUDD.no_rm})
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedUDD.bangsal} • {selectedUDD.kamar_bed} • Tanggal: {selectedUDD.tanggal}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {selectedUDD.status_troli === 'Belum Disiapkan' && (
                      <button
                        onClick={() => handleVerifyCart(selectedUDD)}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Verifikasi Troli UDD</span>
                      </button>
                    )}
                    {selectedUDD.status_troli === 'Troli Terisi & Diverifikasi' && (
                      <button
                        onClick={() => handleSendCartToWard(selectedUDD)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Kirim ke Bangsal</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 TIME SLOTS COLLAPSIBLE / CARDS */}
                <div className="space-y-3">
                  {/* PAGI 07:00 */}
                  <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                        🌅 Dosis Pagi (Pukul 07:00 WIB)
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 dark:bg-amber-900 px-2 py-0.5 rounded">
                        {selectedUDD.pagi_07.length} Obat
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {selectedUDD.pagi_07.map((it, i) => (
                        <div key={i} className="p-2 bg-white dark:bg-slate-900 rounded-lg text-xs flex justify-between items-center shadow-xs">
                          <div>
                            <span className="font-black text-slate-900 dark:text-white">{it.nama_obat}</span>
                            <span className="text-slate-500 ml-2 font-mono text-[11px]">{it.dosis} • {it.rute}</span>
                            <p className="text-[10px] text-slate-400">{it.keterangan}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            it.status_diberikan === 'Diberikan' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {it.status_diberikan} {it.jam_pemberian_aktual && `(${it.jam_pemberian_aktual})`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SIANG 12:00 */}
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                        ☀️ Dosis Siang (Pukul 12:00 WIB)
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                        {selectedUDD.siang_12.length} Obat
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {selectedUDD.siang_12.map((it, i) => (
                        <div key={i} className="p-2 bg-white dark:bg-slate-900 rounded-lg text-xs flex justify-between items-center shadow-xs">
                          <div>
                            <span className="font-black text-slate-900 dark:text-white">{it.nama_obat}</span>
                            <span className="text-slate-500 ml-2 font-mono text-[11px]">{it.dosis} • {it.rute}</span>
                            <p className="text-[10px] text-slate-400">{it.keterangan}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {it.status_diberikan}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SORE 18:00 */}
                  <div className="p-3 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-orange-900 dark:text-orange-300 flex items-center gap-1.5">
                        🌇 Dosis Sore (Pukul 18:00 WIB)
                      </span>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-100 dark:bg-orange-900 px-2 py-0.5 rounded">
                        {selectedUDD.sore_18.length} Obat
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {selectedUDD.sore_18.map((it, i) => (
                        <div key={i} className="p-2 bg-white dark:bg-slate-900 rounded-lg text-xs flex justify-between items-center shadow-xs">
                          <div>
                            <span className="font-black text-slate-900 dark:text-white">{it.nama_obat}</span>
                            <span className="text-slate-500 ml-2 font-mono text-[11px]">{it.dosis} • {it.rute}</span>
                            <p className="text-[10px] text-slate-400">{it.keterangan}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {it.status_diberikan}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MALAM 22:00 */}
                  <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                        🌙 Dosis Malam (Pukul 22:00 WIB)
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 dark:bg-indigo-900 px-2 py-0.5 rounded">
                        {selectedUDD.malam_22.length} Obat
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {selectedUDD.malam_22.map((it, i) => (
                        <div key={i} className="p-2 bg-white dark:bg-slate-900 rounded-lg text-xs flex justify-between items-center shadow-xs">
                          <div>
                            <span className="font-black text-slate-900 dark:text-white">{it.nama_obat}</span>
                            <span className="text-slate-500 ml-2 font-mono text-[11px]">{it.dosis} • {it.rute}</span>
                            <p className="text-[10px] text-slate-400">{it.keterangan}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {it.status_diberikan}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FOOTER INFO */}
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Petugas Farmasi: <strong>{selectedUDD.petugas_farmasi_penyiap}</strong></span>
                  <span>Perawat Bangsal: <strong>{selectedUDD.perawat_penerima_bangsal || '-'}</strong></span>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500">
                Pilih pasien UDD di sebelah kiri.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SUB-TAB 2: REKONSILIASI OBAT                                            */}
      {/* ========================================================================= */}
      {subTab === 'rekonsiliasi' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Rekonsiliasi Obat Pasien Rawat Inap (Admisi, Transfer & Discharge)
              </h3>
              <p className="text-xs text-slate-500">
                Menyelaraskan obat yang dibawa dari rumah dengan terapi terkini rumah sakit untuk mencegah medication error.
              </p>
            </div>
            <button
              onClick={() => setShowNewRecModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Rekonsiliasi Pasien Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reconciliations.map(rec => (
              <div key={rec.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex justify-between items-start pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-mono text-purple-600 font-bold bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                      {rec.ruangan_ranap}
                    </span>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white mt-1">
                      {rec.nama_pasien} ({rec.no_rm})
                    </h4>
                    <p className="text-xs text-slate-500">
                      DPJP: {rec.dpjp} • Tgl Masuk: {rec.tanggal_masuk}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">{rec.waktu_rekonsiliasi}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Daftar Obat Dibawa dari Rumah:
                  </span>
                  {rec.obat_dari_rumah.map((ob, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between font-bold">
                        <span>{ob.nama_obat}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          ob.status_kelanjutan === 'Lanjut Sesuai Dosis'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950'
                        }`}>
                          {ob.status_kelanjutan}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        <p>Aturan: {ob.dosis_frekuensi} ({ob.aturan_minum}) • Sumber: {ob.sumber_obat}</p>
                        {ob.alasan_perubahan && <p className="italic text-slate-700 dark:text-slate-300">Catatan DPJP: {ob.alasan_perubahan}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 flex justify-between">
                  <span>Apoteker Verifikator: <strong>{rec.apoteker_verifikator}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUB-TAB 3: RETUR OBAT RAWAT INAP                                        */}
      {/* ========================================================================= */}
      {subTab === 'retur' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Retur Obat Rawat Inap (Pengembalian Sisa Obat)
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan sisa obat pasien pulang/meninggal untuk pengembalian dana billing kasir dan penyesuaian stok depo ranap.
              </p>
            </div>
            <button
              onClick={() => setShowNewReturnModal(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Input Retur Obat</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-extrabold text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="p-3">No. Retur</th>
                  <th className="p-3">Pasien / RM</th>
                  <th className="p-3">Ruangan</th>
                  <th className="p-3">Alasan Retur</th>
                  <th className="p-3">Obat Diretur</th>
                  <th className="p-3">Nilai Refund</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {returns.map(ret => (
                  <tr key={ret.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-3 font-mono font-bold text-blue-600">{ret.no_retur}</td>
                    <td className="p-3">
                      <strong>{ret.nama_pasien}</strong>
                      <span className="block text-[11px] text-slate-400">{ret.no_rm}</span>
                    </td>
                    <td className="p-3">{ret.ruangan}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[11px] font-semibold">
                        {ret.alasan_retur}
                      </span>
                    </td>
                    <td className="p-3">
                      {ret.items.map((it, idx) => (
                        <div key={idx} className="text-[11px]">
                          • {it.nama_obat} ({it.jumlah_retur} {it.satuan})
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-black text-amber-600">
                      Rp {ret.total_pengembalian.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                        {ret.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL INPUT RETUR OBAT */}
      {showNewReturnModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                Formulir Retur Sisa Obat Rawat Inap
              </h3>
              <button onClick={() => setShowNewReturnModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Pasien *</label>
                <input
                  type="text"
                  value={returnPatientName}
                  onChange={e => setReturnPatientName(e.target.value)}
                  placeholder="Contoh: Tn. Surya"
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Alasan Retur</label>
                <select
                  value={returnReason}
                  onChange={e => setReturnReason(e.target.value as any)}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                >
                  <option value="Pasien Pulang / Selesai Rawat">Pasien Pulang / Selesai Rawat</option>
                  <option value="Ganti Terapi Dokter">Ganti Terapi Dokter</option>
                  <option value="Pasien Meninggal">Pasien Meninggal</option>
                  <option value="Dosis Dibatalkan">Dosis Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Obat yang Diretur</label>
                <select
                  value={selectedReturnDrugId}
                  onChange={e => setSelectedReturnDrugId(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                >
                  <option value="">-- Pilih Obat --</option>
                  {stocks.map(s => (
                    <option key={s.id} value={s.id}>{s.nama_obat} (Rp {s.harga_jual_bpjs.toLocaleString('id-ID')})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Obat Diretur</label>
                <input
                  type="number"
                  min={1}
                  value={returnQty}
                  onChange={e => setReturnQty(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowNewReturnModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitReturn}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-extrabold shadow"
              >
                Proses & Kembalikan Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INPUT REKONSILIASI */}
      {showNewRecModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-purple-600" />
                Form Rekonsiliasi Obat Admisi
              </h3>
              <button onClick={() => setShowNewRecModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Pasien *</label>
                <input
                  type="text"
                  value={recPatientName}
                  onChange={e => setRecPatientName(e.target.value)}
                  placeholder="Contoh: Ny. Siti Rahayu"
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Ruangan Bangsal</label>
                <select
                  value={recWard}
                  onChange={e => setRecWard(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                >
                  <option value="Bangsal Teratai">Bangsal Teratai</option>
                  <option value="Bangsal Melati">Bangsal Melati</option>
                  <option value="Bangsal Bougenville">Bangsal Bougenville</option>
                  <option value="ICU / ICCU">ICU / ICCU</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Obat Rumah Pasien</label>
                <input
                  type="text"
                  placeholder="Nama obat, dosis, frekuensi..."
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  defaultValue="Amlodipine 5mg 1x1 malam"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowNewRecModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitRec}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold shadow"
              >
                Simpan Rekonsiliasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
