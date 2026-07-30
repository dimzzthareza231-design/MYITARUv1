import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScanFace, Lock, Fingerprint, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [scanning, setScanning] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');

  const handleBiometricAuth = () => {
    setScanning(true);
    setAuthStatus('scanning');
    
    // Simulate biometric scan delay
    setTimeout(() => {
      setScanning(false);
      setAuthStatus('success');
      
      // Proceed to dashboard after success animation
      setTimeout(() => {
        onLogin();
      }, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary-emerald/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-primary-blue/10 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 glass-panel border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-emerald to-primary-blue p-[1px]">
            <div className="w-full h-full bg-panel rounded-2xl flex items-center justify-center">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-primary-emerald to-primary-blue text-2xl">
                M
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            MYITARU <span className="text-primary-emerald">AI</span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-2">
            Secure Medical Intelligence
          </p>
        </div>

        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden">
            <AnimatePresence>
              {authStatus === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-2 text-white/40"
                >
                  <ScanFace className="w-12 h-12" />
                  <span className="text-xs uppercase tracking-widest font-bold">Ready to Scan</span>
                </motion.div>
              )}
              
              {authStatus === 'scanning' && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <ScanFace className="w-16 h-16 text-primary-blue opacity-50" />
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1 bg-primary-emerald shadow-[0_0_15px_rgba(52,211,153,0.8)]"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                  />
                  <div className="absolute inset-0 bg-primary-blue/5 animate-pulse rounded-full" />
                </motion.div>
              )}

              {authStatus === 'success' && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  className="flex flex-col items-center gap-2 text-primary-emerald"
                >
                  <ShieldCheck className="w-16 h-16" />
                  <span className="text-xs uppercase tracking-widest font-bold">Verified</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleBiometricAuth}
            disabled={scanning || authStatus === 'success'}
            className={cn(
              "w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden",
              authStatus === 'success' ? "bg-primary-emerald text-black" : ""
            )}
          >
            {authStatus === 'idle' && (
              <>
                <ScanFace className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Initialize Face ID</span>
              </>
            )}
            {authStatus === 'scanning' && (
              <>
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                <span>Scanning Biometrics...</span>
              </>
            )}
            {authStatus === 'success' && (
              <>
                <Lock className="w-5 h-5" />
                <span>Access Granted</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => {}} 
            disabled={scanning || authStatus === 'success'}
            className="w-full btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Fingerprint className="w-5 h-5" />
            <span>Use Fingerprint Instead</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30 uppercase tracking-widest font-bold">
          <span>AES-256-GCM Encrypted</span>
          <span>v2.4.1</span>
        </div>
      </motion.div>
    </div>
  );
}
