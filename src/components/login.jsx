import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaGoogle } from "react-icons/fa";
import CustomCursor from "../components/CustomCursor";

const VALID_EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "yahoo.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "msn.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "gmx.com",
  "mail.com",
  "fastmail.com",
  "yandex.com",
  "rediffmail.com",
];

const TEMP_EMAIL_DOMAINS = [
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
  "disposabl.email",
  "throwawaymail.com",
  "temp-mail.org",
  "yopmail.com",
  "sharklasers.com",
  "getnada.com",
  "trashmail.com",
  "mintemail.com",
  "tempmailo.com",
  "burnermail.io",
  "maildrop.cc",
];

const Login = ({ darkMode }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authData, setAuthData] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, signup, currentUser, loading } = useAuth();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (!loading && currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, loading, navigate, from]);

  if (loading || currentUser) {
    return null;
  }

  const validateEmailDomain = (email) => {
    if (!email.includes("@")) {
      return { isValid: false, error: "Please enter a valid email address." };
    }

    const domain = email.toLowerCase().split("@")[1];
    if (!domain) {
      return { isValid: false, error: "Please enter a valid email address." };
    }

    if (TEMP_EMAIL_DOMAINS.includes(domain)) {
      return { isValid: false, error: "Do not use temporary email services." };
    }

    if (!VALID_EMAIL_DOMAINS.includes(domain)) {
      return { isValid: false, error: "Please do not use Temp Mails :/" };
    }

    return { isValid: true, error: "" };
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (currentUser) {
      setAuthError("Already logged in. Please log out first.");
      return;
    }
    setAuthError("");
    setIsLoading(true);

    const { isValid, error } = validateEmailDomain(authData.email);
    if (!isValid) {
      setAuthError(error);
      setIsLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signup(authData.email, authData.password, "User");
      } else {
        await login(authData.email, authData.password);
      }
      navigate(from, { replace: true });
    } catch (error) {
      setAuthError(
        error.message.includes("Already logged in")
          ? error.message
          : error.code === "auth/user-not-found"
          ? "No account found with this email. Please sign up."
          : error.code === "auth/wrong-password"
          ? "Incorrect password. Please try again."
          : error.code === "auth/email-already-in-use"
          ? "This email is already registered. Please log in."
          : error.code === "auth/invalid-email"
          ? "Invalid email format. Please check your email."
          : "Authentication failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (currentUser) {
      setAuthError("Already logged in. Please log out first.");
      return;
    }
    setAuthError("");
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      const googleUser = result.user;

      const { isValid, error } = validateEmailDomain(googleUser.email);
      if (!isValid) {
        await logout(); // Use logout from useAuth
        setAuthError(error);
        setIsLoading(false);
        return;
      }

      navigate(from, { replace: true });
    } catch (error) {
      setAuthError(
        error.message.includes("Already logged in")
          ? error.message
          : "Failed to sign in with Google. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <CustomCursor />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-8 rounded-lg shadow-xl max-w-md w-full ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 text-center ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <button
          onClick={handleGoogleAuth}
          disabled={isLoading || !!currentUser}
          className={`w-full mb-6 flex items-center justify-center gap-2 p-3 rounded ${
            isLoading || currentUser
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          } text-white transition-colors`}
        >
          <FaGoogle /> Continue with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div
              className={`w-full border-t ${
                darkMode ? "border-gray-600" : "border-gray-300"
              }`}
            ></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className={`px-2 ${
                darkMode
                  ? "bg-gray-800 text-gray-400"
                  : "bg-white text-gray-500"
              }`}
            >
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 rounded border ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={authData.email}
              onChange={(e) =>
                setAuthData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              disabled={isLoading || !!currentUser}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-3 rounded border ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={authData.password}
              onChange={(e) =>
                setAuthData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              disabled={isLoading || !!currentUser}
            />
          </div>
          {authError && <p className="text-red-500 text-sm">{authError}</p>}
          <button
            type="submit"
            disabled={isLoading || !!currentUser}
            className={`w-full p-3 rounded ${
              isLoading || currentUser
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-colors`}
          >
            {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <p
          className={`mt-4 text-center ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline"
            disabled={isLoading || !!currentUser}
          >
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
