import { cn } from "@/lib/cn";
//dummy change for new deployejent test
/** Oversized luminous ring used behind closing calls to action. */
export function GlowRing({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 800" aria-hidden className={cn("overflow-visible", className)}>
      <defs>
        <linearGradient id="gr-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#DDFBE8" />
          <stop offset="35%" stopColor="#7CFFB2" />
          <stop offset="65%" stopColor="#7CFFB2" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#B7FFCE" />
        </linearGradient>
        <radialGradient id="gr-halo" cx="50%" cy="50%" r="50%">
          <stop offset="62%" stopColor="#7CFFB2" stopOpacity="0" />
          <stop offset="75%" stopColor="#7CFFB2" stopOpacity="0.28" />
          <stop offset="88%" stopColor="#7CFFB2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gr-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.16" />
          <stop offset="70%" stopColor="#7CFFB2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="400" cy="400" r="380" fill="url(#gr-core)" />
      {/* The halo is a gradient rather than a blur filter, so the spin stays cheap. */}
      <circle cx="400" cy="400" r="400" fill="url(#gr-halo)" />
      <g className="origin-center animate-spin-slow [transform-box:fill-box]">
        <circle cx="400" cy="400" r="300" fill="none" stroke="url(#gr-stroke)" strokeWidth="14" opacity="0.25" />
        <circle cx="400" cy="400" r="300" fill="none" stroke="url(#gr-stroke)" strokeWidth="2.5" />
      </g>
      <circle cx="400" cy="400" r="220" fill="none" stroke="#7CFFB2" strokeOpacity="0.15" strokeDasharray="2 10" className="animate-dash" />
    </svg>
  );
}
