import { BarChart3, Box, Zap } from "lucide-react";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { heroRibbon } from "@/lib/services";
import { HeroVisual } from "./HeroVisual";

const values = [
  { icon: Box, label: "Built around your business" },
  { icon: Zap, label: "Designed for real-world use" },
  { icon: BarChart3, label: "Ready to evolve" },
];

const rise = (delay: number): CSSProperties => ({ animationDelay: `${delay}ms` });

export function Hero() {
  return (
    <section
      data-nav="dark"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-navy pb-14 text-white md:pb-16"
    >
      <div aria-hidden className="grid-lines-dark absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="absolute top-[-10%] right-[-10%] -z-10 size-[70vmax] rounded-full bg-[radial-gradient(circle,rgb(124_255_178/0.16),transparent_60%)]"
      />
      <div
        aria-hidden
        className="absolute bottom-[-30%] left-[-20%] -z-10 size-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(47_91_255/0.14),transparent_60%)]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pt-28 sm:px-6 md:pt-36 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:px-8 lg:pt-40">
        <div className="relative z-10 flex flex-col gap-6 md:gap-7">
          <div className="animate-rise" style={rise(0)}>
            <Eyebrow tone="dark">Digital Engineering</Eyebrow>
          </div>
          <h1
            id="hero-title"
            className="animate-rise font-display text-[clamp(2.6rem,11.5vw,5.25rem)] leading-[0.95] font-bold tracking-[-0.04em] lg:text-[clamp(4rem,5.8vw,5.75rem)]"
            style={rise(80)}
          >
            Your business.
            <br />
            <span className="text-glow-gradient">Reimagined.</span>
          </h1>
          <p
            className="animate-rise max-w-lg text-base leading-relaxed text-white/75 sm:text-lg"
            style={rise(180)}
          >
            We build websites, applications, business software, and intelligent automations
            that turn ambitious ideas into practical digital experiences.
          </p>
          <div
            className="animate-rise flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            style={rise(280)}
          >
            <MagneticButton>
              <Button href="/contact" size="lg">
                Let&apos;s Build Something
              </Button>
            </MagneticButton>
            <Button href="#capabilities" variant="outline-dark" icon="play" size="lg">
              Explore What We Do
            </Button>
          </div>
          <ul
            className="animate-rise mt-2 grid grid-cols-3 divide-x divide-white/10 sm:max-w-xl sm:divide-x-0"
            style={rise(380)}
          >
            {values.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex flex-col items-center gap-2 px-2 text-center text-xs leading-snug text-white/75 sm:flex-row sm:items-center sm:gap-3 sm:px-0 sm:pr-4 sm:text-left sm:text-sm"
              >
                <Icon aria-hidden className="size-6 shrink-0 text-glow" strokeWidth={1.6} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>

      <div className="mt-6 border-y border-white/10 bg-white/[0.02] py-4 md:mt-10">
        <Marquee
          items={heroRibbon}
          duration={45}
          renderItem={(item) => (
            <span className="flex items-center text-xs font-medium tracking-[0.14em] text-white/80 uppercase sm:text-sm">
              <span className="px-6 sm:px-8">{item}</span>
              <span aria-hidden className="text-glow">•</span>
            </span>
          )}
        />
      </div>
    </section>
  );
}
