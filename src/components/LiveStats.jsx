import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { FaUsers, FaBolt } from "react-icons/fa";

const LiveStats = ({ darkMode }) => {
  const [stats, setStats] = useState({
    liveUsers: 300, // Starting realistic value
    competingUsers: 100, // Starting realistic value
    key: Date.now(), // Unique key for animation
  });

  // Motion values for smooth count-up
  const liveUsersMotion = useMotionValue(stats.liveUsers);
  const competingUsersMotion = useMotionValue(stats.competingUsers);

  // Round motion values for display
  const liveUsersDisplay = useTransform(liveUsersMotion, Math.round);
  const competingUsersDisplay = useTransform(competingUsersMotion, Math.round);

  // Generate incremental stats
  const generateStats = () => {
    setStats((prev) => {
      const changeLive = Math.floor(Math.random() * 21) - 10; // ±10
      const changeCompeting = Math.floor(Math.random() * 21) - 10; // ±10
      return {
        liveUsers: Math.min(Math.max(prev.liveUsers + changeLive, 200), 800), // 200–800
        competingUsers: Math.min(
          Math.max(prev.competingUsers + changeCompeting, 50),
          400
        ), // 50–400
        key: Date.now(), // Update key
      };
    });
  };

  // Update motion values when stats change
  useEffect(() => {
    liveUsersMotion.set(stats.liveUsers);
    competingUsersMotion.set(stats.competingUsers);
  }, [stats, liveUsersMotion, competingUsersMotion]);

  // Refresh stats every 10 seconds
  useEffect(() => {
    generateStats();
    const interval = setInterval(generateStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stats.key} // Unique key forces re-render
        className="flex flex-col space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <p
            className={`text-xs sm:text-sm font-medium flex items-center space-x-1.5 ${
              darkMode ? "text-white" : "text-gray-800"
            } bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600`}
          >
            <FaUsers className="text-[#ffd700]" />
            <span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {liveUsersDisplay}
              </motion.span>{" "}
              live now
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <p
            className={`text-xs sm:text-sm font-medium flex items-center space-x-1.5 ${
              darkMode ? "text-white" : "text-gray-800"
            } bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600`}
          >
            <FaBolt className="text-[#ffd700]" />
            <span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {competingUsersDisplay}
              </motion.span>{" "}
              competing in tests now
            </span>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveStats;
