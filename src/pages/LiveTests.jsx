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
    const q = query(collection(db, "liveTests"), orderBy("startTime", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTests(data);
    });
    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white py-12">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-4xl font-bold text-cyan-400 mb-6">All-India Live Tests</motion.h1>
        <p className="text-gray-300 mb-6">Register for upcoming nationwide live typing tests. All users (including guests) can register. Tests start simultaneously for all participants.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tests.map((t) => (
            <LiveTestCard key={t.id} test={t} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="px-4 py-2 bg-gray-700 rounded" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
