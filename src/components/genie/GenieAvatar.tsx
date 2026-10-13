import { useId } from "react";
import { LogoGradients, LogoRibbons } from "@/components/navigation/Logo";
import { cn } from "@/lib/cn";

/**
 * Genie, the DuoGen assistant: a friendly robot head with a glowing visor and
 * smiling eyes. The "full" variant sits the robot on the DG mark (the brand
 * mascot); "head" is the compact version for buttons and message avatars.
 */
export function GenieAvatar({
  variant = "head",
  className,
}: {
  variant?: "head" | "full";
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `genie-${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;
  const full = variant === "full";

  return (
    <svg
      viewBox={full ? "0 0 120 150" : "4 0 112 92"}
      aria-hidden
      className={cn("overflow-visible", className)}
    >
      <defs>
        <linearGradient id={id("shell")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2FFF8" />
          <stop offset="45%" stopColor="#B7FFCE" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id={id("visor")} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="60%" stopColor="#0B1033" />
          <stop offset="100%" stopColor="#07091B" />
        </linearGradient>
        <linearGradient id={id("ear")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B7FFCE" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
        <radialGradient id={id("halo")}>
          <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#7CFFB2" stopOpacity="0" />
        </radialGradient>
        {full && <LogoGradients greenId={id("dg-a")} blueId={id("dg-b")} />}
      </defs>

      {full && <ellipse cx="60" cy="80" rx="62" ry="70" fill={url("halo")} />}

      {/* Antenna */}
      <line x1="60" y1="22" x2="60" y2="11" stroke="#22D3EE" strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="8" r="5.5" fill="#B7FFCE" className="animate-twinkle" />

      {/* Ear pods */}
      <ellipse cx="17" cy="52" rx="8" ry="13" fill={url("ear")} />
      <ellipse cx="17" cy="52" rx="4" ry="7.5" fill="#0B1033" opacity="0.35" />
      <ellipse cx="103" cy="52" rx="8" ry="13" fill={url("ear")} />
      <ellipse cx="103" cy="52" rx="4" ry="7.5" fill="#0B1033" opacity="0.35" />

      {/* Head shell */}
      <rect x="18" y="20" width="84" height="68" rx="34" fill={url("shell")} />
      <path d="M34 28 Q60 18 86 28" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Visor */}
      <rect x="27" y="32" width="66" height="46" rx="21" fill={url("visor")} />
      <path d="M36 40 Q46 35 58 36" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Smiling eyes (they blink) */}
      <g className="genie-eyes">
        <path d="M41 59 Q47.5 50 54 59" stroke="#7CFFB2" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M66 59 Q72.5 50 79 59" stroke="#7CFFB2" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      </g>

      {full && (
        <g transform="translate(14 88) scale(0.7)">
          <LogoRibbons greenId={id("dg-a")} blueId={id("dg-b")} />
        </g>
      )}
    </svg>
  );
}
