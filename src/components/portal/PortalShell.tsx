"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  UserCog,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/navigation/Logo";
import { ROLE_LABEL, type Role } from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { usePortal } from "./PortalProvider";

type NavItem = { href: string; label: string; icon: LucideIcon; roles: Role[] };

/** Sidebar entries; each is shown only to the roles listed. */
export const PORTAL_NAV: NavItem[] = [
  { href: "/portal", label: "Overview", icon: LayoutDashboard, roles: ["admin", "manager", "employee"] },
  { href: "/portal/projects", label: "Projects", icon: FolderKanban, roles: ["admin", "manager"] },
  { href: "/portal/finance", label: "Finance", icon: Wallet, roles: ["admin"] },
  { href: "/portal/users", label: "Users", icon: Users, roles: ["admin"] },
  { href: "/portal/enquiries", label: "Enquiries", icon: Inbox, roles: ["admin", "manager"] },
  { href: "/portal/manager", label: "Manager panel", icon: Briefcase, roles: ["admin", "manager"] },
  { href: "/portal/employee", label: "Employee panel", icon: UserCog, roles: ["admin", "employee"] },
];

function Centered({ children }: { children: ReactNode }) {
  return <div className="flex min-h-dvh flex-1 items-center justify-center bg-lilac p-6">{children}</div>;
}

export function PortalShell({ children }: { children: ReactNode }) {
  const { user, profile, signOut, can } = usePortal();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user === null) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [user, router, pathname]);

  if (user === undefined || user === null || profile === undefined) {
    return (
      <Centered>
        <p className="flex items-center gap-2 text-muted">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading your workspace…
        </p>
      </Centered>
    );
  }

  if (!profile || !profile.active) {
    return (
      <Centered>
        <div className="max-w-md rounded-[1.5rem] border border-line bg-white p-8 text-center">
          <h1 className="font-display text-2xl font-semibold">
            {profile ? "Account deactivated" : "Account not set up"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {profile
              ? "Your portal access has been turned off. Contact an admin if you think this is a mistake."
              : `${user.email} can sign in, but no portal profile exists for it yet. Ask an admin to add you.`}
          </p>
          <button
            type="button"
            onClick={() => signOut()}
            className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-ink/40"
          >
            <LogOut aria-hidden className="size-4" /> Sign out
          </button>
        </div>
      </Centered>
    );
  }

  const items = PORTAL_NAV.filter((item) => can(...item.roles));
  const isActive = (href: string) => (href === "/portal" ? pathname === href : pathname.startsWith(href));
  const initials = profile.name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sidebar = (
    <nav aria-label="Portal" className="flex h-full flex-col gap-6 p-4">
      <Link href="/portal" className="rounded-xl px-2 py-1 text-white" onClick={() => setMenuOpen(false)}>
        <Logo />
      </Link>
      <ul className="flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                isActive(href) ? "bg-glow text-navy" : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-2">
        <Link
          href="/"
          className="flex min-h-9 items-center gap-2 rounded-xl px-3 text-xs text-white/50 hover:text-white"
        >
          <ExternalLink aria-hidden className="size-3.5" /> View website
        </Link>
        <Link
          href="/portal/account"
          onClick={() => setMenuOpen(false)}
          aria-current={isActive("/portal/account") ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-2xl border p-3 transition-colors",
            isActive("/portal/account") ? "border-glow/60 bg-white/5" : "border-white/10 hover:border-white/25",
          )}
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-glow to-cyan font-display text-sm font-bold text-navy">
            {initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-white">{profile.name}</span>
            <span className="block truncate text-xs text-white/55">
              {profile.tagline} · {ROLE_LABEL[profile.role]}
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm text-white/70 hover:bg-white/5 hover:text-white"
        >
          <LogOut aria-hidden className="size-4" /> Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-dvh flex-1 bg-lilac">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 bg-navy lg:block">{sidebar}</aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div aria-hidden className="absolute inset-0 bg-navy/60" onClick={() => setMenuOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85vw] bg-navy">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-3 inline-flex size-9 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
            >
              <X aria-hidden className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="inline-flex size-10 items-center justify-center rounded-full border border-line"
          >
            <Menu aria-hidden className="size-5" />
          </button>
          <Logo tone="light" compact />
          <span className="text-xs font-medium text-muted">{ROLE_LABEL[profile.role]}</span>
        </header>
        <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

/** Renders children only for the given roles. */
export function RoleGate({ roles, children, fallback }: { roles: Role[]; children: ReactNode; fallback?: ReactNode }) {
  const { can } = usePortal();
  return <>{can(...roles) ? children : fallback ?? null}</>;
}
