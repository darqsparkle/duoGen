import { LogoMark } from "@/components/navigation/Logo";

/**
 * Illustrative product collage for the capabilities intro: a dashboard
 * window, an analytics panel, and a phone, in front of a glossy glass ribbon.
 * All figures are sample values.
 */
export function DeviceCollage() {
  return (
    <div aria-hidden className="relative mx-auto aspect-[5/4] w-full max-w-[620px]">
      {/* Glossy green–blue glass ribbon */}
      <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="dc-ribbon" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B7FFCE" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#7CFFB2" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#5B8CFF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#DDFBE8" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="dc-shine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="animate-float-slow">
          <path
            d="M250 360 C 120 340, 140 120, 300 70 C 420 30, 520 120, 470 230"
            fill="none"
            stroke="url(#dc-ribbon)"
            strokeWidth="58"
            strokeLinecap="round"
          />
          <path
            d="M250 360 C 120 340, 140 120, 300 70 C 420 30, 520 120, 470 230"
            fill="none"
            stroke="url(#dc-shine)"
            strokeWidth="6"
            strokeLinecap="round"
            transform="translate(-10 -14)"
          />
        </g>
      </svg>

      {/* Dashboard window */}
      <div className="absolute top-[14%] left-0 w-[66%] -rotate-6 rounded-2xl border border-line bg-white p-3 shadow-[0_40px_80px_-30px_rgb(17_19_38/0.45)] sm:p-4">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#ff6b6b]/70" />
          <span className="size-2 rounded-full bg-[#ffd166]/70" />
          <span className="size-2 rounded-full bg-glow" />
          <span className="ml-auto rounded-full bg-lilac px-2 py-0.5 text-[0.5rem] text-muted">Sample data</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            ["Orders", "1.2K"],
            ["Revenue", "₹8.3L"],
            ["Leads", "342"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-lilac p-2">
              <p className="text-[0.5rem] text-muted sm:text-[0.55rem]">{label}</p>
              <p className="font-display text-xs font-semibold sm:text-sm">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <div className="flex flex-col gap-1.5 rounded-lg border border-line p-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="size-5 rounded-md bg-gradient-to-br from-lavender to-mint" />
                <span className="h-1.5 flex-1 rounded-full bg-line" />
                <span className="h-1.5 w-6 rounded-full bg-glow/70" />
              </div>
            ))}
          </div>
          <div className="flex w-14 items-end gap-1 rounded-lg border border-line p-2 sm:w-20">
            {[40, 65, 50, 85].map((h, i) => (
              <span key={i} className={i === 3 ? "flex-1 rounded-sm bg-electric" : "flex-1 rounded-sm bg-lavender"} style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>

      {/* Analytics panel */}
      <div className="absolute top-[40%] left-[28%] w-[44%] rotate-3 rounded-2xl border border-line bg-white p-3 shadow-[0_30px_60px_-30px_rgb(17_19_38/0.5)]">
        <div className="flex items-center gap-1.5">
          <LogoMark className="h-3.5" />
          <p className="text-[0.55rem] font-semibold">Growth overview</p>
        </div>
        <svg viewBox="0 0 160 60" className="mt-2 w-full">
          <defs>
            <linearGradient id="dc-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#7CFFB2" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 50 C 20 46, 30 40, 50 42 S 80 28, 100 30 S 130 12, 160 8 V60 H0Z" fill="url(#dc-area)" />
          <path d="M0 50 C 20 46, 30 40, 50 42 S 80 28, 100 30 S 130 12, 160 8" fill="none" stroke="#18c37a" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Phone */}
      <div className="absolute right-[6%] bottom-[2%] w-[30%] rotate-[8deg] rounded-[1.6rem] border-[5px] border-ink bg-ink shadow-[0_40px_70px_-25px_rgb(17_19_38/0.7)]">
        <div className="flex aspect-[9/17] flex-col gap-2 overflow-hidden rounded-[1.2rem] bg-white p-3">
          <span className="mx-auto block h-1 w-8 rounded-full bg-line" />
          <LogoMark className="mt-2 h-5 self-start" />
          <p className="font-display text-[0.65rem] leading-tight font-semibold">Welcome back!</p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5 rounded-lg bg-lilac p-1.5">
              <span className={i === 0 ? "size-3 rounded bg-glow" : "size-3 rounded bg-lavender"} />
              <span className="h-1 flex-1 rounded-full bg-line" />
            </div>
          ))}
          <span className="mt-auto rounded-full bg-ink py-1.5 text-center text-[0.5rem] text-white">Continue</span>
        </div>
      </div>
    </div>
  );
}
