import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  User,
  CalendarClock,
  MapPin,
  FileCheck2,
  Wallet,
  GraduationCap,
  Award,
  MessageSquare,
  LifeBuoy,
  Building2,
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  Smartphone,
  LogOut,
  Sun,
  Moon,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  KeyRound,
  RefreshCw,
  Send
} from 'lucide-react';
import { useHospital } from '../../contexts/HospitalContext';
import {
  HOSPITAL_DIVISIONS,
  CORE_EMPLOYEE_MODULES,
  GOVERNANCE_FRAMEWORKS,
  type DivisionCategory,
  type CoreModuleDefinition
} from '../../data/employeePortalCatalog';
import { EmployeeAdminArea } from './EmployeeAdminArea';

type ActiveSection = CoreModuleDefinition['id'] | 'division_workspace' | 'admin_area';

const CORE_ICON_MAP: Record<CoreModuleDefinition['id'], React.ComponentType<{ className?: string }>> = {
  profil: User,
  shift: CalendarClock,
  absensi: MapPin,
  cuti: FileCheck2,
  payroll: Wallet,
  pelatihan: GraduationCap,
  kinerja: Award,
  komunikasi: MessageSquare,
  helpdesk: LifeBuoy
};

export const EmployeePortal: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useHospital();

  // Gateway auth state
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('myitaru_emp_token'));
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('myitaru2026');
  const [selectedLoginDivId, setSelectedLoginDivId] = useState<string>('keperawatan');
  const [loginCategoryFilter, setLoginCategoryFilter] = useState<'Semua' | DivisionCategory>('Semua');
  const [authLoading, setAuthLoading] = useState(false);

  // MFA Step state
  const [mfaChallenge, setMfaChallenge] = useState<{
    challengeId: string;
    demoOtpHint: string;
    userPreview: any;
  } | null>(null);
  const [otpInput, setOtpInput] = useState('');

  // Portal runtime state
  const [activeSection, setActiveSection] = useState<ActiveSection>('profil');
  const [bootstrap, setBootstrap] = useState<any>(null);
  const [loadingBootstrap, setLoadingBootstrap] = useState(false);
  const [inspectedDivisionId, setInspectedDivisionId] = useState<string>('keperawatan');

  // Module sub-states
  const [profileData, setProfileData] = useState<any>(null);
  const [editEmail, setEditEmail] = useState('');
  const [shiftsData, setShiftsData] = useState<any>(null);
  const [swapForm, setSwapForm] = useState({
    fromDate: '2026-04-09',
    fromShift: 'Siang (14:00-21:00)',
    targetColleague: 'Ns. Rian Kusuma, S.Kep',
    toDate: '2026-04-11',
    toShift: 'Pagi (07:00-14:00)',
    reason: 'Penyesuaian jadwal jaga keluarga',
    extraHours: 0
  });
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [simulateOutOfRange, setSimulateOutOfRange] = useState(false);
  const [leavesData, setLeavesData] = useState<any>(null);
  const [leaveForm, setLeaveForm] = useState({
    type: 'Cuti Tahunan',
    startDate: '2026-04-27',
    endDate: '2026-04-28',
    days: 2,
    substitute: 'Rekan Pengganti Unit',
    reason: 'Keperluan keluarga'
  });
  const [payrollData, setPayrollData] = useState<any>(null);
  const [reimburseForm, setReimburseForm] = useState({ title: '', category: 'Diklat / SKP', amount: '750000' });
  const [trainingData, setTrainingData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [sbarData, setSbarData] = useState<any>(null);
  const [sbarForm, setSbarForm] = useState({
    sessionType: 'Bedside Handover',
    receiverName: 'Perawat Shift Berikutnya',
    patientLabel: 'Ny. Sari Dewi (RM-250401-0112)',
    situation: '',
    background: '',
    assessment: '',
    recommendation: ''
  });
  const [helpdeskData, setHelpdeskData] = useState<any>(null);
  const [helpdeskForm, setHelpdeskForm] = useState({
    category: 'TI / SIMK & MFA',
    priority: 'P2 - Tinggi (1 Jam)',
    subject: '',
    description: ''
  });
  const [divisionWorkspace, setDivisionWorkspace] = useState<any>(null);
  const [breakGlassModalOpen, setBreakGlassModalOpen] = useState(false);
  const [breakGlassReason, setBreakGlassReason] = useState('Penanganan gawat darurat pasien henti jantung (Code Blue)');

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  const loadBootstrap = useCallback(async (activeToken: string) => {
    setLoadingBootstrap(true);
    try {
      const res = await fetch('/api/gateway/bootstrap', {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (res.status === 401) {
        sessionStorage.removeItem('myitaru_emp_token');
        setToken(null);
        setBootstrap(null);
        return;
      }
      const data = await res.json();
      if (data.success) {
        setBootstrap(data);
        setInspectedDivisionId(data.division.id);
      }
    } catch {
      toast.error('API Gateway tidak merespons.');
    } finally {
      setLoadingBootstrap(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadBootstrap(token);
    }
  }, [token, loadBootstrap]);

  // Fetch data dynamically when activeSection or inspectedDivisionId changes
  const fetchSectionData = useCallback(
    async (section: ActiveSection) => {
      if (!token) return;
      const headers = { Authorization: `Bearer ${token}` };
      try {
        if (section === 'profil') {
          const r = await fetch('/api/gateway/profile', { headers });
          const d = await r.json();
          if (d.success) {
            setProfileData(d);
            setEditEmail(d.user.email);
          }
        } else if (section === 'shift') {
          const r = await fetch('/api/gateway/shifts', { headers });
          const d = await r.json();
          if (d.success) setShiftsData(d);
        } else if (section === 'absensi') {
          const r = await fetch('/api/gateway/attendance', { headers });
          const d = await r.json();
          if (d.success) setAttendanceData(d);
        } else if (section === 'cuti') {
          const r = await fetch('/api/gateway/leaves', { headers });
          const d = await r.json();
          if (d.success) setLeavesData(d);
        } else if (section === 'payroll') {
          const r = await fetch('/api/gateway/payroll', { headers });
          const d = await r.json();
          if (d.success) setPayrollData(d);
        } else if (section === 'pelatihan') {
          const r = await fetch('/api/gateway/training', { headers });
          const d = await r.json();
          if (d.success) setTrainingData(d);
        } else if (section === 'kinerja') {
          const r = await fetch('/api/gateway/performance', { headers });
          const d = await r.json();
          if (d.success) setPerformanceData(d);
        } else if (section === 'komunikasi') {
          const r = await fetch('/api/gateway/sbar', { headers });
          const d = await r.json();
          if (d.success) setSbarData(d);
        } else if (section === 'helpdesk') {
          const r = await fetch('/api/gateway/helpdesk', { headers });
          const d = await r.json();
          if (d.success) setHelpdeskData(d);
        } else if (section === 'division_workspace') {
          const r = await fetch(`/api/gateway/divisions/${inspectedDivisionId}/workspace`, { headers });
          const d = await r.json();
          if (d.success) setDivisionWorkspace(d);
        }
      } catch {
        toast.error('Gagal memuat data modul dari API Gateway.');
      }
    },
    [token, inspectedDivisionId]
  );

  useEffect(() => {
    if (token && bootstrap) {
      fetchSectionData(activeSection);
    }
  }, [token, bootstrap, activeSection, inspectedDivisionId, fetchSectionData]);

  // Login handlers
  const executeGatewayLogin = async (authType: 'nip' | 'google', divOverride?: string) => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/gateway/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: divOverride ? undefined : loginIdentifier.trim() || undefined,
          password: loginPassword,
          divisionId: divOverride || (loginIdentifier.trim() ? undefined : selectedLoginDivId),
          authType,
          googleEmail: authType === 'google' ? 'pegawai.rs@rs-myitaru.id' : undefined,
          deviceInfo: navigator.userAgent.slice(0, 60)
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Gagal autentikasi di API Gateway.');
        return;
      }

      if (data.mfaRequired) {
        setMfaChallenge({
          challengeId: data.challengeId,
          demoOtpHint: data.demoOtpHint,
          userPreview: data.userPreview
        });
        setOtpInput(data.demoOtpHint);
        toast('Role klinis/admin membutuhkan verifikasi MFA 6-digit.', { icon: '🔐' });
      } else {
        sessionStorage.setItem('myitaru_emp_token', data.token);
        setToken(data.token);
        toast.success(`Selamat datang, ${data.session.name}`);
      }
    } catch {
      toast.error('Gagal menghubungi API Gateway.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaChallenge) return;
    setAuthLoading(true);
    try {
      const res = await fetch('/api/gateway/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: mfaChallenge.challengeId,
          otp: otpInput,
          deviceName: 'Portal Karyawan Desktop'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Verifikasi OTP gagal.');
        return;
      }
      sessionStorage.setItem('myitaru_emp_token', data.token);
      setMfaChallenge(null);
      setToken(data.token);
      toast.success(`MFA terverifikasi! Perangkat terikat: ${data.session.deviceFingerprint}`);
    } catch {
      toast.error('Gagal memverifikasi MFA.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/gateway/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    sessionStorage.removeItem('myitaru_emp_token');
    setToken(null);
    setBootstrap(null);
    setMfaChallenge(null);
    toast.success('Sesi Portal Karyawan diakhiri.');
  };

  const handleUpdateAbac = async (patch: Record<string, unknown>) => {
    if (!token) return;
    try {
      const res = await fetch('/api/gateway/abac-context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Gagal memperbarui konteks ABAC.');
        return;
      }
      setBootstrap((prev: any) =>
        prev
          ? {
              ...prev,
              session: { ...prev.session, abac: data.abac },
              access: data.access
            }
          : prev
      );
      if (activeSection === 'division_workspace') {
        fetchSectionData('division_workspace');
      }
      toast.success(
        data.access.emrAccess === 'LOCKED'
          ? 'Kebijakan ABAC mengevaluasi ulang: Akses Klinis EMR DIKUNCI.'
          : data.access.emrAccess === 'BREAK_GLASS'
          ? 'Protokol Darurat BREAK-GLASS Aktif & Tercatat di Audit SIEM.'
          : 'Konteks ABAC diperbarui: Akses Terverifikasi.'
      );
    } catch {
      toast.error('Gagal menghubungi mesin evaluasi ABAC.');
    }
  };

  const filteredLoginDivisions = useMemo(() => {
    if (loginCategoryFilter === 'Semua') return HOSPITAL_DIVISIONS;
    return HOSPITAL_DIVISIONS.filter((d) => d.category === loginCategoryFilter);
  }, [loginCategoryFilter]);

  // =========================================================================
  // RENDER GATE 1: LOGIN + MFA SCREEN
  // =========================================================================
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              title="Kembali ke Portal Publik Rumah Sakit"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <img src="/icon.svg" alt="MYITARU" className="w-8 h-8 rounded-lg" />
            <div>
              <span className="font-extrabold text-sm sm:text-base text-[#0B3D91] dark:text-sky-400">
                MYITARU Portal Karyawan
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2">
                API Gateway · RBAC + ABAC · ISO 27001
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/app-karyawan')}
              className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              Unduh App Mobile
            </button>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Login or MFA Card */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
            {!mfaChallenge ? (
              <>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-400">
                    SINGLE SIGN-ON KARYAWAN RUMAH SAKIT
                  </p>
                  <h1 className="text-2xl font-extrabold mt-1">Masuk Portal Karyawan</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Autentikasi NIP/Email HRIS atau akun Google. Role Klinis &amp; Admin wajib verifikasi MFA 6-digit.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={authLoading}
                  onClick={() => executeGatewayLogin('google')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0B3D91] dark:text-sky-400" />
                  <span>Masuk dengan SSO Akun Google Institusi</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <span className="border-t border-slate-200 dark:border-slate-800 w-full" />
                  <span className="bg-white dark:bg-slate-900 px-3 text-[11px] text-slate-400 font-semibold whitespace-nowrap">
                    atau Login NIP / Divisi
                  </span>
                  <span className="border-t border-slate-200 dark:border-slate-800 w-full" />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeGatewayLogin('nip');
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold mb-1">NIP atau Email Pegawai (opsional jika pilih divisi)</label>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="Contoh: NIP-19840920-015 atau kosongkan untuk demo"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Divisi / Unit Kerja Aktif (34 Divisi Tersedia)</label>
                    <select
                      value={selectedLoginDivId}
                      onChange={(e) => setSelectedLoginDivId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {HOSPITAL_DIVISIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} — {d.defaultStaffName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Kata Sandi</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 rounded-xl bg-[#0B3D91] hover:bg-[#082D6E] text-white font-bold text-sm transition cursor-pointer disabled:opacity-60"
                  >
                    {authLoading ? 'Memverifikasi via API Gateway...' : 'Lanjutkan Login'}
                  </button>
                </form>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  {GOVERNANCE_FRAMEWORKS.map((f) => (
                    <div key={f.code} className="bg-slate-50 dark:bg-slate-950 rounded-lg px-2.5 py-2 border border-slate-200 dark:border-slate-800">
                      <span className="font-mono font-bold text-[#0B3D91] dark:text-sky-400">{f.code}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <form onSubmit={handleVerifyMfa} className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    WAJIB MFA · ROLE KLINIS / ADMINISTRATOR
                  </p>
                  <h2 className="text-xl font-extrabold mt-1">Verifikasi OTP 6-Digit &amp; Device Binding</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Masuk sebagai <strong>{mfaChallenge.userPreview.name}</strong> ({mfaChallenge.userPreview.divisionName}).
                  </p>
                </div>

                <div className="rounded-xl bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 p-3 text-xs text-sky-900 dark:text-sky-200">
                  Kode OTP MFA Demo Terverifikasi: <strong className="font-mono text-sm">{mfaChallenge.demoOtpHint}</strong>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Masukkan 6-Digit Kode OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xl tracking-[0.4em] text-center outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMfaChallenge(null)}
                    className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
                  >
                    {authLoading ? 'Mengikat Perangkat...' : 'Verifikasi MFA & Masuk Portal'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: 34 Divisions Instant Access Matrix */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div>
              <h2 className="text-lg font-extrabold">Akses Cepat Seluruh 34 Divisi &amp; Jabatan Rumah Sakit</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Klik salah satu divisi di bawah untuk langsung login &amp; melihat modul inti + modul spesifik RBAC/ABAC divisi tersebut.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'Semua',
                  'Pimpinan & Komite',
                  'Pelayanan Klinis',
                  'Penunjang Medik',
                  'Penunjang Non-Medik & Sarana',
                  'Administrasi, Keuangan & TI'
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setLoginCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                    loginCategoryFilter === cat
                      ? 'bg-[#0B3D91] text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[540px] overflow-y-auto pr-1">
              {filteredLoginDivisions.map((div) => (
                <button
                  key={div.id}
                  type="button"
                  disabled={authLoading}
                  onClick={() => executeGatewayLogin('nip', div.id)}
                  className="text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#0B3D91] dark:hover:border-sky-500 bg-slate-50/60 dark:bg-slate-950/60 transition cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{div.name}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        div.isClinical
                          ? 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300'
                          : div.isAdminCapable
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {div.isClinical ? 'MFA Klinis' : div.isAdminCapable ? 'MFA Admin' : 'Standar'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {div.defaultStaffName} · <span className="font-mono">{div.defaultNip}</span>
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadingBootstrap || !bootstrap) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-4 border-[#0B3D91] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Menghubungkan ke API Gateway &amp; Mengevaluasi Kebijakan RBAC + ABAC...
        </p>
      </div>
    );
  }

  const { session, division, access } = bootstrap;
  const inspectedDivision =
    HOSPITAL_DIVISIONS.find((d) => d.id === inspectedDivisionId) || division;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex">
      {/* 260px Enterprise Sidebar */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
          <img src="/icon.svg" alt="MYITARU" className="w-8 h-8 rounded-lg" />
          <div className="min-w-0">
            <p className="font-extrabold text-sm text-[#0B3D91] dark:text-sky-400 truncate">
              Portal Karyawan
            </p>
            <p className="text-[11px] text-slate-500 truncate">{session.divisionName}</p>
          </div>
        </div>

        <div className="p-3 space-y-5 flex-1">
          {/* Group A: 9 Mandatory Core Modules */}
          <div>
            <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              9 Modul Inti Karyawan
            </p>
            <div className="space-y-0.5">
              {CORE_EMPLOYEE_MODULES.map((mod) => {
                const Icon = CORE_ICON_MAP[mod.id];
                const active = activeSection === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setActiveSection(mod.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'bg-[#0B3D91] text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{mod.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group B: Division-Specific Workspace (RBAC + ABAC) */}
          <div>
            <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Modul Spesifik Divisi
            </p>
            <button
              type="button"
              onClick={() => {
                setInspectedDivisionId(division.id);
                setActiveSection('division_workspace');
              }}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeSection === 'division_workspace'
                  ? 'bg-[#0B3D91] text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Building2 className="w-4 h-4 shrink-0" />
                <span className="truncate">Worklist Unit (34 Divisi)</span>
              </span>
              {division.isClinical && access.emrAccess === 'LOCKED' && (
                <Lock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              )}
            </button>
          </div>

          {/* Group C: Area Admin & Governance */}
          <div>
            <p className="px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Area Admin &amp; Tata Kelola
            </p>
            <button
              type="button"
              onClick={() => setActiveSection('admin_area')}
              className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeSection === 'admin_area'
                  ? 'bg-[#0B3D91] text-white'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-2 truncate">
                <Layers className="w-4 h-4 shrink-0" />
                <span className="truncate">Admin, RBAC/ABAC &amp; SIEM</span>
              </span>
              {!access.adminAreaAccess && <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
            </button>
          </div>
        </div>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            type="button"
            onClick={() => navigate('/karyawan/mobile')}
            className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Buka App Mobile Karyawan</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Breadcrumb + Live ABAC Attribute Context Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 whitespace-nowrap">
              <button type="button" onClick={() => navigate('/')} className="hover:text-[#0B3D91] cursor-pointer">
                MYITARU Klinik
              </button>
              <span>/</span>
              <span>Portal Karyawan</span>
              <span>/</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {activeSection === 'division_workspace'
                  ? 'Modul Spesifik Divisi'
                  : activeSection === 'admin_area'
                  ? 'Area Admin & Tata Kelola'
                  : CORE_EMPLOYEE_MODULES.find((m) => m.id === activeSection)?.label}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 truncate">
              {session.name} · <span className="font-mono text-[#0B3D91] dark:text-sky-400">{session.nip}</span> · Perangkat: <span className="font-mono">{session.deviceFingerprint}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Live ABAC Toggle Controls */}
            <button
              type="button"
              onClick={() => handleUpdateAbac({ onDuty: !session.abac.onDuty })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer whitespace-nowrap ${
                session.abac.onDuty
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300'
              }`}
            >
              ABAC: {session.abac.onDuty ? 'On-Duty' : 'Off-Duty'}
            </button>

            <button
              type="button"
              onClick={() => handleUpdateAbac({ unitMatch: !session.abac.unitMatch })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer whitespace-nowrap ${
                session.abac.unitMatch
                  ? 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950/50 dark:border-sky-800 dark:text-sky-300'
                  : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300'
              }`}
            >
              {session.abac.unitMatch ? 'Unit Cocok' : 'Luar Unit'}
            </button>

            {session.abac.breakGlassActive ? (
              <button
                type="button"
                onClick={() => handleUpdateAbac({ breakGlassActive: false })}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white cursor-pointer whitespace-nowrap"
              >
                Matikan Break-Glass
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setBreakGlassModalOpen(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer whitespace-nowrap"
              >
                Break-Glass Darurat
              </button>
            )}

            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Mobile Section Switcher */}
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 overflow-x-auto flex gap-1.5">
          {CORE_EMPLOYEE_MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setActiveSection(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                activeSection === m.id ? 'bg-[#0B3D91] text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {m.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveSection('division_workspace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              activeSection === 'division_workspace' ? 'bg-[#0B3D91] text-white' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            34 Divisi
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('admin_area')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              activeSection === 'admin_area' ? 'bg-[#0B3D91] text-white' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            Area Admin
          </button>
        </div>

        {/* Main Workspace Canvas */}
        <main className="p-4 sm:p-6 space-y-5 flex-1">
          {/* ABAC Enforcement Banner when Clinical EMR locked or Break-Glass active */}
          {division.isClinical && access.emrAccess !== 'GRANTED' && (
            <div
              className={`rounded-xl border p-4 flex flex-wrap items-center justify-between gap-3 ${
                access.emrAccess === 'LOCKED'
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">
                    {access.emrAccess === 'LOCKED'
                      ? 'Proteksi ABAC Aktif — Akses EMR & Worklist Klinis Dikunci'
                      : 'Mode Darurat Break-Glass Aktif (Audit Immutable SIEM Berjalan)'}
                  </p>
                  <p className="mt-0.5">{access.emrReasons.join(' ')}</p>
                </div>
              </div>
              {access.emrAccess === 'LOCKED' && (
                <button
                  type="button"
                  onClick={() => handleUpdateAbac({ onDuty: true, unitMatch: true, careRelationship: true })}
                  className="px-3 py-1.5 rounded-lg bg-[#0B3D91] text-white text-xs font-bold cursor-pointer"
                >
                  Aktifkan Status On-Duty &amp; Cocok Unit
                </button>
              )}
            </div>
          )}

          {/* SECTION: 1. PROFIL 360 & LISENSI */}
          {activeSection === 'profil' && profileData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-400">
                      PROFIL 360° KEPEGAWAIAN (HRIS)
                    </p>
                    <h2 className="text-xl font-extrabold mt-1">{profileData.user.name}</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {profileData.user.roleTitle} · {profileData.user.divisionName}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">
                    {profileData.contracts.statusKepegawaian}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">NIP Institusi</span>
                    <span className="font-mono font-bold text-sm">{profileData.user.nip}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">Pola Shift Default</span>
                    <span className="font-semibold text-sm">{profileData.user.shiftPattern}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">Masa Kerja</span>
                    <span className="font-semibold text-sm">{profileData.contracts.masaKerja}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 block">Penilaian Kinerja Terakhir</span>
                    <span className="font-mono font-bold text-sm text-emerald-600">{profileData.contracts.penilaianTerakhir}</span>
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/gateway/profile', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ email: editEmail })
                    });
                    const d = await res.json();
                    if (d.success) {
                      toast.success('Pembaruan email mandiri tersimpan ke HRIS.');
                      fetchSectionData('profil');
                    }
                  }}
                  className="pt-2 flex flex-wrap items-end gap-3"
                >
                  <div className="flex-1 min-w-[220px]">
                    <label className="block text-xs font-bold mb-1">Pembaruan Email Institusi Mandiri</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#0B3D91] text-white text-xs font-bold hover:bg-[#082D6E] cursor-pointer"
                  >
                    Simpan ke HRIS
                  </button>
                </form>
              </div>

              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h3 className="font-bold text-base">Lisensi Profesi &amp; Notifikasi Kedaluwarsa</h3>
                {profileData.licenses.map((lic: any) => (
                  <div
                    key={lic.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 bg-slate-50/70 dark:bg-slate-950"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs">{lic.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          lic.daysRemaining < 90
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {lic.status}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-500">{lic.number}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Berlaku s.d. <span className="font-mono font-semibold">{lic.expiry}</span> ({lic.daysRemaining} hari tersisa)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: 2. JADWAL & TUKAR SHIFT */}
          {activeSection === 'shift' && shiftsData && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-base">Kalender 3-Shift &amp; Pemantauan Batas 40 Jam/Minggu</h2>
                    <p className="text-xs text-slate-500">
                      Deteksi konflik otomatis sesuai UU Ketenagakerjaan (maksimal 40 jam reguler per minggu).
                    </p>
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold tabular-nums">
                    Total Minggu Ini: {shiftsData.totalWeeklyHours} / {shiftsData.maxLegalWeeklyHours} Jam
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {shiftsData.shifts.map((s: any) => (
                    <div key={s.id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-1 bg-slate-50/70 dark:bg-slate-950">
                      <p className="font-bold text-xs">{s.dayLabel}</p>
                      <p className="font-mono text-[11px] text-slate-500">{s.date}</p>
                      <p className="text-xs font-semibold text-[#0B3D91] dark:text-sky-400 pt-1">{s.shiftType}</p>
                      <p className="font-mono text-[11px] text-slate-500">{s.hours} Jam · {s.status}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/gateway/shifts/swap', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(swapForm)
                    });
                    const d = await res.json();
                    if (d.success) {
                      toast.success(
                        d.swap.conflictWarning
                          ? 'Tukar shift diajukan dengan peringatan batas 40 jam!'
                          : 'Pengajuan tukar shift dikirim ke Atasan Unit.'
                      );
                      fetchSectionData('shift');
                    }
                  }}
                  className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
                >
                  <h3 className="font-bold text-sm">Ajukan Tukar Shift Antar Petugas</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Tanggal Asal</label>
                      <input
                        type="date"
                        value={swapForm.fromDate}
                        onChange={(e) => setSwapForm({ ...swapForm, fromDate: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Tanggal Pengganti</label>
                      <input
                        type="date"
                        value={swapForm.toDate}
                        onChange={(e) => setSwapForm({ ...swapForm, toDate: e.target.value })}
                        className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                      />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={swapForm.targetColleague}
                    onChange={(e) => setSwapForm({ ...swapForm, targetColleague: e.target.value })}
                    placeholder="Nama Rekan Pengganti"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <div>
                    <label className="block text-xs font-semibold mb-1">Simulasi Tambahan Jam (Uji Batas 40 Jam)</label>
                    <select
                      value={swapForm.extraHours}
                      onChange={(e) => setSwapForm({ ...swapForm, extraHours: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                    >
                      <option value={0}>Normal (Total 38 Jam/Minggu — Aman)</option>
                      <option value={7}>Tambah 1 Shift (Total 45 Jam/Minggu — Peringatan Konflik)</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={swapForm.reason}
                    onChange={(e) => setSwapForm({ ...swapForm, reason: e.target.value })}
                    placeholder="Alasan pertukaran shift"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#0B3D91] text-white text-xs font-bold hover:bg-[#082D6E] cursor-pointer"
                  >
                    Kirim Pengajuan Tukar Shift
                  </button>
                </form>

                <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                  <h3 className="font-bold text-sm">Daftar Pengajuan Tukar Shift &amp; Approval Atasan Unit</h3>
                  {shiftsData.swaps.map((sw: any) => (
                    <div key={sw.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold">{sw.requesterName} ⇄ {sw.targetColleague}</span>
                        <span className={`px-2 py-0.5 rounded font-bold ${sw.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : sw.status === 'Ditolak' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'}`}>
                          {sw.status}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-slate-500">
                        {sw.fromDate} ({sw.fromShift}) ↔ {sw.toDate} ({sw.toShift}) · Proyeksi: {sw.weeklyHoursAfterSwap} jam/mgg
                      </p>
                      {sw.conflictWarning && (
                        <p className="p-2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold">
                          {sw.conflictWarning}
                        </p>
                      )}
                      {sw.status === 'Menunggu Atasan Unit' && (
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/gateway/shifts/approve', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ swapId: sw.id, decision: 'APPROVE' })
                              });
                              toast.success('Tukar shift disetujui Atasan Unit.');
                              fetchSectionData('shift');
                            }}
                            className="px-3 py-1.5 rounded bg-emerald-600 text-white font-bold cursor-pointer"
                          >
                            Setujui (Karu/Atasan)
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/gateway/shifts/approve', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ swapId: sw.id, decision: 'REJECT' })
                              });
                              toast.error('Tukar shift ditolak.');
                              fetchSectionData('shift');
                            }}
                            className="px-3 py-1.5 rounded bg-rose-600 text-white font-bold cursor-pointer"
                          >
                            Tolak
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 3. ABSENSI & GEOFENCING */}
          {activeSection === 'absensi' && attendanceData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <h2 className="font-bold text-base">Presensi GPS Geofencing, Biometrik &amp; Mode Offline</h2>
                <p className="text-xs text-slate-500">
                  Radius Kampus: <strong>{attendanceData.geofence.name}</strong> (Maks. {attendanceData.geofence.radiusMeters} meter).
                </p>

                <label className="flex items-center gap-2 text-xs font-semibold p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={simulateOutOfRange}
                    onChange={(e) => setSimulateOutOfRange(e.target.checked)}
                  />
                  <span>Simulasikan Posisi di Luar Radius RS (Uji Tolak Geofence)</span>
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {(['MASUK', 'PULANG', 'LEMBUR', 'KOREKSI'] as const).map((clockType) => (
                    <button
                      key={clockType}
                      type="button"
                      onClick={async () => {
                        const lat = simulateOutOfRange
                          ? attendanceData.geofence.lat + 0.015
                          : attendanceData.geofence.lat;
                        const lng = attendanceData.geofence.lng;
                        const res = await fetch('/api/gateway/attendance/clock', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                            'Idempotency-Key': `att-${clockType}-${Math.floor(Date.now() / 5000)}`
                          },
                          body: JSON.stringify({
                            type: clockType,
                            lat,
                            lng,
                            biometricVerified: true,
                            note: clockType === 'KOREKSI' ? 'Koreksi absensi tugas luar' : undefined
                          })
                        });
                        const d = await res.json();
                        if (!res.ok || !d.success) {
                          toast.error(d.message);
                          return;
                        }
                        toast.success(`Presensi ${clockType} tercatat (${d.entry.distanceMeters} m dari RS).`);
                        fetchSectionData('absensi');
                      }}
                      className={`py-3 rounded-xl font-bold text-xs text-white transition cursor-pointer ${
                        clockType === 'MASUK'
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : clockType === 'PULANG'
                          ? 'bg-[#0B3D91] hover:bg-[#082D6E]'
                          : clockType === 'LEMBUR'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      Catat {clockType}
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <span className="text-slate-500 block">Tepat Waktu</span>
                    <span className="font-mono font-bold text-base">{attendanceData.monthlySummary.hadirTepatWaktu} hr</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <span className="text-slate-500 block">Terlambat</span>
                    <span className="font-mono font-bold text-base text-emerald-600">{attendanceData.monthlySummary.terlambat}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <span className="text-slate-500 block">Lembur</span>
                    <span className="font-mono font-bold text-base">{attendanceData.monthlySummary.lemburJam} jam</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h3 className="font-bold text-base">Riwayat Timesheet &amp; Kehadiran</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase">
                      <tr>
                        <th className="p-3">Waktu</th>
                        <th className="p-3">Tipe</th>
                        <th className="p-3">Metode &amp; Biometrik</th>
                        <th className="p-3">Jarak RS</th>
                        <th className="p-3">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {attendanceData.logs.map((l: any) => (
                        <tr key={l.id}>
                          <td className="p-3 font-mono whitespace-nowrap">{l.timestamp}</td>
                          <td className="p-3 font-bold">{l.type}</td>
                          <td className="p-3">{l.method}</td>
                          <td className="p-3 font-mono">{l.distanceMeters} m</td>
                          <td className="p-3 text-slate-500">{l.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 4. CUTI, IZIN & APPROVAL BERJENJANG */}
          {activeSection === 'cuti' && leavesData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                  <h2 className="font-bold text-base">Saldo Cuti Real-Time</h2>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 block">Sisa Cuti Tahunan</span>
                      <span className="font-mono font-bold text-2xl text-[#0B3D91] dark:text-sky-400">
                        {leavesData.balances.tahunanSisa} Hari
                      </span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-500 block">Izin Diklat</span>
                      <span className="font-mono font-bold text-2xl text-emerald-600">
                        {leavesData.balances.izinDiklatTersisa} Hari
                      </span>
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/gateway/leaves', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(leaveForm)
                    });
                    const d = await res.json();
                    if (d.success) {
                      toast.success('Pengajuan cuti masuk ke antrean Atasan Unit.');
                      fetchSectionData('cuti');
                    }
                  }}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
                >
                  <h3 className="font-bold text-sm">Ajukan Cuti / Izin Online</h3>
                  <select
                    value={leaveForm.type}
                    onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  >
                    <option>Cuti Tahunan</option>
                    <option>Cuti Sakit</option>
                    <option>Izin Pelatihan / Seminar</option>
                    <option>Izin Khusus</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={leaveForm.startDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                      className="px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                    />
                    <input
                      type="date"
                      value={leaveForm.endDate}
                      onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                      className="px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    value={leaveForm.substitute}
                    onChange={(e) => setLeaveForm({ ...leaveForm, substitute: e.target.value })}
                    placeholder="Petugas Pengganti Saat Cuti"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <input
                    type="text"
                    value={leaveForm.reason}
                    onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                    placeholder="Keterangan"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#0B3D91] text-white text-xs font-bold hover:bg-[#082D6E] cursor-pointer"
                  >
                    Kirim Pengajuan Cuti
                  </button>
                </form>
              </div>

              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h3 className="font-bold text-base">Pelacakan &amp; Approval Berjenjang (Atasan Unit → SDM)</h3>
                {leavesData.requests.map((lv: any) => (
                  <div key={lv.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-sm">{lv.employeeName}</p>
                        <p className="text-slate-500">{lv.type} · <span className="font-mono">{lv.startDate} s.d. {lv.endDate}</span> ({lv.days} hari)</p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded font-bold ${
                          lv.status === 'Disetujui Final'
                            ? 'bg-emerald-100 text-emerald-700'
                            : lv.status === 'Ditolak'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {lv.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">Pengganti: {lv.substitute} · Alasan: {lv.reason}</p>
                    {(lv.status === 'Menunggu Atasan Unit' || lv.status === 'Menunggu Verifikasi SDM') && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch('/api/gateway/leaves/approve', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ leaveId: lv.id, action: 'APPROVE' })
                            });
                            toast.success('Persetujuan tahap berikutnya dicatat.');
                            fetchSectionData('cuti');
                          }}
                          className="px-3 py-1.5 rounded bg-emerald-600 text-white font-bold cursor-pointer"
                        >
                          {lv.status === 'Menunggu Atasan Unit' ? 'Setujui Tahap 1 (Atasan Unit)' : 'Setujui Final Tahap 2 (SDM)'}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch('/api/gateway/leaves/approve', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ leaveId: lv.id, action: 'REJECT' })
                            });
                            toast.error('Pengajuan ditolak.');
                            fetchSectionData('cuti');
                          }}
                          className="px-3 py-1.5 rounded bg-rose-600 text-white font-bold cursor-pointer"
                        >
                          Tolak
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: 5. PAYROLL & KOMPENSASI */}
          {activeSection === 'payroll' && payrollData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-400">
                      SLIP GAJI DIGITAL TERENKRIPSI
                    </p>
                    <h2 className="text-lg font-extrabold mt-0.5">Periode {payrollData.currentSlip.periode}</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">
                    {payrollData.currentSlip.statusPembayaran}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Gaji Pokok &amp; Tunjangan Jabatan</span>
                    <span className="font-mono font-semibold tabular-nums">{formatRupiah(payrollData.currentSlip.gajiPokok)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Jasa Pelayanan / Remunerasi</span>
                    <span className="font-mono font-semibold tabular-nums">{formatRupiah(payrollData.currentSlip.jasaPelayanan)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">Tunjangan Shift &amp; Lembur</span>
                    <span className="font-mono font-semibold tabular-nums">{formatRupiah(payrollData.currentSlip.tunjanganShiftLembur)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-rose-600">
                    <span>Potongan BPJS Kesehatan &amp; TK</span>
                    <span className="font-mono font-semibold tabular-nums">-{formatRupiah(payrollData.currentSlip.potonganBpjs)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 text-rose-600">
                    <span>PPh 21</span>
                    <span className="font-mono font-semibold tabular-nums">-{formatRupiah(payrollData.currentSlip.potonganPajak)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-extrabold">
                    <span>Take Home Pay (Diterima)</span>
                    <span className="font-mono text-[#0B3D91] dark:text-sky-400 tabular-nums">
                      {formatRupiah(payrollData.currentSlip.takeHomePay)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <h3 className="font-bold text-base">Klaim Reimbursement &amp; Benefit</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!reimburseForm.title.trim()) {
                      toast.error('Judul klaim wajib diisi.');
                      return;
                    }
                    const res = await fetch('/api/gateway/payroll/reimburse', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(reimburseForm)
                    });
                    const d = await res.json();
                    if (d.success) {
                      toast.success('Klaim reimbursement dikirim ke Bagian Keuangan.');
                      setReimburseForm({ title: '', category: 'Diklat / SKP', amount: '750000' });
                      fetchSectionData('payroll');
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                >
                  <input
                    type="text"
                    value={reimburseForm.title}
                    onChange={(e) => setReimburseForm({ ...reimburseForm, title: e.target.value })}
                    placeholder="Nama Klaim / Biaya Diklat"
                    className="sm:col-span-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <input
                    type="number"
                    value={reimburseForm.amount}
                    onChange={(e) => setReimburseForm({ ...reimburseForm, amount: e.target.value })}
                    placeholder="Nominal"
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono"
                  />
                  <button
                    type="submit"
                    className="sm:col-span-3 py-2 rounded-lg bg-[#0B3D91] text-white text-xs font-bold hover:bg-[#082D6E] cursor-pointer"
                  >
                    Ajukan Reimbursement
                  </button>
                </form>

                <div className="space-y-2.5">
                  {payrollData.reimbursements.map((r: any) => (
                    <div key={r.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <div>
                        <p className="font-bold">{r.title}</p>
                        <p className="text-slate-500">{r.employeeName} · {r.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold">{formatRupiah(r.amount)}</p>
                        <span className="text-[11px] font-semibold text-emerald-600">{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 6. PENGETAHUAN & DIKLAT */}
          {activeSection === 'pelatihan' && trainingData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h2 className="font-bold text-base">Pustaka SOP Resmi &amp; Katalog Diklat Karyawan</h2>
                <div className="space-y-3">
                  {trainingData.courses.map((c: any) => (
                    <div key={c.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-mono font-bold text-[#0B3D91] dark:text-sky-400">{c.code} · {c.type} · {c.skp} SKP</span>
                        <p className="font-bold text-sm mt-0.5">{c.title}</p>
                        <p className="text-slate-500 mt-0.5">Penyelenggara: {c.unit}</p>
                      </div>
                      {c.enrolled ? (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold">
                          {c.status}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch('/api/gateway/training/enroll', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ courseId: c.id })
                            });
                            toast.success(`Terdaftar pada ${c.title}`);
                            fetchSectionData('pelatihan');
                          }}
                          className="px-3.5 py-2 rounded-lg bg-[#0B3D91] text-white font-bold cursor-pointer"
                        >
                          Daftar Pelatihan
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h3 className="font-bold text-base">Pelacakan Sertifikat Wajib</h3>
                {trainingData.certificates.map((cert: any) => (
                  <div key={cert.name} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <p className="font-bold">{cert.name}</p>
                    <p className="font-mono text-slate-500">Berlaku s.d. {cert.validUntil}</p>
                    <span className={`inline-block px-2 py-0.5 rounded font-bold ${cert.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                      {cert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: 7. KINERJA KPI & OPPE DOKTER */}
          {activeSection === 'kinerja' && performanceData && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-base">Penilaian Kinerja Individu ({performanceData.individualKpi.periode})</h2>
                    <p className="text-xs text-slate-500">{performanceData.individualKpi.predikat}</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 font-mono font-extrabold text-xl text-emerald-700 dark:text-emerald-300">
                    Skor: {performanceData.individualKpi.totalScore}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {performanceData.individualKpi.dimensions.map((d: any) => (
                    <div key={d.label} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                      <p className="text-xs font-semibold text-slate-500">{d.label}</p>
                      <p className="font-mono font-bold text-2xl tabular-nums">{d.score}%</p>
                      <p className="text-[11px] text-slate-500">Target {d.target}% · Bobot {d.weight}</p>
                    </div>
                  ))}
                </div>
              </div>

              {performanceData.oppeVisible && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-base">OPPE Dokter (Ongoing Professional Practice Evaluation)</h3>
                    <p className="text-xs text-slate-500">Pemantauan ALOS, mortalitas, kepatuhan formularium nasional, &amp; kelengkapan resume medis &lt; 24 jam.</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase">
                        <tr>
                          <th className="p-3">Dokter Spesialis</th>
                          <th className="p-3">KSM</th>
                          <th className="p-3">ALOS (Hari)</th>
                          <th className="p-3">Mortalitas</th>
                          <th className="p-3">Kepatuhan Fornas</th>
                          <th className="p-3">Resume &lt; 24 Jam</th>
                          <th className="p-3">Evaluasi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {performanceData.doctorOppeMetrics.map((op: any) => (
                          <tr key={op.doctor}>
                            <td className="p-3 font-bold">{op.doctor}</td>
                            <td className="p-3">{op.ksm}</td>
                            <td className="p-3 font-mono">{op.alosDays} hr</td>
                            <td className="p-3 font-mono">{op.mortalityRate}</td>
                            <td className="p-3 font-mono font-bold text-emerald-600">{op.fornasCompliance}</td>
                            <td className="p-3 font-mono font-bold text-[#0B3D91] dark:text-sky-400">{op.resumeUnder24h}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">{op.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION: 8. KOMUNIKASI & HANDOVER SBAR */}
          {activeSection === 'komunikasi' && sbarData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 space-y-4">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!sbarForm.situation.trim() || !sbarForm.recommendation.trim()) {
                      toast.error('Field Situation dan Recommendation pada handover SBAR wajib diisi.');
                      return;
                    }
                    const res = await fetch('/api/gateway/sbar', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(sbarForm)
                    });
                    const d = await res.json();
                    if (d.success) {
                      toast.success('Handover SBAR dicatat dan siap diverifikasi Karu.');
                      setSbarForm({
                        ...sbarForm,
                        situation: '',
                        background: '',
                        assessment: '',
                        recommendation: ''
                      });
                      fetchSectionData('komunikasi');
                    }
                  }}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
                >
                  <h2 className="font-bold text-base">Catat Handover Shift SBAR</h2>
                  <select
                    value={sbarForm.sessionType}
                    onChange={(e) => setSbarForm({ ...sbarForm, sessionType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  >
                    <option>Bedside Handover</option>
                    <option>Nurse Station (Terjadwal)</option>
                  </select>
                  <input
                    type="text"
                    value={sbarForm.patientLabel}
                    onChange={(e) => setSbarForm({ ...sbarForm, patientLabel: e.target.value })}
                    placeholder="Identitas Pasien / Bed Unit"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <input
                    type="text"
                    value={sbarForm.receiverName}
                    onChange={(e) => setSbarForm({ ...sbarForm, receiverName: e.target.value })}
                    placeholder="Nama Penerima Shift"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <textarea
                    rows={2}
                    value={sbarForm.situation}
                    onChange={(e) => setSbarForm({ ...sbarForm, situation: e.target.value })}
                    placeholder="S - Situation (Kondisi terkini pasien)..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <textarea
                    rows={2}
                    value={sbarForm.background}
                    onChange={(e) => setSbarForm({ ...sbarForm, background: e.target.value })}
                    placeholder="B - Background (Riwayat medis, alergi, terapi)..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <textarea
                    rows={2}
                    value={sbarForm.assessment}
                    onChange={(e) => setSbarForm({ ...sbarForm, assessment: e.target.value })}
                    placeholder="A - Assessment (TTV, skor klinis, hasil evaluasi)..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <textarea
                    rows={2}
                    value={sbarForm.recommendation}
                    onChange={(e) => setSbarForm({ ...sbarForm, recommendation: e.target.value })}
                    placeholder="R - Recommendation (Rencana tindak lanjut shift berikutnya)..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#0B3D91] text-white text-xs font-bold hover:bg-[#082D6E] cursor-pointer"
                  >
                    Simpan Handover SBAR
                  </button>
                </form>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-2.5">
                  <h3 className="font-bold text-sm">Pengumuman Resmi Rumah Sakit</h3>
                  {sbarData.announcements.map((a: any) => (
                    <div key={a.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <p className="font-bold">{a.title}</p>
                      <p className="text-slate-600 dark:text-slate-400">{a.summary}</p>
                      <p className="text-[11px] font-mono text-slate-400">{a.author} · {a.publishedAt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h3 className="font-bold text-base">Daftar Serah Terima SBAR &amp; Supervisi Kepala Ruang (Karu)</h3>
                <div className="space-y-3">
                  {sbarData.handovers.map((h: any) => (
                    <div key={h.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-mono font-bold text-[#0B3D91] dark:text-sky-400">{h.sessionType}</span>
                          <p className="font-bold text-sm mt-0.5">{h.patientLabel}</p>
                          <p className="text-slate-500">
                            {h.senderName} → {h.receiverName} · {h.createdAt}
                          </p>
                        </div>
                        {h.karuVerified ? (
                          <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 font-bold">
                            Terverifikasi Karu ({h.karuName})
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/gateway/sbar/verify', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ sbarId: h.id })
                              });
                              toast.success('Handover SBAR diverifikasi oleh Kepala Ruang.');
                              fetchSectionData('komunikasi');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                          >
                            Verifikasi Karu
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div><strong>S:</strong> {h.situation}</div>
                        <div><strong>B:</strong> {h.background}</div>
                        <div><strong>A:</strong> {h.assessment}</div>
                        <div><strong>R:</strong> {h.recommendation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 9. HELPDESK TI & HR */}
          {activeSection === 'helpdesk' && helpdeskData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5 space-y-4">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!helpdeskForm.subject.trim()) {
                      toast.error('Subjek tiket wajib diisi.');
                      return;
                    }
                    const res = await fetch('/api/gateway/helpdesk', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(helpdeskForm)
                    });
                    const d = await res.json();
                    if (d.success) {
                      toast.success(`Tiket ${d.ticket.ticketNo} diterbitkan.`);
                      setHelpdeskForm({ ...helpdeskForm, subject: '', description: '' });
                      fetchSectionData('helpdesk');
                    }
                  }}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
                >
                  <h2 className="font-bold text-base">Buat Tiket Helpdesk ITIL 4 (SLA Terukur)</h2>
                  <select
                    value={helpdeskForm.category}
                    onChange={(e) => setHelpdeskForm({ ...helpdeskForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  >
                    <option>TI / SIMK &amp; MFA</option>
                    <option>HR &amp; Absensi / Payroll</option>
                    <option>Instalasi Aplikasi Mobile</option>
                    <option>Sarana / Medis</option>
                  </select>
                  <select
                    value={helpdeskForm.priority}
                    onChange={(e) => setHelpdeskForm({ ...helpdeskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  >
                    <option>P1 - Kritis (15 Menit)</option>
                    <option>P2 - Tinggi (1 Jam)</option>
                    <option>P3 - Normal (4 Jam)</option>
                  </select>
                  <input
                    type="text"
                    value={helpdeskForm.subject}
                    onChange={(e) => setHelpdeskForm({ ...helpdeskForm, subject: e.target.value })}
                    placeholder="Judul Kendala"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <textarea
                    rows={3}
                    value={helpdeskForm.description}
                    onChange={(e) => setHelpdeskForm({ ...helpdeskForm, description: e.target.value })}
                    placeholder="Detail kendala operasional..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#0B3D91] text-white text-xs font-bold hover:bg-[#082D6E] cursor-pointer"
                  >
                    Kirim Tiket Dukungan
                  </button>
                </form>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-2">
                  <h3 className="font-bold text-sm">Kontak Darurat &amp; Service Desk</h3>
                  {helpdeskData.emergencyContacts.map((ec: any) => (
                    <div key={ec.label} className="text-xs py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <p className="font-bold">{ec.label}</p>
                      <p className="font-mono text-[#0B3D91] dark:text-sky-400">{ec.phone} · <span className="text-slate-500">{ec.sla}</span></p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
                <h3 className="font-bold text-base">Daftar Tiket Masuk (Portal &amp; Landing Page)</h3>
                <div className="space-y-3">
                  {helpdeskData.tickets.map((t: any) => (
                    <div key={t.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-mono font-bold text-[#0B3D91] dark:text-sky-400">
                          {t.ticketNo} · {t.priority}
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold ${t.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="font-bold text-sm">{t.subject}</p>
                      <p className="text-slate-600 dark:text-slate-400">{t.description}</p>
                      <div className="flex items-center justify-between pt-1 text-slate-500">
                        <span>{t.requesterName} ({t.divisionName}) · Sumber: {t.source}</span>
                        {t.status !== 'Selesai' && (
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/gateway/helpdesk/resolve', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ ticketId: t.id, status: 'Selesai' })
                              });
                              toast.success(`Tiket ${t.ticketNo} ditandai selesai.`);
                              fetchSectionData('helpdesk');
                            }}
                            className="text-[#0B3D91] dark:text-sky-400 font-bold hover:underline cursor-pointer"
                          >
                            Tandai Selesai
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION: 10. MODUL SPESIFIK 34 DIVISI */}
          {activeSection === 'division_workspace' && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-400">
                      MATRIKS 34 DIVISI · RBAC + ABAC
                    </p>
                    <h2 className="text-xl font-extrabold mt-0.5">{inspectedDivision.name}</h2>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl">{inspectedDivision.jobdeskSummary}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={inspectedDivisionId}
                      onChange={(e) => setInspectedDivisionId(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold outline-none"
                    >
                      {HOSPITAL_DIVISIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.category})
                        </option>
                      ))}
                    </select>

                    {inspectedDivision.simrsModuleId && (
                      <button
                        type="button"
                        onClick={() => navigate(`/modul/${inspectedDivision.simrsModuleId}`)}
                        className="inline-flex items-center gap-1.5 bg-[#0B3D91] hover:bg-[#082D6E] text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka SIMK Inti</span>
                      </button>
                    )}
                  </div>
                </div>

                {divisionWorkspace && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {divisionWorkspace.kpis.map((k: any) => (
                        <div key={k.label} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                          <p className="text-xs text-slate-500">{k.label}</p>
                          <p className="font-mono font-bold text-lg mt-0.5">{k.value}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{k.hint}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {divisionWorkspace.worklist.map((w: any) => (
                        <div key={w.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-bold text-[#0B3D91] dark:text-sky-400">{w.referenceCode}</span>
                            <span
                              className={`px-2 py-0.5 rounded font-bold ${
                                w.status.includes('Terkunci')
                                  ? 'bg-rose-100 text-rose-700'
                                  : w.status.includes('Selesai')
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-sky-100 text-sky-800'
                              }`}
                            >
                              {w.status}
                            </span>
                          </div>
                          <p className="font-bold text-sm">{w.moduleTitle}</p>
                          <p className="text-slate-500">{w.metricSummary} · Sensitivitas: {w.sensitivity}</p>
                          <button
                            type="button"
                            onClick={async () => {
                              const res = await fetch(`/api/gateway/divisions/${inspectedDivisionId}/action`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                body: JSON.stringify({ taskId: w.id, newStatus: 'Selesai Diverifikasi Unit' })
                              });
                              const d = await res.json();
                              if (!res.ok || !d.success) {
                                toast.error(d.message);
                                return;
                              }
                              toast.success(`${w.moduleTitle} diperbarui.`);
                              fetchSectionData('division_workspace');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white font-bold hover:opacity-90 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Proses / Verifikasi Item</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* SECTION: 11. AREA ADMIN & TATA KELOLA */}
          {activeSection === 'admin_area' && (
            <EmployeeAdminArea
              token={token}
              currentRoleTitle={session.roleTitle}
              onPolicyUpdated={() => loadBootstrap(token)}
            />
          )}
        </main>
      </div>

      {/* Break-Glass Justification Modal */}
      {breakGlassModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <h3>Aktivasi Darurat Break-Glass (PMK 24/2022)</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Membuka paksa akses EMR klinis saat darurat nyawa meski atribut ABAC belum terpenuhi. Seluruh aksi akan direkam secara immutable ke Audit SIEM &amp; dilaporkan ke DPO.
            </p>
            <div>
              <label className="block text-xs font-bold mb-1">Justifikasi Medis Wajib *</label>
              <textarea
                rows={3}
                value={breakGlassReason}
                onChange={(e) => setBreakGlassReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBreakGlassModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!breakGlassReason.trim()) {
                    toast.error('Alasan Break-Glass wajib diisi.');
                    return;
                  }
                  setBreakGlassModalOpen(false);
                  handleUpdateAbac({ breakGlassActive: true, breakGlassReason });
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold cursor-pointer"
              >
                Aktifkan &amp; Catat di Audit SIEM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
