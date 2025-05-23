import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, provider } from "../firebase";

// Create and export AuthContext
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        displayName: displayName,
        createdAt: serverTimestamp(),
        isPremium: false,
        dailyAttempts: 0,
        lastAttemptDate: new Date().toDateString(),
        typingStats: {
          averageWPM: 0,
          averageAccuracy: 0,
          testsCompleted: 0,
          bestWPM: 0,
          recentTests: [],
        },
        examProgress: {},
        preferences: {
          darkMode: true,
          sound: true,
        },
      });

      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateLoginTimestamp(userCredential.user.uid);
      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          isPremium: false,
          dailyAttempts: 0,
          lastAttemptDate: new Date().toDateString(),
          typingStats: {
            averageWPM: 0,
            averageAccuracy: 0,
            testsCompleted: 0,
            bestWPM: 0,
            recentTests: [],
          },
          examProgress: {},
          preferences: {
            darkMode: true,
            sound: true,
          },
        });
      } else {
        // Update login timestamp
        await updateLoginTimestamp(user.uid);
      }

      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function updateLoginTimestamp(userId) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating login timestamp:", error);
    }
  }

  async function updateUserStats(userId, testResults) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const { wpm, accuracy, examType, duration } = testResults;
      const currentStats = userData.typingStats;
      const testsCompleted = currentStats.testsCompleted + 1;

      // Calculate new averages
      const newAverageWPM = Math.round(
        (currentStats.averageWPM * currentStats.testsCompleted + wpm) /
          testsCompleted
      );
      const newAverageAccuracy = Math.round(
        (currentStats.averageAccuracy * currentStats.testsCompleted +
          accuracy) /
          testsCompleted
      );

      // Keep track of recent tests (last 10)
      const recentTests = [
        {
          date: new Date().toISOString(),
          wpm,
          accuracy,
          examType,
          duration,
        },
        ...currentStats.recentTests.slice(0, 9),
      ];

      await updateDoc(userRef, {
        typingStats: {
          averageWPM: newAverageWPM,
          averageAccuracy: newAverageAccuracy,
          testsCompleted,
          bestWPM: Math.max(wpm, currentStats.bestWPM),
          recentTests,
        },
      });
    } catch (error) {
      console.error("Error updating user stats:", error);
      throw error;
    }
  }

  async function updateUserPreferences(userId, preferences) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        preferences: preferences,
      });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
  }

  async function checkPremiumStatus(userId) {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? userDoc.data().isPremium : false;
    } catch (error) {
      console.error("Error checking premium status:", error);
      return false;
    }
  }

  async function updatePremiumStatus(userId, isPremium) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        isPremium: isPremium,
        premiumUpdatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating premium status:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser({
            ...user,
            ...userDoc.data(),
          });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserStats,
    updateUserPreferences,
    checkPremiumStatus,
    updatePremiumStatus,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
