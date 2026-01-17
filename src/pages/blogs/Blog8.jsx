import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
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
  FaTrophy,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
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

// Lazy load Chart.js components
const Bar = lazy(() =>
  import("react-chartjs-2").then((module) => ({ default: module.Bar }))
);

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

const KannadaTypingBlog2025 = () => {
  const { currentUser } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();
  const contentRef = useRef(null);
  const canvasRef = useRef(null);
  const [isVisible, setIsVisible] = useState({});
  const [currentTip, setCurrentTip] = useState(0);
  const [progress, setProgress] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  const sectionRefs = {
    hero: useRef(null),
    focusAreas: useRef(null),
    typingTest: useRef(null),
    evaluation: useRef(null),
    tips: useRef(null),
    quiz: useRef(null),
    countdown: useRef(null),
    success: useRef(null),
    challenge: useRef(null),
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

  // Countdown Timer to August 1, 2025
  useEffect(() => {
    const targetDate = new Date("2025-08-01T00:00:00");
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
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  // Canvas for Typing Speed Visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawSpeedMeter = (wpm) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(100, 100, 80, 0, Math.PI * 2);
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 10;
      ctx.stroke();

      ctx.beginPath();
      const angle = (wpm / 50) * Math.PI * 2; // Max 50 WPM
      ctx.arc(100, 100, 80, -Math.PI / 2, -Math.PI / 2 + angle);
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 10;
      ctx.stroke();

      ctx.font = "20px Arial";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.fillText(`${wpm} WPM`, 100, 110);
    };

    drawSpeedMeter(30); // Default: 30 WPM
  }, []);

  const tips = [
    {
      title: "Every Day Practice Kannada Typing",
      content:
        "Work towards mastering Nudi fonts to get to 30 WPM within exams for KPSC Typist and Karnataka High Court Clerk; spend just 15-20 minutes every day on TypeSprint.",
    },
    {
      title: "Master Nudi Keyboard Layout",
      content:
        "Familiarize yourself with the Nudi keyboard, standard for Karnataka exams, to type Kannada letters accurately.",
    },
    {
      title: "Leverage Phonetic Typing",
      content:
        "Use English-to-Kannada transliteration (e.g., 'namskara' for ನಮಸ್ಕಾರ) on TypeSprint or Google Input Tools for faster learning.",
    },
    {
      title: "Simulate Exam Conditions",
      content:
        "Practice 10-minute timed tests with Nudi fonts to mirror KPSC Typist and Bengaluru District Court Clerk test setups.",
    },
    {
      title: "Improve Accuracy",
      content:
        "Focus on 80%+ accuracy by typing slowly initially, then increase speed with TypeSprint’s AI error analysis.",
    },
  ];

  const faqs = [
    {
      question: "What is KPSC Typist’s Kannada typing speed benchmark?",
      answer:
        "You need 30 WPM in Kannada using Nudi fonts with at least 80% accuracy over 10-15 minutes.",
    },
    {
      question: "How do I get Nudi fonts for download?",
      answer:
        "Download Nudi fonts from official Karnataka government websites or trusted sites like IndiaTyping.com. Install them on your computer for offline practice.",
    },
    {
      question:
        "Is Kannada typing included in the examination for officers from Karnataka?",
      answer:
        "Yes, exams like KPSC Typist and Bengaluru District Court Clerk require Kannada typing using Nudi fonts, while Karnataka High Court Clerk and Mysuru DEO offer it as optional.",
    },
    {
      question:
        "In what ways does Google Input Tools assist with Kannada typing?",
      answer:
        "Google Input Tools allows phonetic typing (e.g., 'dhanyavada' for ಧನ್ಯವಾದ) and voice input, ideal for beginners preparing for Karnataka exams.",
    },
    {
      question:
        "What period of time is ideal for preparing for Kannada typing exams?",
      answer:
        "Aim for 4-6 weeks of daily practice on TypeSprint to achieve 30 WPM in Kannada with high accuracy.",
    },
  ];

  const quizQuestions = [
    {
      question:
        "What is the KPSC Typist minimum speed requirement in Kannada typing?",
      options: ["25 WPM", "30 WPM", "35 WPM", "40 WPM"],
      correct: 1,
    },
    {
      question: "Which font is used for Kannada Typing in Karnataka Exams?",
      options: ["Arial", "Mangal", "Nudi", "Times New Roman"],
      correct: 2,
    },
    {
      question:
        "Which of the following exams has optional Kannada typing as one of its components?",
      options: [
        "KPSC Typist",
        "Bengaluru District Court Clerk",
        "Karnataka High Court Clerk",
        "All of the above",
      ],
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

  const handleStartTest = () =>
    navigate("/kannada-typing-test?exam=kpsc-typist");
  const handleLogin = () =>
    navigate("/login", { state: { from: location.pathname } });

  const handleSaveAsPDF = async () => {
    if (!contentRef.current) return;
    window.scrollTo(0, 0);
    try {
      const html2pdf = (await loadHtml2PDF()).default;
      const element = contentRef.current;
      const opt = {
        margin: 0.5,
        filename: "Kannada-Typing-Guide-2025.pdf",
        image: { type: "jpeg", quality: 0.9 },
        html2canvas: { scale: 1, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF error:", err);
      setPdfError("Failed to generate PDF. Please try again later.");
    }
  };

  const shareUrl = "https://typesprint.live/blogs/kannada-typing-guide-2025";
  const shareTitle =
    "Master Kannada Typing for Karnataka Exams with TypeSprint!";

  // Memoized Chart Data
  const chartData = React.useMemo(
    () => ({
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Kannada WPM",
          data: [20, 24, 27, 30],
          backgroundColor: "rgba(34, 211, 238, 0.6)",
          borderColor: "rgba(34, 211, 238, 1)",
          borderWidth: 1,
        },
        {
          label: "English WPM",
          data: [25, 28, 32, 35],
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderColor: "rgba(59, 130, 246, 1)",
          borderWidth: 1,
        },
      ],
    }),
    []
  );

  // Memoized Chart Options
  const chartOptions = React.useMemo(
    () => ({
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Words Per Minute (WPM)" },
        },
        x: { title: { display: true, text: "Practice Time" } },
      },
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Kannada Typing Speed Progress Over 4 Weeks",
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    }),
    []
  );

  return (
    <ErrorBoundary>
      <div
        ref={contentRef}
        className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-x-hidden"
      >
        <Helmet>
          <title>
            Master Kannada Typing for Karnataka Exams in 2025: Ultimate Guide |
            TypeSprint
          </title>
          <meta
            name="description"
            content="Prepare for KPSC Typist, Karnataka High Court Clerk, Bengaluru District Court Clerk, and Mysuru DEO exams using TypeSprint's free Kannada typing practice. Gain QWERTY font comfort with our interactive quizzes and expert strategies!"
          />
          <meta
            name="keywords"
            content="Kannada typing online, Kannada typing test, Kannada typing in Nudi, KPSC Typist, Karnataka High Court Clerk, Nudi fonts, Kannada typing practice"
          />
          <meta name="author" content="TypeSprint Team" />
          <meta name="robots" content="index, follow" />
          <link
            rel="canonical"
            href="https://typesprint.live/blogs/kannada-typing-guide-2025"
          />
          <meta
            property="og:title"
            content="Master Kannada Typing for Karnataka Exams in 2025: Ultimate Guide | TypeSprint"
          />
          <meta
            property="og:description"
            content="Prepare for KPSC Typist, Karnataka High Court Clerk, Bengaluru District Court Clerk, and Mysuru DEO exams using TypeSprint's free Kannada typing practice."
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/kannada-typing-hero.webp"
          />
          <meta
            property="og:url"
            content="https://typesprint.live/blogs/kannada-typing-guide-2025"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:image"
            content="https://typesprint.live/images/default-og-image.webp"
          />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline:
                "Master Kannada Typing for Karnataka Exams in 2025: Ultimate Guide",
              description:
                "Prepare for KPSC Typist, Karnataka High Court Clerk, Bengaluru District Court Clerk, and Mysuru DEO exams using TypeSprint's free Kannada typing practice.",
              author: { "@type": "Organization", name: "TypeSprint Team" },
              publisher: {
                "@type": "Organization",
                name: "TypeSprint",
                logo: {
                  "@type": "ImageObject",
                  url: "https://typesprint.live/images/logo.png",
                },
              },
              datePublished: "2025-06-25",
              dateModified: "2025-06-25",
              image: "https://typesprint.live/images/kannada-typing-hero.webp",
              url: "https://typesprint.live/blogs/kannada-typing-guide-2025",
              mainEntityOfPage: {
                "@type": "FAQPage",
                mainEntity: faqs.map((faq) => ({
                  "@type": "Question",
                  name: faq.question,
                  acceptedAnswer: { "@type": "Answer", text: faq.answer },
                })),
              },
              keywords:
                "Kannada typing online, Kannada typing test, Kannada typing in Nudi, KPSC Typist, Nudi fonts, Kannada typing practice",
            })}
          </script>
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "TypeSprint Kannada Typing Tool",
              applicationCategory: "Education",
              operatingSystem: "Web, iOS, Android",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
            })}
          </script>
          <style>{`
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
              .typing-preview { font-family: 'Nudi', sans-serif; }
            }
            details[open] summary::after { content: "−"; }
            details summary::after { content: "+"; }
            summary { display: flex; justify-content: space-between; align-items: center; }
          `}</style>
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
              aria-label="Kannada typing keyboard icon"
              alt="Kannada typing keyboard icon"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Master Kannada Typing for Karnataka Exams in 2025: Ultimate
                Guide
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Prepare for KPSC Typist, Karnataka High Court Clerk, Bengaluru
              District Court Clerk, and Mysuru DEO exams using TypeSprint’s free
              Kannada typing practice. Gain QWERTY font comfort with our
              interactive quizzes and expert strategies!
            </p>
            {currentUser ? (
              <button
                onClick={handleStartTest}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                aria-label="Start Kannada typing practice"
              >
                Start Practice on Kannada Typing
                <FaArrowRight
                  className="ml-2"
                  aria-label="Navigate to typing test"
                  alt="Right arrow icon"
                />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                aria-label="Log in to unlock guide"
              >
                Log In to Unlock Guide
                <FaArrowRight
                  className="ml-2"
                  aria-label="Navigate to login"
                  alt="Right arrow icon"
                />
              </button>
            )}
            <img
              src="https://typesprint.live/images/kannada-typing-hero.webp"
              alt="Kannada Typing Preparation for Karnataka Exams 2025"
              className="mt-6 max-w-full h-auto rounded-lg shadow-lg mx-auto"
              loading="lazy"
            />
          </div>
        </section>

        {/* Focus Areas Section */}
        <section
          id="focusAreas"
          ref={sectionRefs.focusAreas}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.focusAreas
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Focus Areas for the Karnataka Exams
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Karnataka examinations like KPSC Typist or Karnataka High Court
                Clerk need proficiency in Kannada typing with a certain level of
                skill. Here are pointers to focus so you are ready by 2025.
              </p>
              <div className="space-y-6">
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Exam Summary
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>
                      <strong>KPSC Typist</strong>: Requires proficient Nudi
                      font usage at a minimum of 30 WPM in Kannada and 35 WPM in
                      English.
                    </li>
                    <li>
                      <strong>Karnataka High Court Clerk</strong>: Optional but
                      requires proficiency at Nudi fonts for 30 WPM.
                    </li>
                    <li>
                      <strong>Bengaluru District Court Clerk</strong>: Emphasis
                      is primarily placed on typing in Kannada at a speed of 30
                      WPM using Nudi fonts.
                    </li>
                    <li>
                      <strong>Mysuru DEO</strong>: Optional but any working
                      knowledge over 30 WPM using Nudi fonts is appreciated.
                    </li>
                  </ul>
                </div>
                <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Incentives for Early Preparation
                  </h3>
                  <p className="text-gray-300">
                    With all hurdles cleared after the exam occurs post August
                    2025, achieving fluency and speed over Nudi typing would
                    have far more benefits down the line.
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
                Overcoming the Mastery Challenges
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Karnataka’s professional licenses require passing skills testing
                utilizing QWERTY or Nudi keyboards capped between ten to fifteen
                minute intervals where candidates must meet predetermined
                thresholds; failure results in disqualification.
              </p>
              {currentUser ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {[
                      {
                        icon: FaKeyboard,
                        title: "Speed Requirements",
                        desc: "For Kannada, 30 WPM and for English, 35 WPM, both sustained for a duration of 10-15 minutes.",
                      },
                      {
                        icon: FaClock,
                        title: "Test Duration",
                        desc: "Backspace-enabled 10 to 15-minute test.",
                      },
                      {
                        icon: FaCheckCircle,
                        title: "Font & Setup",
                        desc: "Nudi fonts for Kannada; QWERTY keyboard layout for English.",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all"
                      >
                        <div className="flex justify-center mb-4">
                          <item.icon
                            className="h-12 w-12 text-cyan-400"
                            aria-label={`${item.title} icon`}
                            alt={`${item.title} icon`}
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
                      TypeSprint has a lot of passages but do focus on the
                      promised word count range of 300-400 words in Kannada.
                    </li>
                    <li>
                      Nudi Fonts can be downloaded from IndiaTyping.com for
                      immersion practice.
                    </li>
                    <li>
                      Remember to use phonetic inputs such as 'karnataka' for
                      faster learning curves.
                    </li>
                    <li>
                      AI feedback focused sessions with TypeSprint help reduce
                      mistakes greatly so make sure to try that out.
                    </li>
                    <li>
                      Digitally handwritten passages placed under deadlines also
                      train muscle memory while boosting speed and precision.
                    </li>
                  </ul>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Sample Kannada Passage
                  </h3>
                  <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                    <p className="text-gray-300 font-mono typing-preview">
                      ಕರ್ನಾಟಕ ಸರ್ಕಾರವು ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಆಡಳಿತದಲ್ಲಿ ಬಳಸಲು ಒತ್ತು
                      ನೀಡುತ್ತದೆ. ಕೆಪಿಎಸ್‌ಸಿ ಟೈಪಿಸ್ಟ್ ಮತ್ತು ಇತರ ಪರೀಕ್ಷೆಗಳಿಗೆ
                      ಕನ್ನಡ ಟೈಪಿಂಗ್ ಕೌಶಲ್ಯ ಅಗತ್ಯವಾಗಿದೆ. ನುಡಿ ಫಾಂಟ್‌ಗಳನ್ನು ಬಳಸಿ
                      30 WPM ಸಾಧಿಸಲು ಈಗ ಪ್ರಾಕ್ಟೀಸ್ ಮಾಡಿ.
                    </p>
                    <button
                      onClick={handleStartTest}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
                      aria-label="Practice this Kannada passage"
                    >
                      Practice This Passage
                    </button>
                  </div>
                  <button
                    onClick={handleStartTest}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Start free Kannada practice"
                  >
                    Start Free Practice
                    <FaArrowRight
                      className="ml-2"
                      aria-label="Navigate to typing test"
                      alt="Right arrow icon"
                    />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <FaLock
                    className="h-12 w-12 text-cyan-400 mx-auto mb-4"
                    aria-label="Access locked icon"
                    alt="Access locked icon"
                  />
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Unlock the Full Kannada Typing Guide
                  </h3>
                  <p className="text-lg text-gray-300 mb-6">
                    Sign in to TypeSprint to access tips, sample passages,
                    practice tests, and more for Karnataka exams.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to continue"
                  >
                    Log In to Continue
                    <FaArrowRight
                      className="ml-2"
                      aria-label="Navigate to login"
                      alt="Right arrow icon"
                    />
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
                Assessment of the Kannada Typing Tests has Been Understood
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Karnataka typing tests evaluate speed and accuracy using Nudi
                fonts for Kannada. Here’s how performance is measured along with
                illustrative examples.
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
                          <strong>Gross WPM</strong>: Total Words / Time.
                        </li>
                        <li>
                          <strong>Net WPM</strong>: Correct Words / Time.
                        </li>
                        <li>
                          <strong>Accuracy</strong>: (Net WPM * 100) / Gross
                          WPM.
                        </li>
                        <li>
                          <strong>Requirement</strong>: Minimum 30 WPM in
                          Kannada with an accuracy rate above 80 percent.
                        </li>
                      </ul>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Illustrative Example Calculation
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          <strong>Candidate A</strong>: Typed 310 Kannada words
                          in 10 minutes with 2 errors. GWPM = 31, NWPM = 30.8,
                          Accuracy = 99.35%. <strong>Pass</strong>.
                        </li>
                        <li>
                          <strong>Candidate B</strong>: Typed 350 Kannada words
                          in 10 minutes, all correct. GWPM = 35, NWPM = 35,
                          Accuracy = 100%. <strong>Pass</strong>.
                        </li>
                        <li>
                          <strong>Candidate C</strong>: Typed 280 Kannada words
                          in 10 minutes, all correct. GWPM = 28, NWPM = 28,
                          Accuracy = 100%. <strong>Fail</strong>.
                        </li>
                      </ul>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Common Mistakes
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          Distractions caused by pressing the backspace key too
                          often.
                        </li>
                        <li>Lack of focus on accuracy.</li>
                        <li>Excessive speed resulting in numerous errors.</li>
                      </ul>
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mt-8 mb-4 text-center">
                    Monitor Your Typewriting Progress In Kannada
                  </h3>
                  <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="h-64 relative">
                      <Suspense fallback={<div>Loading chart...</div>}>
                        <Bar data={chartData} options={chartOptions} />
                      </Suspense>
                      {typeof window !== "undefined" &&
                        !window.HTMLCanvasElement && (
                          <p className="text-red-500">
                            Canvas not supported in this browser.
                          </p>
                        )}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mt-8 mb-4 text-center">
                    Track And Visualize Your Typing Speed
                  </h3>
                  <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <canvas
                      ref={canvasRef}
                      width={200}
                      height={200}
                      aria-label="Typing speed meter"
                    ></canvas>
                    <p className="text-gray-300 text-center mt-4">
                      To see your Kannada typing speed, a dynamic meter is
                      available!
                    </p>
                  </div>
                  <p className="text-gray-300 text-center mt-6">
                    Attaining a proficient level of 30 WPM in Kannada along with
                    precision using TypeSprint’s AI feedback is possible –
                    achieve it!
                  </p>
                  <button
                    onClick={handleStartTest}
                    className="mt-6 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Smart practice with feedback"
                  >
                    Smart Practice With Feedback
                    <FaArrowRight
                      className="ml-2"
                      aria-label="Navigate to typing test"
                      alt="Right arrow icon"
                    />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to view evaluation criteria and sample calculations.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to continue"
                  >
                    Log In to Continue
                    <FaArrowRight
                      className="ml-2"
                      aria-label="Navigate to login"
                      alt="Right arrow icon"
                    />
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
                Absolute Best Tips To Master Kannada Typing
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Applying these advices will help improve your skills towards
                typing in the Kannada language.
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
                    <FaArrowLeft
                      aria-label="Previous tip icon"
                      alt="Left arrow icon"
                    />
                  </button>
                  <button
                    onClick={nextTip}
                    className="px-4 py-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all"
                    aria-label="Next tip"
                  >
                    <FaArrowRight
                      aria-label="Next tip icon"
                      alt="Right arrow icon"
                    />
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
                Test Your Skills on Kannada Typing
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Take this short 3-question quiz to check what you can remember
                from the typing tests in Kannada.
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
                                aria-label={`Option ${option}`}
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
                            ? "Great job! You’re ready for Karnataka typing tests!"
                            : "Nice try! Practice more to ace the Kannada typing tests."}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to take the quiz and test your Kannada typing
                    knowledge!
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to take quiz"
                  >
                    Log In to Take Quiz
                    <FaArrowRight
                      className="ml-2"
                      aria-label="Navigate to login"
                      alt="Right arrow icon"
                    />
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
                Countdown to Karnataka Exams
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                The expected dates for KPSC and other examinations are around
                August 2025. It’s never too late to start your typing practice!
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
                Practice Now
                <FaArrowRight
                  className="ml-2"
                  aria-label="Navigate to practice"
                  alt="Right arrow icon"
                />
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
                TypeSprint Users Speak About Their Success
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Listen to those who succeeded in passing the typing test through
                TypeSprint.
              </p>
              {currentUser ? (
                <>
                  <div className="space-y-6">
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Priya’s KPSC Focused Test
                      </h3>
                      <p className="text-gray-300">
                        “I passed the KPSC Typist exam because I capitalized on
                        my phonetic typing skills through TypeSprint, improving
                        from 25 WPM to 32 WPM.”
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleStartTest}
                    className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Start your success story"
                  >
                    Start Succeeding Today Turning Your Story Into a Success
                    <FaArrowRight
                      className="ml-2"
                      aria-label="Navigate to typing test"
                      alt="Right arrow icon"
                    />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to read inspiring success stories from Karnataka exam
                    aspirants.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to continue"
                  >
                    Log In to Continue
                    <FaArrowRight
                      className="ml-2"
                      aria-label="Navigate to login"
                      alt="Right arrow icon"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Kannada Typing Challenge Section */}
        <section
          id="challenge"
          ref={sectionRefs.challenge}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60 section"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.challenge
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
                Take Part In The Challenge Listed Above
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Join others trying to beat our record with this amazing chance
                till reaching our goals together. Our leaderboard awaits you!
              </p>
              {currentUser ? (
                <>
                  <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Champions Of Trackers
                    </h3>
                    <ul className="list-none text-gray-300 space-y-2">
                      <li className="flex items-center">
                        <FaTrophy
                          className="text-yellow-400 mr-2"
                          aria-label="Gold trophy icon"
                          alt="Gold trophy icon"
                        />
                        1. KannadaPro - <strong>35 WPM</strong>, 95% Accuracy
                      </li>
                      <li className="flex items-center">
                        <FaTrophy
                          className="text-gray-400 mr-2"
                          aria-label="Silver trophy icon"
                          alt="Silver trophy icon"
                        />
                        2. TypistStar - <strong>32 WPM</strong>, 92% Accuracy
                      </li>
                      <li className="flex items-center">
                        <FaTrophy
                          className="text-orange-400 mr-2"
                          aria-label="Bronze trophy icon"
                          alt="Bronze trophy icon"
                        />
                        3. NudiMaster - <strong>30 WPM</strong>, 90% Accuracy
                      </li>
                    </ul>
                    <button
                      onClick={() => navigate("/kannada-typing-challenge")}
                      className="mt-4 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
                      aria-label="Join the challenge"
                    >
                      Join the Challenge
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to join the Kannada typing challenge and compete for
                    the leaderboard!
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    aria-label="Log in to join challenge"
                  >
                    Log In to Join Challenge
                    <FaArrowRight
                      className="ml-2"
                      aria-label="Navigate to login"
                      alt="Right arrow icon"
                    />
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
                Resolve your questions regarding Kannada typing tests for
                Karnataka examinations.
              </p>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="card bg-gray-800 rounded-lg p-4 border border-gray-700"
                    id={`faq-${index}`}
                    aria-labelledby={`faqLabel-${index}`}
                  >
                    <summary
                      className="text-lg font-semibold text-white cursor-pointer"
                      id={`faqLabel-${index}`}
                      aria-controls={`answer-${index}`}
                    >
                      {faq.question}
                    </summary>
                    <div
                      id={`answer-${index}`}
                      className="text-gray-300 mt-2"
                      aria-label={`Answer to ${faq.question}`}
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
                Free Resources for Kannada Typing
              </h2>
              <p className="text-lg text-gray-300 mb-6 text-center">
                Access and download materials to enhance your preparation
                strategies for typing in Kannada.
              </p>
              {currentUser ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Kannada Practice Passages
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Quickly prepare yourself with ten passages which are
                        crafted to simulate an exam atmosphere and can be typed
                        using Nudi fonts at a speed of thirty words per minute.
                      </p>
                      <button
                        onClick={() => navigate("/download/kannada-passages")}
                        className="px-6 py-2 bg-gray-700 rounded-full text-white font-medium hover:bg-gray-600 transition-all flex items-center mx-auto"
                        aria-label="Download practice passages"
                      >
                        Download Passages
                        <FaBook
                          className="ml-2"
                          aria-label="Download book icon"
                          alt="Book icon"
                        />
                      </button>
                    </div>
                    <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Nudi Keyboard Guide
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Access a guide containing thoughtfully curated
                        information on the layout of the Nudi keyboard alongside
                        tips on phonetic spelling within Nudi system.
                      </p>
                      <button
                        onClick={() => navigate("/download/nudi-guide")}
                        className="px-6 py-2 bg-gray-700 rounded-full text-white font-medium hover:bg-gray-600 transition-all flex items-center mx-auto"
                        aria-label="Download Nudi guide"
                      >
                        Download Guide
                        <FaBook
                          className="ml-2"
                          aria-label="Download guide icon"
                          alt="Book icon"
                        />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-6">
                    Log in to access free downloadable resources for Kannada
                    typing.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-gray-700 rounded-full text-white font-medium hover:bg-gray-600 transition-all flex items-center mx-auto"
                    aria-label="Log in to download resources"
                  >
                    Log In to Download
                    <FaArrowRight
                      className="ml-2"
                      aria-label="Navigate to login"
                      alt="Right arrow icon"
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Social Sharing Section */}
        <section className="relative z-10 py-6 bg-gray-900 bg-opacity-60 section">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Share This Guide
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              Help fellow aspirants from Karnataka by sharing this guide on
              typing in Kannada along with other users!
            </p>
            {pdfError && (
              <p className="text-red-500 mb-4" role="alert">
                {pdfError}
              </p>
            )}
            <div className="flex justify-center gap-4">
              <WhatsappShareButton url={shareUrl} title={shareTitle}>
                <FaWhatsapp
                  className="h-8 w-8 text-green-500 hover:text-green-400"
                  aria-label="Share on WhatsApp"
                  alt="WhatsApp share icon"
                />
              </WhatsappShareButton>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <FaTwitter
                  className="h-8 w-8 text-blue-400 hover:text-blue-300"
                  aria-label="Share on Twitter"
                  alt="Twitter share icon"
                />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} title={shareTitle}>
                <FaLinkedin
                  className="h-8 w-8 text-blue-600 hover:text-blue-500"
                  aria-label="Share on LinkedIn"
                  alt="LinkedIn share icon"
                />
              </LinkedinShareButton>
              <button
                onClick={handleSaveAsPDF}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-all"
                aria-label="Download as PDF"
              >
                <FaFileAlt
                  className="h-8 w-8 text-blue-500 hover:text-blue-400"
                  alt="Download PDF icon"
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
                  Keep Going,{" "}
                  {currentUser?.displayName || currentUser?.name || "Champion"}!
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  You’re on your way to mastering Kannada typing for Karnataka
                  exams. Practice daily!
                </p>
                <button
                  onClick={handleStartTest}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                  aria-label="Continue practice"
                >
                  Continue Practice
                  <FaArrowRight
                    className="ml-2"
                    aria-label="Navigate to practice"
                    alt="Right arrow icon"
                  />
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Join Our Karnataka Exam Prep Community
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Sign up for TypeSprint to access free Kannada typing tests,
                  guides, and join thousands preparing for 2025!
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                  aria-label="Sign up for free"
                >
                  Sign Up Free
                  <FaArrowRight
                    className="ml-2"
                    aria-label="Navigate to signup"
                    alt="Right arrow icon"
                  />
                </button>
              </>
            )}
          </div>
        </section>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-4 sm:px-6 z-20 no-print">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-lg font-medium text-center sm:text-left">
              Ready to ace Kannada typing for Karnataka exams? Practice free
              now!
            </p>
            <button
              onClick={handleStartTest}
              className="px-6 py-2 bg-gray-800 rounded-full text-white font-medium hover:bg-gray-700 transition-all flex items-center"
              aria-label="Start Kannada typing test"
            >
              Start Test
              <FaArrowRight
                className="ml-2"
                aria-label="Navigate to test"
                alt="Right arrow icon"
              />
            </button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default KannadaTypingBlog2025;
