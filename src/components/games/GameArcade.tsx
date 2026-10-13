"use client";

import { Bug, Crown, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { BugSquash } from "./BugSquash";
import { ChessGame } from "./ChessGame";

const games = [
  { id: "bugs", label: "Bug Squash", icon: Bug, blurb: "Squash bugs before they ship." },
  { id: "chess", label: "Chess", icon: Crown, blurb: "Play white against Genie." },
] as const;

type GameId = (typeof games)[number]["id"];

/** The arcade dialog. Loaded on demand, so game code never slows the site. */
export default function GameArcade({ onClose }: { onClose: () => void }) {
  const [active, setActive] = useState<GameId>("bugs");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const focusables = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), [href]") ?? []);
    focusables()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[88] flex items-end justify-center sm:items-center sm:p-6">
      <div aria-hidden className="absolute inset-0 bg-navy/70 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="arcade-title"
        className="relative flex max-h-[100dvh] w-full flex-col overflow-hidden bg-navy text-white sm:max-h-[calc(100dvh-3rem)] sm:max-w-[520px] sm:rounded-[1.75rem] sm:border sm:border-white/10 sm:shadow-[0_40px_100px_-30px_rgb(0_0_0/0.9),0_0_60px_-20px_rgb(124_255_178/0.35)] max-sm:rounded-t-[1.75rem] max-sm:border-t max-sm:border-white/10"
      >
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <h2 id="arcade-title" className="font-display text-lg font-semibold">
              DuoGen <span className="text-glow-gradient">Arcade</span>
            </h2>
            <p className="text-xs text-white/55">A quick break between big ideas.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close arcade"
            className="inline-flex size-10 items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X aria-hidden className="size-5" />
          </button>
        </header>

        <div role="tablist" aria-label="Games" className="grid grid-cols-2 gap-2 px-5 pt-4">
          {games.map(({ id, label, icon: Icon, blurb }) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={active === id}
              aria-controls={`panel-${id}`}
              onClick={() => setActive(id)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors",
                active === id
                  ? "border-glow/60 bg-glow/10"
                  : "border-white/10 hover:border-white/25",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-9 shrink-0 items-center justify-center rounded-xl",
                  active === id ? "bg-glow text-navy" : "bg-white/5 text-glow",
                )}
              >
                <Icon aria-hidden className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block truncate text-xs text-white/50">{blurb}</span>
              </span>
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${active}`}
          aria-labelledby={`tab-${active}`}
          className="overflow-y-auto overscroll-contain p-5"
        >
          {active === "bugs" ? <BugSquash /> : <ChessGame />}
        </div>
      </div>
    </div>
  );
}
