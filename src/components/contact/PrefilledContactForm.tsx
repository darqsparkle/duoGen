"use client";

import { useSearchParams } from "next/navigation";
import { industries } from "@/lib/industries";
import { serviceDetails, solutionNeeds, type ServiceId } from "@/lib/services";
import { industryOptions } from "@/lib/validation";
import { ContactForm, type EnquiryPrefill } from "./ContactForm";

/** Maps a service section id onto the form's "Services required" options. */
const serviceToOptions: Record<ServiceId, string[]> = {
  websites: ["Website"],
  ecommerce: ["E-commerce"],
  "business-software": ["Business Management Software", "Billing and Inventory"],
  crm: ["CRM"],
  applications: ["Web Application", "Mobile Application"],
  automation: ["Automation"],
  integrations: ["Integrations"],
};

const industryToOption: Record<string, (typeof industryOptions)[number]> = {
  engineering: "Engineering and Manufacturing",
  healthcare: "Medical and Healthcare",
  construction: "Construction and Real Estate",
  retail: "Retail and E-commerce",
  sales: "Sales and Distribution",
  "professional-services": "Professional Services",
};

/**
 * Reads ?need=, ?service= or ?industry= (set by CTAs elsewhere on the site)
 * and pre-selects matching form options. Values are only read locally.
 */
export function PrefilledContactForm() {
  const params = useSearchParams();
  const prefill: EnquiryPrefill = {};

  const need = solutionNeeds.find((n) => n.id === params.get("need"));
  if (need) {
    prefill.label = need.label;
    prefill.services = need.id === "explore-idea" ? ["Not Sure Yet"] : serviceToOptions[need.related];
  }

  const service = serviceDetails.find((s) => s.id === params.get("service"));
  if (service) {
    prefill.label ??= service.title;
    prefill.services ??= serviceToOptions[service.id];
  }

  const industry = industries.find((i) => i.id === params.get("industry"));
  if (industry) {
    prefill.label ??= `${industry.name} solutions`;
    prefill.industry = industryToOption[industry.id];
  }

  // Remount when the query changes so the form picks up the new starting point.
  return <ContactForm key={params.toString()} prefill={prefill} />;
}
