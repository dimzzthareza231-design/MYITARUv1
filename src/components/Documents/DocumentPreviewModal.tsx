import React, { useState, useRef } from 'react';
import { 
  X, Printer, Download, Eye, FileText, ZoomIn, ZoomOut, 
  Copy, Check, ShieldCheck, Share2, Sparkles, SlidersHorizontal, RefreshCw 
} from 'lucide-react';
import { HospitalDocumentModel } from '../../types/document';
import { HospitalDocumentSheet } from './HospitalDocumentSheet';
import { useToast } from '../../contexts/ToastContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: HospitalDocumentModel;
  customContent?: React.ReactNode;
  title?: string;
  onUpdateDocument?: (updated: HospitalDocumentModel) => void;
}

export function DocumentPreviewModal({
  isOpen,
  onClose,
  document: initialDoc,
  customContent,
  title,
  onUpdateDocument
}: DocumentPreviewModalProps) {
  const toast = useToast();
  const [doc, setDoc] = useState<HospitalDocumentModel | undefined>(initialDoc);
  const [zoom, setZoom] = useState<number>(100);
  const [showWatermark, setShowWatermark] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [tempNotes, setTempNotes] = useState<string>(initialDoc?.edukasiInstruksi || '');
  const printSheetRef = useRef<HTMLDivElement>(null);

  // Sync if prop changes
  React.useEffect(() => {
    setDoc(initialDoc);
    setTempNotes(initialDoc?.edukasiInstruksi || '');
  }, [initialDoc]);

  // Keyboard Escape listener
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. DIRECT NATIVE PRINT (Tajam 100% Vector browser print)
  const handleDirectPrint = () => {
    window.print();
  };

  // 2. HIGH QUALITY VECTOR / HIGH-DPI PDF EXPORT
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    toast.info('Menyiapkan file PDF resmi beresolusi tinggi...');
    
    try {
      const element = document.querySelector('.printable-hospital-doc') as HTMLElement;
      if (!element) {
        toast.error('Lembar dokumen tidak ditemukan');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2.5, // High-DPI for razor-sharp typography
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 850
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const safeFilename = doc ? `${doc?.judulDokumen.replace(/[^a-zA-Z0-9]/g, '_')}_${doc?.subject.no_rm || doc?.subject.nip || 'DOC'}_${doc?.subject.nama.replace(/[^a-zA-Z0-9]/g, '_')}.pdf` : `${title?.replace(/[^a-zA-Z0-9]/g, '_') || 'Dokumen_RS'}_${new Date().getTime()}.pdf`;
      pdf.save(safeFilename);
      toast.success('PDF Resmi berhasil diunduh!');
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast.error('Gagal membuat PDF. Gunakan tombol Cetak Langsung (Print).');
    } finally {
      setIsDownloading(false);
    }
  };

  // 3. COPY MEDICAL SUMMARY TEXT
  const handleCopyText = () => {
    if (!doc) {
      toast.error('Tidak ada teks medis terstruktur untuk disalin.');
      return;
    }
    const textSummary = `
=== ${doc?.hospitalInfo?.name || 'KLINIK SEHAT SEJAHTERA'} ===
${doc?.judulDokumen}
Nomor: ${doc?.nomorDokumen}
Tanggal: ${doc?.signer.tanggal || new Date().toLocaleDateString('id-ID')}

IDENTITAS:
- Nama: ${doc?.subject.nama}
- No. RM/NIP: ${doc?.subject.no_rm || doc?.subject.nip || '-'}
- Jenis Kelamin: ${doc?.subject.jenis_kelamin || '-'}
- Unit/Poli: ${doc?.subject.unit_pelayanan || doc?.subject.poli || '-'}

DIAGNOSIS:
${doc?.diagnosisUtama?.nama ? `Diagnosis Utama: ${doc?.diagnosisUtama.nama} (${doc?.diagnosisUtama.kode || '-'})` : '-'}

ANAMNESIS & PEMERIKSAAN:
${doc?.anamnesis || '-'}

INSTRUKSI & EDUKASI:
${doc?.edukasiInstruksi || '-'}

DPJP/Pejabat: ${doc?.signer.nama} (${doc?.signer.sip_nip || '-'})
    `.trim();

    navigator.clipboard.writeText(textSummary);
    setIsCopied(true);
    toast.success('Ringkasan teks dokumen berhasil disalin ke clipboard');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleApplyNotes = () => {
    const updated = {
      ...doc,
      edukasiInstruksi: tempNotes
    };
    setDoc(updated as HospitalDocumentModel);
    if (onUpdateDocument) onUpdateDocument(updated as HospitalDocumentModel);
    setIsEditingNotes(false);
    toast.success('Catatan edukasi berhasil diperbarui');
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Overview & Pratinjau Dokumen Resmi"
      className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-start overflow-hidden animate-in fade-in duration-200"
    >
      {/* TOP CONTROL BAR */}
      <header className="no-print w-full bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-sm sm:text-base tracking-wide flex items-center gap-2">
                Overview & Pratinjau Dokumen Resmi
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Standar Klinik A4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {doc?.judulDokumen} • {doc?.subject.nama} ({doc?.subject.no_rm || doc?.subject.nip || 'Pasien'})
            </p>
          </div>
        </div>

        {/* CONTROLS & ACTIONS */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* ZOOM CONTROLS */}
          <div className="hidden sm:flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5 text-xs text-slate-300">
            <button 
              onClick={() => setZoom(z => Math.max(z - 15, 60))}
              className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Perkecil"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono font-bold text-slate-200">{zoom}%</span>
            <button 
              onClick={() => setZoom(z => Math.min(z + 15, 140))}
              className="p-1.5 hover:text-white hover:bg-slate-700 rounded transition-colors"
              title="Perbesar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* EDIT NOTES QUICK TOGGLE */}
          <button
            onClick={() => setIsEditingNotes(!isEditingNotes)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isEditingNotes 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-750'
            }`}
            title="Sesuaikan Catatan Edukasi"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Edit Catatan</span>
          </button>

          {/* COPY TEXT */}
          <button
            onClick={handleCopyText}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Salin Teks Ringkasan"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isCopied ? 'Tersalin' : 'Salin Teks'}</span>
          </button>

          {/* DOWNLOAD PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30 disabled:opacity-50"
            title="Download Dokumen sebagai PDF Resmi"
          >
            {isDownloading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Unduh PDF</span>
          </button>

          {/* DIRECT PRINT BUTTON */}
          <button
            onClick={handleDirectPrint}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
            title="Cetak Langsung via Printer / Save as PDF Browser"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak (Print)</span>
          </button>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors ml-1"
            title="Tutup Pratinjau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* EDIT NOTES DRAWER (IF OPEN) */}
      {isEditingNotes && (
        <div className="no-print w-full bg-slate-900/95 border-b border-slate-800 p-4 z-20 shrink-0 animate-in slide-in-from-top duration-200">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Sesuaikan Instruksi & Edukasi Medis Sebelum Dicetak:
              </label>
              <textarea
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                rows={2}
                className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white outline-none focus:border-cyan-500"
                placeholder="Tuliskan petunjuk obat, pantangan makanan, atau jadwal kontrol..."
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={handleApplyNotes}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
              >
                Terapkan ke Dokumen
              </button>
              <button
                onClick={() => setIsEditingNotes(false)}
                className="px-3 py-2.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT CANVAS / PREVIEW AREA */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-auto p-4 sm:p-8 flex justify-center items-start custom-scrollbar">
        <div 
          ref={printSheetRef}
          style={{ 
            transform: `scale(${zoom / 100})`, 
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out'
          }}
          className="pb-16"
        >
          {customContent ? (
              <div className="printable-hospital-doc bg-white shadow-sm" style={{ width: '210mm', minHeight: '297mm', padding: '10mm', boxSizing: 'border-box' }}>
                {customContent}
              </div>
            ) : doc ? (
              <HospitalDocumentSheet document={doc} watermark={showWatermark} />
            ) : (
              <div className="printable-hospital-doc bg-white flex items-center justify-center text-slate-500" style={{ width: '210mm', minHeight: '297mm', padding: '10mm' }}>Tidak ada dokumen.</div>
            )}
        </div>
      </div>

      {/* FOOTER STATUS BAR */}
      <footer className="no-print w-full bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dokumen Terautentikasi Digital Klinik</span>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
            <input 
              type="checkbox" 
              checked={showWatermark} 
              onChange={e => setShowWatermark(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-blue-500 w-3 h-3" 
            />
            <span>Watermark Klinik</span>
          </label>
          <span className="hidden sm:inline">•</span>
          <span className="font-mono text-slate-500">A4 (210 × 297 mm)</span>
        </div>
      </footer>
    </div>
  );
}
