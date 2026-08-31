import React, { useState } from 'react';
import { BookOpen, LayoutDashboard, Search, FileText, Printer, FolderTree, Share2, MessageSquare, BarChart3, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardPanduan } from './Tabs/DashboardPanduan';
import { KatalogPanduan } from './Tabs/KatalogPanduan';
import { EditorPanduan } from './Tabs/EditorPanduan';
import { TemplateCetak } from './Tabs/TemplateCetak';
import { KategoriPanduan } from './Tabs/KategoriPanduan';
import { DistribusiPanduan } from './Tabs/DistribusiPanduan';
import { FeedbackPanduan } from './Tabs/FeedbackPanduan';
import { AnalyticsPanduan } from './Tabs/AnalyticsPanduan';
import { PengaturanPanduan } from './Tabs/PengaturanPanduan';

type TabType = 'dashboard' | 'katalog' | 'editor' | 'template' | 'kategori' | 'distribusi' | 'feedback' | 'analytics' | 'pengaturan';

export function PanduanModule() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'katalog', label: 'Katalog Panduan', icon: Search },
    { id: 'editor', label: 'Buat Panduan Baru', icon: FileText },
    { id: 'template', label: 'Template Cetak', icon: Printer },
    { id: 'kategori', label: 'Kategori', icon: FolderTree },
    { id: 'distribusi', label: 'Distribusi', icon: Share2 },
    { id: 'feedback', label: 'Feedback & Review', icon: MessageSquare },
    { id: 'analytics', label: 'Analisis & Statistik', icon: BarChart3 },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardPanduan onNavigate={setActiveTab} />;
      case 'katalog': return <KatalogPanduan />;
      case 'editor': return <EditorPanduan />;
      case 'template': return <TemplateCetak />;
      case 'kategori': return <KategoriPanduan />;
      case 'distribusi': return <DistribusiPanduan />;
      case 'feedback': return <FeedbackPanduan />;
      case 'analytics': return <AnalyticsPanduan />;
      case 'pengaturan': return <PengaturanPanduan />;
      default: return <DashboardPanduan onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Inner Sidebar for Panduan (Collapsible with smooth transition & hover feedback) */}
      <div className={`w-full ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'} bg-white dark:bg-slate-800 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0 transition-all duration-300 ease-in-out`}>
        <div className={`p-4 border-b border-slate-200 dark:border-slate-700 flex items-center ${isSidebarCollapsed ? 'lg:justify-center' : 'justify-between'} transition-all duration-300`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden transition-all duration-300">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white truncate">Pusat Panduan</h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Dokumentasi & SOP</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
            title={isSidebarCollapsed ? 'Perluas Sidebar' : 'Sempitkan Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto space-y-1 custom-scrollbar transition-all duration-300 ${isSidebarCollapsed ? 'p-2' : 'p-3'}`}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`group relative w-full flex items-center gap-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isSidebarCollapsed ? 'lg:justify-center p-2.5' : 'px-3 py-2.5'
                } ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs border border-indigo-200/70 dark:border-indigo-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/90 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && !isSidebarCollapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />
                )}

                {/* Menu Icon with distinct hover feedback */}
                <div className={`p-1.5 rounded-lg transition-all duration-200 shrink-0 flex items-center justify-center ${
                  isActive
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm shadow-indigo-500/30 scale-105'
                    : 'bg-slate-100 dark:bg-slate-700/80 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 group-hover:shadow-xs'
                }`}>
                  <tab.icon className="w-4 h-4 transition-transform duration-200" />
                </div>

                {/* Text Label with smooth width */}
                {!isSidebarCollapsed && (
                  <span className="truncate text-left flex-1 transition-all duration-200">
                    {tab.label}
                  </span>
                )}

                {/* Floating Tooltip when collapsed */}
                {isSidebarCollapsed && (
                  <div className="hidden lg:block absolute left-full ml-3 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700/80 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 z-50 translate-x-1 group-hover:translate-x-0">
                    {tab.label}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default PanduanModule;
