"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
  UserMinus,
  UserPlus,
  X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import {
  inr,
  OPEN_PROJECT_STATUSES,
  PROJECT_ROLE_SUGGESTIONS,
  PROJECT_STATUS_LABEL,
  PROJECT_STATUSES,
  ROLE_LABEL,
  type FinanceEntry,
  type Milestone,
  type Project,
  type ProjectStatus,
} from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { EntryForm } from "../finance/EntryForm";
import { totals, useFinanceEntries } from "../finance/data";
import { MilestoneTrack } from "../projects/MilestoneTrack";
import { ProjectForm, StatusBadge } from "../projects/ProjectForm";
import {
  daysUntil,
  deleteProject,
  formatDate,
  fromInputDate,
  newId,
  postUpdate,
  saveProject,
  toInputDate,
  useDirectory,
  useProject,
  useProjectUpdates,
} from "../projects/data";
import { usePortal } from "../PortalProvider";
import { RoleGate } from "../PortalShell";
import { buttonStyles, Card, inputStyles, NoAccess, Notice, StatTile } from "../ui";

type Tab = "pipeline" | "team" | "updates" | "finance";

export function ProjectDetailScreen() {
  const { id } = useParams<{ id: string }>();
  return (
    <RoleGate roles={["admin", "manager"]} fallback={<NoAccess />}>
      <ProjectDetail id={id} />
    </RoleGate>
  );
}

function ProjectDetail({ id }: { id: string }) {
  const project = useProject(id);
  const { user, can } = usePortal();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("pipeline");
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");

  if (project === undefined) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading project…
      </p>
    );
  }
  if (project === null) {
    return (
      <Card className="text-center">
        <p className="font-display text-xl font-semibold">Project not found</p>
        <Link href="/portal/projects" className="mt-2 inline-block text-sm underline">
          Back to projects
        </Link>
      </Card>
    );
  }

  /** Save a modified copy of the project; surfaces rule/permission errors. */
  async function save(next: Project) {
    if (!user) return;
    setError("");
    try {
      await saveProject(next, user.uid);
    } catch (err) {
      console.error("[project] save failed", err);
      setError("Couldn't save that change. Please try again.");
    }
  }

  const days = daysUntil(project.estDelivery);
  const tabs: { id: Tab; label: string; show: boolean }[] = [
    { id: "pipeline", label: "Pipeline", show: true },
    { id: "team", label: `Team (${project.members.length})`, show: true },
    { id: "updates", label: "Updates", show: true },
    { id: "finance", label: "Finance", show: can("admin") },
  ];

  return (
    <>
      <Link href="/portal/projects" className="inline-flex w-fit items-center gap-1.5 text-sm text-muted hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" /> All projects
      </Link>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h1>
            {project.codeName && (
              <span className="rounded-full border border-line bg-white px-2.5 py-0.5 font-mono text-xs">“{project.codeName}”</span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">{project.client || "No client set"}</p>
          {project.description && <p className="mt-3 max-w-2xl text-sm whitespace-pre-line text-ink/80">{project.description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="project-status">
            Status
          </label>
          <select
            id="project-status"
            value={project.status}
            onChange={(e) => save({ ...project, status: e.target.value as ProjectStatus })}
            className={`${inputStyles} w-auto`}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PROJECT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setEditing(true)} className={buttonStyles.secondary}>
            <Pencil aria-hidden className="size-4" /> Edit details
          </button>
          {can("admin") &&
            (confirmDelete ? (
              <button
                type="button"
                onClick={async () => {
                  await deleteProject(project.id);
                  router.replace("/portal/projects");
                }}
                className={buttonStyles.danger}
              >
                Confirm delete
              </button>
            ) : (
              <button type="button" onClick={() => setConfirmDelete(true)} className={buttonStyles.danger} aria-label="Delete project">
                <Trash2 aria-hidden className="size-4" />
              </button>
            ))}
        </div>
      </div>

      {error && <Notice>{error}</Notice>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Status" value={<StatusBadge status={project.status} className="text-sm" />} />
        <StatTile label="Budget" value={project.budget ? inr.format(project.budget) : "—"} />
        <StatTile
          label="Estimated delivery"
          value={formatDate(project.estDelivery)}
          tone={days !== null && days < 0 && OPEN_PROJECT_STATUSES.includes(project.status) ? "bad" : undefined}
          hint={days === null ? "Not set" : days < 0 ? `${-days} days overdue` : days === 0 ? "Due today" : `${days} days left`}
        />
        <StatTile label="Next call" value={formatDate(project.nextCallDate)} hint={project.nextCallDate ? undefined : "No follow-up scheduled"} />
      </div>

      <div role="tablist" aria-label="Project sections" className="flex gap-1 overflow-x-auto border-b border-line">
        {tabs
          .filter((t) => t.show)
          .map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap",
                tab === t.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          ))}
      </div>

      {tab === "pipeline" && <Pipeline project={project} save={save} />}
      {tab === "team" && <Team project={project} save={save} />}
      {tab === "updates" && <Updates project={project} />}
      {tab === "finance" && can("admin") && <ProjectFinance project={project} />}

      {editing && <ProjectForm project={project} onClose={() => setEditing(false)} />}
    </>
  );
}

// --- Pipeline -----------------------------------------------------------------

function Pipeline({ project, save }: { project: Project; save: (p: Project) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDue, setEditDue] = useState("");
  const ms = project.milestones;
  const update = (milestones: Milestone[]) => save({ ...project, milestones });

  function add(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    update([...ms, { id: newId(), title: title.trim().slice(0, 120), dueDate: fromInputDate(due), done: false, doneAt: null }]);
    setTitle("");
    setDue("");
  }

  function move(index: number, by: number) {
    const next = [...ms];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    update(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <MilestoneTrack milestones={ms} progress={project.progress} />
      </Card>

      <Card className="flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold">Milestones</h2>
        {ms.length === 0 && (
          <p className="text-sm text-muted">
            Break the project into milestones (e.g. Discovery, Design sign-off, Development, Testing, Launch). Ticking them off updates the
            progress automatically.
          </p>
        )}
        <ol className="flex flex-col divide-y divide-line">
          {ms.map((m, i) => {
            const days = daysUntil(m.dueDate);
            const overdue = !m.done && days !== null && days < 0;
            return (
              <li key={m.id} className="flex flex-wrap items-center gap-3 py-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={m.done}
                  aria-label={`Mark "${m.title}" ${m.done ? "not done" : "done"}`}
                  onClick={() =>
                    update(ms.map((x) => (x.id === m.id ? { ...x, done: !x.done, doneAt: x.done ? null : new Date() } : x)))
                  }
                  className={cn(
                    "inline-flex size-6 shrink-0 items-center justify-center rounded-md border-2",
                    m.done ? "border-[#1baf7a] bg-[#1baf7a] text-white" : "border-line hover:border-ink",
                  )}
                >
                  {m.done && <Check aria-hidden className="size-4" strokeWidth={3} />}
                </button>

                {editingId === m.id ? (
                  <form
                    className="flex flex-1 flex-wrap gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!editTitle.trim()) return;
                      update(ms.map((x) => (x.id === m.id ? { ...x, title: editTitle.trim().slice(0, 120), dueDate: fromInputDate(editDue) } : x)));
                      setEditingId(null);
                    }}
                  >
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} aria-label="Milestone title" className={`${inputStyles} flex-1`} />
                    <input type="date" value={editDue} onChange={(e) => setEditDue(e.target.value)} aria-label="Due date" className={`${inputStyles} w-auto`} />
                    <button type="submit" className={buttonStyles.primary}>
                      Save
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className={buttonStyles.secondary}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className={cn("font-medium", m.done && "text-muted line-through")}>{m.title}</p>
                      <p className={cn("text-xs", overdue ? "font-semibold text-[#b42318]" : "text-muted")}>
                        {m.done
                          ? `Completed ${formatDate(m.doneAt)}`
                          : m.dueDate
                            ? `Due ${formatDate(m.dueDate)}${overdue ? ` · ${-days!}d overdue` : ""}`
                            : "No due date"}
                      </p>
                    </div>
                    <div className="flex gap-0.5">
                      <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up" className="inline-flex size-8 items-center justify-center rounded-full hover:bg-lilac disabled:opacity-30">
                        <ArrowUp aria-hidden className="size-4" />
                      </button>
                      <button type="button" disabled={i === ms.length - 1} onClick={() => move(i, 1)} aria-label="Move down" className="inline-flex size-8 items-center justify-center rounded-full hover:bg-lilac disabled:opacity-30">
                        <ArrowDown aria-hidden className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(m.id);
                          setEditTitle(m.title);
                          setEditDue(toInputDate(m.dueDate));
                        }}
                        aria-label={`Edit ${m.title}`}
                        className="inline-flex size-8 items-center justify-center rounded-full hover:bg-lilac"
                      >
                        <Pencil aria-hidden className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => update(ms.filter((x) => x.id !== m.id))}
                        aria-label={`Remove ${m.title}`}
                        className="inline-flex size-8 items-center justify-center rounded-full text-[#b42318] hover:bg-[#fef3f2]"
                      >
                        <X aria-hidden className="size-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ol>

        <form onSubmit={add} className="flex flex-col gap-2 border-t border-line pt-4 sm:flex-row">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New milestone, e.g. Design sign-off" aria-label="Milestone title" maxLength={120} className={`${inputStyles} flex-1`} />
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} aria-label="Due date" className={`${inputStyles} sm:w-auto`} />
          <button type="submit" disabled={!title.trim() || ms.length >= 60} className={buttonStyles.primary}>
            <Plus aria-hidden className="size-4" /> Add milestone
          </button>
        </form>
      </Card>
    </div>
  );
}

// --- Team ---------------------------------------------------------------------

function Team({ project, save }: { project: Project; save: (p: Project) => Promise<void> }) {
  const people = useDirectory();
  const [uid, setUid] = useState("");
  const [role, setRole] = useState("");
  const byId = useMemo(() => new Map(people.map((p) => [p.uid, p])), [people]);
  const available = people.filter((p) => p.active && !project.memberIds.includes(p.uid));

  function add(event: FormEvent) {
    event.preventDefault();
    if (!uid) return;
    save({ ...project, members: [...project.members, { uid, projectRole: role.trim().slice(0, 60) || "Team member" }] });
    setUid("");
    setRole("");
  }

  return (
    <Card className="flex flex-col gap-4">
      <div>
        <h2 className="font-display text-lg font-semibold">People on this project</h2>
        <p className="text-sm text-muted">Anyone in the team can be assigned, whatever their portal role.</p>
      </div>
      {project.members.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">No one assigned yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {project.members.map((m) => {
            const person = byId.get(m.uid);
            return (
              <li key={m.uid} className="flex items-center gap-3 py-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-glow to-cyan font-display text-sm font-bold text-navy">
                  {(person?.name ?? "?")
                    .split(/\s+/)
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {person?.name ?? "Former user"}
                    {person && <span className="ml-1.5 font-mono text-xs text-muted">@{person.username}</span>}
                  </p>
                  <p className="text-xs text-muted">
                    <span className="font-semibold text-ink/80">{m.projectRole}</span>
                    {person && ` · ${person.tagline} · ${ROLE_LABEL[person.role]}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => save({ ...project, members: project.members.filter((x) => x.uid !== m.uid) })}
                  aria-label={`Remove ${person?.name ?? "member"} from project`}
                  className="inline-flex size-9 items-center justify-center rounded-full text-[#b42318] hover:bg-[#fef3f2]"
                >
                  <UserMinus aria-hidden className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <form onSubmit={add} className="flex flex-col gap-2 border-t border-line pt-4 sm:flex-row">
        <select value={uid} onChange={(e) => setUid(e.target.value)} aria-label="Person" className={`${inputStyles} sm:flex-1`}>
          <option value="">{available.length ? "Choose a person…" : "Everyone is already assigned"}</option>
          {available.map((p) => (
            <option key={p.uid} value={p.uid}>
              {p.name} — {p.tagline}
            </option>
          ))}
        </select>
        <input
          list="project-roles"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role on project, e.g. Developer"
          aria-label="Role on project"
          maxLength={60}
          className={`${inputStyles} sm:flex-1`}
        />
        <datalist id="project-roles">
          {PROJECT_ROLE_SUGGESTIONS.map((r) => (
            <option key={r} value={r} />
          ))}
        </datalist>
        <button type="submit" disabled={!uid} className={buttonStyles.primary}>
          <UserPlus aria-hidden className="size-4" /> Assign
        </button>
      </form>
    </Card>
  );
}

// --- Updates ------------------------------------------------------------------

function Updates({ project }: { project: Project }) {
  const updates = useProjectUpdates(project.id);
  const { user, profile } = usePortal();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function post(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() || !user || !profile) return;
    setBusy(true);
    setError("");
    try {
      await postUpdate(project.id, text, project.progress, user.uid, profile.name);
      setText("");
    } catch {
      setError("Couldn't post the update. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <form onSubmit={post} className="flex flex-col gap-2">
        <label htmlFor="update-text" className="font-display text-lg font-semibold">
          Post a progress update
        </label>
        {error && <Notice>{error}</Notice>}
        <textarea
          id="update-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="What moved forward? Any blockers or client feedback?"
          className={inputStyles}
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted">Saved with the current progress ({project.progress}%).</p>
          <button type="submit" disabled={busy || !text.trim()} className={buttonStyles.primary}>
            {busy && <LoaderCircle aria-hidden className="size-4 animate-spin" />} Post update
          </button>
        </div>
      </form>
      {!updates ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : updates.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">No updates yet.</p>
      ) : (
        <ol className="flex flex-col gap-3 border-t border-line pt-4">
          {updates.map((u) => (
            <li key={u.id} className="rounded-xl bg-lilac p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                <span>
                  <span className="font-semibold text-ink">{u.byName || "Someone"}</span> ·{" "}
                  {u.createdAt ? u.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Just now"}
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 font-semibold text-ink">{u.progress}%</span>
              </div>
              <p className="mt-2 text-sm whitespace-pre-line text-ink/85">{u.text}</p>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}

// --- Finance (admins) ------------------------------------------------------------

function ProjectFinance({ project }: { project: Project }) {
  const { entries, error } = useFinanceEntries({ start: null, projectId: project.id });
  const [adding, setAdding] = useState<FinanceEntry | "new" | null>(null);
  const t = totals(entries ?? []);
  const toCollect = Math.max(0, project.budget - t.income);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Received" value={inr.format(t.income)} hint={project.budget ? `${Math.round((t.income / project.budget) * 100)}% of budget` : undefined} />
        <StatTile label="Still to collect" value={project.budget ? inr.format(toCollect) : "—"} hint={project.budget ? `Budget ${inr.format(project.budget)}` : "No budget set"} />
        <StatTile label="Project expenses" value={inr.format(t.expense)} />
        <StatTile label="Project profit" value={inr.format(t.net)} tone={t.net >= 0 ? "good" : "bad"} />
      </div>
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold">Entries tagged to this project</h2>
          <button type="button" onClick={() => setAdding("new")} className={buttonStyles.primary}>
            <Plus aria-hidden className="size-4" /> Record payment
          </button>
        </div>
        {error && <Notice>{error}</Notice>}
        {!entries ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
            Nothing tagged yet. Pick this project in the “Project” field when adding income or expenses.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-line">
            {entries.map((e) => (
              <li key={e.id}>
                <button type="button" onClick={() => setAdding(e)} className="flex w-full items-center justify-between gap-3 py-3 text-left hover:bg-lilac/50">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{e.description}</span>
                    <span className="text-xs text-muted">
                      {formatDate(e.date)} · {e.category}
                      {e.status === "pending" && " · Pending"}
                    </span>
                  </span>
                  <span className={cn("shrink-0 font-semibold tabular-nums", e.type === "income" ? "text-[#0b7a4b]" : "text-ink")}>
                    {e.type === "income" ? "+" : "−"}
                    {inr.format(e.amount)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
      {adding && (
        <EntryForm
          entry={adding === "new" ? undefined : adding}
          defaults={{ type: "income", projectId: project.id, category: "Client payment" }}
          onClose={() => setAdding(null)}
        />
      )}
    </div>
  );
}
