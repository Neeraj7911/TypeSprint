import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaKeyboard,
  FaTrophy,
  FaChartLine,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
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

const Blog4 = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    content: useRef(null),
    faqs: useRef(null),
    success: useRef(null),
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

  const [activeFaq, setActiveFaq] = useState(null);
  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleLogin = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  const handleStartTest = () => {
    navigate("/exams?search=csir");
  };

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden">
        <Helmet>
          <title>
            CSIR JSA Typing Test: Ultimate Preparation Guide | TypeSprint
          </title>
          <meta
            name="description"
            content="Master the CSIR JSA typing test with TypeSprint’s free full-paragraph practice. Achieve 35 WPM in English or 30 WPM in Hindi with 80%+ accuracy."
          />
          <meta
            name="keywords"
            content="CSIR JSA typing test, CSIR JSA typing speed, online typing practice for CSIR JSA, free CSIR JSA typing test, improve typing speed for CSIR JSA, TypeSprint, government exam typing"
          />
          <meta name="author" content="Neeraj Kumar" />
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="CSIR JSA Typing Test: Ultimate Preparation Guide | TypeSprint"
          />
          <meta
            property="og:description"
            content="Prepare for the CSIR JSA typing test with TypeSprint’s exam-like full-paragraph tests. Boost your speed to 35 WPM in English or 30 WPM in Hindi."
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/csir-jsa-typing-blog-hero.jpg"
          />
          <meta
            property="og:url"
            content="https://typesprint.live/blogs/csir-jsa-typing-test-practice"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: "CSIR JSA Typing Test: Ultimate Preparation Guide",
              description:
                "Learn how to excel in the CSIR JSA typing test with TypeSprint’s free full-paragraph practice tests, targeting 35 WPM in English or 30 WPM in Hindi.",
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
              datePublished: "2025-05-27",
              image:
                "https://typesprint.live/images/csir-jsa-typing-blog-hero.jpg",
              url: "https://typesprint.live/blogs/csir-jsa-typing-test-practice",
            })}
          </script>
        </Helmet>

        {/* Hero Section */}
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
            <FaKeyboard
              className="h-12 w-12 text-cyan-400 mb-6 animate-pulse"
              aria-label="Keyboard icon for CSIR JSA typing test"
            />
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Ace the CSIR JSA Typing Test with TypeSprint
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Join our community of CSIR JSA aspirants and master the typing
              test with TypeSprint’s free, exam-like practice. Hit 35 WPM in
              English or 30 WPM in Hindi with ease!
            </p>
            {currentUser ? (
              <button
                onClick={handleStartTest}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
              >
                Start Practicing Now <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
              >
                Log In to Unlock Full Guide <FaArrowRight className="ml-2" />
              </button>
            )}
          </div>
        </section>

        {/* Content Section */}
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
                Your Path to CSIR JSA Typing Test Success
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The CSIR Junior Secretariat Assistant (JSA) typing test is your
                gateway to a rewarding career with the Council of Scientific and
                Industrial Research. With a minimum requirement of 35 WPM in
                English or 30 WPM in Hindi and 80%+ accuracy, this test demands
                both speed and precision. TypeSprint is here to guide you with
                free, exam-like full-paragraph tests and AI-powered feedback.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Whether you’re starting from scratch or aiming for 40–50 WPM,
                our platform is designed to make your preparation engaging and
                effective. Below, we share seven proven strategies, common
                mistakes to avoid, and inspiring stories from our community to
                keep you motivated.
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <FaKeyboard
                    className="h-8 w-8 text-cyan-400 mr-4"
                    aria-label="Keyboard icon for practice"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      1. Practice Exam-Like Paragraphs
                    </h3>
                    <p className="text-gray-400">
                      CSIR JSA tests require typing full paragraphs with proper
                      formatting. TypeSprint’s practice tests mimic these
                      conditions, helping you master indentation, punctuation,
                      and sentence structure.
                    </p>
                  </div>
                </div>

                {currentUser ? (
                  <>
                    <div className="flex items-start">
                      <FaChartLine
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Chart icon for AI feedback"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          2. Use AI Feedback to Improve
                        </h3>
                        <p className="text-gray-400">
                          TypeSprint’s AI analyzes your typing, identifying
                          errors in keys, spacing, or punctuation. Focus on
                          these insights to achieve the 80%+ accuracy needed for
                          CSIR JSA.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Trophy icon for timed practice"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          3. Practice Under Time Pressure
                        </h3>
                        <p className="text-gray-400">
                          Simulate the CSIR JSA test’s time constraints with
                          TypeSprint’s timed practice. This builds stamina and
                          helps you stay calm during the exam.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaKeyboard
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Keyboard icon for strict mode"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          4. Train Without Backspace
                        </h3>
                        <p className="text-gray-400">
                          CSIR JSA tests may disable editing keys like
                          backspace. TypeSprint’s strict mode prepares you to
                          type accurately from the first keystroke.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaChartLine
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Chart icon for home row"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          5. Perfect Your Finger Placement
                        </h3>
                        <p className="text-gray-400">
                          Use the home row (ASDF for left hand, JKL; for right)
                          to type efficiently. TypeSprint’s feedback highlights
                          incorrect finger usage to help you improve.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Trophy icon for certificates"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          6. Earn Skill Certificates
                        </h3>
                        <p className="text-gray-400">
                          Complete TypeSprint’s challenges to earn certificates,
                          boosting your confidence and showcasing your readiness
                          for the CSIR JSA test.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaKeyboard
                        className="h-8 w-8 text-cyan-400 mr-4"
                        aria-label="Keyboard icon for daily practice"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          7. Commit to Daily Practice
                        </h3>
                        <p className="text-gray-400">
                          Spend 15–30 minutes daily on TypeSprint to steadily
                          improve your speed and accuracy, ensuring you’re
                          exam-ready in weeks.
                        </p>
                      </div>
                    </div>

                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Avoid These Common Mistakes
                      </h2>
                      <p className="text-lg text-gray-300 mb-6">
                        Steer clear of these pitfalls to maximize your CSIR JSA
                        typing test score:
                      </p>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          <strong>Prioritizing Speed Over Accuracy</strong>:
                          Rushing leads to errors, which hurt your score. Start
                          slow and build accuracy.
                        </li>
                        <li>
                          <strong>Wrong Finger Placement</strong>: Incorrect
                          hand positioning slows you down. Practice home row
                          typing on TypeSprint.
                        </li>
                        <li>
                          <strong>Ignoring Time Limits</strong>: Untimed
                          practice won’t prepare you for exam pressure. Use
                          TypeSprint’s timed tests.
                        </li>
                        <li>
                          <strong>Overlooking Feedback</strong>: Not reviewing
                          error patterns stalls progress. Study TypeSprint’s AI
                          insights.
                        </li>
                      </ul>
                    </div>

                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Try a CSIR JSA Typing Test Now
                      </h2>
                      <p className="text-lg text-gray-300 mb-6">
                        Experience the CSIR JSA test format with this sample
                        paragraph:
                      </p>
                      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <p className="text-gray-300 font-mono">
                          The Council of Scientific and Industrial Research
                          (CSIR) drives innovation through cutting-edge research
                          and development in India…
                        </p>
                        <button
                          onClick={handleStartTest}
                          className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all mx-auto block"
                        >
                          Practice This Paragraph
                        </button>
                      </div>
                    </div>

                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Why TypeSprint is Your Best Choice
                      </h2>
                      <p className="text-lg text-gray-300 mb-6">
                        TypeSprint is built for CSIR JSA aspirants, offering
                        tools to help you succeed:
                      </p>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          Full-paragraph tests tailored to CSIR JSA
                          requirements.
                        </li>
                        <li>
                          English and Hindi typing support (Kruti Dev, Mangal).
                        </li>
                        <li>AI-driven feedback for rapid improvement.</li>
                        <li>Free access to all features after signing up.</li>
                        <li>Certificates to validate your skills.</li>
                      </ul>
                      <button
                        onClick={handleStartTest}
                        className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                      >
                        Start Practicing Free <FaArrowRight className="ml-2" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mt-12 text-center">
                    <FaLock
                      className="h-12 w-12 text-cyan-400 mx-auto mb-4"
                      aria-label="Lock icon for restricted content"
                    />
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      Unlock the Full CSIR JSA Guide
                    </h3>
                    <p className="text-lg text-gray-300 mb-6">
                      Sign in to TypeSprint to access all seven strategies,
                      common mistakes, a sample test, and more. Join our
                      community of CSIR JSA aspirants for free!
                    </p>
                    <button
                      onClick={handleLogin}
                      className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                    >
                      Log In to Continue <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        {currentUser && (
          <section
            id="success"
            ref={sectionRefs.success}
            className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
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
                  Success Stories from Our Community
                </h2>
                <p className="text-lg text-gray-300 mb-8 text-center">
                  TypeSprint users have transformed their typing skills and aced
                  the CSIR JSA test. Be inspired by their journeys:
                </p>
                <div className="space-y-8">
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Priya’s Leap to 42 WPM
                    </h3>
                    <p className="text-gray-400">
                      “I was stuck at 28 WPM with frequent errors. TypeSprint’s
                      strict mode and AI feedback helped me hit 42 WPM with 85%
                      accuracy, passing the CSIR JSA test with ease!”
                    </p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Vikram’s Hindi Typing Triumph
                    </h3>
                    <p className="text-gray-400">
                      “Hindi typing was tough, but TypeSprint’s Mangal font
                      tests and daily practice got me to 32 WPM. I cleared the
                      CSIR JSA test confidently!”
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleStartTest}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Start Your Success Story <FaArrowRight className="ml-2" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
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
                  Get answers to common questions about the CSIR JSA typing test
                  and how TypeSprint can help you succeed.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    question: "What is the required typing speed for CSIR JSA?",
                    answer:
                      "The CSIR JSA typing test requires 35 WPM in English or 30 WPM in Hindi, with at least 80% accuracy.",
                  },
                  {
                    question: "What is a good typing speed for CSIR JSA?",
                    answer:
                      "Aiming for 40–50 WPM with 80%+ accuracy ensures you complete the test comfortably and stand out.",
                  },
                  {
                    question:
                      "How does TypeSprint help with CSIR JSA preparation?",
                    answer:
                      "TypeSprint provides full-paragraph tests, AI feedback, and strict modes to simulate the CSIR JSA test, boosting your speed and accuracy.",
                  },
                  {
                    question: "How long should I practice daily for CSIR JSA?",
                    answer:
                      "Practice 15–30 minutes daily on TypeSprint to improve your speed and accuracy within 2–4 weeks.",
                  },
                  {
                    question:
                      "Does TypeSprint support Hindi typing for CSIR JSA?",
                    answer:
                      "Yes, TypeSprint offers Hindi typing tests with Kruti Dev and Mangal fonts, tailored for the CSIR JSA’s 30 WPM requirement.",
                  },
                  {
                    question: "Why is accuracy crucial for the CSIR JSA test?",
                    answer:
                      "High accuracy (80%+) is essential as errors lower your score. TypeSprint’s AI helps you minimize mistakes.",
                  },
                  {
                    question: "Can I track my progress on TypeSprint?",
                    answer:
                      "Yes, TypeSprint’s dashboard tracks your WPM, accuracy, and errors, helping you monitor improvement over time.",
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

        {/* Tags Section */}
        {currentUser && (
          <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "CSIR JSA Typing Test",
                  "Typing Speed for CSIR JSA",
                  "TypeSprint",
                  "Hindi Typing",
                  "English Typing",
                  "Typing Accuracy",
                  "Government Exam Typing",
                  "Keyboard Skills",
                  "CSIR JSA Preparation",
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

        {/* Footer CTA */}
        <section className="relative z-10 py-12 bg-gray-900 bg-opacity-60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {currentUser ? (
              <>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  You’re on Track, {currentUser?.name || "Champion"}!
                </h3>
                <p className="text-lg text-gray-300 mb-6">
                  As part of the TypeSprint family, you’re closer to acing the
                  CSIR JSA typing test. Keep practicing to hit 40–50 WPM and
                  secure your dream role!
                </p>
                <button
                  onClick={handleStartTest}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Continue Practicing <FaArrowRight className="ml-2" />
                </button>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Join Our CSIR JSA Community
                </h3>
                <p className="text-lg text-gray-300 mb-6">
                  You’re not alone in your quest to conquer the CSIR JSA typing
                  test! Sign up for TypeSprint to access free practice tests and
                  join thousands of aspirants like you.
                </p>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
                >
                  Sign Up Free <FaArrowRight className="ml-2" />
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default Blog4;
