"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Menu } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { useNavLinks } from "./useNavLinks";

type Theme = "dark" | "light";

/** Reads the theme of whichever `[data-nav]` scene currently sits under the bar. */
function sceneThemeAt(y: number): Theme {
  let theme: Theme = "light";
  for (const el of document.querySelectorAll<HTMLElement>("[data-nav]")) {
    const rect = el.getBoundingClientRect();
    // Later scenes overlap earlier ones, so the last match is the visible one.
    if (rect.top <= y && rect.bottom > y) theme = el.dataset.nav as Theme;
  }
  return theme;
}

export function Navbar() {
  const pathname = usePathname();
  const navLinks = useNavLinks();
  const [theme, setTheme] = useState<Theme>("dark");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      setTheme(sceneThemeAt(44));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  const dark = theme === "dark";
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-5">
        <nav
          aria-label="Main"
          className={cn(
            "pointer-events-auto mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 rounded-full border pr-2 pl-5 backdrop-blur-xl transition-[background-color,border-color,box-shadow,color] duration-500",
            dark
              ? "border-white/10 text-white"
              : "border-line text-ink",
            dark && (scrolled ? "bg-navy/80 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]" : "bg-navy/40"),
            !dark && (scrolled ? "bg-white/85 shadow-[0_20px_50px_-24px_rgb(17_19_38/0.35)]" : "bg-white/60"),
          )}
        >
          <Link href="/" aria-label="DuoGen Tech Solutions — home" className="shrink-0 rounded-full">
            <Logo tone={dark ? "dark" : "light"} compact />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative block px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? dark ? "text-glow" : "text-ink"
                        : dark ? "text-white/70 hover:text-white" : "text-ink/60 hover:text-ink",
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden
                        className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-glow shadow-[0_0_10px_2px_rgb(124_255_178/0.7)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className={cn(
                "group/cta hidden min-h-11 items-center gap-1.5 rounded-full px-5 text-sm font-medium transition-all duration-300 sm:inline-flex",
                dark
                  ? "bg-glow text-navy hover:bg-fresh hover:shadow-[0_0_30px_-4px_rgb(124_255_178/0.8)]"
                  : "bg-ink text-white hover:bg-navy hover:shadow-[0_0_0_4px_rgb(124_255_178/0.45)]",
              )}
            >
              Start a Project
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover/cta:translate-x-0.5" />
            </Link>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className={cn(
                "inline-flex size-12 items-center justify-center rounded-full border transition-colors lg:hidden",
                dark ? "border-white/15 hover:bg-white/10" : "border-line hover:bg-lilac",
              )}
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        isActive={isActive}
      />
    </>
  );
}
