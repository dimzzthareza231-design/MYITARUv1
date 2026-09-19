import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import appletConfig from '../../firebase-applet-config.json';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || appletConfig?.apiKey;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig?.authDomain;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig?.projectId;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig?.storageBucket;
const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig?.messagingSenderId;
const appId = import.meta.env.VITE_FIREBASE_APP_ID || appletConfig?.appId;
const firestoreDatabaseId = appletConfig?.firestoreDatabaseId;

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId
};

// Only initialize if config exists to prevent app crash
export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseConfigured ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]) : (null as any);
export const auth = isFirebaseConfigured ? getAuth(app) : (null as any);
export const db = isFirebaseConfigured 
  ? (firestoreDatabaseId ? getFirestore(app, firestoreDatabaseId) : getFirestore(app))
  : (null as any);
export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : (null as any);

if (isFirebaseConfigured && googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

// Connection Validation as mandated by Firebase Skill
if (isFirebaseConfigured && db) {
  (async function testConnection() {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      console.log('[Firestore] Connected successfully to Cloud Firestore.');
    } catch (error: any) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.warn('[Firestore] Client is offline or network disconnected.');
      } else {
        console.info('[Firestore] Server communication validated.');
      }
    }
  })();
}

export default app;
