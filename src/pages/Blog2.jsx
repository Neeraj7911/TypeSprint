import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaKeyboard, FaTrophy, FaChartLine, FaLock } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../contexts/AuthContext";

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

const BlogCSIRJSATypingTest = () => {
  const { currentUser } = useAuth();
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
      question:
        "What is the typing speed requirement for the CSIR JSA typing test?",
      answer:
        "The CSIR JSA typing test requires a minimum speed of 35 words per minute (WPM) in English or 30 WPM in Hindi, equivalent to 10,500 or 9,000 key depressions per hour (KDPH), respectively, with high accuracy in a 10-minute test.",
    },
    {
      question:
        "Can I use backspace or arrow keys during the CSIR JSA typing test?",
      answer:
        "No, the CSIR JSA typing test typically disables editing functions like backspace, delete, or arrow keys to assess raw typing proficiency. Practicing on platforms like TypeSprint, which simulates these conditions, is highly recommended.",
    },
    {
      question:
        "How does TypeSprint help with CSIR JSA typing test preparation?",
      answer:
        "TypeSprint offers exam-like practice with disabled editing keys, supports English and Hindi (including Kruti Dev and Mangal fonts), and provides AI-driven feedback to identify and improve weak areas, enhancing speed and accuracy.",
    },
    {
      question:
        "How long should I practice daily for the CSIR JSA typing test?",
      answer:
        "Daily practice of 30-60 minutes on a platform like TypeSprint, focusing on accuracy and speed, can lead to significant improvements within 2-4 weeks, preparing you effectively for the test.",
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
          <title>How to Prepare for CSIR JSA Typing Test | TypeSprint</title>
          <meta
            name="description"
            content="Discover effective strategies to prepare for the CSIR JSA typing test. Learn how TypeSprint’s platform can help you practice and excel in English and Hindi typing tests."
          />
          <meta
            name="keywords"
            content="CSIR JSA typing test, typing test preparation, TypeSprint, improve typing speed, Hindi typing practice, English typing practice, competitive exam typing, keyboard skills"
          />
          <meta name="author" content="Neeraj Kumar" />
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="How to Prepare for CSIR JSA Typing Test with TypeSprint"
          />
          <meta
            property="og:description"
            content="Master the CSIR JSA typing test with expert tips and TypeSprint’s exam-like practice environment. Log in to access the full guide for free."
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/csir-jsa-typing-blog-hero.jpg"
          />
          <meta
            property="og:url"
            content="https://typesprint.live/blogs/prepare-csir-jsa-typing-test"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline:
                "How to Prepare for CSIR JSA Typing Test with TypeSprint",
              description:
                "Learn how to prepare for the CSIR JSA typing test with expert strategies and TypeSprint’s tailored practice platform.",
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
              datePublished: "2025-05-24",
              image:
                "https://typesprint.live/images/csir-jsa-typing-blog-hero.jpg",
              url: "https://typesprint.live/blogs/prepare-csir-jsa-typing-test",
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
                Prepare for the CSIR JSA Typing Test with Confidence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Master the CSIR JSA typing test with expert strategies and
              TypeSprint’s exam-like practice environment for English and Hindi.
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
                Understanding the CSIR JSA Typing Test
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                The CSIR Junior Secretariat Assistant (JSA) typing test is a
                critical component of the selection process, conducted after the
                written exam. Candidates must achieve a typing speed of 35 words
                per minute (WPM) in English or 30 WPM in Hindi, equivalent to
                10,500 or 9,000 key depressions per hour (KDPH), respectively,
                within a 10-minute duration. Notably, editing functions such as
                backspace, delete, or arrow keys are typically disabled,
                requiring high accuracy under strict conditions.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Effective preparation involves practicing in an environment that
                mimics these constraints. TypeSprint offers a tailored platform
                to build the necessary skills. Below is the first of five
                strategies to excel in the CSIR JSA typing test.
              </p>

              <div className="space-y-8">
                <div className="flex items-start">
                  <FaKeyboard className="h-8 w-8 text-cyan-400 mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      1. Practice Without Editing Keys
                    </h3>
                    <p className="text-gray-400">
                      The CSIR JSA typing test restricts the use of backspace,
                      delete, and arrow keys. Practice on TypeSprint with these
                      functions disabled to build muscle memory for error-free
                      typing, ensuring you meet the exam’s stringent
                      requirements.
                    </p>
                  </div>
                </div>

                {currentUser ? (
                  <>
                    <div className="flex items-start">
                      <FaChartLine className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          2. Use AI-Driven Feedback
                        </h3>
                        <p className="text-gray-400">
                          TypeSprint’s AI analyzes your typing patterns,
                          identifying errors in specific keys or spacing. Use
                          this feedback to focus on weak areas, improving both
                          speed and accuracy for the CSIR JSA test.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          3. Simulate Exam Conditions
                        </h3>
                        <p className="text-gray-400">
                          TypeSprint offers timed tests that replicate the CSIR
                          JSA typing test environment, including font options
                          like Kruti Dev or Mangal for Hindi. Regular practice
                          under these conditions reduces exam-day stress and
                          enhances performance.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaKeyboard className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          4. Prioritize Accuracy Over Speed
                        </h3>
                        <p className="text-gray-400">
                          Accuracy is critical in the CSIR JSA typing test due
                          to the lack of editing options. Begin with slow,
                          precise typing to minimize errors, then gradually
                          increase speed using TypeSprint’s progressive
                          exercises.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaTrophy className="h-8 w-8 text-cyan-400 mr-4" />
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          5. Earn Certificates for Motivation
                        </h3>
                        <p className="text-gray-400">
                          TypeSprint’s challenges allow you to earn certificates
                          upon completion, boosting motivation and providing
                          tangible proof of your skills. These milestones help
                          track progress toward the CSIR JSA typing test
                          requirements.
                        </p>
                      </div>
                    </div>

                    <div className="mt-12">
                      <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                        Why Choose TypeSprint for CSIR JSA Preparation
                      </h2>
                      <p className="text-lg text-gray-300 mb-6">
                        TypeSprint is designed to prepare candidates for the
                        CSIR JSA typing test through a realistic practice
                        environment and advanced features. Key benefits include:
                      </p>
                      <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>
                          Exam-like settings with disabled editing functions.
                        </li>
                        <li>
                          Support for English and Hindi, including Kruti Dev and
                          Mangal fonts.
                        </li>
                        <li>
                          AI-driven feedback to pinpoint and correct errors.
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
                      including all five strategies and exclusive tips for the
                      CSIR JSA typing test. No subscription or payment
                      required—just sign in!
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
                  Have questions about preparing for the CSIR JSA typing test?
                  Find answers below.
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
                  "CSIR JSA Typing Test",
                  "Typing Test Preparation",
                  "TypeSprint",
                  "Hindi Typing",
                  "English Typing",
                  "Typing Accuracy",
                  "Competitive Exams",
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

export default BlogCSIRJSATypingTest;
