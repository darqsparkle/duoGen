export type IndustryIcon =
  | "stethoscope"
  | "flask"
  | "factory"
  | "store"
  | "graduation"
  | "landmark"
  | "truck"
  | "building"
  | "utensils"
  | "sprout"
  | "car"
  | "megaphone"
  | "briefcase"
  | "bag"
  | "cpu"
  | "rocket";

export const industries: {
  id: string;
  name: string;
  icon: IndustryIcon;
  summary: string;
}[] = [
  {
    id: "healthcare",
    name: "Healthcare & Hospitals",
    icon: "stethoscope",
    summary:
      "EMR and EHR systems, OPD appointment booking, patient portals and doctor directories.",
  },
  {
    id: "pharma",
    name: "Pharma & Life Sciences",
    icon: "flask",
    summary:
      "Product catalogues, MR reporting, stockist and distributor tracking, and secondary sales dashboards.",
  },
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    icon: "factory",
    summary:
      "ERP workflows, inventory and BOM tracking, production reports and vendor management.",
  },
  {
    id: "retail",
    name: "Retail & Wholesale",
    icon: "store",
    summary:
      "POS and billing, GST invoicing, multi-store stock sync and sales reports.",
  },
  {
    id: "education",
    name: "Education & E-learning",
    icon: "graduation",
    summary:
      "EdTech platforms, LMS, admission CRM, fee management and student–parent portals.",
  },
  {
    id: "finance",
    name: "Banking, Finance & Insurance",
    icon: "landmark",
    summary:
      "KYC onboarding, loan and claims workflows, and secure reporting built with compliance in mind.",
  },
  {
    id: "logistics",
    name: "Logistics, Transport & Supply Chain",
    icon: "truck",
    summary:
      "Shipment tracking, fleet and route management, proof of delivery and warehouse (WMS) dashboards.",
  },
  {
    id: "real-estate",
    name: "Real Estate & Construction",
    icon: "building",
    summary:
      "Property listings, lead CRM, site-visit scheduling and project progress tracking.",
  },
  {
    id: "hospitality",
    name: "Hotels, Restaurants & Hospitality",
    icon: "utensils",
    summary:
      "Room and table booking, digital menus, POS and PMS integrations and guest messaging.",
  },
  {
    id: "agriculture",
    name: "Agriculture & Agribusiness",
    icon: "sprout",
    summary:
      "Dealer networks, farm input catalogues, procurement and stock tracking.",
  },
  {
    id: "automotive",
    name: "Automotive & Vehicle Services",
    icon: "car",
    summary:
      "Dealer management (DMS), vehicle inventory, service booking and job card workflows.",
  },
  {
    id: "agencies",
    name: "Media, Marketing & Creative Agencies",
    icon: "megaphone",
    summary:
      "Campaign dashboards, lead management, client approvals and project tracking.",
  },
  {
    id: "professional-services",
    name: "Professional & Consulting Services",
    icon: "briefcase",
    summary:
      "Client CRM, appointment booking, document handling and engagement tracking.",
  },
  {
    id: "ecommerce",
    name: "E-commerce & D2C Brands",
    icon: "bag",
    summary:
      "Custom storefronts, order management (OMS), payment gateways and WhatsApp order updates.",
  },
  {
    id: "technology",
    name: "IT, SaaS & Tech Companies",
    icon: "cpu",
    summary:
      "SaaS products, customer portals, API integrations and admin dashboards.",
  },
  {
    id: "startups-smb",
    name: "Startups, Small Businesses & Enterprises",
    icon: "rocket",
    summary:
      "From MVP to scale-up: websites, custom software and connected tools that fit your stage.",
  },
];
