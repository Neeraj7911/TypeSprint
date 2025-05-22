import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaRocket,
  FaKeyboard,
  FaTrophy,
  FaChartLine,
  FaUsers,
  FaGlobe,
} from "react-icons/fa";

const About = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("mission");
  const [isVisible, setIsVisible] = useState({});
  const sectionRefs = {
    hero: useRef(null),
    mission: useRef(null),
    features: useRef(null),
    pricing: useRef(null),
    team: useRef(null),
    contact: useRef(null),
  };

  // Typing animation for the hero section
  const [displayText, setDisplayText] = useState("");
  const fullText = "Master the keyboard. Elevate your speed.";
  const typingSpeed = 100;

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, []);

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

  // Particle animation for background
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Particle settings
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

  // Stats counter animation
  const [stats, setStats] = useState({
    users: 0,
    tests: 0,
    countries: 0,
    wpm: 0,
  });

  useEffect(() => {
    const targetStats = {
      users: 50000,
      tests: 1000000,
      countries: 120,
      wpm: 100,
    };

    const duration = 2000; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setStats({
        users: Math.floor(progress * targetStats.users),
        tests: Math.floor(progress * targetStats.tests),
        countries: Math.floor(progress * targetStats.countries),
        wpm: Math.floor(progress * targetStats.wpm),
      });

      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [isVisible.mission]);

  // Testimonial carousel
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "SSC CGL Aspirant (SELECTED)",
      text: "TypeSprint bahut helpful hai! SSC ke typing test ke liye daily practice kar rahi hoon. Interface bhi simple aur student-friendly hai. Mere speed mein clearly improvement hua hai.",
      avatar:
        "https://img.freepik.com/free-photo/young-pretty-model-is-smiling_114579-13323.jpg?ga=GA1.1.1630504922.1747914560&semt=ais_hybrid&w=740",
    },
    {
      name: "Ravi Yadav",
      role: "NTPC Aspirant (SELECTED)",
      text: "TypeSprint ekdam badhiya platform hai. SSC aur NTPC jaise exams ke liye jo typing practice chahiye hoti hai, yahan sab kuch milta hai. Har din naye practice sets milte hain aur progress bhi track kar sakte hain.",
      avatar:
        "https://img.freepik.com/free-photo/smiley-man-posing-medium-shot_23-2149915893.jpg?semt=ais_hybrid&w=740",
    },
    {
      name: "Neha Patil",
      role: "GOVERNMENT JOB ASPIRANT",
      text: "TypeSprint has been a game-changer for my SSC preparation. I love how it gives a real exam-like environment. My typing speed improved from 25 WPM to 38 WPM in just 3 weeks!",
      avatar:
        "https://img.freepik.com/free-photo/woman-doing-close-up-photoshoot-studio_53876-14476.jpg?semt=ais_hybrid&w=740",
    },
    {
      name: "Aman Verma",
      role: "CSIR-JSA (SELECTED)",
      text: "TypeSprint se daily practice karta hoon aur mujhe AI ke through jo insights milte hain, unse mujhe samajh aata hai ki kaha galti ho rahi hai. Speed aur accuracy dono improve ho rahe hain. Mast platform hai bhai!",
      avatar:
        "https://img.freepik.com/premium-photo/young-indian-man-wearing-long-sleeve-striped-polo-shirt_251136-18134.jpg?ga=GA1.1.1630504922.1747914560&semt=ais_hybrid&w=740",
    },
    {
      name: "Rakesh Nair",
      role: "Railway Exam Aspirant",
      text: "TypeSprint is amazing! The AI feedback after every test shows where I'm weak — like missing spacebar or certain letters. It helped me jump from 28 to 42 WPM. I highly recommend it for any government job aspirant.",
      avatar:
        "https://img.freepik.com/free-photo/young-adult-enjoying-virtual-date_23-2149328221.jpg?ga=GA1.1.1630504922.1747914560&semt=ais_hybrid&w=740",
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
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
              About TypeSprint
            </span>
          </h1>
          <div className="h-12 mb-8">
            <p className="text-xl md:text-2xl text-gray-300">
              {displayText}
              <span className="animate-pulse">|</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/exams")}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all transform hover:scale-105 shadow-lg"
            >
              Try For Free
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-gray-800 rounded-full text-white font-medium hover:bg-gray-700 transition-all transform hover:scale-105 border border-cyan-500 shadow-lg"
            >
              Learn More
            </button>
          </div>
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

      {/* Mission & Stats Section */}
      <section
        id="mission"
        ref={sectionRefs.mission}
        className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <div
                className={`transition-all duration-1000 delay-300 ${
                  isVisible.mission
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10"
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-cyan-400">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  At TypeSprint, we're on a mission to transform typing from a
                  mundane necessity into a skill everyone can master with joy
                  and confidence. We believe that efficient typing is a gateway
                  to enhanced productivity and creativity in our digital world.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center">
                      <FaRocket className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">
                        Accelerate Your Skills
                      </h3>
                      <p className="mt-1 text-gray-400">
                        Our scientifically designed exercises help you progress
                        faster than traditional methods.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center">
                      <FaKeyboard className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">
                        Personalized Learning
                      </h3>
                      <p className="mt-1 text-gray-400">
                        Adaptive algorithms focus on your specific weaknesses to
                        maximize improvement.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-600 flex items-center justify-center">
                      <FaTrophy className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-white">
                        Gamified Experience
                      </h3>
                      <p className="mt-1 text-gray-400">
                        Turn practice into play with challenges, achievements,
                        and friendly competition.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div
                className={`grid grid-cols-2 gap-6 transition-all duration-1000 delay-500 ${
                  isVisible.mission
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-10"
                }`}
              >
                <div className="bg-gray-800 rounded-xl p-6 text-center transform hover:scale-105 transition-transform border border-gray-700 hover:border-cyan-600">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {stats.users.toLocaleString()}+
                  </div>
                  <div className="text-gray-400">Active Users</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 text-center transform hover:scale-105 transition-transform border border-gray-700 hover:border-cyan-600">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {stats.tests.toLocaleString()}+
                  </div>
                  <div className="text-gray-400">Tests Completed</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 text-center transform hover:scale-105 transition-transform border border-gray-700 hover:border-cyan-600">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {stats.countries}+
                  </div>
                  <div className="text-gray-400">Countries</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-6 text-center transform hover:scale-105 transition-transform border border-gray-700 hover:border-cyan-600">
                  <div className="text-4xl font-bold text-cyan-400 mb-2">
                    {stats.wpm}+
                  </div>
                  <div className="text-gray-400">Avg. WPM Increase</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        ref={sectionRefs.features}
        className="relative z-10 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.features
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">
              Why Choose TypeSprint?
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with proven learning
              methods to deliver the best typing experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaChartLine className="h-8 w-8 text-cyan-400" />,
                title: "Real-Time Analytics",
                description:
                  "Track your progress with detailed metrics on speed, accuracy, and problem keys.",
              },
              {
                icon: <FaKeyboard className="h-8 w-8 text-cyan-400" />,
                title: "Custom Practice Sets",
                description:
                  "Focus on specific characters, words, or programming languages that matter to you.",
              },
              {
                icon: <FaTrophy className="h-8 w-8 text-cyan-400" />,
                title: "Skill Certification",
                description:
                  "Earn shareable certificates to showcase your typing proficiency to employers.",
              },
              {
                icon: <FaUsers className="h-8 w-8 text-cyan-400" />,
                title: "Global Competitions",
                description:
                  "Test your skills against users worldwide in daily and weekly challenges.",
              },
              {
                icon: <FaRocket className="h-8 w-8 text-cyan-400" />,
                title: "Progressive Difficulty",
                description:
                  "Our system adapts to your skill level, ensuring you're always challenged but never overwhelmed.",
              },
              {
                icon: <FaGlobe className="h-8 w-8 text-cyan-400" />,
                title: "Multi-Language Support",
                description:
                  "Practice typing in over 40 languages with specialized exercises for each.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl ${
                  isVisible.features
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="bg-gray-900 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-20 bg-gray-900 bg-opacity-60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">
              What Our Users Say
            </h2>
          </div>

          <div className="relative h-80">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  currentTestimonial === index
                    ? "opacity-100 translate-x-0"
                    : currentTestimonial < index
                    ? "opacity-0 translate-x-20"
                    : "opacity-0 -translate-x-20"
                }`}
              >
                <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700 h-full flex flex-col">
                  <div className="flex-1">
                    <p className="text-gray-300 text-lg italic mb-6">
                      "{testimonial.text}"
                    </p>
                  </div>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-cyan-400"
                    />
                    <div>
                      <h4 className="text-white font-medium">
                        {testimonial.name}
                      </h4>
                      <p className="text-cyan-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full mx-1 ${
                  currentTestimonial === index ? "bg-cyan-400" : "bg-gray-600"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Pricing Page */}
      <section
        id="pricing"
        className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden py-16"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-gradient-to-br from-cyan-600 to-transparent opacity-20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-gradient-to-tl from-purple-600 to-transparent opacity-20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDB2aCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImdyaWRiZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZmZmZjA1Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmMDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWRiZykvPjwvc3ZnPg==')] opacity-5"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Header */}
          <div className="mb-12 animate-slide-in-top">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-neon-glow">
              Power Up with TypeCredits
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Buy TypeCredits to unlock a universe of premium features. Enjoy
              core typing exercises for free and elevate your skills with
              credits.
            </p>
          </div>

          {/* Main Credits Card */}
          <div className="relative mb-12 animate-slide-in-bottom">
            <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-8 max-w-lg mx-auto border border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-4">
                  TypeCredits
                </h2>
                <div className="flex items-baseline justify-center mb-6">
                  <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    ₹3
                  </span>
                  <span className="ml-2 text-gray-300 text-lg">/credit</span>
                </div>
                <p className="text-gray-400 mb-6">
                  Spend credits on premium features to customize your typing
                  journey:
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    {
                      feature: "Detailed AI Report",
                      cost: 5,
                      desc: "Deep insights into your performance",
                    },
                    {
                      feature: "Personalized Tips",
                      cost: 2,
                      desc: "Tailored advice to level up",
                    },
                    {
                      feature: "Priority Support",
                      cost: 3,
                      desc: "Get help when you need it",
                    },
                    {
                      feature: "Premium Content Access",
                      cost: 4,
                      desc: "Exclusive challenges await",
                    },
                    {
                      feature: "Exclusive Themes",
                      cost: 3,
                      desc: "Style your typing experience",
                    },
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start group hover:bg-gray-800/50 rounded-lg p-3 transition-all duration-300"
                    >
                      <svg
                        className="h-6 w-6 text-cyan-400 mr-3 mt-1 group-hover:scale-110 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <div className="text-left">
                        <span className="text-gray-200 font-medium">
                          {item.feature} ({item.cost} credits)
                        </span>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Link to="/payment">
                  <button className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-cyan-400/50">
                    Get TypeCredits
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Credit Bundles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { credits: 10, price: "₹30", bonus: "Perfect for Trying Out" },
              { credits: 50, price: "₹150", bonus: "+5 Bonus Credits" },
              { credits: 100, price: "₹300", bonus: "+15 Bonus Credits" },
            ].map((pack, index) => (
              <div
                key={index}
                className={`bg-gray-900/70 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 animate-slide-in-bottom delay-${
                  index * 200
                }`}
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {pack.credits} Credits
                </h3>
                <p className="text-3xl font-bold text-purple-400 mb-2">
                  {pack.price}
                </p>
                <p className="text-sm text-gray-300 mb-4">{pack.bonus}</p>
                <Link to="/payment">
                  <button className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors duration-300">
                    Buy Now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* Team Section */}
      <section
        id="team"
        ref={sectionRefs.team}
        className="relative z-10 py-20 bg-gray-900 bg-opacity-60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.team
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">
              Meet the Mastermind
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              A one-person powerhouse driving TypeSprint to new heights with
              passion and innovation.
            </p>
          </div>

          <div className="flex justify-center">
            <div
              className={`relative bg-gray-800 rounded-xl overflow-hidden transition-all duration-1000 transform hover:shadow-2xl hover:-translate-y-2 ${
                isVisible.team ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ maxWidth: "400px" }}
            >
              {/* Circular Photo */}
              <div className="relative flex justify-center pt-8">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-cyan-500 shadow-lg transform transition-transform duration-500 hover:scale-110">
                  <img
                    src="https://media.licdn.com/dms/image/v2/D5603AQEx4Nfm_OKeOA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1731079814836?e=1752710400&v=beta&t=L2ThAj_LESaiwf15NwuKHkJ90-FaDgid2vd7p2yvx40" // Replace with your actual photo URL
                    alt="NEERAJ KUMAR"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute top-4 right-4 bg-cyan-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                  Solo Innovator
                </div>
              </div>

              {/* Interactive Info */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  [NEERAJ KUMAR]
                </h3>
                <p className="text-cyan-400 text-lg mb-4">
                  Founder, Developer, Designer & Visionary
                </p>

                {/* Interactive Bio Card */}
                <div className="relative group mb-6">
                  <div className="bg-gray-700 rounded-lg p-4 text-gray-300 transition-all duration-300 group-hover:bg-gray-600 group-hover:text-white">
                    <p>
                      I'm the heart and soul of TypeSprint, blending creativity
                      and tech to revolutionize how you type.
                    </p>
                  </div>
                </div>

                {/* Social Links and Fun Fact in a Flex Row */}
                <div className="flex flex-col items-center gap-6">
                  {/* Social Links */}
                  <div className="flex justify-center space-x-8">
                    {[
                      {
                        platform: "Twitter",
                        icon: (
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.348 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                          </svg>
                        ),
                        link: "#", // Replace with your actual link
                      },
                      {
                        platform: "GitHub",
                        icon: (
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                          </svg>
                        ),
                        link: "https://github.com/Neeraj7911", // Replace with your actual link
                      },
                      {
                        platform: "LinkedIn",
                        icon: (
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                          </svg>
                        ),
                        link: "https://www.linkedin.com/in/neeraj791/", // Replace with your actual link
                      },
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-cyan-400 transform transition-all duration-300 hover:scale-125 p-3 rounded-full hover:bg-gray-700"
                      >
                        {social.icon}
                        <span className="sr-only">{social.platform}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
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
              Get In Touch
            </h2>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions or feedback? We'd love to hear from you.
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
                      <p className="mt-1 text-cyan-400">+91 9870487658</p>
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
                        liveproject072+typesprint@gmail.com
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
                        Location
                      </h4>
                      <p className="mt-1 text-gray-300">New Delhi, India</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-lg font-medium text-white mb-4">
                    Follow Us
                  </h4>
                  <div className="flex space-x-4">
                    <a
                      href="http://instagram.com/kumarneeraj791"
                      className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-cyan-600 hover:text-white transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                      </svg>
                    </a>
                    <a
                      href="http://instagram.com/kumarneeraj791"
                      className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-cyan-600 hover:text-white transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                      </svg>
                    </a>
                    <a
                      href="http://instagram.com/kumarneeraj791"
                      className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-cyan-600 hover:text-white transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                      </svg>
                    </a>
                    <a
                      href="http://linkedin.com/in/neeraj791"
                      className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 hover:bg-cyan-600 hover:text-white transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                      </svg>
                    </a>
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
              <form className="bg-gray-800 rounded-xl p-8">
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
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
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
                      placeholder="How can we help you?"
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
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-blue-500 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
