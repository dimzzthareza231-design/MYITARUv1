import React, { useState, useEffect } from 'react';
import { 
  PackageSearch, Settings, PlayCircle, Truck, FileWarning, CheckCircle, Search, Save, History, Box, Barcode, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

export function CSSDManagement() {
  const [activeTab, setActiveTab] = useState<'tracking' | 'run' | 'distribution' | 'incident'>('tracking');

  const tabs = [
    { id: 'tracking', label: 'Pack Tracking', icon: PackageSearch },
    { id: 'run', label: 'Sterilization Run', icon: PlayCircle },
    { id: 'distribution', label: 'Distribution', icon: Truck },
    { id: 'incident', label: 'Incident Report', icon: FileWarning },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-500">
            <PackageSearch className="w-7 h-7" />
            Central Sterile Supply Dept (CSSD)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sistem manajemen sterilisasi, tracking alat, dan distribusi.</p>
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
        {activeTab === 'tracking' && <TrackingTab />}
        {activeTab === 'run' && <SterilizationRunTab />}
        {activeTab === 'distribution' && <DistributionTab />}
        {activeTab === 'incident' && <IncidentTab />}
      </div>
    </div>
  );
}

function TrackingTab() {
  const [packs, setPacks] = useState<any[]>(() => JSON.parse(localStorage.getItem('cssd_packs') || JSON.stringify([
    { id: 'PK-001', name: 'Set Minor Surgery', status: 'Sterile', expDate: '2026-08-30', history: [{date: '2026-08-01 10:00', action: 'Sterilized'}] },
    { id: 'PK-002', name: 'Set Hecting', status: 'In Wash', expDate: '-', history: [{date: '2026-08-05 08:00', action: 'Washing'}] }
  ])));
  const [search, setSearch] = useState('');
  
  useEffect(() => { localStorage.setItem('cssd_packs', JSON.stringify(packs)); }, [packs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(!search) return;
    toast.success(`Mencari pack: ${search}`);
  };

  const updateStatus = (id: string, newStatus: string) => {
    setPacks(packs.map(p => {
      if (p.id === id) {
        return { ...p, status: newStatus, history: [{date: new Date().toISOString().replace('T', ' ').slice(0, 16), action: `Status changed to ${newStatus}`}, ...p.history] };
      }
      return p;
    }));
    toast.success(`Status ${id} diperbarui menjadi ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Scan / Cari Pack</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input type="text" className="input-field flex-1 font-mono" placeholder="Scan Barcode / Input PK-XXX" value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn-primary bg-indigo-600"><Search className="w-4 h-4 mr-2"/> Cari</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Daftar Pack</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">ID Pack</th>
              <th className="p-3 border-b">Nama Set</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Expired</th>
              <th className="p-3 border-b text-right">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {packs.filter(p => p.id.includes(search) || p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
              <tr key={p.id}>
                <td className="p-3 border-b font-mono font-bold">{p.id}</td>
                <td className="p-3 border-b">{p.name}</td>
                <td className="p-3 border-b">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    p.status === 'Sterile' ? 'bg-emerald-100 text-emerald-700' :
                    p.status === 'Distributed' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3 border-b">{p.expDate}</td>
                <td className="p-3 border-b text-right">
                  <select className="border rounded p-1 text-xs" onChange={(e) => { if(e.target.value) updateStatus(p.id, e.target.value); e.target.value = '';}}>
                    <option value="">-- Update --</option>
                    <option value="In Wash">In Wash</option>
                    <option value="Packing">Packing</option>
                    <option value="Sterilizing">Sterilizing</option>
                    <option value="Sterile">Sterile</option>
                    <option value="Distributed">Distributed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SterilizationRunTab() {
  const [runs, setRuns] = useState<any[]>(() => JSON.parse(localStorage.getItem('cssd_runs') || '[]'));
  const [form, setForm] = useState({ machine: 'Autoclave 1', cycleType: 'Standard 134°C', temperature: '134', pressure: '2.1', duration: '45' });

  useEffect(() => { localStorage.setItem('cssd_runs', JSON.stringify(runs)); }, [runs]);

  const handleStartRun = (e: React.FormEvent) => {
    e.preventDefault();
    setRuns([{
      id: `RUN-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Running',
      ...form
    }, ...runs]);
    toast.success("Siklus sterilisasi dimulai");
  };

  const completeRun = (id: string) => {
    setRuns(runs.map(r => r.id === id ? { ...r, status: 'Completed' } : r));
    toast.success(`Siklus ${id} selesai`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><PlayCircle className="w-5 h-5 text-indigo-600"/> Mulai Siklus (Run)</h2>
          <form onSubmit={handleStartRun} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pilih Mesin</label>
              <select className="input-field" value={form.machine} onChange={e => setForm({...form, machine: e.target.value})}>
                <option>Autoclave 1 (Steam)</option>
                <option>Autoclave 2 (Steam)</option>
                <option>Plasma 1 (H2O2)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipe Siklus</label>
              <select className="input-field" value={form.cycleType} onChange={e => setForm({...form, cycleType: e.target.value})}>
                <option>Standard 134°C (Solid)</option>
                <option>Porous 134°C (Textile)</option>
                <option>Delicate 121°C</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Suhu (°C)</label><input type="text" className="input-field" value={form.temperature} onChange={e => setForm({...form, temperature: e.target.value})} /></div>
              <div><label className="block text-sm font-medium mb-1">Tekanan (bar)</label><input type="text" className="input-field" value={form.pressure} onChange={e => setForm({...form, pressure: e.target.value})} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">Durasi Total (menit)</label><input type="text" className="input-field" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} /></div>
            <button type="submit" className="btn-primary w-full bg-indigo-600 hover:bg-indigo-700"><PlayCircle className="w-4 h-4 mr-2"/> Start Siklus</button>
          </form>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="card p-6 h-full">
          <h3 className="text-lg font-bold mb-4">Riwayat Siklus</h3>
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-3 border-b">ID Run</th>
                <th className="p-3 border-b">Waktu</th>
                <th className="p-3 border-b">Mesin & Siklus</th>
                <th className="p-3 border-b">Parameter</th>
                <th className="p-3 border-b text-right">Status / Aksi</th>
              </tr>
            </thead>
            <tbody>
              {runs.map(r => (
                <tr key={r.id}>
                  <td className="p-3 border-b font-mono font-bold text-indigo-600">{r.id}</td>
                  <td className="p-3 border-b text-xs">{r.date}</td>
                  <td className="p-3 border-b">{r.machine}<br/><span className="text-xs text-slate-500">{r.cycleType}</span></td>
                  <td className="p-3 border-b text-xs">{r.temperature}°C, {r.pressure}bar<br/>{r.duration}m</td>
                  <td className="p-3 border-b text-right">
                    {r.status === 'Running' ? (
                       <button onClick={() => completeRun(r.id)} className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-amber-200">Akhiri Siklus</button>
                    ) : (
                       <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex justify-end items-center gap-1"><CheckCircle className="w-3 h-3"/> {r.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DistributionTab() {
  const [dists, setDists] = useState<any[]>(() => JSON.parse(localStorage.getItem('cssd_dists') || '[]'));
  const [form, setForm] = useState({ room: 'Kamar Operasi (OK 1)', receiver: '', packs: '' });

  useEffect(() => { localStorage.setItem('cssd_dists', JSON.stringify(dists)); }, [dists]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.receiver || !form.packs) { toast.error("Lengkapi form distribusi!"); return; }
    
    setDists([{
      id: `DIST-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ...form
    }, ...dists]);
    toast.success("Distribusi dicatat");
    setForm({ ...form, receiver: '', packs: '' });
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-indigo-600"/> Form Distribusi Pack Steril</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tujuan Ruangan</label>
              <select className="input-field" value={form.room} onChange={e => setForm({...form, room: e.target.value})}>
                <option>Kamar Operasi (OK 1)</option>
                <option>IGD</option>
                <option>Poli Gigi</option>
                <option>Klinik Bedah</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Penerima (Nama Perawat)</label>
              <input type="text" className="input-field" value={form.receiver} onChange={e => setForm({...form, receiver: e.target.value})} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Scan / Input Pack ID (Pisahkan dengan koma)</label>
            <input type="text" className="input-field font-mono" placeholder="PK-001, PK-005" value={form.packs} onChange={e => setForm({...form, packs: e.target.value})} required />
          </div>
          <button type="submit" className="btn-primary w-full bg-indigo-600"><Save className="w-4 h-4 mr-2"/> Catat Distribusi</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Riwayat Distribusi Terakhir</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">ID Dist</th>
              <th className="p-3 border-b">Waktu</th>
              <th className="p-3 border-b">Tujuan & Penerima</th>
              <th className="p-3 border-b">Pack Terdistribusi</th>
            </tr>
          </thead>
          <tbody>
            {dists.map(d => (
              <tr key={d.id}>
                <td className="p-3 border-b font-mono font-bold text-slate-700">{d.id}</td>
                <td className="p-3 border-b text-xs">{d.date}</td>
                <td className="p-3 border-b">{d.room}<br/><span className="text-xs text-slate-500">Penerima: {d.receiver}</span></td>
                <td className="p-3 border-b font-mono text-xs">{d.packs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IncidentTab() {
  const [incidents, setIncidents] = useState<any[]>(() => JSON.parse(localStorage.getItem('cssd_incidents') || '[]'));
  const [form, setForm] = useState({ type: 'Wet Pack (Pack Basah)', refId: '', desc: '', action: '' });

  useEffect(() => { localStorage.setItem('cssd_incidents', JSON.stringify(incidents)); }, [incidents]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.desc) { toast.error("Deskripsi wajib diisi!"); return; }
    
    setIncidents([{
      id: `INC-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      ...form,
      status: 'Open'
    }, ...incidents]);
    toast.success("Insiden CSSD dilaporkan");
    setForm({ type: 'Wet Pack (Pack Basah)', refId: '', desc: '', action: '' });
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileWarning className="w-5 h-5 text-rose-500"/> Pelaporan Insiden Sterilisasi</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Jenis Insiden</label>
              <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option>Wet Pack (Pack Basah)</option>
                <option>Torn Wrap (Bungkus Robek)</option>
                <option>Chemical Indicator Fail</option>
                <option>Biological Indicator Fail</option>
                <option>Missing Instrument</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pack / Run ID (Opsional)</label>
              <input type="text" className="input-field font-mono" placeholder="PK-XXX / RUN-XXX" value={form.refId} onChange={e => setForm({...form, refId: e.target.value})} />
            </div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Deskripsi Kejadian</label><textarea required className="input-field" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}></textarea></div>
          <div><label className="block text-sm font-medium mb-1">Tindakan Koreksi Cepat</label><textarea className="input-field" value={form.action} onChange={e => setForm({...form, action: e.target.value})}></textarea></div>
          <button type="submit" className="btn-primary w-full bg-rose-600 hover:bg-rose-700"><Save className="w-4 h-4 mr-2"/> Submit Insiden</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Riwayat Insiden</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">ID Insiden</th>
              <th className="p-3 border-b">Waktu</th>
              <th className="p-3 border-b">Jenis & Ref</th>
              <th className="p-3 border-b">Deskripsi & Aksi</th>
              <th className="p-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(i => (
              <tr key={i.id}>
                <td className="p-3 border-b font-mono font-bold text-rose-600">{i.id}</td>
                <td className="p-3 border-b text-xs">{i.date}</td>
                <td className="p-3 border-b font-medium">{i.type}<br/><span className="text-xs text-slate-500">{i.refId || '-'}</span></td>
                <td className="p-3 border-b text-xs"><p className="mb-1"><strong>D:</strong> {i.desc}</p><p><strong>A:</strong> {i.action}</p></td>
                <td className="p-3 border-b">
                   <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">{i.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
