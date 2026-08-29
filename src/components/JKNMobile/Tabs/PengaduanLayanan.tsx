import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function PengaduanLayanan() {
  const [form, setForm] = useState({ jenis: 'Pengaduan', faskes: '', judul: '', deskripsi: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pengaduanList, setPengaduanList] = useState<any[]>(() => {
    const saved = localStorage.getItem('simrs_jkn_pengaduan');
    return saved ? JSON.parse(saved) : [
      { id: 'ADU-001', jenis: 'Pengaduan', faskes: 'Klinik MyItaru Pusat', judul: 'Antrean terlalu lama', status: 'Ditanggapi', tanggal: '10 Jul 2026' },
      { id: 'ADU-002', jenis: 'Saran', faskes: 'Puskesmas Melati', judul: 'Tambah jam operasional', status: 'Open', tanggal: '05 Jul 2026' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('simrs_jkn_pengaduan', JSON.stringify(pengaduanList));
  }, [pengaduanList]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.faskes || !form.judul || !form.deskripsi) {
      toast.error('Lengkapi semua field yang wajib');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newPengaduan = {
        id: `ADU-${Date.now().toString().slice(-3)}`,
        ...form,
        status: 'Open',
        tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setPengaduanList([newPengaduan, ...pengaduanList]);
      setIsSubmitting(false);
      setForm({ jenis: 'Pengaduan', faskes: '', judul: '', deskripsi: '' });
      toast.success('Pengaduan berhasil dikirim. Kami akan menindaklanjuti.');
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-teal-600" /> Pengaduan Layanan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sampaikan pengaduan, saran, atau aspirasi terkait layanan JKN</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Buat Pengaduan Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Jenis</label>
              <div className="flex gap-3">
                {['Pengaduan', 'Saran', 'Aspirasi'].map(jenis => (
                  <label key={jenis} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jenis"
                      value={jenis}
                      checked={form.jenis === jenis}
                      onChange={e => setForm({...form, jenis: e.target.value})}
                      className="w-4 h-4 text-teal-600"
                    />
                    <span className="text-sm">{jenis}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Fasilitas Kesehatan</label>
              <select
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                value={form.faskes}
                onChange={e => setForm({...form, faskes: e.target.value})}
              >
                <option value="">-- Pilih Faskes --</option>
                <option value="Klinik MyItaru Pusat">Klinik MyItaru Pusat</option>
                <option value="Puskesmas Melati">Puskesmas Melati</option>
                <option value="Klinik Sehat Utama">Klinik Sehat Utama</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Judul</label>
              <input
                type="text"
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Ringkasan pengaduan"
                value={form.judul}
                onChange={e => setForm({...form, judul: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Deskripsi Lengkap</label>
              <textarea
                rows={4}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Jelaskan detail pengaduan Anda..."
                value={form.deskripsi}
                onChange={e => setForm({...form, deskripsi: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Mengirim...' : 'Kirim Pengaduan'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Riwayat Pengaduan Anda</h2>
          <div className="space-y-4">
            {pengaduanList.map(p => (
              <div key={p.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{p.id}</span>
                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs">{p.jenis}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mt-1">{p.judul}</h3>
                    <p className="text-xs text-slate-500">{p.faskes} • {p.tanggal}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    p.status === 'Ditanggapi' ? 'bg-emerald-100 text-emerald-700' :
                    p.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );


}
