import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, deleteDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { logAuthAttempt } from '../lib/activityLogger';
import { ROLES, hasModuleAccess, getRoleById } from '../data/roles';
import { saveAuthSession, getAuthSession, clearAuthSession } from '../utils/sessionStore';

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
  isReadOnly: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; message: string; isCancelled?: boolean }>;
  logout: () => Promise<void>;
  hasAccess: (moduleId: string) => boolean;
  isAdmin: boolean;
  // User management
  addUser: (user: Omit<User, 'id' | 'dibuatPada'>) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default Seed Users (Hospital Staff Directory)
const DEFAULT_USERS: User[] = [
  { id: '1', username: 'mhs001', password: 'mahasiswa001', nama: 'Administrator Utama', roleId: 'super_admin', email: 'admin@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '2', username: 'admin', password: 'admin123', nama: 'Staff Adm Sistem', roleId: 'admin', email: 'staffadmin@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '3', username: 'direksi', password: 'direksi123', nama: 'dr. H. Hendra, MARS (Direktur)', roleId: 'direksi', email: 'direksi@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '4', username: 'dokter', password: 'dokter123', nama: 'dr. Budi Santoso, Sp.PD', roleId: 'dokter', email: 'budi@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '5', username: 'perawat', password: 'perawat123', nama: 'Ns. Siti Fatimah, S.Kep', roleId: 'perawat', email: 'siti@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '6', username: 'bidan', password: 'bidan123', nama: 'Bd. Nurul Aini, S.Tr.Keb', roleId: 'bidan', email: 'bidan@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '7', username: 'apoteker', password: 'apotek123', nama: 'apt. Dewi Lestari, S.Farm', roleId: 'apoteker', email: 'dewi@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '8', username: 'kasir', password: 'kasir123', nama: 'Rina Melati, S.E.', roleId: 'kasir', email: 'rina@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '9', username: 'pendaftaran', password: 'daftar123', nama: 'Joko Anwar, A.Md', roleId: 'pendaftaran', email: 'joko@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '10', username: 'rekammedis', password: 'rm123', nama: 'Sari Indah, A.Md.RMIK', roleId: 'rekam_medis', email: 'sari@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '11', username: 'laboran', password: 'lab123', nama: 'Ahmad Fauzi, A.Md.AK', roleId: 'laboran', email: 'laboran@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '12', username: 'radiografer', password: 'rad123', nama: 'Bayu Pratama, A.Md.Rad', roleId: 'radiografer', email: 'radiografer@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '13', username: 'mutu', password: 'mutu123', nama: 'drg. Maya Sari (Komite Mutu)', roleId: 'manajemen_mutu', email: 'mutu@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '14', username: 'gizi', password: 'gizi123', nama: 'Citra Kirana, S.Gz', roleId: 'gizi', email: 'gizi@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '15', username: 'rehab', password: 'rehab123', nama: 'Rian Hidayat, A.Md.FT (Rehab)', roleId: 'rehab_medik', email: 'rehab@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '16', username: 'itsupport', password: 'it123', nama: 'Bagas Setiawan, S.T. (IT Infra)', roleId: 'it_support', email: 'it@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
  { id: '17', username: 'viewer', password: 'viewer123', nama: 'Guest Viewer (Read-Only)', roleId: 'viewer', email: 'viewer@myitaru.klinik', aktif: true, dibuatPada: '2026-01-01' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);

  // Initialize Firebase Auth persistence in IndexedDB
  useEffect(() => {
    if (isFirebaseConfigured) {
      setPersistence(auth, browserLocalPersistence).catch((err) => {
        console.warn('Firebase Auth persistence setup notice:', err);
      });
    }
  }, []);

  // Sync users list from Cloud Firestore in real time (Zero localStorage consumption)
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUsers(DEFAULT_USERS);
      return;
    }
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedUsers: User[] = [];
        snapshot.forEach((docSnap) => {
          const d = docSnap.data();
          loadedUsers.push({
            id: docSnap.id,
            username: d.username || docSnap.id,
            nama: d.nama || 'Staff Klinik',
            roleId: d.roleId || 'dokter',
            email: d.email || '',
            password: d.password,
            photoURL: d.photoURL,
            aktif: d.aktif ?? true,
            dibuatPada: d.dibuatPada || '2026-01-01',
            isGoogleAuth: d.isGoogleAuth ?? false
          });
        });

        // Ensure default accounts are present
        const mergedUsers = [...loadedUsers];
        DEFAULT_USERS.forEach((defUser) => {
          if (!mergedUsers.some(u => u.username === defUser.username)) {
            mergedUsers.push(defUser);
          }
        });
        setUsers(mergedUsers);
      } else {
        // Initial setup: bootstrap default accounts into Firestore
        setUsers(DEFAULT_USERS);
        DEFAULT_USERS.forEach(async (u) => {
          try {
            await setDoc(doc(db, 'users', u.id), {
              ...u,
              updatedAt: new Date().toISOString()
            });
          } catch (_) {}
        });
      }
    }, (error) => {
      console.warn('Firestore users collection snapshot notice:', error);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firebase Auth & IndexedDB session vault
  useEffect(() => {
    let isMounted = true;

    // Safety timeout: ensure loading screen is never stuck
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 1500);

    // Restore cached session instantly from IndexedDB
    getAuthSession().then((cachedUser) => {
      if (isMounted && cachedUser) {
        setCurrentUser(cachedUser);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    const unsubscribe = isFirebaseConfigured ? onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          // Fetch user profile from Firestore
          const userDocRef = doc(db, 'users', fUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          let resolvedProfile: User;
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            const isGoogle = fUser.providerData?.some(p => p.providerId === 'google.com') || data.isGoogleAuth;
            const isSuperAdminEmail = fUser.email?.toLowerCase().trim() === 'dimzzthareza231@gmail.com';
            const finalRoleId = isSuperAdminEmail ? 'super_admin' : (data.roleId || (isGoogle ? 'viewer' : 'admin'));

            resolvedProfile = {
              id: fUser.uid,
              username: data.username || fUser.email?.split('@')[0] || 'staff',
              nama: data.nama || fUser.displayName || 'Staff Klinik',
              email: data.email || fUser.email || '',
              photoURL: data.photoURL || fUser.photoURL || undefined,
              roleId: finalRoleId,
              aktif: data.aktif ?? true,
              dibuatPada: data.dibuatPada || new Date().toISOString().split('T')[0],
              isGoogleAuth: isGoogle
            };
          } else {
            // New user authenticated via Firebase Auth
            const isGoogle = fUser.providerData?.some(p => p.providerId === 'google.com');
            const isSuperAdminEmail = fUser.email?.toLowerCase().trim() === 'dimzzthareza231@gmail.com';
            const matchedSeed = DEFAULT_USERS.find(
              u => u.email && u.email.toLowerCase() === fUser.email?.toLowerCase()
            );

            const defaultRole = isSuperAdminEmail ? 'super_admin' : (matchedSeed?.roleId || (isGoogle ? 'viewer' : 'admin'));

            resolvedProfile = {
              id: fUser.uid,
              username: matchedSeed?.username || fUser.email?.split('@')[0] || 'google_user',
              nama: matchedSeed?.nama || fUser.displayName || (isGoogle ? 'Pengguna Google' : 'Staff Klinik'),
              email: fUser.email || matchedSeed?.email || '',
              photoURL: fUser.photoURL || undefined,
              roleId: defaultRole,
              aktif: true,
              dibuatPada: new Date().toISOString().split('T')[0],
              isGoogleAuth: isGoogle
            };

            await setDoc(userDocRef, {
              uid: fUser.uid,
              username: resolvedProfile.username,
              nama: resolvedProfile.nama,
              email: resolvedProfile.email,
              photoURL: resolvedProfile.photoURL || '',
              roleId: resolvedProfile.roleId,
              aktif: true,
              dibuatPada: resolvedProfile.dibuatPada,
              isGoogleAuth: isGoogle,
              updatedAt: new Date().toISOString()
            });
          }

          if (isMounted) {
            setCurrentUser(resolvedProfile);
            await saveAuthSession(resolvedProfile);
          }
        } catch (err) {
          const isGoogle = fUser.providerData?.some(p => p.providerId === 'google.com');
          const fallbackUser: User = {
            id: fUser.uid,
            username: fUser.email?.split('@')[0] || 'user',
            nama: fUser.displayName || 'Staff Klinik',
            email: fUser.email || '',
            photoURL: fUser.photoURL || undefined,
            roleId: (isGoogle && fUser.email === 'dimzzthareza231@gmail.com') ? 'super_admin' : (isGoogle ? 'viewer' : 'super_admin'),
            aktif: true,
            dibuatPada: new Date().toISOString().split('T')[0],
            isGoogleAuth: isGoogle
          };
          if (isMounted) {
            setCurrentUser(fallbackUser);
            await saveAuthSession(fallbackUser);
          }
        }
      } else {
        // When Firebase Auth is null, check if a staff user is logged in via IndexedDB
        const storedStaff = await getAuthSession();
        if (isMounted) {
          if (storedStaff) {
            setCurrentUser(storedStaff);
          } else {
            setCurrentUser(null);
          }
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    }) : () => {};

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  // Google Sign-In with Firebase Auth persistence
  const signInWithGoogle = async (): Promise<{ success: boolean; message: string; isCancelled?: boolean }> => {
    if (!isFirebaseConfigured) {
      return { success: false, message: 'Firebase belum dikonfigurasi. Silakan tambahkan konfigurasi Firebase Anda.' };
    }
    try {
      if (isFirebaseConfigured) await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, googleProvider);
      const fUser = result.user;
      
      const userDocRef = doc(db, 'users', fUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      const isSuperAdminEmail = fUser.email?.toLowerCase().trim() === 'dimzzthareza231@gmail.com';
      let roleId = isSuperAdminEmail ? 'super_admin' : 'viewer';
      let aktif = true;

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        roleId = isSuperAdminEmail ? 'super_admin' : (data.roleId || 'viewer');
        aktif = data.aktif ?? true;
      } else {
        await setDoc(userDocRef, {
          uid: fUser.uid,
          nama: fUser.displayName || 'Pengguna Google',
          email: fUser.email || '',
          photoURL: fUser.photoURL || '',
          roleId: isSuperAdminEmail ? 'super_admin' : 'viewer',
          username: fUser.email?.split('@')[0] || 'google_user',
          aktif: true,
          dibuatPada: new Date().toISOString().split('T')[0],
          isGoogleAuth: true,
          updatedAt: new Date().toISOString()
        });
      }

      if (!aktif) {
        await firebaseSignOut(auth);
        await clearAuthSession();
        logAuthAttempt({
          action: 'GOOGLE_SIGN_IN',
          status: 'DENIED',
          email: fUser.email || undefined,
          nama: fUser.displayName || undefined,
          authProvider: 'google.com',
          message: 'Akun dinonaktifkan oleh administrator.'
        });
        return { success: false, message: 'Akun Google Anda dinonaktifkan oleh administrator.' };
      }

      const loggedUser: User = {
        id: fUser.uid,
        username: fUser.email?.split('@')[0] || 'google_user',
        nama: fUser.displayName || 'Pengguna Google',
        email: fUser.email || '',
        photoURL: fUser.photoURL || undefined,
        roleId,
        aktif: true,
        dibuatPada: new Date().toISOString().split('T')[0],
        isGoogleAuth: true
      };

      await saveAuthSession(loggedUser);
      setCurrentUser(loggedUser);
      setFirebaseUser(fUser);

      logAuthAttempt({
        action: 'GOOGLE_SIGN_IN',
        status: 'SUCCESS',
        email: loggedUser.email,
        nama: loggedUser.nama,
        roleId: loggedUser.roleId,
        authProvider: 'google.com',
        message: 'Google Sign-in popup token successfully verified by Firebase Auth.'
      });

      return { success: true, message: `Selamat datang, ${loggedUser.nama}!` };
    } catch (error: any) {
      logAuthAttempt({
        action: 'GOOGLE_SIGN_IN',
        status: error?.code?.includes('cancelled') || error?.code?.includes('closed') ? 'WARNING' : 'FAILED',
        email: 'unauthenticated',
        authProvider: 'google.com',
        errorCode: error?.code,
        message: error?.message || 'Login dengan Google dibatalkan atau gagal.'
      });

      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return { success: false, isCancelled: true, message: 'Login dengan Google dibatalkan.' };
      }
      if (error?.code === 'auth/popup-blocked') {
        return { success: false, message: 'Jendela popup login diblokir peramban. Mohon izinkan popup di peramban Anda.' };
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

  // Staff Login with IndexedDB session persistence (0 bytes localStorage quota)
  const login = async (usernameOrEmail: string, password: string): Promise<{ success: boolean; message: string }> => {
    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const user = users.find(u => 
      (u.username && u.username.toLowerCase() === cleanInput) || 
      (u.email && u.email.toLowerCase() === cleanInput)
    );

    if (!user) {
      logAuthAttempt({
        action: 'STAFF_LOGIN',
        status: 'FAILED',
        email: cleanInput,
        message: 'Pengguna atau email tidak ditemukan.'
      });
      return { success: false, message: 'Username atau email tidak ditemukan' };
    }
    if (!user.aktif) {
      logAuthAttempt({
        action: 'STAFF_LOGIN',
        status: 'DENIED',
        email: user.email,
        nama: user.nama,
        roleId: user.roleId,
        message: 'Percobaan masuk akun dinonaktifkan.'
      });
      return { success: false, message: 'Akun Anda dinonaktifkan. Hubungi administrator.' };
    }
    if (user.password && user.password !== password) {
      logAuthAttempt({
        action: 'STAFF_LOGIN',
        status: 'FAILED',
        email: user.email,
        nama: user.nama,
        roleId: user.roleId,
        message: 'Kata sandi salah.'
      });
      return { success: false, message: 'Password salah' };
    }

    // Persist authenticated staff user to IndexedDB
    await saveAuthSession(user);
    setCurrentUser(user);

    logAuthAttempt({
      action: 'STAFF_LOGIN',
      status: 'SUCCESS',
      email: user.email,
      nama: user.nama,
      roleId: user.roleId,
      authProvider: 'local',
      message: 'Staff session authenticated successfully.'
    });

    const role = getRoleById(user.roleId);
    return { 
      success: true, 
      message: `Selamat datang, ${user.nama} (${role?.nama || 'User'})` 
    };
  };

  // Logout via Firebase Auth and clear IndexedDB session
  const logout = async () => {
    if (currentUser) {
      logAuthAttempt({
        action: 'LOGOUT',
        status: 'SUCCESS',
        email: currentUser.email,
        nama: currentUser.nama,
        roleId: currentUser.roleId,
        message: 'Pengguna keluar dari sesi aplikasi.'
      });
    }

    try {
      if (isFirebaseConfigured) await firebaseSignOut(auth).catch(() => {});
    } catch (_) {}

    await clearAuthSession();
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  const hasAccess = (moduleId: string): boolean => {
    if (!currentUser) return false;
    return hasModuleAccess(currentUser.roleId, moduleId);
  };

  const addUser = async (userData: Omit<User, 'id' | 'dibuatPada'>) => {
    const newId = 'u_' + Date.now().toString();
    const newUser: User = {
      ...userData,
      id: newId,
      dibuatPada: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, newUser]);

    try {
      if (isFirebaseConfigured) await setDoc(doc(db, 'users', newId), {
        ...newUser,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Could not sync user to Firestore:', err);
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    if (currentUser && (currentUser.id === id || currentUser.username === data.username)) {
      const updated = { ...currentUser, ...data };
      setCurrentUser(updated);
      saveAuthSession(updated).catch(() => {});
    }

    try {
      if (isFirebaseConfigured) await setDoc(doc(db, 'users', id), {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Could not sync user update to Firestore:', err);
    }
  };

  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    try {
      if (isFirebaseConfigured) await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      console.warn('Could not delete user from Firestore:', err);
    }
  };

  const isAdmin = currentUser?.roleId === 'super_admin' || currentUser?.roleId === 'admin';
  const isReadOnly = currentUser?.roleId === 'viewer';

  useEffect(() => {
    if (isReadOnly) {
      document.body.classList.add('viewer-mode');
    } else {
      document.body.classList.remove('viewer-mode');
    }
  }, [isReadOnly]);

  return (
    <AuthContext.Provider value={{
      currentUser,
      firebaseUser,
      users,
      loading,
      isReadOnly,
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
