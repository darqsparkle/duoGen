import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, Banknote, Building2, MapPin } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { getOpenings } from "@/lib/careers";
import { contactDetails } from "@/lib/constants";
import { WORK_TYPE_LABEL } from "@/lib/portal/model";

// Openings change from the portal at any time, so render on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at DuoGen Tech Solutions. Build practical software for businesses across industries.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const openings = await getOpenings();
  // No open roles: the page doesn't exist, matching the hidden nav link.
  if (!openings.length) notFound();

  return (
    <>
      <section data-nav="dark" aria-labelledby="page-title" className="relative isolate overflow-hidden bg-navy pt-36 pb-28 text-white md:pt-44 md:pb-36">
        <div aria-hidden className="grid-lines-dark absolute inset-0 -z-10" />
        <div aria-hidden className="absolute bottom-0 left-1/2 -z-10 size-[50rem] -translate-x-1/2 translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(124_255_178/0.18),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs path="/careers" tone="dark" />
          <div className="animate-rise mt-7">
            <Eyebrow tone="dark">Careers</Eyebrow>
          </div>
          <h1
            id="page-title"
            className="animate-rise mt-6 max-w-4xl font-display text-[clamp(2.5rem,7.4vw,6rem)] leading-[0.94] font-semibold tracking-[-0.045em] text-balance"
            style={{ animationDelay: "80ms" }}
          >
            Build what businesses <span className="text-glow-gradient">actually use.</span>
          </h1>
          <p className="animate-rise mt-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg" style={{ animationDelay: "160ms" }}>
            We&apos;re a small team building practical software for businesses across many industries. If one of these
            roles fits you, we&apos;d like to hear from you.
          </p>
        </div>
      </section>

      <section aria-labelledby="openings-title" className="scene-sheet bg-lilac pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="openings-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Open roles <span className="text-muted">({openings.length})</span>
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-5">
            {openings.map((job) => (
              <Reveal as="li" key={job.id} className="min-w-0">
                <article className="flex flex-col gap-5 rounded-[1.75rem] border border-line bg-white p-6 sm:p-8">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <h3 className="font-display text-2xl font-semibold tracking-tight">{job.title}</h3>
                    <a
                      href={`mailto:${contactDetails.email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                      className="group/apply inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-ink px-5 text-sm font-medium text-white transition-colors hover:bg-navy"
                    >
                      Apply now
                      <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover/apply:translate-x-0.5 group-hover/apply:-translate-y-0.5" />
                    </a>
                  </div>

                  <ul className="flex flex-wrap gap-2 text-sm">
                    <li className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 font-medium text-[#0b5e3a]">
                      <Building2 aria-hidden className="size-4" />
                      {WORK_TYPE_LABEL[job.workType]}
                    </li>
                    {job.location && (
                      <li className="inline-flex items-center gap-1.5 rounded-full bg-lilac px-3 py-1.5 text-ink/80">
                        <MapPin aria-hidden className="size-4" />
                        {job.location}
                      </li>
                    )}
                    {job.pay && (
                      <li className="inline-flex items-center gap-1.5 rounded-full bg-lilac px-3 py-1.5 text-ink/80">
                        <Banknote aria-hidden className="size-4" />
                        {job.pay}
                      </li>
                    )}
                  </ul>

                  <p className="text-[0.95rem] leading-relaxed whitespace-pre-line text-ink/75">{job.description}</p>
                </article>
              </Reveal>
            ))}
          </ul>

          <p className="mt-10 text-sm text-muted">
            Don&apos;t see a fit? Write to{" "}
            <a href={`mailto:${contactDetails.email}?subject=${encodeURIComponent("Careers at DuoGen")}`} className="font-medium text-ink underline underline-offset-4">
              {contactDetails.email}
            </a>{" "}
            and tell us what you&apos;d like to work on.
          </p>
        </div>
      </section>
    </>
  );
}
