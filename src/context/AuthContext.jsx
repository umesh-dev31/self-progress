import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged 
} from '../firebase';

const AuthContext = createContext(null);

// Detect mobile browser
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
}

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

  // Handle redirect result when coming back from Google sign-in on mobile
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
          setSyncStatus('synced');
        }
      })
      .catch((err) => {
        // Only log real errors, not "no redirect result" 
        if (err.code && err.code !== 'auth/popup-closed-by-user') {
          console.error('Redirect sign-in error:', err);
          setSyncStatus('error');
        }
      });
  }, []);

  const loginWithGoogle = async () => {
    try {
      setSyncStatus('syncing');

      if (isMobileDevice()) {
        // Mobile: Use redirect (navigates to Google, then comes back)
        await signInWithRedirect(auth, googleProvider);
        // Page will redirect — execution stops here on mobile
      } else {
        // Desktop: Use popup (opens Google in a new window)
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
        setSyncStatus('synced');
        return result.user;
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setSyncStatus('error');
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
