"use client";

import { onAuthStateChanged, signInWithEmailAndPassword, signOut, getAuth, type User } from "firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { Download, Eye, EyeOff, LoaderCircle, LogOut, Mail, Phone, Search } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ENQUIRIES, firebaseApp, isFirebaseConfigured, type EnquiryStatus } from "@/lib/firebase/client";
import { cn } from "@/lib/cn";

type Enquiry = {
  id: string;
  fullName: string;
  email: string;
  company: string;
  phone: string;
  industry: string;
  services: string[];
  budget: string;
  description: string;
  contactMethod: string;
  status: EnquiryStatus;
  createdAt: Timestamp | null;
};

const STATUSES: EnquiryStatus[] = ["new", "contacted", "closed"];
const statusStyle: Record<EnquiryStatus, string> = {
  new: "bg-glow/20 text-[#0b7a4b] border-glow/60",
  contacted: "bg-lavender text-[#3b4bb8] border-[#b8beff]",
  closed: "bg-line/60 text-muted border-line",
};

function formatDate(ts: Timestamp | null) {
  if (!ts) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(ts.toDate());
}

function authMessage(code: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in isn't enabled in Firebase Authentication yet.";
    default:
      return "Sign-in failed. Please try again.";
  }
}

function toCsv(rows: Enquiry[]) {
  const header = ["Date", "Status", "Name", "Email", "Phone", "Company", "Industry", "Services", "Budget", "Contact method", "Description"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((e) =>
    [
      e.createdAt ? e.createdAt.toDate().toISOString() : "",
      e.status,
      e.fullName,
      e.email,
      e.phone,
      e.company,
      e.industry,
      e.services.join("; "),
      e.budget,
      e.contactMethod,
      e.description,
    ].map((v) => escape(String(v ?? ""))).join(","),
  );
  return [header.map(escape).join(","), ...lines].join("\n");
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(getAuth(firebaseApp()), email.trim(), password);
    } catch (err) {
      setError(authMessage((err as { code?: string }).code ?? ""));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-sm flex-col gap-5 rounded-[2rem] border border-line bg-white p-7 shadow-[0_30px_60px_-34px_rgb(17_19_38/0.35)] sm:p-9">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Admin sign-in</h1>
        <p className="mt-1 text-sm text-muted">View enquiries from the contact page.</p>
      </div>
      {error && (
        <p role="alert" className="rounded-2xl border border-[#b42318]/30 bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
          {error}
        </p>
      )}
      <label className="flex flex-col gap-2 text-sm font-medium">
        Email
        <input
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-2xl border border-line px-4 py-3 text-base font-normal focus:border-ink focus:ring-4 focus:ring-glow/50 focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Password
        <span className="relative">
          <input
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-line px-4 py-3 pr-12 text-base font-normal focus:border-ink focus:ring-4 focus:ring-glow/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-lilac"
          >
            {show ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
          </button>
        </span>
      </label>
      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink font-medium text-white hover:bg-navy disabled:opacity-70"
      >
        {busy && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
        Sign in
      </button>
    </form>
  );
}

function Enquiries({ user }: { user: User }) {
  const [rows, setRows] = useState<Enquiry[] | null>(null);
  const [denied, setDenied] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EnquiryStatus | "all">("all");

  useEffect(() => {
    const db = getFirestore(firebaseApp());
    const q = query(collection(db, ENQUIRIES), orderBy("createdAt", "desc"), limit(500));
    return onSnapshot(
      q,
      (snapshot) => {
        setDenied(false);
        setRows(
          snapshot.docs.map((d) => {
            const data = d.data() as Omit<Enquiry, "id">;
            return { ...data, id: d.id, services: Array.isArray(data.services) ? data.services : [] };
          }),
        );
      },
      (error) => {
        if (error.code === "permission-denied") setDenied(true);
        else console.error("[admin] enquiries listener", error);
      },
    );
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (rows ?? []).filter(
      (e) =>
        (filter === "all" || e.status === filter) &&
        (!term ||
          [e.fullName, e.email, e.company, e.phone, e.industry, e.description, e.services.join(" ")]
            .join(" ")
            .toLowerCase()
            .includes(term)),
    );
  }, [rows, search, filter]);

  async function setStatus(id: string, status: EnquiryStatus) {
    try {
      await updateDoc(doc(getFirestore(firebaseApp()), ENQUIRIES, id), { status });
    } catch (error) {
      console.error("[admin] status update failed", error);
    }
  }

  function exportCsv() {
    const blob = new Blob([toCsv(visible)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `duogen-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const counts = useMemo(() => {
    const all = rows ?? [];
    return {
      all: all.length,
      new: all.filter((e) => e.status === "new").length,
      contacted: all.filter((e) => e.status === "contacted").length,
      closed: all.filter((e) => e.status === "closed").length,
    };
  }, [rows]);

  const signOutButton = (
    <button
      type="button"
      onClick={() => signOut(getAuth(firebaseApp()))}
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40"
    >
      <LogOut aria-hidden className="size-4" /> Sign out
    </button>
  );

  if (denied) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-start gap-4 rounded-[2rem] border border-line bg-white p-8">
        <h1 className="font-display text-2xl font-semibold">No access</h1>
        <p className="text-muted">
          {user.email} is signed in but isn&apos;t allowed to view enquiries. Add this email to
          isAdmin() in the Firestore rules, or sign in with the admin account.
        </p>
        {signOutButton}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Enquiries</h1>
          <p className="mt-1 text-sm text-muted">Signed in as {user.email} · updates live</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={!visible.length}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-white hover:bg-navy disabled:opacity-40"
          >
            <Download aria-hidden className="size-4" /> Export CSV
          </button>
          {signOutButton}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search enquiries</span>
          <Search aria-hidden className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company, message…"
            className="w-full rounded-full border border-line bg-white py-3 pr-4 pl-11 text-base focus:border-ink focus:ring-4 focus:ring-glow/50 focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={filter === s}
              onClick={() => setFilter(s)}
              className={cn(
                "min-h-10 rounded-full border px-4 text-sm capitalize",
                filter === s ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40",
              )}
            >
              {s} <span className="opacity-60">({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {rows === null ? (
        <p className="flex items-center gap-2 text-muted">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading enquiries…
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-[1.75rem] border border-dashed border-line bg-white p-10 text-center text-muted">
          {rows.length === 0 ? "No enquiries yet. They'll appear here as soon as someone submits the contact form." : "No enquiries match your search."}
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {visible.map((e) => (
            <li key={e.id} className="rounded-[1.75rem] border border-line bg-white p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <p className="font-display text-xl font-semibold">
                    {e.fullName}
                    {e.company && <span className="font-normal text-muted"> · {e.company}</span>}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">{formatDate(e.createdAt)} · {e.industry}</p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <span className="sr-only">Status for {e.fullName}</span>
                  <select
                    value={e.status}
                    onChange={(ev) => setStatus(e.id, ev.target.value as EnquiryStatus)}
                    className={cn("rounded-full border px-3 py-1.5 font-medium capitalize", statusStyle[e.status] ?? statusStyle.new)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="mt-4 leading-relaxed whitespace-pre-line text-ink/85">{e.description}</p>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-muted">Email</dt>
                  <dd>
                    <a href={`mailto:${e.email}`} className="inline-flex items-center gap-1 font-medium break-all underline-offset-4 hover:underline">
                      <Mail aria-hidden className="size-3.5 shrink-0" /> {e.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Phone</dt>
                  <dd>
                    {e.phone ? (
                      <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline">
                        <Phone aria-hidden className="size-3.5" /> {e.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Budget</dt>
                  <dd className="font-medium">{e.budget || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Preferred contact</dt>
                  <dd className="font-medium">{e.contactMethod || "—"}</dd>
                </div>
              </dl>

              {e.services.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {e.services.map((s) => (
                    <li key={s} className="rounded-full bg-lilac px-3 py-1 text-xs font-medium">
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Private enquiries dashboard. Data access is enforced by Firestore rules. */
export function AdminDashboard() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthStateChanged(getAuth(firebaseApp()), setUser);
  }, []);

  if (!isFirebaseConfigured) {
    return <p className="text-center text-muted">Firebase isn&apos;t configured. Add the NEXT_PUBLIC_FIREBASE_* variables.</p>;
  }
  if (user === undefined) {
    return (
      <p className="flex items-center justify-center gap-2 text-muted">
        <LoaderCircle aria-hidden className="size-4 animate-spin" /> Checking sign-in…
      </p>
    );
  }
  return user ? <Enquiries user={user} /> : <SignIn />;
}
