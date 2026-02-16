import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import LiveTests from "./pages/LiveTests";
import LiveTestRunner from "./pages/LiveTestRunner";
import AdminLiveTests from "./pages/AdminLiveTests";
import TypingTest from "./components/TypingTest";
import Report from "./components/Report";
import Dashboard from "./components/Dashboard";
import { AuthProvider } from "./contexts/AuthContext.jsx";
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
import PaymentPage from "./components/PaymentPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TnC from "./pages/TnC";
import Norns from "./pages/RefundandShippingPolicy";
import Blogs from "./pages/blogs.jsx";
import { HelmetProvider } from "react-helmet-async";
import Blog1 from "./pages/blogs/Blog1.jsx";
import Blog2 from "./pages/blogs/Blog2.jsx";
import Blog3 from "./pages/blogs/Blog3.jsx";
import SscCgl from "./pages/contents/SscCgl.jsx";
import Min from "./pages/contents/MinTyping.jsx";
import Typingcon from "./pages/contents/EnglishTypingTest.jsx"; // Assuming this is Typingcon.jsx
import CSIRJSATypingTest from "./pages/contents/CSIRJSA.jsx";
import Blog4 from "./pages/blogs/Blog4.jsx"; // Assuming this is Blog4.jsx
import DGAFMSGroupCSyllabus from "./pages/contents/Dgafmstyping.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Blog5 from "./pages/blogs/Blog5.jsx"; // Assuming this is Blog5.jsx
import ChatApp from "./pages/ChatApp.jsx";
import CsirTypingRules from "./pages/contents/CsirTypingRule.jsx";
import Blogcsir from "./pages/blogs/Blog6.jsx"; // Assuming this is Blog6.jsx
import CBSE2025TypingContent from "./pages/contents/CbseJsa.jsx";
import CbseBlog from "./pages/blogs/Blog7.jsx"; // Assuming this is CbseBlog.jsx
import KannadaTypingTest from "./pages/contents/KannadaTyping.jsx";
import Blog8 from "./pages/blogs/Blog8.jsx"; // Assuming this is Blog8.jsx
import CsirDate from "./pages/contents/CsirDate.jsx"; // Assuming this is CsirDate.jsx
import Blog9 from "./pages/blogs/Blog9.jsx"; // Assuming this is Blog9.jsx
import CbseTest from "./pages/contents/CbseTest.jsx"; // Assuming this is CbseJsa.jsx
import Blog10 from "./pages/blogs/Blog10.jsx"; // Assuming this is Blog10.jsx
import Blog11 from "./pages/blogs/Blog11.jsx";
import Blog12 from "./pages/blogs/Blog12.jsx";
import SscCglTyping from "./pages/contents/SscCglTyping.jsx"; // Assuming this is SscCglTyping.jsx
import LiveTestResults from "./pages/LiveTestResults";
import NotFound from "./pages/NotFound.jsx";
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
            <Route
              path="/login"
              element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>
              }
            />{" "}
            <Route path="/exam/:examId" element={<ExamTypingTest />} />
            <Route path="/verify" element={<CertificateVerify />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/help-section" element={<ChatApp />} />
            <Route path="/exams" element={<ExamPage />} />
            <Route path="/typing-test" element={<ExamTypingT />} />
            <Route path="/live-results" element={<LiveTestResults />} />
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
              path="/blogs/csir-jsa-eligiblity-and-typing-speed-criteria"
              element={<Blog4 />}
            />
            <Route
              path="/blogs/dgafms-group-c-typing-test-2025"
              element={<Blog5 />}
            />
            <Route
              path="/blogs/csir-jsa-typing-stenography-test-2025"
              element={<Blogcsir />}
            />
            <Route
              path="/blogs/csir-jsa-typing-stenography-test-date-2025"
              element={<Blog9 />}
            />
            <Route
              path="/blogs/cbse-recruitment-2025-tier2-typing-test-guide"
              element={<CbseBlog />}
            />
            <Route
              path="/ssc-cgl-typing-test-practice"
              element={<SscCglTyping />}
            />
            <Route
              path="/ssc-cgl-typing-test-2025"
              element={<Navigate to="/ssc-cgl-typing-test-practice" replace />}
            />
            <Route
              path="/blogs/kannada-typing-guide-2025"
              element={<Blog8 />}
            />
            <Route
              path="/blogs/kannada-typing-test-guide"
              element={
                <Navigate to="/blogs/kannada-typing-guide-2025" replace />
              }
            />
            <Route
              path="/blogs/top-10-typing-mistakes-ssc-rrb"
              element={<Blog11 />}
            />
            <Route
              path="/blogs/mp-cpct-typing-exam-2026"
              element={<Blog12 />}
            />
            <Route path="/ssc-cgl-typing-test" element={<SscCgl />} />
            <Route
              path="/10-minute-typing-test-for-government-jobs"
              element={<Min />}
            />
            <Route
              path="/kannada-typing-test-practice"
              element={<KannadaTypingTest />}
            />
            <Route
              path="/kannada-typing-test"
              element={<Navigate to="/kannada-typing-test-practice" replace />}
            />
            <Route
              path="/csir-jsa-typing-stenography-test-rules"
              element={<CsirTypingRules />}
            />
            <Route
              path="/cbse-recruitment-2025-tier2-typing-test"
              element={<CBSE2025TypingContent />}
            />
            <Route path="/English-typing-test" element={<Typingcon />} />
            <Route
              path="/CSIR-JSA-typing-test-practice"
              element={<CSIRJSATypingTest />}
            />
            <Route path="/csir-jsa-typing-test-2025" element={<CsirDate />} />
            <Route
              path="/dgafms-group-c-2025-typing-test"
              element={<DGAFMSGroupCSyllabus />}
            />
            <Route
              path="/cbse-superintendent-junior-assistant-recruitment-2025-english-typing-hindi-typing-rules"
              element={<CbseTest />}
            />
            <Route
              path="/blog/cbse-superintendent-junior-assistant-recruitment-2025-english-typing-hindi-typing-rules"
              element={<Blog10 />}
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
            <Route path="/live-tests" element={<LiveTests />} />
            <Route path="/live-test/:testId" element={<LiveTestRunner />} />
            <Route
              path="/admin/live-tests"
              element={
                <PrivateRoute>
                  <AdminLiveTests />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
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
