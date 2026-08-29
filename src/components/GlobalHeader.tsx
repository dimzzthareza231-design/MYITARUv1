import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Sun, Moon, LogOut, User, ChevronRight, ArrowLeft } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';
import NotificationBell from './NotificationBell';
import toast from 'react-hot-toast';
import LogoutButton from './LogoutButton';

export function GlobalHeader({ 
  currentView, 
  setIsSidebarOpen, 
  onLogout,
  onNavigate
}: { 
  currentView: string, 
  setIsSidebarOpen: (v: boolean) => void,
  onLogout: () => void,
  onNavigate: (view: string) => void
}) {
  const { isDarkMode, toggleDarkMode, activeUser, hospitalSettings, isFirestoreSyncing, cloudStatus } = useHospital();
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const searchRef = useRef<HTMLInputElement>(null);

  // Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatViewName = (view: string) => {
    return view.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const searchResults = [
    { type: 'Module', title: 'Dashboard', desc: 'Ringkasan Utama', id: 'dashboard' },
    { type: 'Module', title: 'Pendaftaran', desc: 'Registrasi Pasien Baru', id: 'registrasi' },
    { type: 'Module', title: 'Billing', desc: 'Kasir & Pembayaran', id: 'billing' },
    { type: 'Patient', title: 'Budi Santoso', desc: 'RM-000001', id: 'rekam-medis' }
  ].filter(item => 
    searchQuery && (item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 flex items-center justify-between px-4 sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        {currentView !== 'dashboard' && (
           <button 
             onClick={() => onNavigate('dashboard')}
             className="hidden lg:flex p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
             title="Kembali"
           >
             <ArrowLeft className="w-5 h-5" />
           </button>
        )}
        
        <div className="hidden lg:flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
           <div 
             className="flex items-center gap-2 cursor-pointer hover:text-[var(--color-primary-blue)] transition-colors"
             onClick={() => onNavigate('dashboard')}
           >
             {hospitalSettings?.logoUrl && (
               <img src={hospitalSettings.logoUrl} alt="Logo Klinik" className="w-5 h-5 object-contain rounded" />
             )}
             <span className="text-slate-800 dark:text-slate-200 font-bold">
               {hospitalSettings?.name || 'MYITARU'}
             </span>
           </div>
           <ChevronRight className="w-4 h-4 mx-1" />
           <span className="text-[var(--color-primary-blue)] cursor-default">{formatViewName(currentView)}</span>
        </div>

        <div className="relative max-w-md w-full ml-4 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            ref={searchRef}
            type="text" 
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setShowSearch(e.target.value.length > 0);
            }}
            onFocus={() => setShowSearch(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            placeholder="Search modules, patients... (Ctrl+K)" 
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent rounded-lg text-sm focus:bg-white dark:focus:bg-slate-900 focus:border-[var(--color-primary-blue)] focus:ring-1 focus:ring-[var(--color-primary-blue)] transition-all outline-none"
          />
          
          {showSearch && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
               {searchResults.length > 0 ? (
                 <div className="py-2">
                   {searchResults.map((res, i) => (
                     <div 
                       key={i} 
                       className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex justify-between items-center"
                       onClick={() => {
                         onNavigate(res.id);
                         setSearchQuery('');
                         setShowSearch(false);
                       }}
                     >
                       <div>
                         <div className="font-bold text-sm">{res.title}</div>
                         <div className="text-xs text-slate-500">{res.desc}</div>
                       </div>
                       <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded text-slate-500">{res.type}</span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-4 text-center text-sm text-slate-500">Tidak ada hasil untuk "{searchQuery}"</div>
               )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div 
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
          title="Database Cloud Firebase Firestore aktif dan tersinkronisasi otomatis secara real-time"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Cloud DB: Firebase</span>
          {isFirestoreSyncing && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
              (Syncing...)
            </span>
          )}
        </div>

        <button 
          onClick={toggleDarkMode}
          className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="relative">
          <NotificationBell />
        </div>

        <LogoutButton onLogout={onLogout} />

        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-blue)] flex items-center justify-center text-white font-bold text-sm">
              {activeUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-bold leading-tight">{activeUser?.name}</div>
              <div className="text-xs text-slate-500 leading-tight">{activeUser?.role}</div>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-1">
              <button 
                onClick={() => {
                  onNavigate('profile');
                  setShowProfile(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <User className="w-4 h-4" /> Profil Saya
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
