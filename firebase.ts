import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBN4a5i2HyeVYcEL3Um5HVwUjBJT5J4_6o",
  authDomain: "chatapplication-with-cha-307d4.firebaseapp.com",
  projectId: "chatapplication-with-cha-307d4",
  storageBucket: "chatapplication-with-cha-307d4.appspot.com",
  messagingSenderId: "764684037582",
  appId: "1:764684037582:web:2a9bf1d2e2369084404f9f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
