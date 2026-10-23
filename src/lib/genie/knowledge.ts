/**
 * Genie's built-in knowledge: ten ready-made questions with scripted answers.
 * Answers only describe what this website already says — no prices, timelines,
 * client names, or promises that haven't been confirmed.
 */

export type GenieBlock = string | { list: string[] };

export type GenieAction = { label: string; href: string };

export type GenieIntent = {
  id: string;
  /** Shown as a one-tap question chip. */
  question: string;
  /** Lower-case words or phrases that point a typed message at this intent. */
  keywords: string[];
  answer: GenieBlock[];
  actions: GenieAction[];
  /** Suggested next questions (intent ids). */
  followUps: string[];
};

export const genieIntents: GenieIntent[] = [
  {
    id: "services",
    question: "What services does DuoGen offer?",
    keywords: ["service", "services", "offer", "what do you do", "provide", "capabilities", "build"],
    answer: [
      "We design and build end-to-end digital solutions for businesses:",
      {
        list: [
          "Websites and digital experiences",
          "E-commerce and online stores",
          "Billing, inventory, and business management software",
          "CRM and sales systems",
          "Web and mobile applications",
          "Automation and API integrations",
        ],
      },
    ],
    actions: [
      { label: "See all capabilities", href: "/what-we-do" },
      { label: "Start a project", href: "/contact" },
    ],
    followUps: ["website", "automation", "getting-started"],
  },
  {
    id: "website",
    question: "Can you build a website for my business?",
    keywords: ["website", "site", "landing page", "portfolio", "redesign", "web page", "seo"],
    answer: [
      "Yes. We build corporate and business websites, landing pages, portfolios, dynamic sites, and redesigns of existing websites.",
      "Every site is responsive, built for fast loading, and set up with SEO-conscious foundations so customers can find you.",
    ],
    actions: [
      { label: "Website development", href: "/what-we-do#websites" },
      { label: "Discuss a website", href: "/contact?service=websites" },
    ],
    followUps: ["ecommerce", "process", "cost"],
  },
  {
    id: "ecommerce",
    question: "Do you build online stores?",
    keywords: ["ecommerce", "e-commerce", "store", "shop", "sell", "online selling", "cart", "checkout", "catalog", "product"],
    answer: [
      "Yes. We build online stores and product catalogs with filtering, cart and checkout experiences, order management, and customer accounts.",
      "Stores can be prepared for payment-provider integration and connected to your inventory, so stock stays consistent across channels.",
    ],
    actions: [
      { label: "E-commerce solutions", href: "/what-we-do#ecommerce" },
      { label: "Discuss an online store", href: "/contact?service=ecommerce" },
    ],
    followUps: ["billing", "integrations", "cost"],
  },
  {
    id: "billing",
    question: "Can you build billing or inventory software?",
    keywords: ["billing", "invoice", "invoicing", "inventory", "stock", "erp", "employee", "management software", "dashboard", "reports", "reporting"],
    answer: [
      "Yes. We build business management software shaped around how you operate, including:",
      {
        list: [
          "Billing and invoicing",
          "Inventory and stock management",
          "Employee management",
          "Purchase and sales records",
          "Internal dashboards and reports",
          "Approval workflows",
        ],
      },
    ],
    actions: [
      { label: "Business software", href: "/what-we-do#business-software" },
      { label: "Discuss billing & inventory", href: "/contact?need=billing-inventory" },
    ],
    followUps: ["crm", "automation", "process"],
  },
  {
    id: "crm",
    question: "Do you build CRM systems?",
    keywords: ["crm", "lead", "leads", "sales", "pipeline", "customer", "customers", "follow up", "follow-up", "enquiries"],
    answer: [
      "Yes. Our CRM and sales systems keep leads, customer profiles, pipelines, follow-up reminders, activity history, and sales reports in one place.",
      "The goal is simple: fewer missed follow-ups and a clear view of every opportunity.",
    ],
    actions: [
      { label: "CRM & sales systems", href: "/what-we-do#crm" },
      { label: "Discuss a CRM", href: "/contact?service=crm" },
    ],
    followUps: ["automation", "integrations", "getting-started"],
  },
  {
    id: "apps",
    question: "Do you build web and mobile apps?",
    keywords: ["app", "apps", "mobile", "android", "ios", "application", "portal", "saas", "booking", "admin panel", "flutter"],
    answer: [
      "Yes. We build custom web applications and mobile app experiences — customer portals, employee portals, admin panels, booking and appointment systems, and SaaS product interfaces.",
      "Our toolkit includes Next.js, React, and TypeScript on the web, and Flutter for mobile, chosen to suit each project.",
    ],
    actions: [
      { label: "Web & mobile applications", href: "/what-we-do#applications" },
      { label: "Discuss an app idea", href: "/contact?service=applications" },
    ],
    followUps: ["process", "cost", "getting-started"],
  },
  {
    id: "automation",
    question: "How can automation help my business?",
    keywords: ["automation", "automate", "automatic", "workflow", "manual", "repetitive", "notification", "notifications", "save time"],
    answer: [
      "Automation takes repetitive work off your team's plate. For example:",
      {
        list: [
          "Routing new enquiries to the right person automatically",
          "Sending notifications and acknowledgements",
          "Scheduled reports instead of manual compiling",
          "Keeping data in sync between systems",
          "Approval processes that move without chasing",
        ],
      },
    ],
    actions: [
      { label: "Business automation", href: "/what-we-do#automation" },
      { label: "Discuss reducing manual work", href: "/contact?need=reduce-manual-work" },
    ],
    followUps: ["integrations", "crm", "getting-started"],
  },
  {
    id: "integrations",
    question: "Can you connect our existing systems?",
    keywords: ["integrate", "integration", "integrations", "api", "apis", "connect", "sync", "payment gateway", "firebase", "cloud", "existing"],
    answer: [
      "Yes. We connect the tools you already use so data flows between them — payment providers, business APIs, cloud services, CRM and ERP systems, analytics, and Firebase-based setups.",
      "That means less double entry and one consistent view of your business.",
    ],
    actions: [
      { label: "Integrations", href: "/what-we-do#integrations" },
      { label: "Discuss an integration", href: "/contact?need=connect-systems" },
    ],
    followUps: ["automation", "process", "getting-started"],
  },
  {
    id: "process",
    question: "What does your development process look like?",
    keywords: ["process", "how do you work", "how you work", "steps", "approach", "timeline", "stages", "methodology", "how long"],
    answer: [
      "We work in six clear stages, each ending with something you can review:",
      {
        list: [
          "Discover — your business, workflows, and goals",
          "Define — scope, priorities, and a roadmap",
          "Design — wireframes and interface design",
          "Develop — building in focused milestones",
          "Validate & launch — testing and deployment",
          "Improve & expand — ongoing enhancements",
        ],
      },
      "Timelines depend on scope, so we agree on them together once requirements are clear.",
    ],
    actions: [{ label: "See how we work", href: "/how-we-do" }],
    followUps: ["cost", "getting-started", "services"],
  },
  {
    id: "cost",
    question: "How much does a project cost?",
    keywords: ["cost", "price", "pricing", "budget", "how much", "quote", "quotation", "rate", "charges", "fees", "₹"],
    answer: [
      "It depends on what you need — the features, integrations, and scale all shape the effort, so we don't publish fixed prices.",
      "Share your requirements in the enquiry form, and we'll talk through a scope and cost that fits your goals.",
    ],
    actions: [{ label: "Share your requirements", href: "/contact" }],
    followUps: ["process", "getting-started", "services"],
  },
  {
    id: "getting-started",
    question: "How do I get started?",
    keywords: ["start", "get started", "begin", "contact", "talk", "hire", "reach", "call", "email", "next step", "enquiry", "enquire"],
    answer: [
      "Just tell us about your business and what you'd like to improve — you don't need a technical specification.",
      {
        list: [
          "We understand your requirements",
          "We discuss the problem and possible approaches",
          "We define a suitable scope and next steps",
        ],
      },
    ],
    actions: [
      { label: "Start a project", href: "/contact" },
      { label: "Find the right solution", href: "/what-we-do#solution-finder" },
    ],
    followUps: ["cost", "process", "services"],
  },
];

/** The ten ready-made questions shown in the welcome screen. */
export const featuredIntentIds = [
  "services",
  "website",
  "ecommerce",
  "billing",
  "crm",
  "apps",
  "automation",
  "process",
  "cost",
  "getting-started",
];
