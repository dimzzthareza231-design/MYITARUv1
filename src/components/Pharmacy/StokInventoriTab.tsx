import React, { useState } from 'react';
import { MedicationStock, BatchItem } from './types';
import { 
  Boxes, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  Calendar, 
  FileText, 
  ArrowUpDown, 
  PackageCheck,
  Building,
  RefreshCw,
  Eye,
  FileSpreadsheet
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface StokInventoriTabProps {
  stocks: MedicationStock[];
  onUpdateStocks: (stocks: MedicationStock[]) => void;
  onAddStock: (newMed: MedicationStock) => void;
}

export function StokInventoriTab({ stocks, onUpdateStocks, onAddStock }: StokInventoriTabProps) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDepo, setActiveDepo] = useState<'semua' | 'depo_ralan' | 'depo_ranap' | 'gudang_utama' | 'depo_igd' | 'depo_ok'>('semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua Kategori');
  const [specialFilter, setSpecialFilter] = useState('Semua Sifat');
  const [selectedMed, setSelectedMed] = useState<MedicationStock | null>(null);

  // MODAL STATES
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showFakturModal, setShowFakturModal] = useState(false);
  const [showOpnameModal, setShowOpnameModal] = useState(false);

  // NEW MED FORM
  const [newMedName, setNewMedName] = useState('');
  const [newGenerik, setNewGenerik] = useState('');
  const [newKategori, setNewKategori] = useState('Tablet / Kapsul');
  const [newGolongan, setNewGolongan] = useState('Obat Keras');
  const [newSifat, setNewSifat] = useState('Standar');
  const [newSatuan, setNewSatuan] = useState('Tablet');
  const [newKekuatan, setNewKekuatan] = useState('500 mg');
  const [newHargaBeli, setNewHargaBeli] = useState(1000);
  const [newHargaJual, setNewHargaJual] = useState(1500);
  const [newStokAwal, setNewStokAwal] = useState(100);

  // FAKTUR PENERIMAAN PBF FORM
  const [pbfName, setPbfName] = useState('PT Kimia Farma Trading');
  const [noFaktur, setNoFaktur] = useState('FAK-KF-26089');
  const [fakturMedId, setFakturMedId] = useState('');
  const [fakturBatch, setFakturBatch] = useState('BAT-2608-X');
  const [fakturED, setFakturED] = useState('2028-12-31');
  const [fakturQty, setFakturQty] = useState(100);

  // OPNAME FORM
  const [opnameMedId, setOpnameMedId] = useState('');
  const [opnameFisik, setOpnameFisik] = useState(0);
  const [opnameKeterangan, setOpnameKeterangan] = useState('Hasil Stock Opname Bulanan Fisik');

  // FILTER LOGIC
  const filteredStocks = stocks.filter(item => {
    const matchSearch = item.nama_obat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nama_generik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kode_kfa.includes(searchTerm);
    const matchCat = categoryFilter === 'Semua Kategori' || item.kategori === categoryFilter;
    const matchSpecial = specialFilter === 'Semua Sifat' || item.sifat_khusus === specialFilter;
    return matchSearch && matchCat && matchSpecial;
  });

  // COUNTERS
  const countKritis = stocks.filter(s => s.status === 'Stok Kritis' || s.stok_total <= s.stok_minimum).length;
  const countHighAlert = stocks.filter(s => s.sifat_khusus === 'High Alert').length;
  const countLasa = stocks.filter(s => s.sifat_khusus === 'LASA / NORUM').length;
  const countNearED = stocks.filter(s => s.batches.some(b => b.tanggal_expired.startsWith('2026'))).length;

  // HANDLE PENERIMAAN FAKTUR PBF
  const handleSavePenerimaanFaktur = () => {
    if (!fakturMedId || !fakturBatch || !fakturED) {
      toast.error('Lengkapi data obat, batch, dan tanggal expired!');
      return;
    }
    const updated = stocks.map(stk => {
      if (stk.id === fakturMedId) {
        const newBatch: BatchItem = {
          no_batch: fakturBatch,
          tanggal_expired: fakturED,
          sisa_stok: fakturQty,
          asal_pbf: pbfName,
          no_faktur: noFaktur
        };
        const newGudang = stk.lokasi_depo.gudang_utama + fakturQty;
        const newTotal = stk.stok_total + fakturQty;
        return {
          ...stk,
          stok_total: newTotal,
          status: newTotal <= stk.stok_minimum ? 'Stok Kritis' : 'Tersedia',
          lokasi_depo: {
            ...stk.lokasi_depo,
            gudang_utama: newGudang
          },
          batches: [...stk.batches, newBatch]
        } as MedicationStock;
      }
      return stk;
    });

    onUpdateStocks(updated);
    setShowFakturModal(false);
    toast.success(`Faktur ${noFaktur} berhasil diterima! Stok ${fakturQty} unit masuk ke Gudang Utama Farmasi.`);
  };

  // HANDLE STOCK OPNAME ADJUSTMENT
  const handleSaveOpname = () => {
    if (!opnameMedId) {
      toast.error('Pilih obat untuk stock opname!');
      return;
    }
    const target = stocks.find(s => s.id === opnameMedId);
    if (!target) return;

    const selisih = opnameFisik - target.stok_total;
    const updated = stocks.map(stk => {
      if (stk.id === opnameMedId) {
        return {
          ...stk,
          stok_total: opnameFisik,
          status: opnameFisik <= stk.stok_minimum ? 'Stok Kritis' : 'Tersedia',
          lokasi_depo: {
            ...stk.lokasi_depo,
            gudang_utama: Math.max(0, stk.lokasi_depo.gudang_utama + selisih)
          }
        } as MedicationStock;
      }
      return stk;
    });

    onUpdateStocks(updated);
    setShowOpnameModal(false);
    toast.success(`Stock opname ${target.nama_obat} tersimpan! Stok disesuaikan menjadi ${opnameFisik} (Selisih: ${selisih > 0 ? `+${selisih}` : selisih}).`);
  };

  // HANDLE CREATE NEW MEDICATION
  const handleCreateNewMed = () => {
    if (!newMedName) {
      toast.error('Nama obat wajib diisi!');
      return;
    }
    const newStock: MedicationStock = {
      id: `MED-${Math.floor(100 + Math.random() * 900)}`,
      kode_kfa: `9300${Math.floor(1000 + Math.random() * 9000)}`,
      nama_obat: newMedName,
      nama_generik: newGenerik || newMedName,
      bentuk_sediaan: newKategori.split('/')[0].trim(),
      kekuatan: newKekuatan,
      satuan_terkecil: newSatuan,
      satuan_kemasan: `Box (${newSatuan})`,
      rasio_kemasan: 100,
      kategori: newKategori as any,
      golongan: newGolongan as any,
      sifat_khusus: newSifat as any,
      lokasi_depo: {
        depo_ralan: Math.floor(newStokAwal * 0.3),
        depo_ranap: Math.floor(newStokAwal * 0.2),
        gudang_utama: Math.floor(newStokAwal * 0.5),
        depo_igd: 0,
        depo_ok: 0
      },
      stok_total: newStokAwal,
      stok_minimum: 50,
      stok_maksimum: 1000,
      harga_beli: newHargaBeli,
      harga_jual_umum: newHargaJual,
      harga_jual_bpjs: Math.floor(newHargaJual * 0.8),
      batches: [
        {
          no_batch: `BAT-2026-${Math.floor(100 + Math.random() * 900)}`,
          tanggal_expired: '2028-06-30',
          sisa_stok: newStokAwal,
          asal_pbf: 'PT Enseval Putera Megatrading',
          no_faktur: 'FAK-INIT-001'
        }
      ],
      status: newStokAwal <= 50 ? 'Stok Kritis' : 'Tersedia',
      pabrik_produsen: 'Kalbe Farma',
      distributor_utama: 'Enseval Putera Megatrading'
    };

    onAddStock(newStock);
    setShowAddMedModal(false);
    toast.success(`Obat ${newStock.nama_obat} berhasil ditambahkan ke master stok Klinik!`);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Total Master Obat
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stocks.length} <span className="text-xs font-normal text-slate-500">Item</span>
            </div>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              Stok Kritis (&lt; Min)
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {countKritis} <span className="text-xs font-normal text-slate-500">Item Defecta</span>
            </div>
          </div>
          <div className="p-3 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
              High Alert &amp; LASA
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {countHighAlert + countLasa} <span className="text-xs font-normal text-slate-500">Waspada</span>
            </div>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Dekat Expired (&lt; 2026)
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {countNearED} <span className="text-xs font-normal text-slate-500">Batch Perhatian</span>
            </div>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. ACTIONS & DEPO SWITCHER BAR */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          {/* DEPO SWITCHER */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Depo:
            </span>
            {[
              { key: 'semua', label: 'Semua Depo Klinik' },
              { key: 'depo_ralan', label: 'Apotek Ralan' },
              { key: 'depo_ranap', label: 'Apotek Ranap' },
              { key: 'gudang_utama', label: 'Gudang Utama Farmasi' },
              { key: 'depo_igd', label: 'Depo IGD' },
              { key: 'depo_ok', label: 'Depo Kamar Operasi' }
            ].map(dp => (
              <button
                key={dp.key}
                onClick={() => setActiveDepo(dp.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeDepo === dp.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {dp.label}
              </button>
            ))}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <button
              onClick={() => setShowFakturModal(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Penerimaan Faktur PBF</span>
            </button>

            <button
              onClick={() => setShowOpnameModal(true)}
              className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Stock Opname</span>
            </button>

            <button
              onClick={() => setShowAddMedModal(true)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Master Obat Baru</span>
            </button>
          </div>
        </div>

        {/* SEARCH & SECONDARY FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Nama Obat, Kode KFA, Generik..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-900 dark:text-white outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="text-xs p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="Semua Kategori">Semua Bentuk Sediaan</option>
            <option value="Tablet / Kapsul">Tablet / Kapsul</option>
            <option value="Injeksi / Ampul / Vial">Injeksi / Ampul / Vial</option>
            <option value="Infus / Cairan Elektrolit">Infus / Cairan Elektrolit</option>
            <option value="Sirup / Suspensi">Sirup / Suspensi</option>
          </select>

          <select
            value={specialFilter}
            onChange={e => setSpecialFilter(e.target.value)}
            className="text-xs p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-transparent text-slate-800 dark:text-slate-200 outline-none"
          >
            <option value="Semua Sifat">Semua Sifat Khusus</option>
            <option value="High Alert">High Alert (Kewaspadaan Tinggi)</option>
            <option value="LASA / NORUM">LASA / NORUM</option>
            <option value="Standar">Standar</option>
          </select>
        </div>
      </div>

      {/* 3. STOCK TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-extrabold text-slate-600 dark:text-slate-400">
              <tr>
                <th className="p-3">Kode KFA / ID</th>
                <th className="p-3">Nama Obat &amp; Generik</th>
                <th className="p-3">Golongan &amp; Sifat</th>
                <th className="p-3 text-center">Ralan</th>
                <th className="p-3 text-center">Ranap</th>
                <th className="p-3 text-center">Gudang</th>
                <th className="p-3 text-center">Total Stok</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Harga Beli / Jual</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredStocks.map(item => {
                const isKritis = item.stok_total <= item.stok_minimum;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="p-3 font-mono">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{item.id}</span>
                      <span className="block text-[10px] text-slate-400">KFA: {item.kode_kfa}</span>
                    </td>
                    <td className="p-3">
                      <strong className="text-slate-900 dark:text-white block">{item.nama_obat}</strong>
                      <span className="text-[11px] text-slate-500">{item.nama_generik} • {item.bentuk_sediaan} ({item.kekuatan})</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold">
                        {item.golongan}
                      </span>
                      {item.sifat_khusus === 'High Alert' && (
                        <span className="block mt-1 px-1.5 py-0.5 bg-red-600 text-white rounded text-[9px] font-black w-fit uppercase">
                          HIGH ALERT
                        </span>
                      )}
                      {item.sifat_khusus === 'LASA / NORUM' && (
                        <span className="block mt-1 px-1.5 py-0.5 bg-amber-500 text-white rounded text-[9px] font-black w-fit uppercase">
                          LASA
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.lokasi_depo.depo_ralan}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.lokasi_depo.depo_ranap}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                      {item.lokasi_depo.gudang_utama}
                    </td>
                    <td className="p-3 text-center font-mono font-black text-sm">
                      <span className={isKritis ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}>
                        {item.stok_total}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-normal">Min: {item.stok_minimum}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isKritis
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {isKritis ? 'Stok Kritis' : 'Tersedia'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono">
                      <div className="text-[11px] text-slate-500">Beli: Rp {item.harga_beli.toLocaleString('id-ID')}</div>
                      <div className="font-bold text-slate-900 dark:text-white">Jual: Rp {item.harga_jual_umum.toLocaleString('id-ID')}</div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedMed(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg"
                        title="Kartu Stok & Batch"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. DETAIL KARTU STOK & BATCH MODAL */}
      {selectedMed && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-mono text-blue-600 font-bold block">{selectedMed.id} • KFA: {selectedMed.kode_kfa}</span>
                <h3 className="font-black text-base text-slate-900 dark:text-white">{selectedMed.nama_obat}</h3>
                <p className="text-xs text-slate-500">Pabrik: {selectedMed.pabrik_produsen} • Distributor: {selectedMed.distributor_utama}</p>
              </div>
              <button onClick={() => setSelectedMed(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {/* BATCH TABLE */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Daftar Batch &amp; Tanggal Expired (FIFO / FEFO):
              </h4>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 font-bold text-slate-500">
                      <th className="pb-1">No. Batch</th>
                      <th className="pb-1">Tanggal Expired</th>
                      <th className="pb-1">Sisa Stok</th>
                      <th className="pb-1">No. Faktur / PBF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {selectedMed.batches.map((b, bi) => (
                      <tr key={bi} className="text-slate-800 dark:text-slate-200">
                        <td className="py-2 font-mono font-bold">{b.no_batch}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            b.tanggal_expired.startsWith('2026') ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 dark:bg-slate-800'
                          }`}>
                            {b.tanggal_expired}
                          </span>
                        </td>
                        <td className="py-2 font-mono font-black">{b.sisa_stok} {selectedMed.satuan_terkecil}</td>
                        <td className="py-2 text-[11px] text-slate-500">{b.no_faktur} ({b.asal_pbf})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl space-y-1">
              <span className="font-bold block text-slate-700 dark:text-slate-300">Catatan Restriksi Peresepan:</span>
              <p className="text-slate-600 dark:text-slate-400">{selectedMed.restriksi_fornas || 'Tidak ada restriksi khusus.'}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedMed(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL PENERIMAAN FAKTUR PBF */}
      {showFakturModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                Penerimaan Faktur Obat dari PBF
              </h3>
              <button onClick={() => setShowFakturModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Distributor PBF *</label>
                  <input
                    type="text"
                    value={pbfName}
                    onChange={e => setPbfName(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. Faktur *</label>
                  <input
                    type="text"
                    value={noFaktur}
                    onChange={e => setNoFaktur(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Obat Masuk Master *</label>
                <select
                  value={fakturMedId}
                  onChange={e => setFakturMedId(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                >
                  <option value="">-- Pilih Obat --</option>
                  {stocks.map(s => (
                    <option key={s.id} value={s.id}>{s.nama_obat} ({s.satuan_terkecil})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">No. Batch *</label>
                  <input
                    type="text"
                    value={fakturBatch}
                    onChange={e => setFakturBatch(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tgl Expired *</label>
                  <input
                    type="date"
                    value={fakturED}
                    onChange={e => setFakturED(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Masuk *</label>
                  <input
                    type="number"
                    min={1}
                    value={fakturQty}
                    onChange={e => setFakturQty(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowFakturModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSavePenerimaanFaktur}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold shadow"
              >
                Simpan &amp; Masukkan ke Gudang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL STOCK OPNAME */}
      {showOpnameModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                Formulir Stock Opname Farmasi
              </h3>
              <button onClick={() => setShowOpnameModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Pilih Obat untuk Opname *</label>
                <select
                  value={opnameMedId}
                  onChange={e => {
                    setOpnameMedId(e.target.value);
                    const item = stocks.find(s => s.id === e.target.value);
                    if (item) setOpnameFisik(item.stok_total);
                  }}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                >
                  <option value="">-- Pilih Obat --</option>
                  {stocks.map(s => (
                    <option key={s.id} value={s.id}>{s.nama_obat} (Stok Sistem: {s.stok_total})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Jumlah Fisik Terhitung *</label>
                <input
                  type="number"
                  value={opnameFisik}
                  onChange={e => setOpnameFisik(Number(e.target.value))}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white font-mono text-base font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Keterangan / Berita Acara</label>
                <input
                  type="text"
                  value={opnameKeterangan}
                  onChange={e => setOpnameKeterangan(e.target.value)}
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowOpnameModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveOpname}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-extrabold shadow"
              >
                Validasi &amp; Sesuaikan Stok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL CREATE MASTER OBAT BARU */}
      {showAddMedModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Tambah Master Obat &amp; BMHP Baru
              </h3>
              <button onClick={() => setShowAddMedModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Dagang Obat *</label>
                <input
                  type="text"
                  value={newMedName}
                  onChange={e => setNewMedName(e.target.value)}
                  placeholder="Contoh: Bisoprolol 5 mg"
                  className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Generik</label>
                  <input
                    type="text"
                    value={newGenerik}
                    onChange={e => setNewGenerik(e.target.value)}
                    placeholder="Bisoprolol Fumarate"
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Kekuatan / Dosis</label>
                  <input
                    type="text"
                    value={newKekuatan}
                    onChange={e => setNewKekuatan(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Golongan</label>
                  <select
                    value={newGolongan}
                    onChange={e => setNewGolongan(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Obat Bebas">Obat Bebas</option>
                    <option value="Obat Bebas Terbatas">Obat Bebas Terbatas</option>
                    <option value="Obat Keras">Obat Keras</option>
                    <option value="Psikotropika">Psikotropika</option>
                    <option value="Narkotika">Narkotika</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sifat Khusus</label>
                  <select
                    value={newSifat}
                    onChange={e => setNewSifat(e.target.value)}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  >
                    <option value="Standar">Standar</option>
                    <option value="High Alert">High Alert</option>
                    <option value="LASA / NORUM">LASA / NORUM</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newStokAwal}
                    onChange={e => setNewStokAwal(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Harga Beli (HPP)</label>
                  <input
                    type="number"
                    value={newHargaBeli}
                    onChange={e => setNewHargaBeli(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Harga Jual Umum</label>
                  <input
                    type="number"
                    value={newHargaJual}
                    onChange={e => setNewHargaJual(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-lg bg-transparent text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowAddMedModal(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold"
              >
                Batal
              </button>
              <button
                onClick={handleCreateNewMed}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold shadow"
              >
                Simpan Master Obat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
