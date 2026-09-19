const fs = require('fs');

// 1. Delete AI Studio Firebase config files
if (fs.existsSync('firebase-applet-config.json')) fs.unlinkSync('firebase-applet-config.json');
if (fs.existsSync('firebase-blueprint.json')) fs.unlinkSync('firebase-blueprint.json');
if (fs.existsSync('firestore.rules')) fs.unlinkSync('firestore.rules');

// 2. Rewrite src/lib/firebase.ts to use env variables safely
const firebaseTsContent = `
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Only initialize if config exists to prevent app crash
export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

const app = isFirebaseConfigured ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]) : null as any;
export const auth = isFirebaseConfigured ? getAuth(app) : null as any;
export const db = isFirebaseConfigured ? getFirestore(app) : null as any;
export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null as any;

if (isFirebaseConfigured && googleProvider) {
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
}

export default app;
`;
fs.writeFileSync('src/lib/firebase.ts', firebaseTsContent.trim());

// 3. Update AuthContext.tsx to handle unconfigured Firebase
let authContext = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');

// Update import to include isFirebaseConfigured
authContext = authContext.replace(
  /import \{ auth, db, googleProvider \} from '\.\.\/lib\/firebase';/,
  "import { auth, db, googleProvider, isFirebaseConfigured } from '../lib/firebase';"
);

// In useEffect onAuthStateChanged
authContext = authContext.replace(
  /const unsubscribe = onAuthStateChanged\(auth, async \(fUser\) => \{/,
  `const unsubscribe = isFirebaseConfigured ? onAuthStateChanged(auth, async (fUser) => {`
);

authContext = authContext.replace(
  /\n    \}\);\n    return \(\) => \{/g,
  `\n    }) : () => {};\n    return () => {`
);

// In signInWithGoogle
authContext = authContext.replace(
  /const signInWithGoogle = async \(\): Promise<\{ success: boolean; message: string; isCancelled\?: boolean \}> => \{/,
  `const signInWithGoogle = async (): Promise<{ success: boolean; message: string; isCancelled?: boolean }> => {
    if (!isFirebaseConfigured) {
      return { success: false, message: 'Firebase belum dikonfigurasi. Silakan tambahkan konfigurasi Firebase Anda.' };
    }`
);

// In logout
authContext = authContext.replace(
  /await firebaseSignOut\(auth\)\.catch\(\(\) => \{\}\);/,
  `if (isFirebaseConfigured) await firebaseSignOut(auth).catch(() => {});`
);

// In addUser
authContext = authContext.replace(
  /await setDoc\(doc\(db, 'users', newId\), \{/g,
  `if (isFirebaseConfigured) await setDoc(doc(db, 'users', newId), {`
);

// In updateUser
authContext = authContext.replace(
  /await setDoc\(doc\(db, 'users', id\), \{/g,
  `if (isFirebaseConfigured) await setDoc(doc(db, 'users', id), {`
);

// In deleteUser
authContext = authContext.replace(
  /await deleteDoc\(doc\(db, 'users', id\)\);/g,
  `if (isFirebaseConfigured) await deleteDoc(doc(db, 'users', id));`
);

fs.writeFileSync('src/contexts/AuthContext.tsx', authContext);
console.log('Firebase cleanup and safety patches applied.');
