"use client";

import { useEffect, useState } from "react";
import { careersLink, navLinks } from "@/lib/constants";

type NavLink = { href: string; label: string };

// One request per page load, shared by the navbar, mobile menu and footer.
let openings: Promise<boolean> | null = null;
function hasOpenings() {
  openings ??= fetch("/api/careers")
    .then((r) => (r.ok ? r.json() : { count: 0 }))
    .then((data: { count?: number }) => (data.count ?? 0) > 0)
    .catch(() => false);
  return openings;
}

/** Whether any roles are open. False until the check finishes. */
export function useHasOpenings() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let live = true;
    hasOpenings().then((value) => live && setOpen(value));
    return () => {
      live = false;
    };
  }, []);
  return open;
}

/** The main nav links, with Careers before Contact while roles are open. */
export function useNavLinks(): readonly NavLink[] {
  const open = useHasOpenings();
  if (!open) return navLinks;
  return [...navLinks.slice(0, -1), careersLink, navLinks[navLinks.length - 1]];
}
