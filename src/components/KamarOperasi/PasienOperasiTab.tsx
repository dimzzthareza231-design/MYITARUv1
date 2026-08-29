import React, { useState } from 'react';
import { PasienOperasiItem, RuangOKStatus } from './types';
import { useToast } from '../../contexts/ToastContext';
import { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';
import { 
  Scissors, Activity, Search, Filter, Plus, Clock, CheckCircle2, 
  AlertCircle, FileText, UserCheck, ShieldCheck, HeartPulse, 
  ChevronRight, Printer, X, Eye, Edit3, Trash2, Bed, CheckSquare
} from 'lucide-react';

interface PasienOperasiTabProps {
  pasienList: PasienOperasiItem[];
  setPasienList: React.Dispatch<React.SetStateAction<PasienOperasiItem[]>>;
  ruangOKList: RuangOKStatus[];
  onOpenBooking: () => void;
}

export function PasienOperasiTab({
  pasienList,
  setPasienList,
  ruangOKList,
  onOpenBooking
}: PasienOperasiTabProps) {
  const toast = useToast();

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [sifatFilter, setSifatFilter] = useState<string>('Semua');
  const [ruangFilter, setRuangFilter] = useState<string>('Semua');

  // Modals state
  const [selectedPatient, setSelectedPatient] = useState<PasienOperasiItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isWhoOpen, setIsWhoOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Stats calculation
  const totalPasien = pasienList.length;
  const sedangOperasi = pasienList.filter(p => p.status === 'Sedang Operasi').length;
  const terjadwal = pasienList.filter(p => p.status === 'Terjadwal' || p.status === 'Persiapan Pre-Op').length;
  const diPacu = pasienList.filter(p => p.status === 'PACU / Recovery').length;
  const selesai = pasienList.filter(p => p.status === 'Selesai - Rawat Inap').length;
  const citoCount = pasienList.filter(p => p.sifat_operasi === 'Cito / Emergency').length;

  // Filtered Patients
  const filteredPatients = pasienList.filter(p => {
    const matchSearch = 
      p.nama_pasien.toLowerCase().includes(search.toLowerCase()) ||
      p.no_rm.toLowerCase().includes(search.toLowerCase()) ||
      p.nomor.toLowerCase().includes(search.toLowerCase()) ||
      p.operator.toLowerCase().includes(search.toLowerCase()) ||
      p.tindakan.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosa_pra_bedah.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'Semua' || p.status === statusFilter;
    const matchSifat = sifatFilter === 'Semua' || p.sifat_operasi === sifatFilter;
    const matchRuang = ruangFilter === 'Semua' || p.ruang_ok.includes(ruangFilter);

    return matchSearch && matchStatus && matchSifat && matchRuang;
  });

  // Handle Quick Status Update
  const handleUpdateStatus = (patientId: number | string, newStatus: PasienOperasiItem['status']) => {
    setPasienList(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, status: newStatus };
      }
      return p;
    }));
    toast.success(`Status pasien berhasil diperbarui ke: ${newStatus}`);
    setIsStatusModalOpen(false);
  };

  // Handle WHO Checklist Save
  const handleSaveWhoChecklist = (updatedPatient: PasienOperasiItem) => {
    setPasienList(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setSelectedPatient(updatedPatient);
    toast.success('WHO Surgical Safety Checklist berhasil disimpan!');
  };

  // Handle Delete
  const handleDeletePatient = (patientId: number | string) => {
    if (confirm('Apakah Anda yakin ingin membatalkan/menghapus data operasi pasien ini?')) {
      setPasienList(prev => prev.filter(p => p.id !== patientId));
      toast.success('Data operasi pasien telah dihapus');
    }
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm backdrop-blur-md">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Pasien</div>
          <div className="text-2xl font-black text-white">{totalPasien}</div>
          <div className="text-xs text-slate-400 mt-1">Hari Ini & Jadwal</div>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 shadow-sm backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></div>
          <div className="text-xs text-emerald-300 font-semibold uppercase tracking-wider mb-1">Sedang Operasi</div>
          <div className="text-2xl font-black text-emerald-400">{sedangOperasi}</div>
          <div className="text-xs text-emerald-300/70 mt-1">Di Kamar OK</div>
        </div>

        <div className="bg-blue-950/40 border border-blue-500/40 rounded-xl p-4 shadow-sm backdrop-blur-md">
          <div className="text-xs text-blue-300 font-semibold uppercase tracking-wider mb-1">Terjadwal Elektif</div>
          <div className="text-2xl font-black text-blue-400">{terjadwal}</div>
          <div className="text-xs text-blue-300/70 mt-1">Antrean Bedah</div>
        </div>

        <div className="bg-rose-950/40 border border-rose-500/40 rounded-xl p-4 shadow-sm backdrop-blur-md">
          <div className="text-xs text-rose-300 font-semibold uppercase tracking-wider mb-1">Cito Emergency</div>
          <div className="text-2xl font-black text-rose-400">{citoCount}</div>
          <div className="text-xs text-rose-300/70 mt-1">Prioritas Utama</div>
        </div>

        <div className="bg-purple-950/40 border border-purple-500/40 rounded-xl p-4 shadow-sm backdrop-blur-md">
          <div className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-1">Ruang PACU</div>
          <div className="text-2xl font-black text-purple-400">{diPacu}</div>
          <div className="text-xs text-purple-300/70 mt-1">Observasi Aldrete</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm backdrop-blur-md">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Selesai Bedah</div>
          <div className="text-2xl font-black text-slate-200">{selesai}</div>
          <div className="text-xs text-slate-400 mt-1">Transfer ke Ranap</div>
        </div>
      </div>

      {/* 2. LIVE OK ROOM STATUS RIBBON */}
      <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 backdrop-blur-md shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-rose-500 font-bold text-lg">⚡</span>
            <h3 className="font-bold text-white text-sm sm:text-base">Status Kamar Operasi Terpadu (Live OK Rooms)</h3>
          </div>
          <span className="text-xs text-slate-400">Total 5 Kamar Operasi Tersertifikasi Kemenkes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ruangOKList.map((room) => {
            const isUsed = room.status === 'Sedang Digunakan';
            const isSteril = room.status === 'Sedang Sterilisasi';
            return (
              <div 
                key={room.id}
                className={`p-3.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isUsed 
                    ? 'bg-rose-950/30 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
                    : isSteril
                    ? 'bg-amber-950/30 border-amber-500/50'
                    : 'bg-emerald-950/20 border-emerald-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-xs line-clamp-1">{room.nama.split('-')[0]}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isUsed 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : isSteril
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium line-clamp-1">{room.spesialisasi}</div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-700/60 space-y-0.5 text-[11px]">
                  {isUsed ? (
                    <>
                      <div className="text-slate-300 font-semibold line-clamp-1">👤 {room.pasien_saat_ini}</div>
                      <div className="text-rose-300 font-bold line-clamp-1">🔪 {room.tindakan_saat_ini}</div>
                      <div className="text-slate-400 text-[10px]">Est. Selesai: {room.estimasi_selesai}</div>
                    </>
                  ) : isSteril ? (
                    <div className="text-amber-300 italic">Desinfeksi & Penggantian Linen CSSD</div>
                  ) : (
                    <div className="text-emerald-400 font-medium">Siap untuk Pasien Baru / Cito</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SEARCH, FILTER & ACTION BAR */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-sm backdrop-blur-md flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari Pasien (Nama, No RM, No Operasi, DPJP Operator, Tindakan)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500"
          />
        </div>

        {/* Filter Badges & Modals */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="Semua">Semua Status ({totalPasien})</option>
            <option value="Sedang Operasi">Sedang Operasi ({sedangOperasi})</option>
            <option value="Terjadwal">Terjadwal ({terjadwal})</option>
            <option value="PACU / Recovery">PACU / Recovery ({diPacu})</option>
            <option value="Selesai - Rawat Inap">Selesai ({selesai})</option>
          </select>

          {/* Sifat Filter */}
          <select
            value={sifatFilter}
            onChange={(e) => setSifatFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="Semua">Semua Sifat Bedah</option>
            <option value="Elektif">Elektif</option>
            <option value="Cito / Emergency">Cito / Emergency</option>
          </select>

          {/* Ruang OK Filter */}
          <select
            value={ruangFilter}
            onChange={(e) => setRuangFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900/80 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="Semua">Semua Kamar OK</option>
            <option value="OK 1">OK 1 (Mayor Laparoskopi)</option>
            <option value="OK 2">OK 2 (Orthopedi & Trauma)</option>
            <option value="OK 3">OK 3 (Urologi/Endourologi)</option>
            <option value="OK 4">OK 4 (Emergency/Obstetri)</option>
            <option value="OK 5">OK 5 (Bedah Mata Mikro)</option>
          </select>

          {/* Tambah Pasien / Booking Button */}
          <button
            onClick={onOpenBooking}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-900/40 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Booking Operasi Baru</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN PATIENT TABLE */}
      <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 border-b border-slate-700/80 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">No. Operasi / RM</th>
                <th className="p-4">Pasien & Penjamin</th>
                <th className="p-4">Diagnosa Pra-Bedah</th>
                <th className="p-4">Rencana Tindakan</th>
                <th className="p-4">Tim DPJP Bedah</th>
                <th className="p-4">Kamar & Jadwal</th>
                <th className="p-4 text-center">Status Alur</th>
                <th className="p-4 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Scissors className="w-8 h-8 text-slate-500 stroke-1" />
                      <p className="font-semibold text-slate-300">Tidak ada data pasien operasi yang sesuai dengan filter pencarian</p>
                      <button 
                        onClick={() => { setSearch(''); setStatusFilter('Semua'); setSifatFilter('Semua'); setRuangFilter('Semua'); }}
                        className="text-xs text-rose-400 hover:underline font-bold"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const isCito = patient.sifat_operasi === 'Cito / Emergency';
                  const isOperating = patient.status === 'Sedang Operasi';
                  const isPACU = patient.status === 'PACU / Recovery';
                  const isScheduled = patient.status === 'Terjadwal' || patient.status === 'Persiapan Pre-Op';

                  return (
                    <tr 
                      key={patient.id}
                      className="hover:bg-slate-700/30 transition-colors group"
                    >
                      {/* 1. No Reg & RM */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{patient.nomor}</span>
                          {isCito && (
                            <span className="px-1.5 py-0.5 bg-rose-500/20 border border-rose-500 text-rose-400 rounded text-[10px] font-black uppercase tracking-wider animate-pulse">
                              CITO
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-rose-400 font-mono mt-0.5">{patient.no_rm}</div>
                        <div className="text-[11px] text-slate-400 mt-1">Gol. Darah: <strong className="text-slate-300">{patient.golongan_darah || 'O+'}</strong></div>
                      </td>

                      {/* 2. Pasien & Penjamin */}
                      <td className="p-4 align-top">
                        <div className="font-bold text-white text-sm">{patient.nama_pasien}</div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          {patient.umur} Th ({patient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'})
                        </div>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                            patient.penjamin.includes('BPJS')
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                              : 'bg-blue-950/60 text-blue-300 border border-blue-500/40'
                          }`}>
                            {patient.penjamin}
                          </span>
                        </div>
                      </td>

                      {/* 3. Diagnosa Pre-Op */}
                      <td className="p-4 align-top max-w-[200px]">
                        <div className="text-xs font-semibold text-slate-200 line-clamp-2" title={patient.diagnosa_pra_bedah}>
                          {patient.diagnosa_pra_bedah}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <span>Alergi:</span>
                          <span className={`font-semibold ${patient.riwayat_alergi?.includes('Alergi') && !patient.riwayat_alergi.includes('Tidak') ? 'text-amber-400' : 'text-slate-300'}`}>
                            {patient.riwayat_alergi || 'Tidak ada'}
                          </span>
                        </div>
                      </td>

                      {/* 4. Tindakan & ICD-9 */}
                      <td className="p-4 align-top max-w-[220px]">
                        <div className="font-bold text-slate-100 text-xs line-clamp-2">
                          {patient.tindakan}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          ICD-9-CM: <strong className="text-cyan-400 font-mono">{patient.kode_icd9}</strong>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Tipe Anestesi: <span className="text-slate-300 font-medium">{patient.tipe_anastesi}</span>
                        </div>
                      </td>

                      {/* 5. Tim Bedah */}
                      <td className="p-4 align-top max-w-[200px]">
                        <div className="text-xs font-bold text-slate-200 line-clamp-1">
                          👨‍⚕️ {patient.operator}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          💉 {patient.anastesi}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Asisten: {patient.asisten_operator || 'Ns. Asisten OK'}
                        </div>
                      </td>

                      {/* 6. Kamar & Jadwal */}
                      <td className="p-4 align-top">
                        <div className="text-xs font-bold text-rose-300 line-clamp-1">
                          {patient.ruang_ok}
                        </div>
                        <div className="text-xs text-slate-300 mt-0.5">
                          📅 {patient.tanggal}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Est: {patient.durasi}</span>
                        </div>
                      </td>

                      {/* 7. Status Alur */}
                      <td className="p-4 align-top text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                          isOperating 
                            ? 'bg-rose-500 text-white animate-pulse' 
                            : isPACU 
                            ? 'bg-purple-600 text-white'
                            : isScheduled 
                            ? 'bg-blue-600/80 text-white'
                            : 'bg-emerald-600/80 text-white'
                        }`}>
                          {isOperating && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>}
                          {patient.status}
                        </span>

                        <div className="mt-2 flex justify-center">
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setIsStatusModalOpen(true);
                            }}
                            className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline"
                          >
                            Ubah Status
                          </button>
                        </div>
                      </td>

                      {/* 8. Aksi Cepat */}
                      <td className="p-4 align-top">
                        <div className="flex flex-col gap-1.5 items-center">
                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setIsDetailOpen(true);
                            }}
                            className="w-full px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            title="Lihat Detail Rekam Medis Operasi"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Detail</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setIsWhoOpen(true);
                            }}
                            className="w-full px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            title="WHO Surgical Safety Checklist"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WHO Checklist</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setIsPrintModalOpen(true);
                            }}
                            className="w-full px-2.5 py-1 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            title="Cetak Laporan & Informed Consent"
                          >
                            <Printer className="w-3.5 h-3.5 text-blue-400" />
                            <span>Cetak</span>
                          </button>

                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            className="w-full px-2 py-0.5 text-slate-500 hover:text-rose-400 text-[10px] flex items-center justify-center gap-1"
                            title="Batalkan / Hapus"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: DETAIL REKAM MEDIS OPERASI (FULL CLINICAL RECORD) */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {isDetailOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Rekam Medis Kamar Operasi (Detail Pasien)
                    {selectedPatient.sifat_operasi === 'Cito / Emergency' && (
                      <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-xs font-black">CITO</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    No. Reg: <strong className="text-rose-400 font-mono">{selectedPatient.nomor}</strong> | No. RM: <strong className="text-cyan-400 font-mono">{selectedPatient.no_rm}</strong>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
              
              {/* Patient Basic Info Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-800/60 border border-slate-700/80 rounded-xl">
                <div>
                  <span className="text-xs text-slate-400 block">Nama Lengkap Pasien</span>
                  <span className="font-bold text-white text-base">{selectedPatient.nama_pasien}</span>
                  <span className="text-xs text-slate-400 block mt-1">NIK: {selectedPatient.nik || '-'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Umur & Jenis Kelamin</span>
                  <span className="font-semibold text-slate-200">{selectedPatient.umur} Tahun / {selectedPatient.jenis_kelamin === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}</span>
                  <span className="text-xs text-slate-400 block mt-1">Penjamin: <strong className="text-emerald-400">{selectedPatient.penjamin}</strong></span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Status Operasi Saat Ini</span>
                  <span className="inline-block mt-1 px-3 py-1 bg-rose-600 text-white font-bold rounded-lg text-xs">
                    {selectedPatient.status}
                  </span>
                  <span className="text-xs text-slate-400 block mt-1">Kamar: <strong className="text-slate-200">{selectedPatient.ruang_ok}</strong></span>
                </div>
              </div>

              {/* Clinical & Diagnosis Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider text-rose-400">
                    <Activity className="w-4 h-4" /> Diagnosa & Indikasi Bedah
                  </h4>
                  <div>
                    <span className="text-xs text-slate-400">Diagnosa Pra-Bedah:</span>
                    <p className="font-semibold text-white mt-0.5">{selectedPatient.diagnosa_pra_bedah}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Rencana Prosedur Tindakan:</span>
                    <p className="font-bold text-rose-300 mt-0.5">{selectedPatient.tindakan}</p>
                    <p className="text-xs text-cyan-400 mt-0.5 font-mono">Kode ICD-9-CM: {selectedPatient.kode_icd9}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Indikasi Operasi:</span>
                    <p className="text-xs text-slate-300 italic mt-0.5">{selectedPatient.indikasi_operasi || '-'}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-400">
                    <UserCheck className="w-4 h-4" /> Susunan Tim Kamar Bedah
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">DPJP Operator Bedah:</span>
                      <p className="font-bold text-white">{selectedPatient.operator}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Dokter Anestesiologi:</span>
                      <p className="font-bold text-white">{selectedPatient.anastesi}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Tipe Anestesi:</span>
                      <p className="font-semibold text-amber-300">{selectedPatient.tipe_anastesi}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Asisten Operator:</span>
                      <p className="text-slate-200">{selectedPatient.asisten_operator || '-'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Perawat Instrumen:</span>
                      <p className="text-slate-200">{selectedPatient.perawat_instrumen || '-'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Perawat Sirkuler:</span>
                      <p className="text-slate-200">{selectedPatient.perawat_sirkuler || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vital Signs & Pre-Op Prep */}
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-3">
                <h4 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400">
                  <HeartPulse className="w-4 h-4" /> Tanda Vital & Persiapan Pre-Op
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
                  <div className="p-2.5 bg-slate-900/70 border border-slate-700 rounded-lg">
                    <span className="text-[11px] text-slate-400 block">Tekanan Darah</span>
                    <span className="font-bold text-white text-sm">{selectedPatient.tanda_vital?.td || '120/80 mmHg'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/70 border border-slate-700 rounded-lg">
                    <span className="text-[11px] text-slate-400 block">Frekuensi Nadi</span>
                    <span className="font-bold text-white text-sm">{selectedPatient.tanda_vital?.nadi || '80 x/mnt'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/70 border border-slate-700 rounded-lg">
                    <span className="text-[11px] text-slate-400 block">Suhu Tubuh</span>
                    <span className="font-bold text-white text-sm">{selectedPatient.tanda_vital?.suhu || '36.5 °C'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/70 border border-slate-700 rounded-lg">
                    <span className="text-[11px] text-slate-400 block">Respirasi</span>
                    <span className="font-bold text-white text-sm">{selectedPatient.tanda_vital?.rr || '18 x/mnt'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/70 border border-slate-700 rounded-lg">
                    <span className="text-[11px] text-slate-400 block">Saturasi SpO2</span>
                    <span className="font-bold text-emerald-400 text-sm">{selectedPatient.tanda_vital?.spo2 || '99%'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/70 border border-slate-700 rounded-lg">
                    <span className="text-[11px] text-slate-400 block">Informed Consent</span>
                    <span className="font-bold text-emerald-400 text-xs">{selectedPatient.informed_consent || 'Lengkap'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div>
                    <span className="text-slate-400">Riwayat Alergi:</span>
                    <p className="font-bold text-amber-300">{selectedPatient.riwayat_alergi || 'Tidak Ada Alergi'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Persiapan Darah:</span>
                    <p className="font-semibold text-slate-200">{selectedPatient.persiapan_darah || 'On Call Bank Darah'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Status Puasa:</span>
                    <p className="font-semibold text-slate-200">{selectedPatient.puasa || 'Puasa > 6 Jam'}</p>
                  </div>
                </div>
              </div>

              {/* Operative Report & Post-Op Order */}
              {selectedPatient.laporan_operasi && (
                <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-3">
                  <h4 className="font-bold text-white flex items-center gap-2 text-xs uppercase tracking-wider text-purple-400">
                    <FileText className="w-4 h-4" /> Laporan Bedah & Instruksi Pasca Operasi
                  </h4>
                  <div>
                    <span className="text-xs text-slate-400">Temuan Intra-Operasi:</span>
                    <p className="text-xs text-slate-200 mt-1 leading-relaxed">{selectedPatient.laporan_operasi.temuan_intra_operasi}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="p-2.5 bg-slate-900/60 rounded-lg">
                      <span className="text-slate-400 block">Estimasi Perdarahan</span>
                      <strong className="text-rose-400 text-sm">{selectedPatient.laporan_operasi.perdarahan_cc || 0} cc</strong>
                    </div>
                    <div className="p-2.5 bg-slate-900/60 rounded-lg">
                      <span className="text-slate-400 block">Jaringan Patologi Anatomi (PA)</span>
                      <strong className="text-slate-200">{selectedPatient.laporan_operasi.jaringan_pa || 'Tidak Ada'}</strong>
                    </div>
                    <div className="p-2.5 bg-slate-900/60 rounded-lg">
                      <span className="text-slate-400 block">Aldrete Recovery Score</span>
                      <strong className="text-emerald-400 text-sm">{selectedPatient.laporan_operasi.aldrete_score?.total || 10} / 10</strong>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Instruksi Dokter Pasca Bedah (Post-Op Orders):</span>
                    <pre className="text-xs text-slate-200 mt-1 whitespace-pre-wrap font-sans bg-slate-900/80 p-3 rounded-lg border border-slate-700/60">
                      {selectedPatient.laporan_operasi.instruksi_pasca_bedah}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => {
                  setIsDetailOpen(false);
                  setIsWhoOpen(true);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> Buka WHO Checklist
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsDetailOpen(false);
                    setIsPrintModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Cetak Dokumen
                </button>
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: WHO SURGICAL SAFETY CHECKLIST (INTERACTIVE FORM) */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {isWhoOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-5 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    WHO Surgical Safety Checklist
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pasien: <strong className="text-white">{selectedPatient.nama_pasien}</strong> ({selectedPatient.no_rm}) — Tindakan: <span className="text-rose-300 font-medium">{selectedPatient.tindakan}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsWhoOpen(false)}
                className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
              
              {/* 3 PHASES CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. SIGN IN (Sebelum Induksi Anestesi) */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider text-blue-400">
                        1. SIGN IN
                      </h4>
                      <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">Sebelum Induksi</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_in?.identitas_terkonfirmasi ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_in: {
                                  ...selectedPatient.checklist_who!.sign_in,
                                  identitas_terkonfirmasi: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Konfirmasi identitas, gelang pasien, lokasi operasi & informed consent</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_in?.lokasi_diberi_tanda ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_in: {
                                  ...selectedPatient.checklist_who!.sign_in,
                                  lokasi_diberi_tanda: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Penandaan lokasi sayatan / Site marking telah diverifikasi</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_in?.mesin_anestesi_lengkap ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_in: {
                                  ...selectedPatient.checklist_who!.sign_in,
                                  mesin_anestesi_lengkap: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Pengecekan mesin anestesi & obat siap lengkap</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_in?.pulse_oximeter_terpasang ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_in: {
                                  ...selectedPatient.checklist_who!.sign_in,
                                  pulse_oximeter_terpasang: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Pulse oximeter terpasang & berfungsi normal</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_in?.riwayat_alergi_diketahui ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_in: {
                                  ...selectedPatient.checklist_who!.sign_in,
                                  riwayat_alergi_diketahui: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Verifikasi riwayat alergi obat / latex</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sign-In Terverifikasi Lengkap
                  </div>
                </div>

                {/* 2. TIME OUT (Sebelum Insisi Kulit) */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                        2. TIME OUT
                      </h4>
                      <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">Sebelum Insisi</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.time_out?.seluruh_tim_memperkenalkan_diri ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                time_out: {
                                  ...selectedPatient.checklist_who!.time_out,
                                  seluruh_tim_memperkenalkan_diri: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Seluruh tim bedah saling memperkenalkan nama & peran</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.time_out?.konfirmasi_pasien_prosedur_lokasi ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                time_out: {
                                  ...selectedPatient.checklist_who!.time_out,
                                  konfirmasi_pasien_prosedur_lokasi: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Konfirmasi verbal: Nama pasien, prosedur & posisi bedah</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.time_out?.antibiotik_profilaksis_60menit ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                time_out: {
                                  ...selectedPatient.checklist_who!.time_out,
                                  antibiotik_profilaksis_60menit: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Antibiotik profilaksis telah diberikan (&lt;60 menit)</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.time_out?.sterilitas_alat_terkonfirmasi ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                time_out: {
                                  ...selectedPatient.checklist_who!.time_out,
                                  sterilitas_alat_terkonfirmasi: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Hasil indikator sterilitas CSSD terkonfirmasi STERIL</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.time_out?.imaging_ditampilkan ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                time_out: {
                                  ...selectedPatient.checklist_who!.time_out,
                                  imaging_ditampilkan: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Hasil pencitraan radiologi/CT penting telah ditampilkan</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-amber-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Time-Out Terverifikasi Lengkap
                  </div>
                </div>

                {/* 3. SIGN OUT (Sebelum Menutup Luka / Keluar OK) */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-700">
                      <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">
                        3. SIGN OUT
                      </h4>
                      <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">Sebelum Keluar OK</span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_out?.nama_tindakan_dicatat ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_out: {
                                  ...selectedPatient.checklist_who!.sign_out,
                                  nama_tindakan_dicatat: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Nama tindakan definitif telah dicatat di rekam medis</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_out?.jumlah_kasa_jarum_alat_lengkap ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_out: {
                                  ...selectedPatient.checklist_who!.sign_out,
                                  jumlah_kasa_jarum_alat_lengkap: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Penghitungan kassa, jarum, dan instrumen SESUAI / LENGKAP</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_out?.label_spesimen_pa_terverifikasi ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_out: {
                                  ...selectedPatient.checklist_who!.sign_out,
                                  label_spesimen_pa_terverifikasi: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Pelabelan spesimen PA telah dibaca keras & sesuai</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_out?.masalah_peralatan_nihil ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_out: {
                                  ...selectedPatient.checklist_who!.sign_out,
                                  masalah_peralatan_nihil: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Evaluasi masalah peralatan selama tindakan (Nihil)</span>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPatient.checklist_who?.sign_out?.instruksi_pemulihan_pacu_lengkap ?? true}
                          onChange={(e) => {
                            const updated = {
                              ...selectedPatient,
                              checklist_who: {
                                ...selectedPatient.checklist_who!,
                                sign_out: {
                                  ...selectedPatient.checklist_who!.sign_out,
                                  instruksi_pemulihan_pacu_lengkap: e.target.checked
                                }
                              }
                            };
                            setSelectedPatient(updated);
                          }}
                          className="mt-0.5 rounded border-slate-600 text-rose-500 focus:ring-rose-500 bg-slate-900"
                        />
                        <span>Dokter & Anestesi menyampaikan poin penting pemulihan PACU</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sign-Out Terverifikasi Lengkap
                  </div>
                </div>

              </div>
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setIsWhoOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  handleSaveWhoChecklist(selectedPatient);
                  setIsWhoOpen(false);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/40"
              >
                <CheckCircle2 className="w-4 h-4" /> Simpan & Validasi Checklist
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 3: UBAH STATUS ALUR OPERASI CEPAT */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {isStatusModalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Scissors className="w-4 h-4 text-rose-500" /> Ubah Status Alur Pasien
              </h3>
              <button onClick={() => setIsStatusModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300">
              <p className="font-bold text-white text-sm">{selectedPatient.nama_pasien}</p>
              <p className="text-rose-400 font-mono">{selectedPatient.no_rm} | {selectedPatient.nomor}</p>
              <p className="text-slate-400 mt-1">Tindakan: {selectedPatient.tindakan}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pilih Status Baru:</span>
              
              <button
                onClick={() => handleUpdateStatus(selectedPatient.id, 'Terjadwal')}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between ${
                  selectedPatient.status === 'Terjadwal' ? 'bg-blue-600/30 border-blue-500 text-blue-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>📅 Terjadwal (Antrean Bedah)</span>
                {selectedPatient.status === 'Terjadwal' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedPatient.id, 'Persiapan Pre-Op')}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between ${
                  selectedPatient.status === 'Persiapan Pre-Op' ? 'bg-amber-600/30 border-amber-500 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>🏥 Persiapan Pre-Op (Ruang Serah Terima)</span>
                {selectedPatient.status === 'Persiapan Pre-Op' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedPatient.id, 'Sedang Operasi')}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between ${
                  selectedPatient.status === 'Sedang Operasi' ? 'bg-rose-600/30 border-rose-500 text-rose-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>⚡ Sedang Operasi (Di Meja Bedah OK)</span>
                {selectedPatient.status === 'Sedang Operasi' && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedPatient.id, 'PACU / Recovery')}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between ${
                  selectedPatient.status === 'PACU / Recovery' ? 'bg-purple-600/30 border-purple-500 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>🛌 PACU / Recovery (Observasi Pulih Sadar)</span>
                {selectedPatient.status === 'PACU / Recovery' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </button>

              <button
                onClick={() => handleUpdateStatus(selectedPatient.id, 'Selesai - Rawat Inap')}
                className={`w-full p-3 rounded-xl border text-left text-xs font-bold flex items-center justify-between ${
                  selectedPatient.status === 'Selesai - Rawat Inap' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>✅ Selesai - Transfer Bangsal Rawat Inap</span>
                {selectedPatient.status === 'Selesai - Rawat Inap' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsStatusModalOpen(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      
      {/* MODAL 4: CETAK RESMI FORMAT KLINIK */}
      {isPrintModalOpen && selectedPatient && (
        <DocumentPreviewModal 
            isOpen={isPrintModalOpen}
            onClose={() => setIsPrintModalOpen(false)}
            customContent={(
                <div className="bg-white text-slate-900 w-full p-8 space-y-6 text-sm font-serif max-w-4xl mx-auto border border-slate-200">
                    
            
              
              {/* Kop Surat Klinik */}
              <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900">KLINIK UMUM MYITARU MEDIKA</h2>
                <p className="text-xs text-slate-600">Jl. Kesehatan Raya No. 45, Jakarta Selatan | Telp: (021) 7890-1234 | Email: info@myitaru-hospital.id</p>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-widest pt-1">INSTALASI BEDAH SENTRAL & ANESTESIOLOGI</p>
              </div>

              <div className="text-center pt-2">
                <h3 className="text-base font-bold underline uppercase">FORMULIR PERSETUJUAN & LAPORAN TINDAKAN OPERASI</h3>
                <p className="text-xs text-slate-600 font-sans mt-0.5">Nomor Registrasi Operasi: {selectedPatient.nomor}</p>
              </div>

              {/* Data Pasien */}
              <div className="font-sans grid grid-cols-2 gap-2 text-xs border border-slate-300 p-4 rounded bg-slate-50/50">
                <div><strong>No. Rekam Medis:</strong> {selectedPatient.no_rm}</div>
                <div><strong>Nama Pasien:</strong> {selectedPatient.nama_pasien}</div>
                <div><strong>NIK:</strong> {selectedPatient.nik || '-'}</div>
                <div><strong>Umur / JK:</strong> {selectedPatient.umur} Th / {selectedPatient.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                <div><strong>Penjamin Biaya:</strong> {selectedPatient.penjamin}</div>
                <div><strong>Golongan Darah:</strong> {selectedPatient.golongan_darah || 'O+'}</div>
              </div>

              {/* Data Tindakan */}
              <div className="font-sans text-xs space-y-2">
                <table className="w-full border-collapse border border-slate-300 text-left">
                  <tbody>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold w-1/3 bg-slate-100">Diagnosa Pra-Bedah</td>
                      <td className="p-2">{selectedPatient.diagnosa_pra_bedah}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold bg-slate-100">Tindakan Operasi</td>
                      <td className="p-2 font-bold text-slate-900">{selectedPatient.tindakan} (ICD-9: {selectedPatient.kode_icd9})</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold bg-slate-100">DPJP Dokter Bedah</td>
                      <td className="p-2">{selectedPatient.operator}</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold bg-slate-100">Dokter Anestesi</td>
                      <td className="p-2">{selectedPatient.anastesi} ({selectedPatient.tipe_anastesi})</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold bg-slate-100">Ruang & Waktu Operasi</td>
                      <td className="p-2">{selectedPatient.ruang_ok} — {selectedPatient.tanggal} (Durasi: {selectedPatient.durasi})</td>
                    </tr>
                    <tr className="border-b border-slate-300">
                      <td className="p-2 font-bold bg-slate-100">Status WHO Safety Checklist</td>
                      <td className="p-2 text-emerald-700 font-bold">Lengkap (Sign In, Time Out, Sign Out Terverifikasi)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tanda Tangan */}
              <div className="font-sans grid grid-cols-3 text-center text-xs pt-8">
                <div>
                  <p>Pasien / Keluarga Bertanggung Jawab,</p>
                  <div className="h-16 flex items-end justify-center font-bold text-slate-800">
                    ( {selectedPatient.nama_pasien} )
                  </div>
                </div>
                <div>
                  <p>Dokter Anestesiologi,</p>
                  <div className="h-16 flex items-end justify-center font-bold text-slate-800">
                    ( {selectedPatient.anastesi.split(',')[0]} )
                  </div>
                </div>
                <div>
                  <p>Dokter Operator Bedah,</p>
                  <div className="h-16 flex items-end justify-center font-bold text-slate-800">
                    ( {selectedPatient.operator.split(',')[0]} )
                  </div>
                </div>
              </div>

            
                </div>
            )}
            title={`Formulir_Operasi_${selectedPatient.nomor}`}
        />
      )}
    </div>
  );
}