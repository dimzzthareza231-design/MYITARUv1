import React, { useState } from 'react';
import { Edit3, Save, User, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export function PerubahanData() {
  const [activeSection, setActiveSection] = useState('identitas');
  const [formData, setFormData] = useState({
    nik: '3201123456789001', namaLengkap: 'Budi Santoso', alamat: 'Jl. Merdeka No. 45, Jakarta Selatan',
    noHp: '081234567890', email: 'budi.santoso@email.com', segmen: 'PBPU (Mandiri)', kelas: 'Kelas 3'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = [
    { id: 'identitas', label: 'Identitas', icon: User },
    { id: 'kontak', label: 'Kontak', icon: Phone },
    { id: 'kepesertaan', label: 'Kepesertaan', icon: Edit3 },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Perubahan data berhasil diajukan');
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-teal-600" /> Perubahan Data Peserta
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ajukan perubahan data kepesertaan JKN-KIS</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-3 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors ${
              activeSection === section.id
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        {activeSection === 'identitas' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Perubahan Data Identitas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">NIK</label>
                <input type="text" maxLength={16} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none font-mono" value={formData.nik} onChange={e => handleChange('nik', e.target.value.replace(/\D/g, ''))} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                <input type="text" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.namaLengkap} onChange={e => handleChange('namaLengkap', e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Alamat</label>
                <textarea rows={2} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.alamat} onChange={e => handleChange('alamat', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'kontak' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Perubahan Data Kontak</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">No HP</label>
                <input type="tel" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.noHp} onChange={e => handleChange('noHp', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input type="email" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'kepesertaan' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Perubahan Segmen & Kelas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Segmen Kepesertaan</label>
                <select className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.segmen} onChange={e => handleChange('segmen', e.target.value)}>
                  <option value="PBPU (Mandiri)">PBPU (Mandiri)</option>
                  <option value="PPU (Pekerja Penerima Upah)">PPU (Pekerja Penerima Upah)</option>
                  <option value="BP (Bukan Pekerja)">BP (Bukan Pekerja)</option>
                  <option value="PBI (Penerima Bantuan Iuran)">PBI (Penerima Bantuan Iuran)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas Rawat</label>
                <select className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.kelas} onChange={e => handleChange('kelas', e.target.value)}>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 1">Kelas 1</option>
                </select>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <strong>Catatan:</strong> Perubahan kelas rawat hanya dapat dilakukan setelah peserta aktif minimal 1 tahun di kelas sebelumnya.
              </p>
            </div>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Memproses...' : 'Ajukan Perubahan'}
        </button>
      </form>
    </div>
  );
}
