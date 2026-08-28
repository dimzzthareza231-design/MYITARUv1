import React, { useState } from 'react';
import { FileDown, Printer } from 'lucide-react';
import { HospitalDocumentModel } from '../types/document';
import { generateHospitalDocument } from '../utils/documentGenerator';
import { DocumentPreviewModal } from './Documents/DocumentPreviewModal';

interface PrintButtonProps {
  title?: string;
  className?: string;
  targetId?: string;
  documentData?: any;
  docType?: any;
}

function PrintButton({ 
  title = 'Dokumen', 
  className = '', 
  targetId,
  documentData,
  docType = 'resume_medis'
}: PrintButtonProps) {
  const [showPreview, setShowPreview] = useState(false);

  const getDocumentModel = (): HospitalDocumentModel => {
    let sourceData = documentData || {};
    if (!documentData && targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        sourceData = {
          ...sourceData,
          deskripsi: el.innerText.substring(0, 500)
        };
      }
    }
    return generateHospitalDocument(sourceData, docType, title);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowPreview(true);
        }}
        className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-bold shadow-sm hover:shadow-md cursor-pointer ${className}`}
        title={`Buka Overview & Cetak PDF ${title}`}
      >
        <Printer className="w-4 h-4" />
        <span>Print PDF {title}</span>
      </button>

      {showPreview && (
        <DocumentPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          document={getDocumentModel()}
        />
      )}
    </>
  );
}

export default PrintButton;
