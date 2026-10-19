import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type { Role } from "@/lib/portal/model";

/**
 * Firebase Admin (server only). Credentials come from a service-account key,
 * provided as either:
 *   FIREBASE_SERVICE_ACCOUNT          the JSON file's contents, or
 *   FIREBASE_SERVICE_ACCOUNT_BASE64   the same JSON, base64-encoded.
 * Never expose these with a NEXT_PUBLIC_ prefix.
 */
function credentials() {
  const raw =
    process.env.FIREBASE_SERVICE_ACCOUNT?.trim() ||
    (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
      ? Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64.trim(), "base64").toString("utf8")
      : "");
  if (!raw) return null;
  const json = JSON.parse(raw) as { project_id: string; client_email: string; private_key: string };
  return cert({ projectId: json.project_id, clientEmail: json.client_email, privateKey: json.private_key });
}

let app: App | null = null;

export function adminConfigured() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_SERVICE_ACCOUNT_BASE64);
}

function adminApp() {
  if (app) return app;
  const credential = credentials();
  if (!credential) throw new Error("Firebase Admin is not configured.");
  app = getApps().find((a) => a.name === "admin") ?? initializeApp({ credential }, "admin");
  return app;
}

export const adminAuth = () => getAuth(adminApp());

let db: Firestore | null = null;

/** REST transport: Cloudflare Workers can't open the gRPC connection Firestore uses by default. */
export function adminDb() {
  if (db) return db;
  db = getFirestore(adminApp());
  db.settings({ preferRest: true });
  return db;
}

/** The staff-directory card for a user: what managers may see (no email/sex). */
export function directoryCard(p: { uid: string; name: string; username: string; tagline: string; role: string; active: boolean }) {
  return { uid: p.uid, name: p.name, username: p.username, tagline: p.tagline, role: p.role, active: p.active };
}

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/**
 * Verifies the caller's Firebase ID token (Authorization: Bearer …) and that
 * their portal profile is active with one of the allowed roles.
 */
export async function requireRole(request: Request, roles: Role[]) {
  if (!adminConfigured()) throw new HttpError(503, "The server isn't configured for user management yet.");
  const token = request.headers.get("authorization")?.match(/^Bearer (.+)$/)?.[1];
  if (!token) throw new HttpError(401, "Please sign in again.");
  let uid: string;
  try {
    uid = (await adminAuth().verifyIdToken(token, true)).uid;
  } catch {
    throw new HttpError(401, "Your session has expired. Please sign in again.");
  }
  const profile = await adminDb().collection("users").doc(uid).get();
  const data = profile.data();
  if (!data || data.active !== true || !roles.includes(data.role)) {
    throw new HttpError(403, "You don't have permission to do that.");
  }
  return { uid, role: data.role as Role };
}

export function errorResponse(error: unknown) {
  if (error instanceof HttpError) return Response.json({ error: error.message }, { status: error.status });
  const code = (error as { code?: string })?.code ?? "";
  if (code === "auth/email-already-exists") {
    return Response.json({ error: "A user with this email already exists.", field: "email" }, { status: 409 });
  }
  if (code === "auth/invalid-password") {
    return Response.json({ error: "That password isn't allowed.", field: "password" }, { status: 400 });
  }
  console.error("[portal api]", error);
  return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
