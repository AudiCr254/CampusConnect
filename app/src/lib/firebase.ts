import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSZelEcE7fApeeE3070pRi_uG375JX6Is",
  authDomain: "campusconnect-57059.firebaseapp.com",
  projectId: "campusconnect-57059",
  storageBucket: "campusconnect-57059.firebasestorage.app",
  messagingSenderId: "959880972794",
  appId: "1:959880972794:web:f1ac9fb9bc14f2a4943c43",
  measurementId: "G-XWFS4SJR9H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);

// Export Firestore functions for use throughout the app
export {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
};

export default app;
