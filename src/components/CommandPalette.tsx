import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronRight, CornerDownLeft } from 'lucide-react';

interface CommandItem {
  id: number;
  category: string;
  icon: string;
  label: string;
  description: string;
  action: () => void;
}

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentItems, setRecentItems] = useState<CommandItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const navigate = (module: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: { module } }));
  };
  
  useEffect(() => {
    const saved = localStorage.getItem('command_recent');
    if (saved) {
      // Need to re-map actions since they can't be serialized
      try {
        const parsed = JSON.parse(saved);
        // We'll skip restoring actions for recent items in this simple implementation
        // A full implementation would map IDs back to full command objects
      } catch (e) {}
    }
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setSearchQuery('');
        setSelectedIndex(0);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          const selected = filteredCommands[selectedIndex];
          if (selected) executeCommand(selected);
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchQuery, selectedIndex]); // filteredCommands is derived, so we depend on searchQuery
  
  const allCommands: CommandItem[] = [
    // Navigation
    { id: 1, category: 'Navigation', icon: '🏠', label: 'Dashboard', description: 'Kembali ke halaman utama', action: () => navigate('dashboard') },
    { id: 2, category: 'Navigation', icon: '📝', label: 'Pendaftaran', description: 'Registrasi Pasien Baru', action: () => navigate('registrasi') },
    { id: 3, category: 'Navigation', icon: '🏥', label: 'Klinik / Poli', description: 'Manajemen Klinik', action: () => navigate('klinik') },
    { id: 4, category: 'Navigation', icon: '💊', label: 'Apotek & Farmasi', description: 'Kelola obat & resep', action: () => navigate('farmasi') },
    { id: 5, category: 'Navigation', icon: '💰', label: 'Kasir & Billing', description: 'Kelola tagihan', action: () => navigate('billing') },
    { id: 6, category: 'Navigation', icon: '📊', label: 'Executive Dashboard', description: 'Lihat laporan & analytics', action: () => navigate('analytics_dash') },
    { id: 7, category: 'Navigation', icon: '📋', label: 'Workflow Approval', description: 'Manajemen persetujuan', action: () => navigate('workflow') },
    { id: 8, category: 'Navigation', icon: '🛡️', label: 'Audit Trail', description: 'Lihat log aktivitas', action: () => navigate('audit') },
    
    // Actions
    { id: 10, category: 'Actions', icon: '➕', label: 'Tambah Pasien Baru', description: 'Daftarkan pasien baru', action: () => navigate('registrasi') },
    { id: 11, category: 'Actions', icon: '🎫', label: 'Cetak Antrean', description: 'Buat nomor antrean baru', action: () => toast('Buka dialog cetak antrean') },
    { id: 15, category: 'Actions', icon: '🌙', label: 'Toggle Dark Mode', description: 'Ganti tema gelap/terang', action: () => {
      window.dispatchEvent(new CustomEvent('toggle-theme'));
    }},
    { id: 16, category: 'Actions', icon: '🔔', label: 'Notifikasi', description: 'Buka pengaturan notifikasi', action: () => navigate('notification_settings') },
  ];
  
  const filteredCommands = searchQuery.trim() === '' 
    ? allCommands
    : allCommands.filter(cmd => {
        const query = searchQuery.toLowerCase();
        return cmd.label.toLowerCase().includes(query) ||
               cmd.description.toLowerCase().includes(query) ||
               cmd.category.toLowerCase().includes(query);
      });
  
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);
  
  const executeCommand = (cmd: CommandItem) => {
    // Only keeping limited recent implementation for demo simplicity
    cmd.action();
    setIsOpen(false);
    setSearchQuery('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center z-[200] p-4 pt-[10vh] animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-4 duration-200 flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <Search className="w-6 h-6 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ketik command, halaman, atau fitur..."
            className="flex-1 text-lg bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder-slate-400 font-medium"
            autoFocus
          />
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
            <span>ESC</span>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 custom-scrollbar p-2">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-16 text-slate-400 flex flex-col items-center">
              <div className="text-4xl mb-4 opacity-50">🔍</div>
              <p className="font-bold text-slate-600 dark:text-slate-300">Tidak ditemukan hasil untuk "{searchQuery}"</p>
              <p className="text-sm mt-1">Coba kata kunci lain atau periksa ejaan Anda</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, commands]) => (
              <div key={category} className="mb-4 last:mb-0">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-4 py-2">
                  {category}
                </div>
                <div className="space-y-1">
                  {commands.map((cmd) => {
                    const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                    const isSelected = selectedIndex === globalIndex;
                    
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => executeCommand(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-indigo-500 text-white shadow-md'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-xl shrink-0 w-8 text-center">{cmd.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                            {cmd.label}
                          </div>
                          <div className={`text-xs truncate ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                            {cmd.description}
                          </div>
                        </div>
                        {isSelected && (
                          <CornerDownLeft className="w-4 h-4 opacity-70 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm">↑</kbd>
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm">↓</kbd>
            Navigasi
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm">Enter</kbd>
            Pilih
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-sm">ESC</kbd>
            Tutup
          </span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
