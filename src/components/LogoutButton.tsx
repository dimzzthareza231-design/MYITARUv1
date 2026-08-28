import toast from "react-hot-toast";
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAuditTrail } from '../contexts/AuditTrailContext';

export default function LogoutButton({ onLogout }: { onLogout?: () => void }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, currentUser } = useAuth();
  const { logActivity } = useAuditTrail();
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (logActivity) {
        logActivity(
          currentUser?.username || 'user',
          'LOGOUT',
          'Authentication',
          'AuthSession',
          currentUser?.id || 'session'
        );
      }
      await logout();
      toast.success('Anda berhasil logout');
      if (onLogout) {
        onLogout();
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
      setShowConfirm(false);
    }
  };
  
  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition font-semibold"
      >
        <span>🚪</span>
        <span className="hidden md:inline">Logout</span>
      </button>
      
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚪</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Konfirmasi Logout
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Apakah Anda yakin ingin keluar dari sistem?
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Data yang belum disimpan akan hilang
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isLoggingOut}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 py-3 rounded-lg font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {isLoggingOut ? '⏳ Logging out...' : '🚪 Ya, Logout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
