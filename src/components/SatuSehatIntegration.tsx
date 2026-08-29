import React, { useState, useEffect } from 'react';
import { 
  Database, Activity, Settings, RefreshCw, Server, AlertCircle, CheckCircle, Search, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export function SatuSehatIntegration() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'config' | 'mapping' | 'logs'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Sync', icon: Activity },
    { id: 'config', label: 'Konfigurasi', icon: Settings },
    { id: 'mapping', label: 'Data Mapping', icon: Database },
    { id: 'logs', label: 'Sync Logs', icon: Server },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
            <ShieldCheck className="w-7 h-7" />
            SatuSehat Integration
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Integrasi data rekam medis elektronik (RME) dengan Kemenkes RI.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Connected</span>
        </div>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'config' && <ConfigTab />}
        {activeTab === 'mapping' && <MappingTab />}
        {activeTab === 'logs' && <LogsTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  const stats = [
    { label: 'Data Tersinkron (Hari Ini)', value: '1,452', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Pending Sync', value: '18', color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Gagal (Errors)', value: '3', color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Rata-rata Waktu Sync', value: '1.2s', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ];

  const handleManualSync = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 2000)),
      {
        loading: 'Menyinkronkan 18 data ke SatuSehat...',
        success: 'Berhasil sinkronisasi 18 data.',
        error: 'Gagal sinkronisasi.'
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5">
            <h3 className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-lg font-bold">Modul RME Sync Status</h3>
           <button onClick={handleManualSync} className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
             <RefreshCw className="w-4 h-4" /> Force Manual Sync
           </button>
        </div>
        
        <div className="space-y-4">
          {[
            { mod: 'Pendaftaran Pasien (Patient)', sync: 420, err: 0 },
            { mod: 'Kunjungan (Encounter)', sync: 418, err: 2 },
            { mod: 'Kondisi / Diagnosa (Condition)', sync: 350, err: 1 },
            { mod: 'Resep Obat (MedicationRequest)', sync: 264, err: 0 },
          ].map((m, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <div>
                <div className="font-bold">{m.mod}</div>
                <div className="text-sm text-slate-500">Auto-sync: Realtime</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm text-emerald-600 font-bold">{m.sync} Sync</div>
                {m.err > 0 && <div className="text-xs text-rose-500 font-bold">{m.err} Errors</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfigTab() {
  const [form, setForm] = useState({
    clientId: 'KEMENKES-XXXX-XXXX',
    clientSecret: '********',
    orgId: 'ORG-1002345',
    env: 'Production',
    autoSync: true
  });

  

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Konfigurasi SatuSehat disimpan");
  };

  const testConn = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      { loading: 'Menguji koneksi...', success: 'Koneksi ke server SatuSehat berhasil!', error: 'Gagal terhubung' }
    );
  };

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-500"/> Setup Kredensial</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Environment</label>
           <select className="input-field" value={form.env} onChange={e=>setForm({...form, env: e.target.value})}>
             <option>Development (Staging)</option>
             <option>Production</option>
           </select>
        </div>
        <div><label className="block text-sm font-medium mb-1">Organization ID (Fasyankes)</label>
          <input type="text" className="input-field font-mono" value={form.orgId} onChange={e=>setForm({...form, orgId: e.target.value})} required/>
        </div>
        <div><label className="block text-sm font-medium mb-1">Client ID</label>
          <input type="text" className="input-field font-mono" value={form.clientId} onChange={e=>setForm({...form, clientId: e.target.value})} required/>
        </div>
        <div><label className="block text-sm font-medium mb-1">Client Secret</label>
          <input type="password" className="input-field font-mono" value={form.clientSecret} onChange={e=>setForm({...form, clientSecret: e.target.value})} required/>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="autoSync" checked={form.autoSync} onChange={e=>setForm({...form, autoSync: e.target.checked})} />
          <label htmlFor="autoSync" className="text-sm">Aktifkan Auto-Sync (Realtime ke Antrean & RME)</label>
        </div>
        <div className="flex gap-4 pt-4 border-t dark:border-slate-800">
          <button type="button" onClick={testConn} className="btn-secondary">Test Connection</button>
          <button type="submit" className="btn-primary flex-1">Simpan Konfigurasi</button>
        </div>
      </form>
    </div>
  );
}

function MappingTab() {
  const [maps, setMaps] = useState<any[]>(() => {
    const saved = localStorage.getItem('simrs_satusehat_maps');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'Poli / Klinik', local: 'Poli Penyakit Dalam', satusehat: 'Ruang Rawat Jalan - Penyakit Dalam' },
      { id: 2, type: 'Dokter', local: 'dr. Andi (D-001)', satusehat: 'IHS-10002131' }
    ];
  });
  const [form, setForm] = useState({ type: 'Poli / Klinik', local: '', satusehat: '' });

  

  const addMap = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.local || !form.satusehat) return;
    setMaps([...maps, { id: Date.now(), ...form }]);
    toast.success("Mapping ditambahkan");
    setForm({ type: 'Poli / Klinik', local: '', satusehat: '' });
  };

  const removeMap = (id: number) => setMaps(maps.filter((m:any) => m.id !== id));

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Master Data Mapping</h2>
        <form onSubmit={addMap} className="flex gap-4 items-end mb-6">
          <div><label className="block text-sm mb-1">Tipe</label>
             <select className="input-field" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
               <option>Poli / Klinik</option>
               <option>Dokter (IHS ID)</option>
               <option>Obat (KFA)</option>
             </select>
          </div>
          <div className="flex-1"><label className="block text-sm mb-1">Data Lokal Klinik</label><input type="text" className="input-field" value={form.local} onChange={e=>setForm({...form, local: e.target.value})} required/></div>
          <div className="flex-1"><label className="block text-sm mb-1">Kode SatuSehat</label><input type="text" className="input-field" value={form.satusehat} onChange={e=>setForm({...form, satusehat: e.target.value})} required/></div>
          <button type="submit" className="btn-primary">Add Mapping</button>
        </form>

        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Tipe Mapping</th>
              <th className="p-3 border-b">Data Lokal (HIS)</th>
              <th className="p-3 border-b">SatuSehat (IHS / KFA)</th>
              <th className="p-3 border-b text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {maps.map((m:any) => (
              <tr key={m.id}>
                <td className="p-3 border-b font-medium">{m.type}</td>
                <td className="p-3 border-b">{m.local}</td>
                <td className="p-3 border-b font-mono text-emerald-600">{m.satusehat}</td>
                <td className="p-3 border-b text-right"><button onClick={() => removeMap(m.id)} className="text-rose-500 text-xs hover:underline">Hapus</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogsTab() {
  const logs = [
    { id: 'SYNC-801', time: '10:45:12', resource: 'Encounter', target: 'Patient RM-00123', status: 'Success', msg: '201 Created' },
    { id: 'SYNC-802', time: '10:42:05', resource: 'Condition', target: 'Patient RM-00123', status: 'Success', msg: '201 Created' },
    { id: 'SYNC-803', time: '10:30:22', resource: 'Patient', target: 'NIK 317123...', status: 'Failed', msg: '400 Bad Request: Invalid NIK format' },
    { id: 'SYNC-804', time: '10:15:00', resource: 'Medication', target: 'Rx-9901', status: 'Success', msg: '200 OK' },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Server className="w-5 h-5 text-slate-500"/> API Log / Sync Viewer</h2>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-3 border-b">Waktu</th>
            <th className="p-3 border-b">Resource (FHIR)</th>
            <th className="p-3 border-b">Target</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b">Response</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td className="p-3 border-b font-mono text-xs">{l.time}</td>
              <td className="p-3 border-b font-medium">{l.resource}</td>
              <td className="p-3 border-b text-xs">{l.target}</td>
              <td className="p-3 border-b">
                 <span className={`px-2 py-1 rounded text-[10px] font-bold ${l.status === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{l.status}</span>
              </td>
              <td className="p-3 border-b font-mono text-[10px] text-slate-500">{l.msg}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

