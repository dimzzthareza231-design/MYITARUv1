import React, { useState } from 'react';
import { BookOpen, LayoutDashboard, Search, FileText, Printer, FolderTree, Share2, MessageSquare, BarChart3, Settings } from 'lucide-react';
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
      {/* Inner Sidebar for Panduan */}
      <div className="w-full lg:w-64 bg-white dark:bg-slate-800 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">Pusat Panduan</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dokumentasi & SOP SIMRS</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
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
