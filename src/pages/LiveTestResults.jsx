import React, { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, Timestamp, arrayUnion } from "firebase/firestore";
import LiveTestLeaderboard from "../components/LiveTestLeaderboard";

const normalizeText = (text = "") =>
  text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const buildWordComparison = (inputText, sampleText) => {
  const normalizedInput = normalizeText(inputText);
  const normalizedSample = normalizeText(sampleText);
  const inputWords = normalizedInput ? normalizedInput.split(" ") : [];
  const sampleWords = normalizedSample ? normalizedSample.split(" ") : [];

  return sampleWords.map((word, index) => {
    const isTyped = index < inputWords.length;
    const isCorrect = isTyped && inputWords[index] === word;
    return { word, isTyped, isCorrect };
  });
};

const LiveTestResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const savedOnceRef = useRef(false);

  const {
    inputText = "",
    sampleText = "",
    timeElapsed = 60000,
    backspaceCount = 0,
    targetWPM = 0,
    examName = "Live Test",
    language = "english",
    testId,
    fullErrors = 0,
    halfErrors = 0,
    testCollection,
  } = location.state || {};

  useEffect(() => {
    if (!testId) {
      navigate("/results", { replace: true, state: location.state });
    }
  }, [navigate, testId, location.state]);

  const metrics = useMemo(() => {
    const wordComparison = buildWordComparison(inputText, sampleText);
    const incorrectWords = wordComparison.filter(
      (w) => w.isTyped && !w.isCorrect,
    ).length;
    const minutes = Math.max(timeElapsed / 60000, 1 / 60);
    const totalChars = normalizeText(inputText).length;
    const grossWpm = totalChars ? totalChars / 5 / minutes : 0;
    const penaltyErrors = (fullErrors || 0) + (halfErrors || 0) / 2;
    const netWpm = Math.max(0, grossWpm - penaltyErrors / minutes);
    const accuracy =
      grossWpm > 0 ? Math.max(0, Math.min(100, (netWpm / grossWpm) * 100)) : 0;
    const errorRate = Math.min(
      100,
      (penaltyErrors / Math.max(wordComparison.length || 1, 1)) * 100,
    );

    return {
      wordComparison,
      incorrectWords,
      grossWpm: Number.isFinite(grossWpm) ? grossWpm : 0,
      netWpm: Number.isFinite(netWpm) ? netWpm : 0,
      accuracy: Number.isFinite(accuracy) ? accuracy : 0,
      penaltyErrors,
      errorRate: Number.isFinite(errorRate) ? errorRate : 0,
    };
  }, [inputText, sampleText, timeElapsed, fullErrors, halfErrors]);

  useEffect(() => {
    const persistResult = async () => {
      if (savedOnceRef.current) return;
      const user = auth.currentUser;
      if (!user || !testId) return;
      savedOnceRef.current = true;

      const resultPayload = {
        grossWpm: metrics.grossWpm,
        netWpm: metrics.netWpm,
        accuracy: Math.round(metrics.accuracy),
        penaltyErrors: metrics.penaltyErrors,
        targetWPM,
        examName,
        language,
        backspaceCount,
        timeElapsed,
        timestamp: new Date().toISOString(),
      };

      try {
        const userResultRef = doc(
          db,
          "users",
          user.uid,
          "results",
          `${examName}-live-${Date.now()}`,
        );
        await setDoc(userResultRef, resultPayload);

        const collectionsToTry = testCollection
          ? [
              testCollection,
              testCollection === "liveTests1" ? "liveTests" : "liveTests1",
            ]
          : ["liveTests1", "liveTests"];

        for (const col of collectionsToTry) {
          const testRef = doc(db, col, testId);
          const testSnap = await getDoc(testRef);
          if (!testSnap.exists()) continue;

          try {
            await setDoc(
              testRef,
              { completedUsers: arrayUnion(user.uid) },
              { merge: true },
            );
          } catch (updateErr) {
            console.warn("Failed to update completed users", updateErr);
          }

          const liveResultRef = doc(db, col, testId, "results", user.uid);
          const existing = await getDoc(liveResultRef);
          const existingNet = existing.exists()
            ? existing.data().netWpm || 0
            : 0;
          if (!existing.exists() || metrics.netWpm > existingNet) {
            await setDoc(
              liveResultRef,
              {
                ...resultPayload,
                userId: user.uid,
                displayName: user.displayName || user.email.split("@")[0],
                email: user.email,
                createdAt: Timestamp.now(),
              },
              { merge: true },
            );
          }
          break;
        }
      } catch (err) {
        console.error("Failed to persist live result", err);
      }
    };

    persistResult();
  }, [
    metrics,
    backspaceCount,
    examName,
    language,
    targetWPM,
    timeElapsed,
    testCollection,
    testId,
  ]);

  useEffect(() => {
    const sub = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => sub();
  }, [navigate]);

  if (!testId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900 text-white">
      <div className="max-w-5xl mx-auto py-12 px-4 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/10"
        >
          <p className="text-sm uppercase tracking-widest text-blue-200 mb-2">
            Live Test Summary
          </p>
          <h1 className="text-3xl font-bold text-white mb-6">
            {examName} • {language.toUpperCase()}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-black/30 rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-blue-300">
                Net WPM
              </p>
              <p className="text-4xl font-bold text-white mt-2">
                {metrics.netWpm.toFixed(1)}
              </p>
            </div>
            <div className="bg-black/30 rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-blue-300">
                Accuracy
              </p>
              <p className="text-4xl font-bold text-white mt-2">
                {Math.round(metrics.accuracy)}%
              </p>
            </div>
            <div className="bg-black/30 rounded-2xl p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-blue-300">
                Penalties
              </p>
              <p className="text-4xl font-bold text-white mt-2">
                {metrics.penaltyErrors.toFixed(1)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-10"
        >
          <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Detailed Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-black/40 rounded-2xl p-4">
                <p className="text-xs text-blue-200 uppercase">Target WPM</p>
                <p className="text-2xl font-semibold text-white mt-1">
                  {targetWPM}
                </p>
              </div>
              <div className="bg-black/40 rounded-2xl p-4">
                <p className="text-xs text-blue-200 uppercase">Time Taken</p>
                <p className="text-2xl font-semibold text-white mt-1">
                  {Math.round(timeElapsed / 1000)}s
                </p>
              </div>
              <div className="bg-black/40 rounded-2xl p-4">
                <p className="text-xs text-blue-200 uppercase">Backspaces</p>
                <p className="text-2xl font-semibold text-white mt-1">
                  {backspaceCount}
                </p>
              </div>
              <div className="bg-black/40 rounded-2xl p-4">
                <p className="text-xs text-blue-200 uppercase">Error Rate</p>
                <p className="text-2xl font-semibold text-white mt-1">
                  {metrics.errorRate.toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-6 bg-black/30 rounded-2xl p-5 text-sm text-blue-100">
              <p>
                Your best score has been posted to the live leaderboard. Keep
                practicing to climb higher!
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Live Leaderboard
            </h2>
            <LiveTestLeaderboard
              testId={testId}
              collectionName={testCollection || "liveTests1"}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <button
            onClick={() => navigate(`/live-test/${testId}`)}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-medium text-white transition"
          >
            View Lobby
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/live-tests")}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-semibold transition"
            >
              Upcoming Live Tests
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm font-medium text-white transition"
            >
              My Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveTestResults;
