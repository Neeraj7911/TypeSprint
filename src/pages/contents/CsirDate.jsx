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

const CSIRJSATypingTest = () => {
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
    notice: useRef(null),
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
        setIsPolyfillLoaded(true); // Proceed to avoid blocking
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
        "Spend 10-15 minutes daily on TypeSprint to build speed and accuracy for the CSIR JSA typing test starting July 2, 2025.",
    },
    {
      title: "Focus on Accuracy",
      content:
        "Prioritize error-free typing to meet the 80%+ accuracy requirement.",
    },
    {
      title: "Master Home Row",
      content:
        "Use ASDF and JKL; positions to type efficiently and reduce errors.",
    },
    {
      title: "Simulate Test Conditions",
      content:
        "Practice with timed tests to prepare for the exam pressure on July 2, 2025.",
    },
    {
      title: "Warm Up Before Testing",
      content:
        "Do finger warm-up exercises to boost speed and minimize errors.",
    },
  ];

  const faqs = [
    {
      question: "When does the CSIR JSA Typing Test 2025 start?",
      answer:
        "The CSIR JSA Typing Test starts on July 2, 2025, in Delhi & NCR, as per the city intimation notice.",
    },
    {
      question: "What is the CSIR JSA typing test format?",
      answer:
        "The test requires typing a passage in 10-15 minutes, achieving 35 WPM (English) or 30 WPM (Hindi) with 80% accuracy on a standard QWERTY keyboard.",
    },
    {
      question: "How can I download my CSIR JSA admit card?",
      answer:
        "E-Admit cards will be available for download from June 28, 2025, on the CSIR-CRRI recruitment portal.",
    },
    {
      question:
        "Can I change my exam date or center for the CSIR JSA Typing Test?",
      answer:
        "No, requests for changes in exam date, shift, or center will not be entertained, as per the CSIR-CRRI notice.",
    },
    {
      question: "How should I prepare for the CSIR JSA Typing Test?",
      answer:
        "Practice daily with TypeSprint’s free timed tests to achieve 35 WPM (English) or 30 WPM (Hindi) with 80% accuracy. Focus on accuracy and simulate test conditions.",
    },
  ];

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  const handleStartTest = () => navigate("/typing-test");

  const handleSaveAsPDF = async () => {
    try {
      if (!contentRef.current) return;
      window.scrollTo(0, 0);
      const html2pdf = (await loadHtml2PDF()).default;
      const element = contentRef.current;
      const opt = {
        margin: 0.5,
        filename: "CSIR-JSA-Typing-Test-2025-Page.pdf",
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
          CSIR JSA Typing Test 2025: City Intimation Out, Exams from July 2 |
          TypeSprint
        </title>
        <meta
          name="description"
          content="CSIR JSA Typing Test 2025 city intimation released! Exams start July 2 in Delhi & NCR. Practice with TypeSprint’s free tool to master 35 WPM (English) or 30 WPM (Hindi) with 80% accuracy."
        />
        <meta
          name="keywords"
          content="CSIR JSA typing test 2025, CSIR typing test practice, city intimation, Delhi NCR typing test, free typing test, TypeSprint, Junior Secretariat Assistant exam, typing speed practice"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TypeSprint Team" />
        <link
          rel="canonical"
          href="https://typesprint.live/CSIR-JSA-typing-test-2025"
        />
        <meta
          property="og:title"
          content="CSIR JSA Typing Test 2025: City Intimation Out, Exams from July 2 | TypeSprint"
        />
        <meta
          property="og:description"
          content="Prepare for the CSIR JSA Typing Test starting July 2, 2025, in Delhi & NCR. Use TypeSprint’s free practice tool to achieve 35 WPM (English) or 30 WPM (Hindi) with 80% accuracy."
        />
        <meta
          property="og:image"
          content="https://typesprint.live/images/csir-jsa-test-2025.webp"
        />
        <meta
          property="og:url"
          content="https://typesprint.live/CSIR-JSA-typing-test-2025"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="preload"
          href="https://typesprint.live/images/csir-jsa-test-2025.webp"
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
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .fade-in { animation: fadeIn 0.7s ease-out forwards; animation-delay: 0.1s; }
          .hero-content { max-width: 100%; }
        `}</style>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "CSIR JSA Typing Test 2025: City Intimation Out, Exams from July 2",
            description:
              "Prepare for the CSIR JSA Typing Test starting July 2, 2025, in Delhi & NCR. Practice with TypeSprint’s free tool to achieve 35 WPM (English) or 30 WPM (Hindi) with 80% accuracy.",
            publisher: {
              "@type": "Organization",
              name: "TypeSprint",
              logo: {
                "@type": "ImageObject",
                url: "https://typesprint.live/images/logo.png",
              },
            },
            dateModified: "2025-06-27",
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
              "CSIR JSA Typing Test 2025: City Intimation Out, Exams from July 2",
            description:
              "Master the CSIR JSA Typing Test starting July 2, 2025, in Delhi & NCR with TypeSprint’s free online practice tool. Achieve 35 WPM (English) or 30 WPM (Hindi) with 80% accuracy.",
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
            datePublished: "2025-06-27",
            dateModified: "2025-06-27",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://typesprint.live/CSIR-JSA-typing-test-2025",
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
            CSIR JSA Typing Test 2025: Start Practicing Now!
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            City intimation released! CSIR JSA Typing Test begins{" "}
            <strong>July 2, 2025</strong> in Delhi & NCR. Master 35 WPM
            (English) or 30 WPM (Hindi) with TypeSprint’s free practice tool.
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto"
            aria-label="Start CSIR JSA typing test"
          >
            Start Free Test Now <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* City Intimation Notice Section */}
      <section
        id="notice"
        ref={sectionRefs.notice}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.notice ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              CSIR JSA Typing Test 2025: City Intimation Update
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500 transition-colors duration-300">
              <p className="text-gray-300 text-base mb-4">
                The CSIR-CRRI has released the city intimation for the Junior
                Secretariat Assistant (JSA) and Junior Stenographer exams. Key
                details:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-base mb-4">
                <li>
                  <strong>Examination Date</strong>: July 2, 2025
                </li>
                <li>
                  <strong>Shift</strong>: Shift 1, Reporting Time: 08:00 AM
                </li>
                <li>
                  <strong>Exam City</strong>: Delhi & NCR
                </li>
                <li>
                  <strong>E-Admit Card</strong>: Available from June 28, 2025,
                  on the CSIR-CRRI recruitment portal
                </li>
                <li>
                  <strong>Contact</strong>: For queries, call the helpdesk at
                  9741158410
                </li>
              </ul>
              <p className="text-gray-300 text-base">
                No changes to exam date, shift, or center are allowed. Start
                practicing now with{" "}
                <a
                  href="/typing-test"
                  className="text-cyan-400 hover:underline"
                >
                  TypeSprint’s free timed tests
                </a>{" "}
                to ensure you’re ready for July 2, 2025!
              </p>
              <button
                onClick={handleStartTest}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 mx-auto block shadow-lg"
                aria-label="Start CSIR JSA typing test"
              >
                Practice Now <FaArrowRight className="ml-2 inline" />
              </button>
            </div>
          </div>
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
              Why CSIR JSA Typing Skills Are Crucial
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
                  desc: "Meet the minimum typing speed for CSIR JSA roles.",
                },
                {
                  icon: (
                    <FaClock
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Clock icon"
                    />
                  ),
                  title: "80%+ Accuracy",
                  desc: "High accuracy is essential to pass the typing test on July 2, 2025.",
                },
                {
                  icon: (
                    <FaCheckCircle
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Check icon"
                    />
                  ),
                  title: "TypeSprint Advantage",
                  desc: "Get real-time AI feedback to boost speed and accuracy.",
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
              CSIR JSA Typing Test Format
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 text-base mb-4">
                The CSIR JSA typing test evaluates your typing speed and
                accuracy on a computer. Key details include:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-base mb-4">
                <li>
                  <strong>Duration</strong>: 10-15 minutes to type a passage.
                </li>
                <li>
                  <strong>Requirements</strong>: 35 WPM (English) or 30 WPM
                  (Hindi) with 80% accuracy.
                </li>
                <li>
                  <strong>Scoring</strong>: WPM = (total characters / 5) /
                  minutes; errors reduce accuracy.
                </li>
                <li>
                  <strong>Environment</strong>: Standard QWERTY keyboard, no
                  auto-correct or spell-check.
                </li>
              </ul>
              <p className="text-gray-300 text-base">
                Don’t wait—start practicing now with{" "}
                <a
                  href="/typing-test"
                  className="text-cyan-400 hover:underline"
                >
                  TypeSprint’s timed tests
                </a>{" "}
                to ace the test on July 2, 2025. Visit{" "}
                <a
                  href="https://www.csir.res.in"
                  className="text-cyan-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CSIR’s official website
                </a>{" "}
                for more details.
              </p>
              <button
                onClick={handleStartTest}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 mx-auto block shadow-lg"
                aria-label="Start CSIR JSA typing test"
              >
                Start Practicing <FaArrowRight className="ml-2 inline" />
              </button>
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
              Top Tips to Ace the CSIR JSA Typing Test
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
              Try a CSIR JSA Typing Test Now
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 font-mono text-base mb-4">
                Sample passage: “The Council of Scientific and Industrial
                Research (CSIR) is India’s premier research organization,
                driving innovation across diverse scientific fields. Its network
                of laboratories conducts cutting-edge research to advance
                technology and knowledge. As a Junior Secretarial Assistant,
                you’ll support administrative tasks by typing documents with
                speed and accuracy. Practice this passage to prepare for the
                CSIR JSA typing test on July 2, 2025.”
              </p>
              <button
                onClick={handleStartTest}
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 mx-auto block shadow-lg"
                aria-label="Start CSIR JSA typing test"
              >
                Start Test Now <FaArrowRight className="ml-2 inline" />
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
              Last updated: June 27, 2025
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
            <>
              <h3 className="text-2 Chichester font-semibold text-white mb-4">
                Welcome Back, {user?.name || "User"}!
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Track your progress on TypeSprint’s dashboard to ace the CSIR
                JSA typing test on July 2, 2025.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 shadow-lg"
                aria-label="View dashboard"
              >
                View Your Progress
              </button>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Join CSIR JSA Aspirants Now
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Sign up for TypeSprint to access free tests, track progress, and
                prepare for the July 2, 2025, CSIR JSA typing test.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 shadow-lg"
                aria-label="Sign up for TypeSprint"
              >
                Sign Up Now
              </button>
            </>
          )}
          <button
            onClick={handleStartTest}
            className="mt-4 px-6 py-2 bg-white text-blue-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md mx-auto block"
            aria-label="Start CSIR JSA typing test"
          >
            Start Free Test <FaArrowRight className="ml-2 inline" />
          </button>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 px-4 z-20 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xl sm:text-2xl font-bold text-center">
            Time’s Ticking! Ace the CSIR JSA Typing Test on July 2, 2025
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md hover:scale-105 animate-pulse"
            aria-label="Start CSIR JSA typing test"
          >
            Start Test Now <FaArrowRight className="ml-2 inline" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSIRJSATypingTest;
