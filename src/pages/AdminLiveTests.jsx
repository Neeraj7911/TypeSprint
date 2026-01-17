import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { functions, auth } from "../firebase";
import { getIdToken } from "firebase/auth";

const adminEmails = [
  "kumarrneeraj791@gmail.com",
  "liveproject072@gmail.com",
];

export default function AdminLiveTests() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!currentUser || !adminEmails.includes(currentUser.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-900 text-white p-8 rounded-lg">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-sm text-gray-300 mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const createTest = async (e) => {
    e.preventDefault();
    if (!title || !startTime) return setMessage("Title and start time required");
    setLoading(true);
    setMessage("");
    try {
      // Use HTTP endpoint with CORS handling
      const token = await getIdToken(auth.currentUser);
      const res = await fetch("https://us-central1-typingtest-9f8f6.cloudfunctions.net/createLiveTestHttp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify({
            title,
            description,
            content,
            startTime,
            durationMinutes: Number(duration),
            isPrivate,
          }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessage("Live test created: " + (data.id || "(no-id)"));
      setTitle("");
      setDescription("");
      setStartTime("");
      setDuration(30);
      setIsPrivate(false);
      // navigate to live-tests page
      navigate("/live-tests");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Admin — Create Live Test</h1>
        <form onSubmit={createTest} className="bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl">
          <label className="block mb-2">
            <span className="text-sm text-gray-300">Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 p-2 rounded bg-gray-700 text-white" />
          </label>

          <label className="block mb-2">
            <span className="text-sm text-gray-300">Description</span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 rounded bg-gray-700 text-white" />
          </label>

          <label className="block mb-2">
            <span className="text-sm text-gray-300">Content (text users will type)</span>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full mt-1 p-2 rounded bg-gray-700 text-white" placeholder="Optional: paste paragraph or test content here" />
          </label>

          <label className="block mb-2">
            <span className="text-sm text-gray-300">Start Time (local)</span>
            <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full mt-1 p-2 rounded bg-gray-700 text-white" />
          </label>

          <label className="block mb-2">
            <span className="text-sm text-gray-300">Duration (minutes)</span>
            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-32 mt-1 p-2 rounded bg-gray-700 text-white" />
          </label>

          <label className="flex items-center space-x-2 mb-4">
            <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />
            <span className="text-sm text-gray-300">Private (only registered users)</span>
          </label>

          <div className="flex items-center space-x-3">
            <button type="submit" disabled={loading} className="bg-cyan-600 px-4 py-2 rounded font-semibold">
              {loading ? "Creating..." : "Create Live Test"}
            </button>
            <button type="button" className="bg-gray-700 px-4 py-2 rounded" onClick={() => navigate('/live-tests')}>Cancel</button>
          </div>

          {message && <p className="mt-4 text-sm text-gray-200">{message}</p>}
        </form>
      </div>
    </div>
  );
}
