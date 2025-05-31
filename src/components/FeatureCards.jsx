import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Tilt from "react-parallax-tilt";
import { FaTimes } from "react-icons/fa";

// Features data
const features = [
  {
    id: 1,
    name: "Manual Typing",
    description:
      "Practice real-world typing scenarios by printing our curated PDFs and entering the text on our platform. Get instant feedback to boost your speed and accuracy, tailored for government exams.",
    icon: "📝",
    color: "from-blue-600 to-indigo-800",
    image: "/assets/manual-typing.jpg",
    redirectPath: "/practice/manual-typing",
  },
  {
    id: 2,
    name: "Paragraph PDFs",
    description:
      "Download professionally designed PDFs with diverse paragraphs for offline practice. Upload your typed results to track progress and receive detailed performance insights.",
    icon: "📄",
    color: "from-green-600 to-teal-800",
    image: "/assets/paragraph-pdfs.jpg",
    redirectPath: "/practice/paragraph-pdfs",
  },
  {
    id: 3,
    name: "Typing Analytics",
    description:
      "Dive into comprehensive analytics to monitor your typing speed, accuracy, and trends. Visualize your progress with interactive charts and get personalized tips to excel.",
    icon: "📊",
    color: "from-purple-600 to-violet-800",
    image: "/assets/typing-analytics.jpg",
    redirectPath: "/analytics",
  },
  {
    id: 4,
    name: "Custom Themes",
    description:
      "Make typing fun with customizable themes! Choose from vibrant gradients, neon glows, or minimalist designs to create a practice environment that inspires you.",
    icon: "🎨",
    color: "from-pink-600 to-rose-800",
    image: "/assets/custom-themes.jpg",
    redirectPath: "/settings/themes",
  },
];

// Skeleton component for loading state
const SkeletonFeatureCard = () => (
  <div className="bg-gray-800 bg-opacity-80 rounded-xl p-6 h-40 animate-pulse">
    <div className="h-8 bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
  </div>
);

const FeatureCards = ({ darkMode, isLoading }) => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

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
            className="rounded-xl shadow-2xl overflow-hidden cursor-pointer relative z-10"
            initial={{ opacity: 0, y: 60, rotateX: 10 }}
            animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
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
              className={`block p-6 bg-gradient-to-br ${feature.color} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 relative overflow-hidden`}
            >
              {/* Creative glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-between">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">
                  {feature.name}
                </h3>
                <span className="text-4xl md:text-5xl animate-pulse">
                  {feature.icon}
                </span>
              </div>
              <p className="text-white text-opacity-90 mt-2 text-sm md:text-base">
                Discover {feature.name.toLowerCase()}
              </p>
            </div>
          </motion.div>
        </Tilt>
      )),
    [inView, handleFeatureClick]
  );

  return (
    <section className="py-16">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2
          className={`text-4xl md:text-5xl font-extrabold mb-10 text-center ${
            darkMode ? "text-white" : "text-white"
          } bg-clip-text bg-gradient-to-r ${
            darkMode ? "from-pink-400 to-blue-400" : "from-pink-500 to-blue-500"
          } text-transparent`}
          style={{
            WebkitTextStroke: darkMode
              ? "0.5px rgba(255, 255, 255, 0.3)"
              : "0.5px rgba(0, 0, 0, 0.2)",
            textShadow: darkMode
              ? "0 0 8px rgba(255, 105, 180, 0.8), 0 0 12px rgba(59, 130, 246, 0.8)"
              : "0 0 8px rgba(255, 105, 180, 0.6), 0 0 12px rgba(59, 130, 246, 0.6)",
            color: darkMode ? "#ffffff" : "#1f2937", // Fallback for non-webkit browsers
          }}
        >
          Discover Our Unique Features
        </h2>
        <AnimatePresence mode="wait">
          {!selectedFeature ? (
            <motion.div
              key="feature-grid"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              {isLoading
                ? [...Array(4)].map((_, i) => <SkeletonFeatureCard key={i} />)
                : featureCards}
            </motion.div>
          ) : (
            <motion.div
              key="feature-detail"
              className="relative bg-gray-900 bg-opacity-90 rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto backdrop-blur-lg border border-white/10"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <button
                onClick={handleCloseFeature}
                className="absolute top-4 right-4 text-white text-2xl md:text-3xl hover:text-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 z-10"
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
                    className="w-full h-64 md:h-80 object-cover rounded-xl shadow-lg"
                    onError={(e) => {
                      e.target.src = "/assets/placeholder.jpg"; // Fallback image
                    }}
                  />
                </motion.div>
                <motion.div
                  className="w-full md:w-1/2 flex flex-col justify-between"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 drop-shadow-md">
                      {selectedFeature.name}
                    </h3>
                    <p className="text-white text-opacity-90 text-base md:text-lg leading-relaxed">
                      {selectedFeature.description}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handleRedirect(selectedFeature.redirectPath)}
                    className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Try ${selectedFeature.name} now`}
                  >
                    Try {selectedFeature.name} Now
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
