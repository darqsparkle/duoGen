import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardGlyph } from "@/components/visuals/CardGlyph";
import { DeviceCollage } from "@/components/visuals/DeviceCollage";
import { ScrollScene } from "@/components/animations/ScrollScene";
import { capabilities } from "@/lib/services";
import { cn } from "@/lib/cn";

/** Asymmetric editorial grid: column span and surface per card. */
const layout = [
  { span: "lg:col-span-4", surface: "lavender", feature: true },
  { span: "lg:col-span-2", surface: "white" },
  { span: "lg:col-span-2", surface: "white" },
  { span: "lg:col-span-4", surface: "navy", feature: true },
  { span: "lg:col-span-3", surface: "white" },
  { span: "lg:col-span-3", surface: "mint" },
] as const;

const surfaces = {
  white: "bg-white border-line text-ink hover:border-ink/25",
  lavender: "bg-lavender border-transparent text-ink hover:border-ink/15",
  mint: "bg-mint border-transparent text-ink hover:border-ink/15",
  navy: "bg-navy border-white/10 text-white hover:border-glow/40",
};

export function Capabilities() {
  return (
    <section
      id="capabilities"
      data-nav="light"
      aria-labelledby="capabilities-title"
      className="scene-sheet overflow-hidden bg-gradient-to-b from-lavender via-lilac to-white pt-20 pb-32 md:pt-28 md:pb-40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Our Capabilities"
              title={
                <span id="capabilities-title">
                  From first impression to <span className="text-blue-gradient">everyday operations.</span>
                </span>
              }
              titleClassName="text-[clamp(2.2rem,4.6vw,4rem)]"
              description="Complete digital solutions for your business, from customer-facing experiences to the internal systems that power your growth."
            />
            <Reveal delay={200}>
              <Button href="/what-we-do" variant="ink">
                Explore All Capabilities
              </Button>
            </Reveal>
          </div>
          <ScrollScene drift={30}>
            <DeviceCollage />
          </ScrollScene>
        </div>

        <ul className="mt-16 grid md:mt-24 gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {capabilities.map((item, index) => {
            const { span, surface, ...rest } = layout[index];
            const feature = "feature" in rest && rest.feature;
            const dark = surface === "navy";
            return (
              <Reveal
                as="li"
                key={item.id}
                dir={index % 2 === 0 ? "left" : "right"}
                delay={(index % 2) * 90}
                className={cn(span, feature && "md:col-span-2")}
              >
                <Link
                  href={`/what-we-do#${item.id}`}
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-6 transition-all duration-500 ease-out-expo hover:-translate-y-1 sm:p-8",
                    surfaces[surface],
                    dark && "hover:shadow-[0_30px_80px_-30px_rgb(124_255_178/0.45)]",
                    !dark && "hover:shadow-[0_30px_60px_-34px_rgb(17_19_38/0.35)]",
                    feature ? "min-h-[340px] lg:min-h-[380px]" : "min-h-[320px]",
                  )}
                >
                  {dark && (
                    <span aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-glow/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                  )}
                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className={cn(
                        "font-display font-semibold tracking-tight",
                        feature ? "text-6xl sm:text-7xl" : "text-5xl",
                        dark ? "text-glow" : "text-ink/90",
                      )}
                    >
                      {item.number}
                    </span>
                    <span
                      aria-hidden
                      className={cn(
                        "inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ease-out-expo group-hover:rotate-45",
                        dark
                          ? "border-white/20 group-hover:border-glow group-hover:bg-glow group-hover:text-navy"
                          : "border-ink/15 group-hover:border-ink group-hover:bg-ink group-hover:text-white",
                      )}
                    >
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>

                  <div
                    className={cn(
                      "relative mt-6 flex flex-1 flex-col gap-6",
                      feature && "lg:flex-row lg:items-end lg:gap-10",
                    )}
                  >
                    <div className={cn("order-2 flex flex-col gap-2.5 lg:order-1", feature && "lg:flex-1")}>
                      <h3 className={cn("font-display font-semibold tracking-tight text-balance", feature ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
                        {item.title}
                      </h3>
                      <p className={cn("leading-relaxed", dark ? "text-white/65" : "text-muted")}>
                        {item.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "order-1 lg:order-2",
                        feature ? "max-w-[260px] lg:w-[46%] lg:max-w-none" : "max-w-[220px]",
                        dark ? "text-white" : "text-ink",
                      )}
                    >
                      <CardGlyph glyph={item.glyph} className="group-hover:scale-[1.04]" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
