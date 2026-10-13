"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { serviceDetails, solutionNeeds, type NeedId } from "@/lib/services";
import { cn } from "@/lib/cn";

/** Frontend-only solution finder. The choice is passed to /contact via ?need=. */
export function SolutionSelector() {
  const [selected, setSelected] = useState<NeedId | null>(null);
  const reduce = useReducedMotion();
  const need = solutionNeeds.find((n) => n.id === selected);
  const related = need && serviceDetails.find((s) => s.id === need.related);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
      <fieldset>
        <legend className="sr-only">Choose what you want to improve</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {solutionNeeds.map((option) => {
            const isSelected = selected === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  "group relative flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 transition-all duration-300 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-glow/60",
                  isSelected
                    ? "border-ink bg-ink text-white shadow-[0_20px_40px_-24px_rgb(17_19_38/0.7)]"
                    : "border-line bg-white text-ink hover:-translate-y-0.5 hover:border-ink/30",
                )}
              >
                <input
                  type="radio"
                  name="solution-need"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setSelected(option.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isSelected ? "border-glow bg-glow text-navy" : "border-ink/20",
                  )}
                >
                  {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span className="font-medium">{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div
        aria-live="polite"
        className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-navy p-7 text-white sm:p-9"
      >
        <div aria-hidden className="absolute -top-20 -right-20 size-64 rounded-full bg-glow/20 blur-3xl" />
        <AnimatePresence mode="wait" initial={false}>
          {need ? (
            <motion.div
              key={need.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex h-full flex-col gap-5"
            >
              <p className="font-mono text-[0.65rem] tracking-[0.22em] text-glow uppercase">
                Recommended: {need.solution}
              </p>
              <p className="font-display text-2xl leading-snug font-semibold tracking-tight sm:text-3xl">
                {need.recommendation}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={`/contact?need=${need.id}`}
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-glow px-6 font-medium text-navy transition-colors hover:bg-fresh"
                >
                  Discuss This Requirement
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                {related && need.id !== "explore-idea" && (
                  <a href={`#${related.id}`} className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline">
                    Read about {related.title}
                  </a>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex h-full flex-col justify-center gap-4"
            >
              <Sparkles aria-hidden className="size-8 text-glow" />
              <p className="font-display text-2xl font-semibold tracking-tight">
                Pick a goal to see where we would start.
              </p>
              <p className="text-white/60">
                Your selection stays in your browser. Nothing is sent or saved.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
