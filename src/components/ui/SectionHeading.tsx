import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/animations/Reveal";

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-[0.12em] uppercase",
        tone === "dark"
          ? "border-glow/30 bg-glow/[0.08] text-glow"
          : "border-glow/60 bg-mint/70 text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full bg-glow shadow-[0_0_8px_2px_rgb(124_255_178/0.7)]"
      />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  as: Heading = "h2",
  className,
  titleClassName,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-4xl flex-col gap-5",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <Reveal dir="none">
          <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal>
        <Heading
          className={cn(
            "font-display text-[clamp(2.1rem,5.4vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-balance",
            tone === "dark" ? "text-white" : "text-ink",
            titleClassName,
          )}
        >
          {title}
        </Heading>
      </Reveal>
      {description && (
        <Reveal delay={120}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed sm:text-lg",
              tone === "dark" ? "text-white/65" : "text-muted",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
