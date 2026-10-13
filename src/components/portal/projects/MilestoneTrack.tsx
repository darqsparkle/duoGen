"use client";

import { Check } from "lucide-react";
import type { Milestone } from "@/lib/portal/model";
import { cn } from "@/lib/cn";

/**
 * Milestone marker line: one marker per milestone in order, filled when done.
 * The bar fills to the overall completion percentage.
 */
export function MilestoneTrack({ milestones, progress }: { milestones: Milestone[]; progress: number }) {
  const nextIndex = milestones.findIndex((m) => !m.done);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-muted">
          {milestones.filter((m) => m.done).length} of {milestones.length} milestones complete
        </p>
        <p className="font-display text-3xl font-semibold tracking-tight">{progress}%</p>
      </div>
      <div className="relative px-3 pt-2 pb-1">
        <div className="h-2 rounded-full bg-lilac" />
        <div
          className="absolute top-2 left-3 h-2 rounded-full bg-[#1baf7a] transition-[width] duration-500"
          style={{ width: `calc((100% - 1.5rem) * ${progress / 100})` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Project completion"
        />
        {milestones.map((m, i) => {
          const left = milestones.length === 1 ? 100 : (i / (milestones.length - 1)) * 100;
          return (
            <span
              key={m.id}
              title={m.title}
              className={cn(
                "absolute top-0 flex size-6 -translate-x-1/2 items-center justify-center rounded-full border-2",
                m.done
                  ? "border-[#1baf7a] bg-[#1baf7a] text-white"
                  : i === nextIndex
                    ? "border-ink bg-white"
                    : "border-line bg-white",
              )}
              style={{ left: `calc(0.75rem + (100% - 1.5rem) * ${left / 100})` }}
            >
              {m.done && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
            </span>
          );
        })}
      </div>
      {milestones.length > 0 && (
        <ol className="hidden grid-flow-col gap-2 text-xs text-muted sm:grid" style={{ gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` }}>
          {milestones.map((m, i) => (
            <li key={m.id} className={cn("truncate", i === 0 ? "text-left" : i === milestones.length - 1 ? "text-right" : "text-center", m.done && "text-ink")}>
              {m.title}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
