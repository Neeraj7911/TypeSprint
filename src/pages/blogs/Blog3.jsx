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
            content="Master SSC CHSL typing tests with TypeSprint’s full-paragraph practice. Boost speed and accuracy with exam-like passages and expert tips."
          />
          <meta
            name="keywords"
            content="SSC CHSL typing test, full-paragraph typing, typing test preparation, TypeSprint, improve typing speed, Hindi typing practice, English typing practice, government exams, keyboard skills"
          />
          <meta name="author" content="Neeraj Kumar" />
          <meta name="robots" content="index, follow" />
          <link
            rel="canonical"
            href="https://typesprint.live/blogs/full-paragraph-typing-tests-ssc-chsl"
          />
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
                "Master SSC CHSL typing tests with full-paragraph practice on TypeSprint’s exam-like platform.",
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
              dateModified: "2025-05-29", // Updated to reflect recent changes
              image:
                "https://typesprint.live/images/paragraph-typing-blog-hero.jpg",
              url: "https://typesprint.live/blogs/full-paragraph-typing-tests-ssc-chsl",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id":
                  "https://typesprint.live/blogs/full-paragraph-typing-tests-ssc-chsl",
              },
              keywords: [
                "SSC CHSL typing test",
                "full-paragraph typing",
                "TypeSprint",
                "typing test preparation",
                "Hindi typing",
                "English typing",
              ],
            })}
          </script>
        </Helmet>

        {/* Hero Section */}
        <section
          id="hero"
          ref={sectionRefs.hero}
          className="relative z-10 py-20 md:py-32 flex flex-col items-center justify-center text-center px-4"
        >
          {/* Ensure critical content is not dependent on IntersectionObserver */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Full-Paragraph Typing Tests for SSC CHSL
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Prepare for SSC CHSL and government exams with TypeSprint’s
            full-paragraph typing tests, designed to boost speed and accuracy in
            exam-like conditions.
          </p>
          <div
            className={`transition-all duration-1000 ${
              isVisible.hero
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Optimized image with lazy loading */}
            <img
              src="https://blogger.googleusercontent.com/img/a/AVvXsEhHBHfbrxkjvrLTkX-QjXDwQxJiNTequ5KU6qSAK1CElxX3IBmhFgc8uW7BvfR5im4TJgEVhEYjv_gKAPgo5St1OF0UUTLXdSIG2pcHUOnWBD3Yhg6D9zz_WESdD8BPzbe3S6OtjiTr6XBKF657pQA7MKgNEBmNXk1S8vtAfpCCgE5qJ5MI6sT3mwlJLG4"
              alt="SSC CHSL Typing Test Practice"
              className="mt-6 max-w-full h-auto rounded-lg shadow-lg"
              loading="lazy"
              height="auto"
            />
            {currentUser ? (
              <button
                onClick={() => (window.location.href = "/exams")}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg min-h-[48px]"
              >
                Start Practicing Now
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg min-h-[48px]"
              >
                Sign In for Free to Access All Tips
              </button>
            )}
          </div>
        </section>

        {/* Content Section with More Public Content */}
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
                Typing tests for SSC CHSL and other government exams require
                candidates to type full paragraphs with proper formatting,
                punctuation, and sentence structure, unlike random-word tests.
                SSC CHSL demands approximately 1750 key depressions in 10
                minutes for LDC/JSA posts, with a minimum speed of 35 words per
                minute (WPM) in English or 30 WPM in Hindi, and at least 90%
                accuracy.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                TypeSprint offers full-paragraph typing tests that mirror these
                exam conditions, helping you build speed, accuracy, and
                endurance. Learn more about{" "}
                <a
                  href="/ssc-cgl-typing-test"
                  className="text-cyan-400 hover:underline"
                >
                  SSC CGL typing requirements
                </a>{" "}
                or explore our{" "}
                <a
                  href="/blogs/boost-typing-speed-competitive-exams"
                  className="text-cyan-400 hover:underline"
                >
                  tips to boost typing speed
                </a>
                .
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
                <div className="flex items-start">
                  <FaChartLine className="h-8 w-8 text-cyan-400 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      2. Leverage AI Feedback
                    </h3>
                    <p className="text-gray-400">
                      TypeSprint’s AI analyzes your typing, identifying errors
                      in spacing, punctuation, or specific keys. Use this
                      feedback to refine your technique and achieve the 90%+
                      accuracy required for SSC CHSL.
                    </p>
                  </div>
                </div>

                {currentUser ? (
                  <>
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
                        className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg min-h-[48px]"
                      >
                        Try TypeSprint Free
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-12 text-center">
                    <FaLock className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Unlock All 5 Strategies for Free
                    </h3>
                    <p className="text-lg text-gray-300 mb-6">
                      Sign in to TypeSprint to access the complete guide,
                      including all five strategies, exclusive tips, and a
                      sample SSC CHSL paragraph. No subscription required—just
                      sign in!
                    </p>
                    <button
                      onClick={handleLogin}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg min-h-[48px]"
                    >
                      Sign In for Free
                    </button>
                  </div>
                )}
              </div>

              {/* Added Sample Paragraph for Content Depth */}
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                  Sample SSC CHSL Typing Paragraph
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  To give you a sense of the SSC CHSL typing test, here’s a
                  sample paragraph similar to what you might encounter:
                </p>
                <blockquote className="border-l-4 border-cyan-400 pl-4 italic text-gray-300">
                  The Indian Constitution, enacted on January 26, 1950, is the
                  supreme law of India, outlining the framework for political
                  principles, government structure, and citizen rights. It is
                  one of the longest written constitutions in the world,
                  reflecting India’s diverse cultural and social fabric.
                </blockquote>
                <p className="text-lg text-gray-300 mt-4">
                  Practice typing such paragraphs on TypeSprint to master
                  formatting and speed. Explore our{" "}
                  <a
                    href="/CSIR-JSA-typing-test-practice"
                    className="text-cyan-400 hover:underline"
                  >
                    CSIR JSA typing practice
                  </a>{" "}
                  for similar exercises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section (Visible Only to Logged-In Users) */}
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

        {/* Tags Section (Visible Only to Logged-In Users) */}
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

        {/* Added Related Articles Section */}
        <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Related Articles
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>
                <a
                  href="/blogs/boost-typing-speed-competitive-exams"
                  className="text-cyan-400 hover:underline"
                >
                  Boost Typing Speed for Competitive Exams
                </a>
              </li>
              <li>
                <a
                  href="/blogs/prepare-csir-jsa-typing-test"
                  className="text-cyan-400 hover:underline"
                >
                  Prepare for CSIR JSA Typing Test
                </a>
              </li>
              <li>
                <a
                  href="/blogs/csir-jsa-eligiblity-and-typing-speed-criteria"
                  className="text-cyan-400 hover:underline"
                >
                  CSIR JSA Eligibility and Typing Speed Criteria
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default Blog3;
