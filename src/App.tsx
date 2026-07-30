import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { PatientManagement } from './components/PatientManagement';
import { MedicalRecords } from './components/MedicalRecords';
import { StaffManagement } from './components/StaffManagement';
import { Billing } from './components/Billing';
import { Analytics } from './components/Analytics';
import { Claims } from './components/Claims';
import { Security } from './components/Security';
import { Settings } from './components/Settings';
import { FormsModule } from './components/FormsModule';
import { Pharmacy } from './components/Pharmacy';
import { BedManagement } from './components/BedManagement';
import { LoginScreen } from './components/LoginScreen';
import { Wifi, WifiOff, RefreshCw, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useHospital } from './contexts/HospitalContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  
  const { activeUser, users, setActiveUser } = useHospital();
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Simulate sync upon reconnecting
      setIsSyncing(true);
      setSyncProgress(0);
      
      const interval = setInterval(() => {
        setSyncProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSyncing(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    };
    
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync simulation if online
    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-midnight text-[#e0e0e0] flex overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} onLogout={() => setIsAuthenticated(false)} />
      
      <main className="flex-1 ml-64 h-screen overflow-hidden flex flex-col relative z-10">
        <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-panel/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold tracking-tight capitalize text-white">
              {currentView.replace('-', ' ')}
            </h2>
            
            {/* Dynamic Status Indicator */}
            {isSyncing ? (
               <div className="px-2 py-0.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                 <RefreshCw className="w-3 h-3 animate-spin" />
                 Syncing {syncProgress}%
               </div>
            ) : isOnline ? (
               <div className="px-2 py-0.5 rounded-full border border-primary-emerald/30 bg-primary-emerald/10 text-[10px] text-primary-emerald font-bold uppercase tracking-widest flex items-center gap-1.5">
                 <Wifi className="w-3 h-3" />
                 <span className="w-1.5 h-1.5 rounded-full bg-primary-emerald shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                 Online & Synced
               </div>
            ) : (
               <div className="px-2 py-0.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-[10px] text-orange-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                 <WifiOff className="w-3 h-3" />
                 <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse" />
                 Offline Mode
               </div>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-4 hover:bg-white/5 p-2 rounded-xl transition-colors text-left"
            >
              <div className="hidden md:block">
                <div className="text-xs font-semibold text-white">{activeUser?.name || 'Unknown User'}</div>
                <div className="text-[10px] text-white/40 uppercase">{activeUser?.role || 'Staff'} • {activeUser?.department || 'General'}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <span className="text-blue-400 text-xs font-bold">{activeUser?.initials || '??'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/40 hidden md:block" />
            </button>
            
            <AnimatePresence>
              {showUserMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-panel border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-white/5 bg-white/5">
                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider">Change Shift / User</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {users.map((u) => (
                      <button 
                        key={u.id}
                        onClick={() => { setActiveUser(u); setShowUserMenu(false); }}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${activeUser?.id === u.id ? 'bg-primary-emerald/10 border-primary-emerald/20 border' : 'hover:bg-white/5 border border-transparent'}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-white/60">{u.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold truncate ${activeUser?.id === u.id ? 'text-primary-emerald' : 'text-white'}`}>{u.name}</div>
                          <div className="text-[10px] text-white/40 truncate">{u.role}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 relative">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'ai-assistant' && <AIAssistant />}
          {currentView === 'patients' && <PatientManagement />}
          {currentView === 'records' && <MedicalRecords />}
          {currentView === 'staff' && <StaffManagement />}
          {currentView === 'invoices' && <Billing />}
          {currentView === 'analytics' && <Analytics />}
          {currentView === 'claims' && <Claims />}
                    {currentView === 'forms-doctor' && <FormsModule />}
          {currentView === 'forms-nurse' && <FormsModule />}
          {currentView === 'forms-medical-record' && <FormsModule />}
          {currentView === 'beds' && <BedManagement />}
          {currentView === 'pharmacy' && <Pharmacy />}
          {currentView === 'security' && <Security />}
          {currentView === 'settings' && <Settings />}
          
          {/* Placeholder for other views */}
          {[''].includes(currentView) && (
            <div className="h-full glass-panel flex items-center justify-center text-white/40">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2 capitalize">{currentView} Module</h3>
                <p>This module is currently in development.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
