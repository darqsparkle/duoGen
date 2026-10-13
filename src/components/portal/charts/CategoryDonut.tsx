"use client";

import { useState } from "react";
import { inr, type EntryType } from "@/lib/portal/model";
import { cn } from "@/lib/cn";

// Validated categorical slots (dataviz validator, light surface, adjacent pairs).
// Colour follows the category, never its rank, so slices keep their colour
// whatever the period. Categories without a slot fold into "Other" (grey).
const SLOTS = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#6250d6"];
const OTHER = "#A3A6B8";
const SLOT_FOR: Record<EntryType, string[]> = {
  expense: ["Salaries", "Rent", "Software & tools", "Marketing", "Hardware", "Travel"],
  income: ["Client payment", "Project advance", "Retainer", "Product sales", "Investment"],
};

export function categoryColor(type: EntryType, category: string) {
  const i = SLOT_FOR[type].indexOf(category);
  return i >= 0 ? SLOTS[i] : OTHER;
}

type Slice = { label: string; value: number; color: string; parts?: { label: string; value: number }[] };

function arc(cx: number, cy: number, r: number, start: number, end: number) {
  const large = end - start > Math.PI ? 1 : 0;
  const p = (a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const [x1, y1] = p(start);
  const [x2, y2] = p(end);
  return `M${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2}`;
}

/** Donut of totals by category, with legend + values (doubles as the table view). */
export function CategoryDonut({
  type,
  totals,
}: {
  type: EntryType;
  totals: Record<string, number>;
}) {
  const [active, setActive] = useState<string | null>(null);

  // Slotted categories in fixed slot order, then everything else as "Other".
  const slices: Slice[] = [];
  const others: { label: string; value: number }[] = [];
  for (const label of SLOT_FOR[type]) if (totals[label] > 0) slices.push({ label, value: totals[label], color: categoryColor(type, label) });
  for (const [label, value] of Object.entries(totals)) if (value > 0 && !SLOT_FOR[type].includes(label)) others.push({ label, value });
  if (others.length) slices.push({ label: "Other", value: others.reduce((s, o) => s + o.value, 0), color: OTHER, parts: others });

  const total = slices.reduce((s, x) => s + x.value, 0);
  if (!total) {
    return <p className="py-12 text-center text-sm text-muted">No {type === "income" ? "income" : "expenses"} in this period.</p>;
  }

  const R = 80;
  const STROKE = 26;
  let angle = 0;
  const arcs = slices.map((s) => {
    const sweep = (s.value / total) * Math.PI * 2;
    const a = { ...s, start: angle, end: angle + sweep };
    angle += sweep;
    return a;
  });
  const shown = active ? slices.find((s) => s.label === active) : null;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
      <svg viewBox="0 0 200 200" className="size-44 shrink-0" role="img" aria-label={`${type === "income" ? "Income" : "Expenses"} by category`}>
        {arcs.length === 1 ? (
          <circle cx={100} cy={100} r={R} fill="none" stroke={arcs[0].color} strokeWidth={STROKE} />
        ) : (
          arcs.map((a) => (
            <path
              key={a.label}
              d={arc(100, 100, R, a.start, a.end)}
              fill="none"
              stroke={a.color}
              strokeWidth={active === a.label ? STROKE + 6 : STROKE}
              opacity={active && active !== a.label ? 0.35 : 1}
              onMouseEnter={() => setActive(a.label)}
              onMouseLeave={() => setActive(null)}
            />
          ))
        )}
        {/* 2px surface gaps between slices */}
        {arcs.length > 1 &&
          arcs.map((a) => {
            const x = 100 + (R + STROKE) * Math.sin(a.start);
            const y = 100 - (R + STROKE) * Math.cos(a.start);
            const xi = 100 + (R - STROKE) * Math.sin(a.start);
            const yi = 100 - (R - STROKE) * Math.cos(a.start);
            return <line key={`gap-${a.label}`} x1={xi} y1={yi} x2={x} y2={y} stroke="#fff" strokeWidth={2} />;
          })}
        <text x={100} y={94} textAnchor="middle" className="fill-muted text-[10px]">
          {shown ? shown.label : "Total"}
        </text>
        <text x={100} y={112} textAnchor="middle" className="fill-ink font-display text-[15px] font-semibold">
          {inr.format(shown ? shown.value : total)}
        </text>
      </svg>
      <ul className="flex w-full flex-col gap-1.5 text-sm">
        {slices.map((s) => (
          <li
            key={s.label}
            onMouseEnter={() => setActive(s.label)}
            onMouseLeave={() => setActive(null)}
            className={cn("rounded-lg px-2 py-1", active === s.label && "bg-lilac")}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden className="size-2.5 shrink-0 rounded-sm" style={{ background: s.color }} />
                <span className="truncate text-ink/85">{s.label}</span>
              </span>
              <span className="shrink-0 tabular-nums">
                <span className="font-medium">{inr.format(s.value)}</span>
                <span className="ml-2 text-xs text-muted">{Math.round((s.value / total) * 100)}%</span>
              </span>
            </div>
            {s.parts && (
              <p className="mt-0.5 pl-[18px] text-xs text-muted">
                {s.parts.map((p) => `${p.label} ${inr.format(p.value)}`).join(" · ")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
