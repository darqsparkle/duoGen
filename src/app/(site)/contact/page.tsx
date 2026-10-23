import type { Metadata } from "next";
import { Suspense } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { FaqSection } from "@/components/contact/FaqSection";
import { PrefilledContactForm } from "@/components/contact/PrefilledContactForm";
import { FinalCta } from "@/components/home/FinalCta";
import { LightHero } from "@/components/ui/LightHero";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { contactDetails, hasDirectContact } from "@/lib/constants";
import { contactNextSteps } from "@/lib/process";
import { enquiriesEnabled } from "@/lib/enquiry";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to app and software developers serving Chennai, Salem and clients worldwide. Tell us about your business or idea — no technical specification needed.",
  alternates: { canonical: "/contact" },
};

function DirectContact() {
  if (!hasDirectContact) return null;
  const { email, phone, whatsapp, address } = contactDetails;
  const items = [
    email && { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    phone && { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: whatsapp,
      href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
    },
    address && { icon: MapPin, label: "Address", value: address },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <div className="rounded-[1.75rem] border border-line bg-white p-7">
      <h2 className="font-display text-xl font-semibold tracking-tight">Reach us directly</h2>
      <ul className="mt-5 flex flex-col gap-4">
        {items.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint">
              <Icon aria-hidden className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="text-xs text-muted">{label}</span>
              {href ? (
                <a href={href} className="font-medium underline-offset-4 hover:underline" {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {value}
                </a>
              ) : (
                <span className="font-medium">{value}</span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <LightHero
        path="/contact"
        eyebrow="Contact / 03"
        title={
          <>
            Let&apos;s talk about what you want to <span className="text-blue-gradient">build.</span>
          </>
        }
        description="You don't need a complete technical specification. Tell us about your business, your challenges, or the idea you want to bring to life."
        sculpture="contact"
      />

      <section
        data-nav="light"
        aria-labelledby="enquiry-title"
        className="scene-sheet bg-white pt-20 pb-32 md:pt-28 md:pb-40"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:gap-14 lg:px-8">
          <div>
            <Reveal dir="none">
              <Eyebrow>Project enquiry</Eyebrow>
            </Reveal>
            <Reveal>
              <h2 id="enquiry-title" className="mt-5 mb-10 font-display text-[clamp(2rem,4.4vw,3.5rem)] leading-[1] font-semibold tracking-[-0.035em]">
                Tell us about your project.
              </h2>
            </Reveal>
            <Suspense fallback={<ContactForm />}>
              <PrefilledContactForm />
            </Suspense>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start" aria-label="What happens next">
            <Reveal dir="right">
              <div className="relative overflow-hidden rounded-[1.75rem] bg-navy p-7 text-white">
                <div aria-hidden className="absolute -right-16 -bottom-16 size-56 rounded-full bg-glow/20 blur-3xl" />
                <h2 className="relative font-display text-2xl font-semibold tracking-tight">What happens next?</h2>
                <ol className="relative mt-6 flex flex-col gap-5">
                  {contactNextSteps.map((step) => (
                    <li key={step.number} className="flex gap-4">
                      <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-glow/40 font-mono text-xs text-glow">
                        {step.number}
                      </span>
                      <p className="pt-1.5 leading-relaxed text-white/80">{step.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
            <Reveal dir="right" delay={100}>
              <DirectContact />
            </Reveal>
            <Reveal dir="right" delay={160}>
              <div className="rounded-[1.75rem] border border-dashed border-ink/20 p-6 text-sm leading-relaxed text-muted">
                {enquiriesEnabled ? (
                  <>
                    <p className="font-medium text-ink">Your privacy</p>
                    <p className="mt-1">
                      Your details are saved securely and used by the DuoGen team to respond to
                      your enquiry.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-ink">Frontend demo</p>
                    <p className="mt-1">
                      This form validates in your browser only. Your details are not sent to
                      anyone, saved, or stored in your browser.
                    </p>
                  </>
                )}
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <FaqSection />

      <FinalCta
        eyebrow="Explore"
        title={
          <>
            Every great digital product starts with{" "}
            <span className="text-glow-gradient">a conversation.</span>
          </>
        }
        cta="Explore What We Do"
        href="/what-we-do"
        compact
      />
    </>
  );
}
