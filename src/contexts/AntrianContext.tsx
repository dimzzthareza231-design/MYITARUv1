import React, { createContext, useContext, ReactNode } from 'react';
import { useHospital } from './HospitalContext';

// ============================================
// DEFINISI POLI
// ============================================
export interface Poli {
  id: string;
  kode: string;       // prefix antrian (A, B, C, dst)
  nama: string;
  icon: string;
  warna: string;
}

export const DAFTAR_POLI: Poli[] = [
  { id: 'POL-01', kode: 'UMM', nama: 'Poli Umum', icon: '🩺', warna: 'from-blue-500 to-cyan-600' },
  { id: 'POL-02', kode: 'IGD', nama: 'IGD (Gawat Darurat)', icon: '🚑', warna: 'from-red-500 to-rose-600' },
  { id: 'POL-03', kode: 'OBG', nama: 'Poli Obgyn (Kebidanan & Kandungan)', icon: '🤰', warna: 'from-pink-500 to-rose-600' },
  { id: 'POL-04', kode: 'ANK', nama: 'Poli Anak (Pediatri)', icon: '👶', warna: 'from-amber-500 to-yellow-600' },
  { id: 'POL-05', kode: 'BDH', nama: 'Poli Bedah Umum', icon: '🔪', warna: 'from-indigo-500 to-purple-600' },
  { id: 'POL-06', kode: 'JNT', nama: 'Poli Jantung & Pembuluh Darah (Kardiologi)', icon: '❤️', warna: 'from-red-600 to-pink-600' },
  { id: 'POL-07', kode: 'SRF', nama: 'Poli Saraf (Neurologi)', icon: '🧠', warna: 'from-violet-500 to-purple-600' },
  { id: 'POL-08', kode: 'MAT', nama: 'Poli Mata (Oftalmologi)', icon: '👁️', warna: 'from-cyan-500 to-blue-600' },
  { id: 'POL-09', kode: 'THT', nama: 'Poli THT-KL (Telinga, Hidung, Tenggorokan, Kepala, Leher)', icon: '👂', warna: 'from-teal-500 to-emerald-600' },
  { id: 'POL-10', kode: 'KLT', nama: 'Poli Kulit & Kelamin (Dermatovenerologi)', icon: '✨', warna: 'from-amber-400 to-orange-500' },
  { id: 'POL-11', kode: 'PRU', nama: 'Poli Paru (Pulmonologi)', icon: '🫁', warna: 'from-sky-500 to-cyan-600' },
  { id: 'POL-12', kode: 'JWA', nama: 'Poli Jiwa / Psikiatri', icon: '🧘', warna: 'from-purple-500 to-indigo-600' },
  { id: 'POL-13', kode: 'URL', nama: 'Poli Urologi (Sistem Perkemihan & Ginjal)', icon: '💧', warna: 'from-blue-600 to-teal-600' },
  { id: 'POL-14', kode: 'ORT', nama: 'Poli Orthopedi (Tulang & Otot)', icon: '🦴', warna: 'from-emerald-500 to-green-600' },
  { id: 'POL-15', kode: 'GIG', nama: 'Poli Gigi Spesialis (Bedah Mulut, Konservasi, Ortodonsia)', icon: '🦷', warna: 'from-teal-500 to-cyan-600' },
  { id: 'POL-16', kode: 'PDL', nama: 'Poli Penyakit Dalam (Internis)', icon: '🩺', warna: 'from-blue-700 to-indigo-700' },
  { id: 'POL-17', kode: 'ONK', nama: 'Poli Onkologi & Hematologi (Kanker & Kelainan Darah)', icon: '🎗️', warna: 'from-fuchsia-600 to-pink-600' },
  { id: 'POL-18', kode: 'GRT', nama: 'Poli Geriatri (Perawatan Medis Lansia)', icon: '👴', warna: 'from-amber-600 to-stone-600' },
  { id: 'POL-19', kode: 'EDK', nama: 'Poli Endokrin (Gangguan Hormon & Tiroid)', icon: '🧬', warna: 'from-indigo-600 to-blue-600' },
  { id: 'POL-20', kode: 'FTM', nama: 'Poli Fetomaternal (Kandungan Risiko Tinggi)', icon: '🤰', warna: 'from-rose-600 to-purple-600' },
  { id: 'POL-21', kode: 'RHB', nama: 'Poli Rehabilitasi Medik / Fisioterapi', icon: '🏃', warna: 'from-lime-600 to-emerald-600' },
  { id: 'POL-22', kode: 'GZI', nama: 'Poli Gizi Klinik', icon: '🥗', warna: 'from-green-500 to-teal-600' },
  { id: 'POL-23', kode: 'NYR', nama: 'Poli Nyeri atau Akupunktur', icon: '📍', warna: 'from-orange-500 to-red-500' },
  { id: 'POL-24', kode: 'MCU', nama: 'Poli MCU (Medical Check-Up)', icon: '📑', warna: 'from-teal-600 to-sky-600' },
];

// ============================================
// DEFINISI ANTRIAN
// ============================================
export type StatusAntrian = 'Menunggu' | 'Dipanggil' | 'Dilayani' | 'Selesai' | 'Batal';

export interface Antrian {
  id: string;
  nomorAntrian: string;   // contoh: A-001
  pasienId: string;
  namaPasien: string;
  noRm: string;
  poliId: string;
  poliNama: string;
  status: StatusAntrian;
  jamDaftar: string;       // waktu pendaftaran
  jamDipanggil?: string;   // waktu dipanggil
  keluhan?: string;
  penjamin?: string;
}

interface AntrianContextType {
  antrianList: Antrian[];
  poliList: Poli[];
  // Aksi
  daftarkanAntrian: (data: { pasienId: string; namaPasien: string; noRm: string; poliId: string; keluhan?: string; penjamin?: string }) => Antrian | null;
  panggilAntrian: (id: string) => void;
  mulaiLayani: (id: string) => void;
  selesaikanAntrian: (id: string) => void;
  batalkanAntrian: (id: string) => void;
  resetAntrianHarian: () => void;
  // Query
  getAntrianByPoli: (poliId: string) => Antrian[];
  getNomorBerikutnya: (poliId: string) => string;
  // Statistik
  totalPasienHariIni: number;
  totalMenunggu: number;
  totalDilayani: number;
  totalSelesai: number;
}

const AntrianContext = createContext<AntrianContextType | undefined>(undefined);

const getTanggalHariIni = () => new Date().toISOString().split('T')[0];

export function AntrianProvider({ children }: { children: ReactNode }) {
  const { kunjungan = [], pasien = [], poli = [], updateKunjunganStatus } = useHospital();

  const antrianList: Antrian[] = (kunjungan || [])
    .filter(k => k && k.tipe === 'Rawat Jalan')
    .map(k => {
      const p = (pasien || []).find(x => x && String(x.id) === String(k.pasien_id));
      const kPoliId = String(k.poli_id || '');
      const poliObject = DAFTAR_POLI.find(x => x.id === kPoliId) || 
                         DAFTAR_POLI.find(x => x.kode && kPoliId.includes(x.kode)) || 
                         DAFTAR_POLI[0];
      
      let antrianStatus: StatusAntrian = 'Menunggu';
      if (k.status === 'Panggil') antrianStatus = 'Dipanggil';
      else if (k.status === 'Diperiksa') antrianStatus = 'Dilayani';
      else if (k.status === 'Selesai' || k.status === 'Farmasi' || k.status === 'Kasir') antrianStatus = 'Selesai';
      else if (k.status === 'Batal') antrianStatus = 'Batal';

      const jamStr = k.tanggal && typeof k.tanggal === 'string' && k.tanggal.includes('T')
        ? new Date(k.tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        : '08:00';

      return {
        id: k.id || `k-${Math.random()}`,
        nomorAntrian: k.nomor_antrian || '000',
        pasienId: String(k.pasien_id || ''),
        namaPasien: p ? (p.nama || (p as any).nama_pasien || 'Unknown') : 'Unknown',
        noRm: p?.no_rm || '-',
        poliId: poliObject.id,
        poliNama: poliObject.nama,
        status: antrianStatus,
        jamDaftar: jamStr,
        keluhan: k.keluhan_utama || '',
        penjamin: k.penjamin_id || 'Umum'
      };
    });

  const getNomorBerikutnya = (poliId: string): string => {
    const poliObj = DAFTAR_POLI.find(p => p.id === poliId);
    if (!poliObj) return 'X-000';
    const jumlahHariIni = antrianList.filter(a => a.poliId === poliId).length;
    const nomor = jumlahHariIni + 1;
    return `${poliObj.kode}-${String(nomor).padStart(3, '0')}`;
  };

  const daftarkanAntrian = (data: { pasienId: string; namaPasien: string; noRm: string; poliId: string; keluhan?: string; penjamin?: string }): Antrian | null => {
    // Delegated to addKunjungan in RegistrationForm
    const poliObj = DAFTAR_POLI.find(p => p.id === data.poliId);
    if (!poliObj) return null;
    const nomorAntrian = getNomorBerikutnya(data.poliId);
    return {
      id: `antrian-${Date.now()}`,
      nomorAntrian,
      pasienId: data.pasienId,
      namaPasien: data.namaPasien,
      noRm: data.noRm,
      poliId: data.poliId,
      poliNama: poliObj.nama,
      status: 'Menunggu',
      jamDaftar: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      keluhan: data.keluhan,
      penjamin: data.penjamin
    };
  };

  const panggilAntrian = (id: string) => {
    updateKunjunganStatus(id, 'Panggil');
  };

  const mulaiLayani = (id: string) => {
    updateKunjunganStatus(id, 'Diperiksa');
  };

  const selesaikanAntrian = (id: string) => {
    updateKunjunganStatus(id, 'Selesai');
  };

  const batalkanAntrian = (id: string) => {
    updateKunjunganStatus(id, 'Batal');
  };

  const resetAntrianHarian = () => {};

  const getAntrianByPoli = (poliId: string): Antrian[] => {
    return antrianList.filter(a => a.poliId === poliId);
  };

  const totalPasienHariIni = antrianList.filter(a => a.status !== 'Batal').length;
  const totalMenunggu = antrianList.filter(a => a.status === 'Menunggu').length;
  const totalDilayani = antrianList.filter(a => a.status === 'Dipanggil' || a.status === 'Dilayani').length;
  const totalSelesai = antrianList.filter(a => a.status === 'Selesai').length;

  return (
    <AntrianContext.Provider value={{
      antrianList,
      poliList: DAFTAR_POLI,
      daftarkanAntrian,
      panggilAntrian,
      mulaiLayani,
      selesaikanAntrian,
      batalkanAntrian,
      resetAntrianHarian,
      getAntrianByPoli,
      getNomorBerikutnya,
      totalPasienHariIni,
      totalMenunggu,
      totalDilayani,
      totalSelesai
    }}>
      {children}
    </AntrianContext.Provider>
  );
}

export function useAntrian() {
  const context = useContext(AntrianContext);
  if (!context) {
    throw new Error('useAntrian harus digunakan di dalam AntrianProvider');
  }
  return context;
};
