import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import CustomCursor from "../components/CustomCursor";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [showNotification, setShowNotification] = useState(true);
  const navigate = useNavigate();
  const ENTRIES_PER_PAGE = 10;
  const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour
  const CACHE_KEY_FULL = "leaderboard_cache_full";
  const CACHE_KEY_TOTAL = "leaderboard_cache_total";
  const CACHE_VERSION = "1.0";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(
        "Auth state changed:",
        currentUser ? "Logged in" : "Logged out"
      );
      setUser(currentUser);
      if (currentUser) {
        fetchLeaderboard(1);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const sanitizePhotoURL = (url) => {
    if (!url || typeof url !== "string") {
      return "";
    }
    const trimmed = url.trim();
    if (!trimmed.match(/^https?:\/\/.+/)) {
      return "";
    }
    return trimmed;
  };

  const loadCachedData = async () => {
    try {
      const cachedFull = localStorage.getItem(CACHE_KEY_FULL);
      const cachedTotal = localStorage.getItem(CACHE_KEY_TOTAL);
      if (cachedFull && cachedTotal) {
        const { data, lastFetched, version } = JSON.parse(cachedFull);
        const { totalEntries } = JSON.parse(cachedTotal);
        if (version !== CACHE_VERSION) {
          console.log("Cache version mismatch, clearing cache");
          localStorage.removeItem(CACHE_KEY_FULL);
          localStorage.removeItem(CACHE_KEY_TOTAL);
          return null;
        }
        const metadataDoc = await getDoc(doc(db, "metadata", "leaderboard"));
        const serverLastUpdated = metadataDoc.exists()
          ? metadataDoc.data().lastUpdated
          : null;
        if (
          serverLastUpdated &&
          lastFetched &&
          new Date(lastFetched) < new Date(serverLastUpdated)
        ) {
          console.log("Cache outdated due to server update");
          return null;
        }
        if (Date.now() - new Date(lastFetched).getTime() < CACHE_EXPIRY) {
          console.log("Using cached leaderboard data");
          return { data, lastFetched, totalEntries };
        }
      }
    } catch (err) {
      console.error("Error loading cached data:", err);
      return null;
    }
    return null;
  };

  const saveCachedData = (data, lastFetched, totalEntries) => {
    try {
      localStorage.setItem(
        CACHE_KEY_FULL,
        JSON.stringify({ data, lastFetched, version: CACHE_VERSION })
      );
      localStorage.setItem(CACHE_KEY_TOTAL, JSON.stringify({ totalEntries }));
      console.log("Cached leaderboard data saved");
    } catch (err) {
      console.error("Error saving cached data:", err);
    }
  };

  const fetchLeaderboard = async (page, forceRefresh = false) => {
    setLoading(true);
    setError("");
    console.log(
      `Fetching leaderboard for page ${page}, forceRefresh: ${forceRefresh}`
    );
    const startTime = performance.now();

    let fullData = [];
    let lastFetched = null;
    let totalEntries = 0;
    if (!forceRefresh) {
      const cached = await loadCachedData();
      if (cached) {
        fullData = cached.data;
        lastFetched = cached.lastFetched;
        totalEntries = cached.totalEntries;
        const pageData = fullData
          .slice((page - 1) * ENTRIES_PER_PAGE, page * ENTRIES_PER_PAGE)
          .map((entry, index) => ({
            position: (page - 1) * ENTRIES_PER_PAGE + index + 1,
            ...entry,
          }));
        setLeaderboardData(pageData);
        setTotalPages(Math.ceil(totalEntries / ENTRIES_PER_PAGE));
        setCurrentPage(page);
        setLoading(false);
        console.log(
          `Loaded ${pageData.length} entries from cache for page ${page}`
        );
      }
    }

    try {
      const userMap = new Map();
      const emailToUidMap = new Map();

      const usersQuery =
        forceRefresh || !lastFetched
          ? collection(db, "users")
          : query(
              collection(db, "users"),
              where("timestamp", ">", lastFetched)
            );
      const usersSnapshot = await getDocs(usersQuery);
      console.log(`Fetched ${usersSnapshot.docs.length} user documents`);
      const userProfiles = new Map();
      usersSnapshot.docs.forEach((userDoc) => {
        try {
          const userData = userDoc.data();
          const uid = userDoc.id;
          userProfiles.set(uid, {
            displayName: userData.displayName || null,
            photoURL: sanitizePhotoURL(userData.photoURL) || null,
            email: userData.email || null,
          });
          if (userData.email) {
            emailToUidMap.set(userData.email, uid);
          }
        } catch (err) {
          console.error("Error processing user document:", err);
        }
      });

      const userIds = Array.from(userProfiles.keys());
      const resultPromises = userIds.map((userId) => {
        const resultsQuery =
          forceRefresh || !lastFetched
            ? collection(db, "users", userId, "results")
            : query(
                collection(db, "users", userId, "results"),
                where("timestamp", ">", lastFetched)
              );
        return getDocs(resultsQuery).then((snapshot) => ({ userId, snapshot }));
      });
      const resultsSnapshots = await Promise.all(resultPromises);
      console.log(`Fetched results for ${resultsSnapshots.length} users`);

      for (const { userId, snapshot } of resultsSnapshots) {
        try {
          const totalTests = snapshot.docs.length;
          let highestNetWpm = 0;
          let bestResult = null;

          snapshot.forEach((doc) => {
            try {
              const data = doc.data();
              const netWpm = parseInt(data.netWpm || data.wpm, 10) || 0;
              if (netWpm > highestNetWpm) {
                highestNetWpm = netWpm;
                bestResult = data;
              }
            } catch (err) {
              console.error("Error processing result document:", err);
            }
          });

          if (bestResult) {
            const userProfile = userProfiles.get(userId);
            const isValidName = (name) =>
              name &&
              !/^[a-zA-Z0-9]{28,32}$/.test(name) &&
              name !== "User" &&
              name.trim().length > 0;
            const name = isValidName(userProfile.displayName)
              ? userProfile.displayName
              : isValidName(bestResult.userName)
                ? bestResult.userName
                : userProfile.email
                  ? userProfile.email.split("@")[0]
                  : bestResult.userEmail
                    ? bestResult.userEmail.split("@")[0]
                    : "Guest";

            const photoURL = sanitizePhotoURL(
              userProfile.photoURL || bestResult.photoURL
            );
            userMap.set(userId, {
              name,
              netWpm: highestNetWpm,
              email:
                userProfile.email ||
                bestResult.userEmail ||
                `${userId}@example.com`,
              photoURL: photoURL || "",
              examName: bestResult.examName || "",
              isCertified: false,
              totalTests,
              source: "results",
            });
          }
        } catch (err) {
          console.error("Error processing user results:", err);
        }
      }

      const certsQuery =
        forceRefresh || !lastFetched
          ? collection(db, "certificates")
          : query(
              collection(db, "certificates"),
              where("timestamp", ">", lastFetched)
            );
      const certsSnapshot = await getDocs(certsQuery);
      console.log(`Fetched ${certsSnapshot.docs.length} certificate documents`);
      const certsByUser = new Map();
      certsSnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          let userId = doc.id;
          if (!userProfiles.has(userId) && data.userEmail) {
            userId = emailToUidMap.get(data.userEmail) || userId;
          }
          const netWpm = parseInt(data.netWpm || data.wpm, 10) || 0;

          if (!certsByUser.has(userId)) {
            certsByUser.set(userId, {
              netWpm,
              examName: data.examName || "",
              userName: data.userName || "",
              photoURL: sanitizePhotoURL(data.photoURL) || "",
              userEmail: data.userEmail || "",
              isCertified: true,
              count: 0,
            });
          }
          const cert = certsByUser.get(userId);
          cert.count += 1;
          if (netWpm > cert.netWpm) {
            cert.netWpm = netWpm;
            cert.examName = data.examName || cert.examName;
            cert.userName = data.userName || cert.userName;
            cert.photoURL = sanitizePhotoURL(data.photoURL) || cert.photoURL;
            cert.userEmail = data.userEmail || cert.userEmail;
          }
        } catch (err) {
          console.error("Error processing certificate document:", err);
        }
      });

      for (const [userId, cert] of certsByUser) {
        try {
          const userProfile = userProfiles.get(userId) || {
            displayName: null,
            photoURL: null,
            email: cert.userEmail || null,
          };

          const isValidName = (name) =>
            name &&
            !/^[a-zA-Z0-9]{28,32}$/.test(name) &&
            name !== "User" &&
            name.trim().length > 0;
          const name = isValidName(userProfile.displayName)
            ? userProfile.displayName
            : isValidName(cert.userName)
              ? cert.userName
              : userProfile.email
                ? userProfile.email.split("@")[0]
                : cert.userEmail
                  ? cert.userEmail.split("@")[0]
                  : "Guest";

          const photoURL = sanitizePhotoURL(
            userProfile.photoURL || cert.photoURL
          );
          const existing = userMap.get(userId);
          const totalTests = cert.count || 0;
          if (existing) {
            if (cert.netWpm > existing.netWpm) {
              userMap.set(userId, {
                ...existing,
                netWpm: cert.netWpm,
                examName: cert.examName || existing.examName,
                photoURL: photoURL || existing.photoURL,
                name,
                isCertified: true,
                totalTests:
                  existing.totalTests > 0 ? existing.totalTests : totalTests,
                source: "certificates",
              });
            } else {
              userMap.set(userId, {
                ...existing,
                isCertified: true,
                totalTests:
                  existing.totalTests > 0 ? existing.totalTests : totalTests,
              });
            }
          } else {
            userMap.set(userId, {
              name,
              netWpm: cert.netWpm,
              email:
                userProfile.email || cert.userEmail || `${userId}@example.com`,
              photoURL: photoURL || "",
              examName: cert.examName || "",
              isCertified: true,
              totalTests,
              source: "certificates",
            });
          }
        } catch (err) {
          console.error("Error processing certificate:", err);
        }
      }

      const leaderboardQuery =
        forceRefresh || !lastFetched
          ? collection(db, "leaderboard")
          : query(
              collection(db, "leaderboard"),
              where("timestamp", ">", lastFetched)
            );
      const leaderboardSnapshot = await getDocs(leaderboardQuery);
      console.log(
        `Fetched ${leaderboardSnapshot.docs.length} leaderboard documents`
      );
      leaderboardSnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          const userId = doc.id;
          const netWpm = parseInt(data.netWpm || data.wpm, 10) || 0;
          const userProfile = userProfiles.get(userId) || {
            displayName: null,
            photoURL: null,
            email: data.userEmail || null,
          };

          const isValidName = (name) =>
            name &&
            !/^[a-zA-Z0-9]{28,32}$/.test(name) &&
            name !== "User" &&
            name.trim().length > 0;
          const name = isValidName(userProfile.displayName)
            ? userProfile.displayName
            : isValidName(data.userName)
              ? data.userName
              : userProfile.email
                ? userProfile.email.split("@")[0]
                : data.userEmail
                  ? data.userEmail.split("@")[0]
                  : "Guest";

          const photoURL = sanitizePhotoURL(
            userProfile.photoURL || data.photoURL
          );
          const existing = userMap.get(userId);
          const totalTests = existing ? existing.totalTests : 0;
          if (existing) {
            if (netWpm > existing.netWpm) {
              userMap.set(userId, {
                ...existing,
                netWpm,
                examName: data.examName || existing.examName,
                photoURL: photoURL || existing.photoURL,
                name,
                email: userProfile.email || data.userEmail || existing.email,
                totalTests:
                  existing.totalTests > 0 ? existing.totalTests : totalTests,
                source: "leaderboard",
              });
            }
          } else {
            userMap.set(userId, {
              name,
              netWpm,
              email:
                userProfile.email || data.userEmail || `${userId}@example.com`,
              photoURL: photoURL || "",
              examName: data.examName || "",
              isCertified: false,
              totalTests,
              source: "leaderboard",
            });
          }
        } catch (err) {
          console.error("Error processing leaderboard document:", err);
        }
      });

      if (!forceRefresh && fullData.length > 0) {
        const cachedMap = new Map(
          fullData.map((entry) => [entry.email, entry])
        );
        for (const entry of userMap.values()) {
          cachedMap.set(entry.email, entry);
        }
        fullData = Array.from(cachedMap.values());
      } else {
        fullData = Array.from(userMap.values());
      }

      const sortedData = fullData
        .filter(
          (entry) => entry.netWpm > 0 && entry.email && entry.netWpm < 200
        )
        .sort((a, b) => b.netWpm - a.netWpm)
        .slice(0, 100);
      totalEntries = sortedData.length;
      setTotalPages(Math.ceil(totalEntries / ENTRIES_PER_PAGE));
      const startIndex = (page - 1) * ENTRIES_PER_PAGE;
      const pageData = sortedData
        .slice(startIndex, startIndex + ENTRIES_PER_PAGE)
        .map((entry, index) => ({
          position: startIndex + index + 1,
          name: entry.name,
          netWpm: entry.netWpm,
          examName: entry.examName,
          isCertified: entry.isCertified,
          photoURL: entry.photoURL,
          email: entry.email,
          totalTests: entry.totalTests,
        }));

      setLeaderboardData(pageData);
      setCurrentPage(page);
      saveCachedData(sortedData, new Date().toISOString(), totalEntries);
      console.log(
        `Loaded ${pageData.length} entries for page ${page}, total entries: ${totalEntries}`
      );
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard. Please try again later.");
    } finally {
      setLoading(false);
      console.log(
        `Leaderboard fetch completed in ${(
          performance.now() - startTime
        ).toFixed(2)}ms`
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      console.log(`Changing to page ${newPage}`);
      fetchLeaderboard(newPage);
    }
  };

  const handleRefresh = () => {
    console.log("Refreshing leaderboard");
    localStorage.removeItem(CACHE_KEY_FULL);
    localStorage.removeItem(CACHE_KEY_TOTAL);
    fetchLeaderboard(currentPage, true);
  };

  const handleLoginRedirect = () => {
    console.log("Redirecting to /login");
    navigate("/login");
  };

  const handleSignupRedirect = () => {
    console.log("Redirecting to /login for signup");
    navigate("/login");
  };

  const handleGetCertified = () => {
    console.log("Redirecting to /home#certification");
    navigate("/#certification");
  };

  const defaultProfileSVG = `
    data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M12 8a3 3 0 0 0-3 3v2a3 3 0 0 0 6 0v-2a3 3 0 0 0-3-3z'/%3E%3Cpath d='M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2'/%3E%3C/svg%3E
  `;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-blue-900 to-black"
          : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"
      } text-white flex items-center justify-center p-4 relative`}
    >
      <CustomCursor />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-blue-500 relative z-10 mt-14"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          TypeSprint Leaderboard
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Top 100 typists ranked by their highest Net Words Per Minute (Net
          WPM).
        </p>

        {!user && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <p className="text-gray-300 text-lg">
              Please log in or sign up to view the leaderboard.
            </p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginRedirect}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold cursor-pointer"
              >
                Log In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignupRedirect}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-300 font-semibold cursor-pointer"
              >
                Sign Up
              </motion.button>
            </div>
          </motion.div>
        )}

        {user && loading && (
          <div className="text-center">
            <svg
              className="animate-spin h-10 w-10 mx-auto text-blue-400"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <p className="mt-2">Loading leaderboard...</p>
          </div>
        )}

        {user && error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-gray-900 bg-opacity-80 rounded-lg border border-red-500 text-red-200 text-center"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {user && !loading && !error && leaderboardData.length > 0 && (
          <>
            <div className="flex flex-col items-end mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold"
              >
                Refresh Leaderboard
              </motion.button>
              <div className="mt-2 text-right text-xs text-gray-400">
                * use the refresh button to get the latest results
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-900 bg-opacity-50">
                    <th className="p-4 text-blue-400 font-semibold">
                      Position
                    </th>
                    <th className="p-4 text-blue-400 font-semibold">Name</th>
                    <th className="p-4 text-blue-400 font-semibold">Net WPM</th>
                    <th className="p-4 text-blue-400 font-semibold">
                      Total Tests
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => (
                    <motion.tr
                      key={entry.email}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-50 transition-colors duration-200 ${
                        entry.position <= 3
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                    >
                      <td className="p-4">
                        {entry.position <= 3 ? (
                          <span className="text-2xl">
                            {entry.position === 1 && "🥇"}
                            {entry.position === 2 && "🥈"}
                            {entry.position === 3 && "🥉"}
                          </span>
                        ) : (
                          entry.position
                        )}
                      </td>
                      <td className="p-4 flex items-center space-x-3">
                        <img
                          src={entry.photoURL || defaultProfileSVG}
                          alt={`${entry.name}'s profile`}
                          className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.src = defaultProfileSVG;
                          }}
                        />
                        <span>
                          {entry.name}{" "}
                          {entry.isCertified && (
                            <span className="text-green-400 text-sm">
                              Certified
                            </span>
                          )}{" "}
                          {entry.examName && (
                            <span className="text-blue-400 text-sm">
                              ({entry.examName})
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="p-4">{entry.netWpm}</td>
                      <td className="p-4">{entry.totalTests}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  } text-white font-semibold transition-all duration-300`}
                >
                  Previous
                </motion.button>
                <span className="text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  } text-white font-semibold transition-all duration-300`}
                >
                  Next
                </motion.button>
              </div>
            )}
          </>
        )}

        {user && !loading && !error && leaderboardData.length === 0 && (
          <p className="text-center text-gray-400">
            No records found. Start typing to join the leaderboard!
          </p>
        )}
      </motion.div>

      {user && (
        <AnimatePresence>
          {showNotification && (
            <motion.div
              className={`fixed bottom-4 left-4 p-4 rounded-lg shadow-xl z-[100] ${
                darkMode
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gradient-to-r from-blue-300 to-purple-400 text-gray-800"
              } backdrop-blur-lg bg-opacity-80 max-w-sm`}
              style={{ position: "fixed" }}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-lg">Get Certified!</p>
                  <p className="text-sm">
                    Boost your typing skills with our certification program.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetCertified}
                  className="ml-4 px-4 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-300 font-semibold"
                  aria-label="Get Certified"
                >
                  Click Here
                </motion.button>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  console.log("Closing notification");
                  setShowNotification(false);
                }}
                className="absolute top-2 right-2 text-xl"
                aria-label="Close notification"
              >
                ×
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Leaderboard;
