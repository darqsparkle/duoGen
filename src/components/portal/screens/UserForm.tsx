"use client";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Eye, EyeOff, LoaderCircle, Mail, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { firebaseApp } from "@/lib/firebase/client";
import {
  ROLE_LABEL,
  ROLES,
  SEXES,
  TAGLINE_SUGGESTIONS,
  validateUserInput,
  type UserInput,
  type UserProfile,
} from "@/lib/portal/model";
import { usePortal } from "../PortalProvider";
import { buttonStyles, Field, inputStyles, Modal, Notice } from "../ui";

/** Create or edit a portal user. All writes go through the admin-only API. */
export function UserForm({ user, onClose }: { user?: UserProfile; onClose: () => void }) {
  const { api, profile: me } = usePortal();
  const isSelf = user?.uid === me?.uid;
  const [values, setValues] = useState<UserInput>(() =>
    user
      ? { name: user.name, username: user.username, email: user.email, sex: user.sex, role: user.role, tagline: user.tagline, password: "", active: user.active }
      : { name: "", username: "", email: "", sex: "", role: "employee", tagline: "", password: "", active: true },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof UserInput, string>>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof UserInput>(key: K, value: UserInput[K]) => setValues((v) => ({ ...v, [key]: value }));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const local = validateUserInput(values, !user);
    setErrors(local);
    if (Object.keys(local).length) return;
    setBusy(true);
    setMessage(null);
    const response = await api(user ? `/api/portal/users/${user.uid}` : "/api/portal/users", {
      method: user ? "PATCH" : "POST",
      body: JSON.stringify({ ...values, password: values.password || undefined }),
    }).catch(() => null);
    const data = response ? await response.json().catch(() => ({})) : {};
    setBusy(false);
    if (response?.ok) return onClose();
    setErrors(data.errors ?? (data.field ? { [data.field]: data.error } : {}));
    setMessage({ tone: "error", text: data.error ?? "Couldn't reach the server. Try again." });
  }

  async function sendReset() {
    if (!user) return;
    try {
      await sendPasswordResetEmail(getAuth(firebaseApp()), user.email);
      setMessage({ tone: "success", text: `Password reset link sent to ${user.email}.` });
    } catch {
      setMessage({ tone: "error", text: "Couldn't send the reset email. Try again later." });
    }
  }

  async function remove() {
    if (!user) return;
    setBusy(true);
    const response = await api(`/api/portal/users/${user.uid}`, { method: "DELETE" }).catch(() => null);
    setBusy(false);
    if (response?.ok) return onClose();
    const data = response ? await response.json().catch(() => ({})) : {};
    setMessage({ tone: "error", text: data.error ?? "Couldn't delete this user." });
    setConfirmDelete(false);
  }

  return (
    <Modal title={user ? `Edit ${user.name}` : "Add a team member"} onClose={onClose} wide>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {message && <Notice tone={message.tone}>{message.text}</Notice>}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name *" error={errors.name}>
            <input value={values.name} onChange={(e) => set("name", e.target.value)} autoComplete="off" className={inputStyles} />
          </Field>
          <Field label="Username *" error={errors.username} hint="Unique, e.g. priya.sharma — can be used to sign in.">
            <input
              value={values.username}
              onChange={(e) => set("username", e.target.value.toLowerCase().replace(/\s/g, ""))}
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              className={inputStyles}
            />
          </Field>
          <Field label="Email *" error={errors.email}>
            <input type="email" value={values.email} onChange={(e) => set("email", e.target.value)} autoComplete="off" className={inputStyles} />
          </Field>
          <Field label="Sex *" error={errors.sex}>
            <select value={values.sex} onChange={(e) => set("sex", e.target.value)} className={inputStyles}>
              <option value="">Choose…</option>
              {SEXES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Role *" error={errors.role} hint={isSelf ? "You can't change your own role." : undefined}>
            <select value={values.role} onChange={(e) => set("role", e.target.value)} disabled={isSelf} className={inputStyles}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Designation (tagline) *" error={errors.tagline} hint="e.g. Founder, Lead Engineer">
            <input
              list="tagline-suggestions"
              value={values.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              className={inputStyles}
            />
            <datalist id="tagline-suggestions">
              {TAGLINE_SUGGESTIONS.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field
            label={user ? "Set a new password" : "Password *"}
            error={errors.password}
            hint={user ? "Leave empty to keep the current password." : "At least 8 characters with a letter and a number."}
            className="sm:col-span-2"
          >
            <span className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={(e) => set("password", e.target.value)}
                autoComplete="new-password"
                className={`${inputStyles} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-lilac"
              >
                {showPassword ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
              </button>
            </span>
          </Field>
          {user && (
            <label className="flex items-center gap-3 text-sm font-medium sm:col-span-2">
              <input
                type="checkbox"
                checked={values.active !== false}
                disabled={isSelf}
                onChange={(e) => set("active", e.target.checked)}
                className="size-5 accent-ink"
              />
              Account active
              <span className="font-normal text-muted">— inactive users are signed out and can&apos;t sign in.</span>
            </label>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {user && (
              <button type="button" onClick={sendReset} className={buttonStyles.secondary}>
                <Mail aria-hidden className="size-4" /> Email reset link
              </button>
            )}
            {user && !isSelf &&
              (confirmDelete ? (
                <button type="button" onClick={remove} disabled={busy} className={buttonStyles.danger}>
                  Confirm delete
                </button>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className={buttonStyles.danger}>
                  <Trash2 aria-hidden className="size-4" /> Delete user
                </button>
              ))}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className={buttonStyles.secondary}>
              Cancel
            </button>
            <button type="submit" disabled={busy} className={buttonStyles.primary}>
              {busy && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
              {user ? "Save changes" : "Create user"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
