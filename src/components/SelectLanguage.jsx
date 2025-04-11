import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CustomCursor from "../components/CustomCursor";

const SelectLanguage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const examName = query.get("exam");
  const availableLanguages = query.get("availableLanguages").split(",");
  const wpm = parseInt(query.get("wpm")) || 35;
  const font = query.get("font") || "Mangal";

  const [selectedLanguage, setSelectedLanguage] = useState(
    availableLanguages[0]
  );
  const [selectedDuration, setSelectedDuration] = useState(5);

  const handleStartTest = () => {
    navigate(
      `/typing-test?exam=${examName}&language=${selectedLanguage}&wpm=${wpm}&font=${font}&duration=${selectedDuration}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col items-center py-12 px-4 relative">
      <CustomCursor />
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-blue-500"
      >
        Select Language for {examName.replace(/-/g, " ").toUpperCase()}
      </motion.h1>
      <p className="text-gray-300 mb-8 text-center max-w-2xl">
        Choose the language and duration you want to practice for this exam.
      </p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-lg mb-8"
      >
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full p-3 bg-gray-800 border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
        >
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-lg mb-8"
      >
        <select
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
          className="w-full p-3 bg-gray-800 border border-blue-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-300"
        >
          <option value={1}>1 Minute</option>
          <option value={2}>2 Minutes</option>
          <option value={5}>5 Minutes</option>
          <option value={10}>10 Minutes</option>
          <option value={20}>20 Minutes</option>
        </select>
      </motion.div>
      <motion.button
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 15px rgba(255, 165, 0, 0.7)",
        }}
        onClick={handleStartTest}
        className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        Start Test
      </motion.button>
    </div>
  );
};

export default SelectLanguage;
