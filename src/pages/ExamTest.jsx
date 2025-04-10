import React from "react";
import { useParams } from "react-router-dom";
import ExamTypingTest from "../components/ExamTypingTest";

const examData = {
  "ssc-cgl": { id: "ssc-cgl", name: "SSC CGL", color: "blue" },
  "ibps-po": { id: "ibps-po", name: "IBPS PO", color: "green" },
  rrb: { id: "rrb", name: "RRB", color: "yellow" },
  upsc: { id: "upsc", name: "UPSC", color: "purple" },
  "bank-po": { id: "bank-po", name: "Bank PO", color: "pink" },
};

const ExamTest = ({ darkMode }) => {
  const { examId } = useParams();
  const exam = examData[examId];

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className={`text-xl ${darkMode ? "text-white" : "text-gray-800"}`}>
          Exam not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <ExamTypingTest
        examId={exam.id}
        examName={exam.name}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ExamTest;
