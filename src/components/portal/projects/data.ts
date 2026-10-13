"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { firebaseApp } from "@/lib/firebase/client";
import {
  milestoneProgress,
  type DirectoryEntry,
  type Milestone,
  type Project,
  type ProjectMember,
  type ProjectStatus,
} from "@/lib/portal/model";

const db = () => getFirestore(firebaseApp());
const toDate = (v: unknown) => (v instanceof Timestamp ? v.toDate() : null);
const toStamp = (d: Date | null) => (d ? Timestamp.fromDate(d) : null);

function toProject(id: string, data: Record<string, unknown>): Project {
  const milestones = Array.isArray(data.milestones)
    ? (data.milestones as Record<string, unknown>[]).map((m) => ({
        id: String(m.id),
        title: String(m.title ?? ""),
        dueDate: toDate(m.dueDate),
        done: Boolean(m.done),
        doneAt: toDate(m.doneAt),
      }))
    : [];
  return {
    id,
    name: String(data.name ?? ""),
    codeName: String(data.codeName ?? ""),
    client: String(data.client ?? ""),
    description: String(data.description ?? ""),
    budget: Number(data.budget) || 0,
    status: (data.status as ProjectStatus) ?? "tentative",
    estDelivery: toDate(data.estDelivery),
    nextCallDate: toDate(data.nextCallDate),
    progress: Number(data.progress) || 0,
    milestones,
    members: Array.isArray(data.members) ? (data.members as ProjectMember[]) : [],
    memberIds: Array.isArray(data.memberIds) ? (data.memberIds as string[]) : [],
    updatedAt: toDate(data.updatedAt),
  };
}

/** Live list of projects, most recently updated first. */
export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState("");
  useEffect(
    () =>
      onSnapshot(
        query(collection(db(), "projects"), orderBy("updatedAt", "desc"), limit(500)),
        (snap) => {
          setError("");
          setProjects(snap.docs.map((d) => toProject(d.id, d.data())));
        },
        (err) => {
          console.error("[projects]", err);
          setError(err.code === "permission-denied" ? "You don't have access to projects." : "Couldn't load projects.");
          setProjects([]);
        },
      ),
    [],
  );
  return { projects, error };
}

/** One project, live. `null` = not found. */
export function useProject(id: string) {
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  useEffect(
    () =>
      onSnapshot(
        doc(db(), "projects", id),
        (snap) => setProject(snap.exists() ? toProject(snap.id, snap.data()) : null),
        () => setProject(null),
      ),
    [id],
  );
  return project;
}

/** Staff directory (name, username, designation, role) for assigning people. */
export function useDirectory() {
  const [people, setPeople] = useState<DirectoryEntry[]>([]);
  useEffect(
    () =>
      onSnapshot(
        query(collection(db(), "directory"), orderBy("name")),
        (snap) => setPeople(snap.docs.map((d) => d.data() as DirectoryEntry)),
        () => setPeople([]),
      ),
    [],
  );
  return people;
}

export type ProjectUpdate = { id: string; text: string; progress: number; byName: string; createdAt: Date | null };

export function useProjectUpdates(projectId: string) {
  const [updates, setUpdates] = useState<ProjectUpdate[] | null>(null);
  useEffect(
    () =>
      onSnapshot(
        query(collection(db(), "projects", projectId, "updates"), orderBy("createdAt", "desc"), limit(200)),
        (snap) =>
          setUpdates(
            snap.docs.map((d) => {
              const u = d.data();
              return { id: d.id, text: u.text, progress: u.progress, byName: u.byName, createdAt: toDate(u.createdAt) };
            }),
          ),
        () => setUpdates([]),
      ),
    [projectId],
  );
  return updates;
}

export type ProjectDraft = {
  name: string;
  codeName: string;
  client: string;
  description: string;
  budget: number;
  status: ProjectStatus;
  estDelivery: Date | null;
  nextCallDate: Date | null;
};

/** Full document as the security rules expect it (every field, always). */
function serialize(p: ProjectDraft & { milestones: Milestone[]; members: ProjectMember[] }, uid: string) {
  return {
    name: p.name.trim(),
    codeName: p.codeName.trim(),
    client: p.client.trim(),
    description: p.description.trim(),
    budget: p.budget,
    status: p.status,
    estDelivery: toStamp(p.estDelivery),
    nextCallDate: toStamp(p.nextCallDate),
    progress: milestoneProgress(p.milestones),
    milestones: p.milestones.map((m) => ({
      id: m.id,
      title: m.title,
      dueDate: toStamp(m.dueDate),
      done: m.done,
      doneAt: toStamp(m.doneAt),
    })),
    members: p.members,
    memberIds: p.members.map((m) => m.uid),
    updatedBy: uid,
    updatedAt: serverTimestamp(),
  };
}

export async function createProject(draft: ProjectDraft, uid: string) {
  const ref = await addDoc(collection(db(), "projects"), {
    ...serialize({ ...draft, milestones: [], members: [] }, uid),
    createdBy: uid,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

/** Saves a changed project (details, milestones or team), recomputing progress. */
export async function saveProject(project: Project, uid: string) {
  await updateDoc(doc(db(), "projects", project.id), serialize(project, uid));
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db(), "projects", id));
}

export async function postUpdate(projectId: string, text: string, progress: number, uid: string, byName: string) {
  await addDoc(collection(db(), "projects", projectId, "updates"), {
    text: text.trim(),
    progress,
    by: uid,
    byName,
    createdAt: serverTimestamp(),
  });
}

export const newId = () => Math.random().toString(36).slice(2, 10);

export const toInputDate = (d: Date | null) =>
  d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "";

export const fromInputDate = (v: string) => {
  if (!v) return null;
  const [y, m, d] = v.split("-").map(Number);
  return new Date(y, m - 1, d, 12);
};

export const formatDate = (d: Date | null) =>
  d ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/** Whole days from today to `d` (negative = in the past). */
export function daysUntil(d: Date | null) {
  if (!d) return null;
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86_400_000);
}
