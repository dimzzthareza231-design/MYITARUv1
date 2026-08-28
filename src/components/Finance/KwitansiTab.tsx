import React, { useState } from 'react';
import { 
  Search, Printer, Download, Eye, FileText, CheckCircle, 
  Building2, QrCode, Calendar, ArrowRight, ShieldCheck, UserCheck
} from 'lucide-react';
import { BillingRecord } from './types';
import { useToast } from '../../contexts/ToastContext';
import { DocumentPreviewModal } from '../Documents/DocumentPreviewModal';

interface KwitansiTabProps {
  billings: BillingRecord[];
  activeKwitansiBilling?: BillingRecord | null;
}

export function KwitansiTab({
  billings,
  activeKwitansiBilling
}: KwitansiTabProps) {
  const toast = useToast();
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(
    activeKwitansiBilling || billings.find(b => b.status === 'Lunas') || (billings.length > 0 ? billings[0] : null)
  );

  const [filterService, setFilterService] = useState<'Semua' | 'Rawat Jalan' | 'Rawat Inap'>('Semua');

  const filteredList = billings.filter(b => {
    const matchesSearch = 
      b.namaPasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.noKwitansi && b.noKwitansi.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.noBilling.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.noRm.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = filterService === 'Semua' ? true : b.tipeLayanan === filterService;
    return matchesSearch && matchesService;
  });

  const handlePrint = () => {
    setShowPreview(true);
  };

  const handleDownloadPDF = () => {
    toast.success(`Mengunduh file Kwitansi_${selectedBilling?.noKwitansi || 'Resmi'}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Kwitansi Pembayaran & Invoice Resmi RS</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Arsip tanda bukti pembayaran sah, kwitansi bermaterai, dan invoice rincian biaya medis.
          </p>
        </div>

        {selectedBilling && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kwitansi</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: List on Left (4 cols), Printable Preview on Right (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari No Kwitansi, RM, Pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
              {(['Semua', 'Rawat Jalan', 'Rawat Inap'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterService(tab)}
                  className={`flex-1 py-1 text-[11px] font-semibold rounded transition-colors ${
                    filterService === tab
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredList.map(item => {
              const isSelected = selectedBilling?.id === item.id;
              const isPaid = item.status === 'Lunas';
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBilling(item)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 ring-1 ring-blue-500 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {item.noKwitansi || item.noBilling}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isPaid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {item.namaPasien}
                  </h4>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{item.noRm} • {item.tipeLayanan}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-200">
                      Rp {item.totalTagihan.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Printable Preview (8 cols) */}
        <div className="lg:col-span-8">
          {selectedBilling ? (
          <>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-8 space-y-6 print:m-0 print:p-0 print:border-none print:shadow-none">
              
              {/* Header Letterhead (Kop Surat RS) */}
              <div className="flex items-center justify-between pb-6 border-b-2 border-slate-800 dark:border-slate-600">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                    +
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      RUMAH SAKIT UMUM MYITARU
                    </h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Jl. Kesehatan Utama No. 88, Jakarta Selatan • Telp: (021) 7890-1234 • Email: info@myitaru.rs.id
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Izin Operasional RS No: 445/1092/DINKES/2024 • NPWP: 01.234.567.8-012.000
                    </p>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block">
                    KWITANSI RESMI
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
                    {selectedBilling.noKwitansi || `DRAFT-${selectedBilling.noBilling}`}
                  </span>
                </div>
              </div>

              {/* Kwitansi Title for Mobile / Print */}
              <div className="text-center py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  BUKTI PEMBAYARAN BIAYA PELAYANAN MEDIS
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Metode Pembayaran: <strong>{selectedBilling.metodePembayaran}</strong>
                </span>
              </div>

              {/* Patient & Transaction Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. Rekam Medis:</span>
                    <strong className="font-mono">{selectedBilling.noRm}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nama Pasien:</span>
                    <strong className="font-bold text-slate-900 dark:text-white">{selectedBilling.namaPasien}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jenis Layanan:</span>
                    <strong>{selectedBilling.tipeLayanan} ({selectedBilling.poliRuangan})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dokter Pemeriksa:</span>
                    <strong>{selectedBilling.namaDokter}</strong>
                  </div>
                </div>

                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">No. Billing:</span>
                    <strong className="font-mono">{selectedBilling.noBilling}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Penjamin / Asuransi:</span>
                    <strong>{selectedBilling.namaPenjamin}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal Transaksi:</span>
                    <strong>{selectedBilling.waktuPembayaran || selectedBilling.tanggalMasuk}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Petugas Kasir:</span>
                    <strong>{selectedBilling.kasirNama || 'Siti Rahmawati, S.E.'}</strong>
                  </div>
                </div>
              </div>

              {/* Detailed Line Items Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 w-12 text-center">No</th>
                      <th className="p-3">Uraian / Deskripsi Layanan</th>
                      <th className="p-3 text-center">Volume</th>
                      <th className="p-3 text-right">Tarif (Rp)</th>
                      <th className="p-3 text-right">Jumlah (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {selectedBilling.items.map((item, index) => (
                      <tr key={item.id || index}>
                        <td className="p-3 text-center text-slate-400">{index + 1}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{item.deskripsi}</div>
                          <span className="text-[10px] text-slate-400">{item.kategori}</span>
                        </td>
                        <td className="p-3 text-center">{item.jumlah}</td>
                        <td className="p-3 text-right">{item.hargaSatuan.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-right font-medium">{item.total.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold text-xs border-t border-slate-200 dark:border-slate-700">
                    <tr>
                      <td colSpan={4} className="p-3 text-right text-slate-600 dark:text-slate-300">Subtotal:</td>
                      <td className="p-3 text-right">Rp {selectedBilling.subtotal.toLocaleString('id-ID')}</td>
                    </tr>
                    {selectedBilling.biayaAdministrasi > 0 && (
                      <tr>
                        <td colSpan={4} className="p-2 text-right text-slate-500 font-normal">Biaya Administrasi:</td>
                        <td className="p-2 text-right">Rp {selectedBilling.biayaAdministrasi.toLocaleString('id-ID')}</td>
                      </tr>
                    )}
                    {selectedBilling.uangMukaDeposit > 0 && (
                      <tr>
                        <td colSpan={4} className="p-2 text-right text-emerald-600 font-normal">Uang Muka / Deposit:</td>
                        <td className="p-2 text-right text-emerald-600">- Rp {selectedBilling.uangMukaDeposit.toLocaleString('id-ID')}</td>
                      </tr>
                    )}
                    {selectedBilling.diskonTotal > 0 && (
                      <tr>
                        <td colSpan={4} className="p-2 text-right text-rose-500 font-normal">Potongan Diskon:</td>
                        <td className="p-2 text-right text-rose-500">- Rp {selectedBilling.diskonTotal.toLocaleString('id-ID')}</td>
                      </tr>
                    )}
                    <tr className="border-t-2 border-slate-800 dark:border-slate-600 text-sm font-extrabold text-slate-900 dark:text-white">
                      <td colSpan={4} className="p-3 text-right">TOTAL DIBAYAR:</td>
                      <td className="p-3 text-right text-blue-600 dark:text-blue-400">
                        Rp {(selectedBilling.jumlahDibayar || selectedBilling.totalTagihan).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Signatures and QR Code */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-slate-300 dark:border-slate-600 shadow-xs">
                    <QrCode className="w-14 h-14 text-slate-800" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Validasi Dokumen Elektronik</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Doc Hash: {selectedBilling.id.slice(0, 16).toUpperCase()}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      ✓ Sah & Tercatat Resmi di Database SIMRS
                    </span>
                  </div>
                </div>

                <div className="text-center sm:text-right space-y-1">
                  <p>Jakarta Selatan, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Bagian Kasir & Keuangan RS</p>
                  <div className="h-10 flex items-center justify-center sm:justify-end text-[10px] text-slate-400 italic">
                    [Tanda Tangan Digital Tersertifikasi]
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white underline">
                    {selectedBilling.kasirNama || 'Siti Rahmawati, S.E.'}
                  </p>
                  <p className="text-[10px] text-slate-500">NIP: 19940822 202102 2 001</p>
                </div>
              </div>

            </div>

          {showPreview && selectedBilling && (
            <DocumentPreviewModal 
              isOpen={showPreview}
              onClose={() => setShowPreview(false)}
              customContent={(
                <div className="bg-white text-slate-900 border border-slate-200 rounded-xl p-8 relative shadow-sm mx-auto w-full">
                  <div className="flex justify-between items-start pb-6 border-b-2 border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase">Kwitansi Pembayaran</h2>
                        <p className="text-xs text-slate-500">RS MYITARU SEHAT UTAMA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-bold mb-1">NO. KWITANSI</p>
                      <p className="text-lg font-mono font-bold text-slate-900">
                        {selectedBilling.noKwitansi || `KW/${new Date().getFullYear()}/00${Math.floor(Math.random()*999)}`}
                      </p>
                    </div>
                  </div>
                  <div className="py-6 grid grid-cols-2 gap-8 text-xs">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Terima Dari:</span>
                        <strong className="text-slate-900">{selectedBilling.namaPasien}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">No. Rekam Medis:</span>
                        <strong className="font-mono text-slate-900">{selectedBilling.noRm}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Layanan:</span>
                        <strong className="text-slate-900">{selectedBilling.tipeLayanan}</strong>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">No. Tagihan:</span>
                        <strong className="font-mono text-slate-900">{selectedBilling.noBilling}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Penjamin:</span>
                        <strong className="text-slate-900">{selectedBilling.namaPenjamin}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tanggal:</span>
                        <strong className="text-slate-900">{selectedBilling.waktuPembayaran || selectedBilling.tanggalMasuk}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 w-12 text-center">No</th>
                          <th className="p-3">Uraian / Deskripsi Layanan</th>
                          <th className="p-3 text-center">Volume</th>
                          <th className="p-3 text-right">Tarif (Rp)</th>
                          <th className="p-3 text-right">Jumlah (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {selectedBilling.items.map((item, index) => (
                          <tr key={item.id || index}>
                            <td className="p-3 text-center text-slate-400">{index + 1}</td>
                            <td className="p-3">
                              <div className="font-semibold text-slate-900">{item.deskripsi}</div>
                              <span className="text-[10px] text-slate-400">{item.kategori}</span>
                            </td>
                            <td className="p-3 text-center">{item.jumlah}</td>
                            <td className="p-3 text-right">{item.hargaSatuan.toLocaleString('id-ID')}</td>
                            <td className="p-3 text-right font-medium">{item.total.toLocaleString('id-ID')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50 font-bold text-xs border-t border-slate-200">
                        <tr className="border-t-2 border-slate-800 text-sm font-extrabold text-slate-900">
                          <td colSpan={4} className="p-3 text-right">TOTAL DIBAYAR:</td>
                          <td className="p-3 text-right text-blue-600">
                            Rp {(selectedBilling.jumlahDibayar || selectedBilling.totalTagihan).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
              title={`Kwitansi_${selectedBilling?.noKwitansi || selectedBilling?.noBilling}`}
            />
          )}
          </>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">Pilih Kwitansi</h4>
              <p className="text-xs text-slate-400 mt-1">Pilih dari daftar transaksi di sebelah kiri untuk melihat kwitansi resmi.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
