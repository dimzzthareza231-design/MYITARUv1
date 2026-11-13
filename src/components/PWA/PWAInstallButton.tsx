import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'outline' | 'subtle';
  label?: string;
  showAlwaysGuide?: boolean;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'primary',
  label = 'Pasang App Pasien',
  showAlwaysGuide = false,
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  if (isInstalled) {
    return null;
  }

  const baseStyle =
    variant === 'primary'
      ? 'bg-[#0B3D91] hover:bg-[#082D6E] text-white shadow-sm'
      : variant === 'outline'
      ? 'bg-white border border-[#0B3D91]/25 text-[#0B3D91] hover:bg-blue-50'
      : 'bg-blue-50 text-[#0B3D91] hover:bg-blue-100';

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition whitespace-nowrap cursor-pointer min-h-[44px] ${baseStyle} ${className}`}
      >
        <Download className="w-4 h-4 shrink-0" />
        <span>{label}</span>
      </button>
    );
  }

  if (isIOS || showAlwaysGuide) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowGuideModal(true)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition whitespace-nowrap cursor-pointer min-h-[44px] ${baseStyle} ${className}`}
        >
          <Smartphone className="w-4 h-4 shrink-0" />
          <span>{isIOS ? 'Pasang di iPhone / iPad' : label}</span>
        </button>

        {showGuideModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white text-slate-900 p-6 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#0B3D91] text-white flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Pasang Aplikasi MYITARU</h3>
                    <p className="text-xs text-slate-500">Akses instan dari layar utama ponsel Anda</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  aria-label="Tutup panduan instalasi"
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-700">
                {isIOS ? (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Share className="w-5 h-5 text-[#0B3D91] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">1. Ketuk tombol Bagikan (Share)</p>
                        <p className="text-xs text-slate-600 mt-0.5">Ikon kotak dengan panah ke atas di bilah bawah Safari.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <PlusSquare className="w-5 h-5 text-[#0B3D91] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">2. Pilih “Tambahkan ke Layar Utama”</p>
                        <p className="text-xs text-slate-600 mt-0.5">Lalu ketuk Tambah untuk membuka MYITARU layaknya aplikasi native.</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Chrome / Edge Android & Desktop</p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Ketuk ikon <strong>Install App / Tambahkan ke Layar Utama</strong> di bilah alamat atau menu titik tiga browser Anda.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <Smartphone className="w-5 h-5 text-[#0B3D91] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">Tersedia Offline</p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Kartu berobat QR, jadwal dokter, dan hasil pemeriksaan terakhir tetap dapat dibuka saat sinyal melemah.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="mt-5 w-full rounded-xl bg-[#0B3D91] hover:bg-[#082D6E] py-3 text-sm font-semibold text-white cursor-pointer"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
