import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PASIEN, MASTER_POLIKLINIK, SEMUA_DOKTER, SEMUA_PERAWAT, Doctor, Nurse } from "../data/seedData";
import { Pasien, Kunjungan, MasterDokter, MasterPoli, MasterPenjamin, MasterPerawat, BantuanArtikel, User } from '../types';
import { HospitalInfo, DEFAULT_HOSPITAL_INFO } from '../types/document';
import { storage } from '../utils/storage';

interface HospitalContextType {
  activeUser: User;
  setActiveUser: (user: User) => void;
  pasien: Pasien[];
  addPasien: (p: Pasien) => void;
  updatePasien: (id: string, p: Partial<Pasien>) => void;
  kunjungan: Kunjungan[];
  addKunjungan: (k: Kunjungan) => void;
  updateKunjunganStatus: (id: string, status: Kunjungan['status']) => void;
  dokter: MasterDokter[];
  addDokter: (d: MasterDokter) => void;
  perawat: MasterPerawat[];
  addPerawat: (n: MasterPerawat) => void;
  poli: MasterPoli[];
  penjamin: MasterPenjamin[];
  artikelBantuan: BantuanArtikel[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFirestoreSyncing: boolean;
  hospitalSettings: HospitalInfo & { logoUrl?: string };
  updateHospitalSettings: (settings: Partial<HospitalInfo & { logoUrl?: string }>) => void;
  syncAllData: () => void;
}

const defaultUser: User = { id: 'U1', name: 'dr. Andi Pratama, Sp.PD', role: 'Dokter', spesialisasi: 'Penyakit Dalam' };

export const MASTER_POLI_LIST: MasterPoli[] = MASTER_POLIKLINIK.map(p => ({
  id: p.id,
  nama: p.nama,
  kode: p.kode,
  kapasitas: p.kapasitas,
  kategori: p.kategori,
  icon: p.icon,
  deskripsi: p.deskripsi
}));

export const MASTER_DOKTER_LIST: MasterDokter[] = SEMUA_DOKTER.map(d => ({
  id: d.id,
  nip: d.nip,
  sip: d.sip,
  str: d.str,
  nama: d.nama,
  spesialisasi: d.spesialis,
  subspesialis: d.subspesialis,
  poli_id: d.poli_id,
  poli_nama: d.poli,
  penempatan: d.penempatan,
  jadwal: d.jadwal,
  hari: d.hari,
  jam: d.jam,
  shift: d.shift,
  ruangan: d.ruangan,
  kuota: d.kuota,
  pasien_terlayani: d.pasien_terlayani,
  status_jaga: d.status_jaga,
  kontak: d.kontak,
  email: d.email,
  status: d.status
}));

export const MASTER_PERAWAT_LIST: MasterPerawat[] = SEMUA_PERAWAT.map(n => ({
  id: n.id,
  nip: n.nip,
  nama: n.nama,
  jabatan: n.jabatan,
  unit: n.unit,
  shift: n.shift,
  status: n.status
}));

const dummyPenjamin: MasterPenjamin[] = [
  { id: 'PJ-01', nama: 'Umum / Mandiri', tipe: 'Umum' },
  { id: 'PJ-02', nama: 'BPJS Kesehatan (PBI & Non-PBI)', tipe: 'BPJS' },
  { id: 'PJ-03', nama: 'Asuransi Mandiri Inhealth', tipe: 'Asuransi' },
  { id: 'PJ-04', nama: 'Asuransi Allianz Care', tipe: 'Asuransi' },
  { id: 'PJ-05', nama: 'Asuransi Prudential Health', tipe: 'Asuransi' },
  { id: 'PJ-06', nama: 'PT Pertamina (Persero)', tipe: 'Perusahaan' },
  { id: 'PJ-07', nama: 'PT PLN Indonesia', tipe: 'Perusahaan' },
];

const today = new Date().toISOString().split('T')[0];

const dummyKunjungan: Kunjungan[] = [];
MASTER_POLI_LIST.forEach((targetPoli, pIdx) => {
  const targetDokter = MASTER_DOKTER_LIST.find(d => d.poli_id === targetPoli.id) || MASTER_DOKTER_LIST[pIdx % MASTER_DOKTER_LIST.length] || MASTER_DOKTER_LIST[0];
  const queueCode = targetPoli.kode || targetPoli.nama.substring(0, 3).toUpperCase();
  
  // 5 active patients per poliklinik
  const statuses: ('Menunggu' | 'Panggil' | 'Diperiksa' | 'Selesai')[] = ['Menunggu', 'Menunggu', 'Panggil', 'Diperiksa', 'Selesai'];
  
  for (let q = 0; q < 5; q++) {
    const patientIndex = (pIdx * 4 + q) % PASIEN.length;
    const p = PASIEN[patientIndex];
    const penjaminItem = dummyPenjamin[(pIdx + q) % dummyPenjamin.length];
    const queueNum = String(q + 1).padStart(3, '0');

    dummyKunjungan.push({
      id: `K-${targetPoli.kode || 'POL'}-${queueNum}`,
      pasien_id: String(p.id),
      tanggal: today,
      poli_id: targetPoli.id,
      dokter_id: targetDokter.id,
      penjamin_id: penjaminItem.id,
      status: statuses[q % statuses.length],
      tipe: targetPoli.kode === 'IGD' ? ('IGD' as const) : ('Rawat Jalan' as const),
      nomor_antrian: `${queueCode}-${queueNum}`,
      keluhan_utama: p.keluhan_utama || `Konsultasi & pemeriksaan klinis di ${targetPoli.nama}`
    });
  }
});

const dummyArtikel: BantuanArtikel[] = [
  { id: 'H1', kategori: 'Poliklinik', judul: 'Panduan Penggunaan AI Scribe Talk-to-Text', konten: 'Tekan tombol "Mulai Rekaman" pada form SOAP, dokter berbicara secara alami, dan AI otomatis mengekstrak Subjective, Objective, Diagnosis ICD-10, dan Resep Obat.', tags: ['talk-to-text', 'ai', 'soap', 'poliklinik'] },
  { id: 'H2', kategori: 'Pendaftaran', judul: 'Cara Mendaftarkan Pasien ke Poliklinik Spesialis', konten: 'Pilih poli tujuan spesialis yang dituju (misalnya Obgyn, Jantung, Anak, Saraf, Bedah, MCU) lalu pilih dokter penanggung jawab spesialis.', tags: ['pendaftaran', 'poli', 'spesialis'] },
  { id: 'H3', kategori: 'Rekam Medis', judul: 'Integrasi Standar ICD-10 & Diagnosis Pintar', konten: 'Sistem mendukung pencarian dan validasi ICD-10 klinis otomatis terintegrasi BPJS VClaim dan SatuSehat.', tags: ['icd10', 'rme', 'bpjs'] },
  { id: 'H4', kategori: 'Farmasi', judul: 'E-Prescribing & Interaksi Obat Terpadu', konten: 'Resep yang diinput dari Form SOAP Poliklinik langsung terkirim secara real-time ke modul Apotek Ralan.', tags: ['farmasi', 'resep', 'apotek'] },
  { id: 'H5', kategori: 'SDM', judul: 'Sinkronisasi Jadwal Dokter & Perawat', konten: 'Seluruh data dokter dan perawat untuk 24 poliklinik tersinkronisasi otomatis dengan modul Manajemen SDM & Shift.', tags: ['sdm', 'dokter', 'perawat'] },
];

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [activeUser, setActiveUser] = useState<User>(defaultUser);
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState(false);
  const [hospitalSettings, setHospitalSettings] = useState<HospitalInfo & { logoUrl?: string }>(() => {
    const saved = storage.get('hospital_settings', null);
    return saved ? saved : DEFAULT_HOSPITAL_INFO;
  });

  const updateHospitalSettings = (settings: Partial<HospitalInfo & { logoUrl?: string }>) => {
    setHospitalSettings(prev => {
      const updated = { ...prev, ...settings };
      storage.set('hospital_settings', updated);
      return updated;
    });
  };


  // 1. PASIEN STATE (100+ Patients with Full Resumes & Clinical Profiles)
  const [pasien, setPasien] = useState<Pasien[]>(() => {
    const saved = storage.get('hospital_pasien', null);
    if (Array.isArray(saved) && saved.length > 0) return saved;
    return PASIEN as any;
  });

  // 2. DOKTER STATE
  const [dokter, setDokter] = useState<MasterDokter[]>(() => {
    const saved = storage.get('hospital_dokter', null);
    if (Array.isArray(saved) && saved.length > 0) return saved;
    return MASTER_DOKTER_LIST;
  });

  // 3. PERAWAT STATE
  const [perawat, setPerawat] = useState<MasterPerawat[]>(() => {
    const saved = storage.get('hospital_perawat', null);
    if (Array.isArray(saved) && saved.length > 0) return saved;
    return MASTER_PERAWAT_LIST;
  });

  // 4. POLI STATE
  const [poli] = useState<MasterPoli[]>(MASTER_POLI_LIST);

  // 5. PENJAMIN STATE
  const [penjamin] = useState<MasterPenjamin[]>(dummyPenjamin);

  // 6. KUNJUNGAN STATE
  const [kunjungan, setKunjungan] = useState<Kunjungan[]>(() => {
    const saved = storage.get('hospital_kunjungan', null);
    if (Array.isArray(saved) && saved.length >= 24) return saved;
    return dummyKunjungan;
  });

  // 7. DARK MODE
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return storage.get('hospital_theme', 'light') === 'dark';
  });

  // Sync to storage safely
  useEffect(() => {
    storage.set('hospital_pasien', pasien);
    storage.set('db_pasien', pasien);
  }, [pasien]);

  useEffect(() => {
    storage.set('hospital_dokter', dokter);
    storage.set('db_dokter', dokter);
  }, [dokter]);

  useEffect(() => {
    storage.set('hospital_perawat', perawat);
    storage.set('db_perawat', perawat);
  }, [perawat]);

  useEffect(() => {
    storage.set('hospital_kunjungan', kunjungan);
  }, [kunjungan]);

  useEffect(() => {
    storage.set('hospital_poli_master', MASTER_POLI_LIST);
  }, []);

  useEffect(() => {
    storage.set('hospital_theme', isDarkMode ? 'dark' : 'light');
    if (typeof document !== 'undefined') {
      if (isDarkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Real-time Firestore listeners with safe fallback
  useEffect(() => {
    try {
      const unsubPasien = onSnapshot(collection(db, 'pasien'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Pasien[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              no_rm: data.no_rm || '',
              nik: data.nik || '',
              nama: data.nama || '',
              tanggal_lahir: data.tanggal_lahir || '',
              tgl_lahir: data.tgl_lahir || data.tanggal_lahir || '',
              jenis_kelamin: data.jenis_kelamin || 'L',
              alamat: data.alamat || '',
              telepon: data.telepon || data.no_hp || '',
              no_hp: data.no_hp || data.telepon || '',
              penjamin: data.penjamin || 'Umum',
              golongan_darah: data.golongan_darah || 'O',
              status: data.status || 'Aktif'
            });
          });
          setPasien(list);
          setIsFirestoreSyncing(true);
        }
      }, (error) => {
        console.warn('Firestore Pasien sync notice:', error.message);
      });

      const unsubKunjungan = onSnapshot(collection(db, 'kunjungan'), (snapshot) => {
        if (!snapshot.empty) {
          const list: Kunjungan[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            list.push({
              id: docSnap.id,
              pasien_id: data.pasien_id || '',
              tanggal: data.tanggal || today,
              poli_id: data.poli_id || 'POL-01',
              dokter_id: data.dokter_id || 'D-1',
              penjamin_id: data.penjamin_id || 'PJ-01',
              status: data.status || 'Menunggu',
              tipe: data.tipe || 'Rawat Jalan',
              nomor_antrian: data.nomor_antrian || 'UMM-001',
              keluhan_utama: data.keluhan_utama || ''
            });
          });
          setKunjungan(list);
        }
      }, (error) => {
        console.warn('Firestore Kunjungan sync notice:', error.message);
      });

      return () => {
        unsubPasien();
        unsubKunjungan();
      };
    } catch (e) {
      console.warn('Firestore initialization fallback:', e);
    }
  }, []);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const addPasien = async (p: Pasien) => {
    setPasien(prev => [p, ...prev]);
    try {
      const docId = p.id || `P-${Date.now()}`;
      await setDoc(doc(db, 'pasien', docId), {
        ...p,
        id: docId,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Saving patient to Firestore skipped:', e);
    }
  };

  const updatePasien = (id: string, updated: Partial<Pasien>) => {
    setPasien(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const addDokter = (d: MasterDokter) => {
    setDokter(prev => [d, ...prev]);
  };

  const addPerawat = (n: MasterPerawat) => {
    setPerawat(prev => [n, ...prev]);
  };

  const addKunjungan = async (k: Kunjungan) => {
    setKunjungan(prev => [k, ...prev]);
    try {
      const docId = k.id || `K-${Date.now()}`;
      await setDoc(doc(db, 'kunjungan', docId), {
        ...k,
        id: docId,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Saving visit to Firestore skipped:', e);
    }
  };

  const updateKunjunganStatus = async (id: string, status: Kunjungan['status']) => {
    setKunjungan(prev => prev.map(k => k.id === id ? { ...k, status } : k));
    try {
      await setDoc(doc(db, 'kunjungan', id), {
        status,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Updating visit status in Firestore skipped:', e);
    }
  };

  const syncAllData = () => {
    storage.set('hospital_pasien', pasien);
    storage.set('db_pasien', pasien);
    storage.set('hospital_dokter', dokter);
    storage.set('db_dokter', dokter);
    storage.set('hospital_perawat', perawat);
    storage.set('db_perawat', perawat);
    storage.set('hospital_kunjungan', kunjungan);
    storage.set('hospital_poli_master', MASTER_POLI_LIST);
  };

  return (
    <HospitalContext.Provider value={{
      activeUser, setActiveUser,
      pasien, addPasien, updatePasien,
      kunjungan, addKunjungan, updateKunjunganStatus,
      dokter, addDokter,
      perawat, addPerawat,
      poli,
      penjamin,
      artikelBantuan: dummyArtikel,
      isDarkMode, toggleDarkMode,
      isFirestoreSyncing,
      hospitalSettings,
      updateHospitalSettings,
      syncAllData
    }}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}
