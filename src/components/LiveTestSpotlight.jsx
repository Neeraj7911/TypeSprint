import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, query } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "../firebase";

const LIVE_GRACE_MS = 60 * 1000;
const allowedStatuses = new Set(["scheduled", "live", "in-progress", "active"]);

const toMillis = (value) => {
  if (!value) return 0;
  if (value.seconds) return value.seconds * 1000;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatCountdown = (startTimeMs, nowMs) => {
  if (!startTimeMs) return "";
  if (nowMs >= startTimeMs && nowMs <= startTimeMs + LIVE_GRACE_MS) {
    return "Live now";
  }
  if (nowMs > startTimeMs + LIVE_GRACE_MS) {
    return "Closed";
  }
  const totalSeconds = Math.max(0, Math.floor((startTimeMs - nowMs) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default function LiveTestSpotlight({ darkMode }) {
  const [highlightTest, setHighlightTest] = useState(null);
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const q1 = query(collection(db, "liveTests1"));
    const q2 = query(collection(db, "liveTests"));

    let latest1 = [];
    let latest2 = [];

    const processSnapshots = (docs1, docs2) => {
      const combined = {};
      const pushDoc = (docSnap, source) => {
        combined[docSnap.id] = {
          id: docSnap.id,
          _collection: source,
          ...docSnap.data(),
        };
      };
      docs1.forEach((d) => pushDoc(d, "liveTests1"));
      docs2.forEach((d) => pushDoc(d, "liveTests"));

      const merged = Object.values(combined).filter((test) => {
        if (!test) return false;
        if (test.status && !allowedStatuses.has(test.status)) return false;
        const startMs = toMillis(test.startTime);
        if (!startMs) return false;
        return startMs >= Date.now() - LIVE_GRACE_MS;
      });

      merged.sort((a, b) => toMillis(a.startTime) - toMillis(b.startTime));
      setHighlightTest(merged[0] || null);
    };

    const unsub1 = onSnapshot(q1, (snapshot) => {
      latest1 = snapshot.docs;
      processSnapshots(latest1, latest2);
    });
    const unsub2 = onSnapshot(q2, (snapshot) => {
      latest2 = snapshot.docs;
      processSnapshots(latest1, latest2);
    });

    return () => {
      try {
        unsub1();
      } catch (error) {}
      try {
        unsub2();
      } catch (error) {}
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const startTimeMs = useMemo(
    () => toMillis(highlightTest?.startTime),
    [highlightTest],
  );
  const countdown = useMemo(
    () => formatCountdown(startTimeMs, nowMs),
    [startTimeMs, nowMs],
  );
  const registrationOpen = useMemo(
    () => (startTimeMs ? nowMs < startTimeMs : false),
    [startTimeMs, nowMs],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-md rounded-2xl border ${
        darkMode
          ? "border-cyan-500/40 bg-gray-900/80"
          : "border-blue-500/30 bg-white"
      } p-6 shadow-xl backdrop-blur`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-cyan-400">
          Next All-India Live Test
        </h3>
        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
          Spotlight
        </span>
      </div>
      {highlightTest ? (
        <div className="mt-4 space-y-4">
          <div>
            <p
              className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {highlightTest.title || "Upcoming Live Test"}
            </p>
            <p
              className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {new Date(startTimeMs).toLocaleString()}
            </p>
          </div>
          <div
            className={`rounded-lg p-3 text-center text-sm ${darkMode ? "bg-cyan-500/10 text-cyan-200" : "bg-blue-50 text-blue-700"}`}
          >
            {countdown}
            {registrationOpen && countdown !== "Live now" && (
              <span className="ml-2 whitespace-nowrap align-middle text-xs font-medium">
                Registration open
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/live-tests"
              className="flex-1 rounded-lg bg-cyan-500 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-cyan-400"
            >
              View details
            </Link>
            <Link
              to={{ pathname: "/live-tests", search: "?focus=register" }}
              className={`flex-1 rounded-lg px-4 py-2 text-center text-sm font-semibold transition ${
                darkMode
                  ? "border border-cyan-500/60 text-cyan-200 hover:border-cyan-300"
                  : "border border-blue-400 text-blue-600 hover:border-blue-500"
              }`}
            >
              Register now
            </Link>
          </div>
          {highlightTest.examType && (
            <p
              className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              Exam focus: {highlightTest.examType}
            </p>
          )}
          {highlightTest.registrationCount !== undefined && (
            <p
              className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              Registered candidates: {highlightTest.registrationCount || 0}
            </p>
          )}
        </div>
      ) : (
        <p
          className={`mt-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          No live tests scheduled right now. Check back soon for the next
          nationwide challenge.
        </p>
      )}
    </motion.div>
  );
}
