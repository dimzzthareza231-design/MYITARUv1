import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface CloudflareTurnstileProps {
  siteKey?: string;
  onSuccess?: (token: string) => void;
  onError?: (error: any) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  action?: string;
  className?: string;
}

// Default dummy demo sitekeys provided officially by Cloudflare:
// 1x00000000000000000000AA : Always passes (interactive)
// 2x00000000000000000000AB : Always blocks / fails
// 3x00000000000000000000FF : Forces interactive challenge
export const CLOUDFLARE_DEFAULT_SITEKEY = '1x00000000000000000000AA';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          'error-callback'?: (error: any) => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact' | 'flexible';
          action?: string;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export function CloudflareTurnstile({
  siteKey,
  onSuccess,
  onError,
  onExpire,
  theme = 'auto',
  size = 'normal',
  action = 'login',
  className = ''
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);

  // Get active sitekey from prop, localStorage, or fallback demo
  const effectiveSiteKey = 
    siteKey || 
    (typeof window !== 'undefined' ? localStorage.getItem('simrs_cloudflare_turnstile_sitekey') : null) || 
    CLOUDFLARE_DEFAULT_SITEKEY;

  useEffect(() => {
    let isMounted = true;

    const initTurnstile = () => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      try {
        if (widgetIdRef.current) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {}
          widgetIdRef.current = null;
        }

        containerRef.current.innerHTML = '';

        const id = window.turnstile.render(containerRef.current, {
          sitekey: effectiveSiteKey,
          theme,
          size,
          action,
          callback: (token: string) => {
            if (!isMounted) return;
            setIsVerified(true);
            setHasError(false);
            if (onSuccess) onSuccess(token);
          },
          'error-callback': (err: any) => {
            if (!isMounted) return;
            console.warn('Cloudflare Turnstile error:', err);
            setHasError(true);
            setIsVerified(false);
            if (onError) onError(err);
          },
          'expired-callback': () => {
            if (!isMounted) return;
            setIsVerified(false);
            if (onExpire) onExpire();
          }
        });

        widgetIdRef.current = id;
        setIsLoaded(true);
      } catch (err) {
        console.warn('Failed to render Turnstile widget:', err);
        if (isMounted) {
          setIsSimulatedMode(true);
        }
      }
    };

    // Load Cloudflare Turnstile Script if not present
    if (typeof window !== 'undefined') {
      if (window.turnstile) {
        initTurnstile();
      } else {
        const existingScript = document.getElementById('cf-turnstile-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'cf-turnstile-script';
          script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            if (isMounted) initTurnstile();
          };
          script.onerror = () => {
            console.warn('Could not load Cloudflare Turnstile script, enabling sandbox fallback');
            if (isMounted) {
              setIsSimulatedMode(true);
              setIsLoaded(true);
            }
          };
          document.head.appendChild(script);
        } else {
          // Poll until turnstile is available
          const interval = setInterval(() => {
            if (window.turnstile) {
              clearInterval(interval);
              if (isMounted) initTurnstile();
            }
          }, 100);

          // Fallback timeout
          setTimeout(() => {
            clearInterval(interval);
            if (isMounted && !window.turnstile) {
              setIsSimulatedMode(true);
              setIsLoaded(true);
            }
          }, 2500);
        }
      }
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
      }
    };
  }, [effectiveSiteKey, theme, size, action]);

  const handleSimulatedPass = () => {
    setIsVerified(true);
    setHasError(false);
    const mockToken = `CF_TURNSTILE_DEMO_PASS_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    if (onSuccess) onSuccess(mockToken);
  };

  const handleReset = () => {
    setIsVerified(false);
    setHasError(false);
    if (widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {}
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center my-3 ${className}`}>
      {/* Real Turnstile Container */}
      <div 
        ref={containerRef} 
        className={isSimulatedMode ? 'hidden' : 'min-h-[65px] flex items-center justify-center'}
      />

      {/* Simulated / Fallback Container if CDN is blocked or testing locally */}
      {isSimulatedMode && (
        <div className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
              isVerified 
                ? 'bg-emerald-500 text-white' 
                : 'border-2 border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-700 cursor-pointer hover:border-amber-500'
            }`}
            onClick={!isVerified ? handleSimulatedPass : undefined}
            >
              {isVerified && <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Cloudflare Turnstile Verification</span>
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isVerified ? 'Verifikasi Berhasil (Human Verified)' : 'Klik kotak untuk verifikasi keamanan'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-right text-slate-400 dark:text-slate-500 hidden sm:block">
              <span className="text-amber-500 font-bold">Cloudflare</span>
              <br />Privacy First
            </div>
            {isVerified && (
              <button 
                type="button"
                onClick={handleReset} 
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-600"
                title="Reset Captcha"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {hasError && (
        <div className="mt-2 text-xs text-rose-500 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Verifikasi keamanan gagal. Silakan coba lagi.</span>
        </div>
      )}
    </div>
  );
}
