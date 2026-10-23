import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Car,
  Cpu,
  Factory,
  FlaskConical,
  GraduationCap,
  Landmark,
  Megaphone,
  Rocket,
  ShoppingBag,
  Sprout,
  Stethoscope,
  Store,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industries, type IndustryIcon } from "@/lib/industries";

const icons: Record<IndustryIcon, typeof Factory> = {
  stethoscope: Stethoscope,
  flask: FlaskConical,
  factory: Factory,
  store: Store,
  graduation: GraduationCap,
  landmark: Landmark,
  truck: Truck,
  building: Building2,
  utensils: UtensilsCrossed,
  sprout: Sprout,
  car: Car,
  megaphone: Megaphone,
  briefcase: Briefcase,
  bag: ShoppingBag,
  cpu: Cpu,
  rocket: Rocket,
};

export function IndustryShowcase() {
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
          eyebrow="Industries we work with"
          title={
            <span id="industries-title">
              One tech partner
              <br />
              <span className="text-glow-gradient">for many industries.</span>
            </span>
          }
          description={
            <>
              Every business works in its own way. Some need more customers. Some need a clearer view
              of what&apos;s happening day to day. Others want to stop doing the same tasks by hand, get
              their tools working together, or build software around the way they already work.
              <br />
              <br />
              At DuoGen, we help you find what&apos;s holding your business back and build simple,
              practical tools to fix it.
            </>
          }
        />

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, index) => {
            const Icon = icons[industry.icon];
            return (
              <Reveal as="li" key={industry.id} delay={(index % 4) * 60} className="min-w-0">
                <Link
                  href={`/contact?industry=${industry.id}`}
                  className="group flex h-full flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-midnight/80 p-6 transition-colors duration-500 hover:border-glow/40 focus-visible:border-glow/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-glow/10 text-glow" aria-hidden>
                      <Icon className="size-5" />
                    </span>
                    <ArrowUpRight aria-hidden className="size-4 text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-glow" />
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                    {industry.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/60">{industry.summary}</p>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mt-16 md:mt-20">
          <div className="rounded-[1.75rem] border border-glow/25 bg-glow/[0.05] p-7 sm:p-10 lg:p-12">
            <h3 className="max-w-3xl font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-[-0.03em] text-balance">
              Your industry may be different.{" "}
              <span className="text-glow-gradient">Our approach stays the same.</span>
            </h3>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              First, we learn how your business works. Then we find where technology can actually
              help. Then we build a solution that fits what you need.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              You don&apos;t need to know the technical answer before you talk to us. Tell us what
              your business needs, and we&apos;ll work out how technology can help.
            </p>
            <Button href="/contact" className="mt-8">
              Let&apos;s talk about your needs
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
