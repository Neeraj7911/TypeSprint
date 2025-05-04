import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { jsPDF } from "jspdf";
import CustomCursor from "./CustomCursor";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import Logo from "../assets/logo.png";
import Stamp from "../assets/stamp.png";
import {
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaStar,
  FaLock,
} from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [latestCertificate, setLatestCertificate] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [credits, setCredits] = useState(0); // New state for credits
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser);
      } else {
        setLoading(false);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchUserData = async (currentUser) => {
    setLoading(true);
    try {
      // Fetch user credits
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setCredits(userDoc.data().credits || 0);
      } else {
        setCredits(0);
      }

      // Fetch test results
      const resultsSnapshot = await getDocs(
        collection(db, "users", currentUser.uid, "results")
      );
      const results = resultsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        wpm: doc.data().netWpm || doc.data().wpm || 0,
      }));
      setTestResults(
        results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      );

      // Fetch certificates
      const certsSnapshot = await getDocs(collection(db, "certificates"));
      const userCerts = certsSnapshot.docs
        .filter((doc) => doc.data().userEmail === currentUser.email)
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setLatestCertificate(userCerts[0] || null);

      // Fetch leaderboard
      const leaderboardSnapshot = await getDocs(collection(db, "leaderboard"));
      const leaderboard = leaderboardSnapshot.docs
        .map((doc) => ({ email: doc.id, ...doc.data() }))
        .sort((a, b) => (b.netWpm || b.wpm) - (a.netWpm || a.wpm));
      setLeaderboardData(leaderboard);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const WPMProgressCircle = ({ wpm, targetWPM }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(wpm / targetWPM, 1);
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <div className="relative flex items-center justify-center h-32 w-32">
        <svg width="120" height="120" className="transform -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="cyan"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-bold text-cyan-400">{wpm}</p>
          <p className="text-xs text-gray-400">of {targetWPM}</p>
        </div>
      </div>
    );
  };

  const progressChartData = {
    labels: testResults
      .slice(0, 10)
      .reverse()
      .map((r) => new Date(r.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "WPM",
        data: testResults
          .slice(0, 10)
          .reverse()
          .map((r) => r.wpm),
        borderColor: "cyan",
        backgroundColor: "rgba(0, 255, 255, 0.3)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Accuracy",
        data: testResults
          .slice(0, 10)
          .reverse()
          .map((r) => r.accuracy || 0),
        borderColor: "magenta",
        backgroundColor: "rgba(255, 0, 128, 0.3)",
        fill: true,
        tension: 0.4,
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

  const heatmapData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: "WPM",
        data: Array(24)
          .fill(0)
          .map((_, hour) => {
            const hourTests = testResults.filter(
              (r) => new Date(r.timestamp).getHours() === hour
            );
            return hourTests.length
              ? Math.max(...hourTests.map((r) => r.wpm))
              : 0;
          }),
        backgroundColor: "rgba(0, 255, 255, 0.5)",
      },
    ],
  };

  const heatmapOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "white" } },
      tooltip: { callbacks: { label: (ctx) => `WPM: ${ctx.raw}` } },
    },
    scales: {
      x: { ticks: { color: "white" } },
      y: { ticks: { color: "white" }, beginAtZero: true },
    },
  };

  const downloadCertificate = (cert) => {
    const pdfDoc = new jsPDF();
    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    const pageHeight = pdfDoc.internal.pageSize.getHeight();

    pdfDoc.setFontSize(24);
    pdfDoc.setTextColor(0, 102, 204);
    pdfDoc.text("Typing Certificate", pageWidth / 2, 20, { align: "center" });
    pdfDoc.addImage(Logo, "PNG", (pageWidth - 50) / 2, 30, 50, 50);

    pdfDoc.setFontSize(14);
    pdfDoc.setTextColor(0);
    const userName = user.displayName || "User";
    pdfDoc.text(
      `This is to certify that ${userName} has successfully`,
      pageWidth / 2,
      90,
      { align: "center" }
    );
    pdfDoc.text(
      "completed the TypeSprint Challenge with commendable typing skills.",
      pageWidth / 2,
      100,
      { align: "center" }
    );
    pdfDoc.text(
      "This certificate acknowledges their proficiency and dedication.",
      pageWidth / 2,
      110,
      { align: "center" }
    );

    pdfDoc.setFontSize(16);
    pdfDoc.text(`Email: ${user.email}`, 20, 150);
    pdfDoc.text(`Words Per Minute (WPM): ${cert.wpm}`, 20, 160);
    pdfDoc.text(`Accuracy: ${cert.accuracy}%`, 20, 170);
    pdfDoc.text(`Date: ${new Date(cert.date).toLocaleDateString()}`, 20, 180);
    pdfDoc.text(`Certificate Number: ${cert.id}`, 20, 190);

    pdfDoc.addImage(Stamp, "PNG", pageWidth - 70, pageHeight - 70, 50, 50);
    pdfDoc.setFontSize(10);
    pdfDoc.setTextColor(100);
    pdfDoc.text(
      "Verify this certificate at: typingtest-9f8f6.web.app/verify",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    pdfDoc.save(`Typing_Certificate_${cert.id}.pdf`);
  };

  const shareCertificate = (platform) => {
    if (!latestCertificate) return;
    const text = `I just earned a TypeSprint Certificate! WPM: ${
      latestCertificate.wpm
    }, Accuracy: ${latestCertificate.accuracy}% on ${new Date(
      latestCertificate.date
    ).toLocaleDateString()}. Check it out!`;
    const url = "https://typingtest-9f8f6.web.app/verify";
    let shareUrl;

    switch (platform) {
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(text)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}&quote=${encodeURIComponent(text)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          `${text} ${url}`
        )}`;
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim() || rating === 0) return;

    try {
      await addDoc(collection(db, "reviews"), {
        userId: user.uid,
        userName: user.displayName || user.email.split("@")[0],
        reviewText: review,
        rating: rating,
        timestamp: serverTimestamp(),
        approved: false,
      });
      setReview("");
      setRating(0);
      setSubmitStatus("Review submitted for approval!");
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setSubmitStatus("Error submitting review. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-cyan-500 border-r-magenta-500 rounded-full"
        />
      </div>
    );
  }

  if (!user) return null;

  const bestWPM = testResults.length
    ? Math.max(...testResults.map((r) => r.wpm || 0))
    : 0;
  const leaderboardEntry = leaderboardData.find(
    (entry) => entry.email === user.uid
  );
  const leaderboardPosition =
    leaderboardData.findIndex((entry) => entry.email === user.uid) + 1 || "N/A";
  const bestExam = testResults.reduce(
    (prev, curr) => ((prev.wpm || 0) > (curr.wpm || 0) ? prev : curr),
    { wpm: 0, examName: "None" }
  );
  const consistency =
    testResults.length >= 2
      ? Math.round(
          (Math.min(...testResults.map((r) => r.wpm || 0)) /
            Math.max(...testResults.map((r) => r.wpm || 0))) *
            100
        ) || 0
      : "N/A";
  const avgErrors = testResults.length
    ? (
        testResults.reduce((sum, r) => sum + (r.errors || 0), 0) /
        testResults.length
      ).toFixed(1)
    : 0;

  const allAchievements = [
    {
      name: "Speed Demon",
      icon: "🏎️",
      desc: "50+ WPM",
      condition: bestWPM >= 50,
    },
    {
      name: "Accuracy Master",
      icon: "🎯",
      desc: "90%+ Accuracy",
      condition: testResults.some((r) => (r.accuracy || 0) >= 90),
    },
    {
      name: "Test Veteran",
      icon: "🏅",
      desc: "10+ Tests",
      condition: testResults.length >= 10,
    },
    {
      name: "Typing Pro",
      icon: "💻",
      desc: "75+ WPM",
      condition: bestWPM >= 75,
    },
    {
      name: "Perfectionist",
      icon: "✅",
      desc: "100% Accuracy",
      condition: testResults.some((r) => (r.accuracy || 0) === 100),
    },
    {
      name: "Marathon Typist",
      icon: "🏃‍♂️",
      desc: "25+ Tests",
      condition: testResults.length >= 25,
    },
    {
      name: "Lightning Fingers",
      icon: "⚡",
      desc: "100+ WPM",
      condition: bestWPM >= 100,
    },
    {
      name: "Error Slayer",
      icon: "🗡️",
      desc: "0 Errors",
      condition: testResults.some((r) => (r.errors || 0) === 0),
    },
    {
      name: "Night Owl",
      icon: "🦇",
      desc: "Typed at Midnight",
      condition: testResults.some((r) => {
        const hour = new Date(r.timestamp).getHours();
        return hour === 0 || hour === 1;
      }),
    },
    {
      name: "Early Bird",
      icon: "🐦",
      desc: "Typed in Morning",
      condition: testResults.some((r) => {
        const hour = new Date(r.timestamp).getHours();
        return hour >= 5 && hour <= 7;
      }),
    },
    {
      name: "Consistent Star",
      icon: "⭐",
      desc: "90%+ Consistency",
      condition: consistency !== "N/A" && consistency >= 90,
    },
    {
      name: "Exam Conqueror",
      icon: "🏰",
      desc: "5+ Exams",
      condition: new Set(testResults.map((r) => r.examName)).size >= 5,
    },
    {
      name: "Quick Learner",
      icon: "📚",
      desc: "WPM +20 in 2 Tests",
      condition: testResults.some(
        (r, i) => i > 0 && (r.wpm || 0) - (testResults[i - 1].wpm || 0) >= 20
      ),
    },
    {
      name: "Error Minimalist",
      icon: "🧹",
      desc: "Avg Errors < 2",
      condition: avgErrors > 0 && avgErrors < 2,
    },
    {
      name: "Sprint Champion",
      icon: "🏆",
      desc: "60+ WPM, 95%+ Acc",
      condition: testResults.some(
        (r) => (r.wpm || 0) >= 60 && (r.accuracy || 0) >= 95
      ),
    },
    {
      name: "Daily Grinder",
      icon: "🔧",
      desc: "5 Days in Row",
      condition: (() => {
        const dates = testResults
          .map((r) => new Date(r.timestamp).toDateString())
          .sort();
        let streak = 1;
        for (let i = 1; i < dates.length; i++) {
          const prevDate = new Date(dates[i - 1]);
          const currDate = new Date(dates[i]);
          const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
          if (diffDays === 1) streak++;
          else if (diffDays > 1) streak = 1;
          if (streak >= 5) return true;
        }
        return false;
      })(),
    },
    {
      name: "Typing Titan",
      icon: "🦁",
      desc: "50+ Tests",
      condition: testResults.length >= 50,
    },
    {
      name: "Precision Sniper",
      icon: "🔍",
      desc: "5+ Tests 95%+ Acc",
      condition: testResults.filter((r) => (r.accuracy || 0) >= 95).length >= 5,
    },
    {
      name: "Speed Surge",
      icon: "🚀",
      desc: "WPM +10 in 1 Day",
      condition: (() => {
        const byDay = testResults.reduce((acc, r) => {
          const day = new Date(r.timestamp).toDateString();
          acc[day] = acc[day] || [];
          acc[day].push(r.wpm || 0);
          return acc;
        }, {});
        return Object.values(byDay).some(
          (day) => Math.max(...day) - Math.min(...day) >= 10
        );
      })(),
    },
    {
      name: "Master Typist",
      icon: "👑",
      desc: "80+ WPM, 0 Errors",
      condition: testResults.some(
        (r) => (r.wpm || 0) >= 80 && (r.errors || 0) === 0
      ),
    },
  ];

  const achievedAchievements = allAchievements.filter(
    (achievement) => achievement.condition
  );
  const remainingAchievements = allAchievements.filter(
    (achievement) => !achievement.condition
  );

  const tips = [];
  if (bestWPM < 40)
    tips.push("Practice daily with short bursts to boost your WPM!");
  if (avgErrors > 5)
    tips.push("Slow down a bit to reduce errors and improve accuracy.");
  if (consistency !== "N/A" && consistency < 80)
    tips.push("Try consistent practice times to stabilize your performance.");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white relative">
      <CustomCursor />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <section className="mt-10 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-cyan-400">Dashboard</h1>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => auth.signOut().then(() => navigate("/login"))}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
            >
              Sign Out
            </motion.button>
          </section>

          <section className="mb-12 mt-3">
            <div className="flex items-center space-x-6 bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
              <img
                src={user.photoURL || "https://via.placeholder.com/80"}
                alt="Profile"
                className="w-20 h-20 rounded-full border-2 border-cyan-500"
              />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.displayName || user.email.split("@")[0]}{" "}
                  {latestCertificate && (
                    <span className="text-green-400 text-sm">Certified</span>
                  )}{" "}
                  {leaderboardEntry?.examName && (
                    <span className="text-blue-400 text-sm">
                      ({leaderboardEntry.examName})
                    </span>
                  )}
                </h2>
                <p className="text-gray-300">{user.email}</p>
                <p className="text-sm text-gray-400">
                  Leaderboard Rank: {leaderboardPosition}
                </p>
                <p className="text-sm text-cyan-400">Credits: {credits}</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Performance Insights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <p className="text-xl font-semibold text-cyan-400">Best WPM</p>
                <WPMProgressCircle wpm={bestWPM} targetWPM={100} />
              </div>
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <p className="text-xl font-semibold text-cyan-400">
                  Consistency
                </p>
                <p className="text-3xl font-bold text-white">
                  {consistency === "N/A" ? "N/A" : `${consistency}%`}
                </p>
                <p className="text-sm text-gray-400">WPM stability</p>
              </div>
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <p className="text-xl font-semibold text-cyan-400">Best Exam</p>
                <p className="text-xl font-bold text-white">
                  {bestExam.examName}
                </p>
                <p className="text-sm text-gray-400">WPM: {bestExam.wpm}</p>
              </div>
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <p className="text-xl font-semibold text-cyan-400">
                  Avg Accuracy
                </p>
                <p className="text-3xl font-bold text-white">
                  {testResults.length > 0
                    ? Math.round(
                        testResults.reduce(
                          (sum, r) => sum + (r.accuracy || 0),
                          0
                        ) / testResults.length
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <p className="text-xl font-semibold text-cyan-400">
                  Avg Errors
                </p>
                <p className="text-3xl font-bold text-white">{avgErrors}</p>
                <p className="text-sm text-gray-400">Per test</p>
              </div>
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <p className="text-xl font-semibold text-cyan-400">
                  Total Tests
                </p>
                <p className="text-3xl font-bold text-white">
                  {testResults.length}
                </p>
              </div>
            </div>
          </section>

          {(achievedAchievements.length > 0 ||
            remainingAchievements.length > 0) && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Achievements
              </h2>
              <div className="space-y-6">
                {/* Achieved Achievements */}
                {achievedAchievements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-3">
                      Achieved ({achievedAchievements.length})
                    </h3>
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800">
                      {achievedAchievements.map((badge, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex-shrink-0 w-32 bg-gray-800 bg-opacity-80 p-3 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300 relative group"
                        >
                          <div className="w-12 h-12 mx-auto rounded-full bg-cyan-600 flex items-center justify-center text-2xl">
                            {badge.icon}
                          </div>
                          <p className="text-sm font-semibold text-white text-center mt-2 truncate">
                            {badge.name}
                          </p>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-xs text-gray-300 p-2 rounded shadow-lg z-10">
                            {badge.desc}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Remaining Achievements */}
                {remainingAchievements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-400 mb-3">
                      Remaining ({remainingAchievements.length})
                    </h3>
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800">
                      {remainingAchievements.map((achievement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex-shrink-0 w-32 bg-gray-800 bg-opacity-80 p-3 rounded-lg shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300 relative group grayscale"
                        >
                          <div className="w-12 h-12 mx-auto rounded-full bg-gray-600 flex items-center justify-center text-2xl relative">
                            {achievement.icon}
                            <FaLock className="absolute text-gray-400 text-sm" />
                          </div>
                          <p className="text-sm font-semibold text-gray-300 text-center mt-2 truncate">
                            {achievement.name}
                          </p>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-xs text-gray-300 p-2 rounded shadow-lg z-10">
                            {achievement.desc}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {testResults.length > 1 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Progress Over Time
              </h2>
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <Line data={progressChartData} options={chartOptions} />
              </div>
            </section>
          )}

          {testResults.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Typing Speed by Hour
              </h2>
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <Bar data={heatmapData} options={heatmapOptions} />
              </div>
            </section>
          )}

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Tests Taken
            </h2>
            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl max-h-96 overflow-y-auto">
              {testResults.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-900 bg-opacity-50">
                      <th className="p-4 text-cyan-400">Exam</th>
                      <th className="p-4 text-cyan-400">WPM</th>
                      <th className="p-4 text-cyan-400">Accuracy</th>
                      <th className="p-4 text-cyan-400">Errors</th>
                      <th className="p-4 text-cyan-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((test) => (
                      <tr
                        key={test.id}
                        className="border-b border-gray-700 hover:bg-gray-700 hover:bg-opacity-50"
                      >
                        <td className="p-4">{test.examName}</td>
                        <td className="p-4">{test.wpm}</td>
                        <td className="p-4">{test.accuracy || 0}%</td>
                        <td className="p-4">{test.errors || 0}</td>
                        <td className="p-4">
                          {new Date(test.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">No tests taken yet.</p>
              )}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Latest TypeSprint Certificate
            </h2>
            <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
              {latestCertificate ? (
                <div className="p-4 bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-xl font-semibold text-white">
                        TypeSprint Challenge
                      </p>
                      <p className="text-gray-400">
                        WPM: {latestCertificate.wpm} | Accuracy:{" "}
                        {latestCertificate.accuracy}% | Date:{" "}
                        {new Date(latestCertificate.date).toLocaleDateString()}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadCertificate(latestCertificate)}
                      className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold"
                    >
                      Download
                    </motion.button>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => shareCertificate("linkedin")}
                      className="p-2 bg-blue-700 rounded-full"
                      title="Share on LinkedIn"
                    >
                      <FaLinkedin size={24} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => shareCertificate("facebook")}
                      className="p-2 bg-blue-600 rounded-full"
                      title="Share on Facebook"
                    >
                      <FaFacebook size={24} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => shareCertificate("twitter")}
                      className="p-2 bg-blue-400 rounded-full"
                      title="Share on Twitter"
                    >
                      <FaTwitter size={24} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      onClick={() => shareCertificate("whatsapp")}
                      className="p-2 bg-green-500 rounded-full"
                      title="Share on WhatsApp"
                    >
                      <FaWhatsapp size={24} />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">
                  No TypeSprint Challenge certificate earned yet. Take the
                  challenge on the home page!
                </p>
              )}
            </div>
          </section>

          {tips.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Personalized Tips
              </h2>
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <ul className="space-y-2">
                  {tips.map((tip, index) => (
                    <li key={index} className="text-gray-300">
                      • {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Quick Actions & Review
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
                  }}
                  onClick={() => navigate("/exams")}
                  className="px-6 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
                >
                  Take a Test
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 15px rgba(255, 0, 128, 0.7)",
                  }}
                  onClick={() => navigate("/leaderboard")}
                  className="px-6 py-3 bg-magenta-500 text-black rounded-lg font-semibold hover:bg-magenta-400 transition-colors"
                >
                  View Leaderboard
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
                  }}
                  onClick={() => navigate("/")}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                >
                  Back to Home
                </motion.button>
              </div>
              <div className="bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl">
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">
                  Leave a Review
                </h3>
                <form onSubmit={handleReviewSubmit}>
                  <div className="mb-4">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={24}
                          className={`cursor-pointer ${
                            star <= rating ? "text-yellow-400" : "text-gray-400"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Share your feedback..."
                      className="w-full p-2 bg-gray-700 rounded-lg text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      rows="3"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    type="submit"
                    className="w-full py-2 bg-cyan-500 text-black rounded-lg font-semibold"
                  >
                    Submit Review
                  </motion.button>
                  {submitStatus && (
                    <p className="mt-2 text-sm text-center text-gray-300">
                      {submitStatus}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
