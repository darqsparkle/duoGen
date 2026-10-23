import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StudioIntro } from "@/components/home/StudioIntro";
import { Capabilities } from "@/components/home/Capabilities";
import { ServicesMarquee } from "@/components/home/ServicesMarquee";
import { IndustryShowcase } from "@/components/home/IndustryShowcase";
import { FloatingEcosystem } from "@/components/home/FloatingEcosystem";
import { ProcessPreview } from "@/components/home/ProcessPreview";
import { FinalCta } from "@/components/home/FinalCta";
import { LocalReach } from "@/components/home/LocalReach";

export const metadata: Metadata = {
  title: { absolute: "App & Software Development Company | DuoGen Tech Solutions" },
  description:
    "DuoGen Tech Solutions builds websites, web and mobile apps, and custom business software for companies in India and around the world.",
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
      <LocalReach />
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
