import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Activity, Bed, Thermometer, Droplet, 
  Wind, Clock, AlertTriangle, FileText, UserPlus, 
  Search, ShieldAlert, LineChart, Beaker, 
  Stethoscope, BatteryWarning, Brain, ActivitySquare, Plus, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function ICUMonitoring() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'monitoring' | 'ventilator' | 'scoring' | 'fluid'>('dashboard');

  const [patients, setPatients] = useState<any[]>(() => JSON.parse(localStorage.getItem('icu_patients') || '[]'));
  if (patients.length === 0) {
    setPatients([
      { id: 'ICU-1', bed: 'Bed 1', name: 'Tn. Budi Santoso', diagnosis: 'Post-CABG', hr: 92, bp: '120/80', spo2: 98, map: 93, vent: 'PCV' },
      { id: 'ICU-2', bed: 'Bed 2', name: 'Ny. Siti Aminah', diagnosis: 'Sepsis', hr: 115, bp: '90/60', spo2: 92, map: 70, vent: 'SIMV' },
      { id: 'ICU-3', bed: 'Bed 3', name: 'Kosong', diagnosis: '-', hr: 0, bp: '-', spo2: 0, map: 0, vent: '-' }
    ]);
  }
  const [vitals, setVitals] = useState<any[]>(() => JSON.parse(localStorage.getItem('icu_vitals') || '[]'));
  if (vitals.length === 0) {
    setVitals([
      { time: '08:00', hr: 90, bp_sys: 110, bp_dia: 70, spo2: 98 },
      { time: '09:00', hr: 95, bp_sys: 115, bp_dia: 75, spo2: 97 },
      { time: '10:00', hr: 100, bp_sys: 120, bp_dia: 80, spo2: 96 }
    ]);
  }

  const [scores, setScores] = useState<any>(() => JSON.parse(localStorage.getItem('icu_scores') || '{}'));
  const [vents, setVents] = useState<any>(() => JSON.parse(localStorage.getItem('icu_vents') || '{}'));
  const [fluids, setFluids] = useState<any>(() => JSON.parse(localStorage.getItem('icu_fluids') || '{}'));

  useEffect(() => { localStorage.setItem('icu_patients', JSON.stringify(patients)); }, [patients]);
  useEffect(() => { localStorage.setItem('icu_vitals', JSON.stringify(vitals)); }, [vitals]);
  useEffect(() => { localStorage.setItem('icu_scores', JSON.stringify(scores)); }, [scores]);
  useEffect(() => { localStorage.setItem('icu_vents', JSON.stringify(vents)); }, [vents]);
  useEffect(() => { localStorage.setItem('icu_fluids', JSON.stringify(fluids)); }, [fluids]);

  const tabs = [
    { id: 'dashboard', label: 'Bed Map & Dashboard', icon: Activity },
    { id: 'monitoring', label: 'Vital Signs & Grafik', icon: LineChart },
    { id: 'ventilator', label: 'Ventilator Mgt', icon: Wind },
    { id: 'scoring', label: 'Scoring System', icon: FileText },
    { id: 'fluid', label: 'Fluid Balance', icon: Droplet },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-rose-600 dark:text-rose-500">
            <HeartPulse className="w-7 h-7" />
            Perawatan Intensif (ICU)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Bed map, monitoring vital per jam, scoring, dan ventilator.</p>
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
        {activeTab === 'dashboard' && <DashboardTab patients={patients} setActiveTab={setActiveTab} />}
        {activeTab === 'monitoring' && <MonitoringTab patients={patients} vitals={vitals} setVitals={setVitals} />}
        {activeTab === 'ventilator' && <VentilatorTab patients={patients} vents={vents} setVents={setVents} />}
        {activeTab === 'scoring' && <ScoringTab patients={patients} scores={scores} setScores={setScores} />}
        {activeTab === 'fluid' && <FluidTab patients={patients} fluids={fluids} setFluids={setFluids} />}
      </div>
    </div>
  );
}

function DashboardTab({ patients, setActiveTab }: { patients: any[], setActiveTab: any }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">Bed Map ICU</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {patients.map(p => (
          <div key={p.id} className={`border rounded-xl p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md cursor-pointer ${
            p.name === 'Kosong' ? 'border-dashed border-slate-300 bg-slate-50' : 'border-rose-200 bg-white dark:bg-slate-800'
          }`} onClick={() => { if(p.name !== 'Kosong') setActiveTab('monitoring'); }}>
            
            {p.name !== 'Kosong' && p.map < 65 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">CRITICAL</div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded mb-2">{p.bed}</span>
                <h4 className="font-bold text-lg">{p.name}</h4>
                <p className="text-sm text-slate-500">{p.diagnosis}</p>
              </div>
            </div>

            {p.name !== 'Kosong' ? (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-500" />
                  <span className="font-bold text-rose-600">{p.hr} bpm</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-blue-500" />
                  <span className="font-bold text-blue-600">{p.bp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-500" />
                  <span className="font-bold text-teal-600">{p.spo2}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="font-bold text-slate-700">MAP: {p.map}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 text-slate-400">
                <Bed className="w-8 h-8 mr-2 opacity-50" /> Bed Tersedia
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MonitoringTab({ patients, vitals, setVitals }: { patients: any[], vitals: any[], setVitals: any }) {
  const [selectedPatient, setSelectedPatient] = useState(patients[0].id);
  const [form, setForm] = useState({ hr: 80, bp_sys: 120, bp_dia: 80, spo2: 98 });

  const activeP = patients.find(p => p.id === selectedPatient);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setVitals([...vitals.slice(-10), { time, ...form }]);
    toast.success("Vital sign berhasil dicatat");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <label className="font-medium">Pasien:</label>
        <select className="input-field max-w-xs" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
          {patients.filter(p => p.name !== 'Kosong').map(p => <option key={p.id} value={p.id}>{p.name} - {p.bed}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-bold mb-4">Grafik Trend Vital Sign (24 Jam)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={vitals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hr" stroke="#ef4444" name="Heart Rate" />
                <Line type="monotone" dataKey="bp_sys" stroke="#3b82f6" name="Sistolik" />
                <Line type="monotone" dataKey="spo2" stroke="#10b981" name="SpO2" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Input Vitals Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label><input type="number" required className="input-field" value={form.hr} onChange={e => setForm({...form, hr: Number(e.target.value)})} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="block text-sm font-medium mb-1">Sistolik</label><input type="number" required className="input-field" value={form.bp_sys} onChange={e => setForm({...form, bp_sys: Number(e.target.value)})} /></div>
              <div><label className="block text-sm font-medium mb-1">Diastolik</label><input type="number" required className="input-field" value={form.bp_dia} onChange={e => setForm({...form, bp_dia: Number(e.target.value)})} /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">SpO2 (%)</label><input type="number" required className="input-field" value={form.spo2} onChange={e => setForm({...form, spo2: Number(e.target.value)})} /></div>
            <button type="submit" className="btn-primary w-full bg-rose-600"><Save className="w-4 h-4 mr-2"/>Simpan Log</button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ScoringTab({ patients, scores, setScores }: { patients: any[], scores: any, setScores: any }) {
  const [selectedPatient, setSelectedPatient] = useState(patients[0].id);
  const [form, setForm] = useState({ gcs: 15, bun: 1.2, pafi: 400, bil: 1.0, plt: 150 });
  
  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    if(form.gcs < 15) score += 1;
    if(form.pafi < 300) score += 2;
    if(form.plt < 100) score += 2;
    if(form.bun > 2.0) score += 2;

    setScores({ ...scores, [selectedPatient]: score });
    toast.success("SOFA Score berhasil dikalkulasi!");
  };

  const patientScore = scores[selectedPatient] || 0;

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">SOFA Score Calculator</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Pasien</label>
        <select className="input-field" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
          {patients.filter(p => p.name !== 'Kosong').map(p => <option key={p.id} value={p.id}>{p.name} - {p.bed}</option>)}
        </select>
      </div>

      <form onSubmit={handleCalc} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">GCS (1-15)</label><input type="number" min="3" max="15" required className="input-field" value={form.gcs} onChange={e => setForm({...form, gcs: Number(e.target.value)})} /></div>
          <div><label className="block text-sm font-medium mb-1">PaO2/FiO2</label><input type="number" required className="input-field" value={form.pafi} onChange={e => setForm({...form, pafi: Number(e.target.value)})} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Platelet (x10³/µL)</label><input type="number" required className="input-field" value={form.plt} onChange={e => setForm({...form, plt: Number(e.target.value)})} /></div>
          <div><label className="block text-sm font-medium mb-1">Creatinine (mg/dL)</label><input type="number" step="0.1" required className="input-field" value={form.bun} onChange={e => setForm({...form, bun: Number(e.target.value)})} /></div>
        </div>
        <button type="submit" className="btn-primary w-full bg-rose-600 mt-4">Kalkulasi Score</button>
      </form>

      {patientScore !== undefined && (
        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
          <h3 className="text-lg font-medium text-slate-500 mb-2">Total SOFA Score</h3>
          <span className={`text-4xl font-bold ${patientScore > 5 ? 'text-red-600' : 'text-emerald-600'}`}>
            {patientScore}
          </span>
          <p className="text-sm mt-2">{patientScore > 5 ? 'Risiko mortalitas tinggi' : 'Kondisi relatif stabil'}</p>
        </div>
      )}
    </div>
  );
}

function VentilatorTab({ patients, vents, setVents }: { patients: any[], vents: any, setVents: any }) {
  const [selectedPatient, setSelectedPatient] = useState(patients[0].id);
  
  const currentSettings = vents[selectedPatient] || { mode: 'PCV', fiO2: 40, peep: 5, rr: 14, pmax: 20 };
  const [form, setForm] = useState(currentSettings);
  useEffect(() => { setForm(vents[selectedPatient] || { mode: 'PCV', fiO2: 40, peep: 5, rr: 14, pmax: 20 }); }, [selectedPatient]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVents({ ...vents, [selectedPatient]: form });
    toast.success("Settings Ventilator disimpan");
  };

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Wind className="text-blue-500 w-6 h-6"/> Ventilator Settings</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Pasien</label>
        <select className="input-field" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
          {patients.filter(p => p.name !== 'Kosong').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mode Ventilasi</label>
          <select className="input-field" value={form.mode} onChange={e => setForm({...form, mode: e.target.value})}>
            <option>PCV (Pressure Control)</option>
            <option>VCV (Volume Control)</option>
            <option>SIMV</option>
            <option>CPAP/PSV</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">FiO2 (%)</label><input type="number" className="input-field" value={form.fiO2} onChange={e => setForm({...form, fiO2: Number(e.target.value)})} /></div>
          <div><label className="block text-sm font-medium mb-1">PEEP (cmH2O)</label><input type="number" className="input-field" value={form.peep} onChange={e => setForm({...form, peep: Number(e.target.value)})} /></div>
          <div><label className="block text-sm font-medium mb-1">RR (x/mnt)</label><input type="number" className="input-field" value={form.rr} onChange={e => setForm({...form, rr: Number(e.target.value)})} /></div>
          <div><label className="block text-sm font-medium mb-1">Pmax / Vt</label><input type="number" className="input-field" value={form.pmax} onChange={e => setForm({...form, pmax: Number(e.target.value)})} /></div>
        </div>
        <button type="submit" className="btn-primary w-full bg-blue-600">Apply Settings</button>
      </form>
    </div>
  );
}

function FluidTab({ patients, fluids, setFluids }: { patients: any[], fluids: any, setFluids: any }) {
  const [selectedPatient, setSelectedPatient] = useState(patients[0].id);
  const data = fluids[selectedPatient] || { in: 0, out: 0, iwls: 500 };
  const [form, setForm] = useState(data);

  useEffect(() => { setForm(fluids[selectedPatient] || { in: 0, out: 0, iwls: 500 }); }, [selectedPatient]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFluids({ ...fluids, [selectedPatient]: form });
    toast.success("Fluid balance disimpan");
  };

  const balance = form.in - form.out - form.iwls;

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Droplet className="text-blue-500 w-6 h-6"/> Fluid Balance / IWL</h2>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Pasien</label>
        <select className="input-field" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
          {patients.filter(p => p.name !== 'Kosong').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1 text-emerald-600">Total Input (ml) (Infus, Oral)</label><input type="number" required className="input-field" value={form.in} onChange={e => setForm({...form, in: Number(e.target.value)})} /></div>
          <div><label className="block text-sm font-medium mb-1 text-red-600">Total Output (ml) (Urine, NGT)</label><input type="number" required className="input-field" value={form.out} onChange={e => setForm({...form, out: Number(e.target.value)})} /></div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IWL Estimasi (ml)</label>
          <input type="number" required className="input-field" value={form.iwls} onChange={e => setForm({...form, iwls: Number(e.target.value)})} />
        </div>
        <button type="submit" className="btn-primary w-full bg-blue-600">Hitung Balance</button>
      </form>

      <div className="mt-8 p-6 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
        <h3 className="text-lg font-medium text-slate-500 mb-2">Kumulatif Fluid Balance (24 Jam)</h3>
        <span className={`text-5xl font-bold ${balance > 0 ? 'text-emerald-600' : balance < 0 ? 'text-red-600' : 'text-slate-600'}`}>
          {balance > 0 ? '+' : ''}{balance} <span className="text-xl">ml</span>
        </span>
      </div>
    </div>
  );
}
