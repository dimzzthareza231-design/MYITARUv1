import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  LayoutDashboard, Users, FileText, Ticket, ClipboardCheck,
  RefreshCcw, Receipt, Bot, FileCode2, TerminalSquare, Settings,
  Activity, Clock, History, ShieldCheck, CalendarClock,
  ChevronLeft, ChevronRight, MapPin
} from 'lucide-react';
import { DashboardBPJS } from './Tabs/DashboardBPJS';
import { DataPesertaBPJS } from './Tabs/DataPesertaBPJS';
import { RujukanBPJS } from './Tabs/RujukanBPJS';
import { GenerateSEP } from './Tabs/GenerateSEP';
import { KlaimBPJS } from './Tabs/KlaimBPJS';
import { AIValidatorBPJS } from './Tabs/AIValidatorBPJS';
import { MappingKodeBPJS } from './Tabs/MappingKodeBPJS';
import { LogVClaim } from './Tabs/LogVClaim';
import { SuratKontrolBPJS } from './Tabs/SuratKontrolBPJS';
import { ProgramRujukBalikBPJS } from './Tabs/ProgramRujukBalikBPJS';
import { PengaturanVClaim } from './Tabs/PengaturanVClaim';
import { PCareKunjungan } from './Tabs/PCareKunjungan';
import { AntreanOnlineBPJS } from './Tabs/AntreanOnlineBPJS';
import { ICareJKN } from './Tabs/ICareJKN';
import { GoogleMapsHealthLocator } from '../Common/GoogleMapsHealthLocator';

export function BPJSModule() {
  const outletCtx = useOutletContext<{ activeTab?: string }>();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Synchronize with activeTab from ModuleLayout router outlet
  useEffect(() => {
    if (outletCtx?.activeTab) {
      const tab = outletCtx.activeTab.toLowerCase();
      if (tab.includes('dashboard')) setActiveTab('dashboard');
      else if (tab.includes('peserta')) setActiveTab('peserta');
      else if (tab.includes('pcare') || tab.includes('p-care')) setActiveTab('pcare');
      else if (tab.includes('sep')) setActiveTab('sep');
      else if (tab.includes('surat kontrol') || tab.includes('sk')) setActiveTab('sk');
      else if (tab.includes('rujuk balik') || tab.includes('prb')) setActiveTab('prb');
      else if (tab.includes('rujukan')) setActiveTab('rujukan');
      else if (tab.includes('klaim') || tab.includes('ina-cbg') || tab.includes('vedika') || tab.includes('validator')) setActiveTab('klaim');
      else if (tab.includes('antrean') || tab.includes('antrian')) setActiveTab('antrean');
      else if (tab.includes('icare') || tab.includes('i-care')) setActiveTab('icare');
      else if (tab.includes('faskes') || tab.includes('maps') || tab.includes('peta')) setActiveTab('faskes-maps');
      else if (tab.includes('mapping')) setActiveTab('mapping');
      else if (tab.includes('log')) setActiveTab('log');
      else if (tab.includes('pengaturan') || tab.includes('vclaim') || tab.includes('v-claim')) setActiveTab('pengaturan');
    }
  }, [outletCtx?.activeTab]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard BPJS', icon: LayoutDashboard },
    { id: 'peserta', label: 'Data Peserta', icon: Users },
    { id: 'pcare', label: 'Pelayanan P-Care', icon: Activity },
    { id: 'sep', label: 'Generate SEP', icon: Ticket },
    { id: 'sk', label: 'Surat Kontrol', icon: ClipboardCheck },
    { id: 'prb', label: 'Program Rujuk Balik', icon: RefreshCcw },
    { id: 'rujukan', label: 'Rujukan', icon: FileText },
    { id: 'faskes-maps', label: 'Peta Faskes BPJS', icon: MapPin },
    { id: 'klaim', label: 'Manajemen Klaim', icon: Receipt },
    { id: 'antrean', label: 'Antrean Online', icon: Clock },
    { id: 'icare', label: 'i-Care JKN', icon: History },
    { id: 'mapping', label: 'Mapping Kode', icon: FileCode2 },
    { id: 'log', label: 'Log Integrasi API', icon: TerminalSquare },
    { id: 'pengaturan', label: 'Pengaturan V-Claim', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardBPJS onNavigate={setActiveTab} />;
      case 'peserta': return <DataPesertaBPJS />;
      case 'pcare': return <PCareKunjungan />;
      case 'sep': return <GenerateSEP />;
      case 'sk': return <SuratKontrolBPJS />;
      case 'prb': return <ProgramRujukBalikBPJS />;
      case 'rujukan': return <RujukanBPJS />;
      case 'faskes-maps': return (
        <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">
          <GoogleMapsHealthLocator
            initialQuery="Fasilitas Kesehatan Tingkat Pertama (FKTP) dan Rumah Sakit Rujukan BPJS Kesehatan"
            defaultCategory="bpjs"
            title="Peta Jejaring Faskes & Rujukan BPJS Kesehatan"
            subtitle="Cari FKTP, Klinik Pratama, Puskesmas, dan RS Rujukan Berjenjang Terakreditasi BPJS dengan Google Maps"
          />
        </div>
      );
      case 'klaim': return <KlaimBPJS />;
      case 'antrean': return <AntreanOnlineBPJS />;
      case 'icare': return <ICareJKN />;
      case 'mapping': return <MappingKodeBPJS />;
      case 'log': return <LogVClaim />;
      case 'pengaturan': return <PengaturanVClaim />;
      default: return <DashboardBPJS onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Inner Sidebar for BPJS (Collapsible with smooth transitions & hover feedback) */}
      <div className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out`}>
        <div className={`p-4 border-b border-slate-200 dark:border-slate-700 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} transition-all duration-300`}>
          {!isSidebarCollapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <h2 className="font-bold text-slate-800 dark:text-white text-base leading-tight">Modul BPJS</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Integrasi P-Care & V-Claim</p>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
            title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Sempitkan Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto space-y-1 custom-scrollbar transition-all duration-300 ${isSidebarCollapsed ? 'p-2' : 'p-3'}`}>
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative w-full flex items-center gap-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isSidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5'
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
                  <item.icon className="w-4 h-4 transition-transform duration-200" />
                </div>

                {/* Text Label with smooth width */}
                {!isSidebarCollapsed && (
                  <span className="truncate text-left flex-1 transition-all duration-200">
                    {item.label}
                  </span>
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        {renderContent()}
      </div>
    </div>
  );
}
