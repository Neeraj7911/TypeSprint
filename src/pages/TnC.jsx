import React, { useEffect, useRef, useState } from "react";
import {
  FaFileContract,
  FaUserCheck,
  FaCreditCard,
  FaCopyright,
  FaBan,
} from "react-icons/fa";

const TermsAndConditions = () => {
  // Intersection observer for scroll animations
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    terms: useRef(null),
    contact: useRef(null),
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

  // Particle animation for background
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const particlesArray = [];
    const numberOfParticles = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(0, 210, 255, ${Math.random() * 0.5})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-gray-900 text-white overflow-hidden">
      {/* Animated background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

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
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Terms & Conditions
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl">
            By using TypeSprint, you agree to our Terms & Conditions. Please
            read them carefully.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-cyan-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Terms Details Section */}
      <section
        id="terms"
        ref={sectionRefs.terms}
        className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.terms
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">
              Our Terms of Service
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Effective Date: May 22, 2025
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <FaFileContract className="h-8 w-8 text-cyan-400" />,
                title: "Use of Service",
                description: (
                  <p className="text-gray-400">
                    TypeSprint provides typing practice and analytics tools
                    solely for educational purposes. Users must use the platform
                    in accordance with these terms and applicable laws.
                  </p>
                ),
              },
              {
                icon: <FaUserCheck className="h-8 w-8 text-cyan-400" />,
                title: "Account Registration",
                description: (
                  <p className="text-gray-400">
                    Users must provide accurate and current information during
                    registration. You are responsible for maintaining the
                    confidentiality of your login credentials and all activities
                    under your account.
                  </p>
                ),
              },
              {
                icon: <FaCreditCard className="h-8 w-8 text-cyan-400" />,
                title: "Payment & Subscriptions",
                description: (
                  <p className="text-gray-400">
                    All fees for premium subscriptions are non-refundable. You
                    will be notified of charges prior to billing. Ensure you
                    review our pricing details before making a purchase.
                  </p>
                ),
              },
              {
                icon: <FaCopyright className="h-8 w-8 text-cyan-400" />,
                title: "Intellectual Property",
                description: (
                  <p className="text-gray-400">
                    All content, tests, AI models, and analytics on TypeSprint
                    are the property of TypeSprint. Reproduction, distribution,
                    or use without prior written permission is strictly
                    prohibited.
                  </p>
                ),
              },
              {
                icon: <FaBan className="h-8 w-8 text-cyan-400" />,
                title: "Prohibited Activities",
                description: (
                  <>
                    <p className="text-gray-300 mb-4">
                      The following activities are strictly prohibited on
                      TypeSprint:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-2">
                      <li>
                        Using bots or cheating tools to manipulate performance.
                      </li>
                      <li>
                        Attempting to hack, disrupt, or misuse the service.
                      </li>
                      <li>Sharing or reselling your account with others.</li>
                    </ul>
                  </>
                ),
              },
              {
                icon: <FaFileContract className="h-8 w-8 text-cyan-400" />,
                title: "Limitation of Liability",
                description: (
                  <p className="text-gray-400">
                    TypeSprint does not guarantee job placement or exam success.
                    Our platform is designed for practice and preparation
                    purposes only. We are not liable for any outcomes related to
                    your use of the service.
                  </p>
                ),
              },
            ].map((section, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl ${
                  isVisible.terms
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="bg-gray-900 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {section.title}
                </h3>
                {section.description}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        ref={sectionRefs.contact}
        className="relative z-10 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.contact
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">
              Contact Us
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions about our Terms & Conditions? Reach out to us.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible.contact
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="bg-gray-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Phone</h4>
                      <p className="mt-1 text-cyan-400">+91-8750677376</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">Email</h4>
                      <p className="mt-1 text-cyan-400">
                        liveproject072@gmail.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-white">
                        Website
                      </h4>
                      <p className="mt-1 text-cyan-400">
                        <a
                          href="http://www.typesprint.live"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          www.typesprint.live
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 delay-500 ${
                isVisible.contact
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="bg-gray-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Send Us a Message
                </h3>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      placeholder="Terms & Conditions Inquiry"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white resize-none"
                      placeholder="Your message here..."
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-blue-500 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
