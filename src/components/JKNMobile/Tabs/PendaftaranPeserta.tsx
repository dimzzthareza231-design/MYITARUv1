import React, { useState } from 'react';
import { UserPlus, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export function PendaftaranPeserta() {
  const [formData, setFormData] = useState({
    nik: '', namaLengkap: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: 'L',
    noHp: '', email: '', alamat: '', kelas: 'Kelas 3', faskes1: '', metodePembayaran: 'Auto Debit', setuju: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const daftarFaskes = [
    'Puskesmas Melati', 'Klinik Sehat Utama', 'Klinik Keluarga Bahagia',
    'Puskesmas Cempaka', 'Dokter Praktik Mandiri dr. Ahmad'
  ];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nik || formData.nik.length !== 16) { toast.error('NIK harus 16 digit'); return; }
    if (!formData.namaLengkap.trim()) { toast.error('Nama lengkap wajib diisi'); return; }
    if (!formData.noHp.trim()) { toast.error('Nomor HP wajib diisi'); return; }
    if (!formData.faskes1) { toast.error('Pilih FKTP terlebih dahulu'); return; }
    if (!formData.setuju) { toast.error('Anda harus menyetujui syarat dan ketentuan'); return; }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Pendaftaran peserta berhasil!');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="p-6">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Pendaftaran Anda sebagai Peserta Bukan Penerima Upah (PBPU) telah berhasil diproses.
            Nomor kartu BPJS Anda akan dikirim melalui SMS dan email dalam 1x24 jam.
          </p>
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-teal-800 dark:text-teal-300">
              <strong>No Pendaftaran:</strong> REG-2026-{Date.now().toString().slice(-6)}
            </p>
          </div>
          <button
            onClick={() => { setIsSuccess(false); setFormData({ nik: '', namaLengkap: '', tempatLahir: '', tanggalLahir: '', jenisKelamin: 'L', noHp: '', email: '', alamat: '', kelas: 'Kelas 3', faskes1: '', metodePembayaran: 'Auto Debit', setuju: false }); }}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700"
          >
            Daftar Peserta Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-teal-600" /> Pendaftaran Peserta Baru
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Daftarkan diri sebagai Peserta Bukan Penerima Upah (PBPU) / Mandiri</p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-800 dark:text-blue-300">Informasi Penting</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
            Pendaftaran PBPU/Mandiri dikenakan iuran sesuai kelas yang dipilih. Iuran wajib dibayar setiap bulan paling lambat tanggal 10.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Data Pribadi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">NIK <span className="text-red-500">*</span></label>
              <input type="text" maxLength={16} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none font-mono" placeholder="16 digit NIK" value={formData.nik} onChange={e => handleChange('nik', e.target.value.replace(/\D/g, ''))} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span></label>
              <input type="text" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Nama lengkap sesuai KTP" value={formData.namaLengkap} onChange={e => handleChange('namaLengkap', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tempat Lahir</label>
              <input type="text" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Kota kelahiran" value={formData.tempatLahir} onChange={e => handleChange('tempatLahir', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Lahir</label>
              <input type="date" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.tanggalLahir} onChange={e => handleChange('tanggalLahir', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin</label>
              <div className="flex gap-4 p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="jk" checked={formData.jenisKelamin === 'L'} onChange={() => handleChange('jenisKelamin', 'L')} className="w-4 h-4 text-teal-600" />
                  <span>Laki-laki</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="jk" checked={formData.jenisKelamin === 'P'} onChange={() => handleChange('jenisKelamin', 'P')} className="w-4 h-4 text-teal-600" />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">No HP <span className="text-red-500">*</span></label>
              <input type="tel" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="08xxxxxxxxxx" value={formData.noHp} onChange={e => handleChange('noHp', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input type="email" className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="email@contoh.com" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap</label>
              <textarea rows={2} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Alamat lengkap sesuai KTP" value={formData.alamat} onChange={e => handleChange('alamat', e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Pilihan Kelas & FKTP</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kelas Rawat</label>
              <select className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.kelas} onChange={e => handleChange('kelas', e.target.value)}>
                <option value="Kelas 3">Kelas 3 (Rp 35.000/bulan)</option>
                <option value="Kelas 2">Kelas 2 (Rp 100.000/bulan)</option>
                <option value="Kelas 1">Kelas 1 (Rp 150.000/bulan)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">FKTP Pilihan <span className="text-red-500">*</span></label>
              <select className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.faskes1} onChange={e => handleChange('faskes1', e.target.value)}>
                <option value="">-- Pilih FKTP --</option>
                {daftarFaskes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Metode Pembayaran Iuran</label>
              <select className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none" value={formData.metodePembayaran} onChange={e => handleChange('metodePembayaran', e.target.value)}>
                <option value="Auto Debit">Auto Debit Rekening</option>
                <option value="Manual">Bayar Manual (VA/Minimarket)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4 text-teal-600" checked={formData.setuju} onChange={e => handleChange('setuju', e.target.checked)} />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Saya menyatakan bahwa data yang saya berikan adalah benar dan saya setuju dengan syarat dan ketentuan program JKN-KIS.
            </span>
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Memproses Pendaftaran...' : 'Daftarkan Peserta'}
        </button>
      </form>
    </div>
  );
}
