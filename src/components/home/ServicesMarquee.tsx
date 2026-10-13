import { Marquee } from "@/components/ui/Marquee";
import { serviceRibbon } from "@/lib/services";
import { cn } from "@/lib/cn";

function Spark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="mx-6 size-6 shrink-0 text-glow md:mx-10 md:size-9">
      <path d="M12 0c.8 6.4 5.6 11.2 12 12-6.4.8-11.2 5.6-12 12-.8-6.4-5.6-11.2-12-12C6.4 11.2 11.2 6.4 12 0Z" fill="currentColor" />
    </svg>
  );
}

function RibbonWord({ item, outline }: { item: string; outline: boolean }) {
  return (
    <span className="flex items-center">
      <span
        className={cn(
          "font-display text-[clamp(2.75rem,8vw,7rem)] leading-none font-semibold tracking-[-0.04em] whitespace-nowrap uppercase",
          outline ? "text-outline-ink" : "text-ink",
        )}
      >
        {item}
      </span>
      <Spark />
    </span>
  );
}

/** Two oversized rows drifting in opposite directions at different speeds. */
export function ServicesMarquee() {
  return (
    <section
      data-nav="light"
      aria-label="Services we offer"
      className="scene-sheet flex flex-col gap-4 overflow-hidden bg-lavender py-20 md:gap-6 md:py-28"
    >
      <Marquee items={serviceRibbon} duration={60} renderItem={(item) => <RibbonWord item={item} outline={false} />} />
      <Marquee items={serviceRibbon} duration={80} reverse renderItem={(item) => <RibbonWord item={item} outline />} />
    </section>
  );
}
