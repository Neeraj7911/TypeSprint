import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import paragraphs from "../paragraphs";

const TypingInterfaceSSCCHSL = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const examName = query.get("exam") || "Practice";
  const language = query.get("language") || "english";
  const targetWPM = parseInt(query.get("wpm")) || 35;
  const font = query.get("font") || "Mangal";
  const duration = parseInt(query.get("duration")) || 10;

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
  const [isPaused, setIsPaused] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (paragraphs[language] && paragraphs[language].length > 0) {
      setSampleText(paragraphs[language][selectedParagraph]);
    } else {
      setSampleText(paragraphs.english[selectedParagraph]);
    }
  }, [language, selectedParagraph]);

  useEffect(() => {
    let timer;
    if (isTestActive && !isPaused) {
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
  }, [isTestActive, isPaused]);

  useEffect(() => {
    if (isTestActive && startTime && !isPaused) {
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 60000; // minutes
        const inputChars = inputText.length;
        const sampleWords = sampleText.trim().split(/\s+/);
        const inputWords = inputText.trim().split(/\s+/);

        // Gross WPM: total characters typed / 5 / time
        const gross = Math.round(inputChars / 5 / timeElapsed);
        setGrossWpm(isFinite(gross) ? gross : 0);

        // Error calculation
        let errorCount = 0;
        for (
          let i = 0;
          i < Math.min(sampleWords.length, inputWords.length);
          i++
        ) {
          if (sampleWords[i] !== inputWords[i]) errorCount++;
        }
        setErrors(errorCount);

        // Net WPM: (gross WPM - uncorrected errors) / time
        const net = Math.max(0, gross - errorCount);
        setNetWpm(isFinite(net) ? net : 0);

        // Accuracy: correct characters / total characters
        const totalChars = sampleText.length;
        const correctChars = inputText
          .split("")
          .reduce((acc, char, i) => acc + (char === sampleText[i] ? 1 : 0), 0);
        setAccuracy(
          totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTestActive, startTime, inputText, sampleText, isPaused]);

  const startTest = useCallback(() => {
    setIsTestActive(true);
    setStartTime(Date.now());
    setGrossWpm(0);
    setNetWpm(0);
    setAccuracy(100);
    setErrors(0);
    setInputText("");
    setTimeLeft(duration * 60);
    setIsFullScreen(true);
    document.documentElement.requestFullscreen();
  }, [duration]);

  const handleSubmit = useCallback(() => {
    if (!isTestActive) return;
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
      },
    });
  }, [
    isTestActive,
    grossWpm,
    netWpm,
    accuracy,
    errors,
    targetWPM,
    examName,
    language,
    navigate,
    isFullScreen,
  ]);

  const handleInputChange = useCallback(
    (e) => {
      if (!isTestActive || isPaused) return;
      setInputText(e.target.value);
      if (e.target.value.trim().length >= sampleText.length) handleSubmit();
    },
    [isTestActive, isPaused, sampleText, handleSubmit]
  );

  const togglePause = useCallback(() => setIsPaused((prev) => !prev), []);

  const toggleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
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

  return (
    <div
      className={`flex flex-col ${
        isFullScreen ? "fixed inset-0" : "min-h-screen"
      } bg-gray-100`}
    >
      <header className="bg-purple-800 p-4 flex justify-between items-center">
        <div className="text-white font-bold">
          {examName.replace(/-/g, " ").toUpperCase()}
        </div>
        <div className="text-white">Time Left: {formatTime(timeLeft)}</div>
        <div className="text-white">Student Name</div>
      </header>
      <div className="flex-1 p-6">
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            Language: {language.toUpperCase()}
          </span>
        </div>
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
              style={{ fontFamily: font }}
            >
              {word}
            </span>
          ))}
        </div>
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
          ))}
        </select>
        {!isTestActive && (
          <button
            onClick={startTest}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start Test
          </button>
        )}
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="*Start Typing Here*"
          className="w-full h-40 p-4 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none"
          disabled={!isTestActive || isPaused}
          style={{ fontFamily: font }}
          lang={language}
        />
        {isTestActive && (
          <div className="mt-4">
            <button
              onClick={togglePause}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={toggleFullScreen}
              className="ml-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              {isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
            </button>
            <button
              onClick={handleSubmit}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
            <div className="mt-2 text-gray-800">
              Gross WPM: {grossWpm} | Net WPM: {netWpm} | Accuracy: {accuracy}%
              | Errors: {errors}
            </div>
          </div>
        )}
      </div>
      <footer className="bg-gray-800 p-4 text-white flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-gray-600 rounded-lg"
        >
          Submit
        </button>
      </footer>
    </div>
  );
};

export default TypingInterfaceSSCCHSL;
