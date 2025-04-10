import React from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

const LoginPrompt = ({ darkMode }) => {
  const { signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-md mx-auto p-8 rounded-xl shadow-xl ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-4 text-center ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Sign in to Start Typing
      </h2>
      <p
        className={`mb-6 text-center ${
          darkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Track your progress and compete with others
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogin}
        className="w-full flex items-center justify-center space-x-2 bg-white text-gray-800 px-6 py-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      >
        <FaGoogle className="text-xl" />
        <span>Continue with Google</span>
      </motion.button>
    </motion.div>
  );
};

export default LoginPrompt;
