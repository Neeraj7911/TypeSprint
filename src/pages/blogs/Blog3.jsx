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

const Blog3 = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    content: useRef(null),
    faqs: useRef(null),
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

  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleLogin = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden">
        <Helmet>
          <title>Full-Paragraph Typing Tests for SSC CHSL | TypeSprint</title>
          <meta
            name="description"
            content="Discover platforms like TypeSprint for full-paragraph typing tests to prepare for SSC CHSL and government exams. Practice with exam-like passages to boost speed and accuracy."
          />
          <meta
            name="keywords"
            content="SSC CHSL typing test, full-paragraph typing, typing test preparation, TypeSprint, improve typing speed, Hindi typing practice, English typing practice, government exams"
          />
          <meta name="author" content="Neeraj Kumar" />
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="Where to Take a Typing Test with Full Paragraphs for SSC CHSL"
          />
          <meta
            property="og:description"
            content="Master SSC CHSL typing tests with full-paragraph practice on TypeSprint. Log in to access expert tips and exam-like tests for free."
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/paragraph-typing-blog-hero.jpg"
          />
          <meta
            property="og:url"
            content="https://typesprint.live/blogs/full-paragraph-typing-tests-ssc-chsl"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline:
                "Where to Take a Typing Test with Full Paragraphs for SSC CHSL",
              description:
                "Learn where to practice full-paragraph typing tests for SSC CHSL and government exams with TypeSprint’s exam-like platform.",
              author: {
                "@type": "Person",
                name: "Neeraj Kumar",
              },
              publisher: {
                "@type": "Organization",
                name: "TypeSprint",
                logo: {
                  "@type": "ImageObject",
                  url: "https://typesprint.live/images/logo.png",
                },
              },
              datePublished: "2025-05-25",
              image:
                "https://typesprint.live/images/paragraph-typing-blog-hero.jpg",
              url: "https://typesprint.live/blogs/full-paragraph-typing-tests-ssc-chsl",
            })}
          </script>
        </Helmet>

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
                Full-Paragraph Typing Tests for SSC CHSL
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Prepare for SSC CHSL and government exams with TypeSprint’s
              full-paragraph typing tests, designed to boost speed and accuracy
              in exam-like conditions.
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
                Why Full-Paragraph Typing Tests Matter
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Typing tests for SSC CHSL and government exams require
                candidates to type full paragraphs with proper formatting,
                punctuation, and sentence structure, unlike random-word tests.
                SSC CHSL, for instance, demands approximately 1750 key
                depressions in 10 minutes for LDC/JSA posts, with a minimum
                speed of 35 words per minute (WPM) in English or 30 WPM in
                Hindi, and high accuracy.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                TypeSprint offers full-paragraph typing tests that mirror these
                exam conditions, helping you build speed, accuracy, and
                endurance. Below are five strategies to excel in paragraph-based
                typing tests using TypeSprint.
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <FaKeyboard className="h-8 w-8 text-cyan-400 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      1. Practice Exam-Like Paragraphs
                    </h3>
                    <p className="text-gray-400">
                      TypeSprint provides full-paragraph tests that replicate
                      SSC CHSL passages, including complex sentences and
                      formatting requirements like Tab key usage. This builds
                      familiarity with real exam content.
                    </p>
                  </div>
                </div>

                {currentUser ? (
                  <>
                    <div className="flex items-start">
                      <FaChartLine className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          2. Leverage AI Feedback
                        </h3>
                        <p className="text-gray-400">
                          TypeSprint’s AI analyzes your typing, identifying
                          errors in spacing, punctuation, or specific keys. Use
                          this feedback to refine your technique and achieve the
                          90%+ accuracy required for SSC CHSL.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          3. Simulate Timed Conditions
                        </h3>
                        <p className="text-gray-400">
                          Practice under SSC CHSL’s 10-minute time limit with
                          TypeSprint’s timed tests. This helps you manage time
                          pressure and maintain focus throughout the test.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaKeyboard className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          4. Disable Editing Keys
                        </h3>
                        <p className="text-gray-400">
                          SSC exams often restrict backspace and other editing
                          keys. TypeSprint’s strict mode disables these
                          functions, training you to type accurately from the
                          start.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          5. Earn Certificates
                        </h3>
                        <p className="text-gray-400">
                          Complete TypeSprint’s typing challenges to earn
                          certificates, boosting motivation and providing proof
                          of your skills for SSC CHSL preparation.
                        </p>
                      </div>
                    </div>

                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Why Choose TypeSprint for SSC CHSL Typing
                      </h2>
                      <p className="text-lg text-gray-300 mb-6">
                        TypeSprint’s platform is tailored for SSC CHSL and
                        government exam preparation, offering exam-like practice
                        and advanced features. Benefits include:
                      </p>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Full-paragraph tests with SSC-like formatting.</li>
                        <li>
                          Support for English and Hindi (Kruti Dev, Mangal).
                        </li>
                        <li>
                          AI-driven error analysis for targeted improvement.
                        </li>
                        <li>
                          Certificates to validate your typing proficiency.
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
                      including all five strategies and exclusive tips for SSC
                      CHSL typing tests. No subscription required—just sign in!
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
                  Have questions about full-paragraph typing tests for SSC CHSL?
                  Find answers below.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    question:
                      "What typing speed is required for SSC CHSL typing tests?",
                    answer:
                      "SSC CHSL requires 35 WPM in English or 30 WPM in Hindi, equivalent to 1750 key depressions in 10 minutes, with at least 90% accuracy.",
                  },
                  {
                    question:
                      "Why are full-paragraph tests better than random-word tests?",
                    answer:
                      "Full-paragraph tests mimic SSC CHSL’s exam format, requiring proper formatting, punctuation, and sustained focus, unlike random-word tests that lack context.",
                  },
                  {
                    question: "How does TypeSprint prepare me for SSC CHSL?",
                    answer:
                      "TypeSprint offers exam-like paragraph tests, AI feedback, and strict modes (no backspace), helping you achieve the speed and accuracy needed for SSC CHSL.",
                  },
                  {
                    question:
                      "How long should I practice daily for SSC CHSL typing?",
                    answer:
                      "Daily practice of 30-60 minutes on TypeSprint, focusing on accuracy and speed, can improve your typing within 2-4 weeks for SSC CHSL.",
                  },
                ].map((faq, index) => (
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
                  "SSC CHSL Typing Test",
                  "Full-Paragraph Typing",
                  "TypeSprint",
                  "Hindi Typing",
                  "English Typing",
                  "Typing Accuracy",
                  "Government Exams",
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

export default Blog3;
