import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaKeyboard, FaPlay, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext"; // Adjust path

const TenMinuteTest = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    progress: useRef(null),
    tips: useRef(null),
    simulator: useRef(null),
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
      title: "SSC CGL & CHSL",
      content:
        "Aim for 30-35 WPM with 80% accuracy. Practice with no backspace to mimic exam conditions.",
    },
    {
      title: "RRB NTPC",
      content:
        "Focus on English paragraphs. Use TypeSprint’s 10-minute tests to build endurance.",
    },
    {
      title: "Hindi Typing",
      content:
        "Practice Krutidev or Mangal fonts for exams like CPCT. Minimum 25 WPM required.",
    },
    {
      title: "Clerical Roles",
      content:
        "Accuracy is key. Target 40 WPM with 90% accuracy for state government jobs.",
    },
  ];

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  const handleStartTest = () => {
    navigate("/exams"); // Adjust to your test route
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden">
      <Helmet>
        <title>10 Minute Typing Test for Government Jobs | TypeSprint</title>
        <meta
          name="description"
          content="Practice a 10-minute typing test for government jobs like SSC CGL, SSC CHSL, RRB NTPC, and clerical roles. Boost your WPM and accuracy with TypeSprint’s exam-like tests."
        />
        <meta
          name="keywords"
          content="10 minute typing test for government jobs, government typing test practice, typing test for government exams, SSC CGL typing test, RRB NTPC typing practice, Hindi typing test for government jobs, typing speed test for government jobs"
        />
        <meta name="author" content="Neeraj Kumar" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://typesprint.live/10-minute-test" />
        <meta
          property="og:title"
          content="10 Minute Typing Test for Government Jobs | TypeSprint"
        />
        <meta
          property="og:description"
          content="Master government job typing tests with TypeSprint’s 10-minute practice. Prepare for SSC, RRB, and clerical exams with real-time WPM and accuracy feedback."
        />
        <meta
          property="og:image"
          content="https://typesprint.live/images/10-minute-test-hero.jpg"
        />
        <meta
          property="og:url"
          content="https://typesprint.live/10-minute-test"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "10 Minute Typing Test for Government Jobs",
            description:
              "Practice a 10-minute typing test tailored for government jobs like SSC CGL, SSC CHSL, RRB NTPC, and clerical roles with TypeSprint.",
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
                  name: "What is the typing speed required for government jobs?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Most government jobs require 30-40 WPM with 80%+ accuracy. SSC CGL needs 35 WPM, while clerical roles may demand up to 40 WPM.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How can TypeSprint help with government typing tests?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "TypeSprint offers 10-minute exam-like tests with real-time WPM, accuracy, and error feedback, supporting English and Hindi (Krutidev, Mangal fonts).",
                  },
                },
              ],
            },
          })}
        </script>
      </Helmet>

      {/* Hero Section with Animated Keyboard */}
      <section
        id="hero"
        ref={sectionRefs.hero}
        className="relative z-10 py-16 md:py-24 flex flex-col items-center justify-center text-center px-4"
      >
        <div
          className={`transition-all duration-1000 ${
            isVisible.hero
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative mb-6">
            <FaKeyboard className="text-6xl text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            10 Minute Typing Test for Government Jobs
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Prepare for SSC CGL, RRB NTPC, and clerical exams with TypeSprint’s
            10-minute typing test. Boost your WPM and accuracy today!
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
          >
            Start Free Test <FaPlay className="ml-2" />
          </button>
        </div>
      </section>

      {/* Progress Section with Fixed Radial Charts */}
      <section
        id="progress"
        ref={sectionRefs.progress}
        className="relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.progress
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Meet Government Job Typing Standards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Typing Speed (WPM)",
                  value: "30-40 WPM",
                  desc: "Most government jobs require 30-40 WPM. SSC CGL demands 35 WPM, RRB NTPC 30 WPM.",
                },
                {
                  title: "Accuracy",
                  value: "80%+",
                  desc: "Aim for 80%+ accuracy. Clerical roles may require up to 90% with minimal errors.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#1a202c"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#00b7eb"
                        strokeWidth="10"
                        strokeDasharray="212 283"
                        transform="rotate(-90 50 50)"
                      />
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-sm font-bold fill-cyan-400"
                        style={{
                          fontSize: item.value.length > 5 ? "14px" : "16px",
                        }}
                      >
                        {item.value}
                      </text>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-400">{item.desc}</p>
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
        className="relative z-10 py-16 bg-gray-900 bg-opacity-60"
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
              Expert Tips for Government Typing Tests
            </h2>
            <div className="relative">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-2">
                  {tips[currentTip].title}
                </h3>
                <p className="text-gray-400">{tips[currentTip].content}</p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevTip}
                  className="p-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={nextTip}
                  className="p-2 bg-cyan-500 rounded-full text-white hover:bg-cyan-400 transition-all"
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Test Simulator Section */}
      <section
        id="simulator"
        ref={sectionRefs.simulator}
        className="relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.simulator
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Try a 10-Minute Test Preview
            </h2>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="bg-gray-900 p-4 rounded-lg text-gray-300 font-mono">
                <p>
                  Government typing tests require typing a paragraph like this
                  in 10 minutes. Sample: “The system of annual inspection by
                  private agencies…” Start now!
                </p>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 w-1/3 animate-progress"></div>
                </div>
                <span className="ml-4 text-gray-400">3:20 / 10:00</span>
              </div>
              <button
                onClick={handleStartTest}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
              >
                Start 10-Minute Test
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating CTA Button */}
      <button
        onClick={handleStartTest}
        className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-110 z-20"
      >
        <FaPlay className="h-6 w-6" />
      </button>

      {/* Footer Callout - Conditional */}
      <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {isAuthenticated ? (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Welcome Back, {user?.name || "User"}!
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Keep practicing to ace government typing tests. Check your
                progress or start a new test now.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105"
              >
                View Progress
              </button>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Join Thousands of Government Job Aspirants
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Sign up for TypeSprint to access free 10-minute typing tests,
                track your progress, and earn certificates.
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
    </div>
  );
};

export default TenMinuteTest;
