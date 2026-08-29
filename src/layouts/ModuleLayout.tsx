import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { findModule } from '../data/moduleRegistry';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ModuleLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTime, setCurrentTime] = useState(new Date());

  const { hasAccess, currentUser } = useAuth();
  const { moduleId: paramModuleId } = useParams();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Extract module ID from URL (e.g. /modul/patient-flow -> patient-flow)
  const pathParts = location.pathname.split('/');
  const moduleId = paramModuleId || pathParts[pathParts.length - 1];

  const isGoogleBlocked = Boolean(currentUser?.isGoogleAuth);
  const hasModuleAccess = !moduleId || !currentUser || (hasAccess(moduleId) && !isGoogleBlocked);

  // Proteksi: jika user tidak punya akses, redirect ke dashboard
  useEffect(() => {
    if (moduleId && currentUser) {
      if (isGoogleBlocked) {
        toast.error('Anda tidak berhak mengakses modul ini', { id: 'pelayanan-block' });
        navigate('/dashboard');
      } else if (!hasAccess(moduleId)) {
        toast.error('Anda tidak memiliki akses ke modul ini');
        navigate('/');
      }
    }
  }, [moduleId, currentUser, navigate, hasAccess, isGoogleBlocked]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const hasOpenModal = document.querySelector('[role="dialog"]') !== null || 
                             document.querySelector('.fixed.inset-0:not(.top-navbar-overlay)') !== null;
        if (!hasOpenModal) {
          navigate('/dashboard');
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!hasModuleAccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 flex-col">
        <div className="text-center bg-slate-800 p-10 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-slate-400">Anda tidak memiliki izin untuk mengakses modul ini.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-8 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const found = findModule(moduleId);
  const config = found ? found.module : { label: moduleId, icon: '⚙️', submenus: [] };
  const category = found ? found.category : null;

  // Default tab or tab from URL
  const defaultTab = (config.submenus && config.submenus.length > 0) ? (typeof config.submenus[0] === 'string' ? config.submenus[0] : (config.submenus[0]?.label || 'Data')) : 'Data';
  const activeTab = searchParams.get('tab') || defaultTab;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col w-full text-slate-200">
      
      {/* 1. NAVBAR (OPSI A) */}
      <TopNavbar currentTime={currentTime} />

      {/* Konten Utama */}
      <main className="flex-1 w-full relative pb-24 flex flex-col max-w-[1600px] mx-auto px-4 sm:px-6 pt-6">
        
        {/* 2. BREADCRUMB */}
        <nav className="mb-4 flex items-center gap-2 text-sm flex-wrap bg-slate-800/50 p-3 rounded-lg border border-slate-700 w-fit shadow-inner">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-cyan-400 hover:text-cyan-300 hover:underline font-semibold flex items-center gap-1 transition-colors"
          >
            <span>🏠</span> Dashboard
          </button>
          <span className="text-slate-600">/</span>
          {category && (
            <>
              <span className="text-slate-400 flex items-center gap-1">
                <span>{category.icon}</span> {category.label}
              </span>
              <span className="text-slate-600">/</span>
            </>
          )}
          <span className="text-white font-bold flex items-center gap-1 drop-shadow-sm">
            <span>{config.icon}</span> {config.label}
          </span>
        </nav>

        {/* HEADER MODUL + TOMBOL KEMBALI */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-xl">←</span> Kembali
            </button>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 flex items-center gap-3">
              <span className="text-white drop-shadow-md">{config.icon}</span> {config.label}
            </h1>
          </div>
        </div>

        {/* SUBMENU TABS */}
        {config.submenus && config.submenus.length > 0 && (
          <div className="bg-slate-800 rounded-xl shadow-lg p-2 mb-6 overflow-x-auto border border-slate-700 hide-scrollbar flex items-center">
            <div className="flex gap-2 min-w-max">
              {config.submenus.map((sub: any) => {
                const label = typeof sub === 'string' ? sub : sub.label;
                return (
                  <button
                    key={label}
                    onClick={() => setSearchParams({ tab: label })}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                      activeTab === label
                        ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/50 scale-100'
                        : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200 scale-95 hover:scale-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* INFO HINT */}
        <div className="mb-6 bg-cyan-900/20 border border-cyan-800/50 rounded-xl p-4 text-sm text-cyan-200 flex gap-3 items-start backdrop-blur-sm">
          <span className="text-xl">💡</span>
          <p className="leading-relaxed">
            <strong>Panduan:</strong> Ini adalah modul <strong>{config.label}</strong>. Anda dapat kembali ke Dashboard kapan saja dengan menekan tombol <strong>ESC</strong>, tombol <strong>← Kembali</strong> di atas, atau tombol <strong>🏠 Dashboard</strong> di pojok kiri bawah.
          </p>
        </div>

        {/* Konten Modul Spesifik (Outlet) */}
        <div className="w-full flex-1 bg-slate-800/30 rounded-2xl border border-slate-700/30 shadow-2xl relative">
          <Outlet context={{ activeTab }} />
        </div>

      </main>

      {/* FLOATING BUTTON KEMBALI */}
      <button
        onClick={() => navigate('/dashboard')}
        className="fixed bottom-8 left-8 z-[60] flex items-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-4 rounded-full shadow-[0_10px_25px_-5px_rgba(8,145,178,0.5)] hover:shadow-[0_15px_35px_-5px_rgba(8,145,178,0.6)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 font-bold border border-cyan-400/30 group"
        title="Kembali ke Dashboard"
      >
        <span className="text-2xl group-hover:animate-bounce">🏠</span>
        <span className="hidden sm:inline tracking-wide">Dashboard</span>
      </button>

    </div>
  );
}
