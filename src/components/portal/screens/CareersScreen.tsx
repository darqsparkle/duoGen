"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { ExternalLink, LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { firebaseApp } from "@/lib/firebase/client";
import {
  validateCareer,
  WORK_TYPE_LABEL,
  WORK_TYPES,
  type Career,
  type CareerInput,
  type WorkType,
} from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { usePortal } from "../PortalProvider";
import { RoleGate } from "../PortalShell";
import { buttonStyles, Card, Field, inputStyles, Modal, NoAccess, Notice, PageHeader } from "../ui";

const db = () => getFirestore(firebaseApp());

/** Live list of job openings, most recently updated first. */
function useCareers() {
  const [careers, setCareers] = useState<Career[] | null>(null);
  const [error, setError] = useState("");
  useEffect(
    () =>
      onSnapshot(
        query(collection(db(), "careers"), orderBy("updatedAt", "desc")),
        (snap) => {
          setError("");
          setCareers(
            snap.docs.map((d) => {
              const data = d.data();
              return {
                id: d.id,
                title: String(data.title ?? ""),
                description: String(data.description ?? ""),
                pay: String(data.pay ?? ""),
                workType: (data.workType as WorkType) ?? "on-site",
                location: String(data.location ?? ""),
                updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
              };
            }),
          );
        },
        (err) => {
          console.error("[careers]", err);
          setError("Couldn't load openings.");
          setCareers([]);
        },
      ),
    [],
  );
  return { careers, error };
}

export function CareersScreen() {
  const { careers, error } = useCareers();
  const [editing, setEditing] = useState<Career | "new" | null>(null);

  return (
    <RoleGate roles={["admin"]} fallback={<NoAccess />}>
      <PageHeader
        title="Careers"
        description="Job openings on the public careers page. The page and its menu link only appear while at least one opening is listed."
        actions={
          <>
            {careers && careers.length > 0 && (
              <a href="/careers" target="_blank" rel="noreferrer" className={buttonStyles.secondary}>
                <ExternalLink aria-hidden className="size-4" /> View page
              </a>
            )}
            <button type="button" onClick={() => setEditing("new")} className={buttonStyles.primary}>
              <Plus aria-hidden className="size-4" /> Add opening
            </button>
          </>
        }
      />

      {error && <Notice>{error}</Notice>}
      {!careers ? (
        <p className="flex items-center gap-2 text-sm text-muted">
          <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading openings…
        </p>
      ) : careers.length === 0 ? (
        <Card className="text-center">
          <p className="text-sm text-muted">No openings yet, so the careers page is hidden from the site.</p>
        </Card>
      ) : (
        <ul className="grid gap-3">
          {careers.map((job) => (
            <li key={job.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold">{job.title}</h2>
                  <p className="mt-1 text-sm text-muted">
                    {[WORK_TYPE_LABEL[job.workType], job.location, job.pay].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/75">{job.description}</p>
                </div>
                <button type="button" onClick={() => setEditing(job)} className={cn(buttonStyles.secondary, "shrink-0 self-start")}>
                  <Pencil aria-hidden className="size-4" /> Edit
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {editing && <CareerForm career={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
    </RoleGate>
  );
}

function CareerForm({ career, onClose }: { career?: Career; onClose: () => void }) {
  const { user } = usePortal();
  const [draft, setDraft] = useState<CareerInput>(
    career ?? { title: "", description: "", pay: "", workType: "hybrid", location: "" },
  );
  const [errors, setErrors] = useState<Partial<Record<keyof CareerInput, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof CareerInput>(key: K, value: CareerInput[K]) => setDraft((d) => ({ ...d, [key]: value }));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const next = validateCareer(draft);
    setErrors(next);
    if (!user || Object.keys(next).length) return;
    setBusy(true);
    setFailure("");
    const fields = {
      title: draft.title.trim(),
      description: draft.description.trim(),
      pay: draft.pay.trim(),
      workType: draft.workType,
      location: draft.location.trim(),
      updatedBy: user.uid,
      updatedAt: serverTimestamp(),
    };
    try {
      if (career) await updateDoc(doc(db(), "careers", career.id), fields);
      else await addDoc(collection(db(), "careers"), { ...fields, createdBy: user.uid, createdAt: serverTimestamp() });
      onClose();
    } catch (error) {
      console.error("[careers] save failed", error);
      setFailure("Couldn't save this opening. Check the fields and try again.");
      setBusy(false);
    }
  }

  async function remove() {
    if (!career) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db(), "careers", career.id));
      onClose();
    } catch (error) {
      console.error("[careers] delete failed", error);
      setFailure("Couldn't delete this opening.");
      setBusy(false);
      setConfirmDelete(false);
    }
  }

  return (
    <Modal title={career ? "Edit opening" : "Add opening"} onClose={onClose} wide>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {failure && <Notice>{failure}</Notice>}

        <Field label="Role *" error={errors.title}>
          <input value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Frontend Developer" maxLength={120} className={inputStyles} />
        </Field>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-medium text-ink">Work type *</legend>
          <div role="radiogroup" aria-label="Work type" className="grid grid-cols-3 gap-2">
            {WORK_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={draft.workType === t}
                onClick={() => set("workType", t)}
                className={cn(
                  "min-h-11 rounded-xl border text-sm font-semibold",
                  draft.workType === t ? "border-ink bg-ink text-white" : "border-line hover:border-ink/30",
                )}
              >
                {WORK_TYPE_LABEL[t]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Pay" hint="Shown as written, e.g. ₹6–10 LPA." error={errors.pay}>
            <input value={draft.pay} onChange={(e) => set("pay", e.target.value)} maxLength={120} className={inputStyles} />
          </Field>
          <Field label="Location" hint="Optional, e.g. Chennai." error={errors.location}>
            <input value={draft.location} onChange={(e) => set("location", e.target.value)} maxLength={120} className={inputStyles} />
          </Field>
        </div>

        <Field label="Job description *" error={errors.description} hint="Line breaks are kept on the careers page.">
          <textarea
            rows={10}
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            maxLength={5000}
            className={cn(inputStyles, "resize-y")}
          />
        </Field>

        <div className="flex flex-col-reverse gap-2 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {career &&
              (confirmDelete ? (
                <button type="button" onClick={remove} disabled={busy} className={buttonStyles.danger}>
                  Confirm delete
                </button>
              ) : (
                <button type="button" onClick={() => setConfirmDelete(true)} className={buttonStyles.danger}>
                  <Trash2 aria-hidden className="size-4" /> Delete opening
                </button>
              ))}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className={buttonStyles.secondary}>
              Cancel
            </button>
            <button type="submit" disabled={busy} className={buttonStyles.primary}>
              {busy && <LoaderCircle aria-hidden className="size-4 animate-spin" />}
              {career ? "Save changes" : "Publish opening"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
