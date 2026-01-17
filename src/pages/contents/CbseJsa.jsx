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
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed
import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";

// Lazy load html2pdf for performance
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);
  const [isVisible, setIsVisible] = useState({});
  const [currentTip, setCurrentTip] = useState(0);
  const sectionRefs = {
    hero: useRef(null),
    announcement: useRef(null),
    typingTest: useRef(null),
    evaluation: useRef(null),
    tips: useRef(null),
    faqs: useRef(null),
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

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

  const tips = [
    {
      title: "Daily Typing Practice",
      content:
        "Dedicate 15-20 minutes daily on TypeSprint to achieve 35 WPM in English or 30 WPM in Hindi with high accuracy for the CBSE Junior Assistant typing test.",
    },
    {
      title: "Simulate Test Conditions",
      content:
        "Practice in a distraction-free environment with a 10-minute timer to replicate the CBSE typing test setup and build confidence.",
    },
    {
      title: "Use Correct Hindi Fonts",
      content:
        "Familiarize yourself with Mangal or Krutidev fonts for Hindi typing to minimize errors during the CBSE JA test.",
    },
    {
      title: "Leverage AI Feedback",
      content:
        "Use TypeSprint’s AI-driven feedback to track speed, accuracy, and errors, ensuring you meet the 35 WPM (English) or 30 WPM (Hindi) requirement.",
    },
    {
      title: "Prepare for Tier-2 Exam",
      content:
        "Review CBT syllabus and practice mock tests on TypeSprint to excel in the Superintendent Tier-2 exam on July 5, 2025.",
    },
  ];

  const faqs = [
    {
      question:
        "What are the typing speed requirements for the CBSE Junior Assistant test?",
      answer:
        "The CBSE Junior Assistant typing test requires 35 WPM in English (10,500 KDPH) or 30 WPM in Hindi (9,000 KDPH) over 10 minutes. Candidates who don’t meet this speed are disqualified.",
    },
    {
      question: "When and where is the CBSE Tier-2 exam for Superintendent?",
      answer:
        "The Tier-2 exam for Superintendent is scheduled for July 5, 2025, in Delhi. Admit cards will be issued two days prior, detailing the exam date, time, and center.",
    },
    {
      question: "How are errors calculated in the CBSE typing test?",
      answer:
        "Errors are calculated using Gross Words per Minute (GWPM = Total Words / Time) and Net Words per Minute (NWPM = Correct Words / Time). Accuracy = (NWPM * 100) / GWPM. For example, 390 words with 2 errors in 10 minutes yields 38.8 WPM with 99.49% accuracy.",
    },
    {
      question: "Who is eligible for travel reimbursement?",
      answer:
        "Candidates who appeared for the Tier-1 exam on April 20, 2025, from locations outside Delhi, Noida, Faridabad, Gurugram, and Ghaziabad can claim to-and-fro Sleeper Class (Non-AC) train fare by submitting train tickets and a cancelled cheque during the Tier-2 or typing test.",
    },
    {
      question: "How can TypeSprint help with CBSE test preparation?",
      answer:
        "TypeSprint offers free online practice tests with real-time AI feedback on speed, accuracy, and errors, simulating CBSE typing test conditions to enhance your performance.",
    },
  ];

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
    "https://typesprint.live/blogs/cbse-recruitment-2025-tier2-typing-test";
  const shareTitle = "Ace the CBSE 2025 Typing & Tier-2 Tests with TypeSprint!";

  return (
    <ErrorBoundary>
      <div
        ref={contentRef}
        className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden page-container"
      >
        <Helmet>
          <title>
            CBSE Recruitment 2025: Tier-2 & Typing Test Guide | TypeSprint
          </title>
          <meta
            name="description"
            content="Prepare for CBSE Recruitment 2025 Tier-2 exam (July 5) and Junior Assistant typing test (July 3-5) with TypeSprint’s free practice, error calculation tips, and expert guide."
          />
          <meta
            name="keywords"
            content="CBSE Recruitment 2025, CBSE Junior Assistant typing test, CBSE Superintendent Tier-2, CBSE typing test preparation, Hindi typing test, English typing test, CBSE exam guide 2025, typing test error calculation, TypeSprint"
          />
          <meta name="author" content="Rahul Kumar" />
          <meta name="robots" content="index, follow" />
          <link
            rel="canonical"
            href="https://typesprint.live/cbse-recruitment-2025-tier2-typing-test"
          />
          <meta
            property="og:title"
            content="CBSE Recruitment 2025: Tier-2 & Typing Test Guide | TypeSprint"
          />
          <meta
            property="og:description"
            content="Master the CBSE 2025 Tier-2 exam and Junior Assistant typing test with TypeSprint’s free practice, error calculation tips, and expert guide."
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/cbse-2025-typing-hero.webp"
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
              headline: "CBSE Recruitment 2025: Tier-2 & Typing Test Guide",
              description:
                "Prepare for CBSE Recruitment 2025 Tier-2 exam (July 5) and Junior Assistant typing test (July 3-5) with TypeSprint’s free practice, error calculation tips, and expert guide.",
              author: {
                "@type": "Person",
                name: "Rahul Kumar",
              },
              publisher: {
                "@type": "Organization",
                name: "TypeSprint",
                logo: {
                  "@type": "ImageObject",
                  url: "https://typesprint.live/images/logo.png",
                },
              },
              datePublished: "2025-06-10",
              dateModified: "2025-06-10",
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
                .hero-section button, .preview-section button { padding: 8px 16px; background: #000; color: #fff; border-radius: 8px; border: none; font-weight: 500; }
                .section h2 { font-size: 24px; font-weight: 700; color: #000; margin-bottom: 16px; text-align: center; }
                .card { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
                .card h3 { font-size: 18px; font-weight: 600; color: #000; margin-bottom: 8px; }
                .card p, .card li { font-size: 14px; color: #555; }
                .animate-pulse, .transition-all { animation: none !important; transition: none !important; }
              }
            `}
          </style>
        </Helmet>

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
              aria-label="Keyboard icon for CBSE typing test"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                CBSE Recruitment 2025: Tier-2 & Typing Test Guide
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Ace the CBSE Superintendent Tier-2 exam (July 5, 2025) and Junior
              Assistant typing test (July 3-5, 2025) with TypeSprint’s free
              practice and expert tips!
            </p>
            {currentUser ? (
              <button
                onClick={handleStartTest}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
              >
                Start Typing Practice <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
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
                CBSE Recruitment 2025: Exam Schedule
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The Central Board of Secondary Education (CBSE) has announced
                the schedule for the Tier-2 examination for Superintendent and
                the Skill (Typing) Test for Junior Assistant posts, per the
                recruitment notification dated December 31, 2024.
              </p>
              <div className="space-y-6">
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Key Dates
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>Superintendent Tier-2 Exam</strong>: July 5, 2025,
                      in Delhi.
                    </li>
                    <li>
                      <strong>Junior Assistant Typing Test</strong>: July 3–5,
                      2025, in Delhi (specific date available in candidate
                      login).
                    </li>
                    <li>
                      <strong>Admit Cards</strong>: Issued two days prior to the
                      exam, with details on date, time, and center.
                    </li>
                  </ul>
                </div>
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Travel Reimbursement
                  </h3>
                  <p className="text-gray-300">
                    Candidates who took the Tier-1 exam on April 20, 2025, from
                    locations outside Delhi, Noida, Faridabad, Gurugram, and
                    Ghaziabad are eligible for to-and-fro Sleeper Class (Non-AC)
                    train fare reimbursement. Submit train tickets and a
                    cancelled cheque during the Tier-2 or typing test for direct
                    bank transfer.
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
                CBSE Junior Assistant Typing Test Requirements
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The CBSE Junior Assistant typing test requires a minimum speed
                of <strong>35 WPM in English (10,500 KDPH)</strong> or{" "}
                <strong>30 WPM in Hindi (9,000 KDPH)</strong> over 10 minutes on
                a computer. Candidates failing to meet these standards will be
                disqualified.
              </p>
              {currentUser ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {[
                      {
                        icon: FaKeyboard,
                        title: "Speed Requirements",
                        desc: "35 WPM English (10,500 KDPH) or 30 WPM Hindi (9,000 KDPH) for 10 minutes.",
                      },
                      {
                        icon: FaClock,
                        title: "Test Duration",
                        desc: "10-minute test with no editing tools (e.g., Ctrl+C, Backspace).",
                      },
                      {
                        icon: FaCheckCircle,
                        title: "Font & Setup",
                        desc: "Hindi uses Mangal/Krutidev fonts; preset margins, computer-based.",
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
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Preparation Tips
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                    <li>
                      Practice exam-like passages on TypeSprint to meet the
                      35/30 WPM requirement.
                    </li>
                    <li>
                      Use Mangal/Krutidev fonts for Hindi to ensure familiarity.
                    </li>
                    <li>
                      Train in strict mode (no editing tools) to simulate CBSE
                      test conditions.
                    </li>
                    <li>
                      Leverage TypeSprint’s AI feedback to reduce errors and
                      improve accuracy.
                    </li>
                  </ul>
                  <button
                    onClick={handleStartTest}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
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
                    Sign in to TypeSprint to access preparation tips, practice
                    tests, and more. Join thousands of CBSE aspirants for free!
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
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
                Typing Test Evaluation Criteria
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The CBSE typing test is evaluated in Unrestricted mode using the
                following parameters:
              </p>
              <div className="space-y-6">
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Evaluation Parameters
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>Gross Words</strong>: Total words typed (correct +
                      incorrect).
                    </li>
                    <li>
                      <strong>Gross Words per Minute (GWPM)</strong>: Gross
                      Words / Time (minutes).
                    </li>
                    <li>
                      <strong>Net Words</strong>: Total correct words typed.
                    </li>
                    <li>
                      <strong>Net Words per Minute (NWPM)</strong>: Net Words /
                      Time (minutes).
                    </li>
                    <li>
                      <strong>Accuracy</strong>: (NWPM * 100) / GWPM.
                    </li>
                  </ul>
                </div>
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Sample Illustrations
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>Candidate A</strong>: Typed 390 words (388
                      correct, 2 incorrect) in 10 min. GWPM = 39, NWPM = 38.8,
                      Accuracy = 99.49%. <strong>Speed: 38.8 WPM</strong>.
                    </li>
                    <li>
                      <strong>Candidate B</strong>: Typed 447 words (all
                      correct) in 10 min. GWPM = 44.7, NWPM = 44.7, Accuracy =
                      100%. <strong>Speed: 44.7 WPM</strong>.
                    </li>
                    <li>
                      <strong>Candidate C</strong>: Typed 316 words (all
                      correct) in 10 min. GWPM = 31.6, NWPM = 31.6, Accuracy =
                      100%. <strong>Speed: 31.6 WPM</strong>.
                    </li>
                    <li>
                      <strong>Candidate D</strong>: Typed 521 words (401
                      correct, 120 incorrect) in 10 min. GWPM = 52.1, NWPM =
                      40.1, Accuracy = 76.96%. <strong>Speed: 40.1 WPM</strong>.
                    </li>
                    <li>
                      <strong>Candidate E</strong>: Typed 550 words (390
                      correct, 160 incorrect) in 10 min. GWPM = 55, NWPM = 39,
                      Accuracy = 70.90%. <strong>Speed: 39 WPM</strong>.
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-gray-300 text-center mt-6">
                Practice on TypeSprint to achieve the required 35 WPM (English)
                or 30 WPM (Hindi) with high accuracy!
              </p>
            </div>
          </div>
        </section>

        {/* Tips Carousel */}
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
              <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
                Expert Tips for CBSE Tests
              </h2>
              <div className="relative">
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {tips[currentTip].title}
                  </h3>
                  <p className="text-gray-300">{tips[currentTip].content}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={prevTip}
                    className="p-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all"
                    aria-label="Previous tip"
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    onClick={nextTip}
                    className="p-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all"
                    aria-label="Next tip"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
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
              <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="card bg-gray-800 rounded-lg p-4 border border-gray-700"
                  >
                    <summary className="text-lg font-medium text-white cursor-pointer">
                      {faq.question}
                    </summary>
                    <p className="text-gray-300 mt-2">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Sharing Section */}
        <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60 section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Share This Guide
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Help fellow CBSE aspirants by sharing this guide on social
              platforms!
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
                className="p-3 bg-blue-700 rounded-full hover:bg-blue-600 transition-all"
                aria-label="Download as PDF"
              >
                <FaFileAlt className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60 section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {currentUser ? (
              <>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Keep Going, {currentUser?.name || "Champion"}!
                </h3>
                <p className="text-lg text-gray-300 mb-6">
                  You’re on your way to mastering the CBSE Junior Assistant
                  typing test and Superintendent Tier-2 exam. Practice daily
                  with TypeSprint!
                </p>
                <button
                  onClick={handleStartTest}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Continue Practice <FaArrowRight className="ml-2" />
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Join Our CBSE Prep Community
                </h3>
                <p className="text-lg text-gray-300 mb-6">
                  Sign up for TypeSprint to access free practice tests, guides,
                  and join thousands preparing for CBSE 2025!
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Sign Up Free <FaArrowRight className="ml-2" />
                </button>
              </>
            )}
          </div>
        </section>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-4 z-20 no-print">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p className="text-lg font-medium">
              Ready to ace the CBSE 2025 typing test? Practice free now!
            </p>
            <button
              onClick={handleStartTest}
              className="px-6 py-2 bg-white text-blue-900 rounded-full font-medium hover:bg-gray-100 transition-all flex items-center"
            >
              Start Test <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CBSE2025TypingBlog;
