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
import PaymentPage from "./components/PaymentPage"; // Assuming this is PaymentPage.jsx
// Wrapper component to conditionally render Header
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TnC from "./pages/TnC";
import Norns from "./pages/RefundandShippingPolicy"; // Assuming this is norns.jsx
import Blogs from "./pages/blogs.jsx"; // Assuming this is Blogs.jsx
import { HelmetProvider } from "react-helmet-async";
import Blog1 from "./pages/Blog1";
import Blog2 from "./pages/Blog2"; // Assuming this is Blog2.jsx
import Blog3 from "./pages/Blog3.jsx";
const AppContent = () => {
  const location = useLocation();
  const hideHeader = location.pathname === "/typing-test"; // Hide Header on /typing-test

  return (
    <HelmetProvider>
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
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/t&c" element={<TnC />} />
            <Route path="/norefundandshippingpolicy" element={<Norns />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route
              path="/blogs/boost-typing-speed-competitive-exams"
              element={<Blog1 />}
            />
            <Route
              path="/blogs/prepare-csir-jsa-typing-test"
              element={<Blog2 />}
            />
            <Route
              path="/blogs/full-paragraph-typing-tests-ssc-chsl"
              element={<Blog3 />}
            />

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
                  <PaymentPage />
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
    </HelmetProvider>
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
