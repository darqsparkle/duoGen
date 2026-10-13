"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import type { FinanceEntry } from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { EntryForm } from "../finance/EntryForm";
import { FinanceSummary } from "../finance/FinanceSummary";
import { Ledger } from "../finance/Ledger";
import { PERIODS, type Period } from "../finance/data";
import { RoleGate } from "../PortalShell";
import { buttonStyles, NoAccess, PageHeader } from "../ui";

export function PeriodPicker({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div role="group" aria-label="Period" className="flex flex-wrap gap-2">
      {PERIODS.map((p) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={value === p.id}
          onClick={() => onChange(p.id)}
          className={cn(
            "min-h-9 rounded-full border px-3.5 text-sm",
            value === p.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40",
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export function FinanceScreen() {
  const [period, setPeriod] = useState<Period>("fy");
  const [editing, setEditing] = useState<FinanceEntry | "new" | null>(null);

  return (
    <RoleGate roles={["admin"]} fallback={<NoAccess />}>
      <PageHeader
        title="Finance"
        description="Income and expenses — visible to admins only."
        actions={
          <button type="button" onClick={() => setEditing("new")} className={buttonStyles.primary}>
            <Plus aria-hidden className="size-4" /> Add entry
          </button>
        }
      />
      <PeriodPicker value={period} onChange={setPeriod} />
      <FinanceSummary period={period} />
      <Ledger period={period} onEdit={setEditing} />
      {editing && <EntryForm entry={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
    </RoleGate>
  );
}
