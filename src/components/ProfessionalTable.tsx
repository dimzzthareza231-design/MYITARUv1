import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DocumentPreviewModal } from './Documents/DocumentPreviewModal';
import { generateHospitalDocument } from '../utils/documentGenerator';
import { Printer, Download, Eye, FileText } from 'lucide-react';

export interface Column<T> {
  key: Extract<keyof T, string> | string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => ReactNode;
}

interface ProfessionalTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  actions?: {
    icon: ReactNode;
    label: string;
    color?: string;
    onClick: () => void;
  }[];
  searchable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  title?: string;
}

export function ProfessionalTable<T extends { id?: string | number; [key: string]: any }>({
  columns,
  data,
  onRowClick,
  actions,
  searchable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  emptyMessage = "Tidak ada data",
  title = "Data"
}: ProfessionalTableProps<T>) {
  const { isReadOnly } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  
  let filteredData = data.filter(item => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = columns.some(col => {
        const value = item[col.key];
        return value && String(value).toLowerCase().includes(searchLower);
      });
      if (!matchSearch) return false;
    }
    
    for (const [key, value] of Object.entries(filters)) {
      if (value && item[key] !== value) return false;
    }
    
    return true;
  });
  
  if (sortConfig.key) {
    filteredData = [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key as keyof T];
      const bVal = b[sortConfig.key as keyof T];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
  
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = pagination 
    ? filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : filteredData;
  
  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(paginatedData.map(d => d.id as string | number).filter(Boolean));
    } else {
      setSelectedRows([]);
    }
  };
  
  const handleSelectRow = (id: string | number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };
  
  const handleExportCSV = () => {
    const headers = columns.map(c => c.label);
    const rows = filteredData.map(row => 
      columns.map(col => row[col.key] || '').join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data berhasil diexport ke CSV');
  };

  const handlePreviewPDF = () => {
    const tableHeaders = columns.map(c => c.label);
    const tableRows = filteredData.slice(0, 100).map((row, idx) => [
      String(idx + 1),
      ...columns.map(col => String(row[col.key] || '-'))
    ]);

    const doc = generateHospitalDocument({
      type: 'laporan-medis',
      title: `Laporan Data ${title}`,
      documentNumber: `REP/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      department: 'Sistem Informasi Klinik',
      notes: `Total ${filteredData.length} data tercatat dalam sistem. Menampilkan hingga 100 data teratas.`,
      signatures: [
        { role: 'Petugas / Operator', name: 'Staf Administrasi SIMK' },
        { role: 'Kepala Instalasi / Unit', name: 'dr. Penanggung Jawab, Sp.PK' }
      ],
      sections: [
        {
          title: `Tabel Rekapitulasi Data: ${title}`,
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
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePreviewPDF}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
              title="Lihat Pratinjau Dokumen & Cetak PDF"
            >
              <Printer className="w-4 h-4" />
              Pratinjau PDF
            </button>
            <button
              onClick={handleExportCSV}
              className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            {!isReadOnly && actions && actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`${action.color || 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors`}
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          {searchable && (
            <div className="flex-1 min-w-[200px] relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Cari data..."
                className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-200 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>
          )}
          
          {filterable && (
            <button
              onClick={() => setShowFilterModal(true)}
              className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
              {Object.keys(filters).length > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
          )}
          
          {selectedRows.length > 0 && (
            <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-medium border border-blue-200 dark:border-blue-800">
              {selectedRows.length} dipilih
              <button
                onClick={() => setSelectedRows([])}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 p-0.5 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            <tr>
              <th className="p-3 w-12 text-center">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {columns.map(col => (
                <th 
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`p-3 font-semibold ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && (
                      <span className="text-slate-400">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-12 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{emptyMessage}</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Reset pencarian
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const rowId = row.id ?? idx;
                const isSelected = selectedRows.includes(rowId);
                
                return (
                  <tr 
                    key={rowId}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`group transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    } ${
                      isSelected 
                        ? 'bg-blue-50/50 dark:bg-blue-900/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    {columns.map(col => (
                      <td key={col.key} className="p-3 text-slate-700 dark:text-slate-300">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Menampilkan <span className="font-medium text-slate-900 dark:text-slate-200">{((currentPage - 1) * pageSize) + 1}</span> - <span className="font-medium text-slate-900 dark:text-slate-200">{Math.min(currentPage * pageSize, filteredData.length)}</span> dari <span className="font-medium text-slate-900 dark:text-slate-200">{filteredData.length}</span> data
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors"
            >
              ««
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors"
            >
              «
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
              if (pageNum > totalPages || pageNum < 1) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 border rounded-lg transition-colors font-medium ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors"
            >
              »
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors"
            >
              »»
            </button>
          </div>
        </div>
      )}
      
      {showFilterModal && (
        <FilterModal
          columns={columns.filter(c => c.filterable)}
          filters={filters}
          data={data}
          onApply={(newFilters) => {
            setFilters(newFilters);
            setShowFilterModal(false);
            setCurrentPage(1);
          }}
          onClose={() => setShowFilterModal(false)}
        />
      )}

      {showPreviewModal && previewDocument && (
        <DocumentPreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          document={previewDocument}
        />
      )}
    </div>
  );
}

function FilterModal<T>({ 
  columns, 
  filters, 
  data, 
  onApply, 
  onClose 
}: {
  columns: Column<T>[];
  filters: Record<string, any>;
  data: T[];
  onApply: (f: Record<string, any>) => void;
  onClose: () => void;
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  
  const getOptions = (key: string) => {
    return Array.from(new Set(data.map(item => item[key as keyof T]).filter(Boolean)));
  };
  
  const handleClear = () => {
    setLocalFilters({});
  };
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Data
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {columns.map(col => (
            <div key={col.key}>
              <label className="block font-medium mb-1.5 text-sm text-slate-700 dark:text-slate-300">
                {col.label}
              </label>
              <select
                value={localFilters[col.key] || ''}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  [col.key]: e.target.value || undefined
                })}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-slate-200 outline-none transition-all"
              >
                <option value="">Semua</option>
                {getOptions(col.key).map(opt => (
                  <option key={String(opt)} value={String(opt)}>{String(opt)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 p-4 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 font-medium transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => onApply(localFilters)}
            className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Terapkan Filter
          </button>
        </div>
      </div>
    </div>
  );
}
