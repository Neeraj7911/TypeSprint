import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  arrayUnion,
  doc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import LiveTestLeaderboard from "../components/LiveTestLeaderboard";

export default function LiveTestRunner() {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [collectionName, setCollectionName] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Prefer document from `liveTests1` but fall back to `liveTests` if not present.
    const ref1 = doc(db, "liveTests1", testId);
    const ref2 = doc(db, "liveTests", testId);

    const unsub1 = onSnapshot(ref1, (snap) => {
      if (snap.exists()) {
        setCollectionName("liveTests1");
        setTest({ id: snap.id, _collection: "liveTests1", ...snap.data() });
      } else {
        // if not present in first collection, leave to ref2 handler
        // (we don't clear here to avoid flicker)
      }
    });

    const unsub2 = onSnapshot(ref2, (snap) => {
      if (snap.exists()) {
        // only set if we don't already have data from ref1
        setCollectionName((prev) => prev || "liveTests");
        setTest((cur) => {
          if (cur && cur._collection === "liveTests1") return cur;
          return { id: snap.id, _collection: "liveTests", ...snap.data() };
        });
      }
    });

    return () => {
      try {
        unsub1();
      } catch (e) {}
      try {
        unsub2();
      } catch (e) {}
    };
  }, [testId]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const startTimeMs = useMemo(() => {
    if (!test) return null;
    if (test.startTime && test.startTime.seconds) {
      return test.startTime.seconds * 1000;
    }
    if (
      typeof test.startTime === "string" ||
      typeof test.startTime === "number"
    ) {
      const parsed = Date.parse(test.startTime);
      return Number.isNaN(parsed) ? null : parsed;
    }
    return null;
  }, [test]);

  const GRACE_MS = 60 * 1000; // 1 minute grace window after scheduled start

  const countdown = useMemo(() => {
    if (!startTimeMs) return "";
    const windowEnd = startTimeMs + GRACE_MS;
    if (now > windowEnd) return "Closed";
    const diff = startTimeMs - now;
    if (diff <= 0) return "Live Now";
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (hours > 0) parts.push(String(hours).padStart(2, "0"));
    parts.push(String(minutes).padStart(2, "0"));
    parts.push(String(seconds).padStart(2, "0"));
    return parts.join(":");
  }, [startTimeMs, now]);

  const windowEnd = startTimeMs ? startTimeMs + GRACE_MS : null;
  const registrationOpen = startTimeMs ? now < startTimeMs : true;
  const registeredUsers = Array.isArray(test?.registeredUsers)
    ? test.registeredUsers
    : [];
  const isRegistered = currentUser
    ? registeredUsers.includes(currentUser.uid)
    : false;
  const hasLaunchWindow = startTimeMs
    ? now >= startTimeMs && (!windowEnd || now <= windowEnd)
    : true;
  const canLaunch = hasLaunchWindow && isRegistered;
  const windowClosed = !!windowEnd && now > windowEnd;
  const warmupTime = startTimeMs ? Math.max(0, startTimeMs - now) : 0;

  const launchTyping = useCallback(() => {
    if (!test || !isRegistered) return;
    const params = new URLSearchParams({
      testId: test.id,
      duration: String(test.durationMinutes || 10),
      language: test.language || "english",
      exam: test.examType || "Live",
      font: test.font || "",
    });
    if (collectionName) params.set("collection", collectionName);
    params.set("autoStart", "true");
    params.set("skipInstructions", "true");
    navigate(`/typing-test?${params.toString()}`);
  }, [collectionName, isRegistered, navigate, test]);

  const registerForLiveTest = useCallback(async () => {
    if (!test || registering || !registrationOpen) return;
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setRegistering(true);
    try {
      const collections = collectionName
        ? [collectionName]
        : ["liveTests1", "liveTests"];
      await runTransaction(db, async (transaction) => {
        let foundSnapshot = null;
        let ref = null;
        for (const col of collections) {
          const docRef = doc(db, col, test.id);
          const snap = await transaction.get(docRef);
          if (snap.exists()) {
            foundSnapshot = snap;
            ref = docRef;
            break;
          }
        }
        if (!foundSnapshot || !ref) {
          throw new Error("Test not found");
        }
        const data = foundSnapshot.data();
        const registrations = data.registeredUsers || [];
        if (registrations.includes(currentUser.uid)) {
          return;
        }
        transaction.update(ref, {
          registeredUsers: arrayUnion(currentUser.uid),
          registrationCount: (data.registrationCount || 0) + 1,
        });
      });
    } catch (error) {
      console.error(error);
      alert(error.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  }, [
    collectionName,
    currentUser,
    navigate,
    registering,
    registrationOpen,
    test,
  ]);

  if (!test) return <div className="p-8">Loading test...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black text-white py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-gray-950/70 border border-gray-800 rounded-xl p-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-cyan-300">{test.title}</h2>
              <p className="text-sm text-gray-300 mt-2 max-w-xl">
                Be ready right at the start time. When the timer hits zero the
                Start Typing button unlocks and launches the full typing
                interface in the same app.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-lg px-6 py-4 text-center">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Countdown
              </p>
              <p className="text-2xl font-mono text-cyan-400 mt-2">
                {countdown || "--"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Start time:{" "}
                {startTimeMs ? new Date(startTimeMs).toLocaleString() : "TBA"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Test Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-300">
                  <span>
                    <strong className="text-gray-100">Duration:</strong>{" "}
                    {test.durationMinutes || 30} min
                  </span>
                  <span>
                    <strong className="text-gray-100">Language:</strong>{" "}
                    {test.language || "English"}
                  </span>
                  <span>
                    <strong className="text-gray-100">Exam Type:</strong>{" "}
                    {test.examType || "Live"}
                  </span>
                  <span>
                    <strong className="text-gray-100">Target WPM:</strong>{" "}
                    {test.targetWPM || "--"}
                  </span>
                  <span>
                    <strong className="text-gray-100">Font:</strong>{" "}
                    {test.font || "Default"}
                  </span>
                  <span>
                    <strong className="text-gray-100">Slots:</strong>{" "}
                    {test.slots || "Unlimited"}
                  </span>
                  <span>
                    <strong className="text-gray-100">Registrations:</strong>{" "}
                    {test.registrationCount || 0}
                  </span>
                  <span>
                    <strong className="text-gray-100">Mode:</strong>{" "}
                    {test.isPrivate ? "Private" : "Open"}
                  </span>
                </div>
                {test.description && (
                  <p className="mt-4 text-sm text-gray-400 whitespace-pre-wrap">
                    {test.description}
                  </p>
                )}
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">
                  How it works
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                  <li>
                    Arrive a few minutes early and stay on this page with a
                    stable connection.
                  </li>
                  <li>
                    The Start Typing button unlocks exactly at the scheduled
                    start time and will auto-launch the typing screen if you
                    remain here.
                  </li>
                  <li>
                    You can also click the button manually once it
                    unlocks—either way the live passage loads in the typing
                    interface immediately.
                  </li>
                  <li>
                    Complete the attempt once; your best score automatically
                    posts to the leaderboard.
                  </li>
                  <li>
                    You have a 1 minute grace window after start; once it
                    passes, entry closes for everyone.
                  </li>
                  <li>
                    Stay on this page after submitting to watch results update
                    in real time.
                  </li>
                </ul>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Start when the timer hits zero
                </h3>
                {!isRegistered && (
                  <div className="mb-4 rounded-md border border-cyan-700 bg-gray-950/60 p-4">
                    <p className="text-sm text-cyan-200">
                      Registration is required to participate once the countdown
                      ends.
                    </p>
                    {registrationOpen ? (
                      <button
                        type="button"
                        onClick={registerForLiveTest}
                        disabled={registering}
                        className={`mt-3 w-full rounded-md px-4 py-2 font-semibold transition ${
                          registering
                            ? "bg-cyan-800 text-gray-300 cursor-wait"
                            : "bg-cyan-500 text-gray-900 hover:bg-cyan-400"
                        }`}
                      >
                        {currentUser
                          ? registering
                            ? "Registering..."
                            : "Register now"
                          : "Login to register"}
                      </button>
                    ) : (
                      <p className="mt-3 text-xs text-red-400">
                        Registration is closed for this test.
                      </p>
                    )}
                  </div>
                )}
                <button
                  disabled={!canLaunch}
                  onClick={launchTyping}
                  className={`w-full px-4 py-3 rounded-md font-semibold transition ${
                    canLaunch
                      ? "bg-cyan-500 hover:bg-cyan-400 text-gray-900"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isRegistered
                    ? canLaunch
                      ? "Start Typing"
                      : windowClosed
                        ? "Entry window closed"
                        : `Opens in ${Math.max(0, Math.ceil(warmupTime / 1000))}s`
                    : registrationOpen
                      ? "Register to unlock"
                      : "Registration required"}
                </button>
                {!canLaunch && !windowClosed && isRegistered && (
                  <p className="text-xs text-gray-500 mt-2">
                    This unlocks at the scheduled start so everyone begins
                    together.
                  </p>
                )}
                {windowClosed && (
                  <p className="text-xs text-red-500 mt-2">
                    The live test locked after the 1 minute grace window.
                  </p>
                )}
                {isRegistered && !windowClosed && (
                  <p className="text-xs text-emerald-400 mt-2">
                    You are registered. Stay ready and the button will unlock
                    right on time.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Live Leaderboard
              </h3>
              {collectionName ? (
                <LiveTestLeaderboard
                  testId={test.id}
                  collectionName={collectionName}
                />
              ) : (
                <p className="text-sm text-gray-400">
                  Leaderboard connecting...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
