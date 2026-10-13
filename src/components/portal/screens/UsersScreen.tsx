"use client";

import { collection, getFirestore, onSnapshot, orderBy, query, where, type QueryConstraint } from "firebase/firestore";
import { LoaderCircle, Pencil, Search, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { firebaseApp } from "@/lib/firebase/client";
import { ROLE_LABEL, ROLES, type Role, type UserProfile } from "@/lib/portal/model";
import { cn } from "@/lib/cn";
import { usePortal } from "../PortalProvider";
import { RoleGate } from "../PortalShell";
import { buttonStyles, Card, inputStyles, NoAccess, Notice, PageHeader, StatTile } from "../ui";
import { UserForm } from "./UserForm";

const roleBadge: Record<Role, string> = {
  admin: "bg-ink text-white",
  manager: "bg-lavender text-[#3b4bb8]",
  employee: "bg-mint text-[#0b5e3a]",
};

/** Live users, optionally filtered by role (uses the (role, createdAt) index). */
function useUsers(role: Role | "all") {
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const constraints: QueryConstraint[] = [];
    if (role !== "all") constraints.push(where("role", "==", role));
    constraints.push(orderBy("createdAt", "desc"));
    return onSnapshot(
      query(collection(getFirestore(firebaseApp()), "users"), ...constraints),
      (snap) => {
        setError("");
        setUsers(snap.docs.map((d) => d.data() as UserProfile));
      },
      (err) => {
        console.error("[users]", err);
        setError(err.code === "failed-precondition" ? "A database index is still building. Try again in a few minutes." : "Couldn't load users.");
        setUsers([]);
      },
    );
  }, [role]);
  return { users, error };
}

export function UsersScreen() {
  const [role, setRole] = useState<Role | "all">("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<UserProfile | "new" | null>(null);
  const { users: everyone } = useUsers("all");
  const { users, error } = useUsers(role);
  const { profile: me } = usePortal();

  const stats = useMemo(() => {
    const all = everyone ?? [];
    const byRole = Object.fromEntries(ROLES.map((r) => [r, all.filter((u) => u.role === r).length])) as Record<Role, number>;
    const tags = new Map<string, number>();
    for (const u of all) tags.set(u.tagline, (tags.get(u.tagline) ?? 0) + 1);
    return { total: all.length, active: all.filter((u) => u.active).length, byRole, tags: [...tags.entries()].sort((a, b) => b[1] - a[1]) };
  }, [everyone]);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (users ?? []).filter(
      (u) => !term || [u.name, u.username, u.email, u.tagline].join(" ").toLowerCase().includes(term),
    );
  }, [users, search]);

  return (
    <RoleGate roles={["admin"]} fallback={<NoAccess />}>
      <PageHeader
        title="Users"
        description="Team members, roles and designations. Only admins can view and edit."
        actions={
          <button type="button" onClick={() => setEditing("new")} className={buttonStyles.primary}>
            <UserPlus aria-hidden className="size-4" /> Add user
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile label="Total users" value={stats.total} hint={`${stats.active} active`} />
        {ROLES.map((r) => (
          <StatTile key={r} label={`${ROLE_LABEL[r]}s`} value={stats.byRole[r]} />
        ))}
        <StatTile label="Inactive" value={stats.total - stats.active} />
      </div>

      {stats.tags.length > 0 && (
        <Card>
          <h2 className="mb-3 font-display text-lg font-semibold">Designations</h2>
          <ul className="flex flex-wrap gap-2">
            {stats.tags.map(([tag, count]) => (
              <li key={tag} className="rounded-full bg-lilac px-3 py-1 text-sm">
                {tag} <span className="text-muted">· {count}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="flex flex-col gap-4">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <label className="relative">
            <span className="sr-only">Search users</span>
            <Search aria-hidden className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, username, email, designation…"
              className={`${inputStyles} pl-9`}
            />
          </label>
          <select aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as Role | "all")} className={inputStyles}>
            <option value="all">All roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}s
              </option>
            ))}
          </select>
        </div>

        {error && <Notice>{error}</Notice>}
        {!users ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <LoaderCircle aria-hidden className="size-4 animate-spin" /> Loading users…
          </p>
        ) : rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line p-8 text-center text-sm text-muted">No users match.</p>
        ) : (
          <div className="-mx-5 overflow-x-auto sm:-mx-6">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted">
                  <th className="px-5 py-2 font-medium sm:px-6">Name</th>
                  <th className="py-2 font-medium">Username</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Designation</th>
                  <th className="py-2 font-medium">Role</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="px-5 py-2 sm:px-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.uid} className="border-b border-line/60">
                    <td className="px-5 py-3 sm:px-6">
                      <p className="font-medium">
                        {u.name}
                        {u.uid === me?.uid && <span className="ml-1.5 text-xs font-normal text-muted">(you)</span>}
                      </p>
                      <p className="text-xs text-muted">{u.sex}</p>
                    </td>
                    <td className="py-3 pr-3 font-mono text-xs">@{u.username}</td>
                    <td className="py-3 pr-3 break-all text-ink/80">{u.email}</td>
                    <td className="py-3 pr-3">{u.tagline}</td>
                    <td className="py-3 pr-3">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", roleBadge[u.role])}>{ROLE_LABEL[u.role]}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className={cn("text-xs font-medium", u.active ? "text-[#0b7a4b]" : "text-muted")}>
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-2 text-right sm:px-6">
                      <button
                        type="button"
                        onClick={() => setEditing(u)}
                        aria-label={`Edit ${u.name}`}
                        className="inline-flex size-8 items-center justify-center rounded-full hover:bg-lilac"
                      >
                        <Pencil aria-hidden className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing && <UserForm user={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
    </RoleGate>
  );
}
