import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';
import { Download, FileText, Table, FileJson, Check, X, FileSpreadsheet, Printer, Eye } from 'lucide-react';
import { DocumentPreviewModal } from './Documents/DocumentPreviewModal';
import { generateHospitalDocument } from '../utils/documentGenerator';

interface Column {
  key: string;
  label: string;
}

interface ExportButtonProps {
  data: any[];
  filename: string;
  title: string;
  columns: Column[];
}

function ExportButton({ data, filename, title, columns }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState('pdf');
  const [orientation, setOrientation] = useState('portrait');
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeFooter, setIncludeFooter] = useState(true);
  const [watermark, setWatermark] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  
  const handleExport = () => {
    if (format === 'pdf') {
      handleExportPDF();
    } else if (format === 'csv') {
      handleExportCSV();
    } else if (format === 'excel') {
      handleExportExcel();
    } else if (format === 'json') {
      handleExportJSON();
    }
    setIsOpen(false);
  };
  
  const handleExportPDF = () => {
    const tableHeaders = columns.map(c => c.label);
    const tableRows = data.map((row, idx) => [
      String(idx + 1),
      ...columns.map(col => String(row[col.key] || '-'))
    ]);

    const doc = generateHospitalDocument({
      type: 'laporan-medis',
      title: title || 'Laporan Data SIMK',
      documentNumber: `EXP/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      department: 'Sistem Informasi Klinik',
      notes: watermark ? `Watermark: ${watermark}. Total ${data.length} baris data.` : `Total ${data.length} baris data diekspor.`,
      signatures: [
        { role: 'Petugas / Operator', name: 'Staf Administrasi SIMK' },
        { role: 'Kepala Bagian / DPJP', name: 'dr. Penanggung Jawab SIMK' }
      ],
      sections: [
        {
          title: `Data Export: ${title}`,
          type: 'table',
          tableData: {
            headers: ['No', ...tableHeaders],
            rows: tableRows
          }
        }
      ]
    });

    setPreviewDocument(doc);
    setShowPreviewModal(true);
    toast.success('Membuka pratinjau dokumen PDF...');
  };
  
  const handleExportCSV = () => {
    const headers = columns.map(c => c.label);
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col.key];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );
    
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `${filename}.csv`);
    
    toast.success('File CSV berhasil diexport');
  };
  
  const handleExportExcel = () => {
    let html = '<table border="1">';
    html += '<tr>' + columns.map(c => `<th style="background:#4F46E5;color:white;padding:8px;">${c.label}</th>`).join('') + '</tr>';
    data.forEach(row => {
      html += '<tr>' + columns.map(col => `<td style="padding:8px;">${row[col.key] || ''}</td>`).join('') + '</tr>';
    });
    html += '</table>';
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    downloadBlob(blob, `${filename}.xls`);
    
    toast.success('File Excel berhasil diexport');
  };
  
  const handleExportJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadBlob(blob, `${filename}.json`);
    
    toast.success('File JSON berhasil diexport');
  };
  
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const generatePrintHTML = () => {
    const now = new Date().toLocaleString('id-ID');
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page {
              size: A4 ${orientation};
              margin: 2cm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              color: #1e293b;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #4F46E5;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #4F46E5;
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
              color: #64748b;
              font-size: 14px;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 100px;
              color: rgba(79, 70, 229, 0.05);
              font-weight: bold;
              z-index: -1;
              pointer-events: none;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 12px;
            }
            th {
              background: #4F46E5;
              color: white;
              padding: 12px 10px;
              text-align: left;
              font-weight: bold;
            }
            td {
              padding: 10px;
              border-bottom: 1px solid #e2e8f0;
            }
            tr:nth-child(even) {
              background: #f8fafc;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
            }
            .stats {
              background: #f1f5f9;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          ${watermark ? `<div class="watermark">${watermark}</div>` : ''}
          
          ${includeHeader ? `
            <div class="header">
              <h1>${title}</h1>
              <p>Myitaru Hospital Management System</p>
              <p>Dicetak: ${now}</p>
            </div>
          ` : ''}
          
          <div class="stats">
            <strong>Total Data:</strong> ${data.length} records
          </div>
          
          <table>
            <thead>
              <tr>
                ${columns.map(col => `<th>${col.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${columns.map(col => `<td>${row[col.key] || '-'}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${includeFooter ? `
            <div class="footer">
              <p>Dokumen ini dicetak otomatis oleh sistem Myitaru Hospital Management System</p>
              <p>© ${new Date().getFullYear()} Myitaru. All rights reserved.</p>
            </div>
          ` : ''}
        </body>
      </html>
    `;
  };
  
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-bold shadow-sm"
      >
        <Download className="w-4 h-4" /> Export Data
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 text-white p-5 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Download className="w-5 h-5" /> Export Data
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white hover:bg-indigo-700 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Format Export</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'pdf', icon: <FileText className="w-6 h-6 mb-2" />, label: 'PDF Document' },
                    { id: 'excel', icon: <FileSpreadsheet className="w-6 h-6 mb-2" />, label: 'Excel (XLS)' },
                    { id: 'csv', icon: <Table className="w-6 h-6 mb-2" />, label: 'CSV Data' },
                    { id: 'json', icon: <FileJson className="w-6 h-6 mb-2" />, label: 'JSON Raw' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${
                        format === f.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {f.icon}
                      <div className="text-xs font-bold">{f.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {format === 'pdf' && (
                <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Orientasi Kertas</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setOrientation('portrait')}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-bold transition-colors ${
                          orientation === 'portrait' 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        📄 Portrait
                      </button>
                      <button
                        onClick={() => setOrientation('landscape')}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-bold transition-colors ${
                          orientation === 'landscape' 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        📃 Landscape
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${includeHeader ? 'bg-indigo-500 border-indigo-500' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'}`}>
                        {includeHeader && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={includeHeader} onChange={(e) => setIncludeHeader(e.target.checked)} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sertakan Header (Judul & Tanggal)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${includeFooter ? 'bg-indigo-500 border-indigo-500' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-indigo-400'}`}>
                        {includeFooter && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={includeFooter} onChange={(e) => setIncludeFooter(e.target.checked)} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sertakan Footer (Info Sistem)</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Watermark (Opsional)</label>
                    <input
                      type="text"
                      value={watermark}
                      onChange={(e) => setWatermark(e.target.value)}
                      placeholder="Contoh: RAHASIA, DRAFT"
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                    />
                  </div>
                </div>
              )}
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/30 rounded-lg p-3 text-sm text-indigo-800 dark:text-indigo-300 flex gap-2 items-start">
                <span className="text-lg leading-none">ℹ️</span>
                <span>Akan mengexport <strong>{data.length}</strong> baris data ke format <strong>{format.toUpperCase()}</strong>.</span>
              </div>
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/80 flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 font-bold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleExport}
                className="flex-[2] bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && previewDocument && (
        <DocumentPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          document={previewDocument}
        />
      )}
    </>
  );
}

export default ExportButton;
