import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
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
    if (window.confirm(`Hapus user ${user.nama}?`)) {
      deleteUser(user.id);
      toast.success('User berhasil dihapus');
    }
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md shadow-xl">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingUser ? 'Edit User' : 'Tambah User Baru'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" value={formData.nama} onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Username <span className="text-red-500">*</span></label>
                <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Role <span className="text-red-500">*</span></label>
                <select value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: e.target.value})}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none">
                  {ROLES.map(role => (
                    <option key={role.id} value={role.id}>{role.icon} {role.nama}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="aktif" checked={formData.aktif} onChange={(e) => setFormData({...formData, aktif: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="aktif" className="text-sm font-bold">Akun Aktif</label>
              </div>
            </div>
            <div className="flex gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
              <button onClick={() => setShowModal(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white py-2.5 rounded-lg font-bold hover:bg-slate-300">Batal</button>
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
