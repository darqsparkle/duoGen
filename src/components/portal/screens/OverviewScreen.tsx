"use client";

import { collection, getCountFromServer, getFirestore, query, where } from "firebase/firestore";
import Link from "next/link";
import { ArrowRight, Briefcase, Inbox, Sparkles, UserCog, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { firebaseApp, ENQUIRIES } from "@/lib/firebase/client";
import { ROLE_LABEL } from "@/lib/portal/model";
import { FinanceSummary } from "../finance/FinanceSummary";
import { usePortal } from "../PortalProvider";
import { Card, PageHeader, StatTile } from "../ui";

function useCount(collectionName: string, enabled: boolean, field?: string, value?: string) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const ref = collection(getFirestore(firebaseApp()), collectionName);
    getCountFromServer(field ? query(ref, where(field, "==", value)) : ref)
      .then((snap) => setCount(snap.data().count))
      .catch(() => setCount(null));
  }, [collectionName, enabled, field, value]);
  return count;
}

function PanelLink({ href, icon: Icon, title, text }: { href: string; icon: typeof Wallet; title: string; text: string }) {
  return (
    <Link href={href} className="group flex items-start gap-3 rounded-[1.25rem] border border-line bg-white p-4 transition-colors hover:border-ink/30">
      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-mint text-ink">
        <Icon aria-hidden className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 font-semibold">
          {title}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
        </span>
        <span className="block text-sm text-muted">{text}</span>
      </span>
    </Link>
  );
}

/** A placeholder panel for dashboards that are still being designed. */
export function ComingSoonPanel({ title, points }: { title: string; points: string[] }) {
  return (
    <Card className="flex flex-col gap-3">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-lavender px-3 py-1 text-xs font-semibold text-[#3b4bb8]">
        <Sparkles aria-hidden className="size-3.5" /> Coming soon
      </span>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="text-sm text-muted">This dashboard is being designed. Planned ideas to discuss:</p>
      <ul className="list-inside list-disc text-sm text-ink/80">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </Card>
  );
}

export function OverviewScreen() {
  const { profile, can } = usePortal();
  const isAdmin = can("admin");
  const isLead = can("admin", "manager");
  const users = useCount("users", isAdmin);
  const newEnquiries = useCount(ENQUIRIES, isLead, "status", "new");
  if (!profile) return null;

  const firstName = profile.name.split(" ")[0];
  return (
    <>
      <PageHeader
        title={`Hi, ${firstName}`}
        description={`${profile.tagline} · ${ROLE_LABEL[profile.role]}`}
      />

      {isLead && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile label="New enquiries" value={newEnquiries ?? "—"} hint="Waiting for a reply" />
          {isAdmin && <StatTile label="Team members" value={users ?? "—"} />}
        </div>
      )}

      {isAdmin && (
        <>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-xl font-semibold">This financial year</h2>
            <Link href="/portal/finance" className="text-sm font-medium underline-offset-4 hover:underline">
              Open finance →
            </Link>
          </div>
          <FinanceSummary period="fy" />
          <h2 className="font-display text-xl font-semibold">Admin panel</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <PanelLink href="/portal/finance" icon={Wallet} title="Finance" text="Record income and expenses, see growth." />
            <PanelLink href="/portal/users" icon={Users} title="Users" text="Add team members, roles and designations." />
            <PanelLink href="/portal/enquiries" icon={Inbox} title="Enquiries" text="Respond to website enquiries." />
            <PanelLink href="/portal/manager" icon={Briefcase} title="Manager panel" text="What managers see." />
            <PanelLink href="/portal/employee" icon={UserCog} title="Employee panel" text="What employees see." />
          </div>
        </>
      )}

      {!isAdmin && profile.role === "manager" && <ManagerPanel />}
      {profile.role === "employee" && <EmployeePanel />}
    </>
  );
}

export function ManagerPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PanelLink href="/portal/enquiries" icon={Inbox} title="Enquiries" text="See and respond to website enquiries." />
      <ComingSoonPanel title="Manager dashboard" points={["Team workload and assignments", "Project status at a glance", "Approvals"]} />
    </div>
  );
}

export function EmployeePanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ComingSoonPanel title="Employee dashboard" points={["My tasks and projects", "Leave and attendance", "Announcements"]} />
    </div>
  );
}
