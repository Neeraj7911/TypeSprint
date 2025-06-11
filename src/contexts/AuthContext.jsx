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

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function signup(email, password, displayName) {
    if (currentUser) {
      throw new Error("Already logged in. Please log out first.");
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
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
    if (currentUser) {
      throw new Error("Already logged in. Please log out first.");
    }
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
    if (currentUser) {
      throw new Error("Already logged in. Please log out first.");
    }
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
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
      setError("");
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

      const newAverageWPM = Math.round(
        (currentStats.averageWPM * currentStats.testsCompleted + wpm) /
          testsCompleted
      );
      const newAverageAccuracy = Math.round(
        (currentStats.averageAccuracy * currentStats.testsCompleted +
          accuracy) /
          testsCompleted
      );

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
        preferences,
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
        isPremium,
        premiumUpdatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating premium status:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          setCurrentUser(
            userDoc.exists() ? { ...user, ...userDoc.data() } : user
          );
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error in onAuthStateChanged:", error);
        setError(error.message);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    // Fallback to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("Auth loading timeout, forcing load complete");
        setLoading(false);
      }
    }, 5000); // 5-second timeout

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const value = {
    currentUser,
    loading,
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
