import React, { useState } from 'react';
import {
  Smartphone, LayoutDashboard, User, CreditCard, QrCode,
  MapPin, Clock, Bed, Calendar, Video, FileText, Star,
  MessageCircle, Activity, Phone, Heart, Bot, Bell,
  ChevronRight, ChevronLeft, Search, Plus, Edit, RefreshCw
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      {/* Sidebar (Collapsible with smooth transition & hover feedback) */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out`}>
        <div className={`p-4 border-b border-slate-200 dark:border-slate-700 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} transition-all duration-300`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden transition-all duration-300">
                <h2 className="font-bold text-slate-800 dark:text-white text-base leading-tight">JKN Mobile</h2>
                <p className="text-[11px] text-slate-500 truncate">Portal Peserta BPJS</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
            title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Sempitkan Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto space-y-4 custom-scrollbar transition-all duration-300 ${isSidebarCollapsed ? 'p-2' : 'p-3'}`}>
          {menuCategories.map(category => (
            <div key={category.id}>
              {!isSidebarCollapsed ? (
                <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                  <category.icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{category.label}</span>
                </div>
              ) : (
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2 mx-1" />
              )}
              <div className="space-y-1 mt-1">
                {category.items.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`group relative w-full flex items-center gap-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                        isSidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2'
                      } ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold shadow-xs border border-blue-200/70 dark:border-blue-800/60' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/90 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && !isSidebarCollapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                      )}

                      {/* Menu Icon with distinct hover feedback */}
                      <div className={`p-1.5 rounded-lg transition-all duration-200 shrink-0 flex items-center justify-center ${
                        isActive
                          ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm shadow-blue-500/30 scale-105'
                          : 'bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 group-hover:shadow-xs'
                      }`}>
                        <item.icon className="w-3.5 h-3.5 transition-transform duration-200" />
                      </div>

                      {/* Text Label */}
                      {!isSidebarCollapsed && (
                        <>
                          <span className="text-left truncate flex-1">{item.label}</span>
                          <ChevronRight className={`w-3 h-3 ml-auto transition-transform duration-200 ${isActive ? 'opacity-100 text-blue-500 translate-x-0.5' : 'opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5'}`} />
                        </>
                      )}

                      {/* Floating Tooltip when collapsed */}
                      {isSidebarCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 z-50 translate-x-1 group-hover:translate-x-0">
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
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
