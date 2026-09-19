import React, { useState, useEffect } from 'react';
import { useHospital } from '../../../contexts/HospitalContext';
import { useToast } from '../../../contexts/ToastContext';
import { 
  FileBadge, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  FileText, 
  UserCheck, 
  Scale, 
  Building2,
  Printer
} from 'lucide-react';
import PrintPDFButton from '../../PrintPDFButton';

export interface PelepasanInformasiItem {
  id: string;
  no_permohonan: string;
  no_rm: string;
  nama_pasien: string;
  kategori_pemohon: 'PASIEN' | 'KELUARGA_AHLI_WARIS' | 'ASURANSI' | 'BPJS' | 'KEPOLISIAN_VISUM' | 'PENGADILAN';
  nama_pemohon: string;
  nik_pemohon: string;
  hubungan: string;
  dokumen_diminta: string;
  tujuan_keperluan: string;
  surat_kuasa_terlampir: boolean;
  ktp_terlampir: boolean;
  surat_tugas_penyidik?: boolean;
  status: 'MENUNGGU_VERIFIKASI' | 'DISETUJUI' | 'DISERAHKAN' | 'DITOLAK';
  tgl_permohonan: string;
  tgl_disetujui?: string;
  disetujui_oleh?: string;
}

const INITIAL_REQUESTS: PelepasanInformasiItem[] = [
  {
    id: 'PIM-001',
    no_permohonan: 'PIM-2026-0082',
    no_rm: 'RM-001',
    nama_pasien: 'Budi Santoso',
    kategori_pemohon: 'ASURANSI',
    nama_pemohon: 'Prudential Life Assurance (Officer: Sarah)',
    nik_pemohon: '3271048899000001',
    hubungan: 'Asuransi Penjamin Tambahan',
    dokumen_diminta: 'Resume Medis & Salinan Hasil Laboratorium',
    tujuan_keperluan: 'Klaim Penggantian Biaya Rawat Inap (Reimbursement)',
    surat_kuasa_terlampir: true,
    ktp_terlampir: true,
    status: 'DISETUJUI',
    tgl_permohonan: '2026-09-18',
    tgl_disetujui: '2026-09-19',
    disetujui_oleh: 'dr. Komite Etik & Hukum RS'
  },
  {
    id: 'PIM-002',
    no_permohonan: 'PIM-2026-0083',
    no_rm: 'RM-003',
    nama_pasien: 'Ahmad Fauzi',
    kategori_pemohon: 'KEPOLISIAN_VISUM',
    nama_pemohon: 'Aipda Joko Susilo (Polsek Metro)',
    nik_pemohon: '3171092881000004',
    hubungan: 'Penyidik Kepolisian',
    dokumen_diminta: 'Visum et Repertum (Luka Trauma Akibat Kecelakaan Lalu Lintas)',
    tujuan_keperluan: 'Penyidikan Perkara Tindak Pidana Laka Lantas',
    surat_kuasa_terlampir: false,
    ktp_terlampir: true,
    surat_tugas_penyidik: true,
    status: 'MENUNGGU_VERIFIKASI',
    tgl_permohonan: '2026-09-19'
  },
  {
    id: 'PIM-003',
    no_permohonan: 'PIM-2026-0079',
    no_rm: 'RM-002',
    nama_pasien: 'Siti Aminah',
    kategori_pemohon: 'PASIEN',
    nama_pemohon: 'Siti Aminah (Sendiri)',
    nik_pemohon: '3201089901230002',
    hubungan: 'Pasien Sendiri',
    dokumen_diminta: 'Resume Medis Kebidanan & USG',
    tujuan_keperluan: 'Rujukan Melahirkan di Luar Kota',
    surat_kuasa_terlampir: false,
    ktp_terlampir: true,
    status: 'DISERAHKAN',
    tgl_permohonan: '2026-09-16',
    tgl_disetujui: '2026-09-17',
    disetujui_oleh: 'Kepala Instalasi Rekam Medis'
  }
];

export function PelepasanInformasiTab() {
  const { pasien } = useHospital();
  const toast = useToast();

  const [requests, setRequests] = useState<PelepasanInformasiItem[]>(() => {
    const saved = localStorage.getItem('hospital_rme_pelepasan_informasi');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  useEffect(() => {
    localStorage.setItem('hospital_rme_pelepasan_informasi', JSON.stringify(requests));
  }, [requests]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'SEMUA' | 'MENUNGGU_VERIFIKASI' | 'DISETUJUI' | 'DISERAHKAN' | 'DITOLAK'>('SEMUA');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [kategori, setKategori] = useState<PelepasanInformasiItem['kategori_pemohon']>('PASIEN');
  const [namaPemohon, setNamaPemohon] = useState('');
  const [nikPemohon, setNikPemohon] = useState('');
  const [hubungan, setHubungan] = useState('Pasien Sendiri');
  const [dokumen, setDokumen] = useState('Resume Medis (Ringkasan Pulang)');
  const [keperluan, setKeperluan] = useState('Klaim Asuransi Pribadi');
  const [suratKuasa, setSuratKuasa] = useState(false);
  const [ktp, setKtp] = useState(true);

  // Stats
  const total = requests.length;
  const waitingCount = requests.filter(r => r.status === 'MENUNGGU_VERIFIKASI').length;
  const approvedCount = requests.filter(r => r.status === 'DISETUJUI').length;
  const deliveredCount = requests.filter(r => r.status === 'DISERAHKAN').length;

  const filtered = requests.filter(r => {
    const matchStatus = statusFilter === 'SEMUA' || r.status === statusFilter;
    const term = search.toLowerCase();
    const matchSearch = !search ||
      r.no_rm.toLowerCase().includes(term) ||
      r.nama_pasien.toLowerCase().includes(term) ||
      r.no_permohonan.toLowerCase().includes(term) ||
      r.nama_pemohon.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'DISETUJUI',
          tgl_disetujui: new Date().toISOString().split('T')[0],
          disetujui_oleh: 'dr. Komite Etik & Rekam Medis'
        };
      }
      return item;
    }));
    toast.success('Permohonan pelepasan informasi medis telah DISETUJUI secara sah.');
  };

  const handleDeliver = (id: string) => {
    setRequests(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'DISERAHKAN'
        };
      }
      return item;
    }));
    toast.success('Salinan rekam medis telah diserahkan resmi ke pemohon dengan tanda terima.');
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const p = (pasien || []).find(item => item.id === selectedPatientId);
    if (!p) {
      toast.error('Pilih pasien yang dimohonkan!');
      return;
    }
    if (!namaPemohon.trim()) {
      toast.error('Nama pemohon harus diisi!');
      return;
    }

    const newReq: PelepasanInformasiItem = {
      id: `PIM-${Date.now()}`,
      no_permohonan: `PIM-${new Date().getFullYear()}-${String(requests.length + 1).padStart(4, '0')}`,
      no_rm: p.no_rm,
      nama_pasien: p.nama,
      kategori_pemohon: kategori,
      nama_pemohon: namaPemohon.trim(),
      nik_pemohon: nikPemohon.trim() || '-',
      hubungan,
      dokumen_diminta: dokumen,
      tujuan_keperluan: keperluan,
      surat_kuasa_terlampir: suratKuasa,
      ktp_terlampir: ktp,
      status: 'MENUNGGU_VERIFIKASI',
      tgl_permohonan: new Date().toISOString().split('T')[0]
    };

    setRequests([newReq, ...requests]);
    setIsModalOpen(false);
    toast.success(`Permohonan pelepasan informasi [${newReq.no_permohonan}] berhasil didaftarkan.`);

    // Reset Form
    setSelectedPatientId('');
    setNamaPemohon('');
    setNikPemohon('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileBadge className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Pelepasan Informasi Medis & Visum (PMK 24/2022)
          </h1>
          <p className="text-slate-500 text-sm">
            Kepatuhan hukum kerahasiaan rekam medis, persetujuan pelepasan isi rekam medis, asuransi & visum et repertum
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Permohonan Pelepasan Baru</span>
          </button>
        </div>
      </div>

      {/* STATS METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Menunggu Verifikasi Legal</span>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {waitingCount}
          </div>
          <span className="text-[11px] text-amber-500 font-medium">Perlu validasi surat kuasa / identitas</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Disetujui Komite Medik</span>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {approvedCount}
          </div>
          <span className="text-[11px] text-blue-500 font-medium">Siap dicetak & diserahkan</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Telah Diserahkan Resmi</span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {deliveredCount}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">Berita acara penyerahan lengkap</span>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari No. Permohonan, No. RM, Pemohon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['SEMUA', 'MENUNGGU_VERIFIKASI', 'DISETUJUI', 'DISERAHKAN'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st === 'SEMUA' ? 'Semua' : st === 'MENUNGGU_VERIFIKASI' ? 'Menunggu' : st === 'DISETUJUI' ? 'Disetujui' : 'Diserahkan'}
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
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">No. Permohonan & RM</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Pasien Terkait</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Pihak Pemohon</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase">Dokumen & Tujuan</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Berkas Hukum</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Status</th>
                <th className="p-3.5 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-xs block">
                      {item.no_permohonan}
                    </span>
                    <span className="font-mono font-extrabold text-blue-600 dark:text-blue-300 text-sm">
                      {item.no_rm}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.tgl_permohonan}</span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {item.nama_pasien}
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs block">
                      {item.nama_pemohon}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Hubungan: {item.hubungan}
                    </span>
                    <span className="inline-block px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-[10px] font-bold mt-1">
                      {item.kategori_pemohon}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 block">
                      📄 {item.dokumen_diminta}
                    </span>
                    <span className="text-[11px] text-slate-500 block italic mt-0.5">
                      Keperluan: {item.tujuan_keperluan}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex flex-col items-center gap-1 text-[11px]">
                      <span className={item.ktp_terlampir ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {item.ktp_terlampir ? '✓ KTP Pemohon' : '-'}
                      </span>
                      <span className={item.surat_kuasa_terlampir ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {item.surat_kuasa_terlampir ? '✓ Surat Kuasa' : '-'}
                      </span>
                      {item.surat_tugas_penyidik && (
                        <span className="text-blue-600 font-bold">✓ Sprin Penyidik</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    {item.status === 'MENUNGGU_VERIFIKASI' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                        Menunggu Verifikasi
                      </span>
                    )}
                    {item.status === 'DISETUJUI' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                        Disetujui
                      </span>
                    )}
                    {item.status === 'DISERAHKAN' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                        Telah Diserahkan
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {item.status === 'MENUNGGU_VERIFIKASI' && (
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs"
                          title="Verifikasi & Setujui Pelepasan"
                        >
                          Setujui
                        </button>
                      )}
                      {item.status === 'DISETUJUI' && (
                        <button
                          onClick={() => handleDeliver(item.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs"
                          title="Serahkan Berkas Resmi"
                        >
                          Serahkan
                        </button>
                      )}
                      <PrintPDFButton
                        filename={`Pelepasan_${item.no_permohonan}`}
                        label="🖨️ Cetak Surat"
                        className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-1 rounded-lg font-bold"
                        documentData={item}
                        docType="pelepasan_informasi"
                        title="SURAT KETERANGAN PELEPASAN INFORMASI MEDIS"
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ada data permohonan pelepasan informasi medis.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PERMOHONAN BARU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-amber-600" />
                Permohonan Pelepasan Informasi Medis
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              {/* PASIEN */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pilih Pasien Yang Dimohonkan *
                </label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold"
                >
                  <option value="">-- Pilih Pasien Rekam Medis --</option>
                  {(pasien || []).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.no_rm} — {p.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* KATEGORI & NAMA PEMOHON */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kategori Pihak Pemohon *
                  </label>
                  <select
                    value={kategori}
                    onChange={(e: any) => setKategori(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="PASIEN">Pasien Sendiri</option>
                    <option value="KELUARGA_AHLI_WARIS">Keluarga / Ahli Waris Sah</option>
                    <option value="ASURANSI">Perusahaan Asuransi</option>
                    <option value="BPJS">BPJS Kesehatan / Ketenagakerjaan</option>
                    <option value="KEPOLISIAN_VISUM">Penyidik Kepolisian (Visum)</option>
                    <option value="PENGADILAN">Penetapan Pengadilan</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Lengkap Pemohon / Instansi *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama pemohon..."
                    value={namaPemohon}
                    onChange={(e) => setNamaPemohon(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* NIK & HUBUNGAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    NIK Pemohon / No. Identitas
                  </label>
                  <input
                    type="text"
                    placeholder="NIK KTP..."
                    value={nikPemohon}
                    onChange={(e) => setNikPemohon(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Hubungan dengan Pasien
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Suami / Anak Kandung / Kuasa Hukum"
                    value={hubungan}
                    onChange={(e) => setHubungan(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* DOKUMEN & KEPERLUAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Dokumen Medis Yang Diminta
                  </label>
                  <select
                    value={dokumen}
                    onChange={(e) => setDokumen(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Resume Medis (Ringkasan Pulang)">Resume Medis (Ringkasan Pulang)</option>
                    <option value="Hasil Laboratorium / Patologi">Hasil Laboratorium / Patologi</option>
                    <option value="Hasil Radiologi / Rontgen / CT-Scan">Hasil Radiologi / Rontgen / CT-Scan</option>
                    <option value="Visum et Repertum (Luka/Kekerasan)">Visum et Repertum (Luka/Kekerasan)</option>
                    <option value="Salinan Seluruh Rekam Medis (Penetapan Hakim)">Salinan Seluruh Rekam Medis (Penetapan Hakim)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tujuan & Keperluan Pelepasan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Klaim Asuransi Swasta, Rujukan, dll"
                    value={keperluan}
                    onChange={(e) => setKeperluan(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* CHECKLIST SYARAT HUKUM */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">
                  Verifikasi Kelengkapan Dokumen Hukum:
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ktp}
                    onChange={(e) => setKtp(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Fotokopi KTP Pemohon & KTP Pasien terlampir dan sah</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={suratKuasa}
                    onChange={(e) => setSuratKuasa(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Surat Kuasa Bermaterai Rp 10.000 asli (Wajib jika dikuasakan ke pihak ketiga)</span>
                </label>
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
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Daftarkan Permohonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
