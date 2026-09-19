import React, { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { 
  Shield, Users, Key, Lock, FileClock, CheckCircle, ShieldAlert, Activity,
  RefreshCw, Save, Search, Check, X, AlertTriangle, Clock, Radio, UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ActivityLogsTab } from './ActivityLogsTab';
import { UserManagement } from './UserManagement';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, getRoleById, getCustomPermissions, saveCustomPermissions, COMMON_MODULES } from '../../data/roles';
import { MODULE_REGISTRY } from '../../data/moduleRegistry';
import { subscribeActivityLogs, ActivityLogEntry } from '../../lib/activityLogger';

export function AuthManagement() {
  const [searchParams] = useSearchParams();
  const outletContext = useOutletContext<{ activeTab?: string }>();
  const [activeTab, setActiveTab] = useState<'activity' | 'login' | 'users' | 'roles' | 'sessions' | 'audit'>('activity');

  // Sync tab with URL query parameter or outlet context
  useEffect(() => {
    const requestedTab = (outletContext?.activeTab || searchParams.get('tab') || '').toLowerCase();
    if (requestedTab.includes('activity') || requestedTab.includes('aktivitas') || requestedTab.includes('log')) {
      setActiveTab('activity');
    } else if (requestedTab.includes('user') || requestedTab.includes('pengguna')) {
      setActiveTab('users');
    } else if (requestedTab.includes('role') || requestedTab.includes('peran')) {
      setActiveTab('roles');
    } else if (requestedTab.includes('session') || requestedTab.includes('sesi')) {
      setActiveTab('sessions');
    } else if (requestedTab.includes('login') || requestedTab.includes('2fa')) {
      setActiveTab('login');
    } else if (requestedTab.includes('audit')) {
      setActiveTab('audit');
    }
  }, [outletContext?.activeTab, searchParams]);

  const tabs = [
    { id: 'activity', label: 'Activity Logs', icon: Activity, badge: 'Real-time' },
    { id: 'login', label: 'Login & 2FA', icon: Lock },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Roles & Permissions', icon: Key },
    { id: 'sessions', label: 'Session Management', icon: Shield },
    { id: 'audit', label: 'Audit Log', icon: FileClock },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
            <ShieldAlert className="w-7 h-7 text-indigo-600" />
            Security & Auth System
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manajemen akses, pemantauan log autentikasi Firebase & database Cloud Firestore waktu nyata, role matrix, dan audit trail.
          </p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {activeTab === 'activity' && <ActivityLogsTab />}
        {activeTab === 'login' && <LoginSimulator />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'roles' && <RolesTab />}
        {activeTab === 'sessions' && <SessionsTab />}
        {activeTab === 'audit' && <AuditTab />}
      </div>
    </div>
  );
}

function LoginSimulator() {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    toast.success("OTP dikirim ke device Anda");
  };

  const handle2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if(code === '123456') {
      toast.success("Login Berhasil!");
      setStep(3);
    } else {
      toast.error("Kode salah! (Gunakan 123456)");
    }
  };

  return (
    <div className="card p-8 max-w-md mx-auto mt-10 shadow-xl border-t-4 border-t-indigo-600">
      <div className="text-center mb-6">
        <Shield className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
        <h2 className="text-xl font-bold">Secure Login Simulator</h2>
      </div>

      {step === 1 && (
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Username</label><input type="text" className="input-field" defaultValue="admin" /></div>
          <div><label className="block text-sm font-medium mb-1">Password</label><input type="password" className="input-field" defaultValue="password123" /></div>
          <button type="submit" className="btn-primary w-full bg-indigo-600">Login</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handle2FA} className="space-y-4 text-center">
          <p className="text-sm text-slate-600">Masukkan 6 digit kode 2FA dari Authenticator App.</p>
          <input type="text" className="input-field text-center font-mono text-2xl tracking-widest" maxLength={6} placeholder="------" value={code} onChange={e=>setCode(e.target.value)} autoFocus />
          <p className="text-xs text-slate-400">Hint: 123456</p>
          <button type="submit" className="btn-primary w-full bg-indigo-600">Verify</button>
        </form>
      )}

      {step === 3 && (
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-emerald-600 text-lg">Authenticated Successfully</h3>
          <button onClick={() => {setStep(1); setCode('');}} className="btn-secondary w-full">Logout / Reset Simulator</button>
        </div>
      )}
    </div>
  );
}

function RolesTab() {
  const [selectedRoleId, setSelectedRoleId] = useState<string>('dokter');
  const [searchModule, setSearchModule] = useState('');
  const [permissions, setPermissions] = useState<Record<string, string[]>>(() => {
    const custom = getCustomPermissions();
    const initial: Record<string, string[]> = {};
    ROLES.forEach(r => {
      initial[r.id] = custom[r.id] || [...r.moduleAccess];
    });
    return initial;
  });

  const selectedRole = ROLES.find(r => r.id === selectedRoleId) || ROLES[0];
  const activeRolePermissions = permissions[selectedRoleId] || [];

  const handleToggleModule = (moduleId: string) => {
    if (selectedRoleId === 'super_admin') {
      toast.error('Super Admin memiliki akses mutlak ke seluruh modul dan tidak dapat dibatasi.');
      return;
    }
    if (COMMON_MODULES.includes(moduleId)) {
      toast.error('Modul ini adalah modul dasar sistem yang terbuka untuk seluruh pengguna.');
      return;
    }

    setPermissions(prev => {
      const current = prev[selectedRoleId] || [];
      const updated = current.includes(moduleId)
        ? current.filter(m => m !== moduleId)
        : [...current, moduleId];
      return {
        ...prev,
        [selectedRoleId]: updated
      };
    });
  };

  const handleSelectAllCategory = (moduleIds: string[], select: boolean) => {
    if (selectedRoleId === 'super_admin') return;
    setPermissions(prev => {
      const current = new Set(prev[selectedRoleId] || []);
      moduleIds.forEach(id => {
        if (!COMMON_MODULES.includes(id)) {
          if (select) current.add(id);
          else current.delete(id);
        }
      });
      return {
        ...prev,
        [selectedRoleId]: Array.from(current)
      };
    });
  };

  const handleSave = () => {
    saveCustomPermissions(permissions);
    toast.success(`Izin akses untuk role [${selectedRole.nama}] berhasil disimpan secara permanen.`);
  };

  const handleResetDefault = () => {
    const defaultRole = ROLES.find(r => r.id === selectedRoleId);
    if (defaultRole) {
      setPermissions(prev => ({
        ...prev,
        [selectedRoleId]: [...defaultRole.moduleAccess]
      }));
      toast.success(`Izin akses role [${defaultRole.nama}] dikembalikan ke standar bawaan.`);
    }
  };

  // Kumpulkan modul dari registry
  const filteredCategories = MODULE_REGISTRY.map(cat => {
    const filteredModules = cat.modules.filter(m => 
      m.label.toLowerCase().includes(searchModule.toLowerCase()) ||
      m.id.toLowerCase().includes(searchModule.toLowerCase())
    );
    return {
      ...cat,
      modules: filteredModules
    };
  }).filter(cat => cat.modules.length > 0);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Role & Permission Matrix
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Atur hak akses granular setiap peran pengguna ke modul-modul SIMK secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefault}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Default
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Izin Akses
            </button>
          </div>
        </div>

        {/* Role Selector Chips */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Pilih Role yang Dikonfigurasi:
          </label>
          <div className="flex flex-wrap gap-2">
            {ROLES.map(role => {
              const isSelected = selectedRoleId === role.id;
              const permCount = (permissions[role.id] || role.moduleAccess).length;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25 scale-102'
                      : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                  }`}
                >
                  <span className="text-base">{role.icon}</span>
                  <span>{role.nama}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                  }`}>
                    {role.id === 'super_admin' ? 'ALL' : permCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Role Info Banner */}
        <div className="mt-4 p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedRole.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-indigo-950 dark:text-indigo-100 text-base">{selectedRole.nama}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  ID: {selectedRole.id}
                </span>
                {selectedRole.kategori && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                    {selectedRole.kategori}
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-700 dark:text-indigo-300/80 mt-0.5 font-medium">{selectedRole.deskripsi}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari modul..."
                value={searchModule}
                onChange={e => setSearchModule(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
              />
            </div>
          </div>
        </div>

        {/* Modules Grid Matrix */}
        <div className="mt-6 space-y-6">
          {filteredCategories.map(cat => {
            const catModuleIds = cat.modules.map(m => m.id);
            const activeInCat = catModuleIds.filter(id => selectedRoleId === 'super_admin' || activeRolePermissions.includes(id));
            const allSelected = activeInCat.length === catModuleIds.length;

            return (
              <div key={cat.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-bold text-sm text-slate-800 dark:text-white">{cat.label}</span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600">
                      {activeInCat.length}/{cat.modules.length} Akses Aktif
                    </span>
                  </div>

                  {selectedRoleId !== 'super_admin' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAllCategory(catModuleIds, true)}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                      >
                        Pilih Semua
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => handleSelectAllCategory(catModuleIds, false)}
                        className="text-[11px] text-slate-500 hover:underline"
                      >
                        Batal Semua
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 bg-white dark:bg-slate-900/50">
                  {cat.modules.map(mod => {
                    const isCommon = COMMON_MODULES.includes(mod.id);
                    const isAllowed = selectedRoleId === 'super_admin' || isCommon || activeRolePermissions.includes(mod.id);

                    return (
                      <label
                        key={mod.id}
                        onClick={() => handleToggleModule(mod.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 select-none ${
                          isAllowed
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-300 dark:border-indigo-800/80 shadow-xs'
                            : 'bg-slate-50/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="text-xl shrink-0">{mod.icon}</span>
                          <div className="overflow-hidden">
                            <p className={`text-xs font-bold truncate ${isAllowed ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>
                              {mod.label}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              ID: {mod.id}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 mt-0.5">
                          <input
                            type="checkbox"
                            checked={isAllowed}
                            disabled={selectedRoleId === 'super_admin' || isCommon}
                            onChange={() => {}} // handled by parent label onClick
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="btn-primary flex items-center gap-2 px-6 py-2.5"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Role Matrix
          </button>
        </div>
      </div>
    </div>
  );
}

function SessionsTab() {
  const { currentUser, firebaseUser, logout } = useAuth();
  const currentRole = currentUser ? getRoleById(currentUser.roleId) : null;
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client';

  const handleRevoke = async () => {
    if (window.confirm('Keluar dari sesi saat ini?')) {
      await logout();
      toast.success('Sesi berhasil dihentikan');
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Sesi Autentikasi Aktif (Live Sessions)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daftar sesi terotentikasi Firebase Auth & kredensial tersinkronisasi di sistem.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80">
              <tr>
                <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase">Pengguna / Akun</th>
                <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase">Peran & Akses</th>
                <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase">Metode Autentikasi</th>
                <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase">Browser & Device</th>
                <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase text-right">Status & Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              <tr>
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      {currentUser?.nama?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        {currentUser?.nama}
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold">
                          Anda (Sesi Saat Ini)
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 font-mono">{currentUser?.email || currentUser?.username}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    <span>{currentRole?.icon || '🛡️'}</span>
                    {currentRole?.nama || currentUser?.roleId}
                  </span>
                </td>
                <td className="p-3">
                  <div className="text-xs">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      {currentUser?.isGoogleAuth ? 'Google OAuth 2.0 (Firebase)' : 'Kredensial Petugas (DB Internal)'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      UID: {currentUser?.id || firebaseUser?.uid || 'local-session'}
                    </p>
                  </div>
                </td>
                <td className="p-3 text-xs text-slate-600 dark:text-slate-400 max-w-xs truncate">
                  {userAgent}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={handleRevoke}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    Akhiri Sesi
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    return subscribeActivityLogs((newLogs) => {
      setLogs(newLogs.slice(0, 20));
    });
  }, []);

  return (
    <div className="card p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileClock className="w-5 h-5 text-indigo-600" />
            System Audit Trail (Aktivitas Sistem)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Jejak rekam aktivitas sistem, autentikasi, serta pembaharuan basis data real-time.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase">Waktu</th>
              <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase">User / Aktor</th>
              <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase">Kategori & Event</th>
              <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase">Keterangan / Target</th>
              <th className="p-3 border-b text-xs font-bold text-slate-500 uppercase text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {logs.map((log) => {
              const date = new Date(log.timestamp);
              const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });

              return (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750">
                  <td className="p-3 font-mono text-xs whitespace-nowrap text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{timeStr}</span>
                    <span className="text-[10px] text-slate-400 block">{dateStr}</span>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-xs text-slate-800 dark:text-white">{log.user?.nama || 'System'}</p>
                    <p className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">{log.user?.email || '-'}</p>
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mr-1.5">
                      {log.category}
                    </span>
                    <span className="font-semibold text-xs text-slate-700 dark:text-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-slate-600 dark:text-slate-400 max-w-sm">
                    <p className="truncate font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{log.target}</p>
                    <p className="text-[11px] truncate text-slate-500">{log.details?.message || '-'}</p>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                      log.status === 'DENIED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' :
                      log.status === 'FAILED' ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300' :
                      'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
