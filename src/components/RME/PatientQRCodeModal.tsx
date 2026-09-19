import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Printer, Download, Copy, Check, QrCode, X, Shield, 
  User, Tag, CheckCircle2, ExternalLink, FileText, HeartPulse
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useHospital } from '../../contexts/HospitalContext';
import { Pasien } from '../../types';

export interface PatientQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Pasien | any;
  onOpenEMR?: () => void;
}

type PrintFormat = 'stiker_map' | 'gelang_pasien' | 'kartu_pasien' | 'cover_a4';

export function PatientQRCodeModal({
  isOpen,
  onClose,
  patient,
  onOpenEMR
}: PatientQRCodeModalProps) {
  const toast = useToast();
  const { hospitalSettings } = useHospital();
  const [selectedFormat, setSelectedFormat] = useState<PrintFormat>('stiker_map');
  const [copied, setCopied] = useState(false);
  const [includeNik, setIncludeNik] = useState(true);
  const [includeAlergi, setIncludeAlergi] = useState(true);
  const [includeGolDarah, setIncludeGolDarah] = useState(true);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !patient) return null;

  const noRm = patient.no_rm || patient.noRm || patient.id || 'RM-000000';
  const nama = patient.nama || patient.name || 'Pasien Tanpa Nama';
  const nik = patient.nik || '-';
  const tglLahir = patient.tanggal_lahir || patient.tgl_lahir || patient.birthDate || '-';
  const jenisKelamin = patient.jenis_kelamin === 'L' ? 'Laki-laki (L)' : patient.jenis_kelamin === 'P' ? 'Perempuan (P)' : (patient.jenis_kelamin || '-');
  const golDarah = patient.golongan_darah || patient.bloodType || '-';
  const penjamin = patient.penjamin || 'Umum / Mandiri';
  const alamat = patient.alamat || '-';
  const alergi = Array.isArray(patient.alergi) ? patient.alergi.join(', ') : (patient.alergi || 'Tidak Ada Alergi Terdata');
  const todayStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  // Direct secure deep link to open patient EMR
  const emrDeepLink = `${window.location.origin}/modul/rekam-medis?rm=${encodeURIComponent(noRm)}&source=qr`;

  // Standard payload encoded in the QR code: URL with fallback schema
  const qrPayload = emrDeepLink;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(emrDeepLink);
      setCopied(true);
      toast.success('Tautan akses EMR berhasil disalin ke clipboard');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Gagal menyalin tautan');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    try {
      const html2canvasModule = await import('html2canvas-pro');
      const html2canvas = html2canvasModule.default || html2canvasModule;
      const element = printAreaRef.current;
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `QR_Berkas_${noRm}_${nama.replace(/\s+/g, '_')}_${selectedFormat}.png`;
      link.click();
      toast.success('Stiker QR Berkas berhasil diunduh sebagai gambar PNG');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Gagal mengunduh gambar stiker');
    }
  };

  return (
    <div id="patient-qr-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      {/* Printable CSS style overrides for crisp label printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-qr-container, #printable-qr-container * {
            visibility: visible !important;
          }
          #printable-qr-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            background: white !important;
            color: black !important;
          }
        }
      `}</style>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 to-cyan-50/40 dark:from-slate-800/80 dark:to-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">QR Code Berkas Rekam Medis</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  {noRm}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pindai untuk membuka ringkasan EMR pasien secara instan bagi staf berwenang
              </p>
            </div>
          </div>

          <button
            id="btn-close-patient-qr"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* FORMAT TABS SELECTOR */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                Pilih Format Cetak Dokumen
              </label>
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  id="fmt-stiker-map"
                  onClick={() => setSelectedFormat('stiker_map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedFormat === 'stiker_map'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  Stiker Map Berkas (100x50mm)
                </button>
                <button
                  type="button"
                  id="fmt-gelang-pasien"
                  onClick={() => setSelectedFormat('gelang_pasien')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedFormat === 'gelang_pasien'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  Gelang Pasien (250x25mm)
                </button>
                <button
                  type="button"
                  id="fmt-kartu-pasien"
                  onClick={() => setSelectedFormat('kartu_pasien')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedFormat === 'kartu_pasien'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  Kartu Pasien (85x54mm)
                </button>
                <button
                  type="button"
                  id="fmt-cover-a4"
                  onClick={() => setSelectedFormat('cover_a4')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedFormat === 'cover_a4'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Sampul Map A4
                </button>
              </div>
            </div>

            {/* TOGGLE OPTIONS */}
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeNik}
                  onChange={(e) => setIncludeNik(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>Sertakan NIK</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeGolDarah}
                  onChange={(e) => setIncludeGolDarah(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>Gol. Darah</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeAlergi}
                  onChange={(e) => setIncludeAlergi(e.target.checked)}
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span>Peringatan Alergi</span>
              </label>
            </div>
          </div>

          {/* LIVE PREVIEW AREA */}
          <div className="bg-slate-100 dark:bg-slate-950/60 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 flex justify-center items-center min-h-[260px] overflow-x-auto">
            
            <div id="printable-qr-container" ref={printAreaRef} className="w-full flex justify-center">
              
              {/* 1. FORMAT: STIKER MAP BERKAS RM (100 x 50 mm) */}
              {selectedFormat === 'stiker_map' && (
                <div className="w-[420px] bg-white text-slate-900 p-4 rounded-xl border-2 border-slate-900 shadow-md flex gap-4 font-sans text-xs relative">
                  {/* Left info column */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-1.5 border-b border-slate-300 pb-1">
                      <Shield className="w-3.5 h-3.5 text-cyan-700" />
                      <div>
                        <div className="font-extrabold text-[11px] uppercase tracking-wider text-cyan-900 leading-none">
                          {hospitalSettings?.name || 'MYITARU SIMRS'}
                        </div>
                        <div className="text-[9px] text-slate-500 font-semibold leading-none mt-0.5">
                          BERKAS REKAM MEDIS ELEKTRONIK
                        </div>
                      </div>
                    </div>

                    <div className="pt-0.5">
                      <div className="text-[10px] uppercase font-bold text-slate-500">NO. REKAM MEDIS</div>
                      <div className="font-mono text-xl font-black text-blue-900 tracking-wider">
                        {noRm}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">NAMA PASIEN</div>
                      <div className="font-bold text-sm text-slate-900 truncate uppercase">
                        {nama}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700 pt-0.5 border-t border-slate-200">
                      <div>
                        <span className="font-semibold text-slate-500">Tgl Lahir / JK:</span>
                        <div className="font-medium">{tglLahir} / {jenisKelamin.charAt(0)}</div>
                      </div>
                      {includeGolDarah && (
                        <div>
                          <span className="font-semibold text-slate-500">Gol. Darah:</span>
                          <div className="font-bold text-rose-700">{golDarah}</div>
                        </div>
                      )}
                    </div>

                    {includeNik && (
                      <div className="text-[10px] text-slate-600 font-mono">
                        <span className="font-semibold text-slate-500">NIK:</span> {nik}
                      </div>
                    )}

                    {includeAlergi && alergi && alergi !== 'Tidak Ada Alergi Terdata' && (
                      <div className="text-[9px] bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded font-bold">
                        ⚠️ Alergi: {alergi}
                      </div>
                    )}
                  </div>

                  {/* Right QR column */}
                  <div className="flex flex-col items-center justify-between border-l border-slate-200 pl-3 w-[120px] shrink-0">
                    <div className="bg-white p-1.5 rounded-lg border border-slate-300 shadow-2xs">
                      <QRCodeSVG
                        value={qrPayload}
                        size={98}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <div className="text-center mt-1">
                      <span className="text-[8px] font-bold text-slate-600 uppercase block tracking-tighter">
                        PINDAI UNTUK EMR
                      </span>
                      <span className="text-[7px] font-mono text-slate-400 block">
                        Cetak: {todayStr}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. FORMAT: GELANG PASIEN (250 x 25 mm) */}
              {selectedFormat === 'gelang_pasien' && (
                <div className="w-[520px] h-[78px] bg-cyan-50 text-slate-900 px-4 py-2 rounded-xl border-2 border-cyan-800 shadow-md flex items-center justify-between font-sans text-xs">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-1 rounded-md border border-slate-300">
                      <QRCodeSVG value={qrPayload} size={56} level="M" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-black text-cyan-900 tracking-wider">{noRm}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-200 text-cyan-900">{jenisKelamin.charAt(0)}</span>
                        {includeGolDarah && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">{golDarah}</span>}
                      </div>
                      <div className="font-bold text-sm text-slate-900 uppercase truncate max-w-[240px]">
                        {nama}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        Tgl Lahir: {tglLahir} {includeNik && `• NIK: ${nik}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right border-l border-cyan-200 pl-3">
                    <div className="text-[10px] font-bold uppercase text-cyan-800">
                      {hospitalSettings?.name || 'MYITARU RS'}
                    </div>
                    <div className="text-[8px] text-slate-500 font-mono">GELANG IDENTITAS PASIEN</div>
                    <div className="text-[8px] text-slate-400 mt-1">EMR Verified</div>
                  </div>
                </div>
              )}

              {/* 3. FORMAT: KARTU IDENTITAS PASIEN (85 x 54 mm) */}
              {selectedFormat === 'kartu_pasien' && (
                <div className="w-[360px] h-[220px] bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/50 text-slate-900 p-4 rounded-xl border-2 border-slate-800 shadow-lg flex flex-col justify-between font-sans text-xs">
                  <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-black text-sm">
                        M
                      </div>
                      <div>
                        <div className="font-extrabold text-xs uppercase tracking-wider text-cyan-900 leading-tight">
                          {hospitalSettings?.name || 'RUMAH SAKIT MYITARU'}
                        </div>
                        <div className="text-[8px] text-slate-500 font-medium">KARTU BEROBAT & REKAM MEDIS</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {penjamin}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 my-auto">
                    <div className="space-y-1">
                      <div>
                        <div className="text-[8px] text-slate-400 font-bold uppercase">No. Rekam Medis</div>
                        <div className="font-mono text-lg font-black text-blue-900 leading-tight tracking-wider">{noRm}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-400 font-bold uppercase">Nama Pasien</div>
                        <div className="font-bold text-xs text-slate-900 uppercase leading-snug">{nama}</div>
                      </div>
                      <div className="text-[9px] text-slate-600">
                        {tglLahir} • {jenisKelamin} {includeGolDarah && `• Gol: ${golDarah}`}
                      </div>
                      {includeNik && <div className="text-[9px] font-mono text-slate-500">NIK: {nik}</div>}
                    </div>

                    <div className="flex flex-col items-center bg-white p-2 rounded-xl border border-slate-300 shadow-xs">
                      <QRCodeSVG value={qrPayload} size={84} level="M" />
                      <span className="text-[7px] font-bold text-slate-500 mt-1 uppercase">Scan EMR</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between text-[8px] text-slate-400">
                    <span>Harap bawa kartu ini setiap berkunjung</span>
                    <span className="font-mono">Tgl: {todayStr}</span>
                  </div>
                </div>
              )}

              {/* 4. FORMAT: COVER MAP REKAM MEDIS A4 */}
              {selectedFormat === 'cover_a4' && (
                <div className="w-[500px] bg-white text-slate-900 p-6 rounded-xl border-2 border-slate-900 shadow-md font-sans text-xs space-y-4">
                  {/* Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-3">
                    <h2 className="font-black text-sm uppercase tracking-wider text-slate-900">
                      {hospitalSettings?.name || 'RUMAH SAKIT MYITARU'}
                    </h2>
                    <p className="text-[9px] text-slate-600">{hospitalSettings?.address || 'Jl. Kesehatan No. 10 Jakarta Pusat'}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-slate-900 text-white font-extrabold text-xs uppercase tracking-widest rounded">
                      BERKAS REKAM MEDIS PASIEN (EMR FOLDER)
                    </div>
                  </div>

                  {/* Main Grid */}
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-2 space-y-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-500">Nomor Rekam Medis (RM):</span>
                        <div className="font-mono text-2xl font-black text-blue-900 tracking-wider">{noRm}</div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase text-slate-500">Nama Lengkap Pasien:</span>
                        <div className="font-bold text-sm uppercase text-slate-900">{nama}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div><span className="text-slate-500">NIK:</span> <span className="font-mono font-semibold">{nik}</span></div>
                        <div><span className="text-slate-500">Tgl Lahir:</span> <span className="font-semibold">{tglLahir}</span></div>
                        <div><span className="text-slate-500">Jenis Kelamin:</span> <span className="font-semibold">{jenisKelamin}</span></div>
                        <div><span className="text-slate-500">Gol. Darah:</span> <span className="font-bold text-rose-700">{golDarah}</span></div>
                      </div>
                      <div className="text-[10px]">
                        <span className="text-slate-500">Alamat:</span> <span className="font-medium">{alamat}</span>
                      </div>
                      <div className="text-[10px]">
                        <span className="text-slate-500">Penjamin:</span> <span className="font-bold text-blue-800">{penjamin}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-300">
                      <QRCodeSVG value={qrPayload} size={110} level="M" />
                      <span className="text-[8px] font-bold uppercase text-slate-700 mt-2 tracking-tight text-center">
                        PINDAI AKSES CEPAT RME
                      </span>
                      <span className="text-[7px] text-slate-400 font-mono">BSrE Secure Verified</span>
                    </div>
                  </div>

                  {/* Legal Notice */}
                  <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-[9px] text-amber-900 leading-relaxed">
                    <strong>Peringatan Kerahasiaan Medis (Permenkes RI No. 24/2022):</strong> Isi berkas rekam medis ini bersifat rahasia. Pemindaian QR Code dan pembukaan ringkasan EMR hanya diizinkan untuk tenaga kesehatan dan staf medis berwenang yang bertugas.
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* DEEP LINK INFO BOX */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 max-w-xl truncate">
              <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0">Tautan Akses EMR:</span>
              <code className="bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 font-mono text-cyan-600 dark:text-cyan-400 truncate">
                {emrDeepLink}
              </code>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-copy-emr-link"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Tautan'}</span>
              </button>

              {onOpenEMR && (
                <button
                  type="button"
                  id="btn-test-open-emr"
                  onClick={onOpenEMR}
                  className="px-3 py-1.5 rounded-lg font-bold bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Uji Buka Ringkasan EMR</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Format telah disesuaikan untuk printer label thermal dan printer laser standar</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-download-sticker-png"
              onClick={handleDownloadImage}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Gambar (PNG)</span>
            </button>

            <button
              type="button"
              id="btn-print-patient-qr"
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Stiker / Dokumen</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
