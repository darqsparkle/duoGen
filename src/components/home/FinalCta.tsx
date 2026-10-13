import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { ScrollScene } from "@/components/animations/ScrollScene";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { GlowRing } from "@/components/visuals/GlowRing";

/** Dark closing scene with an expanding luminous ring behind the headline. */
export function FinalCta({
  eyebrow = "Let's talk",
  title,
  description,
  cta,
  href = "/contact",
  secondary,
  sheet = true,
  compact = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  cta: string;
  href?: string;
  secondary?: ReactNode;
  sheet?: boolean;
  /** Smaller headline for longer sentences. */
  compact?: boolean;
}) {
  return (
    <section
      data-nav="dark"
      aria-labelledby="final-cta-title"
      className={`${sheet ? "scene-sheet" : "relative isolate"} overflow-hidden bg-navy py-28 text-white md:py-40`}
    >
      <div aria-hidden className="grid-lines-dark absolute inset-0 -z-10" />
      <ScrollScene
        expand={0.12}
        drift={20}
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 aspect-square w-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2"
      >
        <GlowRing className="h-full w-full" />
      </ScrollScene>

      <div className="mx-auto flex max-w-4xl flex-col items-center gap-7 px-4 text-center sm:px-6">
        <Reveal dir="none">
          <Eyebrow tone="dark">{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal dir="scale">
          <h2
            id="final-cta-title"
            className={`font-display leading-[0.95] font-semibold tracking-[-0.045em] text-balance ${
              compact ? "text-[clamp(2.2rem,5.6vw,4.75rem)]" : "text-[clamp(2.6rem,8vw,6.5rem)]"
            }`}
          >
            {title}
          </h2>
        </Reveal>
        {description && (
          <Reveal delay={120}>
            <p className="max-w-xl text-lg leading-relaxed text-white/70">{description}</p>
          </Reveal>
        )}
        <Reveal delay={200} className="flex flex-wrap justify-center gap-3">
          <MagneticButton>
            <Button href={href} size="lg">
              {cta}
            </Button>
          </MagneticButton>
          {secondary}
        </Reveal>
      </div>
    </section>
  );
}
