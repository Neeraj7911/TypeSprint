import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  increment,
} from "firebase/firestore";
import { gsap } from "gsap";
import { jsPDF } from "jspdf";
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
  const prevStateRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const lineChartRef = useRef(null);

  const [userId, setUserId] = useState(null);
  const [pastResults, setPastResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [leaderboardUpdated, setLeaderboardUpdated] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [credits, setCredits] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [aiReport, setAiReport] = useState("");
  const [reportError, setReportError] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchCredits = async (uid) => {
      try {
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setCredits(userDoc.data().credits || 0);
        } else {
          await setDoc(userRef, { credits: 0 }, { merge: true });
          setCredits(0);
        }
      } catch (err) {
        setReportError("Failed to fetch credits.");
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        fetchCredits(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

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
        setHasSaved(true);

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
        setReportError("Failed to save results.");
      } finally {
        setIsLoading(false);
      }
    };

    if (location.state && location.state !== prevStateRef.current) {
      prevStateRef.current = location.state;
      setHasSaved(false);
      saveAndFetchResults();
    } else {
      setIsLoading(false);
    }
  }, [
    location.state,
    grossWpm,
    netWpm,
    accuracy,
    errors,
    targetWPM,
    examName,
    language,
    hasSaved,
  ]);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" }
      );
    }
  }, [isLoading]);

  const generateAIReport = async () => {
    if (credits < 5) {
      alert(
        "Insufficient credits! You need 5 credits to generate a Premium AI Report."
      );
      if (confirm("Go to payment page to buy credits?")) {
        navigate("/payment");
      }
      return;
    }

    setIsGeneratingReport(true);
    setReportError("");
    setAiReport("");

    const userRef = doc(db, "users", userId);

    try {
      await updateDoc(userRef, { credits: increment(-5) });
      setCredits((prev) => Math.max(0, prev - 5));

      const avgWpm = pastResults.length
        ? (
            pastResults.reduce((sum, r) => sum + (r.netWpm || r.wpm || 0), 0) /
            pastResults.length
          ).toFixed(1)
        : 0;
      const avgAccuracy = pastResults.length
        ? (
            pastResults.reduce((sum, r) => sum + (r.accuracy || 0), 0) /
            pastResults.length
          ).toFixed(1)
        : 0;
      const avgErrors = pastResults.length
        ? (
            pastResults.reduce((sum, r) => sum + (r.errors || 0), 0) /
            pastResults.length
          ).toFixed(1)
        : 0;
      const bestWpm = pastResults.length
        ? Math.max(...pastResults.map((r) => r.netWpm || r.wpm || 0))
        : 0;
      const wpmTrend =
        pastResults.length >= 2
          ? pastResults[pastResults.length - 1].netWpm - pastResults[0].netWpm >
            0
            ? "improving"
            : "declining"
          : "insufficient data";

      const prompt = `
        You are an expert typing coach creating a **Premium TypeSprint Performance Report** for a user who paid credits for an in-depth analysis. Use all provided data to deliver a comprehensive, engaging, and motivational report, enhanced with detailed descriptions of visual charts for deeper understanding. The report must feel worth the investment, with actionable advice, professional tone, and TypeSprint branding, optimized for PDF export with embedded graphs.

        **User Data**:
        - Name: ${
          auth.currentUser?.displayName || auth.currentUser?.email.split("@")[0]
        }
        - Email: ${auth.currentUser?.email}
        - Current Test:
          - Exam: ${examName}
          - Net WPM: ${netWpm || 0}
          - Gross WPM: ${grossWpm || 0}
          - Accuracy: ${accuracy || 0}%
          - Errors: ${errors || 0}
          - Target WPM: ${targetWPM || 0}
          - Language: ${language}
        - Past Performance (${pastResults.length} tests):
          - Average Net WPM: ${avgWpm}
          - Average Accuracy: ${avgAccuracy}%
          - Average Errors: ${avgErrors}
          - Best WPM: ${bestWpm}
          - WPM Trend: ${wpmTrend}
          - Consistency: ${
            pastResults.length >= 2
              ? (
                  (Math.min(...pastResults.map((r) => r.netWpm || 0)) /
                    Math.max(...pastResults.map((r) => r.netWpm || 0))) *
                  100
                ).toFixed(1) + "%"
              : "N/A"
          }
        - Test Date: ${new Date().toLocaleDateString()}

        **Charts to Describe**:
        1. Bar Chart: Compares Gross WPM (${grossWpm || 0}), Net WPM (${
        netWpm || 0
      }), and Target WPM (${targetWPM || 0}) with cyan, teal, and magenta bars.
        2. Doughnut Chart: Shows Accuracy (${accuracy || 0}%) vs. Errors (${
        100 - (accuracy || 0)
      }%) in cyan and magenta.
        3. Line Chart: Plots Net WPM and Accuracy trends over past tests (${
          pastResults.length
        } data points) in cyan and magenta lines.
        4. Progress Circle: Visualizes Net WPM (${
          netWpm || 0
        }) as a percentage of Target WPM (${targetWPM || 0}) with a cyan ring.

        **Report Structure**:
        1. Introduction: Welcome user, emphasize TypeSprint’s value, mention charts.
        2. Performance Summary: Recap current test vs. target and past averages.
        3. Detailed Analysis:
           - Speed: Use Bar Chart and Progress Circle to compare WPM metrics.
           - Accuracy: Use Doughnut Chart to evaluate precision and errors.
           - Trends: Use Line Chart to discuss WPM and accuracy patterns.
        4. Strengths: Highlight user’s best metrics (e.g., accuracy, speed gains).
        5. Areas for Improvement: Identify weaknesses with chart-based insights.
        6. Personalized Roadmap:
           - Short-term goals (e.g., reduce errors by 2).
           - Long-term goals (e.g., reach 80 WPM).
           - Practice tips tied to chart data (e.g., drills for error spikes).
        7. Motivational Conclusion: Inspire continued TypeSprint training.
        8. TypeSprint Signature: End with "TypeSprint Performance Team" and tagline.

        **Formatting**:
        - Use section headers (e.g., Introduction).
        - Describe charts in Detailed Analysis (e.g., "The Bar Chart shows...").
        - Use bullet points for readability.
        - 600-800 words, professional, engaging.
        - Data-driven insights (e.g., "The Line Chart reveals a 5 WPM gain...").
        - Motivational tone: "Your Progress Circle is nearly complete!"
        - Plain text (no Markdown) for PDF export.

        **Output**:
        Plain text formatted for PDF export.
      `;

      const apiKey = import.meta.env.VITE_AIMLAPI_KEY;
      if (!apiKey) {
        throw new Error("AIMLAPI key missing");
      }

      const response = await fetch(
        "https://api.aimlapi.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const data = await response.json();
      const reportText =
        data.choices[0]?.message?.content || "No report generated.";
      setAiReport(reportText);
      setShowReportModal(true);
    } catch (err) {
      setReportError("Failed to generate report. Please try again.");
      await updateDoc(userRef, { credits: increment(5) });
      setCredits((prev) => prev + 5);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const downloadReport = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yOffset = margin;

    // Add TypeSprint Logo
    try {
      const imgProps = pdf.getImageProperties("../assets/logo.png");
      const imgWidth = 40;
      const imgHeight = (imgProps.height / imgProps.width) * imgWidth;
      pdf.addImage(
        "../assets/logo.png",
        "PNG",
        (pageWidth - imgWidth) / 2,
        yOffset,
        imgWidth,
        imgHeight
      );
      yOffset += imgHeight + 10;
    } catch (err) {
      pdf.setFontSize(12);
      pdf.setTextColor(100);
      pdf.text("TypeSprint Report", pageWidth / 2, yOffset, {
        align: "center",
      });
      yOffset += 10;
    }

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(0, 102, 204);
    pdf.text("TypeSprint Premium Performance Report", pageWidth / 2, yOffset, {
      align: "center",
    });
    yOffset += 15;

    // User Info
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    pdf.text(
      `Name: ${
        auth.currentUser?.displayName || auth.currentUser?.email.split("@")[0]
      }`,
      margin,
      yOffset
    );
    yOffset += 7;
    pdf.text(`Email: ${auth.currentUser?.email}`, margin, yOffset);
    yOffset += 7;
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, margin, yOffset);
    yOffset += 10;

    // Add Charts
    const chartWidth = 50;
    const chartHeight = 30;

    if (barChartRef.current) {
      const barChartImg = barChartRef.current.toBase64Image();
      pdf.addImage(
        barChartImg,
        "PNG",
        (pageWidth - chartWidth) / 2,
        yOffset,
        chartWidth,
        chartHeight
      );
      pdf.setFontSize(10);
      pdf.text("WPM Comparison", (pageWidth - chartWidth) / 2, yOffset - 5);
      yOffset += chartHeight + 10;
    }

    if (doughnutChartRef.current) {
      const doughnutChartImg = doughnutChartRef.current.toBase64Image();
      pdf.addImage(
        doughnutChartImg,
        "PNG",
        (pageWidth - chartWidth) / 2,
        yOffset,
        chartWidth,
        chartHeight
      );
      pdf.setFontSize(10);
      pdf.text("Accuracy Breakdown", (pageWidth - chartWidth) / 2, yOffset - 5);
      yOffset += chartHeight + 10;
    }

    if (lineChartRef.current && pastResults.length > 1) {
      const lineChartImg = lineChartRef.current.toBase64Image();
      pdf.addImage(
        lineChartImg,
        "PNG",
        (pageWidth - chartWidth) / 2,
        yOffset,
        chartWidth,
        chartHeight
      );
      pdf.setFontSize(10);
      pdf.text("Performance Trends", (pageWidth - chartWidth) / 2, yOffset - 5);
      yOffset += chartHeight + 10;
    }

    // Report Content
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(aiReport, pageWidth - 2 * margin);
    for (const line of lines) {
      if (yOffset > pageHeight - margin) {
        pdf.addPage();
        yOffset = margin;
      }
      pdf.text(line, margin, yOffset);
      yOffset += 5;
    }

    // Footer
    if (yOffset > pageHeight - margin - 20) {
      pdf.addPage();
      yOffset = margin;
    }
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text(
      "Generated by TypeSprint - Master Your Typing Skills",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    pdf.save(`TypeSprint_AI_Report_${examName}_${Date.now()}.pdf`);
  };

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
        data: pastResults.map((r) => r.netWpm || r.wpm || 0),
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

        <div className="bg-gray-900 bg-opacity-80 p-4 rounded-lg border border-cyan-500 mb-6">
          <p className="text-lg text-gray-300">
            Available Credits: <span className="text-cyan-400">{credits}</span>
          </p>
        </div>

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
              ref={doughnutChartRef}
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
            <Bar ref={barChartRef} data={barChartData} options={chartOptions} />
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
              <Line
                ref={lineChartRef}
                data={lineChartData}
                options={chartOptions}
              />
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

        <div className="flex justify-center gap-4 flex-wrap">
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
            onClick={() => navigate("/exams")}
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
          <motion.button
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
            }}
            onClick={generateAIReport}
            disabled={isGeneratingReport}
            className={`px-6 py-3 rounded-lg font-semibold tracking-wide transition-all ${
              isGeneratingReport
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400"
            }`}
          >
            {isGeneratingReport
              ? "Generating..."
              : "Generate Premium AI Report (5 Credits)"}
          </motion.button>
        </div>

        {showReportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/95 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-cyan-400/30"
            >
              <h3 className="text-2xl font-semibold text-cyan-400 mb-4">
                TypeSprint Premium Performance Report
              </h3>
              {reportError ? (
                <p className="text-red-400">{reportError}</p>
              ) : (
                <>
                  <pre className="text-gray-300 whitespace-pre-wrap">
                    {aiReport}
                  </pre>
                  <div className="flex gap-4 mt-6 justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={downloadReport}
                      className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400"
                    >
                      Download PDF
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowReportModal(false)}
                      className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-semibold hover:bg-gray-600"
                    >
                      Close
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Results;
