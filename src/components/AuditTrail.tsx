import React, { useState } from 'react';
import { 
  ClipboardList, Download, Printer, Trash2, Eye, Search, Filter, 
  Calendar, CheckCircle, AlertTriangle, ShieldCheck, Activity, X
} from 'lucide-react';
import { useAuditTrail } from '../contexts/AuditTrailContext';
import { useToast } from '../contexts/ToastContext';
import PrintPDFButton from './PrintPDFButton';

export function AuditTrail() {
  const { logs, deleteLog, clearAllLogs } = useAuditTrail();
  const toast = useToast();
  const [filter, setFilter] = useState({ action: '', module: '', search: '', dateFrom: '', dateTo: '' });
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Filter logs
  const filteredLogs = logs.filter(log => {
    if (filter.action && log.action !== filter.action) return false;
    if (filter.module && log.module !== filter.module) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      return (
        log.username?.toLowerCase().includes(searchLower) ||
        log.module?.toLowerCase().includes(searchLower) ||
        (log.new_value && JSON.stringify(log.new_value).toLowerCase().includes(searchLower)) ||
        (log.action && log.action.toLowerCase().includes(searchLower))
      );
    }
    if (filter.dateFrom && new Date(log.timestamp) < new Date(filter.dateFrom)) return false;
    if (filter.dateTo && new Date(log.timestamp) > new Date(filter.dateTo + 'T23:59:59')) return false;
    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error('Tidak ada data log untuk diekspor');
      return;
    }
    const headers = ['Timestamp', 'User', 'Action', 'Module', 'Entity', 'IP Address'];
    const rows = filteredLogs.map(log => [
      `"${log.timestamp}"`,
      `"${log.username}"`,
      `"${log.action}"`,
      `"${log.module}"`,
      `"${log.entity_type}#${log.entity_id}"`,
      `"${log.ip_address}"`
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_trail_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('Audit log berhasil diekspor ke CSV');
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (filteredLogs.length === 0) {
      toast.error('Tidak ada data log untuk dicetak');
      return;
    }
    const printContent = document.getElementById('audit-table')?.outerHTML;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    if (iframe.contentDocument) {
      iframe.contentDocument.write(`
        <html>
          <head>
            <title>Audit Trail Report - MYITARU SIMRS</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 24px; color: #1e293b; }
              h1 { color: #0f172a; margin-bottom: 4px; }
              p { color: #64748b; font-size: 13px; margin: 4px 0 16px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
              th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
              th { background: #f1f5f9; font-weight: bold; color: #334155; }
              tr:nth-child(even) { background: #f8fafc; }
            </style>
          </head>
          <body>
            <h1>Laporan Audit Trail Sistem SIMRS</h1>
            <p>Dicetak pada: ${new Date().toLocaleString('id-ID')} | Total Catatan: ${filteredLogs.length}</p>
            ${printContent}
          </body>
        </html>
      `);
      iframe.contentDocument.close();
    }

    setTimeout(() => {
      if (iframe.contentWindow) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      }
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 500);
  };

  const handleViewDetail = (log: any) => {
    setSelectedLog(log);
    setShowDetail(true);
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
      UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      DELETE: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
      VIEW: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      PRINT: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      EXPORT: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
      LOGIN: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
      LOGOUT: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
    };
    return colors[action] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Audit Trail & Log Aktivitas
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Rekaman jejak integritas keamanan dan seluruh transaksi operasional SIMRS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-600" /> Ekspor CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-rose-600" /> Cetak Laporan
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-3.5 py-2 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> Bersihkan Log
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Catatan Log</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{logs.length}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aktivitas Hari Ini</div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Operasi Perubahan (Update)</div>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {logs.filter(l => l.action === 'UPDATE').length}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-200 dark:border-slate-700">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Penghapusan Data (Delete)</div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {logs.filter(l => l.action === 'DELETE').length}
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter & Pencarian Audit
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Aksi</label>
            <select
              value={filter.action}
              onChange={e => setFilter({ ...filter, action: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Aksi</option>
              <option value="CREATE">CREATE (Tambah)</option>
              <option value="UPDATE">UPDATE (Edit)</option>
              <option value="DELETE">DELETE (Hapus)</option>
              <option value="VIEW">VIEW (Lihat)</option>
              <option value="PRINT">PRINT (Cetak)</option>
              <option value="EXPORT">EXPORT (Ekspor)</option>
              <option value="LOGIN">LOGIN</option>
              <option value="LOGOUT">LOGOUT</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Modul</label>
            <select
              value={filter.module}
              onChange={e => setFilter({ ...filter, module: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Modul</option>
              <option value="Pasien">Pendaftaran / Pasien</option>
              <option value="Rawat Jalan">Rawat Jalan (Poli)</option>
              <option value="Rawat Inap">Rawat Inap (Bangsal)</option>
              <option value="IGD">IGD / Emergency</option>
              <option value="BPJS">BPJS & VClaim</option>
              <option value="Billing">Kasir & Billing</option>
              <option value="Farmasi">Farmasi & Obat</option>
              <option value="Laboratorium">Laboratorium</option>
              <option value="Radiologi">Radiologi</option>
              <option value="Rekam Medis">Rekam Medis (RME)</option>
              <option value="Pengaturan">Pengaturan SIMRS</option>
              <option value="Auth">Keamanan & Login</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Cari Pengguna / Data</label>
            <div className="relative">
              <input
                type="text"
                value={filter.search}
                onChange={e => setFilter({ ...filter, search: e.target.value })}
                placeholder="Ketik nama / username..."
                className="w-full pl-8 pr-3 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Dari Tanggal</label>
            <input
              type="date"
              value={filter.dateFrom}
              onChange={e => setFilter({ ...filter, dateFrom: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">Sampai Tanggal</label>
            <input
              type="date"
              value={filter.dateTo}
              onChange={e => setFilter({ ...filter, dateTo: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Table Log */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto custom-scrollbar">
          <table id="audit-table" className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-3.5">Waktu</th>
                <th className="p-3.5">Pengguna</th>
                <th className="p-3.5">Aksi</th>
                <th className="p-3.5">Modul</th>
                <th className="p-3.5">Entitas Terkait</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5 text-center">Opsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm font-medium">Tidak ada rekaman log audit yang cocok dengan filter</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors">
                    <td className="p-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString('id-ID')}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-blue-600 dark:text-blue-400 font-bold text-[9px]">
                            {log.username?.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{log.username}</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">{log.module}</td>
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {log.entity_type}#{log.entity_id}
                    </td>
                    <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{log.ip_address}</td>
                    <td className="p-3.5 text-center">
                      <div className="flex gap-1.5 justify-center">
                        <button
                          onClick={() => handleViewDetail(log)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detail
                        </button>
                        <button
                          onClick={() => {
                            deleteLog(log.id);
                            toast.success('Log berhasil dihapus');
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition"
                          title="Hapus log ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedLog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <ClipboardList className="w-5 h-5" /> Detail Catatan Log Audit
              </h2>
              <button
                onClick={() => setShowDetail(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Timestamp</label>
                  <p className="text-xs font-mono text-slate-800 dark:text-slate-200">
                    {new Date(selectedLog.timestamp).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Pengguna</label>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{selectedLog.username}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Tipe Aksi</label>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getActionColor(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Modul Terkait</label>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{selectedLog.module}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Entitas ID</label>
                  <p className="text-xs font-mono text-slate-800 dark:text-slate-200">{selectedLog.entity_type}#{selectedLog.entity_id}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">Alamat IP</label>
                  <p className="text-xs font-mono text-slate-800 dark:text-slate-200">{selectedLog.ip_address}</p>
                </div>
              </div>

              {selectedLog.user_agent && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase block mb-1">User Agent & Browser</label>
                  <p className="text-[11px] font-mono text-slate-600 dark:text-slate-300 break-all">{selectedLog.user_agent}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedLog.old_value && (
                  <div>
                    <label className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1.5 block">
                      Nilai Sebelumnya (Old Value)
                    </label>
                    <pre className="p-3.5 bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-900/30 rounded-xl text-xs overflow-x-auto text-rose-800 dark:text-rose-300 font-mono custom-scrollbar max-h-48">
                      {JSON.stringify(selectedLog.old_value, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.new_value && (
                  <div>
                    <label className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1.5 block">
                      Nilai Baru (New Value)
                    </label>
                    <pre className="p-3.5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-xs overflow-x-auto text-emerald-800 dark:text-emerald-300 font-mono custom-scrollbar max-h-48">
                      {JSON.stringify(selectedLog.new_value, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 p-4 flex justify-end gap-2 bg-slate-50 dark:bg-slate-850">
              <button
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Hapus Semua Log Audit?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tindakan ini akan mengosongkan seluruh rekaman log aktivitas sistem. Pastikan Anda telah mengekspor cadangan sebelum melanjutkan.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  clearAllLogs();
                  setShowClearConfirm(false);
                  toast.success('Seluruh log audit berhasil dibersihkan');
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditTrail;
