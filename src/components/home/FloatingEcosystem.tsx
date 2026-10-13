"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  BarChart3,
  Boxes,
  Globe,
  Receipt,
  Users,
  Workflow,
  Contact,
} from "lucide-react";
import { useRef } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";

const nodes = [
  { label: "Website", icon: Globe },
  { label: "Customers", icon: Users },
  { label: "CRM", icon: Contact },
  { label: "Billing", icon: Receipt },
  { label: "Inventory", icon: Boxes },
  { label: "Analytics", icon: BarChart3 },
  { label: "Automation", icon: Workflow },
].map((node, i, all) => {
  const angle = (-90 + (360 / all.length) * i) * (Math.PI / 180);
  return { ...node, angle, x: 400 + Math.cos(angle) * 290, y: 400 + Math.sin(angle) * 290 };
});

/** Gentle curve from the centre to each node. */
function curve(x: number, y: number) {
  const mx = (400 + x) / 2;
  const my = (400 + y) / 2;
  const nx = -(y - 400) * 0.18;
  const ny = (x - 400) * 0.18;
  return `M400 400 Q ${mx + nx} ${my + ny} ${x} ${y}`;
}

function Node({
  node,
  index,
  assemble,
  depart,
}: {
  node: (typeof nodes)[number];
  index: number;
  assemble: MotionValue<number>;
  depart: MotionValue<number>;
}) {
  const start = 0.15 + index * 0.07;
  const opacity = useTransform(assemble, [start, start + 0.25], [0, 1]);
  const scale = useTransform(assemble, [start, start + 0.3], [0.6, 1]);
  // Outward: nodes drift away from the centre as the section leaves.
  const x = useTransform(depart, [0, 1], [0, Math.cos(node.angle) * 40]);
  const y = useTransform(depart, [0, 1], [0, Math.sin(node.angle) * 40]);
  const Icon = node.icon;

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(node.x / 800) * 100}%`, top: `${(node.y / 800) * 100}%` }}
    >
      <motion.div
        style={{ opacity, scale, x, y }}
        className="glass-dark flex items-center gap-2 rounded-full py-1.5 pr-3.5 pl-1.5 text-xs font-medium whitespace-nowrap text-white shadow-[0_10px_40px_-10px_rgb(124_255_178/0.35)] sm:gap-2.5 sm:py-2 sm:pr-4 sm:pl-2 sm:text-sm"
      >
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-glow text-navy sm:size-7">
          <Icon aria-hidden className="size-3.5 sm:size-4" />
        </span>
        {node.label}
      </motion.div>
    </motion.div>
  );
}

function Connection({ d, index, assemble }: { d: string; index: number; assemble: MotionValue<number> }) {
  const start = 0.05 + index * 0.07;
  const pathLength = useTransform(assemble, [start, start + 0.35], [0, 1]);
  const opacity = useTransform(assemble, [start, start + 0.1], [0, 1]);
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="url(#eco-line)"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ pathLength, opacity }}
    />
  );
}

export function FloatingEcosystem() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Assemble while the diagram travels from the bottom of the viewport to its centre…
  const { scrollYProgress: assembleProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  // …and drift outward as it leaves. Scroll is only read, never controlled.
  const { scrollYProgress: departProgress } = useScroll({
    target: ref,
    offset: ["center center", "end start"],
  });
  const done = useMotionValue(1);
  const still = useMotionValue(0);
  const assemble = reduce ? done : assembleProgress;
  const depart = reduce ? still : departProgress;

  const coreScale = useTransform(assemble, [0, 0.6, 1], [0.7, 1.08, 1]);
  const coreGlow = useTransform(assemble, [0.4, 1], [0, 1]);
  const flowOpacity = useTransform(assemble, [0.85, 1], [0, 1]);
  const ringScale = useTransform(depart, [0, 1], [1, 1.25]);

  return (
    <section
      data-nav="dark"
      aria-labelledby="ecosystem-title"
      className="relative overflow-hidden bg-navy py-24 text-white md:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="flex flex-col gap-6">
          <Reveal dir="none">
            <Eyebrow tone="dark">Connected Systems</Eyebrow>
          </Reveal>
          <Reveal>
            <h2
              id="ecosystem-title"
              className="font-display text-[clamp(2.1rem,5vw,4rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance"
            >
              One business. <span className="text-glow-gradient">Every system connected.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-md text-lg leading-relaxed text-white/65">
              Your website, customers, sales, billing, and stock shouldn&apos;t live in separate
              silos. We design systems that share information and work as one.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="font-mono text-[0.65rem] tracking-[0.22em] text-white/40 uppercase">
              Illustrative diagram — no real data
            </p>
          </Reveal>
        </div>

        <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[640px]" aria-hidden>
          <svg viewBox="0 0 800 800" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <radialGradient id="eco-core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#7CFFB2" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="eco-line" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7CFFB2" />
                <stop offset="100%" stopColor="#DDFBE8" />
              </linearGradient>
            </defs>
            <motion.g style={{ scale: ringScale, transformOrigin: "400px 400px" }}>
              <circle cx="400" cy="400" r="290" fill="none" stroke="#7CFFB2" strokeOpacity="0.12" strokeDasharray="2 8" />
              <circle cx="400" cy="400" r="180" fill="none" stroke="#7CFFB2" strokeOpacity="0.08" />
            </motion.g>
            <motion.circle cx="400" cy="400" r="210" fill="url(#eco-core)" style={{ opacity: coreGlow }} />
            {nodes.map((node, i) => (
              <Connection key={node.label} d={curve(node.x, node.y)} index={i} assemble={assemble} />
            ))}
            <motion.g style={{ opacity: flowOpacity }}>
              {nodes.map((node) => (
                <path
                  key={node.label}
                  d={curve(node.x, node.y)}
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.7"
                  strokeWidth="2"
                  strokeDasharray="2 22"
                  className="animate-dash"
                />
              ))}
            </motion.g>
          </svg>

          <motion.div
            style={{ scale: coreScale }}
            className="absolute top-1/2 left-1/2 flex size-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <span className="absolute inset-0 rounded-full border border-glow/40 motion-safe:animate-pulse-ring" />
            <span className="relative flex size-full flex-col items-center justify-center rounded-full bg-gradient-to-br from-mint via-fresh to-glow text-center text-navy shadow-[0_0_80px_-10px_rgb(124_255_178/0.8)]">
              <span className="font-mono text-[0.5rem] tracking-[0.25em] opacity-70 sm:text-[0.6rem]">YOUR</span>
              <span className="font-display text-sm leading-none font-bold tracking-tight sm:text-xl">BUSINESS</span>
            </span>
          </motion.div>

          {nodes.map((node, i) => (
            <Node key={node.label} node={node} index={i} assemble={assemble} depart={depart} />
          ))}
        </div>
      </div>
    </section>
  );
}
