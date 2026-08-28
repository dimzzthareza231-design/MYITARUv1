import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, Calendar, Clock, FileBadge, TrendingUp, 
  Plus, AlertTriangle, FileText, UserCheck, Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import SmartTable from './SmartTable';
import { COLS } from '../data/moduleRegistry';

export function ManajemenSDM() {
  const outletCtx = useOutletContext<{ activeTab?: string }>();
  const [internalTab, setInternalTab] = useState<string>('Data Pegawai');

  const activeTab = outletCtx?.activeTab || internalTab;

  const [shifts, setShifts] = useState<any[]>(() => JSON.parse(localStorage.getItem('shifts') || '[]'));
  const [kehadiran, setKehadiran] = useState<any[]>(() => JSON.parse(localStorage.getItem('kehadiran') || '[]'));
  const [cuti, setCuti] = useState<any[]>(() => JSON.parse(localStorage.getItem('cuti') || '[]'));
  const [kredensial, setKredensial] = useState<any[]>([
    { id: 1, nama: 'dr. Andi Pratama', tipe: 'SIP', no: 'SIP/123/2021', expired: '2026-08-15', status: 'Warning' },
    { id: 2, nama: 'Ns. Siti Aminah', tipe: 'STR', no: 'STR/456/2022', expired: '2027-10-10', status: 'Active' },
    { id: 3, nama: 'Budi Santoso', tipe: 'SIP', no: 'SIP/789/2020', expired: '2026-08-01', status: 'Expired' }
  ]);

  useEffect(() => { localStorage.setItem('shifts', JSON.stringify(shifts)); }, [shifts]);
  useEffect(() => { localStorage.setItem('kehadiran', JSON.stringify(kehadiran)); }, [kehadiran]);
  useEffect(() => { localStorage.setItem('cuti', JSON.stringify(cuti)); }, [cuti]);

  const tabs = [
    { id: 'Data Pegawai', label: 'Data Pegawai', icon: Users },
    { id: 'Data Dokter', label: 'Data Dokter', icon: UserCheck },
    { id: 'Jadwal Shift', label: 'Jadwal Shift', icon: Calendar },
    { id: 'Kehadiran', label: 'Kehadiran', icon: Clock },
    { id: 'Pengajuan Cuti', label: 'Pengajuan Cuti', icon: FileText },
    { id: 'Kredensial', label: 'Kredensial', icon: FileBadge },
    { id: 'Dashboard', label: 'Dashboard', icon: TrendingUp },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-400">
            <Users className="w-7 h-7 text-indigo-400" />
            Manajemen SDM & Shift
          </h1>
          <p className="text-slate-400 text-sm mt-1">Kelola data pegawai, dokter, jadwal shift, kehadiran, dan kredensial staf.</p>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-slate-800/80 rounded-xl overflow-x-auto custom-scrollbar shrink-0 border border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setInternalTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-cyan-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {(activeTab === 'Data Pegawai' || activeTab === 'pegawai') && (
          <SmartTable
            storageKey="db_perawat"
            columns={COLS.pegawai}
            title="Data Pegawai (Staf & Perawat)"
          />
        )}
        {(activeTab === 'Data Dokter' || activeTab === 'dokter') && (
          <SmartTable
            storageKey="db_dokter"
            columns={COLS.pegawai}
            title="Data Dokter Medis"
          />
        )}
        {(activeTab === 'Jadwal Shift' || activeTab === 'roster' || activeTab === 'jadwal') && (
          <RosterTab shifts={shifts} setShifts={setShifts} />
        )}
        {(activeTab === 'Kehadiran' || activeTab === 'kehadiran') && (
          <KehadiranTab kehadiran={kehadiran} setKehadiran={setKehadiran} />
        )}
        {(activeTab === 'Pengajuan Cuti' || activeTab === 'cuti') && (
          <CutiTab cuti={cuti} setCuti={setCuti} />
        )}
        {(activeTab === 'Kredensial' || activeTab === 'kredensial') && (
          <KredensialTab kredensial={kredensial} setKredensial={setKredensial} />
        )}
        {(activeTab === 'Dashboard' || activeTab === 'dashboard') && (
          <DashboardTab kredensial={kredensial} setActiveTab={setInternalTab} />
        )}
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function DashboardTab({ kredensial, setActiveTab }: { kredensial: any[], setActiveTab: any }) {
  const expiredCount = kredensial.filter(k => k.status === 'Warning' || k.status === 'Expired').length;
  
  const stats = [
    { label: 'Total Staf Aktif', value: '145', color: 'text-indigo-400', border: 'border-l-indigo-500' },
    { label: 'Hadir Hari Ini', value: '89', color: 'text-emerald-400', border: 'border-l-emerald-500' },
    { label: 'Cuti / Sakit', value: '4', color: 'text-amber-400', border: 'border-l-amber-500' },
    { label: 'On-Call', value: '3', color: 'text-rose-400', border: 'border-l-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {expiredCount > 0 && (
        <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-4 flex items-start gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-900/50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-amber-400">Action Required: Kredensial Mendekati Expired</h3>
            <p className="text-sm text-amber-300 mt-1">Terdapat {expiredCount} staf dengan STR/SIP yang akan/telah habis masa berlakunya.</p>
            <button onClick={() => setActiveTab('Kredensial')} className="mt-3 text-sm font-bold text-amber-400 hover:underline">Lihat Detail →</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`bg-slate-800 p-5 rounded-xl border border-slate-700 border-l-4 ${s.border}`}>
            <p className="text-sm font-medium text-slate-400">{s.label}</p>
            <h3 className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

function RosterTab({ shifts, setShifts }: { shifts: any[], setShifts: any }) {
  const [staf, setStaf] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [shift, setShift] = useState('Pagi');

  const stafList = ['dr. Andi Pratama', 'dr. Budi Santoso', 'Ns. Siti Aminah', 'Ns. Dewi Lestari'];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staf || !tanggal || !shift) {
      toast.error("Lengkapi data form!");
      return;
    }
    const newShift = { id: Date.now(), staf, tanggal, shift };
    setShifts([...shifts, newShift]);
    toast.success("Shift berhasil ditugaskan!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Assign Shift (Kalender / Penugasan)</h2>
        <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Pilih Staf</label>
            <select className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={staf} onChange={e => setStaf(e.target.value)}>
              <option value="">-- Pilih Staf --</option>
              {stafList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Tanggal</label>
            <input type="date" className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={tanggal} onChange={e => setTanggal(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Shift</label>
            <select className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={shift} onChange={e => setShift(e.target.value)}>
              <option value="Pagi">Pagi (07:00 - 15:00)</option>
              <option value="Siang">Siang (15:00 - 22:00)</option>
              <option value="Malam">Malam (22:00 - 07:00)</option>
              <option value="On-Call">On-Call</option>
            </select>
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/>Assign</button>
        </form>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-white">Daftar Jadwal (Roster)</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="p-3 border-b border-slate-700 text-slate-300">Staf</th>
              <th className="p-3 border-b border-slate-700 text-slate-300">Tanggal</th>
              <th className="p-3 border-b border-slate-700 text-slate-300">Shift</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-slate-300">
            {shifts.length === 0 ? (
              <tr><td colSpan={3} className="p-6 text-center text-slate-500">Belum ada shift ditugaskan</td></tr>
            ) : (
              shifts.map(s => (
                <tr key={s.id} className="hover:bg-slate-700/30">
                  <td className="p-3 font-medium text-white">{s.staf}</td>
                  <td className="p-3 text-slate-400">{s.tanggal}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      s.shift === 'Pagi' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      s.shift === 'Siang' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      s.shift === 'Malam' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {s.shift}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KehadiranTab({ kehadiran, setKehadiran }: { kehadiran: any[], setKehadiran: any }) {
  const [staf, setStaf] = useState('');
  const [jamMasuk, setJamMasuk] = useState('');
  const [jamKeluar, setJamKeluar] = useState('');

  const stafList = ['dr. Andi Pratama', 'dr. Budi Santoso', 'Ns. Siti Aminah', 'Ns. Dewi Lestari'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staf || (!jamMasuk && !jamKeluar)) {
      toast.error("Pilih staf dan masukkan minimal jam masuk atau keluar");
      return;
    }
    setKehadiran([{
      id: Date.now(),
      staf,
      tanggal: new Date().toISOString().split('T')[0],
      jamMasuk: jamMasuk || '-',
      jamKeluar: jamKeluar || '-'
    }, ...kehadiran]);
    toast.success("Kehadiran dicatat");
    setStaf(''); setJamMasuk(''); setJamKeluar('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Form Input Kehadiran</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Staf</label>
            <select className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={staf} onChange={e => setStaf(e.target.value)}>
              <option value="">-- Pilih Staf --</option>
              {stafList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Jam Masuk</label>
            <input type="time" className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={jamMasuk} onChange={e => setJamMasuk(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Jam Keluar</label>
            <input type="time" className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={jamKeluar} onChange={e => setJamKeluar(e.target.value)} />
          </div>
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2"><Save className="w-4 h-4"/>Simpan</button>
        </form>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-white">Log Kehadiran Hari Ini</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="p-3 border-b border-slate-700 text-slate-300">Staf</th>
              <th className="p-3 border-b border-slate-700 text-slate-300">Tanggal</th>
              <th className="p-3 border-b border-slate-700 text-slate-300">Jam Masuk</th>
              <th className="p-3 border-b border-slate-700 text-slate-300">Jam Keluar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-slate-300">
            {kehadiran.length === 0 ? (
              <tr><td colSpan={4} className="p-6 text-center text-slate-500">Belum ada log kehadiran</td></tr>
            ) : (
              kehadiran.map(k => (
                <tr key={k.id} className="hover:bg-slate-700/30">
                  <td className="p-3 font-medium text-white">{k.staf}</td>
                  <td className="p-3 text-slate-400">{k.tanggal}</td>
                  <td className="p-3"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded font-mono border border-emerald-500/20">{k.jamMasuk}</span></td>
                  <td className="p-3"><span className="text-amber-400 bg-amber-500/10 px-2 py-1 rounded font-mono border border-amber-500/20">{k.jamKeluar}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CutiTab({ cuti, setCuti }: { cuti: any[], setCuti: any }) {
  const [form, setForm] = useState({ staf: '', jenis: 'Tahunan', mulai: '', selesai: '', alasan: '' });
  const stafList = ['dr. Andi Pratama', 'Ns. Siti Aminah'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.staf || !form.mulai || !form.selesai) {
      toast.error("Lengkapi data cuti!"); return;
    }
    setCuti([{ id: Date.now(), ...form, status: 'Menunggu Approval' }, ...cuti]);
    toast.success("Pengajuan cuti berhasil dikirim");
    setForm({ staf: '', jenis: 'Tahunan', mulai: '', selesai: '', alasan: '' });
  };

  const updateStatus = (id: number, status: string) => {
    setCuti(cuti.map(c => c.id === id ? { ...c, status } : c));
    toast.success(`Status cuti diperbarui menjadi: ${status}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-white">Pengajuan Cuti / Sakit</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Staf</label>
              <select className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={form.staf} onChange={e => setForm({...form, staf: e.target.value})}>
                <option value="">-- Pilih Staf --</option>
                {stafList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Jenis Cuti</label>
              <select className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={form.jenis} onChange={e => setForm({...form, jenis: e.target.value})}>
                <option>Tahunan</option>
                <option>Sakit</option>
                <option>Melahirkan</option>
                <option>Penting</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Mulai Tanggal</label>
              <input type="date" className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={form.mulai} onChange={e => setForm({...form, mulai: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Sampai Tanggal</label>
              <input type="date" className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={form.selesai} onChange={e => setForm({...form, selesai: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Alasan</label>
            <input type="text" className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm w-full outline-none focus:border-cyan-500" value={form.alasan} onChange={e => setForm({...form, alasan: e.target.value})} />
          </div>
          <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors">Ajukan Cuti</button>
        </form>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-bold mb-4 text-white">Daftar Pengajuan</h3>
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="p-3 border-b border-slate-700 text-slate-300">Staf</th>
              <th className="p-3 border-b border-slate-700 text-slate-300">Jenis</th>
              <th className="p-3 border-b border-slate-700 text-slate-300">Periode</th>
              <th className="p-3 border-b border-slate-700 text-slate-300">Status</th>
              <th className="p-3 border-b border-slate-700 text-slate-300">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 text-slate-300">
            {cuti.map(c => (
              <tr key={c.id}>
                <td className="p-3 font-medium text-white">{c.staf}</td>
                <td className="p-3">{c.jenis}</td>
                <td className="p-3 text-slate-400">{c.mulai} s/d {c.selesai}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    c.status === 'Disetujui' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    c.status === 'Ditolak' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>{c.status}</span>
                </td>
                <td className="p-3 space-x-2">
                  {c.status === 'Menunggu Approval' && (
                    <>
                      <button onClick={() => updateStatus(c.id, 'Disetujui')} className="text-emerald-400 font-medium hover:underline text-xs">Setujui</button>
                      <button onClick={() => updateStatus(c.id, 'Ditolak')} className="text-rose-400 font-medium hover:underline text-xs">Tolak</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KredensialTab({ kredensial, setKredensial }: { kredensial: any[], setKredensial: any }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-3">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white"><FileBadge className="w-6 h-6 text-indigo-400"/> Tracking Kredensial (STR/SIP)</h2>
      </div>
      
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-700/50">
          <tr>
            <th className="p-3 border-b border-slate-700 text-slate-300">Nama Staf</th>
            <th className="p-3 border-b border-slate-700 text-slate-300">Tipe Dokumen</th>
            <th className="p-3 border-b border-slate-700 text-slate-300">Nomor</th>
            <th className="p-3 border-b border-slate-700 text-slate-300">Tanggal Expired</th>
            <th className="p-3 border-b border-slate-700 text-slate-300">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50 text-slate-300">
          {kredensial.map(k => (
            <tr key={k.id} className="hover:bg-slate-700/30">
              <td className="p-3 font-medium text-white">{k.nama}</td>
              <td className="p-3">{k.tipe}</td>
              <td className="p-3 font-mono text-slate-400">{k.no}</td>
              <td className="p-3 text-slate-300">{k.expired}</td>
              <td className="p-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  k.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  k.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {k.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
