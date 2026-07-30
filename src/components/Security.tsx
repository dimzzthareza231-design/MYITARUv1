import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ShieldAlert, Key, UserCheck, AlertTriangle, Fingerprint, Lock, Server } from 'lucide-react';
import { cn } from '../lib/utils';

interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  ipAddress: string;
  status: 'Success' | 'Failed' | 'Warning';
  type: 'Login' | 'Data Access' | 'System' | 'Permission Change';
  details: string;
}

const generateLogs = (): SecurityLog[] => {
  const events = [
    { type: 'Login', event: 'User Authentication', user: 'Dr. Budi Santoso', status: 'Success', details: 'Successful login via Biometric' },
    { type: 'Login', event: 'User Authentication', user: 'Unknown', status: 'Failed', details: 'Failed login attempt - Invalid password (3x)' },
    { type: 'Data Access', event: 'EMR Export', user: 'Siti Aminah, RN', status: 'Warning', details: 'Bulk export of 50 patient records' },
    { type: 'Data Access', event: 'Record Deletion', user: 'Admin System', status: 'Warning', details: 'Deleted obsolete records from 2010' },
    { type: 'System', event: 'Firewall Alert', user: 'System', status: 'Warning', details: 'Blocked 5 port scan attempts from IP 192.168.1.50' },
    { type: 'Permission Change', event: 'Role Update', user: 'Admin System', status: 'Success', details: 'Granted "Supervisor" access to Dr. Andi' }
  ];

  const logs: SecurityLog[] = [];
  for (let i = 0; i < 20; i++) {
    const template = events[Math.floor(Math.random() * events.length)];
    logs.push({
      id: `SEC-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString().replace('T', ' ').substring(0, 19),
      event: template.event,
      user: template.user,
      ipAddress: `10.0.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`,
      status: template.status as any,
      type: template.type as any,
      details: template.details
    });
  }
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export function Security() {
  const [logs] = useState<SecurityLog[]>(generateLogs());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => 
    log.event.toLowerCase().includes(searchQuery.toLowerCase()) || 
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Security & Audit Logs</h1>
          <p className="text-sm text-white/40">Monitor system access and data privacy events</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30">
            <ShieldAlert className="w-4 h-4" />
            <span>Lockdown System</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider">Active Sessions</h3>
          </div>
          <div className="text-2xl font-bold text-white">124</div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider">Failed Logins (24h)</h3>
          </div>
          <div className="text-2xl font-bold text-white">12</div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider">Permission Changes</h3>
          </div>
          <div className="text-2xl font-bold text-white">3</div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-wider">System Alerts</h3>
          </div>
          <div className="text-2xl font-bold text-white">1</div>
        </div>
      </div>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden border border-white/5">
        <div className="p-4 border-b border-white/5 flex gap-4 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search security logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 glass-input text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-white/40 sticky top-0 bg-panel/95 backdrop-blur-md">
                <th className="p-4 font-bold">Timestamp</th>
                <th className="p-4 font-bold">Event Type</th>
                <th className="p-4 font-bold">User / Actor</th>
                <th className="p-4 font-bold">IP Address</th>
                <th className="p-4 font-bold">Details</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-sm font-mono text-white/60">{log.timestamp}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {log.type === 'Login' && <Fingerprint className="w-4 h-4 text-emerald-400" />}
                      {log.type === 'Data Access' && <Lock className="w-4 h-4 text-blue-400" />}
                      {log.type === 'Permission Change' && <Key className="w-4 h-4 text-orange-400" />}
                      {log.type === 'System' && <Server className="w-4 h-4 text-purple-400" />}
                      <span className="text-sm font-medium text-white">{log.event}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-white/80">{log.user}</td>
                  <td className="p-4 text-sm font-mono text-white/40">{log.ipAddress}</td>
                  <td className="p-4 text-sm text-white/80">{log.details}</td>
                  <td className="p-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
                      log.status === 'Success' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      log.status === 'Warning' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
