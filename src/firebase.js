import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

const requiredFirebaseKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFirebaseKeys = requiredFirebaseKeys.filter((key) => !firebaseConfig[key]);
if (missingFirebaseKeys.length > 0) {
  throw new Error(`Missing Firebase env values: ${missingFirebaseKeys.join(', ')}`);
}
const placeholderFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => typeof value === 'string' && value.startsWith('PASTE_'))
  .map(([key]) => key);
if (placeholderFirebaseKeys.length > 0) {
  throw new Error(`Replace placeholder Firebase env values: ${placeholderFirebaseKeys.join(', ')}`);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics =
  typeof window !== 'undefined' && firebaseConfig.measurementId ? getAnalytics(app) : null;

export { app, auth, googleProvider, analytics };
