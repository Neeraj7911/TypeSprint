import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCrown,
  FaInfinity,
  FaChartLine,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

const questions = [
  {
    id: 1,
    question: "What's your target exam?",
    options: ["SSC CGL", "IBPS PO", "RRB", "Other"],
  },
  {
    id: 2,
    question: "How soon is your exam?",
    options: ["1-3 months", "3-6 months", "6+ months", "Not decided"],
  },
  {
    id: 3,
    question: "What's your current typing speed?",
    options: ["Below 20 WPM", "20-35 WPM", "35-50 WPM", "Above 50 WPM"],
  },
];

const PremiumUpsell = ({ darkMode, onClose, currentWpm, currentAccuracy }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showPlans, setShowPlans] = useState(false);

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowPlans(true);
    }
  };

  const plans = [
    {
      name: "3 Months",
      price: "₹99",
      features: [
        "Unlimited typing tests",
        "Detailed analytics",
        "Progress tracking",
        "Basic support",
      ],
      recommended: false,
    },
    {
      name: "6 Months",
      price: "₹149",
      features: [
        "Everything in 3 Months",
        "Advanced analytics",
        "Personalized training",
        "Priority support",
      ],
      recommended: true,
    },
    {
      name: "12 Months",
      price: "₹199",
      features: [
        "Everything in 6 Months",
        "1-on-1 coaching",
        "Mock tests",
        "Guaranteed results",
      ],
      recommended: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative w-full max-w-2xl rounded-2xl shadow-2xl ${
          darkMode ? "bg-gray-900" : "bg-white"
        } p-8`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {!showPlans ? (
          <div>
            <div className="text-center mb-8">
              <FaCrown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h2
                className={`text-2xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Unlock Your Full Potential
              </h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Answer a few questions to get a personalized recommendation
              </p>
            </div>

            <motion.div
              key={currentQuestion}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
            >
              <h3
                className={`text-xl font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {questions[currentQuestion].question}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <motion.button
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option)}
                    className={`p-4 rounded-lg border-2 ${
                      darkMode
                        ? "border-gray-700 hover:border-blue-500"
                        : "border-gray-200 hover:border-blue-500"
                    } text-left transition-colors duration-200`}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2
                className={`text-2xl font-bold mb-2 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                Choose Your Plan
              </h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Based on your answers, we recommend the 6-month plan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <motion.div
                  key={plan.name}
                  whileHover={{ scale: 1.02 }}
                  className={`relative rounded-xl p-6 ${
                    plan.recommended
                      ? "border-2 border-blue-500"
                      : darkMode
                      ? "border border-gray-700"
                      : "border border-gray-200"
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                        Recommended
                      </span>
                    </div>
                  )}

                  <h3
                    className={`text-xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-2xl font-bold text-blue-500 mb-4">
                    {plan.price}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <span
                          className={`${
                            darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-2 rounded-lg ${
                      plan.recommended
                        ? "bg-blue-500 text-white"
                        : darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    Choose Plan
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PremiumUpsell;
