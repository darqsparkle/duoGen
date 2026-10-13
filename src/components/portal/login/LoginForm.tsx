"use client";

import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
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

  // Already signed in? Go straight to the portal.
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(getAuth(firebaseApp()), (user) => {
      if (user) router.replace(next);
    });
  }, [router, next]);

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
