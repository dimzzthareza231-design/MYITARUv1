import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  MapPin,
  CalendarClock,
  MessageSquare,
  Wallet,
  Fingerprint,
  Wifi,
  WifiOff,
  RefreshCw,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { HOSPITAL_DIVISIONS } from '../../data/employeePortalCatalog';

type MobileTab = 'absensi' | 'shift' | 'sbar' | 'cuti_slip';

interface OfflineAttendanceQueueItem {
  id: string;
  idempotencyKey: string;
  type: 'MASUK' | 'PULANG' | 'LEMBUR';
  capturedAt: string;
  distanceMeters: number;
  note: string;
}

const OFFLINE_QUEUE_KEY = 'myitaru_emp_offline_attendance_queue';

export const EmployeeMobileApp: React.FC = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('myitaru_emp_token'));
  const [activeTab, setActiveTab] = useState<MobileTab>('absensi');

  // Quick Mobile Login + MFA state
  const [selectedDivId, setSelectedDivId] = useState('keperawatan');
  const [nipInput, setNipInput] = useState('');
  const [mfaChallenge, setMfaChallenge] = useState<{ challengeId: string; demoOtpHint: string; name: string } | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Runtime state
  const [bootstrap, setBootstrap] = useState<any>(null);
  const [attendance, setAttendance] = useState<any>(null);
  const [shifts, setShifts] = useState<any>(null);
  const [sbarData, setSbarData] = useState<any>(null);
  const [leavesData, setLeavesData] = useState<any>(null);
  const [payrollData, setPayrollData] = useState<any>(null);

  // Offline Attendance Mode & Queue
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineAttendanceQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
    } catch {
      // Ignore storage quota errors
    }
  }, [offlineQueue]);

  // Quick SBAR & Leave forms
  const [sbarQuick, setSbarQuick] = useState({
    patientLabel: 'Tn. Ahmad Subarjo · Bed M-302',
    receiverName: 'Perawat Shift Pengganti',
    situation: '',
    recommendation: ''
  });
  const [leaveQuick, setLeaveQuick] = useState({
    type: 'Cuti Tahunan',
    startDate: '2026-04-29',
    days: 1,
    reason: 'Keperluan keluarga'
  });

  const loadAllMobileData = useCallback(async (activeToken: string) => {
    const headers = { Authorization: `Bearer ${activeToken}` };
    try {
      const bRes = await fetch('/api/gateway/bootstrap', { headers });
      if (bRes.status === 401) {
        sessionStorage.removeItem('myitaru_emp_token');
        setToken(null);
        return;
      }
      const bData = await bRes.json();
      if (bData.success) setBootstrap(bData);

      const [aRes, shRes, sbRes, lRes, pRes] = await Promise.all([
        fetch('/api/gateway/attendance', { headers }),
        fetch('/api/gateway/shifts', { headers }),
        fetch('/api/gateway/sbar', { headers }),
        fetch('/api/gateway/leaves', { headers }),
        fetch('/api/gateway/payroll', { headers })
      ]);
      const [aData, shData, sbData, lData, pData] = await Promise.all([
        aRes.json(),
        shRes.json(),
        sbRes.json(),
        lRes.json(),
        pRes.json()
      ]);
      if (aData.success) setAttendance(aData);
      if (shData.success) setShifts(shData);
      if (sbData.success) setSbarData(sbData);
      if (lData.success) setLeavesData(lData);
      if (pData.success) setPayrollData(pData);
    } catch {
      toast.error('Koneksi ke API Gateway terganggu.');
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadAllMobileData(token);
    }
  }, [token, loadAllMobileData]);

  const handleMobileLogin = async (authType: 'nip' | 'google') => {
    setAuthLoading(true);
    try {
      const res = await fetch('/api/gateway/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: nipInput.trim() || undefined,
          divisionId: nipInput.trim() ? undefined : selectedDivId,
          authType,
          deviceInfo: 'MYITARU Staff Mobile PWA'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Gagal masuk.');
        return;
      }
      if (data.mfaRequired) {
        setMfaChallenge({
          challengeId: data.challengeId,
          demoOtpHint: data.demoOtpHint,
          name: data.userPreview.name
        });
        setOtpInput(data.demoOtpHint);
      } else {
        sessionStorage.setItem('myitaru_emp_token', data.token);
        setToken(data.token);
        toast.success(`Masuk sebagai ${data.session.name}`);
      }
    } catch {
      toast.error('Gagal menghubungi API Gateway.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyMobileMfa = async (e: React.FormEvent) => {
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
          deviceName: 'Smartphone Karyawan (PWA)'
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'OTP salah.');
        return;
      }
      sessionStorage.setItem('myitaru_emp_token', data.token);
      setMfaChallenge(null);
      setToken(data.token);
      toast.success('MFA & Device Binding berhasil!');
    } catch {
      toast.error('Gagal verifikasi MFA.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleClockMobile = async (type: 'MASUK' | 'PULANG' | 'LEMBUR') => {
    if (offlineMode) {
      const queuedItem: OfflineAttendanceQueueItem = {
        id: 'off-' + Date.now(),
        idempotencyKey: `mob-off-${type}-${Date.now()}`,
        type,
        capturedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        distanceMeters: 38,
        note: `Offline Mobile (${type}) terenkripsi lokal`
      };
      setOfflineQueue((prev) => [queuedItem, ...prev]);
      toast.success(`Mode Offline: Presensi ${type} disimpan ke antrean lokal perangkat.`);
      return;
    }

    if (!token || !attendance) return;
    const res = await fetch('/api/gateway/attendance/clock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Idempotency-Key': `mob-${type}-${Math.floor(Date.now() / 5000)}`
      },
      body: JSON.stringify({
        type,
        lat: attendance.geofence.lat,
        lng: attendance.geofence.lng,
        biometricVerified: true,
        note: 'Presensi Biometrik Mobile App'
      })
    });
    const d = await res.json();
    if (d.success) {
      toast.success(`Presensi Biometrik ${type} tercatat (${d.entry.distanceMeters} m).`);
      loadAllMobileData(token);
    } else {
      toast.error(d.message || 'Gagal mencatat presensi.');
    }
  };

  const handleSyncOfflineQueue = async () => {
    if (!token || offlineQueue.length === 0) return;
    try {
      const res = await fetch('/api/gateway/attendance/sync-offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items: offlineQueue })
      });
      const d = await res.json();
      if (d.success) {
        setOfflineQueue([]);
        setOfflineMode(false);
        toast.success(`${d.syncedCount} presensi offline berhasil disinkronkan secara idempoten.`);
        loadAllMobileData(token);
      } else {
        toast.error(d.message);
      }
    } catch {
      toast.error('Gagal menyinkronkan antrean offline.');
    }
  };

  const formatRupiah = (n: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex justify-center">
      {/* Mobile Shell Container (Max 480px centered cleanly on desktop, full width on phone) */}
      <div className="w-full max-w-[480px] min-h-screen bg-white dark:bg-slate-900 shadow-xl border-x border-slate-200 dark:border-slate-800 flex flex-col relative pb-20">
        {/* Top App Bar */}
        <header className="bg-[#0B3D91] text-white px-4 py-3.5 flex items-center justify-between gap-3 sticky top-0 z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/app-karyawan')}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
              title="Kembali ke Halaman Unduh Aplikasi"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <p className="font-extrabold text-sm leading-tight truncate">MYITARU Staff Mobile</p>
              <p className="text-[11px] text-sky-200 truncate">
                {bootstrap ? `${bootstrap.session.name}` : 'Aplikasi Operasional Karyawan 24 Jam'}
              </p>
            </div>
          </div>

          {token && (
            <button
              type="button"
              onClick={() => {
                sessionStorage.removeItem('myitaru_emp_token');
                setToken(null);
                setBootstrap(null);
                toast.success('Keluar dari App Mobile.');
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </header>

        {/* LOGIN GATE ON MOBILE */}
        {!token ? (
          <div className="p-5 space-y-5 flex-1 flex flex-col justify-center">
            {!mfaChallenge ? (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D91] dark:text-sky-400">
                    ONBOARDING APLIKASI KARYAWAN
                  </p>
                  <h1 className="text-xl font-extrabold">Masuk untuk Absensi &amp; Shift</h1>
                  <p className="text-xs text-slate-500">
                    Pilih divisi/unit atau masukkan NIP, lalu selesaikan verifikasi MFA 6-digit.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={authLoading}
                  onClick={() => handleMobileLogin('google')}
                  className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0B3D91] dark:text-sky-400" />
                  <span>Lanjutkan dengan Akun Google RS</span>
                </button>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Divisi / Unit Bertugas</label>
                    <select
                      value={selectedDivId}
                      onChange={(e) => setSelectedDivId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                    >
                      {HOSPITAL_DIVISIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.defaultStaffName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">NIP (opsional)</label>
                    <input
                      type="text"
                      value={nipInput}
                      onChange={(e) => setNipInput(e.target.value)}
                      placeholder="Kosongkan untuk demo divisi terpilih"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={authLoading}
                    onClick={() => handleMobileLogin('nip')}
                    className="w-full py-3 rounded-xl bg-[#0B3D91] text-white font-bold text-sm cursor-pointer"
                  >
                    {authLoading ? 'Menghubungkan...' : 'Masuk Aplikasi Mobile'}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleVerifyMobileMfa} className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-extrabold">Verifikasi OTP MFA (6-Digit)</h2>
                <p className="text-xs text-slate-500">
                  Akun: <strong>{mfaChallenge.name}</strong>. Kode demo: <strong className="font-mono">{mfaChallenge.demoOtpHint}</strong>
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-xl tracking-[0.4em] text-center"
                  required
                />
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm cursor-pointer"
                >
                  Verifikasi &amp; Ikat Perangkat
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4 flex-1">
            {/* TAB 1: ABSENSI GEOFENCE + OFFLINE SYNC */}
            {activeTab === 'absensi' && attendance && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      {offlineMode ? (
                        <WifiOff className="w-4 h-4 text-amber-600" />
                      ) : (
                        <Wifi className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>{offlineMode ? 'Mode Offline Aktif (Simpan Lokal)' : 'Online · API Gateway Terhubung'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOfflineMode((v) => !v)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        offlineMode ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {offlineMode ? 'Matikan Offline' : 'Simulasi Offline'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500">
                    Lokasi terdeteksi di dalam radius <strong>{attendance.geofence.name}</strong> (38m / maks {attendance.geofence.radiusMeters}m).
                  </p>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleClockMobile('MASUK')}
                      className="py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Fingerprint className="w-4 h-4" />
                      <span>Clock-In (Biometrik)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClockMobile('PULANG')}
                      className="py-3.5 rounded-xl bg-[#0B3D91] hover:bg-[#082D6E] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Fingerprint className="w-4 h-4" />
                      <span>Clock-Out</span>
                    </button>
                  </div>
                </div>

                {offlineQueue.length > 0 && (
                  <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-800 dark:text-amber-300">
                        Antrean Presensi Offline ({offlineQueue.length} item)
                      </span>
                      <button
                        type="button"
                        onClick={handleSyncOfflineQueue}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Sinkronkan Idempoten</span>
                      </button>
                    </div>
                    {offlineQueue.map((q) => (
                      <div key={q.id} className="font-mono text-[11px] text-amber-900 dark:text-amber-200">
                        • {q.type} · {q.capturedAt} ({q.idempotencyKey.slice(0, 14)}...)
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Log Presensi Terkini</h3>
                  {attendance.logs.slice(0, 6).map((l: any) => (
                    <div key={l.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold">{l.type} · {l.method}</p>
                        <p className="font-mono text-[11px] text-slate-500">{l.timestamp}</p>
                      </div>
                      <span className="font-mono font-semibold text-emerald-600">{l.distanceMeters} m</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: SHIFT & TUKAR SHIFT */}
            {activeTab === 'shift' && shifts && (
              <div className="space-y-3">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between text-xs">
                  <span className="font-semibold">Total Jam Kerja Minggu Ini</span>
                  <span className="font-mono font-bold text-[#0B3D91] dark:text-sky-400">
                    {shifts.totalWeeklyHours} / {shifts.maxLegalWeeklyHours} Jam
                  </span>
                </div>

                {shifts.shifts.map((s: any) => (
                  <div key={s.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold">{s.dayLabel}, <span className="font-mono">{s.date}</span></p>
                      <p className="text-[#0B3D91] dark:text-sky-400 font-semibold mt-0.5">{s.shiftType}</p>
                    </div>
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold">{s.hours} jam</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: HANDOVER SBAR CEPAT */}
            {activeTab === 'sbar' && sbarData && (
              <div className="space-y-4">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!sbarQuick.situation.trim() || !sbarQuick.recommendation.trim()) {
                      toast.error('Situation dan Recommendation SBAR wajib diisi.');
                      return;
                    }
                    const res = await fetch('/api/gateway/sbar', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({
                        sessionType: 'Bedside Handover',
                        receiverName: sbarQuick.receiverName,
                        patientLabel: sbarQuick.patientLabel,
                        situation: sbarQuick.situation,
                        background: 'Input cepat via App Mobile Karyawan',
                        assessment: 'TTV termonitor di bedside',
                        recommendation: sbarQuick.recommendation
                      })
                    });
                    const d = await res.json();
                    if (d.success) {
                      toast.success('SBAR dikirim & tersinkronisasi ke Portal Unit.');
                      setSbarQuick({ ...sbarQuick, situation: '', recommendation: '' });
                      loadAllMobileData(token);
                    }
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-2.5 text-xs"
                >
                  <p className="font-bold text-sm">Catat SBAR Bedside Cepat</p>
                  <input
                    type="text"
                    value={sbarQuick.patientLabel}
                    onChange={(e) => setSbarQuick({ ...sbarQuick, patientLabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                  <textarea
                    rows={2}
                    value={sbarQuick.situation}
                    onChange={(e) => setSbarQuick({ ...sbarQuick, situation: e.target.value })}
                    placeholder="S - Kondisi pasien saat serah terima..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                  <textarea
                    rows={2}
                    value={sbarQuick.recommendation}
                    onChange={(e) => setSbarQuick({ ...sbarQuick, recommendation: e.target.value })}
                    placeholder="R - Rencana & instruksi shift berikutnya..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#0B3D91] text-white font-bold cursor-pointer"
                  >
                    Kirim SBAR
                  </button>
                </form>

                <div className="space-y-2.5">
                  {sbarData.handovers.slice(0, 4).map((h: any) => (
                    <div key={h.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold">{h.patientLabel}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${h.karuVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'}`}>
                          {h.karuVerified ? 'Verifikasi Karu' : 'Pending Karu'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400">S: {h.situation}</p>
                      <p className="text-slate-600 dark:text-slate-400">R: {h.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: CUTI & SLIP GAJI */}
            {activeTab === 'cuti_slip' && payrollData && leavesData && (
              <div className="space-y-4">
                <div className="rounded-xl bg-[#0B3D91] text-white p-4 space-y-1.5">
                  <p className="text-[11px] uppercase tracking-wider text-sky-200">
                    SLIP GAJI {payrollData.currentSlip.periode}
                  </p>
                  <p className="font-mono font-extrabold text-2xl tabular-nums">
                    {formatRupiah(payrollData.currentSlip.takeHomePay)}
                  </p>
                  <p className="text-xs text-blue-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{payrollData.currentSlip.statusPembayaran}</span>
                  </p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/gateway/leaves', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify(leaveQuick)
                    });
                    const d = await res.json();
                    if (d.success) {
                      toast.success('Cuti diajukan dari App Mobile.');
                      loadAllMobileData(token);
                    }
                  }}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Ajukan Cuti Cepat</span>
                    <span className="font-mono font-bold text-[#0B3D91] dark:text-sky-400">
                      Sisa: {leavesData.balances.tahunanSisa} Hari
                    </span>
                  </div>
                  <select
                    value={leaveQuick.type}
                    onChange={(e) => setLeaveQuick({ ...leaveQuick, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  >
                    <option>Cuti Tahunan</option>
                    <option>Cuti Sakit</option>
                    <option>Izin Pelatihan / Seminar</option>
                  </select>
                  <input
                    type="date"
                    value={leaveQuick.startDate}
                    onChange={(e) => setLeaveQuick({ ...leaveQuick, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-[#0B3D91] text-white font-bold cursor-pointer"
                  >
                    Ajukan Cuti
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => navigate('/portal-karyawan')}
                  className="w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Buka Portal Karyawan Lengkap (Desktop View)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Fixed Bottom Thumb Navigation */}
        {token && (
          <nav className="fixed bottom-0 w-full max-w-[480px] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 z-30">
            {[
              { id: 'absensi', label: 'Absensi', icon: MapPin },
              { id: 'shift', label: 'Shift', icon: CalendarClock },
              { id: 'sbar', label: 'SBAR', icon: MessageSquare },
              { id: 'cuti_slip', label: 'Cuti & Slip', icon: Wallet }
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as MobileTab)}
                  className={`py-2.5 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold cursor-pointer ${
                    active ? 'text-[#0B3D91] dark:text-sky-400' : 'text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
};
