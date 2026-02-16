import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import {
  doc,
  runTransaction,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const toMillis = (value) => {
  if (!value) return 0;
  if (value.seconds) return value.seconds * 1000;
  if (value._seconds) return value._seconds * 1000;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const fromDateTimeFields = (item) => {
  if (!item) return 0;
  const dateLike = item.date || item.startDate || item.scheduleDate;
  const timeLike =
    item.time ||
    item.startTimeString ||
    item.startTimeText ||
    item.scheduleTime;
  if (dateLike) {
    const candidates = [];
    if (timeLike) {
      candidates.push(`${dateLike}T${timeLike}`);
      candidates.push(`${dateLike} ${timeLike}`);
    }
    candidates.push(`${dateLike}`);
    for (const candidate of candidates) {
      const parsed = Date.parse(candidate);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }
  return 0;
};

const resolveStartMs = (test) => {
  if (!test) return 0;
  const directCandidates = [
    test.startTime,
    test.start,
    test.startTimestamp,
    test.startDateTime,
    test.startDateTimeUtc,
    test.startDateTimeISO,
    test.scheduledAt,
    test.startAt,
  ];
  for (const candidate of directCandidates) {
    const value = toMillis(candidate);
    if (value) return value;
  }
  const fromFields = fromDateTimeFields(test);
  if (fromFields) return fromFields;
  return 0;
};

const resolveDurationMs = (test) => {
  if (!test) return 0;
  if (test.durationMinutes) return Number(test.durationMinutes) * 60 * 1000;
  if (test.durationSeconds) return Number(test.durationSeconds) * 1000;
  if (test.duration) return Number(test.duration) * 60 * 1000;
  return 0;
};

export default function LiveTestCard({ test }) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [nowMs, setNowMs] = useState(Date.now());
  const navigate = useNavigate();
  const isRegistered =
    currentUser && (test.registeredUsers || []).includes(currentUser.uid);
  const isCompleted =
    currentUser && (test.completedUsers || []).includes(currentUser.uid);

  const startTimeMs = useMemo(() => {
    const value = resolveStartMs(test);
    return value || null;
  }, [test]);

  const durationMs = useMemo(() => resolveDurationMs(test), [test]);

  const windowClosed = useMemo(() => {
    if (!startTimeMs) return false;
    const activeWindow = durationMs || 60 * 1000;
    return nowMs > startTimeMs + activeWindow;
  }, [nowMs, startTimeMs, durationMs]);

  const registrationOpen = useMemo(() => {
    if (!startTimeMs) return true;
    return nowMs < startTimeMs;
  }, [nowMs, startTimeMs]);

  const canStartWindow = useMemo(() => {
    if (!startTimeMs) return false;
    if (windowClosed) return false;
    return nowMs >= startTimeMs;
  }, [nowMs, startTimeMs, windowClosed]);

  const canStart = canStartWindow && !!isRegistered && !isCompleted;

  useEffect(() => {
    let interval;
    const update = () => {
      try {
        const current = Date.now();
        setNowMs(current);
        if (startTimeMs) {
          const activeWindow = durationMs || 60 * 1000;
          const closed = current > startTimeMs + activeWindow;
          if (closed) {
            setCountdown("Closed");
            return;
          }
          const diff = startTimeMs - current;
          if (diff <= 0) {
            setCountdown("Live Now");
            return;
          }
          const totalSeconds = Math.max(0, Math.floor(diff / 1000));
          const minutes = Math.floor(totalSeconds / 60);
          const seconds = totalSeconds % 60;
          setCountdown(
            `${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`,
          );
          return;
        }
        const fallbackStart =
          resolveStartMs(test) || new Date(test.date || Date.now()).getTime();
        const diff = fallbackStart - current;
        const s = Math.max(0, Math.floor(diff / 1000));
        const m = Math.floor(s / 60);
        const sec = s % 60;
        setCountdown(
          `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`,
        );
      } catch (e) {
        setCountdown("");
      }
    };
    update();
    interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTimeMs, test]);

  const register = async () => {
    if (!currentUser)
      return alert("Please login to register for the live test.");
    setLoading(true);
    try {
      // support tests stored in either collection
      const cols = test._collection
        ? [test._collection]
        : ["liveTests1", "liveTests"];
      await runTransaction(db, async (transaction) => {
        let sf = null;
        let ref = null;
        for (const c of cols) {
          const r = doc(db, c, test.id);
          const s = await transaction.get(r);
          if (s.exists()) {
            sf = s;
            ref = r;
            break;
          }
        }
        if (!sf) throw new Error("Test not found");
        const data = sf.data();
        const regs = data.registeredUsers || [];
        if (regs.includes(currentUser.uid)) return; // already registered
        transaction.update(ref, {
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
      const cols = test._collection
        ? [test._collection]
        : ["liveTests1", "liveTests"];
      await runTransaction(db, async (transaction) => {
        let sf = null;
        let ref = null;
        for (const c of cols) {
          const r = doc(db, c, test.id);
          const s = await transaction.get(r);
          if (s.exists()) {
            sf = s;
            ref = r;
            break;
          }
        }
        if (!sf) throw new Error("Test not found");
        const data = sf.data();
        const regs = data.registeredUsers || [];
        if (!regs.includes(currentUser.uid)) return; // not registered
        transaction.update(ref, {
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

  const handleStart = () => {
    if (!canStart) return;
    const params = new URLSearchParams({
      testId: test.id,
      duration: String(test.durationMinutes || 10),
      language: test.language || "english",
      exam: test.examType || "Live",
      font: test.font || "",
    });
    if (test._collection) params.set("collection", test._collection);
    params.set("autoStart", "true");
    params.set("skipInstructions", "true");
    navigate(`/typing-test?${params.toString()}`);
  };

  const displayStart = useMemo(() => {
    if (startTimeMs) return new Date(startTimeMs).toLocaleString();
    if (test?.date && test?.time) return `${test.date} ${test.time}`;
    if (test?.date) return String(test.date);
    return "Schedule pending";
  }, [startTimeMs, test]);

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-80 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-4xl mb-2">{test.icon || "🏁"}</div>
      <h4 className="font-semibold text-white">{test.title}</h4>
      <p className="text-xs text-gray-300 mt-1">Starts: {displayStart}</p>
      <p className="text-xs text-gray-400">
        Registrations: {test.registrationCount || 0} • {countdown}
      </p>
      {isCompleted && (
        <p className="text-xs text-emerald-400 mt-1">You submitted this test</p>
      )}
      {windowClosed && (
        <p className="text-xs text-red-400 mt-1">Entry window closed</p>
      )}
      {canStart && (
        <button
          onClick={handleStart}
          className="w-full bg-green-500 text-gray-900 font-semibold py-1 rounded mt-3"
        >
          Start Test
        </button>
      )}
      <div className="mt-3 w-full">
        {isCompleted ? (
          <div className="w-full bg-emerald-600 text-white py-1 rounded text-sm">
            Submission received
          </div>
        ) : isRegistered ? (
          <button
            onClick={registrationOpen ? unregister : undefined}
            disabled={loading || !registrationOpen}
            className={`w-full py-1 rounded ${
              registrationOpen
                ? "bg-red-600 text-white"
                : "bg-gray-700 text-gray-300 cursor-default"
            }`}
          >
            {registrationOpen
              ? loading
                ? "Processing..."
                : "Unregister"
              : "Registered"}
          </button>
        ) : registrationOpen ? (
          <button
            onClick={register}
            disabled={loading}
            className="w-full bg-cyan-600 text-white py-1 rounded"
          >
            {loading ? "Processing..." : "Register"}
          </button>
        ) : (
          <div className="w-full bg-gray-700 text-red-300 py-1 rounded text-sm">
            Registration closed
          </div>
        )}
      </div>
      {!test.isLive && (
        <div className="mt-2 text-xs text-gray-400">{test.description}</div>
      )}
      {test.isPrivate && (
        <div className="absolute top-2 right-2 text-gray-400">
          <FaLock />
        </div>
      )}
    </motion.div>
  );
}
