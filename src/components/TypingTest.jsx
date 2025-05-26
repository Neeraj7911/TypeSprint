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
    "A wizard briskly packed five dozen jugs of liquor into a Quartz box while nimble nymphs observed with great curiosity.",
    "Jumpy zebras dashed over thick vines as quick foxes vexed the Puzzled sphinx in a moonlit glade under the starry sky.",
    "The black quartz rock shimmered mysteriou_ly while five jocks played jazz tunes on an ancient golden jukebox near the bonfire.",
    "A dozen vexed dwarves juggled heavy boxes . filled with waxy Gems as a giant owl watched with wide eyes from the old tower.",
    "Bright sphinx statues guarded the wizard's tall tower while quiz.zical nymphs deciphered cryptic runes carved into the marble walls.",
    "Dizzy from the wizard's swirlinG spells,,,. quick foxes and jagged rocks whirled in a gusty, dazzling storm of golden dust.",
    "A vexed judge zipped his fuzzy jacket and flung twelve quartz stones into the buzzing vortex where nymphs and foxes twirled in rhythmic chaos.",
    "Jaded sphinxes with glowing glyphs guarded the waxy temple Gates while dwarves hauled jumbo crates through zigzag paths lined with quizzical runes and vines.",
    "Quickly jumping over broken fences, the jazzy lynx vexed two puzzled gnomes who clutched glowing orbs near a quartz obelisk under neon stars.",
    "Blazing with fury, the wizard juggled six fi_zy flasks while nyMphs danced on jagged ledges and a ghostly owl watched from the quartz spire above.",
    "Twelve dwarves boxed up waX staTues and zipped across icy floors while quivering foxes and jittery jackals mapped the cryptic glyphs on cave walls.",
    "Giant quartz wheels spun Wildly as quick ghouls and zany jesters wrestled in dusty fog under buzzing lights near a crumbling obsidian statue.",
    "Bright jackals juggled golden eggs near a fizzIng pool whilE vexed witches zapped quartz vines that wrapped around the crumbling marble stairway of fate.",
    "The wizard_s jukebox playeD ja_zy beats as nimble foxes and fuzzy dwarves decoded strange symbols etched deep into the cold quartz dungeon wall.",
    "With a flick of her wand,, the queen summoned twenty jaded jesters to juggle glyph-marked boxes across zigzagging bridges made of shimmering black quartz.",
    "Quick brown ghouls zipped across frozen fields while dwarves tossed glowing gems into a bronze firepit surrounded by jackals, foxes, and whispering sphinxes.",
  ];

  // Function to select a random pangram different from the last one
  const getRandomPangram = () => {
    const lastPangram = localStorage.getItem("lastPangram") || "";
    let newPangram;
    do {
      newPangram = pangrams[Math.floor(Math.random() * pangrams.length)];
    } while (newPangram === lastPangram && pangrams.length > 1);
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

    const newText = getRandomPangram();
    setText(newText);
    setWords(newText.split(" "));
  };

  const calculateAccuracy = (original, typed) => {
    const originalWords = original
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const typedWords = typed
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (typedWords.length === 0) return 0;

    let correctChars = 0;
    let totalChars = 0;

    for (let i = 0; i < typedWords.length; i++) {
      const typedWord = typedWords[i];
      const originalWord = originalWords[i] || "";

      for (
        let j = 0;
        j < Math.max(typedWord.length, originalWord.length);
        j++
      ) {
        if (j < typedWord.length && j < originalWord.length) {
          totalChars++;
          if (typedWord[j] === originalWord[j]) {
            correctChars++;
          }
        } else if (j < typedWord.length) {
          totalChars++;
        } else if (j < originalWord.length) {
          totalChars++;
        }
      }
    }

    return totalChars === 0 ? 0 : (correctChars / totalChars) * 100;
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

  // New handler to disable backspace and delete keys
  const handleKeyDown = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault(); // Prevent default behavior of backspace and delete
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

    const pdfDoc = new jsPDF();
    const pageWidth = pdfDoc.internal.pageSize.getWidth();
    const pageHeight = pdfDoc.internal.pageSize.getHeight();

    pdfDoc.setFontSize(24);
    pdfDoc.setTextColor(0, 102, 204);
    pdfDoc.text("Typing Certificate", pageWidth / 2, 20, { align: "center" });

    pdfDoc.addImage(Logo, "PNG", (pageWidth - 50) / 2, 30, 50, 50);

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

    pdfDoc.setFontSize(16);
    pdfDoc.text(`Email: ${user.email}`, 20, 150);
    pdfDoc.text(`Words Per Minute (WPM): ${wpm}`, 20, 160);
    pdfDoc.text(`Accuracy: ${accuracy}%`, 20, 170);
    pdfDoc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 180);
    pdfDoc.text(`Certificate Number: ${uniqueNumber}`, 20, 190);

    pdfDoc.addImage(Stamp, "PNG", pageWidth - 70, pageHeight - 70, 50, 50);

    pdfDoc.setFontSize(10);
    pdfDoc.setTextColor(100);
    pdfDoc.text(
      "Verify this certificate at: https://typesprint.live/verify",
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
                        : 1
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
              onKeyDown={handleKeyDown} // Added keydown handler
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
