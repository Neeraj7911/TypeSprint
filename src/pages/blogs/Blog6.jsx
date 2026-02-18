import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaKeyboard,
  FaTrophy,
  FaChartLine,
  FaLock,
  FaArrowRight,
  FaBook,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaFileAlt,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../contexts/AuthContext";
import BlogInterlink from "../../components/BlogInterlink.jsx";
import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";

// Lazy load video and pdf libraries
//const VideoPlayer = lazy(() => import("./components/VideoPlayer")); // Assume a custom video player component
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

const CSIRJSATypingBlog = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    typingTest: useRef(null),
    stenographyTest: useRef(null),
    evaluation: useRef(null),
    preparation: useRef(null),
    accommodations: useRef(null),
    resources: useRef(null),
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
    navigate("/typing-test?exam=csir-jsa");
  };

  const handleDownloadGuide = () => {
    navigate("/download-csir-jsa-guide");
  };

  const handleSaveAsPDF = async () => {
    if (!contentRef.current) return;
    window.scrollTo(0, 0);
    const html2pdf = (await loadHtml2PDF()).default;
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: "CSIR-JSA-Typing-Stenography-Guide.pdf",
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
    "https://typesprint.live/blogs/csir-js-typing-stenography-test-guide";
  const shareTitle =
    "Ace the CSIR JSA Typing & Stenography Tests with TypeSprint!";

  return (
    <ErrorBoundary>
      <div
        ref={contentRef}
        className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden"
      >
        <Helmet>
          <title>
            CSIR JSA Typing & Stenography Test Guide: Ultimate Prep for 2025 |
            TypeSprint
          </title>
          <meta
            name="description"
            content="Excel in the CSIR JSA typing test (35 WPM English/30 WPM Hindi) and Junior Stenographer test (80 WPM) with TypeSprint’s free practice, error calculation tips, and 2025 exam guide."
          />
          <meta
            name="keywords"
            content="CSIR JSA typing test, CSIR stenography test, CSIR JSA typing speed, CSIR Junior Stenographer preparation, free typing practice, Hindi typing test, stenography practice, CSIR exam preparation 2025, CSIR typing error calculation, TypeSprint"
          />
          <meta name="author" content="Neeraj Kumar" />
          <meta name="robots" content="index, follow" />
          <link
            rel="canonical"
            href="https://typesprint.live/blogs/csir-jsa-typing-stenography-test-2025"
          />
          <meta
            property="og:title"
            content="CSIR JSA Typing & Stenography Test Guide: Ultimate Prep for 2025 | TypeSprint"
          />
          <meta
            property="og:description"
            content="Master the CSIR JSA typing and stenography tests with TypeSprint’s free practice, error calculation tips, and 2025 exam guide."
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/csir-jsa-typing-hero.webp"
          />
          <meta
            property="og:url"
            href="https://typesprint.live/blogs/csir-js-typing-stenography-test-guide"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline:
                "CSIR JSA Typing & Stenography Test Guide: Ultimate Prep for 2025",
              description:
                "Excel in the CSIR JSA typing test (35 WPM English/30 WPM Hindi) and Junior Stenographer test (80 WPM) with TypeSprint’s free practice tests, error calculation tips, and 2025 guide.",
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
              datePublished: "2025-06-20",
              dateModified: "2025-06-20",
              image: "https://typesprint.live/images/csir-jsa-typing-hero.webp",
              url: "https://typesprint.live/blogs/csir-js-typing-stenography-test-guide",
              mainEntityOfPage: {
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is the typing speed required for CSIR JSA?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "The CSIR JSA typing test requires 35 WPM in English (10500 KDPH) or 30 WPM in Hindi (9000 KDPH) with a maximum of 5% errors for UR/OBC/SC/OH/VH candidates and 7% for ST/HH/Ex-Servicemen.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What is the CSIR Junior Stenographer test pattern?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "The test involves a 10-minute dictation at 80 WPM in English or Hindi, followed by transcription on a computer within 50 minutes (English) or 65 minutes (Hindi).",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How are errors calculated in the CSIR typing test?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Errors above 5% (UR/OBC/SC/OH/VH) or 7% (ST/HH/Ex-Servicemen) reduce speed. For example, 320 words with 19 errors (5% = 16 ignorable) results in 3 admissible errors, reducing speed to 29 WPM.",
                    },
                  },
                ],
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
              aria-label="Keyboard icon for CSIR JSA typing test"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                CSIR JSA Typing & Stenography Test Guide 2025
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Conquer the CSIR JSA typing test (35 WPM English/30 WPM Hindi) and
              Junior Stenographer test (80 WPM) with TypeSprint’s free practice.
              Ace your 2025 exam with our ultimate guide!
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
              src="https://blogger.googleusercontent.com/img/a/AVvXsEi_scuBcBLwJgxCS7_VKrYZ6-wfIXPMTHXCB7W517QOc8RvtUFXlRXfJ68lo9ANuIYBes06GKJQ0Tvrtwnlpv6WRJYejONXAhwvm1tyY2_tcpCg5ZB3tGcWTuPu3p7OjRUgbeukO1yA6H7gddy1QODdgCkTXWOcNoDOHENr5w0PHeRlqW4qRelpXQg7diA"
              alt="CSIR JSA Typing & Stenography Test Preparation 2025"
              className="mt-6 max-w-full h-auto rounded-lg shadow-lg mx-auto"
              loading="lazy"
            />
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
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Master the CSIR JSA Typing Test
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The CSIR JSA typing test (Advertisement No.
                CRRI/02/PC/JSA-JST/2025) requires{" "}
                <strong>
                  35 WPM in English (10500 KDPH) or 30 WPM in Hindi (9000 KDPH)
                </strong>{" "}
                over 10 minutes, with{" "}
                <strong>
                  5% max errors for UR/OBC/SC/OH/VH and 7% for
                  ST/HH/Ex-Servicemen
                </strong>
                . TypeSprint’s exam-like practice ensures you meet these
                standards.
              </p>
              {currentUser ? (
                <>
                  <div className="space-y-8">
                    <div className="flex items-start card">
                      <FaKeyboard
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Keyboard icon for exam practice"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          1. Practice Exam-Like Passages
                        </h3>
                        <p className="text-gray-400">
                          CSIR tests use ~300-400 word passages with no editing
                          tools. TypeSprint replicates this with Mangal/Krutidev
                          fonts for Hindi.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start card">
                      <FaChartLine
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Chart icon for AI feedback"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          2. Leverage AI Feedback
                        </h3>
                        <p className="text-gray-400">
                          TypeSprint’s AI pinpoints errors in speed, accuracy,
                          and formatting, keeping you within the 5-7% error
                          limit.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start card">
                      <FaTrophy
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Trophy icon for timed tests"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          3. Train Under Exam Conditions
                        </h3>
                        <p className="text-gray-400">
                          A 5-minute trial precedes the test. TypeSprint’s timed
                          tests simulate this setup for confidence.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start card">
                      <FaKeyboard
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Keyboard icon for strict mode"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          4. Master Typing Without Editing
                        </h3>
                        <p className="text-gray-400">
                          CSIR disables tools like Backspace or Ctrl+C.
                          TypeSprint’s strict mode trains you to type accurately
                          from the start.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start card">
                      <FaChartLine
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Chart icon for finger placement"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          5. Optimize Finger Placement
                        </h3>
                        <p className="text-gray-400">
                          Use the home row (ASDF, JKL;) for efficiency.
                          TypeSprint corrects improper finger usage.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start card">
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
                          boosting confidence for the CSIR test.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start card">
                      <FaKeyboard
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Keyboard icon for daily practice"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          7. Practice Daily for Success
                        </h3>
                        <p className="text-gray-400">
                          Dedicate 15-30 minutes daily on TypeSprint to reach 35
                          WPM (English) or 30 WPM (Hindi) in 2-4 weeks.
                        </p>
                      </div>
                    </div>
                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Common Typing Mistakes to Avoid
                      </h2>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          <strong>Exceeding Error Limits</strong>: Errors above
                          5-7% reduce speed. Focus on accuracy first.
                        </li>
                        <li>
                          <strong>Incorrect Font Usage</strong>: Hindi tests use
                          Mangal/Krutidev. Practice these on TypeSprint.
                        </li>
                        <li>
                          <strong>Ignoring Trial Session</strong>: Use the
                          5-minute trial to test the keyboard. TypeSprint
                          simulates this.
                        </li>
                        <li>
                          <strong>Skipping Feedback</strong>: TypeSprint’s AI
                          reports are key to minimizing errors.
                        </li>
                      </ul>
                    </div>
                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Try a CSIR JSA Typing Test Now
                      </h2>
                      <p className="text-lg text-gray-300 mb-6">
                        Experience the CSIR JSA typing test with this sample
                        passage:
                      </p>
                      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 card">
                        <p className="text-gray-300 font-mono">
                          The Council of Scientific and Industrial Research
                          (CSIR) drives innovation through cutting-edge research
                          across India…
                        </p>
                        <button
                          onClick={handleStartTest}
                          className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
                        >
                          Practice This Passage
                        </button>
                      </div>
                    </div>
                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Why Choose TypeSprint?
                      </h2>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Exam-like passages for CSIR JSA typing tests.</li>
                        <li>Hindi support with Mangal/Krutidev fonts.</li>
                        <li>AI-driven feedback to reduce errors.</li>
                        <li>Free access to all features after signup.</li>
                        <li>Certificates to validate your skills.</li>
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
                    Unlock the Full CSIR JSA Typing Guide
                  </h3>
                  <p className="text-lg text-gray-300 mb-6">
                    Sign in to TypeSprint to access all seven strategies, common
                    mistakes, a sample test, and more. Join thousands of CSIR
                    aspirants for free!
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

        {/* Stenography Test Section */}
        {currentUser && (
          <section
            id="stenographyTest"
            ref={sectionRefs.stenographyTest}
            className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`transition-all duration-1000 ${
                  isVisible.stenographyTest
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                  Excel in the CSIR Junior Stenographer Test
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  The Junior Stenographer test involves a{" "}
                  <strong>10-minute dictation at 80 WPM</strong> in English or
                  Hindi, followed by transcription on a computer within{" "}
                  <strong>50 minutes (English) or 65 minutes (Hindi)</strong>.
                  With{" "}
                  <strong>
                    7% ignorable errors for UR and 10% for reserved categories
                  </strong>
                  , TypeSprint’s dictation practice ensures success.
                </p>
                <div className="space-y-8">
                  <div className="flex items-start card">
                    <FaKeyboard
                      className="h-8 w-8 text-cyan-400 mr-4"
                      aria-label="Keyboard icon for dictation practice"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        1. Practice Dictation at 80 WPM
                      </h3>
                      <p className="text-gray-400">
                        TypeSprint offers audio dictations at 80 WPM to mimic
                        the CSIR test, improving shorthand speed.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start card">
                    <FaChartLine
                      className="h-8 w-8 text-cyan-400 mr-4"
                      aria-label="Chart icon for transcription"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        2. Master Transcription
                      </h3>
                      <p className="text-gray-400">
                        Practice transcribing within 50-65 minutes, ensuring
                        clarity in shorthand notes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start card">
                    <FaTrophy
                      className="h-8 w-8 text-cyan-400 mr-4"
                      aria-label="Trophy icon for error reduction"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        3. Reduce Errors
                      </h3>
                      <p className="text-gray-400">
                        TypeSprint’s feedback minimizes full (omissions) and
                        half (spelling) mistakes to stay within error limits.
                      </p>
                    </div>
                  </div>
                  <div className="mt-12">
                    <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                      Sample Stenography Passage
                    </h2>
                    <p className="text-lg text-gray-300 mb-6">
                      Try transcribing this sample dictation:
                    </p>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 card">
                      <p className="text-gray-300 font-mono">
                        CSIR’s mission is to foster scientific research and
                        technological innovation for national development…
                      </p>
                      <button
                        onClick={handleStartTest}
                        className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
                      >
                        Practice Dictation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Evaluation Criteria Section */}
        {currentUser && (
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
                  CSIR Typing Test Error Calculation
                </h2>
                <p className="text-lg text-gray-300 mb-8 text-center">
                  Understand how CSIR evaluates typing and stenography tests to
                  optimize your performance.
                </p>
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Typing Test Evaluation
                    </h3>
                    <p className="text-gray-400">
                      Speed is calculated as:{" "}
                      <strong>Total Words Typed ÷ Time (10 minutes)</strong>.
                      Errors above 5% (UR/OBC/SC/OH/VH) or 7%
                      (ST/HH/Ex-Servicemen) reduce speed. For example, typing
                      320 words with 19 errors (5% = 16 ignorable) leaves 3
                      admissible errors, reducing speed to 29 WPM.
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Stenography Test Evaluation
                    </h3>
                    <p className="text-gray-400">
                      Errors include full (omissions, wrong words) and half
                      (spelling, punctuation) mistakes. UR candidates can have
                      7% ignorable errors, reserved categories 10%.
                      Transcription must be completed within 50 minutes
                      (English) or 65 minutes (Hindi).
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Error Example
                    </h3>
                    <p className="text-gray-400">
                      For a 350-word passage, 5% = 17.5 errors (rounded to 18).
                      Typing 19 errors (UR candidate) results in 1 admissible
                      error, reducing speed by ~0.1 WPM per error.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleStartTest}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Practice with Error Feedback <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Preparation Tips Section */}
        {currentUser && (
          <section
            id="preparation"
            ref={sectionRefs.preparation}
            className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`transition-all duration-1000 ${
                  isVisible.preparation
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                  CSIR JSA & Stenographer Preparation Tips
                </h2>
                <p className="text-lg text-gray-300 mb-8 text-center">
                  Boost your performance with these expert strategies tailored
                  for CSIR tests.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Daily Typing Practice",
                      desc: "Spend 15-20 minutes daily on TypeSprint to hit 35 WPM (English) or 30 WPM (Hindi) with 95% accuracy.",
                    },
                    {
                      title: "Shorthand Drills",
                      desc: "Practice 80 WPM dictations on TypeSprint to improve shorthand speed and transcription accuracy.",
                    },
                    {
                      title: "Font Familiarity",
                      desc: "Use Mangal/Krutidev fonts for Hindi typing to avoid errors during the test.",
                    },
                    {
                      title: "Simulate Test Conditions",
                      desc: "Practice with TypeSprint’s timed tests and no-editing mode to mimic the CSIR environment.",
                    },
                  ].map((tip, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300 card"
                    >
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-gray-400">{tip.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleStartTest}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Start Practicing Tips <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Accommodations Section */}
        {currentUser && (
          <section
            id="accommodations"
            ref={sectionRefs.accommodations}
            className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`transition-all duration-1000 ${
                  isVisible.accommodations
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                  Accommodations for PwBD Candidates
                </h2>
                <p className="text-lg text-gray-300 mb-8 text-center">
                  CSIR ensures accessibility for Persons with Benchmark
                  Disabilities (PwBD).
                </p>
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Typing Test Exemptions
                    </h3>
                    <p className="text-gray-400">
                      PwBD candidates unfit for typing can seek exemption with a
                      medical certificate (Annexure-II) from a Civil Surgeon,
                      subject to Medical Board verification.
                    </p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Stenography Accommodations
                    </h3>
                    <p className="text-gray-400">
                      Visually impaired candidates can use a scribe/passage
                      dictator. Candidates with cerebral palsy or locomotor
                      disabilities get 5 extra minutes with valid certification.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Resources Section */}
        {currentUser && (
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
                  Free CSIR JSA & Stenographer Resources
                </h2>
                <p className="text-lg text-gray-300 mb-8 text-center">
                  Download exclusive materials to boost your CSIR preparation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      CSIR JSA Typing Practice Passages
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Download 10 exam-like passages (English & Hindi) to
                      practice typing at 35/30 WPM.
                    </p>
                    <button
                      onClick={handleDownloadGuide}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center mx-auto"
                    >
                      Download Passages <FaBook className="ml-2" />
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Stenography Shorthand Guide
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Get a shorthand template for 80 WPM dictations, with tips
                      for transcription.
                    </p>
                    <button
                      onClick={handleDownloadGuide}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center mx-auto"
                    >
                      Download Guide <FaBook className="ml-2" />
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Save as PDF
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Download this guide as a printable PDF for offline study.
                    </p>
                    <button
                      onClick={handleSaveAsPDF}
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center mx-auto"
                    >
                      Save as PDF <FaFileAlt className="ml-2" />
                    </button>
                  </div>
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
                <p className="text-lg text-gray-300 mb-8 text-center">
                  Join aspirants who aced the CSIR JSA and Stenographer tests
                  with TypeSprint:
                </p>
                <div className="space-y-8">
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Priya’s Journey to 40 WPM
                    </h3>
                    <p className="text-gray-400">
                      “I started at 20 WPM. TypeSprint’s strict mode and AI
                      feedback helped me hit 40 WPM, clearing the CSIR JSA
                      typing test!”
                    </p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 card">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Amit’s Stenography Success
                    </h3>
                    <p className="text-gray-400">
                      “TypeSprint’s dictation practice got me to 80 WPM with
                      minimal errors. I passed the Junior Stenographer test
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
                <p className="text-lg text-gray-300 mb-8 text-center">
                  Clear your doubts about the CSIR JSA and Stenographer tests
                  with TypeSprint’s expert answers.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      question:
                        "What is the typing speed required for CSIR JSA?",
                      answer:
                        "The test requires 35 WPM in English (10500 KDPH) or 30 WPM in Hindi (9000 KDPH) with 5% max errors for UR/OBC/SC/OH/VH and 7% for ST/HH/Ex-Servicemen.",
                    },
                    {
                      question:
                        "What is the CSIR Junior Stenographer test pattern?",
                      answer:
                        "It involves a 10-minute dictation at 80 WPM, with transcription in 50 minutes (English) or 65 minutes (Hindi), allowing 7% ignorable errors for UR and 10% for reserved categories.",
                    },
                    {
                      question:
                        "How are errors calculated in the CSIR typing test?",
                      answer:
                        "Errors above 5% (UR/OBC/SC/OH/VH) or 7% (ST/HH/Ex-Servicemen) reduce speed. For example, 320 words with 19 errors (5% = 16 ignorable) results in 3 admissible errors, reducing speed to 29 WPM.",
                    },
                    {
                      question: "Can I change the typing test language?",
                      answer:
                        "No, the language (English or Hindi) is fixed based on your application form.",
                    },
                    {
                      question:
                        "What accommodations are available for PwBD candidates?",
                      answer:
                        "PwBD candidates can seek typing exemptions with a medical certificate or use a scribe for stenography, with extra time (e.g., 5 minutes for typing, 70/90 minutes for stenography with scribe).",
                    },
                    {
                      question:
                        "How does TypeSprint help with CSIR preparation?",
                      answer:
                        "TypeSprint offers exam-like typing and dictation tests, AI feedback, Hindi font support, and strict mode to meet CSIR requirements.",
                    },
                    {
                      question: "When is the CSIR JSA test date for 2025?",
                      answer:
                        "Dates are announced post-CBT results. Start practicing now on TypeSprint to be ready!",
                    },
                    {
                      question: "What is KDPH in the CSIR typing test?",
                      answer:
                        "KDPH (Key Depressions Per Hour) measures typing speed. 10500 KDPH (English) = 35 WPM, 9000 KDPH (Hindi) = 30 WPM, assuming 5 key depressions per word.",
                    },
                  ].map((faq, index) => (
                    <div
                      key={index}
                      className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300 card"
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

        {/* Social Sharing Section */}
        {currentUser && (
          <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60 section">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Share This Guide
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Help fellow CSIR aspirants by sharing this guide on social
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
              </div>
            </div>
          </section>
        )}

        {/* Tags Section */}
        {currentUser && (
          <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60 section">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "CSIR JSA Typing Test",
                  "CSIR Stenography Test",
                  "CSIR JSA Typing Speed",
                  "Junior Stenographer Preparation",
                  "Hindi Typing",
                  "English Typing",
                  "Typing Accuracy",
                  "CSIR Exam 2025",
                  "CSIR Typing Error Calculation",
                  "TypeSprint",
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
        <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60 section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {currentUser ? (
              <>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Keep Going, {currentUser?.name || "Champion"}!
                </h3>
                <p className="text-lg text-gray-300 mb-6">
                  You’re on your way to mastering the CSIR JSA and Stenographer
                  tests. Practice daily with TypeSprint to hit 35 WPM and 80 WPM
                  dictation!
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
                  Join Our CSIR JSA Community
                </h3>
                <p className="text-lg text-gray-300 mb-6">
                  Sign up for TypeSprint to access free practice tests, guides,
                  and join thousands preparing for CSIR 2025!
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
              Ready to ace the CSIR JSA typing test? Practice free now!
            </p>
            <button
              onClick={handleStartTest}
              className="px-6 py-2 bg-white text-blue-900 rounded-full font-medium hover:bg-gray-100 transition-all flex items-center"
            >
              Start Test <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
        <BlogInterlink currentSlug="csir-jsa-typing-stenography-test-2025" />
      </div>
    </ErrorBoundary>
  );
};

export default CSIRJSATypingBlog;
