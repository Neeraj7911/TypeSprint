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
  Legend
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

const CBSEJuniorAssistantTypingBlog = () => {
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
      observerOptions
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

  // Countdown Timer to July 5, 2025
  useEffect(() => {
    const targetDate = new Date("2025-07-05T00:00:00");
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
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
        "Spend 10-15 minutes daily on TypeSprint to achieve 35 WPM (English) or 30 WPM (Hindi) with high accuracy for the CBSE Junior Assistant typing test.",
    },
    {
      title: "Simulate Exam Conditions",
      content:
        "Practice in a timed 10-minute environment to prepare for the CBSE typing test on July 5, 2025.",
    },
    {
      title: "Master QWERTY Layout",
      content:
        "Use ASDF and JKL; positions to type efficiently and minimize errors on a standard QWERTY keyboard.",
    },
    {
      title: "Leverage AI Feedback",
      content:
        "TypeSprint’s AI analyzes speed, accuracy, and errors to help you meet CBSE’s standards.",
    },
    {
      title: "Warm Up Before Tests",
      content:
        "Do finger warm-up exercises to boost speed and reduce errors during practice.",
    },
  ];

  const faqs = [
    {
      question: "When is the CBSE Junior Assistant Typing Test 2025?",
      answer:
        "The typing test is scheduled for July 5, 2025, as per CBSE’s official instructions.",
    },
    {
      question: "What are the CBSE Junior Assistant typing test requirements?",
      answer:
        "You need 35 WPM (English) or 30 WPM (Hindi), equivalent to 10500/9000 KDPH, with high accuracy over 10 minutes on a computer.",
    },
    {
      question: "Can I use backspace during the CBSE typing test?",
      answer:
        "Yes, backspace is allowed to correct mistakes, but excessive corrections may reduce your speed.",
    },
    {
      question: "What items are prohibited during the test?",
      answer:
        "Books, notes, electronic devices, and other materials are strictly prohibited to avoid unfair means.",
    },
    {
      question: "How should I prepare for the CBSE typing test?",
      answer:
        "Practice daily with TypeSprint’s free timed tests, focusing on accuracy and simulating test conditions to achieve 35 WPM (English) or 30 WPM (Hindi).",
    },
  ];

  const quizQuestions = [
    {
      question:
        "What is the minimum English typing speed for CBSE Junior Assistant 2025?",
      options: ["25 WPM", "30 WPM", "35 WPM", "40 WPM"],
      correct: 2,
    },
    {
      question: "When is the CBSE Junior Assistant Typing Test scheduled?",
      options: [
        "July 2, 2025",
        "July 5, 2025",
        "July 7, 2025",
        "July 10, 2025",
      ],
      correct: 1,
    },
    {
      question: "What is the duration of the CBSE typing test?",
      options: ["5 minutes", "10 minutes", "15 minutes", "20 minutes"],
      correct: 1,
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

  const handleStartTest = () =>
    navigate("/typing-test?exam=cbse-junior-assistant");
  const handleLogin = () =>
    navigate("/login", { state: { from: location.pathname } });

  const handleSaveAsPDF = async () => {
    if (!contentRef.current) return;
    window.scrollTo(0, 0);
    const html2pdf = (await loadHtml2PDF()).default;
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: "CBSE-Junior-Assistant-2025-Typing-Guide.pdf",
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
    "https://typesprint.live/blogs/cbse-junior-assistant-2025-typing-guide";
  const shareTitle =
    "Ace CBSE Junior Assistant 2025 Typing Test with TypeSprint’s Free Guide!";

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
        title: { display: true, text: "Words Per Minute (WPM)" },
      },
      x: {
        title: { display: true, text: "Practice Time" },
      },
    },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Typing Speed Progress Over 4 Weeks" },
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
            CBSE Junior Assistant Typing Test 2025: Free Guide for July 5 Exam |
            TypeSprint
          </title>
          <meta
            name="description"
            content="Prepare for the CBSE Junior Assistant Typing Test on July 5, 2025, with TypeSprint’s free guide, practice tests, interactive quiz, and expert tips to achieve 35 WPM (English) or 30 WPM (Hindi)."
          />
          <meta
            name="keywords"
            content="CBSE Junior Assistant typing test 2025, CBSE typing test guide, free typing practice, TypeSprint, Junior Assistant exam, typing speed test, July 5 2025"
          />
          <meta name="author" content="TypeSprint Team" />
          <meta name="robots" content="index, follow" />
          <link
            rel="canonical"
            href="https://typesprint.live/blogs/cbse-junior-assistant-2025-typing-guide"
          />
          <meta
            property="og:title"
            content="CBSE Junior Assistant Typing Test 2025: Free Guide for July 5 Exam | TypeSprint"
          />
          <meta
            property="og:description"
            content="Ace the CBSE Junior Assistant Typing Test on July 5, 2025, with TypeSprint’s free guide, practice tests, quiz, and expert tips."
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/cbse-junior-assistant-2025-typing-guide.webp"
            fallback="https://typesprint.live/images/default-og-image.webp"
          />
          <meta
            property="og:url"
            content="https://typesprint.live/blogs/cbse-junior-assistant-2025-typing-guide"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline:
                "CBSE Junior Assistant Typing Test 2025: Free Guide for July 5 Exam",
              description:
                "Prepare for the CBSE abordJunior Assistant Typing Test on July 5, 2025, with TypeSprint’s free guide, practice tests, quiz, and expert tips to achieve 35 WPM (English) or 30 WPM (Hindi).",
              author: { "@type": "Organization", name: "TypeSprint Team" },
              publisher: {
                "@type": "Organization",
                name: "TypeSprint",
                logo: {
                  "@type": "ImageObject",
                  url: "https://typesprint.live/images/logo.png",
                },
              },
              datePublished: "2025-07-03",
              dateModified: "2025-07-03",
              image:
                "https://typesprint.live/images/cbse-junior-assistant-2025-typing-guide.webp",
              url: "https://typesprint.live/blogs/cbse-junior-assistant-2025-typing-guide",
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
              alt="Keyboard icon"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                CBSE Junior Assistant Typing Test 2025: Ultimate Guide for July
                5
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Ace the CBSE Junior Assistant Typing Test on July 5, 2025, with
              TypeSprint’s free guide, practice tests, quiz, and expert tips!
              Start typing now to secure your success!
            </p>
            {currentUser ? (
              <button
                onClick={handleStartTest}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                aria-label="Start typing practice"
              >
                Start Typing Now! <FaArrowRight className="ml-2" />
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
              src="https://typesprint.live/images/cbse-junior-assistant-2025-typing-hero.webp"
              alt="CBSE Junior Assistant Typing Test 2025 Preparation"
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
                CBSE Junior Assistant Typing Test 2025: Key Updates
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The Central Board of Secondary Education (CBSE) has announced
                the Junior Assistant typing test for July 5, 2025. Here’s
                everything you need to know to prepare.
              </p>
              <div className="space-y-6">
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Exam Details
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>Test Date</strong>: July 5, 2025
                    </li>
                    <li>
                      <strong>Duration</strong>: 10 minutes
                    </li>
                    <li>
                      <strong>Requirements</strong>: 35 WPM (English) or 30 WPM
                      (Hindi), 10500/9000 KDPH
                    </li>
                    <li>
                      <strong>Admit Card</strong>: Bring admit card with photo
                      ID (Aadhaar, Passport, etc.)
                    </li>
                  </ul>
                </div>
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Important Instructions
                  </h3>
                  <p className="text-gray-300">
                    No venue/date changes allowed. Arrive 10 minutes early.
                    Prohibited items include mobile phones, calculators, and
                    notes. Start practicing now with{" "}
                    <a
                      href="/typing-test"
                      className="text-cyan-400 hover:underline"
                    >
                      TypeSprint’s free timed tests
                    </a>{" "}
                    to meet CBSE’s standards.
                  </p>
                </div>
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Why Start Now?
                  </h3>
                  <p className="text-gray-300">
                    With the exam approaching, daily practice is key to
                    achieving 35 WPM (English) or 30 WPM (Hindi) with high
                    accuracy. TypeSprint’s tools will help you succeed!
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
                The CBSE Junior Assistant typing test requires{" "}
                <strong>35 WPM in English</strong> or{" "}
                <strong>30 WPM in Hindi</strong> (10500/9000 KDPH) with high
                accuracy over 10 minutes on a computer. Failing to meet these
                standards results in disqualification.
              </p>
              {currentUser ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {[
                      {
                        icon: FaKeyboard,
                        title: "Speed Requirements",
                        desc: "35 WPM (English) or 30 WPM (Hindi) with high accuracy.",
                        alt: "Keyboard icon",
                      },
                      {
                        icon: FaClock,
                        title: "Test Duration",
                        desc: "10-minute test with no auto-correct or spell-check.",
                        alt: "Clock icon",
                      },
                      {
                        icon: FaCheckCircle,
                        title: "Keyboard Setup",
                        desc: "Standard QWERTY keyboard in a computer-based test.",
                        alt: "Check circle icon",
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
                            alt={item.alt}
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
                      Train in a timed 10-minute environment to simulate exam
                      conditions.
                    </li>
                    <li>
                      Focus on minimizing full and half mistakes for high
                      accuracy.
                    </li>
                    <li>
                      Use TypeSprint’s AI feedback to track and improve speed
                      and accuracy.
                    </li>
                    <li>
                      Visit{" "}
                      <a
                        href="https://www.cbse.gov.in"
                        className="text-cyan-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        CBSE’s official website
                      </a>{" "}
                      for official updates.
                    </li>
                  </ul>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Sample Passage
                  </h3>
                  <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                    <p className="text-gray-300 font-mono">
                      The Central Board of Secondary Education (CBSE) oversees
                      school education and examinations across India. As a
                      Junior Assistant, your typing skills are critical for
                      administrative tasks. Practice this passage to prepare for
                      the July 5, 2025, typing test…
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
                    alt="Lock icon"
                  />
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Unlock the Full CBSE Junior Assistant Typing Guide
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
                Understanding CBSE Typing Test Evaluation
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The CBSE Junior Assistant typing test evaluates speed and
                accuracy. Here’s how your performance is calculated, with
                examples to guide your preparation.
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
                          <strong>Words Per Minute (WPM)</strong>: Total words
                          typed divided by 10 minutes.
                        </li>
                        <li>
                          <strong>Key Depressions Per Hour (KDPH)</strong>:
                          10500 (English) or 9000 (Hindi), where 1 word = 5 key
                          depressions.
                        </li>
                        <li>
                          <strong>Full Mistakes</strong>: Omission,
                          substitution, addition, spelling errors, or repetition
                          of words/figures.
                        </li>
                        <li>
                          <strong>Half Mistakes</strong>: Spacing,
                          capitalization, punctuation, transposition, or
                          paragraph errors.
                        </li>
                      </ul>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Sample Calculations
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          <strong>Candidate A</strong>: 350 words (340 correct,
                          10 full mistakes) in 10 min. WPM = 35, Accuracy =
                          97.14%. <strong>Pass</strong>.
                        </li>
                        <li>
                          <strong>Candidate B</strong>: 400 words (all correct)
                          in 10 min. WPM = 40, Accuracy = 100%.{" "}
                          <strong>Pass</strong>.
                        </li>
                        <li>
                          <strong>Candidate C</strong>: 300 words (all correct)
                          in 10 min. WPM = 30, Accuracy = 100%.{" "}
                          <strong>Fail</strong> (below 35 WPM English).
                        </li>
                        <li>
                          <strong>Candidate D</strong>: 380 words (300 correct,
                          80 errors) in 10 min. WPM = 38, Accuracy = 78.95%.{" "}
                          <strong>Fail</strong> (low accuracy).
                        </li>
                        <li>
                          <strong>Candidate E</strong>: 320 words (310 correct,
                          10 errors) in 10 min. WPM = 32, Accuracy = 96.88%.{" "}
                          <strong>Fail</strong> (below 35 WPM).
                        </li>
                      </ul>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Common Mistakes
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          Typing too fast, leading to spelling or spacing
                          errors.
                        </li>
                        <li>
                          Not using a QWERTY keyboard, causing unfamiliarity.
                        </li>
                        <li>
                          Skipping warm-up sessions, increasing initial errors.
                        </li>
                        <li>
                          Failing to practice under timed conditions, reducing
                          stamina.
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
                Top Preparation Tips for CBSE Junior Assistant 2025
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Boost your performance with these actionable strategies for the
                July 5, 2025, test.
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
                    <FaArrowLeft alt="Previous tip icon" />
                  </button>
                  <button
                    onClick={nextTip}
                    className="px-4 py-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all"
                    aria-label="Next tip"
                  >
                    <FaArrowRight alt="Next tip icon" />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 text-center mt-6">
                Read more tips in our{" "}
                <a
                  href="/blog/cbse-junior-assistant-prep-tips"
                  className="text-cyan-400 hover:underline"
                >
                  CBSE Junior Assistant Preparation Blog
                </a>
                .
              </p>
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
                Test Your CBSE Junior Assistant Knowledge
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Test your understanding of the CBSE typing test with this quick
                3-question quiz!
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
                            ? "Amazing! You’re ready to ace the CBSE Junior Assistant Typing Test!"
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
                    Junior Assistant knowledge!
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
                Countdown to CBSE Junior Assistant Typing Test
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                The CBSE Junior Assistant Typing Test is on July 5, 2025. Start
                practicing now to ace it!
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
                Hear from CBSE Junior Assistant aspirants who aced their typing
                test with TypeSprint!
              </p>
              {currentUser ? (
                <>
                  <div className="space-y-6">
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Anita’s Typing Success
                      </h3>
                      <p className="text-gray-300">
                        “I improved from 28 WPM to 37 WPM in four weeks with
                        TypeSprint’s timed tests. I passed the CBSE typing test
                        with confidence!”
                      </p>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Vikram’s Accuracy Boost
                      </h3>
                      <p className="text-gray-300">
                        “TypeSprint’s AI feedback helped me achieve 98%
                        accuracy, ensuring I met the CBSE requirements.”
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
                    Log in to read inspiring success stories from CBSE Junior
                    Assistant aspirants.
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
                Clear your doubts about the CBSE Junior Assistant Typing Test
                2025 with our expert answers.
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
                Free CBSE Junior Assistant Resources
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Download exclusive resources to enhance your CBSE Junior
                Assistant preparation.
              </p>
              {currentUser ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        CBSE Typing Practice Passages
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Get 10 exam-like passages (English & Hindi) to practice
                        typing at 35/30 WPM.
                      </p>
                      <button
                        onClick={() =>
                          navigate("/download/cbse-junior-assistant-passages")
                        }
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center mx-auto"
                        aria-label="Download passages"
                      >
                        Download Passages{" "}
                        <FaBook className="ml-2" alt="Book icon" />
                      </button>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        CBSE Typing Test Guide
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Download a guide with tips, sample passages, and
                        strategies for the July 5, 2025, test.
                      </p>
                      <button
                        onClick={() =>
                          navigate("/download/cbse-junior-assistant-guide")
                        }
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center mx-auto"
                        aria-label="Download guide"
                      >
                        Download Guide{" "}
                        <FaBook className="ml-2" alt="Book icon" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to access free downloadable resources for CBSE Junior
                    Assistant 2025.
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
              Help other CBSE Junior Assistant aspirants by sharing this guide
              on social media!
            </p>
            <div className="flex justify-center gap-4">
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <FaWhatsapp
                  className="h-8 w-8 text-green-500 hover:text-green-400"
                  aria-label="Share on WhatsApp"
                  alt="WhatsApp icon"
                />
              </WhatsappShareButton>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <FaTwitter
                  className="h-8 w-8 text-blue-400 hover:text-blue-300"
                  aria-label="Share on Twitter"
                  alt="Twitter icon"
                />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} title={shareTitle}>
                <FaLinkedin
                  className="h-8 w-8 text-blue-600 hover:text-blue-500"
                  aria-label="Share on LinkedIn"
                  alt="LinkedIn icon"
                />
              </LinkedinShareButton>
              <button
                onClick={handleSaveAsPDF}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-all"
                aria-label="Download as PDF"
              >
                <FaFileAlt
                  className="h-8 w-8 text-blue-500 hover:text-blue-400"
                  alt="PDF icon"
                />
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
                  You’re on your way to mastering the CBSE Junior Assistant
                  Typing Test. Practice daily with TypeSprint!
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
                  Join Our CBSE Junior Assistant Prep Community
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Sign up for TypeSprint to access free practice tests, guides,
                  and join thousands preparing for CBSE Junior Assistant 2025!
                </p>
                <button
                  onClick={() => navigate("/login")}
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
              Ready to ace the CBSE Junior Assistant Typing Test on July 5,
              2025? Start typing now!
            </p>
            <button
              onClick={handleStartTest}
              className="px-6 py-2 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-all flex items-center"
              aria-label="Start test"
            >
              Start Typing Now! <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
        <BlogInterlink currentSlug="cbse-superintendent-junior-assistant-recruitment-2025-english-typing-hindi-typing-rules" />
      </div>
    </ErrorBoundary>
  );
};

export default CBSEJuniorAssistantTypingBlog;
