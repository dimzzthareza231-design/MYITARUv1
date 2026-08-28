import React, { useState } from 'react';
import { Bell, HeartPulse, Stethoscope, FileText, CheckCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export function NotifikasiPengingat() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Jadwal Kontrol Prolanis',
      desc: 'Waktunya kontrol rutin Diabetes di Klinik Sehat Utama.',
      date: '16 Ags 2026, 08:00',
      type: 'medical',
      read: false
    },
    {
      id: 2,
      title: 'Skrining Kesehatan Tahunan',
      desc: 'Anda belum melakukan skrining kesehatan tahun ini. Yuk, skrining sekarang untuk deteksi dini.',
      date: '10 Ags 2026, 10:00',
      type: 'system',
      read: true
    },
    {
      id: 3,
      title: 'Tagihan Iuran Terbit',
      desc: 'Tagihan iuran JKN Anda untuk bulan Agustus telah terbit. Segera lakukan pembayaran.',
      date: '01 Ags 2026, 09:00',
      type: 'billing',
      read: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('Semua notifikasi ditandai sudah dibaca');
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'medical': return <Stethoscope className="w-5 h-5 text-teal-600" />;
      case 'billing': return <FileText className="w-5 h-5 text-amber-600" />;
      default: return <HeartPulse className="w-5 h-5 text-blue-600" />;
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'medical': return 'bg-teal-100 dark:bg-teal-900/30';
      case 'billing': return 'bg-amber-100 dark:bg-amber-900/30';
      default: return 'bg-blue-100 dark:bg-blue-900/30';
    }
  };

  const filtered = notifications.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.desc.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Notifikasi</h1>
          <p className="text-slate-500">Pemberitahuan dan pengingat JKN Anda</p>
        </div>
        <button 
          onClick={markAllRead}
          className="text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Tandai Semua Dibaca
        </button>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari notifikasi..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(notif => (
          <div 
            key={notif.id} 
            className={`p-4 rounded-xl border transition-colors flex gap-4 ${
              notif.read 
                ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-70' 
                : 'bg-blue-50/50 dark:bg-slate-800 border-blue-200 dark:border-blue-800 shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(notif.type)}`}>
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-sm font-bold ${notif.read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                  {notif.title}
                </h3>
                <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{notif.date}</span>
              </div>
              <p className={`text-sm ${notif.read ? 'text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>
                {notif.desc}
              </p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-8 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Tidak ada notifikasi ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
