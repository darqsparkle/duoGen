"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Factory,
  Plus,
  Stethoscope,
  Store,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries, type IndustryIcon } from "@/lib/industries";
import { cn } from "@/lib/cn";
import { IndustryPreview } from "./IndustryPreview";

const icons: Record<IndustryIcon, typeof Factory> = {
  factory: Factory,
  stethoscope: Stethoscope,
  building: Building2,
  store: Store,
  trending: TrendingUp,
  briefcase: Briefcase,
};

/** Panels converge toward the centre column as they enter. */
const directions = ["left", "scale", "right"] as const;

export function IndustryShowcase() {
  // Explicit open state powers tap/keyboard on touch and small screens.
  // On large screens the details also appear on hover and focus (CSS).
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section
      data-nav="dark"
      aria-labelledby="industries-title"
      className="scene-sheet overflow-hidden bg-navy pt-24 pb-24 text-white md:pt-32 md:pb-32"
    >
      <div aria-hidden className="grid-lines-dark absolute inset-0" />
      <div aria-hidden className="absolute top-1/3 left-1/2 size-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(124_255_178/0.12),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tone="dark"
          eyebrow="Industries"
          title={
            <span id="industries-title">
              Different industries.
              <br />
              Different challenges.
              <br />
              <span className="text-glow-gradient">Purpose-built solutions.</span>
            </span>
          }
          description="Every sector runs differently. Here are a few of the problems we help solve — previews are illustrative, not client projects."
        />

        <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {industries.map((industry, index) => {
            const Icon = icons[industry.icon];
            const isOpen = open === industry.id;
            const detailsId = `industry-${industry.id}`;
            return (
              <Reveal as="li" key={industry.id} dir={directions[index % 3]} delay={(index % 3) * 80}>
                <article
                  data-open={isOpen}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-midnight/80 transition-colors duration-500 hover:border-glow/40 data-[open=true]:border-glow/40 lg:min-h-[400px]"
                >
                  {/* Summary face */}
                  <div className="flex flex-1 flex-col gap-5 p-6 transition-opacity duration-500 sm:p-7 lg:group-focus-within:opacity-0 lg:group-hover:opacity-0 lg:group-data-[open=true]:opacity-0">
                    <div className="aspect-[2/1] rounded-2xl border border-white/10 bg-navy/60 p-3">
                      <IndustryPreview preview={industry.preview} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-glow/10 text-glow" aria-hidden>
                        <Icon className="size-5" />
                      </span>
                      <h3 className="font-display text-xl font-semibold tracking-tight">
                        {industry.name}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-white/60">{industry.summary}</p>
                  </div>

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={detailsId}
                    onClick={() => setOpen(isOpen ? null : industry.id)}
                    className="relative z-20 mx-6 mb-6 flex min-h-11 items-center justify-between gap-3 rounded-full border border-white/15 px-5 text-sm font-medium text-white/80 transition-colors hover:border-glow/50 hover:text-white sm:mx-7 lg:absolute lg:right-0 lg:bottom-0 lg:left-0"
                  >
                    {isOpen ? "Hide the solution" : "See the challenge and solution"}
                    <Plus aria-hidden className={cn("size-4 transition-transform duration-300", isOpen && "rotate-45")} />
                  </button>

                  {/* Details: accordion on small screens, overlay on large screens */}
                  <div
                    id={detailsId}
                    className={cn(
                      "grid transition-all duration-500 ease-out-expo",
                      isOpen ? "visible grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0",
                      "lg:visible lg:absolute lg:inset-0 lg:grid-rows-[1fr] lg:bg-midnight",
                      "lg:group-focus-within:opacity-100 lg:group-hover:opacity-100",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-5 px-6 pb-6 sm:px-7 lg:h-full lg:pt-7 lg:pb-24">
                        <div className="hidden items-center gap-3 lg:flex">
                          <Icon aria-hidden className="size-5 text-glow" />
                          <p className="font-display text-lg font-semibold">{industry.name}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[0.65rem] tracking-[0.22em] text-white/45 uppercase">The challenge</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">{industry.problem}</p>
                        </div>
                        <div className="rounded-2xl border border-glow/25 bg-glow/[0.06] p-4">
                          <p className="font-mono text-[0.65rem] tracking-[0.22em] text-glow uppercase">A possible solution</p>
                          <p className="mt-2 text-sm leading-relaxed text-white/85">{industry.solution}</p>
                        </div>
                        <Link
                          href={`/contact?industry=${industry.id}`}
                          className="group/link inline-flex items-center gap-1.5 self-start text-sm font-medium text-glow underline-offset-4 hover:underline"
                        >
                          Discuss this solution
                          <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
