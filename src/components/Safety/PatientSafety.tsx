import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, FileText, Search, Activity, GitCommit, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function PatientSafety() {
  const [activeTab, setActiveTab] = useState<'incident' | 'investigation' | 'risk'>('incident');

  const tabs = [
    { id: 'incident', label: 'Incident Reporting', icon: FileText },
    { id: 'investigation', label: 'Investigation & RCA', icon: Search },
    { id: 'risk', label: 'Risk Register Matrix', icon: Activity },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-rose-600 dark:text-rose-500">
            <ShieldAlert className="w-7 h-7" />
            Patient Safety & Quality
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sistem pelaporan insiden, RCA, dan manajemen risiko rumah sakit.</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-rose-600 dark:text-rose-400' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {activeTab === 'incident' && <IncidentTab />}
        {activeTab === 'investigation' && <InvestigationTab />}
        {activeTab === 'risk' && <RiskTab />}
      </div>
    </div>
  );
}

function IncidentTab() {
  const [reports, setReports] = useState<any[]>([]);
  const [form, setForm] = useState({ date: '', location: '', patientId: '', type: 'KNC (Kejadian Nyaris Cedera)', desc: '', action: '' });

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.desc) { toast.error('Deskripsi insiden wajib diisi'); return; }
    const newId = `INC-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, '0')}-${Date.now().toString().slice(-4)}`;
    setReports([{
      id: newId,
      status: 'Open',
      ...form,
      reportedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    }, ...reports]);
    toast.success(`Insiden dilaporkan dengan nomor: ${newId}`);
    setForm({ date: '', location: '', patientId: '', type: 'KNC (Kejadian Nyaris Cedera)', desc: '', action: '' });
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2"><FileText className="w-5 h-5 text-rose-600"/> Form Pelaporan Insiden Keselamatan Pasien (IKP)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium mb-1">Waktu Kejadian</label><input type="datetime-local" className="input-field" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required/></div>
            <div><label className="block text-sm font-medium mb-1">Lokasi Kejadian</label><input type="text" className="input-field" placeholder="Cth: Ruang Rawat Inap Melati" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required/></div>
            <div><label className="block text-sm font-medium mb-1">Nomor RM / ID Pasien</label><input type="text" className="input-field font-mono" placeholder="RM-XXXXXX" value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Jenis Insiden</label>
            <select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option>KNC (Kejadian Nyaris Cedera)</option>
              <option>KTC (Kejadian Tidak Cedera)</option>
              <option>KTD (Kejadian Tidak Diharapkan)</option>
              <option>Sentinel Event</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Kronologi Kejadian</label><textarea required rows={3} className="input-field" placeholder="Jelaskan apa yang terjadi..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})}></textarea></div>
          <div><label className="block text-sm font-medium mb-1">Tindakan Langsung</label><textarea rows={2} className="input-field" placeholder="Tindakan apa yang langsung dilakukan saat kejadian..." value={form.action} onChange={e => setForm({...form, action: e.target.value})}></textarea></div>
          <button type="submit" className="btn-primary w-full bg-rose-600 hover:bg-rose-700">Submit Laporan</button>
        </form>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Daftar Insiden</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-3 border-b">Nomor IKP</th>
                <th className="p-3 border-b">Waktu & Lokasi</th>
                <th className="p-3 border-b">Jenis</th>
                <th className="p-3 border-b">Kronologi Singkat</th>
                <th className="p-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(r => (
                <tr key={r.id}>
                  <td className="p-3 border-b font-mono font-bold text-rose-600">{r.id}</td>
                  <td className="p-3 border-b text-xs">{r.date}<br/>{r.location}</td>
                  <td className="p-3 border-b"><span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">{r.type}</span></td>
                  <td className="p-3 border-b text-xs max-w-xs truncate">{r.desc}</td>
                  <td className="p-3 border-b">
                     <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">{r.status}</span>
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

function InvestigationTab() {
  const [fishbone, setFishbone] = useState({ man: '', method: '', machine: '', material: '', environment: '', effect: 'Kesalahan Pemberian Obat' });
  const [actions, setActions] = useState<{task: string, pic: string, status: string}[]>([]);
  const [newTask, setNewTask] = useState('');
  
  const addAction = () => {
    if(!newTask) return;
    setActions([...actions, { task: newTask, pic: 'Tim Mutu', status: 'Pending' }]);
    setNewTask('');
  };

  const toggleActionStatus = (idx: number) => {
    const newActions = [...actions];
    newActions[idx].status = newActions[idx].status === 'Pending' ? 'Completed' : 'Pending';
    setActions(newActions);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4">Investigasi & Root Cause Analysis (RCA)</h2>
        <div className="mb-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/30">
           <h3 className="font-bold text-sm mb-2 text-slate-600">Timeline Investigasi (Contoh)</h3>
           <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex flex-col items-center text-emerald-600"><CheckCircle className="w-5 h-5 mb-1"/> Dilaporkan</div>
              <div className="h-0.5 w-8 bg-emerald-200"></div>
              <div className="flex flex-col items-center text-emerald-600"><CheckCircle className="w-5 h-5 mb-1"/> Grading</div>
              <div className="h-0.5 w-8 bg-slate-200"></div>
              <div className="flex flex-col items-center text-amber-600"><Clock className="w-5 h-5 mb-1"/> RCA Process</div>
              <div className="h-0.5 w-8 bg-slate-200"></div>
              <div className="flex flex-col items-center text-slate-400"><GitCommit className="w-5 h-5 mb-1"/> Action Plan</div>
           </div>
        </div>

        <h3 className="font-bold text-lg mb-4 border-b pb-2">Fishbone Diagram Tool</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           <div className="space-y-4">
              <div><label className="text-xs font-bold text-slate-500">Man (Manusia)</label><input type="text" className="input-field text-sm" placeholder="Kelelahan, kurang training..." value={fishbone.man} onChange={e=>setFishbone({...fishbone, man: e.target.value})} /></div>
              <div><label className="text-xs font-bold text-slate-500">Method (Metode)</label><input type="text" className="input-field text-sm" placeholder="SOP tidak jelas..." value={fishbone.method} onChange={e=>setFishbone({...fishbone, method: e.target.value})} /></div>
              <div><label className="text-xs font-bold text-slate-500">Machine (Mesin)</label><input type="text" className="input-field text-sm" placeholder="Alat rusak..." value={fishbone.machine} onChange={e=>setFishbone({...fishbone, machine: e.target.value})} /></div>
           </div>
           <div className="space-y-4">
              <div><label className="text-xs font-bold text-slate-500">Material (Material)</label><input type="text" className="input-field text-sm" placeholder="Obat LASA..." value={fishbone.material} onChange={e=>setFishbone({...fishbone, material: e.target.value})} /></div>
              <div><label className="text-xs font-bold text-slate-500">Environment (Lingkungan)</label><input type="text" className="input-field text-sm" placeholder="Pencahayaan redup..." value={fishbone.environment} onChange={e=>setFishbone({...fishbone, environment: e.target.value})} /></div>
              <div><label className="text-xs font-bold text-rose-500">Effect (Akibat/Masalah Utama)</label><input type="text" className="input-field text-sm border-rose-300" value={fishbone.effect} onChange={e=>setFishbone({...fishbone, effect: e.target.value})} /></div>
           </div>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-lg overflow-x-auto min-w-[600px] mb-8">
           <div className="text-center font-bold mb-4 text-rose-400">Preview Fishbone</div>
           <div className="relative h-40 flex items-center justify-end pr-32">
              <div className="absolute left-0 right-32 h-1 bg-white top-1/2"></div>
              {/* Top Bones */}
              <div className="absolute left-[20%] bottom-1/2 w-px h-16 bg-white rotate-45 origin-bottom"><span className="absolute -top-6 -left-10 text-xs text-nowrap">Man: {fishbone.man}</span></div>
              <div className="absolute left-[50%] bottom-1/2 w-px h-16 bg-white rotate-45 origin-bottom"><span className="absolute -top-6 -left-10 text-xs text-nowrap">Method: {fishbone.method}</span></div>
              <div className="absolute left-[80%] bottom-1/2 w-px h-16 bg-white rotate-45 origin-bottom"><span className="absolute -top-6 -left-10 text-xs text-nowrap">Machine: {fishbone.machine}</span></div>
              {/* Bottom Bones */}
              <div className="absolute left-[35%] top-1/2 w-px h-16 bg-white -rotate-45 origin-top"><span className="absolute top-16 -left-10 text-xs text-nowrap">Material: {fishbone.material}</span></div>
              <div className="absolute left-[65%] top-1/2 w-px h-16 bg-white -rotate-45 origin-top"><span className="absolute top-16 -left-10 text-xs text-nowrap">Env: {fishbone.environment}</span></div>
              {/* Head */}
              <div className="absolute right-4 border border-rose-500 p-2 text-xs font-bold max-w-[100px] text-center bg-rose-900/50">{fishbone.effect}</div>
           </div>
        </div>

        <h3 className="font-bold text-lg mb-4 border-b pb-2">Action Plan & Tracking</h3>
        <div className="flex gap-2 mb-4">
           <input type="text" className="input-field flex-1" placeholder="Tambah action plan baru..." value={newTask} onChange={e=>setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAction()} />
           <button className="btn-secondary" onClick={addAction}>Add</button>
        </div>
        <ul className="space-y-2">
           {actions.map((act, i) => (
             <li key={i} className="flex justify-between items-center p-3 border rounded bg-slate-50 dark:bg-slate-800 cursor-pointer hover:bg-slate-100" onClick={() => toggleActionStatus(i)}>
               <div className="flex items-center gap-3">
                 {act.status === 'Completed' ? <CheckCircle className="w-5 h-5 text-emerald-500"/> : <Clock className="w-5 h-5 text-amber-500"/>}
                 <span className={`text-sm ${act.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>{act.task}</span>
               </div>
               <span className="text-xs bg-white px-2 py-1 rounded shadow-sm">PIC: {act.pic}</span>
             </li>
           ))}
           {actions.length === 0 && <li className="text-sm text-slate-500 text-center py-4">Belum ada action plan</li>}
        </ul>
      </div>
    </div>
  );
}

function RiskTab() {
  const [risks, setRisks] = useState<any[]>([
    { id: 'R01', desc: 'Kesalahan identifikasi', L: 3, I: 4, category: 'Clinical' },
    { id: 'R02', desc: 'Pasien jatuh dari tempat tidur', L: 2, I: 3, category: 'Clinical' },
    { id: 'R03', desc: 'Genset gagal menyala', L: 1, I: 5, category: 'Facility' }
  ]);
  
  

  // Matrix is 5x5 (L x I)
  const getCellRisks = (L: number, I: number) => risks.filter(r => r.L === L && r.I === I);
  
  const getCellColor = (score: number) => {
    if(score >= 15) return 'bg-rose-500';
    if(score >= 8) return 'bg-amber-400';
    if(score >= 4) return 'bg-yellow-300';
    return 'bg-emerald-400';
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500"/> Risk Register & Matrix</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
           {/* Matrix Visual */}
           <div className="flex-1">
             <div className="text-center text-xs font-bold mb-2">Impact (Keparahan) &rarr;</div>
             <div className="flex">
                <div className="text-center text-xs font-bold mr-2 [writing-mode:vertical-rl] rotate-180 flex items-center">&larr; Likelihood (Probabilitas)</div>
                <div className="grid grid-cols-5 gap-1 flex-1">
                  {[5,4,3,2,1].map(L => (
                    [1,2,3,4,5].map(I => {
                      const score = L * I;
                      const cellRisks = getCellRisks(L, I);
                      return (
                        <div key={`${L}-${I}`} className={`aspect-square border border-white flex flex-col items-center justify-center p-1 text-white relative ${getCellColor(score)}`}>
                          <span className="text-[10px] opacity-70 absolute top-1 left-1">{score}</span>
                          {cellRisks.map(r => (
                            <div key={r.id} className="text-[9px] font-bold bg-black/30 rounded px-1 mb-0.5 truncate w-full text-center" title={r.desc}>{r.id}</div>
                          ))}
                        </div>
                      )
                    })
                  ))}
                  <div className="col-span-5 flex justify-between text-[10px] mt-1 text-slate-500">
                    <span>1 (Insignificant)</span><span>2 (Minor)</span><span>3 (Moderate)</span><span>4 (Major)</span><span>5 (Catastrophic)</span>
                  </div>
                </div>
             </div>
           </div>
           
           {/* List */}
           <div className="flex-1">
             <h3 className="font-bold text-sm mb-2 border-b pb-1">Daftar Risiko</h3>
             <ul className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                {risks.map(r => (
                  <li key={r.id} className="p-2 text-sm border rounded bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
                    <div>
                      <span className="font-bold font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded mr-2">{r.id}</span>
                      {r.desc}
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded font-bold text-white ${getCellColor(r.L * r.I)}`}>{r.L * r.I}</span>
                  </li>
                ))}
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

