export const processPreview = [
  {
    number: "01",
    title: "Discover",
    description:
      "We learn how your business works, where time is lost, and what success should look like.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "We shape clear journeys and interfaces, so you can see the solution before it is built.",
  },
  {
    number: "03",
    title: "Develop",
    description:
      "We build in focused milestones with regular progress updates along the way.",
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "We test, launch, and agree on how the product keeps improving after go-live.",
  },
];

export const journey = [
  {
    number: "01",
    title: "Discover",
    summary: "Understand the business, its workflows, challenges, and goals.",
    activities: [
      "Initial discussion",
      "Requirement discovery",
      "Current workflow analysis",
      "Problem definition",
    ],
    deliverable: "Documented goals and requirements.",
  },
  {
    number: "02",
    title: "Define",
    summary: "Translate requirements into a realistic solution plan.",
    activities: [
      "Feature prioritization",
      "Scope definition",
      "Technical feasibility",
      "Initial roadmap",
    ],
    deliverable: "Proposed scope and project direction.",
  },
  {
    number: "03",
    title: "Design",
    summary: "Create an experience that is clear, intuitive, and consistent.",
    activities: [
      "Information architecture",
      "Wireframes",
      "UI design",
      "Interactive prototypes where appropriate",
    ],
    deliverable: "Reviewed design direction.",
  },
  {
    number: "04",
    title: "Develop",
    summary: "Build the solution with maintainability and scalability in mind.",
    activities: [
      "Frontend implementation",
      "Backend development when required",
      "Database planning",
      "API integrations",
      "Application logic",
    ],
    deliverable: "Working development build.",
  },
  {
    number: "05",
    title: "Validate and Launch",
    summary: "Test essential functionality and prepare for deployment.",
    activities: [
      "Responsive testing",
      "Functional testing",
      "Accessibility checks",
      "Integration testing",
      "Deployment preparation",
    ],
    deliverable: "Tested release and launch plan.",
  },
  {
    number: "06",
    title: "Improve and Expand",
    summary: "Continue evolving the product as requirements change.",
    activities: [
      "Feedback review",
      "Feature enhancements",
      "Integrations",
      "Workflow improvements",
      "Maintenance where agreed",
    ],
    deliverable: "Prioritized improvement plan.",
  },
];

export const technicalPrinciples = [
  {
    title: "Business-first engineering",
    description: "Start with the problem and select technology that serves it.",
    icon: "target",
  },
  {
    title: "Maintainable architecture",
    description:
      "Use reusable components, clear conventions, and practical structures.",
    icon: "layers",
  },
  {
    title: "Security-conscious design",
    description:
      "Consider data protection, access control, validation, and secure integrations.",
    icon: "shield",
  },
  {
    title: "Performance and accessibility",
    description:
      "Build responsive experiences that remain useful across devices and user needs.",
    icon: "gauge",
  },
] as const;

export const techGroups = [
  { group: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { group: "Backend and APIs", items: ["Node.js", "REST APIs"] },
  { group: "Cloud and data", items: ["Firebase", "Managed cloud services"] },
  { group: "Mobile", items: ["Flutter"] },
  { group: "Automation", items: ["Webhooks", "APIs", "Workflow automation"] },
];

export const workingPrinciples = [
  {
    title: "Clear scope before implementation",
    description:
      "We agree on what is being built, and what is not, before development begins.",
  },
  {
    title: "Prioritized features",
    description:
      "The most valuable features come first, so useful software arrives sooner.",
  },
  {
    title: "Documented milestones",
    description:
      "Progress is broken into milestones that are written down and easy to review.",
  },
  {
    title: "Regular progress communication",
    description:
      "You see the work as it develops, rather than waiting for a single big reveal.",
  },
  {
    title: "Transparent scope changes",
    description:
      "When requirements change, we discuss the impact openly before acting on it.",
  },
  {
    title: "Agreed launch and support",
    description:
      "Launch steps and post-launch support expectations are agreed up front.",
  },
];

export const contactNextSteps = [
  { number: "01", text: "Understand your requirements." },
  { number: "02", text: "Discuss the problem and potential approaches." },
  { number: "03", text: "Define a suitable project scope and next steps." },
];
