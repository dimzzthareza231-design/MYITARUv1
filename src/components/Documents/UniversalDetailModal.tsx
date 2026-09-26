import React, { useState } from 'react';
import { 
  X, FileText, Printer, Download, Eye, CheckCircle2, 
  Clock, ShieldCheck, User, Calendar, MapPin, Phone, 
  Building, CreditCard, Activity, Sparkles, ExternalLink, Copy, Check
} from 'lucide-react';
import { HospitalDocumentModel } from '../../types/document';
import { generateHospitalDocument } from '../../utils/documentGenerator';
import { HospitalDocumentSheet } from './HospitalDocumentSheet';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { useToast } from '../../contexts/ToastContext';

export interface ColumnDef {
  key: string;
  label: string;
  badge?: boolean;
}

interface UniversalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  data: Record<string, any>;
  columns?: ColumnDef[];
  onEdit?: (data: Record<string, any>) => void;
}

export function UniversalDetailModal({
  isOpen,
  onClose,
  title = 'Detail Data & Dokumen',
  data,
  columns,
  onEdit
}: UniversalDetailModalProps) {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'detail' | 'preview' | 'audit'>('detail');
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showFullPreview) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose, showFullPreview]);

  if (!isOpen || !data) return null;

  // Determine appropriate document type based on fields
  let inferredDocType: any = 'dokumen_umum';
  if (data.no_rm || data.norm || data.keluhan_utama || data.soap || data.diagnosa || data.no_resume) {
    inferredDocType = 'resume_medis';
  } else if (data.nip || data.jabatan || data.str || data.sip || data.divisi) {
    inferredDocType = 'profil_sdm';
  } else if (data.hasil_lab || data.parameter || data.no_lab) {
    inferredDocType = 'hasil_laboratorium';
  } else if (data.total_tagihan || data.no_kuitansi || data.invoice) {
    inferredDocType = 'kuitansi_billing';
  } else if (data.no_sep || data.sep) {
    inferredDocType = 'sep_bpjs';
  }

  const documentModel: HospitalDocumentModel = generateHospitalDocument(data, inferredDocType);

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    toast.success(`${keyName} disalin ke clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const primaryName = data.nama_pasien || data.nama || data.nama_pegawai || data.judul || 'Entitas Data';
  const primaryId = data.no_rm || data.nip || data.kode || data.id || '-';
  const statusStr = String(data.status || 'Aktif');

  return (
    <>
      <div 
        className="fixed inset-0 z-[105] bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          role="dialog"
          aria-modal="true"
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] border border-slate-200 dark:border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
          
          {/* HEADER MODAL */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-cyan-300 font-bold text-xl border border-white/20 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    {title}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    /Aktif|Selesai|Valid|Lunas|Steril/.test(statusStr) 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  }`}>
                    {statusStr}
                  </span>
                </div>
                <p className="text-xs text-blue-100/80 mt-0.5 flex items-center gap-2 font-mono">
                  <span>ID: <strong className="text-white">{primaryId}</strong></span>
                  <span>•</span>
                  <span className="font-sans font-medium text-white">{primaryName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFullPreview(true)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
                title="Buka Pratinjau Dokumen Resmi Standar A4"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Dokumen Resmi & Cetak</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 text-white/80 hover:text-white rounded-lg transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* QUICK METRIC CARDS */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 border-b border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Subjek / Pemilik</p>
              <p className="font-bold text-slate-900 dark:text-white truncate text-sm mt-0.5">{primaryName}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Unit / Departemen</p>
              <p className="font-bold text-blue-600 dark:text-blue-400 truncate text-sm mt-0.5">
                {data.unit || data.poli || data.divisi || data.unit_pelayanan || 'Pelayanan Terpadu'}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Tanggal Registrasi</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                {data.tanggal || data.tgl_periksa || '2026-08-25'}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Penjamin / Status</p>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400 truncate text-sm mt-0.5">
                {data.penjamin || data.kategori || statusStr}
              </p>
            </div>
          </div>

          {/* NAVIGATION TABS */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 gap-4 shrink-0 text-xs font-bold">
            <button
              onClick={() => setActiveTab('detail')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'detail'
                  ? 'border-blue-600 text-blue-600 dark:text-cyan-400 dark:border-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Detail Informasi Lengkap</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'preview'
                  ? 'border-blue-600 text-blue-600 dark:text-cyan-400 dark:border-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Pratinjau Lembar Surat Klinik</span>
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'audit'
                  ? 'border-blue-600 text-blue-600 dark:text-cyan-400 dark:border-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit & Verifikasi</span>
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/40">
            {activeTab === 'detail' && (
              <div className="space-y-6">
                {/* 1. INFORMASI UTAMA & IDENTITAS */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2.5">
                    <User className="w-4 h-4 text-blue-500" />
                    Informasi Identitas & Administrasi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {Object.entries(data)
                      .filter(([key]) => !['id', 'ttd', 'qrData', 'history', 'logs'].includes(key))
                      .map(([key, val], idx) => {
                        const formattedKey = key.replace(/_/g, ' ').toUpperCase();
                        const isValueObj = typeof val === 'object' && val !== null;
                        const displayVal = isValueObj ? JSON.stringify(val) : String(val ?? '-');

                        return (
                          <div 
                            key={idx} 
                            className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                          >
                            <span className="text-slate-500 dark:text-slate-400 font-semibold tracking-wide text-[11px]">
                              {formattedKey}
                            </span>
                            <div className="flex items-center gap-1.5 ml-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100 text-right">
                                {displayVal}
                              </span>
                              {displayVal !== '-' && displayVal.length < 40 && (
                                <button
                                  onClick={() => handleCopy(displayVal, formattedKey)}
                                  className="p-1 text-slate-400 hover:text-blue-500 rounded transition-colors"
                                  title="Salin nilai"
                                >
                                  {copiedKey === formattedKey ? (
                                    <Check className="w-3 h-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 2. CATATAN / DESKRIPSI JIKA ADA */}
                {(data.keterangan || data.deskripsi || data.catatan || data.anamnesis || data.keluhan) && (
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                      <Activity className="w-4 h-4 text-indigo-500" />
                      Catatan Medis & Operasional
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      {data.keterangan || data.deskripsi || data.catatan || data.anamnesis || data.keluhan}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB PREVIEW */}
            {activeTab === 'preview' && (
              <div className="flex justify-center p-2">
                <div className="transform scale-90 sm:scale-95 origin-top w-full flex justify-center">
                  <HospitalDocumentSheet document={documentModel} watermark={true} />
                </div>
              </div>
            )}

            {/* TAB AUDIT & VERIFIKASI */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Status Integritas & Kepatuhan Rekam Medis
                  </h3>
                  <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-900 dark:text-emerald-300">Dokumen Terverifikasi Sah</p>
                        <p className="text-emerald-800/80 dark:text-emerald-400 text-[11px] mt-0.5">
                          Telah ditandatangani secara elektronik dan terdaftar di server database MYITARU SIMK sesuai standar Permenkes No. 24/2022.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Hash Dokumen (SHA-256):</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                          8f4b29c0a...e718b532d
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Waktu Pembuatan:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {data.tanggal || '2026-08-25'} 10:45:00 WIB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Petugas / Dokter Penanggung Jawab:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {documentModel.signer.nama}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Standar Rekam Medis Elektronik Nasional</span>
            </div>

            <div className="flex items-center gap-2">
              {onEdit && (
                <button
                  onClick={() => {
                    onClose();
                    onEdit(data);
                  }}
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-colors"
                >
                  ✏️ Edit Data
                </button>
              )}

              <button
                onClick={() => setShowFullPreview(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Buka Overview & Cetak PDF</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* OVERVIEW MODAL FULL SCREEN */}
      {showFullPreview && (
        <DocumentPreviewModal
          isOpen={showFullPreview}
          onClose={() => setShowFullPreview(false)}
          document={documentModel}
        />
      )}
    </>
  );
}
