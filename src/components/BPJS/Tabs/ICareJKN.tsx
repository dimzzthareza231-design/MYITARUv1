import React, { useState, useEffect } from 'react';
import {
  Search, FileText, Calendar, Pill, Activity, Eye, Lock, User
} from 'lucide-react';
import toast from 'react-hot-toast';

export function ICareJKN() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riwayatList, setRiwayatList] = useState<any[]>(() => {
    const saved = localStorage.getItem('bpjs_icare_riwayat');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ICARE-001',
        tanggal: '2026-07-15',
        namaPasien: 'Budi Santoso',
        noKartu: '0001234567891',
        faskes: 'RS MyItaru Pusat',
        poli: 'Poli Penyakit Dalam',
        dokter: 'dr. Budi Santoso, Sp.PD',
        diagnosa: 'E11.9 - Type 2 Diabetes Mellitus',
        tindakan: '89.52 - Electrocardiogram',
        obat: [{ nama: 'Metformin 500mg', aturan: '2x1', jumlah: 30 }],
        catatan: 'Kontrol rutin DM, gula darah terkontrol'
      },
      {
        id: 'ICARE-002',
        tanggal: '2026-06-20',
        namaPasien: 'Budi Santoso',
        noKartu: '0001234567891',
        faskes: 'Puskesmas Melati',
        poli: 'Poli Umum',
        dokter: 'dr. Ahmad',
        diagnosa: 'J06.9 - ISPA',
        tindakan: '-',
        obat: [{ nama: 'Paracetamol 500mg', aturan: '3x1', jumlah: 10 }],
        catatan: 'ISPA ringan, istirahat cukup'
      }
    ];
  });

  const [selectedRiwayat, setSelectedRiwayat] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    localStorage.setItem('bpjs_icare_riwayat', JSON.stringify(riwayatList));
  }, [riwayatList]);

  const filtered = (riwayatList || []).filter(r => {
    if (!r) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    if (!term) return true;

    const nama = String(r.namaPasien || r.nama || '').toLowerCase();
    const noKartu = String(r.noKartu || r.no_kartu || '').toLowerCase();

    return nama.includes(term) || noKartu.includes(term);
  });

  if (!hasAccess) {
    return (
      <div className="p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <Lock className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Akses Dibatasi</h2>
          <p className="text-slate-500 dark:text-slate-400">Hanya tenaga kesehatan berwenang yang dapat mengakses i-Care JKN.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">i-Care JKN</h1>
          <p className="text-slate-500 dark:text-slate-400">Riwayat pelayanan pasien dari sistem BPJS Kesehatan</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <Lock className="w-4 h-4" />
          Akses terbatas untuk tenaga kesehatan berwenang
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan No Kartu BPJS atau Nama Pasien..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Daftar Riwayat */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Tanggal</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Pasien</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Faskes</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Diagnosa</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Dokter</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{r.tanggal}</td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-800 dark:text-white">{r.namaPasien}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{r.noKartu}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.faskes}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{r.poli}</div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{r.diagnosa}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{r.dokter}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedRiwayat(r)}
                      className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 rounded transition-colors"
                      title="Lihat Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Belum ada data riwayat pelayanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRiwayat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl sticky top-0 z-10">
              <h2 className="text-xl font-bold">Detail Riwayat Pelayanan i-Care JKN</h2>
              <button onClick={() => setSelectedRiwayat(null)} className="text-2xl hover:bg-blue-700 w-8 h-8 rounded flex items-center justify-center">✕</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Info Pasien */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pasien</div>
                  <div className="font-bold text-slate-800 dark:text-white">{selectedRiwayat.namaPasien}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{selectedRiwayat.noKartu}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tanggal Pelayanan</div>
                  <div className="font-bold text-slate-800 dark:text-white">{selectedRiwayat.tanggal}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Faskes</div>
                  <div className="font-bold text-slate-800 dark:text-white">{selectedRiwayat.faskes}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{selectedRiwayat.poli}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Dokter</div>
                  <div className="font-bold text-slate-800 dark:text-white">{selectedRiwayat.dokter}</div>
                </div>
              </div>

              {/* Diagnosa & Tindakan */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border border-emerald-100 dark:border-emerald-800">
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Diagnosa (ICD-10)</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedRiwayat.diagnosa}</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                  <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Tindakan (ICD-9-CM)</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-white">{selectedRiwayat.tindakan || '-'}</div>
                </div>
              </div>

              {/* Obat */}
              {selectedRiwayat.obat && selectedRiwayat.obat.length > 0 && (
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">Obat yang Diberikan</div>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                        <th className="p-2 text-left text-slate-600 dark:text-slate-300">Obat</th>
                        <th className="p-2 text-left text-slate-600 dark:text-slate-300">Aturan Pakai</th>
                        <th className="p-2 text-left text-slate-600 dark:text-slate-300">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {selectedRiwayat.obat.map((o: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-2 text-slate-800 dark:text-slate-200">{o.nama}</td>
                          <td className="p-2 text-slate-600 dark:text-slate-300">{o.aturan}</td>
                          <td className="p-2 text-slate-600 dark:text-slate-300">{o.jumlah}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Catatan */}
              {selectedRiwayat.catatan && (
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Catatan</div>
                  <div className="text-sm text-slate-800 dark:text-slate-200">{selectedRiwayat.catatan}</div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedRiwayat(null)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
