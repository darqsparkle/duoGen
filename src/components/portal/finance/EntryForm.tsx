"use client";

import { addDoc, collection, doc, getFirestore, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { firebaseApp } from "@/lib/firebase/client";
import { CATEGORIES, ENTRY_STATUSES, PAYMENT_METHODS, type EntryType, type FinanceEntry } from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { usePortal } from "../PortalProvider";
import { buttonStyles, Field, inputStyles, Modal, Notice } from "../ui";

const toInputDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type Draft = {
  type: EntryType;
  amount: string;
  date: string;
  category: string;
  description: string;
  party: string;
  paymentMethod: string;
  reference: string;
  status: "completed" | "pending";
  notes: string;
};

/** Add or edit an income/expense entry. Firestore rules re-validate every field. */
export function EntryForm({ entry, onClose }: { entry?: FinanceEntry; onClose: () => void }) {
  const { user } = usePortal();
  const [draft, setDraft] = useState<Draft>(() =>
    entry
      ? { ...entry, amount: String(entry.amount), date: toInputDate(entry.date) }
      : {
          type: "expense",
          amount: "",
          date: toInputDate(new Date()),
          category: "",
          description: "",
          party: "",
          paymentMethod: "Bank transfer",
          reference: "",
          status: "completed",
          notes: "",
        },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  function validate() {
    const next: typeof errors = {};
    const amount = Number(draft.amount);
    if (!Number.isFinite(amount) || amount <= 0) next.amount = "Enter an amount greater than 0.";
    else if (amount > 1_000_000_000) next.amount = "That amount looks too large.";
    if (!draft.date) next.date = "Pick a date.";
    if (!draft.category) next.category = "Choose a category.";
    if (draft.description.trim().length < 2) next.description = "Describe the reason (at least 2 characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user || !validate()) return;
    setBusy(true);
    setFailure("");
    const [y, m, d] = draft.date.split("-").map(Number);
    const fields = {
      type: draft.type,
      amount: Math.round(Number(draft.amount) * 100) / 100,
      category: draft.category,
      date: Timestamp.fromDate(new Date(y, m - 1, d, 12)),
      description: draft.description.trim(),
      party: draft.party.trim(),
      paymentMethod: draft.paymentMethod,
      reference: draft.reference.trim(),
      status: draft.status,
      notes: draft.notes.trim(),
      updatedBy: user.uid,
      updatedAt: serverTimestamp(),
    };
    try {
      const db = getFirestore(firebaseApp());
      if (entry) await updateDoc(doc(db, "finance", entry.id), fields);
      else await addDoc(collection(db, "finance"), { ...fields, createdBy: user.uid, createdAt: serverTimestamp() });
      onClose();
    } catch (error) {
      console.error("[finance] save failed", error);
      setFailure("Couldn't save this entry. Check the fields and try again.");
      setBusy(false);
    }
  }

  return (
    <Modal title={entry ? "Edit entry" : "Add income or expense"} onClose={onClose} wide>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {failure && <Notice>{failure}</Notice>}

        <div role="radiogroup" aria-label="Type" className="grid grid-cols-2 gap-2">
          {(["income", "expense"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={draft.type === t}
              onClick={() => setDraft((d) => ({ ...d, type: t, category: d.type === t ? d.category : "" }))}
              className={cn(
                "min-h-11 rounded-xl border text-sm font-semibold capitalize",
                draft.type === t
                  ? t === "income"
                    ? "border-[#1baf7a] bg-[#1baf7a]/10 text-[#0b7a4b]"
                    : "border-[#eb6834] bg-[#eb6834]/10 text-[#b4471a]"
                  : "border-line hover:border-ink/30",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount (₹) *" error={errors.amount}>
            <input
              inputMode="decimal"
              value={draft.amount}
              onChange={(e) => set("amount", e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="0"
              className={inputStyles}
            />
          </Field>
          <Field label="Date *" error={errors.date}>
            <input type="date" value={draft.date} onChange={(e) => set("date", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Category *" error={errors.category}>
            <select value={draft.category} onChange={(e) => set("category", e.target.value)} className={inputStyles}>
              <option value="">Choose…</option>
              {CATEGORIES[draft.type].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label={draft.type === "income" ? "Received from" : "Paid to"}>
            <input
              value={draft.party}
              onChange={(e) => set("party", e.target.value)}
              maxLength={120}
              placeholder={draft.type === "income" ? "Client or source" : "Vendor or person"}
              className={inputStyles}
            />
          </Field>
          <Field label="Reason / description *" error={errors.description} className="sm:col-span-2">
            <input
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={500}
              placeholder="e.g. Website project — second milestone"
              className={inputStyles}
            />
          </Field>
          <Field label="Payment method">
            <select value={draft.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} className={inputStyles}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="Reference / invoice no.">
            <input value={draft.reference} onChange={(e) => set("reference", e.target.value)} maxLength={80} className={inputStyles} />
          </Field>
          <Field label="Status">
            <select value={draft.status} onChange={(e) => set("status", e.target.value as Draft["status"])} className={inputStyles}>
              {ENTRY_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "completed" ? "Completed" : "Pending"}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Notes" className="sm:col-span-2">
            <textarea
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
              maxLength={2000}
              rows={3}
              className={inputStyles}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={buttonStyles.secondary}>
            Cancel
          </button>
          <button type="submit" disabled={busy} className={buttonStyles.primary}>
            {busy && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
            {entry ? "Save changes" : "Add entry"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
