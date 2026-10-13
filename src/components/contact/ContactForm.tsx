"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CircleAlert, CircleCheck, LoaderCircle, X } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";
import { submitEnquiry } from "@/lib/enquiry";
import {
  budgetOptions,
  contactMethodOptions,
  emptyEnquiry,
  industryOptions,
  serviceOptions,
  validateEnquiry,
  validateField,
  validatedFields,
  type EnquiryErrors,
  type EnquiryField,
  type EnquiryValues,
} from "@/lib/validation";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

export type EnquiryPrefill = {
  label?: string;
  industry?: string;
  services?: string[];
};

const inputBase =
  "w-full rounded-2xl border bg-white px-4 py-3.5 text-base text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-ink/40 focus:border-ink focus:ring-4 focus:ring-glow/50 focus-visible:outline-none";

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {required ? (
          <span className="text-ink/50"> *</span>
        ) : (
          <span className="font-normal text-muted"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-sm text-muted">{hint}</p>}
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="flex items-start gap-1.5 text-sm font-medium text-[#b42318]">
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      {children}
    </p>
  );
}

export function ContactForm({ prefill }: { prefill?: EnquiryPrefill }) {
  const uid = useId();
  const fieldId = (name: string) => `${uid}-${name}`;
  const reduce = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const initialValues: EnquiryValues = {
    ...emptyEnquiry,
    industry: prefill?.industry ?? "",
    services: prefill?.services ?? [],
  };
  const [values, setValues] = useState<EnquiryValues>(initialValues);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState<Partial<Record<EnquiryField, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [showPrefill, setShowPrefill] = useState(Boolean(prefill?.label));

  const update = <K extends EnquiryField>(field: K, value: EnquiryValues[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    // Re-validate fields the user has already visited, so errors clear as they fix them.
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, next) }));
  };

  const blur = (field: EnquiryField) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, values) }));
  };

  const describedBy = (field: EnquiryField, hint = false) =>
    errors[field] ? `${fieldId(field)}-error` : hint ? `${fieldId(field)}-hint` : undefined;

  const toggleService = (service: string) => {
    update(
      "services",
      values.services.includes(service)
        ? values.services.filter((s) => s !== service)
        : [...values.services, service],
    );
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const nextErrors = validateEnquiry(values);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(validatedFields.map((f) => [f, true])));
    const firstInvalid = validatedFields.find((f) => nextErrors[f]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const result = await submitEnquiry(values);
      setMessage(result.message);
      setStatus(result.ok ? "success" : "error");
    } catch {
      setMessage("Something went wrong while preparing your enquiry. Please try again.");
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  function reset() {
    setValues(emptyEnquiry);
    setErrors({});
    setTouched({});
    setStatus("idle");
    setMessage("");
    setShowPrefill(false);
    requestAnimationFrame(() =>
      formRef.current?.querySelector<HTMLElement>('[data-field="fullName"]')?.focus(),
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;
  const submittedOnce = Object.keys(touched).length === validatedFields.length;

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            ref={statusRef}
            tabIndex={-1}
            role="status"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-start gap-6 overflow-hidden rounded-[2rem] bg-navy p-8 text-white outline-none sm:p-12"
          >
            <div aria-hidden className="absolute -top-24 -right-24 size-72 rounded-full bg-glow/25 blur-3xl" />
            <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-glow text-navy">
              <CircleCheck aria-hidden className="size-7" />
            </span>
            <h2 className="relative font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Enquiry ready — demo mode
            </h2>
            <p className="relative max-w-lg text-lg leading-relaxed text-white/75">{message}</p>
            <button
              type="button"
              onClick={reset}
              className="relative inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-6 font-medium hover:border-glow/60 hover:bg-white/5"
            >
              Start a new enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-describedby={`${uid}-required-note`}
            className="flex flex-col gap-7 rounded-[2rem] border border-line bg-lilac/60 p-6 sm:p-10"
          >
            <p id={`${uid}-required-note`} className="text-sm text-muted">
              Fields marked * are required. This is a frontend demo — nothing you enter is sent or stored.
            </p>

            {showPrefill && prefill?.label && (
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-glow/50 bg-mint px-4 py-3 text-sm">
                <span>
                  <span className="text-ink/60">Starting from: </span>
                  <span className="font-medium">{prefill.label}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPrefill(false)}
                  aria-label="Dismiss starting point"
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-full hover:bg-white"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
            )}

            {submittedOnce && errorCount > 0 && (
              <div role="alert" className="rounded-2xl border border-[#b42318]/30 bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
                Please fix {errorCount === 1 ? "1 field" : `${errorCount} fields`} highlighted below.
              </div>
            )}

            {status === "error" && (
              <div role="alert" className="rounded-2xl border border-[#b42318]/30 bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">
                {message}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id={fieldId("fullName")} label="Full name" required error={errors.fullName}>
                <input
                  id={fieldId("fullName")}
                  data-field="fullName"
                  type="text"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  onBlur={() => blur("fullName")}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={describedBy("fullName")}
                  aria-required
                  className={cn(inputBase, errors.fullName ? "border-[#b42318]" : "border-line")}
                />
              </Field>
              <Field id={fieldId("email")} label="Business email" required error={errors.email}>
                <input
                  id={fieldId("email")}
                  data-field="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => blur("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                  aria-required
                  className={cn(inputBase, errors.email ? "border-[#b42318]" : "border-line")}
                />
              </Field>
              <Field id={fieldId("company")} label="Company or organization">
                <input
                  id={fieldId("company")}
                  type="text"
                  autoComplete="organization"
                  value={values.company}
                  onChange={(e) => update("company", e.target.value)}
                  className={cn(inputBase, "border-line")}
                />
              </Field>
              <Field id={fieldId("phone")} label="Phone number" error={errors.phone}>
                <input
                  id={fieldId("phone")}
                  data-field="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  onBlur={() => blur("phone")}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describedBy("phone")}
                  className={cn(inputBase, errors.phone ? "border-[#b42318]" : "border-line")}
                />
              </Field>
            </div>

            <Field id={fieldId("industry")} label="Industry" required error={errors.industry}>
              <select
                id={fieldId("industry")}
                data-field="industry"
                value={values.industry}
                onChange={(e) => {
                  update("industry", e.target.value);
                  setTouched((t) => ({ ...t, industry: true }));
                  setErrors((er) => ({ ...er, industry: e.target.value ? undefined : er.industry }));
                }}
                onBlur={() => blur("industry")}
                aria-invalid={Boolean(errors.industry)}
                aria-describedby={describedBy("industry")}
                aria-required
                className={cn(
                  inputBase,
                  "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23111326%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-11",
                  errors.industry ? "border-[#b42318]" : "border-line",
                  !values.industry && "text-ink/50",
                )}
              >
                <option value="">Select your industry</option>
                {industryOptions.map((option) => (
                  <option key={option} value={option} className="text-ink">
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-medium text-ink">
                Services required <span className="font-normal text-muted">(choose any)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {serviceOptions.map((service) => {
                  const checked = values.services.includes(service);
                  return (
                    <label
                      key={service}
                      className={cn(
                        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-glow/60",
                        checked ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40",
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleService(service)}
                      />
                      <span aria-hidden className={cn("size-2 rounded-full", checked ? "bg-glow" : "bg-ink/20")} />
                      {service}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-medium text-ink">
                Estimated budget <span className="font-normal text-muted">(optional)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {budgetOptions.map((budget) => {
                  const checked = values.budget === budget;
                  return (
                    <label
                      key={budget}
                      className={cn(
                        "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-glow/60",
                        checked ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${uid}-budget`}
                        className="sr-only"
                        checked={checked}
                        onChange={() => update("budget", budget)}
                      />
                      {budget}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Field
              id={fieldId("description")}
              label="Project description"
              required
              error={errors.description}
            >
              <textarea
                id={fieldId("description")}
                data-field="description"
                rows={6}
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
                onBlur={() => blur("description")}
                placeholder="Tell us about your business, the challenges you face, or the digital solution you have in mind."
                aria-invalid={Boolean(errors.description)}
                aria-describedby={describedBy("description")}
                aria-required
                className={cn(inputBase, "resize-y", errors.description ? "border-[#b42318]" : "border-line")}
              />
            </Field>

            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-medium text-ink">
                Preferred contact method <span className="font-normal text-muted">(optional)</span>
              </legend>
              <div className="flex flex-wrap gap-2">
                {contactMethodOptions.map((method) => {
                  const checked = values.contactMethod === method;
                  return (
                    <label
                      key={method}
                      className={cn(
                        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-glow/60",
                        checked ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40",
                      )}
                    >
                      <input
                        type="radio"
                        name={`${uid}-contact-method`}
                        className="sr-only"
                        checked={checked}
                        onChange={() => update("contactMethod", method)}
                      />
                      {method}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink/80">
                <input
                  type="checkbox"
                  data-field="consent"
                  checked={values.consent}
                  onChange={(e) => {
                    update("consent", e.target.checked);
                    if (e.target.checked) setErrors((er) => ({ ...er, consent: undefined }));
                  }}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={describedBy("consent")}
                  aria-required
                  className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-ink"
                />
                <span>
                  I agree that DuoGen Tech Solutions may use the information submitted here to
                  respond to my enquiry. <span className="text-ink/50">*</span>
                </span>
              </label>
              {errors.consent && <ErrorText id={`${fieldId("consent")}-error`}>{errors.consent}</ErrorText>}
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={status === "submitting"}
                aria-disabled={status === "submitting"}
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-medium text-white transition-all duration-300 hover:bg-navy hover:shadow-[0_0_0_4px_rgb(124_255_178/0.45)] disabled:cursor-wait disabled:opacity-80"
              >
                {status === "submitting" ? (
                  <>
                    <LoaderCircle aria-hidden className="size-4 animate-spin" />
                    Preparing your enquiry…
                  </>
                ) : (
                  <>
                    Submit Project Enquiry
                    <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
              <p className="text-sm text-muted" aria-live="polite">
                {status === "submitting" ? "Validating locally…" : ""}
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
