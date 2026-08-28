import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { PasienOperasiItem, PaketOperasiItem, ObatBMHPOperasiItem, RuangOKStatus } from './KamarOperasi/types';
import { 
  generateComprehensiveSurgeryPatients, 
  RUANG_OK_LIST, 
  DAFTAR_PAKET_OPERASI, 
  DAFTAR_OBAT_BMHP_OPERASI 
} from './KamarOperasi/data';

import { PasienOperasiTab } from './KamarOperasi/PasienOperasiTab';
import { BookingOperasiTab } from './KamarOperasi/BookingOperasiTab';
import { PaketOperasiTab } from './KamarOperasi/PaketOperasiTab';
import { ObatOperasiTab } from './KamarOperasi/ObatOperasiTab';
import { LaporanOperasiTab } from './KamarOperasi/LaporanOperasiTab';

export function KamarOperasi() {
  const outlet = useOutletContext<{ activeTab?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab determination (From Outlet or Query param or default to 'Pasien Operasi')
  const currentTab = outlet?.activeTab || searchParams.get('tab') || 'Pasien Operasi';

  // 1. Master Patients State (Persisted in localStorage)
  const [pasienList, setPasienList] = useState<PasienOperasiItem[]>(() => {
    const saved = localStorage.getItem('hospital_ok_pasien_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed parsing hospital_ok_pasien_v2', e);
      }
    }
    return generateComprehensiveSurgeryPatients();
  });

  useEffect(() => {
    localStorage.setItem('hospital_ok_pasien_v2', JSON.stringify(pasienList));
  }, [pasienList]);

  // 2. Ruang OK State
  const [ruangOKList, setRuangOKList] = useState<RuangOKStatus[]>(() => {
    const saved = localStorage.getItem('hospital_ok_ruang_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed parsing hospital_ok_ruang_v2', e);
      }
    }
    return RUANG_OK_LIST;
  });

  useEffect(() => {
    localStorage.setItem('hospital_ok_ruang_v2', JSON.stringify(ruangOKList));
  }, [ruangOKList]);

  // 3. Paket Operasi State
  const [paketList, setPaketList] = useState<PaketOperasiItem[]>(() => {
    const saved = localStorage.getItem('hospital_ok_paket_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed parsing hospital_ok_paket_v2', e);
      }
    }
    return DAFTAR_PAKET_OPERASI;
  });

  useEffect(() => {
    localStorage.setItem('hospital_ok_paket_v2', JSON.stringify(paketList));
  }, [paketList]);

  // 4. Obat & BMHP State
  const [obatList, setObatList] = useState<ObatBMHPOperasiItem[]>(() => {
    const saved = localStorage.getItem('hospital_ok_obat_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed parsing hospital_ok_obat_v2', e);
      }
    }
    return DAFTAR_OBAT_BMHP_OPERASI;
  });

  useEffect(() => {
    localStorage.setItem('hospital_ok_obat_v2', JSON.stringify(obatList));
  }, [obatList]);

  // Handle Tab Switch via internal navigation
  const switchToTab = (tabName: string) => {
    setSearchParams({ tab: tabName });
  };

  // Render appropriate tab
  switch (currentTab) {
    case 'Booking Operasi':
      return (
        <BookingOperasiTab 
          pasienList={pasienList} 
          setPasienList={setPasienList}
          onViewPasienTab={() => switchToTab('Pasien Operasi')}
        />
      );

    case 'Paket Operasi':
      return (
        <PaketOperasiTab 
          paketList={paketList} 
          setPaketList={setPaketList} 
        />
      );

    case 'Obat Operasi':
      return (
        <ObatOperasiTab 
          obatList={obatList} 
          setObatList={setObatList} 
        />
      );

    case 'Laporan Operasi':
      return (
        <LaporanOperasiTab 
          pasienList={pasienList} 
          ruangOKList={ruangOKList} 
        />
      );

    case 'Pasien Operasi':
    default:
      return (
        <PasienOperasiTab 
          pasienList={pasienList} 
          setPasienList={setPasienList} 
          ruangOKList={ruangOKList}
          onOpenBooking={() => switchToTab('Booking Operasi')}
        />
      );
  }
}
