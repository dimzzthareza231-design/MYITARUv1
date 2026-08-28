import React, { useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { findModule, COLS } from '../data/moduleRegistry';
import SmartTable from './SmartTable';
import { useToast } from '../contexts/ToastContext';

function SpecialAction({ moduleId, activeTab }: { moduleId?: string, activeTab: string }) {
  const [result, setResult] = useState<any>(null);
  const [input, setInput] = useState('');
  const toast = useToast();
  
  if (moduleId === 'wa-gateway' && activeTab === 'Send Message') {
    return (
      <div className="p-5 bg-emerald-900/10 border border-emerald-900/30 rounded-xl mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input type="tel" placeholder="No. WhatsApp (08xxx)" value={input}
            onChange={(e) => setInput(e.target.value)}
            className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none" />
          <input type="text" placeholder="Isi pesan..." className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm focus:border-emerald-500 focus:outline-none" />
          <button onClick={() => toast.success(`✅ Pesan WA terkirim ke ${input || '08xxx'}!`)}
            className="bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm hover:bg-emerald-500 font-semibold shadow-lg shadow-emerald-900/20 transition-colors">
            📤 Kirim Sekarang
          </button>
        </div>
      </div>
    );
  }
  
  if (moduleId === 'veronisa' && activeTab === 'Cek Eligibilitas') {
    return (
      <div className="p-5 bg-amber-900/10 border border-amber-900/30 rounded-xl mb-4 flex flex-col gap-3">
        <div className="flex gap-3">
          <input type="text" placeholder="Masukkan No. Kartu BPJS / NIK" value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none" />
          <button onClick={() => {
            setResult({ nama: 'BUDI SANTOSO', status: 'AKTIF', kelas: '2', faskes: 'Klinik Myitaru' });
            toast.success('✅ Cek Eligibilitas Berhasil');
          }} className="bg-amber-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-amber-500 font-bold shadow-lg shadow-amber-900/20 transition-colors">
            🔍 Cek Sekarang
          </button>
        </div>
        {result && (
          <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl text-sm text-emerald-300 flex flex-wrap gap-x-6 gap-y-2 animate-in fade-in slide-in-from-top-2">
            <span className="flex items-center gap-2">✅ Peserta: <strong className="text-white">{result.nama}</strong></span>
            <span>Status: <strong className="text-emerald-400">{result.status}</strong></span>
            <span>Kelas: <strong className="text-white">{result.kelas}</strong></span>
            <span>Faskes: <strong className="text-white">{result.faskes}</strong></span>
          </div>
        )}
      </div>
    );
  }
  
  if (moduleId === 'vclaim' && activeTab === 'SEP') {
    return (
      <div className="p-5 bg-emerald-900/10 border border-emerald-900/30 rounded-xl mb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-slate-300">
          <strong className="text-emerald-400">VClaim Bridging Aktif.</strong> Anda dapat men-generate SEP untuk pasien rawat jalan/inap.
        </div>
        <button onClick={() => toast.success('✅ SEP berhasil digenerate via VClaim!\nNo. SEP: 0307R00108260001')}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-emerald-500 font-bold shadow-lg shadow-emerald-900/20 transition-colors">
          🎫 Generate SEP Baru
        </button>
      </div>
    );
  }
  
  if (moduleId === 'anjungan' && activeTab === 'Display') {
    return (
      <div className="p-5 bg-sky-900/10 border border-sky-900/30 rounded-xl mb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-slate-300">
          Buka jendela baru untuk menampilkan antrian pendaftaran ke monitor TV.
        </div>
        <button onClick={() => toast.success('📺 Membuka Display Anjungan (Fullscreen)...\nNomor A-001 → Poli Umum')}
          className="bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-sky-500 font-bold shadow-lg shadow-sky-900/20 transition-colors">
          📺 Buka Display Fullscreen
        </button>
      </div>
    );
  }
  
  if (moduleId === 'anjungan' && activeTab === 'Pemanggil') {
    return (
      <div className="p-5 bg-sky-900/10 border border-sky-900/30 rounded-xl mb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-slate-300">
          Gunakan fitur ini untuk memanggil nomor antrian pasien secara manual dengan suara.
        </div>
        <button onClick={() => toast.success('🔊 "Nomor antrian A-001, silakan menuju Poli Umum"')}
          className="bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-sky-500 font-bold shadow-lg shadow-sky-900/20 transition-colors">
          🔊 Panggil Nomor Berikutnya
        </button>
      </div>
    );
  }
  
  if (moduleId === 'api' && activeTab === 'Pengaturan API Key') {
    return (
      <div className="p-5 bg-indigo-900/10 border border-indigo-900/30 rounded-xl mb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-slate-300">
          Kelola API Key untuk aplikasi pihak ketiga (Mobile App Pasien, dll).
        </div>
        <button onClick={() => toast.success(`🔑 API Key baru berhasil digenerate:\n\nMYT-${Math.random().toString(36).substring(2, 14).toUpperCase()}\n\nSimpan key ini dengan aman!`)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm hover:bg-indigo-500 font-bold shadow-lg shadow-indigo-900/20 transition-colors">
          🔑 Generate API Key Baru
        </button>
      </div>
    );
  }
  
  if (moduleId === 'jkn-mobile' && activeTab === 'Dashboard Antrol BPJS') {
    return (
      <div className="p-5 bg-slate-900/30 border border-slate-700/50 rounded-xl mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: 'Total Antrean', v: 150, c: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }, 
            { l: 'Selesai Dilayani', v: 120, c: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { l: 'Sedang Berjalan', v: 25, c: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' }, 
            { l: 'Batal / No Show', v: 5, c: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' }
          ].map(s => (
            <div key={s.l} className={`rounded-xl p-4 text-center border ${s.bg}`}>
              <div className={`text-3xl font-black mb-1 ${s.c}`}>{s.v}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return null;
}

function getCustomActions(moduleId?: string, activeTab?: string) {
  if (activeTab === 'Rawat Jalan' || activeTab === 'Antrian' || activeTab === 'Penanganan IGD') {
    return (r: any, ctx: any) => (
      <div className="flex gap-1">
        <button
          onClick={() => {
            ctx.setData(ctx.data.map((d: any) => d.id === r.id ? { ...d, status: 'Dipanggil' } : d));
            ctx.toast.info(`🔊 Memanggil ${r.nama_pasien || r.nama || 'Pasien'}`);
          }}
          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
        >
          Panggil
        </button>
        <button
          onClick={() => {
            ctx.setData(ctx.data.map((d: any) => d.id === r.id ? { ...d, status: 'Diperiksa' } : d));
            ctx.toast.warning(`🩺 Memeriksa ${r.nama_pasien || r.nama || 'Pasien'}`);
          }}
          className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-semibold"
        >
          Periksa
        </button>
        <button
          onClick={() => {
            ctx.setData(ctx.data.map((d: any) => d.id === r.id ? { ...d, status: 'Selesai' } : d));
            ctx.toast.success(`✅ Pemeriksaan ${r.nama_pasien || r.nama || 'Pasien'} Selesai`);
          }}
          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
        >
          Selesai
        </button>
      </div>
    );
  }

  if (activeTab === 'Ketersediaan Bed' || activeTab === 'Kapasitas') {
    return (r: any, ctx: any) => r.status === 'Terisi' ? (
      <button
        onClick={() => {
          ctx.setData(ctx.data.map((d: any) => d.id === r.id ? { ...d, status: 'Kosong' } : d));
          ctx.toast.info(`🧹 Bed ${r.kode_bed || r.id} dikosongkan`);
        }}
        className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold"
      >
        Kosongkan
      </button>
    ) : (
      <button
        onClick={() => {
          ctx.setData(ctx.data.map((d: any) => d.id === r.id ? { ...d, status: 'Terisi' } : d));
          ctx.toast.success(`🛏️ Bed ${r.kode_bed || r.id} diisi`);
        }}
        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
      >
        Isi Bed
      </button>
    );
  }

  if (activeTab === 'Dispensing' || activeTab === 'Dispensing Ranap' || activeTab === 'Resep Ralan' || activeTab === 'Resep Ranap') {
    return (r: any, ctx: any) => (
      <button
        onClick={() => {
          ctx.setData(ctx.data.map((d: any) => d.id === r.id ? { ...d, status: 'Terdispensing' } : d));
          ctx.toast.success(`💊 Dispensing obat ${r.obat || r.nama || ''} berhasil`);
        }}
        className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold"
      >
        Dispensing
      </button>
    );
  }

  if (activeTab === 'Billing Ralan' || activeTab === 'Billing Ranap' || activeTab === 'Pembayaran' || activeTab === 'Kasir') {
    return (r: any, ctx: any) => (
      <button
        onClick={() => {
          ctx.setData(ctx.data.map((d: any) => d.id === r.id ? { ...d, status: 'Lunas' } : d));
          ctx.toast.success(`💰 Pembayaran ${r.nama_pasien || r.nama || 'Pasien'} Lunas! Pasien dapat pulang.`);
        }}
        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
      >
        Bayar & Pulang
      </button>
    );
  }

  return undefined;
}

export function GenericModuleContent() {
  const { activeTab } = useOutletContext<{ activeTab: string }>();
  const { moduleId } = useParams();

  const found = findModule(moduleId || '');
  const mod = found?.module || { label: moduleId, icon: '📦', submenus: [] };

  const activeConfig = mod.submenus.find((s: any) => (typeof s === 'string' ? s : s.label) === activeTab);
  const colsKey = (typeof activeConfig === 'object' && activeConfig.cols) ? activeConfig.cols : 'dokumen';
  const cols = COLS[colsKey] || COLS.dokumen;

  const sourceKey = (typeof activeConfig === 'object' && activeConfig && 'source' in activeConfig) ? (activeConfig as any).source : null;
  const storageKey = sourceKey || `${moduleId}_${activeTab}`.replace(/\s/g, '_');

  const customActions = getCustomActions(moduleId, activeTab);

  return (
    <div className="h-full flex flex-col p-6">
      <SpecialAction moduleId={moduleId} activeTab={activeTab} />
      <SmartTable
        storageKey={storageKey}
        columns={cols}
        title={`${mod.label} - ${activeTab}`}
        customActions={customActions}
      />
    </div>
  );
}
