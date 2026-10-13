"use client";

import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { Download, LoaderCircle, Pencil, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { firebaseApp } from "@/lib/firebase/client";
import { CATEGORIES, inr, type EntryType, type FinanceEntry } from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { categoryColor } from "../charts/CategoryDonut";
import { buttonStyles, Card, inputStyles, Notice } from "../ui";
import { periodStart, useFinanceEntries, type Period } from "./data";
import { useProjects } from "../projects/data";

function csv(rows: FinanceEntry[]) {
  const head = ["Date", "Type", "Amount", "Category", "Description", "Party", "Payment method", "Reference", "Status", "Notes"];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return [
    head.map(esc).join(","),
    ...rows.map((r) =>
      [r.date.toISOString().slice(0, 10), r.type, String(r.amount), r.category, r.description, r.party, r.paymentMethod, r.reference, r.status, r.notes]
        .map(esc)
        .join(","),
    ),
  ].join("\n");
}

/** Searchable, filterable list of entries for the selected period. */
export function Ledger({ period, onEdit }: { period: Period; onEdit: (entry: FinanceEntry) => void }) {
  const [type, setType] = useState<EntryType | "all">("all");
  const [category, setCategory] = useState("");
  const [projectId, setProjectId] = useState("");
  const { projects } = useProjects();
  const projectName = useMemo(() => new Map((projects ?? []).map((p) => [p.id, p.name])), [projects]);
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const start = useMemo(() => periodStart(period), [period]);
  const { entries, error } = useFinanceEntries({ start, type, category, projectId });

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (entries ?? []).filter(
      (e) =>
        (!projectId || type === "all" || e.type === type) &&
        (!projectId || !category || e.category === category) &&
        (!term || [e.description, e.party, e.reference, e.category, e.notes].join(" ").toLowerCase().includes(term)),
    );
  }, [entries, search, projectId, type, category]);

  async function remove(id: string) {
    try {
      await deleteDoc(doc(getFirestore(firebaseApp()), "finance", id));
    } catch (err) {
      console.error("[finance] delete failed", err);
    } finally {
      setConfirmId(null);
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([csv(rows)], { type: "text/csv;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `duogen-finance-${period}.csv` });
    a.click();
    URL.revokeObjectURL(url);
  }

  const categories = type === "all" ? [...CATEGORIES.income, ...CATEGORIES.expense] : CATEGORIES[type];

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="font-display text-lg font-semibold">Transactions</h2>
        <button type="button" onClick={download} disabled={!rows.length} className={buttonStyles.secondary}>
          <Download aria-hidden className="size-4" /> Export CSV
        </button>
      </div>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative">
          <span className="sr-only">Search transactions</span>
          <Search aria-hidden className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description, party, reference…"
            className={`${inputStyles} pl-9`}
          />
        </label>
        <select
          aria-label="Type"
          value={type}
          onChange={(e) => {
            setType(e.target.value as EntryType | "all");
            setCategory("");
          }}
          className={inputStyles}
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>
        <select
          aria-label="Project"
          value={projectId}
          onChange={(e) => {
            setProjectId(e.target.value);
            setCategory("");
          }}
          className={inputStyles}
        >
          <option value="">All projects</option>
          {(projects ?? []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputStyles}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {error && <Notice>{error}</Notice>}
      {!entries ? (
        <p className="flex items-center gap-2 text-sm text-muted">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading…
        </p>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">
          No transactions here yet. Use “Add entry” to record income or an expense.
        </p>
      ) : (
        <div className="-mx-5 overflow-x-auto sm:-mx-6">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium sm:px-6">Date</th>
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 font-medium">Category</th>
                <th className="py-2 font-medium">Party</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 text-right font-medium">Amount</th>
                <th className="px-5 py-2 sm:px-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.id} className="border-b border-line/60 align-top">
                  <td className="px-5 py-3 whitespace-nowrap text-muted sm:px-6">
                    {e.date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="max-w-[16rem] py-3 pr-3">
                    <p className="font-medium text-ink">{e.description}</p>
                    {e.projectId && (
                      <span className="mt-0.5 inline-flex rounded-full bg-lavender px-2 py-0.5 text-[0.7rem] font-semibold text-[#3b4bb8]">
                        {projectName.get(e.projectId) ?? "Deleted project"}
                      </span>
                    )}
                    {(e.reference || e.paymentMethod) && (
                      <p className="text-xs text-muted">{[e.paymentMethod, e.reference].filter(Boolean).join(" · ")}</p>
                    )}
                  </td>
                  <td className="py-3 pr-3">
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span aria-hidden className="size-2 rounded-sm" style={{ background: categoryColor(e.type, e.category) }} />
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3 pr-3 text-ink/80">{e.party || "—"}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        e.status === "pending" ? "bg-[#fff4d6] text-[#8a5a00]" : "bg-lilac text-ink/70",
                      )}
                    >
                      {e.status === "pending" ? "Pending" : "Completed"}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "py-3 text-right font-semibold whitespace-nowrap tabular-nums",
                      e.type === "income" ? "text-[#0b7a4b]" : "text-ink",
                    )}
                  >
                    {e.type === "income" ? "+" : "−"}
                    {inr.format(e.amount)}
                  </td>
                  <td className="px-5 py-2 sm:px-6">
                    <div className="flex justify-end gap-1">
                      {confirmId === e.id ? (
                        <>
                          <button type="button" onClick={() => remove(e.id)} className={`${buttonStyles.danger} min-h-8 px-3 text-xs`}>
                            Delete
                          </button>
                          <button type="button" onClick={() => setConfirmId(null)} className={`${buttonStyles.secondary} min-h-8 px-3 text-xs`}>
                            Keep
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onEdit(e)}
                            aria-label={`Edit ${e.description}`}
                            className="inline-flex size-8 items-center justify-center rounded-full hover:bg-lilac"
                          >
                            <Pencil aria-hidden className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(e.id)}
                            aria-label={`Delete ${e.description}`}
                            className="inline-flex size-8 items-center justify-center rounded-full text-[#b42318] hover:bg-[#fef3f2]"
                          >
                            <Trash2 aria-hidden className="size-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
