"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The signature inward–outward motion. As the wrapped visual approaches it
 * scales up from ~0.9 and fades in (inward); as the user scrolls past it
 * expands slightly and drifts (outward). It only reads scroll position — it
 * never pins, locks, or alters scrolling.
 *
 * mode "inout": full approach + depart (default, for mid-page scenes).
 * mode "out":   departure only (for scenes already on screen at load, e.g. hero).
 *
 * Phones get the settled, static frame: on lower-memory iPhones, many
 * scroll-driven composited layers make Safari drop tiles and paint empty
 * section backgrounds while scrolling.
 */
export function ScrollScene({
  children,
  className,
  mode = "inout",
  drift = 40,
  expand = 0.05,
}: {
  children: ReactNode;
  className?: string;
  mode?: "inout" | "out";
  drift?: number;
  expand?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setSmall(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: mode === "out" ? ["start start", "end start"] : ["start end", "end start"],
  });
  const settled = useMotionValue(mode === "out" ? 0 : 0.5);
  const still = reduce || small;
  const progress = still ? settled : scrollYProgress;

  const scale = useTransform(
    progress,
    mode === "out" ? [0, 1] : [0, 0.4, 0.6, 1],
    mode === "out" ? [1, 1 + expand] : [1 - 0.1, 1, 1, 1 + expand],
  );
  const y = useTransform(
    progress,
    mode === "out" ? [0, 1] : [0, 0.4, 0.6, 1],
    mode === "out" ? [0, -drift] : [drift, 0, 0, -drift],
  );
  const opacity = useTransform(
    progress,
    mode === "out" ? [0, 1] : [0, 0.3, 1],
    mode === "out" ? [1, 0.55] : [0.35, 1, 1],
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, y, opacity }} className={still ? "h-full w-full" : "h-full w-full will-change-transform"}>
        {children}
      </motion.div>
    </div>
  );
}
