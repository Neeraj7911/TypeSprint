import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { doc, runTransaction, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

export default function LiveTestCard({ test }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState("");
  const isRegistered = currentUser && (test.registeredUsers || []).includes(currentUser.uid);

  useEffect(() => {
    let interval;
    const update = () => {
      try {
        const start = test.startTime && test.startTime.seconds ? new Date(test.startTime.seconds * 1000) : new Date(test.startTime || Date.now());
        const diff = start - Date.now();
        if (test.isLive || diff <= 0) {
          setCountdown("Live Now");
          return;
        }
        const s = Math.max(0, Math.floor(diff / 1000));
        const m = Math.floor(s / 60);
        const sec = s % 60;
        setCountdown(`${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`);
      } catch (e) {
        setCountdown("");
      }
    };
    update();
    interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [test]);

  const register = async () => {
    if (!currentUser) return alert("Please login to register for the live test.");
    setLoading(true);
    try {
      const testRef = doc(db, "liveTests", test.id);
      await runTransaction(db, async (transaction) => {
        const sf = await transaction.get(testRef);
        if (!sf.exists()) throw new Error("Test not found");
        const data = sf.data();
        const regs = data.registeredUsers || [];
        if (regs.includes(currentUser.uid)) return; // already registered
        transaction.update(testRef, {
          registeredUsers: arrayUnion(currentUser.uid),
          registrationCount: (data.registrationCount || 0) + 1,
        });
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const unregister = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const testRef = doc(db, "liveTests", test.id);
      await runTransaction(db, async (transaction) => {
        const sf = await transaction.get(testRef);
        if (!sf.exists()) throw new Error("Test not found");
        const data = sf.data();
        const regs = data.registeredUsers || [];
        if (!regs.includes(currentUser.uid)) return; // not registered
        transaction.update(testRef, {
          registeredUsers: arrayRemove(currentUser.uid),
          registrationCount: Math.max((data.registrationCount || 1) - 1, 0),
        });
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Unregister failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-4xl mb-2">{test.icon || "🏁"}</div>
      <h4 className="font-semibold text-white">{test.title}</h4>
      <p className="text-xs text-gray-300 mt-1">Starts: {new Date(test.startTime.seconds ? test.startTime.seconds * 1000 : test.startTime).toLocaleString()}</p>
      <p className="text-xs text-gray-400">Registrations: {test.registrationCount || 0} • {countdown}</p>
      <div className="mt-3 w-full">
        {isRegistered ? (
          <button onClick={unregister} disabled={loading} className="w-full bg-red-600 text-white py-1 rounded">
            {loading ? "Processing..." : "Unregister"}
          </button>
        ) : (
          <button onClick={register} disabled={loading} className="w-full bg-cyan-600 text-white py-1 rounded">
            {loading ? "Processing..." : "Register"}
          </button>
        )}
      </div>
      {!test.isLive && <div className="mt-2 text-xs text-gray-400">{test.description}</div>}
      {test.isPrivate && (
        <div className="absolute top-2 right-2 text-gray-400"><FaLock /></div>
      )}
    </motion.div>
  );
}
