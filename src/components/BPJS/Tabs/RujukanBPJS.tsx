import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, FileText, Plus, Eye, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../Modal';
import { BPJS_KEYS, initBPJSData } from '../bpjsData';
import toast from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

export function RujukanBPJS() {
  const [rujukanList, setRujukanList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCekModalOpen, setIsCekModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    initBPJSData();
    loadData();
  }, []);

  const loadData = () => {
    const raw = localStorage.getItem(BPJS_KEYS.RUJUKAN);
    const data = raw ? JSON.parse(raw) : [];
    setRujukanList(data);
  };

  const handleDelete = (noRujukan: string) => {
    if (true) {
      const newData = rujukanList.filter(r => r.noRujukan !== noRujukan);
      localStorage.setItem(BPJS_KEYS.RUJUKAN, JSON.stringify(newData));
      setRujukanList(newData);
      toast.success('Rujukan dihapus');
    }
  };


  const handleCekRujukan = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setIsCekModalOpen(false);
      toast.success('Data rujukan ditemukan');
    }, 1500);
  };

  const filtered = (rujukanList || []).filter(r => {
    if (!r) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    if (!term) return true;

    const noRujukan = String(r.noRujukan || r.no_rujukan || '').toLowerCase();
    const nama = String(r.nama || r.nama_pasien || '').toLowerCase();

    return noRujukan.includes(term) || nama.includes(term);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Rujukan</h1>
          <p className="text-slate-500">Cari, buat, dan kelola rujukan pasien BPJS</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsCekModalOpen(true)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
            <Search className="w-4 h-4" /> Cek Rujukan (PCare/Klinik)
          </button>
          <button onClick={() => setIsFormModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Rujukan Manual
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan No Rujukan, No Kartu, atau Nama..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">No Rujukan</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Pasien</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Poli Tujuan</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Faskes Perujuk</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4 font-mono text-sm text-blue-600">{r.noRujukan}</td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-800">{r.nama}</div>
                    <div className="text-xs text-slate-500">{r.noKartu}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{r.poliRujukan}</td>
                  <td className="p-4 text-sm text-slate-600">{r.faskesPerujuk}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <PrintPDFButton
                        documentData={{
                          nama: r.nama,
                          no_rm: r.noKartu,
                          no_rujukan: r.noRujukan,
                          faskes_perujuk: r.faskesPerujuk,
                          unit_pelayanan: r.poliRujukan,
                          diagnosis_utama: r.diagnosa || 'Pemeriksaan Rujukan Spesialis',
                          penjamin: 'BPJS Kesehatan',
                          edukasi_instruksi: `Surat Rujukan dari ${r.faskesPerujuk} ditujukan ke ${r.poliRujukan} Klinik MYITARU.`
                        }}
                        docType="surat_rujukan"
                        filename={`Rujukan_${r.noRujukan}`}
                        label="Cetak"
                        title="SURAT RUJUKAN PASIEN BPJS"
                        className="py-1 px-2 text-xs font-semibold"
                      />
                      <button onClick={() => toast.success('Redirect ke SEP...')} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded hover:bg-blue-100">
                        SEP
                      </button>
                      <button onClick={() => handleDelete(r.noRujukan)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Data rujukan tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isCekModalOpen} onClose={() => setIsCekModalOpen(false)} title="Cek Rujukan">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Cari Berdasarkan</label>
            <select className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option>No Rujukan PCare</option>
              <option>No Rujukan Klinik</option>
              <option>No Kartu BPJS (Multi Rujukan)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nomor</label>
            <input type="text" className="w-full p-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Masukkan nomor..." />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button onClick={() => setIsCekModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm">Batal</button>
            <button onClick={handleCekRujukan} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center gap-2">
              {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Cari Data'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Tambah Rujukan Manual">
        <div className="space-y-4 text-sm text-slate-600 p-4 text-center">
          Fitur form rujukan manual sedang dalam pengembangan (dummy placeholder).
          <div className="pt-4 flex justify-end gap-2">
            <button onClick={() => setIsFormModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700">Tutup</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

