"use client";

import { LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { inr } from "@/lib/portal/model";
import { CategoryDonut } from "../charts/CategoryDonut";
import { MonthlyBars } from "../charts/MonthlyBars";
import { Card, Notice, StatTile } from "../ui";
import { categoryTotals, chartStart, incomeByProject, monthlySeries, periodStart, PERIODS, totals, useFinanceEntries, type Period } from "./data";
import { useProjects } from "../projects/data";
import { SERIES } from "../charts/MonthlyBars";

/** KPIs, monthly growth bars, and category donuts for a period. */
export function FinanceSummary({ period }: { period: Period }) {
  const from = useMemo(() => chartStart(period), [period]);
  const { entries, error } = useFinanceEntries({ start: from });
  const start = useMemo(() => periodStart(period), [period]);
  const label = PERIODS.find((p) => p.id === period)!.label.toLowerCase();

  const inPeriod = useMemo(
    () => (entries ?? []).filter((e) => !start || e.date >= start),
    [entries, start],
  );
  const kpi = totals(inPeriod);
  const monthly = useMemo(() => monthlySeries(entries ?? [], from), [entries, from]);
  const { projects } = useProjects();
  const byProject = useMemo(() => incomeByProject(inPeriod), [inPeriod]);
  const projectName = useMemo(() => new Map((projects ?? []).map((p) => [p.id, p.name])), [projects]);

  if (error) return <Notice>{error}</Notice>;
  if (!entries) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading finance data…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Income" value={inr.format(kpi.income)} hint={label} />
        <StatTile label="Expenses" value={inr.format(kpi.expense)} hint={label} />
        <StatTile
          label="Net profit"
          value={inr.format(kpi.net)}
          tone={kpi.net >= 0 ? "good" : "bad"}
          hint={kpi.net >= 0 ? "Income above expenses" : "Expenses above income"}
        />
        <StatTile
          label="Profit margin"
          value={kpi.margin === null ? "—" : `${kpi.margin.toFixed(1)}%`}
          hint={kpi.pending ? `${inr.format(kpi.pending)} pending` : "No pending entries"}
        />
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold">Monthly income vs expenses</h2>
        <p className="mb-4 text-xs text-muted">Company growth month by month. Hover a month for details.</p>
        <MonthlyBars data={monthly} />
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-display text-lg font-semibold">Expenses by category</h2>
          <CategoryDonut type="expense" totals={categoryTotals(inPeriod, "expense")} />
        </Card>
        <Card>
          <h2 className="mb-4 font-display text-lg font-semibold">Income by category</h2>
          <CategoryDonut type="income" totals={categoryTotals(inPeriod, "income")} />
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold">Income by project</h2>
        <p className="mb-4 text-xs text-muted">Income tagged to a project in this period.</p>
        {byProject.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No project-tagged income in this period.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {byProject.map(([id, amount]) => (
              <li key={id} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[minmax(0,14rem)_1fr_auto]">
                <span className="truncate text-ink/85">{projectName.get(id) ?? "Deleted project"}</span>
                <span className="h-3 rounded-r-[4px] bg-lilac">
                  <span
                    className="block h-full rounded-r-[4px]"
                    style={{ width: `${(amount / byProject[0][1]) * 100}%`, background: SERIES.income.color }}
                  />
                </span>
                <span className="font-medium tabular-nums">{inr.format(amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
