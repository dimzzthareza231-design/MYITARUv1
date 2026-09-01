import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getRoleById } from '../../data/roles';

export interface AuthorizationOptions {
  moduleId?: string;
  allowedRoles?: string[];
  requireAdmin?: boolean;
}

/**
 * Custom Hook to evaluate authorization status for a module or role requirement.
 */
export function useAuthorization(options: AuthorizationOptions = {}) {
  const { currentUser, hasAccess, isAdmin } = useAuth();
  const { moduleId, allowedRoles, requireAdmin } = options;

  if (!currentUser) {
    return {
      isAuthorized: false,
      reason: 'Sesi belum terautentikasi (Silakan Login)',
      currentUser: null,
      userRole: null,
    };
  }

  const userRole = getRoleById(currentUser.roleId);

  // Super admin has unrestricted authorization
  if (currentUser.roleId === 'super_admin') {
    return { isAuthorized: true, currentUser, userRole };
  }

  // Admin requirement check
  if (requireAdmin && !isAdmin) {
    return {
      isAuthorized: false,
      reason: 'Akses khusus Administrator Utama / Staff Admin Sistem',
      currentUser,
      userRole,
    };
  }

  // Explicit allowed roles check
  if (allowedRoles && allowedRoles.length > 0) {
    const roleMatch = allowedRoles.includes(currentUser.roleId);
    if (!roleMatch) {
      return {
        isAuthorized: false,
        reason: `Akses dibatasi untuk peran: ${allowedRoles.join(', ')}`,
        currentUser,
        userRole,
      };
    }
  }

  // Module access permission check
  if (moduleId) {
    const moduleAuthorized = hasAccess(moduleId);
    if (!moduleAuthorized) {
      return {
        isAuthorized: false,
        reason: `Peran ${userRole?.nama || currentUser.roleId} tidak memiliki izin untuk mengakses modul "${moduleId}".`,
        currentUser,
        userRole,
      };
    }
  }

  return { isAuthorized: true, currentUser, userRole };
}

export interface ProtectedRouteProps extends AuthorizationOptions {
  children: React.ReactElement;
  fallback?: React.ReactNode;
  redirectTo?: string;
  hideIfUnauthorized?: boolean;
}

/**
 * Route Guard Component that wraps routes or views and checks role/module authorization.
 */
export function ProtectedRoute({
  children,
  moduleId,
  allowedRoles,
  requireAdmin,
  fallback,
  redirectTo,
  hideIfUnauthorized = false,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { isAuthorized, reason, currentUser, userRole } = useAuthorization({
    moduleId,
    allowedRoles,
    requireAdmin,
  });

  if (!isAuthorized) {
    if (hideIfUnauthorized) {
      return null;
    }

    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0B1120] rounded-3xl border border-slate-200 dark:border-slate-800/60 m-4 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-rose-500/10 dark:bg-rose-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-md w-full bg-white dark:bg-[#111827]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-200/80 dark:border-slate-700/50 shadow-2xl relative z-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-500/10 dark:to-rose-600/5 text-rose-500 dark:text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-rose-100 dark:border-rose-500/20 transform rotate-3">
            <svg className="w-8 h-8 -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Akses Ditolak</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed px-4">
            {reason || 'Anda tidak memiliki wewenang untuk membuka modul atau fitur ini.'}
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8 text-left space-y-3 text-sm">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Pengguna</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold truncate max-w-[160px]">{currentUser?.nama || '-'}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Role Anda</span>
              <span className="px-2.5 py-1 bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-bold text-xs tracking-wide uppercase">
                {userRole?.nama || currentUser?.roleId || '-'}
              </span>
            </div>
            {moduleId && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Modul Diminta</span>
                <span className="text-rose-600 dark:text-rose-400 font-mono font-bold text-xs bg-rose-50 dark:bg-rose-500/10 px-2.5 py-1 rounded-md">{moduleId}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Kembali ke Dashboard Utama</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
}

/**
 * Higher-Order Component (HOC) to wrap sensitive UI components or page views with authorization logic.
 */
export function withAuthorization<P extends object>(
  Component: React.ComponentType<P>,
  options: AuthorizationOptions
) {
  const WithAuthWrapper: React.FC<P> = (props) => {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  WithAuthWrapper.displayName = `withAuthorization(${Component.displayName || Component.name || 'Component'})`;
  return WithAuthWrapper;
}

/**
 * Inline Component Guard for hiding/showing UI widgets, action buttons, or tabs based on roles.
 */
export function ProtectedComponent({
  children,
  moduleId,
  allowedRoles,
  requireAdmin,
  fallback = null,
}: AuthorizationOptions & { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { isAuthorized } = useAuthorization({ moduleId, allowedRoles, requireAdmin });
  if (!isAuthorized) return <>{fallback}</>;
  return <>{children}</>;
}
