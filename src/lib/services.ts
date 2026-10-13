export type ServiceId =
  | "websites"
  | "ecommerce"
  | "business-software"
  | "crm"
  | "applications"
  | "automation"
  | "integrations";

export type Glyph = "web" | "commerce" | "software" | "crm" | "apps" | "automation";

/** Six headline capabilities shown on the homepage. */
export const capabilities: {
  id: ServiceId;
  number: string;
  title: string;
  description: string;
  glyph: Glyph;
}[] = [
  {
    id: "websites",
    number: "01",
    title: "Websites and Digital Experiences",
    description:
      "Corporate websites, landing pages, portfolios, and dynamic business websites.",
    glyph: "web",
  },
  {
    id: "ecommerce",
    number: "02",
    title: "E-commerce and Online Business",
    description:
      "Online stores, product catalogs, checkout experiences, and order management.",
    glyph: "commerce",
  },
  {
    id: "business-software",
    number: "03",
    title: "Business Management Software",
    description:
      "Billing, inventory, employee management, reporting, and internal operations.",
    glyph: "software",
  },
  {
    id: "crm",
    number: "04",
    title: "CRM and Sales Systems",
    description:
      "Customer records, lead tracking, sales pipelines, and follow-up workflows.",
    glyph: "crm",
  },
  {
    id: "applications",
    number: "05",
    title: "Web and Mobile Applications",
    description:
      "Customer portals, employee tools, custom web applications, and mobile experiences.",
    glyph: "apps",
  },
  {
    id: "automation",
    number: "06",
    title: "Automation and Integrations",
    description:
      "Connected systems, enquiry workflows, notifications, API integrations, and repetitive task automation.",
    glyph: "automation",
  },
];

export type ServiceVisual =
  | "browser"
  | "storefront"
  | "dashboard"
  | "crm"
  | "apps"
  | "workflow"
  | "integrations";

/** Detailed service sections for /what-we-do. */
export const serviceDetails: {
  id: ServiceId;
  number: string;
  navLabel: string;
  title: string;
  intro: string;
  points: string[];
  visual: ServiceVisual;
  tone: "light" | "lilac" | "dark";
}[] = [
  {
    id: "websites",
    number: "01",
    navLabel: "Websites",
    title: "Website Development",
    intro:
      "Your website is often the first conversation a customer has with you. We design and build sites that explain what you do clearly, load quickly, and make the next step obvious.",
    points: [
      "Corporate and business websites",
      "Landing pages",
      "Dynamic websites",
      "Portfolio and personal-brand websites",
      "Website redesigns",
      "Responsive user interfaces",
      "SEO-conscious foundations",
    ],
    visual: "browser",
    tone: "light",
  },
  {
    id: "ecommerce",
    number: "02",
    navLabel: "E-commerce",
    title: "E-commerce Solutions",
    intro:
      "From a focused product catalog to a complete online store, we create buying experiences that are easy to browse, easy to trust, and easy to manage behind the scenes.",
    points: [
      "Product catalogs",
      "Product filtering",
      "Cart and checkout interfaces",
      "Payment integration readiness",
      "Order management",
      "Inventory integration",
      "Customer account interfaces",
    ],
    visual: "storefront",
    tone: "lilac",
  },
  {
    id: "business-software",
    number: "03",
    navLabel: "Business Software",
    title: "Business Management Software",
    intro:
      "Replace scattered spreadsheets and manual records with software shaped around your operations — so billing, stock, people, and reports live in one dependable place.",
    points: [
      "Billing and invoicing interfaces",
      "Inventory management",
      "Employee management",
      "Internal dashboards",
      "Purchase and sales records",
      "Operational reporting",
      "Approval workflows",
    ],
    visual: "dashboard",
    tone: "dark",
  },
  {
    id: "crm",
    number: "04",
    navLabel: "CRM",
    title: "CRM and Sales Management",
    intro:
      "Every enquiry deserves a follow-up. We build CRM systems that keep customer history, pipelines, and reminders in view, so your sales team can focus on conversations.",
    points: [
      "Lead management",
      "Customer profiles",
      "Sales pipelines",
      "Follow-up reminders",
      "Activity tracking",
      "Enquiry management",
      "Sales reports",
    ],
    visual: "crm",
    tone: "light",
  },
  {
    id: "applications",
    number: "05",
    navLabel: "Applications",
    title: "Web and Mobile Applications",
    intro:
      "When off-the-shelf tools don't fit, we design and build applications for your customers, your team, or your next product — on the web and on mobile.",
    points: [
      "Custom web applications",
      "Mobile application experiences",
      "Customer portals",
      "Employee portals",
      "Admin panels",
      "Booking and appointment interfaces",
      "SaaS product interfaces",
    ],
    visual: "apps",
    tone: "lilac",
  },
  {
    id: "automation",
    number: "06",
    navLabel: "Automation",
    title: "Business Automation",
    intro:
      "Repetitive work is a signal, not a job description. We connect forms, notifications, approvals, and reports so routine tasks run on their own.",
    points: [
      "Automated enquiry routing",
      "Form-triggered workflows",
      "Notification systems",
      "Scheduled reporting",
      "Data synchronization",
      "Approval processes",
      "API-driven automation",
    ],
    visual: "workflow",
    tone: "dark",
  },
  {
    id: "integrations",
    number: "07",
    navLabel: "Integrations",
    title: "Integrations and Expansion",
    intro:
      "Your systems should talk to each other. We connect the tools you already use and prepare your software to grow with new services and data sources.",
    points: [
      "Payment providers",
      "Business APIs",
      "Cloud services",
      "Firebase readiness",
      "CRM and ERP integrations",
      "Analytics integrations",
      "Data exchange between systems",
    ],
    visual: "integrations",
    tone: "light",
  },
];

export const serviceRibbon = [
  "Web Development",
  "E-commerce",
  "Custom Software",
  "CRM Systems",
  "Mobile Apps",
  "Business Automation",
];

export const heroRibbon = [
  "Websites",
  "E-commerce",
  "Custom Software",
  "CRM Systems",
  "Mobile Apps",
  "Business Automation",
  "Integrations",
];

export type NeedId =
  | "customers-online"
  | "sell-online"
  | "reduce-manual-work"
  | "billing-inventory"
  | "customers-sales"
  | "custom-application"
  | "connect-systems"
  | "explore-idea";

/** Options for the interactive solution finder on /what-we-do. */
export const solutionNeeds: {
  id: NeedId;
  label: string;
  solution: string;
  recommendation: string;
  related: ServiceId;
}[] = [
  {
    id: "customers-online",
    label: "Get more customers online",
    solution: "A modern business website",
    recommendation:
      "A clear, fast, search-conscious website helps the right customers find you, understand what you offer, and get in touch without friction.",
    related: "websites",
  },
  {
    id: "sell-online",
    label: "Sell products online",
    solution: "An e-commerce platform",
    recommendation:
      "An online store with a well-organised catalog, a smooth checkout, and order management behind it lets you sell beyond your physical reach.",
    related: "ecommerce",
  },
  {
    id: "reduce-manual-work",
    label: "Reduce manual work",
    solution: "Workflow automation",
    recommendation:
      "Workflow automation can connect repetitive tasks, notifications, and business processes to reduce unnecessary manual effort.",
    related: "automation",
  },
  {
    id: "billing-inventory",
    label: "Manage billing and inventory",
    solution: "Business management software",
    recommendation:
      "Billing and inventory software keeps invoices, stock levels, and purchase records in one place, with reports you can actually rely on.",
    related: "business-software",
  },
  {
    id: "customers-sales",
    label: "Organize customers and sales",
    solution: "A CRM and sales system",
    recommendation:
      "A CRM gives every lead a home, every customer a history, and every follow-up a reminder — so fewer opportunities slip away.",
    related: "crm",
  },
  {
    id: "custom-application",
    label: "Build a custom application",
    solution: "A custom web or mobile application",
    recommendation:
      "A purpose-built application — a portal, an internal tool, or a new product — designed around the exact workflow your users need.",
    related: "applications",
  },
  {
    id: "connect-systems",
    label: "Connect existing systems",
    solution: "API integrations",
    recommendation:
      "Integrations let your existing tools share data automatically, removing double entry and giving you one consistent view of the business.",
    related: "integrations",
  },
  {
    id: "explore-idea",
    label: "Explore an idea",
    solution: "A discovery conversation",
    recommendation:
      "Not sure what you need yet? A short discovery conversation can turn an early idea into a realistic scope, priorities, and next steps.",
    related: "websites",
  },
];
