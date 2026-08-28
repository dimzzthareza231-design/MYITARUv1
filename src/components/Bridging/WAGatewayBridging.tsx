import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare, Send, Image, FileText, Settings, Smartphone,
  CheckCircle2, Clock, Users, RefreshCw, Upload, QrCode, Shield,
  Radio, Bell, Sparkles, CheckCheck, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

export function WAGatewayBridging() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || 'Manage');

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = ['Manage', 'Send Message', 'Send Image', 'Send File', 'Pengaturan'];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              WA Engine Connected
            </span>
            <span className="text-xs text-slate-400 font-mono">+62 812-9988-7711 (Server RS)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>💬</span> WhatsApp Gateway & Notifikasi Otomatis
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Kirim reminder jadwal kontrol pasien, nomor antrian poliklinik, hasil lab/radiologi, dan dokumen PDF otomatis ke nomor pasien.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.success('Status WhatsApp Server: Online & Siap Mengirim Pesan!')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20 flex items-center gap-2"
          >
            <Radio className="w-3.5 h-3.5" />
            Check Connection
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1">
        {activeTab === 'Manage' && <ManageTab onNavigate={handleTabChange} />}
        {activeTab === 'Send Message' && <SendMessageTab />}
        {activeTab === 'Send Image' && <SendMediaTab type="image" />}
        {activeTab === 'Send File' && <SendMediaTab type="file" />}
        {activeTab === 'Pengaturan' && <PengaturanWATab />}
      </div>
    </div>
  );
}

function ManageTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('hospital_wa_logs');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'WA-001', recipient: '081234567890 (Budi Santoso)', type: 'Reminder Kontrol', text: 'Yth. Budi Santoso, Anda memiliki jadwal kontrol besok pk 09:00 di Poli Penyakit Dalam.', time: '10:15', status: 'READ' },
      { id: 'WA-002', recipient: '081298765432 (Siti Aminah)', type: 'Tiket Antrean', text: 'Nomor Antrean Anda: A-014 (Poli Kandungan). Silakan datang 15 menit sebelum perkiraan pelayanan.', time: '09:40', status: 'DELIVERED' },
      { id: 'WA-003', recipient: '085711223344 (Ahmad Fauzi)', type: 'Hasil Laboratorium', text: 'Hasil pemeriksaan Lab Darah Lengkap No. RM-00192 sudah selesai dan dapat diunduh.', time: '09:12', status: 'SENT' }
    ];
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status Device</span>
          <div className="text-xl font-bold text-emerald-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> Connected
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Baterai: 94% (Charging)</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Pesan Terkirim Hari Ini</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">512 <span className="text-xs font-normal text-slate-400">Pesan</span></div>
          <span className="text-xs text-emerald-500 mt-1 block font-medium">99.4% Delivery Rate</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Sisa Kuota Gateway</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">9,488 <span className="text-xs font-normal text-slate-400">Pesan</span></div>
          <span className="text-xs text-slate-400 mt-1 block">Paket Unlimited RS</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Kecepatan Kirim</span>
          <div className="text-2xl font-black text-amber-500">1.2 <span className="text-xs font-normal text-slate-400">detik/pesan</span></div>
          <span className="text-xs text-slate-400 mt-1 block">Antrean 0 pesan</span>
        </div>
      </div>

      {/* Message History Table */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Riwayat Notifikasi WhatsApp Terbaru</h3>
            <p className="text-xs text-slate-500">Log pengiriman notifikasi otomatis kepada pasien dan tenaga medis.</p>
          </div>
          <button
            onClick={() => onNavigate('Send Message')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Kirim Pesan Manual
          </button>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">Penerima</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Isi Pesan Singkat</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {messages.map((m: any) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-mono text-slate-400">{m.time}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{m.recipient}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {m.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300 max-w-md truncate">{m.text}</td>
                  <td className="p-3">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCheck className="w-3.5 h-3.5" /> {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SendMessageTab() {
  const [phone, setPhone] = useState('');
  const [template, setTemplate] = useState('custom');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const templates: Record<string, string> = {
    reminder: 'Yth. Bpk/Ibu [NAMA_PASIEN], mengingatkan jadwal kontrol dokter [NAMA_DOKTER] pada [TANGGAL] pk [JAM] di Poli [POLI]. Harap membawa Kartu BPJS & Identitas.',
    antrian: 'Nomor Antrean Anda adalah [NOMOR]. Estimasi pelayanan pk [JAM]. Mohon hadir di ruang tunggu 15 menit sebelumnya.',
    obat_selesai: 'Resep obat Anda di Farmasi sudah selesai disiapkan. Silakan menuju Loket Pengambilan Obat dengan menunjukkan bukti resep.',
    custom: ''
  };

  const handleTemplateChange = (tpl: string) => {
    setTemplate(tpl);
    if (tpl !== 'custom') {
      setMessage(templates[tpl]);
    } else {
      setMessage('');
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !message.trim()) {
      toast.error('Mohon isi nomor tujuan dan pesan');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const newLog = {
        id: `WA-${Date.now()}`,
        recipient: phone,
        type: template === 'custom' ? 'Direct Message' : 'Template Message',
        text: message,
        time: new Date().toLocaleTimeString().slice(0, 5),
        status: 'SENT'
      };
      const existing = JSON.parse(localStorage.getItem('hospital_wa_logs') || '[]');
      localStorage.setItem('hospital_wa_logs', JSON.stringify([newLog, ...existing]));
      toast.success(`Pesan WhatsApp berhasil dikirim ke ${phone}!`);
      setPhone('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-emerald-600" />
          Kirim Pesan WhatsApp Langsung
        </h3>
        <p className="text-xs text-slate-500">Kirim notifikasi personal atau template standar ke nomor WhatsApp pasien.</p>
      </div>

      <form onSubmit={handleSend} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp Pasien / Nakes</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Contoh: 081234567890 atau 6281234567890..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
            required
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gunakan Template Pesan Cepat</label>
          <select
            value={template}
            onChange={e => handleTemplateChange(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
          >
            <option value="custom">-- Pesan Kustom Bebas --</option>
            <option value="reminder">Reminder Jadwal Kontrol Pasien</option>
            <option value="antrian">Notifikasi Nomor Antrean Poli</option>
            <option value="obat_selesai">Notifikasi Obat Siap Diambil (Farmasi)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Isi Pesan WhatsApp</label>
          <textarea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Tuliskan isi pesan WhatsApp di sini..."
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2"
        >
          {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isSending ? 'Mengirim Pesan...' : 'Kirim Sekarang'}
        </button>
      </form>
    </div>
  );
}

function SendMediaTab({ type }: { type: 'image' | 'file' }) {
  const [phone, setPhone] = useState('');
  const [caption, setCaption] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Mohon masukkan nomor tujuan');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`${type === 'image' ? 'Gambar' : 'Dokumen PDF'} berhasil terkirim ke ${phone}!`);
      setPhone('');
      setCaption('');
      setFileName('');
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          {type === 'image' ? <Image className="w-5 h-5 text-emerald-600" /> : <FileText className="w-5 h-5 text-emerald-600" />}
          {type === 'image' ? 'Kirim Gambar / Foto Hasil Rontgen' : 'Kirim Dokumen PDF Medis (Resume / Kwitansi / SEP)'}
        </h3>
        <p className="text-xs text-slate-500">Lampirkan berkas digital langsung ke WhatsApp pasien.</p>
      </div>

      <form onSubmit={handleSendMedia} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor WhatsApp Tujuan</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="081234567890..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
            required
          />
        </div>

        <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center cursor-pointer hover:border-emerald-500 transition-colors">
          <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <span className="font-semibold text-slate-700 dark:text-slate-200 block text-xs">
            {fileName || `Klik untuk memilih ${type === 'image' ? 'file gambar (JPG/PNG)' : 'dokumen (PDF)'}`}
          </span>
          <span className="text-[11px] text-slate-400">Maksimal ukuran file: 16 MB</span>
          <input
            type="file"
            className="hidden"
            id="fileInput"
            accept={type === 'image' ? 'image/*' : '.pdf,.docx,.xlsx'}
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
              }
            }}
          />
          <button
            type="button"
            onClick={() => document.getElementById('fileInput')?.click()}
            className="mt-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold"
          >
            Pilih Berkas
          </button>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Keterangan / Caption Berkas</label>
          <input
            type="text"
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Contoh: Berikut kami lampirkan Resume Medis & Kwitansi Rawat Jalan..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2"
        >
          {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Kirim Berkas Lampiran
        </button>
      </form>
    </div>
  );
}

function PengaturanWATab() {
  const [provider, setProvider] = useState('fonnte');
  const [apiKey, setApiKey] = useState('FONNTE-API-KEY-PROD-998811');
  const [autoReminder, setAutoReminder] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Pengaturan WhatsApp Gateway disimpan!');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-emerald-600" />
        Konfigurasi WhatsApp Gateway Provider
      </h3>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Pilihan Gateway Provider</label>
          <select
            value={provider}
            onChange={e => setProvider(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-semibold"
          >
            <option value="fonnte">Fonnte WhatsApp API (Official Partner)</option>
            <option value="wablas">Wablas Gateway</option>
            <option value="whacenter">WhaCenter Engine</option>
            <option value="meta">Meta Cloud API (Official WhatsApp Business)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">API Key / Token Authorization</label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono text-sm"
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoReminder}
              onChange={e => setAutoReminder(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Kirim Reminder Otomatis H-1 ke Pasien Kontrol Poliklinik
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20"
        >
          Simpan Konfigurasi WhatsApp
        </button>
      </form>
    </div>
  );
}
