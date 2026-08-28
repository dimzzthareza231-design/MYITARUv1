import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, TerminalSquare, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Modal } from '../../Modal';
import { BPJS_KEYS, initBPJSData } from '../bpjsData';
import toast from 'react-hot-toast';

export function LogVClaim() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [logList, setLogList] = useState<any[]>([]);

  useEffect(() => {
    initBPJSData();
    setLogList(JSON.parse(localStorage.getItem(BPJS_KEYS.LOG) || '[]'));
  }, []);

  const getStatusIcon = (status: number) => {
    if (status === 200) return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    if (status === 404 || status === 400) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (status: number) => {
    if (status === 200) return 'text-emerald-700 bg-emerald-100 border-emerald-200';
    if (status === 404 || status === 400) return 'text-amber-700 bg-amber-100 border-amber-200';
    return 'text-red-700 bg-red-100 border-red-200';
  };

  const filteredLogs = (logList || []).filter(log => {
    if (!log) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    if (!term) return true;

    const endpoint = String(log.endpoint || '').toLowerCase();
    const message = String(log.message || '').toLowerCase();
    const user = String(log.user || '').toLowerCase();

    return endpoint.includes(term) || message.includes(term) || user.includes(term);
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Log Integrasi V-Claim</h1>
          <p className="text-slate-500">Monitoring riwayat komunikasi dengan API BPJS Kesehatan</p>
        </div>
        <button onClick={() => {
            setLogList(JSON.parse(localStorage.getItem(BPJS_KEYS.LOG) || '[]'));
            toast.success('Log di-refresh');
          }} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan Endpoint, Message, atau User..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Semua Status HTTP</option>
            <option value="200">200 - OK</option>
            <option value="400">400 - Bad Request</option>
            <option value="500">500 - Server Error</option>
          </select>
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter Waktu
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Waktu Request</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Endpoint</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Metode</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status HTTP</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">User</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Latency</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 font-mono text-sm">
                  <td className="p-4 text-slate-600">{log.time}</td>
                  <td className="p-4 text-blue-600 truncate max-w-xs" title={log.endpoint}>{log.endpoint}</td>
                  <td className="p-4 text-slate-600 font-bold">{log.method}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-bold ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)}
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">{log.user}</td>
                  <td className="p-4 text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {log.responseTime}ms</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded transition-colors"
                      title="Lihat Detail Request/Response"
                    >
                      <TerminalSquare className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-sans">Belum ada log integrasi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title={`Detail Log API: ${selectedLog?.id}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block mb-1">Timestamp</span>
              <span className="font-bold font-mono">{selectedLog?.time}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-slate-500 block mb-1">Status Code</span>
              <span className={`font-bold font-mono ${selectedLog?.status === 200 ? 'text-emerald-600' : 'text-red-600'}`}>{selectedLog?.status}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Request Endpoint</h3>
            <div className="bg-slate-900 text-slate-300 p-3 rounded-lg font-mono text-xs overflow-x-auto">
              {selectedLog?.method} https://apijkn.bpjs-kesehatan.go.id/vclaim-rest{selectedLog?.endpoint}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Request Payload</h3>
            <div className="bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre">
              {JSON.stringify({ request: { t_sep: { noKartu: "0001234567891", tglSep: "2023-08-08" } } }, null, 2)}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Response JSON</h3>
            <div className="bg-slate-900 text-blue-400 p-3 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre">
              {JSON.stringify({ metaData: { code: selectedLog?.status, message: selectedLog?.message }, response: selectedLog?.status === 200 ? { sep: { noSep: "0001R01230823000001" } } : null }, null, 2)}
            </div>
          </div>

          {selectedLog?.status !== 200 && (
            <div className="pt-4 flex justify-end gap-2">
              <button onClick={() => toast.success('Mencoba ulang request...')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Retry Request
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
