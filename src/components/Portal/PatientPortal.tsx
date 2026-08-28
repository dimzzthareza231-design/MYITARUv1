import React, { useState, useEffect } from 'react';
import { 
  User, CalendarClock, FileText, CreditCard, MessageSquare, Activity, LogOut, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export function PatientPortal() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'booking' | 'records' | 'billing' | 'chat'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'booking', label: 'Book Appointment', icon: CalendarClock },
    { id: 'records', label: 'Medical Records', icon: FileText },
    { id: 'billing', label: 'Billing & Payment', icon: CreditCard },
    { id: 'chat', label: 'Chat Support', icon: MessageSquare },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto h-full flex flex-col font-sans">
      <div className="flex justify-between items-center mb-6 p-4 bg-teal-600 text-white rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 font-bold text-xl">
             B
           </div>
           <div>
             <h1 className="text-xl font-bold">Halo, Budi Santoso</h1>
             <p className="text-teal-100 text-sm">No. RM: RM-001234 | Member Sejak: 2024</p>
           </div>
        </div>
        <button className="p-2 hover:bg-teal-700 rounded-full transition-colors"><LogOut className="w-5 h-5"/></button>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600 dark:text-teal-400' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
        {activeTab === 'dashboard' && <DashboardTab setTab={setActiveTab} />}
        {activeTab === 'booking' && <BookingTab />}
        {activeTab === 'records' && <RecordsTab />}
        {activeTab === 'billing' && <BillingTab />}
        {activeTab === 'chat' && <ChatTab />}
      </div>
    </div>
  );
}

function DashboardTab({ setTab }: { setTab: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 border-l-4 border-l-teal-500">
          <h3 className="font-bold text-lg mb-2">Jadwal Terdekat</h3>
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded mb-4">
             <div className="text-sm font-bold text-teal-600 mb-1">Besok, 09:00 WIB</div>
             <div className="font-bold">Konsultasi Poli Gigi</div>
             <div className="text-xs text-slate-500 mt-1">drg. Andi Wijaya</div>
          </div>
          <button onClick={() => setTab('booking')} className="text-sm text-teal-600 font-bold hover:underline">+ Buat Janji Baru</button>
        </div>
        <div className="card p-6 border-l-4 border-l-rose-500">
          <h3 className="font-bold text-lg mb-2">Tagihan Belum Dibayar</h3>
          <div className="text-3xl font-bold text-rose-600 mb-2">Rp 150.000</div>
          <div className="text-sm text-slate-500 mb-4">Farmasi (Resep Tgl 10 Ags)</div>
          <button onClick={() => setTab('billing')} className="btn-primary w-full bg-rose-600 hover:bg-rose-700">Bayar Sekarang</button>
        </div>
      </div>
    </div>
  );
}

function BookingTab() {
  const [apps, setApps] = useState<any[]>([]);
  const [form, setForm] = useState({ poli: 'Poli Umum', date: '', time: '09:00' });

  

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if(!form.date) return toast.error("Pilih tanggal");
    setApps([{ id: `APT-${Date.now().toString().slice(-4)}`, status: 'Menunggu Konfirmasi', ...form }, ...apps]);
    toast.success("Janji temu diajukan");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarClock className="w-5 h-5 text-teal-600"/> Buat Janji Temu</h2>
        <form onSubmit={handleBook} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Poli / Klinik</label>
            <select className="input-field" value={form.poli} onChange={e=>setForm({...form, poli: e.target.value})}>
              <option>Poli Umum</option>
              <option>Poli Gigi</option>
              <option>Poli Penyakit Dalam</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium mb-1">Tanggal</label><input type="date" className="input-field" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} required/></div>
          <div><label className="block text-sm font-medium mb-1">Waktu</label>
            <select className="input-field" value={form.time} onChange={e=>setForm({...form, time: e.target.value})}>
              <option>09:00 - 10:00</option>
              <option>10:00 - 11:00</option>
              <option>14:00 - 15:00</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full bg-teal-600 hover:bg-teal-700">Kirim Permintaan</button>
        </form>
      </div>
      <div className="card p-6">
        <h3 className="font-bold mb-4">Riwayat Janji Temu</h3>
        <div className="space-y-3">
          {apps.map(a => (
            <div key={a.id} className="p-3 border rounded-lg flex justify-between items-center bg-slate-50 dark:bg-slate-800">
              <div>
                <div className="font-bold text-sm">{a.poli}</div>
                <div className="text-xs text-slate-500">{a.date} | {a.time}</div>
              </div>
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold">{a.status}</span>
            </div>
          ))}
          {apps.length === 0 && <p className="text-sm text-slate-500">Belum ada janji temu.</p>}
        </div>
      </div>
    </div>
  );
}

function RecordsTab() {
  const records = [
    { date: '10 Agustus 2026', type: 'Kunjungan Rawat Jalan', desc: 'Keluhan: Demam, Batuk. Diagnosa: ISPA.', doc: 'dr. Budi' },
    { date: '01 Agustus 2026', type: 'Hasil Laboratorium', desc: 'Cek Darah Lengkap. Hasil: Normal.', doc: 'Lab' },
  ];

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-teal-600"/> Rekam Medis (Timeline)</h2>
      <div className="relative border-l-2 border-teal-200 ml-4 space-y-6 pb-4">
         {records.map((r, i) => (
           <div key={i} className="relative pl-6">
             <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full border-4 border-white bg-teal-500"></div>
             <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border dark:border-slate-700 shadow-sm">
               <div className="flex justify-between mb-1">
                 <span className="font-bold text-sm text-teal-700 dark:text-teal-400">{r.type}</span>
                 <span className="text-xs text-slate-500">{r.date}</span>
               </div>
               <p className="text-sm mb-2">{r.desc}</p>
               <span className="text-[10px] bg-white dark:bg-slate-900 px-2 py-1 rounded shadow-sm border">Oleh: {r.doc}</span>
             </div>
           </div>
         ))}
      </div>
    </div>
  );
}

function BillingTab() {
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    toast.success("Pembayaran berhasil disimulasikan!");
    setPaid(true);
  };

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CreditCard className="w-5 h-5 text-teal-600"/> Billing & Pembayaran</h2>
      
      {!paid ? (
        <div className="border border-rose-200 bg-rose-50 dark:bg-rose-900/10 rounded-lg p-6 text-center">
           <h3 className="text-rose-800 font-bold mb-2">Tagihan Belum Dibayar</h3>
           <div className="text-4xl font-bold text-rose-600 mb-4">Rp 150.000</div>
           <p className="text-sm text-rose-600/80 mb-6">Biaya Farmasi - Resep 10 Ags 2026</p>
           
           <div className="flex flex-col gap-3 max-w-xs mx-auto">
             <button onClick={handlePay} className="btn-primary w-full bg-blue-600 flex items-center justify-center gap-2">Bayar via Virtual Account</button>
             <button onClick={handlePay} className="btn-secondary w-full bg-white flex items-center justify-center gap-2">Bayar via E-Wallet</button>
           </div>
        </div>
      ) : (
        <div className="border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-6 text-center">
           <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
           <h3 className="text-emerald-800 font-bold text-xl mb-1">Pembayaran Berhasil!</h3>
           <p className="text-sm text-emerald-600/80">Terima kasih, tagihan Anda sudah lunas.</p>
        </div>
      )}
    </div>
  );
}

function ChatTab() {
  const [chat, setChat] = useState('');
  const [msgs, setMsgs] = useState([{ sender: 'CS', text: 'Halo, ada yang bisa dibantu?', time: '09:00' }]);

  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if(!chat) return;
    setMsgs([...msgs, { sender: 'Saya', text: chat, time: new Date().toLocaleTimeString().slice(0,5) }]);
    setChat('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { sender: 'CS', text: 'Baik, pesan Anda sedang kami proses.', time: new Date().toLocaleTimeString().slice(0,5) }]);
    }, 1000);
  };

  return (
    <div className="card p-0 flex flex-col h-[500px] max-w-3xl mx-auto overflow-hidden">
      <div className="bg-teal-600 p-4 text-white">
        <h3 className="font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5"/> Customer Support</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
        {msgs.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.sender === 'Saya' ? 'items-end' : 'items-start'}`}>
             <span className="text-[10px] text-slate-400 mb-1">{m.time}</span>
             <div className={`text-sm px-4 py-2 rounded-2xl ${m.sender === 'Saya' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-tl-none shadow-sm'}`}>
               {m.text}
             </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMsg} className="p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-800 flex gap-2">
         <input type="text" className="input-field flex-1 rounded-full px-4" placeholder="Ketik pesan..." value={chat} onChange={e=>setChat(e.target.value)} />
         <button type="submit" className="btn-primary rounded-full px-6 bg-teal-600 hover:bg-teal-700">Kirim</button>
      </form>
    </div>
  );
}
