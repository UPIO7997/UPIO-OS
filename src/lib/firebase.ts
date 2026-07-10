import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0425179801",
  appId: "1:553382046362:web:e7f86022f8bc3efccf8d23",
  apiKey: "AIzaSyDz-Cg71EtQ7uHk935SMgebv3X-mVtVSaY",
  authDomain: "gen-lang-client-0425179801.firebaseapp.com",
  storageBucket: "gen-lang-client-0425179801.firebasestorage.app",
  messagingSenderId: "553382046362",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-upioos-61408313-e420-4056-bda7-823252a4d663");
export const auth = getAuth(app);
