import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  lazy,
  useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
      <div className="bg-white border border-gray-300 p-6 max-w-lg w-full">
        <h2 className="text-lg font-bold mb-4 text-black">Instructions</h2>
        <ul className="list-disc pl-5 mb-4 text-black text-sm">
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
          className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
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

const ExamTypingTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const examName = query.get("exam") || "Practice";
  const language = query.get("language") || "english";
  const targetWPM = parseInt(query.get("wpm")) || 35;
  const font = query.get("font") || (language === "hindi" ? "Mangal" : "Arial");
  const duration = parseInt(query.get("duration")) || 10;
  const incomingTestId = query.get("testId");
  const config = examConfigs[examName] || examConfigs["default"];

  const [inputText, setInputText] = useState("");
  const [sampleText, setSampleText] = useState("");
  const [selectedParagraph, setSelectedParagraph] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [grossWpm, setGrossWpm] = useState(0);
  const [netWpm, setNetWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [fullErrors, setFullErrors] = useState(0);
  const [halfErrors, setHalfErrors] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [durationState, setDurationState] = useState(duration);
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
  const [fontSize, setFontSize] = useState(14);
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
    disableColorFeedback: false,
  });
  const [backspaceCount, setBackspaceCount] = useState(0);

  const latestStateRef = useRef({
    inputText: "",
    sampleText: "",
    backspaceCount: 0,
    startTime: null,
    grossWpm: 0,
    netWpm: 0,
    accuracy: 100,
    fullErrors: 0,
    halfErrors: 0,
  });

  useEffect(() => {
    latestStateRef.current = {
      inputText,
      sampleText,
      backspaceCount,
      startTime,
      grossWpm,
      netWpm,
      accuracy,
      fullErrors,
      halfErrors,
    };
  }, [
    inputText,
    sampleText,
    backspaceCount,
    startTime,
    grossWpm,
    netWpm,
    accuracy,
    fullErrors,
    halfErrors,
  ]);

  const languageFonts = {
    english: "Arial",
    hindi: "Mangal",
    tamil: "Latha",
    telugu: "Gautami",
  };

  const currentFont = languageFonts[language] || font;

  const normalizeText = (text) => {
    return text
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  };

  useEffect(() => {
    const progressKey = `typingProgress_${examName}_${language}`;
    const lastCompleted = localStorage.getItem(progressKey);
    if (lastCompleted !== null && paragraphs[language]?.length) {
      const nextParagraph =
        (parseInt(lastCompleted) + 1) % paragraphs[language].length;
      setSelectedParagraph(nextParagraph);
    }
  }, [examName, language]);

  const handleSubmit = useCallback(() => {
    if (!isTestActive || hasSubmitted) return;
    console.log("handleSubmit called");
    setHasSubmitted(true);
    setIsTestActive(false);
    if (isFullScreen) document.exitFullscreen();

    const progressKey = `typingProgress_${examName}_${language}`;
    localStorage.setItem(progressKey, selectedParagraph.toString());

    const {
      inputText,
      sampleText,
      backspaceCount,
      startTime,
      grossWpm,
      netWpm,
      accuracy,
      fullErrors,
      halfErrors,
    } = latestStateRef.current;
    const timeElapsed = startTime ? Date.now() - startTime : 60000;
    console.log("Navigating to Results with state:", {
      grossWpm,
      netWpm,
      accuracy,
      fullErrors,
      halfErrors,
      targetWPM,
      examName,
      language,
      font: currentFont,
      testId,
      backspaceCount,
      inputText,
      sampleText,
      timeElapsed,
    });

    navigate("/results", {
      state: {
        grossWpm,
        netWpm,
        accuracy,
        fullErrors,
        halfErrors,
        targetWPM,
        examName,
        language,
        font: currentFont,
        testId,
        backspaceCount,
        inputText,
        sampleText,
        timeElapsed,
      },
    });
  }, [
    isTestActive,
    hasSubmitted,
    isFullScreen,
    selectedParagraph,
    navigate,
    examName,
    language,
    targetWPM,
    currentFont,
    testId,
  ]);

  useEffect(() => {
    if (paragraphs[language] && paragraphs[language].length > 0) {
      setSampleText(normalizeText(paragraphs[language][selectedParagraph]));
    } else {
      setSampleText(
        normalizeText(
          paragraphs[config.sampleTextKey][selectedParagraph] ||
            "Default text if language not found.",
        ),
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
              : "not paid",
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

  // If opened with a live test id, load content and duration from firestore
  useEffect(() => {
    const loadLiveTest = async () => {
      if (!incomingTestId) return;
      try {
        const ref = doc(db, "liveTests", incomingTestId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.content) {
            setSampleText(normalizeText(data.content));
          }
          if (data.durationMinutes) {
            setDurationState(Number(data.durationMinutes));
            setTimeLeft(Number(data.durationMinutes) * 60);
          }
          setTestId(incomingTestId);
        }
      } catch (e) {
        console.error("Failed to load live test content", e);
      }
    };
    loadLiveTest();
  }, [incomingTestId]);

  useEffect(() => {
    let timer;
    console.log("Main timer useEffect running:", {
      isTestActive,
      isPaused,
      hasSubmitted,
      startTime,
    });
    if (isTestActive && !isPaused && !hasSubmitted && startTime) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          console.log("Main timer tick, timeLeft:", prev);
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      console.log("Main timer useEffect cleanup");
      clearInterval(timer);
    };
  }, [isTestActive, isPaused, hasSubmitted, startTime]);

  useEffect(() => {
    let freeTimer;
    console.log("Free timer useEffect running:", {
      isTestActive,
      isPaused,
      hasSubmitted,
      startTime,
      language,
      userStatus,
    });
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
          console.log("Free timer tick, freeTimeLeft:", prev);
          if (prev <= 1) {
            setIsTestActive(false);
            navigate("/payment");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      console.log("Free timer useEffect cleanup");
      clearInterval(freeTimer);
    };
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
        const normalizedInput = normalizeText(inputText);
        const normalizedSample = normalizeText(sampleText);
        const inputWords = normalizedInput.split(" ");
        const sampleWords = normalizedSample.split(" ");

        let correctChars = 0;
        let fullErrors = 0;
        let halfErrors = 0;

        const minLength = Math.min(inputWords.length, sampleWords.length);
        for (let i = 0; i < minLength; i++) {
          const inputWord = inputWords[i].trim();
          const sampleWord = sampleWords[i].trim();
          if (inputWord === sampleWord) {
            correctChars += inputWord.length + (i < minLength - 1 ? 1 : 0); // Add space if not last word
          } else if (
            inputWord.replace(/[^\w]/g, "") === sampleWord.replace(/[^\w]/g, "")
          ) {
            correctChars += inputWord.length;
            halfErrors += 1; // Spacing or punctuation difference
          } else {
            fullErrors += 1; // Spelling mismatch
          }
        }

        // Handle extra words
        if (inputWords.length > sampleWords.length) {
          for (let i = minLength; i < inputWords.length; i++) {
            fullErrors += 1; // Extra word penalty
          }
        }

        // Handle incomplete last word
        if (
          inputWords.length > 0 &&
          inputWords.length <= sampleWords.length &&
          !inputText.endsWith(" ")
        ) {
          const lastInputWord = inputWords[inputWords.length - 1];
          const nextSampleWord = sampleWords[inputWords.length] || "";
          if (
            lastInputWord.length < sampleWords[inputWords.length - 1].length &&
            lastInputWord.replace(/[^\w]/g, "") ===
              sampleWords[inputWords.length - 1].replace(/[^\w]/g, "")
          ) {
            // Do not count half error for incomplete word
          } else if (
            lastInputWord.replace(/[^\w]/g, "") ===
            nextSampleWord.replace(/[^\w]/g, "")
          ) {
            halfErrors += 1; // Missing space after last word
          }
        }

        const gross = Math.round(correctChars / 5 / timeElapsed);
        setGrossWpm(isFinite(gross) ? gross : 0);

        setFullErrors(fullErrors);
        setHalfErrors(halfErrors);

        const net = Math.max(
          0,
          gross - Math.round((fullErrors + halfErrors / 2) / timeElapsed),
        );
        setNetWpm(isFinite(net) ? net : 0);

        const totalCharsTyped = normalizedInput.length || 1;
        const accuracyPercentage = Math.round(
          (correctChars / totalCharsTyped) * 100,
        );
        setAccuracy(isFinite(accuracyPercentage) ? accuracyPercentage : 100);

        if (
          correctChars === normalizedSample.length &&
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
    setFullErrors(0);
    setHalfErrors(0);
    setInputText("");
    setTimeLeft(durationState * 60);
    setFreeTimeLeft(180);
    setHasSubmitted(false);
    setIsFullScreen(true);
    setShowInstructions(true);
    setBackspaceCount(0);
    document.documentElement.requestFullscreen().catch((err) => {});
  }, [duration, examName]);

  const handleStartAfterInstructions = useCallback(() => {
    setStartTime(Date.now());
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (!isTestActive || isPaused) return;
      console.log("handleKeyDown called, key:", e.key);

      if (keyboardSettings.disableBackspace && e.key === "Backspace") {
        e.preventDefault();
      } else if (e.key === "Backspace") {
        setBackspaceCount((prev) => {
          const newCount = prev + 1;
          console.log("Backspace pressed, count:", newCount);
          return newCount;
        });
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
    [isTestActive, isPaused, keyboardSettings],
  );

  const handleInputChange = useCallback(
    (e) => {
      if (!isTestActive || isPaused) return;
      console.log("handleInputChange called");
      const value = e.target.value;
      setInputText(value);
    },
    [isTestActive, isPaused],
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
    setFontSize((prev) => Math.min(prev + 2, 18));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  const currentWordIndex = useCallback(() => {
    const inputWords = normalizeText(inputText).split(" ");
    const sampleWords = normalizeText(sampleText).split(" ");
    let index = inputWords.length - 1;
    if (
      index >= 0 &&
      !inputText.endsWith(" ") &&
      index < sampleWords.length - 1
    ) {
      const lastInputWord = inputWords[index];
      const nextSampleWord = sampleWords[index + 1] || "";
      if (
        lastInputWord.replace(/[^\w]/g, "") ===
        nextSampleWord.replace(/[^\w]/g, "")
      ) {
        index++; // Move to next word if half error (missing space)
      }
    }
    return Math.max(0, Math.min(index, sampleWords.length - 1));
  }, [inputText, sampleText]);

  const sampleWords = normalizeText(sampleText).split(" ");
  const inputWords = normalizeText(inputText).split(" ");

  if (isLoading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-base font-bold text-black">Loading...</div>
      </div>
    );

  if (!isLoggedIn) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <CustomCursor />
        <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center p-4">
          <h1 className="text-lg font-bold mb-4 text-center">
            Login to Continue
          </h1>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
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
        } bg-white`}
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
                : timeLeft,
            )}
          </div>
          <div className="flex space-x-3 mt-2 sm:mt-0">
            <button
              onClick={toggleFullScreen}
              className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300 text-sm sm:text-base"
            >
              {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            </button>
            <button
              onClick={togglePause}
              className="px-3 py-1 bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 text-sm sm:text-base"
              disabled={!isTestActive}
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
          </div>
        </header>

        <div className="flex flex-col flex-1 p-4 max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-3/4 border border-gray-300 p-4 bg-white">
              <h2 className="text-base font-bold mb-2 text-black">
                Typing Test (
                {language.charAt(0).toUpperCase() + language.slice(1)})
              </h2>
              {!isTestActive && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
                  <select
                    value={selectedParagraph}
                    onChange={(e) =>
                      setSelectedParagraph(parseInt(e.target.value))
                    }
                    className="w-full max-w-xs p-2 border border-gray-300 text-black text-sm disabled:opacity-50"
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
                      className="text-blue-500 hover:underline text-sm"
                    >
                      +A
                    </button>
                    <button
                      onClick={decreaseFontSize}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      -A
                    </button>
                  </div>
                </div>
              )}
              <div
                className="bg-white p-4 border border-gray-300 mb-4 h-48 overflow-y-auto whitespace-pre-wrap break-words"
                style={{
                  fontFamily: currentFont,
                  fontSize: `${fontSize}px`,
                  lineHeight: "1.5",
                }}
              >
                {sampleWords.map((word, index) => (
                  <span
                    key={index}
                    className={`mr-2 ${
                      index === currentWordIndex() &&
                      !keyboardSettings.disableHighlighting
                        ? "bg-blue-500 text-white px-1"
                        : keyboardSettings.disableColorFeedback
                          ? "text-black"
                          : index < inputWords.length
                            ? inputWords[index] === word
                              ? "text-green-600"
                              : "text-red-600"
                            : "text-black"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
              {!isTestActive && (
                <div className="mb-4 flex flex-col space-y-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={startTest}
                      className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                      disabled={isTestActive}
                    >
                      Start Test
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(keyboardSettings).map((key) => (
                        <label
                          key={key}
                          className="flex items-center space-x-1"
                        >
                          <input
                            type="checkbox"
                            checked={keyboardSettings[key]}
                            onChange={() => handleCheckboxChange(key)}
                            className="h-4 w-4"
                          />
                          <span className="text-black text-xs">
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
                className="w-full h-40 p-4 bg-white border border-gray-300 text-black disabled:opacity-50"
                disabled={!isTestActive || isPaused}
                style={{
                  fontFamily: currentFont,
                  fontSize: `${fontSize}px`,
                  lineHeight: "1.5",
                }}
                lang={language}
                inputMode="text"
              />
            </div>

            {config.rightPanel && (
              <div className="w-full lg:w-1/4 p-4 bg-gray-200 border border-gray-300">
                <h3 className="text-sm font-bold text-black mb-2">
                  Exam Progress
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                      1
                    </span>
                    <span className="text-black text-sm">Typing Test</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {config.showStatsOverlay && isTestActive && (
            <div className="fixed top-16 right-4 bg-gray-100 border border-gray-300 p-4 z-10">
              <table className="text-sm text-black">
                <tbody>
                  <tr>
                    <td className="font-bold pr-2">Gross WPM:</td>
                    <td>{grossWpm}</td>
                  </tr>
                  <tr>
                    <td className="font-bold pr-2">Net WPM:</td>
                    <td>{netWpm}</td>
                  </tr>
                  <tr>
                    <td className="font-bold pr-2">Accuracy:</td>
                    <td>{accuracy}%</td>
                  </tr>
                  <tr>
                    <td className="font-bold pr-2">Full Errors:</td>
                    <td>{fullErrors}</td>
                  </tr>
                  <tr>
                    <td className="font-bold pr-2">Half Errors:</td>
                    <td>{halfErrors}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="fixed bottom-0 left-0 right-0 flex justify-end p-4 bg-white border-t border-gray-300 z-10">
          <button
            onClick={() => setShowInstructions(true)}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 mr-2"
          >
            Instructions
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
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

export default ExamTypingTest;
