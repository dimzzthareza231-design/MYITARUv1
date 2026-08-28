import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuditLog {
  id: number;
  user_id: number;
  username: string;
  action: string;
  module: string;
  entity_type: string;
  entity_id: number | string;
  old_value: any;
  new_value: any;
  ip_address: string;
  user_agent: string;
  timestamp: string;
}

interface AuditTrailContextType {
  logs: AuditLog[];
  logAction: (actionData: any) => AuditLog;
  logActivity: (username: string, action: string, module: string, entity_type: string, entity_id: number | string, old_value?: any, new_value?: any) => AuditLog;
  deleteLog: (id: number) => void;
  clearAllLogs: () => void;
}

const AuditTrailContext = createContext<AuditTrailContextType | undefined>(undefined);

export function AuditTrailProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem('audit_logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.warn('Error parsing audit_logs from localStorage', e);
      }
    }
    
    if (!saved) {
      // Data dummy awal
      const dummyLogs: AuditLog[] = [
        {
          id: 1,
          user_id: 1,
          username: 'dr.ahmad',
          action: 'CREATE',
          module: 'Pasien',
          entity_type: 'pasien',
          entity_id: 101,
          old_value: null,
          new_value: { nama: 'Budi Santoso', nik: '3201xxx' },
          ip_address: '192.168.1.100',
          user_agent: 'Chrome/Windows',
          timestamp: '2026-08-09T08:30:00'
        },
        {
          id: 2,
          user_id: 2,
          username: 'admin.rina',
          action: 'UPDATE',
          module: 'BPJS',
          entity_type: 'klaim',
          entity_id: 55,
          old_value: { status: 'Draft' },
          new_value: { status: 'Submitted' },
          ip_address: '192.168.1.101',
          user_agent: 'Firefox/Linux',
          timestamp: '2026-08-09T09:15:00'
        },
        {
          id: 3,
          user_id: 3,
          username: 'kasir.joko',
          action: 'PRINT',
          module: 'Billing',
          entity_type: 'invoice',
          entity_id: 203,
          old_value: null,
          new_value: null,
          ip_address: '192.168.1.102',
          user_agent: 'Chrome/Windows',
          timestamp: '2026-08-09T10:00:00'
        }
      ];
      setLogs(dummyLogs);
      localStorage.setItem('audit_logs', JSON.stringify(dummyLogs));
    }
  }, []);
  
  // Fungsi untuk log aksi
  const logAction = (actionData: any) => {
    const newLog: AuditLog = {
      id: Date.now(),
      user_id: actionData.user_id || 1,
      username: actionData.username || 'current_user',
      action: actionData.action, // CREATE, UPDATE, DELETE, VIEW, PRINT, EXPORT, LOGIN, LOGOUT
      module: actionData.module,
      entity_type: actionData.entity_type,
      entity_id: actionData.entity_id,
      old_value: actionData.old_value || null,
      new_value: actionData.new_value || null,
      ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    setLogs(prevLogs => {
      const updated = [newLog, ...prevLogs];
      localStorage.setItem('audit_logs', JSON.stringify(updated));
      return updated;
    });
    
    return newLog;
  };

  const logActivity = (
    username: string,
    action: string,
    module: string,
    entity_type: string,
    entity_id: number | string,
    old_value?: any,
    new_value?: any
  ) => {
    return logAction({
      username,
      action,
      module,
      entity_type,
      entity_id,
      old_value,
      new_value
    });
  };
  
  const deleteLog = (id: number) => {
    setLogs(prevLogs => {
      const updated = prevLogs.filter(l => l.id !== id);
      localStorage.setItem('audit_logs', JSON.stringify(updated));
      return updated;
    });
  };
  
  const clearAllLogs = () => {
    setLogs([]);
    localStorage.setItem('audit_logs', JSON.stringify([]));
  };
  
  return (
    <AuditTrailContext.Provider value={{ logs, logAction, logActivity, deleteLog, clearAllLogs }}>
      {children}
    </AuditTrailContext.Provider>
  );
}

export const useAuditTrail = () => {
  const context = useContext(AuditTrailContext);
  if (context === undefined) {
    throw new Error('useAuditTrail must be used within an AuditTrailProvider');
  }
  return context;
};
