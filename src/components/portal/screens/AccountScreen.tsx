"use client";

import { EmailAuthProvider, getAuth, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { LoaderCircle, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { firebaseApp } from "@/lib/firebase/client";
import { ROLE_LABEL } from "@/lib/portal/model";
import { usePortal } from "../PortalProvider";
import { buttonStyles, Card, Field, inputStyles, Notice, PageHeader } from "../ui";

/** Your profile (read-only — admins manage it) and password change. */
export function AccountScreen() {
  const { profile, user } = usePortal();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  if (!profile || !user) return null;

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (next.length < 8 || !/[A-Za-z]/.test(next) || !/\d/.test(next)) {
      return setMessage({ tone: "error", text: "Use at least 8 characters with a letter and a number." });
    }
    if (next !== confirm) return setMessage({ tone: "error", text: "The new passwords don't match." });
    if (!user?.email) return;
    setBusy(true);
    try {
      // Firebase requires a recent sign-in to change a password.
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, current));
      await updatePassword(user, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setMessage({ tone: "success", text: "Password updated." });
    } catch (error) {
      const code = (error as { code?: string }).code;
      setMessage({
        tone: "error",
        text:
          code === "auth/invalid-credential" || code === "auth/wrong-password"
            ? "Your current password is incorrect."
            : code === "auth/too-many-requests"
              ? "Too many attempts. Try again in a few minutes."
              : "Couldn't update the password. Try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function emailLink() {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(getAuth(firebaseApp()), user.email);
      setMessage({ tone: "success", text: `A password reset link was sent to ${user.email}.` });
    } catch {
      setMessage({ tone: "error", text: "Couldn't send the email. Try again later." });
    }
  }

  const details: [string, string][] = [
    ["Name", profile.name],
    ["Username", `@${profile.username}`],
    ["Email", profile.email],
    ["Designation", profile.tagline],
    ["Role", ROLE_LABEL[profile.role]],
    ["Sex", profile.sex],
  ];

  return (
    <>
      <PageHeader title="My account" description="Your details are managed by an admin. You can change your password here." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-display text-lg font-semibold">Profile</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs text-muted">{label}</dt>
                <dd className="font-medium break-all">{value}</dd>
              </div>
            ))}
          </dl>
          {profile.role !== "admin" && (
            <p className="mt-4 text-xs text-muted">To change your name, role or designation, ask an admin.</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 font-display text-lg font-semibold">Change password</h2>
          <form onSubmit={changePassword} className="flex flex-col gap-3">
            {message && <Notice tone={message.tone}>{message.text}</Notice>}
            <Field label="Current password">
              <input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputStyles} />
            </Field>
            <Field label="New password" hint="At least 8 characters with a letter and a number.">
              <input type="password" required autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={inputStyles} />
            </Field>
            <Field label="Confirm new password">
              <input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputStyles} />
            </Field>
            <div className="flex flex-wrap gap-2 pt-1">
              <button type="submit" disabled={busy} className={buttonStyles.primary}>
                {busy && <LoaderCircle aria-hidden className="size-4 animate-spin" />} Update password
              </button>
              <button type="button" onClick={emailLink} className={buttonStyles.secondary}>
                <Mail aria-hidden className="size-4" /> Email me a reset link instead
              </button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
