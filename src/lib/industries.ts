export type IndustryId =
  | "engineering"
  | "healthcare"
  | "construction"
  | "retail"
  | "sales"
  | "professional-services";

export type IndustryIcon =
  | "factory"
  | "stethoscope"
  | "building"
  | "store"
  | "trending"
  | "briefcase";

export const industries: {
  id: IndustryId;
  name: string;
  icon: IndustryIcon;
  summary: string;
  problem: string;
  solution: string;
  preview: "dashboard" | "booking" | "estimator" | "catalog" | "pipeline" | "portal";
}[] = [
  {
    id: "engineering",
    name: "Engineering and Manufacturing",
    icon: "factory",
    summary:
      "Asset tracking, operations dashboards, inventory systems, and internal workflows.",
    problem:
      "Equipment status, stock levels, and job progress live in spreadsheets that are out of date almost as soon as they are saved.",
    solution:
      "A central operations dashboard with asset tracking, live inventory, and approval workflows the whole team can rely on.",
    preview: "dashboard",
  },
  {
    id: "healthcare",
    name: "Medical and Healthcare",
    icon: "stethoscope",
    summary:
      "Professional digital presence, appointment enquiry interfaces, and administrative tools.",
    problem:
      "Patients struggle to find accurate information, and enquiries arrive through scattered calls, messages, and walk-ins.",
    solution:
      "A trustworthy, accessible website with structured appointment enquiries and a simple administrative view for front-desk staff.",
    preview: "booking",
  },
  {
    id: "construction",
    name: "Construction and Real Estate",
    icon: "building",
    summary:
      "Cost estimators, quotation tools, enquiry management, and project dashboards.",
    problem:
      "Every quotation is calculated by hand, so prospects wait days for a number and some never come back.",
    solution:
      "An online cost estimator and quotation tool that feeds qualified enquiries straight into a project dashboard.",
    preview: "estimator",
  },
  {
    id: "retail",
    name: "Retail and E-commerce",
    icon: "store",
    summary: "Product catalogs, online selling, inventory, and order management.",
    problem:
      "Selling only in-store limits reach, and stock counts rarely match between the shelf and the records.",
    solution:
      "An online catalog and store connected to inventory and order management, so every channel sees the same stock.",
    preview: "catalog",
  },
  {
    id: "sales",
    name: "Sales and Distribution",
    icon: "trending",
    summary: "CRM, lead management, sales reporting, and follow-up automation.",
    problem:
      "Leads slip through the cracks because follow-ups depend on memory, notebooks, and personal phones.",
    solution:
      "A CRM with clear pipelines, automatic follow-up reminders, and sales reports that show what is working.",
    preview: "pipeline",
  },
  {
    id: "professional-services",
    name: "Professional Services",
    icon: "briefcase",
    summary:
      "Bookings, customer portals, workflow tools, and business reporting.",
    problem:
      "Scheduling, document requests, and status updates quietly consume hours that should go to client work.",
    solution:
      "Online booking, a secure client portal, and workflow tools with reporting that keeps everyone informed.",
    preview: "portal",
  },
];
