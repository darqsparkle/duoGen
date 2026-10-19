import type { ReactNode } from "react";
import { ScrollScene } from "@/components/animations/ScrollScene";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { NavPath } from "@/lib/seo";
import { GlossySculpture } from "@/components/visuals/GlossySculpture";
import { Eyebrow } from "./SectionHeading";

/** Lavender-white editorial page hero with a glossy sculpture. */
export function LightHero({
  eyebrow,
  title,
  description,
  actions,
  sculpture,
  path,
}: {
  path: NavPath;
  eyebrow: string;
  title: ReactNode;
  description: string;
  actions?: ReactNode;
  sculpture: "services" | "contact";
}) {
  return (
    <section data-nav="light" aria-labelledby="page-title" className="relative isolate overflow-hidden bg-lilac pt-32 pb-24 md:pt-40 md:pb-32">
      <div aria-hidden className="grid-lines-light absolute inset-0 -z-10" />
      <div aria-hidden className="absolute -top-40 -right-40 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(124_255_178/0.25),transparent_60%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="flex flex-col gap-7">
          <Breadcrumbs path={path} />
          <div className="animate-rise">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h1
            id="page-title"
            className="animate-rise font-display text-[clamp(2.5rem,7.4vw,6rem)] leading-[0.94] font-semibold tracking-[-0.045em] text-balance"
            style={{ animationDelay: "80ms" }}
          >
            {title}
          </h1>
          <p className="animate-rise max-w-xl text-lg leading-relaxed text-muted" style={{ animationDelay: "180ms" }}>
            {description}
          </p>
          {actions && (
            <div className="animate-rise flex flex-wrap gap-3" style={{ animationDelay: "260ms" }}>
              {actions}
            </div>
          )}
        </div>
        <ScrollScene mode="out" drift={60} expand={0.06} className="mx-auto aspect-[11/10] w-full max-w-[540px]">
          <div className="animate-assemble h-full w-full" style={{ animationDelay: "200ms" }}>
            <GlossySculpture variant={sculpture} />
          </div>
        </ScrollScene>
      </div>
    </section>
  );
}
