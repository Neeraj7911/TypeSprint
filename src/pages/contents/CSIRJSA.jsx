import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaKeyboard,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
  FaArrowLeft,
  FaWhatsapp,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path
import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";

// Lazy load html2pdf to improve page speed
const loadHtml2PDF = () => import("html2pdf.js");

const CSIRJSATypingTest = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const contentRef = useRef(null);
  const sectionRefs = {
    hero: useRef(null),
    stats: useRef(null),
    tips: useRef(null),
    preview: useRef(null),
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
      title: "Practice Daily for CSIR JSA",
      content:
        "Dedicate 10-15 minutes daily on TypeSprint to build speed and accuracy for the CSIR JSA typing test.",
    },
    {
      title: "Prioritize Accuracy",
      content:
        "Focus on typing correctly to meet the CSIR JSA’s 80%+ accuracy requirement. Use TypeSprint’s feedback to improve.",
    },
    {
      title: "Master Home Row Typing",
      content:
        "Place fingers on ASDF and JKL; to type efficiently, reducing errors in the CSIR JSA test.",
    },
  ];

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  const handleStartTest = () => {
    navigate("/typing-test");
  };

  const handleSaveAsPDF = async () => {
    if (!contentRef.current) {
      console.error("contentRef is not assigned");
      return;
    }
    window.scrollTo(0, 0); // Ensure content is in view
    const html2pdf = (await loadHtml2PDF()).default;
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: "CSIR-JSA-Typing-Test-Page.pdf",
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

  const shareUrl = "https://typesprint.live/CSIR-JSA-typing-test-practice";
  const shareTitle = "Master the CSIR JSA Typing Test with TypeSprint!";

  return (
    <div
      ref={contentRef}
      className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden"
    >
      <Helmet>
        <title>CSIR JSA Typing Test: Free Online Practice | TypeSprint</title>
        <meta
          name="description"
          content="Prepare for the CSIR JSA typing test with TypeSprint’s free online practice. Achieve 35 WPM in English or 30 WPM in Hindi with high accuracy."
        />
        <meta
          name="keywords"
          content="CSIR JSA typing test, CSIR JSA typing speed, online typing practice for CSIR JSA, free CSIR JSA typing test, improve typing speed for CSIR JSA, TypeSprint"
        />
        <meta name="author" content="Neeraj Kumar" />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://typesprint.live/CSIR-JSA-typing-test-practice"
        />
        <meta
          property="og:title"
          content="CSIR JSA Typing Test: Free Online Practice | TypeSprint"
        />
        <meta
          property="og:description"
          content="Boost your typing skills for the CSIR JSA exam with TypeSprint’s free practice tests. Achieve 35 WPM in English or 30 WPM in Hindi with high accuracy."
        />
        <meta
          property="og:image"
          content="https://typesprint.live/images/csir-jsa-typing-hero.jpg"
        />
        <meta
          property="og:url"
          content="https://typesprint.live/CSIR-JSA-typing-test-practice"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "CSIR JSA Typing Test: Free Online Practice",
            description:
              "Prepare for the CSIR JSA typing test with TypeSprint’s free online practice tests to achieve 35 WPM in English or 30 WPM in Hindi with high accuracy.",
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
                  name: "What is the typing speed required for the CSIR JSA typing test?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The CSIR JSA typing test requires a minimum speed of 35 WPM in English or 30 WPM in Hindi, with at least 80% accuracy.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How can TypeSprint help with CSIR JSA typing test preparation?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "TypeSprint offers free online typing tests with real-time AI-powered feedback on WPM, accuracy, and errors, simulating the CSIR JSA test environment.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is a good typing speed for the CSIR JSA exam?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A typing speed of 40-50 WPM with 80%+ accuracy is considered excellent for the CSIR JSA typing test, ensuring you complete the test comfortably.",
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
                background: linear-gradient(to bottom, #111827, #1e3a8a, #111827) !important;
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
              .hero-section button, .preview-section button {
                padding: 8px 16px;
                background: linear-gradient(to right, #06b6d4, #3b82f6);
                color: #fff;
                border-radius: 9999px;
                border: none;
                font-weight: 500;
              }
              .stats-section h2, .tips-section h2, .preview-section h2, .sharing-section h3, .footer-section h3 {
                font-size: 24px;
                font-weight: 700;
                color: #06b6d4;
                margin-bottom: 16px;
                text-align: center;
              }
              .stat-card, .tip-card {
                background: #1f2937;
                border: 1px solid #374151;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
              }
              .stat-card h3, .tip-card h3 {
                font-size: 18px;
                font-weight: 600;
                color: #fff;
                margin-bottom: 8px;
              }
              .stat-card p, .tip-card p {
                font-size: 14px;
                color: #9ca3af;
              }
              .preview-section .content {
                background: #1f2937;
                border: 1px solid #374151;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
              }
              .preview-section .content p {
                font-family: monospace;
                color: #d1d5db;
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

      {/* Hero Section with Animated Keyboard */}
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
              aria-label="Keyboard icon for CSIR JSA typing test"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Ace the CSIR JSA Typing Test!
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Master the CSIR JSA typing test with TypeSprint’s free online
            practice. Achieve 35 WPM in English or 30 WPM in Hindi with
            confidence!
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
          >
            Start Free CSIR JSA Typing Test <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* Stats Section with Animated Cards */}
      <section
        id="stats"
        ref={sectionRefs.stats}
        className="section stats-section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.stats
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Why CSIR JSA Typing Skills Matter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <FaKeyboard
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Keyboard icon for CSIR JSA typing test"
                    />
                  ),
                  title: "35 WPM English / 30 WPM Hindi",
                  desc: "CSIR JSA requires 35 WPM in English or 30 WPM in Hindi, essential for administrative tasks.",
                },
                {
                  icon: (
                    <FaClock
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Clock icon for typing accuracy"
                    />
                  ),
                  title: "80%+ Accuracy",
                  desc: "High accuracy is crucial to qualify, with minimal errors in the CSIR JSA typing test.",
                },
                {
                  icon: (
                    <FaCheckCircle
                      className="h-12 w-12 text-cyan-400"
                      aria-label="Check circle icon for TypeSprint benefits"
                    />
                  ),
                  title: "TypeSprint Advantage",
                  desc: "Practice with real-time AI feedback to excel in the CSIR JSA typing test.",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="stat-card bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-600 transition-all duration-300"
                >
                  <div className="flex justify-center mb-4">{stat.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {stat.title}
                  </h3>
                  <p className="text-gray-400">{stat.desc}</p>
                </div>
              ))}
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
              Tips to Master the CSIR JSA Typing Test
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

      {/* Test Preview Section */}
      <section
        id="preview"
        ref={sectionRefs.preview}
        className="section preview-section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.preview
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Try a CSIR JSA Typing Test
            </h2>
            <div className="content bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="bg-gray-900 p-4 rounded-lg text-gray-300 font-mono">
                <p>
                  CSIR JSA typing tests require you to type passages like: “The
                  Council of Scientific and Industrial Research promotes
                  innovation…” Practice now to prepare!
                </p>
              </div>
              <button
                onClick={handleStartTest}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
              >
                Start Test Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Sharing Section */}
      <section className="section sharing-section relative z-10 py-8 bg-gray-900 bg-opacity-60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Share Your CSIR JSA Preparation Journey
          </h3>
          <p className="text-gray-400 mb-4">
            Inspire others by sharing this page with friends preparing for the
            CSIR JSA typing test!
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

      {/* Footer Callout - Conditional */}
      <section className="section footer-section relative z-10 py-12 bg-gray-900 bg-opacity-60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {isAuthenticated ? (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Welcome Back, {user?.name || "User"}!
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                You’re on your way to mastering the CSIR JSA typing test. Keep
                practicing with TypeSprint to achieve 40-50 WPM with confidence!
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105"
              >
                View Your Progress
              </button>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Join Our Community of CSIR JSA Aspirants
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                You’re not alone in your journey to ace the CSIR JSA typing
                test! Sign up for TypeSprint to access free practice tests,
                track your progress, and join thousands of aspirants like you.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105"
              >
                Sign Up Now
              </button>
            </>
          )}
        </div>
      </section>

      {/* Sticky CTA Banner - Excluded from PDF */}
      <div className="no-print fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-4 z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-lg font-medium">
            Ready to conquer the CSIR JSA typing test? Start practicing now!
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
  );
};

export default CSIRJSATypingTest;
