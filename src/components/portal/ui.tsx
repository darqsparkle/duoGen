"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small shared building blocks for portal screens. */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[1.5rem] border border-line bg-white p-5 sm:p-6", className)}>{children}</div>;
}

export function StatTile({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: "good" | "bad" }) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-xs font-semibold tracking-[0.1em] text-muted uppercase">{label}</p>
      <p
        className={cn(
          "font-display text-2xl font-semibold tracking-tight sm:text-3xl",
          tone === "good" && "text-[#0b7a4b]",
          tone === "bad" && "text-[#b42318]",
        )}
      >
        {value}
      </p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </Card>
  );
}

export const buttonStyles = {
  primary:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-white hover:bg-navy disabled:opacity-50",
  secondary:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-ink/40 disabled:opacity-50",
  danger:
    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#b42318]/30 bg-[#fef3f2] px-4 text-sm font-medium text-[#b42318] hover:bg-[#fde4e1] disabled:opacity-50",
};

export const inputStyles =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base text-ink focus:border-ink focus:ring-4 focus:ring-glow/50 focus:outline-none sm:text-sm";

export function Field({
  label,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm font-medium text-ink", className)}>
      {label}
      {children}
      {error ? (
        <span role="alert" className="text-xs font-medium text-[#b42318]">
          {error}
        </span>
      ) : (
        hint && <span className="text-xs font-normal text-muted">{hint}</span>
      )}
    </label>
  );
}

export function Notice({ tone = "error", children }: { tone?: "error" | "success" | "info"; children: ReactNode }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        tone === "error" && "border-[#b42318]/30 bg-[#fef3f2] text-[#b42318]",
        tone === "success" && "border-glow/60 bg-mint text-[#0b5e3a]",
        tone === "info" && "border-line bg-lilac text-ink/80",
      )}
    >
      {children}
    </p>
  );
}

/** Accessible modal dialog with focus trap and Escape to close. */
export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>("input, select, textarea, button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
        event.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6">
      <div aria-hidden className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative flex max-h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:rounded-[1.5rem] max-sm:rounded-t-[1.5rem]",
          wide ? "sm:max-w-2xl" : "sm:max-w-lg",
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="inline-flex size-9 items-center justify-center rounded-full hover:bg-lilac">
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export function NoAccess() {
  return (
    <Card className="mx-auto max-w-md text-center">
      <h1 className="font-display text-2xl font-semibold">No access</h1>
      <p className="mt-2 text-sm text-muted">Your role doesn&apos;t include this section. Ask an admin if you need access.</p>
    </Card>
  );
}
