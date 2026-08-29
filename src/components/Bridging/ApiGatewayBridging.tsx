import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Server, Key, CreditCard, Bell, Settings, CheckCircle2,
  RefreshCw, Smartphone, Code, ShieldCheck, DollarSign, Send, Copy
} from 'lucide-react';
import toast from 'react-hot-toast';

export function ApiGatewayBridging() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || 'Kelola');

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = ['Kelola', 'Notifikasi APAM', 'Pengaturan APAM', 'Payment Duitku', 'Pengaturan API Key'];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
              API GATEWAY & MOBILE APAM
            </span>
            <span className="text-xs text-slate-400 font-mono">Duitku PG & Mobile Pasien</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>🔌</span> Bridging API Gateway (APAM & Payment Duitku)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Integrasi aplikasi mobile pasien (APAM), gateway pembayaran digital QRIS/Virtual Account (Duitku), dan REST API Key management.
          </p>
        </div>
        <button
          onClick={() => toast.success('API Gateway Status: 100% Online & Terenkripsi!')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/20 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Check Gateway
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'Kelola' && <KelolaApiHub onNavigate={handleTabChange} />}
        {activeTab === 'Notifikasi APAM' && <NotifikasiAPAMTab />}
        {activeTab === 'Pengaturan APAM' && <PengaturanAPAMTab />}
        {activeTab === 'Payment Duitku' && <PaymentDuitkuTab />}
        {activeTab === 'Pengaturan API Key' && <ApiKeyManagementTab />}
      </div>
    </div>
  );
}

function KelolaApiHub({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Pengguna Mobile APAM Aktif</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">8,420 <span className="text-xs font-normal text-slate-400">Pasien</span></div>
          <span className="text-xs text-emerald-500 mt-1 block">+142 pengguna minggu ini</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Transaksi Pembayaran Duitku</span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Rp 48.5 jt</div>
          <span className="text-xs text-slate-400 mt-1 block">182 transaksi QRIS / VA</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Push Notifikasi APAM</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">920 <span className="text-xs font-normal text-slate-400">Kirim</span></div>
          <span className="text-xs text-slate-400 mt-1 block">FCM Firebase Active</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status API Gateway Rate</span>
          <div className="text-2xl font-black text-emerald-500">99.98%</div>
          <span className="text-xs text-slate-400 mt-1 block">Latency 18ms</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Riwayat Transaksi Payment Gateway Duitku</h3>
            <p className="text-xs text-slate-500">Pembayaran mandiri tagihan rawat jalan dan obat oleh pasien via aplikasi APAM.</p>
          </div>
          <button
            onClick={() => onNavigate('Payment Duitku')}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Lihat Detail Transaksi
          </button>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Order ID / Waktu</th>
                <th className="p-3">Nama Pasien & RM</th>
                <th className="p-3">Metode Bayar</th>
                <th className="p-3">Nominal Tagihan</th>
                <th className="p-3">Status Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { id: 'INV-20260827-001', time: '10:22', name: 'Budi Santoso (RM-00192)', method: 'QRIS Dynamic', amount: 'Rp 185.000', status: 'SUCCESS' },
                { id: 'INV-20260827-002', time: '10:05', name: 'Siti Aminah (RM-00431)', method: 'BCA Virtual Account', amount: 'Rp 420.000', status: 'SUCCESS' },
                { id: 'INV-20260827-003', time: '09:40', name: 'Ahmad Fauzi (RM-00512)', method: 'Mandiri Virtual Account', amount: 'Rp 95.000', status: 'SUCCESS' }
              ].map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-mono">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">{t.id}</span>
                    <span className="text-slate-400 text-[11px]">{t.time} WIB</span>
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{t.name}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-medium">{t.method}</td>
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{t.amount}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      {t.status}
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

function NotifikasiAPAMTab() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handlePush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Push notifikasi berhasil dibroadcast ke 8,420 pasien APAM!`);
      setTitle('');
      setBody('');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5 text-xs">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" />
          Broadcast Push Notification ke Aplikasi APAM Pasien
        </h3>
        <p className="text-slate-500">Kirim pengumuman jadwal dokter libur, layanan baru, atau edukasi kesehatan langsung ke smartphone pasien.</p>
      </div>

      <form onSubmit={handlePush} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Judul Notifikasi</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Contoh: Jadwal Praktik Poliklinik Hari Libur Nasional..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-semibold"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Pesan Lengkap Notifikasi</label>
          <textarea
            rows={4}
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Tuliskan isi pesan notifikasi di sini..."
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-900/20 flex items-center justify-center gap-2"
        >
          {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Broadcast Notifikasi ke Semua Pasien
        </button>
      </form>
    </div>
  );
}

function PengaturanAPAMTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Smartphone className="w-5 h-5 text-blue-600" />
        Konfigurasi Firebase Cloud Messaging (FCM APAM)
      </h3>
      <div>
        <label className="block font-semibold mb-1">FCM Server Key</label>
        <input type="password" defaultValue="AAAA_fcm_server_key_8899" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <div>
        <label className="block font-semibold mb-1">APAM API Backend Endpoint</label>
        <input type="text" defaultValue="https://api.klinik-myitaru.co.id/apam/v1" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <button
        onClick={() => toast.success('Konfigurasi APAM disimpan!')}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-900/20"
      >
        Simpan Pengaturan APAM
      </button>
    </div>
  );
}

function PaymentDuitkuTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-600" />
        Konfigurasi Payment Gateway Duitku
      </h3>
      <div>
        <label className="block font-semibold mb-1">Merchant Code Duitku</label>
        <input type="text" defaultValue="D10294" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <div>
        <label className="block font-semibold mb-1">API Merchant Key</label>
        <input type="password" defaultValue="duitku_api_key_live_9988" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Callback URL (Webhook)</label>
        <input type="text" defaultValue="https://api.klinik-myitaru.co.id/payment/duitku-callback" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <button
        onClick={() => toast.success('Konfigurasi Duitku disimpan!')}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-900/20"
      >
        Simpan Pengaturan Duitku
      </button>
    </div>
  );
}

function ApiKeyManagementTab() {
  const [apiKey] = useState('SIMRS_LIVE_KEY_882910_XPTA');

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Key className="w-5 h-5 text-blue-600" />
        REST API Key Management SIMRS
      </h3>
      <p className="text-slate-500">Gunakan API Key ini untuk menghubungkan aplikasi eksternal atau vendor pihak ketiga dengan SIMRS.</p>

      <div className="flex gap-2">
        <input type="text" readOnly value={apiKey} className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900 font-mono font-bold" />
        <button
          onClick={() => {
            navigator.clipboard.writeText(apiKey);
            toast.success('API Key disalin ke clipboard!');
          }}
          className="px-4 py-2.5 bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5"
        >
          <Copy className="w-4 h-4" /> Salin
        </button>
      </div>
    </div>
  );
}
