import { getApp, getApps, initializeApp, type FirebaseOptions } from "firebase/app";

/**
 * Firebase web config. These values are public by design — data is protected
 * by the Firestore security rules in /firestore.rules, not by hiding them.
 * NEXT_PUBLIC_* variables must be referenced literally so Next.js inlines them.
 */
const config: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

export function firebaseApp() {
  if (!isFirebaseConfigured) throw new Error("Firebase is not configured.");
  return getApps().length ? getApp() : initializeApp(config);
}

/** Collection that stores contact-page enquiries. */
export const ENQUIRIES = "enquiries";

export type EnquiryStatus = "new" | "contacted" | "closed";
