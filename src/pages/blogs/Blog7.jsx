import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaKeyboard,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaFileAlt,
  FaLock,
  FaBook,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../contexts/AuthContext";
import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import BlogInterlink from "../../components/BlogInterlink.jsx";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Lazy load html2pdf
const loadHtml2PDF = () => import("html2pdf.js");

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try refreshing the page.</h1>;
    }
    return this.props.children;
  }
}

const CBSE2025TypingBlog = () => {
  const { currentUser } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);
  const [isVisible, setIsVisible] = useState({});
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const sectionRefs = {
    hero: useRef(null),
    announcement: useRef(null),
    typingTest: useRef(null),
    evaluation: useRef(null),
    tips: useRef(null),
    quiz: useRef(null),
    countdown: useRef(null),
    success: useRef(null),
    faqs: useRef(null),
    resources: useRef(null),
  };

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };
    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  // Progress Tracker
  useEffect(() => {
    const calculateProgress = () => {
      const totalSections = Object.keys(sectionRefs).length;
      const visibleSections = Object.values(isVisible).filter(Boolean).length;
      setProgress((visibleSections / totalSections) * 100);
    };
    calculateProgress();
  }, [isVisible]);

  // Countdown Timer to July 3, 2025
  useEffect(() => {
    const targetDate = new Date("2025-07-03T00:00:00");
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        setTimeLeft({ days, hours });
      } else {
        setTimeLeft({ days: 0, hours: 0 });
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const tips = [
    {
      title: "Daily Typing Practice",
      content:
        "Spend 15-20 minutes daily on TypeSprint to achieve 35 WPM in English or 30 WPM in Hindi with 95%+ accuracy.",
    },
    {
      title: "Simulate Exam Conditions",
      content:
        "Practice in a quiet, timed environment to mirror the CBSE typing test’s 10-minute setup.",
    },
    {
      title: "Master Hindi Fonts",
      content:
        "Use Mangal or Krutidev fonts on TypeSprint to ensure zero font-related errors in the Hindi test.",
    },
    {
      title: "Leverage AI Feedback",
      content:
        "TypeSprint’s AI analyzes speed, accuracy, and errors to help you meet CBSE’s 35/30 WPM standards.",
    },
    {
      title: "Prepare for Tier-2 CBT",
      content:
        "Study the CBT syllabus and take mock tests on TypeSprint to excel in the Superintendent Tier-2 exam.",
    },
  ];

  const faqs = [
    {
      question:
        "What is the typing speed requirement for CBSE Junior Assistant?",
      answer:
        "You need 35 WPM in English (10,500 KDPH) or 30 WPM in Hindi (9,000 KDPH) over 10 minutes. Failing this disqualifies you.",
    },
    {
      question: "When is the CBSE Superintendent Tier-2 exam?",
      answer:
        "It’s scheduled for July 5, 2025, in Delhi. Admit cards will be available two days prior with exam details.",
    },
    {
      question: "How are typing test errors calculated?",
      answer:
        "Gross WPM = Total Words / Time; Net WPM = Correct Words / Time; Accuracy = (Net WPM * 100) / Gross WPM. E.g., 390 words with 2 errors in 10 minutes = 38.8 WPM, 99.49% accuracy.",
    },
    {
      question: "Who can claim travel reimbursement?",
      answer:
        "Candidates who took Tier-1 on April 20, 2025, outside Delhi, Noida, Faridabad, Gurugram, or Ghaziabad can claim Sleeper Class train fare with tickets and a cancelled cheque.",
    },
    {
      question: "What accommodations are available for PwBD candidates?",
      answer:
        "PwBD candidates may get exemptions or extra time with a medical certificate, subject to verification. Contact CBSE for details.",
    },
    {
      question: "How does TypeSprint prepare you for CBSE tests?",
      answer:
        "TypeSprint offers free practice tests, AI feedback, Hindi font support, and mock CBTs to meet CBSE’s typing and Tier-2 requirements.",
    },
  ];

  const quizQuestions = [
    {
      question: "What is the minimum English typing speed for CBSE JA?",
      options: ["25 WPM", "30 WPM", "35 WPM", "40 WPM"],
      correct: 2,
    },
    {
      question: "When is the CBSE JA typing test scheduled?",
      options: [
        "July 1-2, 2025",
        "July 3-5, 2025",
        "July 6-8, 2025",
        "July 10-12, 2025",
      ],
      correct: 1,
    },
    {
      question: "Which font is used for Hindi typing?",
      options: ["Arial", "Times New Roman", "Mangal", "Calibri"],
      correct: 2,
    },
  ];

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) score++;
    });
    setQuizResult({ score, total: quizQuestions.length });
  };

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  const handleStartTest = () => navigate("/typing-test?exam=cbse-ja");
  const handleLogin = () =>
    navigate("/login", { state: { from: location.pathname } });

  const handleSaveAsPDF = async () => {
    if (!contentRef.current) return;
    window.scrollTo(0, 0);
    const html2pdf = (await loadHtml2PDF()).default;
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: "CBSE-Recruitment-2025-Typing-Guide.pdf",
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 1, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .catch((err) => console.error("PDF error:", err));
  };

  const shareUrl =
    "https://typesprint.live/blogs/cbse-recruitment-2025-tier2-typing-test-guide";
  const shareTitle = "Ace CBSE 2025 Typing & Tier-2 Tests with TypeSprint!";

  // Chart data for typing speed progress
  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "English WPM",
        data: [25, 28, 32, 35],
        backgroundColor: "rgba(34, 211, 238, 0.6)",
        borderColor: "rgba(34, 211, 238, 1)",
        borderWidth: 1,
      },
      {
        label: "Hindi WPM",
        data: [20, 24, 27, 30],
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Words Per Minute (WPM)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Practice Time",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Typing Speed Progress Over 4 Weeks",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <ErrorBoundary>
      <div
        ref={contentRef}
        className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-x-hidden"
      >
        <Helmet>
          <title>
            CBSE Recruitment 2025: Ultimate Tier-2 & Typing Test Guide |
            TypeSprint
          </title>
          <meta
            name="description"
            content="Master CBSE Recruitment 2025 Tier-2 exam (July 5) and Junior Assistant typing test (July 3-5) with TypeSprint’s free practice, error calculations, quiz, and expert tips."
          />
          <meta
            name="keywords"
            content="CBSE Recruitment 2025, CBSE Junior Assistant typing test, CBSE Superintendent Tier-2, CBSE typing test preparation, Hindi typing test, English typing test, CBSE exam guide 2025, typing test error calculation, TypeSprint"
          />
          <meta name="author" content="Rahul Kumar" />
          <meta name="robots" content="index, follow" />
          <link
            rel="canonical"
            href="https://typesprint.live/blogs/cbse-recruitment-2025-tier2-typing-test-guide"
          />
          <meta
            property="og:title"
            content="CBSE Recruitment 2025: Ultimate Tier-2 & Typing Test Guide | TypeSprint"
          />
          <meta
            property="og:description"
            content="Master CBSE 2025 Tier-2 exam and Junior Assistant typing test with TypeSprint’s free practice, error calculations, quiz, and expert tips."
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/cbse-2025-typing-hero.webp"
            fallback="https://typesprint.live/images/default-og-image.webp"
          />
          <meta
            property="og:url"
            content="https://typesprint.live/blogs/cbse-recruitment-2025-tier2-typing-test-guide"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline:
                "CBSE Recruitment 2025: Ultimate Tier-2 & Typing Test Guide",
              description:
                "Master CBSE Recruitment 2025 Tier-2 exam (July 5) and Junior Assistant typing test (July 3-5) with TypeSprint’s free practice, error calculations, quiz, and expert tips.",
              author: { "@type": "Person", name: "Rahul Kumar" },
              publisher: {
                "@type": "Organization",
                name: "TypeSprint",
                logo: {
                  "@type": "ImageObject",
                  url: "https://typesprint.live/images/logo.png",
                },
              },
              datePublished: "2025-06-20",
              dateModified: "2025-06-20",
              image:
                "https://typesprint.live/images/cbse-2025-typing-hero.webp",
              url: "https://typesprint.live/blogs/cbse-recruitment-2025-tier2-typing-test-guide",
              mainEntityOfPage: {
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
              },
            })}
          </script>
          <style>
            {`
              @media print {
                .no-print, .fixed { display: none !important; }
                body, html { background: #fff !important; color: #000 !important; font-family: Arial, sans-serif !important; }
                .page-container { background: #fff !important; color: #000 !important; padding: 20px; min-height: auto !important; }
                .section { padding: 20px 0; margin: 0 auto; max-width: 800px; }
                .hero-section h1 { font-size: 36px; font-weight: 800; color: #000; margin-bottom: 16px; }
                .hero-section p { font-size: 18px; color: #333; margin-bottom: 16px; }
                .hero-section button { padding: 8px 16px; background: #000; color: #fff; border-radius: 8px; border: none; font-weight: 500; }
                .section h2 { font-size: 24px; font-weight: 700; color: #000; margin-bottom: 16px; text-align: center; }
                .card { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
                .card h3 { font-size: 18px; font-weight: 600; color: #000; margin-bottom: 8px; }
                .card p, .card li { font-size: 14px; color: #555; }
                .animate-pulse, .transition-all { animation: none !important; transition: none !important; }
              }
              details[open] summary::after { content: "−"; }
              details summary::after { content: "+"; }
              summary { display: flex; justify-content: space-between; align-items: center; }
            `}
          </style>
        </Helmet>

        {/* Progress Tracker */}
        <div className="fixed top-0 left-0 w-full h-2 bg-gray-800 z-30 no-print">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Hero Section */}
        <section
          id="hero"
          ref={sectionRefs.hero}
          className="relative z-10 py-20 md:py-32 flex flex-col items-center justify-center text-center px-4 section hero-section"
        >
          <div
            className={`transition-all duration-1000 ${
              isVisible.hero
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <FaKeyboard
              className="h-12 w-12 text-cyan-400 mb-6 animate-pulse"
              aria-label="Keyboard icon"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                CBSE Recruitment 2025: Ultimate Tier-2 & Typing Test Guide
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Ace the CBSE Superintendent Tier-2 exam (July 5, 2025) and Junior
              Assistant typing test (July 3-5, 2025) with TypeSprint’s free
              practice, interactive quiz, and expert strategies!
            </p>
            {currentUser ? (
              <button
                onClick={handleStartTest}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                aria-label="Start typing practice"
              >
                Start Typing Practice <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                aria-label="Log in to unlock guide"
              >
                Log In to Unlock Guide <FaArrowRight className="ml-2" />
              </button>
            )}
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEj55EqPnMozT5LWLJCSMKbisGwI9R0e_c7SK1MC8F-R7f_MFqcAKVjF9ShV5yoOPLXrK7S-32SWLL_13rXB-gAz-5-Z8-Pzlh-aDTo7axx1Oh5DQgDlxY_cFflxG2IClyQnMq6UznX25QbHuAGUJftVDTgXx6l1X2b4UuFVwST9hPAZkmsOh5JOrnvvjeE"
              alt="CBSE Recruitment 2025 Tier-2 and Typing Test Preparation"
              className="mt-6 max-w-full h-auto rounded-lg shadow-lg mx-auto"
              loading="lazy"
            />
          </div>
        </section>

        {/* Announcement Section */}
        <section
          id="announcement"
          ref={sectionRefs.announcement}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.announcement
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                CBSE Recruitment 2025: Key Updates
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The Central Board of Secondary Education (CBSE) has released the
                schedule for the Tier-2 exam for Superintendent and the Skill
                (Typing) Test for Junior Assistant posts, as per the
                notification dated December 31, 2024. Here’s what you need to
                know to prepare effectively.
              </p>
              <div className="space-y-6">
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Exam Schedule
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>Superintendent Tier-2 Exam</strong>: July 5, 2025,
                      in Delhi (Computer-Based Test).
                    </li>
                    <li>
                      <strong>Junior Assistant Typing Test</strong>: July 3-5,
                      2025, in Delhi (check candidate login for exact date).
                    </li>
                    <li>
                      <strong>Admit Cards</strong>: Available two days before
                      the exam with venue, time, and instructions.
                    </li>
                  </ul>
                </div>
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Travel Reimbursement
                  </h3>
                  <p className="text-gray-300">
                    Candidates who appeared for the Tier-1 exam on April 20,
                    2025, from cities outside Delhi, Noida, Faridabad, Gurugram,
                    or Ghaziabad can claim to-and-fro Sleeper Class (Non-AC)
                    train fare. Submit original train tickets and a cancelled
                    cheque during the Tier-2 or typing test for direct bank
                    transfer.
                  </p>
                </div>
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Why Prepare Now?
                  </h3>
                  <p className="text-gray-300">
                    With less than a month until the tests, starting preparation
                    now ensures you meet the stringent typing speed requirements
                    and excel in the Tier-2 CBT. TypeSprint’s free tools can
                    help you achieve your goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typing Test Section */}
        <section
          id="typingTest"
          ref={sectionRefs.typingTest}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.typingTest
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Master the CBSE Junior Assistant Typing Test
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The CBSE Junior Assistant typing test demands a minimum speed of{" "}
                <strong>35 WPM in English (10,500 KDPH)</strong> or{" "}
                <strong>30 WPM in Hindi (9,000 KDPH)</strong> over 10 minutes on
                a computer. Candidates who don’t meet these standards are
                disqualified, making preparation critical.
              </p>
              {currentUser ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {[
                      {
                        icon: FaKeyboard,
                        title: "Speed Requirements",
                        desc: "35 WPM English or 30 WPM Hindi for 10 minutes.",
                      },
                      {
                        icon: FaClock,
                        title: "Test Duration",
                        desc: "10-minute test with no editing tools (e.g., Backspace).",
                      },
                      {
                        icon: FaCheckCircle,
                        title: "Font & Setup",
                        desc: "Hindi uses Mangal/Krutidev; computer-based with preset margins.",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all"
                      >
                        <div className="flex justify-center mb-4">
                          <item.icon
                            className="h-12 w-12 text-cyan-400"
                            aria-hidden="true"
                          />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-300">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    How to Prepare
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>
                      Practice 300-400 word passages on TypeSprint to meet speed
                      requirements.
                    </li>
                    <li>
                      Use Mangal/Krutidev fonts for Hindi to avoid formatting
                      errors.
                    </li>
                    <li>
                      Train in strict mode (no Backspace) to simulate CBSE
                      conditions.
                    </li>
                    <li>
                      Track progress with TypeSprint’s AI feedback to minimize
                      errors.
                    </li>
                    <li>
                      Take daily 10-minute tests to build stamina and accuracy.
                    </li>
                  </ul>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Sample Passage
                  </h3>
                  <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                    <p className="text-gray-300 font-mono">
                      The Central Board of Secondary Education (CBSE) is
                      committed to promoting excellence in education across
                      India…
                    </p>
                    <button
                      onClick={handleStartTest}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
                      aria-label="Practice this passage"
                    >
                      Practice This Passage
                    </button>
                  </div>
                  <button
                    onClick={handleStartTest}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Start free practice"
                  >
                    Start Free Practice <FaArrowRight className="ml-2" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <FaLock
                    className="h-12 w-12 text-cyan-400 mx-auto mb-4"
                    aria-label="Lock icon"
                  />
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Unlock the Full CBSE Typing Guide
                  </h3>
                  <p className="text-lg text-gray-300 mb-6">
                    Sign in to TypeSprint to access preparation tips, sample
                    passages, practice tests, and more. Join thousands of CBSE
                    aspirants for free!
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to continue"
                  >
                    Log In to Continue <FaArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Evaluation Criteria Section */}
        <section
          id="evaluation"
          ref={sectionRefs.evaluation}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.evaluation
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Understanding Typing Test Evaluation
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The CBSE typing test uses Unrestricted mode to evaluate
                performance. Here’s how your speed and accuracy are calculated,
                along with real-world examples to guide your preparation.
              </p>
              {currentUser ? (
                <>
                  <div className="space-y-6">
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Evaluation Metrics
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          <strong>Gross Words per Minute (GWPM)</strong>: Total
                          Words / Time.
                        </li>
                        <li>
                          <strong>Net Words per Minute (NWPM)</strong>: Correct
                          Words / Time.
                        </li>
                        <li>
                          <strong>Accuracy</strong>: (NWPM * 100) / GWPM.
                        </li>
                        <li>
                          <strong>Key Depressions per Hour (KDPH)</strong>:
                          10,500 (English) or 9,000 (Hindi) required.
                        </li>
                      </ul>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Sample Calculations
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          <strong>Candidate A</strong>: 390 words (388 correct,
                          2 errors) in 10 min. GWPM = 39, NWPM = 38.8, Accuracy
                          = 99.49%. <strong>Pass</strong>.
                        </li>
                        <li>
                          <strong>Candidate B</strong>: 447 words (all correct)
                          in 10 min. GWPM = 44.7, NWPM = 44.7, Accuracy = 100%.{" "}
                          <strong>Pass</strong>.
                        </li>
                        <li>
                          <strong>Candidate C</strong>: 316 words (all correct)
                          in 10 min. GWPM = 31.6, NWPM = 31.6, Accuracy = 100%.{" "}
                          <strong>Fail</strong> (below 35 WPM).
                        </li>
                        <li>
                          <strong>Candidate D</strong>: 521 words (401 correct,
                          120 errors) in 10 min. GWPM = 52.1, NWPM = 40.1,
                          Accuracy = 76.96%. <strong>Pass</strong>.
                        </li>
                        <li>
                          <strong>Candidate E</strong>: 350 words (340 correct,
                          10 errors) in 10 min. GWPM = 35, NWPM = 34, Accuracy =
                          97.14%. <strong>Fail</strong> (below 35 WPM).
                        </li>
                      </ul>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Common Mistakes
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          Typing too fast, leading to high error rates (e.g.,
                          Candidate D).
                        </li>
                        <li>
                          Using incorrect fonts for Hindi, causing formatting
                          issues.
                        </li>
                        <li>
                          Ignoring the 5-minute trial session to test the
                          keyboard.
                        </li>
                        <li>
                          Not practicing in no-editing mode, leading to reliance
                          on Backspace.
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Chart: Typing Speed Progress */}
                  <h3 className="text-2xl font-semibold text-white mt-8 mb-4 text-center">
                    Track Your Typing Speed Progress
                  </h3>
                  <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="h-64">
                      <Bar data={chartData} options={chartOptions} />
                    </div>
                  </div>
                  <p className="text-gray-300 text-center mt-6">
                    Use TypeSprint’s AI feedback to achieve 35 WPM (English) or
                    30 WPM (Hindi) with high accuracy!
                  </p>
                  <button
                    onClick={handleStartTest}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Practice with feedback"
                  >
                    Practice with Feedback <FaArrowRight className="ml-2" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to view detailed evaluation criteria and sample
                    calculations.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to continue"
                  >
                    Log In to Continue <FaArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tips Carousel Section */}
        <section
          id="tips"
          ref={sectionRefs.tips}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.tips
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Top Preparation Tips for CBSE 2025
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Boost your performance with these actionable strategies.
              </p>
              <div className="relative">
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {tips[currentTip].title}
                  </h3>
                  <p className="text-gray-300">{tips[currentTip].content}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={prevTip}
                    className="px-4 py-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all"
                    aria-label="Previous tip"
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={nextTip}
                    className="px-4 py-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all"
                    aria-label="Next tip"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Quiz Section */}
        <section
          id="quiz"
          ref={sectionRefs.quiz}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.quiz
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Test Your CBSE Knowledge
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Test your understanding of the CBSE typing test and Tier-2 exam
                with this quick 3-question quiz!
              </p>
              {currentUser ? (
                <>
                  <div className="space-y-6">
                    {quizQuestions.map((q, i) => (
                      <div
                        key={i}
                        className="card bg-gray-800 rounded-lg p-6 border border-gray-700"
                      >
                        <h3 className="text-lg font-semibold text-white mb-4">
                          {q.question}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {q.options.map((option, optionIndex) => (
                            <label
                              key={optionIndex}
                              className="flex items-center cursor-pointer space-x-2"
                            >
                              <input
                                type="radio"
                                name={`q${i}`}
                                value={optionIndex}
                                checked={quizAnswers[i] === optionIndex}
                                onChange={() =>
                                  setQuizAnswers((prev) => ({
                                    ...prev,
                                    [i]: optionIndex,
                                  }))
                                }
                                className="w-5 h-5 text-cyan-500 focus:ring-cyan-400 border-gray-600"
                              />
                              <span className="text-gray-300">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleQuizSubmit}
                      className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 mx-auto block"
                      aria-label="Submit quiz"
                    >
                      Submit Quiz
                    </button>
                    {quizResult && (
                      <div className="mt-6 text-center">
                        <p className="text-lg font-semibold text-white">
                          You scored {quizResult.score} out of{" "}
                          {quizResult.total}!
                        </p>
                        <p className="text-gray-300 mt-2">
                          {quizResult.score === quizResult.total
                            ? "Amazing! You’re ready to ace the CBSE tests!"
                            : "Good effort! Practice more to master the CBSE requirements."}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to take the interactive quiz and test your CBSE
                    knowledge!
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to take quiz"
                  >
                    Log In to Take Quiz <FaArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Countdown Timer Section */}
        <section
          id="countdown"
          ref={sectionRefs.countdown}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.countdown
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Countdown to CBSE Tests
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                The CBSE Junior Assistant typing test starts on July 3, 2025,
                and the Superintendent Tier-2 exam is on July 5, 2025. Start
                preparing now!
              </p>
              {timeLeft && (
                <div className="flex justify-center gap-6">
                  <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                    <h3 className="text-4xl font-bold text-cyan-400">
                      {timeLeft.days}
                    </h3>
                    <p className="text-gray-300">Days</p>
                  </div>
                  <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                    <h3 className="text-4xl font-bold text-cyan-400">
                      {timeLeft.hours}
                    </h3>
                    <p className="text-gray-300">Hours</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleStartTest}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                aria-label="Practice now"
              >
                Practice Now <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section
          id="success"
          ref={sectionRefs.success}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.success
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Success Stories from TypeSprint Users
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Hear from CBSE aspirants who aced their tests with TypeSprint!
              </p>
              {currentUser ? (
                <>
                  <div className="space-y-6">
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Ankit’s Typing Triumph
                      </h3>
                      <p className="text-gray-300">
                        “I went from 28 WPM to 37 WPM in three weeks with
                        TypeSprint’s AI feedback. I passed the CBSE Junior
                        Assistant typing test with confidence!”
                      </p>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Neha’s Tier-2 Success
                      </h3>
                      <p className="text-gray-300">
                        “TypeSprint’s mock CBT tests helped me score high in the
                        Superintendent Tier-2 exam. The tips were spot-on!”
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleStartTest}
                    className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Start your success story"
                  >
                    Start Your Success Story <FaArrowRight className="ml-2" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to read inspiring success stories from CBSE
                    aspirants.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to continue"
                  >
                    Log In to Continue <FaArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faqs"
          ref={sectionRefs.faqs}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.faqs
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Clear your doubts about the CBSE 2025 tests with our expert
                answers.
              </p>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="card bg-gray-800 rounded-lg p-6 border border-gray-700"
                    id={`faq-${index}`}
                  >
                    <summary
                      className="text-lg font-semibold text-white cursor-pointer"
                      aria-controls={`faq-content-${index}`}
                    >
                      {faq.question}
                    </summary>
                    <div
                      id={`faq-content-${index}`}
                      className="text-gray-300 mt-2"
                    >
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section
          id="resources"
          ref={sectionRefs.resources}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.resources
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Free CBSE Resources
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Download exclusive resources to enhance your CBSE preparation.
              </p>
              {currentUser ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        CBSE JA Typing Practice Passages
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Get 10 exam-like passages (English & Hindi) to practice
                        typing at 35/30 WPM.
                      </p>
                      <button
                        onClick={() => navigate("/download/cbse-ja-passages")}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center mx-auto"
                        aria-label="Download passages"
                      >
                        Download Passages <FaBook className="ml-2" />
                      </button>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Tier-2 CBT Study Guide
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Download a guide with CBT syllabus tips and sample
                        questions for Superintendent Tier-2.
                      </p>
                      <button
                        onClick={() => navigate("/download/cbse-tier2-guide")}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center mx-auto"
                        aria-label="Download guide"
                      >
                        Download Guide <FaBook className="ml-2" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to access free downloadable resources for CBSE 2025.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to download"
                  >
                    Log In to Download <FaArrowRight className="ml-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Social Sharing Section */}
        <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60 section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Share This Guide
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Help other CBSE aspirants by sharing this guide on social media!
            </p>
            <div className="flex justify-center gap-4">
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <FaWhatsapp
                  className="h-8 w-8 text-green-500 hover:text-green-400"
                  aria-label="Share on WhatsApp"
                />
              </WhatsappShareButton>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <FaTwitter
                  className="h-8 w-8 text-blue-400 hover:text-blue-300"
                  aria-label="Share on Twitter"
                />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} title={shareTitle}>
                <FaLinkedin
                  className="h-8 w-8 text-blue-600 hover:text-blue-500"
                  aria-label="Share on LinkedIn"
                />
              </LinkedinShareButton>
              <button
                onClick={handleSaveAsPDF}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-all"
                aria-label="Download as PDF"
              >
                <FaFileAlt className="h-8 w-8 text-blue-500 hover:text-blue-400" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60 section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {currentUser ? (
              <>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Keep Going, {currentUser?.name || "Champion"}!
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  You’re on your way to mastering CBSE 2025. Practice daily with
                  TypeSprint!
                </p>
                <button
                  onClick={handleStartTest}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                  aria-label="Continue practice"
                >
                  Continue Practice <FaArrowRight className="ml-2" />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Join Our CBSE Prep Community
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Sign up for TypeSprint to access free practice tests, guides,
                  and join thousands preparing for CBSE 2025!
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                  aria-label="Sign up free"
                >
                  Sign Up Free <FaArrowRight className="ml-2" />
                </button>
              </>
            )}
          </div>
        </section>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-4 sm:px-6 z-20 no-print">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-lg font-medium text-center sm:text-left">
              Ready to ace the CBSE 2025 typing test? Practice free now!
            </p>
            <button
              onClick={handleStartTest}
              className="px-6 py-2 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-all flex items-center"
              aria-label="Start test"
            >
              Start Test <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
        <BlogInterlink currentSlug="cbse-recruitment-2025-tier2-typing-test-guide" />
      </div>
    </ErrorBoundary>
  );
};

export default CBSE2025TypingBlog;
