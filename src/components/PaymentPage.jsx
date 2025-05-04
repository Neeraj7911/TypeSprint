import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithRedirect,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const [creditAmount, setCreditAmount] = useState(
    sessionStorage.getItem("creditAmount") || "10"
  );
  const [paymentReference, setPaymentReference] = useState("");
  const [verificationReference, setVerificationReference] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [timer, setTimer] = useState(20);
  const [showUTRModal, setShowUTRModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const upiLink = `upi://pay?pa=9870487659@axl&pn=Neeraj%20Kumar&mc=0000&mode=02&purpose=00&am=${(
    creditAmount * 3
  ).toFixed(2)}&cu=INR`;
  const qrValue = upiLink;

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowTimerModal(true);
      setTimer(20);
    }, 20000);
    return () => clearTimeout(timeout);
  }, []);

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
    }
  };

  const handleReferenceSubmit = async (e) => {
    e.preventDefault();
    if (!paymentReference) {
      setError("Please enter a valid UTR.");
      return;
    }
    setError("");
    try {
      console.log("Submitting UTR:", paymentReference);
      await setDoc(doc(db, "payments", paymentReference), {
        userId: user.uid,
        utr: paymentReference,
        amount: creditAmount * 3,
        credits: parseInt(creditAmount),
        status: "pending",
        timestamp: new Date(),
      });
      console.log("UTR saved to payments/", paymentReference);
      alert("UTR submitted! Let's verify your payment.");
      setPaymentReference("");
      setShowUTRModal(false);
      setShowVerificationModal(true);
    } catch (err) {
      setError("Failed to submit UTR. Please try again.");
      console.error("UTR submission error:", err.message, err.code);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!verificationReference) {
      setError("Please enter the UTR to verify.");
      return;
    }
    setIsVerifying(true);
    setError("");
    try {
      console.log("Verifying UTR:", verificationReference);
      const refDoc = await getDoc(doc(db, "payments", verificationReference));
      if (!refDoc.exists()) {
        setError("UTR not found. Please check and try again.");
        console.log("No payment document for UTR:", verificationReference);
        return;
      }

      const paymentData = refDoc.data();
      console.log("Payment data:", paymentData);

      if (paymentData.userId !== user.uid) {
        setError("This UTR belongs to another user.");
        console.log("UserID mismatch:", paymentData.userId, "!==", user.uid);
        return;
      }

      if (paymentData.status !== "completed") {
        setError("Payment is still pending. Please wait for confirmation.");
        console.log("Invalid status:", paymentData.status);
        return;
      }

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.log("No user document for UID:", user.uid, "Creating one...");
        await setDoc(userRef, { credits: 0 }, { merge: true });
      }

      await updateDoc(userRef, {
        credits: increment(paymentData.credits),
      });
      console.log(`Updated users/${user.uid}/credits by`, paymentData.credits);
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

  if (!user) {
    return (
      <div className="text-white text-center">Redirecting to login...</div>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black py-12 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-cyan-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-slide-in-top">
          <img
            src="/typecredits-logo.png"
            alt="TypeCredits Logo"
            className="mx-auto h-16 md:h-20 mb-4 animate-pulse-logo"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 animate-neon-glow">
            Secure Payment with TypeCredits
          </h1>
          <p className="mt-3 text-lg text-gray-300 max-w-md mx-auto">
            Get your credits instantly via secure UPI payment.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center mr-2">
                1
              </span>
              <span className="text-cyan-400 font-medium">Pay</span>
            </div>
            <span>→</span>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-gray-700 text-gray-300 rounded-full flex items-center justify-center mr-2">
                2
              </span>
              <span>Submit UTR</span>
            </div>
            <span>→</span>
            <div className="flex items-center">
              <span className="w-6 h-6 bg-gray-700 text-gray-300 rounded-full flex items-center justify-center mr-2">
                3
              </span>
              <span>Verify</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-slide-in-left max-w-lg mx-auto">
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
                <button
                  key={amount}
                  onClick={() => handleCreditChange(amount)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                    creditAmount === amount
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {amount} Credits
                </button>
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
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCodeCanvas value={qrValue} size={160} />
            </div>
            <a
              href={upiLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block py-3 px-6 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
            >
              Pay with UPI App
            </a>
          </div>
        </div>

        {showTimerModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/95 rounded-2xl p-6 max-w-sm w-full border border-cyan-400/30 animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-4">
                Almost done!
              </h3>
              <p className="text-gray-300 mb-4">
                Have you completed the payment of ₹{creditAmount * 3}?
              </p>
              <p className="text-yellow-400 mb-4">
                Time remaining: {timer} seconds
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => handleTimerResponse("yes")}
                  className="py-2 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleTimerResponse("no")}
                  className="py-2 px-6 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg font-medium transition-all duration-300"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {showUTRModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/95 rounded-2xl p-6 max-w-sm w-full border border-cyan-400/30 animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-4">
                Submit Your UTR
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                Enter the UTR from your UPI payment to proceed.
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
                />
                {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-purple-400 transition-all duration-300"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUTRModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showVerificationModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900/95 rounded-2xl p-6 max-w-sm w-full border border-purple-400/30 animate-fade-in">
              <h3 className="text-xl font-semibold text-white mb-4">
                Verify Your Payment
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                Re-enter your UTR to confirm the transaction and get your
                credits.
              </p>
              <form onSubmit={handleVerification}>
                <label className="block text-gray-300 mb-2">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={verificationReference}
                  onChange={(e) => setVerificationReference(e.target.value)}
                  placeholder="Re-enter UTR"
                  className="w-full py-2 px-4 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 outline-none transition-all duration-300"
                />
                {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
                <div className="flex gap-4 mt-4">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className={`flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg font-medium transition-all duration-300 ${
                      isVerifying
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:from-purple-400 hover:to-cyan-400"
                    }`}
                  >
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowVerificationModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg font-medium transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentPage;
