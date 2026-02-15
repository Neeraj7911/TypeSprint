import React, { useEffect, useMemo, useState } from "react";
import { FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

const LIVE_GRACE_MS = 60 * 1000;
const STARTING_SOON_MS = 5 * 60 * 1000;
const STALE_WINDOW_MS = 12 * 60 * 60 * 1000;

const toMillis = (value) => {
  if (!value) return null;
  if (value.seconds) return value.seconds * 1000;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const formatRelativeTime = (target) => {
  if (!target) return "";
  const now = Date.now();
  const diff = target - now;
  const absMinutes = Math.max(0, Math.round(Math.abs(diff) / 60000));
  if (diff >= 0) {
    if (absMinutes === 0) return "in less than 1 min";
    if (absMinutes === 1) return "in 1 minute";
    if (absMinutes < 60) return `in ${absMinutes} minutes`;
    const hours = Math.round(absMinutes / 60);
    return `in ${hours} hour${hours > 1 ? "s" : ""}`;
  }
  if (absMinutes === 0) return "just now";
  if (absMinutes === 1) return "1 minute ago";
  if (absMinutes < 60) return `${absMinutes} minutes ago`;
  const hours = Math.round(absMinutes / 60);
  return `${hours} hour${hours > 1 ? "s" : ""} ago`;
};

const NotificationBell = ({ currentUser, variant = "desktop", onNavigate }) => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [seenIds, setSeenIds] = useState({});
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    let latest1 = [];
    let latest2 = [];

    const mergeSnapshots = (docs1, docs2) => {
      const combined = {};
      docs1.forEach((docSnap) => {
        combined[docSnap.id] = {
          id: docSnap.id,
          _collection: "liveTests1",
          ...docSnap.data(),
        };
      });
      docs2.forEach((docSnap) => {
        combined[docSnap.id] = {
          id: docSnap.id,
          _collection: "liveTests",
          ...docSnap.data(),
        };
      });
      setTests(Object.values(combined));
    };

    const unsub1 = onSnapshot(collection(db, "liveTests1"), (snap) => {
      latest1 = snap.docs;
      mergeSnapshots(latest1, latest2);
    });
    const unsub2 = onSnapshot(collection(db, "liveTests"), (snap) => {
      latest2 = snap.docs;
      mergeSnapshots(latest1, latest2);
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

  useEffect(() => {
    const interval = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const notifications = useMemo(() => {
    const items = [];

    tests.forEach((test) => {
      if (!test || !test.id) return;
      const startMs = toMillis(test.startTime);
      if (!startMs) return;
      if (
        startMs + STALE_WINDOW_MS < nowMs &&
        (!test.completedUsers || !currentUser)
      )
        return;
      const title = test.title || "Live Test";
      const basePath = `/live-test/${test.id}`;
      const registeredUsers = Array.isArray(test.registeredUsers)
        ? test.registeredUsers
        : [];
      const userRegistered = currentUser
        ? registeredUsers.includes(currentUser.uid)
        : false;

      if (startMs > nowMs) {
        items.push({
          id: `${test.id}-scheduled`,
          title: "Live test scheduled",
          message: `${title} starts ${formatRelativeTime(startMs)} (${new Date(startMs).toLocaleString()}).`,
          actionLabel: "View details",
          path: basePath,
          timestamp: startMs,
        });
        if (startMs - nowMs <= STARTING_SOON_MS) {
          items.push({
            id: `${test.id}-starting`,
            title: "Starting soon",
            message: `${title} unlocks ${formatRelativeTime(startMs)}. Get ready to join.`,
            actionLabel: "Open lobby",
            path: basePath,
            timestamp: startMs - 1,
          });
        }
      }

      if (
        userRegistered &&
        nowMs >= startMs &&
        nowMs <= startMs + LIVE_GRACE_MS
      ) {
        const params = new URLSearchParams({
          testId: test.id,
          duration: String(test.durationMinutes || 10),
          language: test.language || "english",
          exam: test.examType || "Live",
          font: test.font || "",
          autoStart: "true",
          skipInstructions: "true",
        });
        if (test._collection) params.set("collection", test._collection);
        items.push({
          id: `${test.id}-live`,
          title: "Live test is running",
          message: `${title} is live now. Join before the grace window closes.`,
          actionLabel: "Start now",
          path: `/typing-test?${params.toString()}`,
          timestamp: nowMs,
        });
      }

      if (
        currentUser &&
        Array.isArray(test.completedUsers) &&
        test.completedUsers.includes(currentUser.uid) &&
        nowMs >= startMs
      ) {
        items.push({
          id: `${test.id}-leaderboard-${currentUser.uid}`,
          title: "Leaderboard updated",
          message: `See how you rank for ${title}.`,
          actionLabel: "View leaderboard",
          path: basePath,
          timestamp: nowMs,
        });
      }
    });

    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return items;
  }, [tests, currentUser, nowMs]);

  const unreadCount = notifications.filter((n) => !seenIds[n.id]).length;

  const markAsRead = (ids) => {
    if (!ids || !ids.length) return;
    setSeenIds((prev) => {
      const next = { ...prev };
      ids.forEach((id) => {
        next[id] = true;
      });
      return next;
    });
  };

  const handleToggle = () => {
    setPanelOpen((prev) => {
      const next = !prev;
      if (!prev && notifications.length) {
        markAsRead(notifications.map((n) => n.id));
      }
      return next;
    });
  };

  const handleAction = (notification) => {
    if (!notification || !notification.path) return;
    markAsRead([notification.id]);
    setPanelOpen(false);
    if (onNavigate) onNavigate();
    navigate(notification.path);
  };

  if (variant === "mobile") {
    return (
      <div className="bg-white bg-opacity-10 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FaBell />
            Notifications
          </div>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
        {notifications.length === 0 ? (
          <p className="text-xs text-gray-200">All caught up.</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-gray-900 bg-opacity-60 rounded-md p-3 text-xs"
              >
                <p className="font-semibold text-white mb-1">
                  {notification.title}
                </p>
                <p className="text-gray-300 leading-snug mb-2">
                  {notification.message}
                </p>
                <button
                  onClick={() => handleAction(notification)}
                  className="text-indigo-300 hover:text-indigo-100 font-semibold"
                >
                  {notification.actionLabel}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative bg-white bg-opacity-20 text-gray-900 dark:text-white p-2 rounded-full"
      >
        <FaBell className="text-lg" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </motion.button>
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 overflow-hidden z-30"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <span className="text-sm font-semibold">Notifications</span>
              {notifications.length > 0 && (
                <button
                  onClick={() => markAsRead(notifications.map((n) => n.id))}
                  className="text-xs text-indigo-300 hover:text-indigo-100"
                >
                  Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-sm text-gray-300">
                No notifications yet.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 border-b border-gray-800 last:border-b-0"
                  >
                    <p className="text-sm font-semibold text-white">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-300 leading-snug mt-1">
                      {notification.message}
                    </p>
                    <button
                      onClick={() => handleAction(notification)}
                      className="mt-2 text-xs font-semibold text-indigo-300 hover:text-indigo-100"
                    >
                      {notification.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
