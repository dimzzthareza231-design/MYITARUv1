import React, { useState } from 'react';
import { TarifRadiologiItem, ModalitasType } from './types';
import { DAFTAR_TARIF_RADIOLOGI } from './data';
import { 
  Search, Plus, Filter, Download, Edit3, Trash2, 
  CheckCircle2, DollarSign, Activity, FileSpreadsheet, ShieldAlert
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { Modal } from '../Modal';

export function KatalogTarifTab() {
  const toast = useToast();

  const [tarifs, setTarifs] = useState<TarifRadiologiItem[]>(() => {
    const saved = localStorage.getItem('simrs_radiologi_tarifs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
    return DAFTAR_TARIF_RADIOLOGI;
  });

  const saveTarifs = (newList: TarifRadiologiItem[]) => {
    setTarifs(newList);
    localStorage.setItem('simrs_radiologi_tarifs', JSON.stringify(newList));
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TarifRadiologiItem | null>(null);

  // Form State
  const [kodeTarif, setKodeTarif] = useState('');
  const [namaTindakan, setNamaTindakan] = useState('');
  const [modalitas, setModalitas] = useState<ModalitasType>('X-Ray');
  const [kodeIcd9, setKodeIcd9] = useState('87.44');
  const [kategori, setKategori] = useState<'Sederhana' | 'Sedang' | 'Canggih' | 'Khusus dengan Kontras'>('Sederhana');
  const [jasaRadiolog, setJasaRadiolog] = useState(65000);
  const [jasaRadiografer, setJasaRadiografer] = useState(35000);
  const [sewaAlat, setSewaAlat] = useState(80000);
  const [bmhpFilm, setBmhpFilm] = useState(30000);
  const [kontrasInjektor, setKontrasInjektor] = useState(0);
  const [plafonBpjs, setPlafonBpjs] = useState(225000);
  const [estimasiWaktu, setEstimasiWaktu] = useState(15);
  const [persiapanKhusus, setPersiapanKhusus] = useState('');

  const totalTarifCalc = Number(jasaRadiolog) + Number(jasaRadiografer) + Number(sewaAlat) + Number(bmhpFilm) + Number(kontrasInjektor);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setKodeTarif(`RAD-TRF-${Math.floor(Math.random() * 899 + 100)}`);
    setNamaTindakan('');
    setModalitas('X-Ray');
    setKodeIcd9('87.44');
    setKategori('Sederhana');
    setJasaRadiolog(70000);
    setJasaRadiografer(35000);
    setSewaAlat(85000);
    setBmhpFilm(30000);
    setKontrasInjektor(0);
    setPlafonBpjs(230000);
    setEstimasiWaktu(15);
    setPersiapanKhusus('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TarifRadiologiItem) => {
    setEditingItem(item);
    setKodeTarif(item.kode_tarif);
    setNamaTindakan(item.nama_tindakan);
    setModalitas(item.modalitas);
    setKodeIcd9(item.kode_icd9);
    setKategori(item.kategori);
    setJasaRadiolog(item.jasa_radiolog);
    setJasaRadiografer(item.jasa_radiografer);
    setSewaAlat(item.sewa_alat);
    setBmhpFilm(item.bmhp_film_media);
    setKontrasInjektor(item.kontras_injektor || 0);
    setPlafonBpjs(item.plafon_bpjs_inacbg);
    setEstimasiWaktu(item.estimasi_waktu_menit);
    setPersiapanKhusus(item.persiapan_khusus || '');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaTindakan.trim()) {
      toast.error('Nama tindakan wajib diisi');
      return;
    }

    const payload: TarifRadiologiItem = {
      id: editingItem ? editingItem.id : `TRF-${Date.now()}`,
      kode_tarif: kodeTarif,
      nama_tindakan: namaTindakan,
      modalitas: modalitas,
      kode_icd9: kodeIcd9,
      kategori: kategori,
      jasa_radiolog: Number(jasaRadiolog),
      jasa_radiografer: Number(jasaRadiografer),
      sewa_alat: Number(sewaAlat),
      bmhp_film_media: Number(bmhpFilm),
      kontras_injektor: Number(kontrasInjektor),
      total_tarif: totalTarifCalc,
      plafon_bpjs_inacbg: Number(plafonBpjs),
      estimasi_waktu_menit: Number(estimasiWaktu),
      persiapan_khusus: persiapanKhusus
    };

    if (editingItem) {
      saveTarifs(tarifs.map(t => t.id === editingItem.id ? payload : t));
      toast.success(`Tarif ${payload.nama_tindakan} berhasil diperbarui`);
    } else {
      saveTarifs([payload, ...tarifs]);
      toast.success(`Tarif baru ${payload.nama_tindakan} berhasil ditambahkan`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string | number) => {
    if (confirm('Hapus tarif pemeriksaan ini?')) {
      saveTarifs(tarifs.filter(t => t.id !== id));
      toast.success('Tarif pemeriksaan berhasil dihapus');
    }
  };

  const handleExportCSV = () => {
    const headers = 'Kode Tarif,Nama Tindakan,Modalitas,ICD-9,Kategori,Jasa Radiolog,Jasa Radiografer,Sewa Alat,BMHP,Kontras,Total Tarif,Plafon BPJS\n';
    const rows = tarifs.map(t => 
      `"${t.kode_tarif}","${t.nama_tindakan}","${t.modalitas}","${t.kode_icd9}","${t.kategori}",${t.jasa_radiolog},${t.jasa_radiografer},${t.sewa_alat},${t.bmhp_film_media},${t.kontras_injektor || 0},${t.total_tarif},${t.plafon_bpjs_inacbg}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `Katalog_Tarif_Radiologi_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Katalog tarif berhasil diexport ke CSV');
  };

  const filteredTarifs = tarifs.filter(t => {
    const matchSearch = 
      t.nama_tindakan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.kode_tarif.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.kode_icd9.toLowerCase().includes(searchTerm.toLowerCase());

    const matchModality = selectedModality === 'Semua' || t.modalitas === selectedModality;

    return matchSearch && matchModality;
  });

  return (
    <div className="space-y-6 text-left">
      {/* FILTER & TOP ACTIONS */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama tindakan, kode tarif, ICD-9..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
          >
            <option value="Semua">Semua Modalitas</option>
            <option value="X-Ray">X-Ray (Rontgen)</option>
            <option value="CT-Scan">CT-Scan</option>
            <option value="MRI">MRI</option>
            <option value="USG">USG Diagnostik</option>
            <option value="Panoramic">Panoramic Dental</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tambah Tarif Baru
          </button>
        </div>
      </div>

      {/* TARIFF TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3.5">Kode & ICD-9</th>
                <th className="p-3.5">Nama Prosedur Radiologi</th>
                <th className="p-3.5">Modalitas & Kategori</th>
                <th className="p-3.5 text-right">Rincian Komponen Tarif (Rp)</th>
                <th className="p-3.5 text-right">Total Tarif RS</th>
                <th className="p-3.5 text-right">Plafon INA-CBG</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredTarifs.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-3.5 align-top">
                    <span className="font-mono text-xs font-bold text-pink-600 dark:text-pink-400 block">
                      {t.kode_tarif}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">ICD-9: {t.kode_icd9}</span>
                  </td>

                  <td className="p-3.5 align-top">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t.nama_tindakan}
                    </div>
                    {t.persiapan_khusus && (
                      <div className="text-[11px] text-slate-500 mt-0.5 italic line-clamp-1">
                        Persiapan: {t.persiapan_khusus}
                      </div>
                    )}
                  </td>

                  <td className="p-3.5 align-top">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.modalitas === 'CT-Scan' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' :
                      t.modalitas === 'MRI' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' :
                      t.modalitas === 'USG' ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {t.modalitas}
                    </span>
                    <span className="text-xs text-slate-500 block mt-1">{t.kategori}</span>
                  </td>

                  <td className="p-3.5 align-top text-right text-xs space-y-0.5">
                    <div className="text-slate-600 dark:text-slate-300">
                      Radiolog: <span className="font-mono font-semibold">Rp {t.jasa_radiolog.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      Alat: <span className="font-mono font-semibold">Rp {t.sewa_alat.toLocaleString('id-ID')}</span>
                    </div>
                    {t.kontras_injektor ? (
                      <div className="text-amber-600 dark:text-amber-400 font-semibold">
                        Kontras: <span className="font-mono">Rp {t.kontras_injektor.toLocaleString('id-ID')}</span>
                      </div>
                    ) : null}
                  </td>

                  <td className="p-3.5 align-top text-right">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                      Rp {t.total_tarif.toLocaleString('id-ID')}
                    </div>
                    <div className="text-[10px] text-slate-400">Est. {t.estimasi_waktu_menit} Menit</div>
                  </td>

                  <td className="p-3.5 align-top text-right">
                    <div className="font-bold text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                      Rp {t.plafon_bpjs_inacbg.toLocaleString('id-ID')}
                    </div>
                  </td>

                  <td className="p-3.5 align-top text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-lg text-slate-700 dark:text-slate-300"
                        title="Edit Tarif"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 rounded-lg"
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

      {/* MODAL ADD / EDIT TARIFF */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Tarif Pemeriksaan Radiologi' : 'Tambah Tarif Pemeriksaan Radiologi Baru'}
      >
        <form onSubmit={handleSaveForm} className="space-y-4 text-left max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Kode Tarif *</label>
              <input
                type="text"
                required
                value={kodeTarif}
                onChange={(e) => setKodeTarif(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Kode ICD-9-CM</label>
              <input
                type="text"
                value={kodeIcd9}
                onChange={(e) => setKodeIcd9(e.target.value)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Nama Prosedur / Tindakan *</label>
            <input
              type="text"
              required
              value={namaTindakan}
              onChange={(e) => setNamaTindakan(e.target.value)}
              placeholder="misal: CT-Scan Abdomen 3 Fase Kontras"
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Modalitas</label>
              <select
                value={modalitas}
                onChange={(e) => setModalitas(e.target.value as ModalitasType)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
              >
                <option value="X-Ray">X-Ray (Rontgen)</option>
                <option value="CT-Scan">CT-Scan</option>
                <option value="MRI">MRI</option>
                <option value="USG">USG Diagnostik</option>
                <option value="Panoramic">Panoramic Dental</option>
                <option value="Mammografi">Mammografi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Kategori Tingkat</label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as any)}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
              >
                <option value="Sederhana">Sederhana</option>
                <option value="Sedang">Sedang</option>
                <option value="Canggih">Canggih</option>
                <option value="Khusus dengan Kontras">Khusus dengan Kontras</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Estimasi Waktu (Menit)</label>
              <input
                type="number"
                value={estimasiWaktu}
                onChange={(e) => setEstimasiWaktu(Number(e.target.value))}
                className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Breakdown Komponen Biaya */}
          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="text-xs font-bold text-pink-600">Breakdown Komponen Biaya (Rp)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Jasa Dokter Sp.Rad</label>
                <input
                  type="number"
                  value={jasaRadiolog}
                  onChange={(e) => setJasaRadiolog(Number(e.target.value))}
                  className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Jasa Radiografer</label>
                <input
                  type="number"
                  value={jasaRadiografer}
                  onChange={(e) => setJasaRadiografer(Number(e.target.value))}
                  className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Sewa Mesin / Alat</label>
                <input
                  type="number"
                  value={sewaAlat}
                  onChange={(e) => setSewaAlat(Number(e.target.value))}
                  className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">BMHP Film / Media</label>
                <input
                  type="number"
                  value={bmhpFilm}
                  onChange={(e) => setBmhpFilm(Number(e.target.value))}
                  className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Kontras & Injektor</label>
                <input
                  type="number"
                  value={kontrasInjektor}
                  onChange={(e) => setKontrasInjektor(Number(e.target.value))}
                  className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-emerald-600">Plafon BPJS INA-CBG</label>
                <input
                  type="number"
                  value={plafonBpjs}
                  onChange={(e) => setPlafonBpjs(Number(e.target.value))}
                  className="w-full p-1.5 bg-white dark:bg-slate-800 border rounded"
                />
              </div>
            </div>

            <div className="p-2.5 bg-pink-100/70 dark:bg-pink-950/40 rounded-lg flex justify-between items-center text-sm font-extrabold text-pink-900 dark:text-pink-200">
              <span>Total Tarif RS (Dihitung Otomatis):</span>
              <span className="font-mono text-base">Rp {totalTarifCalc.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Instruksi Persiapan Khusus Pasien</label>
            <input
              type="text"
              value={persiapanKhusus}
              onChange={(e) => setPersiapanKhusus(e.target.value)}
              placeholder="misal: Puasa 6 jam, lepas perhiasan logam"
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border rounded-lg text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-4 h-4" /> Simpan Tarif
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );


}
