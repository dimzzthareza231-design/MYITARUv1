import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';

export function FormPasien({ initialData, onSubmit, onCancel }: any) {
  const [formData, setFormData] = useState(initialData || {
    nik: '', nama: '', ttl: '', jenis_kelamin: '', penjamin: 'Umum', status: 'Aktif'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nik) {
      newErrors.nik = 'NIK wajib diisi';
    } else if (formData.nik.length !== 16) {
      newErrors.nik = 'NIK harus 16 digit';
    } else if (!/^\\d+$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus angka';
    }
    
    if (!formData.nama) {
      newErrors.nama = 'Nama wajib diisi';
    } else if (formData.nama.length < 3) {
      newErrors.nama = 'Nama minimal 3 karakter';
    }
    
    if (!formData.ttl) {
      newErrors.ttl = 'Tanggal lahir wajib diisi';
    }
    
    if (!formData.jenis_kelamin) {
      newErrors.jenis_kelamin = 'Jenis kelamin wajib dipilih';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Mohon lengkapi semua field yang wajib diisi');
      return;
    }
    
    setIsSubmitting(true);
    
    await new Promise(r => setTimeout(r, 1000));
    
    const pasien = JSON.parse(localStorage.getItem('pasien') || '[]');
    const newData = {
      ...formData,
      id: initialData?.id || Date.now().toString(),
      no_rm: initialData?.no_rm || `RM-${String(pasien.length + 1).padStart(3, '0')}`
    };
    
    if (initialData) {
      const updated = pasien.map((p: any) => p.id === initialData.id ? newData : p);
      localStorage.setItem('pasien', JSON.stringify(updated));
    } else {
      localStorage.setItem('pasien', JSON.stringify([...pasien, newData]));
    }
    
    setIsSubmitting(false);
    onSubmit(newData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-medium mb-1.5 text-sm text-slate-700 dark:text-slate-300">
          NIK <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.nik}
          onChange={(e) => handleChange('nik', e.target.value.replace(/\\D/g, '').substring(0, 16))}
          maxLength={16}
          className={`w-full p-2.5 border rounded-lg text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            errors.nik ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-300 dark:border-slate-600 focus:border-blue-500'
          }`}
          placeholder="16 digit NIK"
        />
        {errors.nik && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.nik}</p>}
        {formData.nik.length === 16 && !errors.nik && (
          <p className="text-emerald-600 text-xs mt-1.5 font-medium">✅ NIK valid</p>
        )}
      </div>
      
      <div>
        <label className="block font-medium mb-1.5 text-sm text-slate-700 dark:text-slate-300">
          Nama Lengkap <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={formData.nama}
          onChange={(e) => handleChange('nama', e.target.value)}
          className={`w-full p-2.5 border rounded-lg text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            errors.nama ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-300 dark:border-slate-600 focus:border-blue-500'
          }`}
          placeholder="Sesuai KTP"
        />
        {errors.nama && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.nama}</p>}
      </div>
      
      <div>
        <label className="block font-medium mb-1.5 text-sm text-slate-700 dark:text-slate-300">
          Tanggal Lahir <span className="text-rose-500">*</span>
        </label>
        <input
          type="date"
          value={formData.ttl}
          onChange={(e) => handleChange('ttl', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className={`w-full p-2.5 border rounded-lg text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            errors.ttl ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' : 'border-slate-300 dark:border-slate-600 focus:border-blue-500'
          }`}
        />
        {errors.ttl && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.ttl}</p>}
      </div>
      
      <div>
        <label className="block font-medium mb-1.5 text-sm text-slate-700 dark:text-slate-300">
          Jenis Kelamin <span className="text-rose-500">*</span>
        </label>
        <div className="flex gap-3">
          {['L', 'P'].map(gender => (
            <button
              key={gender}
              type="button"
              onClick={() => handleChange('jenis_kelamin', gender)}
              className={`flex-1 p-2.5 border rounded-lg text-sm font-medium transition-colors ${
                formData.jenis_kelamin === gender
                  ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
            >
              {gender === 'L' ? 'Laki-laki' : 'Perempuan'}
            </button>
          ))}
        </div>
        {errors.jenis_kelamin && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.jenis_kelamin}</p>}
      </div>
      
      <div>
        <label className="block font-medium mb-1.5 text-sm text-slate-700 dark:text-slate-300">Penjamin</label>
        <select
          value={formData.penjamin}
          onChange={(e) => handleChange('penjamin', e.target.value)}
          className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        >
          <option value="BPJS">BPJS Kesehatan</option>
          <option value="Umum">Umum / Tunai</option>
          <option value="Asuransi">Asuransi Swasta</option>
        </select>
      </div>
      
      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 font-medium transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium transition-colors"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </>
          ) : (
            <>{initialData ? 'Update' : 'Simpan'}</>
          )}
        </button>
      </div>
    </form>
  );
}
