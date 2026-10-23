/**
 * Shared data model for the DuoGen portal. Used by the browser (forms, tables)
 * and the server (API validation), so the rules live in one place.
 */

export const ROLES = ["admin", "manager", "employee"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  employee: "Employee",
};

export const SEXES = ["Male", "Female", "Other", "Prefer not to say"] as const;
export type Sex = (typeof SEXES)[number];

/** Suggestions only — the tagline field accepts any designation. */
export const TAGLINE_SUGGESTIONS = [
  "Founder",
  "Co-founder",
  "CEO",
  "CTO",
  "Lead Engineer",
  "Senior Engineer",
  "Engineer",
  "Designer",
  "Project Manager",
  "Sales Executive",
  "Intern",
];

export type UserProfile = {
  uid: string;
  name: string;
  username: string;
  email: string;
  sex: Sex;
  role: Role;
  tagline: string;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  createdBy?: string;
};

// ---------------------------------------------------------------------------
// Validation (shared by the create/edit forms and the server API)
// ---------------------------------------------------------------------------

export const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9._]{1,28})[a-z0-9]$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export type UserInput = {
  name: string;
  username: string;
  email: string;
  sex: string;
  role: string;
  tagline: string;
  password?: string;
  active?: boolean;
};

/** Returns field → message. `requirePassword` is true when creating a user. */
export function validateUserInput(input: UserInput, requirePassword: boolean) {
  const errors: Partial<Record<keyof UserInput, string>> = {};
  if (input.name.trim().length < 2 || input.name.trim().length > 80) errors.name = "Enter a name (2–80 characters).";
  if (!USERNAME_PATTERN.test(normalizeUsername(input.username)))
    errors.username = "3–30 characters: lowercase letters, numbers, dots or underscores; must start and end with a letter or number.";
  if (!EMAIL_PATTERN.test(input.email.trim())) errors.email = "Enter a valid email address.";
  if (!(SEXES as readonly string[]).includes(input.sex)) errors.sex = "Choose an option.";
  if (!(ROLES as readonly string[]).includes(input.role)) errors.role = "Choose a role.";
  if (input.tagline.trim().length < 2 || input.tagline.trim().length > 60)
    errors.tagline = "Enter a designation (2–60 characters), e.g. Lead Engineer.";
  if (requirePassword || input.password) {
    const password = input.password ?? "";
    if (password.length < 8) errors.password = "Use at least 8 characters.";
    else if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
      errors.password = "Include at least one letter and one number.";
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Finance
// ---------------------------------------------------------------------------

export const ENTRY_TYPES = ["income", "expense"] as const;
export type EntryType = (typeof ENTRY_TYPES)[number];

export const CATEGORIES: Record<EntryType, string[]> = {
  income: ["Client payment", "Project advance", "Retainer", "Product sales", "Investment", "Other income"],
  expense: [
    "Salaries",
    "Rent",
    "Software & tools",
    "Hardware",
    "Marketing",
    "Travel",
    "Utilities",
    "Taxes & fees",
    "Professional services",
    "Office supplies",
    "Other expense",
  ],
};

export const PAYMENT_METHODS = ["Bank transfer", "UPI", "Cash", "Card", "Cheque", "Other"] as const;
export const ENTRY_STATUSES = ["completed", "pending"] as const;
export type EntryStatus = (typeof ENTRY_STATUSES)[number];

export type FinanceEntry = {
  id: string;
  /** Optional project tag ("" when untagged). */
  projectId: string;
  type: EntryType;
  amount: number;
  category: string;
  date: Date;
  description: string;
  party: string;
  paymentMethod: string;
  reference: string;
  status: EntryStatus;
  notes: string;
};

export const ENQUIRY_STATUSES = ["new", "contacted", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const inrCompact = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const PROJECT_STATUSES = ["tentative", "confirmed", "active", "on-hold", "completed", "cancelled"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  tentative: "Tentative",
  confirmed: "Confirmed",
  active: "In progress",
  "on-hold": "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Statuses that still count as live work in the pipeline. */
export const OPEN_PROJECT_STATUSES: ProjectStatus[] = ["tentative", "confirmed", "active", "on-hold"];

export type Milestone = {
  id: string;
  title: string;
  dueDate: Date | null;
  done: boolean;
  doneAt: Date | null;
};

export type ProjectMember = { uid: string; projectRole: string };

export type Project = {
  id: string;
  name: string;
  codeName: string;
  client: string;
  description: string;
  budget: number;
  status: ProjectStatus;
  estDelivery: Date | null;
  nextCallDate: Date | null;
  progress: number;
  milestones: Milestone[];
  members: ProjectMember[];
  memberIds: string[];
  updatedAt: Date | null;
};

/** Public-ish staff card (no email/sex) — readable by admins and managers. */
export type DirectoryEntry = {
  uid: string;
  name: string;
  username: string;
  tagline: string;
  role: Role;
  active: boolean;
};

export const PROJECT_ROLE_SUGGESTIONS = [
  "Project Lead",
  "Developer",
  "Frontend Developer",
  "Backend Developer",
  "Designer",
  "QA / Tester",
  "Account Manager",
];

/** Percentage of milestones done (0 when there are none). */
export function milestoneProgress(milestones: Milestone[]) {
  if (!milestones.length) return 0;
  return Math.round((milestones.filter((m) => m.done).length / milestones.length) * 100);
}

export const WORK_TYPES = ["remote", "hybrid", "on-site"] as const;
export type WorkType = (typeof WORK_TYPES)[number];

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  "on-site": "In-office",
};

/** A job opening shown on the public careers page. */
export type Career = {
  id: string;
  title: string;
  description: string;
  pay: string;
  workType: WorkType;
  location: string;
  updatedAt: Date | null;
};

/** Field limits, mirrored in firestore.rules. */
export const CAREER_LIMITS = { title: [2, 120], description: [20, 5000], pay: [0, 120], location: [0, 120] } as const;

export type CareerInput = Pick<Career, "title" | "description" | "pay" | "workType" | "location">;

export function validateCareer(input: CareerInput) {
  const errors: Partial<Record<keyof CareerInput, string>> = {};
  const title = input.title.trim();
  const description = input.description.trim();
  if (title.length < CAREER_LIMITS.title[0]) errors.title = "Enter the role (at least 2 characters).";
  else if (title.length > CAREER_LIMITS.title[1]) errors.title = "Keep the role under 120 characters.";
  if (description.length < CAREER_LIMITS.description[0]) errors.description = "Describe the job (at least 20 characters).";
  else if (description.length > CAREER_LIMITS.description[1]) errors.description = "Keep the description under 5,000 characters.";
  if (input.pay.trim().length > CAREER_LIMITS.pay[1]) errors.pay = "Keep the pay under 120 characters.";
  if (input.location.trim().length > CAREER_LIMITS.location[1]) errors.location = "Keep the location under 120 characters.";
  if (!WORK_TYPES.includes(input.workType)) errors.workType = "Choose a work type.";
  return errors;
}
