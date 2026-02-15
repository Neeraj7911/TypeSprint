Firestore schema: Live Tests

Collection: liveTests1 (documents)

- title: string
- description: string
- startTime: timestamp
- durationMinutes: number
- createdBy: uid string
- createdAt: timestamp
- isLive: boolean
- status: string (scheduled|live|finished)
- registrationCount: number
- registeredUsers: array of uid
- isPrivate: boolean (optional)
- settings: object (optional)

Users collection additions (optional):

- users/{uid}/registrations/{liveTestId} -> { registeredAt: timestamp }

Security rules (example):

- only authenticated users can read live tests
- only authenticated users can register (write to registeredUsers via transaction)
- admin users can create tests

Example security rule snippet (Firestore rules):

rules_version = '2';
service cloud.firestore {
match /databases/{database}/documents {
match /liveTests1/{testId} {
allow read: if true; // public read
allow create: if request.auth != null && request.auth.token.admin == true;
allow update: if request.auth != null && request.auth.token.admin == true;
// registration handled via Cloud Function or transaction from client but prevent arbitrary array overwrites
allow write: if false;
}
match /users/{uid} {
allow read: if request.auth != null && request.auth.uid == uid;
allow write: if request.auth != null && request.auth.uid == uid;
}
}
}

Notes:

- Use Cloud Function `startScheduledLiveTests` to flip `isLive`/`status` to 'live' at startTime.
- Client should listen to the test doc for `status` changes and redirect/enable participation when status === 'live'.
