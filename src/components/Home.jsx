import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  Suspense,
  lazy,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Tilt from "react-parallax-tilt";
import { FaChevronDown } from "react-icons/fa";

// Lazy-load heavy components
const CustomCursor = lazy(() => import("./CustomCursor"));
const TypingTest = lazy(() => import("./TypingTest"));
const ReportGenerator = lazy(() => import("./ReportGenerator"));
import FeatureCards from "./FeatureCards"; // Import the FeatureCards component
import AlertSystem from "./AlertSystem"; // Import the new AlertSystem component

import LogoSvg from "../assets/react.svg";
import clickSound from "../assets/click.mp3";

// Exam data
const exams = [
  { id: 1, name: "SSC", color: "from-blue-400 to-blue-600", icon: "📚" },
  { id: 2, name: "NTPC", color: "from-green-400 to-green-600", icon: "🚂" },
  { id: 3, name: "COURT", color: "from-yellow-400 to-yellow-600", icon: "🏦" },
  { id: 4, name: "RRB", color: "from-red-400 to-red-600", icon: "🚉" },
  { id: 5, name: "TYPIST", color: "from-purple-400 to-purple-600", icon: "⚖️" },
  { id: 6, name: "MUNICIPAL", color: "from-pink-400 to-pink-600", icon: "💼" },
];

// Premium plans data
const premiumPlans = [
  {
    name: "1 Month",
    price: "₹ 49",
    features: [
      "Access to all typing tests",
      "Progress tracking",
      "Basic analytics",
    ],
  },
  {
    name: "6 Months",
    price: "₹ 149",
    features: [
      "Everything in Basic",
      "Advanced analytics",
      "Personalized training plans",
      "Priority support",
    ],
  },
  {
    name: "1 Year",
    price: "₹ 199",
    features: [
      "Everything in Pro",
      "1-on-1 coaching sessions",
      "Exclusive webinars",
      "Guaranteed score improvement",
    ],
  },
];

// Skeleton components
const SkeletonCard = () => (
  <div className="bg-gray-800 bg-opacity-80 rounded-lg p-6 h-32 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
  </div>
);

const SkeletonTypingTest = () => (
  <div className="bg-gray-800 bg-opacity-80 rounded-lg p-8 h-64 animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
    <div className="h-32 bg-gray-700 rounded w-full"></div>
  </div>
);

function Home() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : true;
  });
  const [testResults, setTestResults] = useState(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef(null);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Sync dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [typingTestRef, typingTestInView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const toggleDarkMode = useCallback(
    () => setDarkMode((prevMode) => !prevMode),
    []
  );
  const handleTestComplete = useCallback((results) => {
    setTestResults(results);
    setShowDownloadButton(true);
    setShowPlans(false);
  }, []);
  const scrollToContent = useCallback(
    () => window.scrollTo({ top: window.innerHeight, behavior: "smooth" }),
    []
  );
  const playSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);
  const handleExamClick = useCallback(
    (examName) => navigate(`/exams?search=${encodeURIComponent(examName)}`),
    [navigate]
  );

  const examCards = useMemo(
    () =>
      exams.map((exam, index) => (
        <Tilt
          key={exam.id}
          tiltMaxAngleX={8}
          tiltMaxAngleY={8}
          perspective={1000}
          scale={1.02}
          transitionSpeed={500}
        >
          <motion.div
            className="rounded-lg shadow-lg overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`Select ${exam.name} exam`}
              onClick={() => handleExamClick(exam.name)}
              onKeyDown={(e) => e.key === "Enter" && handleExamClick(exam.name)}
              className={`block p-6 bg-gradient-to-br ${exam.color} hover:opacity-90 transition-opacity duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-400`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {exam.name}
                </h2>
                <span className="text-4xl">{exam.icon}</span>
              </div>
              <p className="text-white text-opacity-80">
                Master your skills now
              </p>
            </div>
          </motion.div>
        </Tilt>
      )),
    [inView, handleExamClick]
  );

  const premiumPlanCards = useMemo(
    () =>
      premiumPlans.map((plan, index) => (
        <motion.div
          key={plan.name}
          className="bg-gray-800 rounded-lg p-6 shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-4 text-white">{plan.name}</h3>
          <p className="text-3xl font-bold mb-6 text-green-400">
            {plan.price}/month
          </p>
          <ul className="text-white mb-6">
            {plan.features.map((feature, i) => (
              <li key={i} className="mb-2">
                ✓ {feature}
              </li>
            ))}
          </ul>
          <motion.button
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Choose ${plan.name} plan`}
          >
            Choose Plan
          </motion.button>
        </motion.div>
      )),
    []
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"
          : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"
      }`}
    >
      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>
      <div className="container mx-auto px-4 relative z-10">
        <section className="min-h-screen flex flex-col justify-center items-center py-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              onHoverStart={() => {
                setIsLogoHovered(true);
                playSound();
              }}
              onHoverEnd={() => setIsLogoHovered(false)}
            >
              <img
                src={LogoSvg}
                alt="TypeSprint Logo"
                className={`w-32 h-32 mx-auto transition-all duration-300 ${
                  isLogoHovered ? "scale-110 rotate-5" : ""
                } ${darkMode ? "text-white" : "text-gray-800"}`}
              />
              <audio ref={audioRef} src={clickSound} preload="auto" />
            </motion.div>
            <motion.h1
              style={{ WebkitTextStroke: "1px white", textStroke: "1px white" }}
              className="text-6xl md:text-8xl font-extrabold mb-8 relative z-10"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span
                className="typemaster-text inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500"
                data-text="Type"
                animate={{
                  textShadow: [
                    "0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff, 0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de",
                    "0 0 2px #fff, 0 0 3px #fff, 0 0 5px #fff, 0 0 8px #ff00de, 0 0 15px #ff00de, 0 0 25px #ff00de, 0 0 35px #ff00de",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3,
                }}
              >
                Type
              </motion.span>
              <motion.span
                className="typemaster-text inline-block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500"
                data-text="Sprint"
                animate={{
                  textShadow: [
                    "0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff, 0 0 10px #ff00de, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de",
                    "0 0 2px #fff, 0 0 3px #fff, 0 0 5px #fff, 0 0 8px #ff00de, 0 0 15px #ff00de, 0 0 25px #ff00de, 0 0 35px #ff00de",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3,
                }}
              >
                Sprint
              </motion.span>
            </motion.h1>
            <motion.p
              className={`text-2xl mb-12 font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Free online typing practice for <br />
              SSC CGL, CHSL, RRB, UPPSC RO/ARO, CSIR and other <br /> government
              typing exams <br /> with real test formats and instant feedback.
            </motion.p>
          </motion.div>
          <motion.div
            className="cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={scrollToContent}
            role="button"
            aria-label="Scroll to content"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && scrollToContent()}
          >
            <FaChevronDown
              className={`text-4xl ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            />
          </motion.div>
        </section>
        <section className="py-16">
          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {isLoading
              ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
              : examCards}
          </motion.div>
        </section>

        <section className="py-16">
          <motion.div
            ref={typingTestRef}
            initial={{ opacity: 0, y: 50 }}
            animate={typingTestInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={`text-4xl font-bold mb-8 text-center ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Take the TypeSprint Challenge
            </h2>
            <AnimatePresence>
              {!showDownloadButton && !showPlans && (
                <Suspense fallback={<SkeletonTypingTest />}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TypingTest
                      onTestComplete={handleTestComplete}
                      darkMode={darkMode}
                    />
                  </motion.div>
                </Suspense>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showDownloadButton && (
                <Suspense fallback={<SkeletonTypingTest />}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ReportGenerator
                      testResults={testResults}
                      darkMode={darkMode}
                    />
                  </motion.div>
                </Suspense>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        <AnimatePresence>
          {showPlans && (
            <section className="py-16">
              <motion.div
                className="p-8 rounded-lg overflow-hidden shadow-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-8 text-center text-white">
                  Upgrade Your Typing Skills with Our Premium Plans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {premiumPlanCards}
                </div>
              </motion.div>
            </section>
          )}
        </AnimatePresence>

        <AlertSystem darkMode={darkMode} isLoading={isLoading} />
      </div>
      <motion.button
        onClick={toggleDarkMode}
        className={`fixed bottom-4 right-4 p-3 rounded-full ${
          darkMode ? "bg-white text-gray-800" : "bg-gray-800 text-white"
        } transition-colors duration-300 hover:bg-opacity-80 z-50 focus:outline-none focus:ring-2 focus:ring-orange-400`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? "🌞" : "🌙"}
      </motion.button>
    </div>
  );
}

export default React.memo(Home);
