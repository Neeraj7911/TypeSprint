import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaComments } from "react-icons/fa";

// Sample messages with professional context
const sampleMessages = [
  {
    user: "Arjun Sharma",
    text: "Just hit 80 WPM on the SSC typing test! 😄 Any tips on improving accuracy though?",
  },
  {
    user: "Priya Verma",
    text: "@Arjun Sharma Congrats! 🎉 Try practicing CHSL passages slowly at first — focus on accuracy over speed!",
  },
  {
    user: "Rohit Patel",
    text: "Yes! Also join our daily typing challenge in #TypingRoom — it really helps build consistency 🔥",
  },
  {
    user: "Ananya Singh",
    text: "I'm prepping for RRB exams — does anyone know helpful keyboard shortcuts or typing hacks?",
  },
  {
    user: "Vikram Rao",
    text: "@Ananya Singh Yes! Ctrl+Backspace deletes whole words — a game changer 😎",
  },
  {
    user: "Neha Gupta",
    text: "Finally hit 90 WPM today!!! 🥳 Anyone want to do a 1v1 speed test tonight?",
  },
  {
    user: "Sanya Mehta",
    text: "Aced UPPSC 💪 Now switching gears for SSC CGL... What resources worked best for you all?",
  },
  {
    user: "Amit Kumar",
    text: "This community rocks 🚀 Who’s free for a quick typing sprint right now?",
  },
  {
    user: "Karan Joshi",
    text: "@Neha Gupta I’m in! Let’s race 🏁 TypingTest.com or TypeSprint?",
  },
  {
    user: "Tanya Bansal",
    text: "Guys, is it normal to plateau at 70 WPM? Been stuck for a week 😓",
  },
  {
    user: "Priya Verma",
    text: "@Tanya Bansal totally normal! Try switching up the passages or take a day off. Helped me break 75 💡",
  },
  {
    user: "Arjun Sharma",
    text: "Thanks, Priya & Rohit! Just joined the daily challenge. Let’s see if I can cross 85 this week 😁",
  },
  {
    user: "Riya Malhotra",
    text: "Anyone here preparing for LIC AAO? Typing practice feels different for that 😅",
  },
  {
    user: "Amit Kumar",
    text: "@Riya Malhotra Yep, the content is more formal. I use PDF excerpts from previous exams for practice 📄",
  },
  {
    user: "Neha Gupta",
    text: "Just raced @Karan Joshi... he beat me 😭 but I hit 92 WPM! This is addictive 😂",
  },
  {
    user: "Karan Joshi",
    text: "@Neha Gupta That was intense 😆 Let’s go again tomorrow — best of 3?",
  },
];

function ChatPreview({ darkMode, playSound }) {
  const navigate = useNavigate();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

  // Manage message cycling
  useEffect(() => {
    const updateMessages = () => {
      const newMessages = sampleMessages.slice(
        currentMessageIndex,
        currentMessageIndex + 3
      );
      setDisplayedMessages(newMessages);
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000); // Typing indicator for 2s
    };

    updateMessages();

    const interval = setInterval(() => {
      setCurrentMessageIndex(
        (prev) => (prev + 1) % (sampleMessages.length - 2)
      );
    }, 6000); // 6s cycle for smooth transitions

    return () => clearInterval(interval);
  }, [currentMessageIndex]);

  const handleChatClick = () => {
    playSound();
    navigate("/help-section");
  };

  // Prevent text copying
  const handleCopy = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <>
      <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 w-full">
        <div className="max-w-full sm:max-w-3xl md:max-w-4xl mx-auto">
          <h2
            className={`text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center tracking-tight select-none ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
            onCopy={handleCopy}
          >
            Engage with the TypeSprint Community
          </h2>
          <p
            className={`text-base sm:text-lg mb-6 sm:mb-8 text-center max-w-lg sm:max-w-2xl mx-auto select-none ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
            onCopy={handleCopy}
          >
            Join typists all over India to exchange knowledge and enhance your
            typing skills.
          </p>
          <motion.div
            ref={ref}
            className={`relative p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-700/50 ${
              darkMode ? "bg-opacity-95" : "bg-opacity-100"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative bg-transparent rounded-lg p-4 sm:p-6 mb-10 sm:mb-12 min-h-[200px] sm:min-h-[240px] flex flex-col gap-3 sm:gap-4">
              <AnimatePresence mode="popLayout">
                {displayedMessages.map((msg, index) => (
                  <motion.div
                    key={`${msg.user}-${currentMessageIndex + index}`}
                    className={`p-3 sm:p-4 rounded-lg max-w-[80%] sm:max-w-[70%] md:max-w-[65%] select-none z-10 ${
                      index % 2 === 0
                        ? "ml-auto bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "mr-auto bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
                    } shadow-sm transition-all duration-300`}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onCopy={handleCopy}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-xs sm:text-sm">
                        {msg.user}
                      </span>
                      <span className="text-xs text-gray-400">Just now</span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm">{msg.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.div
                className="absolute bottom-0 left-4 sm:left-6 flex items-center gap-2 max-w-[80%] sm:max-w-[70%] select-none z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: isTyping ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                onCopy={handleCopy}
              >
                <div className="flex space-x-1">
                  <div
                    className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-[bounce_0.5s_infinite]"
                    style={{ animationDelay: "0s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-[bounce_0.5s_infinite]"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-[bounce_0.5s_infinite]"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <span className="text-gray-500 text-xs">
                  Someone is typing...
                </span>
              </motion.div>
            </div>
            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={handleChatClick}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium text-sm sm:text-base tracking-wide bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300`}
                aria-label="Join the community chat"
              >
                <FaComments className="text-base sm:text-lg" />
                Join the Community
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </>
  );
}

export default ChatPreview;
