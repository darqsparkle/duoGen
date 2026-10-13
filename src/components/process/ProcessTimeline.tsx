"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { journey } from "@/lib/process";
import { cn } from "@/lib/cn";

/**
 * Six-stage journey. A mint line travels down the spine as you scroll and
 * steps settle in alternately from the left and right. Nothing is pinned.
 */
export function ProcessTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const full = useMotionValue(1);
  const progress = reduce ? full : smooth;

  return (
    <ol ref={ref} className="relative mx-auto flex max-w-6xl flex-col gap-10 md:gap-16">
      {/* Spine */}
      <div aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-white/10 md:left-1/2">
        <motion.div
          style={{ scaleY: progress }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-mint via-glow to-fresh shadow-[0_0_14px_1px_rgb(124_255_178/0.6)]"
        />
      </div>

      {journey.map((step, index) => {
        const fromLeft = index % 2 === 0;
        return (
          <li key={step.number} className="relative grid md:grid-cols-2 md:gap-16">
            {/* Node on the spine */}
            <span
              aria-hidden
              className="absolute top-7 left-[19px] z-10 flex size-10 -translate-x-1/2 items-center justify-center rounded-full border border-glow/40 bg-navy font-mono text-xs text-glow md:left-1/2"
            >
              {step.number}
            </span>

            <Reveal
              as="article"
              dir={fromLeft ? "left" : "right"}
              className={cn("pl-14 md:pl-0", fromLeft ? "md:col-start-1 md:pr-10" : "md:col-start-2 md:pl-10")}
            >
              <div className="group rounded-[1.75rem] border border-white/10 bg-midnight/70 p-6 transition-colors duration-500 hover:border-glow/35 sm:p-8">
                <p className="font-mono text-xs tracking-[0.22em] text-glow uppercase">Stage {step.number}</p>
                <h3 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-white/70">{step.summary}</p>

                <h4 className="mt-6 font-mono text-[0.65rem] tracking-[0.22em] text-white/40 uppercase">Activities</h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {step.activities.map((activity) => (
                    <li key={activity} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/80">
                      {activity}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-glow/[0.08] p-4">
                  <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-glow shadow-[0_0_10px_2px_rgb(124_255_178/0.6)]" />
                  <p className="text-sm text-white/85">
                    <span className="font-semibold text-glow">Deliverable: </span>
                    {step.deliverable}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
