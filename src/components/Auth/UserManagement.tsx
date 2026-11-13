import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, Eye, EyeOff, X, Save, UserCheck, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { ROLES, getRoleById, getCustomPermissions } from '../../data/roles';

export function UserManagement() {
  const { users, currentUser, addUser, updateUser, deleteUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nama: '', username: '', password: '', email: '', roleId: 'dokter', aktif: true
  });

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ nama: '', username: '', password: '', email: '', roleId: 'dokter', aktif: true });
    setShowModal(true);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setFormData({ nama: user.nama, username: user.username, password: user.password, email: user.email, roleId: user.roleId, aktif: user.aktif });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.nama || !formData.username || !formData.password) {
      toast.error('Nama, username, dan password wajib diisi');
      return;
    }

    // Cek duplikat username
    const isDuplicate = users.some(u => u.username === formData.username && u.id !== editingUser?.id);
    if (isDuplicate) {
      toast.error('Username sudah digunakan');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, formData);
      toast.success('User berhasil diupdate');
    } else {
      addUser(formData);
      toast.success('User baru berhasil ditambahkan');
    }
    setShowModal(false);
  };

  const handleDelete = (user: any) => {
    if (user.id === currentUser?.id) {
      toast.error('Tidak bisa menghapus akun sendiri');
      return;
    }
    deleteUser(user.id);
    toast.success(`User ${user.nama} berhasil dihapus`);
  };

  const toggleAktif = (user: any) => {
    if (user.id === currentUser?.id) {
      toast.error('Tidak bisa menonaktifkan akun sendiri');
      return;
    }
    updateUser(user.id, { aktif: !user.aktif });
    toast.success(user.aktif ? 'User dinonaktifkan' : 'User diaktifkan');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" /> Manajemen User & Role
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola akun pengguna dan hak akses sistem</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah User
        </button>
      </div>

      {/* Tabel User */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Nama</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Username</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Email</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {users.map(user => {
              const role = getRoleById(user.roleId);
              return (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4 font-bold text-slate-800 dark:text-white">{user.nama}</td>
                  <td className="p-4 font-mono text-slate-600 dark:text-slate-400">{user.username}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-bold">
                      {role?.icon} {role?.nama}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleAktif(user)}
                      className={`px-2 py-1 rounded-full text-xs font-bold transition-colors ${
                        user.aktif
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {user.aktif ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openEditModal(user)} className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user)} className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Role */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Daftar Role Sistem ({ROLES.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map(role => (
            <div key={role.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{role.icon}</span>
                <span className="font-bold text-slate-800 dark:text-white">{role.nama}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{role.deskripsi}</p>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                {role.id === 'super_admin' ? 'Seluruh Modul (Akses Penuh)' : `${(getCustomPermissions()[role.id] || role.moduleAccess).length} modul diakses`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Form User */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${
              editingUser 
                ? 'border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-transparent to-transparent' 
                : 'border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  editingUser 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                    : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                }`}>
                  {editingUser ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {editingUser ? 'Edit Pengguna Sistem' : 'Tambah Akun Pengguna Baru'}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      editingUser 
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                    }`}>
                      {editingUser ? `@${editingUser.username}` : 'Akun Baru'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {editingUser ? 'Perbarui informasi kredensial dan hak akses' : 'Atur profil, role akses, dan kata sandi pengguna'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto custom-scrollbar max-h-[75vh]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.nama} 
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  placeholder="Contoh: Dr. Budi Santoso, Sp.PD"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={formData.username} 
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="dr_budi"
                    className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full p-2.5 pr-9 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Email Internal / Kontak
                </label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="budi.santoso@klinik.id"
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                  Hak Akses / Peran (Role) <span className="text-rose-500">*</span>
                </label>
                <select 
                  value={formData.roleId} 
                  onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                  className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/70 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                >
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.icon} {role.nama}</option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <label htmlFor="aktif" className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer block">
                    Status Akun Aktif
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pengguna dapat masuk ke sistem SIMK jika akun aktif
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  id="aktif" 
                  checked={formData.aktif} 
                  onChange={(e) => setFormData({...formData, aktif: e.target.checked})} 
                  className="w-5 h-5 text-blue-600 rounded cursor-pointer" 
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2.5 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/90">
              <button 
                onClick={() => setShowModal(false)} 
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors border border-slate-300 dark:border-slate-700"
              >
                Batal
              </button>
              <button 
                onClick={handleSave} 
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Pengguna</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
