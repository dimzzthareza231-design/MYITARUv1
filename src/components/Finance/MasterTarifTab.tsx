import React, { useState } from 'react';
import { 
  Search, Plus, Edit2, Trash2, CheckCircle, XCircle, 
  Tag, Download, Upload, Filter, DollarSign, Layers
} from 'lucide-react';
import { MasterTarifItem } from './types';
import { useToast } from '../../contexts/ToastContext';

interface MasterTarifTabProps {
  tarifs: MasterTarifItem[];
  onSaveTarifs: (tarifs: MasterTarifItem[]) => void;
}

export function MasterTarifTab({
  tarifs,
  onSaveTarifs
}: MasterTarifTabProps) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('Semua');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarif, setEditingTarif] = useState<MasterTarifItem | null>(null);

  // Form State
  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [unit, setUnit] = useState<MasterTarifItem['unitLayanan']>('Rawat Jalan');
  const [kategori, setKategori] = useState<MasterTarifItem['kategori']>('Tindakan Medis');
  const [kelas, setKelas] = useState<MasterTarifItem['kelasRuangan']>('Non-Kelas');
  const [jasaRs, setJasaRs] = useState(30000);
  const [jasaDokter, setJasaDokter] = useState(100000);
  const [jasaParamedis, setJasaParamedis] = useState(20000);
  const [bhp, setBhp] = useState(0);

  const filteredTarifs = tarifs.filter(t => {
    const matchesSearch = 
      t.namaLayanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.kodeTarif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.kategori.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUnit = selectedUnit === 'Semua' ? true : t.unitLayanan === selectedUnit;
    const matchesKelas = selectedKelas === 'Semua' ? true : t.kelasRuangan === selectedKelas;

    return matchesSearch && matchesUnit && matchesKelas;
  });

  const handleOpenAddModal = () => {
    setEditingTarif(null);
    setKode(`TRF-${Math.floor(1000 + Math.random() * 9000)}`);
    setNama('');
    setUnit('Rawat Jalan');
    setKategori('Tindakan Medis');
    setKelas('Non-Kelas');
    setJasaRs(30000);
    setJasaDokter(100000);
    setJasaParamedis(20000);
    setBhp(0);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: MasterTarifItem) => {
    setEditingTarif(item);
    setKode(item.kodeTarif);
    setNama(item.namaLayanan);
    setUnit(item.unitLayanan || item.unit);
    setKategori(item.kategori);
    setKelas(item.kelasRuangan || item.kelas || 'Non-Kelas');
    setJasaRs(item.rincianJasa?.jasaRS ?? item.rincianJasa?.jasaSarana ?? item.jasaSarana ?? 30000);
    setJasaDokter(item.rincianJasa?.jasaDokter ?? item.jasaDokter ?? 100000);
    setJasaParamedis(item.rincianJasa?.jasaParamedis ?? item.jasaPerawat ?? 20000);
    setBhp(item.rincianJasa?.bahanHabisPakai ?? item.rincianJasa?.bhp ?? 0);
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      toast.error('Nama layanan wajib diisi!');
      return;
    }

    const total = jasaRs + jasaDokter + jasaParamedis + bhp;

    if (editingTarif) {
      // Update
      const updatedList = tarifs.map(t => {
        if (t.id === editingTarif.id) {
          return {
            ...t,
            kodeTarif: kode,
            namaLayanan: nama,
            unitLayanan: unit,
            kategori,
            kelasRuangan: kelas,
            tarifTotal: total,
            rincianJasa: {
              jasaRS: jasaRs,
              jasaDokter,
              jasaParamedis,
              bahanHabisPakai: bhp
            }
          };
        }
        return t;
      });
      onSaveTarifs(updatedList);
      toast.success(`Tarif ${nama} berhasil diperbarui.`);
    } else {
      // Create new
      const newItem: MasterTarifItem = {
        id: `TRF-${Date.now()}`,
        kodeTarif: kode,
        namaLayanan: nama,
        unitLayanan: unit,
        kategori,
        kelasRuangan: kelas,
        tarifTotal: total,
        rincianJasa: {
          jasaRS: jasaRs,
          jasaDokter,
          jasaParamedis,
          bahanHabisPakai: bhp
        },
        statusAktif: true
      };
      onSaveTarifs([newItem, ...tarifs]);
      toast.success(`Tarif baru ${nama} berhasil ditambahkan.`);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    const updated = tarifs.map(t => t.id === id ? { ...t, statusAktif: !t.statusAktif } : t);
    onSaveTarifs(updated);
    toast.info('Status aktif tarif diubah.');
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tarif "${name}"?`)) {
      const updated = tarifs.filter(t => t.id !== id);
      onSaveTarifs(updated);
      toast.success(`Tarif ${name} dihapus.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <span>Master Data Tarif & Unit Cost Pelayanan</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
              {filteredTarifs.length} Tarif
            </span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Katalog tarif resmi RS, pembagian proporsi Jasa RS, Jasa Medis Dokter, Paramedis, dan Bahan Medis Habis Pakai (BMHP).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tarif Baru</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode tarif, nama tindakan, kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="Semua">Semua Unit Layanan</option>
            <option value="Rawat Jalan">Rawat Jalan</option>
            <option value="Rawat Inap">Rawat Inap</option>
            <option value="IGD">IGD</option>
            <option value="Kamar Operasi">Kamar Operasi</option>
            <option value="Laboratorium">Laboratorium</option>
            <option value="Radiologi">Radiologi</option>
          </select>

          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="Semua">Semua Kelas</option>
            <option value="Non-Kelas">Non-Kelas / Ralan</option>
            <option value="Kelas 3">Kelas 3</option>
            <option value="Kelas 2">Kelas 2</option>
            <option value="Kelas 1">Kelas 1</option>
            <option value="VIP">VIP</option>
            <option value="VVIP">VVIP</option>
          </select>
        </div>
      </div>

      {/* Tariffs Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5">Kode & Nama Layanan</th>
                <th className="p-3.5">Unit / Kelas</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5 text-right">Jasa RS</th>
                <th className="p-3.5 text-right">Jasa Medis Dokter</th>
                <th className="p-3.5 text-right">Paramedis / BMHP</th>
                <th className="p-3.5 text-right font-extrabold">Total Tarif (Rp)</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
              {filteredTarifs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900 dark:text-white">{item.namaLayanan}</div>
                    <span className="font-mono text-[10px] text-slate-400">{item.kodeTarif}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.unitLayanan}</span>
                    <span className="block text-[10px] text-slate-400">{item.kelasRuangan}</span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {item.kategori}
                    </span>
                  </td>
                  <td className="p-3.5 text-right text-slate-500">
                    {(item.rincianJasa?.jasaRS ?? item.rincianJasa?.jasaSarana ?? item.jasaSarana ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                    {(item.rincianJasa?.jasaDokter ?? item.jasaDokter ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right text-slate-500">
                    {((item.rincianJasa?.jasaParamedis ?? item.jasaPerawat ?? 0) + (item.rincianJasa?.bahanHabisPakai ?? item.rincianJasa?.bhp ?? 0)).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-right font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                    Rp {(item.tarifTotal ?? item.totalTarif ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                        item.statusAktif
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {item.statusAktif ? 'Aktif' : 'Non-Aktif'}
                    </button>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded"
                        title="Edit Tarif"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.namaLayanan)}
                        className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded"
                        title="Hapus Tarif"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Tariff */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingTarif ? 'Edit Tarif Pelayanan' : 'Tambah Master Tarif Baru'}
            </h3>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Kode Tarif
                  </label>
                  <input
                    type="text"
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Kategori
                  </label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Konsultasi">Konsultasi Medis</option>
                    <option value="Tindakan Medis">Tindakan Medis</option>
                    <option value="Kamar Inap">Kamar Inap</option>
                    <option value="Laboratorium">Laboratorium</option>
                    <option value="Radiologi">Radiologi</option>
                    <option value="Tindakan Operasi">Tindakan Operasi</option>
                    <option value="Administrasi">Administrasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nama Layanan / Tindakan Medis
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Konsultasi Dokter Spesialis Paru"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Unit Pelayanan
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Rawat Jalan">Rawat Jalan</option>
                    <option value="Rawat Inap">Rawat Inap</option>
                    <option value="IGD">IGD</option>
                    <option value="Kamar Operasi">Kamar Operasi</option>
                    <option value="Laboratorium">Laboratorium</option>
                    <option value="Radiologi">Radiologi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Kelas Ruangan
                  </label>
                  <select
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Non-Kelas">Non-Kelas / Ralan</option>
                    <option value="Kelas 3">Kelas 3</option>
                    <option value="Kelas 2">Kelas 2</option>
                    <option value="Kelas 1">Kelas 1</option>
                    <option value="VIP">VIP</option>
                    <option value="VVIP">VVIP</option>
                  </select>
                </div>
              </div>

              {/* Rincian Komponen Jasa */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Pembagian Komponen Unit Cost:
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Jasa RS (Sarana & Prasarana)</label>
                    <input
                      type="number"
                      step={1000}
                      value={jasaRs}
                      onChange={(e) => setJasaRs(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Jasa Medis Dokter (JM Dokter)</label>
                    <input
                      type="number"
                      step={1000}
                      value={jasaDokter}
                      onChange={(e) => setJasaDokter(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Jasa Paramedis / Perawat</label>
                    <input
                      type="number"
                      step={1000}
                      value={jasaParamedis}
                      onChange={(e) => setJasaParamedis(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Bahan Habis Pakai (BHP)</label>
                    <input
                      type="number"
                      step={1000}
                      value={bhp}
                      onChange={(e) => setBhp(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total Tarif Yang Ditagihkan:</span>
                  <span className="text-blue-600 dark:text-blue-400 text-base">
                    Rp {(jasaRs + jasaDokter + jasaParamedis + bhp).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  Simpan Tarif
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
