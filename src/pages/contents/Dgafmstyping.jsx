import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaBook,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
  FaKeyboard,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path
import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";

// Lazy load html2pdf to improve page speed
const loadHtml2PDF = () => import("html2pdf.js");

const DGAFMSGroupCSyllabus = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const contentRef = useRef(null);
  const sectionRefs = {
    hero: useRef(null),
    typingTest: useRef(null),
    syllabus: useRef(null),
    examPattern: useRef(null),
    tips: useRef(null),
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
      title: "Master Typing with TypeSprint",
      content:
        "Practice daily on TypeSprint to achieve 35 WPM (English) or 30 WPM (Hindi) with 90%+ accuracy for the DGAFMS LDC typing test.",
    },
    {
      title: "Study Previous Year Papers",
      content:
        "Use DGAFMS Group C previous year question papers to understand question patterns and improve your written exam preparation.",
    },
    {
      title: "Prioritize Key Syllabus Topics",
      content:
        "Focus on high-weightage topics like Numerical Aptitude and Reasoning, and use TypeSprint’s resources for efficient study.",
    },
  ];

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  const handleStartTypingTest = () => {
    navigate(
      "/select-language?exam=dgafms-ldc&availableLanguages=english,hindi&wpm=35&font=Mangal"
    );
  };

  const handleDownloadSyllabus = () => {
    navigate("/download-dgafms-syllabus"); // Adjust path to your download page
  };

  const handleSaveAsPDF = async () => {
    if (!contentRef.current) {
      console.error("contentRef is not assigned");
      return;
    }
    window.scrollTo(0, 0);
    const html2pdf = (await loadHtml2PDF()).default;
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: "DGAFMS-Group-C-Syllabus-2025.pdf",
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 1, useCORS: true, logging: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .catch((err) => {
        console.error("PDF generation error:", err);
      });
  };

  const shareUrl = "https://typesprint.live/blogs/dgafms-group-c-syllabus-2025";
  const shareTitle = "Ace DGAFMS Group C Typing Test with TypeSprint!";

  return (
    <div
      ref={contentRef}
      className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden"
    >
      <Helmet>
        <title>DGAFMS Group C Syllabus & Typing Test 2025 | TypeSprint</title>
        <meta
          name="description"
          content="Prepare for DGAFMS Group C 2025 with detailed syllabus and typing test practice. Achieve 35 WPM with TypeSprint’s free typing platform."
        />
        <meta
          name="keywords"
          content="DGAFMS Group C syllabus 2025, DGAFMS typing test, LDC typing practice, TypeSprint, Numerical Aptitude, 35 WPM typing, government exam preparation"
        />
        <meta name="author" content="Neeraj Kumar" />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://typesprint.live/dgafms-group-c-2025-typing-test"
        />
        <meta
          property="og:title"
          content="DGAFMS Group C Syllabus & Typing Test 2025 | TypeSprint"
        />
        <meta
          property="og:description"
          content="Master the DGAFMS Group C 2025 exam with syllabus details and free typing test practice on TypeSprint. Achieve 35 WPM and excel!"
        />
        <meta
          property="og:image"
          content="https://blogger.googleusercontent.com/img/a/AVvXsEhl5CL4QKsrTAv_CVvSdb0ZoLu9T3AEaOPoV2heu7foelX2VPgPEHnv4UFq-cxG8fxJjeIb5lQXa1ciDFxRr7PMHr-8tOAtYMwqZRo37_uIinTze7u530gzQvC5cNvNZuus2I_5u3Krca7FZXAEEdCClp9DPGn6Oms09DXaWLz5eviHi2pBwdjDqphhEfM"
        />
        <meta
          property="og:url"
          content="https://typesprint.live/blogs/dgafms-group-c-syllabus-2025"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "DGAFMS Group C Syllabus & Typing Test 2025",
            description:
              "Prepare for the DGAFMS Group C 2025 exam with detailed syllabus and free typing test practice on TypeSprint to achieve 35 WPM.",
            publisher: {
              "@type": "Organization",
              name: "TypeSprint",
              logo: {
                "@type": "ImageObject",
                url: "https://typesprint.live/images/logo.png",
              },
            },
            mainEntity: {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is the typing speed required for DGAFMS Group C LDC?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The LDC post requires a minimum typing speed of 35 WPM in English or 30 WPM in Hindi on a computer with 90%+ accuracy.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How can TypeSprint help with DGAFMS Group C typing preparation?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "TypeSprint offers free typing tests with real-time AI feedback on WPM, accuracy, and errors, simulating the DGAFMS GroupañasC LDC typing test.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is the DGAFMS Group C exam pattern?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The exam includes a 2-hour written test (100 marks, MCQs) on Numerical Aptitude, General English, General Awareness, and Reasoning, followed by a skill/typing/trade test.",
                  },
                },
              ],
            },
          })}
        </script>
        <style>
          {`
            @media print {
              .no-print, .fixed {
                display: none !important;
              }
              body, html {
                background: #fff !important;
                color: #000 !important;
                font-family: Arial, sans-serif !important;
              }
              .page-container {
                background privati: linear-gradient(to bottom, #111827, #1e3a8a, #111827) !important;
                color: #d1d5db !important;
                padding: 20px;
                min-height: auto !important;
              }
              .section {
                padding: 20px 0;
                margin: 0 auto;
                max-width: 800px;
              }
              .hero-section h1 {
                font-size: 36px;
                font-weight: 800;
                background: linear-gradient(to right, #06b6d4, #3b82f6);
                -webkit-background-clip: text;
                color: transparent;
                margin-bottom: 16px;
              }
              .hero-section p {
                font-size: 18px;
                color: #d1d5db;
                margin-bottom: 16px;
              }
              .hero-section button, .typing-test-section button, .syllabus-section button, .exam-pattern-section button {
                padding: 8px 16px;
                background: linear-gradient(to right, #06b6d4, #3b82f6);
                color: #fff;
                border-radius: 9999px;
                border: none;
                font-weight: 500;
              }
              .typing-test-section h2, .syllabus-section h2, .exam-pattern-section h2, .tips-section h2, .sharing-section h3, .footer-section h3 {
                font-size: 24px;
                font-weight: 700;
                color: #06b6d4;
                margin-bottom: 16px;
                text-align: center;
              }
              .typing-test-card, .syllabus-card, .exam-pattern-card, .tip-card {
                background: #1f2937;
                border: 1px solid #374151;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
              }
              .typing-test-card h3, .syllabus-card h3, .exam-pattern-card h3, .tip-card h3 {
                font-size: 18px;
                font-weight: 600;
                color: #fff;
                margin-bottom: 8px;
              }
              .typing-test-card p, .syllabus-card ul, .exam-pattern-card ul, .tip-card p {
                font-size: 14px;
                color: #9ca3af;
              }
              .syllabus-card li, .exam-pattern-card li {
                margin-bottom: 8px;
              }
              .sharing-section .share-buttons div {
                display: inline-block;
                margin: 0 8px;
              }
              .footer-section p {
                font-size: 16px;
                color: #9ca3af;
                margin-bottom: 16px;
              }
              .footer-section button {
                padding: 8px 16px;
                background: linear-gradient(to right, #06b6d4, #3b82f6);
                color: #fff;
                border-radius: 9999px;
                border: none;
                font-weight: 500;
              }
              .animate-pulse, .transition-all {
                animation: none !important;
                transition: none !important;
              }
            }
          `}
        </style>
      </Helmet>

      {/* Hero Section */}
      <section
        id="hero"
        ref={sectionRefs.hero}
        className="section hero-section relative z-10 py-16 md:py-24 flex flex-col items-center justify-center text-center px-4"
      >
        <div
          className={`transition-all duration-1000 ${
            isVisible.hero
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative mb-6">
            <FaKeyboard
              className="text-6xl text-cyan-400 animate-pulse"
              aria-label="Keyboard icon for DGAFMS Group C typing test"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Ace DGAFMS Group C Typing Test & Syllabus 2025
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Prepare for DGAFMS Group C 2025 with TypeSprint’s free typing tests
            and detailed syllabus. Achieve 35 WPM and excel in the written exam!
          </p>
          <button
            onClick={handleStartTypingTest}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
          >
            Start Free Typing Test <FaArrowRight className="ml-2" />
          </button>
        </div>
        <img
          src="https://blogger.googleusercontent.com/img/a/AVvXsEhl5CL4QKsrTAv_CVvSdb0ZoLu9T3AEaOPoV2heu7foelX2VPgPEHnv4UFq-cxG8fxJjeIb5lQXa1ciDFxRr7PMHr-8tOAtYMwqZRo37_uIinTze7u530gzQvC5cNvNZuus2I_5u3Krca7FZXAEEdCClp9DPGn6Oms09DXaWLz5eviHi2pBwdjDqphhEfM"
          alt="Ace DGAFMS Group C Typing Test with TypeSprint"
          className="mt-6 max-w-full h-auto rounded-lg shadow-lg"
          loading="lazy"
        />
      </section>

      {/* Typing Test Section */}
      <section
        id="typingTest"
        ref={sectionRefs.typingTest}
        className="section typing-test-section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.typingTest
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Master the DGAFMS Group C Typing Test with TypeSprint
            </h2>
            <div className="typing-test-card bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Why Practice Typing with TypeSprint?
              </h3>
              <p className="text-gray-400 mb-4">
                The DGAFMS Group C exam includes a typing test for posts like
                LDC (35 WPM English or 30 WPM Hindi) and Store Keeper (30 WPM
                English or 25 WPM Hindi). TypeSprint’s free platform offers:
              </p>
              <ul className="list-disc list-inside text-gray-400 mb-4">
                <li>
                  Exam-like full-paragraph tests with real-time AI feedback.
                </li>
                <li>
                  Practice in English and Hindi (Kruti Dev, Mangal fonts).
                </li>
                <li>
                  Strict mode to disable backspace, mimicking exam conditions.
                </li>
                <li>Certificates to validate your typing proficiency.</li>
              </ul>
              <div className="bg-gray-900 p-4 rounded-lg text-gray-300 font-mono mb-4">
                <p>
                  Sample Typing Test: “The Directorate General of Armed Forces
                  Medical Services ensures quality healthcare for personnel…”
                  Practice this on TypeSprint to hit 35 WPM!
                </p>
              </div>
              <button
                onClick={handleStartTypingTest}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
              >
                Try Free Typing Test Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Section */}
      <section
        id="syllabus"
        ref={sectionRefs.syllabus}
        className="section syllabus-section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.syllabus
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              DGAFMS Group C Syllabus 2025
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Reasoning",
                  topics: [
                    "Number, Ranking & Time Sequence",
                    "Deriving Conclusions from Passages",
                    "Logical Sequence of Words",
                    "Alphabet Test Series",
                    "Arithmetical Reasoning",
                    "Situation Reaction Test",
                    "Coding-Decoding",
                    "Direction Sense Test",
                    "Analogy",
                    "Data Sufficiency",
                    "Clocks & Calendars",
                    "Statement – Conclusions",
                    "Logical Venn Diagrams",
                    "Statement – Arguments",
                    "Inserting the Missing Character",
                    "Puzzles",
                    "Alpha-Numeric Sequence Puzzle",
                  ],
                },
                {
                  title: "General English",
                  topics: [
                    "Reading Comprehension",
                    "Jumbled Sentence",
                    "Phrase Replacement",
                    "Sentence Improvement",
                    "Cloze Test",
                    "Fill in the Blanks",
                    "Wrong Spelt",
                    "Infinitive, Gerund, Participle",
                    "Identify the Sentence Pattern",
                    "Find Out the Error",
                    "Verb",
                    "Noun",
                    "Articles",
                    "Voices",
                    "Adverbs",
                    "Direct & Indirect Speech",
                    "Subject-Verb Agreement",
                    "Conjunctions",
                    "Tenses",
                    "Phrasal Verbs",
                    "Idioms and Phrases",
                    "Synonyms & Antonyms",
                    "One-word Substitution",
                  ],
                },
                {
                  title: "Quantitative Aptitude",
                  topics: [
                    "Mixture & Alligations",
                    "Pipes and Cisterns",
                    "Speed, Time & Distance",
                    "Mensuration",
                    "Trigonometry",
                    "Geometry",
                    "Time and Work",
                    "Probability",
                    "HCF & LCM",
                    "Algebraic Expressions and Inequalities",
                    "Average",
                    "Percentage",
                    "Profit and Loss",
                    "Number System",
                    "Simple & Compound Interest",
                    "Ratio and Proportion",
                    "Partnership",
                    "Data Interpretation",
                    "Number Series",
                  ],
                },
                {
                  title: "General Awareness",
                  topics: [
                    "Abbreviations",
                    "Science – Inventions & Discoveries",
                    "Current Important Events",
                    "Current Affairs – National & International",
                    "Awards and Honors",
                    "Important Financial Economic News",
                    "Banking News",
                    "Indian Constitution",
                    "Books and Authors",
                    "Important Days",
                    "History",
                    "Sports Terminology",
                    "Geography",
                    "Solar System",
                    "Indian States and Capitals",
                    "Countries and Currencies",
                  ],
                },
              ].map((subject, index) => (
                <div
                  key={index}
                  className="syllabus-card bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-600 transition-all duration-300"
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
              className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
            >
              Download Syllabus PDF
            </button>
          </div>
        </div>
      </section>

      {/* Exam Pattern Section */}
      <section
        id="examPattern"
        ref={sectionRefs.examPattern}
        className="section exam-pattern-section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.examPattern
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              DGAFMS Group C Exam Pattern 2025
            </h2>
            <div className="exam-pattern-card bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Written Exam
              </h3>
              <ul className="list-disc list-inside text-gray-400 mb-6">
                <li>Duration: 2 hours</li>
                <li>Total Marks: 100</li>
                <li>Type: Multiple Choice Questions (MCQs)</li>
                <li>
                  Subjects: General Intelligence and Reasoning, Numerical
                  Aptitude, General English, General Awareness
                </li>
              </ul>
              <h3 className="text-xl font-semibold text-white mb-4">
                Skill/Trade/Typing Tests
              </h3>
              <ul className="list-disc list-inside text-gray-400">
                <li>
                  <strong>Stenographer Grade-II</strong>: Dictation (10 mins @
                  80 WPM), Transcription (65 mins English/75 mins Hindi on
                  typewriter or 50 mins English/65 mins Hindi on computer)
                </li>
                <li>
                  <strong>LDC</strong>: Typing speed of 35 WPM (English) or 30
                  WPM (Hindi) on computer
                </li>
                <li>
                  <strong>Store Keeper</strong>: Typing speed of 30 WPM
                  (English) or 25 WPM (Hindi)
                </li>
                <li>
                  <strong>Cinema Projectionist Grade-II</strong>: Trade Test
                  (details to be announced)
                </li>
                <li>
                  <strong>Fireman</strong>: Endurance Test (e.g., carrying 63.5
                  kg for 183m in 96 seconds, 2.7m ditch, 3m rope climb)
                </li>
                <li>
                  <strong>Tradesman</strong>: Endurance Test (e.g., carrying 40
                  kg for 100m in 60 seconds, lifting 40 kg for 30 seconds)
                </li>
                <li>
                  <strong>Cook/Barber/Canteen Bearer/Washerman/MTS</strong>:
                  Trade Test (details to be announced)
                </li>
              </ul>
              <button
                onClick={handleStartTypingTest}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
              >
                Practice Typing Test Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Carousel */}
      <section
        id="tips"
        ref={sectionRefs.tips}
        className="section tips-section relative z-10 py-16 bg-gray-900 bg-opacity-60"
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
              Preparation Tips for DGAFMS Group C 2025
            </h2>
            <div className="relative">
              <div className="tip-card bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-2">
                  {tips[currentTip].title}
                </h3>
                <p className="text-gray-400">{tips[currentTip].content}</p>
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

      {/* Social Sharing Section */}
      <section className="section sharing-section relative z-10 py-8 bg-gray-900 bg-opacity-60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Share Your DGAFMS Group C Typing Journey
          </h3>
          <p className="text-gray-400 mb-4">
            Inspire others by sharing how you’re preparing for the DGAFMS Group
            C typing test with TypeSprint!
          </p>
          <div className="share-buttons flex justify-center space-x-4">
            <WhatsappShareButton url={shareUrl} title={shareTitle}>
              <div className="p-3 bg-green-500 rounded-full hover:bg-green-400 transition-all">
                <FaWhatsapp
                  className="h-6 w-6 text-white"
                  aria-label="Share on WhatsApp"
                />
              </div>
            </WhatsappShareButton>
            <TwitterShareButton url={shareUrl} title={shareTitle}>
              <div className="p-3 bg-blue-400 rounded-full hover:bg-blue-300 transition-all">
                <FaTwitter
                  className="h-6 w-6 text-white"
                  aria-label="Share on Twitter"
                />
              </div>
            </TwitterShareButton>
            <LinkedinShareButton url={shareUrl} title={shareTitle}>
              <div className="p-3 bg-blue-700 rounded-full hover:bg-blue-600 transition-all">
                <FaLinkedin
                  className="h-6 w-6 text-white"
                  aria-label="Share on LinkedIn"
                />
              </div>
            </LinkedinShareButton>
            <button
              onClick={handleSaveAsPDF}
              className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-all"
              aria-label="Download as PDF"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Download PDF icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Footer Callout */}
      <section className="section footer-section relative z-10 py-12 bg-gray-900 bg-opacity-60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {isAuthenticated ? (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Welcome Back, {user?.name || "User"}!
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                You’re on track to ace the DGAFMS Group C typing test. Keep
                practicing with TypeSprint to hit 35 WPM with confidence!
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105"
              >
                View Your Typing Progress
              </button>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Join TypeSprint to Ace DGAFMS Group C
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Sign up for TypeSprint’s free typing tests to master the DGAFMS
                Group C typing requirements. Practice daily and join thousands
                of aspirants!
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105"
              >
                Sign Up & Start Typing
              </button>
            </>
          )}
        </div>
      </section>

      {/* Sticky CTA Banner */}
      <div className="no-print fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-4 z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-lg font-medium">
            Ready to ace the DGAFMS Group C typing test? Practice free with
            TypeSprint!
          </p>
          <button
            onClick={handleStartTypingTest}
            className="px-6 py-2 bg-white text-blue-900 rounded-full font-medium hover:bg-gray-100 transition-all flex items-center"
          >
            Start Typing Test <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DGAFMSGroupCSyllabus;
