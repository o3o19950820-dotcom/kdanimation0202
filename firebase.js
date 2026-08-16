import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
  getFirestore,
  doc,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';

export const firebaseConfig = {
  apiKey: "AIzaSyAuGSghmDO-daKTpBArSyB9jfKBOSAAc48",
  authDomain: "junokd02.firebaseapp.com",
  projectId: "junokd02",
  storageBucket: "junokd02.firebasestorage.app",
  messagingSenderId: "876136442795",
  appId: "1:876136442795:web:a5bbb63bc9587769b780ee",
  measurementId: "G-E24C2CYS4M"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export {
  doc,
  onSnapshot,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
