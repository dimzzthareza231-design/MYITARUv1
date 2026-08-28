import React, { createContext, useContext, useState, useEffect } from 'react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
  category: string;
}

interface KeyboardShortcutsContextType {
  shortcuts: Shortcut[];
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [showHelp, setShowHelp] = useState(false);
  
  const navigate = (module: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { module } }));
  };
  
  const shortcuts: Shortcut[] = [
    { key: 'Ctrl+K', description: 'Command Palette', action: () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })), category: 'Global' },
    { key: '?', description: 'Show Shortcuts Help', action: () => setShowHelp(true), category: 'Global' },
    { key: 'Ctrl+/', description: 'Toggle Help', action: () => setShowHelp(prev => !prev), category: 'Global' },
    { key: 'Escape', description: 'Close Modal/Dialog', action: () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })), category: 'Global' },
    
    { key: 'g h', description: 'Go to Dashboard', action: () => navigate('dashboard'), category: 'Navigation' },
    { key: 'g m', description: 'Go to Monitoring', action: () => navigate('monitoring'), category: 'Navigation' },
    { key: 'g p', description: 'Go to Patients (Registration)', action: () => navigate('registrasi'), category: 'Navigation' },
    { key: 'g a', description: 'Go to Analytics', action: () => navigate('analytics_dash'), category: 'Navigation' },
    { key: 'g w', description: 'Go to Workflow', action: () => navigate('workflow'), category: 'Navigation' },
    
    { key: 'Ctrl+P', description: 'Print Current Page', action: () => window.print(), category: 'Actions' },
    { key: 'Ctrl+F', description: 'Focus Search', action: () => {
      const searchInput = document.querySelector('input[type="search"], input[placeholder*="Cari"]') as HTMLInputElement;
      if (searchInput) searchInput.focus();
    }, category: 'Actions' },
    
    { key: 'd', description: 'Toggle Dark Mode', action: () => {
        window.dispatchEvent(new CustomEvent('toggle-theme'));
    }, category: 'View' },
    { key: 'f', description: 'Toggle Fullscreen', action: () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }, category: 'View' },
  ];
  
  useEffect(() => {
    let keyBuffer = '';
    let keyTimeout: ReturnType<typeof setTimeout>;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName) || (e.target as HTMLElement).isContentEditable) {
        return;
      }
      
      const singleKey = e.key.toLowerCase();
      
      if (singleKey === '?' || (e.ctrlKey && singleKey === '/')) {
        e.preventDefault();
        setShowHelp(prev => !prev);
        return;
      }
      
      if (e.ctrlKey || e.metaKey) {
        const combo = `Ctrl+${e.key.toUpperCase()}`;
        const shortcut = shortcuts.find(s => s.key === combo);
        if (shortcut) {
          e.preventDefault();
          shortcut.action();
        }
        return;
      }
      
      if (['g', 'n'].includes(singleKey)) {
        keyBuffer = singleKey;
        clearTimeout(keyTimeout);
        keyTimeout = setTimeout(() => { keyBuffer = ''; }, 1000);
        return;
      }
      
      if (keyBuffer) {
        const combo = `${keyBuffer} ${singleKey}`;
        const shortcut = shortcuts.find(s => s.key === combo);
        if (shortcut) {
          e.preventDefault();
          shortcut.action();
          keyBuffer = '';
        }
      } else if (singleKey === 'd' || singleKey === 'f') {
          const shortcut = shortcuts.find(s => s.key === singleKey);
          if (shortcut) {
              e.preventDefault();
              shortcut.action();
          }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
  
  return (
    <KeyboardShortcutsContext.Provider value={{ shortcuts, showHelp, setShowHelp }}>
      {children}
      {showHelp && <KeyboardShortcutsHelp />}
    </KeyboardShortcutsContext.Provider>
  );
}

function KeyboardShortcutsHelp() {
  const { shortcuts, setShowHelp } = useContext(KeyboardShortcutsContext)!;
  const [filter, setFilter] = useState('all');
  
  const categories = ['all', ...Array.from(new Set(shortcuts.map(s => s.category)))];
  const filtered = filter === 'all' ? shortcuts : shortcuts.filter(s => s.category === filter);
  
  const grouped = filtered.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) acc[shortcut.category] = [];
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);
  
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 text-white p-5 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">⌨️ Keyboard Shortcuts</h2>
            <p className="text-sm text-indigo-100 font-medium mt-1">Tekan tombol untuk aksi cepat</p>
          </div>
          <button
            onClick={() => setShowHelp(false)}
            className="text-white/70 hover:text-white hover:bg-indigo-700 p-2 rounded-lg transition"
          >
            ✕
          </button>
        </div>
        
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto custom-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                filter === cat
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{category}</h3>
              <div className="space-y-2">
                {(items as Shortcut[]).map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                  >
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{shortcut.description}</div>
                    <div className="flex items-center gap-1.5">
                      {shortcut.key.split(' ').map((part, i) => (
                        <React.Fragment key={i}>
                          {i > 0 && <span className="text-slate-400 text-xs font-medium italic">then</span>}
                          <kbd className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded shadow-sm font-mono text-xs font-bold">
                            {part}
                          </kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          Tekan <kbd className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded shadow-sm text-slate-700 dark:text-slate-300 mx-1">?</kbd> atau <kbd className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded shadow-sm text-slate-700 dark:text-slate-300 mx-1">Ctrl+/</kbd> untuk toggle help panel
        </div>
      </div>
    </div>
  );
}

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) throw new Error("useKeyboardShortcuts must be used within Provider");
  return context;
};
