import React, { useState } from 'react';
import { 
  Search, Plus, Eye, CreditCard, Printer, CheckCircle, 
  UserCheck, AlertCircle, FileText, ArrowRight, Sparkles, Filter, RefreshCw
} from 'lucide-react';
import { BillingRecord, BillingItem } from './types';
import { useHospital } from '../../contexts/HospitalContext';
import { useToast } from '../../contexts/ToastContext';

interface BillingRalanTabProps {
  billings: BillingRecord[];
  onSelectForPayment: (billing: BillingRecord) => void;
  onViewKwitansi: (billing: BillingRecord) => void;
  onUpdateBilling: (billing: BillingRecord) => void;
  onRefreshFromKunjungan: () => void;
}

export function BillingRalanTab({
  billings,
  onSelectForPayment,
  onViewKwitansi,
  onUpdateBilling,
  onRefreshFromKunjungan
}: BillingRalanTabProps) {
  const toast = useToast();
  const { kunjungan, pasien, penjamin } = useHospital();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Belum Lunas' | 'Lunas'>('Semua');
  const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(null);
  const [isAddingItemModal, setIsAddingItemModal] = useState(false);

  // Form state for adding manual item
  const [newItemKategori, setNewItemKategori] = useState<BillingItem['kategori']>('Tindakan');
  const [newItemDeskripsi, setNewItemDeskripsi] = useState('');
  const [newItemJumlah, setNewItemJumlah] = useState(1);
  const [newItemHarga, setNewItemHarga] = useState(50000);

  // Filter ralan billings
  const ralanBillings = billings.filter(b => b.tipeLayanan === 'Rawat Jalan');
  const filteredBillings = ralanBillings.filter(b => {
    const matchesSearch = 
      b.namaPasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.noBilling.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.noRm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.poliRuangan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Semua' ? true : b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBilling || !newItemDeskripsi.trim()) {
      toast.error('Lengkapi deskripsi item');
      return;
    }

    const totalItem = newItemJumlah * newItemHarga;
    const newItem: BillingItem = {
      id: `ITM-CUSTOM-${Date.now()}`,
      kategori: newItemKategori,
      deskripsi: newItemDeskripsi,
      jumlah: newItemJumlah,
      hargaSatuan: newItemHarga,
      total: totalItem,
      penjaminCovered: selectedBilling.tipePenjamin === 'BPJS'
    };

    const updatedItems = [...selectedBilling.items, newItem];
    const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
    const newTotal = newSubtotal + selectedBilling.biayaAdministrasi - selectedBilling.diskonTotal;

    const updatedBilling: BillingRecord = {
      ...selectedBilling,
      items: updatedItems,
      subtotal: newSubtotal,
      totalTagihan: newTotal,
      sisaTagihan: Math.max(0, newTotal - selectedBilling.uangMukaDeposit - selectedBilling.jumlahDibayar)
    };

    onUpdateBilling(updatedBilling);
    setSelectedBilling(updatedBilling);
    setIsAddingItemModal(false);
    setNewItemDeskripsi('');
    toast.success(`Item "${newItemDeskripsi}" berhasil ditambahkan ke tagihan`);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!selectedBilling) return;
    const updatedItems = selectedBilling.items.filter(i => i.id !== itemId);
    const newSubtotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
    const newTotal = newSubtotal + selectedBilling.biayaAdministrasi - selectedBilling.diskonTotal;

    const updatedBilling: BillingRecord = {
      ...selectedBilling,
      items: updatedItems,
      subtotal: newSubtotal,
      totalTagihan: newTotal,
      sisaTagihan: Math.max(0, newTotal - selectedBilling.uangMukaDeposit - selectedBilling.jumlahDibayar)
    };

    onUpdateBilling(updatedBilling);
    setSelectedBilling(updatedBilling);
    toast.info('Item tagihan telah dihapus');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Billing Rawat Jalan (Poli & Spesialis)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
              {filteredBillings.length} Tagihan
            </span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Pelayanan billing ralan terintegrasi antrian poliklinik, e-resep farmasi, dan tindakan medis.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onRefreshFromKunjungan}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            title="Tarik antrian kasir terbaru dari kunjungan poli"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sinkron Antrian Poli</span>
          </button>
        </div>
      </div>

      {/* Main Grid: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: List Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama pasien, No RM, No Billing, atau Poli..."
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
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List of Billing Records */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredBillings.length === 0 ? (
              <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
                <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">Tidak ada tagihan rawat jalan ditemukan</p>
                <p className="text-xs mt-1">Coba ubah kata kunci pencarian atau klik Sinkron Antrian Poli.</p>
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
                        ? 'bg-blue-50/70 dark:bg-blue-900/20 border-blue-400 dark:border-blue-700 shadow-md ring-1 ring-blue-400'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm'
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
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {item.namaPenjamin}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                          {item.namaPasien}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.noRm} • {item.poliRuangan} • {item.namaDokter}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs text-slate-500 dark:text-slate-400">Total Tagihan</div>
                        <div className="text-base font-bold text-blue-600 dark:text-blue-400">
                          Rp {item.totalTagihan.toLocaleString('id-ID')}
                        </div>
                        {item.diskonTotal > 0 && (
                          <div className="text-[10px] text-rose-500 font-medium">
                            Diskon Rp {item.diskonTotal.toLocaleString('id-ID')}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                      <span>Waktu Masuk: {item.tanggalMasuk}</span>
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
                            <span>Bayar Sekarang</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewKwitansi(item);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Cetak Kwitansi</span>
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

        {/* Right Column: Active Billing Itemized Details (5 cols) */}
        <div className="lg:col-span-5">
          {selectedBilling ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden sticky top-4">
              
              {/* Card Header */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase">{selectedBilling.noBilling}</span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{selectedBilling.namaPasien}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No. RM: <strong className="text-slate-800 dark:text-slate-200">{selectedBilling.noRm}</strong> | {selectedBilling.poliRuangan}
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  selectedBilling.status === 'Lunas'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                }`}>
                  {selectedBilling.status}
                </span>
              </div>

              {/* Patient & Doctor Meta */}
              <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-b border-slate-200 dark:border-slate-700 text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Dokter Pemeriksa:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedBilling.namaDokter}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Penjamin:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedBilling.namaPenjamin} ({selectedBilling.tipePenjamin})</strong>
                </div>
                {selectedBilling.noSep && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>No. SEP BPJS:</span>
                    <strong className="font-mono">{selectedBilling.noSep}</strong>
                  </div>
                )}
              </div>

              {/* Itemized Table */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Rincian Pos Tagihan</h4>
                  {selectedBilling.status !== 'Lunas' && (
                    <button
                      onClick={() => setIsAddingItemModal(true)}
                      className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 rounded font-medium transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Item</span>
                    </button>
                  )}
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden max-h-[260px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                      <tr>
                        <th className="p-2.5">Layanan / Item</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Harga</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                        {selectedBilling.status !== 'Lunas' && <th className="p-2.5 text-center">Aksi</th>}
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
                          <td className="p-2.5 text-right text-slate-600 dark:text-slate-400">
                            {item.hargaSatuan.toLocaleString('id-ID')}
                          </td>
                          <td className="p-2.5 text-right font-semibold text-slate-900 dark:text-white">
                            {item.total.toLocaleString('id-ID')}
                          </td>
                          {selectedBilling.status !== 'Lunas' && (
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="text-rose-500 hover:text-rose-700 p-1"
                                title="Hapus item"
                              >
                                &times;
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculation Summary */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal Layanan:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      Rp {selectedBilling.subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {selectedBilling.biayaAdministrasi > 0 && (
                    <div className="flex justify-between">
                      <span>Biaya Administrasi:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        Rp {selectedBilling.biayaAdministrasi.toLocaleString('id-ID')}
                      </span>
                    </div>
                  )}
                  {selectedBilling.diskonTotal > 0 && (
                    <div className="flex justify-between text-rose-500">
                      <span>Diskon / Potongan:</span>
                      <span>- Rp {selectedBilling.diskonTotal.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                    <span>Total Tagihan:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      Rp {selectedBilling.totalTagihan.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="mt-5 space-y-2">
                  {selectedBilling.status !== 'Lunas' ? (
                    <button
                      onClick={() => onSelectForPayment(selectedBilling)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Buka Form Pembayaran Kasir</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onViewKwitansi(selectedBilling)}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Kwitansi Pembayaran</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700 text-slate-500 sticky top-4">
              <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">Pilih Tagihan</h4>
              <p className="text-xs text-slate-400 mt-1">Klik salah satu tagihan pada daftar di sebelah kiri untuk melihat rincian item atau melakukan penambahan layanan.</p>
            </div>
          )}
        </div>

      </div>

      {/* Modal Add Manual Item */}
      {isAddingItemModal && selectedBilling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Tambah Item Tindakan / Layanan
            </h3>
            
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Kategori Layanan
                </label>
                <select
                  value={newItemKategori}
                  onChange={(e) => setNewItemKategori(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Tindakan">Tindakan Medis</option>
                  <option value="Konsultasi">Konsultasi / Visite</option>
                  <option value="Farmasi">Farmasi / Alkes</option>
                  <option value="Laboratorium">Laboratorium</option>
                  <option value="Radiologi">Radiologi</option>
                  <option value="Pendaftaran">Administrasi</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Deskripsi / Nama Item
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pemeriksaan EKG 12 Lead / Nebulizer"
                  value={newItemDeskripsi}
                  onChange={(e) => setNewItemDeskripsi(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Jumlah (Qty)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItemJumlah}
                    onChange={(e) => setNewItemJumlah(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Harga Satuan (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newItemHarga}
                    onChange={(e) => setNewItemHarga(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-600 dark:text-slate-400">Total Tambahan:</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  Rp {(newItemJumlah * newItemHarga).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItemModal(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  Simpan Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
