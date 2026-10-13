"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processPreview } from "@/lib/process";

export function ProcessPreview() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const full = useMotionValue(1);
  const progress = reduce ? full : scrollYProgress;
  const fill = useTransform(progress, [0, 1], [0, 1]);
  const left = useTransform(progress, (v) => `${Math.min(Math.max(v, 0), 1) * 100}%`);

  return (
    <section
      data-nav="light"
      aria-labelledby="process-title"
      className="scene-sheet bg-lilac pt-24 pb-32 md:pt-32 md:pb-40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Our Process"
            title={<span id="process-title">Big ideas become better products through a clear process.</span>}
          />
          <Reveal dir="right" className="shrink-0">
            <Button href="/how-we-do" variant="ink">
              See How We Work
            </Button>
          </Reveal>
        </div>

        <ol ref={ref} className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          {/* Progress track: horizontal on desktop, vertical on mobile */}
          <div aria-hidden className="absolute top-0 bottom-0 left-[11px] w-px bg-line md:top-[11px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto">
            <motion.div
              style={{ scaleX: fill }}
              className="absolute inset-0 hidden origin-left bg-ink md:block"
            />
            <motion.div
              style={{ scaleY: fill }}
              className="absolute inset-0 origin-top bg-ink md:hidden"
            />
            <motion.span
              style={{ left }}
              className="absolute top-1/2 hidden size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow shadow-[0_0_0_4px_rgb(124_255_178/0.3),0_0_20px_4px_rgb(124_255_178/0.6)] md:block"
            />
          </div>

          {processPreview.map((step, index) => (
            <Reveal as="li" key={step.number} delay={index * 120} className="relative pl-10 md:pt-12 md:pl-0">
              <span aria-hidden className="absolute top-0 left-0 flex size-6 items-center justify-center rounded-full border border-ink/20 bg-white">
                <span className="size-2 rounded-full bg-ink" />
              </span>
              <p className="font-mono text-xs tracking-[0.2em] text-muted">{step.number}</p>
              <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-muted">{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
