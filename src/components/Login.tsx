import React, { useState } from 'react';
import { Activity, Eye, EyeOff, LogIn, User as UserIcon, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useHospital } from '../contexts/HospitalContext';
import { CloudflareTurnstile } from './Common/CloudflareTurnstile';

export function Login() {
  const { login, signInWithGoogle, loading } = useAuth();
  const { hospitalSettings } = useHospital();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Cloudflare Turnstile State
  const [turnstileEnabled] = useState(false); // Forced to false to hide testing watermark
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error('Username dan password wajib diisi');
      return;
    }

    if (turnstileEnabled && !turnstileToken) {
      toast.error('Harap selesaikan verifikasi Cloudflare Turnstile terlebih dahulu');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        toast.success(result.message);
        setUsername('');
        setPassword('');
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Gagal masuk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    if (result.success) {
      toast.success(result.message);
    } else if (result.isCancelled) {
      toast(result.message, { icon: 'ℹ️' });
    } else {
      toast.error(result.message);
    }
    setIsGoogleLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-200 dark:border-slate-700 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="text-center mb-6 relative">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/25 overflow-hidden p-1">
            {hospitalSettings?.logoUrl ? (
              <img src={hospitalSettings.logoUrl} alt="Logo Klinik" className="w-full h-full object-contain rounded-xl bg-white/10" />
            ) : (
              <Activity className="text-white w-8 h-8" />
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {hospitalSettings?.name || 'MYITARU'}
          </h1>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4" /> {hospitalSettings?.subname || 'Cloud Hospital Intelligence Platform'}
          </p>
        </div>

        {/* Google Sign-in Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || loading}
            className="w-full py-2.5 px-4 bg-white dark:bg-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-3 disabled:opacity-60 text-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Menghubungkan ke Google...' : 'Masuk dengan Akun Google'}</span>
          </button>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Username Pegawai
            </label>
            <div className="relative">
              <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 pl-10 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 pr-10 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="Masukkan kata sandi"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Cloudflare Turnstile Bot Protection Widget */}
          {turnstileEnabled && (
            <div className="py-1">
              <CloudflareTurnstile
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
                action="login"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || loading || (turnstileEnabled && !turnstileToken)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {isLoading ? 'Memvalidasi Akun...' : 'Masuk'}
          </button>
        </form>

        {/* Quick Demo Test Accounts */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Akun Uji Coba Cepat:
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => { setUsername('mhs001'); setPassword('mahasiswa001'); }}
              className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-700/60 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 text-left transition-all"
            >
              <div className="font-bold text-[11px] truncate">👑 Super Admin</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-400 font-mono">mhs001</div>
            </button>
            <button
              type="button"
              onClick={() => { setUsername('dokter'); setPassword('dokter123'); }}
              className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 dark:bg-slate-700/60 dark:hover:bg-cyan-950/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-cyan-400 dark:hover:border-cyan-500 text-left transition-all"
            >
              <div className="font-bold text-[11px] truncate">🩺 Dokter Sp.PD</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-400 font-mono">dokter</div>
            </button>
            <button
              type="button"
              onClick={() => { setUsername('perawat'); setPassword('perawat123'); }}
              className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700/60 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-emerald-400 dark:hover:border-emerald-500 text-left transition-all"
            >
              <div className="font-bold text-[11px] truncate">💉 Perawat</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-400 font-mono">perawat</div>
            </button>
            <button
              type="button"
              onClick={() => { setUsername('rekammedis'); setPassword('rm123'); }}
              className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-700/60 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-500 text-left transition-all"
            >
              <div className="font-bold text-[11px] truncate">📁 Rekam Medis</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-400 font-mono">rekammedis</div>
            </button>
            <button
              type="button"
              onClick={() => { setUsername('apoteker'); setPassword('apotek123'); }}
              className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-50 dark:bg-slate-700/60 dark:hover:bg-teal-950/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-teal-400 dark:hover:border-teal-500 text-left transition-all"
            >
              <div className="font-bold text-[11px] truncate">💊 Apoteker</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-400 font-mono">apoteker</div>
            </button>
            <button
              type="button"
              onClick={() => { setUsername('kasir'); setPassword('kasir123'); }}
              className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 dark:bg-slate-700/60 dark:hover:bg-purple-950/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-purple-400 dark:hover:border-purple-500 text-left transition-all"
            >
              <div className="font-bold text-[11px] truncate">💳 Kasir</div>
              <div className="text-[9px] text-slate-400 dark:text-slate-400 font-mono">kasir</div>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-5 font-semibold tracking-widest uppercase opacity-70">
          © DIMAS PANGESTU P.A • ITARU SIK
        </p>
      </div>
    </div>
  );
}
