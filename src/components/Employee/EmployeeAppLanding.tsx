import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import {
  Smartphone,
  ShieldCheck,
  QrCode,
  ExternalLink,
  CheckCircle2,
  Clock,
  MapPin,
  CalendarClock,
  FileCheck2,
  LifeBuoy,
  PhoneCall,
  Mail,
  Send,
  ArrowRight,
  Monitor,
  TabletSmartphone,
  BarChart3,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { GOVERNANCE_FRAMEWORKS } from '../../data/employeePortalCatalog';

type DeviceType = 'Android' | 'iOS' | 'Desktop';

interface LandingAnalyticsData {
  totalVisits: number;
  byDevice: Record<DeviceType, number>;
  byCta: Record<string, number>;
  byUtmSource: Record<string, number>;
  recentEvents: Array<{ timestamp: string; device: string; cta: string; utmSource: string }>;
}

function detectClientDevice(): DeviceType {
  if (typeof navigator === 'undefined') return 'Desktop';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'Android';
  if (/iPad|iPhone|iPod/i.test(ua)) return 'iOS';
  return 'Desktop';
}

export const EmployeeAppLanding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const detectedDevice = useMemo(() => detectClientDevice(), []);
  const [previewDevice, setPreviewDevice] = useState<DeviceType>(detectedDevice);
  const utmSource = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('utm_source') || 'intranet';
  }, [location.search]);

  const mobileWebUrl = useMemo(() => {
    if (typeof window === 'undefined') return '/karyawan/mobile?source=qr';
    return `${window.location.origin}/karyawan/mobile?source=qr`;
  }, []);

  const [analytics, setAnalytics] = useState<LandingAnalyticsData | null>(null);
  const [deepLinkNotice, setDeepLinkNotice] = useState<string | null>(null);

  // Helpdesk IT Support Form
  const [ticketForm, setTicketForm] = useState({
    requesterName: '',
    requesterContact: '',
    divisionName: 'Instalasi Keperawatan / Klinis',
    category: 'Instalasi Aplikasi Mobile',
    subject: '',
    description: ''
  });
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [createdTicketNo, setCreatedTicketNo] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gateway/landing-analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device: detectedDevice,
        utmSource,
        isVisit: true
      })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.analytics) setAnalytics(data.analytics);
      })
      .catch(() => {
        fetch('/api/gateway/landing-analytics')
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => {
            if (d?.analytics) setAnalytics(d.analytics);
          })
          .catch(() => {});
      });
  }, [detectedDevice, utmSource]);

  const trackCtaClick = (cta: string) => {
    fetch('/api/gateway/landing-analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        device: previewDevice,
        cta,
        utmSource,
        isVisit: false
      })
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.analytics) setAnalytics(data.analytics);
      })
      .catch(() => {});
  };

  const handleStoreAction = (store: 'playstore' | 'appstore') => {
    trackCtaClick(store);
    toast.success(
      store === 'playstore'
        ? 'Mengarahkan ke paket Android APK / Play Store Enterprise. Membuka mode Web App Mobile siap pakai.'
        : 'Mengarahkan ke distribusi iOS App Store / MDM Profile. Membuka mode Web App Mobile siap pakai.'
    );
    setDeepLinkNotice(
      `Distribusi ${store === 'playstore' ? 'Google Play Enterprise' : 'Apple App Store / MDM'} dicatat ke analitik. Anda dapat langsung mencoba versi Web App Mobile Karyawan di perangkat ini.`
    );
  };

  const handleDeepLink = () => {
    trackCtaClick('deeplink');
    setDeepLinkNotice(
      'Mengirim deep link myitaru-staff://open ... Jika aplikasi native belum terpasang di perangkat, lanjutkan melalui Web App Mobile Karyawan (/karyawan/mobile).'
    );
    toast.success('Deep link myitaru-staff://open dipicu (fallback aman ke Web Mobile tersedia).');
  };

  const handleOpenMobileApp = () => {
    trackCtaClick('mobile_web');
    navigate('/karyawan/mobile');
  };

  const handleOpenPortal = () => {
    trackCtaClick('portal');
    navigate('/portal-karyawan');
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.requesterName.trim() || !ticketForm.subject.trim()) {
      toast.error('Nama pegawai dan judul kendala wajib diisi.');
      return;
    }
    setSubmittingTicket(true);
    try {
      const res = await fetch('/api/gateway/helpdesk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ticketForm,
          priority: 'P2 - Tinggi (1 Jam)',
          source: 'Landing Page App'
        })
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        toast.error(data?.message || 'Gagal mengirim tiket IT Support.');
        return;
      }
      setCreatedTicketNo(data.ticket.ticketNo);
      toast.success(`Tiket dukungan ${data.ticket.ticketNo} berhasil dibuat dan diteruskan ke Service Desk TI.`);
      setTicketForm({
        requesterName: '',
        requesterContact: '',
        divisionName: 'Instalasi Keperawatan / Klinis',
        category: 'Instalasi Aplikasi Mobile',
        subject: '',
        description: ''
      });
    } catch {
      toast.error('Koneksi ke API Gateway gagal.');
    } finally {
      setSubmittingTicket(false);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Bar (Strictly 3 zones) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Kembali ke Portal Publik Rumah Sakit"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 whitespace-nowrap">
              <img src="/icon.svg" alt="MYITARU" className="w-8 h-8 rounded-lg" />
              <span className="font-extrabold text-base tracking-tight text-[#0B3D91] dark:text-sky-400">
                MYITARU <span className="font-semibold text-slate-600 dark:text-slate-300">Staff App</span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button type="button" onClick={() => scrollTo('fitur-app')} className="hover:text-[#0B3D91] dark:hover:text-sky-400 cursor-pointer whitespace-nowrap">
              Fitur Utama
            </button>
            <button type="button" onClick={() => scrollTo('panduan-instalasi')} className="hover:text-[#0B3D91] dark:hover:text-sky-400 cursor-pointer whitespace-nowrap">
              Panduan Instalasi
            </button>
            <button type="button" onClick={() => scrollTo('it-support')} className="hover:text-[#0B3D91] dark:hover:text-sky-400 cursor-pointer whitespace-nowrap">
              Kontak IT Support
            </button>
          </nav>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenPortal}
              className="inline-flex items-center gap-2 bg-[#0B3D91] hover:bg-[#082D6E] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap"
            >
              <Lock className="w-4 h-4" />
              <span>Buka Portal Karyawan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Device Detection & QR Code */}
      <section className="bg-gradient-to-br from-[#07265C] via-[#0B3D91] to-[#114EB4] text-white py-12 sm:py-16 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-lg text-xs font-medium text-sky-100">
              <span>Ekosistem Digital Karyawan Rumah Sakit</span>
              <span>·</span>
              <span className="font-mono text-sky-300">Deteksi Perangkat: {detectedDevice}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-balance">
              Satu Aplikasi Operasional 24 Jam untuk Seluruh Divisi Rumah Sakit
            </h1>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl">
              Presensi geofencing &amp; mode offline idempoten, kalender 3-shift (batas 40 jam/minggu), handover SBAR terverifikasi, pengajuan cuti berjenjang, dan slip gaji digital dalam satu genggaman yang aman sesuai UU PDP &amp; PMK 24/2022.
            </p>

            {/* Interactive Device Preview Switcher */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-200">
                Simulasi Tampilan Unduhan Sesuai Perangkat
              </p>
              <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/15">
                {(['Android', 'iOS', 'Desktop'] as DeviceType[]).map((dev) => (
                  <button
                    key={dev}
                    type="button"
                    onClick={() => setPreviewDevice(dev)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      previewDevice === dev ? 'bg-white text-[#0B3D91]' : 'text-blue-100 hover:text-white'
                    }`}
                  >
                    {dev === 'Desktop' ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                    <span>{dev}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic CTAs by Preview Device */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {(previewDevice === 'Android' || previewDevice === 'Desktop') && (
                <button
                  type="button"
                  onClick={() => handleStoreAction('playstore')}
                  className="inline-flex items-center gap-2.5 bg-white text-[#0B3D91] hover:bg-blue-50 font-bold text-sm px-5 py-3 rounded-xl shadow-sm transition cursor-pointer"
                >
                  <TabletSmartphone className="w-4 h-4" />
                  <span>Google Play (Android APK)</span>
                </button>
              )}

              {(previewDevice === 'iOS' || previewDevice === 'Desktop') && (
                <button
                  type="button"
                  onClick={() => handleStoreAction('appstore')}
                  className="inline-flex items-center gap-2.5 bg-white text-[#0B3D91] hover:bg-blue-50 font-bold text-sm px-5 py-3 rounded-xl shadow-sm transition cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>App Store (iOS Enterprise)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleDeepLink}
                className="inline-flex items-center gap-2 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-300/40 text-white font-semibold text-sm px-4 py-3 rounded-xl transition cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Deep Link (myitaru-staff://)</span>
              </button>

              <button
                type="button"
                onClick={handleOpenMobileApp}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-5 py-3 rounded-xl transition cursor-pointer"
              >
                <span>Buka Web App Mobile Karyawan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {deepLinkNotice && (
              <div className="rounded-xl bg-white/10 border border-sky-300/30 p-3.5 text-xs text-sky-100 leading-relaxed">
                {deepLinkNotice}
              </div>
            )}
          </div>

          {/* Right Card: QR Code for Desktop or Mobile Quick Onboarding Card */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-400">
                    {previewDevice === 'Desktop' ? 'Mode Desktop · Pindai QR Code' : `Mode Perangkat ${previewDevice}`}
                  </p>
                  <h2 className="text-lg font-extrabold mt-1">
                    {previewDevice === 'Desktop'
                      ? 'Scan untuk Membuka Aplikasi Karyawan'
                      : `Akses Langsung Aplikasi Karyawan (${previewDevice})`}
                  </h2>
                </div>
                <QrCode className="w-6 h-6 text-[#0B3D91] dark:text-sky-400 shrink-0" />
              </div>

              {previewDevice === 'Desktop' ? (
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shrink-0">
                    <QRCodeSVG value={mobileWebUrl} size={136} level="M" />
                  </div>
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      Pindai dengan Kamera Ponsel RS
                    </p>
                    <p>
                      Mengarahkan langsung ke <span className="font-mono text-[#0B3D91] dark:text-sky-400">/karyawan/mobile</span> dengan dukungan mode offline &amp; presensi GPS.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        trackCtaClick('qr');
                        navigate('/karyawan/mobile');
                      }}
                      className="inline-flex items-center gap-1.5 font-bold text-[#0B3D91] dark:text-sky-400 hover:underline cursor-pointer pt-1"
                    >
                      <span>Simulasikan Hasil Scan QR</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">
                    {previewDevice === 'Android'
                      ? 'Paket Android Enterprise (v2.6.0 · 28 MB)'
                      : 'Aplikasi iOS Enterprise (v2.6.0 · iOS 15+)'}
                  </p>
                  <p>
                    {previewDevice === 'Android'
                      ? 'Mendukung fingerprint Android BiometricPrompt, GPS Geofencing 200m, dan background offline sync.'
                      : 'Mendukung Face ID / Touch ID, Safari Add-to-Home-Screen PWA, dan notifikasi jadwal shift real-time.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenMobileApp}
                    className="mt-2 w-full py-2.5 rounded-lg bg-[#0B3D91] text-white font-bold text-xs hover:bg-[#082D6E] transition cursor-pointer"
                  >
                    Jalankan Mode Web App Mobile Sekarang
                  </button>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Seluruh Akses Melalui API Gateway</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">TLS 1.3 + MFA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="fitur-app" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-400">
            KAPABILITAS OPERASIONAL KARYAWAN
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            Dirancang untuk Mobilitas Perawat, Dokter &amp; Staf Penunjang 24 Jam
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: MapPin,
              title: 'Absensi Geofence & Offline',
              desc: 'Validasi radius GPS kampus RS + simulasi biometrik. Tetap berfungsi di area blankspot dengan antrean Idempotency-Key.'
            },
            {
              icon: CalendarClock,
              title: 'Kalender 3-Shift & Tukar Shift',
              desc: 'Deteksi otomatis batas maksimal 40 jam/minggu serta persetujuan tukar shift berjenjang oleh Kepala Ruangan.'
            },
            {
              icon: FileCheck2,
              title: 'Handover SBAR Terverifikasi',
              desc: 'Dokumentasi serah terima pasien antar shift (Nurse Station & Bedside) sesuai standar keselamatan pasien.'
            },
            {
              icon: ShieldCheck,
              title: 'Keamanan RBAC + ABAC & MFA',
              desc: 'Kepatuhan penuh terhadap UU PDP, PMK 24/2022, dan ISO 27001/27799 dengan audit log immutable.'
            }
          ].map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#0B3D91]/10 dark:bg-sky-500/15 text-[#0B3D91] dark:text-sky-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base">{feat.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step-by-Step Installation Guide + UTM Analytics */}
      <section id="panduan-instalasi" className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-400">
                PANDUAN INSTALASI &amp; ONBOARDING
              </p>
              <h2 className="text-2xl font-extrabold mt-1">4 Langkah Mulai Menggunakan Aplikasi</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  step: '01',
                  title: 'Unduh atau Pindai QR Code',
                  body: 'Pilih tombol Play Store/App Store sesuai perangkat, atau pindai QR Code Desktop untuk membuka Web App Mobile.'
                },
                {
                  step: '02',
                  title: 'Login NIP / Email RS atau Google',
                  body: 'Masuk menggunakan NIP kepegawaian HRIS atau akun Google institusi yang sudah terdaftar di unit kerja Anda.'
                },
                {
                  step: '03',
                  title: 'Verifikasi MFA 6-Digit & Binding',
                  body: 'Untuk role klinis & administrator, masukkan OTP MFA (demo: 123456) untuk mengikat perangkat terpercaya.'
                },
                {
                  step: '04',
                  title: 'Mulai Presensi & Handover Shift',
                  body: 'Gunakan presensi geofencing, ajukan cuti, atau catat serah terima SBAR langsung dari layar ponsel.'
                }
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 space-y-1.5"
                >
                  <span className="font-mono text-xs font-bold text-[#0B3D91] dark:text-sky-400">LANGKAH {s.step}</span>
                  <h3 className="font-bold text-sm">{s.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {GOVERNANCE_FRAMEWORKS.map((fw) => (
                <div key={fw.code} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                  <p className="font-mono text-xs font-bold text-[#0B3D91] dark:text-sky-400">{fw.code}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{fw.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Real-Time Landing Analytics (UTM, CTA, Device) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Analitik Adopsi Kanal</p>
                  <h3 className="font-bold text-base mt-0.5">Statistik Klik CTA, Perangkat &amp; UTM</h3>
                </div>
                <BarChart3 className="w-5 h-5 text-[#0B3D91] dark:text-sky-400" />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                  <p className="text-[11px] text-slate-500">Total Kunjungan</p>
                  <p className="font-mono font-bold text-lg tabular-nums mt-0.5">{analytics?.totalVisits ?? 1842}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                  <p className="text-[11px] text-slate-500">Android</p>
                  <p className="font-mono font-bold text-lg tabular-nums mt-0.5 text-emerald-600">
                    {analytics?.byDevice.Android ?? 964}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                  <p className="text-[11px] text-slate-500">iOS / Desktop</p>
                  <p className="font-mono font-bold text-lg tabular-nums mt-0.5 text-[#0B3D91] dark:text-sky-400">
                    {(analytics?.byDevice.iOS ?? 418) + (analytics?.byDevice.Desktop ?? 460)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Sumber UTM Aktif: <span className="font-mono text-[#0B3D91] dark:text-sky-400">{utmSource}</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Play Store</span>
                    <span className="font-mono font-bold tabular-nums">{analytics?.byCta.playstore ?? 612}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">App Store</span>
                    <span className="font-mono font-bold tabular-nums">{analytics?.byCta.appstore ?? 285}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Scan QR</span>
                    <span className="font-mono font-bold tabular-nums">{analytics?.byCta.qr ?? 214}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500">Portal CTA</span>
                    <span className="font-mono font-bold tabular-nums">{analytics?.byCta.portal ?? 512}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IT Support Contacts + Live Ticket Submission */}
      <section id="it-support" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-400">
                DUKUNGAN TEKNIS 24 JAM (ITIL 4 SERVICE DESK)
              </p>
              <h2 className="text-2xl font-extrabold mt-1">Butuh Bantuan Instalasi atau Reset MFA?</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                Tim Unit SIMK / TI siap membantu kendala perangkat, reset OTP MFA, atau otorisasi NIP baru secara langsung.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3.5">
                <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">WhatsApp &amp; Hotline Service Desk TI</p>
                  <p className="font-mono font-bold text-sm">0811-900-1100 (Ext. 1100 · Siaga 24 Jam)</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3.5">
                <Mail className="w-5 h-5 text-[#0B3D91] dark:text-sky-400 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Email Resmi IT Support &amp; DPO</p>
                  <p className="font-mono font-bold text-sm">servicedesk@rs-myitaru.id</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center gap-3.5">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">SLA Penanganan Tiket Prioritas</p>
                  <p className="font-semibold text-sm">P1 Kritis &lt; 15 Menit · P2 Tinggi &lt; 1 Jam</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleTicketSubmit}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-5 h-5 text-[#0B3D91] dark:text-sky-400" />
                  <h3 className="font-bold text-base">Buat Tiket Bantuan IT Support</h3>
                </div>
                <span className="text-xs font-mono text-slate-500">Terhubung ke Helpdesk Portal</span>
              </div>

              {createdTicketNo && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3.5 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>
                    Tiket <strong className="font-mono">{createdTicketNo}</strong> telah tercatat di antrean Helpdesk Portal Karyawan.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Nama Pegawai *</label>
                  <input
                    type="text"
                    value={ticketForm.requesterName}
                    onChange={(e) => setTicketForm({ ...ticketForm, requesterName: e.target.value })}
                    placeholder="Contoh: Ns. Dewi Anggraini"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">NIP / No. WhatsApp</label>
                  <input
                    type="text"
                    value={ticketForm.requesterContact}
                    onChange={(e) => setTicketForm({ ...ticketForm, requesterContact: e.target.value })}
                    placeholder="NIP-1990... atau 0812..."
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Unit / Divisi</label>
                  <input
                    type="text"
                    value={ticketForm.divisionName}
                    onChange={(e) => setTicketForm({ ...ticketForm, divisionName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Judul Kendala *</label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder="Contoh: Gagal aktivasi MFA di Android"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={3}
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Jelaskan tipe perangkat dan pesan kendala yang muncul..."
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="inline-flex items-center gap-2 bg-[#0B3D91] hover:bg-[#082D6E] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingTicket ? 'Mengirim Tiket...' : 'Kirim Tiket Bantuan TI'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
