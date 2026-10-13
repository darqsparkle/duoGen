import { useId } from "react";
import { cn } from "@/lib/cn";

/** Ribbon paths of the DG mark, in a 132 × 88 coordinate space. */
export const logoPaths = {
  /** D stem and top, sweeping down into the G bowl and its inward bar. */
  d: "M16 56 V20 Q16 12 24 12 H40 C54 12 62 22 68 34 L76 50 C82 64 92 74 104 72 C116 70 120 58 118 46 L117 42 H98",
  /** D bottom curving up across the middle into the top of the G. */
  g: "M16 54 C16 70 28 78 42 74 C52 71 57 62 62 54 L72 38 C78 28 88 20 100 20 C110 20 116 26 119 34",
};

/** The mark's two ribbon gradients, for use inside any <defs>. */
export function LogoGradients({ greenId, blueId }: { greenId: string; blueId: string }) {
  return (
    <>
      <linearGradient id={greenId} x1="10" y1="8" x2="120" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#B7FFCE" />
        <stop offset="0.35" stopColor="#3EF0A0" />
        <stop offset="0.7" stopColor="#22D3EE" />
        <stop offset="1" stopColor="#7CFFB2" />
      </linearGradient>
      <linearGradient id={blueId} x1="12" y1="80" x2="124" y2="14" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#2EE6D6" />
        <stop offset="0.45" stopColor="#2F5BFF" />
        <stop offset="0.8" stopColor="#3B82F6" />
        <stop offset="1" stopColor="#9AD8FF" />
      </linearGradient>
    </>
  );
}

/** Both ribbons, drawn with gradients defined elsewhere. */
export function LogoRibbons({ greenId, blueId }: { greenId: string; blueId: string }) {
  return (
    <>
      <path d={logoPaths.d} stroke={`url(#${greenId})`} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d={logoPaths.g} stroke={`url(#${blueId})`} strokeWidth="14" strokeLinecap="round" fill="none" />
    </>
  );
}

/**
 * The DuoGen "DG" mark: two ribbons — a green D and a blue sweep — that cross
 * and loop into a G, like an infinity sign. Collaboration and connected systems.
 */
export function LogoMark({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const a = `dg-a-${uid}`;
  const b = `dg-b-${uid}`;
  return (
    <svg viewBox="0 0 132 88" fill="none" aria-hidden className={cn("h-8 w-auto", className)}>
      <defs>
        <LogoGradients greenId={a} blueId={b} />
      </defs>
      <LogoRibbons greenId={a} blueId={b} />
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
  compact = false,
}: {
  className?: string;
  /** Background the logo sits on. */
  tone?: "dark" | "light";
  /** Show only the mark on small screens. */
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-8 sm:h-9" />
      <span className={cn("flex-col leading-none", compact ? "hidden sm:flex" : "flex")}>
        <span className="font-display text-lg font-bold tracking-tight">
          Duo<span className={tone === "dark" ? "text-glow" : "text-[#0e9f6e]"}>Gen</span>
        </span>
        <span className="mt-1 text-[0.55rem] font-medium tracking-[0.32em] opacity-60">
          TECH SOLUTIONS
        </span>
      </span>
    </span>
  );
}
