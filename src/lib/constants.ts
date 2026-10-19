export const siteConfig = {
  name: "DuoGen Tech Solutions",
  shortName: "DuoGen",
  statement: "Your business. Reimagined through technology.",
  description:
    "We design and build the digital experiences, applications, and intelligent systems that help businesses work smarter and grow.",
  footerTagline: "Built with intent. Designed for what's next.",
  // Canonical origin for metadata, sitemap.xml and robots.txt. www is the primary
  // Vercel domain (duogen.in redirects to it), so production defaults to it.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production" ? "https://www.duogen.in" : "http://localhost:3000"),
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/what-we-do", label: "What We Do" },
  { href: "/how-we-do", label: "How We Do" },
  { href: "/contact", label: "Contact Us" },
] as const;

function configured(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Official contact details. Values come from environment variables and stay
 * hidden in the UI until set — never hard-code placeholder details. The email
 * defaults to the real public inbox.
 * NEXT_PUBLIC_* variables must be referenced literally so Next.js can inline them.
 */
export const contactDetails = {
  email: configured(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "connect@duogen.in",
  phone: configured(process.env.NEXT_PUBLIC_CONTACT_PHONE),
  whatsapp: configured(process.env.NEXT_PUBLIC_CONTACT_WHATSAPP),
  address: configured(process.env.NEXT_PUBLIC_CONTACT_ADDRESS),
};

export const socialLinks = [
  { label: "LinkedIn", href: configured(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN) },
  { label: "Instagram", href: configured(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM) },
  { label: "X", href: configured(process.env.NEXT_PUBLIC_SOCIAL_X) },
].filter((link): link is { label: string; href: string } => Boolean(link.href));

export const hasDirectContact = Object.values(contactDetails).some(Boolean);
