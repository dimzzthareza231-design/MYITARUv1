import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Clock, ShieldCheck, FileText, MessageSquare, ListChecks, Filter, MessageCircle, Send, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { subscribeActivityLogs, ActivityLogEntry } from '../lib/activityLogger';

export function AIAnalytics() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'conversation' | 'suggestions' | 'feedback' | 'activity'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard AI', icon: Sparkles },
    { id: 'activity', label: 'Activity Logs', icon: ListChecks },
    { id: 'conversation', label: 'Conversation Log', icon: MessageSquare },
    { id: 'suggestions', label: 'Suggestion History', icon: Activity },
    { id: 'feedback', label: 'User Feedback', icon: MessageCircle },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
            <Sparkles className="w-7 h-7" />
            AI Analytics & Logs
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Statistik penggunaan AI, log percakapan, dan riwayat saran pintar.</p>
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
        {activeTab === 'activity' && <ActivityTab />}
        {activeTab === 'conversation' && <ConversationTab />}
        {activeTab === 'suggestions' && <SuggestionsTab />}
        {activeTab === 'feedback' && <FeedbackTab />}
      </div>
    </div>
  );
}

function DashboardTab() {
  const stats = [
    { label: 'Klaim Divalidasi AI', value: '1,284', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100', change: '+12%' },
    { label: 'Auto-fill Rekam Medis', value: '4,521', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', change: '+25%' },
    { label: 'Interaksi Obat Dicegah', value: '142', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-100', change: '-5%' },
    { label: 'Waktu Dihemat (Jam)', value: '320', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-100', change: '+18%' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-opacity-20`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Penggunaan AI per Modul</h3>
          <div className="space-y-4">
            {[
              { label: 'AI BPJS Validator', progress: 85, count: '1,284' },
              { label: 'AI Medical Coder (ICD-10)', progress: 70, count: '945' },
              { label: 'AI Scribe (SOAP)', progress: 65, count: '820' },
              { label: 'AI Drug Interaction', progress: 40, count: '450' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-slate-500">{item.count} aksi</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityTab() {
  const [filter, setFilter] = useState('All');
  const [liveLogs, setLiveLogs] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeActivityLogs(logs => {
      const aiLogs = logs.filter(l => l.category === 'ai');
      setLiveLogs(aiLogs);
    });
    return () => unsubscribe();
  }, []);

  const defaultLogs = [
    { id: 'def-1', time: '10:45:12', action: 'Validasi Klaim BPJS (Pasien RM-000002)', status: 'Success', role: 'Kasir', module: 'Billing' },
    { id: 'def-2', time: '10:42:05', action: 'Deteksi Interaksi Obat (Warfarin + Ciprofloxacin)', status: 'Warning', role: 'Apoteker', module: 'Pharmacy' },
    { id: 'def-3', time: '10:30:22', action: 'Saran ICD-10 (A90 - Dengue Fever)', status: 'Accepted', role: 'Dokter', module: 'Medical Records' },
    { id: 'def-4', time: '10:15:00', action: 'Auto-fill SOAP via Voice (Pasien RM-000005)', status: 'Success', role: 'Dokter', module: 'Outpatient' },
    { id: 'def-5', time: '09:50:11', action: 'Ekspertise Radiologi AI Thorax X-Ray', status: 'Success', role: 'Radiolog', module: 'Radiology' },
  ];

  // Map live AI logs into table format
  const mappedLive = liveLogs.map(l => ({
    id: l.id,
    time: new Date(l.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    action: `${l.action.replace('AI_', '').replace(/_/g, ' ')}: ${l.details.message || ''}`,
    status: l.status === 'SUCCESS' ? 'Success' : l.status === 'WARNING' ? 'Warning' : 'Error',
    role: l.user.roleId || 'Klinis',
    module: l.target.split('/')[1] || 'AI Copilot'
  }));

  const allLogs = [...mappedLive, ...defaultLogs];
  const filteredLogs = filter === 'All' ? allLogs : allLogs.filter(l => l.status === filter);

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-emerald-600"/> Log Aktivitas AI Klinis & Audit
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time telemetri eksekusi Gemini 3.8 Flash pada seluruh modul SIMRS</p>
        </div>
        <div className="flex gap-2">
          <select className="input-field py-1 px-2 text-sm" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="All">Semua Status ({allLogs.length})</option>
            <option value="Success">Success</option>
            <option value="Accepted">Accepted</option>
            <option value="Warning">Warning</option>
            <option value="Error">Error</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="p-3 border-b text-xs font-semibold text-slate-500">Waktu</th>
              <th className="p-3 border-b text-xs font-semibold text-slate-500">Aktivitas & Instruksi Klinis</th>
              <th className="p-3 border-b text-xs font-semibold text-slate-500">Modul & Peran</th>
              <th className="p-3 border-b text-xs font-semibold text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map(l => (
              <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-3 border-b font-mono text-xs text-slate-500 whitespace-nowrap">{l.time}</td>
                <td className="p-3 border-b font-medium text-slate-800 dark:text-slate-200">{l.action}</td>
                <td className="p-3 border-b text-xs whitespace-nowrap">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{l.module}</span>{' '}
                  <span className="text-slate-400">({l.role})</span>
                </td>
                <td className="p-3 border-b whitespace-nowrap">
                   <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                     l.status === 'Success' || l.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                     l.status === 'Warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                   }`}>{l.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ConversationTab() {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-emerald-600"/> Log Percakapan (Voice / Chatbot)</h2>
      <div className="space-y-4">
        {[
          { id: 'C01', time: '10:00', user: 'Dokter Andi', msg: 'Tolong buatkan resep untuk paracetamol dan amoxicillin 500mg 3x1.', ai: 'Baik Dok, resep Paracetamol (PRN) dan Amoxicillin (500mg, 3x sehari) telah ditambahkan ke sistem.' },
          { id: 'C02', time: '09:30', user: 'Pasien RM-012 (via App)', msg: 'Jadwal dokter spesialis mata hari ini jam berapa?', ai: 'Hari ini dr. Budi Santoso, Sp.M praktik pukul 14:00 - 17:00. Apakah Anda ingin saya buatkan janji temu?' }
        ].map((c, i) => (
          <div key={i} className="border dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-800/30">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-sm bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">Session {c.id}</span>
              <span className="text-xs text-slate-500">{c.time}</span>
            </div>
            <div className="mb-2">
              <div className="text-xs font-bold text-indigo-600 mb-1">{c.user}</div>
              <div className="text-sm p-2 bg-white dark:bg-slate-800 rounded border dark:border-slate-700">"{c.msg}"</div>
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-600 mb-1">AI Assistant</div>
              <div className="text-sm p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded border border-emerald-100 dark:border-emerald-800">"{c.ai}"</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuggestionsTab() {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600"/> Riwayat AI Suggestion</h2>
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-3 border-b">Modul</th>
            <th className="p-3 border-b">Konteks</th>
            <th className="p-3 border-b">Saran AI</th>
            <th className="p-3 border-b text-center">Respon User</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3 border-b">Farmasi</td>
            <td className="p-3 border-b text-xs">Resep: Warfarin + Aspirin</td>
            <td className="p-3 border-b text-xs text-rose-600 font-medium">Peringatan: Risiko pendarahan tinggi. Pertimbangkan alternatif.</td>
            <td className="p-3 border-b text-center"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Diterima (Resep Diubah)</span></td>
          </tr>
          <tr>
            <td className="p-3 border-b">Billing</td>
            <td className="p-3 border-b text-xs">Klaim INA-CBG</td>
            <td className="p-3 border-b text-xs text-indigo-600 font-medium">Saran kode A91 (DHF) lebih tepat dari A90 berdasarkan lab Trombosit.</td>
            <td className="p-3 border-b text-center"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Diterima (Kode Diubah)</span></td>
          </tr>
          <tr>
            <td className="p-3 border-b">RME</td>
            <td className="p-3 border-b text-xs">SOAP Assessment</td>
            <td className="p-3 border-b text-xs text-blue-600 font-medium">Saran diagnosis: Hipertensi Primer.</td>
            <td className="p-3 border-b text-center"><span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold">Diabaikan</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function FeedbackTab() {
  const [form, setForm] = useState({ text: '', rating: 5 });
  
  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.text) return toast.error("Masukkan feedback");
    toast.success("Feedback tentang AI berhasil dikirim. Terima kasih!");
    setForm({ text: '', rating: 5 });
  };

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-emerald-600"/> Form Feedback AI</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Bantu kami meningkatkan kualitas AI Assistant dengan memberikan feedback jika Anda menemukan jawaban yang kurang tepat atau fitur yang error.</p>
      
      <form onSubmit={submitFeedback} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Seberapa akurat AI ini? (1-5)</label>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(r => (
              <button 
                type="button" 
                key={r}
                onClick={() => setForm({...form, rating: r})}
                className={`w-10 h-10 rounded-full font-bold transition-colors ${form.rating === r ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Feedback / Kendala yang dialami</label>
          <textarea 
            rows={4} 
            className="input-field" 
            placeholder="Cth: AI salah merekomendasikan kode ICD-10 untuk pasien anak..."
            value={form.text}
            onChange={e => setForm({...form, text: e.target.value})}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn-primary w-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2">
          <Send className="w-4 h-4" /> Kirim Feedback
        </button>
      </form>
    </div>
  );
}
