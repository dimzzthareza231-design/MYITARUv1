import React, { useState, useEffect } from 'react';
import { 
  Archive, Trash2, FileCheck, AlertTriangle, ShieldCheck, 
  Search, Filter, Printer, Clock, FileText, CheckCircle2, Eye, Calendar
} from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { Modal } from '../../Modal';

interface RetensiRecord {
  id: string;
  no_rm: string;
  nama: string;
  nik: string;
  tgl_kunjungan_terakhir: string;
  tahun_inaktif: number;
  status: 'Aktif' | 'Inaktif' | 'Siap Musnah' | 'Dimusnahkan';
  arsip_digital: boolean;
  no_bap?: string;
  tgl_musnah?: string;
  metode_pemusnahan?: string;
}

const INITIAL_RETENSI_DATA: RetensiRecord[] = [
  {
    id: 'RET-001',
    no_rm: 'RM-180312-0045',
    nama: 'Bambang Supriyadi',
    nik: '3201123456780001',
    tgl_kunjungan_terakhir: '2019-03-12',
    tahun_inaktif: 7,
    status: 'Siap Musnah',
    arsip_digital: true
  },
  {
    id: 'RET-002',
    no_rm: 'RM-190520-0089',
    nama: 'Hj. Rohana Mansyur',
    nik: '3201123456780002',
    tgl_kunjungan_terakhir: '2019-05-20',
    tahun_inaktif: 7,
    status: 'Siap Musnah',
    arsip_digital: true
  },
  {
    id: 'RET-003',
    no_rm: 'RM-200815-0112',
    nama: 'Yusuf Maulana',
    nik: '3201123456780003',
    tgl_kunjungan_terakhir: '2020-08-15',
    tahun_inaktif: 6,
    status: 'Inaktif',
    arsip_digital: true
  },
  {
    id: 'RET-004',
    no_rm: 'RM-160105-0012',
    nama: 'Kartini Hadinoto',
    nik: '3201123456780004',
    tgl_kunjungan_terakhir: '2016-01-05',
    tahun_inaktif: 10,
    status: 'Dimusnahkan',
    arsip_digital: true,
    no_bap: 'BAP/RM/2024/09/014',
    tgl_musnah: '2024-09-15',
    metode_pemusnahan: 'Incinerator & Shredder'
  }
];

export function RetensiMusnahTab() {
  const toast = useToast();
  const [data, setData] = useState<RetensiRecord[]>(() => {
    const saved = localStorage.getItem('simrs_retensi_musnah');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Gagal memuat retensi:', e);
      }
    }
    return INITIAL_RETENSI_DATA;
  });

  useEffect(() => {
    localStorage.setItem('simrs_retensi_musnah', JSON.stringify(data));
  }, [data]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [selectedRecord, setSelectedRecord] = useState<RetensiRecord | null>(null);
  const [isBAPModalOpen, setIsBAPModalOpen] = useState(false);
  const [bapNote, setBapNote] = useState('');

  const filteredData = data.filter(item => {
    const matchSearch = 
      item.no_rm.toLowerCase().includes(search.toLowerCase()) ||
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.nik.includes(search);
    const matchStatus = filterStatus === 'Semua' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const countAktif = data.filter(d => d.status === 'Aktif').length;
  const countInaktif = data.filter(d => d.status === 'Inaktif').length;
  const countSiapMusnah = data.filter(d => d.status === 'Siap Musnah').length;
  const countDimusnahkan = data.filter(d => d.status === 'Dimusnahkan').length;

  const handlePindahkanKeInaktif = (id: string) => {
    setData(prev => prev.map(item => item.id === id ? { ...item, status: 'Inaktif' } : item));
    toast.success('Berkas berhasil dipindahkan ke status Inaktif (Gudang Arsip)');
  };

  const handleOpenBAPModal = (item: RetensiRecord) => {
    setSelectedRecord(item);
    setBapNote(`Pemusnahan berkas rekam medis fisik no RM ${item.no_rm} (${item.nama}) sesuai Permenkes No. 24 Tahun 2022. Seluruh dokumen penting, resume medis, dan informed consent telah dipindai ke RME Digital.`);
    setIsBAPModalOpen(true);
  };

  const handleProsesPemusnahan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    const noBAP = `BAP/RM/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${Math.floor(100 + Math.random() * 900)}`;
    const today = new Date().toISOString().split('T')[0];

    setData(prev => prev.map(item => {
      if (item.id === selectedRecord.id) {
        return {
          ...item,
          status: 'Dimusnahkan',
          no_bap: noBAP,
          tgl_musnah: today,
          metode_pemusnahan: 'Shredding (Pencacahan) & Incineration RS'
        };
      }
      return item;
    }));

    toast.success(`Berita Acara Pemusnahan berhasil diterbitkan: ${noBAP}`);
    setIsBAPModalOpen(false);
    setSelectedRecord(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Archive className="w-6 h-6 text-amber-500" />
            Retensi & Pemusnahan Berkas Rekam Medis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Pengelolaan jadwal retensi berkas inaktif (5 tahun), alih media digital RME, dan Berita Acara Pemusnahan (BAP) sesuai Permenkes 24/2022.
          </p>
        </div>
        <span className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> Standar Permenkes 24/2022
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">Berkas Inaktif (5-7 Thn)</span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">{countInaktif}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Tersimpan di Gudang Arsip</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">Siap Dimusnahkan (&gt;7 Thn)</span>
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">{countSiapMusnah}</span>
          <span className="text-[10px] text-rose-500 mt-1 block">Menunggu Persetujuan BAP</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">Telah Dimusnahkan</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">{countDimusnahkan}</span>
          <span className="text-[10px] text-emerald-500 mt-1 block">Memiliki Arsip BAP Resmi</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs text-slate-500 font-bold block">Kepatuhan Alih Digital</span>
          <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">100%</span>
          <span className="text-[10px] text-indigo-500 mt-1 block">Resume Tersimpan di RME</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari berdasarkan No. RM, Nama Pasien, atau NIK..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Inaktif">Inaktif</option>
            <option value="Siap Musnah">Siap Musnah</option>
            <option value="Dimusnahkan">Dimusnahkan</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5 font-bold text-slate-600 dark:text-slate-400">No. Rekam Medis</th>
                <th className="p-3.5 font-bold text-slate-600 dark:text-slate-400">Nama Pasien & NIK</th>
                <th className="p-3.5 font-bold text-slate-600 dark:text-slate-400">Kunjungan Terakhir</th>
                <th className="p-3.5 font-bold text-slate-600 dark:text-slate-400">Masa Inaktif</th>
                <th className="p-3.5 font-bold text-slate-600 dark:text-slate-400">Alih Media Digital</th>
                <th className="p-3.5 font-bold text-slate-600 dark:text-slate-400">Status Berkas</th>
                <th className="p-3.5 font-bold text-slate-600 dark:text-slate-400 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Tidak ada berkas yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {item.no_rm}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{item.nama}</div>
                      <div className="text-[11px] text-slate-400 font-mono">NIK: {item.nik}</div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.tgl_kunjungan_terakhir}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{item.tahun_inaktif} Tahun</span>
                    </td>
                    <td className="p-3.5">
                      {item.arsip_digital ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Tersimpan RME
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <AlertTriangle className="w-3 h-3" /> Belum Scan
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {item.status === 'Inaktif' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          Inaktif (Gudang)
                        </span>
                      )}
                      {item.status === 'Siap Musnah' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 animate-pulse">
                          Siap Musnah
                        </span>
                      )}
                      {item.status === 'Dimusnahkan' && (
                        <div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                            Dimusnahkan
                          </span>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.no_bap}</div>
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {item.status === 'Siap Musnah' && (
                        <button
                          onClick={() => handleOpenBAPModal(item)}
                          className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Buat BAP
                        </button>
                      )}
                      {item.status === 'Inaktif' && (
                        <button
                          onClick={() => {
                            setData(prev => prev.map(i => i.id === item.id ? { ...i, status: 'Siap Musnah' } : i));
                            toast.success('Status berkas diperbarui menjadi Siap Musnah');
                          }}
                          className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <FileCheck className="w-3.5 h-3.5" /> Verifikasi Musnah
                        </button>
                      )}
                      {item.status === 'Dimusnahkan' && (
                        <button
                          onClick={() => toast.info(`Berita Acara: ${item.no_bap}\nTanggal: ${item.tgl_musnah}\nMetode: ${item.metode_pemusnahan}`)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> Detail BAP
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat BAP Pemusnahan */}
      <Modal
        isOpen={isBAPModalOpen}
        onClose={() => setIsBAPModalOpen(false)}
        title="Penerbitan Berita Acara Pemusnahan (BAP) Rekam Medis Fisik"
      >
        {selectedRecord && (
          <form onSubmit={handleProsesPemusnahan} className="space-y-4 text-xs">
            <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
              <div>
                <strong className="block font-bold">Peringatan Regulasi Pemusnahan</strong>
                <span>
                  Hanya berkas fisik non-aktif yang masa inaktifnya telah melampaui ketentuan yang boleh dimusnahkan. Ringkasan pulang (resume medis) dan persetujuan tindakan telah disimpan secara permanen di RME Digital.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-400 block">No. Rekam Medis:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-sm">{selectedRecord.no_rm}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Nama Pasien:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{selectedRecord.nama}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Kunjungan Terakhir:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedRecord.tgl_kunjungan_terakhir}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Masa Inaktif:</span>
                <span className="font-bold text-rose-600">{selectedRecord.tahun_inaktif} Tahun</span>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Catatan Berita Acara Pemusnahan:
              </label>
              <textarea
                value={bapNote}
                onChange={e => setBapNote(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Metode Pemusnahan:
              </label>
              <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs">
                <option value="Shredding & Incineration">Pencacahan Fisik (Paper Shredder) & Pembakaran Incinerator Bersertifikat</option>
                <option value="Peleburan Kimiawi">Peleburan Kimiawi Daur Ulang Ramah Lingkungan</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsBAPModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Terbitkan &amp; Cetak BAP
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
