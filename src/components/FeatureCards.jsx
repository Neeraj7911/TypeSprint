import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Tilt from "react-parallax-tilt";
import {
  FaTimes,
  FaPenNib,
  FaFileDownload,
  FaChartBar,
  FaPaintRoller,
  FaRocket,
} from "react-icons/fa";

// Features data
const features = [
  {
    id: 1,
    name: "Manual Typing",
    description:
      "Practice real-world typing scenarios with curated PDFs. Enter text online for instant feedback on speed and accuracy, tailored for government exams.",
    icon: FaPenNib,
    color: "from-blue-600 to-indigo-800",
    image: "/assets/manual-typing.jpg",
    redirectPath: "/practice/manual-typing",
  },
  {
    id: 2,
    name: "Paragraph PDFs",
    description:
      "Download diverse paragraph PDFs for offline practice. Upload results to track progress and gain detailed performance insights.",
    icon: FaFileDownload,
    color: "from-green-600 to-teal-800",
    image: "/assets/paragraph-pdfs.jpg",
    redirectPath: "/practice/paragraph-pdfs",
  },
  {
    id: 3,
    name: "Add Typing Content",
    description:
      "Add your Own Typing Content! Upload custom text to practice with your own material. Perfect for personalized learning.",
    icon: FaChartBar,
    color: "from-purple-600 to-violet-800",
    image: "/assets/typing-analytics.jpg",
    redirectPath: "/analytics",
  },
  {
    id: 4,
    name: "Create Rooms",
    description:
      "Create Rooms or Create a competitions or events and battel to eachother.",
    icon: FaPaintRoller,
    color: "from-pink-600 to-rose-800",
    image: "/assets/custom-themes.jpg",
    redirectPath: "/settings/themes",
  },
  {
    id: 5,
    name: "CodeRush Arena",
    description:
      "Dive into the CodeRush Arena! Battle live to type code faster, dominate leaderboards, and unlock power-up badges. Master tech exams with electrifying challenges!",
    icon: FaRocket,
    color: "from-blue-500 to-emerald-500",
    image: "/assets/coderush-arena.jpg",
    redirectPath: "/practice/coderush-arena",
  },
];

// Skeleton component for loading state
const SkeletonFeatureCard = () => (
  <div className="bg-gray-800 bg-opacity-80 rounded-xl p-6 h-[300px] animate-pulse">
    <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
  </div>
);

const FeatureCards = ({ darkMode, isLoading }) => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  // Handlers
  const handleFeatureClick = useCallback((feature) => {
    setSelectedFeature(feature);
  }, []);

  const handleCloseFeature = useCallback(() => {
    setSelectedFeature(null);
  }, []);

  const handleRedirect = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  // Memoized feature cards
  const featureCards = useMemo(
    () =>
      features.map((feature, index) => (
        <Tilt
          key={feature.id}
          tiltMaxAngleX={10}
          tiltMaxAngleY={10}
          perspective={800}
          scale={1.05}
          transitionSpeed={400}
          className="relative"
        >
          <motion.div
            className={`rounded-xl shadow-2xl overflow-hidden cursor-pointer relative z-10 h-[300px] flex flex-col justify-between ${
              feature.name === "CodeRush Arena" ? "floodlight" : ""
            }`}
            initial={{ opacity: 0, y: 60 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 * index, duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`View ${feature.name} details`}
              onClick={() => handleFeatureClick(feature)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleFeatureClick(feature)
              }
              className={`block p-6 bg-gradient-to-br ${feature.color} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 relative overflow-hidden h-full flex flex-col justify-between`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-semibold text-white">
                  {feature.name}
                </h3>
                <feature.icon className="text-4xl text-white flex-shrink-0" />
              </div>
              <p className="text-white text-opacity-90 text-sm md:text-base leading-relaxed mt-2">
                {feature.description.split(". ")[0] + "."}
              </p>
            </div>
          </motion.div>
        </Tilt>
      )),
    [inView, handleFeatureClick]
  );

  // Typewriter effect for CodeRush Arena modal title
  const typewriterVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <section className="py-16">
      <style>
        {`
          @keyframes floodlight {
            0% { box-shadow: 0 0 5px rgba(6, 182, 212, 0.5), 0 0 10px rgba(16, 185, 129, 0.3); }
            50% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.8), 0 0 25px rgba(16, 185, 129, 0.5); }
            100% { box-shadow: 0 0 5px rgba(6, 182, 212, 0.5), 0 0 10px rgba(16, 185, 129, 0.3); }
          }
          .floodlight:hover {
            animation: floodlight 1.5s infinite;
          }
          @keyframes particles {
            0% { background-position: 0 0; }
            100% { background-position: 100px 100px; }
          }
          .coderush-modal::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
            opacity: 0.3;
            animation: particles 20s linear infinite;
          }
        `}
      </style>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2
          className={`text-3xl md:text-4xl font-bold mb-10 text-center ${
            darkMode ? "text-white" : "text-gray-800"
          } bg-clip-text bg-gradient-to-r from-orange-500 to-purple-500 text-transparent`}
        >
          Discover Our Unique Features
          <span className="text-sm text-gray-500 block mt-2">
            {" "}
            (Comming Soon)
          </span>
        </h2>
        <AnimatePresence>
          {!selectedFeature ? (
            <motion.div
              key="feature-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {isLoading
                ? [...Array(5)].map((_, i) => <SkeletonFeatureCard key={i} />)
                : featureCards}
            </motion.div>
          ) : (
            <motion.div
              key="feature-detail"
              className={`relative bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto backdrop-blur-lg border border-white/10 ${
                selectedFeature.name === "CodeRush Arena"
                  ? "coderush-modal"
                  : ""
              }`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <button
                onClick={handleCloseFeature}
                className="absolute top-4 right-4 text-white text-2xl hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 z-10"
                aria-label="Close feature details"
              >
                <FaTimes />
              </button>
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                <motion.div
                  className="w-full md:w-1/2"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <img
                    src={selectedFeature.image}
                    alt={`${selectedFeature.name} feature`}
                    className="w-full h-48 md:h-64 object-cover rounded-xl shadow-lg"
                    onError={(e) => (e.target.src = "/assets/placeholder.jpg")}
                  />
                </motion.div>
                <motion.div
                  className="w-full md:w-1/2 flex flex-col justify-between"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                      {selectedFeature.name === "CodeRush Arena" ? (
                        <span className="inline-flex">
                          {"CodeRush Arena".split("").map((char, i) => (
                            <motion.span
                              key={i}
                              custom={i}
                              variants={typewriterVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              {char}
                            </motion.span>
                          ))}
                        </span>
                      ) : (
                        selectedFeature.name
                      )}
                    </h3>
                    <p className="text-white text-opacity-90 text-sm md:text-base leading-relaxed">
                      {selectedFeature.description}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handleRedirect(selectedFeature.redirectPath)}
                    className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Try ${selectedFeature.name} now`}
                  >
                    {selectedFeature.name === "CodeRush Arena"
                      ? "Enter the Arena!"
                      : `Try ${selectedFeature.name} Now`}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default React.memo(FeatureCards);
