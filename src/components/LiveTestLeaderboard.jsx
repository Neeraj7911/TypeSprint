import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

export default function LiveTestLeaderboard({ testId, collectionName }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (!testId || !collectionName) return;
    const resultsRef = collection(db, collectionName, testId, "results");
    const q = query(resultsRef, orderBy("netWpm", "desc"), limit(25));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEntries(data.slice(0, 20));
    });
    return () => unsub();
  }, [testId, collectionName]);

  if (!entries.length) {
    return (
      <p className="text-sm text-gray-400">
        Results appear here once participants submit.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className="bg-gray-800/80 rounded-md px-3 py-2 flex items-center justify-between text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-mono w-6 text-right">
              {index + 1}.
            </span>
            <div>
              <p className="text-white font-medium leading-tight">
                {entry.displayName || entry.email || "Participant"}
              </p>
              <p className="text-xs text-gray-400">
                {entry.netWpm?.toFixed
                  ? `${entry.netWpm.toFixed(1)} WPM`
                  : `${entry.netWpm || 0} WPM`}{" "}
                • Accuracy {entry.accuracy || 0}%
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-500 text-right">
            <p>
              {entry.createdAt?.seconds
                ? new Date(entry.createdAt.seconds * 1000).toLocaleTimeString()
                : ""}
            </p>
            <p>{entry.language?.toUpperCase?.() || ""}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
