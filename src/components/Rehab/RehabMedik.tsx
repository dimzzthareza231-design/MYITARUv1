import React, { useState, useEffect } from 'react';
import { 
  Activity, ClipboardList, UserCheck, Dumbbell, Calendar, 
  CheckCircle, Plus, FileText, Download, TrendingUp, Search, Save
} from 'lucide-react';
import toast from 'react-hot-toast';

export function RehabMedik() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'asesmen' | 'sesi' | 'progress' | 'homeprogram'>('dashboard');

  const [patients] = useState([
    { id: 'RM-001', name: 'Tn. Budi Santoso', diagnosis: 'Post-Stroke Hemiparese' },
    { id: 'RM-002', name: 'Ny. Siti Aminah', diagnosis: 'Osteoarthritis Genu' },
  ]);

  const [assessments, setAssessments] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [programs, setPrograms] = useState<any[]>([]);

  
  
  

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'asesmen', label: 'Asesmen (Barthel)', icon: ClipboardList },
    { id: 'sesi', label: 'Catat Sesi (SOAP)', icon: UserCheck },
    { id: 'progress', label: 'Progress Tracking', icon: TrendingUp },
    { id: 'homeprogram', label: 'Home Program', icon: Dumbbell },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-violet-600 dark:text-violet-500">
            <Activity className="w-7 h-7" />
            Rehabilitasi Medik (Fisioterapi)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Asesmen fungsi, pencatatan sesi terapi, dan home program.</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-600 dark:text-violet-400' 
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
        {activeTab === 'asesmen' && <AsesmenTab patients={patients} assessments={assessments} setAssessments={setAssessments} />}
        {activeTab === 'sesi' && <SesiTab patients={patients} sessions={sessions} setSessions={setSessions} />}
        {activeTab === 'progress' && <ProgressTab patients={patients} sessions={sessions} />}
        {activeTab === 'homeprogram' && <HomeProgramTab patients={patients} programs={programs} setPrograms={setPrograms} />}
      </div>
    </div>
  );


function DashboardTab({ patients, setActiveTab }: { patients: any[], setActiveTab: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-l-violet-500">
          <p className="text-sm font-medium text-slate-500">Total Pasien Aktif</p>
          <h3 className="text-2xl font-bold mt-1 text-violet-600">{patients.length}</h3>
        </div>
        <div className="card p-5 border-l-4 border-l-blue-500">
          <p className="text-sm font-medium text-slate-500">Sesi Terapi Hari Ini</p>
          <h3 className="text-2xl font-bold mt-1 text-blue-600">8</h3>
        </div>
      </div>
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Daftar Pasien Rehab</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">ID</th>
              <th className="p-3 border-b">Nama</th>
              <th className="p-3 border-b">Diagnosis Rehab</th>
              <th className="p-3 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id}>
                <td className="p-3 border-b font-mono">{p.id}</td>
                <td className="p-3 border-b font-medium">{p.name}</td>
                <td className="p-3 border-b">{p.diagnosis}</td>
                <td className="p-3 border-b">
                  <button onClick={() => setActiveTab('asesmen')} className="text-violet-600 font-bold hover:underline text-xs">Buat Asesmen</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AsesmenTab({ patients, assessments, setAssessments }: { patients: any[], assessments: any[], setAssessments: any }) {
  const [patient, setPatient] = useState('');
  const [scores, setScores] = useState({ makan: 0, mandi: 0, berpakaian: 0, bab: 0, bak: 0, mobilitas: 0 });

  const totalScore: number = Object.values(scores).reduce((a, b) => Number(a) + Number(b), 0) as number;

  const getKategori = (score: number) => {
    if (score >= 20) return 'Mandiri';
    if (score >= 12) return 'Ketergantungan Ringan';
    if (score >= 9) return 'Ketergantungan Sedang';
    if (score >= 5) return 'Ketergantungan Berat';
    return 'Ketergantungan Total';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) { toast.error("Pilih pasien!"); return; }
    
    setAssessments([{
      id: Date.now(),
      patientName: patients.find(p => p.id === patient)?.name,
      score: totalScore,
      kategori: getKategori(totalScore),
      date: new Date().toISOString().split('T')[0]
    }, ...assessments]);
    toast.success("Asesmen Barthel Index disimpan");
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Indeks Barthel (Activity of Daily Living)</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Pasien</label>
            <select className="input-field" value={patient} onChange={e => setPatient(e.target.value)}>
              <option value="">-- Pilih --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">Makan (0-5)</label>
              <input type="number" min="0" max="5" className="input-field" value={scores.makan} onChange={e => setScores({...scores, makan: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Mandi (0-5)</label>
              <input type="number" min="0" max="5" className="input-field" value={scores.mandi} onChange={e => setScores({...scores, mandi: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Berpakaian (0-5)</label>
              <input type="number" min="0" max="5" className="input-field" value={scores.berpakaian} onChange={e => setScores({...scores, berpakaian: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">BAB (0-5)</label>
              <input type="number" min="0" max="5" className="input-field" value={scores.bab} onChange={e => setScores({...scores, bab: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">BAK (0-5)</label>
              <input type="number" min="0" max="5" className="input-field" value={scores.bak} onChange={e => setScores({...scores, bak: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Mobilitas (0-5)</label>
              <input type="number" min="0" max="5" className="input-field" value={scores.mobilitas} onChange={e => setScores({...scores, mobilitas: Number(e.target.value)})} />
            </div>
          </div>

          <div className="flex justify-between items-center bg-violet-50 p-4 rounded-lg border border-violet-200">
            <div>
              <p className="text-sm font-bold text-violet-800">Total Skor: {totalScore} / 30</p>
              <p className="text-xs text-violet-600">{getKategori(totalScore)}</p>
            </div>
            <button type="submit" className="btn-primary bg-violet-600 hover:bg-violet-700">Simpan Asesmen</button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Riwayat Asesmen</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Tanggal</th>
              <th className="p-3 border-b">Pasien</th>
              <th className="p-3 border-b">Skor</th>
              <th className="p-3 border-b">Kategori</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map(a => (
              <tr key={a.id}>
                <td className="p-3 border-b">{a.date}</td>
                <td className="p-3 border-b font-medium">{a.patientName}</td>
                <td className="p-3 border-b font-bold">{a.score}</td>
                <td className="p-3 border-b">{a.kategori}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SesiTab({ patients, sessions, setSessions }: { patients: any[], sessions: any[], setSessions: any }) {
  const [form, setForm] = useState({ patient: '', s: '', o: '', a: '', p: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient) { toast.error("Pilih pasien!"); return; }
    
    setSessions([{
      id: Date.now(),
      patientName: patients.find(p => p.id === form.patient)?.name,
      patientId: form.patient,
      ...form,
      date: new Date().toISOString().split('T')[0]
    }, ...sessions]);
    toast.success("Catatan SOAP Sesi Terapi disimpan");
    setForm({ patient: '', s: '', o: '', a: '', p: '' });
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Catat Sesi Terapi (SOAP)</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pasien</label>
            <select className="input-field" value={form.patient} onChange={e => setForm({...form, patient: e.target.value})}>
              <option value="">-- Pilih --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-bold mb-1 text-slate-700">Subjective (Keluhan)</label><textarea required className="input-field" value={form.s} onChange={e => setForm({...form, s: e.target.value})}></textarea></div>
          <div><label className="block text-sm font-bold mb-1 text-slate-700">Objective (Pemeriksaan/ROM)</label><textarea required className="input-field" value={form.o} onChange={e => setForm({...form, o: e.target.value})}></textarea></div>
          <div><label className="block text-sm font-bold mb-1 text-slate-700">Assessment (Diagnosis Fungsional)</label><textarea required className="input-field" value={form.a} onChange={e => setForm({...form, a: e.target.value})}></textarea></div>
          <div><label className="block text-sm font-bold mb-1 text-slate-700">Plan (Intervensi)</label><textarea required className="input-field" value={form.p} onChange={e => setForm({...form, p: e.target.value})}></textarea></div>
          <button type="submit" className="btn-primary w-full bg-violet-600"><Save className="w-4 h-4 mr-2"/>Simpan SOAP</button>
        </form>
      </div>
    </div>
  );
}

function ProgressTab({ patients, sessions }: { patients: any[], sessions: any[] }) {
  const [patient, setPatient] = useState('');
  const patientSessions = sessions.filter(s => s.patientId === patient);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4">Progress Tracking</h2>
      <div className="mb-6 max-w-xs">
        <label className="block text-sm font-medium mb-1">Pilih Pasien</label>
        <select className="input-field" value={patient} onChange={e => setPatient(e.target.value)}>
          <option value="">-- Pilih --</option>
          {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      
      {patient && (
        <div className="space-y-4">
          {patientSessions.length === 0 ? (
            <p className="text-slate-500">Belum ada sesi terapi.</p>
          ) : (
            patientSessions.map(s => (
              <div key={s.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2 border-b pb-2">
                  <h4 className="font-bold text-violet-600">Catatan Sesi</h4>
                  <span className="text-xs text-slate-500">{s.date}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2">
                  <div><strong>S:</strong> {s.s}</div>
                  <div><strong>O:</strong> {s.o}</div>
                  <div><strong>A:</strong> {s.a}</div>
                  <div><strong>P:</strong> {s.p}</div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function HomeProgramTab({ patients, programs, setPrograms }: { patients: any[], programs: any[], setPrograms: any }) {
  const [form, setForm] = useState({ patient: '', program: 'Strengthening Exercises (Theraband)', durasi: '15 Menit', frekuensi: '2x Sehari' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient) { toast.error("Pilih pasien!"); return; }
    
    setPrograms([{
      id: Date.now(),
      patientName: patients.find(p => p.id === form.patient)?.name,
      ...form,
      date: new Date().toISOString().split('T')[0]
    }, ...programs]);
    toast.success("Home Program berhasil di-generate");
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Generate Home Program</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Pasien</label>
            <select className="input-field" value={form.patient} onChange={e => setForm({...form, patient: e.target.value})}>
              <option value="">-- Pilih --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Jenis Program Latihan</label>
            <input type="text" className="input-field" value={form.program} onChange={e => setForm({...form, program: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Durasi per Sesi</label>
            <input type="text" className="input-field" value={form.durasi} onChange={e => setForm({...form, durasi: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Frekuensi</label>
            <input type="text" className="input-field" value={form.frekuensi} onChange={e => setForm({...form, frekuensi: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="btn-primary w-full bg-violet-600"><Plus className="w-4 h-4 mr-2"/>Generate & Assign</button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Daftar Home Program Aktif</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Tanggal</th>
              <th className="p-3 border-b">Pasien</th>
              <th className="p-3 border-b">Program Latihan</th>
              <th className="p-3 border-b">Dosis (Durasi/Frekuensi)</th>
              <th className="p-3 border-b text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {programs.map(p => (
              <tr key={p.id}>
                <td className="p-3 border-b">{p.date}</td>
                <td className="p-3 border-b font-medium">{p.patientName}</td>
                <td className="p-3 border-b font-bold text-violet-600">{p.program}</td>
                <td className="p-3 border-b">{p.durasi}, {p.frekuensi}</td>
                <td className="p-3 border-b text-right">
                  <button className="text-slate-500 hover:text-slate-800"><Download className="w-4 h-4" onClick={() => toast.success("PDF Diunduh")}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

}
