"use client";

import { useState } from "react";
import { inr, inrCompact } from "@/lib/portal/model";
import { cn } from "@/lib/cn";

export type MonthPoint = { key: string; label: string; income: number; expense: number };

// Validated categorical pair (dataviz validator, light surface): income = aqua,
// expense = orange. Aqua is below 3:1 on white, so values are always available
// as text (tooltip + table view).
export const SERIES = {
  income: { label: "Income", color: "#1baf7a" },
  expense: { label: "Expenses", color: "#eb6834" },
} as const;

const W = 720;
const H = 280;
const PAD = { top: 16, right: 12, bottom: 32, left: 56 };

function niceMax(value: number) {
  if (value <= 0) return 1000;
  const exp = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * exp >= value / 4)! * exp;
  return Math.ceil(value / step) * step;
}

/** Bar with 4px rounded data-end, anchored square to the baseline. */
function barPath(x: number, y: number, w: number, h: number) {
  if (h <= 0) return "";
  const r = Math.min(4, w / 2, h);
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

/** Grouped bars: income vs expenses per month, with hover/focus tooltip. */
export function MonthlyBars({ data }: { data: MonthPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [table, setTable] = useState(false);

  const max = niceMax(Math.max(0, ...data.flatMap((d) => [d.income, d.expense])));
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const band = innerW / Math.max(data.length, 1);
  const barW = Math.min(22, (band - 10) / 2);
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  const point = active !== null ? data[active] : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex gap-4 text-xs text-ink/80" aria-label="Legend">
          {Object.values(SERIES).map((s) => (
            <li key={s.label} className="flex items-center gap-1.5">
              <span aria-hidden className="size-2.5 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setTable((t) => !t)}
          className="text-xs font-medium text-ink/70 underline-offset-4 hover:text-ink hover:underline"
        >
          {table ? "Show chart" : "Show as table"}
        </button>
      </div>

      {table ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted">
                <th className="py-2 font-medium">Month</th>
                <th className="py-2 text-right font-medium">Income</th>
                <th className="py-2 text-right font-medium">Expenses</th>
                <th className="py-2 text-right font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.key} className="border-b border-line/60">
                  <td className="py-2">{d.label}</td>
                  <td className="py-2 text-right tabular-nums">{inr.format(d.income)}</td>
                  <td className="py-2 text-right tabular-nums">{inr.format(d.expense)}</td>
                  <td className={cn("py-2 text-right font-medium tabular-nums", d.income - d.expense < 0 && "text-[#b42318]")}>
                    {inr.format(d.income - d.expense)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Monthly income and expenses bar chart">
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#DFE2EF" strokeWidth={1} />
                <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-muted text-[11px]">
                  {inrCompact.format(t)}
                </text>
              </g>
            ))}
            {data.map((d, i) => {
              const cx = PAD.left + band * i + band / 2;
              return (
                <g key={d.key}>
                  {active === i && (
                    <rect x={PAD.left + band * i} y={PAD.top} width={band} height={innerH} fill="#111326" opacity={0.04} />
                  )}
                  {/* 2px surface gap between the paired bars */}
                  <path d={barPath(cx - barW - 1, y(d.income), barW, y(0) - y(d.income))} fill={SERIES.income.color} />
                  <path d={barPath(cx + 1, y(d.expense), barW, y(0) - y(d.expense))} fill={SERIES.expense.color} />
                  <text x={cx} y={H - 10} textAnchor="middle" className="fill-muted text-[11px]">
                    {d.label}
                  </text>
                  {/* Hit target larger than the marks; also keyboard focusable */}
                  <rect
                    x={PAD.left + band * i}
                    y={PAD.top}
                    width={band}
                    height={innerH}
                    fill="transparent"
                    tabIndex={0}
                    aria-label={`${d.label}: income ${inr.format(d.income)}, expenses ${inr.format(d.expense)}`}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="outline-none focus-visible:stroke-ink"
                  />
                </g>
              );
            })}
            <line x1={PAD.left} x2={W - PAD.right} y1={y(0)} y2={y(0)} stroke="#666B80" strokeWidth={1} />
          </svg>
          {point && active !== null && (
            <div
              className="pointer-events-none absolute top-2 z-10 min-w-40 -translate-x-1/2 rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-lg"
              style={{ left: `${((PAD.left + band * active + band / 2) / W) * 100}%` }}
            >
              <p className="font-semibold text-ink">{point.label}</p>
              {(["income", "expense"] as const).map((k) => (
                <p key={k} className="mt-1 flex items-center justify-between gap-3 text-ink/80">
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="size-2 rounded-sm" style={{ background: SERIES[k].color }} />
                    {SERIES[k].label}
                  </span>
                  <span className="font-medium tabular-nums text-ink">{inr.format(point[k])}</span>
                </p>
              ))}
              <p className="mt-1 flex justify-between gap-3 border-t border-line pt-1 text-ink/80">
                Net <span className="font-semibold tabular-nums text-ink">{inr.format(point.income - point.expense)}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
