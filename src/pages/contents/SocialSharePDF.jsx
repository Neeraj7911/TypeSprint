import React, { Component } from "react";
import { FaWhatsapp, FaTwitter, FaLinkedin } from "react-icons/fa";
import {
  WhatsappShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";

const shareUrl = "https://typesprint.live/CSIR-JSA-typing-test-practice";
const shareTitle = "Master the CSIR JSA Typing Test with TypeSprint!";

// Error Boundary for third-party share buttons
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("SocialSharePDF error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-gray-400 text-center">
          Unable to load sharing options.
        </div>
      );
    }
    return this.props.children;
  }
}

const SocialSharePDF = ({ handleSaveAsPDF }) => (
  <section className="py-8 bg-gray-900/60 backdrop-blur-sm">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h3 className="text-xl font-semibold text-white mb-4">
        Share Your CSIR JSA Journey
      </h3>
      <p className="text-gray-400 mb-4">
        Inspire others by sharing this page or download it as a PDF!
      </p>
      <ErrorBoundary>
        <div className="flex flex-row justify-center space-x-4 items-center">
          <WhatsappShareButton url={shareUrl} title={shareTitle}>
            <div className="p-3 bg-green-500 rounded-full hover:bg-green-400 transition-all duration-300 shadow-sm">
              <FaWhatsapp
                className="h-6 w-6 text-white"
                aria-label="Share on WhatsApp"
              />
            </div>
          </WhatsappShareButton>
          <TwitterShareButton url={shareUrl} title={shareTitle}>
            <div className="p-3 bg-blue-400 rounded-full hover:bg-blue-300 transition-all duration-300 shadow-sm">
              <FaTwitter
                className="h-6 w-6 text-white"
                aria-label="Share on Twitter"
              />
            </div>
          </TwitterShareButton>
          <LinkedinShareButton url={shareUrl} title={shareTitle}>
            <div className="p-3 bg-blue-700 rounded-full hover:bg-blue-600 transition-all duration-300 shadow-sm">
              <FaLinkedin
                className="h-6 w-6 text-white"
                aria-label="Share on LinkedIn"
              />
            </div>
          </LinkedinShareButton>
          <button
            onClick={handleSaveAsPDF}
            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-all duration-300 shadow-sm"
            aria-label="Download as PDF"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>
      </ErrorBoundary>
    </div>
  </section>
);

export default SocialSharePDF;
