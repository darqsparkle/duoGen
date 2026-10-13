"use client";

import { LoaderCircle } from "lucide-react";
import { useState, type FormEvent } from "react";
import { PROJECT_STATUS_LABEL, PROJECT_STATUSES, type Project, type ProjectStatus } from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { usePortal } from "../PortalProvider";
import { buttonStyles, Field, inputStyles, Modal, Notice } from "../ui";
import { createProject, fromInputDate, saveProject, toInputDate } from "./data";

export const statusBadge: Record<ProjectStatus, string> = {
  tentative: "bg-[#fff4d6] text-[#8a5a00]",
  confirmed: "bg-lavender text-[#3b4bb8]",
  active: "bg-mint text-[#0b5e3a]",
  "on-hold": "bg-line text-ink/70",
  completed: "bg-ink text-white",
  cancelled: "bg-[#fef3f2] text-[#b42318]",
};

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", statusBadge[status], className)}>
      {PROJECT_STATUS_LABEL[status]}
    </span>
  );
}

/** Create a project, or edit its details. Milestones and team live on the project page. */
export function ProjectForm({
  project,
  onClose,
  onCreated,
}: {
  project?: Project;
  onClose: () => void;
  onCreated?: (id: string) => void;
}) {
  const { user } = usePortal();
  const [values, setValues] = useState({
    name: project?.name ?? "",
    codeName: project?.codeName ?? "",
    client: project?.client ?? "",
    description: project?.description ?? "",
    budget: project ? String(project.budget || "") : "",
    status: project?.status ?? ("tentative" as ProjectStatus),
    estDelivery: toInputDate(project?.estDelivery ?? null),
    nextCallDate: toInputDate(project?.nextCallDate ?? null),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const set = (key: keyof typeof values, value: string) => setValues((v) => ({ ...v, [key]: value }));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = "Enter a project name.";
    const budget = values.budget ? Number(values.budget) : 0;
    if (!Number.isFinite(budget) || budget < 0) next.budget = "Enter a valid amount.";
    setErrors(next);
    if (Object.keys(next).length || !user) return;

    setBusy(true);
    setFailure("");
    const draft = {
      name: values.name,
      codeName: values.codeName,
      client: values.client,
      description: values.description,
      budget: Math.round(budget * 100) / 100,
      status: values.status,
      estDelivery: fromInputDate(values.estDelivery),
      nextCallDate: fromInputDate(values.nextCallDate),
    };
    try {
      if (project) {
        await saveProject({ ...project, ...draft }, user.uid);
        onClose();
      } else {
        const id = await createProject(draft, user.uid);
        onCreated?.(id);
      }
    } catch (error) {
      console.error("[projects] save failed", error);
      setFailure("Couldn't save the project. Check the fields and try again.");
      setBusy(false);
    }
  }

  return (
    <Modal title={project ? "Edit project" : "New project"} onClose={onClose} wide>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {failure && <Notice>{failure}</Notice>}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Project name *" error={errors.name}>
            <input value={values.name} onChange={(e) => set("name", e.target.value)} maxLength={120} className={inputStyles} />
          </Field>
          <Field label="Code name" hint="Internal nickname, e.g. Project Falcon">
            <input value={values.codeName} onChange={(e) => set("codeName", e.target.value)} maxLength={60} className={inputStyles} />
          </Field>
          <Field label="Client">
            <input value={values.client} onChange={(e) => set("client", e.target.value)} maxLength={120} className={inputStyles} />
          </Field>
          <Field label="Budget (₹)" error={errors.budget}>
            <input
              inputMode="decimal"
              value={values.budget}
              onChange={(e) => set("budget", e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="0"
              className={inputStyles}
            />
          </Field>
          <Field label="Status">
            <select value={values.status} onChange={(e) => set("status", e.target.value)} className={inputStyles}>
              {PROJECT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {PROJECT_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Estimated delivery">
            <input type="date" value={values.estDelivery} onChange={(e) => set("estDelivery", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Next call date" hint="When to follow up with the client.">
            <input type="date" value={values.nextCallDate} onChange={(e) => set("nextCallDate", e.target.value)} className={inputStyles} />
          </Field>
          <Field label="Description / scope" className="sm:col-span-2">
            <textarea
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={2000}
              rows={4}
              className={inputStyles}
            />
          </Field>
        </div>
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <button type="button" onClick={onClose} className={buttonStyles.secondary}>
            Cancel
          </button>
          <button type="submit" disabled={busy} className={buttonStyles.primary}>
            {busy && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
            {project ? "Save changes" : "Create project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
