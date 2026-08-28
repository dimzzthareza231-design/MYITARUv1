import React, { useState } from 'react';
import {
  Smartphone, LayoutDashboard, User, CreditCard, QrCode,
  MapPin, Clock, Bed, Calendar, Video, FileText, Star,
  MessageCircle, Activity, Phone, Heart, Bot, Bell,
  ChevronRight, Search, Plus, Edit, RefreshCw
} from 'lucide-react';
import { JKNMobileDashboard } from './JKNMobileDashboard';
import { InfoProgramJKN } from './Tabs/InfoProgramJKN';
import { InfoPeserta } from './Tabs/InfoPeserta';
import { InfoIuran } from './Tabs/InfoIuran';
import { InfoVirtualAccount } from './Tabs/InfoVirtualAccount';
import { KISDigital } from './Tabs/KISDigital';
import { PendaftaranPeserta } from './Tabs/PendaftaranPeserta';
import { PerubahanData } from './Tabs/PerubahanData';
import { PerubahanFaskes } from './Tabs/PerubahanFaskes';
import { LokasiFaskes } from './Tabs/LokasiFaskes';
import { AntreanOnline } from './Tabs/AntreanOnline';
import { KetersediaanBed } from './Tabs/KetersediaanBed';
import { JadwalOperasi } from './Tabs/JadwalOperasi';
import { KonsultasiDokter } from './Tabs/KonsultasiDokter';
import { SkriningKesehatan } from './Tabs/SkriningKesehatan';
import { RiwayatPelayanan } from './Tabs/RiwayatPelayanan';
import { RatingKesan } from './Tabs/RatingKesan';
import { PengaduanLayanan } from './Tabs/PengaduanLayanan';
import { FiturBUGAR } from './Tabs/FiturBUGAR';
import { CallSOS } from './Tabs/CallSOS';
import { ProgramREHAB } from './Tabs/ProgramREHAB';
import { VOIPCallCenter } from './Tabs/VOIPCallCenter';
import { HumanAI } from './Tabs/HumanAI';
import { DashboardTren } from './Tabs/DashboardTren';
import { NotifikasiPengingat } from './Tabs/NotifikasiPengingat';

export function JKNMobile() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuCategories = [
    {
      id: 'kepesertaan',
      label: 'Manajemen Kepesertaan',
      icon: User,
      items: [
        { id: 'info-program', label: 'Info Program JKN', icon: FileText },
        { id: 'info-peserta', label: 'Info Peserta', icon: Search },
        { id: 'info-iuran', label: 'Info Iuran / Tagihan', icon: CreditCard },
        { id: 'info-va', label: 'Info Virtual Account', icon: QrCode },
        { id: 'kis-digital', label: 'KIS Digital', icon: CreditCard },
        { id: 'pendaftaran', label: 'Pendaftaran Peserta Baru', icon: Plus },
        { id: 'perubahan-data', label: 'Perubahan Data Peserta', icon: Edit },
        { id: 'perubahan-faskes', label: 'Perubahan Faskes', icon: RefreshCw },
      ]
    },
    {
      id: 'layanan',
      label: 'Layanan Kesehatan & Fasilitas',
      icon: MapPin,
      items: [
        { id: 'lokasi-faskes', label: 'Info Lokasi Faskes', icon: MapPin },
        { id: 'antrean', label: 'Antrean Online', icon: Clock },
        { id: 'bed', label: 'Ketersediaan Tempat Tidur', icon: Bed },
        { id: 'jadwal-operasi', label: 'Jadwal Tindakan Operasi', icon: Calendar },
      ]
    },
    {
      id: 'konsultasi',
      label: 'Konsultasi, Riwayat, & Pengaduan',
      icon: MessageCircle,
      items: [
        { id: 'konsultasi', label: 'Konsultasi Dokter', icon: Video },
        { id: 'skrining', label: 'Skrining Kesehatan', icon: FileText },
        { id: 'riwayat', label: 'Riwayat Pelayanan (i-Care)', icon: FileText },
        { id: 'rating', label: 'Rating Kesan (KESSAN)', icon: Star },
        { id: 'pengaduan', label: 'Pengaduan Layanan', icon: MessageCircle },
      ]
    },
    {
      id: 'kebugaran',
      label: 'Kebugaran & Kesehatan (BUGAR)',
      icon: Activity,
      items: [
        { id: 'bugar', label: 'Fitur BUGAR', icon: Activity },
      ]
    },
    {
      id: 'darurat',
      label: 'Fitur Darurat & Layanan Khusus',
      icon: Phone,
      items: [
        { id: 'sos', label: 'Call SOS JKN', icon: Phone },
        { id: 'rehab', label: 'Program REHAB', icon: Heart },
        { id: 'voip', label: 'VOIP Call Center 165', icon: Phone },
      ]
    },
    {
      id: 'modern',
      label: 'Fitur Modern & Tambahan',
      icon: Bot,
      items: [
        { id: 'human-ai', label: 'Human AI', icon: Bot },
        { id: 'tren', label: 'Dashboard Tren Penyakit', icon: Activity },
        { id: 'notifikasi', label: 'Notifikasi Pengingat', icon: Bell },
      ]
    }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <JKNMobileDashboard onNavigate={setActiveTab} />;
      case 'info-program': return <InfoProgramJKN />;
      case 'info-peserta': return <InfoPeserta />;
      case 'info-iuran': return <InfoIuran />;
      case 'info-va': return <InfoVirtualAccount />;
      case 'kis-digital': return <KISDigital />;
      case 'pendaftaran': return <PendaftaranPeserta />;
      case 'perubahan-data': return <PerubahanData />;
      case 'perubahan-faskes': return <PerubahanFaskes />;
      case 'lokasi-faskes': return <LokasiFaskes />;
      case 'antrean': return <AntreanOnline />;
      case 'bed': return <KetersediaanBed />;
      case 'jadwal-operasi': return <JadwalOperasi />;
      case 'konsultasi': return <KonsultasiDokter />;
      case 'skrining': return <SkriningKesehatan />;
      case 'riwayat': return <RiwayatPelayanan />;
      case 'rating': return <RatingKesan />;
      case 'pengaduan': return <PengaduanLayanan />;
      case 'bugar': return <FiturBUGAR />;
      case 'sos': return <CallSOS />;
      case 'rehab': return <ProgramREHAB />;
      case 'voip': return <VOIPCallCenter />;
      case 'human-ai': return <HumanAI />;
      case 'tren': return <DashboardTren />;
      case 'notifikasi': return <NotifikasiPengingat />;
      default: return <JKNMobileDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <div className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">JKN Mobile</h2>
              <p className="text-xs text-slate-500">Portal Peserta BPJS Kesehatan</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {menuCategories.map(category => (
            <div key={category.id}>
              <div className="flex items-center gap-2 px-2 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <category.icon className="w-4 h-4" />
                {category.label}
              </div>
              <div className="space-y-1 mt-1">
                {category.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-left">{item.label}</span>
                    <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        {renderContent()}
      </div>
    </div>
  );
}
