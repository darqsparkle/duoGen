"use client";

import Link from "next/link";
import { careersLink } from "@/lib/constants";
import { useHasOpenings } from "./useNavLinks";

/** Footer entry for Careers, shown only while roles are open. */
export function CareersFooterLink({ className }: { className: string }) {
  const open = useHasOpenings();
  if (!open) return null;
  return (
    <li>
      <Link href={careersLink.href} className={className}>
        {careersLink.label}
      </Link>
    </li>
  );
}
