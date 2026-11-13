import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  Users,
  ShieldAlert,
  Sliders,
  CheckSquare,
  Cable,
  ScrollText,
  RefreshCw,
  UserPlus,
  CheckCircle2,
  XCircle,
  Lock,
  Activity
} from 'lucide-react';
import { HOSPITAL_DIVISIONS } from '../../data/employeePortalCatalog';

interface AdminAreaProps {
  token: string;
  currentRoleTitle: string;
  onPolicyUpdated?: () => void;
}

type AdminSubTab = 'users' | 'rbac_abac' | 'flags_content' | 'approvals' | 'integrations' | 'siem';

export const EmployeeAdminArea: React.FC<AdminAreaProps> = ({ token, onPolicyUpdated }) => {
  const [subTab, setSubTab] = useState<AdminSubTab>('approvals');
  const [loading, setLoading] = useState(true);
  const [adminState, setAdminState] = useState<any>(null);
  const [forbiddenMsg, setForbiddenMsg] = useState<string | null>(null);

  // Add user modal/form inline
  const [newUser, setNewUser] = useState({ name: '', nip: '', divisionId: HOSPITAL_DIVISIONS[0].id });
  const [newBanner, setNewBanner] = useState({ title: '', category: 'Tata Kelola & Operasional', summary: '' });
  const [siemFilter, setSiemFilter] = useState<string>('ALL');

  const fetchAdminState = useCallback(async () => {
    setLoading(true);
    setForbiddenMsg(null);
    try {
      const res = await fetch('/api/gateway/admin/state', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setForbiddenMsg(data.message || 'Area Admin membutuhkan role Administrator / Direksi / SPI / Hukum.');
        setAdminState(null);
      } else {
        setAdminState(data);
      }
    } catch {
      toast.error('Gagal memuat Area Admin dari API Gateway.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAdminState();
  }, [fetchAdminState]);

  const handleHrisSync = async () => {
    try {
      const res = await fetch('/api/gateway/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'HRIS_SYNC' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Sinkronisasi direktori pegawai dari HRIS berhasil.');
        fetchAdminState();
      }
    } catch {
      toast.error('Gagal sinkronisasi HRIS.');
    }
  };

  const handleToggleUser = async (userId: string) => {
    try {
      const res = await fetch('/api/gateway/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'TOGGLE_ACTIVE', userId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Status akun ${data.user.name} diperbarui.`);
        fetchAdminState();
      }
    } catch {
      toast.error('Gagal mengubah status akun.');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.nip.trim()) {
      toast.error('Nama dan NIP wajib diisi.');
      return;
    }
    try {
      const res = await fetch('/api/gateway/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'CREATE', ...newUser })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Akun ${data.user.name} berhasil ditambahkan ke HRIS Gateway.`);
        setNewUser({ name: '', nip: '', divisionId: HOSPITAL_DIVISIONS[0].id });
        fetchAdminState();
      }
    } catch {
      toast.error('Gagal menambah pegawai.');
    }
  };

  const handleProposeChange = async (
    category: 'FEATURE_FLAG' | 'ABAC_POLICY' | 'PORTAL_CONTENT',
    title: string,
    targetKey: string,
    proposedValue: unknown,
    justification: string
  ) => {
    try {
      const res = await fetch('/api/gateway/admin/propose-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, title, targetKey, proposedValue, justification })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Usulan perubahan dibuat (PENDING_REVIEW). Lanjutkan persetujuan di tab Persetujuan Perubahan.');
        fetchAdminState();
        setSubTab('approvals');
      }
    } catch {
      toast.error('Gagal mengajukan perubahan.');
    }
  };

  const handleReviewChange = async (proposalId: string, decision: 'APPROVE' | 'REJECT') => {
    try {
      const res = await fetch('/api/gateway/admin/review-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          proposalId,
          decision,
          reviewNote:
            decision === 'APPROVE'
              ? 'Lolos verifikasi kepatuhan UU PDP, PMK 24/2022 & COBIT 2019'
              : 'Ditolak oleh Reviewer Keamanan / DPO'
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          decision === 'APPROVE'
            ? 'Perubahan disetujui, diterapkan secara atomik, & tercatat di Changelog.'
            : 'Usulan perubahan ditolak.'
        );
        fetchAdminState();
        onPolicyUpdated?.();
      }
    } catch {
      toast.error('Gagal memproses persetujuan perubahan.');
    }
  };

  const handleTestIntegration = async (integrationId: string) => {
    try {
      const res = await fetch('/api/gateway/admin/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ integrationId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${data.integration.name}: Terhubung (${data.integration.latencyMs}ms, Queue bersih).`);
        fetchAdminState();
      }
    } catch {
      toast.error('Gagal menguji endpoint integrasi.');
    }
  };

  if (loading && !adminState) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-sm text-slate-500">
        Memuat Area Admin &amp; Tata Kelola melalui API Gateway...
      </div>
    );
  }

  if (forbiddenMsg) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400 font-bold text-base">
          <Lock className="w-5 h-5" />
          <span>Otorisasi Area Admin Dibatasi (RBAC + COBIT 2019)</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{forbiddenMsg}</p>
        <p className="text-xs text-slate-500">
          Untuk menguji Area Admin &amp; Alur Approval Perubahan, beralihlah ke persona divisi <strong>Unit SIMK / TI</strong>, <strong>Bagian SDM &amp; Umum</strong>, <strong>Direktur</strong>, <strong>SPI</strong>, atau <strong>Hukum &amp; Etik</strong>.
        </p>
      </div>
    );
  }

  const pendingProposalsCount =
    adminState?.proposals?.filter((p: any) => p.status === 'PENDING_REVIEW').length || 0;

  return (
    <div className="space-y-5">
      {/* Top KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500">Pegawai Aktif (HRIS)</p>
          <p className="font-mono font-bold text-2xl tabular-nums mt-1">
            {adminState.analyticsSummary.totalActiveEmployees}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500">Divisi &amp; Unit Tercakup</p>
          <p className="font-mono font-bold text-2xl tabular-nums mt-1">
            {adminState.analyticsSummary.divisionsCovered}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500">Antrean Approval</p>
          <p className="font-mono font-bold text-2xl tabular-nums mt-1 text-amber-600">
            {adminState.analyticsSummary.pendingApprovals}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <p className="text-xs text-slate-500">Skor Kepatuhan Tata Kelola</p>
          <p className="font-mono font-bold text-2xl tabular-nums mt-1 text-emerald-600">
            {adminState.analyticsSummary.complianceScore}
          </p>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'approvals', label: `Persetujuan Perubahan (${pendingProposalsCount})`, icon: CheckSquare },
          { id: 'users', label: 'Manajemen User & HRIS', icon: Users },
          { id: 'rbac_abac', label: 'Matriks RBAC & Aturan ABAC', icon: ShieldAlert },
          { id: 'flags_content', label: 'Feature Flags & Konten', icon: Sliders },
          { id: 'integrations', label: 'Monitor Integrasi & Queue', icon: Cable },
          { id: 'siem', label: 'Audit Trail SIEM Immutable', icon: ScrollText }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubTab(t.id as AdminSubTab)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                subTab === t.id
                  ? 'bg-[#0B3D91] text-white'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab 1: Config Change Approval Workflow & Changelog */}
      {subTab === 'approvals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Antrean Persetujuan Perubahan (ITIL 4 Change Management)</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pemisahan tugas: Admin mengusulkan perubahan, Reviewer Keamanan/Kepatuhan menyetujui sebelum aktif.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchAdminState}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                title="Segarkan"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {adminState.proposals.map((prop: any) => (
                <div
                  key={prop.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-2.5 bg-slate-50/70 dark:bg-slate-950/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#0B3D91] dark:text-sky-400">
                      {prop.id} · {prop.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                        prop.status === 'PENDING_REVIEW'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          : prop.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}
                    >
                      {prop.status}
                    </span>
                  </div>
                  <p className="font-bold text-sm">{prop.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{prop.justification}</p>
                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-3">
                    <span>Pengusul: {prop.proposedBy}</span>
                    <span>Target: <code className="font-mono">{prop.targetKey} = {JSON.stringify(prop.proposedValue)}</code></span>
                  </div>

                  {prop.status === 'PENDING_REVIEW' ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleReviewChange(prop.id, 'APPROVE')}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Setujui &amp; Terapkan (Reviewer)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReviewChange(prop.id, 'REJECT')}
                        className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 pt-1">
                      Direview oleh: <strong>{prop.reviewedBy}</strong> ({prop.reviewedAt}) — {prop.reviewNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-base">Changelog Tata Kelola Permanen</h3>
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {adminState.changelog.map((cl: any) => (
                <div key={cl.id} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{cl.appliedAt}</span>
                    <span>{cl.category}</span>
                  </div>
                  <p className="font-bold text-xs">{cl.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{cl.summary}</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Disetujui: {cl.approvedBy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Users & HRIS */}
      {subTab === 'users' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base">Direktori Akun Pegawai (Sumber Kebenaran: HRIS)</h3>
                <p className="text-xs text-slate-500">Semua 34 divisi terpetakan otomatis ke peran RBAC dan sensitivitas ABAC.</p>
              </div>
              <button
                type="button"
                onClick={handleHrisSync}
                className="inline-flex items-center gap-2 bg-[#0B3D91] hover:bg-[#082D6E] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sinkronisasi Sekarang dari HRIS</span>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Nama Lengkap & Gelar"
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
              />
              <input
                type="text"
                value={newUser.nip}
                onChange={(e) => setNewUser({ ...newUser, nip: e.target.value })}
                placeholder="NIP (mis: NIP-19950101-888)"
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono outline-none"
              />
              <select
                value={newUser.divisionId}
                onChange={(e) => setNewUser({ ...newUser, divisionId: e.target.value })}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none"
              >
                {HOSPITAL_DIVISIONS.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tambah Akun Pegawai</span>
              </button>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase">
                  <tr>
                    <th className="p-3">NIP</th>
                    <th className="p-3">Nama Pegawai</th>
                    <th className="p-3">Divisi / Unit</th>
                    <th className="p-3">Peran RBAC</th>
                    <th className="p-3">Klinis / Admin</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {adminState.users.slice(0, 18).map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono">{u.nip}</td>
                      <td className="p-3 font-semibold">{u.name}</td>
                      <td className="p-3">{u.divisionName}</td>
                      <td className="p-3 font-mono text-[11px]">{u.portalRole}</td>
                      <td className="p-3">{u.isClinical ? 'Klinis' : u.isAdminCapable ? 'Admin / Pimpinan' : 'Operasional'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {u.active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleToggleUser(u.id)}
                          className="text-xs font-semibold text-[#0B3D91] dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          {u.active ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: RBAC Matrix & ABAC Policies */}
      {subTab === 'rbac_abac' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-base">Kebijakan Atribut ABAC (Ajukan Perubahan via Reviewer)</h3>
            <div className="space-y-3">
              {[
                { key: 'requireOnDutyForClinicalEmr', label: 'Wajib Status On-Duty untuk Akses EMR Klinis' },
                { key: 'requireUnitMatchForSensitiveActions', label: 'Wajib Kesesuaian Lokasi Unit Bertugas' },
                { key: 'requireCareRelationshipForPatientRecords', label: 'Wajib Relasi Perawatan Aktif (DPJP/Perawat)' },
                { key: 'allowBreakGlassWithAudit', label: 'Izinkan Darurat Break-Glass dengan Audit Wajib' },
                { key: 'enforce40HourShiftCap', label: 'Deteksi & Peringatan Batas Shift 40 Jam/Minggu' },
                { key: 'mfaRequiredForClinicalAndAdmin', label: 'Wajib MFA 6-Digit untuk Role Klinis & Admin' }
              ].map((rule) => {
                const enabled = Boolean(adminState.abacPolicies[rule.key]);
                return (
                  <div key={rule.key} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div>
                      <p className="text-xs font-bold">{rule.label}</p>
                      <p className="text-[11px] font-mono text-slate-500">{rule.key}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleProposeChange(
                          'ABAC_POLICY',
                          `${enabled ? 'Nonaktifkan' : 'Aktifkan'} ${rule.label}`,
                          rule.key,
                          !enabled,
                          'Penyesuaian kebijakan kontrol akses kontekstual ABAC oleh Administrator.'
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                        enabled
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {enabled ? 'Aktif (Usul Ubah)' : 'Nonaktif (Usul Ubah)'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-base">Matriks Otorisasi Role (RBAC)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase">
                  <tr>
                    <th className="p-2.5">Peran</th>
                    <th className="p-2.5">Approve Cuti Unit</th>
                    <th className="p-2.5">OPPE Dokter</th>
                    <th className="p-2.5">Area Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {Object.entries(adminState.rbacMatrix).map(([key, val]: [string, any]) => (
                    <tr key={key}>
                      <td className="p-2.5">
                        <p className="font-bold">{val.label}</p>
                        <p className="font-mono text-[10px] text-slate-500">{key}</p>
                      </td>
                      <td className="p-2.5">{val.canApproveUnitLeave ? 'Ya' : 'Tidak'}</td>
                      <td className="p-2.5">{val.canViewOppe ? 'Ya' : 'Tidak'}</td>
                      <td className="p-2.5">{val.canAccessAdminArea ? 'Ya' : 'Tidak'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Feature Flags & Portal Content */}
      {subTab === 'flags_content' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <h3 className="font-bold text-base">Feature Flags Modul Portal (Approval Wajib)</h3>
            {Object.entries(adminState.featureFlags).map(([flagKey, flag]: [string, any]) => (
              <div key={flagKey} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm">{flag.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{flag.description}</p>
                  <p className="text-[11px] font-mono text-[#0B3D91] dark:text-sky-400 mt-1">Cakupan: {flag.targetScope}</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleProposeChange(
                      'FEATURE_FLAG',
                      `${flag.enabled ? 'Matikan' : 'Aktifkan'} Feature Flag: ${flag.label}`,
                      flagKey,
                      !flag.enabled,
                      `Pengaturan rollout fitur ${flagKey} untuk ${flag.targetScope}.`
                    )
                  }
                  className={`px-3 py-2 rounded-lg text-xs font-bold shrink-0 cursor-pointer ${
                    flag.enabled ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'
                  }`}
                >
                  {flag.enabled ? 'AKTIF (Usul Ubah)' : 'MATI (Usul Ubah)'}
                </button>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <h3 className="font-bold text-base">Publikasi Pengumuman Portal Karyawan</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newBanner.title}
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                placeholder="Judul Pengumuman Resmi"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none"
              />
              <textarea
                rows={3}
                value={newBanner.summary}
                onChange={(e) => setNewBanner({ ...newBanner, summary: e.target.value })}
                placeholder="Ringkasan kebijakan atau edaran internal RS..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newBanner.title.trim()) {
                    toast.error('Judul pengumuman wajib diisi.');
                    return;
                  }
                  handleProposeChange(
                    'PORTAL_CONTENT',
                    `Publikasi Pengumuman: ${newBanner.title}`,
                    'portalAnnouncements',
                    newBanner,
                    'Edaran internal resmi untuk seluruh divisi rumah sakit.'
                  );
                  setNewBanner({ title: '', category: 'Tata Kelola & Operasional', summary: '' });
                }}
                className="w-full py-2.5 rounded-lg bg-[#0B3D91] text-white text-xs font-bold hover:bg-[#082D6E] cursor-pointer"
              >
                Ajukan Publikasi Konten ke Reviewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 5: Integrations & Async Message Queue */}
      {subTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adminState.integrations.map((intg: any) => (
            <div
              key={intg.id}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-sm">{intg.name}</p>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">{intg.protocol}</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">
                  {intg.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 block">Latensi</span>
                  <span className="font-mono font-bold tabular-nums">{intg.latencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Antrean Queue</span>
                  <span className="font-mono font-bold tabular-nums">{intg.queueDepth} pesan</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Idempotency</span>
                  <span className="font-mono font-bold text-emerald-600">{intg.idempotencyRate}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-slate-500">Sync: {intg.lastSync}</span>
                <button
                  type="button"
                  onClick={() => handleTestIntegration(intg.id)}
                  className="inline-flex items-center gap-1.5 bg-[#0B3D91] hover:bg-[#082D6E] text-white text-xs font-semibold px-3.5 py-2 rounded-lg cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Uji Koneksi &amp; Retry Queue</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 6: SIEM Audit Trail */}
      {subTab === 'siem' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base">Audit Log Immutable &amp; SIEM Forwarding</h3>
              <p className="text-xs text-slate-500">Setiap login MFA, evaluasi ABAC, Break-Glass, dan transaksi gateway dicatat dengan hash SHA-256.</p>
            </div>
            <div className="flex gap-1.5">
              {['ALL', 'ALLOW', 'CHALLENGE', 'DENY', 'BREAK_GLASS'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSiemFilter(f)}
                  className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                    siemFilter === f ? 'bg-[#0B3D91] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase">
                <tr>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Aktor</th>
                  <th className="p-3">Event &amp; Resource</th>
                  <th className="p-3">Keputusan</th>
                  <th className="p-3">Detail</th>
                  <th className="p-3">Integrity Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {adminState.siemAuditTrail
                  .filter((row: any) => siemFilter === 'ALL' || row.decision === siemFilter)
                  .map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono whitespace-nowrap">{log.timestamp}</td>
                      <td className="p-3">
                        <p className="font-semibold">{log.actorName}</p>
                        <p className="font-mono text-[10px] text-slate-500">{log.actorNip}</p>
                      </td>
                      <td className="p-3">
                        <p className="font-mono font-bold text-[11px]">{log.eventType}</p>
                        <p className="text-slate-500">{log.resource}</p>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            log.decision === 'ALLOW'
                              ? 'bg-emerald-100 text-emerald-700'
                              : log.decision === 'BREAK_GLASS'
                              ? 'bg-amber-100 text-amber-800'
                              : log.decision === 'DENY'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {log.decision}
                        </span>
                      </td>
                      <td className="p-3 max-w-xs">{log.detail}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">{log.hash}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
