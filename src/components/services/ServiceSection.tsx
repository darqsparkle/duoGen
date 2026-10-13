import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { ScrollScene } from "@/components/animations/ScrollScene";
import { Eyebrow } from "@/components/ui/SectionHeading";
import type { serviceDetails } from "@/lib/services";
import { cn } from "@/lib/cn";
import { ServiceMockup } from "./Mockups";

type Service = (typeof serviceDetails)[number];

const tones = {
  light: "bg-white",
  lilac: "bg-lilac",
  dark: "bg-navy text-white",
};

export function ServiceSection({ service, index }: { service: Service; index: number }) {
  const dark = service.tone === "dark";
  const reversed = index % 2 === 1;

  return (
    <section
      id={service.id}
      tabIndex={-1}
      aria-labelledby={`${service.id}-title`}
      data-nav={dark ? "dark" : "light"}
      className={cn(
        "relative scroll-mt-8 overflow-hidden outline-none focus-visible:shadow-none",
        tones[service.tone],
        dark ? "mx-2 rounded-[2.5rem] py-20 sm:mx-4 md:rounded-[3.5rem] md:py-28" : "py-20 md:py-28",
      )}
    >
      {dark && <div aria-hidden className="grid-lines-dark absolute inset-0" />}
      <div
        className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8"
      >
        <div className={cn("flex flex-col gap-6", reversed && "lg:order-2")}>
          <Reveal dir="none">
            <Eyebrow tone={dark ? "dark" : "light"}>
              {service.number} — {service.navLabel}
            </Eyebrow>
          </Reveal>
          <Reveal>
            <h2
              id={`${service.id}-title`}
              className="font-display text-[clamp(2rem,4.6vw,3.75rem)] leading-[1] font-semibold tracking-[-0.035em] text-balance"
            >
              {service.title}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className={cn("max-w-xl text-lg leading-relaxed", dark ? "text-white/65" : "text-muted")}>
              {service.intro}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {service.points.map((point) => (
                <li key={point} className={cn("flex items-start gap-3 border-t pt-3", dark ? "border-white/10" : "border-line")}>
                  <span aria-hidden className={cn("mt-2 size-1.5 shrink-0 rounded-full", dark ? "bg-glow" : "bg-ink")} />
                  <span className={dark ? "text-white/85" : "text-ink/85"}>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={220}>
            <Link
              href={`/contact?service=${service.id}`}
              className={cn(
                "group inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline",
                dark ? "text-glow" : "text-ink",
              )}
            >
              Talk to us about {service.title}
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <Reveal dir={reversed ? "left" : "right"} className={cn(reversed && "lg:order-1")}>
          <ScrollScene drift={30} expand={0.03}>
            <div aria-hidden className="mx-auto w-full max-w-[560px]">
              <ServiceMockup visual={service.visual} />
            </div>
          </ScrollScene>
        </Reveal>
      </div>
    </section>
  );
}
