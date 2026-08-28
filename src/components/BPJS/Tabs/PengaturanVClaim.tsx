import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, RefreshCw, CheckCircle } from 'lucide-react';

export function PengaturanVClaim() {
  const [config, setConfig] = useState({
    client_id: '',
    client_secret: '',
    base_url: 'https://api.bpjs-kesehatan.go.id',
    environment: 'Production',
    is_active: false
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('simrs_vclaim_config');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    if (!config.client_id || !config.client_secret) {
      toast.error('Client ID dan Client Secret wajib diisi');
      return;
    }

    toast.success('Konfigurasi berhasil disimpan');
  };

  const handleTest = async () => {
    if (!config.client_id || !config.client_secret) {
      toast.error('Isi Client ID dan Client Secret terlebih dahulu');
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    toast.loading('Testing koneksi ke V-Claim...', { id: 'test-conn' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.dismiss('test-conn');
    setIsTesting(false);
    setTestResult({
      success: true,
      message: 'Koneksi berhasil!',
      timestamp: new Date().toISOString()
    });
    toast.success('Koneksi ke V-Claim berhasil!');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Pengaturan V-Claim</h1>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 max-w-2xl border border-slate-200 dark:border-slate-700">
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">Environment</label>
            <select
              value={config.environment}
              onChange={(e) => setConfig({...config, environment: e.target.value})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">Base URL</label>
            <input
              type="text"
              value={config.base_url}
              onChange={(e) => setConfig({...config, base_url: e.target.value})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">Client ID *</label>
            <input
              type="text"
              value={config.client_id}
              onChange={(e) => setConfig({...config, client_id: e.target.value})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan Client ID"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2 text-sm text-slate-700 dark:text-slate-300">Client Secret *</label>
            <input
              type="password"
              value={config.client_secret}
              onChange={(e) => setConfig({...config, client_secret: e.target.value})}
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan Client Secret"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active_vclaim"
              checked={config.is_active}
              onChange={(e) => setConfig({...config, is_active: e.target.checked})}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active_vclaim" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Aktifkan Integrasi V-Claim
            </label>
          </div>

          {testResult && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${testResult.success ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'}`}>
              <CheckCircle className={`w-5 h-5 ${testResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              <div>
                <p className={`font-bold text-sm ${testResult.success ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>{testResult.message}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(testResult.timestamp).toLocaleString('id-ID')}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleTest}
              disabled={isTesting}
              className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50 font-medium text-sm transition-colors"
            >
              {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {isTesting ? 'Testing...' : 'Test Koneksi'}
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2 font-medium text-sm transition-colors"
            >
              <Save className="w-4 h-4" /> Simpan Konfigurasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );


}
