export const industryOptions = [
  "Engineering and Manufacturing",
  "Medical and Healthcare",
  "Retail and E-commerce",
  "Construction and Real Estate",
  "Sales and Distribution",
  "Professional Services",
  "Technology and Startups",
  "Other",
] as const;

export const serviceOptions = [
  "Website",
  "E-commerce",
  "CRM",
  "Billing and Inventory",
  "Business Management Software",
  "Web Application",
  "Mobile Application",
  "Automation",
  "Integrations",
  "Not Sure Yet",
] as const;

export const budgetOptions = [
  "Still Exploring",
  "Under ₹25,000",
  "₹25,000–₹50,000",
  "₹50,000–₹1,00,000",
  "₹1,00,000–₹3,00,000",
  "₹3,00,000+",
  "Prefer to Discuss",
] as const;

export const contactMethodOptions = ["Email", "Phone", "WhatsApp"] as const;

export type EnquiryValues = {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  industry: string;
  services: string[];
  budget: string;
  description: string;
  contactMethod: string;
  consent: boolean;
};

export type EnquiryField = keyof EnquiryValues;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const emptyEnquiry: EnquiryValues = {
  fullName: "",
  email: "",
  company: "",
  phone: "",
  industry: "",
  services: [],
  budget: "",
  description: "",
  contactMethod: "",
  consent: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/;

export function isValidEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

/** Validates one field. Returns an error message, or undefined when valid. */
export function validateField(
  field: EnquiryField,
  values: EnquiryValues,
): string | undefined {
  switch (field) {
    case "fullName":
      if (!values.fullName.trim()) return "Please enter your full name.";
      if (values.fullName.trim().length < 2) return "Your name looks too short.";
      return;
    case "email":
      if (!values.email.trim()) return "Please enter your business email.";
      if (!isValidEmail(values.email))
        return "Please enter a valid email address, like name@company.com.";
      return;
    case "phone":
      if (values.phone.trim() && !PHONE_PATTERN.test(values.phone.trim()))
        return "Please enter a valid phone number, or leave this field empty.";
      return;
    case "industry":
      if (!values.industry) return "Please select your industry.";
      return;
    case "description":
      if (!values.description.trim())
        return "Please tell us a little about your project.";
      if (values.description.trim().length < 20)
        return "Please add a little more detail (at least 20 characters).";
      return;
    case "consent":
      if (!values.consent) return "Please confirm that we may use these details to respond.";
      return;
    default:
      return;
  }
}

/** Field order matters: the first error receives focus on submit. */
export const validatedFields: EnquiryField[] = [
  "fullName",
  "email",
  "phone",
  "industry",
  "description",
  "consent",
];

export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};
  for (const field of validatedFields) {
    const message = validateField(field, values);
    if (message) errors[field] = message;
  }
  return errors;
}
