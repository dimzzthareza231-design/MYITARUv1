import React, { useState, useEffect } from 'react';
import { 
  UserPlus, CheckCircle2, Clock, AlertCircle, Search, Filter, 
  BedDouble, FileText, ArrowRight, Printer, ShieldCheck, Stethoscope, User
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface AntrianAdmisiItem {
  id: string;
  no_rm: string;
  nama: string;
  usia: number;
  gender: 'L' | 'P';
  unit_asal: 'IGD (Gawat Darurat)' | 'Poli Penyakit Dalam' | 'Poli Bedah' | 'Poli Jantung' | 'Poli Kebidanan';
  dokter_perujuk: string;
  diagnosa_masuk: string;
  kelas_diminta: 'Kelas 3' | 'Kelas 2' | 'Kelas 1' | 'VIP' | 'ICU';
  penjamin: string;
  no_spri: string;
  waktu_order: string;
  status: 'Menunggu Alokasi Bed' | 'Bed Terpilih' | 'Selesai Admisi';
  assigned_bed?: string;
  catatan_klinis?: string;
}

const INITIAL_ANTRIAN_ADMISI: AntrianAdmisiItem[] = [
  {
    id: 'ADM-001',
    no_rm: 'RM-260801-1001',
    nama: 'Budi Santoso',
    usia: 48,
    gender: 'L',
    unit_asal: 'IGD (Gawat Darurat)',
    dokter_perujuk: 'dr. Andi Pratama, Sp.PD',
    diagnosa_masuk: 'DHF Grade II & Dehidrasi Sedang',
    kelas_diminta: 'Kelas 2',
    penjamin: 'BPJS Kesehatan',
    no_spri: 'SPRI/2026/08/0012',
    waktu_order: '35 menit lalu',
    status: 'Menunggu Alokasi Bed',
    catatan_klinis: 'Perlu observasi cairan infus NaCl 0.9% 20 tpm, trombosit 85.000'
  },
  {
    id: 'ADM-002',
    no_rm: 'RM-260801-1002',
    nama: 'Siti Aminah',
    usia: 35,
    gender: 'P',
    unit_asal: 'Poli Kebidanan',
    dokter_perujuk: 'dr. Eka Putri, Sp.OG',
    diagnosa_masuk: 'G2P1A0 Gravida 38 Minggu Inpartu Kala I Fase Aktif',
    kelas_diminta: 'Kelas 1',
    penjamin: 'BPJS Kesehatan',
    no_spri: 'SPRI/2026/08/0013',
    waktu_order: '1 jam lalu',
    status: 'Menunggu Alokasi Bed',
    catatan_klinis: 'Observasi his dan DJJ setiap 30 menit, persiapkan partus set'
  },
  {
    id: 'ADM-003',
    no_rm: 'RM-260801-1003',
    nama: 'Ahmad Dahlan',
    usia: 62,
    gender: 'L',
    unit_asal: 'IGD (Gawat Darurat)',
    dokter_perujuk: 'dr. Citra Lestari, Sp.JP',
    diagnosa_masuk: 'UAP (Unstable Angina Pectoris) + Hipertensi Emergensi',
    kelas_diminta: 'ICU',
    penjamin: 'Asuransi Mandiri Inhealth',
    no_spri: 'SPRI/2026/08/0014',
    waktu_order: '15 menit lalu',
    status: 'Menunggu Alokasi Bed',
    catatan_klinis: 'Bed ICU dengan bedside monitor & oksigen sentral continuous'
  }
];

interface AdmisiRanapTabProps {
  beds: any[];
  onAssignBed?: (bedId: string, patientData: any) => void;
}

export function AdmisiRanapTab({ beds, onAssignBed }: AdmisiRanapTabProps) {
  const [antrianList, setAntrianList] = useState<AntrianAdmisiItem[]>(() => {
    const saved = localStorage.getItem('hospital_antrian_admisi_ranap');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
    return INITIAL_ANTRIAN_ADMISI;
  });

  useEffect(() => {
    localStorage.setItem('hospital_antrian_admisi_ranap', JSON.stringify(antrianList));
  }, [antrianList]);

  const [search, setSearch] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [selectedAdmisi, setSelectedAdmisi] = useState<AntrianAdmisiItem | null>(null);
  const [selectedBedId, setSelectedBedId] = useState('');
  const [isAlokasiModalOpen, setIsAlokasiModalOpen] = useState(false);

  // Available empty beds
  const availableBeds = beds.filter(b => b.status === 'Kosong');

  const filteredAntrian = antrianList.filter(item => {
    const matchSearch = 
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.no_rm.toLowerCase().includes(search.toLowerCase()) ||
      item.diagnosa_masuk.toLowerCase().includes(search.toLowerCase());
    const matchKelas = filterKelas === 'Semua' || item.kelas_diminta === filterKelas;
    return matchSearch && matchKelas;
  });

  const handleOpenAlokasi = (item: AntrianAdmisiItem) => {
    setSelectedAdmisi(item);
    const matched = availableBeds.find(b => (b.class || b.kelas) === item.kelas_diminta);
    setSelectedBedId(matched ? matched.id : (availableBeds[0]?.id || ''));
    setIsAlokasiModalOpen(true);
  };

  const handleKonfirmasiAlokasi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmisi || !selectedBedId) {
      toast.error('Pilih tempat tidur yang tersedia terlebih dahulu');
      return;
    }

    const chosenBed = beds.find(b => b.id === selectedBedId);

    // Call parent handler to update bed state if provided
    if (onAssignBed) {
      onAssignBed(selectedBedId, {
        patient: selectedAdmisi.nama,
        no_rm: selectedAdmisi.no_rm,
        diagnosa: selectedAdmisi.diagnosa_masuk,
        doctor: selectedAdmisi.dokter_perujuk,
        penjamin: selectedAdmisi.penjamin,
        masuk: new Date().toISOString().split('T')[0]
      });
    }

    // Update internal queue
    setAntrianList(prev => prev.map(item => {
      if (item.id === selectedAdmisi.id) {
        return {
          ...item,
          status: 'Selesai Admisi',
          assigned_bed: `${chosenBed?.room || 'Bangsal'} - Bed ${selectedBedId}`
        };
      }
      return item;
    }));

    toast.success(`Pasien ${selectedAdmisi.nama} berhasil dialokasikan ke Bed ${selectedBedId} (${chosenBed?.room || ''})`);
    setIsAlokasiModalOpen(false);
    setSelectedAdmisi(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Admisi Rawat Inap &amp; Antrian Alokasi Bed
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Verifikasi Surat Perintah Rawat Inap (SPRI), penempatan tempat tidur bangsal dari IGD &amp; Poliklinik, dan aktivasi jaminan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            {antrianList.filter(a => a.status === 'Menunggu Alokasi Bed').length} Pasien Menunggu Bed
          </span>
          <span className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <BedDouble className="w-4 h-4 text-emerald-500" />
            {availableBeds.length} Bed Ready
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari pasien admisi berdasarkan No. RM, Nama, atau Diagnosa..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select 
            value={filterKelas}
            onChange={e => setFilterKelas(e.target.value)}
            className="text-xs py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Semua">Semua Permintaan Kelas</option>
            <option value="Kelas 3">Kelas 3</option>
            <option value="Kelas 2">Kelas 2</option>
            <option value="Kelas 1">Kelas 1</option>
            <option value="VIP">VIP</option>
            <option value="ICU">ICU</option>
          </select>
        </div>
      </div>

      {/* Grid of Admission Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAntrian.map(item => (
          <div 
            key={item.id} 
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  {item.unit_asal}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                  item.status === 'Selesai Admisi'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                }`}>
                  {item.status}
                </span>
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-base">{item.nama}</h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{item.no_rm}</span>
                <span>•</span>
                <span>{item.gender === 'L' ? 'Laki-laki' : 'Perempuan'}, {item.usia} Th</span>
                <span>•</span>
                <span className="text-slate-600 dark:text-slate-300 font-semibold">{item.penjamin}</span>
              </div>

              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
                <div className="text-slate-700 dark:text-slate-300">
                  <span className="text-slate-400 block text-[10px] font-semibold uppercase">Diagnosa Masuk:</span>
                  <strong className="text-rose-600 dark:text-rose-400 font-bold">{item.diagnosa_masuk}</strong>
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>DPJP Perujuk: <strong>{item.dokter_perujuk}</strong></span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <span>Permintaan: <strong className="text-indigo-600 dark:text-indigo-400">{item.kelas_diminta}</strong> ({item.no_spri})</span>
                </div>
                {item.catatan_klinis && (
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 italic pt-1">
                    "{item.catatan_klinis}"
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              {item.status === 'Selesai Admisi' ? (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{item.assigned_bed}</span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">Order: {item.waktu_order}</span>
              )}

              {item.status !== 'Selesai Admisi' && (
                <button
                  onClick={() => handleOpenAlokasi(item)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <BedDouble className="w-3.5 h-3.5" /> Alokasikan Bed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Alokasi Bed */}
      {isAlokasiModalOpen && selectedAdmisi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-indigo-600" />
                Alokasi Tempat Tidur Pasien
              </h3>
              <button 
                onClick={() => setIsAlokasiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Nama Pasien:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAdmisi.nama} ({selectedAdmisi.no_rm})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diagnosa Masuk:</span>
                <span className="font-bold text-rose-600">{selectedAdmisi.diagnosa_masuk}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Permintaan Kelas:</span>
                <span className="font-bold text-indigo-600">{selectedAdmisi.kelas_diminta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Penjamin:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{selectedAdmisi.penjamin}</span>
              </div>
            </div>

            <form onSubmit={handleKonfirmasiAlokasi} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pilih Bed Kosong yang Tersedia:
                </label>
                <select
                  value={selectedBedId}
                  onChange={e => setSelectedBedId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {availableBeds.length === 0 ? (
                    <option value="">Tidak ada tempat tidur kosong</option>
                  ) : (
                    availableBeds.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.room} — Bed {b.id} ({b.class || b.kelas}) — Rp {Number(b.rate || 0).toLocaleString('id-ID')}/hari
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAlokasiModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={availableBeds.length === 0}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Konfirmasi Masuk Bangsal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
