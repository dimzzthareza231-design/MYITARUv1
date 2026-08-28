import React, { useState, useEffect } from 'react';
import { Star, Send, ThumbsUp } from 'lucide-react';
import toast from 'react-hot-toast';

export function RatingKesan() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [kategori, setKategori] = useState('');
  const [faskes, setFaskes] = useState('');
  const [komentar, setKomentar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [riwayatRating, setRiwayatRating] = useState<any[]>(() => {
    const saved = localStorage.getItem('simrs_jkn_rating');
    return saved ? JSON.parse(saved) : [
      { id: 1, faskes: 'RS MyItaru Pusat', rating: 5, kategori: 'Pelayanan Dokter', komentar: 'Dokter sangat ramah dan menjelaskan dengan detail', tanggal: '15 Jul 2026' },
      { id: 2, faskes: 'Puskesmas Melati', rating: 4, kategori: 'Kebersihan', komentar: 'Fasilitas bersih dan nyaman', tanggal: '20 Jun 2026' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('simrs_jkn_rating', JSON.stringify(riwayatRating));
  }, [riwayatRating]);
  const kategoriList = [
    'Pelayanan Dokter', 'Pelayanan Perawat', 'Kecepatan Pelayanan',
    'Kebersihan Fasilitas', 'Keramahan Petugas', 'Kelengkapan Fasilitas'
  ];

  const faskesList = [
    'RS MyItaru Pusat', 'Puskesmas Melati', 'Klinik Sehat Utama', 'RS Cipto Mangunkusumo'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Berikan rating terlebih dahulu'); return; }
    if (!kategori) { toast.error('Pilih kategori penilaian'); return; }
    if (!faskes) { toast.error('Pilih fasilitas kesehatan'); return; }

    setIsSubmitting(true);
    setTimeout(() => {
      const newRating = {
        id: Date.now(),
        faskes,
        rating,
        kategori,
        komentar,
        tanggal: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setRiwayatRating([newRating, ...riwayatRating]);
      setIsSubmitting(false);
      setRating(0);
      setKategori('');
      setFaskes('');
      setKomentar('');
      toast.success('Terima kasih atas penilaian Anda!');
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-teal-600" /> Rating Kesan & Pesan (KESSAN)
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Berikan penilaian dan masukan setelah menerima layanan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Berikan Penilaian</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-slate-500 mb-2">Bagaimana pengalaman Anda?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star className={`w-10 h-10 transition-colors ${
                      star <= (hoverRating || rating) ? 'text-amber-400 fill-current' : 'text-slate-300'
                    }`} />
                  </button>
                ))}
              </div>
              <p className="text-sm font-bold mt-2 text-slate-700 dark:text-slate-300">
                {rating === 0 ? 'Pilih rating' :
                 rating === 1 ? 'Sangat Tidak Puas' :
                 rating === 2 ? 'Tidak Puas' :
                 rating === 3 ? 'Cukup' :
                 rating === 4 ? 'Puas' : 'Sangat Puas'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kategori Penilaian</label>
              <select
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                value={kategori}
                onChange={e => setKategori(e.target.value)}
              >
                <option value="">-- Pilih Kategori --</option>
                {kategoriList.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Fasilitas Kesehatan</label>
              <select
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                value={faskes}
                onChange={e => setFaskes(e.target.value)}
              >
                <option value="">-- Pilih Faskes --</option>
                {faskesList.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Komentar (Opsional)</label>
              <textarea
                rows={3}
                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="Ceritakan pengalaman Anda..."
                value={komentar}
                onChange={e => setKomentar(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Mengirim...' : 'Kirim Penilaian'}
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Riwayat Penilaian Anda</h2>
          <div className="space-y-4">
            {riwayatRating.map(r => (
              <div key={r.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">{r.faskes}</h3>
                    <p className="text-xs text-slate-500">{r.kategori} • {r.tanggal}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= r.rating ? 'fill-current' : 'text-slate-300'}`} />
                    ))}
                  </div>
                </div>
                {r.komentar && <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{r.komentar}"</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );


}
