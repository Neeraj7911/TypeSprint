import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import TypingTest from "./components/TypingTest";
import Report from "./components/Report";
import Payment from "./components/Payment";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/login";
import ExamTypingTest from "./components/ExamTypingTest";
import CertificateVerify from "./pages/CertificateVerify";
import Leaderboard from "./pages/Leaderboard";
import ExamPage from "./pages/ExamPage";
import Footer from "./components/Footer";
import ExamTypingT from "./pages/ExamTypingTestt"; // Assuming this is ExamTypingTestt.jsx
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Aboutus from "./pages/About";
import SelectLanguage from "./components/SelectLanguage";

// Wrapper component to conditionally render Header
const AppContent = () => {
  const location = useLocation();
  const hideHeader = location.pathname === "/typing-test"; // Hide Header on /typing-test

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {!hideHeader && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test/:examId" element={<TypingTest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/exam/:examId" element={<ExamTypingTest />} />
          <Route path="/verify" element={<CertificateVerify />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/exams" element={<ExamPage />} />
          <Route path="/typing-test" element={<ExamTypingT />} />
          <Route path="/results" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/select-language" element={<SelectLanguage />} />
          <Route
            path="/report"
            element={
              <PrivateRoute>
                <Report />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <Payment />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <div>{!hideHeader && <Footer />}</div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
