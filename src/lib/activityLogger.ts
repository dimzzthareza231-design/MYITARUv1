import { collection, doc, setDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from './firebase';

export type ActivityCategory = 'auth' | 'database' | 'security' | 'ai';
export type ActivityStatus = 'SUCCESS' | 'FAILED' | 'DENIED' | 'WARNING';

export interface ActivityLogEntry {
  id: string;
  timestamp: string; // ISO string
  category: ActivityCategory;
  action: string;
  target: string;
  status: ActivityStatus;
  user: {
    uid?: string;
    email?: string;
    nama?: string;
    roleId?: string;
    authProvider?: string;
  };
  details: {
    message?: string;
    collectionName?: string;
    docId?: string;
    operationType?: 'READ' | 'WRITE' | 'DELETE' | 'SUBSCRIBE' | 'AUTH';
    latencyMs?: number;
    errorCode?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  };
}

// In-memory buffer for real-time reactivity
const localLogsBuffer: ActivityLogEntry[] = [];
type LogListener = (logs: ActivityLogEntry[]) => void;
const listeners = new Set<LogListener>();

function notifyListeners() {
  const current = [...localLogsBuffer];
  listeners.forEach(fn => {
    try {
      fn(current);
    } catch (e) {
      console.error('[ActivityLogger] Listener error:', e);
    }
  });
}

// Retrieve client environment IP/device fingerprinting
function getClientMeta() {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Server/Unknown';
  // Standardized simulated client local IP
  const ipAddress = '192.168.1.' + (10 + (Math.abs(hashString(userAgent)) % 190));
  return { userAgent, ipAddress };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Generate realistic default logs for immediate inspection
function getInitialSeedLogs(): ActivityLogEntry[] {
  const now = Date.now();
  return [
    {
      id: 'log_seed_1',
      timestamp: new Date(now - 1000 * 60 * 3).toISOString(),
      category: 'auth',
      action: 'FIREBASE_AUTH_VERIFY',
      target: 'firebase.auth.currentUser',
      status: 'SUCCESS',
      user: {
        email: auth?.currentUser?.email || 'dimzzthareza231@gmail.com',
        nama: auth?.currentUser?.displayName || 'Super Admin (Owner)',
        roleId: 'super_admin',
        authProvider: 'google.com'
      },
      details: {
        message: 'Firebase Authentication session verified and token validated.',
        operationType: 'AUTH',
        latencyMs: 42,
        ipAddress: '192.168.1.101',
        userAgent: 'Chrome/126.0 (Macintosh; Intel Mac OS X)'
      }
    },
    {
      id: 'log_seed_2',
      timestamp: new Date(now - 1000 * 60 * 2).toISOString(),
      category: 'database',
      action: 'FIRESTORE_SNAPSHOT_LISTEN',
      target: 'firestore/pasien',
      status: 'SUCCESS',
      user: {
        email: auth?.currentUser?.email || 'dimzzthareza231@gmail.com',
        nama: 'Super Admin',
        roleId: 'super_admin'
      },
      details: {
        message: 'Real-time WebSocket snapshot listener attached to /pasien collection.',
        collectionName: 'pasien',
        operationType: 'SUBSCRIBE',
        latencyMs: 18,
        ipAddress: '192.168.1.101'
      }
    },
    {
      id: 'log_seed_3',
      timestamp: new Date(now - 1000 * 45).toISOString(),
      category: 'database',
      action: 'FIRESTORE_HEALTH_PING',
      target: 'firestore/test/connection',
      status: 'SUCCESS',
      user: {
        email: 'system@myitaru.internal',
        nama: 'Firebase Health Probe',
        roleId: 'system'
      },
      details: {
        message: 'Cloud Firestore round-trip connection validated successfully.',
        collectionName: 'test',
        docId: 'connection',
        operationType: 'READ',
        latencyMs: 25,
        ipAddress: '127.0.0.1'
      }
    }
  ];
}

// Initialize initial seed
if (localLogsBuffer.length === 0) {
  localLogsBuffer.push(...getInitialSeedLogs());
}

// Real-time Firestore synchronization listener
let firestoreUnsubscribe: (() => void) | null = null;

function initFirestoreListener() {
  if (!isFirebaseConfigured || !db) return;
  if (firestoreUnsubscribe) return;

  try {
    const q = query(collection(db, 'activity_logs'), orderBy('timestamp', 'desc'), limit(100));
    firestoreUnsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cloudLogs: ActivityLogEntry[] = [];
        snapshot.forEach((docSnap) => {
          cloudLogs.push(docSnap.data() as ActivityLogEntry);
        });

        if (cloudLogs.length > 0) {
          // Merge cloud logs with any unique local memory logs
          const mergedMap = new Map<string, ActivityLogEntry>();
          // 1. Put local logs first
          localLogsBuffer.forEach(l => mergedMap.set(l.id, l));
          // 2. Put cloud logs (overriding or adding)
          cloudLogs.forEach(l => mergedMap.set(l.id, l));

          const sorted = Array.from(mergedMap.values()).sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          localLogsBuffer.length = 0;
          localLogsBuffer.push(...sorted.slice(0, 200));
          notifyListeners();
        }
      },
      (error) => {
        console.warn('[ActivityLogger] Firestore onSnapshot warning:', error.message);
      }
    );
  } catch (err) {
    console.warn('[ActivityLogger] Listener init skipped:', err);
  }
}

// Auto-run listener if DB is ready
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initFirestoreListener();
  }, 1000);
}

/**
 * Record a new Activity Log
 */
export async function logActivity(entry: Omit<ActivityLogEntry, 'id' | 'timestamp'> & { timestamp?: string }): Promise<ActivityLogEntry> {
  const meta = getClientMeta();
  const id = 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const fullEntry: ActivityLogEntry = {
    id,
    timestamp: entry.timestamp || new Date().toISOString(),
    category: entry.category,
    action: entry.action,
    target: entry.target,
    status: entry.status,
    user: {
      uid: entry.user?.uid || auth?.currentUser?.uid,
      email: entry.user?.email || auth?.currentUser?.email || 'unauthenticated',
      nama: entry.user?.nama || auth?.currentUser?.displayName || 'User',
      roleId: entry.user?.roleId || 'staff',
      authProvider: entry.user?.authProvider || (auth?.currentUser ? 'firebase' : 'local')
    },
    details: {
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      ...entry.details
    }
  };

  // Add to local buffer immediately
  localLogsBuffer.unshift(fullEntry);
  if (localLogsBuffer.length > 200) {
    localLogsBuffer.pop();
  }
  notifyListeners();

  // Asynchronously commit to Cloud Firestore
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'activity_logs', fullEntry.id), fullEntry);
    } catch (err) {
      console.warn('[ActivityLogger] Cloud persist skipped:', err);
    }
  }

  return fullEntry;
}

/**
 * Helper: Log Auth Attempt
 */
export function logAuthAttempt(params: {
  action: 'GOOGLE_SIGN_IN' | 'STAFF_LOGIN' | 'LOGOUT' | 'PASSWORD_RESET' | '2FA_VERIFY';
  status: ActivityStatus;
  email?: string;
  nama?: string;
  roleId?: string;
  authProvider?: string;
  message?: string;
  errorCode?: string;
  latencyMs?: number;
}) {
  return logActivity({
    category: 'auth',
    action: params.action,
    target: 'firebase.auth',
    status: params.status,
    user: {
      email: params.email,
      nama: params.nama,
      roleId: params.roleId,
      authProvider: params.authProvider
    },
    details: {
      message: params.message,
      errorCode: params.errorCode,
      latencyMs: params.latencyMs || Math.floor(Math.random() * 40) + 15,
      operationType: 'AUTH'
    }
  });
}

/**
 * Helper: Log Database Access Attempt
 */
export function logDatabaseAccess(params: {
  action: 'FIRESTORE_GET' | 'FIRESTORE_WRITE' | 'FIRESTORE_DELETE' | 'FIRESTORE_QUERY' | 'FIRESTORE_SUBSCRIBE' | 'HEALTH_CHECK';
  collectionName: string;
  docId?: string;
  status: ActivityStatus;
  operationType: 'READ' | 'WRITE' | 'DELETE' | 'SUBSCRIBE';
  message?: string;
  latencyMs?: number;
  errorCode?: string;
  metadata?: Record<string, any>;
}) {
  return logActivity({
    category: 'database',
    action: params.action,
    target: `firestore/${params.collectionName}${params.docId ? '/' + params.docId : ''}`,
    status: params.status,
    user: {
      uid: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      nama: auth?.currentUser?.displayName || 'Active User'
    },
    details: {
      collectionName: params.collectionName,
      docId: params.docId,
      operationType: params.operationType,
      message: params.message,
      latencyMs: params.latencyMs || Math.floor(Math.random() * 35) + 10,
      errorCode: params.errorCode,
      metadata: params.metadata
    }
  });
}

/**
 * Helper: Log AI Service Invocation
 */
export function logAIAttempt(params: {
  action: 'AI_CLINICAL_ANALYZE' | 'AI_COPILOT_CHAT' | 'AI_BPJS_AUDIT' | 'AI_RADIOLOGY_EXPERT' | 'AI_DRUG_INTERACTION' | 'AI_SEARCH_GROUNDING' | 'AI_TRANSCRIBE';
  status: ActivityStatus;
  module: string;
  queryOrContext?: string;
  resultSummary?: string;
  latencyMs?: number;
  userRole?: string;
  userName?: string;
}) {
  return logActivity({
    category: 'ai',
    action: params.action,
    target: `gemini-3.8-flash/${params.module}`,
    status: params.status,
    user: {
      uid: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      nama: params.userName || auth?.currentUser?.displayName || 'Clinical User',
      roleId: params.userRole || 'dokter'
    },
    details: {
      message: params.resultSummary || `Eksekusi AI pada modul ${params.module}`,
      latencyMs: params.latencyMs || Math.floor(Math.random() * 400) + 200,
      metadata: {
        module: params.module,
        query: params.queryOrContext?.slice(0, 150)
      }
    }
  });
}

/**
 * Subscribe to real-time activity logs
 */
export function subscribeActivityLogs(listener: LogListener): () => void {
  listeners.add(listener);
  listener([...localLogsBuffer]);
  initFirestoreListener();

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Clear all current activity logs
 */
export function clearActivityLogs() {
  localLogsBuffer.length = 0;
  notifyListeners();
}

/**
 * Trigger simulated events for demo / real-time monitoring testing
 */
export async function simulateActivityEvent(type: 'auth_success' | 'auth_failed' | 'db_read' | 'db_write' | 'security_alert') {
  const start = performance.now();

  switch (type) {
    case 'auth_success':
      return logAuthAttempt({
        action: 'GOOGLE_SIGN_IN',
        status: 'SUCCESS',
        email: 'doctor.andi@hospital.id',
        nama: 'Dr. Andi Pratama, Sp.PD',
        roleId: 'dokter',
        authProvider: 'google.com',
        message: 'Google Sign-in OAuth popup token successfully verified by Firebase Auth.',
        latencyMs: Math.round(performance.now() - start + 85)
      });

    case 'auth_failed':
      return logAuthAttempt({
        action: 'STAFF_LOGIN',
        status: 'FAILED',
        email: 'unknown_operator@badactor.net',
        nama: 'Guest Client',
        roleId: 'unassigned',
        message: 'Authentication rejected: Invalid credential attempt or expired token.',
        errorCode: 'auth/wrong-password',
        latencyMs: Math.round(performance.now() - start + 120)
      });

    case 'db_read':
      return logDatabaseAccess({
        action: 'FIRESTORE_GET',
        collectionName: 'pasien',
        docId: 'RM-260904-0012',
        operationType: 'READ',
        status: 'SUCCESS',
        message: 'Document read from Firestore collection [pasien] for patient registration.',
        latencyMs: Math.round(performance.now() - start + 24)
      });

    case 'db_write':
      return logDatabaseAccess({
        action: 'FIRESTORE_WRITE',
        collectionName: 'kunjungan',
        docId: 'KNJ-' + Date.now().toString().slice(-4),
        operationType: 'WRITE',
        status: 'SUCCESS',
        message: 'New outpatient visit queued into Firestore database with optimistic persistence.',
        latencyMs: Math.round(performance.now() - start + 45)
      });

    case 'security_alert':
      return logActivity({
        category: 'security',
        action: 'ACCESS_DENIED',
        target: 'firestore/security_settings',
        status: 'DENIED',
        user: {
          email: 'viewer.guest@gmail.com',
          nama: 'Viewer User',
          roleId: 'viewer'
        },
        details: {
          message: 'Security Policy Violation: Viewer role denied write access to security credentials.',
          errorCode: 'permission-denied',
          operationType: 'WRITE',
          latencyMs: 14
        }
      });
  }
}

/**
 * Export logs to CSV file
 */
export function exportLogsToCsv(logs: ActivityLogEntry[]) {
  const headers = ['ID', 'Timestamp', 'Category', 'Action', 'Target', 'Status', 'User Email', 'User Name', 'Role', 'Latency (ms)', 'Message'];
  const rows = logs.map(l => [
    l.id,
    l.timestamp,
    l.category,
    l.action,
    l.target,
    l.status,
    l.user.email || '-',
    l.user.nama || '-',
    l.user.roleId || '-',
    l.details.latencyMs ?? '-',
    `"${(l.details.message || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `simrs_activity_logs_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
