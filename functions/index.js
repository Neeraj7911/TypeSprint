const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

// Scheduled function to mark tests as live when their startTime <= now and status isn't live
exports.startScheduledLiveTests = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  const now = admin.firestore.Timestamp.now();
  const q = db.collection('liveTests').where('startTime', '<=', now).where('isLive', '==', false);
  const snap = await q.get();
  const batch = db.batch();
  snap.forEach(doc => {
    const ref = doc.ref;
    batch.update(ref, { isLive: true, startedAt: now, status: 'live' });
  });
  if (!snap.empty) await batch.commit();
  console.log(`Checked ${snap.size} test(s)`);
  return null;
});

// Callable function (kept for SDK use)
exports.createLiveTest = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Request has no auth context');
  }
  const { title, description, content, startTime, durationMinutes, isPrivate } = data;
  if (!title || !startTime) throw new functions.https.HttpsError('invalid-argument', 'Missing title or startTime');

  const docRef = await db.collection('liveTests').add({
    title,
    description: description || '',
    content: content || '',
    startTime: admin.firestore.Timestamp.fromMillis(new Date(startTime).getTime()),
    durationMinutes: durationMinutes || 30,
    createdBy: context.auth.uid,
    createdAt: admin.firestore.Timestamp.now(),
    isLive: false,
    status: 'scheduled',
    registrationCount: 0,
    registeredUsers: [],
    isPrivate: !!isPrivate,
  });

  return { id: docRef.id };
});

// HTTP endpoint with explicit CORS handling so the admin UI can call directly from the browser
// Allow Authorization header for ID token and standard headers/methods used by the admin UI
const cors = require('cors')({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

exports.createLiveTestHttp = functions.https.onRequest((req, res) => {
  // Ensure CORS headers are set for all responses (including errors)
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle CORS preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  // Run cors middleware for actual requests (keeps behavior consistent with other functions)
  cors(req, res, async () => {
    try {
      // Validate auth token from Authorization header
      const authHeader = req.get('Authorization') || '';
      if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
      const idToken = authHeader.split('Bearer ')[1];
      const decoded = await admin.auth().verifyIdToken(idToken).catch(() => null);
      if (!decoded) return res.status(401).json({ error: 'Invalid token' });

      // Ensure admin emails only (optional server-side enforcement)
      const adminEmails = ['kumarrneeraj791@gmail.com', 'liveproject072@gmail.com'];
      const userRecord = await admin.auth().getUser(decoded.uid);
      if (!adminEmails.includes(userRecord.email)) return res.status(403).json({ error: 'Forbidden' });

      const { title, description, content, startTime, durationMinutes, isPrivate } = req.body || {};
      if (!title || !startTime) return res.status(400).json({ error: 'Missing title or startTime' });

      const docRef = await db.collection('liveTests').add({
        title,
        description: description || '',
        content: content || '',
        startTime: admin.firestore.Timestamp.fromMillis(new Date(startTime).getTime()),
        durationMinutes: durationMinutes || 30,
        createdBy: decoded.uid,
        createdAt: admin.firestore.Timestamp.now(),
        isLive: false,
        status: 'scheduled',
        registrationCount: 0,
        registeredUsers: [],
        isPrivate: !!isPrivate,
      });

      return res.json({ id: docRef.id });
    } catch (err) {
      console.error('createLiveTestHttp error', err);
      return res.status(500).json({ error: 'internal' });
    }
  });
});
