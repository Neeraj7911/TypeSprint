import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import jsPDF from "jspdf";

function Report() {
  const { currentUser } = useAuth();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchReportData = async () => {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setReportData(userSnap.data().typingHistory);
        }
      };
      fetchReportData();
    }
  }, [currentUser]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Typing Test Report", 10, 10);
    Object.entries(reportData).forEach(([exam, data], index) => {
      doc.text(`${exam.toUpperCase()}:`, 10, 20 + index * 30);
      doc.text(`Date: ${data.date}`, 20, 30 + index * 30);
      doc.text(`Speed: ${data.speed} WPM`, 20, 40 + index * 30);
      doc.text(
        `Mistakes: Full - ${data.mistakes.full}, Half - ${data.mistakes.half}`,
        20,
        50 + index * 30
      );
    });
    doc.save("typing_test_report.pdf");
  };

  if (!reportData) {
    return <div>Loading report data...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Typing Test Report</h2>
      {Object.entries(reportData).map(([exam, data]) => (
        <div key={exam} className="mb-4">
          <h3 className="text-xl font-semibold">{exam.toUpperCase()}</h3>
          <p>Date: {data.date}</p>
          <p>Speed: {data.speed} WPM</p>
          <p>
            Mistakes: Full - {data.mistakes.full}, Half - {data.mistakes.half}
          </p>
        </div>
      ))}
      <button
        onClick={generatePDF}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Download PDF Report
      </button>
    </div>
  );
}

export default Report;
