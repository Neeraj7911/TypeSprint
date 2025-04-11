import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaChartBar,
  FaCrown,
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Header() {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const logoText = "TypeSprint";

  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      setLastScrollTop(st <= 0 ? 0 : st);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  const headerVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: -100 },
  };

  const menuItemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: 20 },
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <motion.header
      className="fixed w-full z-50 transition-all duration-300 bg-transparent backdrop-blur-sm"
      initial="visible"
      animate={scrollDirection === "up" ? "visible" : "hidden"}
      variants={headerVariants}
      transition={{ duration: 0.3 }}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold">
          <div className="flex">
            {logoText.split("").map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600" // Restored original gradient
                whileHover={{
                  scale: [1, 1.2, 0.9, 1.1, 1],
                  transition: {
                    duration: 0.6,
                    times: [0, 0.2, 0.4, 0.6, 0.8],
                    ease: "easeInOut",
                  },
                }}
                style={{ originX: 0.5, originY: 0.5 }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/exams">Exams</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/about">About</NavLink>
          {currentUser ? (
            <>
              <NavLink to="/dashboard">
                <FaChartBar className="inline-block mr-1" />
                Dashboard
              </NavLink>
              <div className="relative group">
                <motion.button
                  className="bg-white bg-opacity-20 text-gray-900 dark:text-white px-4 py-2 rounded-full flex items-center hover:bg-opacity-30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser className="mr-2" />
                  {currentUser.displayName || "Profile"}
                </motion.button>
                <div className="absolute right-0 w-56 mt-2 bg-white dark:bg-opacity-10 backdrop-blur-md rounded-lg shadow-xl z-20 hidden group-hover:block overflow-hidden">
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-white dark:border-opacity-20">
                    <div className="font-bold">{currentUser.email}</div>
                    <div className="mt-1 flex items-center">
                      <FaCrown className="mr-1 text-yellow-400" />
                      <span>{currentUser.subscription}</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-900 dark:text-white">
                    <div className="mb-1">
                      Typing Speed: {currentUser.typingSpeed} WPM
                    </div>
                    <div>Tests Completed: {currentUser.testsCompleted}</div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors duration-200"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-10 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="bg-white bg-opacity-20 text-gray-900 dark:text-white px-4 py-2 rounded-full flex items-center hover:bg-opacity-30 transition-all duration-300"
              >
                <FaUser className="mr-2" />
                Login
              </Link>
            </motion.button>
          )}
        </div>

        <motion.button
          className="md:hidden text-gray-900 dark:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </motion.button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-gradient-to-b from-blue-600 to-purple-600 bg-opacity-95 backdrop-blur-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <MobileNavLink to="/exams" setIsMenuOpen={setIsMenuOpen}>
                Exams
              </MobileNavLink>
              <MobileNavLink to="/leaderboard" setIsMenuOpen={setIsMenuOpen}>
                Leaderboard
              </MobileNavLink>
              <MobileNavLink to="/about" setIsMenuOpen={setIsMenuOpen}>
                About
              </MobileNavLink>
              {currentUser ? (
                <>
                  <MobileNavLink to="/dashboard" setIsMenuOpen={setIsMenuOpen}>
                    <FaChartBar className="inline-block mr-1" />
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/profile" setIsMenuOpen={setIsMenuOpen}>
                    <FaUser className="inline-block mr-1" />
                    Profile
                  </MobileNavLink>
                  <div className="px-4 py-2 text-sm text-gray-900 dark:text-white bg-white bg-opacity-10 rounded-lg">
                    <div className="font-bold">{currentUser.email}</div>
                    <div className="mt-2 flex items-center">
                      <FaCrown className="mr-1 text-yellow-400" />
                      <span>{currentUser.subscription}</span>
                    </div>
                    <div className="mt-1">
                      Typing Speed: {currentUser.typingSpeed} WPM
                    </div>
                    <div className="mt-1">
                      Tests Completed: {currentUser.testsCompleted}
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-500 bg-opacity-80 text-white px-4 py-2 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variants={menuItemVariants}
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  variants={menuItemVariants}
                >
                  <Link
                    to="/login"
                    className="bg-green-500 bg-opacity-80 text-white px-4 py-2 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser className="mr-2" />
                    Login
                  </Link>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ to, children }) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Link
        to={to}
        className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 transition-colors duration-300 relative group"
      >
        {children}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-200 transition-all group-hover:w-full"></span>
      </Link>
    </motion.div>
  );
}

function MobileNavLink({ to, children, setIsMenuOpen }) {
  return (
    <motion.div
      variants={menuItemVariants}
      initial="closed"
      animate="open"
      exit="closed"
    >
      <Link
        to={to}
        className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 transition-colors duration-300 block py-2"
        onClick={() => setIsMenuOpen(false)}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default Header;
