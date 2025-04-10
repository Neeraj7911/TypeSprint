//    pdfDoc.addImage(Logo, "PNG", (pageWidth - 50) / 2, 30, 50, 50);

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase"; // Using your firebase.jsx
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Correct imports
import jsPDF from "jspdf";
import CustomCursor from "./CustomCursor";
import Logo from "../assets/logo.png"; // Adjust path to your logo
import Stamp from "../assets/stamp.png"; // Adjust path to your stamp

const TypingTest = ({ darkMode }) => {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timer, setTimer] = useState(30);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [user, setUser] = useState(null);
  const [certificateGenerated, setCertificateGenerated] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const intervalRef = useRef(null);

  // Array of 6 challenging pangrams
  const pangrams = [
    "A wizard briskly packed five dozen jugs of liquor into a quartz box while nimble nymphs observed with great curiosity.",
    "Jumpy zebras dashed over thick vines as quick foxes vexed the puzzled sphinx in a moonlit glade under the starry sky.",
    "The black quartz rock shimmered mysteriously while five jocks played jazz tunes on an ancient golden jukebox near the bonfire.",
    "A dozen vexed dwarves juggled heavy boxes filled with waxy gems as a giant owl watched with wide eyes from the old tower.",
    "Bright sphinx statues guarded the wizard's tall tower while quizzical nymphs deciphered cryptic runes carved into the marble walls.",
    "Dizzy from the wizard's swirling spells, quick foxes and jagged rocks whirled in a gusty, dazzling storm of golden dust.",
  ];

  // Function to select a random pangram different from the last one
  const getRandomPangram = () => {
    const lastPangram = localStorage.getItem("lastPangram") || "";
    let newPangram;
    do {
      newPangram = pangrams[Math.floor(Math.random() * pangrams.length)];
    } while (newPangram === lastPangram && pangrams.length > 1); // Ensure it's different unless only one option
    localStorage.setItem("lastPangram", newPangram);
    return newPangram;
  };

  useEffect(() => {
    const initialText = getRandomPangram();
    setText(initialText);
    setWords(initialText.split(" "));

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem("userEmail", currentUser.email);
      } else {
        localStorage.removeItem("userEmail");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isTestActive && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      endTest();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTestActive, timer]);

  const startTest = useCallback(() => {
    setIsTestActive(true);
    setTimer(30);
    setCurrentWordIndex(0);
    setUserInput("");
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const endTest = useCallback(() => {
    setIsTestActive(false);
    setTestCompleted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const wordsTyped = userInput.trim().split(" ").length;
    const accuracy = calculateAccuracy(text, userInput);
    const results = { wordsTyped, accuracy };

    localStorage.setItem("testResults", JSON.stringify(results));

    const userEmail = localStorage.getItem("userEmail");
    const completedTests = JSON.parse(
      localStorage.getItem("completedTests") || "[]"
    );
    if (!completedTests.includes(userEmail)) {
      completedTests.push(userEmail);
      localStorage.setItem("completedTests", JSON.stringify(completedTests));
    }

    setHasCompletedTest(true);
    setShowGenerateButton(true);
    setCertificateGenerated(false);
  }, [text, userInput]);

  const resetTest = () => {
    setIsTestActive(false);
    setTestCompleted(false);
    setUserInput("");
    setTimer(30);
    setCurrentWordIndex(0);
    setShowGenerateButton(false);
    setHasCompletedTest(false);
    setCertificateGenerated(false);

    const userEmail = localStorage.getItem("userEmail");
    const completedTests = JSON.parse(
      localStorage.getItem("completedTests") || "[]"
    );
    const updatedTests = completedTests.filter((email) => email !== userEmail);
    localStorage.setItem("completedTests", JSON.stringify(updatedTests));
    localStorage.removeItem("testResults");

    // Set a new random pangram on reset
    const newText = getRandomPangram();
    setText(newText);
    setWords(newText.split(" "));
  };

  const calculateAccuracy = (original, typed) => {
    const originalWords = original.trim().split(" ");
    const typedWords = typed.trim().split(" ");
    let correctWords = 0;
    typedWords.forEach((word, index) => {
      if (word === originalWords[index]) correctWords++;
    });
    return (correctWords / originalWords.length) * 100;
  };

  const calculateWPM = (wordsTyped, timeInSeconds) => {
    return Math.round((wordsTyped / timeInSeconds) * 60);
  };

  const formatAccuracy = (accuracy) => {
    return accuracy.toFixed(1);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setUserInput(inputValue);

    if (!isTestActive) {
      startTest();
    }

    const inputWords = inputValue.trim().split(/\s+/);
    const currentInputWord = inputWords[inputWords.length - 1] || "";
    const currentTargetWord = words[currentWordIndex] || "";

    if (
      inputValue.endsWith(" ") &&
      currentInputWord === currentTargetWord &&
      currentWordIndex < words.length - 1
    ) {
      setCurrentWordIndex((prev) => prev + 1);
    } else if (!inputValue.endsWith(" ")) {
      setCurrentWordIndex(inputWords.length - 1);
    }
  };

  const generateCertificate = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (certificateGenerated) {
      alert(
        "You have already generated a certificate for this test. Please retake the test to generate a new one."
      );
      return;
    }

    const results = JSON.parse(localStorage.getItem("testResults"));
    const wpm = calculateWPM(results.wordsTyped, 30);
    const accuracy = formatAccuracy(results.accuracy);
    const uniqueNumber = `CERT-${Date.now()}-${Math.floor(
      Math.random() * 10000
    )}`;
    const userName = user.displayName || "User";

    // Save to Firebase
    try {
      await setDoc(doc(db, "certificates", uniqueNumber), {
        userEmail: user.email,
        wpm,
        accuracy,
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      return;
    }

    // Generate PDF
    const pdfDoc = new jsPDF();
    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    const pageHeight = pdfDoc.internal.pageSize.getHeight();

    // Title
    pdfDoc.setFontSize(24);
    pdfDoc.setTextColor(0, 102, 204);
    pdfDoc.text("Typing Certificate", pageWidth / 2, 20, { align: "center" });

    // Logo
    pdfDoc.addImage(Logo, "PNG", (pageWidth - 50) / 2, 30, 50, 50);

    // Certification Statement with Name
    pdfDoc.setFontSize(14);
    pdfDoc.setTextColor(0);
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

    // User Details (without Name, since it's in the statement)
    pdfDoc.setFontSize(16);
    pdfDoc.text(`Email: ${user.email}`, 20, 150);
    pdfDoc.text(`Words Per Minute (WPM): ${wpm}`, 20, 160);
    pdfDoc.text(`Accuracy: ${accuracy}%`, 20, 170);
    pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 180);
    pdfDoc.text(`Certificate Number: ${uniqueNumber}`, 20, 190);

    // Stamp
    pdfDoc.addImage(Stamp, "PNG", pageWidth - 70, pageHeight - 70, 50, 50);

    // Verification Footer
    pdfDoc.setFontSize(10);
    pdfDoc.setTextColor(100);
    pdfDoc.text(
      "Verify this certificate at: typingtest-9f8f6.web.app/verify",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    pdfDoc.save(`Typing_Certificate_${uniqueNumber}.pdf`);
    setCertificateGenerated(true);
  };

  const isWordCorrect = () => {
    const inputWords = userInput.trim().split(/\s+/);
    const currentInputWord = inputWords[currentWordIndex] || "";
    return (
      currentInputWord ===
      words[currentWordIndex]?.slice(0, currentInputWord.length)
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`p-8 rounded-lg ${
          darkMode ? "bg-gray-800 bg-opacity-50" : "bg-blue-100 bg-opacity-75"
        } backdrop-filter backdrop-blur-lg shadow-xl`}
      >
        <h2
          className={`text-3xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Take the TypeSprint Challenge
        </h2>

        {!isTestActive && !testCompleted && (
          <motion.p
            className={`text-xl mb-4 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Click on the input box to start the test!
          </motion.p>
        )}

        {(isTestActive || testCompleted) && !showGenerateButton && (
          <>
            <motion.p
              className={`mb-4 text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              Time remaining: {timer} seconds
            </motion.p>
            <motion.div
              className={`p-4 rounded mb-4 ${
                darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-800"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {words.map((word, index) => {
                const isCurrent = index === currentWordIndex;
                const isCompleted = index < currentWordIndex;
                const isIncorrect =
                  isCurrent && isTestActive && !isWordCorrect();

                return (
                  <motion.span
                    key={index}
                    className={`inline-block mx-2 text-xl font-mono`}
                    animate={{
                      textShadow: isCurrent
                        ? isIncorrect
                          ? "0 0 5px #ff0000, 0 0 10px #ff0000"
                          : [
                              "0 0 5px #0ff, 0 0 10px #0ff",
                              "0 0 5px #f0f, 0 0 10px #f0f",
                            ]
                        : isCompleted
                        ? "0 0 5px rgba(0,255,0,0.5)"
                        : "0 0 3px rgba(255,255,255,0.3)",
                      color: isCurrent
                        ? isIncorrect
                          ? "#ff0000"
                          : "#0ff"
                        : isCompleted
                        ? "#0f0"
                        : darkMode
                        ? "#fff"
                        : "#666",
                      scale: isCompleted ? 1 : isCurrent ? 1.1 : 1,
                    }}
                    transition={
                      isCurrent && !isIncorrect
                        ? {
                            textShadow: {
                              repeat: Infinity,
                              repeatType: "reverse",
                              duration: 1.5,
                            },
                          }
                        : isCompleted
                        ? {
                            scale: { duration: 0.2 },
                            textShadow: { duration: 0.3 },
                          }
                        : { duration: 0.3 }
                    }
                  >
                    {word}{" "}
                  </motion.span>
                );
              })}
            </motion.div>
          </>
        )}

        {!showGenerateButton && (
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onFocus={startTest}
              className={`w-full p-2 border rounded ${
                darkMode
                  ? "bg-gray-700 text-white focus:ring-blue-500"
                  : "bg-white text-gray-800 focus:ring-indigo-500"
              } focus:outline-none focus:ring-2`}
              placeholder="Click here to start typing..."
              disabled={isTestActive && testCompleted}
            />
          </motion.div>
        )}

        {showGenerateButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Test Completed!
            </h3>

            <div
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } shadow-md`}
              >
                <h4 className="text-lg font-semibold mb-1">WPM</h4>
                <p className="text-3xl font-bold text-green-500">
                  {calculateWPM(
                    JSON.parse(localStorage.getItem("testResults")).wordsTyped,
                    30
                  )}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } shadow-md`}
              >
                <h4 className="text-lg font-semibold mb-1">Accuracy</h4>
                <p className="text-3xl font-bold text-blue-500">
                  {formatAccuracy(
                    JSON.parse(localStorage.getItem("testResults")).accuracy
                  )}
                  %
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-white"
                } shadow-md`}
              >
                <h4 className="text-lg font-semibold mb-1">Time</h4>
                <p className="text-3xl font-bold text-purple-500">30s</p>
              </div>
            </div>

            <div
              className={`mb-6 p-4 rounded-lg ${
                darkMode ? "bg-gray-700" : "bg-white"
              } shadow-md text-left`}
            >
              <h4
                className={`text-lg font-semibold mb-3 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Detailed Results
              </h4>
              <div className="space-y-2">
                {(() => {
                  const results = JSON.parse(
                    localStorage.getItem("testResults")
                  );
                  return (
                    <>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        <span className="font-medium">Words Typed:</span>{" "}
                        {results.wordsTyped} words
                      </p>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        <span className="font-medium">Average Speed:</span>{" "}
                        {calculateWPM(results.wordsTyped, 30)} words per minute
                      </p>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        <span className="font-medium">Accuracy Rate:</span>{" "}
                        {formatAccuracy(results.accuracy)}% correct
                      </p>
                      <p
                        className={darkMode ? "text-gray-300" : "text-gray-600"}
                      >
                        <span className="font-medium">Test Duration:</span> 30
                        seconds
                      </p>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="space-x-4">
              <button
                onClick={generateCertificate}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-semibold"
                disabled={certificateGenerated}
              >
                {certificateGenerated
                  ? "Certificate Generated"
                  : "Generate Certificate"}
              </button>
              <button
                onClick={resetTest}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 font-semibold"
              >
                Retake Test
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TypingTest;
