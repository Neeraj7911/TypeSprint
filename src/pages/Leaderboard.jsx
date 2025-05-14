import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import CustomCursor from "../components/CustomCursor";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchLeaderboard();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError("");

    try {
      const userMap = new Map();

      // Step 1: Fetch all users from the 'users' collection
      const usersSnapshot = await getDocs(collection(db, "users"));
      const allUserIds = usersSnapshot.docs.map((doc) => doc.id);

      // Step 2: Fetch results for all users to include test-takers and track max Net WPM
      for (const userId of allUserIds) {
        const resultsSnapshot = await getDocs(
          collection(db, "users", userId, "results")
        );
        const totalTests = resultsSnapshot.docs.length; // Total tests currently stored (max 10 due to Dashboard)
        let highestNetWpm = 0;
        let bestResult = null;

        // Find the highest Net WPM and corresponding data
        resultsSnapshot.forEach((doc) => {
          const data = doc.data();
          const netWpm = parseInt(data.netWpm || data.wpm, 10) || 0;
          if (netWpm > highestNetWpm) {
            highestNetWpm = netWpm;
            bestResult = data;
          }
        });

        if (bestResult) {
          const userEmail = bestResult.userEmail || `${userId}@example.com`;
          userMap.set(userEmail, {
            name: bestResult.userName || userEmail.split("@")[0],
            netWpm: highestNetWpm,
            email: userEmail,
            photoURL: bestResult.photoURL || "https://via.placeholder.com/40",
            examName: bestResult.examName || "",
            isCertified: false, // Will be updated in certificate step
            totalTests, // Use the actual count of stored tests
          });
        }
      }

      // Step 3: Fetch certificates to mark users as certified and update Net WPM if higher
      const certsSnapshot = await getDocs(collection(db, "certificates"));
      certsSnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.userEmail;
        const netWpm = parseInt(data.netWpm || data.wpm, 10) || 0;
        const existing = userMap.get(userId);

        if (existing) {
          if (netWpm > existing.netWpm) {
            userMap.set(userId, {
              ...existing,
              netWpm,
              examName: data.examName || existing.examName,
              isCertified: true,
            });
          } else {
            userMap.set(userId, {
              ...existing,
              isCertified: true,
            });
          }
        } else {
          userMap.set(userId, {
            name: data.userName || data.userEmail.split("@")[0],
            netWpm,
            email: data.userEmail,
            photoURL: data.photoURL || "https://via.placeholder.com/40",
            examName: data.examName || "",
            isCertified: true,
            totalTests: 0, // No results found, so total tests is 0
          });
        }
      });

      // Step 4: Fetch leaderboard collection to update Net WPM and examName if higher
      const leaderboardSnapshot = await getDocs(collection(db, "leaderboard"));
      leaderboardSnapshot.forEach((doc) => {
        const data = doc.data();
        const userId = data.userEmail;
        const netWpm = parseInt(data.netWpm || data.wpm, 10) || 0;
        const existing = userMap.get(userId);

        if (existing && netWpm > existing.netWpm) {
          userMap.set(userId, {
            ...existing,
            netWpm,
            examName: data.examName || existing.examName,
          });
        } else if (!existing) {
          userMap.set(userId, {
            name: data.userName || data.userEmail.split("@")[0],
            netWpm,
            email: data.userEmail,
            photoURL: data.photoURL || "https://via.placeholder.com/40",
            examName: data.examName || "",
            isCertified: false,
            totalTests: 0, // No results found, so total tests is 0
          });
        }
      });

      // Step 5: Sort and format data
      const sortedData = Array.from(userMap.values())
        .sort((a, b) => b.netWpm - a.netWpm)
        .map((entry, index) => ({
          position: index + 1,
          name: entry.name,
          netWpm: entry.netWpm,
          examName: entry.examName,
          isCertified: entry.isCertified,
          photoURL: entry.photoURL,
          email: entry.email,
          totalTests: entry.totalTests,
        }));

      setLeaderboardData(sortedData);
      console.log("Leaderboard Data:", sortedData);
    } catch (err) {
      setError("Failed to load leaderboard. Please try again later.");
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white flex items-center justify-center p-4 relative">
      <CustomCursor />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-blue-500 relative overflow-hidden z-10 mt-14"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          TypeSprint Leaderboard
        </h1>

        {!user && !loading && (
          <div className="text-center space-y-6">
            <p className="text-gray-300 text-lg">
              Please log in to view the leaderboard.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoginRedirect}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold cursor-pointer"
            >
              Log In
            </motion.button>
          </div>
        )}

        {user && (
          <>
            <p className="text-center text-gray-300 mb-8">
              Top typists ranked by their highest Net Words Per Minute (Net
              WPM).
            </p>

            {loading && (
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

            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-red-900 bg-opacity-80 rounded-lg border border-red-500 text-red-200 text-center"
              >
                <p>{error}</p>
              </motion.div>
            )}

            {!loading && !error && leaderboardData.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-900 bg-opacity-50">
                      <th className="p-4 text-blue-400 font-semibold">
                        Position
                      </th>
                      <th className="p-4 text-blue-400 font-semibold">Name</th>
                      <th className="p-4 text-blue-400 font-semibold">
                        Net WPM
                      </th>
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
                          index < 3 ? "text-yellow-400" : "text-gray-200"
                        }`}
                      >
                        <td className="p-4">
                          {index < 3 ? (
                            <span className="text-2xl">
                              {index === 0 && "🥇"}
                              {index === 1 && "🥈"}
                              {index === 2 && "🥉"}
                            </span>
                          ) : (
                            entry.position
                          )}
                        </td>
                        <td className="p-4 flex items-center space-x-3">
                          <img
                            src={entry.photoURL}
                            alt={`${entry.name}'s profile`}
                            className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/40")
                            }
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
            )}

            {!loading && !error && leaderboardData.length === 0 && (
              <p className="text-center text-gray-400">
                No records found. Start typing to join the leaderboard!
              </p>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;
