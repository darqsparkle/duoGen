import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StudioIntro } from "@/components/home/StudioIntro";
import { Capabilities } from "@/components/home/Capabilities";
import { ServicesMarquee } from "@/components/home/ServicesMarquee";
import { IndustryShowcase } from "@/components/home/IndustryShowcase";
import { FloatingEcosystem } from "@/components/home/FloatingEcosystem";
import { ProcessPreview } from "@/components/home/ProcessPreview";
import { FinalCta } from "@/components/home/FinalCta";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <StudioIntro />
      <ServicesMarquee />
      <IndustryShowcase />
      <FloatingEcosystem />
      <ProcessPreview />
      <FinalCta
        eyebrow="Start here"
        title={
          <>
            Have an idea?
            <br />
            <span className="text-glow-gradient">Let&apos;s make it work.</span>
          </>
        }
        description="Tell us what your business needs. We will help you explore the right digital solution."
        cta="Start a Conversation"
      />
    </>
  );
}
