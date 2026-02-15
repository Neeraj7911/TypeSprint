import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  Timestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { getIdToken } from "firebase/auth";

const ENV =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};

// primary admin list (fallback). You can set REACT_APP_OWNER_EMAIL to restrict
// admin access to a single email in your environment.
const adminEmails = ["kumarrneeraj791@gmail.com", "liveproject072@gmail.com"];

const OWNER_EMAIL =
  ENV.VITE_OWNER_EMAIL ||
  ENV.VITE_APP_OWNER_EMAIL ||
  ENV.REACT_APP_OWNER_EMAIL ||
  null;
const LIVE_TEST_COLLECTION = ENV.VITE_LIVE_TEST_COLLECTION || "liveTests1";
const DEFAULT_KEYBOARD_SETTINGS = {
  disableBackspace: true,
  disableColorFeedback: true,
  disableCopy: true,
  disableCut: true,
  disableDelete: true,
  disableHighlighting: true,
  disableLeftArrow: true,
  disablePaste: true,
  disableRightArrow: true,
  disableSelectAll: true,
};

export default function AdminLiveTests() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [isPrivate, setIsPrivate] = useState(false);
  const [examType, setExamType] = useState("SSC");
  const [font, setFont] = useState("Arial");
  const [language, setLanguage] = useState("english");
  const [slots, setSlots] = useState(50);
  const [targetWPM, setTargetWPM] = useState(35);
  const [keyboardSettings, setKeyboardSettings] = useState(() => ({
    ...DEFAULT_KEYBOARD_SETTINGS,
  }));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");
  const [loadedCollection, setLoadedCollection] = useState(null);

  const contentRef = React.useRef(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setContent("");
    setStartTime("");
    setDuration(30);
    setIsPrivate(false);
    setExamType("SSC");
    setFont("Arial");
    setLanguage("english");
    setSlots(50);
    setTargetWPM(35);
    setKeyboardSettings(() => ({ ...DEFAULT_KEYBOARD_SETTINGS }));
    setEditingId("");
    setLoadedCollection(null);
  };

  const directCreateTest = async (start, mergedKeyboardSettings) => {
    const dateStr = start.toLocaleDateString("en-CA");
    const timeStr = start.toTimeString().slice(0, 5);
    const docData = {
      title,
      description: description || "",
      content: content || "",
      startTime: Timestamp.fromDate(start),
      date: dateStr,
      time: timeStr,
      durationMinutes: Number(duration) || 30,
      examType: examType || "",
      font: font || "",
      language: language || "english",
      slots: Number(slots) || 0,
      targetWPM: Number(targetWPM) || 0,
      keyboardSettings: mergedKeyboardSettings,
      createdBy: currentUser?.uid || "",
      createdAt: Timestamp.now(),
      isPrivate: !!isPrivate,
      status: "scheduled",
      isLive: false,
      registrationCount: 0,
      registeredUsers: [],
    };
    const docRef = await addDoc(collection(db, LIVE_TEST_COLLECTION), docData);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  };

  const allowed = OWNER_EMAIL ? [OWNER_EMAIL] : adminEmails;
  if (!currentUser || !allowed.includes(currentUser.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-900 text-white p-8 rounded-lg">
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-sm text-gray-300 mt-2">
            You do not have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  const createTest = async (e) => {
    e.preventDefault();
    if (!title || !startTime) {
      setMessage("Title and start time required");
      return;
    }
    const start = new Date(startTime);
    if (Number.isNaN(start.getTime())) {
      setMessage("Invalid start time");
      return;
    }
    const mergedKeyboardSettings = {
      ...DEFAULT_KEYBOARD_SETTINGS,
      ...keyboardSettings,
    };
    setLoading(true);
    setMessage("");
    try {
      if (editingId) {
        const col = loadedCollection || LIVE_TEST_COLLECTION;
        const ref = doc(db, col, editingId);
        await updateDoc(ref, {
          title,
          description: description || "",
          content: content || "",
          startTime: Timestamp.fromDate(start),
          date: start.toLocaleDateString("en-CA"),
          time: start.toTimeString().slice(0, 5),
          durationMinutes: Number(duration) || 30,
          examType: examType || "",
          font: font || "",
          language: language || "english",
          slots: Number(slots) || 0,
          targetWPM: Number(targetWPM) || 0,
          keyboardSettings: mergedKeyboardSettings,
          isPrivate: !!isPrivate,
          status: "scheduled",
        });
        const updatedId = editingId;
        resetForm();
        setMessage("Live test updated: " + updatedId);
        navigate("/live-tests");
        return;
      }

      const token = await getIdToken(auth.currentUser);
      const FUNCTIONS_BASE =
        ENV.VITE_CREATE_LIVE_TEST_URL ||
        ENV.VITE_APP_CREATE_LIVE_TEST_URL ||
        ENV.REACT_APP_CREATE_LIVE_TEST_URL ||
        (window.location.hostname === "localhost"
          ? "http://localhost:5001/typingtest-9f8f6/us-central1"
          : "https://us-central1-typingtest-9f8f6.cloudfunctions.net");
      const endpoint = `${FUNCTIONS_BASE}/createLiveTestHttp`;
      const payload = {
        title,
        description,
        content,
        startTime,
        durationMinutes: Number(duration),
        isPrivate,
        examType,
        font,
        language,
        slots: Number(slots),
        targetWPM: Number(targetWPM),
        keyboardSettings: mergedKeyboardSettings,
      };

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        let data = {};
        try {
          data = await res.json();
        } catch (jsonErr) {
          console.warn("createLiveTestHttp response parse failed", jsonErr);
        }
        if (!res.ok) throw new Error((data && data.error) || "Failed");
        resetForm();
        setMessage("Live test created: " + (data.id || "(no-id)"));
        navigate("/live-tests");
      } catch (networkErr) {
        console.warn(
          "createLiveTestHttp failed, using Firestore fallback",
          networkErr,
        );
        const fallbackId = await directCreateTest(
          start,
          mergedKeyboardSettings,
        );
        resetForm();
        setMessage("Live test created via Firestore: " + fallbackId);
        navigate("/live-tests");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to create test");
    } finally {
      setLoading(false);
    }
  };

  const loadTest = async () => {
    if (!editingId) return setMessage("Enter a Test ID to load");
    try {
      // try both collections
      const ref1 = doc(db, "liveTests1", editingId);
      const ref2 = doc(db, "liveTests", editingId);
      const s1 = await getDoc(ref1);
      if (s1.exists()) {
        const d = s1.data();
        setTitle(d.title || "");
        setDescription(d.description || "");
        setContent(d.content || "");
        setStartTime(
          d.startTime && d.startTime.seconds
            ? new Date(d.startTime.seconds * 1000).toISOString().slice(0, 16)
            : "",
        );
        setDuration(d.durationMinutes || 30);
        setIsPrivate(!!d.isPrivate);
        setExamType(d.examType || "SSC");
        setFont(d.font || "Arial");
        setLanguage(d.language || "english");
        setSlots(d.slots || 50);
        setTargetWPM(d.targetWPM || 35);
        setKeyboardSettings({
          ...DEFAULT_KEYBOARD_SETTINGS,
          ...(d.keyboardSettings || {}),
        });
        setLoadedCollection("liveTests1");
        setMessage("Loaded test from liveTests1");
        return;
      }
      const s2 = await getDoc(ref2);
      if (s2.exists()) {
        const d = s2.data();
        setTitle(d.title || "");
        setDescription(d.description || "");
        setContent(d.content || "");
        setStartTime(
          d.startTime && d.startTime.seconds
            ? new Date(d.startTime.seconds * 1000).toISOString().slice(0, 16)
            : "",
        );
        setDuration(d.durationMinutes || 30);
        setIsPrivate(!!d.isPrivate);
        setExamType(d.examType || "SSC");
        setFont(d.font || "Arial");
        setLanguage(d.language || "english");
        setSlots(d.slots || 50);
        setTargetWPM(d.targetWPM || 35);
        setKeyboardSettings({
          ...DEFAULT_KEYBOARD_SETTINGS,
          ...(d.keyboardSettings || {}),
        });
        setLoadedCollection("liveTests");
        setMessage("Loaded test from liveTests");
        return;
      }
      setMessage("Test not found in either collection");
    } catch (err) {
      console.error(err);
      setMessage("Failed to load test");
    }
  };

  const insertAtCursor = (text) => {
    const ta = contentRef.current;
    if (!ta) return setContent((c) => c + text);
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const newVal = content.slice(0, start) + text + content.slice(end);
    setContent(newVal);
    // restore cursor
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + text.length;
      ta.focus();
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Admin — Create Live Test</h1>
        <form
          onSubmit={createTest}
          className="bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <input
              placeholder="Optional: existing Test ID to edit"
              value={editingId}
              onChange={(e) => setEditingId(e.target.value)}
              className="w-1/2 p-2 rounded bg-gray-700 text-white"
            />
            <button
              type="button"
              onClick={loadTest}
              className="px-3 py-2 bg-gray-600 rounded"
            >
              Load Test
            </button>
            {loadedCollection && (
              <span className="text-xs text-gray-300">
                Loaded from {loadedCollection}
              </span>
            )}
          </div>

          <label className="block mb-2">
            <span className="text-sm text-gray-300">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
            />
          </label>

          <label className="block mb-2">
            <span className="text-sm text-gray-300">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
            />
          </label>

          <label className="block mb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                Content (text users will type)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => insertAtCursor(", ")}
                  className="text-xs px-2 py-1 bg-gray-700 rounded"
                >
                  Insert ","
                </button>
                <button
                  type="button"
                  onClick={() => insertAtCursor(" ")}
                  className="text-xs px-2 py-1 bg-gray-700 rounded"
                >
                  Insert Space
                </button>
                <button
                  type="button"
                  onClick={() => insertAtCursor("\n")}
                  className="text-xs px-2 py-1 bg-gray-700 rounded"
                >
                  Insert Newline
                </button>
                <button
                  type="button"
                  onClick={() => insertAtCursor("\n\n")}
                  className="text-xs px-2 py-1 bg-gray-700 rounded"
                >
                  Insert Paragraph
                </button>
              </div>
            </div>
            <textarea
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
              placeholder="Optional: paste paragraph or test content here"
              rows={8}
            />
            <div className="mt-2 text-xs text-gray-300">
              Preview:
              <pre className="bg-gray-800 p-2 rounded mt-1 text-left whitespace-pre-wrap">
                {content}
              </pre>
            </div>
          </label>

          <label className="block mb-2">
            <span className="text-sm text-gray-300">Start Time (local)</span>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
            />
          </label>

          <label className="block mb-2">
            <span className="text-sm text-gray-300">Duration (minutes)</span>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-32 mt-1 p-2 rounded bg-gray-700 text-white"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block mb-2">
              <span className="text-sm text-gray-300">Slots</span>
              <input
                type="number"
                value={slots}
                onChange={(e) => setSlots(e.target.value)}
                className="w-32 mt-1 p-2 rounded bg-gray-700 text-white"
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm text-gray-300">Target WPM</span>
              <input
                type="number"
                value={targetWPM}
                onChange={(e) => setTargetWPM(e.target.value)}
                className="w-32 mt-1 p-2 rounded bg-gray-700 text-white"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block mb-2">
              <span className="text-sm text-gray-300">Exam Type</span>
              <input
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
              />
            </label>

            <label className="block mb-2">
              <span className="text-sm text-gray-300">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="kannada">Kannada</option>
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block mb-2">
              <span className="text-sm text-gray-300">Font</span>
              <input
                value={font}
                onChange={(e) => setFont(e.target.value)}
                className="w-full mt-1 p-2 rounded bg-gray-700 text-white"
              />
            </label>

            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              <span className="text-sm text-gray-300">
                Private (only registered users)
              </span>
            </label>
          </div>

          <div className="mb-4">
            <h4 className="text-sm text-gray-300 mb-2">Keyboard Settings</h4>
            <div className="flex flex-wrap gap-3">
              {Object.keys(DEFAULT_KEYBOARD_SETTINGS).map((k) => (
                <label key={k} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!keyboardSettings[k]}
                    onChange={() =>
                      setKeyboardSettings((prev) => ({
                        ...prev,
                        [k]: !prev[k],
                      }))
                    }
                  />
                  <span className="text-sm text-gray-300">{k}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 px-4 py-2 rounded font-semibold"
            >
              {loading
                ? editingId
                  ? "Saving..."
                  : "Creating..."
                : editingId
                  ? "Save Changes"
                  : "Create Live Test"}
            </button>
            <button
              type="button"
              className="bg-gray-700 px-4 py-2 rounded"
              onClick={() => navigate("/live-tests")}
            >
              Cancel
            </button>
          </div>

          {message && <p className="mt-4 text-sm text-gray-200">{message}</p>}
        </form>
      </div>
    </div>
  );
}
