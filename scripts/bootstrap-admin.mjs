// One-time setup: give an existing Firebase Auth account an admin portal profile.
//
//   node --env-file=.env.local scripts/bootstrap-admin.mjs \
//     --email you@example.com --name "Your Name" --username your.name \
//     --tagline Founder --sex "Prefer not to say"
//
// Needs FIREBASE_SERVICE_ACCOUNT or FIREBASE_SERVICE_ACCOUNT_BASE64 in the env.
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, value, i, all) => {
    if (value.startsWith("--")) pairs.push([value.slice(2), all[i + 1]]);
    return pairs;
  }, []),
);

const required = ["email", "name", "username", "tagline", "sex"];
const missing = required.filter((key) => !args[key]);
if (missing.length) {
  console.error(`Missing: ${missing.map((m) => `--${m}`).join(", ")}`);
  process.exit(1);
}

const raw =
  process.env.FIREBASE_SERVICE_ACCOUNT ||
  (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 &&
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8"));
if (!raw) {
  console.error("No service account in the environment.");
  process.exit(1);
}
const sa = JSON.parse(raw);
initializeApp({ credential: cert({ projectId: sa.project_id, clientEmail: sa.client_email, privateKey: sa.private_key }) });

const auth = getAuth();
const db = getFirestore();
const username = args.username.trim().toLowerCase();
const user = await auth.getUserByEmail(args.email.trim());

await db.runTransaction(async (tx) => {
  const nameRef = db.collection("usernames").doc(username);
  const claim = await tx.get(nameRef);
  if (claim.exists && claim.data().uid !== user.uid) throw new Error(`Username "${username}" is taken.`);
  tx.set(nameRef, { uid: user.uid });
  tx.set(
    db.collection("users").doc(user.uid),
    {
      uid: user.uid,
      name: args.name.trim(),
      username,
      email: user.email.toLowerCase(),
      sex: args.sex,
      role: "admin",
      tagline: args.tagline.trim(),
      active: true,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: "bootstrap",
    },
    { merge: true },
  );
});
await db.collection("directory").doc(user.uid).set({
  uid: user.uid,
  name: args.name.trim(),
  username,
  tagline: args.tagline.trim(),
  role: "admin",
  active: true,
});
await auth.updateUser(user.uid, { displayName: args.name.trim(), emailVerified: true });
console.log(`✓ ${user.email} is now an admin (@${username}).`);
process.exit(0);
