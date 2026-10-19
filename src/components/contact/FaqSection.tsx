import { Plus } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/faqs";
import { faqSchema } from "@/lib/seo";

/** Native <details> accordion: answers stay in the HTML for crawlers and work without JS. */
export function FaqSection() {
  return (
    <section
      data-nav="light"
      aria-labelledby="faq-title"
      className="scene-sheet bg-lilac pt-24 pb-32 md:pt-32 md:pb-40"
    >
      <JsonLd data={faqSchema(faqs)} />
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title={<span id="faq-title">Questions before you reach out.</span>}
          className="lg:sticky lg:top-32 lg:self-start"
        />
        <ul className="flex flex-col">
          {faqs.map(({ question, answer }) => (
            <li key={question} className="border-t border-ink/10">
              <details className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-xl font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                  {question}
                  <Plus aria-hidden className="mt-1 size-5 shrink-0 transition-transform duration-300 group-open:rotate-45" />
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">{answer}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
