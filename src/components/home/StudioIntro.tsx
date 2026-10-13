import { Reveal } from "@/components/animations/Reveal";
import { ScrollScene } from "@/components/animations/ScrollScene";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { GlossySculpture } from "@/components/visuals/GlossySculpture";

const facets = ["Strategy", "Design", "Engineering", "Automation"];

export function StudioIntro() {
  return (
    <section
      data-nav="light"
      aria-labelledby="studio-title"
      className="scene-sheet overflow-hidden bg-lilac pt-24 pb-32 md:pt-32 md:pb-40"
    >
      <div aria-hidden className="grid-lines-light absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="flex flex-col gap-7">
          <Reveal dir="none">
            <Eyebrow>The Studio</Eyebrow>
          </Reveal>
          <Reveal>
            <h2
              id="studio-title"
              className="font-display text-[clamp(2.4rem,7vw,5.75rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance"
            >
              Not just another website.{" "}
              <span className="text-blue-gradient">A better way to work.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              Behind every business is a collection of processes, people, and opportunities.
              We connect them through technology designed around the way you actually work.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <ul className="flex flex-wrap gap-2">
              {facets.map((facet) => (
                <li
                  key={facet}
                  className="rounded-full border border-line bg-white/70 px-4 py-2 font-mono text-[0.7rem] tracking-[0.18em] text-ink/70 uppercase"
                >
                  {facet}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <ScrollScene className="mx-auto aspect-[11/10] w-full max-w-[620px]">
          <GlossySculpture variant="studio" />
        </ScrollScene>
      </div>
    </section>
  );
}
