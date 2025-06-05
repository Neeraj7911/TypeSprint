import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div
            className={`p-8 rounded-lg shadow-xl max-w-md w-full ${
              this.props.darkMode
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-red-500 mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full p-3 rounded bg-blue-500 hover:bg-blue-600 text-white"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
