import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Globe2, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { contactDetails, siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How DuoGen Tech Solutions collects, uses and protects personal data under India's Digital Personal Data Protection Act, 2023 — for visitors and clients in India and worldwide.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "24 October 2026";
const { email } = contactDetails;

function Mail({ subject }: { subject?: string }) {
  const href = subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
  return (
    <a href={href} className="font-medium text-ink underline underline-offset-4 hover:text-navy">
      {email}
    </a>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-glow">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const sections: { id: string; title: string; body: ReactNode }[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <>
        <p>
          {siteConfig.name} (&ldquo;DuoGen&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a technology company based in
          India. We design and build websites, web and mobile applications, business software, automation and
          integrations for organisations in India and abroad.
        </p>
        <p>
          For personal data collected through this website, DuoGen is the <strong>Data Fiduciary</strong> under the
          Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;) — that is, we decide why and how it is
          processed.
        </p>
      </>
    ),
  },
  {
    id: "scope",
    title: "What this policy covers",
    body: (
      <p>
        This policy explains how we handle personal data when you visit duogen.in, send us an enquiry, chat with our
        site assistant, apply for a role or otherwise contact us. It is written to meet the DPDP Act, 2023 and the
        Digital Personal Data Protection Rules, 2025, the Information Technology Act, 2000 and the Information
        Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules,
        2011. Personal data we handle for clients inside their projects is governed by the agreement for that project
        (see section 13).
      </p>
    ),
  },
  {
    id: "what-we-collect",
    title: "Personal data we collect",
    body: (
      <>
        <p>We only collect what we need to respond to you and run this website:</p>
        <List
          items={[
            <>
              <strong>Project enquiries.</strong> Your name, email address, company, phone number (optional),
              industry, the services you are interested in, your project description and your preferred contact
              methods — exactly what you type into the contact form.
            </>,
            <>
              <strong>Direct messages.</strong> Whatever you choose to share when you email, call or message us on
              WhatsApp.
            </>,
            <>
              <strong>Job applications.</strong> Your CV and any details you send when you apply for a role by email.
            </>,
            <>
              <strong>Site assistant (Genie).</strong> The questions you type into the chat and the recent
              conversation, so it can answer. Please don&apos;t share personal details in the chat.
            </>,
            <>
              <strong>Technical data.</strong> Your IP address, browser type and the pages requested, which our
              hosting provider records in standard server logs and which we use to keep the site secure and to limit
              abuse.
            </>,
          ]}
        />
        <p>
          We do not ask for sensitive personal data such as passwords of other services, financial account details,
          health or biometric information through this website.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How we use it",
    body: (
      <List
        items={[
          "To reply to your enquiry, understand your requirements and prepare a proposal.",
          "To contact you by the methods you chose.",
          "To consider your job application.",
          "To answer questions through the site assistant.",
          "To keep the website secure, prevent misuse and fix problems.",
          "To meet our legal, tax and accounting obligations.",
        ]}
      />
    ),
  },
  {
    id: "consent",
    title: "Consent and legal grounds",
    body: (
      <>
        <p>
          We process your personal data on the basis of the consent you give — for example, by ticking the consent box
          on the contact form or by writing to us — or for the &ldquo;legitimate uses&rdquo; the DPDP Act allows, such
          as information you share with us voluntarily for a specific purpose and compliance with the law.
        </p>
        <p>
          You can withdraw your consent at any time by emailing <Mail subject="Withdraw consent" />. Withdrawing is as
          easy as giving consent. It won&apos;t affect anything we did before you withdrew, and we will stop processing
          the data unless the law requires us to keep it.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>
          We do not sell or rent your personal data, and we do not use it for third-party advertising. We share it only
          with service providers that help us run this website, under their own privacy and security commitments:
        </p>
        <List
          items={[
            <>
              <strong>Google Firebase / Google Cloud</strong> — stores enquiries and our team portal data.
            </>,
            <>
              <strong>Google Gemini API</strong> — generates the site assistant&apos;s answers from your questions.
            </>,
            <>
              <strong>Cloudflare</strong> — hosts and delivers the website.
            </>,
            <>
              <strong>Our email provider</strong> — for messages you send us.
            </>,
          ]}
        />
        <p>
          We may also disclose personal data where required by Indian law, a court order or a lawful request from a
          government authority.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    body: (
      <p>
        The public website does not use advertising or tracking cookies and does not run third-party analytics. Our
        mini-game saves your best score in your browser&apos;s local storage; it never leaves your device and you can
        clear it at any time. The private team portal uses storage needed to keep staff signed in.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep enquiry and application data only as long as needed for the purpose it was collected — typically up to
        three years after our last interaction, so we can follow up on discussions — and then erase it, unless a longer
        period is required by law (for example, tax and accounting records of clients). Site assistant conversations are
        not stored by us. You can ask us to erase your data sooner (see section 10).
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        We follow reasonable security practices as required by the Information Technology Act, 2000 and its rules:
        encrypted connections (HTTPS), access to enquiry data limited to authorised team members through role-based
        accounts, database security rules that block public access, and service providers with recognised security
        certifications. No method of transmission or storage is completely secure, but we work to protect your data
        and review our safeguards regularly.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    body: (
      <>
        <p>Under the DPDP Act, 2023, you have the right to:</p>
        <List
          items={[
            "Get a summary of the personal data we hold about you and how we process it.",
            "Have inaccurate or incomplete data corrected and updated.",
            "Have your data erased when it is no longer needed or when you withdraw consent.",
            "Withdraw consent at any time.",
            "Have your grievances addressed by our Grievance Officer.",
            "Nominate another person to exercise these rights if you die or become unable to do so.",
          ]}
        />
        <p>
          To exercise any of these rights, email <Mail subject="Privacy request" />. We may ask you to confirm your
          identity before acting on a request. If you are not satisfied with our response, you may complain to the Data
          Protection Board of India.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        This website is meant for businesses and adults. We do not knowingly collect personal data from anyone under 18
        without verifiable consent from a parent or lawful guardian, as the DPDP Act requires. If you believe a child
        has sent us personal data, contact us and we will delete it.
      </p>
    ),
  },
  {
    id: "breaches",
    title: "Data breaches",
    body: (
      <p>
        If a personal data breach occurs, we will act to contain it and will notify the Data Protection Board of India
        and the affected individuals as required by the DPDP Act and Rules, explaining what happened, the likely impact
        and the steps we are taking.
      </p>
    ),
  },
  {
    id: "international",
    title: "International visitors and clients",
    body: (
      <>
        <p>
          {siteConfig.name} is based in India and provides services to clients in other countries. Visitors and
          prospective clients from outside India are welcome to contact us, submit project enquiries or share business
          information through our website.
        </p>
        <p>
          Where applicable, we handle personal information in line with the relevant data protection and privacy
          laws. Depending on the services offered, where the individuals concerned are located and the nature of the
          processing, additional legal requirements may apply — for example, the EU or UK General Data Protection
          Regulation.
        </p>
        <p>
          If we process personal information on behalf of a client, each party&apos;s responsibilities, the security
          measures that apply and any required data-processing arrangements are set out in the project agreement.
        </p>
        <p>
          Our service providers may store or process data outside India. Where personal information is transferred
          internationally, we apply the safeguards required by applicable law, and we do not transfer data to any
          country restricted by the Government of India under the DPDP Act.
        </p>
        <p>
          For questions about international privacy matters, contact <Mail subject="International privacy question" />.
        </p>
      </>
    ),
  },
  {
    id: "grievance-officer",
    title: "Grievance Officer and contact",
    body: (
      <>
        <p>
          If you have a question, request or complaint about how we handle personal data, contact our Grievance
          Officer:
        </p>
        <div className="rounded-2xl border border-line bg-lilac/60 p-5">
          <p className="font-medium text-ink">Grievance Officer, {siteConfig.name}</p>
          <p className="mt-1">
            Email: <Mail subject="Grievance — personal data" />
          </p>
        </div>
        <p>
          We will acknowledge your message promptly and aim to resolve it within one month, and in any case within the
          time required by law.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy as our services or the law change. The date at the top shows when it was last
        updated. If a change materially affects how we use personal data you have already given us, we will tell you
        and, where needed, ask for your consent again.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section data-nav="light" aria-labelledby="page-title" className="relative isolate overflow-hidden bg-lilac pt-32 pb-16 md:pt-40 md:pb-20">
        <div aria-hidden className="grid-lines-light absolute inset-0 -z-10" />
        <div aria-hidden className="absolute -top-40 -right-40 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(124_255_178/0.25),transparent_60%)]" />
        <div className="mx-auto flex max-w-5xl flex-col gap-7 px-4 sm:px-6 lg:px-8">
          <Breadcrumbs path="/privacy" />
          <div className="animate-rise">
            <Eyebrow>Legal</Eyebrow>
          </div>
          <h1
            id="page-title"
            className="animate-rise font-display text-[clamp(2.5rem,7vw,5.25rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance"
            style={{ animationDelay: "80ms" }}
          >
            Privacy Policy
          </h1>
          <p className="animate-rise max-w-2xl text-base leading-relaxed text-muted sm:text-lg" style={{ animationDelay: "160ms" }}>
            Plain-language answers on what we collect, why, and the choices you have — wherever in the world you
            are.
          </p>
          <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>

          <ul className="grid gap-3 sm:grid-cols-2">
            <li className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-sm leading-relaxed text-ink/80">
              <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-[#0b7a4b]" />
              Follows India&apos;s Digital Personal Data Protection Act, 2023 and the IT Act, 2000.
            </li>
            <li className="flex gap-3 rounded-2xl border border-line bg-white p-4 text-sm leading-relaxed text-ink/80">
              <Globe2 aria-hidden className="mt-0.5 size-5 shrink-0 text-[#0b7a4b]" />
              Working with a client outside India? See{" "}
              <a href="#international" className="font-medium text-ink underline underline-offset-4">
                International visitors and clients
              </a>
              .
            </li>
          </ul>
        </div>
      </section>

      <section data-nav="light" className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[14rem_1fr] lg:px-8">
          <nav aria-label="On this page" className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="font-mono text-[0.65rem] tracking-[0.22em] text-muted uppercase">On this page</h2>
            <ol className="mt-4 flex flex-col gap-2 text-sm">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="flex gap-2 text-ink/65 hover:text-ink">
                    <span className="w-5 shrink-0 font-mono text-xs text-muted">{i + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="flex min-w-0 flex-col gap-12">
            {sections.map((section, i) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-32">
                <h2 id={`${section.id}-title`} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  <span className="mr-3 font-mono text-base text-muted">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                <div className="mt-4 flex flex-col gap-4 text-[0.97rem] leading-relaxed text-ink/75">{section.body}</div>
              </section>
            ))}

            <p className="rounded-2xl bg-lilac p-5 text-sm text-ink/70">
              Questions about this policy or a project? <Link href="/contact" className="font-medium text-ink underline underline-offset-4">Contact us</Link>{" "}
              or email <Mail />.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
