/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Payment() {
  const { currentUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");

  const plans = [
    { duration: "3 months", price: 99 },
    { duration: "6 months", price: 149 },
    { duration: "1 year", price: 189 },
  ];

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    setPaymentScreenshot(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !paymentScreenshot || !referenceNumber) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Upload screenshot to Firebase Storage
      const screenshotRef = ref(
        storage,
        `payment_screenshots/${currentUser.uid}_${Date.now()}`
      );
      await uploadBytes(screenshotRef, paymentScreenshot);
      const screenshotUrl = await getDownloadURL(screenshotRef);

      // Save payment details to Firestore
      await addDoc(collection(db, "payments"), {
        userId: currentUser.uid,
        plan: selectedPlan.duration,
        amount: selectedPlan.price,
        referenceNumber,
        screenshotUrl,
        status: "pending",
        timestamp: serverTimestamp(),
      });

      alert("Payment submitted for verification");
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Error submitting payment. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Select a Premium Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map((plan) => (
          <div
            key={plan.duration}
            className={`border p-4 rounded cursor-pointer ${
              selectedPlan === plan ? "border-blue-500 bg-blue-100" : ""
            }`}
            onClick={() => handlePlanSelection(plan)}
          >
            <h3 className="font-semibold">{plan.duration}</h3>
            <p>₹{plan.price}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Upload Payment Screenshot</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleScreenshotUpload}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Reference Number</label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}

export default Payment;
