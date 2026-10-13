import type { Metadata } from "next";
import { Gauge, Layers, ShieldCheck, Target } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { FinalCta } from "@/components/home/FinalCta";
import { ProcessTimeline } from "@/components/process/ProcessTimeline";
import { Eyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { Marquee } from "@/components/ui/Marquee";
import { techGroups, technicalPrinciples, workingPrinciples } from "@/lib/process";

export const metadata: Metadata = {
  title: "How We Do",
  description:
    "A transparent, collaborative process — discover, define, design, develop, validate, and improve — for digital solutions that work beyond the demo.",
  alternates: { canonical: "/how-we-do" },
};

const principleIcons = { target: Target, layers: Layers, shield: ShieldCheck, gauge: Gauge };

/** Fine emerald line field for the hero background. */
function LineField() {
  return (
    <svg aria-hidden viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 -z-10 h-full w-full">
      <defs>
        <linearGradient id="lf-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7CFFB2" stopOpacity="0" />
          <stop offset="50%" stopColor="#7CFFB2" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7CFFB2" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: 14 }, (_, i) => (
        <path
          key={i}
          d={`M -50 ${120 + i * 38} C 300 ${60 + i * 30}, 800 ${260 + i * 26}, 1250 ${90 + i * 40}`}
          fill="none"
          stroke="url(#lf-fade)"
          strokeWidth={i % 4 === 0 ? 1.4 : 0.7}
          strokeOpacity={0.25 + (i % 3) * 0.15}
          strokeDasharray={i % 4 === 0 ? "6 10" : undefined}
          className={i % 4 === 0 ? "animate-dash" : undefined}
        />
      ))}
    </svg>
  );
}

const allTech = techGroups.flatMap((g) => g.items);

export default function HowWeDoPage() {
  return (
    <>
      <section data-nav="dark" aria-labelledby="page-title" className="relative isolate overflow-hidden bg-navy pt-36 pb-28 text-white md:pt-44 md:pb-36">
        <LineField />
        <div aria-hidden className="absolute bottom-0 left-1/2 -z-10 size-[50rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(124_255_178/0.18),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-rise">
            <Eyebrow tone="dark">Process / 02</Eyebrow>
          </div>
          <h1
            id="page-title"
            className="animate-rise mt-7 font-display text-[clamp(2.6rem,8.6vw,7.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]"
            style={{ animationDelay: "80ms" }}
          >
            Thoughtful planning.
            <br />
            Creative design.
            <br />
            <span className="text-glow-gradient">Solid engineering.</span>
          </h1>
          <p className="animate-rise mt-8 max-w-xl text-lg leading-relaxed text-white/70" style={{ animationDelay: "180ms" }}>
            We turn business requirements into digital solutions through a transparent,
            collaborative development process.
          </p>
        </div>
      </section>

      <section data-nav="dark" aria-labelledby="journey-title" className="relative overflow-hidden bg-navy pb-28 text-white md:pb-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tone="dark"
            eyebrow="The journey"
            title={<span id="journey-title">Six stages, one clear direction.</span>}
            description="Each stage ends with something you can review, so decisions are made with evidence rather than guesswork."
            className="mb-16 md:mb-24"
          />
          <ProcessTimeline />
        </div>
      </section>

      <section data-nav="light" aria-labelledby="principles-title" className="scene-sheet bg-lilac pt-24 pb-32 md:pt-32 md:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Technical principles"
            title={<span id="principles-title">How we think about building software.</span>}
          />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {technicalPrinciples.map((principle, index) => {
              const Icon = principleIcons[principle.icon];
              return (
                <Reveal as="li" key={principle.title} dir={index % 2 ? "right" : "left"} delay={index * 80}>
                  <div className="group flex h-full flex-col gap-10 rounded-[1.75rem] border border-line bg-white p-7 transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_30px_60px_-34px_rgb(17_19_38/0.35)]">
                    <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-mint text-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-glow">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight">{principle.title}</h3>
                      <p className="mt-3 leading-relaxed text-muted">{principle.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section data-nav="light" aria-labelledby="tech-title" className="scene-sheet overflow-hidden bg-white pt-24 pb-32 md:pt-32 md:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Technology ecosystem"
            title={<span id="tech-title">The right tools for the job.</span>}
            description="These are technologies we work with. Each project uses what serves it best — not every project uses all of them."
          />
          <dl className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {techGroups.map((group, index) => (
              <Reveal key={group.group} delay={index * 70} dir="scale">
                <div className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-line bg-lilac p-6">
                  <dt className="font-mono text-[0.65rem] tracking-[0.22em] text-muted uppercase">{group.group}</dt>
                  <dd className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium shadow-[0_1px_0_rgb(17_19_38/0.05)]">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
        <div aria-hidden className="mt-16">
          <Marquee
            items={allTech}
            duration={50}
            renderItem={(item) => (
              <span className="flex items-center font-display text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-ink/15">
                <span className="px-6">{item}</span>
                <span className="text-glow">✦</span>
              </span>
            )}
          />
        </div>
      </section>

      <section data-nav="light" aria-labelledby="working-title" className="scene-sheet bg-lavender pt-24 pb-32 md:pt-32 md:pb-40">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <SectionHeading
            eyebrow="Working principles"
            title={<span id="working-title">What you can expect from working with us.</span>}
            className="lg:sticky lg:top-32 lg:self-start"
          />
          <ol className="flex flex-col">
            {workingPrinciples.map((item, index) => (
              <Reveal as="li" key={item.title} dir="right" delay={index * 60}>
                <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-ink/10 py-7">
                  <span className="font-mono text-sm text-muted">0{index + 1}</span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <FinalCta
        eyebrow="Ready when you are"
        title={
          <>
            Let&apos;s build something that works{" "}
            <span className="text-glow-gradient">beyond the demo.</span>
          </>
        }
        cta="Start Your Project"
        compact
      />
    </>
  );
}
