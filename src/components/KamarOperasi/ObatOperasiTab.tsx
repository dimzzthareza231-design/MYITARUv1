import React, { useState } from 'react';
import { ObatBMHPOperasiItem } from './types';
import { useToast } from '../../contexts/ToastContext';
import { 
  Pill, AlertTriangle, Plus, Search, Filter, CheckCircle2, 
  Trash2, ShieldCheck, Box, RefreshCw, X
} from 'lucide-react';

interface ObatOperasiTabProps {
  obatList: ObatBMHPOperasiItem[];
  setObatList: React.Dispatch<React.SetStateAction<ObatBMHPOperasiItem[]>>;
}

export function ObatOperasiTab({ obatList, setObatList }: ObatOperasiTabProps) {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState<ObatBMHPOperasiItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Item State
  const [newItem, setNewItem] = useState({
    kode: '',
    nama: '',
    kategori: 'Obat Anestesi & Sedasi' as ObatBMHPOperasiItem['kategori'],
    satuan: 'Ampul',
    stok_tersedia: 50,
    stok_minimum: 15,
    harga_satuan: 45000,
    batch_no: 'BATCH-2026-01',
    expired_date: '2027-12-31',
    lokasi_rak: 'Troli Anestesi OK 1',
    keterangan: ''
  });

  const totalItems = obatList.length;
  const lowStockCount = obatList.filter(o => ((o.stok_tersedia ?? o.stok ?? 0) <= (o.stok_minimum ?? o.minimum_stok ?? 0))).length;

  const filteredItems = obatList.filter(item => {
    const loc = item.lokasi_rak || item.lokasi || '';
    const matchSearch = 
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kode.toLowerCase().includes(search.toLowerCase()) ||
      loc.toLowerCase().includes(search.toLowerCase());

    const matchKategori = kategoriFilter === 'Semua' || item.kategori === kategoriFilter;
    return matchSearch && matchKategori;
  });

  const formatRupiah = (num?: number) => 'Rp ' + (num || 0).toLocaleString('id-ID');

  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.nama || !newItem.kode) {
      toast.error('Mohon lengkapi kode dan nama obat/BMHP');
      return;
    }

    const itemToAdd: ObatBMHPOperasiItem = {
      id: obatList.length + 1,
      kode: newItem.kode,
      nama: newItem.nama,
      kategori: newItem.kategori,
      satuan: newItem.satuan,
      stok_tersedia: Number(newItem.stok_tersedia),
      stok: Number(newItem.stok_tersedia),
      stok_minimum: Number(newItem.stok_minimum),
      minimum_stok: Number(newItem.stok_minimum),
      harga_satuan: Number(newItem.harga_satuan),
      harga: Number(newItem.harga_satuan),
      batch_no: newItem.batch_no,
      no_batch: newItem.batch_no,
      expired_date: newItem.expired_date,
      lokasi_rak: newItem.lokasi_rak,
      lokasi: newItem.lokasi_rak,
      status_kadaluarsa: 'Aman (Valid)',
      keterangan: newItem.keterangan || 'Persediaan farmasi kamar operasi'
    };

    setObatList([itemToAdd, ...obatList]);
    toast.success(`Item ${newItem.nama} berhasil ditambahkan!`);
    setIsAddModalOpen(false);
  };

  const handleRestock = (id: number | string) => {
    setObatList(prev => prev.map(item => {
      if (item.id === id) {
        const currentStok = item.stok_tersedia ?? item.stok ?? 0;
        const added = 20;
        return { 
          ...item, 
          stok_tersedia: currentStok + added,
          stok: currentStok + added
        };
      }
      return item;
    }));
    toast.success('Stok berhasil di-restock dari Depo Farmasi Sentral (+20)');
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Top Header & Alert Ribbon */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-rose-500" /> Inventaris Obat Anestesi, Implan & BMHP Kamar Operasi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manajemen persediaan obat darurat/anestesi, benang jahit bedah, kassa radiopaque, dan instrumen steril intra-operatif
          </p>
        </div>

        <div className="flex gap-2">
          {lowStockCount > 0 && (
            <div className="px-3 py-1.5 bg-amber-950/60 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{lowStockCount} Item Menipis!</span>
            </div>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/40 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Item Baru</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Obat / BMHP (Nama obat, Kode, Lokasi rak troli)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none"
        >
          <option value="Semua">Semua Kategori ({totalItems})</option>
          <option value="Obat Anestesi & Sedasi">Obat Anestesi & Sedasi</option>
          <option value="Analgetik & Emergency">Analgetik & Emergency</option>
          <option value="Antibiotik Profilaksis">Antibiotik Profilaksis</option>
          <option value="Implan & Prostesis">Implan & Prostesis</option>
          <option value="Benang & Jarum Jahit">Benang & Jarum Jahit</option>
          <option value="BMHP Bedah Steril">BMHP Bedah Steril</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">Kode & Nama Item</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5 text-center">Stok Tersedia</th>
                <th className="p-3.5">Harga Satuan</th>
                <th className="p-3.5">Batch / Expired</th>
                <th className="p-3.5">Lokasi Rak/Troli</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredItems.map((item) => {
                const stokVal = item.stok_tersedia ?? item.stok ?? 0;
                const minVal = item.stok_minimum ?? item.minimum_stok ?? 0;
                const isLow = stokVal <= minVal;
                const batchVal = item.batch_no || item.no_batch || '-';
                const hargaVal = item.harga_satuan ?? item.harga ?? 0;
                const lokasiVal = item.lokasi_rak || item.lokasi || '-';

                return (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white text-sm">{item.nama}</div>
                      <div className="text-[11px] text-rose-400 font-mono mt-0.5">{item.kode} ({item.satuan})</div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700">
                        {item.kategori}
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <div className={`font-black text-sm ${isLow ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                        {stokVal} {item.satuan}
                      </div>
                      <div className="text-[10px] text-slate-400">Min: {minVal}</div>
                    </td>

                    <td className="p-3.5 font-bold text-slate-200">
                      {formatRupiah(hargaVal)}
                    </td>

                    <td className="p-3.5">
                      <div className="text-slate-200 font-medium">📅 {item.expired_date}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Lot: {batchVal}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="text-slate-300 font-semibold">{lokasiVal}</span>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleRestock(item.id)}
                        className="px-2.5 py-1 bg-slate-700 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-lg text-[11px] font-bold flex items-center gap-1 mx-auto transition-colors"
                        title="Restock dari Gudang Farmasi"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Restock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL TAMBAH ITEM OBAT/BMHP */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-5 bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-500" /> Tambah Obat / BMHP Kamar Operasi
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode Item *</label>
                  <input
                    type="text"
                    required
                    value={newItem.kode}
                    onChange={(e) => setNewItem({ ...newItem, kode: e.target.value })}
                    placeholder="Contoh: MED-OK-011"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Obat / BMHP *</label>
                  <input
                    type="text"
                    required
                    value={newItem.nama}
                    onChange={(e) => setNewItem({ ...newItem, nama: e.target.value })}
                    placeholder="Contoh: Ephedrine HCl Inj 50mg"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori</label>
                  <select
                    value={newItem.kategori}
                    onChange={(e) => setNewItem({ ...newItem, kategori: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Obat Anestesi & Sedasi">Obat Anestesi & Sedasi</option>
                    <option value="Analgetik & Emergency">Analgetik & Emergency</option>
                    <option value="Antibiotik Profilaksis">Antibiotik Profilaksis</option>
                    <option value="Implan & Prostesis">Implan & Prostesis</option>
                    <option value="Benang & Jarum Jahit">Benang & Jarum Jahit</option>
                    <option value="BMHP Bedah Steril">BMHP Bedah Steril</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Satuan</label>
                  <input
                    type="text"
                    value={newItem.satuan}
                    onChange={(e) => setNewItem({ ...newItem, satuan: e.target.value })}
                    placeholder="Ampul / Vial / Set / Pcs"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newItem.stok_tersedia}
                    onChange={(e) => setNewItem({ ...newItem, stok_tersedia: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    value={newItem.harga_satuan}
                    onChange={(e) => setNewItem({ ...newItem, harga_satuan: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Expired Date</label>
                  <input
                    type="date"
                    value={newItem.expired_date}
                    onChange={(e) => setNewItem({ ...newItem, expired_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lokasi Rak / Lemari OK</label>
                  <input
                    type="text"
                    value={newItem.lokasi_rak}
                    onChange={(e) => setNewItem({ ...newItem, lokasi_rak: e.target.value })}
                    placeholder="Contoh: Troli Emergency OK 1"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-2 mt-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold"
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
