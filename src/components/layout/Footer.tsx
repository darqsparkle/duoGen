import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/navigation/Logo";
import { contactDetails, navLinks, siteConfig, socialLinks } from "@/lib/constants";
import { CareersFooterLink } from "@/components/navigation/CareersFooterLink";
import { serviceDetails } from "@/lib/services";

const footerLink = "text-white/75 underline-offset-4 transition-colors hover:text-glow hover:underline";

export function Footer() {
  const { email, phone } = contactDetails;
  return (
    <footer data-nav="dark" className="relative overflow-hidden bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-t border-white/10 pt-14 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex max-w-sm flex-col gap-5 lg:col-span-1">
            <Link href="/" aria-label="DuoGen Tech Solutions — home" className="self-start rounded-full">
              <Logo />
            </Link>
            <p className="leading-relaxed text-white/60">{siteConfig.description}</p>
            <p className="font-display text-lg text-mint">{siteConfig.footerTagline}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-mono text-[0.65rem] tracking-[0.22em] text-white/40 uppercase">Navigate</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
              <CareersFooterLink className={footerLink} />
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[0.65rem] tracking-[0.22em] text-white/40 uppercase">Services</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {serviceDetails.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/what-we-do#${service.id}`}
                    className="text-white/75 underline-offset-4 transition-colors hover:text-glow hover:underline"
                  >
                    {service.navLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h2 className="font-mono text-[0.65rem] tracking-[0.22em] text-white/40 uppercase">Get in touch</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="text-white/75 hover:text-glow">{email}</a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-white/75 hover:text-glow">{phone}</a>
                </li>
              )}
              <li>
                <Link href="/contact" className="group inline-flex items-center gap-1.5 text-glow underline-offset-4 hover:underline">
                  Send a project enquiry
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            </ul>
            {socialLinks.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center rounded-full border border-white/15 px-4 text-sm text-white/75 hover:border-glow/50 hover:text-white"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <p
          aria-hidden
          className="mt-20 font-display text-[clamp(4rem,22vw,20rem)] leading-[0.8] font-bold tracking-[-0.06em] text-transparent select-none [-webkit-text-stroke:1px_rgb(124_255_178/0.25)]"
        >
          DuoGen
        </p>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Designed and engineered in-house.</p>
        </div>
      </div>
    </footer>
  );
}
