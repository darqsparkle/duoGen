"use client";

import { Check, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const ROUND_SECONDS = 30;
const CELLS = 9;
const BEST_KEY = "duogen-bugsquash-best";

type Item = { id: number; kind: "bug" | "feature"; expires: number };
type Phase = "ready" | "playing" | "over";
type Stats = { score: number; squashed: number; shipped: number; broke: number };

function readBest() {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

function saveBest(score: number) {
  try {
    window.localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // Storage unavailable (private mode) — the best score just isn't kept.
  }
}

function rank(score: number) {
  if (score >= 300) return "Principal QA Engineer 🏆";
  if (score >= 200) return "Senior Bug Hunter";
  if (score >= 100) return "Reliable Reviewer";
  if (score > 0) return "Junior Debugger";
  return "Bugs shipped to production 😅";
}

function BugIcon() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className="size-[70%]">
      <g stroke="#111326" strokeWidth="2.2" strokeLinecap="round">
        <path d="M12 16 6 12M12 22H5M12 28l-6 4M28 16l6-4M28 22h7M28 28l6 4M16 9l-3-4M24 9l3-4" />
      </g>
      <ellipse cx="20" cy="24" rx="9" ry="11" fill="#FF6B6B" stroke="#111326" strokeWidth="2.2" />
      <path d="M20 13v22" stroke="#111326" strokeWidth="2" />
      <circle cx="20" cy="12" r="5" fill="#111326" />
      <circle cx="16" cy="21" r="1.8" fill="#111326" />
      <circle cx="24" cy="27" r="1.8" fill="#111326" />
    </svg>
  );
}

/**
 * Bug Squash: squash bugs before they ship, but don't touch the features.
 * Tap or click a cell, or use keys 1–9 (numpad layout).
 */
export function BugSquash() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [cells, setCells] = useState<(Item | null)[]>(() => Array(CELLS).fill(null));
  const [stats, setStats] = useState<Stats>({ score: 0, squashed: 0, shipped: 0, broke: 0 });
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  // Only rendered on the client (the arcade is loaded lazily), so storage is safe here.
  const [best, setBest] = useState(() => (typeof window === "undefined" ? 0 : readBest()));
  const [flash, setFlash] = useState<{ cell: number; text: string; good: boolean } | null>(null);
  // Refs are the source of truth inside the timer; state mirrors them for rendering.
  const cellsRef = useRef(cells);
  const statsRef = useRef(stats);
  const nextId = useRef(1);
  const startedAt = useRef(0);

  const commitCells = useCallback((next: (Item | null)[]) => {
    cellsRef.current = next;
    setCells(next);
  }, []);
  const commitStats = useCallback((patch: Partial<Stats>) => {
    statsRef.current = { ...statsRef.current, ...patch };
    setStats(statsRef.current);
  }, []);

  const start = () => {
    commitCells(Array(CELLS).fill(null));
    commitStats({ score: 0, squashed: 0, shipped: 0, broke: 0 });
    setTimeLeft(ROUND_SECONDS);
    startedAt.current = Date.now();
    setPhase("playing");
  };

  // Game loop: spawn, expire, and count down. Gets faster as time runs out.
  useEffect(() => {
    if (phase !== "playing") return;
    const tick = window.setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startedAt.current) / 1000;
      const remaining = Math.max(0, ROUND_SECONDS - Math.floor(elapsed));
      setTimeLeft(remaining);
      if (remaining === 0) {
        const final = statsRef.current.score;
        if (final > readBest()) {
          saveBest(final);
          setBest(final);
        }
        commitCells(Array(CELLS).fill(null));
        setPhase("over");
        return;
      }
      const speed = 1 - elapsed / (ROUND_SECONDS * 1.6); // 1 → ~0.4
      let missed = 0;
      const next = cellsRef.current.map((item) => {
        if (item && item.expires <= now) {
          if (item.kind === "bug") missed++;
          return null;
        }
        return item;
      });
      if (missed) commitStats({ shipped: statsRef.current.shipped + missed });
      // Spawn into a random empty cell; busier as the round goes on.
      const empty = next.flatMap((item, i) => (item ? [] : [i]));
      if (empty.length && Math.random() < 0.45 + elapsed / 60) {
        const cell = empty[Math.floor(Math.random() * empty.length)];
        next[cell] = {
          id: nextId.current++,
          kind: Math.random() < 0.78 ? "bug" : "feature",
          expires: now + 1300 * speed + 300,
        };
      }
      commitCells(next);
    }, 250);
    return () => window.clearInterval(tick);
  }, [phase, commitCells, commitStats]);

  const hit = useCallback(
    (index: number) => {
      if (phase !== "playing") return;
      const item = cellsRef.current[index];
      if (!item) return;
      const { score, squashed, broke } = statsRef.current;
      if (item.kind === "bug") {
        commitStats({ score: score + 10, squashed: squashed + 1 });
        setFlash({ cell: index, text: "+10", good: true });
      } else {
        commitStats({ score: Math.max(0, score - 15), broke: broke + 1 });
        setFlash({ cell: index, text: "−15", good: false });
      }
      const next = [...cellsRef.current];
      next[index] = null;
      commitCells(next);
    },
    [phase, commitCells, commitStats],
  );

  // Keys 1–9 map to the grid like a numpad (7 8 9 on top).
  useEffect(() => {
    if (phase !== "playing") return;
    const map: Record<string, number> = { "7": 0, "8": 1, "9": 2, "4": 3, "5": 4, "6": 5, "1": 6, "2": 7, "3": 8 };
    const onKey = (event: KeyboardEvent) => {
      if (event.key in map) hit(map[event.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, hit]);

  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 450);
    return () => window.clearTimeout(t);
  }, [flash]);

  const { score, squashed, shipped, broke } = stats;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Score", score],
          ["Time", `${timeLeft}s`],
          ["Best", best],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-midnight px-2 py-2">
            <p className="text-[0.6rem] font-semibold tracking-[0.14em] text-white/45 uppercase">{label}</p>
            <p className="font-display text-xl font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-[min(340px,48dvh)]">
        <div className="grid grid-cols-3 gap-2" aria-label="Codebase">
          {cells.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => hit(i)}
              disabled={phase !== "playing"}
              aria-label={item ? (item.kind === "bug" ? "Bug — squash it" : "Feature — leave it") : "Empty file"}
              className="relative flex aspect-square flex-col overflow-hidden rounded-2xl border border-white/10 bg-midnight text-left transition-colors hover:border-glow/40 disabled:cursor-default"
            >
              {/* A tiny "code file" in each cell */}
              <span aria-hidden className="flex gap-1 border-b border-white/5 px-2 py-1.5">
                <span className="size-1.5 rounded-full bg-white/20" />
                <span className="size-1.5 rounded-full bg-white/20" />
                <span className="size-1.5 rounded-full bg-glow/60" />
              </span>
              <span aria-hidden className="flex flex-col gap-1 p-2">
                <span className="h-1 w-3/4 rounded-full bg-white/10" />
                <span className="h-1 w-1/2 rounded-full bg-white/10" />
                <span className="h-1 w-2/3 rounded-full bg-white/10" />
              </span>
              {item && (
                <span
                  key={item.id}
                  className="absolute inset-0 flex items-center justify-center motion-safe:animate-[assemble_0.25s_ease-out_both]"
                >
                  {item.kind === "bug" ? (
                    <BugIcon />
                  ) : (
                    <span className="flex size-[62%] flex-col items-center justify-center rounded-2xl bg-glow text-navy shadow-[0_0_24px_-4px_rgb(124_255_178/0.8)]">
                      <Check aria-hidden className="size-1/2" strokeWidth={3} />
                      <span className="text-[0.55rem] font-bold tracking-wider uppercase">Feature</span>
                    </span>
                  )}
                </span>
              )}
              {flash?.cell === i && (
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-2 text-center font-display text-lg font-bold",
                    flash.good ? "text-glow" : "text-[#ff8a8a]",
                  )}
                >
                  {flash.text}
                </span>
              )}
            </button>
          ))}
        </div>

        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-navy/90 p-5 text-center">
            {phase === "ready" ? (
              <>
                <p className="font-display text-2xl font-semibold text-white">Bug Squash</p>
                <p className="max-w-xs text-sm leading-relaxed text-white/70">
                  Bugs are sneaking into the codebase. Squash them before they ship, but don&apos;t
                  break the features. You have {ROUND_SECONDS} seconds.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold tracking-[0.14em] text-glow uppercase">Release complete</p>
                <p className="font-display text-3xl font-semibold text-white">{score} points</p>
                <p className="text-sm text-white/75">{rank(score)}</p>
                <p className="text-xs text-white/50">
                  {squashed} squashed · {shipped} shipped to production · {broke} features broken
                </p>
              </>
            )}
            <button
              type="button"
              onClick={start}
              className="mt-1 inline-flex min-h-11 items-center gap-2 rounded-full bg-glow px-6 font-medium text-navy hover:bg-fresh"
            >
              {phase === "ready" ? <Play aria-hidden className="size-4" /> : <RotateCcw aria-hidden className="size-4" />}
              {phase === "ready" ? "Start" : "Play again"}
            </button>
          </div>
        )}
      </div>
      <p aria-live="polite" className="sr-only">
        {phase === "over" ? `Round over. ${score} points.` : ""}
      </p>
      <p className="text-center text-xs text-white/45">Tap the bugs · or use keys 1–9</p>
    </div>
  );
}
