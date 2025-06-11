import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaKeyboard, FaSearch } from "react-icons/fa";

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
      return (
        <h1 className="text-center text-white text-2xl mt-10">
          Something went wrong. Please try refreshing the page.
        </h1>
      );
    }
    return this.props.children;
  }
}

const Blogs = () => {
  const [isVisible, setIsVisible] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = {
    hero: useRef(null),
    blogList: useRef(null),
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
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, []);

  // Sample blog data
  const blogPosts = [
    {
      slug: "boost-typing-speed-competitive-exams",
      title: "How to Boost Your Typing Speed for Competitive Exams",
      excerpt:
        "Learn expert tips to improve your typing speed and accuracy for SSC, NTPC, and other competitive exams with TypeSprint.",
      image: "https://typesprint.com/images/typing-blog-hero.jpg",
      date: "May 23, 2025",
    },
    {
      slug: "prepare-csir-jsa-typing-test",
      title: "Prepare for CSIR JSA Typing Test with TypeSprint",
      excerpt:
        "Get ready for the CSIR JSA typing test with our comprehensive guide. Master the skills you need to succeed.",
      image: "https://typesprint.com/images/typing-blog-hero.jpg",
      date: "May 24, 2025",
    },
    {
      slug: "csir-jsa-eligiblity-and-typing-speed-criteria",
      title: "Master the CSIR JSA Typing Test with TypeSprint’s Free Practice",
      excerpt:
        "Prepare for the CSIR JSA typing test with TypeSprint’s expert guide. Achieve 35 WPM in English or 30 WPM in Hindi with 80%+ accuracy.",
      image: "https://typesprint.com/images/csir-jsa-typing-blog-hero.jpg",
      date: "2025-05-27",
    },
    {
      slug: "dgafms-group-c-typing-test-2025",
      title:
        "Master DGAFMS GROUP C (ALL POSTS) Typing Test with TypeSprint’s Free Practice",
      excerpt:
        "Prepare for the DGAFMS GROUP C typing test with TypeSprint’s expert guide. Achieve 35 WPM in English or 30 WPM in Hindi with 80%+ accuracy.",
      image:
        "https://blogger.googleusercontent.com/img/a/AVvXsEhl5CL4QKsrTAv_CVvSdb0ZoLu9T3AEaOPoV2heu7foelX2VPgPEHnv4UFq-cxG8fxJjeIb5lQXa1ciDFxRr7PMHr-8tOAtYMwqZRo37_uIinTze7u530gzQvC5cNvNZuus2I_5u3Krca7FZXAEEdCClp9DPGn6Oms09DXaWLz5eviHi2pBwdjDqphhEfM",
      date: "2025-06-11",
    },
  ];

  // Filter blog posts based on search query
  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden">
        {/* SEO Meta Tags */}
        <Helmet>
          <title>Blog | TypeSprint - Typing Tips for Competitive Exams</title>
          <meta
            name="description"
            content="Explore TypeSprint's blog for expert tips on improving typing speed and accuracy for SSC, NTPC, Railways, and other competitive exams."
          />
          <meta
            name="keywords"
            content="typing tips, competitive exams, SSC typing, NTPC typing, TypeSprint, keyboard skills, typing practice, DGAFMS typing test, CSIR JSA typing, SSC CHSL typing, SSC CGL DEST, RRB NTPC typing test, AIIMS typing, BHU junior clerk typing, Rajasthan High Court typing, Allahabad High Court typing, DSSSB JJA typing, UPSSSC typing practice, Bihar Police SSC typing, Mangal font typing, Krutidev typing, Hindi typing test, English typing test, government job typing, typing speed improvement, typing accuracy, online typing practice, SSC stenographer typing, RRB ALP typing, Indian Army typing, Agniveer typing, Delhi Jal Board typing, JNV JSA typing, UKPSC APS typing, JSSC Hindi typing, BSF HCM typing, WBPSC clerkship typing, EMRS JSA typing"
          />
          <meta name="author" content="Neeraj Kumar" />
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="TypeSprint Blog - Typing Tips and More"
          />
          <meta
            property="og:description"
            content="Read the latest articles on mastering typing skills for competitive exams with TypeSprint."
          />
          <meta
            property="og:image"
            content="https://typesprint.com/images/blog-hero.jpg"
          />
          <meta property="og:url" content="https://typesprint.com/blogs" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>

        {/* Hero Section */}
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                TypeSprint Blog
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-6">
              Expert tips to boost typing skills for competitive exams.
            </p>
            <button
              onClick={() => (window.location.href = "/exams")}
              className="px-6 py-2 sm:px-8 sm:py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Typing Practice
            </button>
          </div>
        </section>

        {/* Search Section */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-gray-800 text-white border border-gray-700 focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>
          </div>
        </section>

        {/* Blog List Section */}
        <section
          id="blogList"
          ref={sectionRefs.blogList}
          className="relative z-10 py-12 sm:py-16 bg-gray-900 bg-opacity-60"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`transition-all duration-1000 ${
                isVisible.blogList
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-6 sm:mb-8 text-center">
                Latest Blog Posts
              </h2>
              {filteredPosts.length === 0 ? (
                <p className="text-center text-gray-400 text-lg">
                  No posts found.
                </p>
              ) : (
                <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post, index) => (
                    <Link
                      key={index}
                      to={`/blogs/${post.slug}`}
                      className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
                    >
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 mb-4 text-sm sm:text-base line-clamp-3">
                        {post.excerpt}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {post.date}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default Blogs;
