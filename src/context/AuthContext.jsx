import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState('local'); // 'local' | 'synced' | 'syncing' | 'error'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setSyncStatus(currentUser ? 'synced' : 'local');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setSyncStatus('syncing');
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setSyncStatus('synced');
      return result.user;
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setSyncStatus('error');
      // If popup was blocked or closed by user, don't throw an alert unless needed
      if (err.code !== 'auth/popup-closed-by-user') {
        alert(`Sign-in failed: ${err.message}`);
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSyncStatus('local');
    } catch (err) {
      console.error('Sign-Out Error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      syncStatus,
      setSyncStatus,
      loginWithGoogle,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
