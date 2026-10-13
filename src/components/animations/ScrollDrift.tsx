"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Moves an element along (x, y) as the page scrolls through its first
 * `distance` pixels. Used to push hero objects outward as the visitor leaves.
 * Movement is reduced on small screens and disabled under reduced motion.
 */
export function ScrollDrift({
  children,
  x = 0,
  y = 0,
  distance = 800,
  className,
}: {
  children: ReactNode;
  x?: number;
  y?: number;
  distance?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [factor, setFactor] = useState(1);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setFactor(query.matches ? 0.3 : 1);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const k = reduce ? 0 : factor;
  const { scrollY } = useScroll();
  const tx = useTransform(scrollY, [0, distance], [0, x * k]);
  const ty = useTransform(scrollY, [0, distance], [0, y * k]);
  return (
    <motion.div style={{ x: tx, y: ty }} className={className}>
      {children}
    </motion.div>
  );
}
