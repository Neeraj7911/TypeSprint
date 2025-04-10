import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";

// Lazy-loaded component
const CustomCursor = lazy(() => import("../components/CustomCursor"));

// Exam configurations
const examConfigs = {
  Practice: {
    headerColor: "bg-black",
    timeLimit: 600,
    sampleTextKey: "english",
    showStatsOverlay: true,
    rightPanel: true,
  },
  "ssc-chsl": {
    headerColor: "bg-blue-800",
    timeLimit: 900,
    sampleTextKey: "english",
    showStatsOverlay: true,
    rightPanel: true,
  },
  "ssc-cgl": {
    headerColor: "bg-blue-900",
    timeLimit: 900,
    sampleTextKey: "english",
    showStatsOverlay: false,
    rightPanel: true,
  },
  default: {
    headerColor: "bg-gray-800",
    timeLimit: 600,
    sampleTextKey: "english",
    showStatsOverlay: true,
    rightPanel: false,
  },
};

// Sample texts (truncated for brevity, include full texts as needed)
const sampleTexts = {
  english:
    "Working in hazardous sites such as quarries, where explosives and heavy machinery are deployed, is fraught with risks...",
  hindi:
    "खतरनाक स्थानों जैसे कि खदानों में काम करना, जहां विस्फोटक और भारी मशीनरी तैनात की जाती है...",
  punjabi:
    "ਖਤਰਨਾਕ ਸਥਾਨਾਂ ਜਿਵੇਂ ਕਿ ਖੱਡਾਂ ਵਿੱਚ ਕੰਮ ਕਰਨਾ, ਜਿੱਥੇ ਵਿਸਫੋਟਕ ਅਤੇ ਭਾਰੀ ਮਸ਼ੀਨਰੀ ਤਾਇਨਾਤ ਕੀਤੀ ਜਾਂਦੀ ਹੈ...",
  // Add other languages as in your original code
};

// Instructions Modal Component (defined inline)
const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Instructions</h2>
        <ul className="list-disc pl-5 mb-4 text-gray-700">
          <li>Type the given text as accurately and quickly as possible.</li>
          <li>Use the "Pause" button to take a break; timers will stop.</li>
          <li>Click "Submit Test" to end the test and view your results.</li>
          <li>
            English is free; Hindi and regional languages require payment after
            3 minutes.
          </li>
        </ul>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Close Instructions"
        >
          Close
        </button>
      </div>
    </div>
  );
};

InstructionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ExamTypingTestt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const examName = query.get("exam") || "Practice";
  const language = query.get("language") || "english";
  const targetWPM = parseInt(query.get("wpm")) || 35;
  const font = query.get("font") || "Mangal";

  const config = examConfigs[examName] || examConfigs["default"];

  const [mode, setMode] = useState("practice");
  const [inputText, setInputText] = useState("");
  const [sampleText, setSampleText] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [freeTimeLeft, setFreeTimeLeft] = useState(180);
  const [userStatus, setUserStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSampleText(sampleTexts[language] || sampleTexts[config.sampleTextKey]);
  }, [language, config.sampleTextKey]);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          setUserStatus(
            userDoc.exists() && userDoc.data().status === "paid"
              ? "paid"
              : "not paid"
          );
        } catch (error) {
          console.error("Error fetching user status:", error);
          setError("Failed to load user status. Please try again.");
          setUserStatus("not paid");
        }
      } else {
        setIsLoggedIn(false);
        setUserStatus(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let freeTimer;
    if (
      language !== "english" &&
      userStatus === "not paid" &&
      isTestActive &&
      !isPaused
    ) {
      freeTimer = setInterval(() => {
        setFreeTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTestActive(false);
            navigate("/payment");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(freeTimer);
  }, [language, userStatus, isTestActive, isPaused, navigate]);

  useEffect(() => {
    let mockTimer;
    if (mode === "mock" && isTestActive && timeLeft > 0 && !isPaused) {
      mockTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(mockTimer);
  }, [mode, isTestActive, timeLeft, isPaused]);

  useEffect(() => {
    if (isTestActive && startTime && !isPaused) {
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 60000;
        const wordsTyped = inputText.trim().split(/\s+/).filter(Boolean).length;
        const sampleWords = sampleText.trim().split(/\s+/);
        const inputWords = inputText.trim().split(/\s+/);

        if (timeElapsed > 0) setWpm(Math.round(wordsTyped / timeElapsed));

        let errorCount = 0;
        for (
          let i = 0;
          i < Math.min(sampleWords.length, inputWords.length);
          i++
        ) {
          if (sampleWords[i] !== inputWords[i]) errorCount++;
        }
        setErrors(errorCount);

        const totalChars = sampleText.length;
        const correctChars = totalChars - errorCount;
        const newAccuracy =
          totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
        setAccuracy(newAccuracy);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTestActive, startTime, inputText, sampleText, isPaused]);

  const startTest = useCallback(() => {
    setIsTestActive(true);
    setStartTime(Date.now());
    setWpm(0);
    setAccuracy(0);
    setErrors(0);
    setInputText("");
    if (mode === "mock") setTimeLeft(config.timeLimit);
    if (language !== "english" && userStatus === "not paid")
      setFreeTimeLeft(180);
  }, [mode, language, userStatus, config.timeLimit]);

  const handleSubmit = useCallback(() => {
    if (!isTestActive) return;
    setIsTestActive(false);
    navigate("/results", {
      state: { wpm, accuracy, errors, targetWPM, examName, language },
    });
  }, [
    isTestActive,
    wpm,
    accuracy,
    errors,
    targetWPM,
    examName,
    language,
    navigate,
  ]);

  const handleInputChange = useCallback(
    (e) => {
      if (!isTestActive || isPaused) return;
      setInputText(e.target.value);
      if (
        mode === "practice" &&
        e.target.value.trim().length >= sampleText.length
      ) {
        handleSubmit();
      }
    },
    [isTestActive, isPaused, mode, sampleText, handleSubmit]
  );

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      document.documentElement
        .requestFullscreen()
        .catch((err) => console.error("Fullscreen error:", err));
      setIsFullScreen(true);
    } else {
      document
        .exitFullscreen()
        .catch((err) => console.error("Exit fullscreen error:", err));
      setIsFullScreen(false);
    }
  }, [isFullScreen]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const currentWordIndex =
    inputText.trim().split(/\s+/).filter(Boolean).length - 1;
  const sampleWords = sampleText.split(/\s+/);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <CustomCursor />
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold mb-6"
          >
            Login to Continue
          </motion.h1>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Go to Login
          </button>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomCursor />
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header
          className={`flex justify-between items-center p-4 ${config.headerColor} shadow-md mt-16`}
        >
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Testbook Logo" className="h-8" />
            <h1 className="text-xl font-bold text-gray-800">
              {examName} Typing Test
            </h1>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            Time Left: {formatTime(mode === "mock" ? timeLeft : freeTimeLeft)}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={toggleFullScreen}
              className="px-4 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            </button>
            <button
              onClick={togglePause}
              className="px-4 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400"
              disabled={!isTestActive}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </header>

        <div className="flex flex-1 mt-20 mb-16">
          <div className="w-3/4 p-6 overflow-y-auto">
            <div className="mb-4">
              <span className="text-sm text-gray-600">SECTIONS: </span>
              <span className="text-sm font-semibold text-blue-600">
                Typing Test
              </span>
            </div>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Question No. 1
            </h2>
            <div className="bg-gray-200 p-4 rounded-lg mb-4 overflow-x-auto whitespace-pre-wrap break-words">
              {sampleWords.map((word, index) => (
                <span
                  key={index}
                  className={`mr-2 ${
                    index === currentWordIndex
                      ? "bg-blue-500 text-white px-1 rounded"
                      : index < currentWordIndex
                      ? inputText.split(/\s+/)[index] === word
                        ? "text-green-600"
                        : "text-red-600"
                      : "text-gray-800"
                  }`}
                  style={{
                    fontFamily:
                      font === "Mangal"
                        ? "Mangal"
                        : font === "Krutidev"
                        ? "Krutidev"
                        : "inherit",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
            {!isTestActive && (
              <button
                onClick={startTest}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Start Test
              </button>
            )}
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder="*Start Typing Here*"
              className="w-full h-40 p-4 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={!isTestActive || isPaused}
              style={{
                fontFamily:
                  font === "Mangal"
                    ? "Mangal"
                    : font === "Krutidev"
                    ? "Krutidev"
                    : "inherit",
              }}
              lang={language}
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          {config.rightPanel && (
            <div className="w-1/4 p-6 bg-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2">
                  P
                </div>
                <span className="font-semibold text-gray-800">Placement</span>
                <button className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-sm text-gray-800">0 Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full mr-1"></div>
                  <span className="text-sm text-gray-800">
                    0 Marked and answered
                  </span>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-sm text-gray-800">0 Not Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-500 rounded-full mr-1"></div>
                  <span className="text-sm text-gray-800">1 Visited</span>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600">
                  SECTION: Typing Test
                </h3>
                <button className="mt-2 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400">
                  1
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="fixed bottom-0 left-0 right-0 flex justify-end p-4 bg-white shadow-md">
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all mr-2 focus:outline-none focus:ring-2 focus:ring-gray-400">
            Question Paper
          </button>
          <button
            onClick={() => setShowInstructions(true)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all mr-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Instructions
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={!isTestActive}
          >
            Submit Test
          </button>
        </footer>

        {config.showStatsOverlay && isTestActive && (
          <div className="fixed bottom-20 left-4 bg-white p-4 rounded-lg shadow-lg">
            <p className="text-gray-800">WPM: {wpm}</p>
            <p className="text-gray-800">Accuracy: {accuracy}%</p>
            <p className="text-gray-800">Errors: {errors}</p>
          </div>
        )}

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
        />
      </div>
    </Suspense>
  );
};

ExamTypingTestt.propTypes = {
  // Add props if needed in the future
};

export default ExamTypingTestt;
