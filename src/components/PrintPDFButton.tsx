import React, { useState } from 'react';
import { FileDown, Eye, Printer, Loader2 } from 'lucide-react';
import { HospitalDocumentModel } from '../types/document';
import { generateHospitalDocument } from '../utils/documentGenerator';
import { DocumentPreviewModal } from './Documents/DocumentPreviewModal';

interface PrintPDFButtonProps {
  targetId?: string;
  filename?: string;
  label?: string;
  className?: string;
  documentData?: any;
  docType?: any;
  title?: string;
  iconOnly?: boolean;
  customContent?: React.ReactNode;
}

export default function PrintPDFButton({
  targetId,
  filename = 'dokumen',
  label = 'Print PDF',
  className = '',
  documentData,
  docType = 'resume_medis',
  title,
  iconOnly = false,
  customContent
}: PrintPDFButtonProps) {
  const [showPreview, setShowPreview] = useState(false);

  // Buat document model dari data yang diberikan atau extract dari targetId
  const getDocumentModel = (): HospitalDocumentModel => {
    let sourceData = documentData || {};
    
    // Jika tidak ada data spesifik tetapi ada targetId, coba ambil teks/data dari DOM
    if (!documentData && targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        sourceData = {
          ...sourceData,
          deskripsi: el.innerText.substring(0, 500)
        };
      }
    }

    if (filename && !sourceData.nama_pasien && !sourceData.nama) {
      sourceData.nama_pasien = filename.replace(/_/g, ' ').replace(/\.pdf$/i, '');
    }

    return generateHospitalDocument(sourceData, docType, title);
  };

  const handleOpenOverview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPreview(true);
  };

  return (
    <>
      <button
        onClick={handleOpenOverview}
        className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 font-bold shadow-sm hover:shadow-md cursor-pointer ${className}`}
        title="Buka Overview & Cetak PDF Resmi"
      >
        <Printer className="w-4 h-4" />
        {!iconOnly && <span>{label}</span>}
      </button>

      {showPreview && (
        <DocumentPreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        document={getDocumentModel()}
        customContent={customContent}
        title={title || label}
      />
      )}
    </>
  );
}
