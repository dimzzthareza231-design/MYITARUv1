import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { 
  Camera, Upload, Keyboard, X, QrCode, Shield, CheckCircle2, 
  AlertTriangle, User, RefreshCw, Sparkles, ArrowRight, ExternalLink
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useHospital } from '../../contexts/HospitalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAuditTrail } from '../../contexts/AuditTrailContext';
import { Pasien } from '../../types';

export interface PatientQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientSelected?: (patient: Pasien) => void;
}

type ScanMode = 'camera' | 'gun' | 'upload';

export function PatientQRScannerModal({
  isOpen,
  onClose,
  onPatientSelected
}: PatientQRScannerModalProps) {
  const toast = useToast();
  const { pasien } = useHospital();
  const { currentUser, hasAccess } = useAuth();
  const { logActivity } = useAuditTrail();

  const [scanMode, setScanMode] = useState<ScanMode>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [detectedPatient, setDetectedPatient] = useState<Pasien | null>(null);
  const [scannedRawValue, setScannedRawValue] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);

  // Play auditory feedback upon successful scan
  const playSuccessChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio context might not be available or allowed yet
    }
  };

  // Helper to extract No. RM from various QR payload formats
  const extractNoRm = (raw: string): string | null => {
    if (!raw) return null;
    const clean = raw.trim();

    // 1. Try URL parameters (e.g. ?rm=RM-2024-001 or ?no_rm=RM-2024-001)
    if (clean.includes('http://') || clean.includes('https://') || clean.includes('?')) {
      try {
        const urlObj = new URL(clean, window.location.origin);
        const rmParam = urlObj.searchParams.get('rm') || urlObj.searchParams.get('no_rm') || urlObj.searchParams.get('id');
        if (rmParam) return rmParam;
      } catch {
        // Continue to regex fallback
      }
    }

    // 2. Try JSON payload: {"no_rm":"RM-001"}
    if (clean.startsWith('{') && clean.endsWith('}')) {
      try {
        const parsed = JSON.parse(clean);
        if (parsed.no_rm || parsed.noRm || parsed.id) {
          return parsed.no_rm || parsed.noRm || parsed.id;
        }
      } catch {
        // Not JSON
      }
    }

    // 3. Try custom scheme MYITARU:RM:XXX
    if (clean.includes(':')) {
      const parts = clean.split(':');
      const lastPart = parts[parts.length - 1];
      if (lastPart) return lastPart;
    }

    // 4. Return plain string
    return clean;
  };

  // Process and match patient
  const handleScannedResult = (rawCode: string) => {
    setScannedRawValue(rawCode);
    const extractedRm = extractNoRm(rawCode);
    if (!extractedRm) {
      toast.error('Format QR Code tidak valid.');
      return;
    }

    // Check staff authorization
    const isAuthorized = !currentUser || hasAccess('rekam-medis');
    if (!isAuthorized) {
      toast.error('Akses Ditolak: Akun Anda tidak memiliki hak akses ke modul Rekam Medis.');
      return;
    }

    // Match patient from hospital master list
    const found = pasien.find((p: any) => {
      const pRm = (p.no_rm || p.noRm || p.id || '').toLowerCase();
      const pNik = (p.nik || '').toLowerCase();
      const pNama = (p.nama || p.name || '').toLowerCase();
      const searchTarget = extractedRm.toLowerCase();

      return pRm === searchTarget || 
             pRm.replace(/[^a-z0-9]/g, '') === searchTarget.replace(/[^a-z0-9]/g, '') ||
             pNik === searchTarget ||
             pNama === searchTarget;
    });

    if (found) {
      playSuccessChime();
      setDetectedPatient(found);
      toast.success(`QR Berkas Valid: ${found.nama} (${found.no_rm})`);
      
      // Log access in audit trail for compliance
      try {
        logActivity(
          currentUser?.nama || currentUser?.username || 'petugas',
          'SCAN_QR_BERKAS',
          'rekam-medis',
          'pasien',
          found.id || found.no_rm,
          null,
          { no_rm: found.no_rm, nama: found.nama }
        );
      } catch {
        // Context might not be initialized
      }
    } else {
      toast.error(`Pasien dengan Nomor RM "${extractedRm}" tidak ditemukan di database.`);
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setIsScanning(true);
    setDetectedPatient(null);

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        startScanLoop();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError' 
          ? 'Izin akses kamera ditolak. Silakan izinkan browser mengakses kamera Anda.' 
          : 'Kamera tidak dapat diakses atau sedang digunakan oleh aplikasi lain.'
      );
      setIsScanning(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Scanning loop using jsQR
  const startScanLoop = () => {
    const scan = () => {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            handleScannedResult(code.data);
            stopCamera();
            return;
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(scan);
    };

    animFrameIdRef.current = requestAnimationFrame(scan);
  };

  // Lifecycle
  useEffect(() => {
    if (isOpen && scanMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, scanMode, facingMode]);

  // Handle manual input autofocus
  useEffect(() => {
    if (scanMode === 'gun' && manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, [scanMode]);

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height);
          if (code && code.data) {
            handleScannedResult(code.data);
          } else {
            toast.error('Tidak ditemukan kode QR pada gambar yang diunggah.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleOpenEMR = () => {
    if (!detectedPatient) return;
    if (onPatientSelected) {
      onPatientSelected(detectedPatient);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="patient-qr-scanner-modal" className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pindai QR Berkas Rekam Medis</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  Verifikasi EMR
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Arahkan kamera ke stiker QR berkas atau gunakan scanner gun USB
              </p>
            </div>
          </div>

          <button
            id="btn-close-qr-scanner"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STAFF AUTHORIZATION BADGE */}
        <div className="px-6 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Petugas: <strong>{currentUser?.nama || currentUser?.username || 'Staf Medis'}</strong> ({currentUser?.roleId || 'DPJP / Ners'})</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Audit Permenkes 24/2022</span>
        </div>

        {/* MODE SELECTOR */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => { setScanMode('camera'); setDetectedPatient(null); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              scanMode === 'camera'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Kamera Langsung</span>
          </button>

          <button
            type="button"
            onClick={() => { setScanMode('gun'); setDetectedPatient(null); stopCamera(); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              scanMode === 'gun'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Scanner Gun / Ketik</span>
          </button>

          <button
            type="button"
            onClick={() => { setScanMode('upload'); setDetectedPatient(null); stopCamera(); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              scanMode === 'upload'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Foto QR</span>
          </button>
        </div>

        {/* SCANNER VIEWPORT */}
        <div className="p-6 space-y-4 overflow-y-auto">
          
          {/* CAMERA VIEW */}
          {scanMode === 'camera' && (
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center border-2 border-emerald-500/40 shadow-inner">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Viewfinder Reticle & Laser Scan Line */}
              {isScanning && !detectedPatient && !cameraError && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-56 h-56 border-2 border-emerald-400/80 rounded-2xl relative flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                    {/* Corners */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                    
                    {/* Laser line animation */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_12px_#34d399] animate-pulse" />
                  </div>
                  <div className="mt-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                    Arahkan ke QR Code Stiker Rekam Medis
                  </div>
                </div>
              )}

              {/* Toggle camera facing mode button */}
              <button
                type="button"
                onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700 shadow-md text-xs flex items-center gap-1.5 transition-all"
                title="Ganti Kamera Depan / Belakang"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px]">{facingMode === 'environment' ? 'Kamera Belakang' : 'Kamera Depan'}</span>
              </button>

              {/* Camera Error Message */}
              {cameraError && (
                <div className="absolute inset-0 bg-slate-900/90 p-6 flex flex-col items-center justify-center text-center text-white space-y-3">
                  <AlertTriangle className="w-10 h-10 text-amber-400" />
                  <p className="text-xs text-slate-300 max-w-xs">{cameraError}</p>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Coba Lagi
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SCANNER GUN / MANUAL MODE */}
          {scanMode === 'gun' && (
            <div className="space-y-4 py-4">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Input No. Rekam Medis / Barcode Scanner Gun
                </label>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (manualInput.trim()) {
                      handleScannedResult(manualInput.trim());
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    ref={manualInputRef}
                    type="text"
                    placeholder="Contoh: RM-2024-001 atau NIK..."
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Cari & Buka EMR
                  </button>
                </form>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  ⚡ <strong>Tips:</strong> Sambungkan scanner barcode 2D USB ke PC/Laptop Anda, arahkan ke stiker berkas, dan sistem akan otomatis memproses data saat tombol scanner ditekan.
                </p>
              </div>

              {/* Quick test patient chips */}
              {pasien && pasien.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                    Uji Coba Cepat (Pilih Pasien Terdaftar):
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                    {pasien.slice(0, 6).map((p: any) => (
                      <button
                        key={p.id || p.no_rm}
                        type="button"
                        onClick={() => {
                          setManualInput(p.no_rm);
                          handleScannedResult(p.no_rm);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                      >
                        <span className="font-mono font-bold text-emerald-600">{p.no_rm}</span>
                        <span className="truncate max-w-[120px]">{p.nama}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* UPLOAD MODE */}
          {scanMode === 'upload' && (
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center space-y-4 hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Pilih File Foto atau Tangkapan Layar QR</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Format PNG, JPG, atau WEBP berkas rekam medis</p>
              </div>
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-md">
                  <Upload className="w-4 h-4" />
                  <span>Jelajahi Berkas...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* DETECTED PATIENT CARD */}
          {detectedPatient && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 p-4 rounded-2xl border-2 border-emerald-500 shadow-md space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                    Pasien Ditemukan!
                  </span>
                </div>
                <span className="font-mono font-bold text-xs bg-emerald-200/80 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded">
                  {detectedPatient.no_rm}
                </span>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <div className="font-bold text-base text-slate-900 dark:text-white">
                  {detectedPatient.nama}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <div>Tgl Lahir: <strong className="text-slate-800 dark:text-slate-200">{detectedPatient.tanggal_lahir || detectedPatient.tgl_lahir || '-'}</strong></div>
                  <div>Jenis Kelamin: <strong className="text-slate-800 dark:text-slate-200">{detectedPatient.jenis_kelamin || '-'}</strong></div>
                  <div>Penjamin: <strong className="text-blue-600 dark:text-blue-400">{detectedPatient.penjamin || 'Umum'}</strong></div>
                  <div>Gol. Darah: <strong className="text-rose-600">{detectedPatient.golongan_darah || '-'}</strong></div>
                </div>
                {detectedPatient.nik && (
                  <div className="text-xs text-slate-500 font-mono pt-1">
                    NIK: {detectedPatient.nik}
                  </div>
                )}
              </div>

              <button
                type="button"
                id="btn-open-patient-emr-scanned"
                onClick={handleOpenEMR}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer transform hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Buka Ringkasan Rekam Medis (Patient360)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span>Terhubung ke basis data rekam medis terpusat</span>
          </div>
          {scanMode === 'camera' && (
            <button
              type="button"
              onClick={startCamera}
              className="text-emerald-600 hover:underline font-bold"
            >
              Ulangi Pindai
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
