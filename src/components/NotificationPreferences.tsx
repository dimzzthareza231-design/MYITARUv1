import React, { useState } from 'react';
import { 
  Bell, Mail, MessageCircle, Smartphone, Send, Settings, 
  Volume2, ShieldAlert, Clock, CheckCircle2, Sliders, AlertCircle, FileCheck, Stethoscope
} from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { useToast } from '../contexts/ToastContext';

export function NotificationPreferences() {
  const { preferences, updatePreferences, addNotification } = useNotification();
  const toast = useToast();
  const [testMessage, setTestMessage] = useState('');
  const [testType, setTestType] = useState<'info' | 'success' | 'warning' | 'error'>('info');

  // Extended local event preferences
  const [eventSettings, setEventSettings] = useState(() => {
    const saved = localStorage.getItem('simrs_event_notifs');
    return saved ? JSON.parse(saved) : {
      criticalLab: true,
      newQueue: true,
      pharmacyOrder: true,
      vitalAlert: true,
      backupStatus: true,
      approvalRequest: true,
      soundEnabled: true,
      quietHours: false,
      quietStart: '22:00',
      quietEnd: '06:00'
    };
  });

  const handleToggle = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] });
    toast.success(`Preferensi ${key} berhasil diperbarui`);
  };

  const handleEventToggle = (key: string) => {
    const updated = { ...eventSettings, [key]: !eventSettings[key] };
    setEventSettings(updated);

    toast.success('Pengaturan trigger notifikasi disimpan');
  };

  const handleTimeChange = (key: string, val: string) => {
    const updated = { ...eventSettings, [key]: val };
    setEventSettings(updated);
  };

  const handleSendTest = () => {
    if (!testMessage.trim()) {
      toast.error('Silakan masukkan pesan uji coba');
      return;
    }

    addNotification({
      type: testType,
      title: `Uji Coba Notifikasi (${testType.toUpperCase()})`,
      message: testMessage.trim(),
      module: 'System'
    });

    setTestMessage('');
    toast.success('Uji coba notifikasi berhasil dipicu');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}/
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Pengaturan & Preferensi Notifikasi
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Atur saluran pengiriman notifikasi, trigger peristiwa klinis, dan mode hening SIMK.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Notification Channels */}
        <div className="lg:col-span-2 space-y-6">
          {/* Channels */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Saluran Pengiriman Notifikasi
            </h2>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors bg-white dark:bg-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">In-App Notification & Bell</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Pemberitahuan instan di lonceng notifikasi dan pop-up banner sistem MYITARU.
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.inApp}
                    onChange={() => handleToggle('inApp')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors bg-white dark:bg-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">Email Gateway Notification</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Kirim ringkasan laporan harian, resep kritis, dan security alert ke email terdaftar.
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.email}
                    onChange={() => handleToggle('email')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors bg-white dark:bg-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">WhatsApp Business Gateway</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Notifikasi jadwal dokter, reminder kontrol pasien, dan approval direksi otomatis.
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.whatsapp}
                    onChange={() => handleToggle('whatsapp')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors bg-white dark:bg-slate-800">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">SMS Emergency Alert</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Jalur cadangan SMS untuk panggilan darurat Code Blue atau server failure.
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.sms}
                    onChange={() => handleToggle('sms')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Event Triggers */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Peristiwa & Modul Pemicu Notifikasi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { key: 'criticalLab', label: 'Nilai Kritis Laboratorium', desc: 'Alert hasil tes di luar ambang batas aman', icon: AlertCircle, color: 'text-rose-500' },
                { key: 'newQueue', label: 'Pasien Masuk Antrian Poli/IGD', desc: 'Notifikasi saat pendaftaran berhasil', icon: Stethoscope, color: 'text-blue-500' },
                { key: 'pharmacyOrder', label: 'E-Resep Masuk Farmasi', desc: 'Resep baru dari dokter ralan / ranap', icon: FileCheck, color: 'text-emerald-500' },
                { key: 'vitalAlert', label: 'Early Warning Score (EWS)', desc: 'Penurunan kondisi tanda vital pasien', icon: ShieldAlert, color: 'text-amber-500' },
                { key: 'backupStatus', label: 'Laporan Backup & DR', desc: 'Notifikasi pencadangan database berkala', icon: CheckCircle2, color: 'text-indigo-500' },
                { key: 'approvalRequest', label: 'Permintaan Approval Workflow', desc: 'Persetujuan disposisi dan pembelian obat', icon: Clock, color: 'text-purple-500' },
              ].map(evt => (
                <div key={evt.key} className="p-3.5 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <div className="flex items-center gap-3">
                    <evt.icon className={`w-5 h-5 ${evt.color}`} />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">{evt.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{evt.desc}</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={eventSettings[evt.key]}
                    onChange={() => handleEventToggle(evt.key)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Audio, Quiet Hours & Test Sender */}
        <div className="space-y-6">
          {/* Sound & Quiet Hours */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <Volume2 className="w-5 h-5 text-amber-500" />
              Suara & Mode Hening
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">Audio Alert / Chime</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Bunyikan nada saat ada alert darurat</div>
                </div>
                <input
                  type="checkbox"
                  checked={eventSettings.soundEnabled}
                  onChange={() => handleEventToggle('soundEnabled')}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">Jam Tenang (Quiet Hours)</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Nonaktifkan bunyi notifikasi non-darurat</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={eventSettings.quietHours}
                    onChange={() => handleEventToggle('quietHours')}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
                {eventSettings.quietHours && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Mulai</label>
                      <input
                        type="time"
                        value={eventSettings.quietStart}
                        onChange={e => handleTimeChange('quietStart', e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Selesai</label>
                      <input
                        type="time"
                        value={eventSettings.quietEnd}
                        onChange={e => handleTimeChange('quietEnd', e.target.value)}
                        className="w-full p-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Test Sender */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
              <Send className="w-5 h-5 text-emerald-500" />
              Uji Coba Pengiriman
            </h2>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Tipe Notifikasi
                </label>
                <select
                  value={testType}
                  onChange={e => setTestType(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">ℹ️ Informasi (Info)</option>
                  <option value="success">✅ Sukses (Success)</option>
                  <option value="warning">⚠️ Peringatan (Warning)</option>
                  <option value="error">🚨 Darurat / Kritis (Error)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Pesan Uji Coba
                </label>
                <textarea
                  value={testMessage}
                  onChange={e => setTestMessage(e.target.value)}
                  placeholder="Contoh: Tes antrian poli umum nomor A-012 telah dipanggil..."
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar"
                  rows={3}
                />
              </div>

              <button
                onClick={handleSendTest}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" /> Kirim Uji Notifikasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPreferences;
