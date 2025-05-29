import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaInstagram,
  FaGithub,
  FaFileAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeart,
  FaPaperPlane,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase"; // Adjust path to your Firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import CustomCursor from "./CustomCursor";

// Social links data
const socialLinks = [
  {
    icon: FaLinkedin,
    url: "http://linkedin.com/in/neeraj791",
    name: "LinkedIn",
    color: "hover:text-blue-500",
  },
  {
    icon: FaInstagram,
    url: "https://instagram.com/kumarneeraj791",
    name: "Instagram",
    color: "hover:text-pink-500",
  },
  {
    icon: FaGithub,
    url: "https://github.com/Neeraj7911",
    name: "GitHub",
    color: "hover:text-purple-500",
  },
  {
    icon: FaFileAlt,
    url: "https://neeraj791.me",
    name: "Portfolio",
    color: "hover:text-green-500",
  },
];

// Quick links data
const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Blogs", path: "/blogs" },
  { name: "About", path: "/about" },
  { name: "Privacy Policy", path: "/PrivacyPolicy" },
  { name: "Terms & Conditions", path: "/t&c" },
  { name: "No Refund & Shipping Policy", path: "/norefundandshippingpolicy" },
  { name: "Verify Certificate", path: "/verify" },
];

// Page options for feedback dropdown
const pageOptions = [
  "Home",
  "Exam",
  "Result",
  "Dashboard",
  "Profile",
  "Leaderboard",
  "Other",
];

const Footer = ({ darkMode }) => {
  const logoText = "TypeSprint";
  const [typedText, setTypedText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: "",
    page: "Home",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= logoText.length) {
        setTypedText(logoText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Fetch user data from Firebase Auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFeedback((prev) => ({
          ...prev,
          name: currentUser.displayName || currentUser.email.split("@")[0],
          email: currentUser.email,
        }));
      } else {
        setUser(null);
        setFeedback((prev) => ({ ...prev, name: "", email: "" }));
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle feedback form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  // Handle feedback form submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Form validation
    if (!user && (!feedback.name || !feedback.email)) {
      setErrorMessage("Please provide your name and email.");
      setIsSubmitting(false);
      return;
    }
    if (!feedback.message) {
      setErrorMessage("Please provide feedback.");
      setIsSubmitting(false);
      return;
    }
    if (feedback.page === "Other" && !feedback.reason.trim()) {
      setErrorMessage("Please provide a reason for 'Other' page feedback.");
      setIsSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "website_feedback"), {
        name: feedback.name,
        email: feedback.email,
        message: feedback.message,
        page: feedback.page,
        reason: feedback.page === "Other" ? feedback.reason : "",
        timestamp: serverTimestamp(),
        userId: user ? user.uid : null, // Include userId if logged in
      });
      setSuccessMessage("Thank you for your feedback!");
      setFeedback({
        name: user ? user.displayName || user.email.split("@")[0] : "",
        email: user ? user.email : "",
        message: "",
        page: "Home",
        reason: "",
      });
      setTimeout(() => setIsModalOpen(false), 1500); // Close modal after success
    } catch (error) {
      setErrorMessage("Failed to submit feedback. Please try again.");
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <footer
      className={`py-16 transition-colors duration-300 ${
        darkMode ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-white"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <CustomCursor />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1"
          >
            <div className="flex items-center mb-6">
              <motion.div className="text-4xl font-extrabold relative">
                <motion.span
                  className={`bg-clip-text text-transparent ${
                    darkMode
                      ? "bg-gradient-to-r from-blue-400 to-purple-600"
                      : "bg-gradient-to-r from-blue-600 to-purple-800"
                  }`}
                >
                  {typedText}
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block ml-1"
                >
                  |
                </motion.span>
              </motion.div>
            </div>
            <p
              className={`text-sm leading-relaxed ${
                darkMode ? "text-gray-600" : "text-gray-300"
              } mb-6`}
            >
              Elevate your typing skills with our comprehensive platform
              designed for government exam preparation.
            </p>
            <div className="flex items-center space-x-3 text-sm">
              <FaMapMarkerAlt
                className={darkMode ? "text-gray-600" : "text-gray-400"}
              />
              <span className={darkMode ? "text-gray-600" : "text-gray-400"}>
                New Delhi, India
              </span>
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-1"
          >
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    className={`group flex items-center text-sm font-medium ${
                      darkMode
                        ? "text-gray-300 hover:text-blue-400"
                        : "text-gray-300 hover:text-blue-600"
                    } transition-colors duration-200`}
                  >
                    <FaArrowRight
                      className={`mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        darkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-1"
          >
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <motion.a
                href="mailto:Liveproject072+typesprint@gmail.com"
                className={`flex items-center text-sm font-medium ${
                  darkMode
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-300 hover:text-blue-600"
                } transition-colors duration-200`}
                whileHover={{ x: 5 }}
              >
                <FaEnvelope className="mr-2" />
                Mail us
              </motion.a>
              <motion.a
                href="tel:+91 - 9870487659"
                className={`flex items-center text-sm font-medium ${
                  darkMode
                    ? "text-gray-300 hover:text-blue-400"
                    : "text-gray-300 hover:text-blue-600"
                } transition-colors duration-200`}
                whileHover={{ x: 5 }}
              >
                <FaPhoneAlt className="mr-2" />
                WhatsApp Us
              </motion.a>
            </div>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="col-span-1"
          >
            <h3 className="text-xl font-semibold mb-6">Connect With Us</h3>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } ${
                    link.color
                  } transition-colors duration-200 text-sm font-medium`}
                  whileHover={{ scale: 1.05 }}
                >
                  <link.icon className="text-xl mr-2" />
                  <span>{link.name}</span>
                </motion.a>
              ))}
            </div>
            <motion.button
              onClick={toggleModal}
              className={`mt-6 flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${
                darkMode
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPaperPlane className="mr-2" />
              Give Feedback
            </motion.button>
          </motion.div>
        </div>

        {/* Feedback Modal */}
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={`rounded-lg p-6 w-full max-w-md ${
                darkMode
                  ? "bg-gray-100 text-gray-900"
                  : "bg-gray-800 text-white"
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-4">
                We Value Your Feedback
              </h3>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Page</label>
                  <select
                    name="page"
                    value={feedback.page}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg text-sm ${
                      darkMode
                        ? "bg-gray-200 text-gray-900"
                        : "bg-gray-700 text-white"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {pageOptions.map((page) => (
                      <option key={page} value={page}>
                        {page}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={feedback.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className={`w-full px-4 py-2 rounded-lg text-sm ${
                      darkMode
                        ? "bg-gray-200 text-gray-900 placeholder-gray-500"
                        : "bg-gray-700 text-white placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      user ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={!!user}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={feedback.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    className={`w-full px-4 py-2 rounded-lg text-sm ${
                      darkMode
                        ? "bg-gray-200 text-gray-900 placeholder-gray-500"
                        : "bg-gray-700 text-white placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      user ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={!!user}
                  />
                </div>
                {feedback.page === "Other" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Reason for 'Other'
                    </label>
                    <input
                      type="text"
                      name="reason"
                      value={feedback.reason}
                      onChange={handleInputChange}
                      placeholder="Please specify the page or context"
                      className={`w-full px-4 py-2 rounded-lg text-sm ${
                        darkMode
                          ? "bg-gray-200 text-gray-900 placeholder-gray-500"
                          : "bg-gray-700 text-white placeholder-gray-400"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Feedback
                  </label>
                  <textarea
                    name="message"
                    value={feedback.message}
                    onChange={handleInputChange}
                    placeholder="Your feedback"
                    rows="4"
                    className={`w-full px-4 py-2 rounded-lg text-sm ${
                      darkMode
                        ? "bg-gray-200 text-gray-900 placeholder-gray-500"
                        : "bg-gray-700 text-white placeholder-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    type="button"
                    onClick={toggleModal}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      darkMode
                        ? "bg-gray-300 text-gray-900 hover:bg-gray-400"
                        : "bg-gray-600 text-white hover:bg-gray-500"
                    } transition-colors duration-200`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium ${
                      darkMode
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPaperPlane className="mr-2" />
                    {isSubmitting ? "Submitting..." : "Send Feedback"}
                  </motion.button>
                </div>
                {successMessage && (
                  <p className="text-sm text-green-500 mt-2">
                    {successMessage}
                  </p>
                )}
                {errorMessage && (
                  <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Bottom Section */}
        <motion.div
          className={`mt-12 pt-8 border-t ${
            darkMode ? "border-gray-200" : "border-gray-700"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
            <p className={darkMode ? "text-gray-500" : "text-gray-400"}>
              © 2025 TypeSprint. All rights reserved.
            </p>
            <motion.p
              className={`flex items-center mt-4 sm:mt-0 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              Made with <FaHeart className="mx-1 text-red-500" /> by TypeSprint
              Team
            </motion.p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
