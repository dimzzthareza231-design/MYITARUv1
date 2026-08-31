import React from 'react';
import { RegistrationFormState } from './types';
import { Upload, FileText, X, CheckCircle, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function DokumenTab({ data, onChange }: Props) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB');
        return;
      }
      
      const newFile = {
        name: file.name,
        type: type,
        size: (file.size / 1024).toFixed(1) + ' KB',
        file: file
      };
      
      onChange('dokumenFiles', [...(data.dokumenFiles || []), newFile]);
      toast.success(`${type} berhasil diupload`);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...(data.dokumenFiles || [])];
    newFiles.splice(index, 1);
    onChange('dokumenFiles', newFiles);
  };

  const hasFile = (type: string) => {
    return (data.dokumenFiles || []).some(f => f.type === type);
  };

  const getFile = (type: string) => {
    return (data.dokumenFiles || []).find(f => f.type === type);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/80 dark:bg-slate-800/80 p-4 rounded-xl border border-blue-200 dark:border-slate-700">
        <h3 className="font-bold text-sm text-blue-900 dark:text-cyan-300 mb-2">Panduan Upload Dokumen</h3>
        <ul className="text-xs text-blue-800 dark:text-slate-300 list-disc list-inside space-y-1 font-medium">
          <li>KTP wajib diupload untuk semua pasien baru.</li>
          <li>Kartu BPJS/Asuransi wajib jika penjamin bukan Umum.</li>
          <li>Format file yang didukung: JPG, PNG, PDF.</li>
          <li>Ukuran maksimal per file: 2MB.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload KTP */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          {hasFile('KTP') ? (
            <div className="w-full flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div className="text-left">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">KTP Tersimpan</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{getFile('KTP')?.name} ({getFile('KTP')?.size})</div>
                </div>
              </div>
              <button type="button" onClick={() => removeFile((data.dokumenFiles || []).findIndex(f => f.type === 'KTP'))} className="p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-3" />
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">Upload KTP Pasien <span className="text-red-500">*</span></div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">Drag & drop atau klik untuk memilih file</p>
              <label className="bg-blue-600 dark:bg-cyan-600 text-white px-4 py-2 rounded-lg font-bold text-xs cursor-pointer hover:bg-blue-700 dark:hover:bg-cyan-500 transition-colors shadow-sm">
                Pilih File
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleFileUpload(e, 'KTP')} />
              </label>
            </>
          )}
        </div>

        {/* Upload Kartu Penjamin */}
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          {hasFile('Kartu Penjamin') ? (
            <div className="w-full flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div className="text-left">
                  <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Kartu Tersimpan</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{getFile('Kartu Penjamin')?.name} ({getFile('Kartu Penjamin')?.size})</div>
                </div>
              </div>
              <button type="button" onClick={() => removeFile((data.dokumenFiles || []).findIndex(f => f.type === 'Kartu Penjamin'))} className="p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <CreditCard className="w-10 h-10 text-slate-400 dark:text-slate-500 mb-3" />
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-1">Upload Kartu BPJS / Asuransi</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4">Opsional jika pasien umum</p>
              <label className="bg-blue-600 dark:bg-cyan-600 text-white px-4 py-2 rounded-lg font-bold text-xs cursor-pointer hover:bg-blue-700 dark:hover:bg-cyan-500 transition-colors shadow-sm">
                Pilih File
                <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleFileUpload(e, 'Kartu Penjamin')} />
              </label>
            </>
          )}
        </div>
        
        {/* Surat Rujukan / Lainnya */}
        <div className="md:col-span-2">
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-3">Dokumen Lainnya (Rujukan, Surat Kontrol, Hasil Lab)</h4>
          <div className="space-y-3">
            {(data.dokumenFiles || []).filter(f => f.type !== 'KTP' && f.type !== 'Kartu Penjamin').map((file, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-500 dark:text-cyan-400" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{file.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{file.size} - {file.type}</div>
                  </div>
                </div>
                <button type="button" onClick={() => removeFile((data.dokumenFiles || []).findIndex(f => f === file))} className="p-1 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer font-bold text-xs w-full transition-colors">
              <Upload className="w-4 h-4" /> Tambah Dokumen Lainnya
              <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleFileUpload(e, 'Dokumen Lain')} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

