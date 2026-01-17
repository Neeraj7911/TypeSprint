import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  lazy,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaKeyboard,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaQuestionCircle,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

// Lazy-load non-critical component
const SocialSharePDF = lazy(() => import("./SocialSharePDF"));

// Lazy-load html2pdf for PDF generation
const loadHtml2PDF = () => import("html2pdf.js");

// Memoized StatCard to prevent re-renders
const StatCard = memo(({ icon, title, desc }) => (
  <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500 transition-colors duration-300 shadow-md">
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-base">{desc}</p>
  </div>
));

const CBSEJuniorAssistantTypingTest = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [isPolyfillLoaded, setIsPolyfillLoaded] = useState(
    !!window.IntersectionObserver
  );
  const contentRef = useRef(null);
  const sectionRefs = {
    hero: useRef(null),
    stats: useRef(null),
    format: useRef(null),
    tips: useRef(null),
    preview: useRef(null),
    faqs: useRef(null),
  };

  // Load IntersectionObserver polyfill
  useEffect(() => {
    if (!window.IntersectionObserver) {
      const script = document.createElement("script");
      script.src =
        "https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver";
      script.async = true;
      script.onload = () => setIsPolyfillLoaded(true);
      script.onerror = () => {
        console.error("Failed to load IntersectionObserver polyfill");
        setIsPolyfillLoaded(true);
      };
      document.head.appendChild(script);
    }
  }, []);

  // Set up IntersectionObserver for animations
  useEffect(() => {
    if (!isPolyfillLoaded || !window.IntersectionObserver) return;

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
  }, [isPolyfillLoaded]);

  const tips = [
    {
      title: "Practice Daily",
      content:
        "Spend 10-15 minutes daily on TypeSprint to build speed and accuracy for the CBSE Junior Assistant typing test.",
    },
    {
      title: "Prioritize Accuracy",
      content:
        "Aim for error-free typing to meet the 35 WPM (English) or 30 WPM (Hindi) with minimal mistakes.",
    },
    {
      title: "Master Home Row",
      content:
        "Use ASDF and JKL; positions to type efficiently and reduce errors.",
    },
    {
      title: "Simulate Exam Conditions",
      content:
        "Practice with timed 10-minute tests to prepare for the July 5, 2025, exam pressure.",
    },
    {
      title: "Warm Up Your Fingers",
      content:
        "Do finger exercises before practice to boost speed and reduce initial errors.",
    },
  ];

  const faqs = [
    {
      question: "What is the CBSE Junior Assistant typing test format?",
      answer:
        "The test lasts 10 minutes, requiring 35 WPM (English) or 30 WPM (Hindi) with high accuracy on a computer. Candidates type a passage displayed on-screen, with no hard copy provided.",
    },
    {
      question: "Can I use backspace during the test?",
      answer:
        "Yes, backspace is allowed to correct mistakes, but avoid excessive corrections to maintain speed.",
    },
    {
      question: "What are the mistake types evaluated in the test?",
      answer:
        "Full mistakes include omissions, wrong words/figures, spelling errors, or repetitions. Half mistakes include spacing, capitalization, punctuation, transposition, or paragraph errors.",
    },
    {
      question: "What keyboard should I use for practice?",
      answer:
        "Use a standard QWERTY keyboard to match the test environment. Ergonomic keyboards can reduce fatigue.",
    },
    {
      question: "How long should I prepare for the July 5, 2025, test?",
      answer:
        "Practice daily for 4-6 weeks to achieve 35 WPM (English) or 30 WPM (Hindi) with high accuracy.",
    },
  ];

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  const handleStartTest = () =>
    navigate("/typing-test?exam=cbse-junior-assistant");

  const handleSaveAsPDF = async () => {
    try {
      if (!contentRef.current) return;
      window.scrollTo(0, 0);
      const html2pdf = (await loadHtml2PDF()).default;
      const element = contentRef.current;
      const opt = {
        margin: 0.5,
        filename: "CBSE-Junior-Assistant-Typing-Test-Guide.pdf",
        image: { type: "jpeg", quality: 0.9 },
        html2canvas: { scale: 1, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return (
    <div
      ref={contentRef}
      className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden"
    >
      <Helmet>
        <title>
          CBSE Junior Assistant Typing Test Practice: Free Online Tool |
          TypeSprint
        </title>
        <meta
          name="description"
          content="Ace the CBSE Junior Assistant typing test on July 5, 2025, with TypeSprint’s free online practice tool. Achieve 35 WPM (English) or 30 WPM (Hindi) with high accuracy."
        />
        <meta
          name="keywords"
          content="CBSE Junior Assistant typing test, CBSE typing practice, typing speed test, free typing tool, TypeSprint, July 5 2025 typing test"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TypeSprint Team" />
        <link
          rel="canonical"
          href="https://typesprint.live/cbse-junior-assistant-typing-test"
        />
        <meta
          property="og:title"
          content="CBSE Junior Assistant Typing Test Practice: Free Online Tool | TypeSprint"
        />
        <meta
          property="og:description"
          content="Prepare for the CBSE Junior Assistant typing test on July 5, 2025, with TypeSprint’s free tool. Master 35 WPM (English) or 30 WPM (Hindi) now!"
        />
        <meta
          property="og:image"
          content="https://typesprint.live/images/cbse-typing-test.webp"
        />
        <meta
          property="og:url"
          content="https://typesprint.live/cbse-junior-assistant-typing-test"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="preload"
          href="https://typesprint.live/images/cbse-typing-test.webp"
          as="image"
          fetchpriority="high"
        />
        <link
          rel="preload"
          href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
          as="style"
          onload="this.onload=null;this.rel='stylesheet'"
        />
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in { animation: fadeIn 0.7s ease-out forwards; animation-delay: 0.1s; }
          .hero-content { max-width: 100%; }
        `}</style>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "CBSE Junior Assistant Typing Test Practice: Free Online Tool",
            description:
              "Prepare for the CBSE Junior Assistant typing test on July 5, 2025, with TypeSprint’s free practice tool, offering timed tests and expert tips.",
            publisher: {
              "@type": "Organization",
              name: "TypeSprint",
              logo: {
                "@type": "ImageObject",
                url: "https://typesprint.live/images/logo.png",
              },
            },
            dateModified: "2025-07-03",
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer },
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "CBSE Junior Assistant Typing Test Practice: Free Online Tool",
            description:
              "Master the CBSE Junior Assistant typing test on July 5, 2025, with TypeSprint’s free online practice tool. Achieve 35 WPM (English) or 30 WPM (Hindi).",
            author: {
              "@type": "Organization",
              name: "TypeSprint Team",
              url: "https://typesprint.live/about",
            },
            publisher: {
              "@type": "Organization",
              name: "TypeSprint",
              logo: {
                "@type": "ImageObject",
                url: "https://typesprint.live/images/logo.png",
              },
            },
            datePublished: "2025-01-01",
            dateModified: "2025-07-03",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id":
                "https://typesprint.live/cbse-junior-assistant-typing-test",
            },
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section
        id="hero"
        ref={sectionRefs.hero}
        className="relative py-20 md:py-28 flex flex-col items-center text-center px-4 hero-content"
      >
        <div className={`fade-in ${isVisible.hero ? "" : "opacity-0"}`}>
          <FaKeyboard
            className="text-6xl text-cyan-400 mb-6"
            aria-label="Keyboard icon"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            CBSE Junior Assistant Typing Test Practice
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Get ready for the CBSE Junior Assistant typing test on July 5, 2025!
            Master 35 WPM (English) or 30 WPM (Hindi) with TypeSprint’s free
            practice tool. Start typing now and secure your spot!
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto"
            aria-label="Start CBSE typing test"
          >
            Start Typing Now! <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        ref={sectionRefs.stats}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.stats ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Why CBSE Typing Skills Matter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <FaKeyboard
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Keyboard icon"
                    />
                  ),
                  title: "35 WPM English / 30 WPM Hindi",
                  desc: "Meet the CBSE Junior Assistant typing speed requirement.",
                },
                {
                  icon: (
                    <FaClock
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Clock icon"
                    />
                  ),
                  title: "High Accuracy",
                  desc: "Minimize full and half mistakes to pass the test.",
                },
                {
                  icon: (
                    <FaCheckCircle
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Check icon"
                    />
                  ),
                  title: "TypeSprint Advantage",
                  desc: "Real-time feedback to boost speed and accuracy.",
                },
              ].map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Test Format Section */}
      <section
        id="format"
        ref={sectionRefs.format}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.format ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              CBSE Junior Assistant Typing Test Format
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 text-base mb-4">
                The CBSE Junior Assistant typing test, scheduled for July 5,
                2025, evaluates your speed and accuracy. Key details:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-base mb-4">
                <li>
                  <strong>Duration</strong>: 10 minutes to type a passage
                  displayed on-screen.
                </li>
                <li>
                  <strong>Requirements</strong>: 35 WPM (English) or 30 WPM
                  (Hindi), equivalent to 10500/9000 KDPH.
                </li>
                <li>
                  <strong>Mistakes</strong>: Full mistakes (omissions, wrong
                  words) and half mistakes (spacing, punctuation) are evaluated.
                </li>
                <li>
                  <strong>Environment</strong>: Standard QWERTY keyboard, no
                  auto-correct, backspace allowed.
                </li>
                <li>
                  <strong>PwBD</strong>: Visually impaired or orthopedically
                  handicapped candidates get 5 extra minutes; scribes allowed
                  for VI candidates.
                </li>
              </ul>
              <p className="text-gray-300 text-base">
                Start practicing now with{" "}
                <a
                  href="/typing-test?exam=cbse-junior-assistant"
                  className="text-cyan-400 hover:underline"
                >
                  TypeSprint’s timed tests
                </a>{" "}
                to ace the exam! Visit{" "}
                <a
                  href="https://www.cbse.gov.in"
                  className="text-cyan-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CBSE’s official site
                </a>{" "}
                for more details.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Carousel */}
      <section
        id="tips"
        ref={sectionRefs.tips}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.tips ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Tips to Ace the CBSE Typing Test
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500 transition-colors duration-300">
              <h3 className="text-lg font-medium text-white mb-2">
                {tips[currentTip].title}
              </h3>
              <p className="text-gray-400 text-base">
                {tips[currentTip].content}
              </p>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={prevTip}
                className="p-3 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all duration-300 shadow-sm"
                aria-label="Previous tip"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={nextTip}
                className="p-3 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all duration-300 shadow-sm"
                aria-label="Next tip"
              >
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Test Preview Section */}
      <section
        id="preview"
        ref={sectionRefs.preview}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.preview ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Try a CBSE Typing Test Now
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 font-mono text-base mb-4">
                Sample passage: “The Central Board of Secondary Education (CBSE)
                is India’s premier education board, overseeing school education
                and examinations. As a Junior Assistant, you’ll handle
                administrative tasks requiring fast and accurate typing.
                Practice this passage to prepare for the July 5, 2025, typing
                test.”
              </p>
              <button
                onClick={handleStartTest}
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 mx-auto block shadow-lg"
                aria-label="Start CBSE typing test"
              >
                Start Typing Now!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section
        id="faqs"
        ref={sectionRefs.faqs}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.faqs ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500 transition-colors duration-300 mb-4"
              >
                <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                  <FaQuestionCircle
                    className="mr-2 text-cyan-400"
                    aria-label="Question icon"
                  />
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-base">{faq.answer}</p>
              </div>
            ))}
            <p className="text-gray-400 text-sm mt-4 text-center">
              Last updated: July 3, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Social Share and PDF Download */}
      <Suspense
        fallback={
          <div className="text-center py-4 text-gray-400">Loading...</div>
        }
      >
        <SocialSharePDF handleSaveAsPDF={handleSaveAsPDF} />
      </Suspense>

      {/* Footer Callout */}
      <section className="py-12 bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {isAuthenticated ? (
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Welcome Back, {user?.name || "User"}!
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                The July 5, 2025, CBSE typing test is approaching! Track your
                progress on TypeSprint’s dashboard and crush it!
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 shadow-lg"
                aria-label="View dashboard"
              >
                View Your Progress
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Join Thousands Preparing for CBSE 2025
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Sign up for TypeSprint to access free typing tests, track your
                progress, and ace the July 5, 2025, CBSE Junior Assistant test!
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 shadow-lg"
                aria-label="Sign up for TypeSprint"
              >
                Sign Up & Start Typing
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 px-4 z-20 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xl sm:text-2xl font-bold text-center">
            Don’t Wait! Ace the CBSE Typing Test on July 5, 2025!
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md hover:scale-105 animate-pulse"
            aria-label="Start CBSE typing test"
          >
            Start Typing Now! <FaArrowRight className="ml-2 inline" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CBSEJuniorAssistantTypingTest;
