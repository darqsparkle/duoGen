import Link from "next/link";
import { ArrowUpRight, Globe2, MapPin, Video } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const places = [
  {
    icon: MapPin,
    title: "Across India",
    text: "Websites, web and mobile apps, and business software for companies in every part of the country — from startups to established firms.",
  },
  {
    icon: Globe2,
    title: "Around the world",
    text: "We build for businesses outside India too, with project agreements that cover scope, ownership and how your data is handled.",
  },
  {
    icon: Video,
    title: "Wherever you are",
    text: "Clear written updates, regular video calls and shared progress, so working with us is just as easy from another city or another country.",
  },
];

/** Where we work — India and international clients. */
export function LocalReach() {
  return (
    <section data-nav="light" aria-labelledby="local-title" className="scene-sheet bg-white pt-24 pb-32 md:pt-32 md:pb-40">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where we work"
          title={
            <span id="local-title">
              App and software developers{" "}
              <span className="text-glow-gradient">for businesses everywhere.</span>
            </span>
          }
          description="Based in India, working with clients across the country and around the world. Tell us what you need, wherever you are."
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
