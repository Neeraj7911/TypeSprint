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
  Timestamp,
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
  Filler,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    inputText = "",
    sampleText = "",
    timeElapsed = 60000,
    backspaceCount: passedBackspaceCount = 0,
    targetWPM = 0,
    examName = "Practice",
    language = "english",
    font = "Arial",
    testId,
    fullErrors = 0,
    halfErrors = 0,
    testCollection,
  } = location.state || {};

  // Helper function to normalize text (remove extra spaces and standardize)
  const normalizeText = (text) => {
    return text
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  };

  // Function to compare words with improved error handling
  const getWordComparison = () => {
    if (!sampleText || !inputText) return [];
    const normalizedInput = normalizeText(inputText);
    const normalizedSample = normalizeText(sampleText);
    const inputWords = normalizedInput.split(" ");
    const sampleWords = normalizedSample.split(" ");
    const minLength = Math.min(inputWords.length, sampleWords.length);

    return sampleWords.map((word, index) => {
      const isTyped = index < inputWords.length;
      const isCorrect = isTyped && inputWords[index] === word;
      return { word, isCorrect, isTyped };
    });
  };

  // Calculate metrics in a controlled order
  const wordsTyped = inputText.trim().split(/\s+/).filter(Boolean).length || 0;
  const totalKeystrokes = inputText.length || 0;
  const backspaceCount = passedBackspaceCount;
  const grossWpm =
    wordsTyped > 0 ? totalKeystrokes / 5 / (timeElapsed / 60000) : 0;

  const wordComparison = getWordComparison();
  const errors =
    wordComparison.filter((w) => w.isTyped && !w.isCorrect).length || 0;
  const calculatedHalfErrors = halfErrors || 0; // Use provided halfErrors as baseline
  const calculatedFullErrors = fullErrors || 0; // Use provided fullErrors as baseline
  const totalErrors = calculatedFullErrors + calculatedHalfErrors / 2;
  const errorPercentage =
    wordsTyped > 0 ? Math.min(100, (totalErrors / wordsTyped) * 100) : 0;
  const keystrokesTyped = totalKeystrokes;
  const backspacePressed = backspaceCount;
  const netWpm = Math.max(0, grossWpm - errors / (timeElapsed / 60000));
  const urQualified = netWpm >= 35 && errorPercentage <= 5;
  const accuracy = grossWpm > 0 ? (netWpm / grossWpm) * 100 : 0;
  const testDuration = new Date(timeElapsed).toISOString().substr(14, 5);

  useEffect(() => {
    console.log("Results.jsx received props:", {
      inputText,
      sampleText,
      timeElapsed,
      passedBackspaceCount,
      targetWPM,
      examName,
      language,
      font,
      testId,
      wordsTyped,
      totalKeystrokes,
      backspaceCount,
      grossWpm,
      errors,
      netWpm,
      accuracy,
      calculatedFullErrors,
      calculatedHalfErrors,
      totalErrors,
      errorPercentage,
      keystrokesTyped,
      backspacePressed,
      urQualified,
      testDuration,
    });
  }, [location.state]);

  const containerRef = useRef(null);
  const prevStateRef = useRef(null);
  const barChartRef = useRef(null);
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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState({
    usabilityRating: 0,
    performanceRating: 0,
    overallRating: 0,
    feedbackType: "general",
    comments: "",
  });
  const [feedbackError, setFeedbackError] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState("");

  const calculateKDPH = () => {
    const totalKeyPresses = keystrokesTyped + backspacePressed;
    const timeInHours = Math.max(timeElapsed / 3600000, 1 / 3600);
    return isFinite(totalKeyPresses / timeInHours)
      ? Math.round(totalKeyPresses / timeInHours)
      : 0;
  };

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
        console.error("Error fetching credits:", err);
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
          grossWpm,
          netWpm,
          accuracy,
          errors,
          targetWPM,
          examName,
          language,
          backspaceCount,
          timeElapsed,
          calculatedFullErrors,
          calculatedHalfErrors,
          totalErrors,
          errorPercentage,
          keystrokesTyped,
          backspacePressed,
          wordsTyped,
          urQualified,
          testDuration,
          timestamp: new Date().toISOString(),
        };

        const resultRef = doc(
          db,
          "users",
          user.uid,
          "results",
          `${examName}-${Date.now()}`,
        );
        await setDoc(resultRef, resultData);
        setHasSaved(true);

        if (testId) {
          const liveResultPayload = {
            ...resultData,
            userId: user.uid,
            displayName: user.displayName || user.email.split("@")[0],
            email: user.email,
            testId,
            examName,
            language,
            createdAt: Timestamp.now(),
          };
          const collectionsToTry = testCollection
            ? [
                testCollection,
                testCollection === "liveTests1" ? "liveTests" : "liveTests1",
              ]
            : ["liveTests1", "liveTests"];

          for (const col of collectionsToTry) {
            try {
              const testRef = doc(db, col, testId);
              const testSnap = await getDoc(testRef);
              if (!testSnap.exists()) continue;
              const liveResultRef = doc(db, col, testId, "results", user.uid);
              const existingLive = await getDoc(liveResultRef);
              const existingNet = existingLive.exists()
                ? existingLive.data().netWpm || 0
                : 0;
              if (!existingLive.exists() || (netWpm || 0) > existingNet) {
                await setDoc(liveResultRef, liveResultPayload, { merge: true });
              }
              break;
            } catch (liveErr) {
              console.warn("Failed to write live leaderboard entry", liveErr);
            }
          }
        }

        const resultsSnapshot = await getDocs(
          collection(db, "users", user.uid, "results"),
        );
        const results = resultsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPastResults(results.filter((r) => r.examName === examName));

        const score = Math.min(
          100,
          ((netWpm || 0) / (targetWPM || 1)) * 50 +
            (accuracy || 0) / 2 -
            (errors || 0) * 2,
        );
        setPerformanceScore(Math.round(isFinite(score) ? score : 0));

        const leaderboardRef = doc(db, "leaderboard", user.uid);
        const leaderboardDoc = await getDoc(leaderboardRef);
        const previousBest = leaderboardDoc.exists()
          ? leaderboardDoc.data().netWpm || 0
          : 0;

        if ((netWpm || 0) > previousBest) {
          await setDoc(
            leaderboardRef,
            {
              userName: user.displayName || user.email.split("@")[0],
              userEmail: user.email,
              netWpm: netWpm || 0,
              examName,
              photoURL: user.photoURL || "https://via.placeholder.com/40",
              timestamp: new Date().toISOString(),
            },
            { merge: true },
          );
          setLeaderboardUpdated(true);
        }
      } catch (error) {
        setReportError("Failed to save results.");
        console.error("Error saving results:", error);
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
    grossWpm,
    netWpm,
    accuracy,
    errors,
    targetWPM,
    examName,
    language,
    backspaceCount,
    timeElapsed,
    calculatedFullErrors,
    calculatedHalfErrors,
    totalErrors,
    errorPercentage,
    keystrokesTyped,
    backspacePressed,
    wordsTyped,
    urQualified,
    testDuration,
    hasSaved,
    location.state,
    testCollection,
  ]);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" },
      );
    }
  }, [isLoading]);

  const generateAIReport = async () => {
    if (credits < 5) {
      alert(
        "Insufficient credits! You need 5 credits to generate a Premium AI Report.",
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
      const avgBackspaceCount = pastResults.length
        ? (
            pastResults.reduce((sum, r) => sum + (r.backspaceCount || 0), 0) /
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
          - Net WPM: ${netWpm.toFixed(2)}
          - Gross WPM: ${grossWpm.toFixed(2)}
          - Accuracy: ${accuracy.toFixed(2)}%
          - Errors: ${errors}
          - Full Errors: ${calculatedFullErrors}
          - Half Errors: ${calculatedHalfErrors}
          - Total Errors: ${totalErrors}
          - Error Percentage: ${errorPercentage.toFixed(2)}%
          - Keystrokes Typed: ${keystrokesTyped}
          - Backspace Count: ${backspacePressed}
          - Words Typed: ${wordsTyped}
          - Key Depressions per Hour (KDPH): ${calculateKDPH()}
          - Target WPM: ${targetWPM}
          - Language: ${language}
          - UR Qualified: ${urQualified ? "Yes" : "No"}
          - Test Duration: ${testDuration}
        - Past Performance (${pastResults.length} tests):
          - Average Net WPM: ${avgWpm}
          - Average Accuracy: ${avgAccuracy}%
          - Average Errors: ${avgErrors}
          - Average Backspace Count: ${avgBackspaceCount}
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
        - Test Date: ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        })}

        **Charts to Describe**:
        1. Bar Chart: Compares Full Errors (${calculatedFullErrors}), Half Errors (${calculatedHalfErrors}), Total Errors (${totalErrors}), Keystrokes Typed (${keystrokesTyped}), and Error Percentage (${errorPercentage.toFixed(
          2,
        )}%) with cyan, teal, magenta, blue, and red bars.
        2. Line Chart: Plots Net WPM and Accuracy trends over past tests (${
          pastResults.length
        } data points) in cyan and magenta lines.

        **Report Structure**:
        1. Introduction: Welcome user, emphasize TypeSprint’s value, mention charts.
        2. Performance Summary: Recap current test vs. target and past averages, include backspace count, KDPH, and UR qualification.
        3. Detailed Analysis:
           - Speed: Use Bar Chart to compare WPM metrics.
           - Accuracy: Use Line Chart to evaluate precision and errors.
           - Error Breakdown: Analyze Full Errors, Half Errors, and Total Errors from Bar Chart.
           - Keystrokes and Backspace: Discuss keystrokes, backspace usage, and KDPH.
           - Trends: Use Line Chart to discuss WPM and accuracy patterns.
        4. Strengths: Highlight user’s best metrics (e.g., accuracy, speed gains, low errors).
        5. Areas for Improvement: Identify weaknesses with chart-based insights.
        6. Personalized Roadmap:
           - Short-term goals (e.g., reduce errors by 2, improve accuracy by 5%).
           - Long-term goals (e.g., reach 80 WPM, qualify for UR).
           - Practice tips tied to chart data.
        7. Motivational Conclusion: Inspire continued TypeSprint training.
        8. TypeSprint Signature: End with "TypeSprint Performance Team" and tagline.

        **Formatting**:
        - Use section headers.
        - Describe charts in Detailed Analysis.
        - Use bullet points for readability.
        - 600-800 words, professional, engaging.
        - Data-driven insights.
        - Motivational tone.
        - Plain text for PDF export.

        **Output**:
        Plain text formatted for PDF export.
      `;

      const apiKey = import.meta.env.VITE_HF_API_KEY;
      if (!apiKey) {
        throw new Error(
          "Hugging Face API key missing. Please set VITE_HF_API_KEY in your .env file.",
        );
      }

      let retries = 3;
      let response;
      while (retries > 0) {
        try {
          response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                inputs: prompt,
                parameters: {
                  max_new_tokens: 1000,
                  temperature: 0.7,
                  top_p: 0.9,
                  return_full_text: false,
                },
              }),
            },
          );

          if (response.status === 429) {
            retries--;
            if (retries === 0) throw new Error("Rate limit exceeded.");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }

          if (!response.ok) throw new Error("API request failed.");
          break;
        } catch (err) {
          if (retries === 0) throw err;
          retries--;
        }
      }

      const data = await response.json();
      const reportText =
        typeof data === "object" &&
        data[0] &&
        typeof data[0].generated_text === "string"
          ? data[0].generated_text.trim()
          : "Error: No valid report text generated.";
      setAiReport(reportText);
      setShowReportModal(true);
    } catch (err) {
      setReportError(err.message || "Failed to generate report.");
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
    let yOffset = 10;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor(0, 102, 204);
    pdf.text("TypeSprint Premium Report", pageWidth / 2, yOffset, {
      align: "center",
    });
    yOffset += 20;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    const text = [
      `Net WPM: ${netWpm.toFixed(2)}`,
      `Accuracy: ${accuracy.toFixed(2)}%`,
      `Total Errors: ${totalErrors}`,
      `Error %: ${errorPercentage.toFixed(2)}%`,
      `Keystrokes: ${keystrokesTyped}`,
      `Backspace: ${backspacePressed}`,
      `Words Typed: ${wordsTyped}`,
      `UR Qualified: ${urQualified ? "Yes" : "No"}`,
    ];
    text.forEach((line) => {
      pdf.text(line, 10, yOffset);
      yOffset += 10;
    });

    if (barChartRef.current) {
      const img = barChartRef.current.toBase64Image();
      pdf.addImage(img, "PNG", 10, yOffset, 180, 100);
      yOffset += 110;
    }

    pdf.save(`TypeSprint_Report_${examName}_${Date.now()}.pdf`);
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (name, value) => {
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    setFeedbackError("");
    setFeedbackSuccess("");

    if (
      !feedback.usabilityRating ||
      !feedback.performanceRating ||
      !feedback.overallRating ||
      !feedback.feedbackType ||
      !feedback.comments.trim()
    ) {
      setFeedbackError("Please complete all fields.");
      return;
    }

    try {
      const feedbackRef = doc(
        db,
        "feedback",
        `${examName}-${userId}-${Date.now()}`,
      );
      await setDoc(feedbackRef, {
        userId,
        userName:
          auth.currentUser?.displayName ||
          auth.currentUser?.email.split("@")[0],
        userEmail: auth.currentUser?.email,
        ...feedback,
        examName,
        timestamp: new Date().toISOString(),
      });
      setFeedbackSuccess("Thank you for your feedback!");
      setFeedback({
        usabilityRating: 0,
        performanceRating: 0,
        overallRating: 0,
        feedbackType: "general",
        comments: "",
      });
      setTimeout(() => setShowFeedbackModal(false), 2000);
    } catch (err) {
      setFeedbackError("Failed to submit feedback.");
    }
  };

  const barChartData = {
    labels: [
      "Full Errors",
      "Half Errors",
      "Total Errors",
      "Keystrokes",
      "Error %",
    ],
    datasets: [
      {
        label: "Metrics",
        data: [
          calculatedFullErrors,
          calculatedHalfErrors,
          totalErrors,
          keystrokesTyped,
          errorPercentage,
        ],
        backgroundColor: [
          "rgba(0, 255, 255, 0.7)",
          "rgba(0, 200, 200, 0.7)",
          "rgba(255, 0, 128, 0.7)",
          "rgba(0, 0, 255, 0.7)",
          "rgba(255, 0, 0, 0.7)",
        ],
        borderColor: ["cyan", "teal", "magenta", "blue", "red"],
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  };

  const lineChartData = {
    labels: pastResults.map((r) => new Date(r.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Net WPM",
        data: pastResults.map((r) => r.netWpm || 0),
        borderColor: "cyan",
        backgroundColor: "rgba(0, 255, 255, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "cyan",
        pointBorderColor: "white",
        pointRadius: 4,
      },
      {
        label: "Accuracy",
        data: pastResults.map((r) => r.accuracy || 0),
        borderColor: "magenta",
        backgroundColor: "rgba(255, 0, 128, 0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "magenta",
        pointBorderColor: "white",
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
          font: { size: 14, family: "'Inter', sans-serif" },
        },
        position: "top",
      },
      title: { display: false },
    },
    scales: {
      x: {
        ticks: { color: "white", font: { size: 12 } },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "white", font: { size: 12 } },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        beginAtZero: true,
      },
    },
  };

  const getQualificationReason = () => {
    if (urQualified)
      return "Congratulations! You meet the UR qualification criteria.";
    if (netWpm < 35)
      return (
        "You did not qualify because your Net WPM (current: " +
        netWpm.toFixed(2) +
        ") is below the required 35 WPM."
      );
    if (errorPercentage > 5)
      return (
        "You did not qualify because your Error Percentage (current: " +
        errorPercentage.toFixed(2) +
        "%) exceeds the maximum allowed 5%."
      );
    return "Unspecified issue; please contact support.";
  };

  const getImprovementTips = () => {
    const tips = [];
    if (netWpm < 35)
      tips.push(
        "Increase Speed: Practice with longer texts or shorter intervals to boost your Net WPM to at least 35.",
      );
    if (errorPercentage > 5 || totalErrors > 5)
      tips.push(
        "Reduce Errors: Focus on accuracy by typing slowly at first, then gradually increasing speed while minimizing full errors (" +
          calculatedFullErrors +
          ") and half errors (" +
          calculatedHalfErrors +
          ").",
      );
    if (backspacePressed > 5)
      tips.push(
        "Minimize Backspace: Avoid frequent corrections by typing with confidence; your current backspace count is " +
          backspacePressed +
          ".",
      );
    if (accuracy < 90)
      tips.push(
        "Improve Accuracy: Target an accuracy above 90% by practicing common words and phrases; your current accuracy is " +
          accuracy.toFixed(2) +
          "%.",
      );
    return tips.length > 0
      ? tips
      : ["Great job! Maintain your current performance."];
  };

  const getAdvancedInsights = () => {
    const insights = [];
    const wpmDiff = netWpm - (targetWPM || 0);
    if (wpmDiff < -5)
      insights.push("Speed Tip: Practice quick key presses to boost WPM.");
    if (accuracy < 85)
      insights.push("Accuracy Tip: Focus on typing common words slowly.");
    if (totalErrors > 10)
      insights.push("Error Reduction: Try precision exercises.");
    if (backspacePressed > 5)
      insights.push("Backspace Tip: Type without immediate corrections.");
    if (netWpm >= targetWPM && accuracy > 90)
      insights.push("Great Work: Maintain performance with challenging texts.");
    return insights.length > 0
      ? insights
      : ["You're on Track: Continue regular practice."];
  };

  if (!location.state) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-red-400 font-inter text-xl">
          Error: No Data Detected.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-cyan-400 border-r-magenta-400 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-inter relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-magenta-900/20 to-gray-950" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-magenta-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"
      >
        <header className="text-center mb-12 mt-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-magenta-400 tracking-tight">
            {examName} Typing Performance
          </h1>
          <p className="mt-2 text-lg text-gray-300">Analyze your results</p>
        </header>

        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-cyan-400/20 mb-8">
          <p className="text-lg text-gray-200">
            Available Credits:{" "}
            <span className="font-semibold text-cyan-400">{credits}</span>
          </p>
        </div>

        {leaderboardUpdated && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-green-900/50 backdrop-blur-sm p-6 rounded-2xl border border-green-400/30 text-green-300 text-center mb-8"
          >
            <p className="text-lg font-semibold">Personal Best Achieved!</p>
            <p>Leaderboard updated for {examName}.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(255, 0, 0, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-red-400/30"
          >
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Full Errors
            </h3>
            <p className="text-2xl font-bold text-white">
              {calculatedFullErrors}
            </p>
            <p className="text-xs text-gray-300">Omissions, spelling, etc.</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(255, 255, 0, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-yellow-400/30"
          >
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">
              Half Errors
            </h3>
            <p className="text-2xl font-bold text-white">
              {calculatedHalfErrors}
            </p>
            <p className="text-xs text-gray-300">Spacing, punctuation, etc.</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(128, 0, 255, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-purple-400/30"
          >
            <h3 className="text-lg font-semibold text-purple-400 mb-2">
              Total Errors
            </h3>
            <p className="text-2xl font-bold text-white">
              {totalErrors.toFixed(2)}
            </p>
            <p className="text-xs text-gray-300">Full + (Half / 2)</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(255, 0, 0, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-red-400/30"
          >
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Error Percentage
            </h3>
            <p className="text-2xl font-bold text-white">
              {errorPercentage.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-300">Total Errors / Words × 100</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 255, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-blue-400/30"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Keystrokes Typed
            </h3>
            <p className="text-2xl font-bold text-white">{keystrokesTyped}</p>
            <p className="text-xs text-gray-300">Letters, spaces, etc.</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 255, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-blue-400/30"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Backspace Pressed
            </h3>
            <p className="text-2xl font-bold text-white">{backspacePressed}</p>
            <p className="text-xs text-gray-300">Number of presses</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 255, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-blue-400/30"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Words Typed
            </h3>
            <p className="text-2xl font-bold text-white">
              {wordsTyped.toFixed(1)}
            </p>
            <p className="text-xs text-gray-300">Keystrokes / 5</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 255, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-blue-400/30"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Gross WPM
            </h3>
            <p className="text-2xl font-bold text-white">
              {grossWpm.toFixed(2)}
            </p>
            <p className="text-xs text-gray-300">Keystrokes / 5 / Time</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 255, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-blue-400/30"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Net WPM
            </h3>
            <p className="text-2xl font-bold text-white">{netWpm.toFixed(2)}</p>
            <p className="text-xs text-gray-300">
              (Keystrokes / 5 / Time) - Errors
            </p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 255, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-blue-400/30"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Accuracy
            </h3>
            <p className="text-2xl font-bold text-white">
              {accuracy.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-300">(Net WPM / Gross WPM) × 100</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 255, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-blue-400/30"
          >
            <h3 className="text-lg font-semibold text-blue-400 mb-2">
              Test Duration
            </h3>
            <p className="text-2xl font-bold text-white">{testDuration}</p>
            <p className="text-xs text-gray-300">Time taken</p>
          </motion.div>
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(255, 0, 0, 0.2)",
            }}
            className="bg-gray-900/70 p-4 rounded-xl shadow-lg border border-red-400/30"
          >
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              UR Qualification
            </h3>
            <p className="text-2xl font-bold text-white">
              {urQualified ? "Qualified" : "Not Qualified"}
            </p>
            <p className="text-xs text-gray-300">Net WPM ≥ 35 & Error % ≤ 5%</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-cyan-400/30"
          >
            <h3 className="text-2xl font-semibold text-cyan-400 mb-6">
              Error Breakdown
            </h3>
            <Bar ref={barChartRef} data={barChartData} options={chartOptions} />
          </motion.div>
          {pastResults.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-magenta-400/30"
            >
              <h3 className="text-2xl font-semibold text-magenta-400 mb-6">
                Performance Trends
              </h3>
              <Line
                ref={lineChartRef}
                data={lineChartData}
                options={chartOptions}
              />
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-cyan-400/30 mb-12"
        >
          <h3 className="text-2xl font-semibold text-cyan-400 mb-6">
            Performance Insights
          </h3>
          <ul className="list-disc pl-6 text-gray-200 space-y-2">
            {getAdvancedInsights().map((insight, index) => (
              <motion.li
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-base"
              >
                {insight}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-cyan-400/30 mb-12"
        >
          <h3 className="text-2xl font-semibold text-cyan-400 mb-6">
            Word-by-Word Analysis
          </h3>
          {sampleText && inputText ? (
            <div className="bg-gray-800/50 p-4 rounded-xl max-h-64 overflow-y-auto whitespace-pre-wrap border border-gray-700/30">
              {wordComparison.map((wordObj, index) => (
                <span
                  key={index}
                  className={`mr-2 inline-block font-mono text-sm ${
                    wordObj.isTyped
                      ? wordObj.isCorrect
                        ? "text-green-400"
                        : "text-red-400"
                      : "text-gray-400"
                  }`}
                >
                  {wordObj.word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center text-base">
              No text data available.
            </p>
          )}
        </motion.div>

        {!urQualified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-red-400/30 mb-12"
          >
            <h3 className="text-2xl font-semibold text-red-400 mb-6">
              Why You Are Not Qualified
            </h3>
            <p className="text-gray-200 text-base">
              {getQualificationReason()}
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-blue-400/30 mb-12"
        >
          <h3 className="text-2xl font-semibold text-blue-400 mb-6">
            Qualification Formula Explained
          </h3>
          <p className="text-gray-200 text-base">
            UR Qualification is determined by the following formula:
            <br />
            <strong>
              UR Qualified = (Net WPM ≥ 35) AND (Error Percentage ≤ 5%)
            </strong>
            <br />- <strong>Net WPM</strong> = (Gross WPM - Errors per Minute),
            where Gross WPM = (Keystrokes / 5) / (Time in Minutes), and Errors
            per Minute = Total Errors / (Time in Minutes).
            <br />- <strong>Error Percentage</strong> = (Total Errors / Words
            Typed) × 100, where Total Errors = Full Errors + (Half Errors / 2).
            <br />
            You need at least 35 WPM and no more than 5% errors to qualify.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-green-400/30 mb-12"
        >
          <h3 className="text-2xl font-semibold text-green-400 mb-6">
            How to Improve
          </h3>
          <ul className="list-disc pl-6 text-gray-200 space-y-2">
            {getImprovementTips().map((tip, index) => (
              <motion.li
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="text-base"
              >
                {tip}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {calculatedHalfErrors > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gray-900/70 p-6 rounded-2xl shadow-lg border border-yellow-400/30 mb-12"
          >
            <h3 className="text-2xl font-semibold text-yellow-400 mb-6">
              Error Review
            </h3>
            <p className="text-gray-200 text-base">
              You reported {calculatedHalfErrors} half errors, resulting in a{" "}
              {errorPercentage.toFixed(2)}% error percentage. This may be due to
              spacing or punctuation differences. If you believe this is
              incorrect, review your input against the sample text below and
              retry the test with proper formatting.
            </p>
            <div className="mt-4 bg-gray-800/50 p-4 rounded-xl max-h-40 overflow-y-auto whitespace-pre-wrap border border-gray-700/30">
              <p>Sample: {sampleText}</p>
              <p>Your Input: {inputText}</p>
            </div>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 16px rgba(0, 255, 255, 0.3)",
              }}
              onClick={() =>
                navigate(
                  `/typing-test?exam=${examName}&language=${language}&wpm=${targetWPM}&font=${font}&duration=10`,
                )
              }
              className="mt-4 px-6 py-3 bg-cyan-500 text-gray-900 rounded-xl font-semibold hover:bg-cyan-400 transition-all"
            >
              Retry Test
            </motion.button>
          </motion.div>
        )}

        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 16px rgba(0, 255, 255, 0.3)",
            }}
            onClick={() =>
              navigate(
                `/typing-test?exam=${examName}&language=${language}&wpm=${targetWPM}&font=${font}&duration=10`,
              )
            }
            className="px-6 py-3 bg-cyan-500 text-gray-900 rounded-xl font-semibold hover:bg-cyan-400 transition-all"
          >
            Retry Test
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 16px rgba(0, 255, 255, 0.3)",
            }}
            onClick={() => navigate("/exams")}
            className="px-6 py-3 bg-cyan-500 text-gray-900 rounded-xl font-semibold hover:bg-cyan-400 transition-all"
          >
            Back to Exams
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 16px rgba(0, 255, 255, 0.3)",
            }}
            onClick={() => navigate("/leaderboard")}
            className="px-6 py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-500 transition-all"
          >
            View Leaderboard
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 16px rgba(0, 255, 255, 0.3)",
            }}
            onClick={generateAIReport}
            disabled={isGeneratingReport}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              isGeneratingReport
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-magenta-500 text-white hover:from-cyan-400 hover:to-magenta-400"
            }`}
          >
            {isGeneratingReport
              ? "Generating..."
              : "Generate Premium AI Report"}
          </motion.button>
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 15px rgba(0, 255, 255, 0.3)",
            }}
            onClick={() => setShowFeedbackModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-magenta-500 text-white rounded-xl font-semibold hover:from-cyan-400 hover:to-magenta-400 transition-all"
          >
            Provide Feedback
          </motion.button>
        </div>

        {showReportModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/95 p-8 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-cyan-400/20 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                TypeSprint Premium Report
              </h3>
              {reportError ? (
                <p className="text-red-400">{reportError}</p>
              ) : (
                <>
                  <pre className="text-gray-200 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                    {aiReport}
                  </pre>
                  <div className="flex gap-4 mt-6 justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={downloadReport}
                      className="px-5 py-2 bg-cyan-500 text-gray-900 rounded-xl font-semibold hover:bg-cyan-400"
                    >
                      Download PDF
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setShowReportModal(false)}
                      className="px-5 py-2 bg-gray-800 text-gray-200 rounded-xl font-semibold hover:bg-gray-700"
                    >
                      Close
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}

        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/95 p-8 rounded-2xl max-w-lg w-full border border-cyan-400/20 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">
                Share Feedback
              </h3>
              {feedbackError && (
                <p className="text-red-400 mb-4">{feedbackError}</p>
              )}
              {feedbackSuccess && (
                <p className="text-green-400 mb-4">{feedbackSuccess}</p>
              )}
              <div>
                <div className="mb-6">
                  <label className="block text-gray-200 mb-2">Name</label>
                  <input
                    type="text"
                    value={
                      auth.currentUser?.displayName ||
                      auth.currentUser?.email.split("@")[0]
                    }
                    className="w-full bg-gray-800/50 text-white rounded-xl p-3 border border-gray-700/30"
                    disabled
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-200 mb-2">Email</label>
                  <input
                    type="email"
                    value={auth.currentUser?.email}
                    className="w-full bg-gray-800/50 text-white rounded-xl p-3 border border-gray-700/30"
                    disabled
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-200 mb-2">
                    Usability Rating (1-5)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          handleRatingChange("usabilityRating", star)
                        }
                        className={`text-2xl ${
                          feedback.usabilityRating >= star
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-200 mb-2">
                    Performance Rating (1-5)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          handleRatingChange("performanceRating", star)
                        }
                        className={`text-2xl ${
                          feedback.performanceRating >= star
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-200 mb-2">
                    Overall Rating (1-5)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          handleRatingChange("overallRating", star)
                        }
                        className={`text-2xl ${
                          feedback.overallRating >= star
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-200 mb-2">
                    Feedback Type
                  </label>
                  <select
                    name="feedbackType"
                    value={feedback.feedbackType}
                    onChange={handleFeedbackChange}
                    className="w-full bg-gray-800/50 text-white rounded-xl p-3 border border-gray-700/30"
                  >
                    <option value="general">General</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-200 mb-2">Comments</label>
                  <textarea
                    name="comments"
                    value={feedback.comments}
                    onChange={handleFeedbackChange}
                    className="w-full bg-gray-800/50 text-white rounded-xl p-3 border border-gray-700/30"
                    rows="5"
                  />
                </div>
                <div className="flex gap-4 justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={submitFeedback}
                    className="px-5 py-2 bg-cyan-500 text-gray-900 rounded-xl font-semibold hover:bg-cyan-400"
                  >
                    Submit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-5 py-2 bg-gray-800 text-gray-200 rounded-xl font-semibold hover:bg-gray-700"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Results;
