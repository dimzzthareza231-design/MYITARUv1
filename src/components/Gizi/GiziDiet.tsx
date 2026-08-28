import React, { useState, useEffect } from 'react';
import { 
  Apple, Utensils, ClipboardList, BookOpen, Activity, FileText, CheckCircle, Save, Download
} from 'lucide-react';
import toast from 'react-hot-toast';

export function GiziDiet() {
  const [activeTab, setActiveTab] = useState<'screening' | 'prescription' | 'intake' | 'edukasi'>('screening');

  const [patients] = useState([
    { id: 'RM-001', name: 'Tn. Budi Santoso', ruangan: 'Mawar 01' },
    { id: 'RM-002', name: 'Ny. Siti Aminah', ruangan: 'Melati 03' },
  ]);

  const [screenings, setScreenings] = useState<any[]>(() => JSON.parse(localStorage.getItem('gizi_screenings') || '[]'));
  const [prescriptions, setPrescriptions] = useState<any[]>(() => JSON.parse(localStorage.getItem('gizi_prescriptions') || '[]'));
  const [intakes, setIntakes] = useState<any[]>(() => JSON.parse(localStorage.getItem('gizi_intakes') || '[]'));

  useEffect(() => { localStorage.setItem('gizi_screenings', JSON.stringify(screenings)); }, [screenings]);
  useEffect(() => { localStorage.setItem('gizi_prescriptions', JSON.stringify(prescriptions)); }, [prescriptions]);
  useEffect(() => { localStorage.setItem('gizi_intakes', JSON.stringify(intakes)); }, [intakes]);

  const tabs = [
    { id: 'screening', label: 'Screening Gizi (MST)', icon: ClipboardList },
    { id: 'prescription', label: 'Preskripsi Diet', icon: Utensils },
    { id: 'intake', label: 'Monitoring Asupan', icon: Activity },
    { id: 'edukasi', label: 'Edukasi Gizi', icon: BookOpen },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
            <Apple className="w-7 h-7" />
            Gizi & Diet Klinik
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Screening, preskripsi, dan monitoring asupan nutrisi pasien.</p>
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
        {activeTab === 'screening' && <ScreeningTab patients={patients} screenings={screenings} setScreenings={setScreenings} />}
        {activeTab === 'prescription' && <PrescriptionTab patients={patients} prescriptions={prescriptions} setPrescriptions={setPrescriptions} />}
        {activeTab === 'intake' && <IntakeTab patients={patients} intakes={intakes} setIntakes={setIntakes} />}
        {activeTab === 'edukasi' && <EdukasiTab />}
      </div>
    </div>
  );
}

function ScreeningTab({ patients, screenings, setScreenings }: { patients: any[], screenings: any[], setScreenings: any }) {
  const [patient, setPatient] = useState('');
  const [q1, setQ1] = useState(0);
  const [q2, setQ2] = useState(0);

  const score = q1 + q2;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) { toast.error("Pilih pasien!"); return; }
    
    setScreenings([{
      id: Date.now(),
      patientId: patient,
      patientName: patients.find(p => p.id === patient)?.name,
      score,
      date: new Date().toISOString().split('T')[0],
      risk: score >= 2 ? 'Tinggi' : 'Rendah'
    }, ...screenings]);
    
    toast.success("Screening MST berhasil disimpan");
    setPatient(''); setQ1(0); setQ2(0);
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Malnutrition Screening Tool (MST)</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Pasien</label>
            <select className="input-field" value={patient} onChange={e => setPatient(e.target.value)}>
              <option value="">-- Pilih Pasien --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name} - {p.ruangan}</option>)}
            </select>
          </div>

          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="font-bold">1. Apakah pasien mengalami penurunan berat badan yang tidak direncanakan?</p>
            <label className="flex items-center gap-2"><input type="radio" name="q1" checked={q1 === 0} onChange={() => setQ1(0)} /> Tidak (0)</label>
            <label className="flex items-center gap-2"><input type="radio" name="q1" checked={q1 === 1} onChange={() => setQ1(1)} /> Ya, 1-5 kg (1)</label>
            <label className="flex items-center gap-2"><input type="radio" name="q1" checked={q1 === 2} onChange={() => setQ1(2)} /> Ya, 6-10 kg (2)</label>
            <label className="flex items-center gap-2"><input type="radio" name="q1" checked={q1 === 3} onChange={() => setQ1(3)} /> Ya, &gt;11 kg (3)</label>
          </div>

          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p className="font-bold">2. Apakah asupan makan berkurang karena penurunan nafsu makan?</p>
            <label className="flex items-center gap-2"><input type="radio" name="q2" checked={q2 === 0} onChange={() => setQ2(0)} /> Tidak (0)</label>
            <label className="flex items-center gap-2"><input type="radio" name="q2" checked={q2 === 1} onChange={() => setQ2(1)} /> Ya (1)</label>
          </div>

          <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <div>
              <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Total Skor MST: {score}</p>
              <p className="text-xs text-emerald-600">{score >= 2 ? 'Risiko Malnutrisi (Perlu asesmen lanjut)' : 'Risiko Rendah'}</p>
            </div>
            <button type="submit" className="btn-primary bg-emerald-600 hover:bg-emerald-700">Simpan Hasil</button>
          </div>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Riwayat Screening</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Tanggal</th>
              <th className="p-3 border-b">Pasien</th>
              <th className="p-3 border-b">Skor MST</th>
              <th className="p-3 border-b">Risiko</th>
            </tr>
          </thead>
          <tbody>
            {screenings.map(s => (
              <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3 border-b text-slate-500">{s.date}</td>
                <td className="p-3 border-b font-medium">{s.patientName}</td>
                <td className="p-3 border-b font-bold">{s.score}</td>
                <td className="p-3 border-b">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${s.risk === 'Tinggi' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {s.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PrescriptionTab({ patients, prescriptions, setPrescriptions }: { patients: any[], prescriptions: any[], setPrescriptions: any }) {
  const [form, setForm] = useState({ patient: '', dietType: 'Biasa', kalori: 1900, protein: 60, cairan: 1500, catatan: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient) { toast.error("Pilih pasien!"); return; }
    
    setPrescriptions([{
      id: Date.now(),
      patientName: patients.find(p => p.id === form.patient)?.name,
      ...form,
      date: new Date().toISOString().split('T')[0]
    }, ...prescriptions]);
    toast.success("Preskripsi diet berhasil disimpan");
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Utensils className="w-6 h-6 text-emerald-600"/> Form Preskripsi Diet</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pasien</label>
            <select className="input-field" value={form.patient} onChange={e => setForm({...form, patient: e.target.value})}>
              <option value="">-- Pilih Pasien --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name} - {p.ruangan}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Jenis Diet</label>
              <select className="input-field" value={form.dietType} onChange={e => setForm({...form, dietType: e.target.value})}>
                <option>Biasa</option><option>Lunak</option><option>Saring</option><option>Cair</option>
                <option>Rendah Garam (RG)</option><option>Diet Diabetes (DM)</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Target Kalori (kkal)</label><input type="number" required className="input-field" value={form.kalori} onChange={e => setForm({...form, kalori: Number(e.target.value)})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Protein (g)</label><input type="number" required className="input-field" value={form.protein} onChange={e => setForm({...form, protein: Number(e.target.value)})} /></div>
            <div><label className="block text-sm font-medium mb-1">Restriksi Cairan (ml/hari)</label><input type="number" required className="input-field" value={form.cairan} onChange={e => setForm({...form, cairan: Number(e.target.value)})} /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Catatan Tambahan (Alergi, dll)</label><textarea className="input-field" value={form.catatan} onChange={e => setForm({...form, catatan: e.target.value})}></textarea></div>
          <button type="submit" className="btn-primary w-full bg-emerald-600"><Save className="w-4 h-4 mr-2"/>Simpan Preskripsi</button>
        </form>
      </div>
      
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Daftar Diet Aktif</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Tanggal</th>
              <th className="p-3 border-b">Pasien</th>
              <th className="p-3 border-b">Jenis Diet</th>
              <th className="p-3 border-b">Target Kalori</th>
              <th className="p-3 border-b">Catatan</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map(p => (
              <tr key={p.id}>
                <td className="p-3 border-b text-slate-500">{p.date}</td>
                <td className="p-3 border-b font-medium">{p.patientName}</td>
                <td className="p-3 border-b font-bold text-emerald-600">{p.dietType}</td>
                <td className="p-3 border-b">{p.kalori} kkal</td>
                <td className="p-3 border-b text-sm">{p.catatan || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IntakeTab({ patients, intakes, setIntakes }: { patients: any[], intakes: any[], setIntakes: any }) {
  const [form, setForm] = useState({ patient: '', waktu: 'Pagi', porsi: 100 });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patient) { toast.error("Pilih pasien!"); return; }
    setIntakes([{
      id: Date.now(),
      patientName: patients.find(p => p.id === form.patient)?.name,
      ...form,
      date: new Date().toISOString().split('T')[0]
    }, ...intakes]);
    toast.success("Asupan dicatat");
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Pencatatan Asupan Makan (Comstock)</h2>
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Pasien</label>
            <select className="input-field" value={form.patient} onChange={e => setForm({...form, patient: e.target.value})}>
              <option value="">-- Pilih --</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Waktu</label>
            <select className="input-field" value={form.waktu} onChange={e => setForm({...form, waktu: e.target.value})}>
              <option>Pagi</option><option>Siang</option><option>Malam</option><option>Snack</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Porsi Habis (%)</label>
            <select className="input-field" value={form.porsi} onChange={e => setForm({...form, porsi: Number(e.target.value)})}>
              <option value={100}>100% (Habis)</option>
              <option value={75}>75% (Sisa 1/4)</option>
              <option value={50}>50% (Sisa 1/2)</option>
              <option value={25}>25% (Sisa 3/4)</option>
              <option value={0}>0% (Utuh)</option>
            </select>
          </div>
          <button type="submit" className="btn-primary bg-emerald-600"><Save className="w-4 h-4 mr-2"/>Catat</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Log Asupan Hari Ini</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">Pasien</th>
              <th className="p-3 border-b">Waktu</th>
              <th className="p-3 border-b">Porsi Habis</th>
            </tr>
          </thead>
          <tbody>
            {intakes.map(i => (
              <tr key={i.id}>
                <td className="p-3 border-b font-medium">{i.patientName}</td>
                <td className="p-3 border-b">{i.waktu}</td>
                <td className="p-3 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${i.porsi >= 75 ? 'bg-emerald-500' : i.porsi >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${i.porsi}%` }}></div>
                    </div>
                    <span className="text-xs font-bold w-10">{i.porsi}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EdukasiTab() {
  const lib = [
    { title: 'Diet Diabetes Mellitus (DM)', category: 'Penyakit Dalam' },
    { title: 'Diet Rendah Garam (Hipertensi)', category: 'Kardiovaskular' },
    { title: 'Diet Lambung & Lunak', category: 'Pencernaan' },
    { title: 'Nutrisi Ibu Hamil & Menyusui', category: 'Kandungan' },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4">Library Edukasi Gizi (Brosur / Leaflet)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lib.map((l, i) => (
          <div key={i} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-500" />
              <div>
                <h4 className="font-bold">{l.title}</h4>
                <p className="text-xs text-slate-500">{l.category}</p>
              </div>
            </div>
            <button className="btn-secondary text-sm" onClick={() => toast.success("Brosur di-download!")}><Download className="w-4 h-4 mr-2"/>Unduh</button>
          </div>
        ))}
      </div>
    </div>
  );
}
