import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaKeyboard,
  FaTrophy,
  FaChartLine,
  FaLock,
  FaArrowRight,
  FaBook,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../contexts/AuthContext";

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

const DGAFMSGroupCTypingBlog = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    typingTest: useRef(null),
    syllabus: useRef(null),
    examPattern: useRef(null),
    success: useRef(null),
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

  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleLogin = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  const handleStartTest = () => {
    navigate("/typing-test?exam=dgafms-ldc");
  };

  const handleDownloadSyllabus = () => {
    navigate("/download-dgafms-syllabus");
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden">
        <Helmet>
          <title>
            DGAFMS Group C Typing Test & Syllabus 2025: Ultimate Guide |
            TypeSprint
          </title>
          <meta
            name="description"
            content="Master the DGAFMS Group C typing test (35 WPM for LDC) and syllabus with TypeSprint’s free practice. Boost speed and accuracy for 2025 success!"
          />
          <meta
            name="keywords"
            content="ldc typing exam pattern, ldc typing speed, ldc typing speed required, DGAFMS Group C typing test, DGAFMS syllabus 2025, TypeSprint, government exam typing"
          />
          <meta name="author" content="Neeraj Kumar" />
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="DGAFMS Group C Typing Test & Syllabus 2025: Ultimate Guide | TypeSprint"
          />
          <meta
            property="og:description"
            content="Ace the DGAFMS Group C typing test and syllabus with TypeSprint’s exam-like practice. Hit 35 WPM for LDC and prepare for 2025!"
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/dgafms-typing-test-thumbnail.jpg"
          />
          <meta
            property="og:url"
            content="https://typesprint.live/blogs/dgafms-group-c-typing-test-2025"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline:
                "DGAFMS Group C Typing Test & Syllabus 2025: Ultimate Guide",
              description:
                "Learn how to excel in the DGAFMS Group C typing test (35 WPM for LDC) and syllabus with TypeSprint’s free practice tests for 2025.",
              author: {
                "@type": "Person",
                name: "Neeraj Kumar",
              },
              publisher: {
                "@type": "Organization",
                name: "TypeSprint",
                logo: {
                  "@type": "ImageObject",
                  url: "https://typesprint.live/images/logo.png",
                },
              },
              datePublished: "2025-06-11",
              image:
                "https://typesprint.live/images/dgafms-typing-test-thumbnail.jpg",
              url: "https://typesprint.live/blogs/dgafms-group-c-typing-test-2025",
              mainEntityOfPage: {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is the LDC typing speed required for DGAFMS Group C?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "The LDC post requires 35 WPM in English or 30 WPM in Hindi with 90%+ accuracy.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What is the DGAFMS Group C LDC typing exam pattern?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "The LDC typing test involves typing a full paragraph on a computer, typically 350–400 words, within a set time to achieve 35 WPM (English) or 30 WPM (Hindi).",
                    },
                  },
                ],
              },
            })}
          </script>
        </Helmet>

        {/* Hero Section */}
        <section
          id="hero"
          ref={sectionRefs.hero}
          className="relative z-10 py-20 md:py-32 flex flex-col items-center justify-center text-center px-4"
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
              aria-label="Keyboard icon for DGAFMS Group C typing test"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Ace DGAFMS Group C Typing Test & Syllabus 2025
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Conquer the DGAFMS Group C typing test (35 WPM for LDC) with
              TypeSprint’s free, exam-like practice. Master the syllabus and
              secure your dream job in 2025!
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
              src="https://blogger.googleusercontent.com/img/a/AVvXsEhl5CL4QKsrTAv_CVvSdb0ZoLu9T3AEaOPoV2heu7foelX2VPgPEHnv4UFq-cxG8fxJjeIb5lQXa1ciDFxRr7PMHr-8tOAtYMwqZRo37_uIinTze7u530gzQvC5cNvNZuus2I_5u3Krca7FZXAEEdCClp9DPGn6Oms09DXaWLz5eviHi2pBwdjDqphhEfM"
              alt="DGAFMS Group C Typing Test 2025"
              className="mt-6 max-w-full h-auto rounded-lg shadow-lg mx-auto"
              loading="lazy"
            />
          </div>
        </section>

        {/* Typing Test Section */}
        <section
          id="typingTest"
          ref={sectionRefs.typingTest}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.typingTest
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Master the DGAFMS Group C Typing Test
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The DGAFMS Group C typing test is crucial for posts like Lower
                Division Clerk (LDC) and Store Keeper. You need{" "}
                <strong>35 WPM in English or 30 WPM in Hindi for LDC</strong>{" "}
                with 90%+ accuracy, and{" "}
                <strong>
                  30 WPM in English or 25 WPM in Hindi for Store Keeper
                </strong>
                . TypeSprint’s free platform simulates the real exam with
                full-paragraph tests and AI feedback to help you excel.
              </p>
              {currentUser ? (
                <>
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <FaKeyboard
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Keyboard icon for exam practice"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          1. Practice Real Exam Paragraphs
                        </h3>
                        <p className="text-gray-400">
                          DGAFMS LDC typing tests involve 350–400-word
                          paragraphs. TypeSprint’s tests replicate this format,
                          including punctuation and formatting challenges.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaChartLine
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Chart icon for AI feedback"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          2. Leverage AI Feedback
                        </h3>
                        <p className="text-gray-400">
                          TypeSprint’s AI pinpoints errors in keys, spacing, or
                          punctuation, helping you achieve the 90%+ accuracy
                          required for LDC typing speed.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Trophy icon for timed tests"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          3. Train Under Exam Conditions
                        </h3>
                        <p className="text-gray-400">
                          TypeSprint’s timed tests mimic the DGAFMS typing exam
                          pattern, building your speed and composure under
                          pressure.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaKeyboard
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Keyboard icon for strict mode"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          4. Master Typing Without Backspace
                        </h3>
                        <p className="text-gray-400">
                          DGAFMS tests may disable backspace. TypeSprint’s
                          strict mode trains you to type accurately from the
                          first stroke.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaChartLine
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Chart icon for finger placement"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          5. Optimize Finger Placement
                        </h3>
                        <p className="text-gray-400">
                          Use the home row (ASDF, JKL;) for efficient typing.
                          TypeSprint’s feedback corrects improper finger usage.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Trophy icon for certificates"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          6. Earn Typing Certificates
                        </h3>
                        <p className="text-gray-400">
                          Complete TypeSprint challenges to earn certificates,
                          boosting your confidence for the DGAFMS typing test.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaKeyboard
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Keyboard icon for daily practice"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          7. Practice Daily for Success
                        </h3>
                        <p className="text-gray-400">
                          Dedicate 15–30 minutes daily on TypeSprint to reach 35
                          WPM for LDC or 30 WPM for Store Keeper in weeks.
                        </p>
                      </div>
                    </div>
                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Common Typing Mistakes to Avoid
                      </h2>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          <strong>Speed Over Accuracy</strong>: Rushing reduces
                          accuracy below 90%. Focus on precision first.
                        </li>
                        <li>
                          <strong>Poor Finger Placement</strong>: Incorrect hand
                          positioning slows you down. Use TypeSprint’s home row
                          drills.
                        </li>
                        <li>
                          <strong>Ignoring Time Pressure</strong>: Untimed
                          practice won’t prepare you. Use TypeSprint’s timed
                          tests.
                        </li>
                        <li>
                          <strong>Skipping Feedback</strong>: Ignoring AI
                          insights stalls progress. Review TypeSprint’s error
                          reports.
                        </li>
                      </ul>
                    </div>
                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Try a DGAFMS LDC Typing Test Now
                      </h2>
                      <p className="text-lg text-gray-300 mb-6">
                        Get a feel for the DGAFMS LDC typing exam pattern with
                        this sample paragraph:
                      </p>
                      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <p className="text-gray-300 font-mono">
                          The Directorate General of Armed Forces Medical
                          Services (DGAFMS) ensures high-quality healthcare for
                          armed forces personnel across India…
                        </p>
                        <button
                          onClick={handleStartTest}
                          className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
                        >
                          Practice This Paragraph
                        </button>
                      </div>
                    </div>
                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Why Choose TypeSprint?
                      </h2>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          Exam-like full-paragraph tests for DGAFMS LDC and
                          Store Keeper.
                        </li>
                        <li>
                          English and Hindi support with Kruti Dev/Mangal fonts.
                        </li>
                        <li>AI-driven feedback to boost speed and accuracy.</li>
                        <li>Free access to all features after signup.</li>
                        <li>Certificates to validate your typing skills.</li>
                      </ul>
                      <button
                        onClick={handleStartTest}
                        className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                      >
                        Start Free Practice <FaArrowRight className="ml-2" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-12 text-center">
                  <FaLock
                    className="h-12 w-12 text-cyan-400 mx-auto mb-4"
                    aria-label="Lock icon for restricted content"
                  />
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Unlock the Full DGAFMS Typing Guide
                  </h3>
                  <p className="text-lg text-gray-300 mb-6">
                    Sign in to TypeSprint to access all seven strategies, common
                    mistakes, a sample test, and more. Join thousands of DGAFMS
                    Group C aspirants for free!
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

        {/* Syllabus Section */}
        {currentUser && (
          <section
            id="syllabus"
            ref={sectionRefs.syllabus}
            className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`transition-all duration-1000 ${
                  isVisible.syllabus
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                  DGAFMS Group C Syllabus 2025
                </h2>
                <p className="text-lg text-gray-300 mb-8 text-center">
                  The written exam tests your knowledge across four key areas.
                  Combine this with TypeSprint’s typing practice to ace the full
                  DGAFMS Group C exam!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Reasoning",
                      topics: [
                        "Number, Ranking & Time Sequence",
                        "Coding-Decoding",
                        "Analogy",
                        "Puzzles",
                        "Logical Venn Diagrams",
                      ],
                    },
                    {
                      title: "General English",
                      topics: [
                        "Reading Comprehension",
                        "Fill in the Blanks",
                        "Synonyms & Antonyms",
                        "Sentence Improvement",
                        "Direct & Indirect Speech",
                      ],
                    },
                    {
                      title: "Quantitative Aptitude",
                      topics: [
                        "HCF & LCM",
                        "Percentage",
                        "Time and Work",
                        "Data Interpretation",
                        "Simple & Compound Interest",
                      ],
                    },
                    {
                      title: "General Awareness",
                      topics: [
                        "Current Affairs",
                        "Indian Constitution",
                        "Books and Authors",
                        "Awards and Honors",
                        "Geography",
                      ],
                    },
                  ].map((subject, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {subject.title}
                      </h3>
                      <ul className="list-disc list-inside text-gray-400">
                        {subject.topics.map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleDownloadSyllabus}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Download Full Syllabus <FaBook className="ml-2" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Exam Pattern Section */}
        {currentUser && (
          <section
            id="examPattern"
            ref={sectionRefs.examPattern}
            className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`transition-all duration-1000 ${
                  isVisible.examPattern
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                  DGAFMS Group C Exam Pattern 2025
                </h2>
                <p className="text-lg text-gray-300 mb-8 text-center">
                  Understand the LDC typing exam pattern and written test
                  structure to prepare effectively with TypeSprint.
                </p>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Written Exam
                  </h3>
                  <ul className="list-disc list-inside text-gray-400 mb-6">
                    <li>Duration: 2 hours</li>
                    <li>Total Marks: 100</li>
                    <li>Type: Multiple Choice Questions (MCQs)</li>
                    <li>
                      Subjects: Reasoning, General English, Quantitative
                      Aptitude, General Awareness
                    </li>
                  </ul>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Typing/Skill Tests
                  </h3>
                  <ul className="list-disc list-inside text-gray-400">
                    <li>
                      <strong>LDC</strong>: 35 WPM (English) or 30 WPM (Hindi),
                      ~350–400 words, 90%+ accuracy.
                    </li>
                    <li>
                      <strong>Store Keeper</strong>: 30 WPM (English) or 25 WPM
                      (Hindi).
                    </li>
                    <li>
                      <strong>Stenographer Grade-II</strong>: Dictation at 80
                      WPM, transcription in 50–75 mins.
                    </li>
                  </ul>
                  <button
                    onClick={handleStartTest}
                    className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
                  >
                    Practice Typing Test
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Success Stories Section */}
        {currentUser && (
          <section
            id="success"
            ref={sectionRefs.success}
            className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
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
                <p className="text-lg text-gray-300 mb-8 text-center">
                  Join aspirants who aced the DGAFMS Group C typing test with
                  TypeSprint’s practice:
                </p>
                <div className="space-y-8">
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Anjali’s Journey to 38 WPM
                    </h3>
                    <p className="text-gray-400">
                      “I struggled with 25 WPM and low accuracy. TypeSprint’s
                      strict mode and AI feedback helped me hit 38 WPM, clearing
                      the LDC typing test!”
                    </p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Rajesh’s Hindi Typing Success
                    </h3>
                    <p className="text-gray-400">
                      “Hindi typing seemed impossible, but TypeSprint’s Mangal
                      font tests got me to 32 WPM. I passed the DGAFMS LDC test
                      confidently!”
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleStartTest}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Start Your Success Story <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {currentUser && (
          <section
            id="faqs"
            ref={sectionRefs.faqs}
            className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
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
                <p className="text-lg text-gray-300 mb-8 text-center">
                  Clear your doubts about the DGAFMS Group C typing test and
                  syllabus with TypeSprint’s expert answers.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      question:
                        "What is the LDC typing speed required for DGAFMS Group C?",
                      answer:
                        "You need 35 WPM in English or 30 WPM in Hindi with 90%+ accuracy for the LDC post.",
                    },
                    {
                      question:
                        "What is the DGAFMS Group C LDC typing exam pattern?",
                      answer:
                        "The LDC typing test requires typing a 350–400-word paragraph on a computer within a set time, achieving 35 WPM (English) or 30 WPM (Hindi) with high accuracy.",
                    },
                    {
                      question:
                        "When is the DGAFMS LDC typing test date for 2025?",
                      answer:
                        "Exact dates are yet to be announced. Start practicing now on TypeSprint to be ready whenever the test is scheduled!",
                    },
                    {
                      question:
                        "How does TypeSprint help with LDC typing speed?",
                      answer:
                        "TypeSprint offers exam-like tests, AI feedback, strict mode, and Hindi/English support to help you hit 35 WPM with 90% accuracy.",
                    },
                    {
                      question: "What is a good typing speed for DGAFMS LDC?",
                      answer:
                        "Aim for 40–45 WPM with 90%+ accuracy to comfortably clear the test and stand out.",
                    },
                    {
                      question:
                        "Does TypeSprint support Hindi typing for DGAFMS?",
                      answer:
                        "Yes, TypeSprint provides Hindi tests with Kruti Dev and Mangal fonts, tailored for the 30 WPM requirement.",
                    },
                    {
                      question:
                        "How long should I practice daily for DGAFMS LDC?",
                      answer:
                        "Practice 15–30 minutes daily on TypeSprint to reach 35 WPM in 2–4 weeks.",
                    },
                  ].map((faq, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex justify-between items-center text-left text-lg font-medium text-white"
                      >
                        <span>{faq.question}</span>
                        <span>{activeFaq === index ? "−" : "+"}</span>
                      </button>
                      {activeFaq === index && (
                        <div className="mt-4 text-gray-300">{faq.answer}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tags Section */}
        {currentUser && (
          <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "LDC Typing Exam Pattern",
                  "LDC Typing Speed",
                  "DGAFMS Group C Typing Test",
                  "TypeSprint",
                  "Hindi Typing",
                  "English Typing",
                  "Typing Accuracy",
                  "DGAFMS Syllabus 2025",
                  "Government Exam Typing",
                ].map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-700 rounded-full text-gray-300 hover:bg-cyan-600 hover:text-white transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {currentUser ? (
              <>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Keep Going, {currentUser?.name || "Champion"}!
                </h3>
                <p className="text-lg text-gray-300 mb-6">
                  You’re on your way to mastering the DGAFMS Group C typing
                  test. Practice daily with TypeSprint to hit 35 WPM and secure
                  your future!
                </p>
                <button
                  onClick={handleStartTest}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Continue Typing Practice <FaArrowRight className="ml-2" />
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Join Our DGAFMS Group C Community
                </h3>
                <p className="text-lg text-gray-300 mb-6">
                  Sign up for TypeSprint to access free typing tests, syllabus
                  guides, and join thousands preparing for DGAFMS Group C 2025!
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
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-4 z-20">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p className="text-lg font-medium">
              Ready to ace the DGAFMS LDC typing test? Practice free now!
            </p>
            <button
              onClick={handleStartTest}
              className="px-6 py-2 bg-white text-blue-900 rounded-full font-medium hover:bg-gray-100 transition-all flex items-center"
            >
              Start Typing <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DGAFMSGroupCTypingBlog;
