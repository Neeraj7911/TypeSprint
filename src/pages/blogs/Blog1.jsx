import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaKeyboard, FaTrophy, FaChartLine, FaLock } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../../contexts/AuthContext";

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

const BlogBoostTypingSpeed = () => {
  const { currentUser } = useAuth(); // Use useAuth hook
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    content: useRef(null),
    faqs: useRef(null),
  };

  // Intersection observer for scroll animations
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
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  // FAQ state for accordion
  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does it take to improve typing speed?",
      answer:
        "With consistent practice on TypeSprint, most users see noticeable improvements within 2-4 weeks, increasing their WPM by 10-20% with daily 15-30 minute sessions.",
    },
    {
      question: "What is the ideal typing speed for competitive exams?",
      answer:
        "Most competitive exams like SSC and NTPC require 25-35 WPM with high accuracy. TypeSprint’s adaptive exercises help you achieve and exceed these targets.",
    },
    {
      question: "Can TypeSprint help with both English and Hindi typing?",
      answer:
        "Yes, TypeSprint supports multi-language typing, including English and Hindi, with specialized exercises tailored to exam requirements.",
    },
    {
      question: "How does TypeSprint’s AI feedback work?",
      answer:
        "Our AI analyzes your typing patterns, identifying weak areas like specific keys or spacing errors, and provides personalized tips to improve efficiency.",
    },
  ];

  // Handle login button click
  const handleLogin = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden">
        {/* SEO Meta Tags */}
        <Helmet>
          <title>
            How to Boost Your Typing Speed for Competitive Exams | TypeSprint
          </title>
          <meta
            name="description"
            content="Learn expert tips to boost your typing speed for competitive exams like SSC, NTPC, and Railways. Log in to TypeSprint to unlock the full article for free."
          />
          <meta
            name="keywords"
            content="typing speed, competitive exams, SSC typing test, NTPC typing practice, improve typing skills, TypeSprint, typing tips, keyboard mastery"
          />
          <meta name="author" content="Neeraj Kumar" />
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="How to Boost Your Typing Speed for Competitive Exams"
          />
          <meta
            property="og:description"
            content="Master your typing skills with expert tips for SSC, NTPC, and other competitive exams. Log in to TypeSprint to read the full article for free."
          />
          <meta
            property="og:image"
            content="https://typesprint.com/images/typing-blog-hero.jpg"
          />
          <meta
            property="og:url"
            content="https://typesprint.com/blogs/boost-typing-speed-competitive-exams"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: "How to Boost Your Typing Speed for Competitive Exams",
              description:
                "Learn expert tips to boost your typing speed for competitive exams like SSC, NTPC, and Railways with TypeSprint.",
              author: {
                "@type": "Person",
                name: "Neeraj Kumar",
              },
              publisher: {
                "@type": "Organization",
                name: "TypeSprint",
                logo: {
                  "@type": "ImageObject",
                  url: "https://typesprint.com/images/logo.png",
                },
              },
              datePublished: "2025-05-23",
              image: "https://typesprint.com/images/typing-blog-hero.jpg",
              url: "https://typesprint.com/blogs/boost-typing-speed-competitive-exams",
            })}
          </script>
        </Helmet>

        {/* Hero Section (Visible to All) */}
        <section
          id="hero"
          ref={sectionRefs.hero}
          className="relative z-10 py-20 md:py-32 flex flex-col items-center justify-center text-center px-4"
        >
          <div
            className={`transition-all duration-1000 ${
              isVisible.hero
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Boost Your Typing Speed for Competitive Exams
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Master the keyboard with expert tips and TypeSprint’s adaptive
              platform to ace SSC, NTPC, and other exams.
            </p>
            {currentUser ? (
              <button
                onClick={() => (window.location.href = "/exams")}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Practicing Now
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg"
              >
                Log In to Unlock Full Article
              </button>
            )}
          </div>
        </section>

        {/* Content Section (Partial for Non-Logged-In Users) */}
        <section
          id="content"
          ref={sectionRefs.content}
          className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.content
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                Why Typing Speed Matters for Competitive Exams
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Typing speed is a critical skill for competitive exams like SSC,
                NTPC, and Railways, where data entry tests demand both speed and
                accuracy. A strong typing speed, typically 25-35 words per
                minute (WPM), can set you apart in these exams, ensuring you
                complete tasks efficiently and accurately.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                TypeSprint’s platform is designed to help aspirants like you
                build this skill through targeted practice, real-time analytics,
                and AI-driven feedback. Here’s the first of five proven
                strategies to boost your typing speed and excel in competitive
                exams.
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <FaKeyboard className="h-8 w-8 text-cyan-400 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      1. Master Proper Finger Placement
                    </h3>
                    <p className="text-gray-400">
                      Place your fingers on the home row (ASDF for the left
                      hand, JKL; for the right). This technique minimizes
                      movement and boosts efficiency. TypeSprint’s guided
                      exercises reinforce correct finger placement for muscle
                      memory.
                    </p>
                  </div>
                </div>

                {currentUser ? (
                  <>
                    <div className="flex items-start">
                      <FaChartLine className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          2. Track Progress with Analytics
                        </h3>
                        <p className="text-gray-400">
                          Monitor your WPM and accuracy with TypeSprint’s
                          real-time analytics. Identify problem keys or patterns
                          and focus practice sessions to address weaknesses,
                          ensuring steady improvement.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          3. Practice with Exam-Like Scenarios
                        </h3>
                        <p className="text-gray-400">
                          Simulate real exam conditions with TypeSprint’s timed
                          tests and custom practice sets. Familiarity with exam
                          formats reduces stress and improves performance under
                          pressure.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaKeyboard className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          4. Focus on Accuracy First
                        </h3>
                        <p className="text-gray-400">
                          Speed without accuracy leads to errors in exams. Start
                          with slow, deliberate typing to build precision, then
                          gradually increase speed. TypeSprint’s AI feedback
                          highlights errors for targeted improvement.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          5. Engage in Daily Challenges
                        </h3>
                        <p className="text-gray-400">
                          Join TypeSprint’s daily and weekly challenges to stay
                          motivated. Compete globally or track personal
                          progress, turning practice into a fun, gamified
                          experience.
                        </p>
                      </div>
                    </div>

                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        How TypeSprint Helps You Succeed
                      </h2>
                      <p className="text-lg text-gray-300 mb-6">
                        TypeSprint combines cutting-edge technology with proven
                        learning methods. Our adaptive algorithms tailor
                        exercises to your skill level, while AI-driven insights
                        pinpoint areas for improvement. Whether you’re preparing
                        for SSC, NTPC, or other exams, TypeSprint offers:
                      </p>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          Custom practice sets for English and Hindi typing.
                        </li>
                        <li>Real-time feedback to refine your technique.</li>
                        <li>
                          Certificates to showcase your skills to employers.
                        </li>
                        <li>
                          Multi-language support for diverse exam requirements.
                        </li>
                      </ul>
                      <button
                        onClick={() => (window.location.href = "/exams")}
                        className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg"
                      >
                        Try TypeSprint Free
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-12 text-center">
                    <FaLock className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Unlock the Full Article for Free
                    </h3>
                    <p className="text-lg text-gray-300 mb-6">
                      Log in to TypeSprint to access the complete guide,
                      including all five strategies and exclusive tips. No
                      subscription or payment required—just sign in!
                    </p>
                    <button
                      onClick={handleLogin}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Log In to Continue Reading
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {currentUser && (
          <section
            id="faqs"
            ref={sectionRefs.faqs}
            className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`text-center mb-12 transition-all duration-1000 ${
                  isVisible.faqs
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <h2 className="text-3xl font-bold text-cyan-400">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-xl text-gray-300">
                  Got questions about improving your typing speed? We’ve got
                  answers.
                </p>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300"
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
          </section>
        )}

        {currentUser && (
          <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Typing Speed",
                  "Competitive Exams",
                  "SSC Typing",
                  "NTPC Typing",
                  "Typing Tips",
                  "TypeSprint",
                  "Keyboard Skills",
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
      </div>
    </ErrorBoundary>
  );
};

export default BlogBoostTypingSpeed;
