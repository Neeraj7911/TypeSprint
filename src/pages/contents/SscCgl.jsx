import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaKeyboard,
  FaClock,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed

const SscCgl = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth(); // Access auth state
  const [activeTip, setActiveTip] = useState(null);
  const [isVisible, setIsVisible] = useState({});
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

  const toggleTip = (index) => {
    setActiveTip(activeTip === index ? null : index);
  };

  const handleStartTest = () => {
    navigate("/exams?search=SSC%20CGL"); // Redirect to SSC CGL test
  };

  const handleUserAction = () => {
    if (isAuthenticated) {
      navigate("/dashboard"); // Redirect to dashboard for logged-in users
    } else {
      navigate("/signup"); // Redirect to signup for guests
    }
  };

  const typewriterText = "Master SSC CGL Typing Test with TypeSprint";

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden">
      <Helmet>
        <title>SSC CGL Typing Test Practice | TypeSprint</title>
        <meta
          name="description"
          content="Prepare for the SSC CGL typing test with TypeSprint’s exam-like practice. Achieve 35 WPM and 95% accuracy with our free typing tests tailored for SSC CGL aspirants."
        />
        <meta
          name="keywords"
          content="SSC CGL typing test, SSC CGL typing practice, SSC CGL data entry test, typing test preparation, TypeSprint, improve typing speed, SSC CGL typing test pattern"
        />
        <meta name="author" content="Neeraj Kumar" />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://typesprint.live/ssc-cgl-typing-test"
        />
        <meta
          property="og:title"
          content="Master SSC CGL Typing Test with TypeSprint"
        />
        <meta
          property="og:description"
          content="Ace the SSC CGL typing test with TypeSprint’s free, exam-like practice tests. Start now to boost your speed and accuracy!"
        />
        <meta
          property="og:image"
          content="https://typesprint.live/images/ssc-cgl-typing-hero.jpg"
        />
        <meta
          property="og:url"
          content="https://typesprint.live/ssc-cgl-typing-test"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "SSC CGL Typing Test Practice",
            description:
              "Prepare for the SSC CGL typing test with TypeSprint’s exam-like practice tests, designed to help you achieve 35 WPM and 95% accuracy.",
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
                  name: "What is the SSC CGL typing test requirement?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The SSC CGL typing test requires 35 WPM in English or 30 WPM in Hindi, with approximately 2000 key depressions in 15 minutes and 95% accuracy.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How can TypeSprint help with SSC CGL typing preparation?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "TypeSprint offers exam-like typing tests, AI-driven feedback, and strict mode (no backspace) to build speed and accuracy for SSC CGL.",
                  },
                },
              ],
            },
          })}
        </script>
      </Helmet>

      {/* Hero Section with Typewriter Effect */}
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
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-typewriter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {typewriterText}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Ace the SSC CGL typing test with TypeSprint’s exam-like practice.
            Achieve 35 WPM and 95% accuracy in just weeks!
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
          >
            Start Free SSC CGL Typing Test <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* Stats Section with Animated Cards */}
      <section
        id="stats"
        ref={sectionRefs.stats}
        className="relative z-10 py-16 bg-gray-900 bg-opacity-60"
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
              Why SSC CGL Typing Test Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <FaKeyboard className="h-12 w-12 text-cyan-400" />,
                  title: "35 WPM Required",
                  desc: "SSC CGL demands 35 WPM in English or 30 WPM in Hindi, with 2000 key depressions in 15 minutes.",
                },
                {
                  icon: <FaClock className="h-12 w-12 text-cyan-400" />,
                  title: "95% Accuracy",
                  desc: "High accuracy is crucial, with strict rules against editing keys like backspace during the test.",
                },
                {
                  icon: <FaCheckCircle className="h-12 w-12 text-cyan-400" />,
                  title: "TypeSprint Advantage",
                  desc: "Practice with AI feedback and exam-like tests to exceed SSC CGL requirements.",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-600 transition-all duration-300"
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

      {/* Preparation Tips with Interactive Accordion */}
      <section
        id="tips"
        ref={sectionRefs.tips}
        className="relative z-16 py-6 bg-gray-900 bg-opacity-60"
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
              Top Tips for SSC CGL Success
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Practice Exam-Like Tests",
                  content:
                    "Use TypeSprint’s SSC CGL-specific tests with real paragraphs and disabled editing keys to mimic exam conditions.",
                },
                {
                  title: "Improve Accuracy First",
                  content:
                    "Focus on error-free typing before speed. TypeSprint’s AI feedback highlights mistakes for targeted improvement.",
                },
                {
                  title: "Master Time Management",
                  content:
                    "Practice under the 15-minute limit to build endurance and maintain focus during the test.",
                },
                {
                  title: "Support for Hindi &",
                  English: "Prepare in English or Hindi.",
                },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300"
                  onMouseEnter={() => toggleTip(index)}
                  onMouseLeave={() => toggleTip(null)}
                >
                  <h3 className="text-lg font-medium text-white">
                    {tip.title}
                  </h3>
                  {activeTip === index && (
                    <p className="mt-2 text-gray-400 animate-pulse">
                      {tip.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Test Preview Section */}
      <section
        id="preview"
        ref={sectionRefs.preview}
        className="relative z-10 py-16 bg-gray-900 bg-opacity-60"
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
              Preview the SSC CGL Typing Test
            </h2>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="bg-gray-900 p-4 rounded-lg text-gray-300 font-mono">
                <p>
                  The SSC CGL typing test requires candidates to type a given
                  paragraph accurately within 15 minutes. Here’s a sample: “The
                  quick brown fox jumps over the lazy dog…” Start practicing
                  now!
                </p>
              </div>
              <button
                onClick={handleStartTest}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
              >
                Try the Test Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-4 z-20">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-lg font-medium">
            Ready to ace the SSC CGL typing test? Start practicing now!
          </p>
          <button
            onClick={handleStartTest}
            className="px-6 py-2 bg-white text-blue-900 rounded-full font-medium hover:bg-gray-100 transition-all flex items-center"
          >
            Start Test <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>

      {/* Footer Callout - Conditional */}
      <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {isAuthenticated ? (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Welcome Back, {user.name || "User"}!
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Keep practicing to ace the SSC CGL typing test. Check your
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
                Join Thousands of SSC CGL Aspirants
              </h3>
              <p className="text-lg text-gray-400 mb-6">
                Sign up for TypeSprint to access free typing tests, track your
                progress, and earn certificates.
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

export default SscCgl;
