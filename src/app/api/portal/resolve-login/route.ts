import { adminConfigured, adminDb } from "@/lib/firebase/admin";
import { normalizeUsername, USERNAME_PATTERN } from "@/lib/portal/model";

/**
 * Lets staff sign in with their username: returns the email for a username so
 * the browser can complete a normal Firebase email/password sign-in. Rate
 * limited, and inactive accounts never resolve.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 15;
const hits = new Map<string, number[]>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (recent.length > MAX_REQUESTS) return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });

  if (!adminConfigured()) return Response.json({ error: "Username sign-in isn't available yet. Use your email." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { username?: string } | null;
  const username = normalizeUsername(body?.username ?? "");
  if (!USERNAME_PATTERN.test(username)) return Response.json({ error: "not_found" }, { status: 404 });

  const db = adminDb();
  const claim = await db.collection("usernames").doc(username).get();
  const uid = claim.data()?.uid as string | undefined;
  const user = uid ? (await db.collection("users").doc(uid).get()).data() : undefined;
  if (!user || user.active !== true) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ email: user.email });
}
