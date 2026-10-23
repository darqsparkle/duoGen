import Link from "next/link";
import { ArrowUpRight, Globe2, MapPin } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const places = [
  {
    icon: MapPin,
    title: "Chennai",
    text: "Websites, web apps and mobile apps for Chennai businesses — whether you run a startup, a clinic, a factory, a shop or a service firm.",
  },
  {
    icon: MapPin,
    title: "Salem",
    text: "Custom software, e-commerce and business apps for Salem companies — in textiles, agriculture, trading, manufacturing or any other sector.",
  },
  {
    icon: Globe2,
    title: "Clients outside India",
    text: "We work remotely with businesses abroad: clear written updates, regular video calls, and project agreements that cover how your data is handled.",
  },
];

/** Where we work — visible local context for Chennai and Salem searches, plus international clients. */
export function LocalReach() {
  return (
    <section data-nav="light" aria-labelledby="local-title" className="scene-sheet bg-white pt-24 pb-32 md:pt-32 md:pb-40">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where we work"
          title={
            <span id="local-title">
              App and software developers for{" "}
              <span className="text-glow-gradient">Chennai, Salem and beyond.</span>
            </span>
          }
          description="Looking for application developers near you? We build websites, web and mobile apps and business software for companies across Tamil Nadu, the rest of India and overseas."
        />

        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
          {places.map((place, index) => (
            <Reveal as="li" key={place.title} delay={index * 80} className="min-w-0">
              <div className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-line bg-lilac/50 p-6 sm:p-7">
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-mint text-[#0b5e3a]" aria-hidden>
                  <place.icon className="size-5" />
                </span>
                <h3 className="font-display text-xl font-semibold tracking-tight">{place.title}</h3>
                <p className="text-sm leading-relaxed text-ink/70">{place.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10">
          <Link href="/contact" className="group inline-flex items-center gap-1.5 font-medium text-ink underline-offset-4 hover:underline">
            Tell us about your project
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
