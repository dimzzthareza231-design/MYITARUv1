import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  GitMerge, UserCheck, AlertCircle, BarChart3, Plus, Check, Search, Calendar, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export function ClinicalPathway() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'builder' | 'tracking' | 'variance' | 'outcome'>('builder');

  useEffect(() => {
    const subtab = (searchParams.get('subtab') || '').toLowerCase();
    if (subtab === 'variance' || subtab === 'tracking' || subtab === 'outcome' || subtab === 'builder') {
      setActiveTab(subtab);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'builder', label: 'Pathway Builder', icon: GitMerge },
    { id: 'tracking', label: 'Patient Tracking', icon: UserCheck },
    { id: 'variance', label: 'Variance Report', icon: AlertCircle },
    { id: 'outcome', label: 'Outcome Analysis', icon: BarChart3 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-500">
            <GitMerge className="w-7 h-7" />
            Clinical Pathway (CP)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manajemen alur klinis pasien, tracking hari rawat, dan analisis variance.</p>
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
        {activeTab === 'builder' && <BuilderTab />}
        {activeTab === 'tracking' && <TrackingTab />}
        {activeTab === 'variance' && <VarianceTab />}
        {activeTab === 'outcome' && <OutcomeTab />}
      </div>
    </div>
  );
}

function BuilderTab() {
  const [days, setDays] = useState([{ day: 1, title: 'Hari 1 (IGD / Masuk)', tasks: ['Asesmen awal medis', 'Lab Darah Rutin', 'Pemasangan Infus'] }]);
  const [newTitle, setNewTitle] = useState('');
  
  const addDay = () => {
    setDays([...days, { day: days.length + 1, title: newTitle || `Hari ${days.length + 1}`, tasks: [] }]);
    setNewTitle('');
  };

  const addTask = (dayIdx: number, task: string) => {
    if(!task) return;
    const newDays = [...days];
    newDays[dayIdx].tasks.push(task);
    setDays(newDays);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold">Clinical Pathway Builder: Appendisitis Akut</h2>
           <button className="btn-primary" onClick={addDay}><Plus className="w-4 h-4 mr-2"/> Tambah Hari (LOS)</button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
          {days.map((d, i) => (
             <div key={i} className="min-w-[300px] max-w-[300px] border dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex flex-col shrink-0">
               <div className="p-3 border-b dark:border-slate-700 font-bold flex justify-between items-center bg-white dark:bg-slate-800 rounded-t-lg">
                 <span>{d.title}</span>
                 <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">Day {d.day}</span>
               </div>
               <div className="p-3 flex-1 flex flex-col gap-2">
                 {d.tasks.map((t, idx) => (
                   <div key={idx} className="bg-white dark:bg-slate-900 p-2 text-sm rounded border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-2">
                     <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0"/> {t}
                   </div>
                 ))}
                 <input 
                   type="text" 
                   className="input-field text-sm mt-2" 
                   placeholder="+ Tambah intervensi/tugas..."
                   onKeyDown={e => {
                     if (e.key === 'Enter') {
                       addTask(i, e.currentTarget.value);
                       e.currentTarget.value = '';
                     }
                   }}
                 />
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrackingTab() {
  const [patients, setPatients] = useState<any[]>([
    { id: 'RM-001', name: 'Budi Santoso', cp: 'Appendisitis Akut', day: 2, tasks: [{name:'Visite DPJP', done:true}, {name:'Injeksi Ceftriaxone', done:false}, {name:'Diet Lunak', done:false}] }
  ]);
  
  

  const toggleTask = (pId: string, taskIdx: number) => {
    setPatients(patients.map(p => {
      if(p.id === pId) {
        const newTasks = [...p.tasks];
        newTasks[taskIdx].done = !newTasks[taskIdx].done;
        return { ...p, tasks: newTasks };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-xl font-bold">Patient Tracking (Daily CP)</h2>
           <div className="flex gap-2">
             <input type="text" className="input-field" placeholder="Cari Pasien / RM..." />
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(p => (
            <div key={p.id} className="border dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm">
              <div className="p-4 border-b dark:border-slate-700 bg-indigo-50 dark:bg-indigo-900/20">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <span className="text-xs font-mono bg-white dark:bg-slate-800 px-2 py-1 rounded">{p.id}</span>
                </div>
                <p className="text-sm text-indigo-700 dark:text-indigo-400 font-medium">{p.cp}</p>
                <div className="mt-2 inline-block bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Perawatan Hari Ke-{p.day}
                </div>
              </div>
              <div className="p-4 space-y-3">
                <h4 className="text-sm font-bold text-slate-500">Checklist Hari {p.day}:</h4>
                {p.tasks.map((t:any, idx:number) => (
                  <label key={idx} className="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer border dark:border-slate-700 transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" checked={t.done} onChange={() => toggleTask(p.id, idx)} />
                    <span className={`text-sm ${t.done ? 'line-through text-slate-400' : ''}`}>{t.name}</span>
                  </label>
                ))}
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-700 flex justify-between items-center">
                 <span className="text-xs text-slate-500">Progress: {Math.round((p.tasks.filter((t:any)=>t.done).length / p.tasks.length) * 100)}%</span>
                 <button className="text-rose-600 text-xs font-bold hover:underline flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Lapor Variance</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VarianceTab() {
  const [variances, setVariances] = useState<any[]>([]);
  const [form, setForm] = useState({ rm: '', cp: 'Appendisitis Akut', day: 2, type: 'Medis', reason: '' });

  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.rm || !form.reason) { toast.error("Lengkapi form!"); return; }
    setVariances([{
      id: `VAR-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      ...form
    }, ...variances]);
    toast.success("Variance dilaporkan");
    setForm({ rm: '', cp: 'Appendisitis Akut', day: 2, type: 'Medis', reason: '' });
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-rose-500"/> Pelaporan Variance (Penyimpangan CP)</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Nomor RM</label><input type="text" className="input-field font-mono" value={form.rm} onChange={e=>setForm({...form, rm: e.target.value})} /></div>
            <div><label className="block text-sm font-medium mb-1">Jenis CP</label><input type="text" className="input-field" value={form.cp} onChange={e=>setForm({...form, cp: e.target.value})} readOnly /></div>
            <div><label className="block text-sm font-medium mb-1">Hari Perawatan</label><input type="number" className="input-field" value={form.day} onChange={e=>setForm({...form, day: parseInt(e.target.value)})} /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategori Variance</label>
              <select className="input-field" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
                <option>Medis (Kondisi Pasien)</option>
                <option>Sistem (Alat/Fasilitas)</option>
                <option>SDM (Petugas)</option>
                <option>Pasien/Keluarga (Menolak)</option>
              </select>
            </div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Alasan / Penjelasan Variance</label><textarea required rows={3} className="input-field" placeholder="Jelaskan mengapa implementasi tidak sesuai CP..." value={form.reason} onChange={e=>setForm({...form, reason: e.target.value})}></textarea></div>
          <button type="submit" className="btn-primary w-full bg-rose-600 hover:bg-rose-700">Submit Variance Report</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Daftar Variance Terakhir</h3>
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Waktu & Pasien</th>
              <th className="p-3 border-b">Kategori</th>
              <th className="p-3 border-b">Alasan Penyimpangan</th>
            </tr>
          </thead>
          <tbody>
            {variances.map(v => (
              <tr key={v.id}>
                <td className="p-3 border-b font-mono font-bold text-rose-600">{v.id}</td>
                <td className="p-3 border-b text-xs">{v.date}<br/><span className="font-mono bg-slate-100 px-1 rounded">{v.rm}</span> (Hari {v.day})</td>
                <td className="p-3 border-b"><span className="bg-slate-100 px-2 py-1 rounded font-bold text-xs">{v.type}</span></td>
                <td className="p-3 border-b text-xs">{v.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OutcomeTab() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-indigo-600"/> Analisis Kepatuhan & Outcome CP</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="p-4 border dark:border-slate-700 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-center">
             <div className="text-3xl font-bold text-indigo-600">85%</div>
             <div className="text-sm font-medium text-slate-600 mt-1">Kepatuhan CP Total</div>
           </div>
           <div className="p-4 border dark:border-slate-700 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
             <div className="text-3xl font-bold text-emerald-600">3.2</div>
             <div className="text-sm font-medium text-slate-600 mt-1">Rata-rata LOS (Hari)</div>
           </div>
           <div className="p-4 border dark:border-slate-700 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-center">
             <div className="text-3xl font-bold text-rose-600">12%</div>
             <div className="text-sm font-medium text-slate-600 mt-1">Variance Rate</div>
           </div>
        </div>

        <div className="border dark:border-slate-700 rounded-lg p-6">
           <h3 className="font-bold text-center mb-6">Grafik Kepatuhan vs Variance (Bulan Terakhir)</h3>
           {/* Simple Bar Chart CSS */}
           <div className="flex h-64 items-end gap-8 justify-center border-b dark:border-slate-700 pb-2 relative px-10">
              <div className="absolute left-0 top-0 bottom-0 w-8 border-r dark:border-slate-700 flex flex-col justify-between text-[10px] text-right pr-2 text-slate-500">
                <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
              </div>
              {/* Bars */}
              {[
                { label: 'Minggu 1', comp: 80, var: 20 },
                { label: 'Minggu 2', comp: 90, var: 10 },
                { label: 'Minggu 3', comp: 85, var: 15 },
                { label: 'Minggu 4', comp: 95, var: 5 },
              ].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group relative">
                   {/* Tooltip */}
                   <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[10px] p-2 rounded pointer-events-none transition-opacity z-10 whitespace-nowrap">
                     Kepatuhan: {d.comp}%<br/>Variance: {d.var}%
                   </div>
                   <div className="flex gap-2 items-end h-52">
                     <div className="w-10 bg-indigo-500 rounded-t-sm transition-all hover:brightness-110" style={{ height: `${d.comp}%` }}></div>
                     <div className="w-10 bg-rose-500 rounded-t-sm transition-all hover:brightness-110" style={{ height: `${d.var}%` }}></div>
                   </div>
                   <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-2">{d.label}</span>
                </div>
              ))}
           </div>
           <div className="flex justify-center gap-6 mt-6 text-sm">
             <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-500 rounded-sm"></div> Kepatuhan</div>
             <div className="flex items-center gap-2"><div className="w-4 h-4 bg-rose-500 rounded-sm"></div> Variance</div>
           </div>
        </div>
      </div>
    </div>
  );
}
