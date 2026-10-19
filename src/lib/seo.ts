import { contactDetails, navLinks, siteConfig, socialLinks } from "./constants";

/** schema.org structured data builders, rendered with <JsonLd />. */

const absolute = (path: string) => new URL(path, siteConfig.url).toString();
const organizationId = absolute("/#organization");

export function organizationSchema() {
  const { email, phone, address } = contactDetails;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: absolute("/"),
    logo: absolute("/icon.svg"),
    description: siteConfig.description,
    ...(email && { email }),
    ...(phone && { telephone: phone }),
    ...(address && { address }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks.map((link) => link.href) }),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absolute("/#website"),
    name: siteConfig.name,
    url: absolute("/"),
    publisher: { "@id": organizationId },
  };
}

export type NavPath = (typeof navLinks)[number]["href"];

/** Home › page trail for a top-level page. */
export function breadcrumbTrail(path: NavPath) {
  const home = navLinks[0];
  const page = navLinks.find((link) => link.href === path) ?? home;
  return page === home ? [home] : [home, page];
}

export function breadcrumbSchema(path: NavPath) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbTrail(path).map((link, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: link.label,
      item: absolute(link.href),
    })),
  };
}

export function faqSchema(faqs: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}
