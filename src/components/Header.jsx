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
  FaEnvelope,
} from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import NotificationBell from "./NotificationBell";

function Header() {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [userData, setUserData] = useState({
    subscription: "Free",
    typingSpeed: 0,
    testsCompleted: 0,
  });
  const [newMessageCount, setNewMessageCount] = useState(0);
  const logoText = "TypeSprint";

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        console.log("No current user for user data fetch");
        setUserData({
          subscription: "Free",
          typingSpeed: 0,
          testsCompleted: 0,
        });
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          console.warn(
            `User document for UID ${currentUser.uid} does not exist`,
          );
        }
        const credits = userDoc.exists() ? userDoc.data().credits || 0 : 0;

        const resultsRef = collection(db, "users", currentUser.uid, "results");
        const resultsSnapshot = await getDocs(resultsRef);
        const testResults = resultsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          wpm: doc.data().netWpm || doc.data().wpm || 0,
        }));

        const typingSpeed = testResults.length
          ? Math.max(...testResults.map((r) => r.wpm || 0))
          : 0;
        const testsCompleted = testResults.length;

        setUserData({
          subscription: credits > 0 ? "Premium" : "Free",
          typingSpeed,
          testsCompleted,
        });
      } catch (error) {
        console.error("Error fetching user data:", error.message, error.code);
        setUserData({
          subscription: "Free",
          typingSpeed: 0,
          testsCompleted: 0,
        });
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Fetch new message notifications from Firestore
  useEffect(() => {
    if (!currentUser) {
      setNewMessageCount(0);
      console.log("No current user, resetting new message count to 0");
      return;
    }

    const checkUserDoc = async () => {
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.warn(
          `User document for UID ${currentUser.uid} does not exist; notifications may not work`,
        );
      }
    };
    checkUserDoc();

    console.log(
      "Setting up onSnapshot for notifications, user:",
      currentUser.uid,
    );
    const notificationsRef = collection(
      db,
      "users",
      currentUser.uid,
      "notifications",
    );
    const q = query(
      notificationsRef,
      where("isNew", "==", true),
      where("chatId", "==", "community"),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const count = snapshot.size;
        console.log(
          "New message notifications:",
          count,
          "Docs:",
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
            messageId: doc.data().messageId,
            chatId: doc.data().chatId,
            isNew: doc.data().isNew,
            read: doc.data().read,
            createdAt: doc.data().createdAt
              ? doc.data().createdAt.toDate().toISOString()
              : "No timestamp",
          })),
        );
        setNewMessageCount(count);
      },
      (error) => {
        console.error(
          "Error fetching notifications:",
          error.message,
          error.code,
        );
        if (error.code === "permission-denied") {
          console.warn(
            "Check Firestore rules for users/{userId}/notifications read access",
          );
        }
        setNewMessageCount(0);
      },
    );

    return () => {
      console.log("Cleaning up onSnapshot for user:", currentUser.uid);
      unsubscribe();
    };
  }, [currentUser]);

  // Handle scroll behavior
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

  const mobileMenuVariants = {
    open: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error signing out:", error.message, error.code);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <motion.header
      className="fixed w-full z-50 transition-all duration-300 bg-transparent backdrop-blur-sm"
      initial="visible"
      animate={scrollDirection === "up" ? "visible" : "hidden"}
      variants={headerVariants}
      transition={{ duration: 0.3 }}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl sm:text-3xl font-extrabold">
          <div className="flex">
            {logoText.split("").map((letter, index) => (
              <motion.span
                key={index}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
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

        <div className="hidden md:flex items-center space-x-4 sm:space-x-6">
          <NavLink to="/exams">Exams</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/about">About</NavLink>
          <NotificationBell currentUser={currentUser} />
          {currentUser && (
            <>
              <NavLink to="/dashboard">
                <FaChartBar className="inline-block mr-1" />
                Dashboard
              </NavLink>
              <div className="relative group">
                <motion.button
                  className="bg-white bg-opacity-20 text-gray-900 dark:text-white px-3 sm:px-4 py-2 rounded-full flex items-center hover:bg-opacity-30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaUser className="mr-1 sm:mr-2" />
                  <span className="text-sm sm:text-base">
                    {currentUser.displayName || "Profile"}
                  </span>
                </motion.button>
                <div className="absolute right-0 w-48 sm:w-56 mt-2 bg-white dark:bg-opacity-10 backdrop-blur-md rounded-lg shadow-xl z-20 hidden group-hover:block overflow-hidden">
                  <div className="px-4 py-3 text-xs sm:text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-white dark:border-opacity-20">
                    <div className="font-bold truncate">
                      {currentUser.email}
                    </div>
                    <div className="mt-1 flex items-center">
                      <FaCrown className="mr-1 text-yellow-500" />
                      <span>{userData.subscription}</span>
                    </div>
                  </div>
                  <div className="px-4 py-2 text-xs sm:text-sm text-gray-900 dark:text-white">
                    <div className="mb-1">
                      Typing Speed: {userData.typingSpeed} WPM
                    </div>
                    <div>Tests Completed: {userData.testsCompleted}</div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-xs sm:text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-75 transition-colors duration-200"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white dark:hover:bg-opacity-75 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link to="/help-section" className="relative">
                  <FaEnvelope className="text-indigo-600 text-lg sm:text-xl" />
                  {newMessageCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {newMessageCount > 4 ? "5+" : newMessageCount}
                    </span>
                  )}
                </Link>
              </motion.div>
            </>
          )}
          {!currentUser && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="bg-white bg-opacity-20 text-gray-900 dark:text-white px-3 sm:px-4 py-2 rounded-full flex items-center hover:bg-opacity-30 transition-all duration-300 text-sm sm:text-base"
              >
                <FaUser className="mr-1 sm:mr-2" />
                Login
              </Link>
            </motion.button>
          )}
        </div>

        <motion.button
          className="md:hidden text-gray-900 dark:text-white z-50"
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </motion.button>
      </nav>

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            key="mobile-menu"
            className="md:hidden bg-gradient-to-b from-blue-400 to-purple-600 bg-opacity-95 backdrop-blur-md fixed w-full z-40 overflow-y-auto"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4 min-h-[50vh] max-h-[80vh]">
              <MobileNavLink to="/exams" setIsMenuOpen={setIsMenuOpen}>
                Exams
              </MobileNavLink>
              <MobileNavLink to="/leaderboard" setIsMenuOpen={setIsMenuOpen}>
                Leaderboard
              </MobileNavLink>
              <MobileNavLink to="/about" setIsMenuOpen={setIsMenuOpen}>
                About
              </MobileNavLink>
              <NotificationBell
                currentUser={currentUser}
                variant="mobile"
                onNavigate={() => setIsMenuOpen(false)}
              />
              {currentUser && (
                <>
                  <MobileNavLink to="/dashboard" setIsMenuOpen={setIsMenuOpen}>
                    <FaChartBar className="inline-block mr-1" />
                    Dashboard
                  </MobileNavLink>
                  <MobileNavLink to="/profile" setIsMenuOpen={setIsMenuOpen}>
                    <FaUser className="inline-block mr-1" />
                    Profile
                  </MobileNavLink>
                  <div className="px-4 py-2 text-xs sm:text-sm text-gray-900 dark:text-white bg-white bg-opacity-10 rounded-lg">
                    <div className="font-bold truncate">
                      {currentUser.email}
                    </div>
                    <div className="mt-2 flex items-center">
                      <FaCrown className="mr-1 text-yellow-500" />
                      <span>{userData.subscription}</span>
                    </div>
                    <div className="mt-1">
                      Typing Speed: {userData.typingSpeed} WPM
                    </div>
                    <div className="mt-1">
                      Tests Completed: {userData.testsCompleted}
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
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </motion.button>
                  <MobileNavLink
                    to="/help-section"
                    setIsMenuOpen={setIsMenuOpen}
                  >
                    <div className="relative inline-flex items-center">
                      <FaEnvelope className="mr-2 text-indigo-600" />
                      Messages
                      {newMessageCount > 0 && (
                        <span className="absolute top-0 -right-4 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {newMessageCount > 4 ? "5+" : newMessageCount}
                        </span>
                      )}
                    </div>
                  </MobileNavLink>
                </>
              )}
              {!currentUser && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
        className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 transition-colors duration-300 relative group text-sm sm:text-base"
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
      variants={{
        open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
        closed: { opacity: 0, x: 20, transition: { duration: 0.2 } },
      }}
      initial="closed"
      animate="open"
      exit="closed"
    >
      <Link
        to={to}
        className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-200 transition-colors duration-300 block py-2 text-sm sm:text-base"
        onClick={() => setIsMenuOpen(false)}
      >
        {children}
      </Link>
    </motion.div>
  );
}

export default Header;
