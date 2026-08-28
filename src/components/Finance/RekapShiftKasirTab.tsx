import React, { useState } from 'react';
import { 
  Clock, DollarSign, CheckCircle2, AlertTriangle, Printer, 
  ArrowRight, ShieldCheck, UserCheck, RefreshCw, Layers, FileText
} from 'lucide-react';
import { ShiftKasirRecord, BillingRecord } from './types';
import { useToast } from '../../contexts/ToastContext';

interface RekapShiftKasirTabProps {
  shifts: ShiftKasirRecord[];
  billings: BillingRecord[];
  onSaveShifts: (shifts: ShiftKasirRecord[]) => void;
}

export function RekapShiftKasirTab({
  shifts,
  billings,
  onSaveShifts
}: RekapShiftKasirTabProps) {
  const toast = useToast();
  const [activeShift, setActiveShift] = useState<ShiftKasirRecord | null>(
    shifts.find(s => s.statusShift === 'Aktif') || (shifts.length > 0 ? shifts[0] : null)
  );

  // Close shift modal state
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [physicalCashInput, setPhysicalCashInput] = useState<number>(0);
  const [closingNotes, setClosingNotes] = useState('');

  // Start new shift modal state
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [newCashierName, setNewCashierName] = useState('Siti Rahmawati, S.E.');
  const [newShiftType, setNewShiftType] = useState<ShiftKasirRecord['shift']>('Pagi (07:00 - 14:00)');
  const [newInitialCash, setNewInitialCash] = useState<number>(500000);

  // Calculate live numbers for the active shift from billings
  const paidToday = billings.filter(b => b.status === 'Lunas');
  const liveTunai = paidToday.filter(b => b.metodePembayaran === 'Tunai').reduce((sum, b) => sum + (b.jumlahDibayar || b.totalTagihan), 0);
  const liveNonTunai = paidToday.filter(b => b.metodePembayaran !== 'Tunai').reduce((sum, b) => sum + (b.jumlahDibayar || b.totalTagihan), 0);
  const liveTotal = liveTunai + liveNonTunai;

  const handleOpenCloseModal = () => {
    if (!activeShift) return;
    const expectedCash = (activeShift.modalAwalKas ?? activeShift.modalAwal ?? 0) + liveTunai;
    setPhysicalCashInput(expectedCash);
    setIsCloseModalOpen(true);
  };

  const handleConfirmCloseShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShift) return;

    const expectedCash = (activeShift.modalAwalKas ?? activeShift.modalAwal ?? 0) + liveTunai;
    const selisih = physicalCashInput - expectedCash;

    const now = new Date();
    const timeStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const updatedActiveShift: ShiftKasirRecord = {
      ...activeShift,
      waktuSelesai: timeStr,
      statusShift: 'Ditutup',
      totalPenerimaanTunai: liveTunai,
      totalPenerimaanNonTunai: liveNonTunai,
      totalPenerimaanKeseluruhan: liveTotal,
      kasFisikTutup: physicalCashInput,
      selisihKas: selisih,
      catatanTutup: closingNotes || 'Serah terima shift berjalan tertib & lancar.'
    };

    const updatedList = shifts.map(s => s.id === activeShift.id ? updatedActiveShift : s);
    onSaveShifts(updatedList);
    setActiveShift(updatedActiveShift);
    setIsCloseModalOpen(false);
    toast.success('Shift kasir berhasil ditutup. Berita acara siap dicetak.');
  };

  const handleStartNewShift = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newShift: ShiftKasirRecord = {
      id: `SFT-${Date.now()}`,
      kasirNama: newCashierName,
      kasirId: `USR-${Math.floor(100 + Math.random() * 900)}`,
      shift: newShiftType,
      waktuMulai: timeStr,
      modalAwal: newInitialCash,
      modalAwalKas: newInitialCash,
      totalTunai: 0,
      totalQRIS: 0,
      totalEDC: 0,
      totalTransfer: 0,
      totalBPJSAsuransi: 0,
      totalPenerimaan: 0,
      totalKasFisikDiserahkan: newInitialCash,
      selisihKas: 0,
      totalPenerimaanTunai: 0,
      totalPenerimaanNonTunai: 0,
      totalPenerimaanKeseluruhan: 0,
      statusShift: 'Aktif'
    };

    const updatedList = [newShift, ...shifts];
    onSaveShifts(updatedList);
    setActiveShift(newShift);
    setIsStartModalOpen(false);
    toast.success(`Shift ${newShiftType} untuk ${newCashierName} berhasil dibuka.`);
  };

  const handlePrintBeritaAcara = () => {
    window.print();
    toast.success('Mencetak Berita Acara Rekapitulasi Kasir...');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span>Rekapitulasi Shift & Serah Terima Kasir</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen modal awal kasir, audit uang fisik di laci kas (cash drawer), rekonsiliasi EDC/QRIS, dan berita acara serah terima.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeShift && activeShift.statusShift === 'Aktif' ? (
            <button
              onClick={handleOpenCloseModal}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Tutup Shift Sekarang</span>
            </button>
          ) : (
            <button
              onClick={() => setIsStartModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Buka Shift Baru</span>
            </button>
          )}

          {activeShift && (
            <button
              onClick={handlePrintBeritaAcara}
              className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Berita Acara</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Shift Overview Card */}
      {activeShift && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-xl border border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {activeShift.id}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  activeShift.statusShift === 'Aktif'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 animate-pulse'
                    : 'bg-slate-500/20 text-slate-300'
                }`}>
                  ● Status: {activeShift.statusShift}
                </span>
              </div>
              <h3 className="text-2xl font-bold mt-2">{activeShift.kasirNama}</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Shift: {activeShift.shift} • Waktu Mulai: {activeShift.waktuMulai} {activeShift.waktuSelesai ? `• Selesai: ${activeShift.waktuSelesai}` : ''}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Total Omset Shift Ini</div>
              <div className="text-3xl font-black text-emerald-400">
                Rp {(activeShift.statusShift === 'Aktif' ? liveTotal : (activeShift.totalPenerimaanKeseluruhan ?? activeShift.totalPenerimaan ?? 0)).toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Metric Breakdown 4 Columns */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block">Modal Awal Kas:</span>
              <strong className="text-lg font-bold text-white block mt-1">
                Rp {(activeShift.modalAwalKas ?? activeShift.modalAwal ?? 0).toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block">Penerimaan Tunai (Cash):</span>
              <strong className="text-lg font-bold text-emerald-300 block mt-1">
                Rp {(activeShift.statusShift === 'Aktif' ? liveTunai : (activeShift.totalPenerimaanTunai ?? activeShift.totalTunai ?? 0)).toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block">Penerimaan Non-Tunai (EDC/QRIS):</span>
              <strong className="text-lg font-bold text-blue-300 block mt-1">
                Rp {(activeShift.statusShift === 'Aktif' ? liveNonTunai : (activeShift.totalPenerimaanNonTunai ?? (activeShift.totalQRIS + activeShift.totalEDC + activeShift.totalTransfer) ?? 0)).toLocaleString('id-ID')}
              </strong>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <span className="text-xs text-slate-400 block">Ekspektasi Kas di Laci:</span>
              <strong className="text-lg font-bold text-amber-300 block mt-1">
                Rp {((activeShift.modalAwalKas ?? activeShift.modalAwal ?? 0) + (activeShift.statusShift === 'Aktif' ? liveTunai : (activeShift.totalPenerimaanTunai ?? activeShift.totalTunai ?? 0))).toLocaleString('id-ID')}
              </strong>
            </div>
          </div>

          {/* If Closed, show cash count and discrepancy */}
          {activeShift.statusShift === 'Ditutup' && (
            <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400">Hasil Hitung Fisik Laci: </span>
                <strong className="text-white">Rp {(activeShift.kasFisikTutup || 0).toLocaleString('id-ID')}</strong>
              </div>
              <div className="flex items-center gap-2">
                <span>Selisih: </span>
                <span className={`px-2.5 py-1 rounded font-bold ${
                  (activeShift.selisihKas || 0) === 0
                    ? 'bg-emerald-500/30 text-emerald-300'
                    : (activeShift.selisihKas || 0) > 0
                    ? 'bg-blue-500/30 text-blue-300'
                    : 'bg-rose-500/30 text-rose-300'
                }`}>
                  {(activeShift.selisihKas || 0) === 0 ? '✓ Sesuai (Rp 0)' : `Rp ${(activeShift.selisihKas || 0).toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="text-slate-300 italic">"{activeShift.catatanTutup}"</div>
            </div>
          )}
        </div>
      )}

      {/* History of Past Shifts */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Riwayat Rekap Shift Kasir Sebelumnya
          </h3>
          <span className="text-xs text-slate-500">{shifts.length} Catatan Shift</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">ID & Petugas Kasir</th>
                <th className="p-3.5">Shift & Periode</th>
                <th className="p-3.5 text-right">Modal Awal</th>
                <th className="p-3.5 text-right">Penerimaan Tunai</th>
                <th className="p-3.5 text-right">Non-Tunai</th>
                <th className="p-3.5 text-right font-bold">Total Omset</th>
                <th className="p-3.5 text-center">Selisih</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Pilih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              {shifts.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">{s.kasirNama ?? s.namaKasir ?? 'Kasir'}</div>
                    <span className="font-mono text-[10px] text-slate-400">{s.id}</span>
                  </td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{s.shift}</div>
                    <span className="text-[10px] text-slate-400">{s.waktuMulai}</span>
                  </td>
                  <td className="p-3.5 text-right text-slate-500">
                    Rp {(s.modalAwalKas ?? s.modalAwal ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                    Rp {(s.totalPenerimaanTunai ?? s.totalTunai ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right text-blue-600 dark:text-blue-400">
                    Rp {(s.totalPenerimaanNonTunai ?? (s.totalQRIS + s.totalEDC + s.totalTransfer) ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                    Rp {(s.totalPenerimaanKeseluruhan ?? s.totalPenerimaan ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-center">
                    {s.statusShift === 'Ditutup' ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        (s.selisihKas || 0) === 0
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        Rp {(s.selisihKas || 0).toLocaleString('id-ID')}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.statusShift === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {s.statusShift}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => setActiveShift(s)}
                      className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white rounded text-[11px] font-medium transition-colors"
                    >
                      Buka Rincian
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Close Shift */}
      {isCloseModalOpen && activeShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Tutup Shift & Rekonsiliasi Kasir
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Petugas: <strong>{activeShift.kasirNama ?? activeShift.namaKasir ?? 'Kasir'}</strong> ({activeShift.shift})
            </p>

            <form onSubmit={handleConfirmCloseShift} className="space-y-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Modal Awal:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Rp {(activeShift.modalAwalKas ?? activeShift.modalAwal ?? 0).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Penerimaan Tunai Sistem:</span>
                  <span className="font-semibold text-emerald-600">Rp {liveTunai.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-slate-700">
                  <span>Target Kas di Laci:</span>
                  <span className="text-blue-600">Rp {((activeShift.modalAwalKas ?? activeShift.modalAwal ?? 0) + liveTunai).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Hitungan Uang Fisik di Laci Kas (Rp):
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={physicalCashInput}
                  onChange={(e) => setPhysicalCashInput(Number(e.target.value))}
                  className="w-full p-3 text-lg font-bold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Variance notice */}
              <div className={`p-3 rounded-lg flex justify-between text-xs font-bold ${
                physicalCashInput === (activeShift.modalAwalKas ?? activeShift.modalAwal ?? 0) + liveTunai
                  ? 'bg-emerald-100 text-emerald-800'
                  : physicalCashInput > (activeShift.modalAwalKas ?? activeShift.modalAwal ?? 0) + liveTunai
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                <span>Selisih Hitung Kas:</span>
                <span>Rp {(physicalCashInput - ((activeShift.modalAwalKas ?? activeShift.modalAwal ?? 0) + liveTunai)).toLocaleString('id-ID')}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Catatan Serah Terima / Keterangan:
                </label>
                <textarea
                  rows={2}
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Catatan kendala mesin EDC, selisih uang receh, dll..."
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
                >
                  Konfirmasi Tutup Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Start New Shift */}
      {isStartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Buka Shift Kasir Baru
            </h3>

            <form onSubmit={handleStartNewShift} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nama Petugas Kasir:
                </label>
                <input
                  type="text"
                  value={newCashierName}
                  onChange={(e) => setNewCashierName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Jadwal Shift:
                </label>
                <select
                  value={newShiftType}
                  onChange={(e) => setNewShiftType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Pagi (07:00 - 14:00)">Pagi (07:00 - 14:00)</option>
                  <option value="Siang (14:00 - 21:00)">Siang (14:00 - 21:00)</option>
                  <option value="Malam (21:00 - 07:00)">Malam (21:00 - 07:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Modal Awal Kas Kecil (Rp):
                </label>
                <input
                  type="number"
                  min={0}
                  step={50000}
                  value={newInitialCash}
                  onChange={(e) => setNewInitialCash(Number(e.target.value))}
                  className="w-full p-2.5 text-base font-bold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStartModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Mulai Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
