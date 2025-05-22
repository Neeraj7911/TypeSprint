import React from "react";
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
} from "react-icons/fa";
import { Link } from "react-router-dom";
import CustomCursor from "./CustomCursor";
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
    url: "/path/to/your/resume.pdf",
    name: "Resume",
    color: "hover:text-green-500",
  },
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Exams", path: "/exams" },
  { name: "Leaderboard", path: "/leaderboard" },
  { name: "Contact", path: "/contact" },
  { name: "Verify Certificate", path: "/verify" },
];

const Footer = ({ darkMode }) => {
  const logoText = "TypeSprint";
  const [typedText, setTypedText] = React.useState("");

  React.useEffect(() => {
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

  return (
    <footer
      className={`py-12 transition-colors duration-300 ${
        darkMode ? "bg-gray-100 text-gray-900" : " bg-gray-900 text-white"
      }`}
    >
      <div className="container mx-auto px-4">
        <CustomCursor />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1"
          >
            <div className="flex items-center mb-4">
              <motion.div className="text-3xl font-bold relative">
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
              className={`mb-4 ${darkMode ? "text-gray-600" : "text-gray-300"}`}
            >
              Elevate your typing skills with our comprehensive platform
              designed for government exam preparation.
            </p>
            <div className="flex items-center space-x-4">
              <FaMapMarkerAlt
                className={darkMode ? "text-gray-600" : "text-gray-400"}
              />
              <span className={darkMode ? "text-gray-600" : " text-gray-400"}>
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
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={link.path}
                    className={`group flex items-center ${
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
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <motion.a
                href="mailto:Liveproject072@gmail.com"
                className={`flex items-center ${
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
                href="tel:+1234567890"
                className={`flex items-center ${
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
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  } ${link.color} transition-colors duration-200`}
                  whileHover={{ scale: 1.05 }}
                >
                  <link.icon className="text-xl mr-2" />
                  <span className="text-sm">{link.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className={`mt-12 pt-8 ${
            darkMode ? "border-gray-800" : "border-gray-200"
          } border-t`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              © 2025 TypeSprint. All rights reserved.
            </p>
            <motion.p
              className={`flex items-center mt-2 md:mt-0 ${
                darkMode ? "text-gray-400" : "text-gray-600"
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
