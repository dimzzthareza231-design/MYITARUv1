import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, Shield, Briefcase, Activity, Key, LogOut, 
  CheckCircle, Mail, Phone, Calendar, MapPin, Award, Camera, 
  Save, X, Lock, FileText, AlertTriangle, Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useAuditTrail } from '../contexts/AuditTrailContext';
import LogoutButton from './LogoutButton';

export function Profile() {
  const { currentUser, updateUser } = useAuth();
  const toast = useToast();
  const { logActivity } = useAuditTrail();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'security' | 'activity'>('personal');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [formData, setFormData] = useState({
    id: currentUser?.id || '1',
    nama_lengkap: currentUser?.nama || 'Administrator Utama',
    nip: '198501152010011001',
    email: currentUser?.email || 'admin@myitaru.rs',
    no_telepon: '081234567890',
    jabatan: currentUser?.roleId === 'super_admin' ? 'Super Administrator' : currentUser?.roleId === 'dokter' ? 'Dokter Spesialis' : 'Staff RS',
    departemen: 'Teknologi Informasi & SIMRS',
    spesialisasi: currentUser?.roleId === 'dokter' ? 'Spesialis Penyakit Dalam' : 'Manajemen SIMRS',
    str_number: 'STR-123456-990',
    sip_number: 'SIP-789012-441',
    tanggal_lahir: '1985-01-15',
    jenis_kelamin: 'L',
    alamat: 'Jl. Kesehatan No. 123, Jakarta Pusat',
    foto_url: currentUser?.photoURL || '',
    join_date: '2020-01-01',
    status_kepegawaian: 'Pegawai Tetap',
    unit_kerja: 'Instalasi SIMRS & Rekam Medis'
  });

  // Load profile from localStorage or sync with currentUser
  useEffect(() => {
    const storageKey = `user_profile_${currentUser?.id || 'default'}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          nama_lengkap: parsed.nama_lengkap || currentUser?.nama || prev.nama_lengkap,
          email: parsed.email || currentUser?.email || prev.email,
        }));
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    } else if (currentUser) {
      setFormData(prev => ({
        ...prev,
        nama_lengkap: currentUser.nama,
        email: currentUser.email,
        jabatan: currentUser.roleId.toUpperCase(),
        foto_url: currentUser.photoURL || ''
      }));
    }
  }, [currentUser]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file foto maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, foto_url: result }));
        toast.success('Foto profil berhasil diunggah');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.nama_lengkap.trim() || !formData.email.trim()) {
      toast.error('Nama lengkap dan email wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      const storageKey = `user_profile_${currentUser?.id || 'default'}`;
      localStorage.setItem(storageKey, JSON.stringify(formData));

      // Update in AuthContext if possible
      if (currentUser?.id) {
        updateUser(currentUser.id, {
          nama: formData.nama_lengkap,
          email: formData.email,
          photoURL: formData.foto_url
        });
      }

      logActivity(
        currentUser?.username || 'user',
        'Update Profile',
        'Profile',
        'User',
        currentUser?.id || '1',
        undefined,
        { nama: formData.nama_lengkap, email: formData.email }
      );

      toast.success('Profil berhasil diperbarui');
      setIsEditing(false);
    } catch (error) {
      toast.error('Gagal menyimpan profil');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Data Pribadi', icon: UserIcon },
    { id: 'professional', label: 'Data Profesional & STR', icon: Briefcase },
    { id: 'security', label: 'Keamanan & Akun', icon: Shield },
    { id: 'activity', label: 'Log Aktivitas', icon: Activity },
  ] as const;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-2xl shadow-md p-6 lg:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-inner">
              {formData.foto_url ? (
                <img src={formData.foto_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-white tracking-wider">
                  {formData.nama_lengkap?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            {isEditing && (
              <label className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-xl cursor-pointer shadow-lg hover:bg-blue-50 transition-all">
                <Camera className="w-4 h-4" />
                <input type="file" accept="image/*" onChange={handleFotoUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{formData.nama_lengkap}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm border border-white/30">
                {currentUser?.roleId?.toUpperCase() || 'USER'}
              </span>
            </div>
            <p className="text-blue-100 font-medium">{formData.jabatan} • {formData.departemen}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-blue-200 mt-2">
              <span>NIP: {formData.nip}</span>
              <span>•</span>
              <span>Email: {formData.email}</span>
              <span>•</span>
              <span>Status: {formData.status_kepegawaian}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm"
              >
                <UserIcon className="w-4 h-4" /> Edit Profil
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all text-sm flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-sm transition-all text-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-blue-600" />
                Informasi Biodata & Kontak
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Data identitas diri resmi pegawai RS.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  value={formData.nama_lengkap}
                  onChange={e => handleChange('nama_lengkap', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  NIP / No. Identitas Pegawai
                </label>
                <input
                  type="text"
                  value={formData.nip}
                  onChange={e => handleChange('nip', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Email Rumah Sakit *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.no_telepon}
                  onChange={e => handleChange('no_telepon', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={e => handleChange('tanggal_lahir', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Jenis Kelamin
                </label>
                <select
                  value={formData.jenis_kelamin}
                  onChange={e => handleChange('jenis_kelamin', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Alamat Domisili
                </label>
                <textarea
                  value={formData.alamat}
                  onChange={e => handleChange('alamat', e.target.value)}
                  disabled={!isEditing}
                  rows={2}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'professional' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                Data Jabatan & Legalitas Medis
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Informasi kepegawaian, surat tanda registrasi (STR), dan izin praktik (SIP).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Jabatan Fungsional / Struktural
                </label>
                <input
                  type="text"
                  value={formData.jabatan}
                  onChange={e => handleChange('jabatan', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Departemen / Unit Kerja
                </label>
                <input
                  type="text"
                  value={formData.departemen}
                  onChange={e => handleChange('departemen', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Spesialisasi / Keahlian
                </label>
                <input
                  type="text"
                  value={formData.spesialisasi}
                  onChange={e => handleChange('spesialisasi', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Tanggal Mulai Bertugas
                </label>
                <input
                  type="date"
                  value={formData.join_date}
                  onChange={e => handleChange('join_date', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nomor STR (Surat Tanda Registrasi)
                </label>
                <input
                  type="text"
                  value={formData.str_number}
                  onChange={e => handleChange('str_number', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nomor SIP (Surat Izin Praktik)
                </label>
                <input
                  type="text"
                  value={formData.sip_number}
                  onChange={e => handleChange('sip_number', e.target.value)}
                  disabled={!isEditing}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white disabled:opacity-75 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                Keamanan Akun & Kredensial
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pengaturan password, session login, dan verifikasi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">Ganti Kata Sandi</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tingkatkan keamanan akun dengan password yang kuat.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Perbarui Password
                </button>
              </div>

              <div className="p-5 border border-rose-200 dark:border-rose-900/40 rounded-xl bg-rose-50 dark:bg-rose-900/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-100 dark:bg-rose-900/40 text-rose-600 rounded-lg">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-900 dark:text-rose-200 text-sm">Keluar dari Sesi</h3>
                    <p className="text-xs text-rose-700 dark:text-rose-400">Akhiri sesi aktif Anda di perangkat ini.</p>
                  </div>
                </div>
                <div>
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Riwayat Aktivitas Login & Sesi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Audit rekaman jejak interaksi pada akun ini.</p>
            </div>

            <div className="space-y-3">
              {[
                { action: 'Login Berhasil via Web Dashboard', time: 'Baru saja', ip: '192.168.1.102', status: 'Sukses', icon: Shield, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
                { action: 'Akses Modul Pengaturan SIMRS', time: '15 menit lalu', ip: '192.168.1.102', status: 'Sukses', icon: FileText, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
                { action: 'Perubahan Konfigurasi Sistem', time: '1 jam lalu', ip: '192.168.1.102', status: 'Sukses', icon: CheckCircle, color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30' },
                { action: 'Sesi Aktif Diperbarui', time: '3 jam lalu', ip: '192.168.1.102', status: 'Sukses', icon: Activity, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' }
              ].map((act, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 border border-slate-100 dark:border-slate-700/60 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${act.color}`}>
                      <act.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{act.action}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">IP: {act.ip} • {act.time}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { currentUser, updateUser } = useAuth();
  const toast = useToast();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPass || !newPass || !confirmPass) {
      toast.error('Semua kolom wajib diisi');
      return;
    }
    if (currentUser?.password && oldPass !== currentUser.password) {
      toast.error('Password lama tidak sesuai');
      return;
    }
    if (newPass !== confirmPass) {
      toast.error('Konfirmasi password baru tidak cocok');
      return;
    }
    if (newPass.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }

    if (currentUser?.id) {
      updateUser(currentUser.id, { password: newPass });
    }

    toast.success('Password berhasil diperbarui');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <h2 className="text-lg font-bold">Ganti Password Akun</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Password Lama *
            </label>
            <input
              type="password"
              value={oldPass}
              onChange={e => setOldPass(e.target.value)}
              placeholder="Masukkan password lama"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Password Baru *
            </label>
            <input
              type="password"
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Konfirmasi Password Baru *
            </label>
            <input
              type="password"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-700 text-sm transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              Simpan Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
