import { BarChart3, Globe, Receipt, Users, Workflow } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { ScrollDrift } from "@/components/animations/ScrollDrift";
import { ScrollScene } from "@/components/animations/ScrollScene";
import { cn } from "@/lib/cn";
import { HeroSculpture } from "@/components/visuals/HeroSculpture";

type Card = {
  label: string;
  icon: ReactNode;
  position: string;
  /** Where the card arrives from on load and drifts to on scroll (px). */
  vector: [number, number];
  /** Perspective tilt toward the centre, in degrees. */
  tilt: number;
  delay: number;
  body: ReactNode;
};

const bar = (width: string, strong = false) => (
  <span
    className={cn("block h-1.5 rounded-full", strong ? "bg-glow/80" : "bg-white/20")}
    style={{ width }}
  />
);

const cards: Card[] = [
  {
    label: "Website",
    icon: <Globe className="size-3.5" />,
    position: "top-[3%] left-[2%] sm:left-[4%]",
    vector: [-70, -50],
    tilt: 10,
    delay: 500,
    body: (
      <div className="flex gap-2">
        <span className="flex flex-col gap-1.5 pt-0.5">
          {bar("18px")}
          {bar("14px")}
          {bar("16px")}
        </span>
        <span className="relative h-10 w-16 overflow-hidden rounded-md bg-gradient-to-br from-glow/50 via-cyan/30 to-electric/40">
          <span className="absolute right-1.5 bottom-1.5 left-1.5 h-1 rounded-full bg-white/60" />
        </span>
      </div>
    ),
  },
  {
    label: "CRM",
    icon: <Users className="size-3.5" />,
    position: "top-[6%] right-0 sm:right-[2%]",
    vector: [70, -40],
    tilt: -10,
    delay: 600,
    body: (
      <div className="flex h-9 items-end gap-1">
        {[30, 45, 38, 62, 80].map((h, i) => (
          <span
            key={i}
            className={cn("w-2.5 rounded-sm", i === 4 ? "bg-glow" : "bg-glow/40")}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    ),
  },
  {
    label: "Automation",
    icon: <Workflow className="size-3.5" />,
    position: "top-[44%] left-0",
    vector: [-80, 10],
    tilt: 10,
    delay: 700,
    body: (
      <div className="flex items-center gap-1 text-[9px] text-white/60">
        <span className="size-4 rounded border border-glow/50 bg-glow/10" />
        <span className="h-px w-3 bg-glow/60" />
        <span className="size-4 rounded border border-glow/50 bg-glow/10" />
        <span className="h-px w-3 bg-glow/60" />
        <span className="size-4 rounded bg-glow/60" />
      </div>
    ),
  },
  {
    label: "Billing",
    icon: <Receipt className="size-3.5" />,
    position: "top-[42%] right-0",
    vector: [80, 20],
    tilt: -10,
    delay: 800,
    body: (
      <div className="flex flex-col gap-1.5">
        <span className="flex items-center justify-between gap-3">
          {bar("36px")}
          <span className="rounded-full bg-glow/15 px-1.5 text-[9px] text-glow">Paid</span>
        </span>
        {bar("80%")}
        {bar("60%")}
      </div>
    ),
  },
  {
    label: "Analytics",
    icon: <BarChart3 className="size-3.5" />,
    position: "bottom-[2%] left-[34%] sm:left-[36%]",
    vector: [0, 70],
    tilt: 0,
    delay: 900,
    body: (
      <div className="flex items-end gap-3">
        <div className="flex h-9 items-end gap-1">
          {[40, 70, 55, 90].map((h, i) => (
            <span key={i} className="w-2 rounded-sm bg-glow/80" style={{ height: `${h}%` }} />
          ))}
        </div>
        <svg viewBox="0 0 36 36" className="size-9 -rotate-90" aria-hidden>
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="rgb(255 255 255 / 0.12)"
            strokeWidth="5"
          />
          <circle
            cx="18"
            cy="18"
            r="14"
            fill="none"
            stroke="#7CFFB2"
            strokeWidth="5"
            strokeDasharray="62 88"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
  },
];

/** Connection lines from the structure to each floating card, in the 600-unit viewBox. */
const links = [
  "M300 160 C 240 120, 180 90, 120 70",
  "M300 160 C 370 120, 430 90, 500 80",
  "M290 300 C 220 300, 140 300, 70 300",
  "M310 300 C 390 290, 460 280, 530 280",
  "M300 340 C 300 420, 300 470, 300 520",
];

export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[600px]">
      <ScrollScene mode="out" drift={80} expand={0.08} className="absolute inset-0">
        <div className="animate-assemble h-full w-full" style={{ animationDelay: "150ms" }}>
          <svg viewBox="0 0 600 600" aria-hidden className="absolute inset-0 h-full w-full">
            {links.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="#7CFFB2"
                strokeOpacity="0.28"
                strokeDasharray="4 8"
                className="animate-dash"
              />
            ))}
          </svg>
          <HeroSculpture />
        </div>
      </ScrollScene>

      {cards.map((card) => (
        <div key={card.label} className={cn("absolute z-10", card.position)}>
          <ScrollDrift x={card.vector[0] * 1.6} y={card.vector[1] * 1.6}>
            <div
              className="animate-converge"
              style={
                {
                  animationDelay: `${card.delay}ms`,
                  "--from-x": `${card.vector[0]}px`,
                  "--from-y": `${card.vector[1]}px`,
                } as CSSProperties
              }
            >
              <div className="animate-float" style={{ animationDelay: `${-card.delay / 100}s` }}>
                <div
                  className="glass-dark flex min-w-[96px] flex-col gap-2 rounded-xl p-2.5 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8),0_0_24px_-10px_rgb(124_255_178/0.5)] sm:min-w-[140px] sm:gap-2.5 sm:rounded-2xl sm:p-3"
                  style={{ transform: `perspective(700px) rotateY(${card.tilt}deg)` }}
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/85">
                    <span
                      className="inline-flex size-5 items-center justify-center rounded-md bg-glow/15 text-glow"
                      aria-hidden
                    >
                      {card.icon}
                    </span>
                    {card.label}
                  </span>
                  <div className="hidden sm:block">{card.body}</div>
                </div>
              </div>
            </div>
          </ScrollDrift>
        </div>
      ))}
    </div>
  );
}
