import React, { useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";

const ReportGenerator = ({ testResults, darkMode }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generatePDF = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate certificate content locally
      const certificateContent = `
        This is to certify that the participant has completed the TypeSprint challenge with the following results:
        
        Words Typed: ${testResults.wordsTyped} WPM
        Accuracy: ${testResults.accuracy.toFixed(2)}%
        Date: ${new Date().toLocaleDateString()}
      `;

      // Create PDF
      const pdf = new jsPDF();

      // Load and add TypeSprint logo (SVG)
      try {
        const svgResponse = await fetch("../assets/react.svg");
        if (!svgResponse.ok) {
          throw new Error(
            `Failed to load SVG: ${svgResponse.status} ${svgResponse.statusText}`
          );
        }
        const svgText = await svgResponse.text();
        const svgElement = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svgElement.innerHTML = svgText;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const imgData = `data:image/svg+xml;base64,${btoa(svgData)}`;

        pdf.addImage(imgData, "SVG", 10, 10, 40, 40);
      } catch (svgError) {
        console.error("Error loading SVG:", svgError);
        // Continue without the logo if it fails to load
      }

      // Add certificate content
      pdf.setFontSize(22);
      pdf.text("TypeSprint Certificate of Participation", 105, 40, {
        align: "center",
      });
      pdf.setFontSize(14);
      const splitText = pdf.splitTextToSize(certificateContent, 180);
      pdf.text(splitText, 15, 60);

      // Add stamp
      pdf.setFillColor(200, 200, 200);
      pdf.circle(160, 240, 20, "F");
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text("TypeSprint", 160, 240, { align: "center" });
      pdf.text("Certified", 160, 245, { align: "center" });

      // Save the PDF
      pdf.save("typesprint_certificate.pdf");
    } catch (error) {
      console.error("Error generating certificate:", error);
      setError(`Failed to generate certificate: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`mt-8 p-4 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-xl`}
    >
      <p
        className={`text-xl font-semibold mb-4 ${
          darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Congratulations! You've completed the TypeSprint challenge.
      </p>
      <p className={`mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Your typing speed:{" "}
        <span className="font-bold">{testResults.wordsTyped} WPM</span>
        <br />
        Accuracy:{" "}
        <span className="font-bold">{testResults.accuracy.toFixed(2)}%</span>
      </p>
      <motion.button
        onClick={generatePDF}
        disabled={isGenerating}
        className={`${
          darkMode
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-indigo-500 hover:bg-indigo-600"
        } text-white px-4 py-2 rounded transition-colors duration-300`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isGenerating ? "Generating..." : "Generate Certificate"}
      </motion.button>
      {error && (
        <p className={`mt-4 text-red-500 ${darkMode ? "text-opacity-80" : ""}`}>
          {error}
        </p>
      )}
    </motion.div>
  );
};

export default ReportGenerator;
