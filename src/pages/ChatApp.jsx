import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaSignInAlt,
  FaPaperPlane,
  FaReply,
  FaTimes,
  FaThumbtack,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { db, auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth"; // Fixed: Uncommented import
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [warning, setWarning] = useState("");
  const [user, setUser] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null); // { messageId, createdAt }
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Sensitive data detection regex
  const sensitiveDataRegex = {
    phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\d{10}\b/,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    otp: /\b\d{4,6}\b/,
  };

  // Link validation: Allow only typesprint.live links
  const allowedLinkRegex = /^https:\/\/typesprint\.live(\/.*)?$/;
  const anyLinkRegex = /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/;

  // Slang filter regex (case-insensitive)
  const slangRegex =
    /\b(motherfucker|madherchod|bsdk|fuck|saale|asshole|bitch|bastard|chutiya|randi|kutta|harami|sala|kamina|behenchod|gaandu)\b/i;

  // Disrespectful TypeSprint filter (case-insensitive)
  const disrespectRegex =
    /\b(typesprint|type sprint|typingtest|typing test)\b.*\b(bad|poor|useless|stupid|dumb|shit|trash|horrible|sucks|lame|worst)\b/i;

  // Available reactions
  const reactions = ["👍", "❤️", "😂", "😢", "😡"];

  // Get current date in IST for filtering
  const getCurrentISTDate = () => {
    return new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  // Prevent text copying
  const handleCopy = (e) => {
    e.preventDefault();
    return false;
  };

  // Monitor auth state and check admin status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is admin (replace with actual admin UIDs or Firestore query)
        const adminUIDs = ["admin-uid-1", "admin-uid-2"];
        setIsAdmin(adminUIDs.includes(currentUser.uid));
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch and filter messages from Firestore
  useEffect(() => {
    if (!user) return;
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const currentDate = getCurrentISTDate();
      const messageList = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          reactions: doc.data().reactions || {},
          isPinned: doc.data().isPinned || false,
          deletedFor: doc.data().deletedFor || [],
        }))
        .filter(
          (msg) =>
            msg.date === currentDate && !msg.deletedFor.includes(user.uid)
        );
      const pinned = messageList.find((msg) => msg.isPinned);
      setPinnedMessage(pinned || null);
      setMessages(messageList.filter((msg) => !msg.isPinned));
      if (!isInitialLoad.current && chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
      isInitialLoad.current = false;
    });

    return () => unsubscribe();
  }, [user]);

  // Prevent screenshot and copy
  useEffect(() => {
    const preventActions = (e) => {
      if (e.ctrlKey && ["s", "p", "c"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const preventRightClick = (e) => e.preventDefault();

    document.addEventListener("keydown", preventActions);
    document.addEventListener("contextmenu", preventRightClick);
    return () => {
      document.removeEventListener("keydown", preventActions);
      document.removeEventListener("contextmenu", preventRightClick);
    };
  }, []);

  const checkSensitiveData = (text) => {
    for (const [type, regex] of Object.entries(sensitiveDataRegex)) {
      if (regex.test(text)) {
        return `Blocked: Sharing ${type}s is not allowed.`;
      }
    }
    const links = text.match(anyLinkRegex) || [];
    for (const link of links) {
      if (!allowedLinkRegex.test(link)) {
        return `Blocked: Only links to https://typesprint.live/ are allowed.`;
      }
    }
    if (slangRegex.test(text)) {
      return `Blocked: Offensive language is not allowed.`;
    }
    if (disrespectRegex.test(text)) {
      return `Blocked: Disrespectful comments about TypeSprint are not allowed.`;
    }
    return "";
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      setWarning(""); // Clear any previous warnings
    } catch (error) {
      console.error("Sign-in error:", error.code, error.message); // Improved error logging
      setWarning(`Failed to sign in: ${error.message}`);
      setTimeout(() => setWarning(""), 5000); // Extended warning duration
    }
  };

  const handleReaction = async (messageId, reaction) => {
    if (!user) return;
    const messageRef = doc(db, "messages", messageId);
    const message =
      messages.find((msg) => msg.id === messageId) || pinnedMessage;
    if (!message) return;
    const currentReactions = message.reactions || {};
    const userId = user.uid;

    const updatedReactions = { ...currentReactions };
    Object.keys(updatedReactions).forEach((key) => {
      updatedReactions[key] = updatedReactions[key].filter(
        (id) => id !== userId
      );
      if (updatedReactions[key].length === 0) delete updatedReactions[key];
    });

    updatedReactions[reaction] = [
      ...(updatedReactions[reaction] || []),
      userId,
    ];

    await updateDoc(messageRef, { reactions: updatedReactions });
  };

  const handlePinMessage = async (messageId) => {
    if (!user || !isAdmin) return;
    const messageRef = doc(db, "messages", messageId);

    // Unpin any existing pinned message
    if (pinnedMessage) {
      const prevPinnedRef = doc(db, "messages", pinnedMessage.id);
      await updateDoc(prevPinnedRef, { isPinned: false });
    }

    // Pin the selected message
    await updateDoc(messageRef, { isPinned: true });
  };

  const handleUnpinMessage = async () => {
    if (!user || !isAdmin || !pinnedMessage) return;
    const pinnedRef = doc(db, "messages", pinnedMessage.id);
    await updateDoc(pinnedRef, { isPinned: false });
  };

  const handleReply = (message) => {
    setReplyTo(message);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyTo(null);
    inputRef.current?.focus();
  };

  const canDeleteMessage = (createdAt) => {
    if (!createdAt) return false;
    const now = new Date();
    const messageTime = createdAt.toDate();
    const diffMs = now - messageTime;
    const diffMins = diffMs / (1000 * 60);
    return diffMins <= 3;
  };

  const handleDeleteClick = (messageId, createdAt) => {
    setDeleteDialog({ messageId, createdAt });
  };

  const handleDeleteMessage = async (type) => {
    if (!user || !deleteDialog) return;
    const { messageId } = deleteDialog;
    const messageRef = doc(db, "messages", messageId);

    try {
      if (type === "everyone") {
        await deleteDoc(messageRef);
      } else if (type === "self") {
        const message =
          messages.find((msg) => msg.id === messageId) || pinnedMessage;
        if (!message) return;
        const updatedDeletedFor = [...(message.deletedFor || []), user.uid];
        await updateDoc(messageRef, { deletedFor: updatedDeletedFor });
      }
      setDeleteDialog(null);
    } catch (error) {
      console.error("Delete error:", error.message); // Log errors
      setWarning("Failed to delete message. Please try again.");
      setTimeout(() => setWarning(""), 5000);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!user || !input.trim()) return;

    const blockMessage = checkSensitiveData(input);
    if (blockMessage) {
      setWarning(blockMessage);
      setInput("");
      setReplyTo(null);
      setTimeout(() => setWarning(""), 5000);
      return;
    }

    const message = {
      text: input,
      user: user.displayName || "Anonymous",
      timestamp: new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),
      date: getCurrentISTDate(),
      createdAt: serverTimestamp(),
      reactions: {},
      replyTo: replyTo
        ? { id: replyTo.id, user: replyTo.user, text: replyTo.text }
        : null,
      isPinned: false,
      deletedFor: [],
    };

    await addDoc(collection(db, "messages"), message);
    setInput("");
    setReplyTo(null);
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  };

  return (
    <div className="chat-wrapper min-h-screen bg-gray-100">
      <Helmet>
        <title>Help Community Chat | TypeSprint</title>
        <meta
          name="description"
          content="Join TypeSprint's unique chat to share typing tips for competitive exams. Login required. Only typesprint.live links allowed. No offensive or disrespectful content. Messages reset daily at 1 AM IST."
        />
        <meta
          name="keywords"
          content="secure chat, typing practice, competitive exams, community chat, TypeSprint, typing tips"
        />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-20 pb-10">
        <h2
          className="text-3xl font-semibold mb-6 text-center tracking-tight text-gray-900 select-none"
          onCopy={handleCopy}
        >
          TypeSprint Community Chat
        </h2>
        <div
          className="chat-container w-full bg-white border border-gray-200/50 rounded-xl shadow-lg flex flex-col h-[calc(100vh-120px)] select-none"
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
          }}
        >
          {!user ? (
            <div className="flex items-center justify-center h-full text-center animate-slide-in">
              <div className="p-8 bg-gray-100/80 rounded-xl shadow-lg">
                <p
                  className="text-2xl mb-6 font-semibold select-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                  onCopy={handleCopy}
                >
                  Please Sign In to Join TypeSprint Chat
                </p>
                <motion.button
                  onClick={handleSignIn}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSignInAlt /> Sign In with Google
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full relative">
              <AnimatePresence>
                {warning && (
                  <motion.div
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600/90 text-white p-3 rounded-lg text-sm shadow-lg z-10 select-none"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onCopy={handleCopy}
                  >
                    {warning}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {deleteDialog && (
                  <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="bg-gray-100/80 p-6 rounded-xl shadow-lg max-w-sm w-full select-none"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onCopy={handleCopy}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Delete Message
                      </h3>
                      <p className="text-sm text-gray-600 mb-6">
                        Choose how to delete this message (available within 3
                        minutes):
                      </p>
                      <div className="flex flex-col gap-3">
                        <motion.button
                          onClick={() => handleDeleteMessage("everyone")}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete for Everyone
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteMessage("self")}
                          className="px-4 py-2 bg-gray-200/50 text-gray-800 rounded-full hover:bg-gray-300/50 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete for Self
                        </motion.button>
                        <motion.button
                          onClick={() => setDeleteDialog(null)}
                          className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-gray-100/80 p-2 border-b border-gray-200/50 overflow-hidden">
                <motion.div
                  className="inline-block text-sm text-indigo-600 font-medium whitespace-nowrap select-none"
                  animate={{ x: ["100%", "-100%"] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  onCopy={handleCopy}
                >
                  Do not share phone numbers, illegal links, or make payments.
                  TypeSprint.live is not responsible for any such actions.
                </motion.div>
              </div>

              <div className="flex flex-col flex-grow overflow-hidden">
                <AnimatePresence>
                  {pinnedMessage && (
                    <motion.div
                      className="p-4 bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-gray-200/50 shadow-sm select-none"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      onCopy={handleCopy}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FaThumbtack className="text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-600">
                          Pinned by Admin
                        </span>
                        {isAdmin && (
                          <motion.button
                            onClick={handleUnpinMessage}
                            className="ml-auto text-xs text-red-500 hover:text-red-400"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Unpin message"
                          >
                            Unpin
                          </motion.button>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-indigo-600 font-medium text-sm">
                          {pinnedMessage.user}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {pinnedMessage.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-800">
                        {pinnedMessage.text}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  ref={chatContainerRef}
                  className="flex-grow p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-100"
                >
                  {messages.length === 0 && !pinnedMessage ? (
                    <p
                      className="text-center text-gray-500 text-base animate-slide-in mt-20 select-none"
                      onCopy={handleCopy}
                    >
                      No messages yet. Start the chat!
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`mb-3 p-3 rounded-lg max-w-[65%] animate-slide-in relative group select-none ${
                          msg.user === (user.displayName || "Anonymous")
                            ? "ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                            : "mr-auto bg-gray-100/80 text-gray-800"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        onCopy={handleCopy}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        {msg.replyTo && (
                          <div
                            className="bg-gray-200/50 p-2 rounded-lg mb-2 text-xs border-l-2 border-indigo-400 select-none"
                            onCopy={handleCopy}
                          >
                            <span className="text-indigo-600 font-medium">
                              {msg.replyTo.user}
                            </span>
                            <p className="text-gray-600 truncate">
                              {msg.replyTo.text}
                            </p>
                          </div>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span
                            className={`font-medium text-sm ${
                              msg.user === (user.displayName || "Anonymous")
                                ? "text-white"
                                : "text-indigo-600"
                            }`}
                          >
                            {msg.user}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="mt-1 text-base">{msg.text}</p>
                        <div className="flex gap-1 mt-1 text-xs flex-wrap">
                          {Object.entries(msg.reactions).map(
                            ([reaction, users]) =>
                              users.length > 0 ? (
                                <span
                                  key={reaction}
                                  className="px-2 py-1 bg-gray-200/50 rounded-full animate-pop"
                                  title={`${users.length} user(s) reacted with ${reaction}`}
                                >
                                  {reaction} {users.length}
                                </span>
                              ) : null
                          )}
                        </div>
                        <div className="absolute -top-8 left-0 hidden group-hover:flex gap-1 bg-gray-100/80 rounded-full p-1 shadow-lg z-10">
                          {reactions.map((reaction) => (
                            <motion.button
                              key={reaction}
                              onClick={() => handleReaction(msg.id, reaction)}
                              className="p-1 hover:bg-indigo-600/30 rounded-full transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label={`React with ${reaction}`}
                            >
                              {reaction}
                            </motion.button>
                          ))}
                          <motion.button
                            onClick={() => handleReply(msg)}
                            className="p-1 hover:bg-indigo-600/30 rounded-full transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Reply to message"
                          >
                            <FaReply />
                          </motion.button>
                          {isAdmin && !msg.isPinned && (
                            <motion.button
                              onClick={() => handlePinMessage(msg.id)}
                              className="p-1 hover:bg-indigo-600/30 rounded-full transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label="Pin message"
                            >
                              <FaThumbtack />
                            </motion.button>
                          )}
                          {msg.user === (user.displayName || "Anonymous") &&
                            canDeleteMessage(msg.createdAt) && (
                              <motion.button
                                onClick={() =>
                                  handleDeleteClick(msg.id, msg.createdAt)
                                }
                                className="p-1 hover:bg-red-500/30 rounded-full transition-all duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Delete message"
                              >
                                <FaTrash className="text-red-500" />
                              </motion.button>
                            )}
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="bg-gray-100/80 p-3 border-t border-gray-200/50">
                  {replyTo && (
                    <div
                      className="bg-gray-200/50 p-2 rounded-lg mb-2 text-xs flex items-center justify-between mx-2 sm:mx-4 select-none"
                      onCopy={handleCopy}
                    >
                      <div>
                        <span className="text-indigo-600 font-medium">
                          Replying to {replyTo.user}
                        </span>
                        <p className="text-gray-600 truncate">{replyTo.text}</p>
                      </div>
                      <motion.button
                        onClick={cancelReply}
                        className="p-1 text-gray-500 hover:text-red-400"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Cancel reply"
                      >
                        <FaTimes />
                      </motion.button>
                    </div>
                  )}
                  <form
                    onSubmit={sendMessage}
                    className="flex gap-2 items-center mx-2 sm:mx-4"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 p-3 rounded-full bg-gray-200/50 text-gray-800 border border-gray-300 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 text-base transition-all duration-300 select-none"
                      aria-label="Message input"
                      autoFocus
                      onCopy={handleCopy}
                    />
                    <motion.button
                      type="submit"
                      className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Send message"
                    >
                      <FaPaperPlane />
                    </motion.button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        .animate-pop {
          animation: pop 0.2s ease-out;
        }
        .select-none {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-indigo-600 {
          scrollbar-color: #4f46e5 transparent;
        }
        .scrollbar-track-gray-100 {
          scrollbar-color: #4f46e5 #f3f4f6;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: #4f46e5;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default ChatApp;
