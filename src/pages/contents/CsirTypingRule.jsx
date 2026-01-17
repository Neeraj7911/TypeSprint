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
  FaFileAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext"; // Adjust path as needed
import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";

// Lazy load html2pdf for performance
const loadHtml2PDF = () => import("html2pdf.js");

const CSIRJSATypingTest = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentTip, setCurrentTip] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const contentRef = useRef(null);
  const sectionRefs = {
    hero: useRef(null),
    overview: useRef(null),
    typing: useRef(null),
    stenography: useRef(null),
    evaluation: useRef(null),
    accommodations: useRef(null),
    tips: useRef(null),
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
    Object.values(sectionRefs).forEach((ref) => {
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
      title: "Daily Typing Practice",
      content:
        "Dedicate 15-20 minutes daily on TypeSprint to achieve 35 WPM in English or 30 WPM in Hindi with 95% accuracy, as required for the CSIR JSA test.",
    },
    {
      title: "Master Stenography Dictation",
      content:
        "Practice transcribing 80 WPM dictations in English or Hindi to meet CSIR Junior Stenographer requirements, focusing on accuracy during transcription.",
    },
    {
      title: "Use Correct Hindi Fonts",
      content:
        "Familiarize yourself with Mangal or Krutidev fonts for Hindi typing to minimize errors during the CSIR JSA test.",
    },
    {
      title: "Simulate Test Conditions",
      content:
        "Practice in a distraction-free environment with a 10-minute timer to replicate the CSIR test setup and build confidence.",
    },
    {
      title: "Review Shorthand Notes",
      content:
        "Ensure your shorthand notebook is clear and organized, as it will be scrutinized post-test for Junior Stenographer candidates.",
    },
  ];

  const faqs = [
    {
      question: "What are the typing speed requirements for the CSIR JSA test?",
      answer:
        "The CSIR JSA typing test requires 35 WPM in English (10500 KDPH) or 30 WPM in Hindi (9000 KDPH) over 10 minutes, with a maximum of 5% errors for UR/OBC/SC/OH/VH candidates and 7% for ST/HH/Ex-Servicemen.",
    },
    {
      question: "How is the CSIR Junior Stenographer test structured?",
      answer:
        "The test involves a 10-minute dictation at 80 WPM in English or Hindi, followed by transcription on a computer within 50 minutes (English) or 65 minutes (Hindi). Candidates eligible for a scribe get 70 minutes (English) or 90 minutes (Hindi).",
    },
    {
      question: "Can I change the typing test language after applying?",
      answer:
        "No, the language (English or Hindi) is fixed based on your online application form, and no changes are permitted.",
    },
    {
      question: "How are typing and stenography tests evaluated?",
      answer:
        "For typing, errors above 5% (UR/OBC/SC/OH/VH) or 7% (ST/HH/Ex-Servicemen) are deducted from the speed. For stenography, full mistakes (e.g., omissions) and half mistakes (e.g., spelling errors) are counted, with 7% ignorable errors for UR and 10% for reserved categories.",
    },
    {
      question: "What accommodations are available for PwBD candidates?",
      answer:
        "PwBD candidates can seek exemption from the typing test with a medical certificate or use a scribe for stenography. Visually impaired candidates get a passage dictator, and compensatory time (5 minutes for typing, extended transcription for stenography) is provided with valid documentation.",
    },
    {
      question: "How can TypeSprint help with CSIR test preparation?",
      answer:
        "TypeSprint offers free online practice tests with real-time AI feedback on speed, accuracy, and errors, simulating CSIR test conditions to enhance your performance.",
    },
  ];

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () =>
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  const handleStartTest = () => navigate("/typing-test");
  const handleSaveAsPDF = async () => {
    if (!contentRef.current) return;
    window.scrollTo(0, 0);
    const html2pdf = (await loadHtml2PDF()).default;
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: "CSIR-JSA-Typing-Stenography-Guide.pdf",
      image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 1, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };
    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .catch((err) => console.error("PDF error:", err));
  };

  const shareUrl =
    "https://typesprint.live/CSIR-JSA-typing-stenography-practice";
  const shareTitle =
    "Ace the CSIR JSA Typing & Stenography Tests with TypeSprint!";

  return (
    <div
      ref={contentRef}
      className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden"
    >
      <Helmet>
        <title>
          CSIR JSA Typing & Stenography Test Guide: Free Practice | TypeSprint
        </title>
        <meta
          name="description"
          content="Master the CSIR JSA typing test (35 WPM English/30 WPM Hindi) and Junior Stenographer test (80 WPM) with TypeSprint’s free practice, detailed rules, and expert tips."
        />
        <meta
          name="keywords"
          content="CSIR JSA typing test, CSIR stenography test, CSIR JSA typing speed, CSIR Junior Stenographer preparation, free typing practice, Hindi typing test, stenography practice, CSIR exam rules, PwBD exemptions, TypeSprint"
        />
        <meta name="author" content="Neeraj Kumar" />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://typesprint.live/CSIR-JSA-typing-stenography-practice"
        />
        <meta
          property="og:title"
          content="CSIR JSA Typing & Stenography Test Guide: Free Practice | TypeSprint"
        />
        <meta
          property="og:description"
          content="Prepare for CSIR JSA typing (35 WPM English/30 WPM Hindi) and stenography (80 WPM) tests with TypeSprint’s free practice, detailed rules, and tips."
        />
        <meta
          property="og:image"
          content="https://typesprint.live/images/csir-jsa-hero.jpg"
        />
        <meta
          property="og:url"
          content="https://typesprint.live/CSIR-JSA-typing-stenography-practice"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "CSIR JSA Typing & Stenography Test Guide: Free Practice",
            description:
              "Master the CSIR JSA typing test (35 WPM English/30 WPM Hindi) and Junior Stenographer test (80 WPM) with TypeSprint’s free practice and detailed guide.",
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
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            },
          })}
        </script>
        <style>
          {`
            @media print {
              .no-print, .fixed { display: none !important; }
              body, html { background: #fff !important; color: #000 !important; font-family: Arial, sans-serif !important; }
              .page-container { background: #fff !important; color: #000 !important; padding: 20px; min-height: auto !important; }
              .section { padding: 20px 0; margin: 0 auto; max-width: 800px; }
              .hero-section h1 { font-size: 36px; font-weight: 800; color: #000; margin-bottom: 16px; }
              .hero-section p { font-size: 18px; color: #333; margin-bottom: 16px; }
              .hero-section button, .preview-section button { padding: 8px 16px; background: #000; color: #fff; border-radius: 8px; border: none; font-weight: 500; }
              .section h2 { font-size: 24px; font-weight: 700; color: #000; margin-bottom: 16px; text-align: center; }
              .card { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
              .card h3 { font-size: 18px; font-weight: 600; color: #000; margin-bottom: 8px; }
              .card p, .card li { font-size: 14px; color: #555; }
              .animate-pulse, .transition-all { animation: none !important; transition: none !important; }
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
          <FaKeyboard
            className="text-6xl text-cyan-400 animate-pulse"
            aria-label="Keyboard icon"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Ace CSIR JSA Typing & Stenography Tests
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Excel in the CSIR JSA typing test (35 WPM English/30 WPM Hindi) and
            Junior Stenographer test (80 WPM) with TypeSprint’s free practice
            and comprehensive guide.
          </p>
          <button
            onClick={handleStartTest}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg flex items-center mx-auto"
          >
            Start Free Practice <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* Overview Section */}
      <section
        id="overview"
        ref={sectionRefs.overview}
        className="section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.overview
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              CSIR JSA & Junior Stenographer Test Overview
            </h2>
            <p className="text-lg text-gray-300 mb-6">
              The CSIR-Central Road Research Institute (CRRI) recruitment for
              Junior Secretariat Assistant (JSA) and Junior Stenographer, per
              Advertisement No. CRRI/02/PC/JSA-JST/2025, includes proficiency
              tests following a written Computer-Based Test (CBT). The typing
              test for JSA and stenography test for Junior Stenographer are
              qualifying in nature, with final selection based on CBT merit
              (Paper-II for JSA, written exam for Stenographer).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">
                  JSA Typing Test
                </h3>
                <p className="text-gray-500">
                  A 10-minute computer-based test requiring 35 WPM in English
                  (10500 KDPH) or 30 WPM in Hindi (9000 KDPH), with strict error
                  limits.
                </p>
              </div>
              <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Junior Stenographer Test
                </h3>
                <p className="text-gray-500">
                  A 10-minute dictation at 80 WPM in English or Hindi, followed
                  by transcription on a computer within 50 minutes (English) or
                  65 minutes (Hindi).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typing Test Details Section */}
      <section
        id="typing"
        ref={sectionRefs.typing}
        className="section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.typing
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              CSIR JSA Typing Test Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                {
                  icon: FaKeyboard,
                  title: "Speed Requirements",
                  desc: "35 WPM English (10500 KDPH) or 30 WPM Hindi (9000 KDPH) for 10 minutes.",
                },
                {
                  icon: FaClock,
                  title: "Error Limits",
                  desc: "Max 5% errors for UR/OBC/SC/OH/VH; 7% for ST/HH/Ex-Servicemen.",
                },
                {
                  icon: FaCheckCircle,
                  title: "Font & Setup",
                  desc: "Hindi uses Mangal/Krutidev fonts; preset margins, no editing tools allowed.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all"
                >
                  <div className="flex justify-center mb-4">
                    <item.icon
                      className="h-12 w-12 text-cyan-400"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Detailed Instructions
            </h3>
            <ul className="list-disc list-inside text-gray-500 space-y-2 mb-6">
              <li>
                The test is conducted on computers provided by CSIR-CRRI, with
                the language (English or Hindi) fixed as per the online
                application form.
              </li>
              <li>
                A 5-minute trial passage is provided for practice before the
                test to ensure the keyboard and system are functional.
              </li>
              <li>
                Candidates must sign a declaration post-trial confirming the
                system’s functionality and adherence to rules.
              </li>
              <li>
                No editing tools (e.g., Ctrl+C, Ctrl+V, Auto-correct) or
                functional keys (e.g., Alt+F4, Delete) are available.
              </li>
              <li>
                If the computer malfunctions, candidates must inform the
                invigilator without disturbing others.
              </li>
              <li>
                Candidates must bring their admit card (downloadable from
                www.crridom.gov.in 3 days before the test) and a
                government-issued photo ID (e.g., Aadhaar, Voter ID).
              </li>
              <li>
                The test venue is in Delhi NCR, with the schedule announced
                post-CBT results.
              </li>
            </ul>
            <p className="text-gray-500">
              <strong>Note:</strong> Qualifying the typing test does not
              guarantee selection; final merit is based on Paper-II of the CBT.
            </p>
          </div>
        </div>
      </section>

      {/* Stenography Test Details Section */}
      <section
        id="stenography"
        ref={sectionRefs.stenography}
        className="section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.stenography
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              CSIR Junior Stenographer Test Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[
                {
                  icon: FaKeyboard,
                  title: "Dictation Speed",
                  desc: "10-minute dictation at 80 WPM in English or Hindi.",
                },
                {
                  icon: FaClock,
                  title: "Transcription Time",
                  desc: "50 min (English) or 65 min (Hindi); 70/90 min with scribe.",
                },
                {
                  icon: FaCheckCircle,
                  title: "Error Allowance",
                  desc: "7% ignorable errors for UR; 10% for reserved categories.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="card bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-cyan-500 transition-all"
                >
                  <div className="flex justify-center mb-4">
                    <item.icon
                      className="h-12 w-12 text-cyan-400"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Detailed Instructions
            </h3>
            <ul className="list-disc list-inside text-gray-500 space-y-2 mb-6">
              <li>
                The test begins with a 2-minute trial dictation (not
                transcribed) to familiarize candidates with the process.
              </li>
              <li>
                Candidates write dictation in a provided shorthand notebook,
                marking their roll number at the top left corner.
              </li>
              <li>
                Transcription is done on a computer within the stipulated time,
                announced by the invigilator.
              </li>
              <li>
                Candidates must bring their own ballpoint pen, pencil, and
                eraser; CSIR-CRRI provides the computer and notebook.
              </li>
              <li>
                Shorthand notebooks are scrutinized before finalizing results,
                so clarity is crucial.
              </li>
              <li>
                Candidates cannot leave the exam hall until permitted and must
                maintain silence to avoid penalties.
              </li>
              <li>
                For assistance, contact the helpline at 9741158410 (9:30 AM–6:00
                PM, except Sundays/holidays).
              </li>
            </ul>
            <p className="text-gray-500">
              <strong>Note:</strong> The stenography test is qualifying only;
              final selection depends on the competitive written exam merit.
            </p>
          </div>
        </div>
      </section>

      {/* Evaluation Criteria Section */}
      <section
        id="evaluation"
        ref={sectionRefs.evaluation}
        className="section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.evaluation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              Evaluation Criteria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Typing Test Evaluation
                </h3>
                <p className="text-gray-500 mb-2">
                  As per CSIR circulars (e.g., No. 5-1(116)/2011-PD dated
                  13.07.2015):
                </p>
                <ul className="list-disc list-inside text-gray-500 space-y-1">
                  <li>
                    Errors up to 5% (UR/OBC/SC/OH/VH) or 7%
                    (ST/HH/Ex-Servicemen) are ignored; excess errors reduce the
                    speed.
                  </li>
                  <li>
                    Example: For 1600 strokes (320 words) with 19 mistakes, 16
                    are ignorable (5%), leaving 3 admissible mistakes. Speed =
                    (320/10) - 3 = 29 WPM.
                  </li>
                  <li>
                    Evaluation follows Staff Selection Commission methodology
                    for accuracy.
                  </li>
                </ul>
              </div>
              <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Stenography Test Evaluation
                </h3>
                <p className="text-gray-500 mb-2">
                  Per CSIR letters (e.g., No. 5-1(211)/2014-PD dated
                  21.12.2021):
                </p>
                <ul className="list-disc list-inside text-gray-500 space-y-1">
                  <li>
                    Full mistakes: Omissions, substitutions, or additions of
                    words/figures.
                  </li>
                  <li>
                    Half mistakes: Spelling errors, singular/plural misuse, or
                    lowercase at sentence start.
                  </li>
                  <li>
                    Max one full mistake per word; ignorable errors: 7% (UR),
                    10% (reserved categories).
                  </li>
                  <li>
                    Formula: % Errors = [(Full Mistakes + Half Mistakes/2) ×
                    100] ÷ Total Words.
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-gray-500 text-center">
              Practice with TypeSprint to minimize errors and meet these
              stringent criteria!
            </p>
          </div>
        </div>
      </section>

      {/* Accommodations for PwBD Section */}
      <section
        id="accommodations"
        ref={sectionRefs.accommodations}
        className="section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.accommodations
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
              Accommodations for Persons with Benchmark Disabilities (PwBD)
            </h2>
            <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Typing Test Exemptions
              </h3>
              <p className="text-gray-500">
                PwBD candidates permanently unfit for typing can seek exemption
                by submitting a medical certificate (Annexure-II) from a Civil
                Surgeon, declaring the disability’s impact on typing. Cases may
                be referred to a Medical Board for verification.
              </p>
            </div>
            <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">
                Stenography Test Accommodations
              </h3>
              <ul className="list-disc list-inside text-gray-500 space-y-2">
                <li>
                  Visually impaired (VI) candidates can use a scribe/passage
                  dictator, arranged at their own cost, who reads the passage
                  within the allotted time.
                </li>
                <li>
                  Candidates with cerebral palsy, orthopedic disabilities (both
                  arms affected), or locomotor disabilities affecting writing
                  speed get 5 extra minutes, with a valid PwBD certificate.
                </li>
                <li>
                  Scribes cannot assist multiple candidates and must not be
                  candidates themselves; an undertaking (Annexure-III) is
                  required.
                </li>
              </ul>
            </div>
            <p className="text-gray-500">
              All accommodations follow GoI/CSIR guidelines (e.g., DoPT No.
              14020/1/2014-Estt. (D) dated 22.04.2015). Contact the helpline
              (9741158410) for clarification.
            </p>
          </div>
        </div>
      </section>

      {/* Tips Carousel */}
      <section
        id="tips"
        ref={sectionRefs.tips}
        className="section relative z-10 py-16 bg-gray-900 bg-opacity-60"
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
              Expert Tips for CSIR Tests
            </h2>
            <div className="relative">
              <div className="card bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-2">
                  {tips[currentTip].title}
                </h3>
                <p className="text-gray-500">{tips[currentTip].content}</p>
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

      {/* FAQ Section */}
      <section
        id="faqs"
        ref={sectionRefs.faqs}
        className="section relative z-10 py-16 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`transition-all duration-1000 ${
              isVisible.faqs
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="card bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <summary className="text-lg font-medium text-white cursor-pointer">
                    {faq.question}
                  </summary>
                  <p className="text-gray-500 mt-2">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Sharing Section */}
      <section className="section relative z-10 py-8 bg-gray-900 bg-opacity-60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-4">
            Share Your CSIR Preparation Journey
          </h3>
          <p className="text-gray-500 mb-4">
            Inspire others by sharing this comprehensive guide!
          </p>
          <div className="flex justify-center space-x-4">
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
            <LinkedinShareButton url={shareUrl}>
              <div className="p-3 bg-blue-600 rounded-full hover:bg-blue-500 transition-all">
                <FaLinkedin
                  className="h-6 w-6 text-white"
                  aria-label="Share on LinkedIn"
                />
              </div>
            </LinkedinShareButton>
            <button
              onClick={handleSaveAsPDF}
              className="p-3 bg-blue-700 rounded-full hover:bg-blue-600 transition-all"
              aria-label="Download as PDF"
            >
              <FaFileAlt
                className="h-6 w-6 text-white"
                aria-label="Download PDF icon"
              />
            </button>
          </div>
        </div>
      </section>

      {/* Footer Callout */}
      <section className="section relative z-10 py-12 bg-gray-900 bg-opacity-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {isAuthenticated ? (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Welcome Back, {user?.name || "User"}!
              </h3>
              <p className="text-lg text-gray-500 mb-6">
                Keep practicing to surpass the CSIR JSA and Stenographer test
                requirements!
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-blue-400 hover:to-blue-600 transition-all transform hover:scale-105"
              >
                View Your Progress
              </button>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Join TypeSprint’s CSIR Prep Community
              </h3>
              <p className="text-lg text-gray-500 mb-6">
                Sign up for free practice tests, progress tracking, and
                exclusive CSIR resources.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-blue-400 hover:to-blue-600 transition-all transform hover:scale-105"
              >
                Sign Up Now
              </button>
            </>
          )}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="no-print fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-600 to-blue-500 text-white py-4 rounded-t-lg px-6 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <p className="text-lg font-semibold mb-2 sm:mb-0">
            Ready to conquer the CSIR JSA & Stenography tests? Practice now!
          </p>
          <button
            onClick={handleStartTest}
            className="px-6 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all flex items-center"
          >
            Start Test <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSIRJSATypingTest;
