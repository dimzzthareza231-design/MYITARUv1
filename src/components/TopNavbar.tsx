import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULE_REGISTRY } from '../data/moduleRegistry';
import { useAuth } from '../contexts/AuthContext';
import { useHospital } from '../contexts/HospitalContext';
import UserMenu from './UserMenu';
import { Activity, Globe, Sparkles } from 'lucide-react';
import { MedicalSearchGrounding } from './MedicalSearchGrounding';

export default function TopNavbar({ currentTime }: { currentTime: Date }) {
  const navigate = useNavigate();
  const { hasAccess, currentUser } = useAuth();
  const { hospitalSettings } = useHospital();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  
  // Filter kategori dan modul yang hanya memiliki izin akses sesuai role pengguna
  const accessibleCategories = useMemo(() => {
    return MODULE_REGISTRY.map(cat => {
      const allowedModules = cat.modules.filter(mod => hasAccess(mod.id));
      return {
        ...cat,
        modules: allowedModules
      };
    }).filter(cat => cat.modules.length > 0);
  }, [hasAccess]);
  
  // Tutup semua dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenCategory(null);
        setOpenSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const formatTime = (d: Date) => d.toLocaleTimeString('id-ID');
  
  return (
    <header className="bg-gradient-to-r from-[#0B1E36] via-[#102A4E] to-[#0F2F52] border-b border-[#C9A94E]/30 shadow-[0_4px_25px_rgba(11,30,54,0.6)] sticky top-0 z-50 backdrop-blur-md" ref={navRef}>
      {/* Top subtle luxury gold line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C9A94E] to-transparent opacity-70"></div>
      <div className="flex justify-between items-center px-4 max-w-[1600px] mx-auto h-16">
        
        {/* KIRI: Logo */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 h-full hover:opacity-90 transition-opacity group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-[#0F3B5E] via-[#1A4F7A] to-[#C9A94E] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(201,169,78,0.3)] border border-[#C9A94E]/40 group-hover:scale-105 transition-transform overflow-hidden p-0.5">
            {hospitalSettings?.logoUrl ? (
              <img src={hospitalSettings.logoUrl} alt="Logo RS" className="w-full h-full object-contain rounded-lg bg-white/10" />
            ) : (
              <Activity className="text-white w-5 h-5 drop-shadow-md" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-[#C9A94E] leading-tight tracking-wider truncate max-w-[220px]">
                {hospitalSettings?.name || 'MYITARU'}
              </h1>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C9A94E]/20 text-[#E5CA78] border border-[#C9A94E]/30 uppercase tracking-wider shrink-0">PRO</span>
            </div>
            <p className="text-[9px] text-slate-300 uppercase tracking-widest font-medium truncate max-w-[240px]">
              {hospitalSettings?.subname || 'Sistem Informasi Klinik'}
            </p>
          </div>
        </button>
        
        {/* TENGAH: Menu Kategori (OPSI A) */}
        <nav className="hidden xl:flex items-center h-full ml-8 flex-1">
          {accessibleCategories.map(cat => (
            <div key={cat.id} className="relative h-full flex items-center">
              {/* Tombol Kategori */}
              <button
                onClick={() => {
                  setOpenCategory(openCategory === cat.id ? null : cat.id);
                  setOpenSubmenu(null);
                }}
                className={`h-full px-4 flex items-center gap-2 font-semibold text-sm transition-all duration-200 ${
                  openCategory === cat.id 
                    ? 'bg-gradient-to-b from-[#163F69] to-[#0F3054] text-white shadow-inner border-b-2 border-[#C9A94E]' 
                    : `text-slate-200 ${cat.navColor} hover:text-white hover:bg-white/5`
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
              
              {/* Dropdown Modul */}
              {openCategory === cat.id && (
                <div className="absolute top-full left-0 w-64 bg-[#0D2440] border-x border-b border-[#C9A94E]/30 rounded-b-xl shadow-2xl overflow-visible z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
                  <div className="py-2">
                    {cat.modules.map(mod => (
                      <div key={mod.id} className="relative group/module">
                        <button
                          onClick={() => {
                            if (mod.submenus.length > 0) {
                              setOpenSubmenu(openSubmenu === mod.id ? null : mod.id);
                            } else {
                              navigate(`/modul/${mod.id}`);
                              setOpenCategory(null);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${openSubmenu === mod.id ? 'bg-[#1A4B7C] text-white font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white'}`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{mod.icon}</span>
                            <span>{mod.label}</span>
                          </span>
                          {mod.submenus.length > 0 && <span className="text-xs text-[#C9A94E]">▶</span>}
                        </button>
                        
                        {/* Flyout Submenu */}
                        {openSubmenu === mod.id && mod.submenus.length > 0 && (
                          <div className="absolute top-0 left-full w-56 bg-[#112F54] border border-[#C9A94E]/30 rounded-r-xl shadow-2xl animate-in fade-in slide-in-from-left-2 duration-200 overflow-hidden">
                            <div className="py-2">
                              {mod.submenus.map((sub: any) => {
                                const subLabel = typeof sub === 'string' ? sub : sub.label;
                                return (
                                  <button
                                    key={subLabel}
                                    onClick={() => {
                                      navigate(`/modul/${mod.id}?tab=${encodeURIComponent(subLabel)}`);
                                      setOpenCategory(null);
                                      setOpenSubmenu(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-[#1A4B7C] hover:text-[#E5CA78] transition-colors"
                                  >
                                    {subLabel}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {/* KANAN: Search Grounding + Jam + UserMenu */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Tombol Search Grounding */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0F3B5E] to-[#1C4E7D] hover:from-[#164C7A] hover:to-[#245F96] text-white text-xs font-bold border border-[#C9A94E]/40 shadow-[0_2px_10px_rgba(201,169,78,0.15)] transition-all cursor-pointer"
            title="Google Search Grounding Klinis (Live Web Data)"
          >
            <Globe className="w-3.5 h-3.5 text-[#E5CA78] animate-spin-slow" />
            <span className="hidden sm:inline">Search Grounding</span>
            <span className="bg-[#C9A94E]/20 text-[#E5CA78] text-[10px] px-1.5 py-0.2 rounded font-mono border border-[#C9A94E]/30">AI Web</span>
          </button>

          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-[#E5CA78] tabular-nums bg-[#08182B]/80 px-3 py-1 rounded-lg border border-[#C9A94E]/30 shadow-inner">{formatTime(currentTime)}</div>
          </div>
          <UserMenu />
        </div>
      </div>
      
      {/* Menu Mobile (hamburger) */}
      <div className="xl:hidden px-4 pb-3">
        <select
          onChange={(e) => { if (e.target.value) navigate(e.target.value); }}
          className="w-full p-2.5 rounded-lg bg-slate-900 text-white border border-slate-700 font-medium appearance-none focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        >
          <option value="">☰ Navigasi Menu...</option>
          {accessibleCategories.map(cat => (
            <optgroup key={cat.id} label={`${cat.icon} ${cat.label}`}>
              {cat.modules.map(mod => (
                <option key={mod.id} value={`/modul/${mod.id}`}>
                  {mod.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Modal Popup Search Grounding */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <MedicalSearchGrounding
              isOpen={showSearchModal}
              onClose={() => setShowSearchModal(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}
