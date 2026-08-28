import React, { useState } from 'react';
import { useStorage } from '../utils/storage';
import { useToast } from '../contexts/ToastContext';
import { ConfirmationModal } from './ConfirmationModal';
import { UniversalDetailModal } from './Documents/UniversalDetailModal';
import { DocumentPreviewModal } from './Documents/DocumentPreviewModal';
import { generateHospitalDocument } from '../utils/documentGenerator';
import { Printer, Eye, Edit2, Trash2, Download, Plus, Search } from 'lucide-react';

export interface ColumnDef {
  key: string;
  label: string;
  badge?: boolean;
}

interface SmartTableProps {
  storageKey: string;
  columns: ColumnDef[];
  title: string;
  extraActions?: React.ReactNode;
  customActions?: (row: any, ctx: { setData: React.Dispatch<React.SetStateAction<any[]>>, data: any[], toast: any }) => React.ReactNode;
}

export default function SmartTable({ storageKey, columns, title, extraActions, customActions }: SmartTableProps) {
  const toast = useToast();
  const [data, setData] = useStorage<any[]>(storageKey, makeDummy(columns));
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: string | null, dir: 'asc' | 'desc' }>({ key: null, dir: 'asc' });
  const [modal, setModal] = useState<'add' | 'edit' | 'detail' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [deleteTargetId, setDeleteTargetId] = useState<number | string | null>(null);
  const [printPreviewRow, setPrintPreviewRow] = useState<any>(null);

  let rows = data.filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
  if (sort.key) {
    const k = sort.key;
    rows = [...rows].sort((a, b) =>
      sort.dir === 'asc' ? String(a[k] ?? '').localeCompare(String(b[k] ?? ''))
                         : String(b[k] ?? '').localeCompare(String(a[k] ?? ''))
    );
  }

  const save = () => {
    if (modal === 'add') {
      setData([...data, { ...form, id: Date.now(), tanggal: '2026-08-25', status: form.status || 'Aktif' }]);
      toast.success('Data berhasil ditambahkan');
    } else if (modal === 'edit') {
      setData(data.map(d => d.id === selected.id ? { ...selected, ...form } : d));
      toast.success('Data berhasil diupdate');
    }
    setModal(null); setForm({});
  };

  const del = (id: number | string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      setData(data.filter(d => d.id !== deleteTargetId));
      toast.success('Data dihapus');
      setDeleteTargetId(null);
    }
  };

  const exportCsv = () => {
    const csv = [columns.map(c => c.label).join(','),
      ...rows.map(r => columns.map(c => `"${String(r[c.key] || '')}"`).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${storageKey}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Export CSV berhasil');
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex flex-wrap gap-2 justify-between items-center bg-slate-800/80 sticky top-0 z-10 backdrop-blur-sm">
        <h3 className="font-bold text-white flex items-center gap-2">
          <span>{title}</span>
          <span className="text-cyan-400 text-xs px-2 py-0.5 bg-cyan-950/60 border border-cyan-800/50 rounded-full font-mono">
            {rows.length} Data
          </span>
        </h3>
        <div className="flex gap-2 items-center flex-wrap">
          {extraActions}
          <div className="relative">
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="🔍 Cari data..."
              className="p-2 pl-3 rounded-lg bg-slate-900 border border-slate-600 text-white text-sm focus:border-cyan-500 outline-none w-44 sm:w-56" 
            />
          </div>
          <button 
            onClick={exportCsv} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-1.5 font-medium" 
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button 
            onClick={() => { setForm({}); setModal('add'); }} 
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-cyan-900/30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left">
          <thead className="bg-slate-700/80 sticky top-0 backdrop-blur-md z-10">
            <tr>
              {columns.map((c, cIdx) => (
                <th key={c.key || `th-${cIdx}`} onClick={() => setSort(s => ({ key: c.key, dir: s.key === c.key && s.dir === 'asc' ? 'desc' : 'asc' }))}
                  className="p-3 text-xs font-semibold text-slate-300 cursor-pointer capitalize whitespace-nowrap hover:text-white transition-colors">
                  {c.label} {sort.key === c.key ? (sort.dir === 'asc' ? '↑' : '↓') : '↕'}
                </th>
              ))}
              <th className="p-3 text-center text-xs font-semibold text-slate-300">Aksi & Dokumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="p-8 text-center text-slate-500 font-medium">📭 Belum ada data</td></tr>
            ) : rows.map((r, rIdx) => (
              <tr key={r.id !== undefined && r.id !== null ? String(r.id) : `smart-row-${rIdx}-${r.no_rm || r.nama || r.nomor || ''}`} className="hover:bg-slate-750/50 transition-colors group">
                {columns.map((c, cIdx) => (
                  <td key={c.key || `col-${cIdx}`} className="p-3 text-sm text-slate-300">
                    {c.badge ? <Badge v={r[c.key]} /> : String(r[c.key] ?? '-')}
                  </td>
                ))}
                <td className="p-3">
                  <div className="flex gap-1.5 justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                    {customActions && customActions(r, { setData, data, toast })}
                    
                    {/* LIHAT DETAIL DOKUMEN & FORM LENGKAP */}
                    <button 
                      onClick={() => { setSelected(r); setModal('detail'); }} 
                      className="p-1.5 bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border border-blue-500/30 flex items-center gap-1 text-xs font-bold" 
                      title="Lihat Detail & Dokumen Lengkap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Detail</span>
                    </button>

                    {/* CETAK / OVERVIEW DOKUMEN LANGSUNG */}
                    <button 
                      onClick={() => setPrintPreviewRow(r)} 
                      className="p-1.5 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors border border-emerald-500/30 flex items-center gap-1 text-xs font-bold" 
                      title="Overview & Cetak PDF Resmi"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">Cetak</span>
                    </button>

                    {/* EDIT DATA */}
                    <button 
                      onClick={() => { setSelected(r); setForm(r); setModal('edit'); }} 
                      className="p-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-white rounded-lg transition-colors border border-amber-500/30" 
                      title="Edit Data"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* HAPUS DATA */}
                    <button 
                      onClick={() => del(r.id !== undefined && r.id !== null ? r.id : rIdx)} 
                      className="p-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white rounded-lg transition-colors border border-rose-500/30" 
                      title="Hapus Data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM TAMBAH / EDIT */}
      {modal && modal !== 'detail' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-slate-800/90 p-5 flex justify-between items-center border-b border-slate-700 rounded-t-2xl">
              <h3 className="font-bold text-white text-lg">
                {modal === 'add' ? '+ Tambah Data Baru' : '✏️ Edit Data'}
              </h3>
              <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white bg-slate-700/50 p-1.5 rounded-lg transition-colors">✕</button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
              {columns.map((c, cIdx) => (
                <div key={c.key || `form-${cIdx}`}>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">{c.label}</label>
                  <input 
                    value={form[c.key] || ''} 
                    onChange={e => setForm({ ...form, [c.key]: e.target.value })}
                    placeholder={`Masukkan ${c.label}`}
                    className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all text-sm" 
                  />
                </div>
              ))}
            </div>
            <div className="border-t border-slate-700 p-4 bg-slate-800/80 rounded-b-2xl flex gap-3 justify-end">
              <button onClick={() => setModal(null)} className="px-5 py-2.5 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 font-medium transition-colors text-sm">Batal</button>
              <button onClick={save} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-900/30 transition-colors text-sm">💾 Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL DETAIL MODAL (KAYA, INFORMATIF, PROFESIONAL) */}
      {modal === 'detail' && selected && (
        <UniversalDetailModal
          isOpen={modal === 'detail'}
          onClose={() => setModal(null)}
          title={`Detail Data: ${title}`}
          data={selected}
          columns={columns}
          onEdit={(row) => {
            setForm(row);
            setModal('edit');
          }}
        />
      )}

      {/* DIRECT DOCUMENT OVERVIEW MODAL DARI ROW ACTION */}
      {printPreviewRow && (
        <DocumentPreviewModal
          isOpen={printPreviewRow !== null}
          onClose={() => setPrintPreviewRow(null)}
          document={generateHospitalDocument(printPreviewRow, 'resume_medis', `DOKUMEN RESMI: ${title.toUpperCase()}`)}
        />
      )}

      <ConfirmationModal
        isOpen={deleteTargetId !== null}
        title="Konfirmasi Hapus Data"
        message="Apakah Anda yakin ingin menghapus data ini dari sistem?"
        variant="danger"
        confirmLabel="Hapus Data"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}

function Badge({ v }: { v: any }) {
  const val = String(v ?? '');
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block whitespace-nowrap ${
      /Aktif|Selesai|Valid|Lunas|Steril|Tervalidasi|Dipanggil/.test(val) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
      /Proses|Pending|Antri|Diperiksa|Kuning/.test(val) ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    }`}>{val}</span>
  );
}

function makeDummy(columns: ColumnDef[]) {
  const names = ['Budi Santoso', 'Siti Aminah', 'Joko Anwar', 'Rina Melati', 'dr. Hendra Wijaya', 'Ns. Kartika Sari'];
  return names.map((n, i) => {
    const r: any = { id: i + 1 };
    columns.forEach(c => {
      if (c.key.includes('nama')) r[c.key] = n;
      else if (/no|kode|id/.test(c.key)) r[c.key] = `${c.key.substring(0, 3).toUpperCase()}-2608-${String(i + 1).padStart(2, '0')}`;
      else if (c.key.includes('status')) r[c.key] = i % 2 ? 'Proses' : 'Aktif';
      else if (c.key.includes('tanggal')) r[c.key] = '2026-08-25';
      else r[c.key] = `Data ${i + 1}`;
    });
    return r;
  });
}
