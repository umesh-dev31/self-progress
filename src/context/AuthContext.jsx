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
        if (err.code && err.code !== 'auth/popup-closed-by-user') {
          console.error('Redirect sign-in error:', err);
        }
      });
  }, []);

  const loginWithGoogle = async () => {
    setSyncStatus('syncing');

    // Try popup first — works on desktop and many mobile browsers
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setSyncStatus('synced');
      return result.user;
    } catch (popupError) {
      // If popup was blocked/failed on mobile, fall back to redirect
      const isPopupBlocked = [
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/cancelled-popup-request',
        'auth/internal-error'
      ].includes(popupError.code);

      if (isPopupBlocked) {
        console.log('Popup blocked, falling back to redirect...');
        try {
          await signInWithRedirect(auth, googleProvider);
          // Page will redirect — execution stops here
        } catch (redirectError) {
          console.error('Redirect sign-in also failed:', redirectError);
          setSyncStatus('error');
          alert(`Sign-in failed: ${redirectError.message}`);
        }
      } else {
        console.error('Google Sign-In Error:', popupError);
        setSyncStatus('error');
        alert(`Sign-in failed: ${popupError.message}`);
      }
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
