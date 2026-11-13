import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { useAuth } from '../contexts/AuthContext';
import { getRoleById } from '../data/roles';
import { LogOut, User, Moon, Sun, Settings, CloudCheck, Shield, ChevronDown, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserMenu() {
  const { isDarkMode, toggleDarkMode, isFirestoreSyncing } = useHospital();
  const { currentUser, logout, firebaseUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const currentRole = currentUser ? getRoleById(currentUser.roleId) : null;
  const displayName = currentUser?.nama || 'Admin ITARU';
  const roleName = currentRole?.nama || 'Administrator';
  const photoURL = currentUser?.photoURL || firebaseUser?.photoURL;

  const handleLogout = async () => {
    await logout();
    toast.success('Anda telah logout dari MYITARU SIMK');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#C9A94E]/40 rounded-full pl-1.5 pr-3 py-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-[#C9A94E]/40 shadow-sm group"
      >
        {photoURL ? (
          <img 
            src={photoURL} 
            alt={displayName} 
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover border border-[#C9A94E]/60 shadow-xs"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1B4370] via-[#0E2849] to-[#C9A94E] flex items-center justify-center text-white text-xs font-bold shadow-xs border border-[#C9A94E]/40 group-hover:scale-105 transition-transform">
            {displayName.charAt(0)}
          </div>
        )}
        
        <div className="hidden sm:block text-left">
          <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
            <span className="truncate max-w-[90px]">{displayName.split(' ')[0]}</span>
            {currentUser?.isGoogleAuth && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Google Firebase Authenticated" />
            )}
          </div>
          <div className="text-[10px] text-[#E8D49E] font-medium truncate max-w-[100px]">
            {roleName}
          </div>
        </div>

        <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-white transition-transform ${isOpen ? 'rotate-180 text-[#E8D49E]' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2.5 w-68 bg-[#0A1627]/98 border border-[#C9A94E]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
            {/* Top gold accent line */}
            <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#E8D49E]/70 to-transparent"></div>

            <div className="p-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                {photoURL ? (
                  <img 
                    src={photoURL} 
                    alt={displayName} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#C9A94E]/60 shadow-md" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1A4577] to-[#C9A94E] flex items-center justify-center text-white font-bold text-base shadow-md border border-[#C9A94E]/40">
                    {displayName.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser?.email || roleName}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#C9A94E]/15 text-[#E8D49E] border border-[#C9A94E]/30 uppercase tracking-wider">
                    <Shield className="w-2.5 h-2.5" /> {roleName}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between rounded-xl bg-white/[0.02] border border-white/5">
                <span>Database Sync:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                  ● Terhubung Cloud
                </span>
              </div>

              <button 
                onClick={toggleDarkMode} 
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {isDarkMode ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-slate-400" />}
                  <span>Mode Tampilan</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {isDarkMode ? 'Gelap' : 'Terang'}
                </span>
              </button>
            </div>

            <div className="p-2 border-t border-white/10 bg-black/20">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 rounded-xl transition-colors font-semibold"
              >
                <LogOut size={15} />
                <span>Logout Keluar SIMK</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
