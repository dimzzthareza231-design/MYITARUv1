import React, { useState } from 'react';
import { CreditCard, Download, Share2, ShieldCheck, User, Printer, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { DocumentPreviewModal } from '../../Documents/DocumentPreviewModal';
import { generateHospitalDocument } from '../../../utils/documentGenerator';

export function KISDigital() {
  const [peserta] = useState({
    nama: 'Budi Santoso',
    noKartu: '0001234567891',
    nik: '3201123456789001',
    faskes1: 'Klinik Sehat Utama',
    tglLahir: '15-08-1985',
    status: 'Aktif'
  });

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<any>(null);

  const handleDownload = () => {
    const doc = generateHospitalDocument({
      type: 'laporan-medis',
      title: 'KARTU INDONESIA SEHAT (KIS DIGITAL)',
      documentNumber: `KIS/${peserta.noKartu}`,
      date: new Date().toISOString().split('T')[0],
      department: 'BPJS Kesehatan - Fasilitas Kesehatan Tingkat Pertama',
      notes: 'Kartu Indonesia Sehat Digital resmi. Memiliki keabsahan yang sah untuk pelayanan medis faskes.',
      patient: {
        id: peserta.noKartu,
        name: peserta.nama,
        medicalRecordNumber: peserta.nik,
        birthDate: peserta.tglLahir,
        gender: 'Laki-laki',
        address: 'Wilayah Pelayanan Faskes Tk.1 ' + peserta.faskes1,
        phone: '0812-3456-7890'
      },
      signatures: [
        { role: 'Peserta JKN-KIS', name: peserta.nama },
        { role: 'Petugas Verifikator BPJS', name: 'Petugas BPJS Kesehatan' }
      ],
      sections: [
        {
          title: 'Informasi Kepesertaan JKN-KIS',
          type: 'key-value',
          data: [
            { label: 'Nomor Kartu BPJS / KIS', value: peserta.noKartu },
            { label: 'Nomor Induk Kependudukan (NIK)', value: peserta.nik },
            { label: 'Nama Lengkap Peserta', value: peserta.nama },
            { label: 'Tanggal Lahir', value: peserta.tglLahir },
            { label: 'Fasilitas Kesehatan Tingkat 1', value: peserta.faskes1 },
            { label: 'Status Kepesertaan', value: peserta.status.toUpperCase() },
            { label: 'Jenis Kepesertaan', value: 'PBI / Non-PBI Mandiri Terintegrasi' }
          ]
        }
      ]
    });

    setPreviewDoc(doc);
    setShowPreviewModal(true);
    toast.success('Membuka pratinjau dokumen KIS Digital...');
  };

  const handleShare = () => {
    toast.success('Tautan KIS Digital berhasil disalin');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">KIS Digital</h1>
          <p className="text-slate-500">Kartu Indonesia Sehat Digital Anda</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-teal-600 to-green-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-wider">KARTU INDONESIA SEHAT</h2>
            <p className="text-teal-100 text-sm">BPJS Kesehatan</p>
          </div>
          <div className="bg-white p-1 rounded">
            <ShieldCheck className="w-8 h-8 text-teal-600" />
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Nomor Kartu</p>
            <p className="text-2xl font-mono font-bold tracking-widest">{peserta.noKartu.replace(/(.{4})/g, '$1 ')}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Nama Peserta</p>
              <p className="font-bold">{peserta.nama}</p>
            </div>
            <div>
              <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Tgl Lahir</p>
              <p className="font-bold">{peserta.tglLahir}</p>
            </div>
            <div>
              <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Faskes Tk.1</p>
              <p className="font-medium text-sm truncate">{peserta.faskes1}</p>
            </div>
            <div>
              <p className="text-teal-100 text-xs uppercase tracking-wider mb-1">Status</p>
              <span className="inline-block px-2 py-1 bg-white text-teal-700 text-xs font-bold rounded-full">
                {peserta.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={handleDownload}
          className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Eye className="w-5 h-5 text-teal-600" />
          Pratinjau & Cetak PDF
        </button>
        <button 
          onClick={handleShare}
          className="flex-1 bg-teal-600 text-white px-4 py-3 rounded-xl hover:bg-teal-700 font-medium flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Bagikan
        </button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex gap-3">
        <User className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
        <div>
          <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">Informasi</h4>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
            KIS Digital memiliki fungsi yang sama dengan kartu fisik. Tunjukkan KIS Digital ini saat Anda berobat di fasilitas kesehatan.
          </p>
        </div>
      </div>

      {showPreviewModal && previewDoc && (
        <DocumentPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          document={previewDoc}
        />
      )}
    </div>
  );
}
