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

// Lazy-load non-critical components
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

// Memoized ExamCard for SSC exam
const ExamCard = memo(({ title, desc, requirements }) => (
  <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 hover:border-cyan-500 transition-colors duration-300 shadow-md">
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-base mb-4">{desc}</p>
    <ul className="list-disc list-inside text-gray-400 text-base">
      {requirements.map((req, index) => (
        <li key={index}>{req}</li>
      ))}
    </ul>
  </div>
));

// Live Typing Preview Component
const TypingPreview = memo(({ onTypingComplete }) => {
  const [input, setInput] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState(null);
  const sampleText =
    "The SSC CGL typing test evaluates your ability to type quickly and accurately to qualify for roles like Data Entry Operator.";

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!startTime) setStartTime(Date.now());

    const wordsTyped = value.trim().split(/\s+/).length;
    const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
    const calculatedWpm =
      timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
    setWpm(calculatedWpm);

    const correctChars = value
      .split("")
      .filter((char, i) => char === sampleText[i]).length;
    setAccuracy(value.length > 0 ? (correctChars / value.length) * 100 : 100);

    if (value === sampleText) {
      onTypingComplete({ wpm: calculatedWpm, accuracy });
    }
  };

  return (
    <div className="bg-gray-800/80 rounded-xl p-6 border border-gray-700/50">
      <p className="text-gray-300 font-mono text-base mb-4">{sampleText}</p>
      <textarea
        value={input}
        onChange={handleInputChange}
        className="w-full p-4 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-cyan-500"
        placeholder="Start typing here..."
        rows={4}
        aria-label="SSC CGL typing test input"
      />
      <div className="flex justify-between mt-4 text-gray-400">
        <span>WPM: {wpm}</span>
        <span>Accuracy: {accuracy.toFixed(1)}%</span>
      </div>
    </div>
  );
});

const SSCTypingTest = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [isPolyfillLoaded, setIsPolyfillLoaded] = useState(
    !!window.IntersectionObserver
  );
  const [typingResult, setTypingResult] = useState(null);
  const contentRef = useRef(null);
  const sectionRefs = {
    hero: useRef(null),
    stats: useRef(null),
    exams: useRef(null),
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

  // Set up IntersectionObserver
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
      title: "Practice Daily for SSC CGL",
      content:
        "Spend 15-20 minutes daily practicing typing tests to achieve 35 WPM in English or 30 WPM in Hindi for SSC CGL.",
    },
    {
      title: "Master QWERTY Keyboard",
      content:
        "Familiarize yourself with the QWERTY keyboard layout to boost speed in SSC CGL English typing tests.",
    },
    {
      title: "Use Phonetic Typing for Hindi",
      content:
        "Type in English (e.g., 'namaste') to get Hindi script using transliteration tools for faster practice.",
    },
    {
      title: "Simulate SSC CGL Conditions",
      content:
        "Practice with 2000 key depressions in 15 minutes to match SSC CGL typing test requirements.",
    },
    {
      title: "Warm Up Your Fingers",
      content:
        "Do finger warm-up exercises to improve speed and reduce errors in SSC CGL typing tests.",
    },
  ];

  const exams = [
    {
      title: "SSC CGL Typing Test",
      desc: "The SSC CGL typing test evaluates typing proficiency for Data Entry Operator and other posts, requiring 35 WPM in English or 30 WPM in Hindi.",
      requirements: [
        "English: 35 WPM",
        "Hindi: 30 WPM",
        "Duration: 15 minutes",
        "Key Depressions: ~2000",
      ],
    },
  ];

  const faqs = [
    {
      question: "What are the rules for the SSC CGL typing test?",
      answer:
        "The SSC CGL typing test requires candidates to type 2000 key depressions (approximately 400 words) in 15 minutes, achieving 35 WPM in English or 30 WPM in Hindi with at least 80% accuracy. Backspace is allowed, but auto-correct and spell-check are disabled.",
    },
    {
      question: "How much WPM is good for SSC CGL?",
      answer:
        "A typing speed of 35 WPM in English or 30 WPM in Hindi is required for SSC CGL. Practicing to achieve 40+ WPM ensures a comfortable margin during the exam.",
    },
    {
      question:
        "What is the typing speed of 2000 key depressions in 15 minutes?",
      answer:
        "In the SSC CGL typing test, 2000 key depressions in 15 minutes equates to approximately 35 WPM in English or 30 WPM in Hindi, as each word is considered 5 key depressions on average.",
    },
    {
      question: "How fast is 40 WPM typing speed?",
      answer:
        "A 40 WPM typing speed means typing 40 words per minute, or about 200 key depressions per minute. This is above the SSC CGL requirement and indicates good proficiency.",
    },
    {
      question: "How do I practice for the SSC CGL typing test online?",
      answer:
        "Use TypeSprint’s free SSC CGL typing test tool to practice with timed 15-minute tests, simulating 2000 key depressions. Focus on QWERTY for English or phonetic typing for Hindi.",
    },
    {
      question: "Can I use Google Input Tools for SSC CGL Hindi typing?",
      answer:
        "Yes, Google Input Tools supports Hindi typing through transliteration, which is great for practice, but SSC CGL tests may require specific software like Mangal font for Hindi.",
    },
  ];

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  const handleStartTest = () => navigate("/exams?search=SSC");

  const handleTypingComplete = (result) => {
    setTypingResult(result);
    if (isAuthenticated) {
      // Simulate saving result to user profile
      console.log("Saving result:", result);
    }
  };

  const handleSaveAsPDF = async () => {
    try {
      if (!contentRef.current) return;
      window.scrollTo(0, 0);
      const html2pdf = (await loadHtml2PDF()).default;
      const element = contentRef.current;
      const opt = {
        margin: 0.5,
        filename: "SSC-CGL-Typing-Test-Practice.pdf",
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
          Typing Test for SSC CGL: Free Online Practice | TypeSprint
        </title>
        <meta
          name="description"
          content="Practice for the SSC CGL typing test with TypeSprint’s free online tool. Achieve 35 WPM in English or 30 WPM in Hindi with 2000 key depressions in 15 minutes. Start now!"
        />
        <meta
          name="keywords"
          content="typing test for SSC CGL, SSC CGL typing test practice, SSC CGL typing test online, SSC CGL typing speed, free SSC CGL typing test, SSC typing test 15 minutes, SSC CGL Hindi typing, SSC CGL English typing, typing test for SSC"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TypeSprint Team" />
        <link
          rel="canonical"
          href="https://typesprint.live/ssc-cgl-typing-test-practice"
        />
        <meta
          property="og:title"
          content="Typing Test for SSC CGL: Free Online Practice Tool"
        />
        <meta
          property="og:description"
          content="Ace the SSC CGL typing test with TypeSprint’s free online practice tool. Achieve 35 WPM in English or 30 WPM in Hindi with real-time feedback."
        />
        <meta
          property="og:image"
          content="https://typesprint.live/images/ssc-cgl-typing-test.webp"
        />
        <meta
          property="og:url"
          content="https://typesprint.live/ssc-cgl-typing-test-practice"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="preload"
          href="https://typesprint.live/images/ssc-cgl-typing-test.webp"
          as="image"
          fetchpriority="high"
        />
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .fade-in { animation: fadeIn 0.7s ease-out forwards; }
          .hero-content { max-width: 100%; }
          .typing-preview { font-family: 'Arial', sans-serif; }
          .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        `}</style>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Typing Test for SSC CGL: Free Online Practice",
            description:
              "Prepare for the SSC CGL typing test with TypeSprint’s free online tool, targeting 35 WPM in English or 30 WPM in Hindi with 2000 key depressions in 15 minutes.",
            publisher: {
              "@type": "Organization",
              name: "TypeSprint",
              logo: {
                "@type": "ImageObject",
                url: "https://typesprint.live/images/logo.png",
              },
            },
            dateModified: "2025-07-08",
            mainEntity: {
              "@type": "SoftwareApplication",
              name: "TypeSprint SSC CGL Typing Tool",
              applicationCategory: "Education",
              operatingSystem: "Web, iOS, Android",
              offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
            },
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
            headline: "Typing Test for SSC CGL: Free Online Practice Tool",
            description:
              "Master the SSC CGL typing test with TypeSprint’s free online tool. Achieve 35 WPM in English or 30 WPM in Hindi with 2000 key depressions in 15 minutes.",
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
            datePublished: "2024-12-01",
            dateModified: "2025-07-08",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://typesprint.live/ssc-cgl-typing-test-practice",
            },
            keywords:
              "typing test for SSC CGL, SSC CGL typing test practice, SSC CGL typing test online, SSC typing test, free SSC CGL typing test",
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
            className="text-6xl text-cyan-400 mb-6 animate-pulse-slow"
            aria-label="Keyboard icon"
            alt="Typing test keyboard icon"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Typing Test for SSC CGL: Free Online Practice
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Ace the SSC CGL typing test with TypeSprint’s free online tool.
            Achieve 35 WPM in English or 30 WPM in Hindi with 2000 key
            depressions in 15 minutes.
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto"
            aria-label="Start SSC CGL typing test"
          >
            Start Free Typing Test <FaArrowRight className="ml-2" />
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
              Why Typing Skills Matter for SSC CGL
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <FaKeyboard
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Keyboard icon"
                      alt="Typing test keyboard icon"
                    />
                  ),
                  title: "35 WPM English / 30 WPM Hindi",
                  desc: "Meet the minimum typing speed for SSC CGL typing tests using QWERTY or Mangal fonts.",
                },
                {
                  icon: (
                    <FaClock
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Clock icon"
                      alt="Typing speed clock icon"
                    />
                  ),
                  title: "80%+ Accuracy",
                  desc: "High accuracy is critical for SSC CGL typing tests to qualify for roles like Data Entry Operator.",
                },
                {
                  icon: (
                    <FaCheckCircle
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Check icon"
                      alt="Typing test success icon"
                    />
                  ),
                  title: "TypeSprint Advantage",
                  desc: "Real-time AI feedback and SSC CGL mock tests to boost your typing speed and accuracy.",
                },
              ].map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exams Section */}
      <section
        id="exams"
        ref={sectionRefs.exams}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.exams ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              SSC CGL Typing Test Overview
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {exams.map((exam, index) => (
                <ExamCard key={index} {...exam} />
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
              SSC CGL Typing Test Format
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 text-base mb-4">
                The SSC CGL typing test evaluates your ability to type
                accurately and quickly. Key details include:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-base mb-4">
                <li>
                  <strong>Duration</strong>: 15 minutes to type ~2000 key
                  depressions.
                </li>
                <li>
                  <strong>Requirements</strong>: 35 WPM (English) or 30 WPM
                  (Hindi) with 80% accuracy.
                </li>
                <li>
                  <strong>Fonts</strong>: QWERTY for English, Mangal for Hindi.
                </li>
                <li>
                  <strong>Environment</strong>: No auto-correct or spell-check;
                  backspace allowed.
                </li>
              </ul>
              <p className="text-gray-300 text-base">
                Practice with{" "}
                <a
                  href="/ssc-cgl-typing-test"
                  className="text-cyan-400 hover:underline"
                >
                  TypeSprint’s SSC CGL typing tests
                </a>{" "}
                to simulate the real exam environment.
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
              Tips to Master SSC CGL Typing Test
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

      {/* Typing Preview Section */}
      <section
        id="preview"
        ref={sectionRefs.preview}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.preview ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Try a Free SSC CGL Typing Test
            </h2>
            <TypingPreview onTypingComplete={handleTypingComplete} />
            {typingResult && (
              <div className="mt-4 text-center">
                <p className="text-lg text-gray-300">
                  Great job! Your WPM: {typingResult.wpm}, Accuracy:{" "}
                  {typingResult.accuracy.toFixed(1)}%
                </p>
                <button
                  className="px-6 py-2 bg-cyan-500 rounded-full text-white font-medium hover:bg-cyan-400 mt-4"
                  onClick={() => setTypingResult(null)}
                  aria-label="Try again"
                >
                  Try Again
                </button>
                <button
                  onClick={handleStartTest}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 mt-4 ml-4"
                  aria-label="Take full SSC CGL typing test"
                >
                  Take Full Test
                </button>
              </div>
            )}
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
                    alt="Question icon"
                  />
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-base">{faq.answer}</p>
              </div>
            ))}
            <p className="text-gray-400 text-sm mt-4 text-center">
              Last updated: July 2025
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
              <h3 className="text-2xl font-semibold text-white mb-4">
                Welcome Back, {user?.name || "User"}!
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Track your SSC CGL typing progress on TypeSprint’s dashboard.
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
                Join SSC CGL Aspirants
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Sign up for TypeSprint to access free SSC CGL typing tests,
                track progress, and join thousands of aspirants.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 shadow-lg"
                aria-label="Sign up for TypeSprint"
              >
                Sign Up Now
              </button>
            </>
          )}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 px-4 z-20 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xl sm:text-2xl font-bold text-center">
            Ready to Ace the SSC CGL Typing Test?
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md hover:scale-105 animate-pulse"
            aria-label="Start SSC CGL typing test"
          >
            Start Test <FaArrowRight className="ml-2 inline" />
          </button>
        </div>
      </div>

      {/* Tags and Keywords Section */}
      <section className="py-8 bg-gray-900/60 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Tags & Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Typing Test for SSC CGL",
              "SSC CGL Typing Test Practice",
              "SSC CGL Typing Test Online",
              "Free SSC CGL Typing Test",
              "SSC CGL Typing Speed",
              "SSC Typing Test 15 Minutes",
              "SSC CGL Hindi Typing",
              "SSC CGL English Typing",
              "Typing Test for SSC",
            ].map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SSCTypingTest;
