import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import paragraphs from "../components/paragraphs";

const CustomCursor = lazy(() => import("../components/CustomCursor"));

const examConfigs = {
  Practice: {
    headerColor: "bg-black",
    sampleTextKey: "english",
    showStatsOverlay: true,
    rightPanel: true,
  },
  "ssc-chsl": {
    headerColor: "bg-blue-800",
    sampleTextKey: "english",
    showStatsOverlay: true,
    rightPanel: true,
  },
  "ssc-cgl": {
    headerColor: "bg-blue-900",
    sampleTextKey: "english",
    showStatsOverlay: false,
    rightPanel: true,
  },
  default: {
    headerColor: "bg-gray-800",
    sampleTextKey: "english",
    showStatsOverlay: true,
    rightPanel: false,
  },
};

const InstructionsModal = ({ isOpen, onClose, language, onStart }) => {
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
            To type in {language.charAt(0).toUpperCase() + language.slice(1)}:
            <ul className="list-circle pl-5">
              <li>
                Windows: Press <strong>Win + Space</strong> to switch to{" "}
                {language} keyboard.
              </li>
              <li>
                Mac: Press <strong>Control + Space</strong> to switch to{" "}
                {language} input.
              </li>
              <li>
                Ensure {language} keyboard is installed in your OS settings
                (e.g., "Hindi Phonetic" for Hindi).
              </li>
            </ul>
          </li>
        </ul>
        <button
          onClick={() => {
            onClose();
            onStart();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

InstructionsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  onStart: PropTypes.func.isRequired,
};

const ExamTypingTestt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const examName = query.get("exam") || "Practice";
  const language = query.get("language") || "english";
  const targetWPM = parseInt(query.get("wpm")) || 35;
  const font = query.get("font") || (language === "hindi" ? "Mangal" : "Arial");
  const duration = parseInt(query.get("duration")) || 10;

  const config = examConfigs[examName] || examConfigs["default"];

  const [inputText, setInputText] = useState("");
  const [sampleText, setSampleText] = useState("");
  const [selectedParagraph, setSelectedParagraph] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [grossWpm, setGrossWpm] = useState(0);
  const [netWpm, setNetWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [freeTimeLeft, setFreeTimeLeft] = useState(180);
  const [userStatus, setUserStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [testId, setTestId] = useState(null);

  const languageFonts = {
    english: "Arial",
    hindi: "Mangal",
    tamil: "Latha",
    telugu: "Gautami",
  };

  const currentFont = languageFonts[language] || font;

  const handleSubmit = useCallback(() => {
    if (!isTestActive || hasSubmitted) {
      console.log(
        "Submit blocked: Test not active or already submitted for testId:",
        testId
      );
      return;
    }
    console.log("Submitting test with testId:", testId, "Stats:", {
      grossWpm,
      netWpm,
      accuracy,
      errors,
    });
    setHasSubmitted(true);
    setIsTestActive(false);
    if (isFullScreen) document.exitFullscreen();
    navigate("/results", {
      state: {
        grossWpm,
        netWpm,
        accuracy,
        errors,
        targetWPM,
        examName,
        language,
        font: currentFont,
        testId,
      },
    });
  }, [
    isTestActive,
    hasSubmitted,
    grossWpm,
    netWpm,
    accuracy,
    errors,
    targetWPM,
    examName,
    language,
    currentFont,
    testId,
    navigate,
    isFullScreen,
  ]);

  useEffect(() => {
    if (paragraphs[language] && paragraphs[language].length > 0) {
      setSampleText(paragraphs[language][selectedParagraph]);
    } else {
      setSampleText(
        paragraphs[config.sampleTextKey][selectedParagraph] ||
          "Default text if language not found."
      );
    }
  }, [language, selectedParagraph, config.sampleTextKey]);

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
    let timer;
    if (isTestActive && !isPaused && !hasSubmitted && startTime) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            console.log("Timer triggered submit for testId:", testId);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, isPaused, hasSubmitted, testId, handleSubmit, startTime]);

  useEffect(() => {
    let freeTimer;
    if (
      language !== "english" &&
      userStatus === "not paid" &&
      isTestActive &&
      !isPaused &&
      !hasSubmitted &&
      startTime
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
  }, [
    language,
    userStatus,
    isTestActive,
    isPaused,
    navigate,
    hasSubmitted,
    startTime,
  ]);

  useEffect(() => {
    if (isTestActive && startTime && !isPaused && !hasSubmitted) {
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 60000; // Time in minutes
        const inputWords = inputText.trim().split(/\s+/).filter(Boolean); // Split input into words
        const sampleWords = sampleText.trim().split(/\s+/); // Split sample into words

        // Gross WPM: Total words typed divided by time (standard word = 5 chars)
        const totalCharsTyped = inputText.length;
        const gross = Math.round(totalCharsTyped / 5 / timeElapsed);
        setGrossWpm(isFinite(gross) ? gross : 0);

        // Errors: Count mismatched words
        let errorCount = 0;
        for (let i = 0; i < inputWords.length; i++) {
          if (i < sampleWords.length && inputWords[i] !== sampleWords[i]) {
            errorCount++;
          }
        }
        // If input exceeds sample, count extra words as errors
        if (inputWords.length > sampleWords.length) {
          errorCount += inputWords.length - sampleWords.length;
        }
        setErrors(errorCount);

        // Net WPM: Gross WPM minus errors per minute
        const net = Math.max(0, gross - Math.round(errorCount / timeElapsed));
        setNetWpm(isFinite(net) ? net : 0);

        // Accuracy: Percentage of correct characters
        let correctChars = 0;
        for (let i = 0; i < inputText.length; i++) {
          if (i < sampleText.length && inputText[i] === sampleText[i]) {
            correctChars++;
          }
        }
        const totalChars = Math.max(inputText.length, sampleText.length); // Use max to account for extra/missing chars
        setAccuracy(
          totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTestActive, startTime, inputText, sampleText, isPaused, hasSubmitted]);

  const startTest = useCallback(() => {
    const newTestId = `${examName}-${Date.now()}`;
    console.log("Starting new test with testId:", newTestId);
    setTestId(newTestId);
    setIsTestActive(true);
    setGrossWpm(0);
    setNetWpm(0);
    setAccuracy(100);
    setErrors(0);
    setInputText("");
    setTimeLeft(duration * 60);
    setFreeTimeLeft(180);
    setHasSubmitted(false);
    setIsFullScreen(true);
    setShowInstructions(true);
    document.documentElement
      .requestFullscreen()
      .catch((err) => console.error("Fullscreen error:", err));
  }, [duration, examName]);

  const handleStartAfterInstructions = useCallback(() => {
    setStartTime(Date.now());
  }, []);

  const handleInputChange = useCallback(
    (e) => {
      if (!isTestActive || isPaused) return;
      const value = e.target.value;
      console.log(`Input in ${language}:`, value);
      setInputText(value);
      if (value.trim().length >= sampleText.length) {
        console.log("Input length triggered submit for testId:", testId);
        handleSubmit();
      }
    },
    [isTestActive, isPaused, sampleText, testId, handleSubmit, language]
  );

  const togglePause = useCallback(() => setIsPaused((prev) => !prev), []);

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Exit fullscreen error:", err);
      });
      setIsFullScreen(false);
    }
  }, [isFullScreen]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const currentWordIndex =
    inputText.trim().split(/\s+/).filter(Boolean).length - 1;
  const sampleWords = sampleText.split(/\s+/);

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );

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
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
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
      <div
        className={`flex flex-col ${
          isFullScreen ? "fixed inset-0" : "min-h-screen"
        } bg-gray-100`}
      >
        <header
          className={`flex justify-between items-center p-4 ${config.headerColor} shadow-md z-10`}
        >
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Testbook Logo" className="h-8" />
            <h1 className="text-xl font-bold text-white">
              {examName.replace(/-/g, " ").toUpperCase()} Typing Test
            </h1>
          </div>
          <div className="text-lg font-semibold text-white">
            Time Left:{" "}
            {formatTime(
              language !== "english" && userStatus === "not paid"
                ? freeTimeLeft
                : timeLeft
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={toggleFullScreen}
              className="px-4 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
            >
              {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            </button>
            <button
              onClick={togglePause}
              className="px-4 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50"
              disabled={!isTestActive}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </header>

        <div className="flex flex-1 p-6">
          <div className="w-full md:w-3/4 p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Typing Test (
              {language.charAt(0).toUpperCase() + language.slice(1)})
            </h2>
            <select
              value={selectedParagraph}
              onChange={(e) => setSelectedParagraph(parseInt(e.target.value))}
              className="mb-4 p-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-800"
              disabled={isTestActive}
            >
              {paragraphs[language]?.map((_, index) => (
                <option key={index} value={index}>
                  Paragraph {index + 1}
                </option>
              )) || (
                <option value={0}>No {language} paragraphs available</option>
              )}
            </select>
            <div
              className="bg-gray-200 p-4 rounded-lg mb-4 overflow-x-auto whitespace-pre-wrap break-words"
              style={{ fontFamily: currentFont }}
            >
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
                >
                  {word}
                </span>
              ))}
            </div>
            {!isTestActive && (
              <button
                onClick={startTest}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
              >
                Start Test
              </button>
            )}
            <textarea
              value={inputText}
              onChange={handleInputChange}
              placeholder={`*Start Typing Here in ${
                language.charAt(0).toUpperCase() + language.slice(1)
              }*`}
              className="w-full h-40 p-4 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
              disabled={!isTestActive || isPaused}
              style={{ fontFamily: currentFont }}
              lang={language}
              inputMode="text"
            />
          </div>

          {config.rightPanel && (
            <div className="w-1/4 p-6 bg-gray-200 hidden md:block">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-600">
                  SECTION: Typing Test
                </h3>
                <button className="mt-2 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-800">
                  1
                </button>
              </div>
            </div>
          )}
        </div>

        <footer className="fixed bottom-0 left-0 right-0 flex justify-end p-4 bg-white shadow-md z-10">
          <button
            onClick={() => setShowInstructions(true)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all mr-2"
          >
            Instructions
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
            disabled={!isTestActive || hasSubmitted}
          >
            Submit Test
          </button>
        </footer>

        {config.showStatsOverlay && isTestActive && (
          <div className="fixed bottom-20 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
            <p className="text-gray-800">Gross WPM: {grossWpm}</p>
            <p className="text-gray-800">Net WPM: {netWpm}</p>
            <p className="text-gray-800">Accuracy: {accuracy}%</p>
            <p className="text-gray-800">Errors: {errors}</p>
          </div>
        )}

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          language={language}
          onStart={handleStartAfterInstructions}
        />
      </div>
    </Suspense>
  );
};

export default ExamTypingTestt;
