import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification, Notification } from '../contexts/NotificationContext';
import { Bell, CheckCircle2, AlertTriangle, Info, XCircle, Trash2, Check, X } from 'lucide-react';

function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all') return true;
    return n.type === filter;
  });
  
  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
        case 'info': return <Info className="w-3.5 h-3.5 text-cyan-400" />;
        case 'success': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
        case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
        case 'error': return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
        default: return <Info className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };
  
  const getTypeColor = (type: Notification['type']) => {
    const colors: Record<string, string> = {
      info: 'border-l-cyan-500 bg-cyan-950/20',
      success: 'border-l-emerald-500 bg-emerald-950/20',
      warning: 'border-l-amber-500 bg-amber-950/20',
      error: 'border-l-rose-500 bg-rose-950/20'
    };
    return colors[type] || 'border-l-slate-600 bg-white/[0.02]';
  };
  
  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return 'Baru saja';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} m lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} j lalu`;
    return `${Math.floor(seconds / 86400)} h lalu`;
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-[#C9A94E]/40"
        title="Pemberitahuan & Aktivitas"
      >
        <Bell className="w-4 h-4 text-slate-300 hover:text-[#E8D49E] transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] rounded-full min-w-[15px] h-[15px] px-0.5 flex items-center justify-center font-bold shadow-md ring-2 ring-[#08121E]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 bg-[#0A1627]/98 border border-[#C9A94E]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden z-50 backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
          {/* Top subtle gold hairline */}
          <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#E8D49E]/70 to-transparent"></div>

          <div className="bg-white/[0.02] p-4 border-b border-white/10">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-[#E8D49E]" />
                Notifikasi Rumah Sakit
              </h3>
              {unreadCount > 0 && (
                <span className="text-[10px] bg-[#C9A94E]/20 text-[#E8D49E] border border-[#C9A94E]/40 px-2 py-0.5 rounded-full font-bold font-mono">
                  {unreadCount} baru
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={markAllAsRead}
                className="text-[11px] flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded-lg border border-white/10 shadow-xs"
              >
                <Check className="w-3 h-3 text-[#E8D49E]" /> Tandai Dibaca
              </button>
              <button
                onClick={clearAll}
                className="text-[11px] flex items-center gap-1.5 text-slate-400 hover:text-rose-400 font-medium transition-colors bg-white/[0.04] hover:bg-rose-500/10 px-2.5 py-1 rounded-lg border border-white/10 shadow-xs"
              >
                <Trash2 className="w-3 h-3" /> Bersihkan
              </button>
            </div>
          </div>
          
          {/* Filter */}
          <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto custom-scrollbar p-1 gap-1">
            {['all', 'unread', 'info', 'success', 'warning', 'error'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  filter === f 
                    ? 'bg-[#183F6D] text-white border border-[#C9A94E]/40 shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'unread' ? 'Belum Dibaca' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-white/5">
            {filteredNotifs.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <Bell className="w-8 h-8 text-slate-600 mb-2 opacity-60" />
                <p className="text-xs font-medium text-slate-400">Tidak ada notifikasi saat ini</p>
              </div>
            ) : (
              filteredNotifs.map(notif => (
                <div
                  key={notif.id}
                  className={`border-l-3 p-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer ${getTypeColor(notif.type)} ${!notif.read ? 'opacity-100' : 'opacity-65'}`}
                  onClick={() => {
                    markAsRead(notif.id);
                    if (notif.link) {
                      navigate(notif.link);
                      setIsOpen(false);
                    }
                  }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {getTypeIcon(notif.type)}
                        <span className={`text-xs font-bold truncate ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 bg-[#E8D49E] rounded-full shrink-0"></span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-300 mb-1.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                        <span className="text-[#E8D49E]">{notif.module}</span>
                        <span>•</span>
                        <span>{timeAgo(notif.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t border-white/10 p-2.5 bg-black/40 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/modul/notifikasi');
              }}
              className="text-[#E8D49E] hover:underline text-xs font-bold tracking-wide"
            >
              Lihat Riwayat Lengkap →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
