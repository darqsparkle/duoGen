import { careersLink, contactDetails, navLinks, privacyLink, siteConfig, socialLinks } from "./constants";

/** schema.org structured data builders, rendered with <JsonLd />. */

/**
 * Cities we serve. Only in structured data and the keywords meta tag, never as
 * on-page text: Google treats hidden or stuffed city lists as spam.
 */
export const servedCities = [
  // Tamil Nadu
  "Chennai", "Salem", "Coimbatore", "Madurai", "Tiruchirappalli", "Erode", "Tiruppur", "Vellore",
  // Rest of India
  "Bengaluru", "Hyderabad", "Mumbai", "Pune", "Delhi", "Gurugram", "Noida", "Kolkata", "Ahmedabad", "Kochi", "Jaipur",
  // International
  "Dubai", "Abu Dhabi", "Riyadh", "Doha", "Singapore", "Kuala Lumpur", "London", "New York", "San Francisco", "Toronto", "Sydney", "Melbourne",
];

/** Search phrases for the keywords meta tag (ignored by Google, read by some other engines). */
export const seoKeywords = [
  "app developers",
  "application developers near me",
  "mobile app development company",
  "software development company",
  "web development company",
  ...servedCities.flatMap((city) => [`app developers in ${city}`, `software company in ${city}`]),
];

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
    areaServed: [...servedCities.map((name) => ({ "@type": "City", name })), { "@type": "Country", name: "India" }, "Worldwide"],
    knowsAbout: [
      "Mobile app development",
      "Web application development",
      "Website development",
      "Custom software development",
      "E-commerce development",
      "CRM development",
      "Business process automation",
      "API integrations",
    ],
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

export type NavPath = (typeof navLinks)[number]["href"] | typeof careersLink.href | typeof privacyLink.href;

/** Home › page trail for a top-level page. */
export function breadcrumbTrail(path: NavPath) {
  const home = navLinks[0];
  const page = [...navLinks, careersLink, privacyLink].find((link) => link.href === path) ?? home;
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
