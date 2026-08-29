import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileImage, Eye, Upload, Database, Settings, CheckCircle2,
  RefreshCw, Layers, ZoomIn, ZoomOut, RotateCw, Contrast,
  Sun, Maximize2, ShieldCheck, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

export function OrthancBridging() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || 'Kelola');

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = ['Kelola', 'DICOM Viewer', 'Upload Hasil', 'Archive', 'Pengaturan'];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700">
              ORTHANC PACS & DICOM SERVER
            </span>
            <span className="text-xs text-slate-400 font-mono">DICOM 3.0 / WADO-Klinik / OHIF Viewer</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>🩻</span> Bridging PACS Orthanc (Radiologi & DICOM)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Integrasi modalitas radiologi (X-Ray, CT-Scan, MRI, USG) dengan server PACS Orthanc dan web viewer DICOM medis beresolusi tinggi.
          </p>
        </div>
        <button
          onClick={() => toast.success('Server Orthanc PACS: Online & Port 8042 Terbuka (12ms)')}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-900/20 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Ping PACS Server
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'Kelola' && <KelolaOrthanc onNavigate={handleTabChange} />}
        {activeTab === 'DICOM Viewer' && <DicomViewerTab />}
        {activeTab === 'Upload Hasil' && <UploadDicomTab />}
        {activeTab === 'Archive' && <ArchiveTab />}
        {activeTab === 'Pengaturan' && <PengaturanOrthancTab />}
      </div>
    </div>
  );
}

function KelolaOrthanc({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const studies = [
    { id: 'STUDY-9901', patient: 'Budi Santoso (RM-00192)', modality: 'CR (Thorax AP)', date: '2026-08-27 09:30', instances: '2 Images', status: 'VERIFIED' },
    { id: 'STUDY-9902', patient: 'Siti Aminah (RM-00431)', modality: 'CT (Brain Non-Contrast)', date: '2026-08-27 10:15', instances: '184 Slices', status: 'VERIFIED' },
    { id: 'STUDY-9903', patient: 'Ahmad Fauzi (RM-00512)', modality: 'USG (Abdomen Upper/Lower)', date: '2026-08-27 10:45', instances: '12 Images', status: 'READING' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status Orthanc PACS</span>
          <div className="text-xl font-bold text-emerald-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> Online (v1.12.3)
          </div>
          <span className="text-xs text-slate-400 mt-1 block">AET: ORTHANC_SIMRS</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Studies Terarsip</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">24,580 <span className="text-xs font-normal text-slate-400">Studies</span></div>
          <span className="text-xs text-slate-400 mt-1 block">3.8 TB Storage Used</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Pemeriksaan Radiologi Hari Ini</span>
          <div className="text-2xl font-black text-violet-600 dark:text-violet-400">38 <span className="text-xs font-normal text-slate-400">Pasien</span></div>
          <span className="text-xs text-emerald-500 mt-1 block">Semua gambar tersinkronisasi</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">DICOM Web Viewer</span>
          <div className="text-2xl font-black text-emerald-500">OHIF / Cornerstone</div>
          <span className="text-xs text-slate-400 mt-1 block">Hardware Accelerated</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Daftar Hasil Citra Radiologi (DICOM Studies)</h3>
            <p className="text-xs text-slate-500">Akses langsung gambar radiologi pasien dari modalitas CT/X-Ray/USG.</p>
          </div>
          <button
            onClick={() => onNavigate('DICOM Viewer')}
            className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-violet-900/20"
          >
            <Eye className="w-3.5 h-3.5" />
            Buka Web DICOM Viewer
          </button>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Study ID</th>
                <th className="p-3">Nama Pasien & RM</th>
                <th className="p-3">Modalitas / Pemeriksaan</th>
                <th className="p-3">Waktu Akuisisi</th>
                <th className="p-3">Slices / Images</th>
                <th className="p-3 text-right">Aksi Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {studies.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-mono font-bold text-violet-600 dark:text-violet-400">{s.id}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{s.patient}</td>
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{s.modality}</td>
                  <td className="p-3 font-mono text-slate-400">{s.date}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{s.instances}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onNavigate('DICOM Viewer')}
                      className="px-2.5 py-1 bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 rounded font-bold hover:bg-violet-200 text-xs"
                    >
                      Buka Citra 🩻
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DicomViewerTab() {
  const [zoom, setZoom] = useState(100);
  const [windowLevel, setWindowLevel] = useState('Standard (Chest)');

  return (
    <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-violet-400 font-mono">DICOM VIEWER PRO</span>
          <span className="text-slate-500">|</span>
          <span className="font-semibold text-slate-300">Pasien: Budi Santoso (RM-00192) - Thorax AP</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs text-slate-400 w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
            <ZoomIn className="w-4 h-4" />
          </button>

          <button onClick={() => toast.success('Rotasi citra 90°')} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
            <RotateCw className="w-4 h-4" />
          </button>
          <button onClick={() => toast.success('Invert window color')} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
            <Contrast className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Screen Canvas Simulation */}
      <div className="bg-black rounded-xl border border-slate-800 h-96 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-4 left-4 text-[11px] font-mono text-emerald-400 space-y-0.5">
          <div>PATIENT: BUDI SANTOSO</div>
          <div>RM: 00192 / L / 52Y</div>
          <div>STUDY: CHEST AP ERECT</div>
          <div>KV: 120 | MAS: 3.2</div>
        </div>

        <div className="absolute top-4 right-4 text-[11px] font-mono text-emerald-400 text-right space-y-0.5">
          <div>Klinik MYITARU RADIOLOGY</div>
          <div>ORTHANC PACS SERVER</div>
          <div>FOV: 350mm</div>
          <div>WL: 40 / WW: 400</div>
        </div>

        {/* Visual Simulated Radiograph */}
        <div
          className="w-64 h-72 border border-slate-700/60 rounded-lg flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 shadow-2xl transition-transform"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <span className="text-4xl mb-2">🩻</span>
          <span className="text-xs font-mono font-bold text-slate-300">CHEST X-RAY (THORAX PA)</span>
          <span className="text-[10px] text-slate-400 mt-1">Cor & Pulmo dalam batas normal, sinus costophrenicus lancip.</span>
        </div>

        <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-mono">
          Series 1/1 (Instance 1)
        </div>
      </div>
    </div>
  );
}

function UploadDicomTab() {
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      toast.error('Pilih file DICOM (.dcm) terlebih dahulu');
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success(`File DICOM ${fileName} berhasil disimpan ke server Orthanc PACS!`);
      setFileName('');
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5 text-xs">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-violet-600" />
          Upload File DICOM (.dcm / .zip) ke Orthanc PACS
        </h3>
        <p className="text-slate-500">Kirim citra radiologi secara manual dari flashdisk atau workstation lokal.</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4">
        <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-center cursor-pointer hover:border-violet-500 transition-colors">
          <FileImage className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <span className="font-semibold text-slate-700 dark:text-slate-200 block text-xs">
            {fileName || 'Klik untuk memilih file DICOM (.dcm) atau arsip ZIP'}
          </span>
          <input
            type="file"
            className="hidden"
            id="dicomInput"
            accept=".dcm,.zip"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setFileName(e.target.files[0].name);
              }
            }}
          />
          <button
            type="button"
            onClick={() => document.getElementById('dicomInput')?.click()}
            className="mt-3 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg font-semibold"
          >
            Pilih File DICOM
          </button>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-md shadow-violet-900/20 flex items-center justify-center gap-2"
        >
          {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {isUploading ? 'Sedang Mengunggah DICOM...' : 'Upload ke Orthanc PACS'}
        </button>
      </form>
    </div>
  );
}

function ArchiveTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Arsip & Backup DICOM PACS</h3>
      <p className="text-slate-500">Katalogisasi seluruh citra radiologi dengan storage jangka panjang (10 tahun).</p>
    </div>
  );
}

function PengaturanOrthancTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-violet-600" />
        Konfigurasi Server Orthanc PACS
      </h3>
      <div>
        <label className="block font-semibold mb-1">Orthanc REST API URL</label>
        <input type="text" defaultValue="http://192.168.1.50:8042" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <div>
        <label className="block font-semibold mb-1">DICOM AET (Application Entity Title)</label>
        <input type="text" defaultValue="ORTHANC_SIMRS" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <div>
        <label className="block font-semibold mb-1">DICOM Port</label>
        <input type="text" defaultValue="4242" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <button
        onClick={() => toast.success('Konfigurasi Orthanc disimpan!')}
        className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold shadow-md shadow-violet-900/20"
      >
        Simpan Konfigurasi PACS
      </button>
    </div>
  );
}
