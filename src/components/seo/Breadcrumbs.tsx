import Link from "next/link";
import { cn } from "@/lib/cn";
import { breadcrumbSchema, breadcrumbTrail, type NavPath } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/** Visible Home › page trail plus its BreadcrumbList structured data. */
export function Breadcrumbs({ path, tone = "light" }: { path: NavPath; tone?: "light" | "dark" }) {
  const trail = breadcrumbTrail(path);
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", tone === "dark" ? "text-white/60" : "text-muted")}>
      <JsonLd data={breadcrumbSchema(path)} />
      <ol className="flex flex-wrap items-center gap-2">
        {trail.map((link, index) => {
          const current = index === trail.length - 1;
          return (
            <li key={link.href} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden>/</span>}
              {current ? (
                <span aria-current="page" className={tone === "dark" ? "text-white" : "text-ink"}>
                  {link.label}
                </span>
              ) : (
                <Link href={link.href} className="underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
