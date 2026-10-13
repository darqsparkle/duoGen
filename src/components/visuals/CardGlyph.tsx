import type { Glyph } from "@/lib/services";
import { cn } from "@/lib/cn";

/**
 * Small abstract illustrations for capability cards. Strokes use currentColor
 * so they adapt to light and dark cards; the green accent is used sparingly.
 */
export function CardGlyph({ glyph, className }: { glyph: Glyph; className?: string }) {
  const common = {
    viewBox: "0 0 200 120",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true,
    className: cn("h-auto w-full transition-transform duration-500 ease-out-expo", className),
  } as const;

  switch (glyph) {
    case "web":
      return (
        <svg {...common}>
          <rect x="10" y="10" width="180" height="100" rx="10" strokeOpacity="0.35" />
          <path d="M10 28h180" strokeOpacity="0.35" />
          <circle cx="22" cy="19" r="2.5" fill="currentColor" stroke="none" opacity="0.4" />
          <circle cx="31" cy="19" r="2.5" fill="currentColor" stroke="none" opacity="0.4" />
          <circle cx="40" cy="19" r="2.5" fill="#7CFFB2" stroke="none" />
          <rect x="24" y="42" width="78" height="10" rx="5" fill="currentColor" stroke="none" opacity="0.85" />
          <rect x="24" y="58" width="58" height="6" rx="3" fill="currentColor" stroke="none" opacity="0.3" />
          <rect x="24" y="76" width="38" height="14" rx="7" fill="#7CFFB2" stroke="none" />
          <rect x="116" y="40" width="60" height="54" rx="8" fill="#7CFFB2" fillOpacity="0.25" stroke="none" />
          <circle cx="146" cy="67" r="14" fill="#7CFFB2" stroke="none" opacity="0.8" />
        </svg>
      );
    case "commerce":
      return (
        <svg {...common}>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${14 + i * 60} 14)`}>
              <rect width="50" height="64" rx="8" strokeOpacity="0.35" />
              <rect x="8" y="8" width="34" height="30" rx="6" fill={i === 1 ? "#7CFFB2" : "currentColor"} fillOpacity={i === 1 ? 0.9 : 0.12} stroke="none" />
              <rect x="8" y="44" width="26" height="5" rx="2.5" fill="currentColor" stroke="none" opacity="0.5" />
              <rect x="8" y="53" width="16" height="5" rx="2.5" fill="currentColor" stroke="none" opacity="0.25" />
            </g>
          ))}
          <rect x="120" y="88" width="66" height="22" rx="11" fill="currentColor" stroke="none" opacity="0.9" />
          <path d="M136 99h26m-6-5 6 5-6 5" stroke="#7CFFB2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "software":
      return (
        <svg {...common}>
          <rect x="10" y="10" width="180" height="100" rx="10" strokeOpacity="0.35" />
          {[38, 62, 48, 80, 56, 70].map((h, i) => (
            <rect key={i} x={26 + i * 16} y={96 - h} width="9" height={h} rx="3" fill={i === 3 ? "#7CFFB2" : "currentColor"} fillOpacity={i === 3 ? 1 : 0.18} stroke="none" />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="132" y={24 + i * 19} width="44" height="6" rx="3" fill="currentColor" stroke="none" opacity={i === 0 ? 0.7 : 0.22} />
            </g>
          ))}
        </svg>
      );
    case "crm":
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((col) => (
            <g key={col} transform={`translate(${12 + col * 46} 12)`}>
              <rect width="40" height="96" rx="8" strokeOpacity="0.25" />
              {Array.from({ length: 3 - (col === 3 ? 1 : 0) }, (_, row) => (
                <rect key={row} x="5" y={8 + row * 28} width="30" height="22" rx="5" fill={col === 2 && row === 0 ? "#7CFFB2" : "currentColor"} fillOpacity={col === 2 && row === 0 ? 1 : 0.14} stroke="none" />
              ))}
            </g>
          ))}
          <path d="M60 30c14 0 16 0 26 0" stroke="#7CFFB2" strokeWidth="2" strokeDasharray="3 4" />
        </svg>
      );
    case "apps":
      return (
        <svg {...common}>
          <rect x="10" y="14" width="130" height="86" rx="10" strokeOpacity="0.35" />
          <rect x="22" y="28" width="30" height="60" rx="5" fill="currentColor" fillOpacity="0.12" stroke="none" />
          <rect x="60" y="28" width="66" height="8" rx="4" fill="currentColor" stroke="none" opacity="0.6" />
          <rect x="60" y="44" width="50" height="6" rx="3" fill="currentColor" stroke="none" opacity="0.25" />
          <rect x="132" y="24" width="56" height="90" rx="12" fill="currentColor" fillOpacity="0.92" stroke="none" />
          <rect x="140" y="38" width="40" height="26" rx="6" fill="#7CFFB2" stroke="none" />
          <rect x="140" y="72" width="30" height="5" rx="2.5" fill="#ffffff" stroke="none" opacity="0.5" />
          <rect x="140" y="82" width="22" height="5" rx="2.5" fill="#ffffff" stroke="none" opacity="0.3" />
        </svg>
      );
    case "automation":
      return (
        <svg {...common}>
          <path d="M44 60h44m24 0h44" stroke="#7CFFB2" strokeWidth="2" strokeDasharray="4 5" className="animate-dash" />
          <circle cx="30" cy="60" r="16" strokeOpacity="0.5" />
          <circle cx="100" cy="60" r="22" fill="currentColor" fillOpacity="0.9" stroke="none" />
          <circle cx="100" cy="60" r="8" fill="#7CFFB2" stroke="none" />
          <circle cx="170" cy="60" r="16" fill="#7CFFB2" fillOpacity="0.85" stroke="none" />
          <path d="M100 38V18m0 64v20" strokeOpacity="0.35" strokeDasharray="3 4" />
          <circle cx="100" cy="14" r="5" strokeOpacity="0.5" />
          <circle cx="100" cy="106" r="5" strokeOpacity="0.5" />
        </svg>
      );
  }
}
