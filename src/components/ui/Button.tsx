import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, CirclePlay } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "glow" | "ink" | "light" | "outline-dark" | "outline-light";

const variants: Record<Variant, string> = {
  glow:
    "bg-glow text-navy shadow-[0_0_0_1px_rgb(124_255_178/0.6),0_10px_40px_-12px_rgb(124_255_178/0.7)] hover:bg-fresh hover:shadow-[0_0_0_1px_rgb(183_255_206/0.9),0_14px_50px_-8px_rgb(124_255_178/0.9)]",
  ink: "bg-ink text-white hover:bg-navy shadow-[0_10px_30px_-14px_rgb(17_19_38/0.8)] hover:shadow-[0_14px_40px_-12px_rgb(17_19_38/0.6),0_0_0_4px_rgb(124_255_178/0.35)]",
  light: "bg-white text-ink hover:bg-mint",
  "outline-dark":
    "border border-white/20 text-white hover:border-glow/60 hover:bg-white/5",
  "outline-light":
    "border border-ink/15 text-ink hover:border-ink/40 hover:bg-white",
};

const icons = {
  "up-right": ArrowUpRight,
  down: ArrowDown,
  right: ArrowRight,
  play: CirclePlay,
};

const iconMotion = {
  "up-right": "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5",
  down: "group-hover/btn:translate-y-0.5",
  right: "group-hover/btn:translate-x-1",
  play: "group-hover/btn:scale-110",
};

export function Button({
  href,
  children,
  variant = "glow",
  icon = "right",
  size = "md",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: keyof typeof icons | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = icon ? icons[icon] : null;
  return (
    <Link
      href={href}
      className={cn(
        "group/btn inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-out-expo",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-6 py-3 text-[0.95rem]",
        size === "lg" && "px-7 py-4 text-base",
        variants[variant],
        className,
      )}
    >
      {Icon && icon === "play" && <Icon aria-hidden className={cn("size-5 shrink-0 transition-transform duration-300", iconMotion.play)} />}
      <span>{children}</span>
      {Icon && icon !== "play" && (
        <Icon
          aria-hidden
          className={cn("size-4 shrink-0 transition-transform duration-300", iconMotion[icon!])}
        />
      )}
    </Link>
  );
}
