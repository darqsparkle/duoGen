import type { industries } from "@/lib/industries";

type Preview = (typeof industries)[number]["preview"];

/** Tiny illustrative interface previews — abstract, never real customer work. */
export function IndustryPreview({ preview }: { preview: Preview }) {
  const frame = "h-full w-full";
  switch (preview) {
    case "dashboard":
      return (
        <svg viewBox="0 0 160 80" className={frame} aria-hidden>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={4 + i * 52} y="4" width="48" height="20" rx="4" fill="#fff" fillOpacity={i === 0 ? 0.14 : 0.06} />
          ))}
          <polyline points="6,70 30,58 52,62 76,44 100,50 124,32 154,28" fill="none" stroke="#7CFFB2" strokeWidth="2" strokeLinecap="round" />
          <rect x="8" y="10" width="20" height="4" rx="2" fill="#7CFFB2" />
        </svg>
      );
    case "booking":
      return (
        <svg viewBox="0 0 160 80" className={frame} aria-hidden>
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={6 + (i % 7) * 21.5} y={8 + Math.floor(i / 7) * 22} width="17" height="17" rx="4" fill={i === 9 ? "#7CFFB2" : "#fff"} fillOpacity={i === 9 ? 1 : 0.08} />
          ))}
          <rect x="6" y="56" width="70" height="16" rx="8" fill="#fff" fillOpacity="0.1" />
          <rect x="84" y="56" width="70" height="16" rx="8" fill="#7CFFB2" fillOpacity="0.25" />
        </svg>
      );
    case "estimator":
      return (
        <svg viewBox="0 0 160 80" className={frame} aria-hidden>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="6" y={8 + i * 18} width="60" height="5" rx="2.5" fill="#fff" fillOpacity="0.2" />
              <rect x="6" y={15 + i * 18} width="88" height="4" rx="2" fill="#fff" fillOpacity="0.08" />
              <rect x="6" y={15 + i * 18} width={30 + i * 22} height="4" rx="2" fill="#7CFFB2" fillOpacity="0.7" />
            </g>
          ))}
          <rect x="104" y="8" width="50" height="64" rx="8" fill="#7CFFB2" fillOpacity="0.14" stroke="#7CFFB2" strokeOpacity="0.4" />
          <rect x="114" y="22" width="30" height="8" rx="4" fill="#7CFFB2" />
          <rect x="114" y="38" width="22" height="4" rx="2" fill="#fff" fillOpacity="0.3" />
        </svg>
      );
    case "catalog":
      return (
        <svg viewBox="0 0 160 80" className={frame} aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${6 + i * 38} 6)`}>
              <rect width="34" height="44" rx="6" fill="#fff" fillOpacity={i === 1 ? 0.16 : 0.07} />
              <circle cx="17" cy="20" r="9" fill={i === 1 ? "#7CFFB2" : "#fff"} fillOpacity={i === 1 ? 1 : 0.15} />
            </g>
          ))}
          <rect x="6" y="58" width="56" height="14" rx="7" fill="#7CFFB2" />
          <rect x="68" y="62" width="40" height="5" rx="2.5" fill="#fff" fillOpacity="0.2" />
        </svg>
      );
    case "pipeline":
      return (
        <svg viewBox="0 0 160 80" className={frame} aria-hidden>
          {[0, 1, 2, 3].map((col) => (
            <g key={col} transform={`translate(${6 + col * 38} 6)`}>
              <rect width="34" height="68" rx="6" fill="#fff" fillOpacity="0.04" />
              {Array.from({ length: 3 - Math.floor(col / 2) }, (_, row) => (
                <rect key={row} x="4" y={6 + row * 20} width="26" height="15" rx="4" fill={col === 3 && row === 0 ? "#7CFFB2" : "#fff"} fillOpacity={col === 3 && row === 0 ? 1 : 0.12} />
              ))}
            </g>
          ))}
        </svg>
      );
    case "portal":
      return (
        <svg viewBox="0 0 160 80" className={frame} aria-hidden>
          <rect x="6" y="6" width="36" height="68" rx="6" fill="#fff" fillOpacity="0.07" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="12" y={14 + i * 14} width="24" height="5" rx="2.5" fill={i === 1 ? "#7CFFB2" : "#fff"} fillOpacity={i === 1 ? 1 : 0.2} />
          ))}
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x="50" y={6 + i * 24} width="104" height="18" rx="5" fill="#fff" fillOpacity="0.06" />
              <circle cx="60" cy={15 + i * 24} r="4" fill="#7CFFB2" fillOpacity={0.4 + i * 0.25} />
              <rect x="70" y={13 + i * 24} width={50 - i * 10} height="4" rx="2" fill="#fff" fillOpacity="0.25" />
            </g>
          ))}
        </svg>
      );
  }
}
