import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // Your Firebase configuration object
  apiKey: "AIzaSyDKQzb3D6vZy7binahW7GI9lxVVm0iFPXA",
  authDomain: "typingtest-9f8f6.firebaseapp.com",
  projectId: "typingtest-9f8f6",
  storageBucket: "typingtest-9f8f6.firebasestorage.app",
  messagingSenderId: "688131208050",
  appId: "1:688131208050:web:1c4254fc6f0aab75f463eb",
  measurementId: "G-89YFKM43TH",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const provider = new GoogleAuthProvider();

export async function getDailyAttempts(userId) {
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);
  const userData = userDoc.data();

  if (!userData) {
    return { attempts: 0, canAttempt: true };
  }

  const today = new Date().toDateString();
  const lastAttemptDate = userData.lastAttemptDate;
  const dailyAttempts = userData.dailyAttempts || 0;

  if (lastAttemptDate !== today) {
    return { attempts: 0, canAttempt: true };
  }

  return { attempts: dailyAttempts, canAttempt: dailyAttempts < 2 };
}

export async function incrementDailyAttempts(userId) {
  const userRef = doc(db, "users", userId);
  const today = new Date().toDateString();

  const { attempts } = await getDailyAttempts(userId);

  await updateDoc(userRef, {
    dailyAttempts: attempts + 1,
    lastAttemptDate: today,
  });
}
