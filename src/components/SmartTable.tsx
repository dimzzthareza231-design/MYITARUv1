import React, { useState } from 'react';
import { useStorage } from '../utils/storage';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmationModal } from './ConfirmationModal';
import { UniversalDetailModal } from './Documents/UniversalDetailModal';
import { DocumentPreviewModal } from './Documents/DocumentPreviewModal';
import { generateHospitalDocument } from '../utils/documentGenerator';
import { 
  Printer, 
  Eye, 
  Edit2, 
  Edit3, 
  Trash2, 
  Download, 
  Plus, 
  Search, 
  Save, 
  RotateCcw, 
  X, 
  Calendar, 
  Tag, 
  FileText, 
  CheckCircle2, 
  Hash,
  Activity,
  Layers
} from 'lucide-react';

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
  const { isReadOnly } = useAuth();
  const [data, setData] = useStorage<any[]>(storageKey, makeDummy(columns));
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<{ key: string | null, dir: 'asc' | 'desc' }>({ key: null, dir: 'asc' });
  const [modal, setModal] = useState<'add' | 'edit' | 'detail' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [deleteTargetId, setDeleteTargetId] = useState<number | string | null>(null);
  const [printPreviewRow, setPrintPreviewRow] = useState<any>(null);

  // Keyboard Escape listener for modal
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modal) setModal(null);
        if (deleteTargetId !== null) setDeleteTargetId(null);
        if (printPreviewRow) setPrintPreviewRow(null);
      }
    };
    if (modal || deleteTargetId !== null || printPreviewRow) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [modal, deleteTargetId, printPreviewRow]);

  let rows = data.filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()));
  if (sort.key) {
    const k = sort.key;
    rows = [...rows].sort((a, b) =>
      sort.dir === 'asc' ? String(a[k] ?? '').localeCompare(String(b[k] ?? ''))
                         : String(b[k] ?? '').localeCompare(String(a[k] ?? ''))
    );
  }

  const save = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (modal === 'add') {
      const newRow = { 
        ...form, 
        id: form.id || Date.now(), 
        tanggal: form.tanggal || new Date().toISOString().split('T')[0], 
        status: form.status || 'Aktif' 
      };
      setData([...data, newRow]);
      toast.success('Data baru berhasil ditambahkan');
    } else if (modal === 'edit') {
      setData(data.map(d => d.id === selected.id ? { ...selected, ...form } : d));
      toast.success('Perubahan data berhasil disimpan');
    }
    setModal(null); 
    setForm({});
  };

  const resetForm = () => {
    if (modal === 'edit' && selected) {
      setForm({ ...selected });
      toast.info('Formulir dikembalikan ke nilai awal');
    } else {
      setForm({});
      toast.info('Formulir dikosongkan');
    }
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-lg overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 justify-between items-center bg-slate-50/90 dark:bg-slate-800/80 sticky top-0 z-10 backdrop-blur-sm">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-base tracking-tight">{title}</span>
          <span className="text-cyan-700 dark:text-cyan-400 text-xs px-2.5 py-0.5 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/50 rounded-full font-mono font-bold">
            {rows.length} Record
          </span>
        </h3>
        <div className="flex gap-2 items-center flex-wrap">
          {extraActions}
          <div className="relative">
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="🔍 Cari data..."
              className="p-2 pl-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none w-44 sm:w-56 placeholder:text-slate-400 dark:placeholder:text-slate-500" 
            />
          </div>
          <button 
            onClick={exportCsv} 
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow-xs flex items-center gap-1.5 font-medium" 
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
          {!isReadOnly && (
            <button 
              onClick={() => { setForm({}); setModal('add'); }} 
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md shadow-cyan-950/30 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Data</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/90 sticky top-0 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
            <tr>
              {columns.map((c, cIdx) => (
                <th key={c.key || `th-${cIdx}`} onClick={() => setSort(s => ({ key: c.key, dir: s.key === c.key && s.dir === 'asc' ? 'desc' : 'asc' }))}
                  className="p-3.5 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer capitalize whitespace-nowrap hover:text-slate-900 dark:hover:text-white transition-colors select-none">
                  <div className="flex items-center gap-1">
                    <span>{c.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{sort.key === c.key ? (sort.dir === 'asc' ? '▲' : '▼') : '⇅'}</span>
                  </div>
                </th>
              ))}
              <th className="p-3.5 text-center text-xs font-bold text-slate-600 dark:text-slate-300">Aksi & Dokumen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">📭 Belum ada data pada modul ini</td></tr>
            ) : rows.map((r, rIdx) => (
              <tr key={r.id !== undefined && r.id !== null ? String(r.id) : `smart-row-${rIdx}-${r.no_rm || r.nama || r.nomor || ''}`} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                {columns.map((c, cIdx) => (
                  <td key={c.key || `col-${cIdx}`} className="p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {c.badge ? <Badge v={r[c.key]} /> : String(r[c.key] ?? '-')}
                  </td>
                ))}
                <td className="p-3.5">
                  <div className="flex gap-1.5 justify-center items-center opacity-85 group-hover:opacity-100 transition-opacity">
                    {customActions && customActions(r, { setData, data, toast })}
                    
                    {/* LIHAT DETAIL DOKUMEN & FORM LENGKAP */}
                    <button 
                      onClick={() => { setSelected(r); setModal('detail'); }} 
                      className="px-2.5 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors border border-blue-500/20 flex items-center gap-1 text-xs font-bold" 
                      title="Lihat Detail & Dokumen Lengkap"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Detail</span>
                    </button>

                    {/* CETAK / OVERVIEW DOKUMEN LANGSUNG */}
                    <button 
                      onClick={() => setPrintPreviewRow(r)} 
                      className="px-2.5 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors border border-emerald-500/20 flex items-center gap-1 text-xs font-bold" 
                      title="Overview & Cetak PDF Resmi"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span className="hidden lg:inline">Cetak</span>
                    </button>

                    {!isReadOnly && (
                      <>
                        {/* EDIT DATA DENGAN STYLE ELEGAN */}
                        <button 
                          onClick={() => { setSelected(r); setForm({ ...r }); setModal('edit'); }} 
                          className="px-2.5 py-1.5 bg-amber-500/10 text-amber-400 hover:bg-amber-600 hover:text-white rounded-lg transition-colors border border-amber-500/20 flex items-center gap-1 text-xs font-bold" 
                          title="Edit & Perbarui Data"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden md:inline">Edit</span>
                        </button>

                        {/* HAPUS DATA */}
                        <button 
                          onClick={() => del(r.id !== undefined && r.id !== null ? r.id : rIdx)} 
                          className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white rounded-lg transition-colors border border-rose-500/20" 
                          title="Hapus Data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM TAMBAH / EDIT YANG DIPERCANTIK SECARA MAKSIMAL */}
      {modal && modal !== 'detail' && (
        <div 
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-[100] p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setModal(null)}
        >
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="smarttable-modal-title"
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            {/* MODAL HEADER */}
            <div className={`p-5 flex justify-between items-center border-b ${
              modal === 'edit' 
                ? 'border-amber-200 dark:border-amber-500/20 bg-amber-50/60 dark:bg-gradient-to-r dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900' 
                : 'border-cyan-200 dark:border-cyan-500/20 bg-cyan-50/60 dark:bg-gradient-to-r dark:from-cyan-950/30 dark:via-slate-900 dark:to-slate-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  modal === 'edit' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                }`}>
                  {modal === 'edit' ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 id="smarttable-modal-title" className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                      {modal === 'edit' ? 'Edit Data Record' : 'Tambah Data Baru'}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      modal === 'edit' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30' : 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30'
                    }`}>
                      {modal === 'edit' ? 'Mode Edit' : 'Input Baru'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>Modul: <strong className="text-slate-700 dark:text-slate-200">{title}</strong></span>
                    {modal === 'edit' && selected?.id && (
                      <>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400">ID: #{selected.id}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setModal(null)} 
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={save} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {columns.map((c, cIdx) => {
                    const keyLower = c.key.toLowerCase();
                    const labelLower = c.label.toLowerCase();
                    const isStatus = /status|kondisi|tahap|prioritas/.test(keyLower) || c.badge;
                    const isDate = /tanggal|tgl|date|waktu/.test(keyLower);
                    const isLongText = /catatan|keterangan|deskripsi|diagnosa|alamat|indikasi|ringkasan|notes|hasil/.test(keyLower);
                    const isNumeric = /harga|tarif|jumlah|biaya|stok|qty|nominal|umur|kuota|total/.test(keyLower);
                    const isCode = /no_|kode|nik|rm|rekam|id_/.test(keyLower);

                    if (isLongText) {
                      return (
                        <div key={c.key || `form-${cIdx}`} className="col-span-1 sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                            <span>{c.label}</span>
                          </label>
                          <textarea 
                            rows={3}
                            value={form[c.key] || ''} 
                            onChange={e => setForm({ ...form, [c.key]: e.target.value })}
                            placeholder={`Masukkan ${c.label}...`}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                          />
                        </div>
                      );
                    }

                    if (isStatus) {
                      const currentVal = form[c.key] || (modal === 'add' ? 'Aktif' : '');
                      return (
                        <div key={c.key || `form-${cIdx}`}>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                            <span>{c.label}</span>
                          </label>
                          <select
                            value={currentVal}
                            onChange={e => setForm({ ...form, [c.key]: e.target.value })}
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-xs sm:text-sm"
                          >
                            <option value="Aktif">🟢 Aktif</option>
                            <option value="Selesai">🔵 Selesai</option>
                            <option value="Proses">🟡 Dalam Proses</option>
                            <option value="Pending">🟠 Pending / Menunggu</option>
                            <option value="Tervalidasi">✅ Tervalidasi</option>
                            <option value="Steril">✨ Steril</option>
                            <option value="Lunas">💳 Lunas</option>
                            <option value="Nonaktif">⚪ Nonaktif</option>
                            <option value="Batal">🔴 Batal</option>
                            {currentVal && !['Aktif','Selesai','Proses','Pending','Tervalidasi','Steril','Lunas','Nonaktif','Batal'].includes(currentVal) && (
                              <option value={currentVal}>{currentVal}</option>
                            )}
                          </select>
                        </div>
                      );
                    }

                    return (
                      <div key={c.key || `form-${cIdx}`} className={columns.length === 1 ? 'col-span-1 sm:col-span-2' : ''}>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          {isDate ? (
                            <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          ) : isCode ? (
                            <Hash className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          ) : (
                            <Tag className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                          )}
                          <span>{c.label}</span>
                        </label>
                        <input 
                          type={isDate ? 'date' : isNumeric ? 'number' : 'text'}
                          value={form[c.key] || ''} 
                          onChange={e => setForm({ ...form, [c.key]: e.target.value })}
                          placeholder={`Masukkan ${c.label}`}
                          className={`w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all text-xs sm:text-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
                            isCode ? 'font-mono' : ''
                          }`} 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="border-t border-slate-200 dark:border-slate-700/80 p-4 bg-slate-50/95 dark:bg-slate-900/95 flex flex-wrap items-center justify-between gap-3">
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-semibold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Nilai</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button 
                    type="button" 
                    onClick={() => setModal(null)} 
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className={`px-5 py-2 text-white rounded-xl font-bold shadow-lg transition-all text-xs flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] ${
                      modal === 'edit'
                        ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 shadow-amber-950/30'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-950/30'
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{modal === 'edit' ? 'Simpan Perubahan' : 'Tambahkan Data'}</span>
                  </button>
                </div>
              </div>
            </form>
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
            setForm({ ...row });
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
