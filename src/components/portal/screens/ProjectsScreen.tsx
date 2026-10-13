"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, FolderPlus, LoaderCircle, Phone, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { inr, OPEN_PROJECT_STATUSES, PROJECT_STATUS_LABEL, PROJECT_STATUSES, type ProjectStatus } from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { daysUntil, formatDate, useProjects } from "../projects/data";
import { ProjectForm, StatusBadge } from "../projects/ProjectForm";
import { RoleGate } from "../PortalShell";
import { buttonStyles, Card, inputStyles, NoAccess, Notice, PageHeader, StatTile } from "../ui";

function dueLabel(days: number | null) {
  if (days === null) return "";
  if (days < 0) return `${-days}d overdue`;
  if (days === 0) return "Today";
  return `in ${days}d`;
}

export function ProjectsScreen() {
  const { projects, error } = useProjects();
  const router = useRouter();
  const [filter, setFilter] = useState<ProjectStatus | "open" | "all">("open");
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const all = useMemo(() => projects ?? [], [projects]);
  const stats = useMemo(() => {
    const open = all.filter((p) => OPEN_PROJECT_STATUSES.includes(p.status));
    return {
      active: all.filter((p) => p.status === "active").length,
      confirmed: all.filter((p) => p.status === "confirmed").length,
      tentative: all.filter((p) => p.status === "tentative").length,
      pipeline: open.reduce((s, p) => s + p.budget, 0),
    };
  }, [all]);

  const calls = useMemo(
    () =>
      all
        .filter((p) => p.nextCallDate && OPEN_PROJECT_STATUSES.includes(p.status))
        .sort((a, b) => a.nextCallDate!.getTime() - b.nextCallDate!.getTime())
        .slice(0, 6),
    [all],
  );

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return all.filter(
      (p) =>
        (filter === "all" || (filter === "open" ? OPEN_PROJECT_STATUSES.includes(p.status) : p.status === filter)) &&
        (!term || [p.name, p.codeName, p.client].join(" ").toLowerCase().includes(term)),
    );
  }, [all, filter, search]);

  return (
    <RoleGate roles={["admin", "manager"]} fallback={<NoAccess />}>
      <PageHeader
        title="Projects"
        description="Pipeline, delivery dates, follow-up calls and progress. Visible to admins and managers."
        actions={
          <button type="button" onClick={() => setCreating(true)} className={buttonStyles.primary}>
            <FolderPlus aria-hidden className="size-4" /> New project
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="In progress" value={stats.active} />
        <StatTile label="Confirmed" value={stats.confirmed} hint="Ready to start" />
        <StatTile label="Tentative" value={stats.tentative} hint="Not yet confirmed" />
        <StatTile label="Pipeline value" value={inr.format(stats.pipeline)} hint="Budgets of open projects" />
      </div>

      {calls.length > 0 && (
        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <Phone aria-hidden className="size-4" /> Upcoming calls
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {calls.map((p) => {
              const days = daysUntil(p.nextCallDate);
              return (
                <li key={p.id}>
                  <Link href={`/portal/projects/${p.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 hover:border-ink/30">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="block text-xs text-muted">{formatDate(p.nextCallDate)}</span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                        days !== null && days < 0 ? "bg-[#fef3f2] text-[#b42318]" : days !== null && days <= 2 ? "bg-[#fff4d6] text-[#8a5a00]" : "bg-lilac text-ink/70",
                      )}
                    >
                      {dueLabel(days)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search projects</span>
          <Search aria-hidden className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project, code name, client…"
            className={`${inputStyles} pl-9`}
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
          {(["open", ...PROJECT_STATUSES, "all"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={filter === s}
              onClick={() => setFilter(s)}
              className={cn(
                "min-h-9 rounded-full border px-3 text-sm",
                filter === s ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/40",
              )}
            >
              {s === "open" ? "Open" : s === "all" ? "All" : PROJECT_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {error && <Notice>{error}</Notice>}
      {!projects ? (
        <p className="flex items-center gap-2 text-sm text-muted">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading projects…
        </p>
      ) : rows.length === 0 ? (
        <Card className="text-center text-sm text-muted">
          {all.length === 0 ? "No projects yet. Create your first one with “New project”." : "No projects match this filter."}
        </Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {rows.map((p) => {
            const days = daysUntil(p.estDelivery);
            const late = days !== null && days < 0 && OPEN_PROJECT_STATUSES.includes(p.status);
            return (
              <li key={p.id}>
                <Link
                  href={`/portal/projects/${p.id}`}
                  className="flex h-full flex-col gap-4 rounded-[1.5rem] border border-line bg-white p-5 transition-colors hover:border-ink/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display text-lg font-semibold">{p.name}</p>
                      <p className="truncate text-sm text-muted">
                        {[p.codeName && `“${p.codeName}”`, p.client].filter(Boolean).join(" · ") || "No client set"}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>

                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>
                        {p.milestones.filter((m) => m.done).length}/{p.milestones.length} milestones
                      </span>
                      <span className="font-semibold text-ink">{p.progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-lilac" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.name} progress`}>
                      <div className="h-full rounded-full bg-[#1baf7a]" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-muted">Budget</dt>
                      <dd className="font-medium">{p.budget ? inr.format(p.budget) : "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Delivery</dt>
                      <dd className={cn("font-medium", late && "text-[#b42318]")}>
                        {formatDate(p.estDelivery)}
                        {late && <span className="block text-xs font-normal">{dueLabel(days)}</span>}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Next call</dt>
                      <dd className="flex items-center gap-1 font-medium">
                        {p.nextCallDate && <CalendarClock aria-hidden className="size-3.5 text-muted" />}
                        {formatDate(p.nextCallDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Team</dt>
                      <dd className="flex items-center gap-1 font-medium">
                        <Users aria-hidden className="size-3.5 text-muted" /> {p.members.length}
                      </dd>
                    </div>
                  </dl>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {creating && (
        <ProjectForm
          onClose={() => setCreating(false)}
          onCreated={(id) => {
            setCreating(false);
            router.push(`/portal/projects/${id}`);
          }}
        />
      )}
    </RoleGate>
  );
}
