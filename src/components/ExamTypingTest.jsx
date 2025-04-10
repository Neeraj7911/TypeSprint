import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { getDailyAttempts, incrementDailyAttempts } from "../firebase.jsx";
import PremiumUpsell from "./PremiumUpsell";
import LoginPrompt from "./login.jsx";

const examData = {
  "ssc-cgl": {
    name: "SSC CGL",
    paragraphs: [
      "The Staff Selection Commission (SSC) conducts the Combined Graduate Level Examination for recruitment to various Group 'B' and Group 'C' posts in different Ministries/Departments/Organizations of the Government of India.",
      // Add more exam-specific paragraphs
    ],
  },
  ntpc: {
    name: "NTPC",
    paragraphs: [
      "The National Thermal Power Corporation Limited (NTPC) is India's largest energy conglomerate with roots planted way back in 1975 to accelerate power development in India.",
      // Add more exam-specific paragraphs
    ],
  },
  // Add other exams
};

const ExamTypingTest = ({ darkMode }) => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateUserStats } = useAuth();
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [canAttempt, setCanAttempt] = useState(true);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const checkAttempts = async () => {
      if (!currentUser) return;
      const { attempts, canAttempt: canTry } = await getDailyAttempts(
        currentUser.uid
      );
      setAttemptsLeft(Math.max(0, 2 - attempts));
      setCanAttempt(canTry);
    };

    checkAttempts();
  }, [currentUser]);

  useEffect(() => {
    if (!examData[examId]) {
      navigate("/");
      return;
    }
    const paragraphs = examData[examId].paragraphs;
    setText(paragraphs[Math.floor(Math.random() * paragraphs.length)]);
  }, [examId, navigate]);

  const startTest = () => {
    setUserInput("");
    setStartTime(Date.now());
    setIsTestActive(true);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const calculateResults = async () => {
    const timeInMinutes = (endTime - startTime) / 60000;
    const words = userInput.trim().split(/\s+/).length;
    const calculatedWpm = Math.round(words / timeInMinutes);

    const characters = userInput.length;
    const correctCharacters = [...userInput].filter(
      (char, i) => char === text[i]
    ).length;
    const calculatedAccuracy = Math.round(
      (correctCharacters / characters) * 100
    );

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);

    if (currentUser) {
      await updateUserStats(currentUser.uid, {
        wpm: calculatedWpm,
        accuracy: calculatedAccuracy,
        examType: examId,
        duration: timeInMinutes,
      });
    }
  };

  const handleInputChange = async (e) => {
    if (!isTestActive) return;

    const newInput = e.target.value;
    setUserInput(newInput);

    if (newInput.length >= text.length) {
      setEndTime(Date.now());
      setIsTestActive(false);
      await calculateResults();
      setShowResults(true);

      if (currentUser && !currentUser.isPremium) {
        await incrementDailyAttempts(currentUser.uid);
        const newAttemptsLeft = attemptsLeft - 1;
        setAttemptsLeft(newAttemptsLeft);

        if (newAttemptsLeft === 0) {
          setShowPremiumUpsell(true);
        }
      }
    }
  };

  if (!currentUser) {
    return <LoginPrompt darkMode={darkMode} />;
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-xl"
        >
          <div className="mb-8">
            <h2
              className={`text-3xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {examData[examId]?.name} Typing Test
            </h2>
            <div className="flex justify-between items-center">
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {currentUser.isPremium
                  ? "Premium User: Unlimited Attempts"
                  : `Attempts Left Today: ${attemptsLeft}`}
              </p>
              {!currentUser.isPremium && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full"
                  onClick={() => setShowPremiumUpsell(true)}
                >
                  Upgrade to Premium
                </motion.button>
              )}
            </div>
          </div>

          {!isTestActive && !showResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              {canAttempt ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startTest}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-3 rounded-full text-lg font-semibold"
                >
                  Start Test
                </motion.button>
              ) : (
                <div
                  className={`text-center ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  <p className="text-xl mb-4">
                    You've reached your daily limit!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPremiumUpsell(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full text-lg font-semibold"
                  >
                    Get Unlimited Access
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {isTestActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div
                className={`text-lg leading-relaxed font-mono ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } bg-white bg-opacity-5 p-6 rounded-lg`}
              >
                {text.split("").map((char, index) => (
                  <span
                    key={index}
                    className={
                      userInput[index] === undefined
                        ? ""
                        : userInput[index] === char
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {char}
                  </span>
                ))}
              </div>

              <textarea
                ref={inputRef}
                value={userInput}
                onChange={handleInputChange}
                className={`w-full h-32 p-4 rounded-lg bg-white bg-opacity-5 text-lg font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
                placeholder="Start typing here..."
              />
            </motion.div>
          )}

          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 p-6 bg-white bg-opacity-5 rounded-lg"
              >
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    darkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Your Results
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Speed
                    </p>
                    <p className="text-3xl font-bold text-green-500">
                      {wpm} WPM
                    </p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Accuracy
                    </p>
                    <p className="text-3xl font-bold text-blue-500">
                      {accuracy}%
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startTest}
                    className="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full"
                    disabled={!canAttempt && !currentUser.isPremium}
                  >
                    Try Again
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showPremiumUpsell && (
            <PremiumUpsell
              darkMode={darkMode}
              onClose={() => setShowPremiumUpsell(false)}
              currentWpm={wpm}
              currentAccuracy={accuracy}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ExamTypingTest;
