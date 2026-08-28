import React, { useState } from 'react';
import { CreditCard, AlertTriangle, CheckCircle, Clock, ChevronRight, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

export function InfoIuran() {
  const [activeTab, setActiveTab] = useState('tagihan');
  const [tagihan, setTagihan] = useState({
    bulan: 'Agustus 2026',
    jumlahPsn: 2,
    totalTagihan: 70000,
    jatuhTempo: '10 Agustus 2026',
    status: localStorage.getItem('tagihanStatus') || 'Belum Dibayar',
    va: '8888801234567891'
  });
  const [metode, setMetode] = useState('bank');
  const [showQR, setShowQR] = useState(false);

  const riwayat = [
    { id: 1, bulan: 'Juli 2026', jumlah: 70000, status: 'Lunas', tanggalBayar: '05 Juli 2026' },
    { id: 2, bulan: 'Juni 2026', jumlah: 70000, status: 'Lunas', tanggalBayar: '02 Juni 2026' },
  ];

  const handleBayar = () => {
    if (tagihan.status === 'Lunas') {
      toast.success('Tagihan sudah lunas');
      return;
    }
    // Simulasi proses pembayaran
    toast.loading('Memproses pembayaran...', { duration: 2000 });
    setTimeout(() => {
      setShowQR(true);
      toast.success('Silakan scan QR code untuk menyelesaikan pembayaran');
    }, 1500);
  };

  const handleConfirmPayment = () => {
    // Setelah scan QR (simulasi)
    setTagihan({ ...tagihan, status: 'Lunas' });
    setShowQR(false);
    toast.success('Pembayaran berhasil! Tagihan lunas.');
    // Simpan ke localStorage
    localStorage.setItem('tagihanStatus', 'Lunas');
  };

  const handleCopyVA = () => {
    navigator.clipboard.writeText(tagihan.va);
    toast.success('Nomor Virtual Account disalin');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Info Iuran</h1>
          <p className="text-slate-500">Cek tagihan dan riwayat pembayaran iuran JKN Anda</p>
        </div>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button onClick={() => setActiveTab('tagihan')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'tagihan' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Tagihan Saat Ini</button>
        <button onClick={() => setActiveTab('riwayat')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'riwayat' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}>Riwayat Pembayaran</button>
      </div>

      {activeTab === 'tagihan' && (
        <div className="space-y-6">
          {tagihan.status === 'Lunas' ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">Tidak Ada Tagihan</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Semua tagihan sudah lunas.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 border-b border-amber-100 dark:border-amber-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-800 dark:text-amber-400 text-sm">Tagihan Belum Dibayar</p>
                  <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">Harap lakukan pembayaran sebelum {tagihan.jatuhTempo} untuk menghindari denda keterlambatan.</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <p className="text-slate-500 text-sm mb-1">Total Tagihan {tagihan.bulan}</p>
                  <p className="text-4xl font-bold text-slate-800 dark:text-white">Rp {tagihan.totalTagihan.toLocaleString('id-ID')}</p>
                  <p className="text-sm text-slate-500 mt-2">{tagihan.jumlahPsn} Anggota Keluarga (Kelas 3)</p>
                </div>

                {/* Pilihan metode pembayaran */}
                <div className="mb-4">
                  <p className="font-medium text-sm mb-2">Pilih Metode Pembayaran</p>
                  <div className="flex gap-3">
                    <button onClick={() => setMetode('bank')} className={`flex-1 py-2 px-3 border rounded-lg text-sm font-medium ${metode === 'bank' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700' : 'border-slate-300'}`}>Bank Transfer</button>
                    <button onClick={() => setMetode('dompet')} className={`flex-1 py-2 px-3 border rounded-lg text-sm font-medium ${metode === 'dompet' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-700' : 'border-slate-300'}`}>Dompet Digital</button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-6">
                  <p className="text-sm text-slate-500 mb-1">Nomor Virtual Account (VA)</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-mono font-bold text-slate-800 dark:text-white tracking-widest">{tagihan.va}</p>
                    <button 
                      onClick={handleCopyVA}
                      className="text-teal-600 hover:text-teal-700 text-sm font-bold bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-lg"
                    >
                      Salin
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                {showQR && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4 text-center">
                    <p className="text-sm font-medium mb-2">Scan QR Code untuk menyelesaikan pembayaran</p>
                    <div className="mx-auto flex justify-center py-4 bg-white">
                      <QRCodeSVG value={`${tagihan.va}-${tagihan.totalTagihan}`} size={180} />
                    </div>
                    <button onClick={handleConfirmPayment} className="mt-3 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">Saya Sudah Bayar</button>
                  </div>
                )}
                
                <button 
                  onClick={handleBayar}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <CreditCard className="w-5 h-5" /> Bayar Sekarang
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'riwayat' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {riwayat.map(item => (
              <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{item.bulan}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.tanggalBayar}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-white">Rp {item.jumlah.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-emerald-600 font-medium">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
