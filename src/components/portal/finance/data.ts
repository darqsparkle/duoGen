"use client";

import {
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseApp } from "@/lib/firebase/client";
import type { EntryType, FinanceEntry } from "@/lib/portal/model";
import type { MonthPoint } from "../charts/MonthlyBars";

export const PERIODS = [
  { id: "month", label: "This month" },
  { id: "3m", label: "Last 3 months" },
  { id: "fy", label: "This financial year" },
  { id: "12m", label: "Last 12 months" },
  { id: "all", label: "All time" },
] as const;
export type Period = (typeof PERIODS)[number]["id"];

const monthStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);

/** Start of the period (null = all time). Indian financial year runs April–March. */
export function periodStart(period: Period, now = new Date()): Date | null {
  switch (period) {
    case "month":
      return monthStart(now);
    case "3m":
      return addMonths(monthStart(now), -2);
    case "fy":
      return new Date(now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1, 3, 1);
    case "12m":
      return addMonths(monthStart(now), -11);
    case "all":
      return null;
  }
}

/** The growth chart always shows at least 6 months of context. */
export function chartStart(period: Period, now = new Date()) {
  const start = periodStart(period, now);
  const sixBack = addMonths(monthStart(now), -5);
  if (!start) return null;
  return start < sixBack ? start : sixBack;
}

function toEntry(id: string, data: Record<string, unknown>): FinanceEntry {
  return {
    id,
    projectId: String(data.projectId ?? ""),
    type: data.type as EntryType,
    amount: Number(data.amount) || 0,
    category: String(data.category ?? ""),
    date: data.date instanceof Timestamp ? data.date.toDate() : new Date(),
    description: String(data.description ?? ""),
    party: String(data.party ?? ""),
    paymentMethod: String(data.paymentMethod ?? ""),
    reference: String(data.reference ?? ""),
    status: data.status === "pending" ? "pending" : "completed",
    notes: String(data.notes ?? ""),
  };
}

/**
 * Live finance entries, newest first. Equality filters run in Firestore and use
 * the composite indexes in firestore.indexes.json:
 *   (type, date desc) · (category, date desc) · (projectId, date desc)
 */
export function useFinanceEntries({
  start,
  type,
  category,
  projectId,
}: {
  start: Date | null;
  type?: EntryType | "all";
  category?: string;
  projectId?: string;
}) {
  const [entries, setEntries] = useState<FinanceEntry[] | null>(null);
  const [error, setError] = useState("");
  const startMs = start?.getTime() ?? null;

  useEffect(() => {
    const constraints: QueryConstraint[] = [];
    if (projectId) constraints.push(where("projectId", "==", projectId));
    else if (category) constraints.push(where("category", "==", category));
    else if (type && type !== "all") constraints.push(where("type", "==", type));
    if (startMs !== null) constraints.push(where("date", ">=", Timestamp.fromMillis(startMs)));
    constraints.push(orderBy("date", "desc"), limit(5000));

    return onSnapshot(
      query(collection(getFirestore(firebaseApp()), "finance"), ...constraints),
      (snap) => {
        setError("");
        setEntries(snap.docs.map((d) => toEntry(d.id, d.data())));
      },
      (err) => {
        console.error("[finance]", err);
        setError(
          err.code === "failed-precondition"
            ? "A database index is still building. Try again in a few minutes."
            : err.code === "permission-denied"
              ? "You don't have access to finance data."
              : "Couldn't load finance data.",
        );
        setEntries([]);
      },
    );
  }, [startMs, type, category, projectId]);

  return { entries, error };
}

export function totals(entries: FinanceEntry[]) {
  let income = 0;
  let expense = 0;
  let pending = 0;
  for (const e of entries) {
    if (e.status === "pending") pending += e.amount;
    if (e.type === "income") income += e.amount;
    else expense += e.amount;
  }
  return { income, expense, net: income - expense, margin: income ? ((income - expense) / income) * 100 : null, pending };
}

export function categoryTotals(entries: FinanceEntry[], type: EntryType) {
  const out: Record<string, number> = {};
  for (const e of entries) if (e.type === type) out[e.category] = (out[e.category] ?? 0) + e.amount;
  return out;
}

/** Monthly buckets from `from` to this month (capped at 24 months). */
export function monthlySeries(entries: FinanceEntry[], from: Date | null, now = new Date()): MonthPoint[] {
  const last = monthStart(now);
  const earliest = entries.reduce<Date | null>((min, e) => (!min || e.date < min ? e.date : min), null);
  let first = monthStart(from ?? earliest ?? addMonths(last, -5));
  if (addMonths(first, 23) < last) first = addMonths(last, -23);
  if (addMonths(first, 5) > last) first = addMonths(last, -5);

  const points: MonthPoint[] = [];
  const index = new Map<string, MonthPoint>();
  for (let m = first; m <= last; m = addMonths(m, 1)) {
    const key = `${m.getFullYear()}-${m.getMonth()}`;
    const multiYear = first.getFullYear() !== last.getFullYear();
    const label = m.toLocaleString("en-IN", { month: "short", ...(multiYear ? { year: "2-digit" } : {}) });
    const point = { key, label, income: 0, expense: 0 };
    points.push(point);
    index.set(key, point);
  }
  for (const e of entries) {
    const point = index.get(`${e.date.getFullYear()}-${e.date.getMonth()}`);
    if (point) point[e.type] += e.amount;
  }
  return points;
}

/** Income per project (untagged income excluded), largest first. */
export function incomeByProject(entries: FinanceEntry[]) {
  const out = new Map<string, number>();
  for (const e of entries) if (e.type === "income" && e.projectId) out.set(e.projectId, (out.get(e.projectId) ?? 0) + e.amount);
  return [...out.entries()].sort((a, b) => b[1] - a[1]);
}
