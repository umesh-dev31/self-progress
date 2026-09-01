import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBH0ZSk25GX7Bt7gabGSUqLPjxo1QSvLjE",
  authDomain: "progress-lol.firebaseapp.com",
  projectId: "progress-lol",
  storageBucket: "progress-lol.firebasestorage.app",
  messagingSenderId: "615561419516",
  appId: "1:615561419516:web:8a8e3edf4367ae23afd579",
  measurementId: "G-NPKP5Y863E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider to prompt account selection
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  onSnapshot
};
