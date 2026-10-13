import type { Metadata } from "next";
import { FinalCta } from "@/components/home/FinalCta";
import { ServiceNav } from "@/components/services/ServiceNav";
import { ServiceSection } from "@/components/services/ServiceSection";
import { SolutionSelector } from "@/components/services/SolutionSelector";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { LightHero } from "@/components/ui/LightHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceDetails } from "@/lib/services";

export const metadata: Metadata = {
  title: "What We Do",
  description:
    "Websites, e-commerce, business software, CRM, web and mobile applications, automation, and integrations — designed around your business goals.",
  alternates: { canonical: "/what-we-do" },
};

export default function WhatWeDoPage() {
  return (
    <>
      <LightHero
        eyebrow="Capabilities / 01"
        title={
          <>
            We build the systems behind <span className="text-blue-gradient">better businesses.</span>
          </>
        }
        description="From the experience your customers see to the software your team relies on, we design technology around your goals."
        sculpture="services"
        actions={
          <MagneticButton>
            <Button href="/contact" variant="ink" size="lg">
              Discuss Your Requirements
            </Button>
          </MagneticButton>
        }
      />

      <div className="relative bg-white pt-6 pb-6">
        <ServiceNav />
        {serviceDetails.map((service, index) => (
          <ServiceSection key={service.id} service={service} index={index} />
        ))}
      </div>

      <section
        id="solution-finder"
        data-nav="light"
        aria-labelledby="finder-title"
        className="scene-sheet bg-lavender pt-24 pb-32 md:pt-32 md:pb-40"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Solution finder"
            title={<span id="finder-title">What are you trying to improve?</span>}
            description="Choose the goal that sounds most like yours. We'll suggest a starting point you can discuss with us."
          />
          <div className="mt-12">
            <SolutionSelector />
          </div>
        </div>
      </section>

      <FinalCta
        eyebrow="The right fit"
        title={
          <>
            Your business doesn&apos;t need more software.{" "}
            <span className="text-glow-gradient">It needs the right software.</span>
          </>
        }
        cta="Let's Find the Right Solution"
        compact
      />
    </>
  );
}
