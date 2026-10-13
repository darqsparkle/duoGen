"use client";

import {
  collection,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type QueryConstraint,
  type Timestamp,
} from "firebase/firestore";
import { Download, LoaderCircle, Mail, Phone, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ENQUIRIES, firebaseApp } from "@/lib/firebase/client";
import { ENQUIRY_STATUSES as STATUSES, type EnquiryStatus } from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { RoleGate } from "../PortalShell";
import { buttonStyles, inputStyles, NoAccess, Notice, PageHeader } from "../ui";

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

const statusStyle: Record<EnquiryStatus, string> = {
  new: "bg-glow/20 text-[#0b7a4b] border-glow/60",
  contacted: "bg-lavender text-[#3b4bb8] border-[#b8beff]",
  closed: "bg-line/60 text-muted border-line",
};

function formatDate(ts: Timestamp | null) {
  if (!ts) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(ts.toDate());
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

/** Contact-page enquiries for admins and managers, live. */
export function EnquiriesScreen() {
  const [rows, setRows] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EnquiryStatus | "all">("all");
  const [counts, setCounts] = useState<Record<EnquiryStatus | "all", number>>({ all: 0, new: 0, contacted: 0, closed: 0 });

  // Status filter runs in Firestore (uses the (status, createdAt) index).
  useEffect(() => {
    const constraints: QueryConstraint[] = [];
    if (filter !== "all") constraints.push(where("status", "==", filter));
    constraints.push(orderBy("createdAt", "desc"), limit(500));
    return onSnapshot(
      query(collection(getFirestore(firebaseApp()), ENQUIRIES), ...constraints),
      (snapshot) => {
        setError("");
        setRows(
          snapshot.docs.map((d) => {
            const data = d.data() as Omit<Enquiry, "id">;
            return { ...data, id: d.id, services: Array.isArray(data.services) ? data.services : [] };
          }),
        );
      },
      (err) => {
        console.error("[enquiries]", err);
        setError(err.code === "failed-precondition" ? "A database index is still building. Try again in a few minutes." : "Couldn't load enquiries.");
        setRows([]);
      },
    );
  }, [filter]);

  // Counts for the filter chips, from an unfiltered listener.
  useEffect(() => {
    return onSnapshot(
      query(collection(getFirestore(firebaseApp()), ENQUIRIES), orderBy("createdAt", "desc"), limit(500)),
      (snapshot) => {
        const next = { all: snapshot.size, new: 0, contacted: 0, closed: 0 };
        snapshot.docs.forEach((d) => {
          const s = d.data().status as EnquiryStatus;
          if (s in next) next[s]++;
        });
        setCounts(next);
      },
      () => {},
    );
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (rows ?? []).filter(
      (e) =>
        !term ||
        [e.fullName, e.email, e.company, e.phone, e.industry, e.description, e.services.join(" ")].join(" ").toLowerCase().includes(term),
    );
  }, [rows, search]);

  async function setStatus(id: string, status: EnquiryStatus) {
    try {
      await updateDoc(doc(getFirestore(firebaseApp()), ENQUIRIES, id), { status });
    } catch (err) {
      console.error("[enquiries] status update failed", err);
    }
  }

  function exportCsv() {
    const url = URL.createObjectURL(new Blob([toCsv(visible)], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `duogen-enquiries-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <RoleGate roles={["admin", "manager"]} fallback={<NoAccess />}>
      <PageHeader
        title="Enquiries"
        description="Project enquiries from the website contact form. Updates live."
        actions={
          <button type="button" onClick={exportCsv} disabled={!visible.length} className={buttonStyles.primary}>
            <Download aria-hidden className="size-4" /> Export CSV
          </button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search enquiries</span>
          <Search aria-hidden className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company, message…"
            className={`${inputStyles} pl-9`}
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
                "min-h-9 rounded-full border px-3.5 text-sm capitalize",
                filter === s ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40",
              )}
            >
              {s} <span className="opacity-60">({counts[s]})</span>
            </button>
          ))}
        </div>
      </div>

      {error && <Notice>{error}</Notice>}
      {rows === null ? (
        <p className="flex items-center gap-2 text-sm text-muted">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading enquiries…
        </p>
      ) : visible.length === 0 ? (
        <p className="rounded-[1.5rem] border border-dashed border-line bg-white p-10 text-center text-muted">
          {rows.length === 0 ? "No enquiries here yet." : "No enquiries match your search."}
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
    </RoleGate>
  );
}
