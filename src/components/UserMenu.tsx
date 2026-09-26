import React, { useState } from 'react';
import { useHospital } from '../contexts/HospitalContext';
import { useAuth } from '../contexts/AuthContext';
import { getRoleById } from '../data/roles';
import { LogOut, User, Moon, Sun, Settings, CloudCheck, Shield } from 'lucide-react';
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
    toast.success('Anda telah logout dari MYITARU SIMRS');
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full pl-1.5 pr-4 py-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        {photoURL ? (
          <img 
            src={photoURL} 
            alt={displayName} 
            referrerPolicy="no-referrer"
            className="w-8 h-8 rounded-full object-cover border border-cyan-400"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {displayName.charAt(0)}
          </div>
        )}
        
        <div className="hidden sm:block text-left">
          <div className="text-sm font-semibold text-white leading-tight flex items-center gap-1.5">
            <span>{displayName.split(' ')[0]}</span>
            {currentUser?.isGoogleAuth && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Google Firebase Authenticated" />
            )}
          </div>
          <div className="text-[10px] text-cyan-400 font-medium">
            {roleName}
          </div>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden transform transition-all origin-top-right">
            <div className="p-4 border-b border-slate-700 bg-slate-800/80">
              <div className="flex items-center gap-3">
                {photoURL ? (
                  <img 
                    src={photoURL} 
                    alt={displayName} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-base">
                    {displayName.charAt(0)}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{displayName}</p>
                  <p className="text-xs text-slate-400 truncate">{currentUser?.email || roleName}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                    <Shield className="w-3 h-3" /> {roleName}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <div className="px-3 py-1.5 mb-1 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Firestore Cloud DB:</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  ● Aktif (Auto-sync)
                </span>
              </div>

              <button onClick={toggleDarkMode} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 rounded-xl transition-colors">
                {isDarkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-400" />}
                <span>Tema {isDarkMode ? 'Terang' : 'Gelap'}</span>
              </button>
            </div>

            <div className="p-2 border-t border-slate-700 bg-slate-800/50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors font-medium"
              >
                <LogOut size={16} />
                <span>Logout Keluar</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
