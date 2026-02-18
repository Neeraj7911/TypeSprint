import React from "react";
import { Link } from "react-router-dom";

const BLOG_LINKS = [
  {
    slug: "boost-typing-speed-competitive-exams",
    path: "/blogs/boost-typing-speed-competitive-exams",
    title: "Boost Typing Speed for Competitive Exams",
  },
  {
    slug: "prepare-csir-jsa-typing-test",
    path: "/blogs/prepare-csir-jsa-typing-test",
    title: "Prepare for CSIR JSA Typing Test",
  },
  {
    slug: "full-paragraph-typing-tests-ssc-chsl",
    path: "/blogs/full-paragraph-typing-tests-ssc-chsl",
    title: "Full Paragraph Typing Tests for SSC CHSL",
  },
  {
    slug: "csir-jsa-eligiblity-and-typing-speed-criteria",
    path: "/blogs/csir-jsa-eligiblity-and-typing-speed-criteria",
    title: "CSIR JSA Typing Speed Criteria Guide",
  },
  {
    slug: "dgafms-group-c-typing-test-2025",
    path: "/blogs/dgafms-group-c-typing-test-2025",
    title: "DGAFMS Group C Typing Test 2025",
  },
  {
    slug: "csir-jsa-typing-stenography-test-2025",
    path: "/blogs/csir-jsa-typing-stenography-test-2025",
    title: "CSIR JSA Typing and Stenography Test 2025",
  },
  {
    slug: "csir-jsa-typing-stenography-test-date-2025",
    path: "/blogs/csir-jsa-typing-stenography-test-date-2025",
    title: "CSIR JSA Typing Test Date 2025",
  },
  {
    slug: "cbse-recruitment-2025-tier2-typing-test-guide",
    path: "/blogs/cbse-recruitment-2025-tier2-typing-test-guide",
    title: "CBSE Recruitment 2025 Typing Test Guide",
  },
  {
    slug: "kannada-typing-guide-2025",
    path: "/blogs/kannada-typing-guide-2025",
    title: "Kannada Typing Guide 2025",
  },
  {
    slug: "top-10-typing-mistakes-ssc-rrb",
    path: "/blogs/top-10-typing-mistakes-ssc-rrb",
    title: "Top 10 Typing Mistakes in SSC and RRB",
  },
  {
    slug: "mp-cpct-typing-exam-2026",
    path: "/blogs/mp-cpct-typing-exam-2026",
    title: "MP CPCT Typing Exam 2026 Update",
  },
  {
    slug: "the-ultimate-guide-to-typing-tests-2025",
    path: "/blogs/the-ultimate-guide-to-typing-tests-2025",
    title: "Ultimate Guide to Typing Tests 2025",
  },
  {
    slug: "cbse-superintendent-junior-assistant-recruitment-2025-english-typing-hindi-typing-rules",
    path: "/blog/cbse-superintendent-junior-assistant-recruitment-2025-english-typing-hindi-typing-rules",
    title: "CBSE Superintendent Typing Rules 2025",
  },
];

export default function BlogInterlink({ currentSlug }) {
  const related = BLOG_LINKS.filter((item) => item.slug !== currentSlug);

  if (!related.length) return null;

  return (
    <section className="mt-16 bg-gray-900/70 border border-gray-800 rounded-3xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">
        Explore More Typing Guides
      </h2>
      <p className="text-gray-300 mb-6">
        Keep your preparation fresh with more detailed walk throughs from the
        TypeSprint team.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {related.map((item) => (
          <Link
            key={item.slug}
            to={item.path}
            className="block rounded-xl border border-gray-700 bg-gray-800/70 px-4 py-3 text-gray-200 transition hover:border-cyan-400 hover:text-white"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
