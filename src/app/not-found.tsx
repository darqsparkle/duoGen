import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { GlowRing } from "@/components/visuals/GlowRing";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section
      data-nav="dark"
      aria-labelledby="not-found-title"
      className="relative isolate flex min-h-dvh items-center overflow-hidden bg-navy py-32 text-white"
    >
      <div aria-hidden className="grid-lines-dark absolute inset-0 -z-10" />
      <GlowRing className="absolute top-1/2 left-1/2 -z-10 w-[min(120vw,820px)] -translate-x-1/2 -translate-y-1/2 opacity-70" />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 px-4 text-center">
        <Eyebrow tone="dark">Error 404</Eyebrow>
        <h1
          id="not-found-title"
          className="font-display text-[clamp(2.6rem,8vw,6rem)] leading-[0.95] font-semibold tracking-[-0.045em]"
        >
          This page drifted <span className="text-glow-gradient">out of orbit.</span>
        </h1>
        <p className="max-w-md text-lg text-white/70">
          The page you are looking for doesn&apos;t exist or has moved. Let&apos;s get you back on course.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/" icon="right">Back to Home</Button>
          <Button href="/what-we-do" variant="outline-dark">See What We Do</Button>
        </div>
      </div>
    </section>
  );
}
