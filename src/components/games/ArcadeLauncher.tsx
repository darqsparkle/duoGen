"use client";

import dynamic from "next/dynamic";
import { Gamepad2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";

// Games (and chess.js) download only when someone opens the arcade.
const GameArcade = dynamic(() => import("./GameArcade"), { ssr: false });

/** Small floating button, stacked above Genie, that opens the arcade pop-up. */
export function ArcadeLauncher() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open the DuoGen Arcade: play chess or Bug Squash"
        aria-haspopup="dialog"
        className="group fixed right-6 bottom-[5.75rem] z-[60] flex size-12 items-center justify-center rounded-full border border-white/15 bg-midnight text-glow shadow-[0_12px_30px_-10px_rgb(7_9_27/0.8)] transition-all duration-300 hover:scale-105 hover:border-glow/50 sm:right-8 sm:bottom-[6.75rem]"
      >
        <Gamepad2 aria-hidden className="size-5 transition-transform group-hover:-rotate-12" />
        <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-white px-3 py-1 text-xs font-medium whitespace-nowrap text-ink opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
          Take a break
        </span>
      </button>
      {open && <GameArcade onClose={close} />}
    </>
  );
}
