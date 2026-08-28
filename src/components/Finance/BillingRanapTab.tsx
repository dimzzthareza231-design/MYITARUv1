import React, { useState } from 'react';
import { 
  Search, Bed, Plus, Eye, CreditCard, Printer, CheckCircle, 
  AlertCircle, FileText, Calendar, Clock, DollarSign, ArrowRight
} from 'lucide-react';
import { BillingRecord, BillingItem } from './types';
import { useHospital } from '../../contexts/HospitalContext';
import { useToast } from '../../contexts/ToastContext';

interface BillingRanapTabProps {
  billings: BillingRecord[];
  onSelectForPayment: (billing: BillingRecord) => void;
  onViewKwitansi: (billing: BillingRecord) => void;
  onUpdateBilling: (billing: BillingRecord) => void;
}

export function BillingRanapTab({
  billings,
  onSelectForPayment,
  onViewKwitansi,
  onUpdateBilling
}: BillingRanapTabProps) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Belum Lunas' | 'Lunas'>('Semua');
  const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(null);

  // Form for deposit / uang muka
  const [isDepositModal, setIsDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(1000000);

  // Filter ranap billings
  const ranapBillings = billings.filter(b => b.tipeLayanan === 'Rawat Inap');
  const filteredBillings = ranapBillings.filter(b => {
    const matchesSearch = 
      b.namaPasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.noBilling.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.noRm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.poliRuangan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Semua' ? true : b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBilling || depositAmount <= 0) return;

    const newDeposit = selectedBilling.uangMukaDeposit + depositAmount;
    const newSisa = Math.max(0, selectedBilling.totalTagihan - newDeposit - selectedBilling.jumlahDibayar);

    const updatedBilling: BillingRecord = {
      ...selectedBilling,
      uangMukaDeposit: newDeposit,
      sisaTagihan: newSisa,
      catatan: (selectedBilling.catatan || '') + ` | Deposit tambahan Rp ${depositAmount.toLocaleString('id-ID')}`
    };

    onUpdateBilling(updatedBilling);
    setSelectedBilling(updatedBilling);
    setIsDepositModal(false);
    toast.success(`Deposit sebesar Rp ${depositAmount.toLocaleString('id-ID')} berhasil dicatat.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bed className="w-5 h-5 text-indigo-500" />
            <span>Billing Rawat Inap & Discharge Planning</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-semibold">
              {filteredBillings.length} Pasien Ranap
            </span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manajemen tagihan berjalan (running bill), perhitungan kamar inap, visite dokter harian, dan deposit pasien.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Total Piutang Berjalan: <strong className="text-indigo-600 dark:text-indigo-400">Rp {ranapBillings.reduce((sum, b) => sum + b.sisaTagihan, 0).toLocaleString('id-ID')}</strong>
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pasien ranap, bangsal, No RM, atau No Billing..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                {(['Semua', 'Belum Lunas', 'Lunas'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      statusFilter === tab
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ranap Billing Cards */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredBillings.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
                <Bed className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">Tidak ada tagihan rawat inap ditemukan</p>
                <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter.</p>
              </div>
            ) : (
              filteredBillings.map(item => {
                const isSelected = selectedBilling?.id === item.id;
                const isPaid = item.status === 'Lunas';
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedBilling(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-900/20 border-indigo-400 dark:border-indigo-700 shadow-md ring-1 ring-indigo-400'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                            {item.noBilling}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPaid 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}>
                            {item.status}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                            {item.lamaInapHari || 1} Hari Rawat
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {item.namaPasien}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.noRm} • {item.poliRuangan} • DPJP: {item.namaDokter}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Sisa Tagihan</div>
                        <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                          Rp {item.sisaTagihan.toLocaleString('id-ID')}
                        </div>
                        {item.uangMukaDeposit > 0 && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            Deposit: Rp {item.uangMukaDeposit.toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                      <span>Masuk: {item.tanggalMasuk} {item.tanggalKeluar ? `• Keluar: ${item.tanggalKeluar}` : '(Masih Dirawat)'}</span>
                      <div className="flex items-center gap-2">
                        {!isPaid ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectForPayment(item);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors flex items-center gap-1"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pelunasan Pulang</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewKwitansi(item);
                            }}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak Invoice Ranap</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Inpatient Itemized Details */}
        <div className="lg:col-span-5">
          {selectedBilling ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden sticky top-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">{selectedBilling.noBilling}</span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{selectedBilling.namaPasien}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedBilling.poliRuangan}
                  </p>
                </div>
                <button
                  onClick={() => setIsDepositModal(true)}
                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Input Deposit</span>
                </button>
              </div>

              {/* Patient & Room Details */}
              <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/20 border-b border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Dokter Penanggung Jawab (DPJP):</span>
                  <strong className="text-slate-900 dark:text-white">{selectedBilling.namaDokter}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Penjamin Pasien:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedBilling.namaPenjamin}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Lama Rawat:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedBilling.lamaInapHari || 1} Hari (Tgl Masuk: {selectedBilling.tanggalMasuk})</strong>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Rincian Pelayanan Rawat Inap</h4>
                
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden max-h-[260px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                      <tr>
                        <th className="p-2.5">Item / Layanan</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Total (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedBilling.items.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                          <td className="p-2.5">
                            <div className="font-medium text-slate-900 dark:text-white">{item.deskripsi}</div>
                            <span className="text-[10px] text-slate-400">{item.kategori}</span>
                          </td>
                          <td className="p-2.5 text-center text-slate-600 dark:text-slate-400">{item.jumlah}</td>
                          <td className="p-2.5 text-right font-semibold text-slate-900 dark:text-white">
                            {item.total.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals & Deposit summary */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Total Tagihan Rumah Sakit:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Rp {selectedBilling.totalTagihan.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Uang Muka / Deposit Terbayar:</span>
                    <span className="font-semibold">- Rp {selectedBilling.uangMukaDeposit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                    <span>Sisa Tagihan Pelunasan:</span>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      Rp {selectedBilling.sisaTagihan.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 space-y-2">
                  {selectedBilling.status !== 'Lunas' ? (
                    <button
                      onClick={() => onSelectForPayment(selectedBilling)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pelunasan & Pulangkan Pasien</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewKwitansi(selectedBilling)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Kwitansi & Rincian Ranap</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700 text-slate-500 sticky top-4">
              <Bed className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">Pilih Pasien Rawat Inap</h4>
              <p className="text-xs text-slate-400 mt-1">Pilih pasien di sebelah kiri untuk melihat rincian tagihan kamar, visite, obat, atau mencatat deposit.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal Deposit Pasien */}
      {isDepositModal && selectedBilling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Penerimaan Deposit / Uang Muka
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Pasien: <strong className="text-slate-800 dark:text-slate-200">{selectedBilling.namaPasien}</strong> ({selectedBilling.noRm})
            </p>

            <form onSubmit={handleAddDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nominal Deposit Tambahan (Rp)
                </label>
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg text-lg font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Quick buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[500000, 1000000, 2000000, 3000000, 5000000, 10000000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="p-2 text-xs font-semibold bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300 rounded border border-slate-200 dark:border-slate-600 transition-colors"
                  >
                    Rp {(amt / 1000).toLocaleString('id-ID')}rb
                  </button>
                ))}
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Deposit Sebelumnya:</span>
                  <span>Rp {selectedBilling.uangMukaDeposit.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-300">
                  <span>Total Deposit Baru:</span>
                  <span>Rp {(selectedBilling.uangMukaDeposit + depositAmount).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  Simpan Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
