import React, { useState, useEffect } from 'react';
import { initBPJSData } from '../bpjsData';

export function DashboardBPJS({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [stats, setStats] = useState({
    totalKlaim: 0,
    pending: 0,
    approved: 0,
    rate: 0
  });
  
  useEffect(() => {
    // Load stats dari localStorage
    initBPJSData();
    const raw = localStorage.getItem('simrs_bpjs_klaim') || localStorage.getItem('bpjs_klaim');
    const klaim: any[] = raw ? JSON.parse(raw) : [];
    setStats({
      totalKlaim: klaim.length,
      pending: klaim.filter((k: any) => ['Verifikasi Vedika', 'Dispute'].includes(k.status)).length,
      approved: klaim.filter((k: any) => ['Disetujui', 'Klaim Cair'].includes(k.status)).length,
      rate: klaim.length > 0 ? Number((klaim.filter((k: any) => ['Verifikasi Vedika', 'Dispute'].includes(k.status)).length / klaim.length * 100).toFixed(1)) : 0
    });
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Dashboard BPJS</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-gray-600 dark:text-slate-400">Total Klaim</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalKlaim}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-gray-600 dark:text-slate-400">Pending</div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-gray-600 dark:text-slate-400">Approved</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
          <div className="text-sm text-gray-600 dark:text-slate-400">Pending Rate</div>
          <div className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.rate}%</div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-6 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold mb-4 text-slate-900 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate?.('sep')}
            className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700"
          >
            🎫 Generate SEP
          </button>
          <button
            onClick={() => onNavigate?.('rujukan')}
            className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700"
          >
            📄 Cek Rujukan
          </button>
          <button
            onClick={() => onNavigate?.('klaim')}
            className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700"
          >
            💰 Submit Klaim
          </button>
          <button
            onClick={() => onNavigate?.('pengaturan')}
            className="bg-gray-600 text-white px-4 py-3 rounded hover:bg-gray-700"
          >
            ⚙️ Pengaturan V-Claim
          </button>
        </div>
      </div>
      
      {/* Alert Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold mb-4 text-slate-900 dark:text-white">Alerts</h3>
        <div className="space-y-2">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span>⚠️ 3 Rujukan akan kadaluarsa dalam 7 hari</span>
            <button
              onClick={() => onNavigate?.('rujukan')}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Lihat →
            </button>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span>🔴 Token V-Claim akan expired dalam 30 hari</span>
            <button
              onClick={() => onNavigate?.('pengaturan')}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Perbarui →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
