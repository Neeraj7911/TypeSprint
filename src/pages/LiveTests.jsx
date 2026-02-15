import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import LiveTestCard from "../components/LiveTestCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LiveTests() {
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to both possible collections (`liveTests1` used by functions,
    // and `liveTests` which may be used when creating documents manually
    // from the console). Merge documents by id so duplicates won't repeat.
    const q1 = query(collection(db, "liveTests1"));
    const q2 = query(collection(db, "liveTests"));

    let latest1 = [];
    let latest2 = [];

    const toMillis = (s) => {
      if (!s) return 0;
      if (s.seconds) return s.seconds * 1000;
      const parsed = Date.parse(s);
      return isNaN(parsed) ? 0 : parsed;
    };

    const LIVE_GRACE_MS = 60 * 1000;

    const processSnapshots = (snap1Docs, snap2Docs) => {
      const combined = {};
      const pushDoc = (d, col) => {
        combined[d.id] = { id: d.id, _collection: col, ...d.data() };
      };
      snap1Docs.forEach((d) => pushDoc(d, "liveTests1"));
      snap2Docs.forEach((d) => pushDoc(d, "liveTests"));
      let data = Object.values(combined);

      const allowedStatuses = new Set([
        "scheduled",
        "live",
        "in-progress",
        "active",
      ]);

      // only show upcoming or currently live tests (within 1 minute grace window)
      const now = Date.now();
      data = data.filter((item) => {
        if (!item) return false;
        if (item.status && !allowedStatuses.has(item.status)) return false;
        const ms = toMillis(item.startTime);
        if (!ms) return false;
        return ms >= now - LIVE_GRACE_MS;
      });

      data.sort((a, b) => toMillis(a.startTime) - toMillis(b.startTime));
      setTests(data);
    };

    const unsub1 = onSnapshot(q1, (snap) => {
      latest1 = snap.docs;
      processSnapshots(latest1, latest2);
    });
    const unsub2 = onSnapshot(q2, (snap) => {
      latest2 = snap.docs;
      processSnapshots(latest1, latest2);
    });

    return () => {
      try {
        unsub1();
      } catch (e) {}
      try {
        unsub2();
      } catch (e) {}
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white pt-28 pb-16">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-cyan-400 mb-6"
        >
          All-India Live Tests
        </motion.h1>
        <p className="text-gray-300 mb-6">
          Register for upcoming nationwide live typing tests. All users
          (including guests) can register. Tests start simultaneously for all
          participants.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tests.map((t) => (
            <LiveTestCard key={t.id} test={t} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            className="px-4 py-2 bg-gray-700 rounded"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
