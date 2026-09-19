import React, { useState, useEffect } from 'react';
import { useHospital } from '../../../contexts/HospitalContext';
import { useToast } from '../../../contexts/ToastContext';
import { 
  Archive, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Building2, 
  User, 
  FileText,
  QrCode,
  ArrowRight,
  Filter
} from 'lucide-react';
import PrintPDFButton from '../../PrintPDFButton';

export interface RecordLoan {
  id: string;
  no_tracer: string;
  no_rm: string;
  nama_pasien: string;
  peminjam: string;
  unit_peminjam: string;
  keperluan: string;
  tgl_pinjam: string;
  jam_pinjam: string;
  batas_kembali: string;
  lokasi_rak: string;
  status: 'DIPINJAM' | 'KEMBALI' | 'TERLAMBAT';
  tgl_kembali?: string;
  penerima_kembali?: string;
  catatan?: string;
}

const INITIAL_LOANS: RecordLoan[] = [
  {
    id: 'LOAN-001',
    no_tracer: 'TRC-2026-0041',
    no_rm: 'RM-001',
    nama_pasien: 'Budi Santoso',
    peminjam: 'dr. Andi Pratama, Sp.PD',
    unit_peminjam: 'Poli Penyakit Dalam',
    keperluan: 'Pelayanan Pasien Kontrol Rutin',
    tgl_pinjam: '2026-09-19',
    jam_pinjam: '08:30',
    batas_kembali: '2026-09-20 08:30',
    lokasi_rak: 'Roll-O-Pack A.02.04',
    status: 'DIPINJAM',
    catatan: 'Berkas tebal, resume medis 2025 terlampir'
  },
  {
    id: 'LOAN-002',
    no_tracer: 'TRC-2026-0039',
    no_rm: 'RM-002',
    nama_pasien: 'Siti Aminah',
    peminjam: 'dr. Ratna Sp.OG',
    unit_peminjam: 'Poli Kebidanan & Kandungan',
    keperluan: 'Pemeriksaan USG Fetomaternal',
    tgl_pinjam: '2026-09-17',
    jam_pinjam: '09:00',
    batas_kembali: '2026-09-18 09:00',
    lokasi_rak: 'Roll-O-Pack B.01.12',
    status: 'TERLAMBAT',
    catatan: 'Harap segera dikembalikan ke ruang filing'
  },
  {
    id: 'LOAN-003',
    no_tracer: 'TRC-2026-0035',
    no_rm: 'RM-003',
    nama_pasien: 'Ahmad Fauzi',
    peminjam: 'Ns. Maya (Ka. Ruang Melati)',
    unit_peminjam: 'Rawat Inap Bangsal Melati',
    keperluan: 'Perawatan Pasien Masuk Ranap',
    tgl_pinjam: '2026-09-18',
    jam_pinjam: '14:15',
    batas_kembali: '2026-09-20 14:15',
    lokasi_rak: 'Roll-O-Pack A.05.01',
    status: 'DIPINJAM'
  },
  {
    id: 'LOAN-004',
    no_tracer: 'TRC-2026-0028',
    no_rm: 'RM-004',
    nama_pasien: 'Dewi Lestari',
    peminjam: 'Tim Verifikator Casemix',
    unit_peminjam: 'Unit Casemix BPJS',
    keperluan: 'Klarifikasi Kelengkapan Berkas Klaim',
    tgl_pinjam: '2026-09-16',
    jam_pinjam: '10:00',
    batas_kembali: '2026-09-17 10:00',
    lokasi_rak: 'Roll-O-Pack C.03.08',
    status: 'KEMBALI',
    tgl_kembali: '2026-09-17 15:30',
    penerima_kembali: 'Staf Filing RM'
  }
];

export function PeminjamanBerkasTab() {
  const { pasien } = useHospital();
  const toast = useToast();

  const [loans, setLoans] = useState<RecordLoan[]>(() => {
    const saved = localStorage.getItem('hospital_rme_tracer_loans');
    return saved ? JSON.parse(saved) : INITIAL_LOANS;
  });

  useEffect(() => {
    localStorage.setItem('hospital_rme_tracer_loans', JSON.stringify(loans));
  }, [loans]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'SEMUA' | 'DIPINJAM' | 'TERLAMBAT' | 'KEMBALI'>('SEMUA');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTracerForPrint, setSelectedTracerForPrint] = useState<RecordLoan | null>(null);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [peminjam, setPeminjam] = useState('');
  const [unitPeminjam, setUnitPeminjam] = useState('Poli Penyakit Dalam');
  const [keperluan, setKeperluan] = useState('Pelayanan Rawat Jalan');
  const [lokasiRak, setLokasiRak] = useState('Roll-O-Pack A.01.01');
  const [catatan, setCatatan] = useState('');

  // Stats
  const totalActive = loans.filter(l => l.status === 'DIPINJAM').length;
  const totalOverdue = loans.filter(l => l.status === 'TERLAMBAT').length;
  const totalReturned = loans.filter(l => l.status === 'KEMBALI').length;

  const filteredLoans = loans.filter(l => {
    const matchStatus = statusFilter === 'SEMUA' || l.status === statusFilter;
    const term = search.toLowerCase();
    const matchSearch = !search ||
      l.no_rm.toLowerCase().includes(term) ||
      l.nama_pasien.toLowerCase().includes(term) ||
      l.peminjam.toLowerCase().includes(term) ||
      l.unit_peminjam.toLowerCase().includes(term) ||
      l.no_tracer.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    const p = (pasien || []).find(item => item.id === selectedPatientId);
    if (!p) {
      toast.error('Pilih pasien terlebih dahulu!');
      return;
    }
    if (!peminjam.trim()) {
      toast.error('Nama peminjam harus diisi!');
      return;
    }

    const now = new Date();
    const tglStr = now.toISOString().split('T')[0];
    const jamStr = now.toTimeString().substring(0, 5);

    // Default return limit 24h
    const deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const deadlineStr = `${deadline.toISOString().split('T')[0]} ${deadline.toTimeString().substring(0, 5)}`;

    const newLoan: RecordLoan = {
      id: `LOAN-${Date.now()}`,
      no_tracer: `TRC-${now.getFullYear()}-${String(loans.length + 1).padStart(4, '0')}`,
      no_rm: p.no_rm,
      nama_pasien: p.nama,
      peminjam: peminjam.trim(),
      unit_peminjam: unitPeminjam,
      keperluan,
      tgl_pinjam: tglStr,
      jam_pinjam: jamStr,
      batas_kembali: deadlineStr,
      lokasi_rak: lokasiRak,
      status: 'DIPINJAM',
      catatan: catatan.trim() || undefined
    };

    setLoans([newLoan, ...loans]);
    setIsModalOpen(false);
    toast.success(`Peminjaman Berkas RM Pasien ${p.nama} (${p.no_rm}) berhasil dicatat. Lembar Tracer dibuat.`);

    // Reset Form
    setSelectedPatientId('');
    setPeminjam('');
    setCatatan('');
  };

  const handleReturnRecord = (loanId: string) => {
    const now = new Date();
    const tglKembali = `${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)}`;

    setLoans(prev => prev.map(item => {
      if (item.id === loanId) {
        return {
          ...item,
          status: 'KEMBALI',
          tgl_kembali: tglKembali,
          penerima_kembali: 'Staf Filing RM'
        };
      }
      return item;
    }));

    toast.success('Berkas rekam medis telah diterima kembali dan diarsipkan ke rak filing.');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Archive className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Peminjaman & Pelacakan Berkas RM (Tracer System)
          </h1>
          <p className="text-slate-500 text-sm">
            Sistem sirkulasi berkas fisik & digital rekam medis berstandar KARS / STARKES Bab MRMIK
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Peminjaman Baru</span>
          </button>
        </div>
      </div>

      {/* STATS METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Berkas Sedang Dipinjam</span>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{totalActive}</div>
            <span className="text-[11px] text-slate-400">Dalam sirkulasi pelayanan</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Terlambat Kembali (Overdue)</span>
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{totalOverdue}</div>
            <span className="text-[11px] text-rose-500 font-medium">Melebihi batas waktu 24 jam</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Sudah Dikembalikan</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{totalReturned}</div>
            <span className="text-[11px] text-emerald-500 font-medium">Telah tersimpan di rak filing</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari No. RM, Nama Pasien, Peminjam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['SEMUA', 'DIPINJAM', 'TERLAMBAT', 'KEMBALI'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st === 'SEMUA' ? 'Semua Berkas' : st === 'DIPINJAM' ? 'Dipinjam' : st === 'TERLAMBAT' ? 'Terlambat' : 'Dikembalikan'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">No. Tracer & RM</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Pasien</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Peminjam & Unit</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Keperluan & Lokasi Rak</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Waktu Pinjam & Batas</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredLoans.map(loan => (
                <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs block">
                      {loan.no_tracer}
                    </span>
                    <span className="font-mono font-extrabold text-blue-600 dark:text-blue-300 text-sm">
                      {loan.no_rm}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {loan.nama_pasien}
                    </span>
                    {loan.catatan && (
                      <span className="text-[11px] text-slate-400 block italic mt-0.5">
                        {loan.catatan}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-slate-800 dark:text-slate-200 block text-xs">
                      {loan.peminjam}
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block">
                      {loan.unit_peminjam}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-xs text-slate-700 dark:text-slate-300 block">
                      {loan.keperluan}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700/70 text-slate-700 dark:text-slate-300 rounded text-[10px] font-mono font-semibold">
                      📍 {loan.lokasi_rak}
                    </span>
                  </td>
                  <td className="p-3.5 text-xs text-slate-600 dark:text-slate-400">
                    <div>Pinjam: {loan.tgl_pinjam} {loan.jam_pinjam}</div>
                    <div className="font-semibold text-slate-700 dark:text-slate-300">
                      Batas: {loan.batas_kembali}
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    {loan.status === 'DIPINJAM' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                        Dipinjam
                      </span>
                    )}
                    {loan.status === 'TERLAMBAT' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300">
                        Terlambat
                      </span>
                    )}
                    {loan.status === 'KEMBALI' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                        Dikembalikan
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {loan.status !== 'KEMBALI' && (
                        <button
                          onClick={() => handleReturnRecord(loan.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1"
                          title="Proses Pengembalian Berkas"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Kembali
                        </button>
                      )}
                      <PrintPDFButton
                        filename={`Tracer_${loan.no_rm}`}
                        label="🖨️ Tracer"
                        className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2.5 py-1 rounded-lg font-bold"
                        documentData={loan}
                        docType="tracer"
                        title="LEMBAR KELUAR BERKAS REKAM MEDIS (TRACER)"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLoans.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ada data peminjaman berkas rekam medis.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CATAT PEMINJAMAN BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Archive className="w-5 h-5 text-indigo-600" />
                Catat Peminjaman Berkas Rekam Medis (Tracer)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLoan} className="space-y-4 text-xs">
              {/* PASIEN */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pilih Pasien (Berkas RM) *
                </label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  <option value="">-- Pilih Pasien Rekam Medis --</option>
                  {(pasien || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.no_rm} — {p.nama} ({p.penjamin || 'Umum'})
                    </option>
                  ))}
                </select>
              </div>

              {/* PEMINJAM & UNIT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Peminjam (Dokter/Petugas) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: dr. Andi Pratama, Sp.PD"
                    value={peminjam}
                    onChange={(e) => setPeminjam(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Unit / Ruangan Peminjam *
                  </label>
                  <select
                    value={unitPeminjam}
                    onChange={(e) => setUnitPeminjam(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Poli Penyakit Dalam">Poli Penyakit Dalam</option>
                    <option value="Poli Anak">Poli Anak</option>
                    <option value="Poli Bedah">Poli Bedah</option>
                    <option value="Poli Kebidanan & Kandungan">Poli Kebidanan & Kandungan</option>
                    <option value="IGD (Gawat Darurat)">IGD (Gawat Darurat)</option>
                    <option value="Rawat Inap Bangsal Melati">Rawat Inap Bangsal Melati</option>
                    <option value="Rawat Inap Bangsal Mawar">Rawat Inap Bangsal Mawar</option>
                    <option value="Unit Casemix BPJS">Unit Casemix BPJS</option>
                    <option value="Komite Medik / Mutu">Komite Medik / Mutu</option>
                    <option value="Bagian Hukum & Kerjasama">Bagian Hukum & Kerjasama</option>
                  </select>
                </div>
              </div>

              {/* KEPERLUAN & LOKASI RAK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Keperluan Peminjaman
                  </label>
                  <select
                    value={keperluan}
                    onChange={(e) => setKeperluan(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Pelayanan Rawat Jalan">Pelayanan Rawat Jalan</option>
                    <option value="Perawatan Rawat Inap">Perawatan Rawat Inap</option>
                    <option value="Klaim BPJS & Asuransi">Klaim BPJS & Asuransi</option>
                    <option value="Audit Medik & Mutu (KLPCM)">Audit Medik & Mutu (KLPCM)</option>
                    <option value="Pelepasan Informasi / Visum">Pelepasan Informasi / Visum</option>
                    <option value="Riset & Pendidikan Klinis">Riset & Pendidikan Klinis</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Lokasi Rak Penyimpanan (Tracer Out)
                  </label>
                  <input
                    type="text"
                    value={lokasiRak}
                    onChange={(e) => setLokasiRak(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* CATATAN */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Kondisi berkas, lampiran dokumen tambahan, dll"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Simpan & Buat Tracer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
