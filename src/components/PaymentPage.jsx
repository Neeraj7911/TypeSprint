import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithRedirect,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import LogoSvg from "../assets/react.svg";

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        role="dialog"
        aria-labelledby="modal-title"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900/95 rounded-2xl p-6 max-w-sm w-full border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        >
          <h3
            id="modal-title"
            className="text-xl font-semibold text-white mb-4"
          >
            {title}
          </h3>
          {children}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            ✕
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Reusable Button Component
const Button = ({ children, onClick, disabled, className, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${className} ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`}
    {...props}
  >
    {children}
  </motion.button>
);

const PaymentPage = () => {
  const [creditAmount, setCreditAmount] = useState(
    sessionStorage.getItem("creditAmount") || "10"
  );
  const [paymentReference, setPaymentReference] = useState("");
  const [verificationReference, setVerificationReference] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timer, setTimer] = useState(20);
  const [showUTRModal, setShowUTRModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const utrInputRef = useRef(null);
  const verificationInputRef = useRef(null);

  const upiLink = `upi://pay?pa=9870487659@axl&pn=Neeraj%20Kumar&mc=0000&mode=02&purpose=00&am=${(
    creditAmount * 3
  ).toFixed(2)}&cu=INR`;
  const qrValue = upiLink;

  // Handle Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Timer for payment confirmation prompt
  useEffect(() => {
    if (!showTimerModal) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showTimerModal]);

  // Show timer modal after 20 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTimerModal(true);
      setTimer(20);
    }, 20000);
    return () => clearTimeout(timeout);
  }, []);

  // Auto-focus input fields in modals
  useEffect(() => {
    if (showUTRModal && utrInputRef.current) utrInputRef.current.focus();
    if (showVerificationModal && verificationInputRef.current)
      verificationInputRef.current.focus();
  }, [showUTRModal, showVerificationModal]);

  const handleCreditChange = (amount) => {
    setCreditAmount(amount);
    sessionStorage.setItem("creditAmount", amount);
  };

  const handleTimerResponse = (response) => {
    if (response === "yes") {
      setShowTimerModal(false);
      setShowUTRModal(true);
    } else {
      setShowTimerModal(false);
      setTimer(20);
      // Reshow timer modal after 15 seconds
      setTimeout(() => {
        setShowTimerModal(true);
        setTimer(20);
      }, 15000);
    }
  };

  // Validate UTR (12 digits)
  const validateUTR = (utr) => /^[0-9]{12}$/.test(utr);

  // Handle UTR submission
  const handleReferenceSubmit = async (e) => {
    e.preventDefault();
    if (!paymentReference || !validateUTR(paymentReference)) {
      setError("Please enter a valid 12-digit UTR.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "payments", paymentReference), {
        userId: user.uid,
        utr: paymentReference,
        amount: creditAmount * 3,
        credits: parseInt(creditAmount),
        status: "pending",
        timestamp: new Date(),
      });
      alert("UTR submitted! Let's verify your payment.");
      setPaymentReference("");
      setShowUTRModal(false);
      setShowVerificationModal(true);
    } catch (err) {
      setError("Failed to submit UTR. Please try again.");
      console.error("UTR submission error:", err.message, err.code);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment verification
  const handleVerification = async (e) => {
    e.preventDefault();
    if (!verificationReference || !validateUTR(verificationReference)) {
      setError("Please enter a valid 12-digit UTR.");
      return;
    }
    setIsVerifying(true);
    setError("");
    try {
      const refDoc = await getDoc(doc(db, "payments", verificationReference));
      if (!refDoc.exists()) {
        setError("UTR not found. Please check and try again.");
        return;
      }

      const paymentData = refDoc.data();
      if (paymentData.userId !== user.uid) {
        setError("This UTR belongs to another user.");
        return;
      }

      if (paymentData.status !== "completed") {
        setError("Payment is still pending. Please wait for confirmation.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, { credits: 0 }, { merge: true });
      }

      await updateDoc(userRef, {
        credits: increment(paymentData.credits),
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      alert(`Payment verified! Added ${paymentData.credits} credits.`);
      setVerificationReference("");
      setShowVerificationModal(false);
      sessionStorage.removeItem("creditAmount");
      navigate("/dashboard");
    } catch (err) {
      setError("Verification failed. Please try again.");
      console.error("Verification error:", err.message, err.code);
    } finally {
      setIsVerifying(false);
    }
  };

  // Copy UPI link to clipboard
  const handleCopyUpiLink = () => {
    navigator.clipboard.writeText(upiLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="text-white text-center">Redirecting to login...</div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center py-12 relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <img
            src={LogoSvg}
            alt="TypeCredits Logo"
            className="mx-auto h-16 md:h-20 mb-4 animate-pulse"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 animate-neon-glow">
            Secure Payment with TypeCredits
          </h1>
          <p className="mt-3 text-lg text-gray-300 max-w-md mx-auto">
            Get your credits instantly via secure UPI payment.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-400 w-full max-w-md">
            {["Pay", "Submit UTR", "Verify"].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                    index === 0
                      ? "bg-cyan-500 text-white"
                      : index === 1 && showUTRModal
                      ? "bg-cyan-500 text-white"
                      : index === 2 && showVerificationModal
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-700 text-gray-300"
                  }`}
                >
                  {index + 1}
                </span>
                <span
                  className={
                    index === 0 ||
                    (index === 1 && showUTRModal) ||
                    (index === 2 && showVerificationModal)
                      ? "text-cyan-400 font-medium"
                      : ""
                  }
                >
                  {step}
                </span>
                {index < 2 && <span className="flex-1 mx-2">→</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Main Payment Card */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] max-w-lg mx-auto"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">
            Buy Credits
          </h2>
          <div className="mb-6 text-gray-300 text-sm">
            <p className="font-medium">How to pay:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Choose your credits below.</li>
              <li>Scan the QR code or open your UPI app.</li>
              <li>After payment, submit your UTR to verify.</li>
            </ol>
            <p className="mt-2 text-cyan-400 text-xs">
              Your credits will be added instantly after verification!
            </p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Select Credits</label>
            <div className="flex gap-4 flex-wrap">
              {["10", "50", "100"].map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleCreditChange(amount)}
                  className={`${
                    creditAmount === amount
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  aria-label={`Select ${amount} credits`}
                >
                  {amount} Credits
                </Button>
              ))}
            </div>
            <p className="mt-2 text-lg text-white">
              Total:{" "}
              <span className="font-bold text-cyan-400">
                ₹{creditAmount * 3}
              </span>
            </p>
          </div>
          <div className="text-center mb-6">
            <p className="text-gray-300 mb-4">Scan or use your UPI app:</p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-4 rounded-lg inline-block"
            >
              <QRCodeCanvas value={qrValue} size={160} />
            </motion.div>
            <div className="mt-4 space-y-2">
              <Button
                href={upiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white shadow-[0_0_10px_rgba(34,211,238,0.3)]"
                aria-label="Pay with UPI app"
              >
                Pay with UPI App
              </Button>
              <Button
                onClick={handleCopyUpiLink}
                className="block w-full bg-gray-700 text-gray-300 hover:bg-gray-600"
                aria-label="Copy UPI link"
              >
                {copied ? "Copied!" : "Copy UPI Link"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Timer Modal */}
        <Modal
          isOpen={showTimerModal}
          onClose={() => handleTimerResponse("no")}
          title="Almost done!"
        >
          <p className="text-gray-300 mb-4">
            Have you completed the payment of ₹{creditAmount * 3}?
          </p>
          <p className="text-yellow-400 mb-4">
            Time remaining: {timer} seconds
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => handleTimerResponse("yes")}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
            >
              Yes
            </Button>
            <Button
              onClick={() => handleTimerResponse("no")}
              className="bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              No
            </Button>
          </div>
        </Modal>

        {/* UTR Submission Modal */}
        <Modal
          isOpen={showUTRModal}
          onClose={() => setShowUTRModal(false)}
          title="Submit Your UTR"
        >
          <p className="text-gray-300 mb-4 text-sm">
            Enter the UTR from your UPI payment to proceed.
            <span className="relative tooltip ml-1">
              <span className="text-cyan-400 cursor-pointer">?</span>
              <span className="tooltip-text absolute invisible opacity-0 bg-gray-800 text-white text-xs rounded p-2 -mt-10 w-48 transition-all">
                UTR (Unique Transaction Reference) is a 12-digit number provided
                by your bank after a UPI payment.
              </span>
            </span>
          </p>
          <form onSubmit={handleReferenceSubmit}>
            <label className="block text-gray-300 mb-2">
              Payment Reference (UTR)
            </label>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="Enter UTR (e.g., 123456789012)"
              className="w-full py-2 px-4 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 outline-none transition-all duration-300"
              ref={utrInputRef}
              aria-required="true"
              maxLength={12}
            />
            {error && (
              <p className="text-red-400 mt-2 text-sm flex items-center">
                {error}
                <button
                  onClick={() => setError("")}
                  className="ml-2 text-gray-400 hover:text-white"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </p>
            )}
            <div className="flex gap-4 mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-400 hover:to-purple-400"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="spinner mr-2"></span>Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setShowUTRModal(false)}
                className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Verification Modal */}
        <Modal
          isOpen={showVerificationModal}
          onClose={() => setShowVerificationModal(false)}
          title="Verify Your Payment"
        >
          <p className="text-gray-300 mb-4 text-sm">
            Re-enter your UTR to confirm the transaction and get your credits.
          </p>
          <form onSubmit={handleVerification}>
            <label className="block text-gray-300 mb-2">Reference Number</label>
            <input
              type="text"
              value={verificationReference}
              onChange={(e) => setVerificationReference(e.target.value)}
              placeholder="Re-enter UTR"
              className="w-full py-2 px-4 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all duration-300"
              ref={verificationInputRef}
              aria-required="true"
              maxLength={12}
            />
            {error && (
              <p className="text-red-400 mt-2 text-sm flex items-center">
                {error}
                <button
                  onClick={() => setError("")}
                  className="ml-2 text-gray-400 hover:text-white"
                  aria-label="Dismiss error"
                >
                  ✕
                </button>
              </p>
            )}
            <div className="flex gap-4 mt-4">
              <Button
                type="submit"
                disabled={isVerifying}
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-400 hover:to-cyan-400"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
                    <span className="spinner mr-2"></span>Verifying...
                  </span>
                ) : (
                  "Verify"
                )}
              </Button>
              <Button
                type="button"
                onClick={() => setShowVerificationModal(false)}
                className="flex-1 bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>

      {/* Inline CSS for Spinner and Tooltip */}
      <style jsx>{`
        .animate-neon-glow {
          animation: neon-glow 2s ease-in-out infinite;
        }
        @keyframes neon-glow {
          0%,
          100% {
            text-shadow: 0 0 10px rgba(34, 211, 238, 0.7);
          }
          50% {
            text-shadow: 0 0 20px rgba(34, 211, 238, 1);
          }
        }
        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #22d3ee;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default PaymentPage;
