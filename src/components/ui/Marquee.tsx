import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Seamless decorative marquee. The track holds two identical copies and moves
 * by exactly -50%, so the loop never jumps. The clone is hidden from assistive
 * technology, motion pauses on hover, and it stops under reduced motion.
 */
export function Marquee({
  items,
  duration = 40,
  reverse = false,
  repeat = 2,
  className,
  renderItem,
}: {
  items: string[];
  duration?: number;
  reverse?: boolean;
  /** Repeats the list inside each copy so one copy is wider than the viewport. */
  repeat?: number;
  className?: string;
  renderItem: (item: string, index: number) => ReactNode;
}) {
  const run = Array.from({ length: repeat }, () => items).flat();
  const copy = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
      role={hidden ? undefined : "list"}
    >
      {run.map((item, index) => (
        <li key={`${item}-${index}`} className="flex shrink-0 items-center">
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={cn("marquee-mask group/marquee overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max group-hover/marquee:[animation-play-state:paused]",
          reverse ? "motion-safe:animate-marquee-reverse" : "motion-safe:animate-marquee",
        )}
        style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
      >
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}
