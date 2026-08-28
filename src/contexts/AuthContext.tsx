import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { ROLES, hasModuleAccess, getRoleById } from '../data/roles';

export interface User {
  id: string;
  username: string;
  password?: string;
  nama: string;
  roleId: string;
  email: string;
  photoURL?: string;
  aktif: boolean;
  dibuatPada: string;
  isGoogleAuth?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  users: User[];
  loading: boolean;
  login: (username: string, password: string) => { success: boolean; message: string };
  signInWithGoogle: () => Promise<{ success: boolean; message: string; isCancelled?: boolean }>;
  logout: () => Promise<void>;
  hasAccess: (moduleId: string) => boolean;
  isAdmin: boolean;
  // User management
  addUser: (user: Omit<User, 'id' | 'dibuatPada'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Seed Users (Simulated/Local fallback)
const DEFAULT_USERS: User[] = [
  { id: '1', username: 'mhs001', password: 'mahasiswa001', nama: 'Administrator Utama', roleId: 'super_admin', email: 'admin@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '2', username: 'admin', password: 'admin123', nama: 'Staff Adm Sistem', roleId: 'admin', email: 'staffadmin@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '3', username: 'direksi', password: 'direksi123', nama: 'dr. H. Hendra, MARS (Direktur)', roleId: 'direksi', email: 'direksi@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '4', username: 'dokter', password: 'dokter123', nama: 'dr. Budi Santoso, Sp.PD', roleId: 'dokter', email: 'budi@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '5', username: 'perawat', password: 'perawat123', nama: 'Ns. Siti Fatimah, S.Kep', roleId: 'perawat', email: 'siti@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '6', username: 'bidan', password: 'bidan123', nama: 'Bd. Nurul Aini, S.Tr.Keb', roleId: 'bidan', email: 'bidan@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '7', username: 'apoteker', password: 'apotek123', nama: 'apt. Dewi Lestari, S.Farm', roleId: 'apoteker', email: 'dewi@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '8', username: 'kasir', password: 'kasir123', nama: 'Rina Melati, S.E.', roleId: 'kasir', email: 'rina@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '9', username: 'pendaftaran', password: 'daftar123', nama: 'Joko Anwar, A.Md', roleId: 'pendaftaran', email: 'joko@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '10', username: 'rekammedis', password: 'rm123', nama: 'Sari Indah, A.Md.RMIK', roleId: 'rekam_medis', email: 'sari@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '11', username: 'laboran', password: 'lab123', nama: 'Ahmad Fauzi, A.Md.AK', roleId: 'laboran', email: 'laboran@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '12', username: 'radiografer', password: 'rad123', nama: 'Bayu Pratama, A.Md.Rad', roleId: 'radiografer', email: 'radiografer@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '13', username: 'mutu', password: 'mutu123', nama: 'drg. Maya Sari (Komite Mutu)', roleId: 'manajemen_mutu', email: 'mutu@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
  { id: '14', username: 'gizi', password: 'gizi123', nama: 'Citra Kirana, S.Gz', roleId: 'gizi', email: 'gizi@myitaru.rs', aktif: true, dibuatPada: '2026-01-01' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('auth_users');
    let parsedUsers = [...DEFAULT_USERS];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsedUsers = parsed;
        }
      } catch (e) {
        console.warn('Error parsing auth_users from localStorage', e);
      }
    }

    // Ensure mhs001 exists as Super Admin
    const mhsIndex = parsedUsers.findIndex((u: User) => u.roleId === 'super_admin' || u.username === 'mhs001');
    if (mhsIndex !== -1) {
      parsedUsers[mhsIndex].username = 'mhs001';
      parsedUsers[mhsIndex].password = 'mahasiswa001';
      parsedUsers[mhsIndex].roleId = 'super_admin';
      parsedUsers[mhsIndex].aktif = true;
    } else {
      const defaultMhs = DEFAULT_USERS.find(u => u.username === 'mhs001');
      if (defaultMhs) parsedUsers.unshift(defaultMhs);
    }

    const otherDemos = ['admin', 'direksi', 'dokter', 'perawat', 'bidan', 'apoteker', 'kasir', 'pendaftaran', 'rekammedis', 'laboran', 'radiografer', 'mutu', 'gizi'];
    otherDemos.forEach(demoUsername => {
      const defaultData = DEFAULT_USERS.find(d => d.username === demoUsername);
      if (defaultData) {
        const existingIndex = parsedUsers.findIndex((u: User) => u.username === demoUsername);
        if (existingIndex !== -1) {
          parsedUsers[existingIndex].password = defaultData.password;
          parsedUsers[existingIndex].aktif = true;
        } else {
          parsedUsers.push(defaultData);
        }
      }
    });
    
    if (saved) {
      try {
        localStorage.setItem('auth_users', JSON.stringify(parsedUsers));
      } catch (e) {
        console.warn('Failed to save auth_users', e);
      }
    }
    return parsedUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Error parsing auth_current_user from localStorage', e);
      }
    }
    return null;
  });

  // Sync users list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('auth_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Failed to save auth_users to localStorage', e);
    }
  }, [users]);

  // Sync current user session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('auth_current_user', JSON.stringify(currentUser));
        localStorage.setItem('hospital_auth', 'true');
      } else {
        localStorage.removeItem('auth_current_user');
        localStorage.removeItem('hospital_auth');
      }
    } catch (e) {
      console.warn('Failed to sync auth_current_user', e);
    }
  }, [currentUser]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          // Check if user exists in Firestore
          const userDocRef = doc(db, 'users', fUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let userProfile: User;
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            userProfile = {
              id: fUser.uid,
              username: data.username || fUser.email?.split('@')[0] || 'google_user',
              nama: data.nama || fUser.displayName || 'Google User',
              email: fUser.email || '',
              photoURL: fUser.photoURL || undefined,
              roleId: data.roleId || 'super_admin',
              aktif: data.aktif ?? true,
              dibuatPada: data.dibuatPada || new Date().toISOString().split('T')[0],
              isGoogleAuth: true
            };
          } else {
            // New Google User - save to Firestore as super_admin by default for ease of access
            userProfile = {
              id: fUser.uid,
              username: fUser.email?.split('@')[0] || 'google_user',
              nama: fUser.displayName || 'Google User',
              email: fUser.email || '',
              photoURL: fUser.photoURL || undefined,
              roleId: 'super_admin',
              aktif: true,
              dibuatPada: new Date().toISOString().split('T')[0],
              isGoogleAuth: true
            };
            await setDoc(userDocRef, {
              uid: fUser.uid,
              nama: userProfile.nama,
              email: userProfile.email,
              photoURL: userProfile.photoURL || '',
              roleId: userProfile.roleId,
              username: userProfile.username,
              aktif: true,
              dibuatPada: userProfile.dibuatPada,
              updatedAt: new Date().toISOString()
            });
          }

          setCurrentUser(userProfile);
        } catch (err) {
          console.error('Error fetching Firestore user profile:', err);
          // Fallback to local profile with Firebase Auth info
          const fallbackUser: User = {
            id: fUser.uid,
            username: fUser.email?.split('@')[0] || 'google_user',
            nama: fUser.displayName || 'Google User',
            email: fUser.email || '',
            photoURL: fUser.photoURL || undefined,
            roleId: 'super_admin',
            aktif: true,
            dibuatPada: new Date().toISOString().split('T')[0],
            isGoogleAuth: true
          };
          setCurrentUser(fallbackUser);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In with Firebase Auth
  const signInWithGoogle = async (): Promise<{ success: boolean; message: string; isCancelled?: boolean }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fUser = result.user;
      
      const userDocRef = doc(db, 'users', fUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      let roleId = 'super_admin';
      let aktif = true;

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        roleId = data.roleId || 'super_admin';
        aktif = data.aktif ?? true;
      } else {
        await setDoc(userDocRef, {
          uid: fUser.uid,
          nama: fUser.displayName || 'Google User',
          email: fUser.email || '',
          photoURL: fUser.photoURL || '',
          roleId: 'super_admin',
          username: fUser.email?.split('@')[0] || 'google_user',
          aktif: true,
          dibuatPada: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString()
        });
      }

      if (!aktif) {
        await firebaseSignOut(auth);
        return { success: false, message: 'Akun Google Anda dinonaktifkan oleh administrator.' };
      }

      const loggedUser: User = {
        id: fUser.uid,
        username: fUser.email?.split('@')[0] || 'google_user',
        nama: fUser.displayName || 'Google User',
        email: fUser.email || '',
        photoURL: fUser.photoURL || undefined,
        roleId,
        aktif: true,
        dibuatPada: new Date().toISOString().split('T')[0],
        isGoogleAuth: true
      };

      setCurrentUser(loggedUser);
      return { success: true, message: `Selamat datang, ${loggedUser.nama}!` };
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return { success: false, isCancelled: true, message: 'Login dengan Google dibatalkan.' };
      }
      if (error?.code === 'auth/popup-blocked') {
        return { success: false, message: 'Jendela login diblokir peramban. Mohon izinkan popup di browser Anda.' };
      }
      if (error?.code === 'auth/network-request-failed') {
        return { success: false, message: 'Koneksi jaringan terputus. Silakan coba kembali.' };
      }
      if (error?.code === 'auth/unauthorized-domain') {
        return { success: false, message: 'Domain ini belum diizinkan di Firebase Console OAuth.' };
      }
      console.warn('Firebase Google Sign-In notice:', error?.message || error);
      return { success: false, message: error.message || 'Gagal masuk dengan Google' };
    }
  };

  const login = (username: string, password: string) => {
    const user = users.find(u => u.username && u.username.toLowerCase() === username.trim().toLowerCase());

    if (!user) {
      return { success: false, message: 'Username tidak ditemukan' };
    }
    if (!user.aktif) {
      return { success: false, message: 'Akun Anda dinonaktifkan. Hubungi administrator.' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Password salah' };
    }

    setCurrentUser(user);
    const role = getRoleById(user.roleId);
    return { success: true, message: `Selamat datang, ${user.nama} (${role?.nama || 'User'})` };
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
    setCurrentUser(null);
    setFirebaseUser(null);
    localStorage.removeItem('auth_current_user');
    localStorage.removeItem('hospital_auth');
  };

  const hasAccess = (moduleId: string): boolean => {
    if (!currentUser) return false;
    return hasModuleAccess(currentUser.roleId, moduleId);
  };

  const addUser = async (userData: Omit<User, 'id' | 'dibuatPada'>) => {
    const newId = Date.now().toString();
    const newUser: User = {
      ...userData,
      id: newId,
      dibuatPada: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);

    // Also persist to Firestore if connected
    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'users', newId), {
          uid: newId,
          nama: newUser.nama,
          email: newUser.email,
          username: newUser.username,
          roleId: newUser.roleId,
          aktif: newUser.aktif,
          dibuatPada: newUser.dibuatPada,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Could not sync user to Firestore:', err);
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }

    try {
      if (auth.currentUser) {
        await setDoc(doc(db, 'users', id), {
          ...data,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Could not sync user update to Firestore:', err);
    }
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const isAdmin = currentUser?.roleId === 'super_admin' || currentUser?.roleId === 'admin';

  return (
    <AuthContext.Provider value={{
      currentUser,
      firebaseUser,
      users,
      loading,
      login,
      signInWithGoogle,
      logout,
      hasAccess,
      isAdmin,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}
