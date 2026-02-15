// scripts/createLiveTest.js
// Usage: set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON,
// then run: node scripts/createLiveTest.js

const admin = require("firebase-admin");

try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
} catch (e) {
  // already initialized in some environments
}

const db = admin.firestore();

async function createLiveTest() {
  const docRef = db.collection("liveTests1").doc();
  const content = [
    "This is the first paragraph of the live typing test. Formatting such as line breaks and paragraph separation matters for readability.",
    "Second paragraph: keep punctuation, quotes, and uncommon sequences to make the test realistic.",
    "Final paragraph: include numbers 12345, punctuation !?., and other symbols to cover varied typing elements."
  ];

  await docRef.set({
    title: "All-India Live Test — Formatting Sample",
    startTime: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 1000 * 60 * 60 * 24)), // tomorrow
    durationSeconds: 1800,
    isLive: false,
    isPrivate: false,
    description: "Sample test showing formatted content stored as paragraphs.",
    icon: "🏁",
    // store as array of paragraphs; renderer can join with double newlines or space as needed
    contentArray: content,
    // also include a single string copy for components expecting single text
    content: content.join("\n\n"),
    registeredUsers: [],
    registrationCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("Created live test:", docRef.id);
}

createLiveTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
