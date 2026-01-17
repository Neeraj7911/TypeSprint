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
  FaLanguage,
  FaTrophy,
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

// Memoized ExamCard for regional exams
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

const KannadaTypingTest = () => {
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
      title: "Practice Kannada Typing Daily",
      content:
        "Spend 10-15 minutes daily on TypeSprint using Nudi fonts to master Kannada typing for KPSC Typist and other Karnataka exams.",
    },
    {
      title: "Master Nudi Keyboard Layout",
      content:
        "Familiarize yourself with the Nudi keyboard layout, widely used for Kannada typing in government exams.",
    },
    {
      title: "Use Phonetic Typing",
      content:
        "Type in English (e.g., 'namaskara') to get Kannada script (ನಮಸ್ಕಾರ) using transliteration tools for faster practice.",
    },
    {
      title: "Simulate Exam Conditions",
      content:
        "Practice with timed Kannada typing tests (30 WPM, Nudi fonts) to prepare for KPSC Typist and Karnataka High Court Clerk exams.",
    },
    {
      title: "Warm Up Fingers",
      content:
        "Do finger warm-up exercises to improve speed and reduce errors in Kannada typing.",
    },
  ];

  const regionalExams = [
    {
      title: "KPSC Typist Exam",
      desc: "The Karnataka Public Service Commission (KPSC) Typist exam requires proficiency in Kannada typing using Nudi fonts, critical for administrative roles in Karnataka.",
      requirements: [
        "English: 35 WPM",
        "Kannada: 30 WPM",
        "Fonts: Nudi",
        "Focus: Kannada typing",
      ],
    },
    {
      title: "Karnataka High Court Clerk",
      desc: "The Karnataka High Court Clerk exam tests typing skills, with Kannada typing as an optional component using Nudi fonts.",
      requirements: [
        "English: 35 WPM",
        "Kannada: 30 WPM",
        "Fonts: Nudi",
        "Kannada: Optional",
      ],
    },
    {
      title: "Bengaluru District Court Clerk",
      desc: "This exam emphasizes Kannada typing skills for clerical roles in Bengaluru, using Nudi fonts.",
      requirements: [
        "English: 35 WPM",
        "Kannada: 30 WPM",
        "Fonts: Nudi",
        "Focus: Kannada typing",
      ],
    },
    {
      title: "Mysuru Municipal Corporation DEO",
      desc: "The Data Entry Operator (DEO) role requires Kannada typing as an optional skill, using Nudi fonts.",
      requirements: [
        "English: 35 WPM",
        "Kannada: 30 WPM",
        "Fonts: Nudi",
        "Kannada: Optional",
      ],
    },
  ];

  const faqs = [
    {
      question: "How do I practice Kannada typing online?",
      answer:
        "Use TypeSprint’s free Kannada typing tool to practice with Nudi fonts or phonetic typing. Type in English (e.g., 'dhanyavada' for ಧನ್ಯವಾದ) and select from suggestions.",
    },
    {
      question: "What is the Nudi keyboard layout?",
      answer:
        "Nudi is a standard Kannada typing keyboard layout developed by the Karnataka government, used in exams like KPSC Typist and Karnataka High Court Clerk. Download it for offline practice.",
    },
    {
      question: "Can I use Google Input Tools for Kannada typing?",
      answer:
        "Yes, Google Input Tools supports Kannada typing through transliteration and voice typing, ideal for beginners.",
    },
    {
      question: "What are the requirements for KPSC Typist typing test?",
      answer:
        "The KPSC Typist exam requires 35 WPM in English and 30 WPM in Kannada with 80% accuracy, using Nudi fonts.",
    },
    {
      question: "How can I improve my Kannada typing speed?",
      answer:
        "Practice daily with TypeSprint’s timed tests, focus on Nudi keyboard mastery, and use phonetic typing for quick learning. Aim for 4-6 weeks of consistent practice.",
    },
  ];

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  const handleStartTest = () => navigate("/exams?search=kar");

  const handleSaveAsPDF = async () => {
    try {
      if (!contentRef.current) return;
      window.scrollTo(0, 0);
      const html2pdf = (await loadHtml2PDF()).default;
      const element = contentRef.current;
      const opt = {
        margin: 0.5,
        filename: "Kannada-Typing-Test-Practice.pdf",
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
          Kannada Typing Test Practice: Free Online Tool for KPSC, Karnataka
          Exams | TypeSprint
        </title>
        <meta
          name="description"
          content="Master Kannada typing for KPSC Typist, Karnataka High Court Clerk, Bengaluru District Court Clerk, and Mysuru DEO exams with TypeSprint’s free online tool. Practice with Nudi fonts, phonetic typing, and timed tests to achieve 30 WPM."
        />
        <meta
          name="keywords"
          content="Kannada typing online, Kannada typing test, Kannada typing in Nudi, Kannada typing keyboard, English to Kannada typing, Kannada typing software, KPSC Typist, Karnataka High Court Clerk, Bengaluru District Court Clerk, Mysuru Municipal Corporation DEO, Nudi fonts, Kannada typing practice, Kannada typing speed test"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TypeSprint Team" />
        <link
          rel="canonical"
          href="https://typesprint.live/kannada-typing-test-practice"
        />
        <meta
          property="og:title"
          content="Kannada Typing Test Practice: Free Online Tool for Karnataka Exams"
        />
        <meta
          property="og:description"
          content="Prepare for KPSC Typist, Karnataka High Court Clerk, and other Karnataka exams with TypeSprint’s free Kannada typing practice tool. Achieve 30 WPM with Nudi fonts."
        />
        <meta
          property="og:image"
          content="https://typesprint.live/images/kannada-typing-test.webp"
        />
        <meta
          property="og:url"
          content="https://typesprint.live/kannada-typing-test-practice"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="preload"
          href="https://typesprint.live/images/kannada-typing-test.webp"
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
          .typing-preview { font-family: 'Nudi', sans-serif; }
        `}</style>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Kannada Typing Test Practice: Free Online Tool",
            description:
              "Prepare for KPSC Typist, Karnataka High Court Clerk, and other Karnataka exams with TypeSprint’s free Kannada typing practice tool.",
            publisher: {
              "@type": "Organization",
              name: "TypeSprint",
              logo: {
                "@type": "ImageObject",
                url: "https://typesprint.live/images/logo.png",
              },
            },
            dateModified: "2025-06-25",
            mainEntity: {
              "@type": "SoftwareApplication",
              name: "TypeSprint Kannada Typing Tool",
              applicationCategory: "Education",
              operatingSystem: "Web, iOS, Android",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
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
            headline: "Kannada Typing Test Practice for Karnataka Exams",
            description:
              "Master Kannada typing for KPSC Typist, Karnataka High Court Clerk, Bengaluru District Court Clerk, and Mysuru DEO exams with TypeSprint’s free tool.",
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
            dateModified: "2025-06-25",
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": "https://typesprint.live/kannada-typing-test-practice",
            },
            keywords:
              "Kannada typing online, Kannada typing test, Kannada typing in Nudi, Kannada typing keyboard, English to Kannada typing, KPSC Typist, Nudi fonts",
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
            alt="Kannada typing keyboard icon"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Kannada Typing Test Practice for Karnataka Exams
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Master Kannada typing for KPSC Typist, Karnataka High Court Clerk,
            Bengaluru District Court Clerk, and Mysuru DEO exams with
            TypeSprint’s free online tool. Practice with Nudi fonts and achieve
            30 WPM.
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center mx-auto"
            aria-label="Start Kannada typing test"
          >
            Start Free Kannada Test <FaArrowRight className="ml-2" />
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
              Why Kannada Typing Skills Matter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <FaKeyboard
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Keyboard icon"
                      alt="Kannada Nudi keyboard icon"
                    />
                  ),
                  title: "30 WPM Kannada / 35 WPM English",
                  desc: "Meet the minimum typing speed for Karnataka government exams using Nudi fonts.",
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
                  desc: "High accuracy is critical for KPSC Typist and other Karnataka exams.",
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
                  desc: "Real-time AI feedback and Nudi font support for Kannada typing practice.",
                },
              ].map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regional Exams Section */}
      <section
        id="exams"
        ref={sectionRefs.exams}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.exams ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Karnataka Regional Typing Exams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regionalExams.map((exam, index) => (
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
              Kannada Typing Test Format
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 text-base mb-4">
                The Kannada typing test for Karnataka exams evaluates your
                ability to type in Kannada using Nudi fonts or phonetic typing.
                Key details include:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-base mb-4">
                <li>
                  <strong>Duration</strong>: 10-15 minutes to type a passage.
                </li>
                <li>
                  <strong>Requirements</strong>: 30 WPM (Kannada) or 35 WPM
                  (English) with 80% accuracy.
                </li>
                <li>
                  <strong>Fonts</strong>: Nudi fonts for Kannada; standard
                  QWERTY for English.
                </li>
                <li>
                  <strong>Environment</strong>: No auto-correct or spell-check;
                  backspace allowed for corrections.
                </li>
              </ul>
              <p className="text-gray-300 text-base">
                Practice with{" "}
                <a
                  href="/kannada-typing-test"
                  className="text-cyan-400 hover:underline"
                >
                  TypeSprint’s Kannada typing tests
                </a>{" "}
                to simulate the real exam environment. Download Nudi fonts from{" "}
                <a
                  href="https://kannada.indiatyping.com"
                  className="text-cyan-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  IndiaTyping
                </a>
                {/* Download link removed from inline text for syntax correctness */}
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
              Tips to Master Kannada Typing
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

      {/* Kannada Typing Preview Section */}
      <section
        id="preview"
        ref={sectionRefs.preview}
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.preview ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Try a Kannada Typing Test
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 font-mono text-base mb-4 typing-preview">
                Sample passage: “ಕರ್ನಾಟಕ ಸರ್ಕಾರವು ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಡಳಿತದಲ್ಲಿ
                ಬಳಸಲು ಒತ್ತು ನೀಡುತ್ತದೆ. ಕೆಪಿಎಸ್‌ಸಿ ಟೈಪಿಸ್ಟ್ ಮತ್ತು ಇತರ
                ಪರೀಕ್ಷೆಗಳಿಗೆ ಕನ್ನಡ ಟೈಪಿಂಗ್ ಕೌಶಲ್ಯ ಅಗತ್ಯವಾಗಿದೆ. ನುಡಿ ಫಾಂಟ್‌ಗಳನ್ನು
                ಬಳಸಿ 30 WPM ಸಾಧಿಸಲು ಈಗ ಪ್ರಾಕ್ಟೀಸ್ ಮಾಡಿ.”
              </p>
              <p className="text-gray-400 text-base mb-4">
                Type the above passage or use phonetic typing (e.g., "Karnataka"
                for ಕರ್ನಾಟಕ). Download Nudi fonts for authentic practice.
              </p>
              <button
                onClick={handleStartTest}
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 mx-auto block shadow-lg"
                aria-label="Start Kannada typing test"
              >
                Start Kannada Test Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section (Imaginative Addition) */}
      <section
        id="leaderboard"
        className="py-16 bg-gray-900/60 backdrop-blur-sm"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`fade-in ${isVisible.preview ? "" : "opacity-0"}`}>
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Kannada Typing Leaderboard
            </h2>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50">
              <p className="text-gray-300 text-base mb-4">
                Compete with other Kannada typists and see where you stand! Top
                performers in our Kannada typing tests (30 WPM, Nudi fonts) are
                showcased here.
              </p>
              <ul className="list-none text-gray-400 text-base">
                <li className="flex items-center mb-2">
                  <FaTrophy
                    className="text-yellow-400 mr-2"
                    alt="Trophy icon"
                  />
                  1. User123 - 38 WPM, 95% Accuracy
                </li>
                <li className="flex items-center mb-2">
                  <FaTrophy className="text-gray-400 mr-2" alt="Trophy icon" />
                  2. KannadaStar - 35 WPM, 92% Accuracy
                </li>
                <li className="flex items-center mb-2">
                  <FaTrophy
                    className="text-orange-400 mr-2"
                    alt="Trophy icon"
                  />
                  3. TypistGuru - 32 WPM, 90% Accuracy
                </li>
              </ul>
              <button
                onClick={handleStartTest}
                className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-white font-medium hover:from-cyan-300 hover:to-blue-400 transition-all duration-300 mx-auto block shadow-lg"
                aria-label="Join leaderboard"
              >
                Join the Leaderboard
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
                    alt="Question icon"
                  />
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-base">{faq.answer}</p>
              </div>
            ))}
            <p className="text-gray-400 text-sm mt-4 text-center">
              Last updated: June 2025
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
                Track your Kannada typing progress on TypeSprint’s dashboard to
                ace Karnataka exams.
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
                Join Karnataka Exam Aspirants
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Sign up for TypeSprint to access free Kannada typing tests,
                track progress, and join thousands of aspirants.
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
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 px-4 z-20 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xl sm:text-2xl font-bold text-center">
            Ready to Ace Kannada Typing for Karnataka Exams?
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md hover:scale-105 animate-pulse"
            aria-label="Start Kannada typing test"
          >
            Start Test <FaArrowRight className="ml-2 inline" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KannadaTypingTest;
