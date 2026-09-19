import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { PASIEN, MASTER_POLIKLINIK, SEMUA_DOKTER, SEMUA_PERAWAT } from "../data/seedData";
import { Pasien, Kunjungan, MasterDokter, MasterPoli, MasterPenjamin, MasterPerawat, BantuanArtikel, User } from '../types';
import { HospitalInfo, DEFAULT_HOSPITAL_INFO } from '../types/document';
import { storage } from '../utils/storage';
import { 
  CloudStatus, 
  subscribeCloudStatus, 
  savePasienCloud, 
  updatePasienCloud, 
  batchSeedPasienCloud,
  saveKunjunganCloud, 
  updateKunjunganCloud, 
  batchSeedKunjunganCloud,
  saveDokterCloud,
  batchSeedDokterCloud,
  savePerawatCloud,
  batchSeedPerawatCloud,
  saveHospitalSettingsCloud,
  saveSystemDataCloud
} from '../lib/firestoreService';

interface HospitalContextType {
  activeUser: User;
  setActiveUser: (user: User) => void;
  pasien: Pasien[];
  addPasien: (p: Pasien) => Promise<void>;
  updatePasien: (id: string, p: Partial<Pasien>) => Promise<void>;
  kunjungan: Kunjungan[];
  addKunjungan: (k: Kunjungan) => Promise<void>;
  updateKunjunganStatus: (id: string, status: Kunjungan['status']) => Promise<void>;
  dokter: MasterDokter[];
  addDokter: (d: MasterDokter) => Promise<void>;
  perawat: MasterPerawat[];
  addPerawat: (n: MasterPerawat) => Promise<void>;
  poli: MasterPoli[];
  penjamin: MasterPenjamin[];
  artikelBantuan: BantuanArtikel[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isFirestoreSyncing: boolean;
  cloudStatus: CloudStatus;
  hospitalSettings: HospitalInfo & { logoUrl?: string };
  updateHospitalSettings: (settings: Partial<HospitalInfo & { logoUrl?: string }>) => Promise<void>;
  syncAllData: () => Promise<void>;
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
  const [cloudStatus, setLocalCloudStatus] = useState<CloudStatus>({
    isConnected: true,
    isSyncing: false,
    pendingWrites: 0,
    lastSync: null,
    syncedKeysCount: 0
  });

  // Track cloud status in real time
  useEffect(() => {
    return subscribeCloudStatus((status) => {
      setLocalCloudStatus(status);
      setIsFirestoreSyncing(status.isSyncing);
    });
  }, []);

  const [hospitalSettings, setHospitalSettings] = useState<HospitalInfo & { logoUrl?: string }>(() => {
    const saved = storage.get('hospital_settings', null);
    return saved ? saved : DEFAULT_HOSPITAL_INFO;
  });

  const updateHospitalSettings = async (settings: Partial<HospitalInfo & { logoUrl?: string }>) => {
    const updated = { ...hospitalSettings, ...settings };
    setHospitalSettings(updated);
    storage.set('hospital_settings', updated);
    await saveHospitalSettingsCloud(updated);
  };

  // 1. PASIEN STATE
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
    return storage.get<string>('hospital_theme', 'light') === 'dark';
  });

  useEffect(() => {
    storage.set('hospital_theme', isDarkMode ? 'dark' : 'light');
    if (typeof document !== 'undefined') {
      if (isDarkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Real-time Firestore listeners for core hospital collections
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let seededPasien = false;
    let seededKunjungan = false;
    let seededDokter = false;
    let seededPerawat = false;

    // 1. Listen to Pasien collection
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
            status: data.status || 'Aktif',
            keluhan_utama: data.keluhan_utama || '',
            diagnosa_primer: data.diagnosa_primer || '',
            resume_medis: data.resume_medis || undefined
          });
        });
        setPasien(list);
        storage.set('hospital_pasien', list);
      } else if (!seededPasien) {
        // If Firestore is fresh/empty, automatically seed the 100+ master patients to Firestore
        seededPasien = true;
        batchSeedPasienCloud(PASIEN as any);
      }
    }, (error) => {
      console.warn('Firestore Pasien sync notice:', error.message);
    });

    // 2. Listen to Kunjungan collection
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
        storage.set('hospital_kunjungan', list);
      } else if (!seededKunjungan) {
        seededKunjungan = true;
        batchSeedKunjunganCloud(dummyKunjungan);
      }
    }, (error) => {
      console.warn('Firestore Kunjungan sync notice:', error.message);
    });

    // 3. Listen to Dokter collection
    const unsubDokter = onSnapshot(collection(db, 'dokter'), (snapshot) => {
      if (!snapshot.empty) {
        const list: MasterDokter[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as MasterDokter);
        });
        setDokter(list);
        storage.set('hospital_dokter', list);
      } else if (!seededDokter) {
        seededDokter = true;
        batchSeedDokterCloud(MASTER_DOKTER_LIST);
      }
    }, (error) => {
      console.warn('Firestore Dokter sync notice:', error.message);
    });

    // 4. Listen to Perawat collection
    const unsubPerawat = onSnapshot(collection(db, 'perawat'), (snapshot) => {
      if (!snapshot.empty) {
        const list: MasterPerawat[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as MasterPerawat);
        });
        setPerawat(list);
        storage.set('hospital_perawat', list);
      } else if (!seededPerawat) {
        seededPerawat = true;
        batchSeedPerawatCloud(MASTER_PERAWAT_LIST);
      }
    }, (error) => {
      console.warn('Firestore Perawat sync notice:', error.message);
    });

    // 5. Listen to Hospital Settings
    const unsubSettings = onSnapshot(doc(db, 'hospital_settings', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setHospitalSettings(prev => ({ ...prev, ...data }));
        storage.set('hospital_settings', { ...hospitalSettings, ...data });
      }
    }, (error) => {
      console.warn('Firestore Settings sync notice:', error.message);
    });

    return () => {
      unsubPasien();
      unsubKunjungan();
      unsubDokter();
      unsubPerawat();
      unsubSettings();
    };
  }, []);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Direct Cloud Write Handlers
  const addPasien = async (p: Pasien) => {
    const docId = p.id || `P-${Date.now()}`;
    const newPasien = { ...p, id: docId };
    setPasien(prev => {
      const next = [newPasien, ...prev];
      storage.set('hospital_pasien', next);
      return next;
    });
    await savePasienCloud(newPasien);
  };

  const updatePasien = async (id: string, updated: Partial<Pasien>) => {
    setPasien(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updated } : p);
      storage.set('hospital_pasien', next);
      return next;
    });
    await updatePasienCloud(id, updated);
  };

  const addDokter = async (d: MasterDokter) => {
    setDokter(prev => {
      const next = [d, ...prev];
      storage.set('hospital_dokter', next);
      return next;
    });
    await saveDokterCloud(d);
  };

  const addPerawat = async (n: MasterPerawat) => {
    setPerawat(prev => {
      const next = [n, ...prev];
      storage.set('hospital_perawat', next);
      return next;
    });
    await savePerawatCloud(n);
  };

  const addKunjungan = async (k: Kunjungan) => {
    const docId = k.id || `K-${Date.now()}`;
    const newKunjungan = { ...k, id: docId };
    setKunjungan(prev => {
      const next = [newKunjungan, ...prev];
      storage.set('hospital_kunjungan', next);
      return next;
    });
    await saveKunjunganCloud(newKunjungan);
  };

  const updateKunjunganStatus = async (id: string, status: Kunjungan['status']) => {
    setKunjungan(prev => {
      const next = prev.map(k => k.id === id ? { ...k, status } : k);
      storage.set('hospital_kunjungan', next);
      return next;
    });
    await updateKunjunganCloud(id, { status });
  };

  // Full manual cloud synchronization
  const syncAllData = async () => {
    await Promise.all([
      batchSeedPasienCloud(pasien),
      batchSeedKunjunganCloud(kunjungan),
      batchSeedDokterCloud(dokter),
      batchSeedPerawatCloud(perawat),
      saveHospitalSettingsCloud(hospitalSettings),
      saveSystemDataCloud('hospital_poli_master', MASTER_POLI_LIST)
    ]);
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
      cloudStatus,
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
