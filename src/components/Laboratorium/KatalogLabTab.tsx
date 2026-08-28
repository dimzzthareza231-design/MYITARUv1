import React, { useState } from 'react';
import { LabCatalogTest } from './types';
import { KATALOG_LAB_MASTER } from './data';
import { 
  BookOpen, Search, Filter, Plus, Download, 
  TestTube, Clock, DollarSign, Layers, ChevronRight, X, Info
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function KatalogLabTab() {
  const toast = useToast();
  const [catalogList, setCatalogList] = useState<LabCatalogTest[]>(() => {
    const saved = localStorage.getItem('simrs_lab_catalog');
    return saved ? JSON.parse(saved) : KATALOG_LAB_MASTER;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeDetailTest, setActiveDetailTest] = useState<LabCatalogTest | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New item state
  const [newKode, setNewKode] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newKategori, setNewKategori] = useState<'Hematologi' | 'Kimia Klinik' | 'Imunoserologi' | 'Urinalisis & Feses' | 'Mikrobiologi' | 'Koagulasi' | 'Toksikologi & Narkoba'>('Hematologi');
  const [newWadah, setNewWadah] = useState('Tabung Tutup Ungu (EDTA K2/K3)');
  const [newSampel, setNewSampel] = useState('Darah Vena (Whole Blood)');
  const [newTarifUmum, setNewTarifUmum] = useState('100000');
  const [newTarifBpjs, setNewTarifBpjs] = useState('80000');
  const [newTatRutin, setNewTatRutin] = useState('60 Menit');
  const [newTatCito, setNewTatCito] = useState('30 Menit');
  const [newMetode, setNewMetode] = useState('Automated Assay');
  const [newLoinc, setNewLoinc] = useState('');

  const categories = ['ALL', 'Hematologi', 'Kimia Klinik', 'Imunoserologi', 'Urinalisis & Feses', 'Mikrobiologi', 'Koagulasi', 'Toksikologi & Narkoba'];

  const filteredCatalog = catalogList.filter(item => {
    const matchSearch = 
      item.nama_pemeriksaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.loinc_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.metode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCat = selectedCategory === 'ALL' || item.kategori === selectedCategory;
    return matchSearch && matchCat;
  });

  const handleExportCSV = () => {
    toast.info('Mengunduh katalog tarif dan master pemeriksaan laboratorium...');
    const headers = ['Kode', 'Nama Pemeriksaan', 'Kategori', 'LOINC', 'Wadah', 'Spesimen', 'Tarif Umum', 'Tarif BPJS', 'TAT Rutin', 'Metode'];
    const rows = catalogList.map(c => [
      `"${c.kode}"`,
      `"${c.nama_pemeriksaan}"`,
      `"${c.kategori}"`,
      `"${c.loinc_code}"`,
      `"${c.wadah}"`,
      `"${c.spesimen}"`,
      c.tarif_umum,
      c.tarif_bpjs,
      `"${c.tat_rutin}"`,
      `"${c.metode}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Katalog_Master_Laboratorium_MYITARU_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Katalog berhasil diexport ke format CSV!');
  };

  const handleSaveNewTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKode || !newNama) {
      toast.error('Kode dan Nama Pemeriksaan wajib diisi!');
      return;
    }

    const newItem: LabCatalogTest = {
      kode: newKode,
      nama_pemeriksaan: newNama,
      kategori: newKategori,
      spesimen: newSampel,
      wadah: newWadah,
      volume_minimal: '2-3 mL',
      metode: newMetode,
      tat_rutin: newTatRutin,
      tat_cito: newTatCito,
      tarif_umum: parseInt(newTarifUmum) || 0,
      tarif_bpjs: parseInt(newTarifBpjs) || 0,
      loinc_code: newLoinc || '99999-9',
      persiapan_pasien: 'Tidak ada persiapan khusus',
      parameter_detail: [
        {
          nama: newNama,
          satuan: '-',
          nilai_rujukan: 'Normal',
          nilai_kritis: '-'
        }
      ]
    };

    const updated = [newItem, ...catalogList];
    setCatalogList(updated);

    setIsAddModalOpen(false);
    toast.success(`Pemeriksaan baru ${newNama} (${newKode}) berhasil ditambahkan ke katalog!`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER BANNER */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </span>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Katalog Master Uji Laboratorium & Standar LOINC
            </h3>
            <p className="text-xs text-slate-500">
              Daftar referensi parameter, tabung spesimen, tarif INA-CBGs/Umum, nilai rujukan, dan TAT ISO 15189.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Pemeriksaan Baru
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama pemeriksaan, kode, kode LOINC, atau metode..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CATALOG GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map(test => (
          <div
            key={test.kode}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2 py-0.5 bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 rounded font-mono font-bold text-[11px]">
                  {test.kode}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold">
                  {test.kategori}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                  {test.nama_pemeriksaan}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                  LOINC: {test.loinc_code}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl space-y-1 text-xs border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>Wadah:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{test.wadah}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>Spesimen:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{test.spesimen}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>TAT Rutin / Cito:</span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400">{test.tat_rutin} / {test.tat_cito}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Tarif BPJS</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    Rp {test.tarif_bpjs.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Tarif Umum</span>
                  <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    Rp {test.tarif_umum.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveDetailTest(test)}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-cyan-50 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 hover:text-cyan-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Info className="w-3.5 h-3.5" /> Detail Parameter & Rujukan
            </button>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {activeDetailTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-600">{activeDetailTest.kode} • LOINC {activeDetailTest.loinc_code}</span>
                <h3 className="font-extrabold text-base">{activeDetailTest.nama_pemeriksaan}</h3>
              </div>
              <button onClick={() => setActiveDetailTest(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kategori & Metode</span>
                  <span className="font-bold">{activeDetailTest.kategori} ({activeDetailTest.metode})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Wadah & Spesimen</span>
                  <span className="font-bold">{activeDetailTest.wadah}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Persiapan Pasien</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{activeDetailTest.persiapan_pasien}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Turn Around Time (TAT)</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Rutin: {activeDetailTest.tat_rutin} • Cito: {activeDetailTest.tat_cito}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Parameter Detail, Satuan, & Rentang Rujukan
                </h4>
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-bold">
                      <tr>
                        <th className="p-2.5">Parameter</th>
                        <th className="p-2.5">Satuan</th>
                        <th className="p-2.5">Nilai Rujukan</th>
                        <th className="p-2.5">Nilai Kritis (Panic)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {(activeDetailTest.parameter_detail || []).map((p, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold">{p.nama}</td>
                          <td className="p-2.5 font-mono text-slate-500">{p.satuan}</td>
                          <td className="p-2.5 font-mono text-slate-700 dark:text-slate-300">{p.nilai_rujukan}</td>
                          <td className="p-2.5 font-mono text-rose-600 font-bold">{p.nilai_kritis || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveDetailTest(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW TEST MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-y-auto text-slate-900 dark:text-white">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-extrabold text-base">Tambah Master Uji Laboratorium Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewTest} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Kode Tes</label>
                  <input
                    type="text"
                    required
                    value={newKode}
                    onChange={e => setNewKode(e.target.value)}
                    placeholder="Contoh: HEM-005"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Kategori</label>
                  <select
                    value={newKategori}
                    onChange={e => setNewKategori(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none"
                  >
                    <option value="Hematologi">Hematologi</option>
                    <option value="Kimia Klinik">Kimia Klinik</option>
                    <option value="Imunoserologi">Imunoserologi</option>
                    <option value="Urinalisis & Feses">Urinalisis & Feses</option>
                    <option value="Mikrobiologi">Mikrobiologi</option>
                    <option value="Koagulasi">Koagulasi</option>
                    <option value="Toksikologi & Narkoba">Toksikologi & Narkoba</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Nama Pemeriksaan</label>
                <input
                  type="text"
                  required
                  value={newNama}
                  onChange={e => setNewNama(e.target.value)}
                  placeholder="Contoh: Fibrinogen Kuantitatif"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Wadah Tabung</label>
                  <input
                    type="text"
                    value={newWadah}
                    onChange={e => setNewWadah(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Spesimen</label>
                  <input
                    type="text"
                    value={newSampel}
                    onChange={e => setNewSampel(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tarif Umum (Rp)</label>
                  <input
                    type="number"
                    value={newTarifUmum}
                    onChange={e => setNewTarifUmum(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Tarif BPJS (Rp)</label>
                  <input
                    type="number"
                    value={newTarifBpjs}
                    onChange={e => setNewTarifBpjs(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Metode Uji</label>
                  <input
                    type="text"
                    value={newMetode}
                    onChange={e => setNewMetode(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Kode LOINC</label>
                  <input
                    type="text"
                    value={newLoinc}
                    onChange={e => setNewLoinc(e.target.value)}
                    placeholder="Contoh: 3255-7"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-transparent outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold shadow"
                >
                  Simpan ke Katalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );


}
