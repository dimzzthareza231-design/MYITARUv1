import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Key, Lock, FileClock, CheckCircle, ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AuthManagement() {
  const [activeTab, setActiveTab] = useState<'login' | 'users' | 'roles' | 'sessions' | 'audit'>('login');

  const tabs = [
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
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manajemen akses, otentikasi, role, dan audit trail.</p>
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
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {activeTab === 'login' && <LoginSimulator />}
        {activeTab === 'users' && <UserManagementTab />}
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

function UserManagementTab() {
  const [users, setUsers] = useState<any[]>(() => JSON.parse(localStorage.getItem('auth_users') || JSON.stringify([
    { id: 'U-001', name: 'Dr. Andi', role: 'Dokter', status: 'Active' },
    { id: 'U-002', name: 'Siti Aminah', role: 'Perawat', status: 'Active' }
  ])));
  const [form, setForm] = useState({ name: '', role: 'Admin' });

  useEffect(() => { localStorage.setItem('auth_users', JSON.stringify(users)); }, [users]);

  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name) return;
    setUsers([{ id: `U-${Date.now().toString().slice(-3)}`, ...form, status: 'Active' }, ...users]);
    toast.success("User ditambahkan");
    setForm({ name: '', role: 'Admin' });
  };

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">User Management (CRUD)</h2>
        <form onSubmit={addUser} className="flex gap-4 items-end mb-6">
          <div className="flex-1"><label className="block text-sm mb-1">Nama Lengkap</label><input type="text" className="input-field" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required/></div>
          <div><label className="block text-sm mb-1">Role</label>
             <select className="input-field" value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
               <option>Admin</option><option>Dokter</option><option>Perawat</option><option>Kasir</option>
             </select>
          </div>
          <button type="submit" className="btn-primary">Add User</button>
        </form>

        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">ID User</th>
              <th className="p-3 border-b">Nama</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td className="p-3 border-b font-mono font-bold text-indigo-600">{u.id}</td>
                <td className="p-3 border-b">{u.name}</td>
                <td className="p-3 border-b"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{u.role}</span></td>
                <td className="p-3 border-b">
                   <span className={`px-2 py-1 rounded text-xs font-bold ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{u.status}</span>
                </td>
                <td className="p-3 border-b text-right">
                  <button onClick={() => toggleStatus(u.id)} className="text-xs text-slate-500 hover:text-indigo-600 underline">
                    {u.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { ROLES, getRoleById, getCustomPermissions, saveCustomPermissions, COMMON_MODULES } from '../../data/roles';
import { MODULE_REGISTRY } from '../../data/moduleRegistry';
import { RefreshCw, Save, Check, X, Search, Info } from 'lucide-react';

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
              Atur hak akses granular setiap peran pengguna ke modul-modul SIMRS secara real-time.
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
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-3 border-b">User</th>
            <th className="p-3 border-b">IP Address / Device</th>
            <th className="p-3 border-b">Last Active</th>
            <th className="p-3 border-b text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border-b font-bold">Admin (You)</td>
            <td className="p-3 border-b text-xs">192.168.1.5<br/>Chrome on Windows</td>
            <td className="p-3 border-b text-emerald-600">Just now</td>
            <td className="p-3 border-b text-right"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Current</span></td>
          </tr>
          <tr>
            <td className="p-3 border-b font-bold">Dr. Andi</td>
            <td className="p-3 border-b text-xs">10.0.0.12<br/>Safari on iPad</td>
            <td className="p-3 border-b text-slate-500">10 mins ago</td>
            <td className="p-3 border-b text-right"><button onClick={()=>toast.success("Session revoked")} className="text-xs text-rose-500 font-bold hover:underline">Revoke</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function AuditTab() {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4">System Audit Trail</h2>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-3 border-b">Waktu</th>
            <th className="p-3 border-b">User / Aktor</th>
            <th className="p-3 border-b">Event (Aksi)</th>
            <th className="p-3 border-b">IP & Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border-b font-mono text-xs">2026-08-05 10:00:15</td>
            <td className="p-3 border-b font-bold">Admin</td>
            <td className="p-3 border-b text-xs">UPDATE_PERMISSION [Role: Perawat]</td>
            <td className="p-3 border-b text-xs"><span className="text-emerald-500 font-bold">SUCCESS</span><br/>192.168.1.5</td>
          </tr>
          <tr>
            <td className="p-3 border-b font-mono text-xs">2026-08-05 09:15:00</td>
            <td className="p-3 border-b font-bold">Dr. Andi</td>
            <td className="p-3 border-b text-xs">LOGIN_ATTEMPT [Failed Password]</td>
            <td className="p-3 border-b text-xs"><span className="text-rose-500 font-bold">FAILED</span><br/>10.0.0.12</td>
          </tr>
          <tr>
            <td className="p-3 border-b font-mono text-xs">2026-08-05 09:15:20</td>
            <td className="p-3 border-b font-bold">Dr. Andi</td>
            <td className="p-3 border-b text-xs">LOGIN_ATTEMPT [Success]</td>
            <td className="p-3 border-b text-xs"><span className="text-emerald-500 font-bold">SUCCESS</span><br/>10.0.0.12</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
