import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function LiveTestRunner() {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ref = doc(db, "liveTests", testId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setTest({ id: snap.id, ...snap.data() });
    });
    return () => unsub();
  }, [testId]);

  if (!test) return <div className="p-8">Loading test...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-900 text-white rounded-lg p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold mb-4">{test.title}</h2>
        <p className="text-gray-300 mb-4">Join the live test. Click Join to open the typing interface.</p>
        <p className="text-sm text-gray-400">Start time: {new Date(test.startTime.seconds ? test.startTime.seconds * 1000 : test.startTime).toLocaleString()}</p>
        <p className="text-sm text-gray-400">Registrations: {test.registrationCount || 0}</p>
        <div className="mt-4">
          <button
            onClick={() => {
              // navigate to the user typing UI and pass testId
              navigate(`/typing-test?testId=${test.id}&duration=${test.durationMinutes || 10}`);
            }}
            className="px-4 py-2 bg-cyan-600 rounded text-white"
          >
            Join Test
          </button>
        </div>
      </div>
    </div>
  );
}
