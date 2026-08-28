import React, { useState } from 'react';
import {
  LayoutDashboard, Users, FileText, Ticket, ClipboardCheck,
  RefreshCcw, Receipt, Bot, FileCode2, TerminalSquare, Settings,
  Activity, Clock, History, ShieldCheck, CalendarClock
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

export function BPJSModule() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard BPJS', icon: LayoutDashboard },
    { id: 'peserta', label: 'Data Peserta', icon: Users },
    { id: 'pcare', label: 'Pelayanan P-Care', icon: Activity },
    { id: 'sep', label: 'Generate SEP', icon: Ticket },
    { id: 'sk', label: 'Surat Kontrol', icon: ClipboardCheck },
    { id: 'prb', label: 'Program Rujuk Balik', icon: RefreshCcw },
    { id: 'rujukan', label: 'Rujukan', icon: FileText },
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
      {/* Inner Sidebar for BPJS */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="font-bold text-slate-800 dark:text-white text-lg">Modul BPJS</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Integrasi P-Care & V-Claim</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {menuItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
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
