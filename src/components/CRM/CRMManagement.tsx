import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, ClipboardList, AlertCircle, Award, Send, Save, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function CRMManagement() {
  const [activeTab, setActiveTab] = useState<'campaign' | 'messages' | 'survey' | 'complaint' | 'loyalty'>('campaign');

  const tabs = [
    { id: 'campaign', label: 'Campaign Builder', icon: Send },
    { id: 'messages', label: 'Message Log', icon: MessageSquare },
    { id: 'survey', label: 'Survey Analytics', icon: ClipboardList },
    { id: 'complaint', label: 'Complaints / Tickets', icon: AlertCircle },
    { id: 'loyalty', label: 'Loyalty Program', icon: Award },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-500">
            <Users className="w-7 h-7" />
            CRM & Patient Engagement
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manajemen hubungan pasien, campaign, survey, dan komplain.</p>
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
        {activeTab === 'campaign' && <CampaignTab />}
        {activeTab === 'messages' && <MessagesTab />}
        {activeTab === 'survey' && <SurveyTab />}
        {activeTab === 'complaint' && <ComplaintTab />}
        {activeTab === 'loyalty' && <LoyaltyTab />}
      </div>
    </div>
  );
}

function CampaignTab() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', target: 'Semua Pasien Poli', channel: 'WhatsApp', date: '', time: '', message: '' });

  

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message || !form.date) { toast.error("Lengkapi form!"); return; }
    
    setCampaigns([{
      id: `CMP-${Date.now().toString().slice(-4)}`,
      ...form,
      status: 'Scheduled'
    }, ...campaigns]);
    toast.success("Campaign berhasil dijadwalkan");
    setForm({ title: '', target: 'Semua Pasien Poli', channel: 'WhatsApp', date: '', time: '', message: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Send className="w-5 h-5 text-indigo-600"/> Campaign Builder</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Judul Campaign</label><input type="text" className="input-field" placeholder="Cth: Promo MCU Hari Kemerdekaan" value={form.title} onChange={e=>setForm({...form, title: e.target.value})} required/></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Target Pasien</label>
                <select className="input-field" value={form.target} onChange={e=>setForm({...form, target: e.target.value})}>
                  <option>Semua Pasien Poli</option>
                  <option>Pasien Ibu Hamil (KIA)</option>
                  <option>Pasien Gigi</option>
                  <option>Member Loyalty VIP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Channel (Media)</label>
                <select className="input-field" value={form.channel} onChange={e=>setForm({...form, channel: e.target.value})}>
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>SMS</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Tanggal Jadwal</label><input type="date" className="input-field" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required/></div>
              <div><label className="block text-sm font-medium mb-1">Waktu</label><input type="time" className="input-field" value={form.time} onChange={e=>setForm({...form, time: e.target.value})} required/></div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Isi Pesan</label>
              <textarea rows={4} className="input-field" placeholder="Halo [Nama Pasien], dapatkan diskon MCU..." value={form.message} onChange={e=>setForm({...form, message: e.target.value})} required></textarea>
              <div className="text-xs text-slate-500 mt-1">Variabel tersedia: [Nama Pasien], [Panggilan]</div>
            </div>
            <button type="submit" className="btn-primary w-full bg-indigo-600 hover:bg-indigo-700">Schedule Campaign</button>
          </form>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Daftar Scheduled / Sent Campaign</h3>
          <div className="space-y-4">
             {campaigns.map(c => (
               <div key={c.id} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-bold text-indigo-600">{c.title}</h4>
                   <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">{c.status}</span>
                 </div>
                 <div className="text-xs text-slate-500 mb-2">Target: {c.target} | Via: {c.channel} | Jadwal: {c.date} {c.time}</div>
                 <div className="text-sm bg-white dark:bg-slate-900 p-2 rounded border dark:border-slate-700">"{c.message}"</div>
               </div>
             ))}
             {campaigns.length === 0 && <p className="text-sm text-slate-500">Belum ada campaign terjadwal.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function MessagesTab() {
  const messages = [
    { id: 1, type: 'WhatsApp', to: 'Budi Santoso', status: 'Delivered', date: 'Hari ini 10:00', text: 'Mengingatkan jadwal kontrol Anda besok jam 09.00 di Poli Gigi.' },
    { id: 2, type: 'Email', to: 'Siti Aminah', status: 'Read', date: 'Kemarin 15:30', text: 'Hasil lab Anda sudah keluar. Silakan cek di aplikasi patient portal.' },
    { id: 3, type: 'WhatsApp', to: 'Andi Wijaya', status: 'Failed', date: 'Kemarin 08:00', text: 'Promo MCU Diskon 20% khusus bulan ini!' },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-600"/> Message Log & Timeline</h2>
      <div className="relative border-l-2 border-indigo-200 dark:border-indigo-800 ml-3 space-y-8 pb-4">
         {messages.map(m => (
           <div key={m.id} className="relative pl-6">
             <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${m.status === 'Delivered' || m.status === 'Read' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
             <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border dark:border-slate-700">
               <div className="flex justify-between mb-1">
                 <span className="font-bold text-sm text-slate-700 dark:text-slate-300">To: {m.to} <span className="font-normal text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded ml-2">{m.type}</span></span>
                 <span className="text-xs text-slate-500">{m.date}</span>
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">"{m.text}"</p>
               <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                 m.status === 'Read' ? 'bg-blue-100 text-blue-700' :
                 m.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                 'bg-rose-100 text-rose-700'
               }`}>Status: {m.status}</span>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function SurveyTab() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-indigo-600"/> Survey Kepuasan Pasien (Analytics)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
           <div className="p-4 border rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
             <div className="text-3xl font-bold text-emerald-600">4.8 <span className="text-sm">/ 5</span></div>
             <div className="text-sm font-medium text-slate-600 mt-1">CSAT Score</div>
           </div>
           <div className="p-4 border rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-center">
             <div className="text-3xl font-bold text-indigo-600">72</div>
             <div className="text-sm font-medium text-slate-600 mt-1">NPS (Net Promoter Score)</div>
           </div>
           <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
             <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">1,240</div>
             <div className="text-sm font-medium text-slate-600 mt-1">Total Responden</div>
           </div>
           <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
             <div className="text-3xl font-bold text-blue-600">85%</div>
             <div className="text-sm font-medium text-slate-600 mt-1">Response Rate</div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div>
              <h3 className="font-bold text-sm mb-4">Breakdown Penilaian Layanan</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Pelayanan Dokter', score: 95 },
                   { label: 'Keramahan Perawat', score: 90 },
                   { label: 'Kecepatan Farmasi', score: 65 },
                   { label: 'Kebersihan Fasilitas', score: 88 }
                 ].map((d, i) => (
                   <div key={i}>
                     <div className="flex justify-between text-sm mb-1"><span>{d.label}</span><span className="font-bold">{d.score}%</span></div>
                     <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                       <div className={`h-full ${d.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${d.score}%` }}></div>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
           <div>
             <h3 className="font-bold text-sm mb-4">Feedback Terbaru (Open Text)</h3>
             <ul className="space-y-3">
               <li className="p-3 bg-slate-50 dark:bg-slate-800 rounded border text-sm">
                 <div className="flex justify-between mb-1"><span className="font-bold">Anonim</span><span className="text-amber-500">★★★★★</span></div>
                 "Dokter sangat ramah dan menjelaskan dengan detail. Terima kasih."
               </li>
               <li className="p-3 bg-slate-50 dark:bg-slate-800 rounded border text-sm">
                 <div className="flex justify-between mb-1"><span className="font-bold">Pasien Poli Penyakit Dalam</span><span className="text-amber-500">★★★☆☆</span></div>
                 "Antrean obat di farmasi terlalu lama, mohon dipercepat."
               </li>
             </ul>
           </div>
        </div>
      </div>
    </div>
  );
}

function ComplaintTab() {
  const [complaints, setComplaints] = useState<any[]>(() => {
    const saved = localStorage.getItem('simrs_crm_complaints');
    return saved ? JSON.parse(saved) : [
      { id: 'TKT-001', name: 'Bpk. Ahmad', category: 'Pelayanan (Farmasi)', desc: 'Menunggu obat lebih dari 2 jam', status: 'Open' }
    ];
  });
  
  const resolveTicket = (id: string) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
    toast.success("Ticket resolved");
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-rose-500"/> Complaint Ticket System</h2>
      
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-3 border-b">ID Ticket</th>
            <th className="p-3 border-b">Nama Pasien</th>
            <th className="p-3 border-b">Kategori</th>
            <th className="p-3 border-b">Deskripsi Komplain</th>
            <th className="p-3 border-b">Status</th>
            <th className="p-3 border-b text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(c => (
            <tr key={c.id}>
              <td className="p-3 border-b font-mono font-bold text-rose-600">{c.id}</td>
              <td className="p-3 border-b font-medium">{c.name}</td>
              <td className="p-3 border-b">{c.category}</td>
              <td className="p-3 border-b text-xs">{c.desc}</td>
              <td className="p-3 border-b">
                 <span className={`px-2 py-1 rounded text-xs font-bold ${c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{c.status}</span>
              </td>
              <td className="p-3 border-b text-right">
                {c.status === 'Open' && (
                  <button onClick={() => resolveTicket(c.id)} className="text-emerald-600 font-bold hover:underline text-xs"><CheckCircle className="w-4 h-4 inline mr-1"/> Resolve</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoyaltyTab() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-amber-500"/> Loyalty Program (Points)</h2>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
           <div className="flex-1 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-6 text-white w-full">
              <h3 className="font-bold opacity-90 mb-4">Total Poin Beredar</h3>
              <div className="text-4xl font-bold mb-2">245,500 <span className="text-lg">Pts</span></div>
              <div className="text-sm opacity-80 mt-4 flex justify-between">
                <span>Value: Rp 2.455.000</span>
                <span>420 Member Aktif</span>
              </div>
           </div>
           
           <div className="flex-[2] w-full">
             <h3 className="font-bold text-sm mb-3">Top Member Poin Tertinggi</h3>
             <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="p-2 border-b">Member ID</th>
                    <th className="p-2 border-b">Nama</th>
                    <th className="p-2 border-b">Tier</th>
                    <th className="p-2 border-b text-right">Total Poin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b font-mono">MBR-001</td>
                    <td className="p-2 border-b font-bold">Keluarga Bpk. Wijaya</td>
                    <td className="p-2 border-b"><span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-yellow-500 font-bold">GOLD</span></td>
                    <td className="p-2 border-b text-right font-bold text-amber-600">12,450</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b font-mono">MBR-052</td>
                    <td className="p-2 border-b font-bold">Ibu Siti Aminah</td>
                    <td className="p-2 border-b"><span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600 font-bold">SILVER</span></td>
                    <td className="p-2 border-b text-right font-bold text-amber-600">5,200</td>
                  </tr>
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}

