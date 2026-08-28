import React, { useState } from 'react';
import { QrCode, Search, Copy, Banknote, CheckCircle, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

export function InfoVirtualAccount() {
  const [nik, setNik] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [vaData, setVaData] = useState<any>(null);

  const handleCariVA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nik.trim() || nik.length < 16) {
      toast.error('Masukkan NIK 16 digit yang valid');
      return;
    }
    setIsSearching(true);
    setVaData(null);

    setTimeout(() => {
      setVaData({
        nama: 'Budi Santoso',
        nik: nik,
        noVA: '8801 0812 3456 7891',
        bank: 'Bank BNI',
        tagihan: 140000,
        jatuhTempo: '10 Feb 2026',
        kodeBayar: 'VA-BPJS-2026-02-001'
      });
      setIsSearching(false);
      toast.success('Nomor Virtual Account berhasil ditemukan');
    }, 1500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, ''));
    toast.success('Nomor VA berhasil disalin');
  };

  const daftarBank = [
    { nama: 'Bank BNI', kode: '8801', warna: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
    { nama: 'Bank BRI', kode: '8802', warna: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { nama: 'Bank Mandiri', kode: '8803', warna: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    { nama: 'Bank BCA', kode: '8804', warna: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { nama: 'Tokopedia', kode: '8805', warna: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    { nama: 'GoPay', kode: '8806', warna: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <QrCode className="w-6 h-6 text-teal-600" /> Info Virtual Account
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Cari nomor Virtual Account (VA) untuk pembayaran iuran berdasarkan NIK</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="font-bold text-slate-800 dark:text-white mb-4">Cari Nomor Virtual Account</h2>
        <form onSubmit={handleCariVA} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">NIK (Nomor Induk Kependudukan)</label>
            <input
              type="text"
              maxLength={16}
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none font-mono"
              placeholder="Masukkan 16 digit NIK"
              value={nik}
              onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isSearching ? 'Mencari...' : 'Cari VA'}
            </button>
          </div>
        </form>
      </div>

      {vaData && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-4 text-white">
            <h3 className="font-bold">Nomor Virtual Account Ditemukan</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Nama Peserta</p>
                  <p className="font-bold text-slate-800 dark:text-white">{vaData.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">NIK</p>
                  <p className="font-mono font-bold text-slate-800 dark:text-white">{vaData.nik}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Bank</p>
                  <p className="font-bold text-slate-800 dark:text-white">{vaData.bank}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tagihan</p>
                  <p className="text-2xl font-bold text-teal-600">Rp {vaData.tagihan.toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Jatuh Tempo</p>
                  <p className="font-bold text-amber-600">{vaData.jatuhTempo}</p>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-teal-300 flex items-center justify-center mb-4">
                  <QrCode className="w-16 h-16 text-teal-600" />
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Nomor Virtual Account</p>
                  <p className="font-mono text-xl font-bold text-slate-800 dark:text-white tracking-wider">{vaData.noVA}</p>
                </div>
                <button
                  onClick={() => handleCopy(vaData.noVA)}
                  className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" /> Salin Nomor VA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 dark:text-slate-400">Mencari nomor Virtual Account...</p>
        </div>
      )}

      {!vaData && !isSearching && (
        <div className="text-center py-12">
          <Banknote className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 dark:text-slate-400">Masukkan NIK untuk mencari nomor Virtual Account pembayaran iuran.</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-teal-600" /> Channel Pembayaran yang Tersedia
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {daftarBank.map((bank, idx) => (
            <div key={idx} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-bold ${bank.warna}`}>{bank.kode}</span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{bank.nama}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
