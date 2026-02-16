import React from "react";
import { Helmet } from "react-helmet-async";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaKeyboard,
  FaClipboardCheck,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Blog12 error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh the page.</h1>;
    }
    return this.props.children;
  }
}

const timeline = [
  {
    label: "March 13-15, 2026",
    detail:
      "Current CPCT session (March) runs; next slot announcement follows immediately after",
  },
  {
    label: "Late March 2026",
    detail:
      "Registration window expected for April/May attempt (fee likely ₹660 via cpct.mp.gov.in)",
  },
  {
    label: "April 1-5, 2026",
    detail:
      "Admit card download link typically goes live about 7-10 days prior to exam date",
  },
  {
    label: "April 10-12, 2026",
    detail:
      "Tentative exam slot based on historical cadence (may shift to early May if demand is high)",
  },
  {
    label: "May 2026",
    detail:
      "Scorecards released within 30 days; certificate remains valid for seven years",
  },
];

const typingTargets = [
  {
    title: "English Typing",
    points: [
      "Qualifying benchmark: minimum 30 net WPM (gross speed minus penalty)",
      "Passage length: 300-350 words typed in 15 minutes",
      "Keyboard: standard QWERTY with backspace enabled; every error reduces accuracy",
    ],
  },
  {
    title: "Hindi Typing (Devanagari)",
    points: [
      "Qualifying benchmark: minimum 25 net WPM using Mangal font",
      "Matra, half-letter, and conjunct handling assessed for precision",
      "Practice with Remington or Inscript layouts based on your comfort",
    ],
  },
  {
    title: "Integrated Session",
    points: [
      "75-minute computer knowledge MCQ paper immediately precedes typing component",
      "No break between MCQ completion and typing segment—plan hydration and stamina",
      "You must qualify both MCQ and typing to receive the CPCT certificate",
    ],
  },
];

const practicePlan = [
  {
    label: "Week 1: Baseline",
    detail:
      "10-minute English + 10-minute Hindi drills daily on TypeSprint.live; focus on layout familiarity and error tagging.",
  },
  {
    label: "Week 2: Accuracy First",
    detail:
      "Switch to TypeSprint’s CPCT mock set—target 92%+ accuracy before pushing speed; enable real-time error overlays.",
  },
  {
    label: "Week 3: Exam Simulation",
    detail:
      "Run full 15-minute mocks thrice a week, alternating languages; export reports to review error categories (numbers, punctuation, matras).",
  },
  {
    label: "Week 4: Stress Testing",
    detail:
      "Combine MCQ warm-up (30 minutes) followed by back-to-back typing mocks to mimic CPCT fatigue curve.",
  },
];

const faqs = [
  {
    q: "Is there a separate prelim for the CPCT typing module?",
    a: "No. CPCT is a single sitting—75-minute MCQ exam followed instantly by the typing test. Failing either section requires a full retake.",
  },
  {
    q: "When will the April/May 2026 admit card be available?",
    a: "Historically, admit cards drop 7-10 days before the slot. For an April 10-12 exam, expect availability in the first week of April at cpct.mp.gov.in.",
  },
  {
    q: "What documents are needed for registration?",
    a: "Keep your 10+2 certificate, government ID, scanned photo, and signature ready. The fee (around ₹660) is payable via net banking, card, or MP Online kiosks.",
  },
  {
    q: "How does TypeSprint.live help with CPCT prep?",
    a: "It mirrors the CPCT interface, tracks net speed in real time, and offers Hindi/English passages curated from government notifications so you build exam-ready muscle memory.",
  },
];

const BlogMpCpct2026 = () => {
  const { currentUser } = useAuth() || {};

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-950 via-blue-950 to-gray-900 text-white">
        <Helmet>
          <title>
            MP CPCT Typing Exam 2026 (April/May): Dates, Admit Card & Practice
            Plan | TypeSprint
          </title>
          <meta
            name="description"
            content="Stay ready for the MP CPCT typing exam expected in April/May 2026. Get tentative dates, admit card timeline, speed benchmarks, and a TypeSprint-based practice roadmap."
          />
          <meta
            name="keywords"
            content="MP CPCT typing exam 2026, CPCT April 2026 dates, CPCT admit card download, CPCT typing speed requirement, TypeSprint CPCT practice"
          />
          <meta name="author" content="TypeSprint Team" />
          <meta name="robots" content="index, follow" />
          <link
            rel="canonical"
            href="https://typesprint.live/blogs/mp-cpct-typing-exam-2026"
          />
          <meta
            property="og:title"
            content="MP CPCT Typing Exam 2026 Dates & Practice Blueprint"
          />
          <meta
            property="og:description"
            content="Expected April/May 2026 CPCT typing schedule, admit card timeline, and a focused TypeSprint practice plan for 30+ net WPM."
          />
          <meta
            property="og:image"
            content="https://typesprint.live/images/mp-cpct-typing-exam-2026.webp"
          />
          <meta
            property="og:url"
            content="https://typesprint.live/blogs/mp-cpct-typing-exam-2026"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline:
                "MP CPCT Typing Exam 2026 April/May Dates Expected Soon",
              description:
                "Authoritative update on MP CPCT typing exam April/May 2026 schedule, admit card timeline, qualifying speeds, and TypeSprint practice plan.",
              author: {
                "@type": "Organization",
                name: "TypeSprint Team",
              },
              publisher: {
                "@type": "Organization",
                name: "TypeSprint",
                logo: {
                  "@type": "ImageObject",
                  url: "https://typesprint.live/images/logo.png",
                },
              },
              datePublished: "2026-02-16",
              dateModified: "2026-02-16",
              image:
                "https://typesprint.live/images/mp-cpct-typing-exam-2026.webp",
              url: "https://typesprint.live/blogs/mp-cpct-typing-exam-2026",
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://typesprint.live/blogs/mp-cpct-typing-exam-2026",
              },
              keywords: [
                "MP CPCT typing exam",
                "CPCT admit card",
                "TypeSprint practice",
                "typing speed 30 WPM",
              ],
            })}
          </script>
        </Helmet>

        <header className="relative z-10 py-20 px-4 text-center bg-gradient-to-r from-cyan-600/40 to-blue-700/30 backdrop-blur">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
              MP CPCT Typing Exam 2026: Expected April/May Dates & Practice
              Blueprint
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Track the next CPCT typing window, stay ready for admit card
              alerts, and follow a proven TypeSprint.live routine to hit 30+ net
              WPM before the exam arrives.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/typing-test"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-cyan-500 text-gray-900 font-semibold hover:bg-cyan-400 transition-transform transform hover:scale-105"
              >
                Start MP CPCT Mock
                <FaArrowRight />
              </a>
              {!currentUser && (
                <a
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 transition-all"
                >
                  Secure Progress Sync
                </a>
              )}
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-5xl mx-auto px-4 pb-24 space-y-16">
          <section className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              What the MP CPCT Typing Module Tests
            </h2>
            <p className="text-gray-300 leading-8">
              The Madhya Pradesh State Electronics Development Corporation runs
              the Computer Proficiency Certification Test (CPCT) to certify
              keyboard and digital literacy skills for government recruitment.
              The typing module is a 15-minute, passage-based assessment in
              English, Hindi, or both, where net speed matters more than flashy
              gross WPM because each error shaves marks from your final score.
              Exam software remains straightforward—no auto-complete or
              predictive text—so consistent practice with standard keyboards is
              the fastest way to qualify.
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {typingTargets.map((item) => (
                <div
                  key={item.title}
                  className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                    <FaKeyboard className="text-cyan-300" /> {item.title}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
              <FaCalendarAlt className="text-cyan-300" /> Expected Timeline for
              April/May 2026
            </h2>
            <p className="text-gray-300 leading-8">
              CPCT has followed a bi-monthly rhythm across 2025 and early 2026.
              With March slots locked for 13-15 March and registrations closing
              on 22 February, the next cycle points to mid-April. Bookmark
              cpct.mp.gov.in and MP Online kiosks for the official announcement,
              and use the timeline below to stay ahead of the rush.
            </p>
            <div className="mt-6 grid gap-4">
              {timeline.map((item) => (
                <div
                  key={item.label}
                  className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <span className="text-lg font-semibold text-cyan-300">
                    {item.label}
                  </span>
                  <p className="text-gray-300 md:max-w-xl">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Registration Checklist
            </h2>
            <p className="text-gray-300 leading-8">
              Registration, expected to reopen in late March, happens entirely
              online. Create or reuse your CPCT profile, upload documents,
              choose preferred cities such as Bhopal, Indore, Jabalpur, or
              Gwalior, and lock your slot early for the best center
              availability.
            </p>
            <ul className="mt-6 space-y-3 text-gray-300">
              <li>
                ✔️ Valid email ID and mobile number (OTP verification required)
              </li>
              <li>
                ✔️ Scanned passport photo (JPG, 100 KB) and signature (JPG, 50
                KB)
              </li>
              <li>✔️ 10+2 marksheet or equivalent qualification proof</li>
              <li>✔️ Aadhaar or government-issued ID for center entry</li>
              <li>
                ✔️ Online payment method or MP Online kiosk access for the ₹660
                fee
              </li>
            </ul>
          </section>

          <section className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
              <FaClipboardCheck className="text-cyan-300" /> Four-Week
              TypeSprint Practice Roadmap
            </h2>
            <p className="text-gray-300 leading-8">
              Whether you are chasing 30 net WPM in English or maintaining
              dual-language accuracy, structured daily reps beat random
              practice. TypeSprint.live already mirrors the CPCT layout, so you
              can focus on muscle memory, rhythm, and accurate keystrokes under
              exam pressure.
            </p>
            <div className="mt-6 grid gap-4">
              {practicePlan.map((item) => (
                <div
                  key={item.label}
                  className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.label}
                  </h3>
                  <p className="text-gray-300">{item.detail}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-cyan-300 mb-3">
                  Daily Drill Template
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>
                    5 minutes warm-up on error-prone keys (numbers, punctuation,
                    matras)
                  </li>
                  <li>15 minutes timed passage on TypeSprint’s CPCT mode</li>
                  <li>
                    5 minutes reviewing error log and retyping the most missed
                    sentence
                  </li>
                  <li>
                    Optional: translate English passage to Hindi quickly to
                    improve language switching
                  </li>
                </ul>
              </div>
              <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-cyan-300 mb-3">
                  Exam-Day Simulation Tips
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>
                    Practice back-to-back MCQ + typing mocks every Sunday to
                    build stamina
                  </li>
                  <li>
                    Disable auto-correct on all devices a week before the exam
                  </li>
                  <li>
                    Use the same chair height and keyboard angle you expect at
                    the center
                  </li>
                  <li>
                    Rehearse login and passage navigation steps so you can focus
                    purely on typing
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 md:p-10">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((item) => (
                <details
                  key={item.q}
                  className="bg-gray-800/60 border border-gray-700 rounded-2xl p-4"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-white">
                    {item.q}
                  </summary>
                  <p className="mt-3 text-gray-300 leading-7">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 md:p-10 text-center">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">
              Ready for the Admit Card Drop?
            </h2>
            <p className="text-gray-300 leading-8 max-w-3xl mx-auto">
              With April 10-12 circulating as the next CPCT window, use the
              remaining weeks to sharpen your precision. TypeSprint.live tracks
              every keystroke, flags accuracy dips instantly, and keeps you exam
              ready so that when the admit card link flashes “available soon,”
              you are already performing above the cutoff.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="/typing-test?exam=mp-cpct"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-cyan-500 text-gray-900 font-semibold hover:bg-cyan-400 transition-transform transform hover:scale-105"
              >
                Try CPCT Mock Now
                <FaArrowRight />
              </a>
              <a
                href="https://cpct.mp.gov.in"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 transition-all"
                target="_blank"
                rel="noreferrer"
              >
                Check Official Updates
              </a>
            </div>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default BlogMpCpct2026;
