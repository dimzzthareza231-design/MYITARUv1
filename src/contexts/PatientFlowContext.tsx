import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

const PatientFlowContext = createContext<any>(null);

export const STATUS_RJ = {
  DAFTAR: 'Pendaftaran',
  ANTRI_POLI: 'Menunggu Poli',
  PERIKSA_POLI: 'Dalam Pemeriksaan',
  SELESAI_POLI: 'Selesai Poli',
  ANTRI_LAB: 'Menunggu Lab',
  SELESAI_LAB: 'Selesai Lab',
  ANTRI_FARMASI: 'Menunggu Farmasi',
  SELESAI_FARMASI: 'Obat Siap',
  ANTRI_KASIR: 'Menunggu Kasir',
  LUNAS: 'Pembayaran Lunas',
  PULANG: 'Sudah Pulang'
};

export const STATUS_RI = {
  DAFTAR: 'Pendaftaran',
  PENANGANAN_AWAL: 'Penanganan Awal',
  TRANSFER_BANGSAL: 'Transfer Bangsal',
  DIRAWAT: 'Sedang Dirawat',
  VISITE_DOKTER: 'Visite Dokter',
  PERIKSA_PENUNJANG: 'Pemeriksaan Penunjang',
  DISCHARGE_PLAN: 'Discharge Planning',
  PROSES_BILLING: 'Proses Billing',
  OBAT_PULANG: 'Obat Pulang',
  PULANG: 'Sudah Pulang'
};

export function PatientFlowProvider({ children }: { children: React.ReactNode }) {
  const [kunjungan, setKunjungan] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  useEffect(() => {
    const saved = storage.get('patient_flow', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setKunjungan(saved);
    } else {
      const dummy = [
        {
          id: 1,
          no_rm: 'RM-001',
          nama_pasien: 'Budi Santoso',
          jenis_kunjungan: 'Rawat Jalan',
          poli: 'Poli Penyakit Dalam',
          dokter: 'dr. Ahmad, Sp.PD',
          status: 'ANTRI_FARMASI',
          tanggal: new Date().toISOString().split('T')[0],
          jam_daftar: '08:30',
          penjamin: 'BPJS',
          diagnosis: 'E11.9 - Diabetes Mellitus',
          history_status: [
            { status: 'DAFTAR', waktu: '08:30', oleh: 'Admin' },
            { status: 'ANTRI_POLI', waktu: '08:35', oleh: 'Sistem' },
            { status: 'PERIKSA_POLI', waktu: '09:15', oleh: 'dr. Ahmad' },
            { status: 'SELESAI_POLI', waktu: '09:45', oleh: 'dr. Ahmad' },
            { status: 'ANTRI_FARMASI', waktu: '09:50', oleh: 'Sistem' }
          ]
        },
        {
          id: 2,
          no_rm: 'RM-002',
          nama_pasien: 'Siti Aminah',
          jenis_kunjungan: 'Rawat Inap',
          poli: 'IGD',
          dokter: 'dr. Rina, Sp.PD',
          status: 'DIRAWAT',
          kamar: 'Melati 301',
          tanggal: new Date().toISOString().split('T')[0],
          jam_daftar: '14:00',
          penjamin: 'Umum',
          diagnosis: 'J18.9 - Pneumonia',
          history_status: [
            { status: 'DAFTAR', waktu: '14:00', oleh: 'Admin' },
            { status: 'PENANGANAN_AWAL', waktu: '14:15', oleh: 'dr. Rina' },
            { status: 'TRANSFER_BANGSAL', waktu: '15:30', oleh: 'Perawat' },
            { status: 'DIRAWAT', waktu: '16:00', oleh: 'Sistem' }
          ]
        }
      ];
      setKunjungan(dummy);
      storage.set('patient_flow', dummy);
    }
    
    const savedNotif = storage.get('patient_notifications', null);
    if (savedNotif && Array.isArray(savedNotif)) {
      setNotifications(savedNotif);
    }
  }, []);
  
  const updateStatus = (id: number, newStatus: string, oleh = 'Sistem') => {
    let newNotifToSave: any[] = [];
    const updated = kunjungan.map(k => {
      if (k.id === id) {
        const historyEntry = {
          status: newStatus,
          waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          oleh: oleh
        };
        
        const notif = {
          id: Date.now(),
          kunjungan_id: id,
          nama_pasien: k.nama_pasien,
          no_rm: k.no_rm,
          status_baru: newStatus,
          status_lama: k.status,
          waktu: new Date().toISOString(),
          read: false
        };
        
        newNotifToSave = [notif, ...notifications];
        setNotifications(newNotifToSave);
        storage.set('patient_notifications', newNotifToSave);
        
        return {
          ...k,
          status: newStatus,
          history_status: [...(k.history_status || []), historyEntry],
          updated_at: new Date().toISOString()
        };
      }
      return k;
    });
    
    setKunjungan(updated);
    storage.set('patient_flow', updated);
  };
  
  const addKunjungan = (data: any) => {
    const newKunjungan = {
      id: Date.now(),
      ...data,
      status: 'DAFTAR',
      history_status: [{
        status: 'DAFTAR',
        waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        oleh: 'Admin'
      }],
      tanggal: new Date().toISOString().split('T')[0],
      jam_daftar: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    
    const updated = [newKunjungan, ...kunjungan];
    setKunjungan(updated);
    storage.set('patient_flow', updated);
    return newKunjungan;
  };
  
  const getKunjunganAktif = () => kunjungan.filter(k => k.status !== 'PULANG');
  
  const markNotifRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    storage.set('patient_notifications', updated);
  };
  
  const markAllNotifRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    storage.set('patient_notifications', updated);
  };
  
  return (
    <PatientFlowContext.Provider value={{
      kunjungan, notifications, updateStatus, addKunjungan,
      getKunjunganAktif, markNotifRead, markAllNotifRead,
      STATUS_RJ, STATUS_RI
    }}>
      {children}
    </PatientFlowContext.Provider>
  );
}

export const usePatientFlow = () => useContext(PatientFlowContext);
