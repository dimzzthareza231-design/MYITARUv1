import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, RefreshCw, CheckCircle, XCircle, UserPlus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '../../Modal';
import { BPJS_KEYS, initBPJSData } from '../bpjsData';
import toast from 'react-hot-toast';

export function DataPesertaBPJS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pesertaList, setPesertaList] = useState<any[]>([]);
  const [selectedPeserta, setSelectedPeserta] = useState<any>(null);
  const [isCekModalOpen, setIsCekModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    initBPJSData();
    loadData();
  }, []);

  const loadData = () => {
    const raw = localStorage.getItem(BPJS_KEYS.PESERTA);
    const data = raw ? JSON.parse(raw) : [];
    setPesertaList(data);
  };

  const handleCekKepesertaan = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setIsCekModalOpen(false);
      toast.success('Status kepesertaan aktif!');
    }, 1500);
  };

  const handleDelete = (nik: string) => {
    if (true) {
      const newData = pesertaList.filter(p => p.nik !== nik);
      localStorage.setItem(BPJS_KEYS.PESERTA, JSON.stringify(newData));
      setPesertaList(newData);
      toast.success('Data peserta dihapus');
    }
  };


  const filteredPeserta = (pesertaList || []).filter(p => {
    if (!p) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    if (!term) return true;

    const nama = String(p.nama || p.nama_pasien || '').toLowerCase();
    const noKartu = String(p.noKartu || p.no_kartu || '').toLowerCase();
    const nik = String(p.nik || '').toLowerCase();

    return nama.includes(term) || noKartu.includes(term) || nik.includes(term);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Data Peserta BPJS</h1>
          <p className="text-slate-500">Kelola dan verifikasi data kepesertaan</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCekModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm flex items-center gap-2"
          >
            <Search className="w-4 h-4" /> Cek Keaktifan
          </button>
          <button 
            onClick={() => toast('Fitur tambah peserta (simulasi V-Claim)', { icon: '🚧' })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-sm flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Tambah Peserta
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan No Kartu, NIK, atau Nama..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">No Kartu BPJS</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">NIK</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Nama Peserta</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Faskes Tingkat 1</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Kelas</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPeserta.map((peserta, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-4 text-sm font-medium text-slate-900">{peserta.noKartu}</td>
                  <td className="p-4 text-sm text-slate-600">{peserta.nik}</td>
                  <td className="p-4 text-sm font-bold text-slate-800">{peserta.nama}</td>
                  <td className="p-4 text-sm text-slate-600">{peserta.faskes1}</td>
                  <td className="p-4 text-sm text-slate-600">{peserta.kelas}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      peserta.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {peserta.status === 'Aktif' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {peserta.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setSelectedPeserta(peserta); setIsDetailModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toast('Fitur Edit belum diimplementasi sepenuhnya', {icon:'🚧'})}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Edit Data"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(peserta.nik)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPeserta.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          <div>Menampilkan {filteredPeserta.length} data</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isCekModalOpen} onClose={() => setIsCekModalOpen(false)} title="Cek Kepesertaan V-Claim">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pencarian Berdasarkan</label>
            <select className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option>No. Kartu BPJS</option>
              <option>NIK (KTP)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nomor Identitas</label>
            <input type="text" className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Masukkan nomor..." />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button onClick={() => setIsCekModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Batal</button>
            <button onClick={handleCekKepesertaan} disabled={isChecking} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 disabled:opacity-70">
              {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {isChecking ? 'Mengecek...' : 'Cek Sekarang'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detail Peserta BPJS">
        {selectedPeserta && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-500">Nama Lengkap</div>
                <div className="font-bold text-slate-800">{selectedPeserta.nama}</div>
              </div>
              <div>
                <div className="text-slate-500">Status</div>
                <div className={`font-bold ${selectedPeserta.status === 'Aktif' ? 'text-emerald-600' : 'text-red-600'}`}>{selectedPeserta.status}</div>
              </div>
              <div>
                <div className="text-slate-500">No Kartu BPJS</div>
                <div className="font-bold text-slate-800">{selectedPeserta.noKartu}</div>
              </div>
              <div>
                <div className="text-slate-500">NIK (KTP)</div>
                <div className="font-bold text-slate-800">{selectedPeserta.nik}</div>
              </div>
              <div>
                <div className="text-slate-500">Faskes Tingkat 1</div>
                <div className="font-bold text-slate-800">{selectedPeserta.faskes1}</div>
              </div>
              <div>
                <div className="text-slate-500">Hak Kelas Rawat</div>
                <div className="font-bold text-slate-800">{selectedPeserta.kelas}</div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button onClick={() => setIsDetailModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200">
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

