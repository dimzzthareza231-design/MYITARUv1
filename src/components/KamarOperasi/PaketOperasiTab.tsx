import React, { useState } from 'react';
import { PaketOperasiItem } from './types';
import { useToast } from '../../contexts/ToastContext';
import { 
  Package, Search, Filter, Plus, DollarSign, CheckCircle2, 
  Layers, ChevronRight, X, Edit3, Trash2, ShieldCheck, Eye, Clock
} from 'lucide-react';

interface PaketOperasiTabProps {
  paketList: PaketOperasiItem[];
  setPaketList: React.Dispatch<React.SetStateAction<PaketOperasiItem[]>>;
}

export function PaketOperasiTab({ paketList, setPaketList }: PaketOperasiTabProps) {
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [selectedPaket, setSelectedPaket] = useState<PaketOperasiItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Paket Form State
  const [newPaket, setNewPaket] = useState({
    kode_paket: '',
    nama_paket: '',
    kategori: 'Bedah Sedang' as PaketOperasiItem['kategori'],
    spesialisasi: 'Bedah Umum',
    kode_icd9: '',
    estimasi_durasi: '60 Menit',
    jasa_operator: 3000000,
    jasa_anastesi: 1200000,
    sewa_ok: 1500000,
    bmhp_standar: 2000000,
    jasa_perawat_ok: 500000,
    tarif_ina_cbgs: 9500000,
    keterangan: ''
  });

  const totalPaket = paketList.length;

  const filteredPaket = paketList.filter(p => {
    const code = p.kode_paket || '';
    const icd9 = p.kode_icd9 || '';
    const kat = p.kategori || '';
    const matchSearch = 
      p.nama_paket.toLowerCase().includes(search.toLowerCase()) ||
      code.toLowerCase().includes(search.toLowerCase()) ||
      p.spesialisasi.toLowerCase().includes(search.toLowerCase()) ||
      icd9.toLowerCase().includes(search.toLowerCase());

    const matchKategori = kategoriFilter === 'Semua' || kat === kategoriFilter;
    return matchSearch && matchKategori;
  });

  const formatRupiah = (num?: number) => {
    return 'Rp ' + (num || 0).toLocaleString('id-ID');
  };

  const handleSaveNewPaket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaket.nama_paket || !newPaket.kode_paket) {
      toast.error('Mohon lengkapi kode dan nama paket');
      return;
    }

    const totalTarif = 
      Number(newPaket.jasa_operator) + 
      Number(newPaket.jasa_anastesi) + 
      Number(newPaket.sewa_ok) + 
      Number(newPaket.bmhp_standar) + 
      Number(newPaket.jasa_perawat_ok);

    const itemToAdd: PaketOperasiItem = {
      id: paketList.length + 1,
      kode_paket: newPaket.kode_paket,
      nama_paket: newPaket.nama_paket,
      kategori: newPaket.kategori,
      spesialisasi: newPaket.spesialisasi,
      kode_icd9: newPaket.kode_icd9 || '00.00',
      estimasi_durasi: newPaket.estimasi_durasi,
      jasa_operator: Number(newPaket.jasa_operator),
      jasa_anastesi: Number(newPaket.jasa_anastesi),
      jasa_anestesi: Number(newPaket.jasa_anastesi),
      sewa_ok: Number(newPaket.sewa_ok),
      bmhp_standar: Number(newPaket.bmhp_standar),
      jasa_perawat_ok: Number(newPaket.jasa_perawat_ok),
      total_tarif: totalTarif,
      tarif_ina_cbgs: Number(newPaket.tarif_ina_cbgs),
      status_aktif: true,
      termasuk_items: [
        'Sewa Ruang Operasi Steril',
        'Jasa Dokter Operator & Anestesi',
        'BMHP dan Obat Bedah Standar',
        'Observasi Pemulihan PACU 2 Jam'
      ],
      keterangan: newPaket.keterangan || 'Paket tindakan bedah terstandarisasi'
    };

    setPaketList([itemToAdd, ...paketList]);
    toast.success(`Paket operasi ${newPaket.nama_paket} berhasil ditambahkan!`);
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Header & Stats */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-rose-500" /> Katalog Tarif Paket Kamar Operasi & INA-CBGs
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Standarisasi tarif tindakan operatif, jasa medis dokter bedah, jasa anestesi, sewa ruang OK, dan plafon klaim BPJS
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/40 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Paket Operasi</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Paket Operasi (Nama paket, Kode ICD-9, Spesialisasi)..."
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
          <option value="Semua">Semua Kategori ({totalPaket})</option>
          <option value="Bedah Khusus">Bedah Khusus</option>
          <option value="Bedah Mayor">Bedah Mayor</option>
          <option value="Bedah Sedang">Bedah Sedang</option>
          <option value="Bedah Minor">Bedah Minor</option>
          <option value="Bedah Cito / Darurat">Bedah Cito / Darurat</option>
        </select>
      </div>

      {/* Cards Grid of Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPaket.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-rose-500/50 transition-all group backdrop-blur-md"
          >
            <div>
              {/* Badge & Code */}
              <div className="flex justify-between items-start gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  pkg.kategori === 'Bedah Khusus' ? 'bg-purple-950 text-purple-300 border border-purple-500/40' :
                  pkg.kategori === 'Bedah Mayor' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                  pkg.kategori === 'Bedah Sedang' ? 'bg-blue-950 text-blue-300 border border-blue-500/40' :
                  pkg.kategori === 'Bedah Minor' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                  'bg-amber-950 text-amber-300 border border-amber-500/40'
                }`}>
                  {pkg.kategori}
                </span>
                <span className="text-xs font-mono font-bold text-rose-400">{pkg.kode_paket}</span>
              </div>

              {/* Title & Specialist */}
              <h3 className="font-bold text-white text-base group-hover:text-rose-400 transition-colors line-clamp-1">
                {pkg.nama_paket}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{pkg.spesialisasi} — ICD-9: <strong className="text-cyan-400 font-mono">{pkg.kode_icd9}</strong></p>
              
              <div className="text-xs text-slate-300 mt-2 line-clamp-2 italic">
                {pkg.keterangan}
              </div>

              {/* Tariff Breakdown Mini */}
              <div className="mt-4 p-3 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Jasa Operator:</span>
                  <span className="text-slate-200 font-semibold">{formatRupiah(pkg.jasa_operator)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Jasa Anestesi:</span>
                  <span className="text-slate-200 font-semibold">{formatRupiah(pkg.jasa_anastesi ?? pkg.jasa_anestesi)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sewa OK & BMHP:</span>
                  <span className="text-slate-200 font-semibold">{formatRupiah((pkg.sewa_ok || 0) + (pkg.bmhp_standar || pkg.bmhp_est || 0))}</span>
                </div>
                <div className="pt-2 mt-1 border-t border-slate-700/60 flex justify-between items-baseline font-bold">
                  <span className="text-rose-300">Total Tarif:</span>
                  <span className="text-white text-sm font-mono font-black">{formatRupiah(pkg.total_tarif ?? pkg.biaya_nominal)}</span>
                </div>
              </div>

              {/* Plafon INA-CBGs */}
              <div className="mt-2.5 flex justify-between items-center text-[11px] px-1">
                <span className="text-slate-400">Plafon BPJS (INA-CBGs):</span>
                <span className="font-bold text-emerald-400">{formatRupiah(pkg.tarif_ina_cbgs)}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-700/70 flex justify-between items-center">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Est: {pkg.estimasi_durasi}
              </span>

              <button
                onClick={() => {
                  setSelectedPaket(pkg);
                  setIsDetailOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-700 hover:bg-rose-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Rincian Lengkap</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL DETAIL RINCIAN PAKET OPERASI */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {isDetailOpen && selectedPaket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-300 text-sm">
            
            <div className="p-5 bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border-b border-slate-700 flex justify-between items-center">
              <div>
                <span className="text-xs font-mono font-bold text-rose-400">{selectedPaket.kode_paket || 'PKT'}</span>
                <h3 className="text-lg font-bold text-white">{selectedPaket.nama_paket}</h3>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-3 bg-slate-800/60 border border-slate-700 rounded-xl space-y-1 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Kategori:</strong> {selectedPaket.kategori || 'Bedah Standar'}</div>
                  <div><strong>Spesialisasi:</strong> {selectedPaket.spesialisasi}</div>
                  <div><strong>Kode ICD-9:</strong> <span className="text-cyan-400 font-mono">{selectedPaket.kode_icd9 || '-'}</span></div>
                  <div><strong>Estimasi Durasi:</strong> {selectedPaket.estimasi_durasi}</div>
                </div>
              </div>

              {/* Rincian Komponen Biaya */}
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-rose-400">
                  Rincian Komponen Tarif Tindakan Operasi:
                </h4>
                <div className="bg-slate-800/40 border border-slate-700 rounded-xl divide-y divide-slate-700 text-xs">
                  <div className="p-2.5 flex justify-between">
                    <span>1. Jasa Medis Dokter Bedah (DPJP Operator):</span>
                    <strong className="text-white">{formatRupiah(selectedPaket.jasa_operator)}</strong>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span>2. Jasa Medis Dokter Spesialis Anestesi:</span>
                    <strong className="text-white">{formatRupiah(selectedPaket.jasa_anastesi ?? selectedPaket.jasa_anestesi)}</strong>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span>3. Sewa Ruang Kamar Operasi (OK & Mesin Anestesi):</span>
                    <strong className="text-white">{formatRupiah(selectedPaket.sewa_ok)}</strong>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span>4. Bahan Medis Habis Pakai (BMHP) & Obat Standar:</span>
                    <strong className="text-white">{formatRupiah(selectedPaket.bmhp_standar ?? selectedPaket.bmhp_est)}</strong>
                  </div>
                  <div className="p-2.5 flex justify-between">
                    <span>5. Jasa Tim Perawat Asisten & Instrumen OK:</span>
                    <strong className="text-white">{formatRupiah(selectedPaket.jasa_perawat_ok ?? 500000)}</strong>
                  </div>
                  <div className="p-3 bg-slate-900/90 flex justify-between items-center text-sm font-bold">
                    <span className="text-rose-400">Total Tarif Paket:</span>
                    <span className="text-emerald-400 text-base font-mono">{formatRupiah(selectedPaket.total_tarif ?? selectedPaket.biaya_nominal)}</span>
                  </div>
                </div>
              </div>

              {/* Items Included */}
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-emerald-400">
                  Cakupan Fasilitas & Layanan dalam Paket:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {(selectedPaket.termasuk_items || selectedPaket.komponen || ['Sewa Ruang Operasi Steril', 'Jasa Operator & Anestesi', 'BMHP & Obat Standar', 'Observasi PACU']).map((item: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700/60">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL TAMBAH PAKET OPERASI */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-5 bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-rose-500" /> Tambah Master Paket Operasi Baru
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPaket} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode Paket *</label>
                  <input
                    type="text"
                    required
                    value={newPaket.kode_paket}
                    onChange={(e) => setNewPaket({ ...newPaket, kode_paket: e.target.value })}
                    placeholder="Contoh: PKG-OK-013"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Paket Tindakan *</label>
                  <input
                    type="text"
                    required
                    value={newPaket.nama_paket}
                    onChange={(e) => setNewPaket({ ...newPaket, nama_paket: e.target.value })}
                    placeholder="Contoh: Laparoskopi Histerektomi"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori Operasi</label>
                  <select
                    value={newPaket.kategori}
                    onChange={(e) => setNewPaket({ ...newPaket, kategori: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Bedah Khusus">Bedah Khusus</option>
                    <option value="Bedah Mayor">Bedah Mayor</option>
                    <option value="Bedah Sedang">Bedah Sedang</option>
                    <option value="Bedah Minor">Bedah Minor</option>
                    <option value="Bedah Cito / Darurat">Bedah Cito / Darurat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Spesialisasi Bedah</label>
                  <input
                    type="text"
                    value={newPaket.spesialisasi}
                    onChange={(e) => setNewPaket({ ...newPaket, spesialisasi: e.target.value })}
                    placeholder="Contoh: Bedah Digestif / Obstetri"
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jasa Dokter Operator (Rp)</label>
                  <input
                    type="number"
                    value={newPaket.jasa_operator}
                    onChange={(e) => setNewPaket({ ...newPaket, jasa_operator: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Jasa Dokter Anestesi (Rp)</label>
                  <input
                    type="number"
                    value={newPaket.jasa_anastesi}
                    onChange={(e) => setNewPaket({ ...newPaket, jasa_anastesi: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sewa Kamar OK & Gas Medis (Rp)</label>
                  <input
                    type="number"
                    value={newPaket.sewa_ok}
                    onChange={(e) => setNewPaket({ ...newPaket, sewa_ok: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">BMHP & Obat Standar (Rp)</label>
                  <input
                    type="number"
                    value={newPaket.bmhp_standar}
                    onChange={(e) => setNewPaket({ ...newPaket, bmhp_standar: Number(e.target.value) })}
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
                  Simpan Paket
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
