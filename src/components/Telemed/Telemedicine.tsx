import React, { useState, useEffect } from 'react';
import { 
  Video, Calendar, MessageSquare, FileSignature, Activity, Monitor, PhoneCall, StopCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function Telemedicine() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'consultation' | 'prescription' | 'monitoring'>('appointments');

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'consultation', label: 'Video & Chat', icon: Video },
    { id: 'prescription', label: 'E-Prescription', icon: FileSignature },
    { id: 'monitoring', label: 'Remote Monitoring', icon: Activity },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-sky-600 dark:text-sky-500">
            <Video className="w-7 h-7" />
            Telemedicine & Virtual Care
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Layanan konsultasi virtual, peresepan online, dan monitoring pasien jarak jauh.</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-sky-600 dark:text-sky-400' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {activeTab === 'appointments' && <AppointmentsTab />}
        {activeTab === 'consultation' && <ConsultationTab />}
        {activeTab === 'prescription' && <PrescriptionTab />}
        {activeTab === 'monitoring' && <MonitoringTab />}
      </div>
    </div>
  );
}

function AppointmentsTab() {
  const [apps, setApps] = useState<any[]>([
    { id: 'TM-001', name: 'Budi Santoso', date: '2026-08-05', time: '14:00', status: 'Scheduled' }
  ]);
  const [form, setForm] = useState({ name: '', date: '', time: '' });

  

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.name) return;
    setApps([...apps, { id: `TM-${Date.now().toString().slice(-3)}`, ...form, status: 'Scheduled' }]);
    toast.success("Jadwal telemedicine dibuat");
    setForm({ name: '', date: '', time: '' });
  };

  const startCall = (id: string) => {
    toast.success(`Membuka ruang konsultasi untuk ${id}`);
    setApps(apps.map((a:any) => a.id === id ? { ...a, status: 'In Progress' } : a));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 card p-6">
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>
        <form onSubmit={handleBook} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Nama Pasien</label><input type="text" className="input-field" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required/></div>
          <div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" className="input-field" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required/></div>
          <div><label className="block text-sm font-medium mb-1">Jam Konsultasi</label><input type="time" className="input-field" value={form.time} onChange={e=>setForm({...form, time: e.target.value})} required/></div>
          <button type="submit" className="btn-primary w-full bg-sky-600">Simpan Jadwal</button>
        </form>
      </div>
      <div className="lg:col-span-2 card p-6">
        <h3 className="text-lg font-bold mb-4">Jadwal Konsultasi Hari Ini</h3>
        <div className="space-y-3">
           {apps.map((a:any) => (
             <div key={a.id} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 flex justify-between items-center">
               <div>
                 <div className="font-bold text-sky-600">{a.time} - {a.name}</div>
                 <div className="text-xs text-slate-500 font-mono">ID: {a.id} | Tanggal: {a.date}</div>
               </div>
               <div className="flex gap-2">
                 <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded flex items-center">{a.status}</span>
                 {a.status === 'Scheduled' && (
                   <button onClick={() => startCall(a.id)} className="btn-primary py-1 px-3 bg-sky-600 flex items-center gap-2"><Video className="w-3 h-3"/> Join Call</button>
                 )}
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function ConsultationTab() {
  const [msgs, setMsgs] = useState([
    { sender: 'Pasien', text: 'Halo Dok, saya sudah siap.', time: '14:00' },
    { sender: 'Saya', text: 'Halo Pak Budi, mari kita mulai.', time: '14:01' }
  ]);
  const [chat, setChat] = useState('');
  const [inCall, setInCall] = useState(true);

  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if(!chat) return;
    setMsgs([...msgs, { sender: 'Saya', text: chat, time: new Date().toLocaleTimeString().slice(0,5) }]);
    setChat('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      <div className="lg:col-span-2 flex flex-col gap-4">
        {inCall ? (
          <div className="flex-1 bg-slate-900 rounded-lg relative overflow-hidden flex items-center justify-center border border-slate-700">
            <div className="text-white text-center opacity-50">
              <Video className="w-16 h-16 mx-auto mb-2 opacity-50" />
              <p>Simulasi Video Call (Pasien: Budi Santoso)</p>
            </div>
            {/* Self view pip */}
            <div className="absolute bottom-4 right-4 w-40 h-32 bg-slate-800 rounded border border-slate-600 flex items-center justify-center text-xs text-slate-400">
               Self View
            </div>
            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
              <button className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white"><Monitor className="w-5 h-5"/></button>
              <button onClick={() => setInCall(false)} className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white"><StopCircle className="w-6 h-6"/></button>
            </div>
          </div>
        ) : (
          <div className="flex-1 card flex flex-col items-center justify-center text-slate-500">
             <PhoneCall className="w-12 h-12 mb-2" />
             <p>Panggilan telah diakhiri.</p>
             <button onClick={() => setInCall(true)} className="btn-primary mt-4 bg-sky-600">Rejoin Call</button>
          </div>
        )}
      </div>
      <div className="card flex flex-col p-4">
        <h3 className="font-bold border-b pb-2 mb-2">Live Chat</h3>
        <div className="flex-1 overflow-y-auto space-y-3 p-2">
          {msgs.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.sender === 'Saya' ? 'items-end' : 'items-start'}`}>
               <span className="text-[10px] text-slate-400 mb-1">{m.sender} - {m.time}</span>
               <div className={`text-sm px-3 py-2 rounded-lg ${m.sender === 'Saya' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                 {m.text}
               </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMsg} className="mt-2 flex gap-2">
          <input type="text" className="input-field flex-1" placeholder="Ketik pesan..." value={chat} onChange={e=>setChat(e.target.value)} />
          <button type="submit" className="btn-secondary">Kirim</button>
        </form>
      </div>
    </div>
  );
}

function PrescriptionTab() {
  const [rx, setRx] = useState<any[]>([]);
  const [form, setForm] = useState({ patient: 'Budi Santoso', med: '', dose: '', notes: '' });

  

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.med) return;
    setRx([{ id: `RX-T-${Date.now().toString().slice(-4)}`, ...form }, ...rx]);
    toast.success("E-Prescription berhasil dibuat & dikirim ke farmasi online");
    setForm({ ...form, med: '', dose: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="card p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileSignature className="w-5 h-5 text-sky-600"/> E-Prescription</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Nama Pasien</label><input type="text" className="input-field" value={form.patient} readOnly /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Nama Obat</label><input type="text" className="input-field" placeholder="Cth: Paracetamol" value={form.med} onChange={e=>setForm({...form, med: e.target.value})} required/></div>
            <div><label className="block text-sm font-medium mb-1">Dosis & Aturan Pakai</label><input type="text" className="input-field" placeholder="Cth: 500mg, 3x1" value={form.dose} onChange={e=>setForm({...form, dose: e.target.value})} required/></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Catatan Tambahan</label><input type="text" className="input-field" value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} /></div>
          <button type="submit" className="btn-primary w-full bg-sky-600 hover:bg-sky-700">Terbitkan Resep</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4">Riwayat Resep Telemedicine</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b">ID Resep</th>
              <th className="p-3 border-b">Pasien</th>
              <th className="p-3 border-b">Obat & Dosis</th>
              <th className="p-3 border-b">Status Pengiriman</th>
            </tr>
          </thead>
          <tbody>
            {rx.map(r => (
              <tr key={r.id}>
                <td className="p-3 border-b font-mono font-bold">{r.id}</td>
                <td className="p-3 border-b">{r.patient}</td>
                <td className="p-3 border-b">{r.med} <span className="text-xs bg-slate-100 px-1 rounded">{r.dose}</span></td>
                <td className="p-3 border-b text-xs"><span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Diproses Farmasi</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MonitoringTab() {
  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-sky-600"/> Remote Patient Monitoring (IoT)</h2>
        <select className="input-field py-1 w-48 text-sm"><option>Pasien: Budi Santoso</option></select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 border border-rose-200 bg-rose-50 rounded-lg text-center">
          <div className="text-sm font-bold text-rose-800">Tekanan Darah (SmartBP)</div>
          <div className="text-3xl font-bold text-rose-600 my-2">120/80</div>
          <div className="text-xs text-rose-500">Update: 5 menit lalu</div>
        </div>
        <div className="p-4 border border-sky-200 bg-sky-50 rounded-lg text-center">
          <div className="text-sm font-bold text-sky-800">SpO2 (Oximeter)</div>
          <div className="text-3xl font-bold text-sky-600 my-2">98%</div>
          <div className="text-xs text-sky-500">Update: Realtime</div>
        </div>
        <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg text-center">
          <div className="text-sm font-bold text-emerald-800">Gula Darah (CGM)</div>
          <div className="text-3xl font-bold text-emerald-600 my-2">105 mg/dL</div>
          <div className="text-xs text-emerald-500">Update: 1 jam lalu</div>
        </div>
      </div>

      <div className="h-64 border rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-col">
         {/* Simulated chart area */}
         <Activity className="w-12 h-12 text-slate-300 mb-2" />
         <p className="text-sm text-slate-500">Grafik tren harian (Simulasi)</p>
      </div>
    </div>
  );
}
