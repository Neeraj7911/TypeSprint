import React, { useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase"; // Import from your firebase.jsx
import { doc, getDoc } from "firebase/firestore";
import CustomCursor from "../components/CustomCursor"; // Ensure this path is correct
const CertificateVerify = () => {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const certRef = doc(db, "certificates", certificateNumber);
      const certSnap = await getDoc(certRef);

      if (certSnap.exists()) {
        setResult(certSnap.data());
      } else {
        setError(
          "Certificate not found. Please check the number and try again."
        );
      }
    } catch (err) {
      setError("An error occurred while verifying. Please try again later.");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white flex items-center justify-center p-4">
      <CustomCursor />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg bg-gray-800 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-blue-500 relative overflow-hidden"
      >
        {/* Futuristic Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Certificate Verification
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Enter your certificate number to verify its authenticity.
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              placeholder="Enter Certificate Number (e.g., CERT-1234567890-1234)"
              className="w-full p-3 bg-gray-900 border border-blue-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full py-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Certificate"
            )}
          </motion.button>
        </form>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 bg-gray-900 bg-opacity-90 rounded-lg border border-green-500"
          >
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              Certificate Verified
            </h2>
            <div className="space-y-2 text-gray-200">
              <p>
                <span className="font-medium text-blue-400">Name:</span>{" "}
                {result.userEmail.split("@")[0] || "User"}{" "}
                {/* Assuming name isn't stored; using email prefix */}
              </p>
              <p>
                <span className="font-medium text-blue-400">Email:</span>{" "}
                {result.userEmail}
              </p>
              <p>
                <span className="font-medium text-blue-400">WPM:</span>{" "}
                {result.wpm}
              </p>
              <p>
                <span className="font-medium text-blue-400">Accuracy:</span>{" "}
                {result.accuracy}%
              </p>
              <p>
                <span className="font-medium text-blue-400">Date:</span>{" "}
                {new Date(result.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium text-blue-400">
                  Certificate Number:
                </span>{" "}
                {certificateNumber}
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-4 bg-red-900 bg-opacity-80 rounded-lg border border-red-500 text-red-200"
          >
            <p>{error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CertificateVerify;
