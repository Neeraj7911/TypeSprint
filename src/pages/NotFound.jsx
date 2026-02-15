import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const phrases = [
  "Re-routing through our typing matrix...",
  "Scanning for the lost paragraph...",
  "Calibrating your next destination...",
];

const createStrands = () =>
  Array.from({ length: 3 }, (_, index) => ({
    id: index,
    delay: index * 0.8,
  }));

export default function NotFound() {
  const navigate = useNavigate();
  const [charIndex, setCharIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phase, setPhase] = useState("typing");
  const currentPhrase = phrases[phraseIndex];
  const displayText = currentPhrase.slice(0, charIndex);

  const strands = useMemo(createStrands, []);

  useEffect(() => {
    let timeout;
    if (phase === "typing") {
      if (charIndex < currentPhrase.length) {
        timeout = setTimeout(() => setCharIndex((value) => value + 1), 70);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 1100);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("deleting"), 350);
    } else if (phase === "deleting") {
      if (charIndex > 0) {
        timeout = setTimeout(() => setCharIndex((value) => value - 1), 35);
      } else {
        timeout = setTimeout(() => {
          setPhraseIndex((value) => (value + 1) % phrases.length);
          setPhase("typing");
        }, 250);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, phase, currentPhrase.length]);

  useEffect(() => {
    if (phase === "typing" && charIndex === 0) {
      setCharIndex(0);
    }
  }, [phraseIndex, phase, charIndex]);

  return (
    <div className="relative flex min-h-[calc(100vh-96px)] items-center justify-center overflow-hidden bg-slate-950 pt-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.24),transparent_52%),radial-gradient(circle_at_70%_15%,rgba(236,72,153,0.22),transparent_45%),linear-gradient(140deg,rgba(10,17,43,0.95),rgba(2,6,23,0.92))]" />

      <div className="pointer-events-none absolute inset-0">
        {strands.map((strand) => (
          <motion.div
            key={strand.id}
            className="absolute left-1/2 top-1/2 h-[28rem] w-[1px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-white/30 to-transparent"
            style={{ filter: "blur(1px)" }}
            initial={{ rotateZ: 0 }}
            animate={{ rotateZ: 360 }}
            transition={{
              repeat: Infinity,
              duration: 24 - strand.id * 4,
              ease: "linear",
              delay: strand.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-white/5 p-12 shadow-[0_25px_120px_rgba(14,165,233,0.28)] backdrop-blur-2xl"
          initial={{ rotateX: -6, rotateY: 6, opacity: 0, y: 40 }}
          animate={{ rotateX: 0, rotateY: 0, opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="relative mx-auto flex h-56 w-full max-w-xl flex-col items-center justify-center gap-4 text-center"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.h1
              className="text-6xl font-black uppercase tracking-[0.8rem] text-white drop-shadow-[0_20px_60px_rgba(14,165,233,0.35)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ transform: "translateZ(30px)" }}
            >
              404 Error
            </motion.h1>
            <motion.div
              className="h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              style={{
                transformOrigin: "center",
                transform: "translateZ(20px)",
              }}
            />
            <motion.p
              className="text-sm uppercase tracking-[0.5rem] text-cyan-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              style={{ transform: "translateZ(15px)" }}
            >
              Page Not Found
            </motion.p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-6 text-center">
            <div className="h-10 w-full max-w-xl overflow-hidden text-lg font-medium text-cyan-200">
              <span className="inline-flex min-h-[2.5rem] w-full items-center justify-center gap-1 rounded-full border border-cyan-500/40 bg-slate-900/40 px-6 py-2 text-cyan-100">
                {displayText}
                <span className="ml-1 inline-block h-6 w-[3px] animate-pulse bg-cyan-400" />
              </span>
            </div>
            <p className="max-w-2xl text-base text-slate-200/80">
              The page you are looking for drifted out of the typing orbit. Let
              us drop you at a safe checkpoint.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="rounded-full bg-cyan-500 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_12px_30px_rgba(56,189,248,0.35)] transition hover:bg-cyan-400"
              >
                Back to home
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/live-tests")}
                className="rounded-full border border-cyan-400/60 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-cyan-200 transition hover:border-cyan-200 hover:text-cyan-100"
              >
                Explore live tests
              </motion.button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 text-xs uppercase tracking-[0.3rem] text-cyan-300/70 sm:grid-cols-3">
            <div className="rounded-xl border border-cyan-400/20 bg-slate-900/40 p-4 backdrop-blur">
              <p className="text-[0.65rem] text-slate-200/70">Telemetry</p>
              <p className="mt-2 text-sm font-semibold text-cyan-200">
                Signal Lost
              </p>
            </div>
            <div className="rounded-xl border border-pink-400/10 bg-slate-900/30 p-4 backdrop-blur">
              <p className="text-[0.65rem] text-slate-200/70">
                Suggested Action
              </p>
              <p className="mt-2 text-sm font-semibold text-pink-200">
                Return To Base
              </p>
            </div>
            <div className="rounded-xl border border-purple-400/10 bg-slate-900/30 p-4 backdrop-blur">
              <p className="text-[0.65rem] text-slate-200/70">Live Status</p>
              <p className="mt-2 text-sm font-semibold text-purple-200">
                Typing Bay Ready
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
