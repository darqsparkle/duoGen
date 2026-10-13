"use client";

import {
  deleteUser,
  getAdditionalUserInfo,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { firebaseApp, isFirebaseConfigured } from "@/lib/firebase/client";
import { Notice, inputStyles } from "@/components/portal/ui";

function authMessage(code: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Incorrect username/email or password.";
    case "auth/user-disabled":
      return "This account has been deactivated. Contact an admin.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.";
    case "auth/unauthorized-domain":
      return "Google sign-in isn't enabled for this web address yet (Firebase → Authentication → Authorized domains).";
    case "auth/operation-not-allowed":
      return "Google sign-in isn't enabled in Firebase Authentication.";
    case "portal/no-account":
      return "There's no DuoGen account for that Google email. Ask an admin to add you, then try again.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

/** Accepts an email, or a username that the server resolves to an email. */
async function resolveEmail(identifier: string) {
  const value = identifier.trim();
  if (value.includes("@")) return value;
  const response = await fetch("/api/portal/resolve-login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: value }),
  });
  if (response.status === 429) throw Object.assign(new Error(), { code: "auth/too-many-requests" });
  if (!response.ok) throw Object.assign(new Error(), { code: "auth/invalid-credential" });
  return ((await response.json()) as { email: string }).email;
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next")?.startsWith("/portal") ? params.get("next")! : "/portal";
  const [mode, setMode] = useState<"signin" | "reset">("signin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const [checkingGoogle, setCheckingGoogle] = useState(false);

  // Already signed in? Go straight to the portal (but not mid Google check).
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(getAuth(firebaseApp()), (user) => {
      if (user && !checkingGoogle) router.replace(next);
    });
  }, [router, next, checkingGoogle]);

  /**
   * Google sign-in for existing team members only. Admin-created accounts have
   * a verified email, so Firebase attaches Google to that same account. Anyone
   * without a portal profile is signed out, and an account Google sign-in just
   * created for them is deleted again.
   */
  async function onGoogle() {
    setBusy(true);
    setError("");
    setCheckingGoogle(true);
    const auth = getAuth(firebaseApp());
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const profile = await getDoc(doc(getFirestore(firebaseApp()), "users", result.user.uid)).catch(() => null);
      if (!profile?.exists()) {
        if (getAdditionalUserInfo(result)?.isNewUser) await deleteUser(result.user).catch(() => {});
        await signOut(auth);
        throw Object.assign(new Error(), { code: "portal/no-account" });
      }
      router.replace(next);
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") setError(authMessage(code));
      setBusy(false);
    } finally {
      setCheckingGoogle(false);
    }
  }

  async function onSignIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const email = await resolveEmail(identifier);
      await signInWithEmailAndPassword(getAuth(firebaseApp()), email, password);
      router.replace(next);
    } catch (err) {
      setError(authMessage((err as { code?: string }).code ?? ""));
      setBusy(false);
    }
  }

  async function onReset(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const email = await resolveEmail(identifier).catch(() => "");
      // Always report success so the form can't be used to discover accounts.
      if (email) await sendPasswordResetEmail(getAuth(firebaseApp()), email).catch(() => {});
      setSent(true);
    } finally {
      setBusy(false);
    }
  }

  if (!isFirebaseConfigured) return <Notice>Sign-in isn&apos;t configured on this deployment yet.</Notice>;

  return (
    <form
      onSubmit={mode === "signin" ? onSignIn : onReset}
      className="flex w-full max-w-sm flex-col gap-5 rounded-[2rem] border border-line bg-white p-7 shadow-[0_30px_60px_-34px_rgb(17_19_38/0.35)] sm:p-9"
    >
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {mode === "signin" ? "Sign in" : "Reset password"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {mode === "signin"
            ? "DuoGen team portal."
            : "Enter your email or username and we'll email you a link to set a new password."}
        </p>
      </div>

      {error && <Notice>{error}</Notice>}
      {sent && mode === "reset" && (
        <Notice tone="success">If an account matches, a reset link is on its way. Check your inbox and spam folder.</Notice>
      )}

      {mode === "signin" && (
        <>
          <button
            type="button"
            onClick={onGoogle}
            disabled={busy}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-line bg-white font-medium text-ink transition-colors hover:border-ink/40 hover:bg-lilac disabled:opacity-70"
          >
            <svg viewBox="0 0 48 48" aria-hidden className="size-5">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 text-xs text-muted" aria-hidden>
            <span className="h-px flex-1 bg-line" /> or use your username <span className="h-px flex-1 bg-line" />
          </div>
        </>
      )}

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email or username
        <input
          required
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={inputStyles}
        />
      </label>

      {mode === "signin" && (
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Password
          <span className="relative">
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputStyles} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-lilac"
            >
              {show ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
            </button>
          </span>
        </label>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink font-medium text-white hover:bg-navy disabled:opacity-70"
      >
        {busy && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
        {mode === "signin" ? "Sign in" : "Email me a reset link"}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "reset" : "signin");
          setError("");
          setSent(false);
        }}
        className="text-sm font-medium text-ink/70 underline-offset-4 hover:text-ink hover:underline"
      >
        {mode === "signin" ? "Forgot password?" : "Back to sign in"}
      </button>

      <Link href="/" className="inline-flex items-center justify-center gap-1.5 text-xs text-muted hover:text-ink">
        <ArrowLeft aria-hidden className="size-3.5" /> Back to website
      </Link>
    </form>
  );
}
