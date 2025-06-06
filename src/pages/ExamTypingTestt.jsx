import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import paragraphs from "../components/paragraphs";
import LogoSvg from "../assets/react.svg";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
  const [fontSize, setFontSize] = useState(16);
  const [keyboardSettings, setKeyboardSettings] = useState({
    disableBackspace: false,
    disableDelete: false,
    disableLeftArrow: false,
    disableRightArrow: false,
    disableHighlighting: false,
    disableCopy: false,
    disablePaste: false,
    disableCut: false,
    disableSelectAll: false,
  });

  const languageFonts = {
    english: "Arial",
    hindi: "Mangal",
    tamil: "Latha",
    telugu: "Gautami",
  };

  const currentFont = languageFonts[language] || font;

  // Normalize apostrophes (straight ' and curly ’ to the same character)
  const normalizeText = (text) => {
    return text.replace(/[\u2018\u2019]/g, "'"); // Replace curly apostrophes with straight
  };

  const handleSubmit = useCallback(() => {
    if (!isTestActive || hasSubmitted) return;
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
      setSampleText(normalizeText(paragraphs[language][selectedParagraph]));
    } else {
      setSampleText(
        normalizeText(
          paragraphs[config.sampleTextKey][selectedParagraph] ||
            "Default text if language not found."
        )
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
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTestActive, isPaused, hasSubmitted, handleSubmit, startTime]);

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
        const timeElapsed = Math.max((Date.now() - startTime) / 60000, 0.0167);
        // Normalize input and sample text
        const normalizedInput = normalizeText(inputText);
        const normalizedSample = normalizeText(sampleText);
        // Split words while preserving punctuation
        const inputWords = normalizedInput.trim().split(/\s+/).filter(Boolean);
        const sampleWords = normalizedSample
          .trim()
          .split(/\s+/)
          .filter(Boolean);

        // Count only correct words for WPM
        let correctChars = 0;
        let errorCount = 0;
        let correctWords = 0;

        for (let i = 0; i < inputWords.length; i++) {
          if (i < sampleWords.length) {
            if (inputWords[i] === sampleWords[i]) {
              correctWords++;
              correctChars +=
                inputWords[i].length + (i < inputWords.length - 1 ? 1 : 0); // Add space for non-last word
            } else {
              errorCount++;
              console.log(
                `Mismatch at word ${i}: Input="${inputWords[i]}" vs Sample="${sampleWords[i]}"`
              );
            }
          } else {
            errorCount++; // Extra words are errors
            console.log(`Extra word at index ${i}: "${inputWords[i]}"`);
          }
        }

        // Calculate gross WPM based on correct characters only
        const gross = Math.round(correctChars / 5 / timeElapsed);
        setGrossWpm(isFinite(gross) ? gross : 0);

        // Set errors
        setErrors(errorCount);

        // Calculate net WPM (gross minus errors per minute)
        const net = Math.max(0, gross - Math.round(errorCount / timeElapsed));
        setNetWpm(isFinite(net) ? net : 0);

        // Calculate accuracy based on correct characters
        const totalCharsTyped = normalizedInput.length || 1;
        const accuracyPercentage = Math.round(
          (correctChars / totalCharsTyped) * 100
        );
        setAccuracy(isFinite(accuracyPercentage) ? accuracyPercentage : 100);

        // Auto-submit if all words are correctly typed
        if (
          correctWords === sampleWords.length &&
          inputWords.length === sampleWords.length
        ) {
          handleSubmit();
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [
    isTestActive,
    startTime,
    inputText,
    sampleText,
    isPaused,
    hasSubmitted,
    handleSubmit,
  ]);

  const startTest = useCallback(() => {
    const newTestId = `${examName}-${Date.now()}`;
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
    document.documentElement.requestFullscreen().catch((err) => {});
  }, [duration, examName]);

  const handleStartAfterInstructions = useCallback(() => {
    setStartTime(Date.now());
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (!isTestActive || isPaused) return;

      if (keyboardSettings.disableBackspace && e.key === "Backspace") {
        e.preventDefault();
      }
      if (keyboardSettings.disableDelete && e.key === "Delete") {
        e.preventDefault();
      }
      if (keyboardSettings.disableLeftArrow && e.key === "ArrowLeft") {
        e.preventDefault();
      }
      if (keyboardSettings.disableRightArrow && e.key === "ArrowRight") {
        e.preventDefault();
      }
      if (
        keyboardSettings.disableCopy &&
        (e.ctrlKey || e.metaKey) &&
        e.key === "c"
      ) {
        e.preventDefault();
      }
      if (
        keyboardSettings.disablePaste &&
        (e.ctrlKey || e.metaKey) &&
        e.key === "v"
      ) {
        e.preventDefault();
      }
      if (
        keyboardSettings.disableCut &&
        (e.ctrlKey || e.metaKey) &&
        e.key === "x"
      ) {
        e.preventDefault();
      }
      if (
        keyboardSettings.disableSelectAll &&
        (e.ctrlKey || e.metaKey) &&
        e.key === "a"
      ) {
        e.preventDefault();
      }
    },
    [isTestActive, isPaused, keyboardSettings]
  );

  const handleInputChange = useCallback(
    (e) => {
      if (!isTestActive || isPaused) return;
      const value = e.target.value;
      setInputText(value);
    },
    [isTestActive, isPaused]
  );

  const handleCheckboxChange = (key) => {
    setKeyboardSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePause = useCallback(() => setIsPaused((prev) => !prev), []);

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen().catch((err) => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen().catch((err) => {});
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

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  const currentWordIndex =
    normalizeText(inputText).trim().split(/\s+/).filter(Boolean).length - 1;
  const sampleWords = normalizeText(sampleText)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

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
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center p-4">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-2xl sm:text-3xl font-bold mb-6 text-center"
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
          className={`flex flex-col sm:flex-row justify-between items-center p-4 ${config.headerColor} shadow-md z-10`}
        >
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            <img src={LogoSvg} alt="TypeSprint Logo" className="h-8" />
            <h1 className="text-lg sm:text-xl font-bold text-white text-center">
              {examName.replace(/-/g, " ").toUpperCase()} Typing Test
            </h1>
          </div>
          <div className="text-base sm:text-lg font-semibold text-white">
            Time Left:{" "}
            {formatTime(
              language !== "english" && userStatus === "not paid"
                ? freeTimeLeft
                : timeLeft
            )}
          </div>
          <div className="flex space-x-3 mt-2 sm:mt-0">
            <button
              onClick={toggleFullScreen}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all text-sm sm:text-base"
            >
              {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            </button>
            <button
              onClick={togglePause}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 text-sm sm:text-base"
              disabled={!isTestActive}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </header>

        <div className="flex flex-col flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-3/4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Typing Test (
                {language.charAt(0).toUpperCase() + language.slice(1)})
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
                <select
                  value={selectedParagraph}
                  onChange={(e) =>
                    setSelectedParagraph(parseInt(e.target.value))
                  }
                  className="p-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-800 w-full max-w-xs"
                  disabled={isTestActive}
                >
                  {paragraphs[language]?.map((_, index) => (
                    <option key={index} value={index}>
                      Paragraph {index + 1}
                    </option>
                  )) || (
                    <option value={0}>
                      No {language} paragraphs available
                    </option>
                  )}
                </select>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    onClick={increaseFontSize}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all text-sm"
                  >
                    Increase Font
                  </button>
                  <button
                    onClick={decreaseFontSize}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all text-sm"
                  >
                    Decrease Font
                  </button>
                </div>
              </div>
              <div
                className="bg-gray-200 p-4 rounded-lg mb-4 h-40 sm:h-48 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-words border border-gray-300"
                style={{ fontFamily: currentFont, fontSize: `${fontSize}px` }}
              >
                {sampleWords.map((word, index) => (
                  <span
                    key={index}
                    className={`mr-2 ${
                      index === currentWordIndex &&
                      !keyboardSettings.disableHighlighting
                        ? "bg-blue-500 text-white px-1 rounded"
                        : index < currentWordIndex
                        ? normalizeText(inputText).split(/\s+/)[index] === word
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
                <div className="mb-4 flex flex-col space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={startTest}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                      Start Test
                    </button>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                      {Object.keys(keyboardSettings).map((key) => (
                        <label
                          key={key}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            checked={keyboardSettings[key]}
                            onChange={() => handleCheckboxChange(key)}
                            className="h-4 w-4 text-blue-500"
                          />
                          <span className="text-gray-700 text-xs sm:text-sm">
                            Disable{" "}
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <textarea
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={`*Start Typing Here in ${
                  language.charAt(0).toUpperCase() + language.slice(1)
                }*`}
                className="w-full h-32 sm:h-40 p-4 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none resize-none"
                disabled={!isTestActive || isPaused}
                style={{ fontFamily: currentFont, fontSize: `${fontSize}px` }}
                lang={language}
                inputMode="text"
              />
            </div>

            {config.rightPanel && (
              <div className="w-full lg:w-1/4 p-4 sm:p-6 bg-gray-200 hidden lg:block">
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

          {config.showStatsOverlay && isTestActive && (
            <div className="fixed bottom-16 sm:bottom-20 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
              <p className="text-gray-800">Gross WPM: {grossWpm}</p>
              <p className="text-gray-800">Net WPM: {netWpm}</p>
              <p className="text-gray-800">Accuracy: {accuracy}%</p>
              <p className="text-gray-800">Errors: {errors}</p>
            </div>
          )}
        </div>

        <footer className="fixed bottom-0 left-0 right-0 flex justify-end p-4 bg-white shadow-md z-10">
          <button
            onClick={() => setShowInstructions(true)}
            className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all mr-2 text-sm sm:text-base"
          >
            Instructions
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 text-sm sm:text-base"
            disabled={!isTestActive || hasSubmitted}
          >
            Submit Test
          </button>
        </footer>

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
