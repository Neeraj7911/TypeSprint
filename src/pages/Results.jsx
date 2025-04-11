import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { gsap } from "gsap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    grossWpm,
    netWpm,
    accuracy,
    errors,
    targetWPM,
    examName,
    language,
    font,
  } = location.state || {};
  const containerRef = useRef(null);
  const prevStateRef = useRef(null); // Track previous location.state

  const [userId, setUserId] = useState(null);
  const [pastResults, setPastResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [leaderboardUpdated, setLeaderboardUpdated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false); // Prevent duplicate saves

  useEffect(() => {
    const saveAndFetchResults = async () => {
      setIsLoading(true);
      const user = auth.currentUser;
      if (!user || hasSaved || !location.state) {
        setIsLoading(false);
        return;
      }

      try {
        setUserId(user.uid);
        const resultData = {
          grossWpm: grossWpm || 0,
          netWpm: netWpm || 0,
          accuracy: accuracy || 0,
          errors: errors || 0,
          targetWPM,
          examName,
          language,
          timestamp: new Date().toISOString(),
        };

        const resultRef = doc(
          db,
          "users",
          user.uid,
          "results",
          `${examName}-${Date.now()}`
        );
        await setDoc(resultRef, resultData);
        setHasSaved(true); // Mark as saved

        const resultsSnapshot = await getDocs(
          collection(db, "users", user.uid, "results")
        );
        const results = resultsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPastResults(results.filter((r) => r.examName === examName));

        const score = Math.min(
          100,
          (netWpm / targetWPM) * 50 + accuracy / 2 - errors * 2
        );
        setPerformanceScore(Math.round(score));

        const leaderboardRef = doc(db, "leaderboard", user.uid);
        const leaderboardDoc = await getDoc(leaderboardRef);
        const previousBest = leaderboardDoc.exists()
          ? leaderboardDoc.data().netWpm || 0
          : 0;

        if (netWpm > previousBest) {
          await setDoc(
            leaderboardRef,
            {
              userName: user.displayName || user.email.split("@")[0],
              userEmail: user.email,
              netWpm,
              examName,
              photoURL: user.photoURL || "https://via.placeholder.com/40",
              timestamp: new Date().toISOString(),
            },
            { merge: true }
          );
          setLeaderboardUpdated(true);
        }
      } catch (error) {
        console.error("Error saving or fetching results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (location.state && location.state !== prevStateRef.current) {
      prevStateRef.current = location.state;
      setHasSaved(false); // Reset for new test data
      saveAndFetchResults();
    } else {
      setIsLoading(false);
    }
  }, [location.state]);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
      );
    }
  }, [isLoading]);

  const WPMProgressCircle = ({ wpm, targetWPM }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(wpm / targetWPM, 1);
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <div className="relative flex items-center justify-center h-64">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="cyan"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-4xl font-bold text-cyan-400">{wpm}</p>
          <p className="text-sm text-gray-400">of {targetWPM} WPM</p>
        </div>
      </div>
    );
  };

  const barChartData = {
    labels: ["Gross WPM", "Net WPM", "Target WPM"],
    datasets: [
      {
        label: "WPM",
        data: [grossWpm || 0, netWpm || 0, targetWPM || 0],
        backgroundColor: [
          "rgba(0, 255, 255, 0.7)",
          "rgba(0, 200, 200, 0.7)",
          "rgba(255, 0, 128, 0.7)",
        ],
        borderColor: ["cyan", "teal", "magenta"],
        borderWidth: 2,
      },
    ],
  };

  const lineChartData = {
    labels: pastResults.map((r) => new Date(r.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Net WPM",
        data: pastResults.map((r) => r.netWpm || r.wpm || 0), // Handle legacy data
        borderColor: "cyan",
        backgroundColor: "rgba(0, 255, 255, 0.3)",
        fill: true,
        tension: 0.5,
      },
      {
        label: "Accuracy",
        data: pastResults.map((r) => r.accuracy || 0),
        borderColor: "magenta",
        backgroundColor: "rgba(255, 0, 128, 0.3)",
        fill: true,
        tension: 0.5,
      },
    ],
  };

  const doughnutChartData = {
    labels: ["Correct", "Errors"],
    datasets: [
      {
        data: [accuracy || 0, 100 - (accuracy || 0)],
        backgroundColor: ["rgba(0, 255, 255, 0.8)", "rgba(255, 0, 128, 0.8)"],
        borderColor: ["cyan", "magenta"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "white" } } },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" }, beginAtZero: true },
    },
  };

  const getAdvancedInsights = () => {
    const insights = [];
    const wpmDiff = (netWpm || 0) - (targetWPM || 0);
    if (wpmDiff < -5)
      insights.push(
        "Neural Analysis: Increase synaptic response time with rapid key drills."
      );
    if ((accuracy || 0) < 85)
      insights.push(
        "Precision Alert: Calibrate input accuracy with focused character repetition."
      );
    if ((errors || 0) > 10)
      insights.push(
        "Error Threshold Exceeded: Optimize hand-eye coordination via holographic keyboard sim."
      );
    if ((netWpm || 0) > (targetWPM || 0) && (accuracy || 0) > 90)
      insights.push(
        "Elite Status: Maintain quantum efficiency with advanced texts."
      );
    return insights.length > 0
      ? insights
      : ["System Optimal: Continue enhancing neural pathways."];
  };

  if (!location.state) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-500 font-futura text-xl">
          Error: No Data Detected. Initiate a Test Sequence.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-cyan-500 border-r-magenta-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900 via-magenta-900 to-black opacity-80" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-magenta-500 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

      <motion.div
        ref={containerRef}
        className="max-w-5xl mx-auto p-8 relative z-10"
      >
        <h1 className="text-5xl font-bold text-cyan-400 mb-8 text-center font-futura tracking-wider">
          {examName} Neural Typing Matrix
        </h1>

        {leaderboardUpdated && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-900 bg-opacity-80 p-4 rounded-lg border border-green-500 text-green-200 text-center mb-6"
          >
            <p>
              Quantum Leap Detected! Leaderboard Updated with New Personal Best
              ({examName}).
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
            }}
            className="bg-gray-900 bg-opacity-80 p-6 rounded-xl border border-cyan-500"
          >
            <p className="text-xl font-semibold text-cyan-400">Net WPM</p>
            <p className="text-3xl text-white">{netWpm || 0}</p>
            <p className="text-sm text-gray-400">Target: {targetWPM || 0}</p>
            <WPMProgressCircle wpm={netWpm || 0} targetWPM={targetWPM || 0} />
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255, 0, 128, 0.5)",
            }}
            className="bg-gray-900 bg-opacity-80 p-6 rounded-xl border border-magenta-500"
          >
            <p className="text-xl font-semibold text-magenta-400">
              Accuracy Grid
            </p>
            <Doughnut
              data={doughnutChartData}
              options={{ ...chartOptions, cutout: "70%" }}
            />
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
            }}
            className="bg-gray-900 bg-opacity-80 p-6 rounded-xl border border-cyan-500"
          >
            <p className="text-xl font-semibold text-cyan-400">Error Flux</p>
            <p className="text-3xl text-white">{errors || 0}</p>
            <p className="text-sm text-gray-400">
              Score: {performanceScore}/100
            </p>
            <p className="text-sm text-gray-400">Gross WPM: {grossWpm || 0}</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-900 bg-opacity-80 p-6 rounded-xl border border-cyan-500"
          >
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              WPM Sync Analysis
            </h2>
            <Bar data={barChartData} options={chartOptions} />
          </motion.div>
          {pastResults.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gray-900 bg-opacity-80 p-6 rounded-xl border border-magenta-500"
            >
              <h2 className="text-2xl font-semibold text-magenta-400 mb-4">
                Temporal Progress Scan
              </h2>
              <Line data={lineChartData} options={chartOptions} />
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-gray-900 bg-opacity-80 p-6 rounded-xl border border-cyan-500 mb-8"
        >
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
            AI Neural Insights
          </h2>
          <ul className="list-disc pl-5 text-gray-300">
            {getAdvancedInsights().map((insight, index) => (
              <motion.li
                key={index}
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                className="mb-2"
              >
                {insight}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
            }}
            onClick={() =>
              navigate(
                `/typing-test?exam=${examName}&language=${language}&wpm=${targetWPM}&font=${font}&duration=5`
              )
            }
            className="px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold tracking-wide hover:bg-cyan-400 transition-all"
          >
            Retry Test
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 15px rgba(255, 0, 128, 0.7)",
            }}
            onClick={() => navigate("/exam")}
            className="px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold tracking-wide hover:bg-cyan-400 transition-all"
          >
            Back to Exams
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
            }}
            onClick={() => navigate("/leaderboard")}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-semibold tracking-wide hover:bg-cyan-500 transition-all"
          >
            View Leaderboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Results;
